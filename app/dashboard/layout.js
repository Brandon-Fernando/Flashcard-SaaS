'use client'
import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
import styles from "../ui/dashboard/dashboard.module.css"
import { useState } from "react";

export default function Layout({children}) {
    const [menuOpen, setMenuOpen] = useState(false)

    const handleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    return (
        <div className={styles.container}>
            <div className={styles.menu}>
                <Sidebar isOpened={menuOpen} />
            </div>

            <div className={styles.content}>
                <Navbar handleMenu={handleMenu} />
                {children}
            </div>
        </div>
    )
}
