import React from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Clock, Flag, Plus, TrendingUp } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useProjects } from '../hooks/useProjects'
import TaskCard from '../components/TaskCard'

const Dashboard = () => {
  const { tasks, updateTask, deleteTask } = useTasks()
  const { projects } = useProjects()

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed)
  const overdueTasks = tasks.filter(task => 
    task.due_date && 
    new Date(task.due_date) < new Date() && 
    !task.completed
  )

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const handleEditTask = (task: any) => {
    // For now, just log - in a real app, you'd open an edit modal or navigate to edit page
    console.log('Edit task:', task)
  }

  const stats = [
    {
      name: 'Total Tasks',
      value: tasks.length,
      icon: CheckSquare,
      color: 'bg-blue-500',
    },
    {
      name: 'Completed',
      value: completedTasks.length,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Pending',
      value: pendingTasks.length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'High Priority',
      value: highPriorityTasks.length,
      icon: Flag,
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your tasks.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
            <Link
              to="/tasks/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Link>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border">
                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first task</p>
                <Link
                  to="/tasks/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Projects</span>
                <span className="font-semibold text-gray-900">{projects.length}</span>
              </div>
              {overdueTasks.length > 0 && (
                <div className="flex justify-between items-center text-red-600">
                  <span>Overdue Tasks</span>
                  <span className="font-semibold">{overdueTasks.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
              <Link
                to="/projects"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-gray-900 font-medium truncate">{project.name}</span>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-gray-500 text-sm">No projects yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard