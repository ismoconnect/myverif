import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { generateReferenceNumber } from '../utils/referenceGenerator'

// Service pour gérer les soumissions de coupons
export class FirestoreService {
  
  // Enregistrer une nouvelle soumission de coupon
  static async submitCouponSubmission(formData) {
    try {
      // Générer un numéro de référence unique
      const referenceNumber = generateReferenceNumber()
      
      const submissionData = {
        // Informations de base
        type: formData.type,
        status: 'pending', // pending, processing, completed, rejected
        referenceNumber: referenceNumber,
        
        // Informations personnelles
        civility: formData.civility,
        lastName: formData.lastName,
        firstName: formData.firstName,
        fullName: `${formData.civility} ${formData.firstName} ${formData.lastName}`,
        
        // Informations de contact
        email: formData.email,
        phone: formData.phone || null,
        country: formData.country,
        
        // Configuration
        numCoupons: formData.numCoupons,
        hideCodes: formData.hideCodes || false,
        
        // Codes des coupons
        coupons: formData.coupons.map((coupon, index) => ({
          id: index + 1,
          code: coupon.code,
          amount: coupon.amount || null,
          status: 'pending'
        })),
        
        // Métadonnées
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        ipAddress: null, // Peut être ajouté côté serveur si nécessaire
        
        // Statistiques
        totalAmount: formData.coupons.reduce((sum, coupon) => {
          const amount = parseFloat(coupon.amount) || 0
          return sum + amount
        }, 0),
        
        // Suivi
        processingStartedAt: null,
        processingCompletedAt: null,
        emailSent: false,
        emailSentAt: null,
        
        // Notes internes
        internalNotes: '',
        adminNotes: ''
      }
      
      // Utiliser setDoc avec le numéro de référence comme ID
      const docRef = doc(db, 'coupon_submissions', referenceNumber)
      await setDoc(docRef, submissionData)
      
      console.log('Soumission enregistrée avec succès')
      
      return {
        success: true,
        id: referenceNumber,
        referenceNumber: referenceNumber,
        data: submissionData
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement')
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Mettre à jour le statut d'une soumission
  static async updateSubmissionStatus(submissionId, status, notes = '') {
    try {
      const submissionRef = doc(db, 'coupon_submissions', submissionId)
      
      const updateData = {
        status,
        updatedAt: serverTimestamp(),
        adminNotes: notes
      }
      
      // Ajouter des timestamps selon le statut
      if (status === 'processing') {
        updateData.processingStartedAt = serverTimestamp()
      } else if (status === 'completed' || status === 'rejected') {
        updateData.processingCompletedAt = serverTimestamp()
      }
      
      await updateDoc(submissionRef, updateData)
      
      return {
        success: true,
        message: 'Statut mis à jour avec succès'
      }
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Marquer l'email comme envoyé
  static async markEmailSent(submissionId) {
    try {
      const submissionRef = doc(db, 'coupon_submissions', submissionId)
      
      await updateDoc(submissionRef, {
        emailSent: true,
        emailSentAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      return {
        success: true,
        message: 'Email marqué comme envoyé'
      }
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour email:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Récupérer toutes les soumissions (pour l'admin)
  static async getAllSubmissions(limitCount = 50) {
    try {
      const q = query(
        collection(db, 'coupon_submissions'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      const submissions = []
      
      querySnapshot.forEach((doc) => {
        submissions.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      return {
        success: true,
        data: submissions
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Récupérer les soumissions par statut
  static async getSubmissionsByStatus(status) {
    try {
      const q = query(
        collection(db, 'coupon_submissions'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const submissions = []
      
      querySnapshot.forEach((doc) => {
        submissions.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      return {
        success: true,
        data: submissions
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération par statut:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Récupérer les soumissions par type de coupon
  static async getSubmissionsByType(type) {
    try {
      const q = query(
        collection(db, 'coupon_submissions'),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const submissions = []
      
      querySnapshot.forEach((doc) => {
        submissions.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      return {
        success: true,
        data: submissions
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération par type:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Statistiques générales
  static async getStatistics() {
    try {
      const allSubmissions = await this.getAllSubmissions(1000)
      
      if (!allSubmissions.success) {
        return allSubmissions
      }
      
      const stats = {
        total: allSubmissions.data.length,
        pending: 0,
        processing: 0,
        completed: 0,
        rejected: 0,
        totalAmount: 0,
        byType: {}
      }
      
      allSubmissions.data.forEach(submission => {
        // Compter par statut
        stats[submission.status] = (stats[submission.status] || 0) + 1
        
        // Compter par type
        stats.byType[submission.type] = (stats.byType[submission.type] || 0) + 1
        
        // Somme totale
        stats.totalAmount += submission.totalAmount || 0
      })
      
      return {
        success: true,
        data: stats
      }
      
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default FirestoreService
