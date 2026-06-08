import { getThumbnailUrl } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ThumbnailCardProps {
  image: { name: string; path: string };
  isSelected: boolean;
  onClick: () => void;
}

export default function ThumbnailCard({ image, isSelected, onClick }: ThumbnailCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'thumbnail-card relative aspect-square rounded-2xl overflow-hidden',
        'ring-1 ring-inset transition-all duration-300 cursor-pointer',
        'group',
        isSelected
          ? 'ring-accent/60 ring-2 shadow-lg shadow-accent/15 scale-[1.02]'
          : 'ring-white/[0.06] hover:ring-white/[0.12] hover:scale-[1.01] hover:shadow-md'
      )}
    >
      <img
        src={getThumbnailUrl(image.path)}
        alt={image.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Filename */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-[11px] text-white/90 truncate font-medium">{image.name}</p>
      </div>
    </button>
  );
}
