import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { db } from '../lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { euCountries } from '../constants/euCountries'

export default function CouponForm({ type }) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      type,
      civility: 'Monsieur',
      lastName: '',
      firstName: '',
      email: '',
      phone: '',
      country: 'France',
      hideCodes: false,
      coupons: [{ code: '', amount: '' }],
      numCoupons: 1,
    }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'coupons' })
  const numCoupons = watch('numCoupons')
  const hideCodes = watch('hideCodes')

  // Ensure number of coupon boxes matches numCoupons
  useEffect(() => {
    const target = Math.max(1, Number(numCoupons) || 1)
    if (fields.length < target) {
      for (let i = fields.length; i < target; i++) append({ code: '', amount: '' })
    } else if (fields.length > target) {
      for (let i = fields.length - 1; i >= target; i--) remove(i)
    }
  }, [numCoupons, fields.length, append, remove])

  const onSubmit = async (values) => {
    try {
      const payload = { ...values, createdAt: serverTimestamp(), userAgent: navigator.userAgent }
      await addDoc(collection(db, 'coupon_submissions'), payload)
      toast.success('Coupon enregistré')
      reset({
        type,
        civility: 'Monsieur',
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        country: 'France',
        hideCodes: false,
        coupons: [{ code: '', amount: '' }],
        numCoupons: 1,
      })
    } catch (err) {
      toast.error(err?.message || 'Erreur enregistrement')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <input type="hidden" value={type} {...register('type')} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-700">Civilité</label>
          <select className="w-full rounded border px-3 py-2 text-center" {...register('civility')}>
            <option>Monsieur</option>
            <option>Madame</option>
            <option>Mademoiselle</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-700">Nom</label>
          <input className="w-full rounded border px-3 py-2 text-center" {...register('lastName', { required: true, maxLength: 80 })} />
          {errors.lastName && <p className="text-sm text-red-600 mt-1">Nom requis</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-700">Prénoms</label>
          <input className="w-full rounded border px-3 py-2 text-center" {...register('firstName', { required: true, maxLength: 80 })} />
          {errors.firstName && <p className="text-sm text-red-600 mt-1">Prénoms requis</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1 text-blue-700">Email</label>
          <input className="w-full rounded border px-3 py-2 text-center" type="email" {...register('email', { required: true, maxLength: 128 })} />
          {errors.email && <p className="text-sm text-red-600 mt-1">Email requis</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-700">Téléphone</label>
          <input className="w-full rounded border px-3 py-2 text-center" type="tel" {...register('phone', { maxLength: 32 })} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-700">Pays (UE)</label>
          <select className="w-full rounded border px-3 py-2 text-center" {...register('country', { required: true })}>
            {euCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-700">Nombre de coupons</label>
          <input className="w-full rounded border px-3 py-2 text-center" type="number" min={1} max={20} {...register('numCoupons', { valueAsNumber: true, min: 1, max: 20 })} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input id="hideCodes" type="checkbox" className="h-4 w-4" {...register('hideCodes')} />
        <label htmlFor="hideCodes" className="text-sm">Cacher mes codes</label>
      </div>

      <div className="grid gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 border rounded-md p-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1 text-blue-700">Code coupon {index+1}</label>
              <input className="w-full rounded border px-3 py-2 text-center" type={hideCodes ? 'password' : 'text'} autoComplete="off" placeholder="Entrez le code" {...register(`coupons.${index}.code`, { required: true, minLength: 4 })} />
              {errors.coupons?.[index]?.code && <p className="text-sm text-red-600 mt-1">Code requis</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-700">Montant</label>
              <input className="w-full rounded border px-3 py-2 text-center" placeholder="Ex: 50" {...register(`coupons.${index}.amount`, { pattern: /^\d+(?:[\.,]\d+)?$/ })} />
              {errors.coupons?.[index]?.amount && <p className="text-sm text-red-600 mt-1">Montant invalide</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Envoi...' : 'Attester mon coupon'}
        </button>
        <button type="button" onClick={() => reset({
          type,
          civility: 'Monsieur', lastName: '', firstName: '', email: '', phone: '', country: 'France', hideCodes: false,
          coupons: [{ code: '', amount: '' }], numCoupons: 1,
        })} className="btn-secondary">Effacer</button>
      </div>
    </form>
  )
}


