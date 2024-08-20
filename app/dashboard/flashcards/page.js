'use client';

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    const handleMenuClick = (event, id) => {
        event.stopPropagation(); // Prevents the card click handler from being triggered
        setMenuAnchorEl(event.currentTarget);
        setSelectedCardId(id);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleDelete = async () => {
        if (!selectedCardId) return;
        try {
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
            const collections = docSnap.data().flashcards || [];
            const updatedCollections = collections.filter(card => card.name !== selectedCardId);
            await setDoc(docRef, { flashcards: updatedCollections });
            setFlashcards(updatedCollections);
        } catch (error) {
            console.error("Error deleting card: ", error);
        }
        handleMenuClose();
    };

    return (
        <Box
            mt={7}
            height="100%"
            sx={{ flex: 1, position: 'relative' }}
        >
            <Stack height="100%" overflow="auto" spacing={4} mx={10} p={3}>
                {flashcards.map((flashcard, index) => (
                    <Box
                        key={index}
                        width="100%"
                        height={100}
                        border="2px solid black"
                        boxShadow="-4px 4px 6px rgba(0, 0, 0, 0.3)"
                        borderRadius={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        pl={4}
                        pr={1}
                        sx={{
                            '&:hover': {
                                borderColor: 'black',
                                borderWidth: 3,
                                boxShadow: "-6px 6px 6px rgba(0, 0, 0, 0.8)",
                                cursor: 'pointer'
                            },
                            position: 'relative', 
                        }}
                        onClick={() => handleCardClick(flashcard.name)}
                    >
                        <Typography variant="h6" component="div" textAlign="center" fontWeight="bold">
                            {flashcard.name}
                        </Typography>
                        <Stack direction="row" spacing={2} display="flex" alignItems="center">
                            <IconButton
                                onClick={(event) => handleMenuClick(event, flashcard.name)}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Stack>
                    </Box>
                ))}
            </Stack>

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl) && selectedCardId !== null}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'center', 
                    horizontal: 'right' 
                }}
                transformOrigin={{
                    vertical: 'center', 
                    horizontal: 'left' 
                }}
                PaperProps={{
                    sx: {
                        border: '2px solid black', 
                        boxShadow: '-4px 4px 8px rgba(0, 0, 0, 0.3)',
                        marginLeft: 3, 
                    }
                }}
            >
                <MenuItem onClick={handleDelete}
                disableRipple
                sx={{
                    '&:hover': {
                        backgroundColor: 'transparent', 
                        color: 'inherit', 
                    }
                }}
                >
                    <DeleteIcon
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#FF0000',
                        },
                        
                        
                        
                    }}/> 
                </MenuItem>
            </Menu>
        </Box>
    );
}

