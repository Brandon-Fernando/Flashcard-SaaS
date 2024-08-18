'use client'

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Container, Typography, Box, Button, CircularProgress } from "@mui/material";
import Head from "next/head";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

export default function MatchSelect() {
  const { user, isLoaded } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const fetchFlashcardSets = async () => {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFlashcardSets(userDoc.data().flashcards || []);
        }
        setLoading(false);
      };
      fetchFlashcardSets();
    }
  }, [user, isLoaded]);

  const handleSelectSet = (setName) => {
    // Navigate to the match game with the selected flashcard set
    router.push(`/games/match/${setName}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS - Match Game</title>
        <meta name="description" content="Play the Match game with your flashcards"/>
      </Head>

      <Box 
        sx={{
          textAlign: 'center', 
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh'
        }}>
        <Typography variant="h2" gutterBottom>Match Game</Typography>
        <Typography variant="h5" sx={{mb: 4}}>
          Select a flashcard set to start the game:
        </Typography>

        {flashcardSets.length === 0 ? (
          <Typography variant="h6">No flashcard sets found. Please create some first.</Typography>
          // Consider adding a button to create a new flashcard set if none exist
          // <Button variant="contained" color="secondary" onClick={() => router.push('/path/to/create')}>
          //   Create New Flashcard Set
          // </Button>
        ) : (
          flashcardSets.map((set, index) => (
            <Button
              key={index}
              variant="contained"
              color="primary"
              sx={{ mb: 2, width: '200px' }}
              onClick={() => handleSelectSet(set.name)}
            >
              {set.name}
            </Button>
          ))
        )}
      </Box>
    </Container>
  );
}
