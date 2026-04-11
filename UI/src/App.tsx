import { Box, Toolbar } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar, { DRAWER_WIDTH } from './components/Sidebar'
import Pessoas from './pages/Pessoas'
import Categorias from './pages/Categorias'
import Transacoes from './pages/Transacoes'
import TotaisPessoa from './pages/TotaisPessoa'
import TotaisCategoria from './pages/TotaisCategoria'

export default function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/transacoes" element={<Transacoes />} />
          <Route path="/totais/pessoas" element={<TotaisPessoa />} />
          <Route path="/totais/categorias" element={<TotaisCategoria />} />
          <Route path="*" element={<Navigate to="/pessoas" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}
