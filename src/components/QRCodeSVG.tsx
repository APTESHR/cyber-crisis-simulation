import React, { useMemo } from 'react'
import { generateQRMatrix } from '../utils/qr'

interface QRCodeSVGProps {
  value: string
  size?: number
  fgColor?: string
  bgColor?: string
  className?: string
}

export function QRCodeSVG({
  value,
  size = 180,
  fgColor = '#0F172A',
  bgColor = '#FFFFFF',
  className = '',
}: QRCodeSVGProps) {
  const matrix = useMemo(() => {
    try {
      return generateQRMatrix(value)
    } catch (err) {
      console.error('QR generation failed:', err)
      return []
    }
  }, [value])

  if (!matrix.length) return null

  const count = matrix.length
  const margin = 2
  const viewBoxSize = count + margin * 2

  let path = ''
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (matrix[r][c]) {
        path += `M${c + margin},${r + margin}h1v1h-1z `
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={viewBoxSize} height={viewBoxSize} fill={bgColor} rx={1} />
      <path d={path} fill={fgColor} />
    </svg>
  )
}

