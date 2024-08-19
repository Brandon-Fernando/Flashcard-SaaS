'use client'
import styles from './navbar.module.css'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@mui/material";
import { BsList } from 'react-icons/bs';


export default function Navbar({handleMenu}) {
    const pathname = usePathname()

    return (
        <div className={styles.container}>
            <div className={styles.title}>{pathname.split("/").pop().replace(/-/g, ' ')}</div>
            <div className={styles.menu}>
                <SignedOut>
                    <Button color="inherit" href="/sign-in">Login</Button>
                    <Button color="inherit" href="/sign-up">Sign Up</Button>
                </SignedOut>

                <SignedIn>
                    <UserButton />
                </SignedIn>
                
                <BsList className={styles.menuIcon} size={60} onClick={handleMenu} />
            </div>
        </div>
    )
}