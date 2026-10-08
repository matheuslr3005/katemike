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

## Motion & interação
Preloader com contagem · entrada do hero com split de letras · cursor customizado · botões magnéticos · faixas que aceleram/inclinam com a velocidade do scroll · vinil que gira mais rápido ao rolar · manifesto que "acende" palavra a palavra · tilt 3D no pôster · **crossfader Kat ↔ Mike** · lista de shows com preview de foto · transição "card → tela cheia" na Masterclass · módulos em scroll horizontal fixado · FAQ em acordeão · galeria arrastável · CTA flutuante durante a Masterclass.
Respeita `prefers-reduced-motion` (sem preloader, sem animações, tudo visível).
