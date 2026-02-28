'use client';

import { useState } from 'react';
import { fahkwang, inter, openSans } from '@/app/ui/fonts';
import styles from '@/app/ui/geoscheme.module.css';
import svgMap from '@/../public/map.svg';
import Image from 'next/image';
import Link from 'next/link';
import Stack from '@/app/components/stack';
import Window from '@/app/components/window';
import { subregions, getDesc } from '@/app/lib/subregions';
import { searchData } from '@/app/functions/data-prep';

const PinSVG = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={`${styles.pin} ${isActive?styles.active:''}`}>
      <path d='M12 21.7C12 21.7 4 14.3 4 9C4 4.6 7.6 1 12 1C16.4 1 20 4.6 20 9C20 14.3 12 21.7 12 21.7Z' stroke='var(--color-front)' fill='var(--color-mid-3)' />
      <circle cx="12" cy="9" r="3" fill="var(--color-front)" />
    </svg>
  )
};

export default function GeoschemePage() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [fakeMapLoaded, setFakeMapLoaded] = useState(false);
  const [currSubr, setCurrSubr] = useState('');
  const [currSubrId, setCurrSubrId] = useState('');
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState('0 0');
  const [ready, setReady] = useState(false);
  const [currLoc, setCurrLoc] = useState('');
  const [showWindow, setShowWindow] = useState(false);
  const [clickedKey, setClickedKey] = useState('');
  function rgbToHex(rgb: string) {
    const match = rgb.match(/\d+/g);
    if (!match) return null;
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    const componentToHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  const handleMapLoad = (e: React.SyntheticEvent<HTMLObjectElement>) => {
    // setTimeout(() => { setMapLoaded(true); }, 1);
    setMapLoaded(true);
    const svgDoc = e.currentTarget.contentDocument;
    if (!svgDoc) return;
    let color = '#000000';
    const paths = svgDoc.querySelectorAll('path');
    let allColors: string[] = [];
    paths.forEach(path => {
      const thisColor = rgbToHex(path.style.fill)?.substring(1);
      if (thisColor && !allColors.includes(thisColor)) { allColors.push(thisColor); }
      path.style.stroke = path.style.fill; path.style.strokeWidth = '0.25';
    });
    paths.forEach(path => {
      const thisColor = rgbToHex(path.style.fill)?.substring(1);
      allColors.forEach(clr => { if (thisColor!==clr) { path.classList.add(`not_${clr}`); } });
      path.style.transition = 'opacity 400ms ease-in-out';
    });
  };
  const val = Math.floor(Math.random()*10000);
  const clicked = (e: React.UIEvent<HTMLElement>, color: string, coord: string, zoomAmount: number, name: string, id: string) => {
    const svgDoc = e.currentTarget.closest(`.${styles.mapContainer}`)?.querySelector('object')?.contentDocument;
    if (svgDoc) {
      const allPaths = svgDoc.querySelectorAll(`path`);
      const irrelevantPaths = svgDoc.querySelectorAll(`.not_${color.slice(1)}`);
      if (zoom===1) {
        setOrigin(coord);
        setCurrSubr(name);
        setCurrSubrId(id);
        setTimeout(() => { setZoom(zoomAmount); }, 200);
        setTimeout(() => { (irrelevantPaths as NodeListOf<SVGPathElement>).forEach(path => { path.style.opacity = '0.4'; path.style.stroke = 'transparent'; }); setReady(true); }, 700);
      }
    }
  };
  const closeZoom = () => {
    setReady(false);
    document.querySelector(`object`)?.contentDocument?.querySelectorAll(`path`).forEach(path => { path.style.opacity = '1'; });
    setTimeout(() => { setZoom(1); }, 500);
    setTimeout(() => { setOrigin('0 0'); }, 1200);
    setTimeout(() => { document.querySelector(`object`)?.contentDocument?.querySelectorAll(`path`).forEach(path => { path.style.stroke = path.style.fill; }); }, 1200);
  };
  const transformObj = { transform:`scale(${zoom})`, transformOrigin:origin, transition:'transform 500ms ease-in-out', };
  const getZoom = (id: string) => { return subregions.find(subr => id.slice(0,4)===subr.id)?.zoom.amount ?? 1; }
  const calcPinZoom = (z: number) => { return z<=3.5 ? 1-0.444*(z-3.5) : 1-0.2*(z-3.5) };
  const filmLocations: { id: string, x: number, y: number, name: string, zoom: number, }[] = [];
  searchData(['']).forEach(film => { if (film.location!==undefined) {filmLocations.push({ id: film.id, x: film.location.x, y: film.location.y, name: film.location.name ?? '', zoom: getZoom(film.id), });} });
  const pinOver = (id: string) => { setCurrLoc(id); };
  const pinLeave = () => { setCurrLoc(''); };
  return (
    <div style={{minHeight:'calc(100vh - 8vw)',height:'fit-content',display:'flex',alignItems:'center'}}>
      <div className={styles.container} style={{boxShadow:zoom===1?'none':'inset -0.1vw 0 0 0 var(--color-mid-2)'}}>

        <div className={styles.textContainer} style={{width:zoom===1?'0%':'40%',}}>
          <div className={`${styles.text} ${inter.className}`}>
            <h2>{currSubr}</h2>
            <p style={{fontSize:'1.3vw',lineHeight:'1.2em'}}>{getDesc(currSubrId)!==''?getDesc(currSubrId):'This is a description about this subregion.'}</p>
            <Stack data={searchData([currSubrId])} top={false} shuffled={false} matchLocation={currLoc} locSetter={setCurrLoc} showWindow={setShowWindow} setID={setClickedKey} isSearch={false} />
          </div>
        </div>

        <div className={``} style={{display:zoom!==1?'none':'block',opacity:mapLoaded?'0':'1',}}>
          <img src="/map.svg" alt="Geoscheme movie map" className="absolute top-0 left-0 w-[92.95vw] ml-[1vw]" style={{aspectRatio: "16 / 7.05"}} fetchPriority="high" onLoad={() => setFakeMapLoaded(true)} />
          <div className={`${styles.mapLabels} ${openSans.className}`}>{subregions.map(subregion => (
            <button
              key={`selectFake${subregion.id}`}
              style={{left:`${subregion.text.x+(50-subregion.text.x)*0.022}%`,top:`${subregion.text.y}%`,display:fakeMapLoaded?'block':'none',}}
            >{subregion.text.el}</button>
          ))}</div>
        </div>

        <div className={`${styles.mapContainer}`} style={{opacity:mapLoaded?'1':'0',boxShadow:zoom===1?'none':'inset 0 0 0 0.1vw var(--color-mid-2)'}}>
          <div className={`w-full h-full`} style={transformObj}>
            <object
              key={`map${val}`}
              data="/map.svg"
              type="image/svg+xml"
              onLoad={handleMapLoad}
            >
              Your browser does not support SVGs
            </object>
          </div>

          <div className={`${styles.mapLabels}`} style={transformObj}>
            {filmLocations.map(loc => (
              <div className={`absolute`}
                style={{left:loc.x+'%',top:loc.y+'%',opacity:(ready&&loc.id.includes(currSubrId))?1:0,transition:'opacity 500ms ease',width:`${calcPinZoom(loc.zoom)}vw`,height:`${calcPinZoom(loc.zoom)}vw`,}}
                key={`pin${loc.x}${loc.y}`}
                onMouseOver={() => pinOver(loc.id)}
                onMouseLeave={pinLeave}
                onClick={() => { setShowWindow(true); setClickedKey(loc.id); }}
              ><PinSVG isActive={loc.id===currLoc} />
                {/* <p className={`absolute text-[0.37vw] top-[0] left-[1.05vw] tracking-tighter whitespace-nowrap ${currLoc===loc.id?'':'hidden'} cursor-default`}>{loc.name}</p> */}
              </div>
            ))}
          </div>

          <div className={`${styles.mapLabels} ${openSans.className} ${zoom===1?'block':'hidden'}`} style={transformObj}>
            {subregions.map(subregion => (
              ('el' in subregion.text)
                ? <button
                  key={`select${subregion.id}`}
                  style={{left:`${subregion.text.x}%`,top:`${subregion.text.y}%`,opacity:origin==='0 0'?'1':'0',}}
                  onClick={(e) => clicked(e,subregion.color,`${subregion.zoom.x}% ${subregion.zoom.y}%`,subregion.zoom.amount,subregion.name,subregion.id)}
                >{subregion.text.el}</button>
                : <div key={subregion.id}></div>
            ))}
          </div>

          <button className={styles.fullView} style={{display:zoom===1?'none':'block',}} onClick={closeZoom}>&larr;</button>
        </div>

        <div
          className={`absolute w-[13vw] h-[auto] top-0 right-0 bg-[var(--color-back)] m-[2vw] p-[2vw] pr-0 pt-[1.5vw] border-[var(--color-mid-2)] border-[0.1vw] ${zoom!==1&&currSubrId==='OCPL'?'block':'hidden'}`}
          style={{opacity:ready&&currSubrId==='OCPL'?1:0,transition:'opacity 500ms linear',}}
        >
          <object key={`map${val}2`} data="/other/nz.svg" type="image/svg+xml"></object>
        </div>

      </div>

      <Window show={showWindow} changeShow={setShowWindow} dataKey={clickedKey} changeKey={setClickedKey} />
    </div>
  );
}
