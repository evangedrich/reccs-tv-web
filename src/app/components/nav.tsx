'use client';

import { usePathname } from 'next/navigation';
import styles from '@/app/ui/main.module.css';
import Link from 'next/link';

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      {/*<Link href='/' style={{display:'inline-block',}}>
        <h1 className={`${styles.title} ${fahkwang.className} text-4xl m-5`}><span>R</span><span>E</span><span>C</span><span>C</span><span>S</span></h1>
      </Link>*/}
      <div className={styles.navButtons}>
        <Link href='/' className={styles.navLink}>
          <button className={`${pathname==='/'?styles.active:''}`}>Home</button>
        </Link>
        <Link href='/geoscheme' className={styles.navLink}>
          <button className={`${pathname.includes('geoscheme')?styles.active:''}`}>Geoscheme</button>
        </Link>
        <Link href='/search' className={styles.navLink}>
          <button className={`${pathname.includes('search')?styles.active:''}`}>Search</button>
        </Link>
      </div>
    </nav>
  )
}
