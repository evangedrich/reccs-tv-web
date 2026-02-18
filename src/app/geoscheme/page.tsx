'use client';

import { useState } from 'react';
import { fahkwang, inter, openSans } from '@/app/ui/fonts';
import styles from '@/app/ui/geoscheme.module.css';
import Link from 'next/link';
import { Map } from '@/app/components/map';
import { subregions } from '@/app/lib/subregions';
import { searchData } from '@/app/functions/data-prep';

export default function GeoschemePage() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currSubr, setCurrSubr] = useState('');
  const [currSubrId, setCurrSubrId] = useState('');
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState('0 0');
  const [ready, setReady] = useState(false);
  function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match) return null;
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  const handleMapLoad = (e: React.SyntheticEvent<HTMLObjectElement>) => {
    setTimeout(() => { setMapLoaded(true); }, 1);
    const svgDoc = e.currentTarget.contentDocument;
    if (!svgDoc) return;
    let color = '#000000';
    const paths = svgDoc.querySelectorAll('path');
    let allColors: string[] = [];
    paths.forEach(path => {
      const thisColor = rgbToHex(path.style.fill)?.substring(1);
      if (!allColors.includes(thisColor) && thisColor) { allColors.push(thisColor); }
    });
    paths.forEach(path => {
      const thisColor = rgbToHex(path.style.fill)?.substring(1);
      allColors.forEach(clr => { if (thisColor!==clr) { path.classList.add(`not_${clr}`); } });
      path.style.transition = 'opacity 400ms ease-in-out';
    });
  };
  const val = Math.floor(Math.random()*10000);
  const clicked = (e,color,coord,zoomAmount,name,id) => {
    const svgDoc = e.target.closest(`.${styles.mapContainer}`).querySelector('object')?.contentDocument;
    const allPaths = svgDoc.querySelectorAll(`path`);
    const irrelevantPaths = svgDoc.querySelectorAll(`.not_${color.slice(1)}`);
    if (zoom===1) {
      setOrigin(coord);
      setCurrSubr(name);
      setCurrSubrId(id);
      setTimeout(() => { setZoom(zoomAmount); }, 200);
      setTimeout(() => { irrelevantPaths.forEach(path => { path.style.opacity = 0.5; }); setReady(true); }, 700);
    }
  };
  const closeZoom = () => {
    setReady(false);
    document.querySelector(`object`)?.contentDocument.querySelectorAll(`path`).forEach(path => { path.style.opacity = 1; });
    setTimeout(() => { setZoom(1); }, 500);
    setTimeout(() => { setOrigin('0 0'); }, 1200);
  };
  const transformObj = { transform:`scale(${zoom})`, transformOrigin:origin, transition:'transform 500ms ease-in-out', };
  const filmLocations = [];
  searchData(['']).forEach(film => { if (film.location!==undefined) {filmLocations.push({ id: film.id, x: film.location.x, y: film.location.y, });} });
  return (
    <div style={{minHeight:'calc(100vh - 8vw)',height:'fit-content',display:'flex',alignItems:'center'}}>
      <div className={styles.container}>
        <div className={styles.textContainer} style={{width:zoom===1?'0%':'40%',}}>
          <div className={`${styles.text} ${inter.className}`}>
            <h2>{currSubr}</h2>
            <p>This is a description about this subregion.</p>
          </div>
        </div>
        <div className={`${styles.mapContainer}`} style={{opacity:mapLoaded?'1':'0',transition:'opacity 600ms ease-in-out',}}>
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
              <div className={`absolute w-3 h-3 bg-blue-500`}
                style={{left:loc.x+'%',top:loc.y+'%',opacity:(ready&&loc.id.includes(currSubrId))?1:0,transition:'opacity 500ms ease',}}
                key={`pin${loc.x}${loc.y}`}></div>
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
      </div>

    </div>
  );
}
