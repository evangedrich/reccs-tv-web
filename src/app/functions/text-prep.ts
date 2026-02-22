import parse from 'html-react-parser';

export function textParser (text: string) {
  if (!text) return "";
  let htmlString = text.replace(/(\*\*)(.*?)\1/g, '<b>$2</b>');
  htmlString = htmlString.replace(/(\*)(.*?)\1/g, '<i>$2</i>');
  htmlString = `<p>${htmlString.replace(/\n/g, '</p><p>')}</p>`;
  return parse(htmlString);
}

export function runtimeToString (tot: number) {
  const hr: string = `${Math.floor(tot/60)}h`;
  const min: string = (tot%60!==0) ? `${tot%60}m` : '';
  return `${hr}${hr!==''?' ':''}${min}`
}
