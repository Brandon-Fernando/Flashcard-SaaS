import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import Image from 'next/image'

import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'
import styles from './page.module.css'

export default function SignUpPage() {
    return(
    <Container disableGutters className={styles.container} sx={{minWidth: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <AppBar position="absolute">
            <Toolbar sx={{bgcolor: 'white', padding:"8px"}}>
                <Image src="/assets/cardlet-logo.png" alt="Logo" width={125} height={50} />
            </Toolbar>
        </AppBar>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
            <SignIn signUpUrl='/sign-up' />
        </Box>
  </Container>
    )
  
}