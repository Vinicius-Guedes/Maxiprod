import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material'
import api, { Professor } from '../api/axios'
import { useAppContext } from '../contexts/AppContext'

interface Props {
  open: boolean
  onClose: () => void
  professor: Professor | null
}

export default function ProfessorDialog({ open, onClose, professor }: Props) {
  const { fetchProfessores } = useAppContext()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setNome(professor?.nome ?? '')
      setEmail(professor?.email ?? '')
      setTelefone(professor?.telefone ?? '')
      setCpf(professor?.cpf ?? '')
      setDisciplina(professor?.disciplina ?? '')
      setError('')
    }
  }, [open, professor])

  const handleSubmit = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !cpf.trim() || !disciplina.trim()) {
      setError('Preencha todos os campos.')
      return
    }
    try {
      const payload = { nome, email, telefone, cpf, disciplina }
      if (professor) {
        await api.put(`/professores/${professor.id}`, payload)
      } else {
        await api.post('/professores', payload)
      }
      await fetchProfessores()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } }).response?.data
      setError(typeof msg === 'string' ? msg : 'Erro ao salvar.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{professor ? 'Editar Professor' : 'Novo Professor'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} inputProps={{ maxLength: 200 }} fullWidth />
          <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} inputProps={{ maxLength: 200 }} fullWidth />
          <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} inputProps={{ maxLength: 20 }} fullWidth />
          <TextField label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} inputProps={{ maxLength: 14 }} fullWidth />
          <TextField label="Disciplina" value={disciplina} onChange={(e) => setDisciplina(e.target.value)} inputProps={{ maxLength: 200 }} fullWidth />
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
