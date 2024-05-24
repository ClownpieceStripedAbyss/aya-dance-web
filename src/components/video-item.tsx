import { Video } from '@/types/video';

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-300 bg-white dark:bg-neutral-800">
      <div className="w-30 h-20 mr-4 border border-gray-300 flex items-center justify-center">
        <img src={video.thumbnailUrl} alt={video.title} className="max-w-full max-h-full" />
      </div>
      <div className="flex-1">
        <div className="font-bold text-lg text-balance">{video.title}</div>
        <div className="text-sm text-gray-500">Start: {video.start}, End: {video.end}, Volume: {video.volume}</div>
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
