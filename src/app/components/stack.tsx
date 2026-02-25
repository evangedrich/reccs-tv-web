'use client';

import React, { Dispatch, SetStateAction } from 'react';
import styles from '@/app/ui/media.module.css';
import { notoSans } from '@/app/ui/fonts';
import Image from 'next/image';
import { flatMovieType, getMainTitle, shuffle } from '@/app/functions/data-prep';

function Poster({ movie, top, loc, locSetter, showWindow, setID, isSearch }: { movie: flatMovieType, top: boolean, loc: string, locSetter: Dispatch<SetStateAction<string>>, showWindow: Dispatch<SetStateAction<boolean>>, setID: Dispatch<SetStateAction<string>>, isSearch: boolean }) {
  return (
    <li
      className={notoSans.className}
      onMouseOver={() => locSetter ? locSetter(movie.id) : null}
      onMouseLeave={() => locSetter ? locSetter(''): null}
      onClick={() => { showWindow(true); setID(movie.id); }}
      style={{width:isSearch?'22%':'30%',}}
    >
      <div className={`relative w-full h-full ${movie.id===loc?styles.active:''}`} style={{backgroundColor:movie.color??'gray',}}>
        <Image
          src={`/posters/${movie.id}.jpg`}
          alt="Poster image"
          width={300}
          height={400}
          priority={top}
        />
        <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t to-transparent`} style={{ '--tw-gradient-from': movie.color, '--tw-gradient-to': 'transparent' } as React.CSSProperties}></div>
        <div className={`absolute bottom-0 left-0 w-full text-center p-2`}>
          <h3 className={`text-[1.2vw] leading-[1.1em] mb-1`}>{getMainTitle(movie.title)}</h3>
          <p className={`text-[0.8vw]`}>{movie.year}</p>
        </div>
      </div>
    </li>
  )
}

export default function Stack({ data, top, shuffled, matchLocation, locSetter, showWindow, setID, isSearch }: { data: flatMovieType[], top: boolean, shuffled: boolean, matchLocation: string, locSetter: Dispatch<SetStateAction<string>>, showWindow: Dispatch<SetStateAction<boolean>>, setID: Dispatch<SetStateAction<string>>, isSearch: boolean }) {
  return (
    <div className={styles.stack}>
      <ul style={{maxHeight:isSearch?'35vw':'30.5vw',paddingBottom:isSearch?'5vw':'0.5vw'}}>
        {data.map(movie => (
          <Poster movie={movie} top={top} loc={matchLocation} locSetter={locSetter} showWindow={showWindow} setID={setID} isSearch={isSearch} key={`stack${movie.id}`} />
        ))}
      </ul>
    </div>
  )
}
