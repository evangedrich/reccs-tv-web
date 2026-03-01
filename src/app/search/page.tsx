'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import styles from '@/app/ui/search.module.css';
import { notoSans } from '@/app/ui/fonts';
import { broadSearch } from '@/app/functions/data-prep';
import TurnDevice from '@/app/components/turn-device';
import Stack from '@/app/components/stack';
import Window from '@/app/components/window';

export default function SearchPage() {
  const [input, setInput] = useState('');
  const [showWindow, setShowWindow] = useState(false);
  const [clickedKey, setClickedKey] = useState('');
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [locDummy, setLocDummy] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const Keyboard = () => {
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    const numbers = ["1","2","3","4","5","6","7","8","9","0"];
    const keyPress = (e: React.MouseEvent<HTMLButtonElement>) => {
      const key = e.currentTarget.textContent;
      if (key==='⌫') {
        setInput(prevInput => { return prevInput.slice(0, -1); });
      } else if (key==='␣') {
        setInput(input+' ');
      } else {
        setInput(input+key);
      }
    };
    return (
      <div className={`${styles.keyboard} ${notoSans.className}`}>
        <ul>
          {alphabet.map((letter,i) => (
            <li key={`letter${i}`}><button onClick={(e) => keyPress(e)}>{letter}</button></li>
          ))}
          {numbers.map((n,i) => (
            <li key={`number${i}`}><button onClick={(e) => keyPress(e)}>{n}</button></li>
          ))}
        </ul>
        <div>
          <div><button onClick={(e) => keyPress(e)}>␣</button></div>
          <div><button onClick={(e) => keyPress(e)}>⌫</button></div>
        </div>
      </div>
    )
  };
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (parentRef.current && childRef.current) {
        const hasOverflow = childRef.current.offsetHeight > parentRef.current.offsetHeight;
        setIsOverflowing(hasOverflow);
      }
    }; checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);
  return (
    <div className={styles.searchPage}>
      <div>
        <Keyboard />
      </div>
      <div ref={parentRef} style={{alignItems:isOverflowing?'flex-start':'center',}}>
        <div className={`${styles.formInput} ${notoSans.className}`} ref={childRef}>
          <form onSubmit={handleSubmit}>
            <label>
              <input
                type="text"
                autoComplete="off"
                value={input}
                onChange={handleTyping}
              />
              {/* <button
                type="submit"
                className={``}
              >arrow</button> */}
            </label>
          </form>
          <Stack data={broadSearch(input)} showWindow={setShowWindow} setID={setClickedKey} isSearch={true} top={false} shuffled={true} matchLocation={locDummy} locSetter={setLocDummy} />
        </div>
      </div>
      <Window show={showWindow} changeShow={setShowWindow} dataKey={clickedKey} changeKey={setClickedKey} />
      <TurnDevice />
    </div>
  )
}
