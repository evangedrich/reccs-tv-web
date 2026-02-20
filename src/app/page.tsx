'use client';

import { useState } from 'react';
import { fahkwang, inter, openSans } from '@/app/ui/fonts';
import { subregions } from '@/app/lib/subregions';
import Shelf from '@/app/components/shelf';
import Window from '@/app/components/window';
import { searchData } from '@/app/functions/data-prep';

export default function Home() {
  const [showWindow, setShowWindow] = useState(false);
  const [clickedKey, setClickedKey] = useState('');
  return (
    <div>
      <Shelf data={searchData([''])} top={true} title={'All Movies'} shuffled={true} setWindow={setShowWindow} setID={setClickedKey} />
      <Shelf data={searchData(['AM'])} top={false} title={'American Cinema'} shuffled={true} setWindow={setShowWindow} setID={setClickedKey} />
      <Shelf data={searchData(['AS','EU'])} top={false} title={'Eurasian Cinema'} shuffled={true} setWindow={setShowWindow} setID={setClickedKey} />
      <Shelf data={searchData(['AF'])} top={false} title={'African Cinema'} shuffled={true} setWindow={setShowWindow} setID={setClickedKey} />
      <Shelf data={searchData(['OC'])} top={false} title={'Oceanian Cinema'} shuffled={true} setWindow={setShowWindow} setID={setClickedKey} />
      <Window show={showWindow} changeShow={setShowWindow} dataKey={clickedKey} />
    </div>
  );
}
