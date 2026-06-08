import Link from 'next/link';
import { Photo } from '@/hooks/usePhotos';

interface Props {
  photos: Photo[];
}

export default function Timeline({ photos }: Props) {
  // 按月份分组
  const grouped: Record<string, Photo[]> = {};
  photos.forEach((p) => {
    const month = p.month_tag || p.created_at.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(p);
  });

  const months = Object.keys(grouped).sort().reverse();

  return (
    <div className="space-y-6">
      {months.map((month) => (
        <div key={month}>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 sticky top-0 bg-white py-1">
            {month}
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {grouped[month].map((photo) => (
              <Link key={photo.id} href={`/album/${photo.id}`} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={photo.image_url} alt={photo.caption} className="w-full h-full object-cover" loading="lazy" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
