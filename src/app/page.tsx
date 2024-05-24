import { Video } from '@/types/video';
import VideoPage from '../components/video-page';

async function fetchVideos(): Promise<Video[]> {
  // Replace with your data fetching logic
  return [
    {
      id: 1,
      title: 'Video 1',
      category: 1,
      categoryName: 'Category 1',
      titleSpell: 'video1',
      volume: 1,
      start: 0,
      end: 10,
      flip: false,
      thumbnailUrl: '/thumbnails/1.jpg',
    },
    {
      id: 2,
      title: 'Video 2',
      category: 2,
      categoryName: 'Category 2',
      titleSpell: 'video2',
      volume: 2,
      start: 10,
      end: 20,
      flip: false,
      thumbnailUrl: '/thumbnails/2.jpg',
    },
    // more videos...
  ];
}

const Home: React.FC = async () => {
  const videos = await fetchVideos();
  return <VideoPage initialVideos={videos}/>;
};

export default Home;
