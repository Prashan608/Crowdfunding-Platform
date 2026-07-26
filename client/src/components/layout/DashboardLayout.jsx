import { Box, Toolbar } from '@mui/material'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'

function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default DashboardLayout
