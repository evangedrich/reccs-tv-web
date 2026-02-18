interface movieType {
  id: string,
  entries: {
    title: { original: string, transliteration?: string, translation?: string } | string,
    year: string,
    group: { people?: string, language?: string, country?: string, },
    info: string,
    watch: string,
    trailer: string,
    color?: string,
    location?: { x: number, y: number },
  }[],
}

export const movies: movieType = [
  {
    id: 'AFNOCFF',
    entries: [
      {
        title: {original: "ⵜⵉⴳⵎⵎⵉ ⵏ ⵉⴳⵔⴰⵏ", transliteration: "Tigmi n Igren", translation: "House in the Fields"},
        year: `2017`,
        group: { people: "Shilha", language: "Tashelhiyt", country: "Morocco", },
        info: `In a remote village in the High Atlas Mountains of Morocco, at the crossroad between tradition and change, two sisters experience the last seasons of childhood.\nThe film is a sensitive portrait of a Berber community whose social fabric and centuries-old traditions are gripped by change. With long, portrait-like takes, precise observations of daily life, and strikingly photographed images of the lush green surroundings and the majestic red of the massif, <i>Tigmi n Igren</i> manages to bring a faraway world up astonishingly close.`,
        watch: 'https://www.kanopy.com/en/product/house-fields',
        trailer: 'https://youtu.be/dVunYbRl2hA',
        color: '#8d796e',
        location: { x: 48, y: 32, },
      },
      {
        title: { original: "ⴰⴽⵓⵏⴰⴽ ⵜⴷⴰⵍⴰⵜ ⵜⴰⵀⴰ ⵜⴰⵣⵓⴳⵀⴰⵉ", transliteration: "Akounak Tedalat Taha Tazoughai", translation: "Rain the Color of Blue with A Little Red In It" },
        year: `2015`,
        group: { people: "Tuareg", language: "Tamasheq", country: "Niger/USA", },
        info: `description`,
        watch: '',
        trailer: 'https://youtu.be/QHgEuzv-zNA',
        color: '#4f3457',
        location: { x: 51.7, y: 43.5, },
      },
    ],
  },
  {
    id: 'AFEACFF',
    entries: [
      {
        title: "Supa Modo",
        year: '2018',
        group: { language: "Swahili", country: "Kenya" },
        info: ``,
        watch: 'https://www.kanopy.com/en/product/15088228',
        trailer: 'https://youtu.be/G7ToKioHCoU',
        color: '#5a949c',
      },
    ],
  },
  {
    id: 'AFWECFF',
    entries: [
      {
        title: { original: "ߦߋ߮ߟߋߣ", transliteration: "Yeelen", translation: "Brightness" },
        year: '1987',
        group: {people: "Bambara", language: "Bambara/Fula", country: "Mali"},
        info: ``,
        watch: 'https://www.kanopy.com/en/product/yeelen',
        trailer: 'https://youtu.be/GRlNG9lJ6rs',
        color: '#d4a555',
      },
    ],
  },
];
