import React, { useEffect } from 'react';
import { ListRow, ListRowProps } from './ListRow';
import { searchFoodPhoto } from '../services/pexels/searchFoodPhoto';
import { useGenerationCacheStore } from '../store/useGenerationCacheStore';

type Props = ListRowProps & {
  /** Fraza do wyszukania zdjęcia produktu (najlepiej angielska nazwa). Bez niej zostaje litera zastępcza. */
  photoQuery?: string;
};

/** Wiersz produktu z miniaturą z Pexels (pobieraną raz i zapisaną w cache). */
export function ProductListRow({ photoQuery, ...rowProps }: Props) {
  const key = photoQuery?.trim().toLowerCase() ?? '';
  const entry = useGenerationCacheStore((s) => (key ? s.photos[key] : undefined));

  useEffect(() => {
    if (key && !entry) searchFoodPhoto(key);
  }, [key, entry]);

  const imageUrl = entry && 'imageUrl' in entry ? entry.imageUrl : undefined;
  return <ListRow {...rowProps} thumbnailUri={imageUrl} />;
}
