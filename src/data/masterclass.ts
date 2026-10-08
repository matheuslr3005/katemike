/**
 * DRAFT curriculum — confirm and edit with Kat & Mike.
 * Titles/descriptions live in both languages so the copy can be tuned independently.
 */
export type MasterclassModule = {
  id: string
  title: { en: string; pt: string }
  text: { en: string; pt: string }
}

export const masterclassModules: readonly MasterclassModule[] = [
  {
    id: 'gear',
    title: { en: 'Gear & setup', pt: 'Equipamento & setup' },
    text: {
      en: 'Controllers, CDJs, mixers, headphones. Know your tools and set up like a pro.',
      pt: 'Controladoras, CDJs, mixers, fones. Conheça suas ferramentas e monte o setup como um profissional.',
    },
  },
  {
    id: 'mixing',
    title: { en: 'Beatmatching & mixing', pt: 'Beatmatch & mixagem' },
    text: {
      en: 'Tempo, phrasing, EQ and transitions — the precise mixing that keeps a floor moving.',
      pt: 'Tempo, fraseado, EQ e transições — a mixagem precisa que mantém a pista em movimento.',
    },
  },
  {
    id: 'selection',
    title: { en: 'Track selection & crowd reading', pt: 'Seleção & leitura de pista' },
    text: {
      en: 'Digging, building a set and reading the room — from warm-up to peak time.',
      pt: 'Garimpo, construção de set e leitura do público — do warm-up ao horário de pico.',
    },
  },
  {
    id: 'production',
    title: { en: 'Production essentials', pt: 'Fundamentos de produção' },
    text: {
      en: 'How original beats are born: groove, bass and arrangement from the studio side.',
      pt: 'Como nascem os beats autorais: groove, baixo e arranjo pelo lado do estúdio.',
    },
  },
  {
    id: 'stage',
    title: { en: 'Stage presence & MC', pt: 'Presença de palco & MC' },
    text: {
      en: 'Connect with the audience: mic technique, energy and performing as a duo or solo.',
      pt: 'Conecte-se com o público: técnica de microfone, energia e performance em dupla ou solo.',
    },
  },
  {
    id: 'career',
    title: { en: 'Brand & getting booked', pt: 'Marca & primeiros bookings' },
    text: {
      en: 'Press kit, socials and pitching promoters — turn skills into gigs.',
      pt: 'Press kit, redes e abordagem a produtores — transforme habilidade em shows.',
    },
  },
]
