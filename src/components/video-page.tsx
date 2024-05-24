'use client';

import { useEffect, useState } from 'react';
import CategoryList from './category-list';
import VideoList from './video-list';
import { Video } from '@/types/video';

interface VideoPageProps {
  initialVideos: Video[];
}

const VideoPage: React.FC<VideoPageProps> = ({ initialVideos }) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(initialVideos);

  useEffect(() => {
    const filtered = videos.filter(video => {
      return (
        (selectedCategory ? video.categoryName === selectedCategory : true) &&
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredVideos(filtered);
  }, [selectedCategory, searchTerm, videos]);

  const categories = Array.from(new Set(videos.map(video => video.categoryName)));

  return (
    <div className="flex">
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="flex-1 p-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <VideoList videos={filteredVideos} />
      </div>
    </div>
  );
};

export default VideoPage;
