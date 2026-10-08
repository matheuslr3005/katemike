# Kat & Mike — site oficial

Site de apresentação + venda da dupla de DJs **Kat & Mike** (Dublin, Irlanda): história, próximos shows, **DJ Masterclass** (foco de conversão), galeria e lista VIP.

**Stack:** Vite · React 19 · TypeScript · GSAP (ScrollTrigger + SplitText) · Lenis (scroll suave). Sem Tailwind, CSS puro em `src/styles/global.css`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build em dist/
npm run preview
```

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Instagram, e-mail de management, **WhatsApp**, link de compra da Masterclass, endpoint do formulário VIP | `src/config/site.ts` |
| Próximos shows (data, cidade, venue, link de ingresso) | `src/data/events.ts` |
| **After movies e sets** (vídeos de eventos já realizados) | `src/data/films.ts` |
| Módulos da Masterclass (EN/PT) | `src/data/masterclass.ts` |
| Todos os textos do site (EN e PT-BR) | `src/i18n/en.ts` e `src/i18n/pt.ts` |
| Fotos | `src/assets/photos/` (registrar em `index.ts`) |
| Cores e fontes | variáveis em `:root` no topo de `global.css` |

### Botões de contato / venda
- `whatsappNumber` vazio → os CTAs abrem e-mail para o management.
- `masterclassUrl` (checkout, Hotmart, Stripe, etc.) vazio → o CTA "I want in" abre WhatsApp/e-mail.
- `vipFormEndpoint` (Formspree, Getform…) vazio → o formulário abre o app de e-mail do visitante.

### Eventos
`date: null` mostra "TBA". Para um show confirmado: `date: '2026-11-21'`, `url: 'https://…'`.
A lista atual é **placeholder**.

## Como adicionar um after movie ou set
Em `src/data/films.ts`, copie um item e preencha (mais novo primeiro):

```ts
{
  id: 'belvedere-halloween-2025',       // sem espaços; vira o link /#film=belvedere-halloween-2025
  kind: 'aftermovie',                   // ou 'set'
  title: 'Halloween @ Belvedere',       // texto simples, ou { en: '…', pt: '…', es: '…' }
  where: 'Belvedere · Dublin, Ireland',
  year: 2025,
  url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
  fallbackPhoto: 'duoParty',            // usada se o vídeo não tiver miniatura
}
```
Aceita links de **YouTube, Vimeo, Instagram (post/reel), SoundCloud, Mixcloud** ou arquivo direto `.mp4`. Miniatura do YouTube é automática; nos outros, coloque a imagem em `public/films/` e use `poster: './films/nome.jpg'`.
`url: null` mostra o card como "em breve".

**Enviar para cliente:** abra o vídeo e use *Copiar link*, *WhatsApp* ou *E-mail*. O link (`…/#film=id`) abre direto no vídeo, **sem a abertura da mesa de DJ**.

## Motion & interação
Preloader com contagem · entrada do hero com split de letras · cursor customizado · botões magnéticos · faixas que aceleram/inclinam com a velocidade do scroll · vinil que gira mais rápido ao rolar · manifesto que "acende" palavra a palavra · tilt 3D no pôster · **crossfader Kat ↔ Mike** · lista de shows com preview de foto · transição "card → tela cheia" na Masterclass · módulos em scroll horizontal fixado · FAQ em acordeão · galeria arrastável · CTA flutuante durante a Masterclass.
Respeita `prefers-reduced-motion` (sem preloader, sem animações, tudo visível).

## Idiomas
EN, PT-BR e ES (seletor no topo; detecta o idioma do navegador). Para ajustar textos: `src/i18n/{en,pt,es}.ts`.

## Publicação (GitHub Pages)
O workflow `.github/workflows/deploy.yml` faz build e publica a cada push. Uma vez só, em **Settings → Pages → Build and deployment → Source: GitHub Actions**.
URL: `https://matheuslr3005.github.io/katemike/`
