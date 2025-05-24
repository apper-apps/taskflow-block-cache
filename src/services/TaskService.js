// TaskService.js - Complete CRUD operations for task management

class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'task'
  }

  // Fetch all tasks with optional filtering and sorting
  async fetchTasks(filters = {}) {
    try {
      // All fields from the task table including system fields for display
      const tableFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'title', 'description', 'priority', 'dueDate', 'status', 'createdAt', 'updatedAt'
      ]

      const params = {
        fields: tableFields,
        orderBy: [
          {
            fieldName: filters.sortBy || 'createdAt',
            SortType: 'DESC'
          }
        ]
      }

      // Add filtering conditions if provided
      if (filters.status && filters.status !== 'all') {
        params.where = [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: [filters.status]
          }
        ]
      }

      // Add pagination if provided
      if (filters.limit || filters.offset) {
        params.pagingInfo = {
          limit: filters.limit || 20,
          offset: filters.offset || 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)

      if (!response || !response.data) {
        return []
      }

      return response.data
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw new Error('Failed to fetch tasks. Please try again.')
    }
  }

  // Get a single task by ID
  async getTaskById(taskId) {
    try {
      const tableFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'title', 'description', 'priority', 'dueDate', 'status', 'createdAt', 'updatedAt'
      ]

      const params = {
        fields: tableFields
      }

      const response = await this.apperClient.getRecordById(this.tableName, taskId, params)

      if (!response || !response.data) {
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error)
      throw new Error('Failed to fetch task details. Please try again.')
    }
  }

  // Create a new task
  async createTask(taskData) {
    try {
      // Only include updateable fields for create operation
      const updateableTaskData = {
        Name: taskData.title, // Map title to Name field
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || '',
        status: taskData.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add Tags if provided
      if (taskData.tags) {
        updateableTaskData.Tags = Array.isArray(taskData.tags) ? taskData.tags.join(',') : taskData.tags
      }

      const params = {
        records: [updateableTaskData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)

        if (failedRecords.length > 0) {
          // Handle validation errors
          const errorMessages = []
          failedRecords.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                errorMessages.push(`${error.fieldLabel}: ${error.message}`)
              })
            } else if (record.message) {
              errorMessages.push(record.message)
            }
          })
          throw new Error(errorMessages.join(', '))
        }

        return successfulRecords[0]?.data || null
      } else {
        throw new Error('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      throw new Error(error.message || 'Failed to create task. Please try again.')
    }
  }

  // Update an existing task
  async updateTask(taskId, taskData) {
    try {
      // Only include updateable fields for update operation
      const updateableTaskData = {
        Id: taskId,
        Name: taskData.title, // Map title to Name field
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || '',
        status: taskData.status || 'pending',
        updatedAt: new Date().toISOString()
      }

      // Add Tags if provided
      if (taskData.tags) {
        updateableTaskData.Tags = Array.isArray(taskData.tags) ? taskData.tags.join(',') : taskData.tags
      }

      const params = {
        records: [updateableTaskData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)

        if (failedUpdates.length > 0) {
          throw new Error(failedUpdates[0].message || 'Failed to update task')
        }

        return successfulUpdates[0]?.data || null
      } else {
        throw new Error('Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      throw new Error(error.message || 'Failed to update task. Please try again.')
    }
  }

  // Delete a task
  async deleteTask(taskId) {
    try {
      const params = {
        RecordIds: [taskId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)

        if (failedDeletions.length > 0) {
          throw new Error(failedDeletions[0].message || 'Failed to delete task')
        }

        return true
      } else {
        throw new Error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      throw new Error(error.message || 'Failed to delete task. Please try again.')
    }
  }
}

export default new TaskService()