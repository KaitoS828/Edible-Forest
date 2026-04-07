import Image from 'next/image';
import Link from 'next/link';

export type Ensemble = {
  id: string;
  name: string;
  location: string;
  category: string;
  membersCount: number;
  imageUrl: string;
  description: string;
  tags: string[];
};

interface EnsembleCardProps {
  ensemble: Ensemble;
}

export default function EnsembleCard({ ensemble }: EnsembleCardProps) {
  return (
    <Link href={`/ensembles/${ensemble.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          {ensemble.imageUrl ? (
            <Image
              src={ensemble.imageUrl}
              alt={ensemble.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-[#FFFFFF] text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              {ensemble.category}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-[#3C6B4F] line-clamp-1 group-hover:text-[#3C6B4F] transition-colors">{ensemble.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {ensemble.location} ・ {ensemble.membersCount}人
          </p>
          <p className="text-[#3C6B4F] text-sm line-clamp-2 mb-4 flex-grow opacity-80">
            {ensemble.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {ensemble.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-[#FFFFFF] text-[#3C6B4F] text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            {ensemble.tags.length > 3 && (
              <span className="bg-[#FFFFFF] text-gray-500 text-xs px-2 py-1 rounded">
                +{ensemble.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
