'use client';

import { notoSans } from '@/app/ui/fonts';
import styles from '@/app/ui/main.module.css';
import useWindowSize from '@/app/hooks/useWindowSize';

export default function TurnDevice () {
  const { width, height } = useWindowSize();
  const isPortrait = width && height ? width < height : false;
  return (
    <>
    {isPortrait ?
      <div className={`fixed top-0 left-0 right-0 bottom-0 bg-[var(--color-back)] z-20 flex flex-col items-center justify-center ${notoSans.className} text-[6.5vw] font-[400]`}>
        Rotate your device
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={styles.turnDevice}>
          <g>
            <path
              d="M 20,60 Q 15,50 20,40 M 17.75,41 20,40 21,42  M 80,60 Q 85,50 80,40 M 82.25,59 80,60 79,58"
              fill="none" stroke="var(--color-front)"
              strokeWidth="0.22vw"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 30,15 Q 30,10 35,10 L 65,10 Q 70,10 70,15 L 70,85 Q 70,90 65,90 L 35,90 Q 30,90 30,85 Z  M 45,13 55,13"
              fill="var(--color-back)" stroke="var(--color-front)"
              strokeWidth="0.22vw"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    : <></>}
    </>
  )
}
