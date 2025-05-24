import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  })
  const [editingTask, setEditingTask] = useState(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('gotrajtasks-2-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('gotrajtasks-2-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    const taskData = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate,
      status: editingTask?.status || 'pending',
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? taskData : task))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      setTasks([...tasks, taskData])
      toast.success('Task created successfully!')
    }

    setFormData({ title: '', description: '', priority: 'medium', dueDate: '' })
    setIsFormOpen(false)
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            updatedAt: new Date().toISOString()
          }
        : task
    ))
    
    const task = tasks.find(t => t.id === taskId)
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    toast.success(`Task marked as ${newStatus}!`)
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const editTask = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate
    })
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default: return 'text-surface-600 bg-surface-100 dark:bg-surface-700'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return 'AlertTriangle'
      case 'high': return 'ChevronUp'
      case 'medium': return 'Minus'
      case 'low': return 'ChevronDown'
      default: return 'Minus'
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 'completed'
    if (filter === 'pending') return task.status === 'pending'
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    urgent: tasks.filter(t => t.priority === 'urgent' && t.status === 'pending').length
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        className="mb-6 md:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
              Task Dashboard
            </h2>
            <p className="text-surface-600 dark:text-surface-400">
              Manage your tasks efficiently and boost your productivity
            </p>
          </div>
          
          <motion.button
            onClick={() => {
              setIsFormOpen(true)
              setEditingTask(null)
              setFormData({ title: '', description: '', priority: 'medium', dueDate: '' })
            }}
            className="btn-primary w-full lg:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Create New Task
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {[
          { label: 'Total Tasks', value: taskStats.total, icon: 'List', color: 'blue' },
          { label: 'Completed', value: taskStats.completed, icon: 'CheckCircle', color: 'green' },
          { label: 'Pending', value: taskStats.pending, icon: 'Clock', color: 'yellow' },
          { label: 'Urgent', value: taskStats.urgent, icon: 'AlertTriangle', color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-surface-800 rounded-2xl p-3 md:p-4 shadow-soft border border-surface-200 dark:border-surface-700"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <ApperIcon name={stat.icon} className={`h-4 w-4 md:h-5 md:w-5 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                <p className="text-xs md:text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Sort */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex-1">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Filter Tasks
          </label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Sort By
          </label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="created">Date Created</option>
          </select>
        </div>
      </motion.div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-soft border border-surface-200 dark:border-surface-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                >
                  <ApperIcon name="X" className="h-4 w-4 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows="3"
                    placeholder="Add task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-surface-100 dark:bg-surface-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileText" className="h-8 w-8 md:h-10 md:w-10 text-surface-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-surface-900 dark:text-white mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              {filter === 'all' 
                ? "Create your first task to get started with GotrajTasks 2"
                : `You don't have any ${filter} tasks right now`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary"
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Create First Task
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4">
            <AnimatePresence>
              {sortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  className={`task-card ${task.status === 'completed' ? 'opacity-75' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <motion.button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-1 w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        task.status === 'completed'
                          ? 'bg-primary border-primary text-white'
                          : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {task.status === 'completed' && (
                        <ApperIcon name="Check" className="h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </motion.button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h4 className={`font-semibold text-surface-900 dark:text-white ${
                          task.status === 'completed' ? 'line-through' : ''
                        }`}>
                          {task.title}
                        </h4>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            <ApperIcon name={getPriorityIcon(task.priority)} className="h-3 w-3 inline mr-1" />
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-4 text-xs text-surface-500 dark:text-surface-400">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Calendar" className="h-3 w-3" />
                              <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Clock" className="h-3 w-3" />
                            <span>{format(new Date(task.createdAt), 'MMM dd')}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => editTask(task)}
                            className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ApperIcon name="Edit" className="h-4 w-4 text-surface-500" />
                          </motion.button>
                          <motion.button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MainFeature