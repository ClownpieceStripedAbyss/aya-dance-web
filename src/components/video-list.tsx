// /src/components/VideoList.tsx
import VideoItem from './video-item';
import { Video } from '@/types/video';

interface VideoListProps {
  videos: Video[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  return (
    <div>
      {videos.map(video => (
        <VideoItem key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoList;
