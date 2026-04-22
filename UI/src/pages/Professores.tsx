import { useState } from 'react'
import { Box, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Edit, Delete, Add } from '@mui/icons-material'
import { useAppContext } from '../contexts/AppContext'
import api, { Professor } from '../api/axios'
import ProfessorDialog from '../components/ProfessorDialog'

export default function Professores() {
  const { professores, fetchProfessores, loading } = useAppContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Professor | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Professor | null>(null)

  const handleEdit = (p: Professor) => { setSelected(p); setDialogOpen(true) }
  const handleNew = () => { setSelected(null); setDialogOpen(true) }

  const handleDelete = async () => {
    if (deleteTarget) {
      await api.delete(`/professores/${deleteTarget.id}`)
      await fetchProfessores()
      setDeleteTarget(null)
    }
  }

  const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1 },
    { field: 'telefone', headerName: 'Telefone', width: 150 },
    { field: 'cpf', headerName: 'CPF', width: 150 },
    { field: 'disciplina', headerName: 'Disciplina', flex: 1 },
    {
      field: 'acoes', headerName: 'Ações', width: 120, sortable: false, filterable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEdit(params.row)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => setDeleteTarget(params.row)}><Delete fontSize="small" /></IconButton>
        </>
      ),
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Professores</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleNew}>Novo Professor</Button>
      </Box>
      <DataGrid rows={professores} columns={columns} loading={loading} autoHeight disableRowSelectionOnClick />
      <ProfessorDialog open={dialogOpen} onClose={() => setDialogOpen(false)} professor={selected} />
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Excluir o professor "{deleteTarget?.nome}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
