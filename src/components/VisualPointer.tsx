import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Eye } from 'lucide-react'

interface VisualPointerProps {
  label: string
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  color?: 'red' | 'blue' | 'amber' | 'emerald'
}

export default function VisualPointer({
  label,
  direction = 'down',
  className = '',
  color = 'red',
}: VisualPointerProps) {
  const colorStyles = {
    red: {
      bg: 'bg-rose-600',
      border: 'border-rose-400',
      text: 'text-rose-200',
      ring: 'bg-rose-500',
      glow: 'shadow-rose-600/50',
    },
    blue: {
      bg: 'bg-blue-600',
      border: 'border-blue-400',
      text: 'text-blue-200',
      ring: 'bg-blue-500',
      glow: 'shadow-blue-600/50',
    },
    amber: {
      bg: 'bg-amber-500',
      border: 'border-amber-300',
      text: 'text-amber-100',
      ring: 'bg-amber-400',
      glow: 'shadow-amber-500/50',
    },
    emerald: {
      bg: 'bg-emerald-600',
      border: 'border-emerald-400',
      text: 'text-emerald-200',
      ring: 'bg-emerald-500',
      glow: 'shadow-emerald-600/50',
    },
  }

  const c = colorStyles[color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`z-50 pointer-events-none flex items-center gap-2 ${className}`}
    >
      {/* Anneau lumineux pulsant d'attention */}
      <div className="relative flex items-center justify-center">
        <span className={`absolute w-8 h-8 rounded-full ${c.ring} opacity-75 animate-ping`} />
        <span className={`relative w-4 h-4 rounded-full ${c.bg} border-2 border-white shadow-lg`} />
      </div>

      {/* Étiquette d'explication avec flèche animée */}
      <motion.div
        animate={{
          y: direction === 'down' ? [0, 4, 0] : direction === 'up' ? [0, -4, 0] : 0,
          x: direction === 'right' ? [0, 4, 0] : direction === 'left' ? [0, -4, 0] : 0,
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${c.bg} text-white font-bold text-xs shadow-xl ${c.glow} border ${c.border}`}
      >
        <Eye size={14} className="animate-pulse" />
        <span>{label}</span>
        {direction === 'down' && <ArrowDown size={14} className="animate-bounce" />}
        {direction === 'up' && <ArrowUp size={14} className="animate-bounce" />}
        {direction === 'left' && <ArrowLeft size={14} className="animate-bounce" />}
        {direction === 'right' && <ArrowRight size={14} className="animate-bounce" />}
      </motion.div>
    </motion.div>
  )
}

