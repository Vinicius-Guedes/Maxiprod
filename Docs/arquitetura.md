# Arquitetura do Sistema

## Visão Geral

Sistema de controle de gastos residenciais com arquitetura em 3 camadas, rodando em containers Docker atrás de um proxy reverso Traefik.

```
Browser → Traefik (HTTPS) → Nginx (UI) → .NET API → SQL Server
```

## Containers

| Container | Imagem | Porta | Função |
|-----------|--------|-------|--------|
| maxiprod-db | SQL Server 2022 | 1433 | Banco de dados |
| maxiprod-api | .NET 9 (build próprio) | 5000 (interna) | API REST |
| maxiprod-ui | Nginx Alpine (build próprio) | 80 (interna) | Frontend React |

## Fluxo de Requisições

1. O browser acessa `maxiprod.viniciusguedes.cloud`
2. Traefik recebe e encaminha para o Nginx (maxiprod-ui)
3. Nginx serve os arquivos estáticos (React) para rotas normais
4. Nginx faz proxy reverso de `/api/*` para `maxiprod-api:5000`
5. A API processa a requisição e consulta o SQL Server

## Rede

Todos os containers estão na rede Docker `web` (externa, compartilhada com Traefik). A comunicação entre containers é feita pelo nome do container.
