import styles from './sidebar.module.css'
import { BsFolderFill } from "react-icons/bs";
import { BsFillHouseFill } from "react-icons/bs";
import MenuLink from './menuLink/menuLink'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@mui/material";


const menuItems = [
    {
        title: "Pages",
        list: [
            {
                title: "Home",
                path: "/dashboard/generate",
                icon: <BsFillHouseFill />
            },
            {
                title: "Library",
                path: "/dashboard/flashcards-lib",
                icon: <BsFolderFill />
            }
        ]
    }
]

export default function Sidebar() {

  return (
    <div className={styles.container}>
      <SignedOut>
        <Button color="inherit" href="/sign-in">Login</Button>
        <Button color="inherit" href="/sign-up">Sign Up</Button>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>

      <ul className={styles.list}>
        {menuItems.map(cat => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map(item => (
               <MenuLink item={item} key={item.title} />               
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
}