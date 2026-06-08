import Link from 'next/link';
import { Photo } from '@/hooks/usePhotos';

interface Props {
  photos: Photo[];
  onDelete: (id: string) => void;
}

export default function PhotoGrid({ photos }: Props) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {photos.map((photo) => (
        <Link key={photo.id} href={`/album/${photo.id}`} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img src={photo.image_url} alt={photo.caption} className="w-full h-full object-cover" loading="lazy" />
        </Link>
      ))}
    </div>
  );
}
