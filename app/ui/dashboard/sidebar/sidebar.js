import styles from './sidebar.module.css'
import { BsArrowReturnLeft, BsFolderFill, BsFillFileTextFill, BsFileEarmarkPlusFill, BsYoutube } from "react-icons/bs";
import { GiCardRandom } from "react-icons/gi";
import MenuLink from './menuLink/menuLink'


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
                path: "/dashboard/generate", // change path
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

export default function Sidebar() {

  return (
    <div className={`${styles.container} ${styles.hidden}`}>

      <BsArrowReturnLeft />

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