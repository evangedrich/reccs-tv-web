import styles from '@/app/ui/media.module.css';
import { getPlatform } from '@/app/functions/data-prep';

export default function StreamingServices ({ data }) {
  const links = Array.isArray(data) ? data : [data];
  console.log(links);
  return (
    <div className={styles.stream}>
      <ul>
        {links.map((link,i) => (
          <a href={link} target="_blank" key={`streamLink${i}`}><li>{getPlatform(link)}</li></a>
        ))}
      </ul>
    </div>
  )
}
