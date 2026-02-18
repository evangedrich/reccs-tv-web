'use client';

import { fahkwang, inter, openSans } from '@/app/ui/fonts';
import { subregions } from '@/app/lib/subregions';
import Shelf from '@/app/components/shelf';
import { searchData } from '@/app/functions/data-prep';

export default function Home() {
  return (
    <div>
      <Shelf data={searchData(['AF'])} top={true} title={'All Movies'} />
      <Shelf data={searchData(['AFNO'])} top={false} title={'North African Cinema'} />
    </div>
  );
}
