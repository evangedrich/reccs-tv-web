import { movies } from '@/app/lib/movies';
import { idToSubregion } from '@/app/functions/text-prep';

export interface flatMovieType {
  id: string,
  title: { original: string, transliteration?: string, translation?: string, } | string,
  year: string,
  runtime: number,
  genre: string[],
  group: { people?: string, language?: string, country?: string, location?: string, },
  info: string,
  watch: string | string[],
  trailer: string,
  color?: string,
  location?: { x: number, y: number, name?: string, },
}

// returns a flat array of all relevant movie entries
export const searchData = (query: string[]) => {
  const results: flatMovieType[] = [];
  query.forEach(str => {
    let findings = movies;
    /*if (str.length===2) {
      findings = movies.filter(movie => movie.id.startsWith(str));
    } else if (str.length>=4) {
      findings = [movies.find(movie => movie.id.startsWith(str))];
    }*/findings = movies.filter(movie => movie.id.startsWith(str));
    findings.forEach(found => {
      if (!found) return;
      found.entries.forEach((entry,i) => {
        const flatMovie: flatMovieType = {
          id: `${i===0 ? found.id : found.id+i}`,
          title: entry.title,
          year: entry.year,
          runtime: entry.runtime,
          genre: entry.genre,
          group: entry.group,
          info: entry.info,
          watch: entry.watch,
          trailer: entry.trailer,
          color: entry.color,
          location: entry.location,
        }; results.push(flatMovie);
      });
    });
  });
  return results;
};

// Fisher-Yates shuffles elements in an array (AI prepped this one for me)
export const shuffle = (arr: any) => {
  let currIndex = arr.length, randIndex;
  for (let i=0; i<currIndex; i++) {
    randIndex = Math.floor(Math.random() * currIndex);
    currIndex--;
    [arr[currIndex], arr[randIndex]] = [arr[randIndex], arr[currIndex]];
  } return arr;
};

// returns correct primary title
export const getMainTitle = (title: string | { original: string, transliteration?: string, translation?: string, }) => {
  return (typeof title === 'string') ? title : title.original;
};
export const getMovieLink = (link: string | string[]) => {
  return (Array.isArray(link)) ? link[0] : link;
};
export const getPlatform = (url: string) => {
  let name = "[Unknown]";
  if (url.includes("kanopy")) { name="Kanopy"; }
  else if (url.includes("netflix")) { name="Netflix"; }
  else if (url.includes("tv.apple")) { name="Apple TV"; }
  else if (url.includes("amazon")) { name="Amazon Prime"; }
  else if (url.includes("youtu.be")) { name="Youtube"; }
  else if (url.includes("klassiki")) { name="Klassiki"; }
  else if (url.includes("max")) { name="HBO Max"; }
  else if (url.includes("tubitv")) { name="Tubi"; }
  else if (url.includes("vimeo")) { name="Vimeo"; }
  else if (url.includes("archive")) { name="Internet Archive"; }
  else if (url.includes("hoopla")) { name="Hoopla"; }
  else if (url.includes("fawesome")) { name="Fawesome TV"; }
  else if (url.includes("mubi")) { name="MUBI"; }
  else if (url.includes("hulu")) { name="Hulu"; }
  else if (url.includes("criterion")) { name="The Criterion Channel"; }
  else if (url.includes("fandango")) { name="Fandango at Home"; }
  return name;
};

export const broadSearch = (query: string) => {
  const movieDb = searchData(['']);
  query = query.toLowerCase();
  let findings = movieDb;
  const checkRegion = (id: string) => { const subrName = idToSubregion(id.slice(0,4)).toLowerCase(); return subrName.includes(query); };
  const checkTitle = (title: any) => { return (typeof title === 'string') ? title.toLowerCase().includes(query) : Object.values(title).some(value => typeof value === 'string' && value.toLowerCase().includes(query)); }
  const checkGenre = (arr: string[]) => { let isMatch=false; arr.forEach(genre => { if (genre.toLowerCase().includes(query)) { isMatch=true; } }); return isMatch; };
  const checkGroup = (grp: any) => { return Object.values(grp).some(value => typeof value === 'string' && value.toLowerCase().includes(query)); };
  const checkStream = (links: string | string[]) => { let isMatch=false; if (Array.isArray(links)) { links.forEach(link => { if (getPlatform(link).toLowerCase().includes(query)) { isMatch=true; } }); } else { isMatch=getPlatform(links).toLowerCase().includes(query); } return isMatch; };
  findings = movieDb.filter(movie => (
    checkRegion(movie.id) || checkTitle(movie.title) || checkGenre(movie.genre) || checkGroup(movie.group) || checkStream(movie.watch)
  ));
  return findings;
};
