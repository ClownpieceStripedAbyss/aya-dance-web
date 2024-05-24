// /src/components/VideoItem.tsx
import React from 'react';
import { Video } from '@/types/video';
import Image from 'next/image';

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  return (
    <div className="flex items-center justify-between p-4 mb-4 rounded-lg border-b border-gray-300 bg-white dark:bg-neutral-800">
      <div className="flex items-center">
        <div className="w-32 h-24 border mr-4 flex items-center justify-center bg-gray-100">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            width={128}
            height={96}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-1">{video.title}</h2>
          <p className="text-sm text-gray-500">Start: {video.start}, End: {video.end}, Volume: {video.volume}</p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">Play</button>
        <button className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">Fav</button>
        <button className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center">Req</button>
      </div>
    </div>
  );
};

export default VideoItem;
