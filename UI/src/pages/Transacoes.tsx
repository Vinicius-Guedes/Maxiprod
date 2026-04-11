import { useState } from 'react'
import { Box, Button, Typography, IconButton, Chip } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Delete, Add } from '@mui/icons-material'
import { useAppContext } from '../contexts/AppContext'
import api, { TIPO_LABELS } from '../api/axios'
import TransacaoDialog from '../components/TransacaoDialog'

const TIPO_COLORS: Record<number, 'success' | 'error'> = { 1: 'success', 2: 'error' }

export default function Transacoes() {
  const { transacoes, pessoas, categorias, fetchTransacoes, loading } = useAppContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleNew = () => { setDialogOpen(true) }
  const handleDelete = async (id: number) => {
    await api.delete(`/transacoes/${id}`)
    await fetchTransacoes()
  }

  const pessoaMap = Object.fromEntries(pessoas.map((p) => [p.id, p.nome]))
  const categoriaMap = Object.fromEntries(categorias.map((c) => [c.id, c.descricao]))

  const columns: GridColDef[] = [
    { field: 'descricao', headerName: 'Descrição', flex: 1 },
    {
      field: 'valor', headerName: 'Valor', width: 130,
      valueFormatter: (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
    {
      field: 'tipo', headerName: 'Tipo', width: 120,
      renderCell: (params) => (
        <Chip label={TIPO_LABELS[params.value as number]} color={TIPO_COLORS[params.value as number]} size="small" />
      ),
    },
    {
      field: 'categoriaId', headerName: 'Categoria', width: 180,
      valueGetter: (value: number) => categoriaMap[value] ?? '-',
    },
    {
      field: 'pessoaId', headerName: 'Pessoa', width: 180,
      valueGetter: (value: number) => pessoaMap[value] ?? '-',
    },
    {
      field: 'acoes', headerName: 'Ações', width: 80, sortable: false, filterable: false,
      renderCell: (params) => (
        <IconButton size="small" onClick={() => handleDelete(params.row.id)}><Delete fontSize="small" /></IconButton>
      ),
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Transações</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleNew}>Nova Transação</Button>
      </Box>
      <DataGrid rows={transacoes} columns={columns} loading={loading} autoHeight disableRowSelectionOnClick />
      <TransacaoDialog open={dialogOpen} onClose={() => setDialogOpen(false)} transacao={null} />
    </Box>
  )
}
