"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { Star } from "lucide-react"

export function StarButton() {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const starIconControls = useAnimation()

  useEffect(() => {
    async function fetchStars() {
      try {

        controls.start({ opacity: 1, y: 0, scale: 1 })
        setTimeout(async () => {
          await controls.start({ scale: 1.1, transition: { duration: 0.3 } })
          await controls.start({ scale: 1, transition: { duration: 0.2 } })
          await controls.start({ scale: 1.05, transition: { duration: 0.2 } })
          await controls.start({ scale: 1, transition: { duration: 0.2 } })
          await starIconControls.start({ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1.2, 1],
            transition: { duration: 1 }
          })
        }, 1500)
      } catch (error) {
        console.error('Error fetching GitHub stars:', error)
        controls.start({ opacity: 1, y: 0 }) 
      }
    }
    
    fetchStars()
  }, [controls, starIconControls])

  return (
    <motion.a
      href="https://github.com/alxn787/newalgo"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1.5 rounded-full bg-neutral-800 shadow-md borderborder-neutral-700 text-sm font-medium text-neutral-200 transition-all"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={controls}
    >
      <motion.div 
        className="flex items-center gap-1.5"
        animate={isHovered ? { gap: "8px" } : { gap: "6px" }}
      >
        <motion.div animate={starIconControls}>
          <Star className={`w-4 h-4 ${isHovered ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-400'}`} />
        </motion.div>
        <span>Star on GitHub</span>
      </motion.div>
    </motion.a>
  )
} 