# 🌐 Teste Técnico – Sistema de Controle de Gastos Residenciais

Este repositório contém a implementação de um **sistema completo de controle de gastos residenciais**, estruturado em camadas bem definidas (**Database, API e UI**), com foco em boas práticas de arquitetura, organização de código e separação de responsabilidades.

🔗 **Demo online:** https://maxiprod.viniciusguedes.cloud
---

## 🎯 Objetivo do Projeto

- Implementar um sistema para gerenciamento de **receitas e despesas por pessoa**
- Demonstrar domínio de **arquitetura em camadas (3-tier)**
- Aplicar boas práticas de desenvolvimento com **.NET + React**
- Garantir clareza na lógica através de **código documentado e organizado**

---

## 🏗️ Arquitetura do Sistema

O sistema foi dividido em três camadas principais:

### 🗄️ Database
Responsável pela persistência dos dados.

- Armazena informações de:
  - Pessoas
  - Categorias
  - Transações
- Garante integridade dos dados
- Mantém os dados persistidos mesmo após reinício da aplicação

---

### ⚙️ API (Back-end)

Responsável pelas regras de negócio e comunicação com o banco.

- Desenvolvido com **C# e .NET**
- Estrutura baseada em **Web API**
- Implementa:
  - CRUD de Pessoas
  - CRUD de Categorias
  - Cadastro de Transações
  - Consultas de totais

#### 🔒 Regras de Negócio

- Exclusão de pessoa remove todas as suas transações
- Menores de idade (< 18 anos) **não podem registrar receitas**
- Categorias respeitam sua finalidade:
  - Receita
  - Despesa
  - Ambas
- Transações devem respeitar:
  - Tipo (receita/despesa)
  - Categoria compatível

---

### 💻 UI (Front-end)

Responsável pela interface com o usuário.

- Desenvolvido com **React + TypeScript**
- Interface focada em:
  - Usabilidade
  - Clareza das informações
  - Responsividade

---

## 🛠️ Tecnologias Utilizadas

### Back-end
- C#
- .NET Web API

### Front-end
- React
- TypeScript

### Persistência
- Banco de dados relacional (ex: SQL Server / SQLite)

---

## 📌 Funcionalidades

### 👤 Cadastro de Pessoas

- Criar, editar, excluir e listar pessoas
- Campos:
  - ID (gerado automaticamente)
  - Nome (máx. 200 caracteres)
  - Idade

---

### 🏷️ Cadastro de Categorias

- Criar e listar categorias
- Campos:
  - ID (gerado automaticamente)
  - Descrição (máx. 400 caracteres)
  - Finalidade:
    - Receita
    - Despesa
    - Ambas

---

### 💰 Cadastro de Transações

- Criar e listar transações
- Campos:
  - ID (gerado automaticamente)
  - Descrição (máx. 400 caracteres)
  - Valor (positivo)
  - Tipo (receita/despesa)
  - Categoria (com validação de finalidade)
  - Pessoa (relacionamento obrigatório)

---

### 📊 Consulta de Totais por Pessoa

- Lista todas as pessoas com:
  - Total de receitas
  - Total de despesas
  - Saldo (receita - despesa)
- Exibe também:
  - Total geral consolidado

---

### 📊 Consulta de Totais por Categoria (Opcional)

- Lista categorias com:
  - Total de receitas
  - Total de despesas
  - Saldo
- Exibe total geral consolidado

---

## 📎 Observações Técnicas

- Código estruturado com foco em **manutenibilidade**
- Separação clara entre camadas
- Regras de negócio centralizadas na API
- Interface desacoplada do back-end
- Dados persistentes garantidos
