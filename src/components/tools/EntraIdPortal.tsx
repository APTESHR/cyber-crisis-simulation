import React, { useState } from 'react'
import { useGame } from '../../store/GameContext'
import { SESSIONS } from '../../data/mock'
import { sound } from '../../utils/audio'
import {
  KeyRound,
  ShieldAlert,
  Search,
  Check,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  UserCheck,
  Lock,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react'

export default function EntraIdPortal({
  onAction,
}: {
  onAction: (text: string, suggested?: number, patch?: Parameters<ReturnType<typeof useGame>['update']>[0]) => void
}) {
  const g = useGame()
  const [revoked, setRevoked] = useState<number[]>([])

  return (
    <div className="rounded-2xl border border-offsec-red/30 bg-[#0d0f17] shadow-2xl overflow-hidden text-slate-200 select-none">
      {/* Barre supérieure Microsoft Azure Portal */}
      <div className="bg-[#002b5c] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-tight flex items-center gap-2">
            <span className="w-4 h-4 bg-sky-400 rotate-45 inline-block" /> Microsoft Entra ID Admin Center
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 font-mono text-[11px]">meridian-corp.onmicrosoft.com</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-offsec-cyan">Azure AD Premium P2</span>
          <span className="text-slate-500">·</span>
          <span>admin@meridian.eu</span>
        </div>
      </div>

      {/* Lame Azure Navigation & Contenu */}
      <div className="flex flex-col md:flex-row min-h-[420px]">
        {/* Menu latéral gauche Azure Blade */}
        <div className="w-full md:w-56 bg-[#0a0c13] border-r border-slate-800 p-3 space-y-1 text-xs font-mono text-slate-400">
          <div className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">GESTION DES IDENTITÉS</div>
          <div className="p-2 rounded hover:bg-white/5 flex items-center gap-2">
            Vue d'ensemble
          </div>
          <div className="p-2 rounded bg-[#1a2030] text-white font-bold flex items-center gap-2">
            <UserCheck size={14} className="text-sky-400" /> Utilisateurs (Sophie RH)
          </div>
          <div className="p-2 rounded hover:bg-white/5 flex items-center gap-2 text-offsec-red font-bold">
            <ShieldAlert size={14} /> Journaux de connexion (47)
          </div>
          <div className="p-2 rounded hover:bg-white/5 flex items-center gap-2 text-slate-400">
            <Smartphone size={14} /> Méthodes MFA & Clés FIDO2
          </div>
          <div className="p-2 rounded hover:bg-white/5 flex items-center gap-2 text-slate-400">
            <Lock size={14} /> Accès Conditionnel
          </div>
        </div>

        {/* Tableau des sessions et de l'attaque MFA Fatigue */}
        <div className="flex-1 bg-[#07090e] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white font-mono">
                  Journaux de Connexion Interactifs & Événements MFA
                </h3>
                <span className="text-xs text-slate-400">
                  Filtré sur l'identité : <b>sophie.rh@meridian-groupe.fr</b> (ID : usr-489201)
                </span>
              </div>
              {g.accountsSecured ? (
                <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                  <Check size={12} /> Comptes Sécurisés
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded bg-red-950/80 border border-offsec-red text-offsec-red text-xs font-mono font-bold flex items-center gap-1">
                  <AlertTriangle size={12} /> 2 Sessions Compromises
                </span>
              )}
            </div>

            {/* Alerte MFA Fatigue nocturne */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-offsec-amber/60 text-xs text-amber-200 font-mono space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-offsec-amber">
                <Smartphone size={14} /> ALERTE DÉTECTION : MFA PUSH FATIGUE ATTACK (T1621)
              </div>
              <p className="text-slate-300">
                47 requêtes push consécutives émises vers le Microsoft Authenticator de Sophie entre 03:12 et 03:15
                depuis une adresse IP étrangère (185.22.14.89 Sofia, Bulgarie). Une approbation a été enregistrée à 03:15.
              </p>
            </div>

            {/* Tableau des sessions actives */}
            <div className="space-y-2 font-mono text-xs">
              {SESSIONS.map((s, i) => (
                <div
                  key={i}
                  className="p-3 bg-black/70 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <b className="text-white">{s.user}</b>
                      <span className="text-slate-400">{s.source}</span>
                      <span className="text-[10px] text-slate-500">[{s.via}]</span>
                      {s.suspicious && !revoked.includes(i) && (
                        <span className="px-1.5 py-0.2 bg-red-950 text-offsec-red border border-red-800 rounded text-[10px] font-bold">
                          SUSPECTE // C2 IP
                        </span>
                      )}
                      {revoked.includes(i) && (
                        <span className="px-1.5 py-0.2 bg-slate-900 text-slate-400 rounded text-[10px]">
                          RÉVOQUÉE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{s.details}</p>
                  </div>

                  {!revoked.includes(i) && (
                    <button
                      onClick={() => {
                        sound.playClick()
                        setRevoked([...revoked, i])
                        onAction(`Session révoquée d'urgence pour ${s.user} (${s.source})`, undefined)
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold"
                    >
                      Révoquer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'action IAM */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
            {!g.accountsSecured ? (
              <button
                onClick={() =>
                  onAction('Comptes protégés : reset contrôlé, révocation globale des jetons OAuth, MFA FIDO2 forcé', 2, {
                    accountsSecured: true,
                  })
                }
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold shadow-lg shadow-emerald-950"
              >
                Sécuriser tous les comptes & Révoquer les jetons (+2)
              </button>
            ) : (
              <p className="text-xs text-emerald-400 font-mono font-bold">
                ✓ Politique IAM appliquée : mots de passe renouvelés via LAPS, sessions purgées, clé FIDO2 exigée.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
