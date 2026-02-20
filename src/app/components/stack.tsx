'use client';

import styles from '@/app/ui/media.module.css';
import { notoSans } from '@/app/ui/fonts';
import Image from 'next/image';
import { getMainTitle, shuffle } from '@/app/functions/data-prep';

function Poster({ movie, top, loc, locSetter }) {
  return (
    <li className={notoSans.className} onMouseOver={() => locSetter(movie.id)} onMouseLeave={() => locSetter('')}>
      <div className={`relative w-full h-full ${movie.id===loc?styles.active:''}`}>
        <Image
          src={`/posters/${movie.id}.jpg`}
          alt="Poster image"
          width={300}
          height={400}
          priority={top}
        />
        <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t to-transparent`} style={{ '--tw-gradient-from': movie.color, '--tw-gradient-to': 'transparent' }}></div>
        <div className={`absolute bottom-0 left-0 w-full text-center p-2`}>
          <h3 className={`text-[1.2vw] leading-[1.1em] mb-1`}>{getMainTitle(movie.title)}</h3>
          <p className={`text-[0.8vw]`}>{movie.year}</p>
        </div>
      </div>
    </li>
  )
}

export default function Stack({ data, top, shuffled, matchLocation, locSetter }) {
  return (
    <div className={styles.stack}>
      <ul>
        {data.map(movie => (
          <Poster movie={movie} top={top} loc={matchLocation} locSetter={locSetter} key={`stack${movie.id}`} />
        ))}
      </ul>
    </div>
  )
}
