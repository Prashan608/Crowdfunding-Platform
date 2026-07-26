import { Box, Typography, Container } from '@mui/material'

function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', bgcolor: 'grey.100' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Crowdfunding Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
