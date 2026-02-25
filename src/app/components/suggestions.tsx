import React, { Dispatch, SetStateAction } from 'react';
import { flatMovieType, getMainTitle } from '@/app/functions/data-prep';
import { idToSubregion } from '@/app/functions/text-prep';
import { notoSans, notoEmoji } from '@/app/ui/fonts';
import styles from '@/app/ui/media.module.css';
import Image from 'next/image';

function Poster({ movie, setWindow, setID, windowRef, suggRef, descRef, }: { movie: flatMovieType, setWindow: Dispatch<SetStateAction<boolean>>, setID: Dispatch<SetStateAction<string>>, windowRef: React.RefObject<HTMLDivElement>, suggRef: React.RefObject<HTMLUListElement>, descRef: React.RefObject<HTMLDivElement>, }) {
  const clickPoster = () => {
    setWindow(false);
    setTimeout(() => {
      setID(movie.id);
      setWindow(true);
      windowRef.current.scrollTop = 0;
      descRef.current.scrollTop = 0;
      suggRef.current.scrollLeft = 0;
    }, 300);
  };
  return (
    <li onClick={clickPoster} className={notoSans.className}>
      <div className={`relative w-full h-full`} style={{backgroundColor:movie.color??'gray',}}>
        <Image
          src={`/posters/${movie.id}.jpg`}
          alt="Poster image"
          width={300}
          height={400}
          priority
        />
        <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t to-transparent`} style={{ '--tw-gradient-from': movie.color, '--tw-gradient-to': 'transparent' } as React.CSSProperties}></div>
        <div className={`absolute bottom-0 left-0 w-full text-center p-2`}>
          <h3 className={`text-[1.5vw] leading-[1.1em] mb-1`}>{getMainTitle(movie.title)}</h3>
          <h6 className={`text-[0.9vw] mb-1`}>{movie.year}</h6>
        </div>
        <div className={`absolute top-0 left-0 w-full text-center p-2`}>
          <h5 className={`leading-[1.1em] mb-1`}>{idToSubregion(movie.id)}</h5>
        </div>
      </div>
    </li>
  )
}

export default function Suggestions({ data, setWindow, setID, windowRef, suggRef, descRef, }: { data: flatMovieType[], setWindow: Dispatch<SetStateAction<boolean>>, setID: Dispatch<SetStateAction<string>>, windowRef: React.RefObject<HTMLDivElement>, suggRef: React.RefObject<HTMLUListElement>, descRef: React.RefObject<HTMLDivElement>, }) {
  return (
    <div className={styles.suggested}>
      <ul ref={suggRef}>
        {data.map(movie => (
          <Poster movie={movie} setWindow={setWindow} setID={setID} windowRef={windowRef} suggRef={suggRef} descRef={descRef} key={`suggest${movie.id}`} />
        ))}
      </ul>
    </div>
  );
}
