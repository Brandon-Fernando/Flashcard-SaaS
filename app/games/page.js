'use client'

import { SignedIn, SignedOut, UserButton, RedirectToSignIn } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Head from "next/head";

export default function Games() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS - Games</title>
        <meta name="description" content="Play educational games with your flashcards"/>
      </Head>

      {/* Restrict access to signed-in users only */}
      <SignedIn>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1}}>
              Flashcard SaaS
            </Typography>
            <UserButton />
          </Toolbar>
        </AppBar>

        <Box 
          sx={{
            textAlign: 'center', 
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh'  // Ensures the buttons are vertically centered
          }}>
          <Typography variant="h2" gutterBottom>Games</Typography>
          <Typography variant="h5" sx={{mb: 4}}>
            Engage with your flashcards through interactive games!
          </Typography>

          <Button 
            variant="contained" 
            color="primary" 
            sx={{mb: 2, width: '200px'}}
            href="/games/match"
          >
            Match
          </Button>

          <Button 
            variant="contained" 
            color="secondary" 
            sx={{width: '200px'}}
            href="/games/test"
          >
            Test
          </Button>
        </Box>
      </SignedIn>

      {/* If not signed in, redirect to sign-in page */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </Container>
  )
}
