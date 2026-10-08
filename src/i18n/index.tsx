import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, type Dict } from './en'
import { pt } from './pt'

export type Lang = 'en' | 'pt'

const dictionaries: Record<Lang, Dict> = { en, pt }
const STORAGE_KEY = 'km-lang'

type I18nValue = { lang: Lang; t: Dict; setLang: (lang: Lang) => void }

const I18nContext = createContext<I18nValue | null>(null)

const readInitialLang = (): Lang => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'pt') return stored
  } catch {
    // storage unavailable (private mode) — fall through to browser language
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  const value = useMemo<I18nValue>(() => ({ lang, t: dictionaries[lang], setLang }), [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nValue => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
