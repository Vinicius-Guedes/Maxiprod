import { useState } from 'react'
import { Box, Button, Typography, IconButton, Chip } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Edit, Delete, Add } from '@mui/icons-material'
import { useAppContext } from '../contexts/AppContext'
import api, { Categoria, FINALIDADE_LABELS } from '../api/axios'
import CategoriaDialog from '../components/CategoriaDialog'

const FINALIDADE_COLORS: Record<number, 'success' | 'error' | 'info'> = { 1: 'success', 2: 'error', 3: 'info' }

export default function Categorias() {
  const { categorias, fetchCategorias, loading } = useAppContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Categoria | null>(null)

  const handleEdit = (c: Categoria) => { setSelected(c); setDialogOpen(true) }
  const handleNew = () => { setSelected(null); setDialogOpen(true) }
  const handleDelete = async (id: number) => {
    await api.delete(`/categorias/${id}`)
    await fetchCategorias()
  }

  const columns: GridColDef[] = [
    { field: 'descricao', headerName: 'Descrição', flex: 1 },
    {
      field: 'finalidade', headerName: 'Finalidade', width: 150,
      renderCell: (params) => (
        <Chip label={FINALIDADE_LABELS[params.value as number]} color={FINALIDADE_COLORS[params.value as number]} size="small" />
      ),
    },
    {
      field: 'acoes', headerName: 'Ações', width: 120, sortable: false, filterable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEdit(params.row)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)}><Delete fontSize="small" /></IconButton>
        </>
      ),
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Categorias</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleNew}>Nova Categoria</Button>
      </Box>
      <DataGrid rows={categorias} columns={columns} loading={loading} autoHeight disableRowSelectionOnClick />
      <CategoriaDialog open={dialogOpen} onClose={() => setDialogOpen(false)} categoria={selected} />
    </Box>
  )
}
