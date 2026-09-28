import React from 'react'

interface FaIconProps {
  icon: string
  className?: string
  style?: React.CSSProperties
}

export default function FaIcon({ icon, className = '', style }: FaIconProps) {
  const fullClass = icon.includes('fa-') ? icon : `fa-solid fa-${icon}`
  return <i className={`${fullClass} ${className}`} style={style} aria-hidden="true" />
}

