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

            {/* flashcards */}
            <Box 
                mx={2}
                mt={5}
                display="flex"
                justifyContent="center"
                >
                <Grid container spacing={4} justifyContent="center">
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} >
                            <Box
                                    key={index}
                                    width={300}
                                    height={200}
                                    border= "2px solid black"
                                    boxShadow= "-4px 4px 6px rgba(0, 0, 0, 0.3)"
                                    borderRadius={2}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    p={4}
                                    sx={{
                                        '&:hover': {
                                            borderColor: 'black', 
                                            borderWidth: 3,
                                            boxShadow: "-6px 6px 6px rgba(0, 0, 0, 0.8)", 
                                            cursor: 'pointer'
                                        },
                                    }}
                                    onClick={() => handleCardClick(flashcard.name)}
                                    >
                                    <Typography variant="h5" component="div" textAlign="center">
                                        {flashcard.name}
                                    </Typography>
                                </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    )
}

