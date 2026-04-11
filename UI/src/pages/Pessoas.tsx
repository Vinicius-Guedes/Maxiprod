import { useState } from 'react'
import { Box, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Edit, Delete, Add } from '@mui/icons-material'
import { useAppContext } from '../contexts/AppContext'
import api, { Pessoa } from '../api/axios'
import PessoaDialog from '../components/PessoaDialog'

export default function Pessoas() {
  const { pessoas, fetchPessoas, loading } = useAppContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Pessoa | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Pessoa | null>(null)

  const handleEdit = (p: Pessoa) => { setSelected(p); setDialogOpen(true) }
  const handleNew = () => { setSelected(null); setDialogOpen(true) }

  const handleDelete = async () => {
    if (deleteTarget) {
      await api.delete(`/pessoas/${deleteTarget.id}`)
      await fetchPessoas()
      setDeleteTarget(null)
    }
  }

  const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'idade', headerName: 'Idade', width: 100 },
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
        <Typography variant="h5">Pessoas</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleNew}>Nova Pessoa</Button>
      </Box>
      <DataGrid rows={pessoas} columns={columns} loading={loading} autoHeight disableRowSelectionOnClick />
      <PessoaDialog open={dialogOpen} onClose={() => setDialogOpen(false)} pessoa={selected} />
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Excluir "{deleteTarget?.nome}"? Todas as transações desta pessoa serão removidas.
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
