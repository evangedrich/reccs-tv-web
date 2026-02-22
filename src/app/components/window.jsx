import { useEffect } from 'react';
import styles from '@/app/ui/media.module.css';
import { notoSans, notoEmoji } from '@/app/ui/fonts';
import { searchData, getMainTitle } from '@/app/functions/data-prep';
import { textParser, runtimeToString } from '@/app/functions/text-prep';
import Image from 'next/image';

const dummyMovie = {
  id: 'AFCECFF',
  title: { original: 'Original Title', transliteration: 'Transliterated Title', translation: 'Translated Title', },
  year: '1996',
  group: { people: 'Nobody', language: 'Nothing', location: 'Nowhere', },
  info: 'This is a short description of a movie.',
  watch: 'https://evangedrich.com/',
  trailer: 'https://evangedrich.com/',
  color: 'red',
  location: { x: 0, y: 0, name: '', },
};

export default function Window({ show, changeShow, dataKey }) {
  useEffect(() => {  // prevent background scroll
    if (show) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [show]);
  const allMovies = searchData(['']);
  const data = dataKey==='' ? dummyMovie : allMovies.find(movie => movie.id===dataKey);
  console.log(data);
  return (
    <div className={`${styles.windowBg} ${show?styles.active:''} ${notoSans.className}`}>
      <div className="absolute top-0 right-0 bottom-0 left-0" onClick={() => changeShow(false)}></div>
      <div className={styles.window}>
        <div className={styles.wrapper}>
          <div>
            <h1>{getMainTitle(data.title)}</h1>
            <h2>
              {(typeof data.title === 'object' && 'transliteration' in data.title) ? <>{data.title.transliteration}</> : <></>}
              {(typeof data.title === 'object' && 'transliteration' in data.title && 'translation' in data.title) ? <>, </> : <></>}
              {(typeof data.title === 'object' && 'translation' in data.title) ? <>“{data.title.translation}”</> : <></>}
            </h2>
            <h2>{data.year} | {runtimeToString(data.runtime)}</h2>
            <h3>
              {'people' in data.group ? <span title='People'><span className={notoEmoji.className}>👥</span> {data.group.people}</span> : <></>}
              {'language' in data.group ? <span title='Language'><span className={notoEmoji.className}>🗣︎️</span> {data.group.language}</span> : <></>}
              {'country' in data.group ? <span title='Country'><span className={notoEmoji.className}>🌐</span> {data.group.country}</span> : <></>}
              {'location' in data.group ? <span title='Location'><span className={notoEmoji.className}>📍</span>{data.group.location}</span> : <></>}
            </h3>
            <>{textParser(data.info)}</>
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
        <button className={styles.closeWindow} onClick={() => changeShow(false)}>✕</button>
      </div>
    </div>
  )
}
