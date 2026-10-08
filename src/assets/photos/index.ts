import duo from './duo.webp'
import duoParty from './duo-party.webp'
import katDeck from './kat-deck.webp'
import katHeart from './kat-heart.webp'
import mikeGreen from './mike-green.webp'
import mikeMic from './mike-mic.webp'

export const photos = { duo, duoParty, katDeck, katHeart, mikeGreen, mikeMic } as const

export type PhotoKey = keyof typeof photos
