import { useEffect, useRef } from 'react';
import styles from '@/app/ui/media.module.css';
import { notoSans, notoEmoji } from '@/app/ui/fonts';
import { searchData, getMainTitle, getMovieLink } from '@/app/functions/data-prep';
import { textParser, runtimeToString, idToSubregion, getNeighbors } from '@/app/functions/text-prep';
import Image from 'next/image';
import Suggestions from '@/app/components/suggestions';

const dummyMovie = {
  id: 'AFCECFF',
  title: { original: 'Original Title', transliteration: 'Transliterated Title', translation: 'Translated Title', },
  year: '1996',
  group: { people: 'Nobody', language: 'Nothing', location: 'Nowhere', },
  info: 'This is a short description of a movie.',
  watch: 'https://evangedrich.com/',
  trailer: 'https://evangedrich.com/',
  color: 'red',
  location: { x: 0, y: 0, name: 'Place', },
};

export default function Window({ show, changeShow, dataKey, changeKey, }) {
  const infoRef = useRef(null);
  const windowRef = useRef(null);
  const descRef = useRef(null);
  const suggRef = useRef(null);
  useEffect(() => {  // prevent background scroll
    if (show) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [show]);
  const allMovies = searchData(['']);
  const data = dataKey==='' ? dummyMovie : allMovies.find(movie => movie.id===dataKey);
  const clickInfo = () => {
    infoRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <div className={`${styles.windowBg} ${show?styles.active:''} ${notoSans.className}`} ref={windowRef}>
      <div className="absolute top-0 right-0 bottom-0 left-0" onClick={() => changeShow(false)}></div>
      <div className={styles.window}>
        <div className={styles.wrapper}>
          {/* <div>
            <div>
              <span className={notoEmoji.className}>▶︎</span>
              <span>Watch</span>
            </div>
            <div>
              <span className={notoEmoji.className}>🎦</span>
              <span>Trailer</span>
            </div>
            <div onClick={clickInfo}>
              <span className={notoEmoji.className}>ℹ︎</span>
              <span>More<br/>Info</span>
            </div>
          </div> */}
          <div>
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
              <span><a href={(data.watch)} target="_blank">▶&nbsp; Play</a></span>
              <span><span className={notoEmoji.className}>▶︎</span>&nbsp; Trailer</span>
              <span onClick={clickInfo}>⋯&nbsp; More info</span>
            </div>
            <div ref={descRef}>{textParser(data.info)}</div>
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
          <h4>Where to Watch</h4>
          <p>links</p>
          <h4>Neighboring Subregions</h4>
          <Suggestions data={searchData(getNeighbors(data.id))} setWindow={changeShow} setID={changeKey} windowRef={windowRef} suggRef={suggRef} descRef={descRef} />
          {/* <Shelf data={searchData([''])} top={true} title={'All Movies'} shuffled={true} /> */}
          <h4>More Info</h4>
          <div><p><b><i>Full description:</i></b></p>{textParser(data.info)}</div>
          <div ref={infoRef}></div>
        </div>
        <button className={styles.closeWindow} onClick={() => changeShow(false)}>✕</button>
      </div>
    </div>
  )
}
