import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame, fmt } from '../store/GameContext'
import { SCENARIOS, DEBRIEF_Q, REFLEXES, VOTE_OPTIONS, INCIDENT_REF, ORG_NAME } from '../data/mock'
import { Badge } from '../components/ui'
import { sound } from '../utils/audio'
import {
  ShieldAlert,
  Trophy,
  Maximize,
  Minimize,
  Timer,
  Eye,
  EyeOff,
  BarChart3,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Volume2,
  VolumeX,
  Radio,
  Vote,
  Sparkles,
  HelpCircle,
  Skull,
} from 'lucide-react'

function discFmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function Presentation() {
  const g = useGame()
  const sc = SCENARIOS[g.scenario]
  const [revealed, setRevealed] = useState(0)
  const [showAttendus, setShowAttendus] = useState(false)
  const [discSecs, setDiscSecs] = useState(120)
  const [discRun, setDiscRun] = useState(false)
  const [isFull, setIsFull] = useState(false)

  const options = VOTE_OPTIONS[g.scenario] ?? []
  const counts = g.votes[g.scenario] ?? []
  const totalVotes = counts.reduce((a, b) => a + (b ?? 0), 0)

  useEffect(() => {
    setRevealed(0)
    setShowAttendus(false)
    setDiscSecs(120)
    setDiscRun(false)
  }, [g.scenario])

  useEffect(() => {
    if (!discRun) return
    if (discSecs <= 0) {
      setDiscRun(false)
      sound.playAlarm()
      return
    }
    const id = setInterval(() => setDiscSecs((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [discRun, discSecs])

  useEffect(() => {
    const onFull = () => setIsFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFull)
    return () => document.removeEventListener('fullscreenchange', onFull)
  }, [])

  const go = (id: number) => {
    const next = Math.max(0, Math.min(SCENARIOS.length - 1, id))
    sound.playClick()
    g.update({ scenario: next, questionVisible: false })
    g.log(`Projection salle ➔ ${SCENARIOS[next].title}`, 'Projection')
  }

  const toggleFull = () => {
    sound.playClick()
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else document.documentElement.requestFullscreen().catch(() => {})
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') go(g.scenario + 1)
      else if (e.key === 'ArrowLeft') go(g.scenario - 1)
      else if (e.key === 'q' || e.key === 'Q') g.update({ questionVisible: !g.questionVisible })
      else if (e.key === 't' || e.key === 'T') setDiscRun((r) => !r)
      else if (e.key === 'f' || e.key === 'F') toggleFull()
      else if (e.key === 'm' || e.key === 'M') g.toggleSound()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.scenario, g.questionVisible])

  // Vue Débriefing Final (Scénario 5)
  if (g.scenario === 5) {
    const recap = [1, 2, 3, 4].map((id) => {
      const opts = VOTE_OPTIONS[id] ?? []
      const c = g.votes[id] ?? []
      let top = -1
      c.forEach((v, i) => {
        if ((v ?? 0) > 0 && (top === -1 || v > (c[top] ?? 0))) top = i
      })
      return {
        id,
        top,
        label: top >= 0 ? opts[top]?.label : 'Aucun vote',
        isGood: top >= 0 ? opts[top]?.good : true,
        votes: top >= 0 ? c[top] : 0,
        total: c.reduce((a, b) => a + (b ?? 0), 0),
      }
    })

    return (
      <div className="min-h-screen bg-[#070b12] text-white p-6 md:p-10 flex flex-col justify-between select-none">
        <div className="max-w-6xl mx-auto w-full space-y-6">
          {/* Header Débrief */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert size={16} /> {ORG_NAME} · BILAN DE L'INCIDENT {INCIDENT_REF}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={g.toggleSound}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                {g.soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                onClick={toggleFull}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                {isFull ? <Minimize size={15} /> : <Maximize size={15} />}
              </button>
            </div>
          </div>

          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              🏁 DÉBRIEFING DE CRISE & ENSEIGNEMENTS
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              « En cybersécurité, la technologie seule ne suffit pas. La rapidité du signalement, la coordination des équipes et la qualité de la prise de décision peuvent limiter son impact. »
            </p>
          </div>

          {/* Les 5 Réflexes Vitaux */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {REFLEXES.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl bg-gradient-to-b from-red-600 to-red-800 border border-red-500/80 shadow-xl shadow-red-950/60 text-center space-y-1"
              >
                <div className="text-[10px] font-black uppercase text-red-200">RÉFLEXE {r.step}</div>
                <div className="font-extrabold text-xs sm:text-sm text-white tracking-wide">{r.title}</div>
                <p className="text-[10px] text-red-100 leading-snug pt-1 opacity-90">{r.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Grille Bilan Décisions & Classement */}
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* Questions Pédagogiques */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
              <h3 className="font-extrabold text-sm text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle size={16} /> 4 Questions Clés du Débrief
              </h3>
              <div className="space-y-2.5 divide-y divide-slate-800/80">
                {DEBRIEF_Q.map((d, i) => (
                  <div key={i} className="pt-2 first:pt-0 space-y-1">
                    <b className="text-slate-200 block">
                      {i + 1}. {d.q}
                    </b>
                    <p className="text-slate-400 text-[11px] leading-relaxed italic">➜ {d.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Décisions de la salle */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
              <h3 className="font-extrabold text-sm text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 size={16} /> Choix de la Salle aux Pauses
              </h3>
              <div className="space-y-2">
                {recap.map((r) => (
                  <div key={r.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>SCÉNARIO {r.id}</span>
                      <span>
                        {r.votes} / {r.total} votes
                      </span>
                    </div>
                    <div className={`font-bold ${r.isGood ? 'text-emerald-400' : 'text-red-400'}`}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Classement final des équipes */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
              <h3 className="font-extrabold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy size={16} /> Palmarès de l'Exercice
              </h3>
              <div className="space-y-2">
                {[...g.teams]
                  .sort((a, b) => b.score - a.score)
                  .map((t, idx) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                        <b className="text-slate-200">{t.name}</b>
                      </div>
                      <span className="mono font-black text-sm text-amber-400">{t.score} pts</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation bas */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-500">
          <button onClick={() => go(4)} className="flex items-center gap-1 hover:text-white">
            <ChevronLeft size={14} /> Revenir au Scénario 4
          </button>
          <span className="mono">CYCLE TERMINÉ · TOUS SERVICES PROTÉGÉS</span>
          <button onClick={() => go(0)} className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold">
            <RotateCcw size={14} /> Relancer l'Exercice
          </button>
        </div>
      </div>
    )
  }

  // Vue Scénario Cinématographique 0 à 4
  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col justify-between p-6 md:p-10 select-none relative overflow-hidden">
      {/* Halo d'ambiance selon le scénario */}
      <div
        className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${
          g.scenario >= 3 ? 'bg-red-600/20' : g.scenario >= 1 ? 'bg-amber-500/15' : 'bg-sky-500/10'
        }`}
      />

      {/* Barre supérieure de projection */}
      <header className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-red-600 shadow-lg shadow-red-900/50">
            <ShieldAlert size={18} />
          </span>
          <div>
            <div className="font-extrabold text-sm tracking-wider uppercase text-white">
              {ORG_NAME} <span className="text-slate-500 font-normal">· Serious Game Cyber</span>
            </div>
            <div className="mono text-[11px] text-slate-400">
              {INCIDENT_REF} · {sc.time} · {sc.duration}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="mono text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Timer size={14} className="text-red-500" />
            <span>CHRONO 30:00 · {fmt(g.timerSeconds)}</span>
          </div>
          <button
            onClick={g.toggleSound}
            title="Activer / Couper le son (M)"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
          >
            {g.soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <button
            onClick={toggleFull}
            title="Plein Écran (F)"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
          >
            {isFull ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </header>

      {/* Contenu de la scène */}
      <main className="max-w-5xl mx-auto w-full my-auto space-y-6 relative z-10">
        {/* Titre de l'épisode */}
        <div className="text-center space-y-2">
          <Badge tone="red" className="text-xs px-3 py-1 uppercase tracking-wider">
            <Radio size={12} className="animate-pulse" /> {sc.time} — {sc.title}
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            {sc.situation[0]}
          </h2>
        </div>

        {/* Détail de la situation */}
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/80 shadow-2xl backdrop-blur-md space-y-3 max-w-3xl mx-auto">
          {sc.situation.slice(1).map((line, idx) => (
            <p key={idx} className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
              📢 {line}
            </p>
          ))}
        </div>

        {/* Bloc interactif « PAUSE — QUE FAITES-VOUS ? » */}
        {sc.id > 0 && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-black to-red-950/80 border border-red-600 shadow-2xl text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-widest alert-pulse-red">
                PAUSE — À VOUS DE DÉCIDER
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white">{sc.question}</h3>

              {/* Compte à rebours de discussion 2 min */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    sound.playClick()
                    setDiscRun(!discRun)
                  }}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition"
                >
                  <Timer size={14} className="text-amber-400" />
                  <span>Discussion équipe : {discFmt(discSecs)}</span>
                  <span className="text-[10px] text-slate-400">({discRun ? 'En cours' : 'Lancer'})</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick()
                    setDiscSecs(120)
                    setDiscRun(false)
                  }}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  Reset 2′
                </button>
              </div>
            </div>

            {/* Options de vote de la salle */}
            {options.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-2.5">
                {options.map((opt, i) => {
                  const voteCount = counts[i] ?? 0
                  const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0

                  return (
                    <button
                      key={i}
                      onClick={() => g.castVote(sc.id, i, options.length)}
                      className={`p-3.5 rounded-2xl border text-left transition relative overflow-hidden ${
                        showAttendus
                          ? opt.good
                            ? 'bg-emerald-950/60 border-emerald-500'
                            : 'bg-red-950/60 border-red-500/80 opacity-70'
                          : 'bg-slate-950 hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      {/* Jauge de vote */}
                      {totalVotes > 0 && (
                        <div
                          className="absolute inset-y-0 left-0 bg-white/5 pointer-events-none transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      )}
                      <div className="flex items-center justify-between text-xs font-bold relative z-10">
                        <span className="text-slate-200">
                          {i + 1}. {opt.label}
                        </span>
                        <span className="mono text-slate-400 shrink-0 ml-2">
                          {voteCount} vote{voteCount > 1 ? 's' : ''} ({pct}%)
                        </span>
                      </div>
                      {showAttendus && (
                        <p className="text-[11px] text-slate-400 mt-1 relative z-10 italic">{opt.explanation}</p>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Contrôles animateur pour révéler les réponses attendues */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playSuccess()
                    setShowAttendus(!showAttendus)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold transition"
                >
                  {showAttendus ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showAttendus ? 'Masquer Réponses' : 'Révéler les Réponses Attendues'}</span>
                </button>
                {totalVotes > 0 && (
                  <button onClick={() => g.resetVotes(sc.id)} className="text-slate-500 hover:text-white">
                    Effacer les votes ({totalVotes})
                  </button>
                )}
              </div>
              <span className="text-slate-500 mono">Raccourcis : [Espace] [Flèches ➔ / ⬅] [F Plein Écran] [M Son]</span>
            </div>
          </div>
        )}
      </main>

      {/* Barre de navigation chronologique inférieure */}
      <footer className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-3 relative z-10 text-xs">
        <button
          disabled={g.scenario === 0}
          onClick={() => go(g.scenario - 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 font-bold text-slate-300"
        >
          <ChevronLeft size={14} /> Scène Précédente
        </button>

        {/* Stepper des scènes */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                g.scenario === s.id
                  ? 'bg-red-600 text-white shadow'
                  : s.id < g.scenario
                  ? 'bg-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-900/60 text-slate-500 hover:text-slate-300'
              }`}
            >
              {s.id === 0 ? 'Intro' : s.id === 5 ? 'Débrief' : `S${s.id} · ${s.time}`}
            </button>
          ))}
        </div>

        <button
          disabled={g.scenario === SCENARIOS.length - 1}
          onClick={() => go(g.scenario + 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-white shadow-md shadow-red-950"
        >
          <span>Scène Suivante</span>
          <ChevronRight size={14} />
        </button>
      </footer>
    </div>
  )
}
