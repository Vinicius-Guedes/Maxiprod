import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

export default api

// ---- Types ----

export interface Pessoa {
  id: number
  nome: string
  idade: number
}

export interface Categoria {
  id: number
  descricao: string
  finalidade: number // 1=Receita, 2=Despesa, 3=Ambas
}

export interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: number // 1=Receita, 2=Despesa
  categoriaId: number
  pessoaId: number
}

export interface Professor {
  id: number
  nome: string
  email: string
  telefone: string
  cpf: string
  disciplina: string
}

export interface TotalPessoa {
  id: number
  nome: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export interface TotalCategoria {
  id: number
  descricao: string
  finalidade: number
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export const FINALIDADE_LABELS: Record<number, string> = {
  1: 'Receita',
  2: 'Despesa',
  3: 'Ambas',
}

export const TIPO_LABELS: Record<number, string> = {
  1: 'Receita',
  2: 'Despesa',
}
