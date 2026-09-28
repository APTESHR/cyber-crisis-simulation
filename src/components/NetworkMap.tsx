import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Server,
  Laptop,
  HardDrive,
  Network,
  Activity,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  X,
  CheckCircle2,
  Terminal,
  Zap,
} from 'lucide-react'
import { sound } from '../utils/audio'

export interface NetworkDevice {
  id: string
  name: string
  label: string
  ip: string
  vlan: string
  os: string
  role: string
  openPorts: number[]
  threatScore: number // 0 à 100
  status: 'nominal' | 'target' | 'compromised' | 'isolated' | 'encrypted'
  trafficKBps: number
  x: number
  y: number
}

interface NetworkMapProps {
  mode?: 'hacker' | 'enterprise' | 'overview'
  currentStep?: number // 0 à 6
  isolatedHost?: boolean
  onNodeClick?: (node: NetworkDevice) => void
  className?: string
}

export default function NetworkMap({
  mode = 'hacker',
  currentStep = 0,
  isolatedHost = false,
  onNodeClick,
  className = '',
}: NetworkMapProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('HOST_01')

  // Calcul des statuts dynamiques selon le step et le mode
  const isOverview = mode === 'overview' || currentStep === -1
  const isBreached = isOverview || (mode === 'hacker' ? currentStep >= 1 : currentStep >= 1)
  const isLateral = isOverview || (mode === 'hacker' ? currentStep >= 4 : currentStep >= 3)
  const isEncrypted = isOverview || (mode === 'hacker' ? currentStep >= 6 : currentStep >= 5)
  const isHostIsolated = mode === 'enterprise' ? (currentStep >= 1 || isolatedHost) : isolatedHost

  // Identification du point d'attention actif pour guider le regard de la salle
  const getActiveSpotlight = () => {
    if (isOverview || currentStep < 0 || currentStep > 6) return null
    if (mode === 'hacker') {
      if (currentStep === 0) return { x: 500, y: 110, label: '👉 ACCÈS INITIAL : Boîte mail de Sophie RH', color: '#f59e0b' }
      if (currentStep === 1) return { x: 500, y: 110, label: '👉 ÉVASION : PowerShell masqué & AMSI Bypass', color: '#ef4444' }
      if (currentStep === 2) return { x: 100, y: 130, label: '👉 COMMANDE & CONTRÔLE : Canal HTTPS/443', color: '#ef4444' }
      if (currentStep === 3) return { x: 720, y: 130, label: '👉 VOL IDENTIFIANTS : Injection LSASS en RAM', color: '#ef4444' }
      if (currentStep === 4) return { x: 720, y: 330, label: '👉 REBOND LATÉRAL : SMB 445 vers Serveur FS-CORP', color: '#ef4444' }
      if (currentStep === 5) return { x: 100, y: 130, label: '👉 EXFILTRATION FURTIVE : Données RH vers le Cloud', color: '#f97316' }
      if (currentStep === 6) return { x: 720, y: 330, label: '👉 SABOTAGE & CHIFFREMENT : Rançongiciel Actif', color: '#ef4444' }
    } else {
      if (currentStep === 0) return { x: 500, y: 110, label: '👉 SIEM & SOC L1 : Triage & Purge Globale Tenant', color: '#10b981' }
      if (currentStep === 1) return { x: 500, y: 110, label: '👉 EDR L2 : Arbre Processus & Confinement Logique', color: '#3b82f6' }
      if (currentStep === 2) return { x: 275, y: 130, label: '👉 SECOPS / IAM : Révocation Jetons & Filtrage C2', color: '#3b82f6' }
      if (currentStep === 3) return { x: 275, y: 130, label: '👉 NDR : Détection & Coupure Exfiltration', color: '#f97316' }
      if (currentStep === 4) return { x: 500, y: 110, label: '👉 FORENSIQUE L3 : Capture RAM & Triage $MFT', color: '#8b5cf6' }
      if (currentStep === 5) return { x: 275, y: 130, label: '👉 DÉCISION DGSSI : Refus Rançon & Déclaration 72h', color: '#10b981' }
      if (currentStep === 6) return { x: 880, y: 230, label: '👉 RESTAURATION : Re-imaging & Coffre WORM', color: '#10b981' }
    }
    return null
  }
  const spotlight = getActiveSpotlight()

  const devices: NetworkDevice[] = [
    {
      id: 'EXT_C2',
      name: 'Serveur C2 Pirate',
      label: 'C2 Server (Sofia, BG)',
      ip: '185.22.14.89',
      vlan: 'WAN / INTERNET',
      os: 'Debian Linux 12 (CobaltStrike)',
      role: 'Command & Control Attaquant',
      openPorts: [443, 8080, 22],
      threatScore: 100,
      status: 'compromised',
      trafficKBps: isEncrypted ? 840 : isBreached ? 64 : 12,
      x: 100,
      y: 130,
    },
    {
      id: 'SMTP_SPOOF',
      name: 'Relais SMTP Falsifié',
      label: 'entreprise-support.com',
      ip: '185.22.14.90',
      vlan: 'WAN / INTERNET',
      os: 'Postfix Mail Gateway',
      role: 'Émission Spear-Phishing',
      openPorts: [25, 587],
      threatScore: 85,
      status: currentStep === 0 ? 'target' : 'nominal',
      trafficKBps: currentStep === 0 ? 120 : 2,
      x: 100,
      y: 330,
    },
    {
      id: 'FW_EDGE',
      name: 'Pare-Feu Périmétrique',
      label: 'Palo Alto NGFW',
      ip: '192.168.1.1',
      vlan: 'DMZ / PERIMÈTRE',
      os: 'Palo Alto PAN-OS 11.1',
      role: 'Passerelle & Filtrage SSL/IPS',
      openPorts: [443, 8443],
      threatScore: isHostIsolated ? 10 : 35,
      status: 'nominal',
      trafficKBps: isEncrypted ? 960 : 180,
      x: 275,
      y: 130,
    },
    {
      id: 'MAIL_GW',
      name: 'Passerelle Messagerie',
      label: 'Exchange Online Hybride',
      ip: '10.0.0.25',
      vlan: 'DMZ / PERIMÈTRE',
      os: 'Microsoft Exchange Server',
      role: 'Réception & Filtrage Courriels',
      openPorts: [25, 443, 993],
      threatScore: currentStep === 0 ? 60 : 10,
      status: currentStep === 0 ? 'target' : 'nominal',
      trafficKBps: 45,
      x: 275,
      y: 330,
    },
    {
      id: 'HOST_01',
      name: 'Poste Sophie (RH)',
      label: 'HOST_01 (Patient Zéro)',
      ip: '10.0.10.15',
      vlan: 'VLAN 10 - POSTES',
      os: 'Windows 11 Enterprise 23H2',
      role: 'Poste Utilisateur RH',
      openPorts: [135, 445, 52410],
      threatScore: isHostIsolated ? 30 : isBreached ? 95 : 40,
      status: isHostIsolated ? 'isolated' : isBreached ? 'compromised' : 'target',
      trafficKBps: isHostIsolated ? 0 : isBreached ? 140 : 15,
      x: 500,
      y: 110,
    },
    {
      id: 'HOST_02',
      name: 'Poste Facturation',
      label: 'HOST_02 (Facturation)',
      ip: '10.0.10.16',
      vlan: 'VLAN 10 - POSTES',
      os: 'Windows 11 Enterprise',
      role: 'Poste Métier Facturation',
      openPorts: [135, 445],
      threatScore: isLateral && !isHostIsolated ? 80 : 5,
      status: isLateral && !isHostIsolated ? 'compromised' : 'nominal',
      trafficKBps: isLateral ? 45 : 4,
      x: 500,
      y: 230,
    },
    {
      id: 'HOST_03',
      name: 'Poste Ressources Humaines',
      label: 'HOST_03 (RH)',
      ip: '10.0.10.22',
      vlan: 'VLAN 10 - POSTES',
      os: 'Windows 11 Enterprise',
      role: 'Poste Salaires & RH',
      openPorts: [135, 445],
      threatScore: isLateral && !isHostIsolated ? 75 : 5,
      status: isLateral && !isHostIsolated ? 'compromised' : 'nominal',
      trafficKBps: isLateral ? 30 : 5,
      x: 500,
      y: 350,
    },
    {
      id: 'DC_CORP',
      name: 'Contrôleur de Domaine',
      label: 'DC-CORP-01 (AD DS)',
      ip: '10.0.0.5',
      vlan: 'VLAN 20 - SERVEURS',
      os: 'Windows Server 2022 Datacenter',
      role: 'Active Directory & Kerberos',
      openPorts: [88, 389, 445, 636],
      threatScore: currentStep >= 2 && !isHostIsolated ? 85 : 10,
      status: currentStep >= 2 && !isHostIsolated ? 'compromised' : 'nominal',
      trafficKBps: 220,
      x: 720,
      y: 130,
    },
    {
      id: 'FS_CORP',
      name: 'Serveur de Fichiers Métier',
      label: 'FS-CORP-01 (420 Go Métiers)',
      ip: '10.0.0.12',
      vlan: 'VLAN 20 - SERVEURS',
      os: 'Windows Server 2022',
      role: 'Partages SMB Finances & RH',
      openPorts: [445, 3389],
      threatScore: isEncrypted ? 99 : isLateral && !isHostIsolated ? 80 : 10,
      status: isEncrypted ? 'encrypted' : isLateral && !isHostIsolated ? 'compromised' : 'nominal',
      trafficKBps: isEncrypted ? 750 : isLateral ? 160 : 40,
      x: 720,
      y: 330,
    },
    {
      id: 'NAS_VEEAM',
      name: 'Dépôt Sauvegardes Immuables',
      label: 'NAS Veeam Air-Gap',
      ip: '10.0.99.100',
      vlan: 'VLAN 99 - AIR-GAP',
      os: 'Hardened Linux Repository WORM',
      role: 'Sauvegardes Hors-Ligne Étanches',
      openPorts: [6162],
      threatScore: 0,
      status: 'nominal',
      trafficKBps: mode === 'enterprise' && currentStep >= 4 ? 480 : 0,
      x: 885,
      y: 330,
    },
  ]

  const selectedNode = devices.find((d) => d.id === selectedNodeId) || devices[4] // HOST_01 par défaut

  const handleNodeClick = (node: NetworkDevice) => {
    sound.playBlip()
    setSelectedNodeId(node.id)
    if (onNodeClick) onNodeClick(node)
  }

  return (
    <div className={`bg-white rounded-[3px] border border-[#E2E4E9] p-4 sm:p-5 shadow-tactile relative overflow-hidden select-none ${className}`}>
      {/* Télémétrie en-tête du réseau */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E4E9] pb-3 mb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-[1px] bg-[#0284C7] animate-pulse" />
          <span className="text-[#090A0C] font-extrabold uppercase tracking-wider text-xs sm:text-sm">
            CARTOGRAPHIE RÉSEAU TOPOLOGIQUE EN DIRECT
          </span>
          <span className="text-slate-500 hidden sm:inline">| 10 Équipements Supervisés</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-600 font-medium">
            DÉBIT GLOBAL :{' '}
            <b className="text-sky-700 font-bold">
              {devices.reduce((acc, d) => acc + d.trafficKBps, 0)} KB/s
            </b>
          </span>
          <span className="text-slate-600 font-medium">
            HÔTES COMPROMIS :{' '}
            <b className={isBreached ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
              {devices.filter((d) => d.status === 'compromised' || d.status === 'encrypted').length} / 10
            </b>
          </span>
        </div>
      </div>

      {/* SVG Canvas Interactif */}
      <div className="relative w-full overflow-x-auto bg-[#F8F9FA] rounded-[3px] border border-[#E2E4E9] p-2">
        <svg
          viewBox="0 0 960 460"
          className="w-full h-auto min-w-[760px] max-h-[460px] overflow-visible"
        >
          {/* Grille et zones délimitées */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(203, 213, 225, 0.5)" strokeWidth="1" />
            </pattern>
            {/* Lueur laser */}
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Zones VLAN délimitées en fond */}
          <rect x="15" y="15" width="165" height="430" rx="16" fill="rgba(241, 245, 249, 0.9)" stroke="#cbd5e1" strokeDasharray="4,4" />
          <text x="25" y="38" fill="#475569" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ZONE 01 // WAN PUBLIC</text>

          <rect x="195" y="15" width="165" height="430" rx="16" fill="rgba(248, 250, 252, 0.9)" stroke="#cbd5e1" strokeDasharray="4,4" />
          <text x="205" y="38" fill="#475569" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ZONE 02 // DMZ PERIMÈTRE</text>

          <rect x="375" y="15" width="250" height="430" rx="16" fill="rgba(241, 245, 249, 0.9)" stroke="#cbd5e1" strokeDasharray="4,4" />
          <text x="385" y="38" fill="#475569" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ZONE 03 // VLAN 10 POSTES</text>

          <rect x="640" y="15" width="160" height="430" rx="16" fill="rgba(248, 250, 252, 0.9)" stroke="#cbd5e1" strokeDasharray="4,4" />
          <text x="650" y="38" fill="#475569" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ZONE 04 // VLAN 20 SERVEURS</text>

          <rect x="815" y="15" width="130" height="430" rx="16" fill="rgba(236, 253, 245, 0.9)" stroke="#10b981" strokeDasharray="4,4" />
          <text x="825" y="38" fill="#047857" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ZONE 05 // AIR-GAP (VLAN 99)</text>

          {/* CÂBLES RÉSEAU AVEC FLUX DE PAQUETS EN MOUVEMENT */}

          {/* Câble 1 : C2 Attaquant <-> Pare-feu */}
          <path
            d="M 100 130 L 275 130"
            fill="none"
            stroke={isHostIsolated ? '#475569' : isBreached ? '#ef4444' : '#334155'}
            strokeWidth="3"
            className={isHostIsolated ? '' : isBreached ? 'packet-flow-fast' : ''}
          />

          {/* Câble 2 : SMTP Spoof <-> Mail Gateway */}
          <path
            d="M 100 330 L 275 330"
            fill="none"
            stroke={isOverview || currentStep === 0 ? '#f59e0b' : '#334155'}
            strokeWidth="2.5"
            className={isOverview || currentStep === 0 ? 'packet-flow-fast' : ''}
          />

          {/* Câble 3 : Mail Gateway -> Pare-feu (Transfert SMTP) */}
          <path
            d="M 275 330 L 275 130"
            fill="none"
            stroke={isOverview || currentStep === 0 ? '#f59e0b' : '#1e293b'}
            strokeWidth="2"
            className={isOverview || currentStep === 0 ? 'packet-flow-fast' : ''}
          />

          {/* Câble 4 : Pare-feu <-> HOST_01 (Patient Zéro) */}
          {isHostIsolated ? (
            // Câble sectionné visuellement lors de l'isolation
            <g>
              <path d="M 275 130 L 370 120" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="4,4" />
              <path d="M 400 120 L 500 110" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="4,4" />
              <circle cx="385" cy="120" r="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x="381" y="124" fill="#3b82f6" fontSize="11" fontWeight="bold">✕</text>
            </g>
          ) : (
            <path
              d="M 275 130 L 500 110"
              fill="none"
              stroke={isBreached ? '#ef4444' : currentStep === 0 ? '#f59e0b' : '#334155'}
              strokeWidth="3"
              className={isBreached ? 'packet-flow-fast' : currentStep === 0 ? 'packet-flow' : ''}
            />
          )}

          {/* Câble 5 : HOST_01 -> HOST_02 (Rebond SMB port 445) */}
          <path
            d="M 500 110 L 500 230"
            fill="none"
            stroke={isHostIsolated ? '#334155' : isLateral ? '#ef4444' : '#1e293b'}
            strokeWidth="2.5"
            className={isLateral && !isHostIsolated ? 'packet-flow-fast' : ''}
          />

          {/* Câble 6 : HOST_02 -> HOST_03 (Rebond SMB port 445) */}
          <path
            d="M 500 230 L 500 350"
            fill="none"
            stroke={isHostIsolated ? '#334155' : isLateral ? '#ef4444' : '#1e293b'}
            strokeWidth="2.5"
            className={isLateral && !isHostIsolated ? 'packet-flow-fast' : ''}
          />

          {/* Câble 7 : HOST_01 <-> DC-CORP (Kerberos / LSASS) */}
          <path
            d="M 500 110 L 720 130"
            fill="none"
            stroke={isHostIsolated ? '#334155' : currentStep >= 2 ? '#ef4444' : '#1e293b'}
            strokeWidth="2.5"
            className={currentStep >= 2 && !isHostIsolated ? 'packet-flow-fast' : ''}
          />

          {/* Câble 8 : HOST_01 <-> FS-CORP (Partages SMB critiques) */}
          <path
            d="M 500 110 Q 610 220 720 330"
            fill="none"
            stroke={isHostIsolated ? '#334155' : isEncrypted ? '#ef4444' : isLateral ? '#f59e0b' : '#1e293b'}
            strokeWidth={isEncrypted ? '4' : '2.5'}
            className={isEncrypted && !isHostIsolated ? 'packet-flow-fast' : isLateral && !isHostIsolated ? 'packet-flow' : ''}
          />

          {/* Câble 9 : FS-CORP <-> NAS Veeam (Air-Gap WORM) */}
          <path
            d="M 720 330 L 885 330"
            fill="none"
            stroke={mode === 'enterprise' && currentStep >= 4 ? '#10b981' : '#334155'}
            strokeWidth="3"
            strokeDasharray="6,6"
            className={mode === 'enterprise' && currentStep >= 4 ? 'packet-flow-fast' : ''}
          />

          {/* NŒUDS DU RÉSEAU (ÉQUIPEMENTS INTERACTIFS) */}
          {devices.map((node) => {
            const isSelected = selectedNodeId === node.id
            const isCompromised = node.status === 'compromised'
            const isLocked = node.status === 'encrypted'
            const isIsolated = node.status === 'isolated'
            const isTarget = node.status === 'target'

            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Anneau de sélection / pulsation */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="28"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    className="animate-spin origin-center"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                )}

                {/* Bouclier d'isolation visuel */}
                {isIsolated && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="26"
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                )}

                {/* Corps du nœud */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={
                    isLocked
                      ? '#7f1d1d'
                      : isCompromised
                      ? '#991b1b'
                      : isIsolated
                      ? '#1e3a8a'
                      : isTarget
                      ? '#78350f'
                      : '#0f172a'
                  }
                  stroke={
                    isLocked
                      ? '#ef4444'
                      : isCompromised
                      ? '#f87171'
                      : isIsolated
                      ? '#60a5fa'
                      : isTarget
                      ? '#fbbf24'
                      : '#334155'
                  }
                  strokeWidth="2.5"
                  className="transition-colors group-hover:stroke-sky-400"
                />

                {/* Icône matérielle intérieure */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {isLocked ? '🔒' : isCompromised ? '☠' : isIsolated ? '🛡️' : node.vlan.includes('AIR-GAP') ? '💾' : node.vlan.includes('SERVEURS') ? '🗄️' : '💻'}
                </text>

                {/* Libellé du nœud */}
                <text
                  x={node.x}
                  y={node.y + 36}
                  textAnchor="middle"
                  fill={isSelected ? '#0284c7' : '#0f172a'}
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  {node.id}
                </text>

                <text
                  x={node.x}
                  y={node.y + 48}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  {node.ip}
                </text>

                {/* Badge statut au-dessus du nœud */}
                {isCompromised && (
                  <rect x={node.x - 24} y={node.y - 32} width="48" height="12" rx="4" fill="#ef4444" />
                )}
                {isCompromised && (
                  <text x={node.x} y={node.y - 23} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                    INFECTÉ
                  </text>
                )}

                {isLocked && (
                  <rect x={node.x - 30} y={node.y - 32} width="60" height="12" rx="4" fill="#dc2626" />
                )}
                {isLocked && (
                  <text x={node.x} y={node.y - 23} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                    .LOCKED
                  </text>
                )}

                {isIsolated && (
                  <rect x={node.x - 24} y={node.y - 32} width="48" height="12" rx="4" fill="#2563eb" />
                )}
                {isIsolated && (
                  <text x={node.x} y={node.y - 23} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                    ISOLÉ
                  </text>
                )}
              </g>
            )
          })}

          {/* PROJECTEUR VISUEL (SPOTLIGHT & FLÈCHE D'ATTENTION POUR LA SALLE) */}
          {spotlight && (
            <g>
              {/* Cercle d'ondes concentriques pulsant */}
              <circle
                cx={spotlight.x}
                cy={spotlight.y}
                r="36"
                fill="none"
                stroke={spotlight.color}
                strokeWidth="3"
                opacity="0.8"
                className="animate-ping"
                style={{ transformOrigin: `${spotlight.x}px ${spotlight.y}px` }}
              />
              <circle
                cx={spotlight.x}
                cy={spotlight.y}
                r="46"
                fill="none"
                stroke={spotlight.color}
                strokeWidth="1.5"
                strokeDasharray="6,4"
                className="animate-spin"
                style={{ transformOrigin: `${spotlight.x}px ${spotlight.y}px` }}
              />
              {/* Étiquette d'orientation avec flèche dirigée vers le nœud */}
              <g transform={`translate(${spotlight.x}, ${spotlight.y - 48})`}>
                <rect
                  x="-125"
                  y="-22"
                  width="250"
                  height="26"
                  rx="13"
                  fill="#ffffff"
                  stroke={spotlight.color}
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
                />
                <text
                  x="0"
                  y="-5"
                  fill="#0f172a"
                  fontSize="11"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {spotlight.label}
                </text>
                {/* Flèche pointant vers le bas */}
                <polygon points="0,5 -6,-1 6,-1" fill={spotlight.color} />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* TIROIR D'INSPECTION TÉLÉMÉTRIQUE DE L'ÉQUIPEMENT SÉLECTIONNÉ */}
      <div className="mt-4 p-4 sm:p-5 bg-white rounded-[3px] border border-[#E2E4E9] grid sm:grid-cols-12 gap-4 items-center shadow-tactile">
        <div className="sm:col-span-4 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-[1px] ${
                selectedNode.status === 'encrypted' || selectedNode.status === 'compromised'
                  ? 'bg-[#DC2626] animate-ping'
                  : selectedNode.status === 'isolated'
                  ? 'bg-[#0284C7]'
                  : 'bg-[#059669]'
              }`}
            />
            <h4 className="text-sm font-extrabold text-[#090A0C] font-mono">{selectedNode.name}</h4>
          </div>
          <p className="text-xs text-[#525866] font-mono">
            {selectedNode.label} · IP : <b className="text-[#0284C7] font-bold">{selectedNode.ip}</b>
          </p>
          <span className="inline-block text-[10px] font-mono text-[#525866] uppercase font-semibold">
            Réseau : {selectedNode.vlan}
          </span>
        </div>

        <div className="sm:col-span-5 grid grid-cols-3 gap-2 text-center font-mono text-xs">
          <div className="p-2 bg-[#F8F9FA] rounded-[2px] border border-[#E2E4E9] shadow-tactile">
            <span className="text-[#8C93A0] text-[9px] block font-bold uppercase">OS & NOYAU</span>
            <span className="text-[#090A0C] font-bold truncate block">{selectedNode.os.split(' ')[0]}</span>
          </div>
          <div className="p-2 bg-[#F8F9FA] rounded-[2px] border border-[#E2E4E9] shadow-tactile">
            <span className="text-[#8C93A0] text-[9px] block font-bold uppercase">PORTS OUVERTS</span>
            <span className="text-[#D97706] font-bold truncate block">{selectedNode.openPorts.join(', ')}</span>
          </div>
          <div className="p-2 bg-[#F8F9FA] rounded-[2px] border border-[#E2E4E9] shadow-tactile">
            <span className="text-[#8C93A0] text-[9px] block font-bold uppercase">NIVEAU MENACE</span>
            <span
              className={`font-bold block tabular-nums ${
                selectedNode.threatScore >= 70
                  ? 'text-[#DC2626]'
                  : selectedNode.threatScore >= 30
                  ? 'text-[#D97706]'
                  : 'text-[#059669]'
              }`}
            >
              {selectedNode.threatScore} %
            </span>
          </div>
        </div>

        <div className="sm:col-span-3 flex justify-end">
          <div className="text-right text-[11px] font-mono">
            <span className="text-slate-500 font-semibold block">DÉBIT EN DIRECT :</span>
            <span className="text-sky-700 font-extrabold text-xs">{selectedNode.trafficKBps} KB/s</span>
            <span className="text-slate-500 block text-[10px] mt-0.5">
              Statut : <b className="uppercase text-slate-800 font-bold">{selectedNode.status}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

