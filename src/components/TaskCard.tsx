import React from 'react'
import { format } from 'date-fns'
import { Calendar, Flag, CheckCircle2, Circle, Trash2, Edit } from 'lucide-react'
import { Task } from '../hooks/useTasks'

interface TaskCardProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const priorityColors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-red-600 bg-red-50',
  }

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(task.id, !task.completed)}
            className={`mt-0.5 transition-colors ${
              task.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
            }`}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <h3 className={`font-medium text-gray-900 ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mt-1 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            <Flag className="w-3 h-3 inline mr-1" />
            {priorityLabels[task.priority]}
          </span>
          {task.project && (
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: task.project.color }}
            >
              {task.project.name}
            </span>
          )}
        </div>
        {task.due_date && (
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(task.due_date), 'MMM d')}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard