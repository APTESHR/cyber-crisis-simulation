import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Skull, ShieldAlert, X } from 'lucide-react'
import { sound } from '../utils/audio'

export function Card({
  className = '',
  children,
  variant = 'default',
}: {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'threat' | 'warning' | 'cobalt' | 'containment' | 'iris'
}) {
  const variantStyles = {
    default: 'bg-white border-[#E0E7FF]',
    threat: 'bg-white border-[#FBCFE8] border-l-[3px] border-l-[#BE185D]',
    warning: 'bg-white border-[#FDE68A] border-l-[3px] border-l-[#D97706]',
    cobalt: 'bg-white border-[#C7DBFE] border-l-[3px] border-l-[#0254EC]',
    containment: 'bg-white border-[#C7DBFE] border-l-[3px] border-l-[#0254EC]',
    iris: 'bg-white border-[#C7DBFE] border-l-[3px] border-l-[#0254EC]',
  }

  return (
    <div
      className={`border rounded-2xl shadow-[0_1px_3px_rgba(2,84,236,0.04),0_4px_12px_-2px_rgba(2,84,236,0.02)] hover:shadow-[0_12px_32px_-4px_rgba(2,84,236,0.08)] transition-all duration-200 ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  icon,
  title,
  sub,
  right,
  badge,
}: {
  icon?: React.ReactNode
  title: string
  sub?: string
  right?: React.ReactNode
  badge?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#E0E7FF] bg-white rounded-t-2xl">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="p-2.5 rounded-xl bg-[#F5F0FF] text-[#0254EC] border border-[#E0E7FF] shrink-0">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-bold text-sm sm:text-base text-[#393F49] tracking-[-0.02em] truncate">
              {title}
            </h3>
            {badge && (
              <span className="font-sans text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[#BE185D] uppercase tracking-wide">
                {badge}
              </span>
            )}
          </div>
          {sub && (
            <p className="text-xs text-[#717783] truncate mt-0.5">
              {sub}
            </p>
          )}
        </div>
      </div>
      {right && <div className="ml-auto flex items-center gap-2 shrink-0">{right}</div>}
    </div>
  )
}

export function Badge({
  tone = 'slate',
  className = '',
  children,
}: {
  tone?: 'slate' | 'red' | 'emerald' | 'amber' | 'sky' | 'purple' | 'blue' | 'cobalt' | 'iris'
  className?: string
  children: React.ReactNode
}) {
  const tones: Record<string, string> = {
    slate: 'bg-[#F5F0FF] text-[#393F49] border-[#E0E7FF]',
    iris: 'bg-[#F0F5FF] text-[#0254EC] border-[#C7DBFE] font-semibold',
    red: 'bg-[#FDF2F8] text-[#BE185D] border-[#FBCFE8] font-semibold',
    emerald: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] font-semibold',
    amber: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] font-semibold',
    sky: 'bg-[#F0F5FF] text-[#0254EC] border-[#C7DBFE] font-semibold',
    blue: 'bg-[#F0F5FF] text-[#0254EC] border-[#C7DBFE] font-semibold',
    cobalt: 'bg-[#F0F5FF] text-[#0254EC] border-[#C7DBFE] font-semibold',
    purple: 'bg-[#F5F0FF] text-[#6366F1] border-[#E0E7FF] font-semibold',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tabular-nums ${
        tones[tone] || tones.slate
      } ${className}`}
    >
      {children}
    </span>
  )
}

export function Btn({
  variant = 'primary',
  className = '',
  onClick,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'dark' | 'red' | 'green' | 'ghost' | 'outline' | 'amber' | 'cyber' | 'primary' | 'cobalt' | 'iris'
}) {
  const v: Record<string, string> = {
    primary: 'bg-[#0254EC] text-white hover:bg-[#0043C7] border-[#0254EC] shadow-[0_2px_8px_rgba(2,84,236,0.25)] hover:shadow-[0_4px_14px_rgba(2,84,236,0.35)] font-semibold text-xs sm:text-sm rounded-full',
    red: 'bg-[#BE185D] text-white hover:bg-[#9D174D] border-[#BE185D] shadow-[0_2px_8px_rgba(190,24,93,0.25)] hover:shadow-[0_4px_14px_rgba(190,24,93,0.35)] font-semibold text-xs sm:text-sm rounded-full',
    dark: 'bg-[#393F49] text-white hover:bg-[#1F2328] border-[#393F49] shadow-[0_2px_6px_rgba(57,63,73,0.12)] font-semibold text-xs sm:text-sm rounded-full',
    green: 'bg-[#0254EC] text-white hover:bg-[#0043C7] border-[#0254EC] shadow-[0_2px_8px_rgba(2,84,236,0.25)] font-semibold text-xs sm:text-sm rounded-full',
    iris: 'bg-[#0254EC] text-white hover:bg-[#0043C7] border-[#0254EC] shadow-[0_2px_8px_rgba(2,84,236,0.25)] font-semibold text-xs sm:text-sm rounded-full',
    amber: 'bg-[#D97706] text-white hover:bg-[#B45309] border-[#D97706] shadow-[0_2px_8px_rgba(217,119,6,0.2)] font-semibold text-xs sm:text-sm rounded-full',
    cobalt: 'bg-[#0254EC] text-white hover:bg-[#0043C7] border-[#0254EC] shadow-[0_2px_8px_rgba(2,84,236,0.25)] font-semibold text-xs sm:text-sm rounded-full',
    outline: 'border-[#E0E7FF] hover:border-[#C7DBFE] bg-white hover:bg-[#F5F0FF] text-[#393F49] hover:text-[#0254EC] shadow-[0_1px_3px_rgba(2,84,236,0.04)] font-semibold text-xs sm:text-sm rounded-full',
    ghost: 'hover:bg-[#F5F0FF] text-[#717783] hover:text-[#0254EC] border-transparent font-medium text-xs sm:text-sm rounded-full',
    cyber: 'bg-[#0254EC] text-white hover:bg-[#0043C7] border-[#0254EC] shadow-[0_2px_8px_rgba(2,84,236,0.25)] font-semibold text-xs sm:text-sm rounded-full',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playClick()
    if (onClick) onClick(e)
  }

  return (
    <button
      {...p}
      onClick={handleClick}
      className={`px-5 py-2.5 rounded-full border inline-flex items-center justify-center gap-2 transition-all duration-150 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#0254EC] disabled:opacity-40 disabled:cursor-not-allowed ${
        v[variant] || v.primary
      } ${className}`}
    />
  )
}

export function ProgressBar({
  value,
  tone = 'bg-[#0254EC]',
}: {
  value: number
  tone?: string
}) {
  const safeVal = Math.min(100, Math.max(0, value))
  return (
    <div className="h-2 rounded-full bg-[#F5F0FF] border border-[#E0E7FF] overflow-hidden">
      <motion.div
        className={`h-full ${tone}`}
        initial={false}
        animate={{ width: `${safeVal}%` }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </div>
  )
}

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel = 'Confirmer',
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  body: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#393F49]/40 backdrop-blur-[3px] flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.98, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#E0E7FF] text-[#393F49] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-[0_16px_40px_-8px_rgba(2,84,236,0.12)] relative font-sans"
          >
            {/* Header with alert status */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#E0E7FF] mb-4">
              <div
                className={`p-2.5 rounded-xl ${
                  danger ? 'bg-[#FDF2F8] text-[#BE185D] border border-[#FBCFE8]' : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                }`}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#717783] uppercase tracking-wide block">
                  ACTION SÉCURISÉE // VALIDATION DE CELLULE
                </span>
                <h4 className="font-bold text-base text-[#393F49] tracking-tight">{title}</h4>
              </div>
            </div>

            <p className="text-sm text-[#717783] leading-relaxed mb-6 bg-[#F8F4FF] p-4 rounded-xl border border-[#E0E7FF]">
              {body}
            </p>

            <div className="flex justify-end gap-3 pt-2 border-t border-[#E0E7FF]">
              <Btn variant="outline" onClick={onCancel}>
                Annuler
              </Btn>
              <Btn variant={danger ? 'red' : 'primary'} onClick={onConfirm}>
                {confirmLabel}
              </Btn>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Simulateur immersif de rançongiciel */
export function RansomwareSimulatorModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-[#393F49]/80 backdrop-blur-[6px] text-white flex flex-col justify-between p-4 sm:p-8 font-sans select-none overflow-y-auto">
      {/* Top command bar */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5 text-xs text-[#BE185D] font-semibold tracking-wider bg-white/90 px-3 py-1.5 rounded-full border border-white">
          <ShieldAlert size={18} />
          <span>INCIDENT CONFINÉ · SIMULATION FORENSIC OFFICIELLE</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#393F49] hover:bg-[#F5F0FF] text-xs font-semibold transition active:translate-y-[1px] shadow-sm"
        >
          <X size={14} /> Quitter le plein écran
        </button>
      </div>

      {/* Main Breach Card */}
      <div className="max-w-4xl mx-auto w-full my-auto space-y-6 bg-white text-[#393F49] p-6 sm:p-8 rounded-3xl border border-[#E0E7FF] shadow-[0_20px_50px_-10px_rgba(2,84,236,0.18)]">
        <div className="flex items-start gap-4 border-b border-[#E0E7FF] pb-5">
          <div className="p-3 bg-[#FDF2F8] rounded-2xl border border-[#FBCFE8] text-[#BE185D]">
            <Skull size={36} className="animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#BE185D] tracking-wider uppercase">
              VECTEUR D'ATTAQUE : RANÇONGICIEL LOCKBIT 3.0 (T1486)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-[#393F49] uppercase mt-0.5">
              SERVEUR DE FICHIERS COMPROMIS & CHIFFRÉ
            </h1>
            <p className="text-sm text-[#717783] mt-1">
              4 829 fichiers (.docx, .xlsx, .pdf, .mdf) renommés en <span className="font-mono font-bold text-[#BE185D]">.locked</span> sur \\FS-CORP-01\Partages
            </p>
          </div>
        </div>

        {/* Live Attack Metrics Grid */}
        <div className="grid sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8F4FF] border border-[#E0E7FF] text-center font-mono tabular-nums">
          <div className="p-2 border-r border-[#E0E7FF] last:border-r-0">
            <div className="text-[11px] text-[#717783] font-semibold uppercase tracking-wider">COMPTE À REBOURS</div>
            <div className="text-2xl font-bold text-[#BE185D] tracking-wider mt-0.5">71:48:19</div>
          </div>
          <div className="p-2 border-r border-[#E0E7FF] last:border-r-0">
            <div className="text-[11px] text-[#717783] font-semibold uppercase tracking-wider">RANÇON EXIGÉE</div>
            <div className="text-2xl font-bold text-[#D97706] mt-0.5">15.00 BTC (~980 000 €)</div>
          </div>
          <div className="p-2">
            <div className="text-[11px] text-[#717783] font-semibold uppercase tracking-wider">DONNÉES EXFILTRÉES</div>
            <div className="text-2xl font-bold text-[#393F49] mt-0.5">420.5 GB</div>
          </div>
        </div>

        {/* Technical Ransom Note Preview */}
        <div className="bg-[#15171A] p-4 rounded-2xl border border-slate-800 text-xs text-slate-200 font-mono space-y-2">
          <p className="text-[#BE185D] font-bold">
            &gt;&gt;&gt; [ATTACK SUMMARY] ALL SHARED DRIVES ENCRYPTED WITH AES-256-CBC
          </p>
          <p className="text-slate-400 font-sans text-xs">
            Local volume shadow copies (VSS) annihilated via `vssadmin delete shadows /all /quiet`.
            Your private keys are held on our hidden Tor service.
          </p>
          <div className="p-2.5 bg-[#1F2937] rounded-lg border border-[#374151] text-[#0254EC] select-all font-mono font-bold text-[11px] break-all">
            http://lockbitapt73xk4v7l2qm9n8z.onion/meridian-case-915
          </div>
        </div>

        {/* Official DGSSI Institutional Directive */}
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3 text-xs text-[#166534]">
          <ShieldAlert size={20} className="text-[#0254EC] shrink-0 mt-0.5" />
          <div>
            <b className="font-sans text-xs uppercase tracking-wide text-[#15803D] block font-bold">
              DIRECTIVE OFFICIELLE DGSSI / maCERT · RÈGLE ABSOLUE
            </b>
            <p className="mt-1 leading-relaxed text-[#166534] text-xs">
              Ne payez jamais la rançon. Le paiement finance les réseaux criminels, ne garantit en rien l'obtention d'une clé fonctionnelle, et place l'organisation sur la liste des cibles ré-attaquables sous 6 mois. La réponse doit s'appuyer sur la restauration étanche depuis le coffre Air-Gap WORM.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

