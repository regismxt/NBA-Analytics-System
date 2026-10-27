# Changelog

## 2026-10-26 — Fundação de estabilização

- Removida a limpeza destrutiva do seed demonstrativo.
- Adicionado `SEED_MODE=demo` como opt-in explícito para dados mockados.
- Convertida a persistência de equipes, jogadores, jogos, estatísticas e snapshots para operações idempotentes por chaves estáveis.
- Protegida a carga demonstrativa com transação e lock consultivo, evitando carga parcial e concorrência entre execuções do seed.
- Adicionada validação Zod para a comparação de jogadores, incluindo IDs decimais escalares, positivos, dentro do limite `Int` do Prisma e jogadores distintos.
- Adicionados testes unitários para casos válidos, ausentes, malformados, repetidos, fora da faixa e não escalares.
- Configurado `SEED_MODE=demo` somente no ambiente local do Docker Compose.
- Confirmados typecheck, build de produção, três testes unitários, validação do schema Prisma e encerramento seguro do seed sem opt-in.
- Confirmada a consistência do `package-lock.json` com os manifests pelo npm.
- Registrada a auditoria técnica e as limitações de execução local em [`TECHNICAL_AUDIT.md`](./TECHNICAL_AUDIT.md).
