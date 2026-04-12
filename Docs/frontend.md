# Frontend (UI)

## Tecnologia

- React 18 + TypeScript
- Material UI (MUI) 5
- React Router v6
- Axios para chamadas HTTP
- Vite (bundler)
- Nginx Alpine (servidor em produção)

## Páginas

| Rota | Página | Funcionalidade |
|------|--------|----------------|
| `/pessoas` | Pessoas | CRUD com DataGrid, confirmação ao excluir |
| `/categorias` | Categorias | CRUD com DataGrid, chips coloridos por finalidade |
| `/transacoes` | Transações | Criar/listar/excluir, filtro de categorias por tipo |
| `/totais/pessoas` | Totais por Pessoa | Tabela resumo com saldo colorido (verde/vermelho) |
| `/totais/categorias` | Totais por Categoria | Tabela resumo com chips de finalidade |

## Layout

Sidebar fixa à esquerda (240px) com navegação. Área principal à direita renderiza a página da rota ativa.

## Comunicação com API

O Axios usa baseURL `/api` (relativo). O Nginx faz proxy reverso de `/api/*` para o container da API na porta 5000.

## Estrutura do Código

```
UI/
├── src/
│   ├── main.tsx                # Ponto de entrada React
│   ├── App.tsx                 # Layout (Sidebar + rotas)
│   ├── api/axios.ts            # Instância HTTP + tipos + constantes
│   ├── contexts/AppContext.tsx  # Estado global compartilhado
│   ├── components/             # Dialogs de criação/edição
│   └── pages/                  # Uma página por rota
├── Dockerfile                  # Multi-stage: Node build → Nginx serve
└── nginx.conf                  # Proxy /api → API + SPA routing
```
