'use client';

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Container, Box, Typography, Card, CardActionArea, CardContent, IconButton, AppBar, Toolbar } from "@mui/material";
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Image from 'next/image';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: 'x',
        loop: true,
        dragFree: true,
        containScroll: 'trimSnaps',
    });

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;

            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [search, user]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    if (!isLoaded || !isSignedIn) {
        return <></>;
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

            {/* navbar */}
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
            
            {/* navbar */}
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

            {/* carousel */}
            <Box
                display="flex"
                flexDirection="column"
                width="100%">

            
            <Typography variant="h5" >Currently Viewing: {search}</Typography>
            <Box sx={{ mt: 2, position: 'relative' }}>
                <Box ref={emblaRef} sx={{ overflow: 'hidden', width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '10px',
                        }}
                    >
                        {flashcards.map((flashcard, index) => (
                            <Box
                                key={index}
                                sx={{
                                    flex: '0 0 100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Card sx={{ width: '100%' }}>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '400px',
                                                        border: "1px solid black",
                                                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                                        borderRadius: 4,
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton onClick={scrollPrev}>
                        <ArrowBackIos />
                    </IconButton>
                    <IconButton onClick={scrollNext}>
                        <ArrowForwardIos />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    {flashcards.map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: selectedIndex === index ? '#64558F' : 'grey.500',
                                mx: 1,
                                transition: 'background-color 0.3s',
                            }}
                        />
                    ))}
                </Box>
            </Box>
            </Box>
            </Box>
        </>
    );
}