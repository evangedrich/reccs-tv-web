import parse from 'html-react-parser';
import { subregions } from '@/app/lib/subregions';

export function textParser (text: string) {
  if (!text) return "";
  let htmlString: string = text.replace(/(\*\*)(.*?)\1/g, '<b>$2</b>');
  htmlString = htmlString.replace(/(\*)(.*?)\1/g, '<i>$2</i>');
  htmlString = `<p>${htmlString.replace(/\n/g, '</p><p>')}</p>`;
  return parse(htmlString);
};

export function runtimeToString (tot: number) {
  let hr: string | number = Math.floor(tot/60); hr = hr===0 ? '' : hr;
  const min: string = (tot%60!==0) ? `${tot%60}m` : '';
  return `${hr}${hr!==''?'h ':''}${min}`;
};
export function idToSubregion (id: string) {
  let subrName: string = '';
  subregions.forEach(subregion => {
    if (id.includes(subregion.id)) { subrName = subregion.name; }
  }); return subrName;
};
export const getNeighbors = (id: string) => {
  let neighborsArr: string[] = [''];
  subregions.forEach(subregion => {
    if (id.includes(subregion.id) && 'neighbors' in subregion) { neighborsArr = subregion.neighbors; }
  }); return neighborsArr;
};
