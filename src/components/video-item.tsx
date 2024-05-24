// /src/components/VideoItem.tsx
import { Video } from '@/types/video';

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-300">
      <img src={video.thumbnailUrl} alt={video.title} className="w-30 h-20 mr-4" />
      <div className="flex-1">
        <div className="font-bold text-balance">{video.title}</div>
        <div className="flex justify-end">
          <button className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Play</button>
          <button className="mr-2 px-4 py-2 bg-green-500 text-white rounded">Favorite</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded">Request</button>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
