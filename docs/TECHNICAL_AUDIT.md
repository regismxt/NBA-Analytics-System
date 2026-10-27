# Auditoria técnica — CourtVision Analytics

Data: 2026-10-26
Branch: `feat/courtvision-foundation`
Escopo: finalização da Fase 1 de estabilização.

## Revisão das alterações

- O seed original executava exclusões globais antes de recriar o mock. A versão atual exige `SEED_MODE=demo` e não contém `deleteMany` nem outra remoção de dados.
- Equipes, jogadores e jogos usam `externalId` único; estatísticas e snapshots usam chaves compostas por jogo e jogador. A persistência usa `upsert` sobre essas chaves.
- A carga completa roda em uma transação. Um lock consultivo transacional serializa execuções concorrentes, inclusive a deduplicação dos eventos feita por jogo, jogador e tipo.
- A comparação de jogadores rejeita parâmetros ausentes, arrays, formatos não decimais, zero, negativos, decimais, valores acima do limite `Int` do Prisma e IDs iguais. Erros de entrada seguem o contrato existente de `ApiError` com HTTP 400.
- O `package-lock.json` está coerente com os três manifests; `npm install --package-lock-only --ignore-scripts --dry-run` retornou `up to date`.
- O arquivo não rastreado `tatus` contém apenas uma saída colorizada de `git diff --cached --stat`. Ele foi preservado, sem exclusão ou inclusão na entrega.

## Verificações executadas

| Verificação | Resultado |
|---|---|
| `npm.cmd run typecheck` | Passou no backend e frontend |
| `npm.cmd run build` | Passou no backend e frontend; alerta não bloqueante de chunk frontend acima de 500 kB |
| `npm.cmd --workspace backend test` | 3 testes passaram; 0 falhas |
| `npx.cmd prisma validate --schema backend/prisma/schema.prisma` | Schema válido |
| Seed sem `SEED_MODE=demo` | Passou e encerrou antes de qualquer carga |
| Consistência do lockfile pelo npm | Passou; nenhuma dependência pendente |
| `git diff --check` | Passou |

## Riscos e pendências

- A execução real e repetida do seed `demo` não foi feita: não há Docker CLI neste ambiente e nenhum banco desconhecido foi alterado. Deve ser coberta por teste de integração com PostgreSQL isolado.
- `docker compose config`, migrations e pipeline Python não foram executados nesta etapa porque o Docker CLI não está disponível.
- O frontend não possui suíte própria de testes automatizados; foi validado por typecheck e build de produção.
- O bundle principal do frontend tem aproximadamente 704 kB minificado e deve ser dividido em uma etapa posterior.
- Não houve alteração de banco, deploy, push ou publicação de credenciais.

## Conclusão

A Fase 1 está pronta para revisão de código. As pendências acima são de integração e evolução e permanecem explícitas; não são apresentadas como verificações concluídas.
