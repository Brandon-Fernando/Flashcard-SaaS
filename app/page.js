'use client'

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, Paper } from "@mui/material";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import Head from 'next/head'
import { useRouter } from 'next/navigation';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from './page.module.css'


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
    <Container className={styles.container} disableGutters sx={{ minWidth: '100%', minHeight: '100vh' }}>
      <Head>
                <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                />
                <script
                    dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
                    `,
                    }}
                />
        </Head>
      {/* Navbar */}
      <AppBar className={styles.appBar} position="absolute" color ='default'>

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
          width: '100%',
          height: '100vh'
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

      <Box sx={{my: 6, mt: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '80%'}}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={'bold'} sx = {{pt: 2 }}>Features</Typography>
          <Grid container rows={{ md: 3}} sx = {{p: 2, display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'center', alignItems: 'center'}} spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={4}>
                <Box sx = {{ display: 'flex', flexDirection: {sm: 'row'}}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                    <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Easy Text Input</Typography>
                    <Typography>
                      {' '}
                      Simply input your notes and let our software do the rest. Creating 
                      flashcards has never been easier. 
                    </Typography>
                  </Box>
                </Box>
            </Grid>

            <Grid item xs={12} md={4}>
                <Box sx = {{ display: 'flex', flexDirection: {sm: 'row'}}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>File Upload</Typography>
                    <Typography>
                      {' '}
                      Our AI intelligently breaks down your PDFs into concise flashcards, 
                      perfect for studying.
                    </Typography>
                  </Box>
                </Box>
            </Grid>

            <Grid item xs={12} md={4}>
                <Box sx = {{ display: 'flex', flexDirection: {sm: 'row'}}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Games</Typography>
                    <Typography>
                      {' '}
                      Make studying more fun and effective with matching games and practice tests that help reinforce your knowledge.                    </Typography>
                  </Box>
                </Box>
            </Grid>
          </Grid>
      </Box>



      {/* Pricing */}


      <Box sx={{my: 14, mt: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '80%'}}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={'bold'} sx = {{pt: 2}}>Pricing</Typography>
          <Grid container sx = {{p: 2, display: 'flex', flexDirection: {xs: 'row', sm: 'row'}, justifyContent: 'center', alignItems: 'center'}} spacing={{ xs: 6, md: 4 }}>
            <Grid item xs={12} md={6} sx={{ display: 'flex'}}>
                <Paper elevation={3} sx = {{ display: 'flex', flexDirection: {sm: 'row'}, justifyContent: 'space-between', height: {sm: 200, md: 240, lg: 200}, p: 2}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Free</Typography>
                  <Typography variant="h6" fontWeight={'semibold'}>30 Day Trial</Typography>
                    <Typography>
                      {' '}
                      Experience powerful learning with just a few click. Enjoy all the features with zero commitment!
                    </Typography>
                    <Button variant = "contained" color="primary" sx = {{mt: 2, borderRadius: 25}} onClick={handleDashboard}>
                      Get Started
                    </Button>
                  </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex'}}>
                <Paper elevation={3} sx = {{ display: 'flex', flexDirection: {sm: 'row'}, height: {sm: 200, md: 240, lg: 200}, p: 2}}>
                  <Box sx = {{flex: 0.05, pt: 0.6, paddingRight: 3 }}>
                  <InfoOutlinedIcon> </InfoOutlinedIcon>
                  </Box>
                  <Box>
                  <Typography variant="h6" fontWeight={'bold'}>Membership</Typography>
                  <Typography variant="h6" fontWeight={'semibold'}>$5 / month</Typography>
                    <Typography>
                      {' '}
                      Full access to all features, including unlimited flashcards, AI-powered study sessions, and more!
                    </Typography>
                    <Button variant = "contained" color="primary" sx = {{mt: 2, borderRadius: 25}} onClick={handleDashboard}>
                      Get Started
                    </Button>
                  </Box>
                </Paper>
            </Grid>

          </Grid>
      </Box>
    </Container>
  )
}