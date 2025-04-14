'use client'

import React, { useState, useEffect } from 'react'
import { Sport, fetchSports, createSport, updateSport, deleteSport } from '@/lib/supabase'

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null)
  const [newSportName, setNewSportName] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formError, setFormError] = useState<string>('')

  useEffect(() => {
    loadSports()
  }, [])

  const loadSports = async () => {
    try {
      setLoading(true)
      const data = await fetchSports()
      setSports(data)
    } catch (err) {
      setError('Failed to load sports data. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSportName.trim()) {
      setFormError('Sport name is required')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const newSport = await createSport(newSportName)
      setSports([...sports, newSport])
      setNewSportName('')
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding sport:', error)
      setFormError('Failed to add sport. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSportName.trim() || !selectedSport) {
      setFormError('Sport name is required')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const updatedSport = await updateSport(selectedSport.id, newSportName)
      setSports(sports.map(sport => sport.id === updatedSport.id ? updatedSport : sport))
      setNewSportName('')
      setIsEditModalOpen(false)
      setSelectedSport(null)
    } catch (error) {
      console.error('Error updating sport:', error)
      setFormError('Failed to update sport. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSport = async (sportId: string) => {
    if (!confirm('Are you sure you want to delete this sport? This will also delete all athletes associated with this sport and their payment records.')) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Initiating sport deletion process for ID:', sportId)
      
      // Call the deleteSport function
      await deleteSport(sportId)
      
      // Update the local state to remove the deleted sport
      setSports(sports.filter(sport => sport.id !== sportId))
      alert('Sport and associated data successfully deleted.')
    } catch (error) {
      console.error('Error deleting sport:', error)
      setError('Failed to delete sport and associated data. Please try again.')
      alert('Failed to delete sport. Please check the console for more details.')
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (sport: Sport) => {
    setSelectedSport(sport)
    setNewSportName(sport.name)
    setIsEditModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Sports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, or remove sports offered at your institution
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => {
              setNewSportName('')
              setFormError('')
              setIsAddModalOpen(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Sport
          </button>
        </div>
      </div>

      {/* Sports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sport Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sports.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No sports found. Add your first sport to get started.
                  </td>
                </tr>
              ) : (
                sports.map((sport) => (
                  <tr key={sport.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sport.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sport.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(sport)}
                        className="text-ncaa-blue hover:text-ncaa-darkblue mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSport(sport.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sport Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsAddModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add New Sport
                    </h3>
                    <div className="mt-4">
                      {formError && (
                        <div className="mb-4 text-sm text-red-800 bg-red-100 px-3 py-2 rounded-md">
                          {formError}
                        </div>
                      )}
                      
                      <form onSubmit={handleAddSport}>
                        <div className="mb-4">
                          <label htmlFor="sportName" className="block text-sm font-medium text-gray-700 mb-1">
                            Sport Name *
                          </label>
                          <input
                            type="text"
                            id="sportName"
                            value={newSportName}
                            onChange={(e) => setNewSportName(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                            placeholder="Enter sport name"
                            required
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddSport}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ncaa-blue text-base font-medium text-white hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Sport'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sport Modal */}
      {isEditModalOpen && selectedSport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsEditModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Edit Sport
                    </h3>
                    <div className="mt-4">
                      {formError && (
                        <div className="mb-4 text-sm text-red-800 bg-red-100 px-3 py-2 rounded-md">
                          {formError}
                        </div>
                      )}
                      
                      <form onSubmit={handleEditSport}>
                        <div className="mb-4">
                          <label htmlFor="sportName" className="block text-sm font-medium text-gray-700 mb-1">
                            Sport Name *
                          </label>
                          <input
                            type="text"
                            id="sportName"
                            value={newSportName}
                            onChange={(e) => setNewSportName(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ncaa-blue focus:border-ncaa-blue sm:text-sm"
                            placeholder="Enter sport name"
                            required
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleEditSport}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ncaa-blue text-base font-medium text-white hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 