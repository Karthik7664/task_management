/*
  # Initial Schema for TaskFlow

  ## Overview
  This migration creates the foundational database schema for the TaskFlow task management application.

  ## New Tables

  ### 1. `projects` Table
  - `id` (uuid, primary key) - Unique identifier for each project
  - `name` (text, required) - Project name
  - `description` (text, optional) - Project description
  - `color` (text, required) - Color code for visual organization
  - `created_at` (timestamptz) - Timestamp when project was created
  - `user_id` (uuid, required) - Reference to the user who owns this project

  ### 2. `tasks` Table
  - `id` (uuid, primary key) - Unique identifier for each task
  - `title` (text, required) - Task title
  - `description` (text, optional) - Detailed task description
  - `completed` (boolean, default: false) - Task completion status
  - `priority` (text, required) - Priority level: 'low', 'medium', or 'high'
  - `due_date` (timestamptz, optional) - Task deadline
  - `created_at` (timestamptz) - Timestamp when task was created
  - `updated_at` (timestamptz) - Timestamp of last update
  - `project_id` (uuid, optional) - Reference to parent project
  - `user_id` (uuid, required) - Reference to the user who owns this task

  ## Security

  ### Row Level Security (RLS)
  - RLS is enabled on both tables to ensure users can only access their own data
  - Policies are created for SELECT, INSERT, UPDATE, and DELETE operations
  - All policies verify that the authenticated user's ID matches the record's user_id

  ### Policies Created

  #### Projects Table:
  1. Users can view their own projects
  2. Users can create projects for themselves
  3. Users can update their own projects
  4. Users can delete their own projects

  #### Tasks Table:
  1. Users can view their own tasks
  2. Users can create tasks for themselves
  3. Users can update their own tasks
  4. Users can delete their own tasks

  ## Indexes
  - Foreign key indexes on user_id columns for efficient queries
  - Foreign key index on tasks.project_id for project-task relationships

  ## Important Notes
  - All tables use uuid primary keys for security and scalability
  - Timestamps use timestamptz for timezone awareness
  - Foreign key constraints maintain referential integrity
  - Default values prevent null issues (completed defaults to false)
  - Priority is constrained to valid values using a CHECK constraint
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);