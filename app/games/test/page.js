'use client'

import { Container, Typography, Box } from "@mui/material";
import Head from "next/head";

export default function Test() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS - Test Game</title>
        <meta name="description" content="Test your knowledge with your flashcards"/>
      </Head>

      <Box 
        sx={{
          textAlign: 'center', 
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh'
        }}>
        <Typography variant="h2" gutterBottom>Test Game</Typography>
        <Typography variant="h5">
          Test your knowledge with flashcards!
        </Typography>
        {/* Add the game logic or UI here */}
      </Box>
    </Container>
  )
}
