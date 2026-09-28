// Moteur de Narration Vocale Professionnelle Haute Fidélité (Web Speech API & Audio Studio)

export interface VoiceOption {
  name: string
  lang: string
  displayName: string
  isNatural: boolean
}

class VoiceNarrator {
  private synth: SpeechSynthesis | null = null
  private voice: SpeechSynthesisVoice | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private fallbackTimeout: any = null
  private muted: boolean = false
  private currentText: string = ''
  private speaking: boolean = false
  private speechRate: number = 0.90 // Rythme posé, corporate et solennel
  private speechPitch: number = 1.0
  private speechVolume: number = 1.0

  private listeners: Array<(muted: boolean) => void> = []
  private subtitleListeners: Array<(text: string, isSpeaking: boolean) => void> = []
  private voiceChangeListeners: Array<(voices: VoiceOption[]) => void> = []

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis
      this.initVoice()
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.initVoice()
          this.notifyVoiceChange()
        }
      }
    }
  }

  private initVoice() {
    if (!this.synth) return
    const voices = this.synth.getVoices()
    if (!voices || voices.length === 0) return

    // 1. PRIORITÉ ABSOLUE : Gérard (Naturelle Haute Qualité - French Belgium)
    const gerardMatch = voices.find((v) => {
      const name = v.name.toLowerCase()
      const lang = v.lang.toLowerCase()
      return (
        name.includes('gerard') ||
        name.includes('gérard') ||
        (lang.includes('be') && (name.includes('natural') || name.includes('online')))
      )
    })

    if (gerardMatch) {
      this.voice = gerardMatch
      return
    }

    // 2. Chercher toute voix belge fr-BE
    const beVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('fr-be') ||
        v.lang.toLowerCase().startsWith('fr_be') ||
        v.name.toLowerCase().includes('belgium') ||
        v.name.toLowerCase().includes('belgique')
    )
    if (beVoice) {
      this.voice = beVoice
      return
    }

    // 3. Fallback sur d'autres voix naturelles françaises
    const frVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('fr'))
    const naturalKeywords = [
      'Natural',
      'Neural',
      'Henri Online',
      'Denise Online',
      'Google français',
      'Paul',
      'Thomas',
      'Hortense',
      'Julie',
    ]

    let selected: SpeechSynthesisVoice | null = null
    for (const kw of naturalKeywords) {
      const match = frVoices.find((v) => v.name.includes(kw))
      if (match) {
        selected = match
        break
      }
    }

    this.voice = selected || frVoices[0] || voices.find((v) => v.lang.startsWith('fr')) || null
  }

  public getAvailableFrenchVoices(): VoiceOption[] {
    if (!this.synth) return []
    const voices = this.synth.getVoices()
    const frVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('fr') ||
        v.name.toLowerCase().includes('french') ||
        v.name.toLowerCase().includes('gerard') ||
        v.name.toLowerCase().includes('gérard')
    )

    // Trier pour mettre Gérard / French Belgium en tout premier
    frVoices.sort((a, b) => {
      const aIsGerard =
        a.name.toLowerCase().includes('gerard') ||
        a.name.toLowerCase().includes('gérard') ||
        a.lang.toLowerCase().includes('be')
      const bIsGerard =
        b.name.toLowerCase().includes('gerard') ||
        b.name.toLowerCase().includes('gérard') ||
        b.lang.toLowerCase().includes('be')
      if (aIsGerard && !bIsGerard) return -1
      if (!aIsGerard && bIsGerard) return 1
      return 0
    })

    return frVoices.map((v) => {
      const isGerard =
        v.name.toLowerCase().includes('gerard') ||
        v.name.toLowerCase().includes('gérard') ||
        (v.lang.toLowerCase().includes('be') && v.name.toLowerCase().includes('natural'))

      const isNatural =
        isGerard ||
        v.name.includes('Natural') ||
        v.name.includes('Neural') ||
        v.name.includes('Online') ||
        v.name.includes('Google')

      let cleanName = v.name
        .replace(/Microsoft\s*/i, '')
        .replace(/\s*Online\s*\(Natural\)/i, ' (Naturelle Haute Qualité)')
        .replace(/\s*-\s*French\s*\(Belgium\)/i, ' - French Belgium')
        .replace(/\s*-\s*French\s*\(France\)/i, '')

      if (isGerard) {
        cleanName = 'Gérard (Naturelle Haute Qualité - French Belgium)'
      }

      return {
        name: v.name,
        lang: v.lang,
        displayName: `${cleanName}${isNatural ? ' ⭐' : ''}`,
        isNatural,
      }
    })
  }

  public setVoiceByName(name: string) {
    if (!this.synth) return
    const voices = this.synth.getVoices()
    const match = voices.find((v) => v.name === name)
    if (match) {
      this.voice = match
    }
  }

  public getCurrentVoiceName(): string {
    if (!this.voice) return 'Gérard (Naturelle Haute Qualité - French Belgium)'
    if (
      this.voice.name.toLowerCase().includes('gerard') ||
      this.voice.name.toLowerCase().includes('gérard')
    ) {
      return 'Gérard (Naturelle Haute Qualité - French Belgium)'
    }
    return this.voice.name
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.min(1.5, Math.max(0.6, rate))
  }

  public getSpeechRate(): number {
    return this.speechRate
  }

  public speak(text: string, onEnd?: () => void) {
    // Annuler tout minuteur de secours précédent
    if (this.fallbackTimeout) {
      clearTimeout(this.fallbackTimeout)
      this.fallbackTimeout = null
    }

    const cleanText = text.replace(/[*_#`[\]()]/g, '').trim()
    this.currentText = cleanText

    if (!cleanText) {
      this.speaking = false
      this.notifySubtitles('', false)
      if (onEnd) onEnd()
      return
    }

    // Si muet, diffuser le sous-titre visuel avec un défilement réaliste
    if (!this.synth || this.muted) {
      this.speaking = true
      this.notifySubtitles(cleanText, true)
      const words = cleanText.split(' ').length
      const fallbackMs = Math.max(3000, words * 280)
      this.fallbackTimeout = setTimeout(() => {
        this.speaking = false
        this.notifySubtitles(cleanText, false)
        if (onEnd) onEnd()
      }, fallbackMs)
      return
    }

    // Si pas encore de voix sélectionnée, tenter de charger Gérard
    if (!this.voice) {
      this.initVoice()
    }

    // Arrêter toute narration en cours
    this.stop()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    this.currentUtterance = utterance

    if (this.voice) {
      utterance.voice = this.voice
      utterance.lang = this.voice.lang || 'fr-BE'
    } else {
      utterance.lang = 'fr-BE'
    }

    utterance.rate = this.speechRate // Cadence posée, intelligible
    utterance.pitch = this.speechPitch
    utterance.volume = this.speechVolume

    this.speaking = true
    this.notifySubtitles(cleanText, true)

    let finished = false
    const handleEnd = () => {
      if (finished) return
      finished = true
      if (this.fallbackTimeout) {
        clearTimeout(this.fallbackTimeout)
        this.fallbackTimeout = null
      }
      this.currentUtterance = null
      this.speaking = false
      this.notifySubtitles(cleanText, false)
      if (onEnd) onEnd()
    }

    utterance.onend = handleEnd
    utterance.onerror = handleEnd

    // Minuteur de sécurité en cas de blocage interne de speechSynthesis
    const wordCount = cleanText.split(' ').length
    const maxSafetyMs = Math.max(5000, wordCount * 550 + 4000)
    this.fallbackTimeout = setTimeout(handleEnd, maxSafetyMs)

    try {
      this.synth.speak(utterance)
    } catch {
      handleEnd()
    }
  }

  public stop() {
    if (this.fallbackTimeout) {
      clearTimeout(this.fallbackTimeout)
      this.fallbackTimeout = null
    }
    this.currentUtterance = null
    this.speaking = false
    this.notifySubtitles('', false)
    if (this.synth) {
      try {
        this.synth.cancel()
      } catch {}
    }
  }

  public pause() {
    if (this.synth) {
      try {
        this.synth.pause()
      } catch {}
    }
  }

  public resume() {
    if (this.synth) {
      try {
        this.synth.resume()
      } catch {}
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted
    if (this.muted) {
      this.stop()
    }
    this.notifyMuteChange()
    return this.muted
  }

  public isMuted(): boolean {
    return this.muted
  }

  public isSpeaking(): boolean {
    return this.speaking
  }

  public onMuteChange(cb: (muted: boolean) => void) {
    this.listeners.push(cb)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb)
    }
  }

  public subscribe(cb: (muted: boolean) => void) {
    return this.onMuteChange(cb)
  }

  public onSubtitles(cb: (text: string, isSpeaking: boolean) => void) {
    this.subtitleListeners.push(cb)
    return () => {
      this.subtitleListeners = this.subtitleListeners.filter((l) => l !== cb)
    }
  }

  public subscribeSubtitles(cb: (text: string, isSpeaking: boolean) => void) {
    return this.onSubtitles(cb)
  }

  public onVoicesChange(cb: (voices: VoiceOption[]) => void) {
    this.voiceChangeListeners.push(cb)
    return () => {
      this.voiceChangeListeners = this.voiceChangeListeners.filter((l) => l !== cb)
    }
  }

  public subscribeVoices(cb: (voices: VoiceOption[]) => void) {
    return this.onVoicesChange(cb)
  }

  private notifyMuteChange() {
    this.listeners.forEach((l) => l(this.muted))
  }

  private notifySubtitles(text: string, isSpeaking: boolean) {
    this.subtitleListeners.forEach((l) => l(text, isSpeaking))
  }

  private notifyVoiceChange() {
    const list = this.getAvailableFrenchVoices()
    this.voiceChangeListeners.forEach((l) => l(list))
  }
}

export const narrator = new VoiceNarrator()
