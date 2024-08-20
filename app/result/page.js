'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CircularProgress, Container, Typography, Box, Paper , Button} from '@mui/material'
import styles from './page.module.css'
import Head from 'next/head'
Head


const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
  
    useEffect(() => {
        const fetchCheckoutSession = async () => {
          if (!session_id) return
          try {
            const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
            const sessionData = await res.json()
            if (res.ok) {
              setSession(sessionData)
            } else {
              setError(sessionData.error)
            }
          } catch (err) {
            setError('An error occurred while retrieving the session.')
          } finally {
            setLoading(false)
          }
        }
        fetchCheckoutSession()
      }, [session_id])

      if (loading) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
        )
      }

      if (error) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
        )
      }

      return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}} className={styles.container}>
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
          {session.payment_status === 'paid' ? (
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
              <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Thank you for your purchase!
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                  Session ID: <span style={{ fontWeight: 'bold' }}>{session_id}</span>
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    We have received your payment. You will receive an email with the order details shortly.
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={() => router.push('/')}>
                    Back to Home
                  </Button>
                </Box>
              </Paper>
            </Container>
          ) : (
            router.push(`/`)
          )}
        </Container>
      )
}

export default ResultPage