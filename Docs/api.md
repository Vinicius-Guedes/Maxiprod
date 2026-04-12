# API

## Tecnologia

- .NET 9 Web API com Controllers
- Dapper (acesso ao banco via SQL direto)
- Porta: 5000

## Endpoints

### Pessoas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/pessoas` | Listar todas |
| POST | `/api/pessoas` | Criar (body: nome, idade) |
| PUT | `/api/pessoas/{id}` | Editar |
| DELETE | `/api/pessoas/{id}` | Excluir (cascade nas transações) |

### Categorias

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/categorias` | Listar todas |
| POST | `/api/categorias` | Criar (body: descricao, finalidade) |
| PUT | `/api/categorias/{id}` | Editar |
| DELETE | `/api/categorias/{id}` | Excluir (bloqueia se tiver transações) |

### Transações

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/transacoes` | Listar todas |
| POST | `/api/transacoes` | Criar (body: descricao, valor, tipo, categoriaId, pessoaId) |
| DELETE | `/api/transacoes/{id}` | Excluir |

### Totais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/totais/pessoas` | Receitas, despesas e saldo por pessoa |
| GET | `/api/totais/categorias` | Receitas, despesas e saldo por categoria |

## Regras de Negócio

1. **Menores de 18 anos** não podem registrar receitas (tipo=1)
2. **Tipo da transação** deve ser compatível com a finalidade da categoria:
   - Categoria "Receita" (1) → só aceita transações tipo Receita (1)
   - Categoria "Despesa" (2) → só aceita transações tipo Despesa (2)
   - Categoria "Ambas" (3) → aceita qualquer tipo
3. **Categoria com transações** não pode ser excluída

## Estrutura do Código

```
API/
├── Program.cs              # Configuração (DI, CORS, rotas)
├── Controllers/            # Endpoints HTTP + validações
├── Repositories/           # Queries SQL via Dapper
└── Models/                 # Classes de dados (POCOs)
```
