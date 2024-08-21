import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import Image from 'next/image'

import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'
import styles from './page.module.css'

export default function SignUpPage() {
    return(
    <Container disableGutters sx={{minWidth: '100vw'}}>
        <AppBar position="static">
            <Toolbar sx={{bgcolor: 'white', padding:"8px"}}>
                <Image src="/assets/cardlet-logo.png" alt="Logo" width={125} height={50} />
            </Toolbar>
        </AppBar>
        <div className={styles.container}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center">
                <SignIn signUpUrl='/sign-up' />
            </Box>
        </div>
  </Container>
    )
  
}