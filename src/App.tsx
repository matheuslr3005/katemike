import { useEffect, useState } from 'react'
import { About } from './components/About'
import { Cursor } from './components/Cursor'
import { DeckIntro } from './components/DeckIntro'
import { Duo } from './components/Duo'
import { Events } from './components/Events'
import { Films } from './components/Films'
import { FloatingCta } from './components/FloatingCta'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Masterclass } from './components/Masterclass'
import { Nav } from './components/Nav'
import { VipList } from './components/VipList'
import { I18nProvider, useI18n } from './i18n'
import { ScrollTrigger } from './lib/gsap'
import { initSmoothScroll } from './lib/scroll'

const Page = () => {
  const { t } = useI18n()
  const [ready, setReady] = useState(false)

  useEffect(() => initSmoothScroll(), [])

  /* Late-loading images/fonts shift layout; re-measure all triggers. */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const timer = window.setTimeout(refresh, 1200)
    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <DeckIntro onExit={() => setReady(true)} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <div className="band">
          <Marquee items={t.marquee} className="marquee--band" />
        </div>
        <About />
        <Duo />
        <Events />
        <Films />
        <Masterclass />
        <Gallery />
        <VipList />
      </main>
      <Footer />
      <FloatingCta />
    </>
  )
}

export const App = () => (
  <I18nProvider>
    <Page />
  </I18nProvider>
)
