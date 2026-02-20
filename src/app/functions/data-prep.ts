import { movies } from '@/app/lib/movies';

interface flatMovieType {
  id: string,
  title: string,
  year: string,
  group: { people?: string, language?: string, country?: string, },
  info: string,
  watch: string,
  trailer: string,
  color: string,
  location: string,
}

// returns a flat array of all relevant movie entries
export const searchData = (query: string[]) => {
  const results: flatMovieType[] = [];
  query.forEach(str => {
    let findings = movies;
    if (str.length===2) {
      findings = movies.filter(movie => movie.id.startsWith(str));
    } else if (str.length>=4) {
      findings = [movies.find(movie => movie.id.startsWith(str))];
    }
    findings.forEach(found => {
      if (!found) return;
      found.entries.forEach((entry,i) => {
        const flatMovie: flatMovieType = {
          id: `${i===0 ? found.id : found.id+i}`,
          title: entry.title,
          year: entry.year,
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
export const shuffle = (arr) => {
  let currIndex = arr.length, randIndex;
  for (let i=0; i<currIndex; i++) {
    randIndex = Math.floor(Math.random() * currIndex);
    currIndex--;
    [arr[currIndex], arr[randIndex]] = [arr[randIndex], arr[currIndex]];
  } return arr;
};

// returns correct primary title
export const getMainTitle = (title) => {
  return (typeof title === 'string') ? title : title.original;
};
