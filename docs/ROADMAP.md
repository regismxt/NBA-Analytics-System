# Roadmap

## Concluído nesta etapa

- Seed demonstrativo seguro e idempotente, sem exclusão global.
- Seed transacional e serializado para evitar cargas parciais ou concorrentes.
- Validação estrita da comparação de jogadores.
- Testes unitários da validação, typecheck e build de produção.
- Auditoria técnica inicial.

## Próximas etapas

1. Criar teste de integração da idempotência do seed com PostgreSQL isolado.
2. Validar migrations, Docker Compose e pipeline Python em ambiente com Docker disponível.
3. Criar testes dos endpoints e uma suíte automatizada para o frontend.
4. Padronizar validação de paginação e filtros nas demais rotas.
5. Dividir o bundle principal do frontend, atualmente acima de 500 kB minificado.
6. Atualizar o dicionário de métricas e separar métricas oficiais, derivadas e personalizadas.
7. Fortalecer o pipeline Extract → Validate → Transform → Load com logs, retries e carga incremental.
8. Adicionar CI seguro para typecheck, build e testes sem depender de serviços externos.
