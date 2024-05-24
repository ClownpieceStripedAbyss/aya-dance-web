// /src/components/VideoItem.tsx
import React from 'react';
import { Video } from '@/types/video';
import Image from 'next/image';

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  return (
    <div
      className="flex items-center justify-between p-4 mb-4 rounded-lg border-b border-gray-300 bg-white dark:bg-neutral-800">
      <div className="flex items-center">
        <div className="w-32 mr-4 flex items-center justify-center">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            width={128}
            height={96}
            className="object-cover outline-link dark:outline-link outline-offset-2 aspect-video w-32 xs:w-36 select-none flex-col shadow-inner-border rounded-lg flex items-center overflow-hidden justify-center align-middle text-white/50 bg-cover bg-white bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] hover:opacity-95 transition-opacity"
          />
        </div>
        <div>
          <h2
            className="text-xl font-bold mb-1 outline-link dark:outline-link outline-offset-4 group flex flex-col flex-1 gap-0.5">{video.title}</h2>
          <p className="text-sm text-gray-500 text-tertiary leading-snug">Start: {video.start}, End: {video.end},
            Volume: {video.volume}</p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <button className="w-10 h-10 bg-green-400 text-white rounded-full flex items-center justify-center">
          <Image
            src="/play.svg"
            alt="Play"
            width={24}
            height={24}
          />
        </button>
        <button className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center">
          <Image
            src="/fav.svg"
            alt="Favorite"
            width={24}
            height={24}
          />
        </button>
        <button className="w-10 h-10 bg-yellow-400 text-white rounded-full flex items-center justify-center">Req
        </button>
      </div>
    </div>
  );
};

export default VideoItem;
