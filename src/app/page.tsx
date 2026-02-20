'use client';

import { fahkwang, inter, openSans } from '@/app/ui/fonts';
import { subregions } from '@/app/lib/subregions';
import Shelf from '@/app/components/shelf';
import { searchData } from '@/app/functions/data-prep';

export default function Home() {
  return (
    <div>
      <Shelf data={searchData([''])} top={true} title={'All Movies'} shuffled={true} />
      <Shelf data={searchData(['AM'])} top={false} title={'American Cinema'} shuffled={true} />
      <Shelf data={searchData(['AS','EU'])} top={false} title={'Eurasian Cinema'} shuffled={true} />
      <Shelf data={searchData(['AF'])} top={false} title={'African Cinema'} shuffled={true} />
      <Shelf data={searchData(['OC'])} top={false} title={'Oceanian Cinema'} shuffled={true} />
    </div>
  );
}
