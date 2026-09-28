/**
 * Certificate Generator using HTML5 Canvas.
 * Generates an ultra-high-definition (1920x1080) professional cybersecurity certificate
 * that can be downloaded offline on any device.
 */

export interface CertificateData {
  recipientName: string
  score: number
  totalQuestions: number
  dateString: string
  certificateId: string
  mention: string
}

export function generateCertificateDataUrl(data: CertificateData): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1920
  canvas.height = 1080
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // 1. Background - Premium Ivory / Off-White
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, 1920, 1080)

  // Soft radiant vignette
  const bgGrad = ctx.createRadialGradient(960, 540, 100, 960, 540, 900)
  bgGrad.addColorStop(0, '#FFFFFF')
  bgGrad.addColorStop(1, '#F8F4FF')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 1920, 1080)

  // 2. Ornate Border System (Electric Blue & Gold)
  ctx.strokeStyle = '#0254EC'
  ctx.lineWidth = 14
  ctx.strokeRect(50, 50, 1820, 980)

  ctx.strokeStyle = '#E0E7FF'
  ctx.lineWidth = 3
  ctx.strokeRect(66, 66, 1788, 948)

  ctx.strokeStyle = '#BE185D'
  ctx.lineWidth = 2
  ctx.strokeRect(74, 74, 1772, 932)

  // Corner decorative accents
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillStyle = '#0254EC'
    ctx.fillRect(0, 0, 36, 6)
    ctx.fillRect(0, 0, 6, 36)
    ctx.fillStyle = '#FFB6D9'
    ctx.fillRect(10, 10, 8, 8)
    ctx.restore()
  }
  drawCorner(85, 85, 0)
  drawCorner(1835, 85, Math.PI / 2)
  drawCorner(1835, 995, Math.PI)
  drawCorner(85, 995, -Math.PI / 2)

  // 3. Header Ribbon / Emblems
  ctx.fillStyle = '#0254EC'
  ctx.beginPath()
  ctx.arc(960, 150, 42, 0, Math.PI * 2)
  ctx.fill()

  // Shield icon in seal
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(960, 126)
  ctx.lineTo(982, 137)
  ctx.lineTo(982, 155)
  ctx.bezierCurveTo(982, 172, 960, 183, 960, 183)
  ctx.bezierCurveTo(960, 183, 938, 172, 938, 155)
  ctx.lineTo(938, 137)
  ctx.closePath()
  ctx.stroke()

  // Mini gold star in shield
  ctx.fillStyle = '#FFB6D9'
  ctx.beginPath()
  ctx.arc(960, 152, 6, 0, Math.PI * 2)
  ctx.fill()

  // 4. Main Certificate Titles
  ctx.textAlign = 'center'

  ctx.fillStyle = '#BE185D'
  ctx.font = 'bold 18px "Inter", "Segoe UI", sans-serif'
  ctx.fillText('PROGRAMME OFFICIEL DE SENSIBILISATION & RÉPONSE AUX INCIDENTS', 960, 230)

  ctx.fillStyle = '#0254EC'
  ctx.font = '900 48px "Inter", "Segoe UI", sans-serif'
  ctx.fillText("CERTIFICAT D'ACCRÉDITATION EN CYBERDÉFENSE", 960, 290)

  ctx.fillStyle = '#717783'
  ctx.font = '500 22px "Inter", "Segoe UI", sans-serif'
  ctx.fillText('Attestation de Compétence : Riposte Anti-Phishing & Résilience Rançongiciel', 960, 330)

  // Thin separator rule
  ctx.strokeStyle = '#E0E7FF'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(760, 360)
  ctx.lineTo(1160, 360)
  ctx.stroke()

  // 5. Recipient Section
  ctx.fillStyle = '#717783'
  ctx.font = 'italic 22px "Inter", "Georgia", serif'
  ctx.fillText('Ce présent certificat d’excellence est solennellement décerné à :', 960, 420)

  // Recipient Name
  ctx.fillStyle = '#393F49'
  ctx.font = '800 56px "Inter", "Segoe UI", sans-serif'
  const nameToDisplay = data.recipientName.trim() || 'Participant(e) Méritant(e)'
  ctx.fillText(nameToDisplay, 960, 500)

  // Underline for name
  const textWidth = ctx.measureText(nameToDisplay).width
  ctx.strokeStyle = '#0254EC'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(960 - textWidth / 2 - 20, 525)
  ctx.lineTo(960 + textWidth / 2 + 20, 525)
  ctx.stroke()

  // 6. Validation Description & Score Details
  ctx.fillStyle = '#4B5563'
  ctx.font = '400 22px "Inter", "Segoe UI", sans-serif'
  ctx.fillText(
    'Pour avoir suivi avec succès la simulation de crise et validé l’évaluation globale des compétences.',
    960,
    580
  )

  // Score Badge Container
  const pct = Math.round((data.score / data.totalQuestions) * 100)
  ctx.fillStyle = '#F5F0FF'
  ctx.strokeStyle = '#C7DBFE'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(660, 620, 600, 90, 24)
  ctx.fill()
  ctx.stroke()

  // Score Text
  ctx.fillStyle = '#0254EC'
  ctx.font = '800 28px "Inter", "Segoe UI", sans-serif'
  ctx.fillText(`SCORE : ${data.score} / ${data.totalQuestions} (${pct}%)`, 960, 660)

  ctx.fillStyle = '#BE185D'
  ctx.font = '600 18px "Inter", "Segoe UI", sans-serif'
  ctx.fillText(`Mention : ${data.mention}`, 960, 692)

  // 7. Core Competencies List
  ctx.fillStyle = '#717783'
  ctx.font = '500 16px "Inter", "Segoe UI", sans-serif'
  ctx.fillText(
    'Compétences validées : Détection Spear-Phishing · Évasion AMSI · Isolement Hôte RAM · Sauvegardes Immuables WORM',
    960,
    750
  )

  // 8. Signatures & Accreditation Footer
  // Left: Authority & Date
  ctx.textAlign = 'left'
  ctx.fillStyle = '#717783'
  ctx.font = '500 16px "Inter", "Segoe UI", sans-serif'
  ctx.fillText(`Date de validation : ${data.dateString}`, 160, 840)
  ctx.fillText(`Identifiant Officiel : ${data.certificateId}`, 160, 868)
  ctx.fillText('Plateforme : Meridian Cyber-Range Simulation', 160, 896)

  // Middle: Official Security Stamp
  ctx.save()
  ctx.translate(960, 860)
  ctx.strokeStyle = '#0254EC'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 0, 48, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 0, 42, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#0254EC'
  ctx.textAlign = 'center'
  ctx.font = 'bold 10px "Inter", sans-serif'
  ctx.fillText('DGSSI · VERIFIED', 0, -12)
  ctx.font = '900 14px "Inter", sans-serif'
  ctx.fillText('SÉCURISÉ', 0, 5)
  ctx.font = 'bold 10px "Inter", sans-serif'
  ctx.fillText('WORM AUDITED', 0, 20)
  ctx.restore()

  // Right: Signature
  ctx.textAlign = 'right'
  ctx.fillStyle = '#393F49'
  ctx.font = 'bold 18px "Inter", "Segoe UI", sans-serif'
  ctx.fillText('Direction de la Sécurité des Systèmes d’Information', 1760, 840)
  ctx.fillStyle = '#717783'
  ctx.font = 'italic 16px "Inter", "Georgia", serif'
  ctx.fillText('Comité Pédagogique & Équipe RSSI', 1760, 868)

  // Mock cursive signature line
  ctx.strokeStyle = '#0254EC'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(1560, 900)
  ctx.bezierCurveTo(1600, 880, 1640, 920, 1680, 890)
  ctx.bezierCurveTo(1700, 870, 1740, 910, 1760, 895)
  ctx.stroke()

  return canvas.toDataURL('image/png')
}

export function downloadCertificate(data: CertificateData) {
  const dataUrl = generateCertificateDataUrl(data)
  if (!dataUrl) return

  const cleanName = data.recipientName.trim().replace(/[^a-zA-Z0-9_\-]/g, '_') || 'Participant'
  const link = document.createElement('a')
  link.download = `Certificat_Cybersecurite_${cleanName}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

