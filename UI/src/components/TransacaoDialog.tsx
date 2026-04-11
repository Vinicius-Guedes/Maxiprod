import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from '@mui/material'
import api, { Transacao, TIPO_LABELS, FINALIDADE_LABELS } from '../api/axios'
import { useAppContext } from '../contexts/AppContext'

interface Props {
  open: boolean
  onClose: () => void
  transacao: Transacao | null
}

export default function TransacaoDialog({ open, onClose, transacao }: Props) {
  const { pessoas, categorias, fetchTransacoes } = useAppContext()
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState<number | ''>('')
  const [tipo, setTipo] = useState<number>(1)
  const [categoriaId, setCategoriaId] = useState<number | ''>('')
  const [pessoaId, setPessoaId] = useState<number | ''>('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setDescricao(transacao?.descricao ?? '')
      setValor(transacao?.valor ?? '')
      setTipo(transacao?.tipo ?? 1)
      setCategoriaId(transacao?.categoriaId ?? '')
      setPessoaId(transacao?.pessoaId ?? '')
      setError('')
    }
  }, [open, transacao])

  // Filter categories compatible with selected tipo
  const categoriasCompativeis = useMemo(() =>
    categorias.filter((c) => c.finalidade === 3 || c.finalidade === tipo),
    [categorias, tipo]
  )

  // Reset categoriaId if current selection is incompatible
  useEffect(() => {
    if (categoriaId !== '' && !categoriasCompativeis.find((c) => c.id === categoriaId)) {
      setCategoriaId('')
    }
  }, [categoriasCompativeis, categoriaId])

  const handleSubmit = async () => {
    if (!descricao.trim() || valor === '' || valor <= 0 || categoriaId === '' || pessoaId === '') {
      setError('Preencha todos os campos corretamente.')
      return
    }
    try {
      const payload = { descricao, valor, tipo, categoriaId, pessoaId }
      if (transacao) {
        await api.put(`/transacoes/${transacao.id}`, payload)
      } else {
        await api.post('/transacoes', payload)
      }
      await fetchTransacoes()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } }).response?.data
      setError(typeof msg === 'string' ? msg : 'Erro ao salvar.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{transacao ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} inputProps={{ maxLength: 400 }} fullWidth />
          <TextField label="Valor (R$)" type="number" value={valor} onChange={(e) => setValor(e.target.value === '' ? '' : Number(e.target.value))} inputProps={{ min: 0.01, step: 0.01 }} fullWidth />
          <TextField label="Tipo" select value={tipo} onChange={(e) => setTipo(Number(e.target.value))} fullWidth>
            {Object.entries(TIPO_LABELS).map(([k, v]) => (
              <MenuItem key={k} value={k}>{v}</MenuItem>
            ))}
          </TextField>
          <TextField label="Categoria" select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))} fullWidth>
            {categoriasCompativeis.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.descricao} ({FINALIDADE_LABELS[c.finalidade]})</MenuItem>
            ))}
          </TextField>
          <TextField label="Pessoa" select value={pessoaId} onChange={(e) => setPessoaId(Number(e.target.value))} fullWidth>
            {pessoas.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
            ))}
          </TextField>
          {error && <span style={{ color: '#d32f2f', fontSize: '0.875rem' }}>{error}</span>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>Salvar</Button>
      </DialogActions>
    </Dialog>
  )
}
