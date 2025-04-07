'use client'

import React, { useState, useEffect } from 'react'
import { Athlete, Payment, createPayment, fetchAthletesWithSport } from '@/lib/supabase'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentAdded: (payment: Payment) => void
}

export default function AddPaymentModal({ isOpen, onClose, onPaymentAdded }: AddPaymentModalProps) {
  const [athleteId, setAthleteId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Today's date
  const [source, setSource] = useState('')
  const [activityType, setActivityType] = useState('')
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Common activity types for auto-complete suggestions
  const activityTypes = [
    'Autograph Signing',
    'Social Media Promotion',
    'Personal Appearance',
    'Commercial Endorsement',
    'Merchandise Sales',
    'Speaking Engagement',
    'Camp/Clinic',
    'Other'
  ]

  // Common payment sources
  const paymentSources = [
    'Corporate Sponsor',
    'Local Business',
    'Booster',
    'Collective',
    'Individual',
    'Foundation',
    'Other'
  ]

  useEffect(() => {
    const loadAthletes = async () => {
      try {
        const fetchedAthletes = await fetchAthletesWithSport()
        console.log('Fetched athletes:', fetchedAthletes);
        setAthletes(fetchedAthletes)
        if (fetchedAthletes.length > 0) {
          setAthleteId(fetchedAthletes[0].id?.toString() || '')
          console.log('Setting initial athleteId:', fetchedAthletes[0].id);
        }
      } catch (error) {
        console.error('Failed to load athletes:', error)
        setError('Failed to load athletes. Please try again.')
      }
    }

    if (isOpen) {
      loadAthletes()
      // Reset date to today's date when opening the modal
      setDate(new Date().toISOString().split('T')[0])
    }
  }, [isOpen])

  const resetForm = () => {
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
    setSource('')
    setActivityType('')
    setAthleteId(athletes.length > 0 ? athletes[0].id?.toString() || '' : '')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!athleteId) {
      setError('Please select an athlete')
      return
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!date) {
      setError('Please select a date')
      return
    }

    if (!source.trim()) {
      setError('Please enter a payment source')
      return
    }

    if (!activityType.trim()) {
      setError('Please enter an activity type')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const newPayment = await createPayment({
        athlete_id: athleteId,
        amount: Number(amount),
        date,
        source,
        activity_type: activityType
      })
      
      onPaymentAdded(newPayment)
      handleClose()
    } catch (error) {
      console.error('Error adding payment:', error)
      setError('Failed to add payment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add New Payment
                </h3>
                <div className="mt-4">
                  {error && (
                    <div className="mb-4 text-sm text-red-800 bg-red-100 px-3 py-2 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="athlete" className="block text-sm font-medium text-gray-700 mb-1">
                        Athlete *
                      </label>
                      <select
                        id="athlete"
                        value={athleteId}
                        onChange={(e) => setAthleteId(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                        required
                      >
                        {athletes.length === 0 && (
                          <option value="">Loading athletes...</option>
                        )}
                        {athletes.map((athlete) => (
                          <option key={athlete.id} value={athlete.id?.toString() || ''}>
                            {athlete.name} - {athlete.sport?.name || 'Unknown Sport'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($) *
                      </label>
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Source *
                      </label>
                      <input
                        type="text"
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                        placeholder="Enter payment source"
                        list="payment-sources"
                        required
                      />
                      <datalist id="payment-sources">
                        {paymentSources.map((src) => (
                          <option key={src} value={src} />
                        ))}
                      </datalist>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-1">
                        Activity Type *
                      </label>
                      <input
                        type="text"
                        id="activityType"
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                        placeholder="Enter activity type"
                        list="activity-types"
                        required
                      />
                      <datalist id="activity-types">
                        {activityTypes.map((type) => (
                          <option key={type} value={type} />
                        ))}
                      </datalist>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ncaa-blue text-base font-medium text-white hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Payment'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 