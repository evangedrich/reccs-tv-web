import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import styles from '@/app/ui/media.module.css';
import mainStyles from '@/app/ui/main.module.css';
import { fahkwang, openSans, notoSans, notoEmoji } from '@/app/ui/fonts';
import { searchData, getMainTitle, getMovieLink } from '@/app/functions/data-prep';
import { textParser, runtimeToString, idToSubregion, getNeighbors } from '@/app/functions/text-prep';
import Image from 'next/image';
import StreamingServices from '@/app/components/stream';
import Suggestions from '@/app/components/suggestions';

const dummyMovie = {
  id: 'AFCECFF',
  title: { original: 'Original Title', transliteration: 'Transliterated Title', translation: 'Translated Title', },
  year: '1996',
  runtime: 100,
  genre: ['Great','Classic'],
  group: { people: 'Nobody', language: 'Nothing', location: 'Nowhere', },
  info: 'This is a short description of a movie.',
  watch: 'https://evangedrich.com/',
  trailer: 'https://evangedrich.com/',
  color: 'red',
  location: { x: 0, y: 0, name: 'Place', },
};

export default function Window({ show, changeShow, dataKey, changeKey, }) {
  const [showFs, setShowFs] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showReccsTitle, setShowReccsTitle] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const windowRef = useRef(null);
  const descRef = useRef(null);
  const suggRef = useRef(null);
  const reccsTimerRef = useRef(null);
  const videoStartTimerRef = useRef(null);
  useEffect(() => { // prevent background scroll
    if (show) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [show]);
  useEffect(() => { // sense esc key press
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowFs((prevShowFs) => {
          if (prevShowFs) {
            closeTrailer(); // Call your function
            return false;    // Close fullscreen
          }
          return prevShowFs;
        });
      }
    }; window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);
  const allMovies = searchData(['']);
  const data = dataKey==='' ? dummyMovie : allMovies.find(movie => movie.id===dataKey);
  const playTrailer = (url) => {
    setTrailerUrl(url);
    setShowFs(true);
    reccsTimerRef.current = setTimeout(() => { setShowReccsTitle(true); }, 500);
  };
  const closeTrailer = () => {
    clearTimeout(reccsTimerRef.current);
    clearTimeout(videoStartTimerRef.current);
    setShowFs(false);
    setHasPlayed(false);
    setShowReccsTitle(false);
  };
  const handleVideoStart = () => {
    if (!hasPlayed) {
      setHasPlayed(true);
      videoStartTimerRef.current = setTimeout(() => { setShowReccsTitle(false); }, 2750);
    }
  };
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  return (
    <div className={`${styles.windowBg} ${show?styles.active:''} ${notoSans.className}`} ref={windowRef}>
      <div className="fixed top-0 right-0 bottom-0 left-0" onClick={() => changeShow(false)}></div>
      <div className={styles.window}>
        <div className={styles.wrapper}>
          <div style={{maxHeight:showInfo?'fit-content':'32vw',}}>
            <h1>{getMainTitle(data.title)}</h1>
            <h2>
              {(typeof data.title === 'object' && 'transliteration' in data.title) ? <>{data.title.transliteration}</> : <></>}
              {(typeof data.title === 'object' && 'transliteration' in data.title && 'translation' in data.title) ? <>, </> : <></>}
              {(typeof data.title === 'object' && 'translation' in data.title) ? <span>“{data.title.translation}”</span> : <></>}
            </h2>
            <h2>{idToSubregion(data.id)} | {data.year} | {runtimeToString(data.runtime)}</h2>
            <h3>
              {'people' in data.group ? <span title='People'><span className={notoEmoji.className}>👥</span> {data.group.people}</span> : <></>}
              {'language' in data.group ? <span title='Language'><span className={notoEmoji.className}>🗣︎️</span> {data.group.language}</span> : <></>}
              {'country' in data.group ? <span title='Country'><span className={notoEmoji.className}>🌐</span> {data.group.country}</span> : <></>}
              {'location' in data.group ? <span title='Location'><span className={notoEmoji.className}>📍</span>{data.group.location}</span> : <></>}
            </h3>
            <div>
              {data.watch!==''
                ? <a href={getMovieLink(data.watch)} target="_blank">&#9654;&nbsp; Play</a>
                : <span className={styles.inactive}>▶&nbsp; Not Available</span>
              }
              <button onClick={() => playTrailer(data.trailer)}><span className={`text-[var(--color-front)] ${notoEmoji.className}`}>▶︎</span>&nbsp; Trailer</button>
              <span onClick={toggleInfo}>⋯&nbsp; {showInfo?'Less':'More'} info</span>
            </div>
            <div ref={descRef} style={{overflow:showInfo?'visible':'hidden',}}>
              {getMainTitle(data.title)!=='Rehefa mihaona ny ranomasina sy ny kintana'||showInfo?textParser(data.info):<></>}
              {showInfo?<p><i><span style={{fontWeight:'500'}}>Genre tags</span>:</i>&nbsp; {data.genre.map((tag,i) => (<span key={`tag${i}`}>{tag}{i<data.genre.length-1?', ':''}</span>))}</p>:<></>}
            </div>
          </div>
          <div>
            <Image
              src={`/posters/${data.id}.jpg`}
              alt="Poster image"
              width={600}
              height={800}
              priority
            />
          </div>
        </div>
        <div className={styles.wrapper2}>
          {data.watch!=='' ? <><h4>Where to Watch</h4>
          <StreamingServices data={data.watch} /></> : <></>}
          <h4>Neighboring Subregions</h4>
          <Suggestions data={searchData(getNeighbors(data.id))} setWindow={changeShow} setID={changeKey} windowRef={windowRef} suggRef={suggRef} descRef={descRef} />
          {/* <Shelf data={searchData([''])} top={true} title={'All Movies'} shuffled={true} /> */}
        </div>
        <button className={styles.closeWindow} onClick={() => { changeShow(false); setShowInfo(false); }}>✕</button>
      </div>
      {showFs?<div className={`fixed top-0 right-0 bottom-0 left-0 z-20 ${styles.fsBg} ${showFs?'block':'hidden'}`}>
        <div className={`relative w-full h-full m-auto flex items-center justify-center bg-black`} style={{opacity:hasPlayed?'1':'0'}}>
          {/* <iframe width="560" height="315" className="w-[90%] h-[90%]" style={{opacity:}}
            src={`https://www.youtube.com/embed/MsUAluISvgE?autoplay=${showFs?"1":"0"}&rel=0&controls=0`} title="YouTube video player" frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
          ></iframe> */}
          <div className={`relative w-[90%] h-[90%]`} style={{opacity:hasPlayed?'1':'0',transition:'opacity 1s linear 3.75s',pointerEvents:'none',}}>
            <ReactPlayer
            src={trailerUrl}
            width="100%"
            height="100%"
            rel="0"
            onPlay={handleVideoStart}
            onEnded={closeTrailer}
            playsinline={true}
            playing={showFs}
            inert={showFs?null:""}
            />
          {/* <div className="absolute w-full h-[8vh] bg-black top-0 left-0 opacity-[50%]"></div>
          <div className="absolute w-full h-[8vh] bg-black bottom-0 left-0 opacity-[50%]"></div> */}
          </div>
          <div className={`absolute w-full h-full top-0 left-0 flex flex-col items-center justify-center`}
            style={{opacity:showReccsTitle?'1':'0',transform:hasPlayed?'scale(0.86)':'scale(0.78)',transition:'opacity 700ms ease, transform 4s linear'}}
          >
            <div className={`${openSans.className} font-light text-[2.25vw] leading-none tracking-widest`}>FILM</div>
            <div className={`${mainStyles.title} ${fahkwang.className} text-[5vw] mt-[-0.8vw]`}><span>R</span><span>E</span><span>C</span><span>C</span><span>S</span></div>
          </div>
        </div>
        <button className={`${styles.closeWindow} z-30`} onClick={closeTrailer}>&larr;</button>
      </div>:<></>}
    </div>
  )
}
