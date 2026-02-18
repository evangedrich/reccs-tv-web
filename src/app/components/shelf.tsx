'use client';

import { useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
import styles from '@/app/ui/media.module.css';
import Image from 'next/image';
import { getMainTitle } from '@/app/functions/data-prep';

function Poster({ movie, top }) {
  const [bgColor, setBgColor] = useState('blue');
  useEffect(() => {
    const fac = new FastAverageColor();
    fac.getColorAsync(`/posters/${movie.id}.jpg`, { algorithm: 'sqrt' })
      .then(color => {
        setBgColor(color.rgba);
      })
      .catch(e => console.error("Color extraction failed:", e));
    return () => fac.destroy();
  }, [`/posters/${movie.id}.jpg`]);
  const giveColor = () => { console.log(bgColor); };
  const twColor = 'from-['+movie.color+']';
  return (
    <li onClick={giveColor}>
      <div className={`relative w-full h-full`} style={{backgroundColor:movie.color??'gray',}}>
        <Image
          src={`/posters/${movie.id}.jpg`}
          alt="Poster image"
          width={300}
          height={400}
          priority={top}
        />
        <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t to-transparent`} style={{ '--tw-gradient-from': movie.color, '--tw-gradient-to': 'transparent' }}></div>
        <div className={`absolute bottom-0 left-0 w-full text-center p-2`}>
          <h3 className={`text-[1.5vw]`}>{getMainTitle(movie.title)}</h3>
          <p className={`text-[0.9vw]`}>{movie.year}</p>
        </div>
      </div>
    </li>
  )
}

export default function Shelf({ data, top, title }) {
  return (
    <div className={styles.shelf}>
      <h2>{title}</h2>
      <ul>
        {data.map(movie => (
          <Poster movie={movie} top={top} key={`card${movie.id}`} />
        ))}
      </ul>
    </div>
  )
}
