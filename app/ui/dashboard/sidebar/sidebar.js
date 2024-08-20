import styles from './sidebar.module.css'
import { BsArrowReturnLeft, BsFolderFill, BsFillFileTextFill, BsFileEarmarkPlusFill, BsYoutube } from "react-icons/bs";
import { GiCardPick } from "react-icons/gi";
import MenuLink from './menuLink/menuLink'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LuFileEdit } from "react-icons/lu";
import { BsX } from 'react-icons/bs'


const menuItems = [
    {
        title: "Flashcard Creation",
        list: [
            {
                title: "Text",
                path: "/dashboard/generate",
                icon: <BsFillFileTextFill />
            },
            {
                title: "File Upload",
                path: "/dashboard/file-upload",
                icon: <BsFileEarmarkPlusFill />
            },
            {
                title: "YouTube URL",
                path: "/dashboard/youtube",
                icon: <BsYoutube />
            },
        ]
    },
    {
      title: "Flashcard Archive",
      list: [
          {
              title: "Library",
              path: "/dashboard/flashcards",
              icon: <BsFolderFill />
          },
      ]
    },
    {
      title: "Games",
      list: [
          {
            title: "Matching",
            path: "/dashboard/flashcards", // change path
            icon: <GiCardPick />
          },
          {
            title: "Practice Test",
            path: "/dashboard/flashcards", // change path
            icon: <LuFileEdit />
          },
          {
            title: "Back",
            path: "/",
            icon: <BsArrowReturnLeft />
          },
      ]
    }
]

export default function Sidebar({isOpened, handleMenu}) {

  return (
    <div className={`${styles.container} ${
      isOpened 
      ? styles.open 
      : styles.container
    }`}>

      <button className={styles.closeButton} onClick={handleMenu}>
        <BsX size={32} color="black" />
      </button>

      <div className={styles.logoContainer}>
        <Image className={styles.logo} src="/assets/cardlet-logo.png" alt="logo" width={140} height={56} />
      </div>
      <ul className={styles.list}>
        {menuItems.map(cat => (
          <li key={cat.title} onClick={handleMenu}>
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