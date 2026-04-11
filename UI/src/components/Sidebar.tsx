import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material'
import { People, Category, Receipt, BarChart } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

const DRAWER_WIDTH = 240

const menuItems = [
  { text: 'Pessoas', icon: <People />, path: '/pessoas' },
  { text: 'Categorias', icon: <Category />, path: '/categorias' },
  { text: 'Transações', icon: <Receipt />, path: '/transacoes' },
  { text: 'Totais por Pessoa', icon: <BarChart />, path: '/totais/pessoas' },
  { text: 'Totais por Categoria', icon: <BarChart />, path: '/totais/categorias' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Drawer
      variant="permanent"
      sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
    >
      <Toolbar>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" noWrap>Maxiprod</Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}

export { DRAWER_WIDTH }
