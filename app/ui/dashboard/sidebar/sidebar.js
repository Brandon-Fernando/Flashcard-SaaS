import styles from './sidebar.module.css'
import { BsArrowReturnLeft, BsFolderFill, BsFillFileTextFill, BsFileEarmarkPlusFill, BsYoutube } from "react-icons/bs";
import { GiCardRandom } from "react-icons/gi";
import MenuLink from './menuLink/menuLink'
import Image from 'next/image'


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
                path: "/dashboard/youtube", // change path
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
            icon: <GiCardRandom />
          },
          {
            title: "Back",
            path: "/",
            icon: <BsArrowReturnLeft />
          },
      ]
    }
]

export default function Sidebar({isOpened}) {

  return (
    <div className={`${styles.container} ${
      isOpened 
      ? styles.open 
      : styles.container
    }`}>

      <div className={styles.logoContainer}>
        <Image className={styles.logo} src="/assets/cardlet-logo.png" alt="logo" width={140} height={56} />
      </div>
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