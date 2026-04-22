import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import api, { Pessoa, Categoria, Transacao, Professor, TotalPessoa, TotalCategoria } from '../api/axios'

interface AppState {
  pessoas: Pessoa[]
  categorias: Categoria[]
  transacoes: Transacao[]
  professores: Professor[]
  totaisPessoa: TotalPessoa[]
  totaisCategoria: TotalCategoria[]
  loading: boolean
  fetchPessoas: () => Promise<void>
  fetchCategorias: () => Promise<void>
  fetchTransacoes: () => Promise<void>
  fetchProfessores: () => Promise<void>
  fetchTotaisPessoa: () => Promise<void>
  fetchTotaisCategoria: () => Promise<void>
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])
  const [totaisPessoa, setTotaisPessoa] = useState<TotalPessoa[]>([])
  const [totaisCategoria, setTotaisCategoria] = useState<TotalCategoria[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPessoas = useCallback(async () => {
    const res = await api.get<Pessoa[]>('/pessoas')
    setPessoas(res.data)
  }, [])

  const fetchCategorias = useCallback(async () => {
    const res = await api.get<Categoria[]>('/categorias')
    setCategorias(res.data)
  }, [])

  const fetchTransacoes = useCallback(async () => {
    const res = await api.get<Transacao[]>('/transacoes')
    setTransacoes(res.data)
  }, [])

  const fetchProfessores = useCallback(async () => {
    const res = await api.get<Professor[]>('/professores')
    setProfessores(res.data)
  }, [])

  const fetchTotaisPessoa = useCallback(async () => {
    const res = await api.get<TotalPessoa[]>('/totais/pessoas')
    setTotaisPessoa(res.data)
  }, [])

  const fetchTotaisCategoria = useCallback(async () => {
    const res = await api.get<TotalCategoria[]>('/totais/categorias')
    setTotaisCategoria(res.data)
  }, [])

  useEffect(() => {
    Promise.all([fetchPessoas(), fetchCategorias(), fetchTransacoes(), fetchProfessores()])
      .finally(() => setLoading(false))
  }, [fetchPessoas, fetchCategorias, fetchTransacoes, fetchProfessores])

  return (
    <AppContext.Provider value={{
      pessoas, categorias, transacoes, professores, totaisPessoa, totaisCategoria, loading,
      fetchPessoas, fetchCategorias, fetchTransacoes, fetchProfessores, fetchTotaisPessoa, fetchTotaisCategoria,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
