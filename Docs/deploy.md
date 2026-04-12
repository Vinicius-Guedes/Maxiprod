# Deploy

## CI/CD

GitHub Actions em `.github/workflows/deploy.yml`. Dispara no push para `main`.

### Etapas

1. Checkout do código
2. Configura SSH (chave privada via secrets)
3. rsync dos arquivos para `/opt/apps/maxiprod` no servidor
4. `docker compose up -d --build` via SSH

### Secrets necessários no GitHub

| Secret | Descrição |
|--------|-----------|
| `SSH_PRIVATE_KEY` | Chave SSH privada |
| `SSH_HOST` | IP ou hostname do servidor |
| `SSH_USER` | Usuário SSH |

## Deploy Manual

No servidor:

```bash
cd /opt/apps/maxiprod
docker compose up -d --build
```

## Primeiro Deploy

Após subir os containers pela primeira vez, criar o banco:

```bash
docker exec -i maxiprod-db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'Maxiprod@2026' \
  -C -i /docker-entrypoint-initdb.d/init.sql
```

## Domínio

`maxiprod.viniciusguedes.cloud` — HTTPS via Let's Encrypt (Traefik).
