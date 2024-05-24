// /src/components/VideoList.tsx
import { Video } from '@/types/video';
import VideoItem from './video-item';

interface VideoListProps {
  videos: Video[];
  emptyHeading: string | null;
}

const VideoList: React.FC<VideoListProps> = ({ videos, emptyHeading }) => {
  const count = videos.length;
  let heading = emptyHeading;
  if (count > 0) {
    const noun = count > 1 ? 'Videos' : 'Video';
    heading = count + ' ' + noun;
  }

  return (
    <section>
      <h2 className="font-bold text-l text-primary mb-4 leading-snug">{heading}</h2>
      {
        videos.map(video => (
          <VideoItem key={video.id} video={video}/>
        ))
      }
    </section>
  );
};

export default VideoList;
