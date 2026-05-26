# Data Pipeline

Pipeline Python separado em coleta, transformacao e carga.

## Fluxo

1. `collectors/nba_collector.py` usa `NbaDataProvider`.
2. `MockNbaDataProvider` le arquivos em `mock_data`.
3. `transformers/transform_stats.py` normaliza campos e calcula metricas.
4. `loaders/load_to_postgres.py` carrega dados transformados no PostgreSQL.

## Execucao

```bash
pip install -r data-pipeline/requirements.txt
python data-pipeline/collectors/nba_collector.py
python data-pipeline/transformers/transform_stats.py
python data-pipeline/loaders/load_to_postgres.py
```
