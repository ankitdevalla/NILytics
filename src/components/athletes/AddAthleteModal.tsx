'use client'

import React, { useState, useEffect } from 'react'
import { Athlete, Sport, createAthlete, fetchSports } from '@/lib/supabase'

interface AddAthleteModalProps {
  isOpen: boolean
  onClose: () => void
  onAthleteAdded: (athlete: Athlete) => void
}

export default function AddAthleteModal({ isOpen, onClose, onAthleteAdded }: AddAthleteModalProps) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('Male')
  const [year, setYear] = useState('Freshman')
  const [sportId, setSportId] = useState<string>('')
  const [sports, setSports] = useState<Sport[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSports = async () => {
      try {
        const fetchedSports = await fetchSports()
        console.log('Fetched sports:', fetchedSports);
        setSports(fetchedSports)
        if (fetchedSports.length > 0) {
          setSportId(fetchedSports[0]?.id || '')
          console.log('Setting initial sportId:', fetchedSports[0]?.id);
        }
      } catch (error) {
        console.error('Failed to load sports:', error)
        setError('Failed to load sports. Please try again.')
      }
    }

    if (isOpen) {
      loadSports()
    }
  }, [isOpen])

  const resetForm = () => {
    setName('')
    setGender('Male')
    setYear('Freshman')
    setSportId(sports.length > 0 ? (sports[0]?.id || '') : '')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Athlete name is required')
      return
    }

    if (!sportId) {
      setError('Please select a sport')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const newAthlete = await createAthlete({
        name,
        gender,
        year,
        sport_id: sportId
      })
      
      onAthleteAdded(newAthlete)
      handleClose()
    } catch (error) {
      console.error('Error adding athlete:', error)
      setError('Failed to add athlete. Please try again.')
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
                  Add New Athlete
                </h3>
                <div className="mt-4">
                  {error && (
                    <div className="mb-4 text-sm text-red-800 bg-red-100 px-3 py-2 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Athlete Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                        placeholder="Enter athlete name"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Year
                      </label>
                      <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                      >
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-1">
                        Sport *
                      </label>
                      <select
                        id="sport"
                        value={sportId}
                        onChange={(e) => setSportId(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                        required
                      >
                        {sports.length === 0 && (
                          <option value="">Loading sports...</option>
                        )}
                        {sports.map((sport) => (
                          <option key={sport.id} value={sport.id}>
                            {sport.name}
                          </option>
                        ))}
                      </select>
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
              {isSubmitting ? 'Adding...' : 'Add Athlete'}
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