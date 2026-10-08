import type { Lang } from '../i18n'

/**
 * DRAFT curriculum — confirm and edit with Kat & Mike.
 * Titles/descriptions live in every language so the copy can be tuned independently.
 */
export type MasterclassModule = {
  id: string
  title: Record<Lang, string>
  text: Record<Lang, string>
}

export const masterclassModules: readonly MasterclassModule[] = [
  {
    id: 'gear',
    title: { en: 'Gear & setup', pt: 'Equipamento & setup', es: 'Equipo y setup' },
    text: {
      en: 'Controllers, CDJs, mixers, headphones. Know your tools and set up like a pro.',
      pt: 'Controladoras, CDJs, mixers, fones. Conheça suas ferramentas e monte o setup como um profissional.',
      es: 'Controladoras, CDJs, mixers, auriculares. Conoce tus herramientas y monta el setup como un profesional.',
    },
  },
  {
    id: 'mixing',
    title: { en: 'Beatmatching & mixing', pt: 'Beatmatch & mixagem', es: 'Beatmatching y mezcla' },
    text: {
      en: 'Tempo, phrasing, EQ and transitions — the precise mixing that keeps a floor moving.',
      pt: 'Tempo, fraseado, EQ e transições — a mixagem precisa que mantém a pista em movimento.',
      es: 'Tempo, fraseo, EQ y transiciones — la mezcla precisa que mantiene la pista en movimiento.',
    },
  },
  {
    id: 'selection',
    title: { en: 'Track selection & crowd reading', pt: 'Seleção & leitura de pista', es: 'Selección y lectura de pista' },
    text: {
      en: 'Digging, building a set and reading the room — from warm-up to peak time.',
      pt: 'Garimpo, construção de set e leitura do público — do warm-up ao horário de pico.',
      es: 'Búsqueda de música, construcción de sets y lectura del público — del warm-up al horario pico.',
    },
  },
  {
    id: 'production',
    title: { en: 'Production essentials', pt: 'Fundamentos de produção', es: 'Fundamentos de producción' },
    text: {
      en: 'How original beats are born: groove, bass and arrangement from the studio side.',
      pt: 'Como nascem os beats autorais: groove, baixo e arranjo pelo lado do estúdio.',
      es: 'Cómo nacen los beats originales: groove, bajo y arreglo desde el lado del estudio.',
    },
  },
  {
    id: 'stage',
    title: { en: 'Stage presence & MC', pt: 'Presença de palco & MC', es: 'Presencia escénica y MC' },
    text: {
      en: 'Connect with the audience: mic technique, energy and performing as a duo or solo.',
      pt: 'Conecte-se com o público: técnica de microfone, energia e performance em dupla ou solo.',
      es: 'Conecta con el público: técnica de micrófono, energía y performance en dúo o en solitario.',
    },
  },
  {
    id: 'career',
    title: { en: 'Brand & getting booked', pt: 'Marca & primeiros bookings', es: 'Marca y primeras contrataciones' },
    text: {
      en: 'Press kit, socials and pitching promoters — turn skills into gigs.',
      pt: 'Press kit, redes e abordagem a produtores — transforme habilidade em shows.',
      es: 'Press kit, redes y cómo acercarte a promotores — convierte habilidad en shows.',
    },
  },
]
