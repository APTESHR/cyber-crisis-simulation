import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { sound } from '../utils/audio'

export interface Team {
  id: string
  name: string
  score: number
  history: { label: string; points: number; time: string }[]
}

export interface DecisionEntry {
  time: string
  team: string
  text: string
  suggested?: number
}

interface GameState {
  scenario: number // 0 intro, 1..4 scénarios, 5 débrief
  timerSeconds: number
  timerRunning: boolean
  questionVisible: boolean
  soundMuted: boolean
  teams: Team[]
  decisionLog: DecisionEntry[]
  isolated: Record<string, boolean>
  macroExecuted: boolean
  c2Blocked: boolean
  processKilled: boolean
  ramDumped: boolean
  accountsSecured: boolean
  backupsChecked: boolean
  crisisCell: boolean
  activityHalted: boolean
  commValidated: boolean
  ransomPaid: boolean
  directorCallActive: boolean
  directorCallAnswered: boolean
  directorCallReaction: string | null
  lockscreenOpen: boolean
  votes: Record<number, number[]>
}

const DEFAULT_TEAMS: Team[] = [
  { id: 'a', name: 'Équipe Alpha (SOC / Blue Team)', score: 0, history: [] },
  { id: 'b', name: 'Équipe Bravo (Cellule de Crise)', score: 0, history: [] },
  { id: 'c', name: 'Équipe Charlie (Direction & IT)', score: 0, history: [] },
]

const DEFAULT_STATE: GameState = {
  scenario: 0,
  timerSeconds: 30 * 60,
  timerRunning: false,
  questionVisible: false,
  soundMuted: false,
  teams: DEFAULT_TEAMS,
  decisionLog: [],
  isolated: {
    HOST_01: false,
    HOST_02: false,
    HOST_03: false,
    DC_CORP_01: false,
    FILE_SERVER: false,
    NAS_VEEAM: false,
  },
  macroExecuted: false,
  c2Blocked: false,
  processKilled: false,
  ramDumped: false,
  accountsSecured: false,
  backupsChecked: false,
  crisisCell: false,
  activityHalted: false,
  commValidated: false,
  ransomPaid: false,
  directorCallActive: false,
  directorCallAnswered: false,
  directorCallReaction: null,
  lockscreenOpen: false,
  votes: {},
}

const KEY = 'meridian-cyber-game-v3'

function load(): GameState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_STATE
}

interface Ctx extends GameState {
  update: (patch: Partial<GameState>) => void
  reset: () => void
  addScore: (teamId: string, label: string, points: number) => void
  log: (text: string, team?: string, suggested?: number) => void
  castVote: (scenarioId: number, optionIdx: number, slots?: number) => void
  resetVotes: (scenarioId?: number) => void
  toggleSound: () => void
  triggerDirectorCall: () => void
}

const GameCtx = createContext<Ctx | null>(null)
let channel: BroadcastChannel | null = null

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(load)

  useEffect(() => {
    sound.setMuted(state.soundMuted)
  }, [state.soundMuted])

  useEffect(() => {
    channel = new BroadcastChannel('meridian-cyber-game')
    channel.onmessage = (e) => {
      setState(e.data)
      if (typeof e.data.soundMuted === 'boolean') {
        sound.setMuted(e.data.soundMuted)
      }
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        const parsed = { ...DEFAULT_STATE, ...JSON.parse(e.newValue) }
        setState(parsed)
        sound.setMuted(parsed.soundMuted)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      channel?.close()
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const persist = useCallback((s: GameState) => {
    localStorage.setItem(KEY, JSON.stringify(s))
    channel?.postMessage(s)
  }, [])

  useEffect(() => {
    if (!state.timerRunning) return
    const id = setInterval(() => {
      setState((s) => {
        const next = { ...s, timerSeconds: Math.max(0, s.timerSeconds - 1) }
        localStorage.setItem(KEY, JSON.stringify(next))
        channel?.postMessage(next)
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [state.timerRunning])

  const update = useCallback((patch: Partial<GameState>) => {
    setState((s) => {
      const next = { ...s, ...patch }
      persist(next)
      return next
    })
  }, [persist])

  const reset = useCallback(() => {
    persist(DEFAULT_STATE)
    setState(DEFAULT_STATE)
  }, [persist])

  const toggleSound = useCallback(() => {
    setState((s) => {
      const newMuted = !s.soundMuted
      sound.setMuted(newMuted)
      if (!newMuted) sound.playClick()
      const next = { ...s, soundMuted: newMuted }
      persist(next)
      return next
    })
  }, [persist])

  const triggerDirectorCall = useCallback(() => {
    setState((s) => {
      sound.playPhoneRing()
      const next = { ...s, directorCallActive: true, directorCallAnswered: false, directorCallReaction: null }
      persist(next)
      return next
    })
  }, [persist])

  const addScore = useCallback((teamId: string, label: string, points: number) => {
    setState((s) => {
      if (points > 0) sound.playSuccess()
      else if (points < 0) sound.playError()

      const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      const teams = s.teams.map((t) =>
        t.id === teamId ? { ...t, score: t.score + points, history: [...t.history, { label, points, time }] } : t
      )
      const next = {
        ...s,
        teams,
        decisionLog: [
          { time, team: teams.find((t) => t.id === teamId)?.name ?? '', text: `${label} (${points > 0 ? '+' : ''}${points})` },
          ...s.decisionLog,
        ],
      }
      persist(next)
      return next
    })
  }, [persist])

  const log = useCallback((text: string, team = 'Système', suggested?: number) => {
    setState((s) => {
      const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      const next = { ...s, decisionLog: [{ time, team, text, suggested }, ...s.decisionLog] }
      persist(next)
      return next
    })
  }, [persist])

  const castVote = useCallback((scenarioId: number, optionIdx: number, slots?: number) => {
    setState((s) => {
      sound.playClick()
      const size = slots ?? s.votes[scenarioId]?.length ?? 4
      const cur = [...(s.votes[scenarioId] ?? blankVotes(size))]
      while (cur.length < size) cur.push(0)
      cur[optionIdx] = (cur[optionIdx] ?? 0) + 1
      const next = { ...s, votes: { ...s.votes, [scenarioId]: cur } }
      persist(next)
      return next
    })
  }, [persist])

  const resetVotes = useCallback((scenarioId?: number) => {
    setState((s) => {
      const next = scenarioId === undefined
        ? { ...s, votes: {} }
        : { ...s, votes: { ...s.votes, [scenarioId]: blankVotes(s.votes[scenarioId]?.length ?? 4) } }
      persist(next)
      return next
    })
  }, [persist])

  return (
    <GameCtx.Provider value={{
      ...state,
      update,
      reset,
      addScore,
      log,
      castVote,
      resetVotes,
      toggleSound,
      triggerDirectorCall,
    }}>
      {children}
    </GameCtx.Provider>
  )
}

function blankVotes(n: number) {
  return Array.from({ length: n }, () => 0)
}

export function useGame(): Ctx {
  const ctx = useContext(GameCtx)
  if (!ctx) throw new Error('useGame hors provider')
  return ctx
}

export function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
