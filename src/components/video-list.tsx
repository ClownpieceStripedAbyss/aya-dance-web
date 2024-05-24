import { Video } from '@/types/video';
import VideoItem from './video-item';

interface VideoListProps {
  videos: Video[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  return (
    <div>
      {videos.map(video => (
        <VideoItem key={video.id} video={video}/>
      ))}
    </div>
  );
};

export default VideoList;
