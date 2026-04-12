# Banco de Dados

## Tecnologia

SQL Server 2022 rodando em container Docker.

- **Database:** Maxiprod
- **Script de criação:** `Database/init.sql`

## Tabelas

### Pessoas

| Coluna | Tipo | Regras |
|--------|------|--------|
| Id | INT (auto) | PK |
| Nome | NVARCHAR(200) | Não vazio |
| Idade | INT | >= 0 |

### Categorias

| Coluna | Tipo | Regras |
|--------|------|--------|
| Id | INT (auto) | PK |
| Descricao | NVARCHAR(400) | Não vazio |
| Finalidade | INT | 1=Receita, 2=Despesa, 3=Ambas |

### Transacoes

| Coluna | Tipo | Regras |
|--------|------|--------|
| Id | INT (auto) | PK |
| Descricao | NVARCHAR(400) | Não vazio |
| Valor | DECIMAL(18,2) | > 0 |
| Tipo | INT | 1=Receita, 2=Despesa |
| CategoriaId | INT | FK → Categorias |
| PessoaId | INT | FK → Pessoas (CASCADE DELETE) |

## Relacionamentos

- **Pessoas → Transacoes:** Uma pessoa tem várias transações. Deletar pessoa remove suas transações (CASCADE).
- **Categorias → Transacoes:** Uma categoria tem várias transações. Não é possível deletar categoria com transações vinculadas.

## Views

### vw_TotaisPorPessoa

Retorna por pessoa: total de receitas, total de despesas e saldo.

### vw_TotaisPorCategoria

Retorna por categoria: finalidade, total de receitas, total de despesas e saldo.

## Inicialização

O banco não é criado automaticamente. Após subir o container, executar:

```bash
docker exec -i maxiprod-db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'Maxiprod@2026' \
  -C -i /docker-entrypoint-initdb.d/init.sql
```
