'use client'

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { useRouter } from 'next/navigation';


export default function Home() {
  const { isSignedIn } = useUser()
  const router = useRouter()

  const handleGenerate = async () => {
    if (isSignedIn) {
      router.push('/generate')
    } else {
      router.push('/sign-in')
    }
  }

  const handleFileUpload = async () => {
    if (isSignedIn) {
      router.push('/file-upload')
    } else {
      router.push('/sign-in')
    }
  }

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' }, // TODO: Change when deployed to vercel
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text"/>
      </Head>


      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>
            Flashcard SaaS
          </Typography>

          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      
      </AppBar>

      <Box sx={{textAlign: 'center', my: 4 }}> 
        <Typography variant="h2">Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">
          {' '}
          The easiest way to make flashcards from your text
        </Typography>
        <Button variant="contained" sx={{mt: 2}} onClick={handleGenerate}>
          Get Started
        </Button>
        <Button variant="contained" sx={{mt: 2, ml: 2}} onClick={handleFileUpload}>
          Get Started (File Upload)
        </Button>
      </Box>

      <Box sx={{my: 6}}>
        <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Easy Text Input</Typography>
              <Typography>
                {' '}
                Simply input your text and let our software do the rest. Creating 
                flashcards has never been easier. 
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">Smart Flashcards</Typography>
              <Typography>
                {' '}
                Our AI intelligently breaks down your text into concise flashcards, 
                perfect for studying.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">Accessible Anywhere</Typography>
              <Typography>
                {' '}
                Access your flashcards from any device, at anytime. Study on the 
                go with ease. 
              </Typography>
            </Grid>
          </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box sx={{p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2}}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6">$5 / month</Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant = "contained" color="primary">
                Choose Basic
              </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2}}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6">$10 / month</Typography>
              <Typography>
                {' '}
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button variant = "contained" color="primary" onClick={handleSubmit}>
                Choose Pro
              </Button>
              </Box>
            </Grid>
        </Grid>
      </Box>
    </Container>
    


    
  )
}
