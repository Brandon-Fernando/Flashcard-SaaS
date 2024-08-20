'use client' 

import { useCallback, useEffect, useState } from "react"
import { CircularProgress, Container, TextField, Button, Typography, Box, Grid, CardContent, Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper, CardActions, CardActionArea, Stack, IconButton, } from "@mui/material"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { collection, doc, getDoc, setDoc, writeBatch } from "firebase/firestore"
import { db } from "@/firebase"
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import useEmblaCarousel from 'embla-carousel-react';



export default function Generate() {
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [loading, setLoading] = useState(false)
    const {isLoaded, isSignedIn, user} = useUser()
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [selectedIndex, setSelectedIndex] = useState(0);


    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: 'x',
        loop: true,
        containScroll: 'trimSnaps',
        watchDrag: false,
    });

    const handleSubmit = async () => {
        setLoading(true)
        fetch('api/generate', {
            method: 'POST', 
            body: text,
        }).then((res) => res.json())
        .then((data) => {
            setFlashcards(data)
            setLoading(false)
        })
        .catch((error) => {
            console.error('Error:', error)
            setLoading(false)
        })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev, 
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name for your flashcard set.')
            return 
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.')
                return 
            } else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/dashboard/flashcards')

    }

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

    return(
        <Container maxWidth="md">
            <Box sx={{
                mt: 8, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                
                <Paper 
                    sx={{
                        p: 4, 
                        width: '100%', 
                        border: '2px solid black', 
                        boxShadow: "-4px 4px 6px rgba(0, 0, 0, 1)",
                        borderRadius: 4,}}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your topic here. We'll take care of the rest."
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{mb: 2, 
                            borderRadius: 3,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    border: "2px solid black", 
                                    boxShadow: "-2px 2px 4px rgba(0, 0, 0, 0.3)"
                                },
                                "&:hover fieldset": {
                                    border: "2px solid black"
                                },
                                "&.Mui-focused fieldset": {
                                    border: "2px solid black", 
                                    boxShadow: "-2px 2px 4px rgba(0, 0, 0, 0.8)"
                                },
                            },
                        }}
                    />
                    <Button 
                        variant="contained" onClick={handleSubmit} fullWidth
                        sx={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            color: '#fff',
                            background: 'linear-gradient(45deg, #8e44ad, #3498db)', 
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease',
                            textTransform: 'none',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #6c3483, #2980b9)' 
                            }
                          }}>
                        {' '}
                        Submit
                    </Button>
                </Paper>
            </Box>

            {loading && (
                <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress />
                    <Typography sx={{ml: 2}}>Generating flashcards...</Typography>
                </Box>
            )}

            {flashcards.length > 0 && (
                
                
                <Box sx={{ mt: 9, position: 'relative' }}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Typography fontWeight= 'bold' variant="h5">Flashcards Preview</Typography>
                    </Box>
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
            <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                        <Button variant="contained" color="secondary" fullWidth onClick={handleOpen}
                        sx={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            color: '#fff',
                            background: 'linear-gradient(45deg, #8e44ad, #3498db)', 
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease',
                            textTransform: 'none',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #6c3483, #2980b9)' 
                            }
                          }}>
                            Save
                        </Button>
                    </Box>
            </Box>

               
            )}

            <Dialog open={open} onClose={handleClose} PaperProps={{
                sx: {
                    backgroundColor: '#f5f5f5', 
                    border: '5px solid black', 
                    borderRadius: 2, 
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: 2 
                }
            }}>
                <DialogTitle fontWeight="bold">Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard collection.
                    </DialogContentText>
                    <TextField
                        autofocus margin="dense"
                        placeholder="Collection Name" 
                        type="text" 
                        fullWidth value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                "& fieldset": {
                                    border: "2px solid black", 
                                    boxShadow: "-2px 2px 4px rgba(0, 0, 0, 0.3)"
                                },
                                "&:hover fieldset": {
                                    border: "2px solid black"
                                },
                                "&.Mui-focused fieldset": {
                                    border: "2px solid black", 
                                    boxShadow: "-2px 2px 4px rgba(0, 0, 0, 0.8)"
                                },
                            }
                        }}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={saveFlashcards}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            
        </Container>
    )
       
    
}