import { useEffect } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { useAppContext } from '../contexts/AppContext'

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const saldoColor = (v: number) => (v >= 0 ? 'green' : 'red')

export default function TotaisPessoa() {
  const { totaisPessoa, fetchTotaisPessoa } = useAppContext()

  useEffect(() => { fetchTotaisPessoa() }, [fetchTotaisPessoa])

  const totalReceitas = totaisPessoa.reduce((s, r) => s + r.totalReceitas, 0)
  const totalDespesas = totaisPessoa.reduce((s, r) => s + r.totalDespesas, 0)
  const totalSaldo = totalReceitas - totalDespesas

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Totais por Pessoa</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell align="right"><strong>Receitas</strong></TableCell>
              <TableCell align="right"><strong>Despesas</strong></TableCell>
              <TableCell align="right"><strong>Saldo</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totaisPessoa.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.nome}</TableCell>
                <TableCell align="right">{fmt(row.totalReceitas)}</TableCell>
                <TableCell align="right">{fmt(row.totalDespesas)}</TableCell>
                <TableCell align="right" sx={{ color: saldoColor(row.saldo), fontWeight: 'bold' }}>{fmt(row.saldo)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Total Geral</strong></TableCell>
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
