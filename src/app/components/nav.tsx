'use client';

import { usePathname } from 'next/navigation';
import { fahkwang, openSans } from '@/app/ui/fonts';
import styles from '@/app/ui/main.module.css';
import Link from 'next/link';

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className={`${styles.nav}`}>
      {/*<Link href='/' style={{display:'inline-block',}}>
        <h1 className={`${styles.title} ${fahkwang.className} text-4xl m-5`}><span>R</span><span>E</span><span>C</span><span>C</span><span>S</span></h1>
      </Link>*/}
      <div className={`absolute w-full h-[5vw] bg-[var(--color-back)]`}></div>
      <Link href='/' className={`absolute top-0 left-0 flex flex-col items-center mt-[0.9vw] ml-[1.4vw] ${styles.link}`}>
        <h2 className={`${openSans.className} text-[1vw] leading-[1.15vw] tracking-widest`}>FILM</h2>
        <h1 className={`${styles.title} ${fahkwang.className} text-[1.85vw] leading-none`}><span>R</span><span>E</span><span>C</span><span>C</span><span>S</span></h1>
      </Link>
      <div className={`${styles.navButtons} z-[5]`}>
        <Link href='/'  className={`${styles.navLink} ${pathname==='/'?styles.active:''}`}>Home</Link>
        <Link href='/geoscheme' className={`${styles.navLink} ${pathname.includes('geoscheme')?styles.active:''}`}>Geoscheme</Link>
        <Link href='/search' className={`${styles.navLink} ${pathname.includes('search')?styles.active:''}`}>Search</Link>
      </div>
    </nav>
  )
}
