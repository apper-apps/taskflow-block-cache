import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 md:space-y-8"
        >
          {/* 404 Icon */}
          <motion.div
            className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <ApperIcon name="AlertTriangle" className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          </motion.div>

          {/* Error Message */}
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-surface-900 dark:text-white">
              Page Not Found
            </h2>
            <p className="text-base md:text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off. Let's get you back on track with your tasks.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="w-full sm:w-auto btn-primary"
            >
              <ApperIcon name="Home" className="h-4 w-4 mr-2" />
              Back to TaskFlow
            </Link>
            
            <motion.button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Go Back
            </motion.button>
          </div>

          {/* Helpful Links */}
          <motion.div
            className="pt-6 md:pt-8 border-t border-surface-200 dark:border-surface-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
              Need help? Here are some quick shortcuts:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: "Plus", text: "Create Task" },
                { icon: "Search", text: "Find Tasks" },
                { icon: "Settings", text: "Preferences" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded-lg text-sm text-surface-600 dark:text-surface-400"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ApperIcon name={item.icon} className="h-4 w-4" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound