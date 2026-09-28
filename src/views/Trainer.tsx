import { useState } from 'react'
import { useGame, fmt } from '../store/GameContext'
import { SCENARIOS, SCORE_RULES, DEBRIEF_Q, REFLEXES, INCIDENT_REF, ORG_NAME } from '../data/mock'
import { Card, CardHeader, Badge, Btn } from '../components/ui'
import { sound } from '../utils/audio'
import {
  Play,
  Pause,
  RotateCcw,
  MonitorUp,
  EyeOff,
  Trophy,
  BookOpen,
  Timer,
  Download,
  Printer,
  Users,
  CheckCheck,
  ListVideo,
  SquarePen,
  Plus,
  Trash2,
  PhoneCall,
  Skull,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
} from 'lucide-react'

function download(name: string, content: string, type: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([content], { type }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function Trainer() {
  const g = useGame()
  const [drawer, setDrawer] = useState(false)
  const [teamSel, setTeamSel] = useState(g.teams[0]?.id ?? 'a')
  const [editingTeam, setEditingTeam] = useState<string | null>(null)
  const sc = SCENARIOS[g.scenario]
  const pending = g.decisionLog.map((d, i) => ({ ...d, idx: i })).filter((d) => d.suggested !== undefined)

  const exportJSON = () => {
    sound.playClick()
    download(
      `${INCIDENT_REF}-session.json`,
      JSON.stringify(
        {
          incident: INCIDENT_REF,
          organisation: ORG_NAME,
          scenarioActif: sc.title,
          timerRestant: fmt(g.timerSeconds),
          equipes: g.teams,
          journalDecisions: g.decisionLog,
          etatsInfrastructure: {
            isoles: g.isolated,
            macroExecutee: g.macroExecuted,
            c2Bloque: g.c2Blocked,
            processusTues: g.processKilled,
            comptesSecurises: g.accountsSecured,
            sauvegardesVerifiees: g.backupsChecked,
            celluleCrise: g.crisisCell,
            activiteStoppee: g.activityHalted,
            comValidee: g.commValidated,
            ranconPayee: g.ransomPaid,
          },
        },
        null,
        2
      ),
      'application/json'
    )
  }

  const exportCSV = () => {
    sound.playClick()
    const rows = [
      ['Heure', 'Equipe', 'Decision', 'Points_Suggérés'],
      ...g.decisionLog.map((d) => [d.time, d.team, `"${d.text.replace(/"/g, '""')}"`, d.suggested ?? '']),
    ]
    download(`${INCIDENT_REF}-journal-arbitrage.csv`, rows.map((r) => r.join(';')).join('\n'), 'text/csv')
  }

  const renameTeam = (id: string, name: string) => {
    g.update({ teams: g.teams.map((t) => (t.id === id ? { ...t, name } : t)) })
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 text-slate-100">
      {/* Barre d'action supérieure du Formateur */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="red">
            <Timer size={13} /> CHRONO SESSION 30:00 · {fmt(g.timerSeconds)}
          </Badge>
          <Btn
            variant={g.timerRunning ? 'outline' : 'green'}
            onClick={() => {
              sound.playClick()
              g.update({ timerRunning: !g.timerRunning })
            }}
          >
            {g.timerRunning ? (
              <>
                <Pause size={14} /> Mettre en Pause
              </>
            ) : (
              <>
                <Play size={14} /> Démarrer le Chronomètre
              </>
            )}
          </Btn>
          <Btn
            variant="ghost"
            onClick={() => {
              sound.playClick()
              g.update({ timerSeconds: 30 * 60 })
            }}
          >
            Reset 30:00
          </Btn>
          <Btn
            variant="ghost"
            onClick={() => {
              sound.playClick()
              g.reset()
            }}
          >
            <RotateCcw size={14} /> Nouvelle Session
          </Btn>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={g.toggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {g.soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <Btn variant="outline" onClick={exportJSON}>
            <Download size={14} /> Export JSON
          </Btn>
          <Btn variant="outline" onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </Btn>
          <Btn
            variant="amber"
            onClick={() => {
              sound.playClick()
              setDrawer(true)
            }}
          >
            <BookOpen size={14} /> Fiche A4 Recto/Verso
          </Btn>
        </div>
      </div>

      {/* Grille principale : Régie de Scénario & File de Validation */}
      <div className="grid lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 space-y-4">
          {/* Pilotage de la Chronologie */}
          <Card>
            <CardHeader
              icon={<ListVideo size={16} />}
              title="Régie de Scénario & Déroulé Pédagogique"
              sub="Intro 3′ · S1 Détection 5′ · S2 Propagation 5′ · S3 Crise 5′ · S4 Communication 4′ · Débrief 8′"
            />
            <div className="p-4 space-y-4">
              {/* Stepper horizontal */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                {SCENARIOS.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        sound.playClick()
                        g.update({ scenario: s.id, questionVisible: false })
                        g.log(`Scénario activé : ${s.title}`, 'Formateur')
                      }}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                        g.scenario === s.id
                          ? 'bg-red-600 text-white shadow-lg shadow-red-950/80 border border-red-500'
                          : i < g.scenario
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="mono">{s.time}</span> · {s.title}
                    </button>
                    {i < SCENARIOS.length - 1 && <span className="w-2 h-px bg-slate-800" />}
                  </div>
                ))}
              </div>

              {/* Fiche active du formateur */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="red">{sc.time} · {sc.duration}</Badge>
                    <b className="text-sm text-white">{sc.title}</b>
                  </div>
                  <div className="flex items-center gap-2">
                    <Btn
                      variant="red"
                      onClick={() => {
                        sound.playAlarm()
                        g.update({ questionVisible: true })
                      }}
                    >
                      <MonitorUp size={13} /> Projeter « QUE FAITES-VOUS ? »
                    </Btn>
                    <Btn
                      variant="outline"
                      onClick={() => {
                        sound.playClick()
                        g.update({ questionVisible: false })
                      }}
                    >
                      <EyeOff size={13} /> Masquer
                    </Btn>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  {sc.situation.map((s, i) => (
                    <p key={i} className="leading-relaxed">
                      📢 {s}
                    </p>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700/80 text-white text-xs font-bold">
                  ❓ Question soumise aux participants : {sc.question}
                </div>

                {/* Réponses attendues et pièges */}
                <div className="grid md:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                      RÉPONSES RECHERCHÉES PAR LE FORMATEUR :
                    </div>
                    {sc.expected.map((e) => (
                      <div key={e.title} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <b className="text-emerald-300">{e.title} :</b>{' '}
                        <span className="text-slate-300">{e.detail}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                      PIÈGES À FAIRE RESSORTIR (MAUVAISES RÉPONSES) :
                    </div>
                    {sc.traps.map((t) => (
                      <div
                        key={t.bad}
                        className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200"
                      >
                        <b>{t.bad}</b>
                        <p className="text-[11px] text-slate-400 mt-1 italic">➜ Question relance : {t.followUp}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-sky-300 font-bold flex items-center gap-2">
                  <span>🎯 Message clé :</span>
                  <span>{sc.keyMessage}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Suite d'Injecteurs d'Incidents en Direct */}
          <Card>
            <CardHeader
              icon={<Zap size={16} className="text-amber-400" />}
              title="Injecteurs d'Incidents en Direct (Événements de Crise)"
              sub="Déclenchez des surprises en temps réel sur les écrans des participants"
            />
            <div className="p-4 grid sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => {
                  g.triggerDirectorCall()
                  g.log('INJECT : Appel urgent du Directeur Général déclenché', 'Formateur')
                }}
                className="p-3 rounded-xl bg-amber-950/40 border border-amber-600 hover:bg-amber-900/40 text-left transition"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                  <PhoneCall size={15} /> Déclencher Appel du DG
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Fait sonner le téléphone avec la demande d'arbitrage.</p>
              </button>

              <button
                onClick={() => {
                  sound.playAlarm()
                  g.update({ lockscreenOpen: true })
                  g.log('INJECT : Écran de rançon LockBit 3.0 activé', 'Formateur')
                }}
                className="p-3 rounded-xl bg-red-950/40 border border-red-600 hover:bg-red-900/40 text-left transition"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-red-300">
                  <Skull size={15} /> Déclencher Écran LockBit
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Affiche la note de rançon plein écran menaçante.</p>
              </button>

              <button
                onClick={() => {
                  sound.playClick()
                  g.update({ c2Blocked: true })
                  g.log('INJECT : Blocage automatique C2 au pare-feu', 'Formateur')
                }}
                className="p-3 rounded-xl bg-sky-950/40 border border-sky-600 hover:bg-sky-900/40 text-left transition"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-sky-300">
                  <Radio size={15} /> Forcer Blocage C2 Firewall
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Valide la coupure des communications malveillantes.</p>
              </button>
            </div>
          </Card>

          {/* File de validation & arbitrage des décisions */}
          <Card>
            <CardHeader
              icon={<CheckCheck size={16} />}
              title="File d'Arbitrage des Décisions Équipes"
              sub="Actions proposées par les participants — attribution en 1 clic selon le barème officiel"
              right={<Badge tone="amber">{pending.length} action(s) en attente</Badge>}
            />
            <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
              {pending.length === 0 && (
                <p className="text-xs text-slate-500 italic py-2">
                  Aucune proposition en attente. Les actions prises par les équipes dans l'Espace Entreprise apparaîtront ici.
                </p>
              )}
              {pending.map((d) => (
                <div
                  key={d.idx}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="mono text-slate-500">{d.time}</span>
                      <b className="text-sky-300">{d.team}</b>
                      <Badge tone={d.suggested! >= 0 ? 'emerald' : 'red'}>
                        {d.suggested! > 0 ? `+${d.suggested}` : d.suggested} pts suggérés
                      </Badge>
                    </div>
                    <p className="text-slate-300 font-semibold">{d.text}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Btn
                      variant="green"
                      onClick={() => {
                        const t = g.teams.find((x) => x.name === d.team) ?? g.teams[0]
                        g.addScore(t.id, d.text, d.suggested!)
                        // Retirer de la file d'attente
                        const nextLog = [...g.decisionLog]
                        delete nextLog[d.idx].suggested
                        g.update({ decisionLog: nextLog })
                      }}
                    >
                      Valider (+/-)
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Panneau latéral droit : Barème & Gestion des Équipes */}
        <aside className="space-y-4">
          {/* Classement et Équipes */}
          <Card>
            <CardHeader
              icon={<Trophy size={16} className="text-amber-400" />}
              title="Tableau des Scores en Direct"
              sub="Suivi des équipes en temps réel"
            />
            <div className="p-4 space-y-3">
              {g.teams.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    {editingTeam === t.id ? (
                      <input
                        defaultValue={t.name}
                        onBlur={(e) => {
                          renameTeam(t.id, e.target.value)
                          setEditingTeam(null)
                        }}
                        className="bg-slate-900 border border-sky-500 px-2 py-0.5 rounded text-xs font-bold text-white outline-none"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <b className="text-slate-200">{t.name}</b>
                        <button onClick={() => setEditingTeam(t.id)} className="text-slate-500 hover:text-white">
                          <SquarePen size={12} />
                        </button>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 mt-0.5">{t.history.length} action(s) notée(s)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mono font-black text-sm text-amber-400">{t.score} pts</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => g.addScore(t.id, 'Bonus Formateur', 1)}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded font-bold text-[10px] text-emerald-400"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => g.addScore(t.id, 'Pénalité Formateur', -1)}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded font-bold text-[10px] text-red-400"
                      >
                        -1
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Barème Officiel de l'Exercice */}
          <Card>
            <CardHeader icon={<BookOpen size={16} />} title="Barème Officiel de l'Exercice" sub="Attribution rapide en 1 clic" />
            <div className="p-3 space-y-1.5 max-h-[360px] overflow-y-auto text-xs">
              <div className="text-[11px] text-slate-400 font-bold mb-2">Choisir l'équipe cible :</div>
              <select
                value={teamSel}
                onChange={(e) => setTeamSel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2 text-xs font-bold mb-3 outline-none"
              >
                {g.teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {SCORE_RULES.map((r, i) => (
                <button
                  key={i}
                  onClick={() => g.addScore(teamSel, r.label, r.points)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left transition group"
                >
                  <span className="text-[11px] text-slate-300 group-hover:text-white truncate max-w-[200px]">{r.label}</span>
                  <Badge tone={r.points > 0 ? 'emerald' : 'red'} className="shrink-0 font-mono">
                    {r.points > 0 ? `+${r.points}` : r.points}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        </aside>
      </div>

      {/* Modal Fiche A4 Recto/Verso pour le Formateur */}
      {drawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 space-y-4 my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-amber-400" />
                <span className="font-extrabold text-sm text-white">FICHE FORMATEUR OFFICIELLE (A4 RECTO / VERSO)</span>
              </div>
              <div className="flex items-center gap-2">
                <Btn
                  variant="green"
                  onClick={() => {
                    sound.playClick()
                    window.print()
                  }}
                >
                  <Printer size={14} /> Imprimer la Fiche
                </Btn>
                <button onClick={() => setDrawer(false)} className="text-slate-400 hover:text-white text-xs">
                  ✕ Fermer
                </button>
              </div>
            </div>

            {/* Contenu imprimable */}
            <div id="fiche-print" className="grid md:grid-cols-2 gap-4 text-xs">
              {/* RECTO */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-extrabold text-sm text-sky-400 uppercase border-b border-slate-800 pb-1">
                  RECTO — Déroulé Chronologique
                </div>
                <div className="space-y-2 text-slate-300">
                  <div>
                    <b className="text-white">09h00 (Intro - 3′) :</b> Mise en situation, constitution des équipes de 3 à 5
                    collaborateurs. Pas d'anticipation du scénario.
                  </div>
                  <div>
                    <b className="text-white">09h15 (Scénario 1 - 5′) :</b> Phishing reçu par Sophie. Pièce jointe Word avec
                    macro. Ralentissement anormal du PC.
                  </div>
                  <div>
                    <b className="text-white">09h25 (Scénario 2 - 5′) :</b> Le SOC détecte une balise C2. Propagation SMB
                    vers HOST_02, HOST_03 et le serveur de fichiers.
                  </div>
                  <div>
                    <b className="text-white">09h40 (Scénario 3 - 5′) :</b> Fichiers chiffrés en .locked. Demande de 15 BTC.
                    Appel urgent du Directeur Général.
                  </div>
                  <div>
                    <b className="text-white">09h50 (Scénario 4 - 4′) :</b> Fuite sur WhatsApp groupe Bureau. Appel du
                    journaliste de La Voix Éco.
                  </div>
                  <div>
                    <b className="text-white">10h00 (Débrief - 8′) :</b> 4 questions d'apprentissage et ancrage des 5
                    réflexes.
                  </div>
                </div>
              </div>

              {/* VERSO */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-extrabold text-sm text-emerald-400 uppercase border-b border-slate-800 pb-1">
                  VERSO — Réponses Attendues & 5 Réflexes
                </div>
                <div className="space-y-2 text-slate-300">
                  <div>
                    <b className="text-emerald-300">Phishing :</b> Alerter immédiatement + Isoler du réseau (sans éteindre le
                    PC) + Préserver les preuves.
                  </div>
                  <div>
                    <b className="text-emerald-300">Propagation :</b> Contenir d'urgence + Bloquer C2 au pare-feu + Isoler
                    les hôtes + Vérifier l'étanchéité des sauvegardes.
                  </div>
                  <div>
                    <b className="text-emerald-300">Rançongiciel :</b> Décision collégiale en cellule de crise. Ne jamais
                    payer dans la précipitation (directive DGSSI).
                  </div>
                  <div>
                    <b className="text-emerald-300">Communication :</b> Une seule voix validée. Zéro détail technique
                    exploitable divulgué.
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <b className="text-white">LES 5 RÉFLEXES :</b>
                    <ol className="list-decimal ml-4 mt-1 space-y-0.5 text-slate-300 font-bold">
                      <li>DÉTECTER</li>
                      <li>ALERTER</li>
                      <li>ISOLER / CONTENIR</li>
                      <li>ANALYSER / DÉCIDER</li>
                      <li>COMMUNIQUER / RESTAURER</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
