'use client'
import { useState } from "react"
import { CircularProgress, Container, TextField, Button, Typography, Box, Grid, CardContent, Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper, CardActions, CardActionArea, } from "@mui/material"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { collection, doc, getDoc, setDoc, writeBatch } from "firebase/firestore"
import { db } from "@/firebase"


export default function FileUpload() {
    const [file, setFile] = useState(null)
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev, 
            [id]: !prev[id],
        }))
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }
    
    const handleUpload = () => {
        if (file) {
            const fileReader = new FileReader()
            fileReader.onload = onLoadFile
            fileReader.readAsArrayBuffer(file)
        } else {
            console.warn('No file selected')
            alert('No File Selected')
        }
    }

    const onLoadFile = (e) => {
        const typedArray = new Uint8Array(e.target.result)
        pdfjsLib.getDocument({
            data: typedArray
        }).promise.then((pdf) => {
            console.log("loaded pdf: ", pdf.numPages)
            pdf.getPage(1).then((page) => {
                page.getTextContent().then((content) => {
                    let text = ''
                    content.items.forEach((item) => {
                        text += item.str + ''
                    })
                    // console.log('text: ', text)
                    sendToAPI(text)
                })
            })
        }).catch((error) => {
            console.error('Error loading PDF: ', error)
        })
    }

    const sendToAPI = async (text) => {
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
        router.push('/flashcards')

    }

    return (
        <div>
            <h1>File Upload</h1>
            <input type="file" id="file" name="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {loading && (
                <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress />
                    <Typography sx={{ml: 2}}>Generating flashcards...</Typography>
                </Box>
            )}

            {flashcards.length > 0 && (
                <Box sx={{mt: 4}}>
                    <Typography variant="h5">Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea
                                        onClick={() => {
                                            handleCardClick(index)
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{perspective: '1000px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative', 
                                                    width: '100%', 
                                                    height: '200px', 
                                                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
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
                                                
                                            }}>
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
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard collection.
                    </DialogContentText>
                    <TextField
                        autofocus margin="dense" label="Collection Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined"/>
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
        </div>
    )
}
