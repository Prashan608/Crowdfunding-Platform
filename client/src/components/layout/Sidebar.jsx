import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Campaigns', to: '/campaigns' },
  { label: 'Payments', to: '/payment' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Profile', to: '/profile' },
]

function Sidebar() {
  return (
    <Box sx={{ width: 240, bgcolor: 'grey.50', minHeight: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Menu
      </Typography>
      <List>
        {links.map((link) => (
          <ListItemButton key={link.to} component={RouterLink} to={link.to}>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}

export default Sidebar
