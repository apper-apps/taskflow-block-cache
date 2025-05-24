import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { AuthContext } from '../App'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen">
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-soft">
                <ApperIcon name="CheckSquare" className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  GotrajTasks 2
                </h1>
                <p className="text-xs text-surface-500 hidden sm:block">Efficient Task Management</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon 
                  name={isDarkMode ? "Sun" : "Moon"} 
                  className="h-5 w-5 text-surface-600 dark:text-surface-400" 
                />
              </motion.button>
              
              <div className="hidden md:flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                <ApperIcon name="Zap" className="h-4 w-4" />
                <span>Boost your productivity</span>
              </div>
              
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-surface-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-surface-600 dark:text-surface-400">
                      {user.emailAddress}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                </div>
              )}
              
              <motion.button
                onClick={logout}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <ApperIcon name="LogOut" className="h-5 w-5 text-surface-600 dark:text-surface-400" />
              </motion.button>
            </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-8 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 md:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-surface-900 dark:text-white mb-4 md:mb-6">
              Master Your
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"> Tasks</span>
            </h2>
            <p className="text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
              Organize, prioritize, and track your tasks with an elegant interface designed for maximum productivity
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { icon: "Target", label: "Focused Workflow", value: "100%" },
              { icon: "Clock", label: "Time Saved", value: "4hrs/day" },
              { icon: "TrendingUp", label: "Productivity Boost", value: "300%" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-surface-800 rounded-2xl p-4 md:p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-surface-200 dark:border-surface-700"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <ApperIcon name={stat.icon} className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm md:text-base text-surface-600 dark:text-surface-400">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MainFeature />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 md:mt-24 py-8 md:py-12 bg-surface-100 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-surface-900 dark:text-white">GotrajTasks 2</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-surface-600 dark:text-surface-400">
              <span>Built for productivity enthusiasts</span>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Heart" className="h-4 w-4 text-red-500" />
                <span>Made with passion</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home