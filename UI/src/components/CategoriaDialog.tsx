import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from '@mui/material'
import api, { Categoria, FINALIDADE_LABELS } from '../api/axios'
import { useAppContext } from '../contexts/AppContext'

interface Props {
  open: boolean
  onClose: () => void
  categoria: Categoria | null
}

export default function CategoriaDialog({ open, onClose, categoria }: Props) {
  const { fetchCategorias } = useAppContext()
  const [descricao, setDescricao] = useState('')
  const [finalidade, setFinalidade] = useState<number>(1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setDescricao(categoria?.descricao ?? '')
      setFinalidade(categoria?.finalidade ?? 1)
      setError('')
    }
  }, [open, categoria])

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      setError('Preencha a descrição.')
      return
    }
    try {
      if (categoria) {
        await api.put(`/categorias/${categoria.id}`, { descricao, finalidade })
      } else {
        await api.post('/categorias', { descricao, finalidade })
      }
      await fetchCategorias()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } }).response?.data
      setError(typeof msg === 'string' ? msg : 'Erro ao salvar.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{categoria ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} inputProps={{ maxLength: 400 }} fullWidth />
          <TextField label="Finalidade" select value={finalidade} onChange={(e) => setFinalidade(Number(e.target.value))} fullWidth>
            {Object.entries(FINALIDADE_LABELS).map(([k, v]) => (
              <MenuItem key={k} value={k}>{v}</MenuItem>
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
