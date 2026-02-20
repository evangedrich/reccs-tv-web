'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { notoSans } from '@/app/ui/fonts';
import styles from '@/app/ui/media.module.css';
import Image from 'next/image';
import { getMainTitle, shuffle } from '@/app/functions/data-prep';

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
    <li onClick={giveColor} className={notoSans.className}>
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
          <h3 className={`text-[1.5vw] leading-[1.1em] mb-1`}>{getMainTitle(movie.title)}</h3>
          <p className={`text-[0.9vw] mb-1`}>{movie.year}</p>
        </div>
      </div>
    </li>
  )
}

export default function Shelf({ data, top, title, shuffled, }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const shelfRef = useRef(null);
  let isShort = data.length <= 5;

  const shuffledData = useMemo(() => {
    const shuffleThis = [...data];
    return shuffle(shuffleThis);
  }, [data]);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;
  const displayData = shuffled ? shuffledData : data;

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth, scrollWidth } = e.target;
    const endMargin = window.innerWidth*0.035;
    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) <= 1 + endMargin;
    const isAtStart = scrollLeft <= 1 + endMargin;
    setIsAtEnd(isAtEnd);
    setIsAtStart(isAtStart);
  };
  const handleClick = (direction) => {
    if (shelfRef.current) {
      const { current } = shelfRef;
      const liWidth = current.querySelector('li').offsetWidth;
      const liVisCount = Math.floor(window.innerWidth/liWidth)-1;
      const liTotWidth = liWidth+window.innerWidth*0.025;
      const scrollAmount = Math.floor(liTotWidth * liVisCount);
      current.scrollBy({
        left: direction === 'L' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className={styles.shelf}>
      <h2>{title}</h2>
      <ul onScroll={(e) => handleScroll(e)} ref={shelfRef}>
        {displayData.map(movie => (
          <Poster movie={movie} top={top} key={`card${movie.id}`} />
        ))}
      </ul>
      <div style={{display:isShort?'none':'block'}}>
        <button style={{display:isAtStart?'none':'flex',}} onClick={() => handleClick('L')}>
          <div className="flex w-full justify-center"><span>&larr;</span></div>
        </button>
        <button style={{display:isAtEnd?'none':'flex',}} onClick={() => handleClick('R')}>
          <div className="flex w-full justify-center"><span>&rarr;</span></div>
        </button>
      </div>
    </div>
  )
}
