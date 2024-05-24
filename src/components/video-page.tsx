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
        (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.titleSpell.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredVideos(filtered);
  }, [selectedCategory, searchTerm, videos]);

  const categories = Array.from(new Set(videos.map(video => video.categoryName)));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-row w-full">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="flex-1 py-0 px-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <VideoList videos={filteredVideos}/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoPage;
