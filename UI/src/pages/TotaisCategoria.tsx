import { useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'
import { useAppContext } from '../contexts/AppContext'
import { FINALIDADE_LABELS } from '../api/axios'

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const saldoColor = (v: number) => (v >= 0 ? 'green' : 'red')
const FINALIDADE_COLORS: Record<number, 'success' | 'error' | 'info'> = { 1: 'success', 2: 'error', 3: 'info' }

export default function TotaisCategoria() {
  const { totaisCategoria, fetchTotaisCategoria } = useAppContext()

  useEffect(() => { fetchTotaisCategoria() }, [fetchTotaisCategoria])

  const totalReceitas = totaisCategoria.reduce((s, r) => s + r.totalReceitas, 0)
  const totalDespesas = totaisCategoria.reduce((s, r) => s + r.totalDespesas, 0)
  const totalSaldo = totalReceitas - totalDespesas

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Totais por Categoria</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Categoria</strong></TableCell>
              <TableCell><strong>Finalidade</strong></TableCell>
              <TableCell align="right"><strong>Receitas</strong></TableCell>
              <TableCell align="right"><strong>Despesas</strong></TableCell>
              <TableCell align="right"><strong>Saldo</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totaisCategoria.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.descricao}</TableCell>
                <TableCell>
                  <Chip label={FINALIDADE_LABELS[row.finalidade]} color={FINALIDADE_COLORS[row.finalidade]} size="small" />
                </TableCell>
                <TableCell align="right">{fmt(row.totalReceitas)}</TableCell>
                <TableCell align="right">{fmt(row.totalDespesas)}</TableCell>
                <TableCell align="right" sx={{ color: saldoColor(row.saldo), fontWeight: 'bold' }}>{fmt(row.saldo)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell colSpan={2}><strong>Total Geral</strong></TableCell>
              <TableCell align="right"><strong>{fmt(totalReceitas)}</strong></TableCell>
              <TableCell align="right"><strong>{fmt(totalDespesas)}</strong></TableCell>
              <TableCell align="right" sx={{ color: saldoColor(totalSaldo), fontWeight: 'bold' }}><strong>{fmt(totalSaldo)}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
