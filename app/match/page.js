'use client';

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Container, Typography, Box, Grid, Card, CardActionArea, CardContent, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Sidebar from "@/app/ui/dashboard/sidebar/sidebar";
import Navbar from "@/app/ui/dashboard/navbar/navbar";

export default function Match() {
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
    router.push(`/match/${setName}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex">
      {/* Sidebar Section */}
      <Box sx={{ width: '313px' }}>
        <Sidebar activePath="/match" />
      </Box>
      {/* Main Content Section */}
      <Box p="20px" sx={{ flex: 1 }}>
        <Navbar />
        <Container sx={{ mt: 2 }}> {/* Adjust the margin-top here if needed */}
          <Box 
            sx={{
              textAlign: 'center', 
              mt: 2,  // Adjust the margin-top to bring the text higher
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            
            <Typography variant="h5" gutterBottom sx={{ ml: '-70px', mt:'40px' }}>
              Select a Flashcard Set to Start the Match Game
            </Typography>

            <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}> {/* Add margin-top to the Grid */}
              {flashcardSets.length === 0 ? (
                <Typography variant="h6">No flashcard sets found. Please create some first.</Typography>
              ) : (
                flashcardSets.map((set, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ maxWidth: 200 }}>
                      <CardActionArea onClick={() => handleSelectSet(set.name)}>
                        <CardContent>
                          <Typography variant="h6" component="div">
                            {set.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
