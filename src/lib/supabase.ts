import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please click "Connect to Supabase" button to configure your database connection.')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key')

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
          user_id?: string
        }
      }
      tasks: {
        Row: {
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
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          created_at?: string
          updated_at?: string
          project_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          created_at?: string
          updated_at?: string
          project_id?: string | null
          user_id?: string
        }
      }
    }
  }
}