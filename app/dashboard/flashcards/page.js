'use client'

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Container, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation"
import { useEffect, useState, use } from "react";
import { collection, CollectionReference, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from 'next/image';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()


    useEffect(() => {
        async function getFlashcards() {
            if (!user) return 
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                const collections = docSnap.data().flashcards || [] 
                setFlashcards(collections)
            }else {
                await setDoc(docRef, {flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }
    
    return (
        <>
            
            {/* header */}
            <AppBar sx={{
                backgroundColor: 'white',  boxShadow: 'none', borderBottom: '1px solid #D1D1D1'
            }}>
                <Toolbar>
                    <Box sx={{ width: 80, height: 30}}>
                        <Image 
                            src="/images/logo.png" 
                            alt="Description of Image" 
                            layout="responsive" 
                            width={500} 
                            height={300} 
                        />
                     </Box>
                    <Box sx={{flexGrow: 1}}/>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>

            


            {/* body section */}
            <Box 
                maxWidth
                sx={{
                    height: 'calc(100vh - 100px)',
                    mt: '80px', 
                    position: 'sticky'
                  }}
                ml={2}
                mr={7}
                gap={7}
                display="flex"
                flexDirection="row"
                
                >

                {/* side navbar */}
                <Box
                    height="100%"
                    width={120}
                    bgcolor="#F4EDF4"
                    borderRadius={4}
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    pt={3}
                    >
                    <Box display="flex" flexDirection="column" alignItems="center" pb={4}>
                        <HomeOutlinedIcon sx={{fontSize: 45}}/>
                        <Typography textAlign="center">Home</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="center" width={90} height={75} bgcolor="rgba(0, 0, 0, 0.1)" borderRadius={3}>
                        <FolderOpenOutlinedIcon sx={{fontSize: 45}}/>
                        <Typography textAlign="center">Flashcards</Typography>
                    </Box>
                    
                </Box>
                

                {/* flashcards */}
                <Box
                    height="100%"
                    sx={{flex: 1}}>
                    <Stack height="100%" overflow="auto" spacing={4} >
                        <Typography variant="h4" mb={4}>
                            Your Flashcards
                        </Typography>
                        {flashcards.map((flashcard, index) => (
                            <Box
                                key={index}
                                width="100%"
                                height={100}
                                border="1px solid black"
                                boxShadow="0px 4px 6px rgba(0, 0, 0, 0.2)"
                                borderRadius={4}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={4}
                                >
                                <Typography variant="h5" component="div" textAlign="center">
                                    {flashcard.name}
                                </Typography>
                                <Stack direction="row" spacing={2} display="flex" alignItems="center">
                                    <Button
                                        onClick={() => handleCardClick(flashcard.name)}
                                        sx={{bgcolor: "#64558F", color: "white", mr: 4, width: 90, 
                                            '&:hover':{bgcolor: "#8274ac"}, 
                                            '&:active':{bgcolor: "#3b3255"}}}>
                                        Study
                                    </Button>
                                </Stack>
                            </Box>

                        ))}
                    </Stack>
                </Box>

            </Box>
        </>
    )
}

