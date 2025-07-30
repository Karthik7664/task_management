import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Project {
  id: string
  name: string
  description: string | null
  color: string
  created_at: string
  user_id: string
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchProjects = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, user_id: user.id }])
      .select()

    if (error) {
      console.error('Error creating project:', error)
      throw error
    }

    fetchProjects()
    return data[0]
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating project:', error)
      throw error
    }

    fetchProjects()
  }

  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      throw error
    }

    fetchProjects()
  }

  useEffect(() => {
    fetchProjects()
  }, [user])

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  }
}