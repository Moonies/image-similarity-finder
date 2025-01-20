'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{
        type: 'spring',
        stiffness: 200, // Reduced from 450
        damping: 40, // Increased from 40
        mass: 2, // Increased from 0.8
        restDelta: 0.001,
        duration: 3, // Added duration control
      }}
      style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      {children}
    </motion.div>
  )
}
