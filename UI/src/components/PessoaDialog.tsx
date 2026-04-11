import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material'
import api, { Pessoa } from '../api/axios'
import { useAppContext } from '../contexts/AppContext'

interface Props {
  open: boolean
  onClose: () => void
  pessoa: Pessoa | null // null = create, object = edit
}

export default function PessoaDialog({ open, onClose, pessoa }: Props) {
  const { fetchPessoas } = useAppContext()
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState<number | ''>('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setNome(pessoa?.nome ?? '')
      setIdade(pessoa?.idade ?? '')
      setError('')
    }
  }, [open, pessoa])

  const handleSubmit = async () => {
    if (!nome.trim() || idade === '' || idade < 0) {
      setError('Preencha todos os campos corretamente.')
      return
    }
    try {
      if (pessoa) {
        await api.put(`/pessoas/${pessoa.id}`, { nome, idade })
      } else {
        await api.post('/pessoas', { nome, idade })
      }
      await fetchPessoas()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } }).response?.data
      setError(typeof msg === 'string' ? msg : 'Erro ao salvar.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{pessoa ? 'Editar Pessoa' : 'Nova Pessoa'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} inputProps={{ maxLength: 200 }} fullWidth />
          <TextField label="Idade" type="number" value={idade} onChange={(e) => setIdade(e.target.value === '' ? '' : Number(e.target.value))} inputProps={{ min: 0 }} fullWidth />
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
