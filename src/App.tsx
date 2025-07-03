import { useState, useEffect } from 'react'

interface Task {
  id: string
  text: string
  createdAt: Date
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      const tasksWithDates = parsedTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }))
      setTasks(tasksWithDates)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks, isInitialized])

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        createdAt: new Date()
      }
      setTasks([...tasks, task])
      setNewTask('')
    }
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      addTask()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold mb-6 text-center">
          Task Manager
        </h1>
        
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No tasks yet. Add one above!
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-800 p-4 rounded-md border border-gray-700 flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="text-white">{task.text}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
