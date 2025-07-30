import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  created_at: string
  updated_at: string
  project_id: string | null
  user_id: string
  project?: {
    name: string
    color: string
  }
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTasks = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(name, color)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: user.id }])
      .select()

    if (error) {
      console.error('Error creating task:', error)
      throw error
    }

    fetchTasks()
    return data[0]
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error updating task:', error)
      throw error
    }

    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      throw error
    }

    fetchTasks()
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  }
}