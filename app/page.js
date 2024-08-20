'use client'

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, Paper } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { useRouter } from 'next/navigation';
import background from '/public/assets/background.png';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


export default function Home() {
  const { isSignedIn } = useUser()
  const router = useRouter()

  const handleDashboard = async () => {
    if (isSignedIn) {
      router.push('/dashboard/generate')
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
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
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

  const handleFreeTrialSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST', 
      headers: {origin: 'http://localhost:3000'},
      body: JSON.stringify({planType: 'free-trial'}),
    })
    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500){
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
    <Container maxWidth={false} disableGutters sx={{ width: '100vw', overflowX: 'hidden' }}>

      {/* Navbar */}
      <AppBar position="static" color ='default' sx= {{ width: '100vw', height: 80, paddingTop: 1, paddingBottom: 1, borderRadius: 3, marginBottom: 1, marginTop: 1, boxShadow: 5}}>

        <Toolbar>
          <Typography variant = 'h5' sx = {{ flexGrow: 1 }}>
            <Image src = '/assets/cardlet-logo.png' alt = 'Cardlet' width='120' height = '50'/>
          </Typography>

          <SignedOut>
            <Button color="inherit" href="/sign-in" sx = {{ paddingInline: 2, borderRadius: 25 }}>Sign In</Button>
            <Button variant = 'contained' href="/sign-up" sx = {{ paddingInline: 2, borderRadius: 25 }}>Register</Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

        </Toolbar>
      </AppBar>


      {/* Cardlet Image  */}

      <Box
        sx={{
          position: 'relative',
          color: 'black',
          textAlign: 'center',
          alignContent: 'center',
          py: 8,
          paddingBottom: 12,
          width: '100vw',
          height: '75vh'
        }}
      >
        <Image fill src = '/assets/background.png' alt ='Background' style = {{objectFit: 'cover'}}/>
          <Box sx = {{position: 'relative', justifyContent: 'center', textAlign: 'center'}}>
            <Typography variant="h1" gutterBottom fontWeight={'bold'}>
              Cardlet
            </Typography>
            <Typography variant="h4" fontWeight={'semibold'}>
              Your all-in-one tool to make study flashcards
            </Typography>
          </Box>
      </Box>


      {/* Features */}

      <Box sx={{my: 6}}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={'bold'} sx = {{p: 2, paddingLeft: 4}}>Features</Typography>
          <Grid container rows={{ md: 3}} sx = {{p: 2, textAlign: 'left', alignContent: 'center'}} spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={4}>
                <Box sx = {{ display: 'flex', flexDirection: {sm: 'row'}, width: 325}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Easy Text Input</Typography>
                    <Typography>
                      {' '}
                      Simply input your text and let our software do the rest. Creating 
                      flashcards has never been easier. 
                    </Typography>
                  </Box>
                </Box>
            </Grid>

            <Grid item xs={12} md={4}>
                <Box sx = {{ display: 'flex', flexDirection: {sm: 'row'}, width: 325}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Smart Flashcards</Typography>
                    <Typography>
                      {' '}
                      Our AI intelligently breaks down your text into concise flashcards, 
                      perfect for studying.
                    </Typography>
                  </Box>
                </Box>
            </Grid>

            <Grid item xs={12} md={4}>
                <Box sx = {{ display: 'flex', flexDirection: {sm: 'row'}, width: 325}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Anywhere, Anytime</Typography>
                    <Typography>
                      {' '}
                      Access your flashcards from any device, at anytime. Study on the 
                      go with ease. 
                    </Typography>
                  </Box>
                </Box>
            </Grid>
          </Grid>
      </Box>



      {/* Pricing */}


      <Box sx={{my: 6, pt: 8}}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={'bold'} sx = {{p: 2, paddingLeft: 4}}>Pricing</Typography>
          <Grid container alignItems="center" justifyContent="center" rows={{ md: 3}} sx = {{p: 2, textAlign: 'left'}} gap='2' spacing={{ xs: 1, md: 3 }}>
            <Grid item xs={12} md={4} sx={{ display: 'flex'}}>
                <Paper elevation={3} sx = {{ display: 'flex', flexDirection: {sm: 'row'}, width: 350, height: 225, p: 2}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Free</Typography>
                    <Typography>
                      {' '}
                      Start your free trial for 3 days. Experience powerful learning in just a few clicks. No commitment needed!
                    </Typography>
                    <Button variant = "contained" color="primary" sx = {{mt: 2, borderRadius: 25}} onClick={handleDashboard}>
                      Get Started
                    </Button>
                  </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex'}}>
                <Paper elevation={3} sx = {{ display: 'flex', flexDirection: {sm: 'row'}, width: 350, height: 225, p: 2}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Basic</Typography>
                  <Typography variant="h6" fontWeight={'semibold'}>$5 / month</Typography>
                    <Typography>
                      {' '}
                      Access to basic flashcard features and limited storage.
                    </Typography>
                    <Button variant = "contained" color="primary" sx = {{mt: 2, borderRadius: 25}} onClick={handleDashboard}>
                      Get Started
                    </Button>
                  </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex'}}>
                <Paper elevation={3} sx = {{ display: 'flex', flexDirection: {sm: 'row'}, width: 350, height: 225, p:2}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Pro</Typography>
                  <Typography variant="h6" fontWeight={'semibold'}>$10 / month</Typography>
                    <Typography>
                      {' '}
                      Unlimited flashcards and storage, with priority support. 
                    </Typography>
                    <Button variant = "contained" color="primary" sx = {{mt: 2, borderRadius: 25}}>
                      Coming Soon
                    </Button>
                  </Box>
                </Paper>
            </Grid>
          </Grid>
      </Box>




      {/* <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box sx={{p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2}}>
              <Typography variant="h5" gutterBottom>Free Trial</Typography>
              <Typography variant="h6">First Week Free, Then $10/month</Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant = "contained" color="primary" onClick={handleFreeTrialSubmit}>
                Start Free Trial
              </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
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
      </Box> */}
    </Container>
  )
}