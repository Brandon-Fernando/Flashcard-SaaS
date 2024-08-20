'use client';

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Container, Box, Typography, Card, CardActionArea, CardContent, IconButton, AppBar, Toolbar, Stack } from "@mui/material";
import useEmblaCarousel from 'embla-carousel-react';
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import Image from 'next/image';
import Head from "next/head";


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
        containScroll: 'trimSnaps',
        watchDrag: false,
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
            {/* carousel */}
            <Box
                display="flex"
                flexDirection="column"
                width="100%">
            
            
            {/* <Typography variant="h5" >Currently Viewing: {search}</Typography> */}
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
                                    <CardActionArea onClick={() => handleCardClick(index)}
                                    disableRipple 
                                    >
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
                                                        border: "2px solid black",
                                                        boxShadow: "-4px 4px 6px rgba(0, 0, 0, 1)",
                                                        borderRadius: 4,
                                                        transform: flipped[index] ? 'rotateX(180deg)' : 'rotateX(0deg)',
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
                                                        transform: 'rotateX(180deg)',
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div" fontWeight='bold'>
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" component="div" fontWeight='bold'>
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
                                display: 'inline-block',
                            }}
                        />
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton onClick={scrollPrev}>
                        <BsArrowLeftCircle fontSize={50} color="black" />
                    </IconButton>
                    <IconButton onClick={scrollNext}>
                        <BsArrowRightCircle fontSize={50} color="black" />
                    </IconButton>
                </Box>
            </Box>

            <Typography variant="h5" fontWeight='bold' mt={4}>
                    Terms In This Set ( {flashcards.length} )
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                
                
                <Stack mt={3}>
                {flashcards.map((flashcard, index) => (
                    <Box display="flex" flexDirection="row" key={index}>
                        <Box border="2px solid black" width="65%" display="flex" justifyContent="center" alignItems="center" mb={3} p={6} borderRadius={2} mr={1}
                        sx={{border: "2px solid black",
                        boxShadow: "-4px 4px 6px rgba(0, 0, 0, 1)"}}>
                            <Typography variant="h6">
                                {flashcard.front}
                            </Typography>
                        </Box>
                        <Box border="2px solid black" width="35%"display="flex" justifyContent="center" alignItems="center" mb={3} p={6} borderRadius={2}
                        sx={{border: "2px solid black",
                        boxShadow: "-4px 4px 6px rgba(0, 0, 0, 1)"}}>
                            <Typography variant="h6">
                                {flashcard.back}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                </Stack>
            </Box>
            </Box>
            
        </>
    );
}