# Roadmap da Sessão de Coding

> **Uma fatia vertical funcionando vale mais do que dez sistemas pela metade.**

Mantenha `AGORA / PRÓXIMO / DEPOIS / BUGS` em um bloco de notas. Faça commit após cada marco funcional.

## 0 — Congelar o escopo · 15–20 min
Objetivo: `abrir → buscar/usar localização → transporte próximo → informações úteis de transporte → mapa`. Origem→destino é opcional. Telemetria, anúncios, contas e tempo real ferroviário perfeito não são bloqueadores.

## 1 — Bootstrap · 45–60 min
Bun + Turborepo com `apps/web`, `apps/api`, `packages/transit`. Configure TanStack Start, ElysiaJS e TypeScript. **Saída:** um único `bun dev`; web renderizando; `/health` retorna 200.

## 2 — Estrutura visual · 1–1,5 h
Tailwind + shadcn/ui/Base UI + Geist + Lucide. Construa o layout desktop dividido no estilo Vercel/Uber e a estrutura mobile usando dados de fixture. Sem design system customizado.

## 3 — MapLibre · ~45 min
Viewport de São Paulo, mapa responsivo, marcadores de origem/destino, fontes/camadas GeoJSON. Evite marcadores React DOM em alto volume.

## 4 — Domínio canônico · 30–45 min
Defina apenas `Agency`, `Rota`, `Parada`, `Vehicle`, `Arrival`, `ServiceAlert`, `Place`, `Jornada`, `JornadaLeg`. JSON dos provedores nunca deve vazar pelos adapters.

## 5 — Dados reais da SPTrans · 1,5–2,5 h
Autenticação Olho Vivo → busca de linha → paradas → posições dos veículos → previsões de chegada, se for prático. **Saída crítica:** buscar uma linha real e renderizar ônibus/paradas reais através de Elysia + MapLibre.

## 6 — Busca de localização · 1–1,5 h
Busca de transporte + Nominatim → `Place[]` canônico → ranqueamento. Adicione debounce/cancelamento. `Pinheiros` deve priorizar resultados de transporte; endereços devem resolver normalmente.

## 7 — Localização atual + próximos · ~1 h
Geolocalização do navegador com fallback para negação/erro. Filtro geodésico → paradas/estações próximas → lista + mapa.

## 8 — Metrô/CPTM/EMTU · 2–3 h
Adicione linhas, estações/paradas, geometria e dados básicos de serviço: Metrô → CPTM → EMTU. Dados estáticos são aceitáveis quando não houver tempo real verificado. Nunca finja tempo real; diferencie `LIVE`, `ESTIMATED`, `SCHEDULED`.

## 9 — UI de Jornada · ~1 h
Com fixtures, construa `JornadaCard`, `TripTimeline`, trechos de caminhada/transporte, transferências e avisos. Torne concreto o contrato canônico de `Jornada` antes do roteamento.

## 10 — Roteamento · 2–4 h
Integre Valhalla ou outro provedor substituível. **Não** construa um motor de roteamento. Se a integração multimodal virar um buraco sem fundo, mantenha funcionando o produto de busca/mapa/próximos e adie isso.

## 11 — Enriquecimento em tempo real · 1–1,5 h
Trecho planejado da SPTrans + Olho Vivo; trecho ferroviário programado + status operacional/estimativa colaborativa quando justificável. Preserve a semântica de confiança.

## 12 — Estados de falha · ~1 h
Falha do provedor, falha de autenticação, nenhum resultado, localização negada, timeout do geocoder, rota indisponível, tempo real desatualizado, conexão lenta. Sem spinners infinitos.

## 13 — Revisão mobile · 1–1,5 h
Teste em um celular real: teclado, gestos no mapa, safe areas, navegação inferior/sheets, altura do viewport, rolagem e áreas de toque.

## 14 — Performance · 45–60 min
Corrija apenas problemas medidos: requisições duplicadas, debounce do geocoder, camadas MapLibre, payloads, rerenders e layout shifts.

## 15 — Estrutura de anúncios · 30–45 min
Somente agora: `AdSlot`, dimensões reservadas, um placeholder inline no mobile, rail opcional no desktop, estado de jornada ativa protegido. Não espere aprovação do AdSense.

## 16 — Spike de telemetria · 1–2 h MÁX · opcional
Opt-in explícito → `watchPosition()` → sessão efêmera → throttle → ingestão → janela em memória → map matching ferroviário básico. Se começar a consumir o dia, pare.

## 17 — Publicar
Remova código de debug/morto e dados falsos de produção. Teste final em celular/desktop, README e deploy.

## Escada de prioridades

**P0:** monorepo, web/API, estrutura visual limpa, MapLibre, SPTrans real, busca, localização atual, transporte próximo.

**P1:** Metrô/CPTM/EMTU, busca de localização, UI de jornada, roteamento, semântica de tempo real, polimento mobile.

**P2:** alertas, entradas de estação, enriquecimento em tempo real, espaços de anúncio, polimento de performance.

**P3:** telemetria, estimativa de lotação, inferência de passagem por estação, fusão de sensores.

> **Se o P0 estiver incompleto, não toque no P3.**

## Regras para evitar buracos sem fundo

1. Se uma biblioteca resolve 80%, use-a.
2. Um único consumidor normalmente não justifica uma abstração.
3. Mantenha os dados feios dos provedores atrás de adapters.
4. Dados ausentes devem degradar de forma honesta; nunca invente.
5. Adie infraestrutura que não tenha relação com a demo.
6. Após ~20 minutos polindo um componente, siga em frente.
7. Não reescreva código funcional só porque outra arquitetura parece mais limpa.
8. Faça commit após cada marco; mantenha o app executável.
9. Após ~30 minutos travado, reduza o problema ao menor teste observável possível.
10. P0 antes de P3. Sempre.

## Checkpoints Git sugeridos

```text
chore: bootstrap turbo workspace
feat(web): add application shell
feat(web): integrate maplibre
feat(transit): define canonical domain
feat(api): integrate sptrans
feat(web): render live sptrans vehicles
feat(search): add place and transit search
feat(location): add nearby transit
feat(transit): add metro and cptm datasets
feat(transit): add emtu dataset
feat(jornada): add jornada presentation
feat(routing): integrate routing provider
feat(tempo real): enrich jornada state
feat(web): polish mobile experience
feat(ads): add non-blocking ad slots
feat(telemetry): add opt-in location sampling
docs: document prototype
```
