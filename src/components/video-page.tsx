'use client';

import React, { useEffect, useRef, useState } from 'react';
import CategoryList from './category-list';
import VideoList from './video-list';
import SearchBox from './search-box';
import { Category, Video, videoMatchesQuery } from '@/types/video';
import '@/styles/scrollbar.css';

interface VideoPageProps {
  initialCategories: Category[];
}

interface CategoryScrollPositions {
  [category: string]: number;
}

const VideoPage: React.FC<VideoPageProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.title || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(categories[0]?.entries || []);
  const [categoryScrollPositions, setCategoryScrollPositions] = useState<CategoryScrollPositions>({});
  const videoListRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string | null>(null);

  useEffect(() => {
    const videos = categories.find(category => category.title === selectedCategory)?.entries || [];
    const filtered = videos.filter(video => {
      return videoMatchesQuery(video, searchTerm);
    });
    setFilteredVideos(filtered);
  }, [selectedCategory, searchTerm, categories]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page whenever filter changes
  }, [filteredVideos]);

  const handleClearSearch = () => {
    videoListRef?.current?.scrollTo(0, 0);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    let pos = categoryScrollPositions[category];
    videoListRef?.current?.scrollTo(0, pos || 0);
  };

  const handleScroll = () => {
    // Update the scroll position for the current category
    if (selectedCategory && videoListRef.current) {
      const currentScrollPosition = videoListRef.current.scrollTop;
      setCategoryScrollPositions(prevPositions => ({
        ...prevPositions,
        [selectedCategory]: currentScrollPosition,
      }));
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
    videoListRef?.current?.scrollTo(0, 0);
  };

  const handleLastPageClick = () => {
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    setCurrentPage(totalPages);
    videoListRef?.current?.scrollTo(0, 0);
  };

  const handleNextPageClick = () => {
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    setCurrentPage(Math.min(totalPages, currentPage + 1));
    videoListRef?.current?.scrollTo(0, 0);
  }

  const handlePreviousPageClick = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
    videoListRef?.current?.scrollTo(0, 0);
  }

  const handlePageChange = () => {
    if (inputPage && inputPage.trim() !== '') {
      let page = parseInt(inputPage, 10);
      const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
      page = Math.min(Math.max(page, 1), totalPages);
      setCurrentPage(page);
      setInputPage(null);
      videoListRef?.current?.scrollTo(0, 0);
    }
  };

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredVideos.length);
  const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 w-full max-w-7xl flex-1 flex flex-row justify-between font-mono text-sm lg:flex">
        <div className="category-list-container overflow-y-auto scrollbar-custom">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>
        <div className="video-list-container flex-1 flex flex-col pb-24 px-4 h-full">
          <div className="search-box-sticky">
            <SearchBox
              onSearchTermClear={handleClearSearch}
              onSearchTermChange={(e) => setSearchTerm(e)}
              itemsMatched={filteredVideos.length}
              itemNounSingular={`Video in ${selectedCategory}`}
              itemNounPlural={`Videos in ${selectedCategory}`}
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-custom" ref={videoListRef} onScroll={handleScroll}>
            <VideoList videos={paginatedVideos}/>
          </div>
          <div className="paging-container-sticky flex justify-end mt-4">
            <div>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border px-2 py-1 mr-2"
              >
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
                <option value="300">300 per page</option>
              </select>
            </div>
            <div>
              <button onClick={handleFirstPageClick} disabled={currentPage === 1}
                      className="px-2 py-1 mr-2 border">⇤
              </button>
              <button onClick={handlePreviousPageClick} disabled={currentPage === 1}
                      className="px-2 py-1 mr-2 border">←
              </button>
              <input
                type="text"
                value={inputPage != null ? inputPage : currentPage}
                onChange={(e) => setInputPage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePageChange();
                  }
                }}
                className="border px-2 py-1 mr-2 w-12 text-center"
              />
              <span className="px-2 py-1 mr-2 w-12 text-base">/ {totalPages}</span>
              <button onClick={handleNextPageClick}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 mr-2 border">→
              </button>
              <button onClick={handleLastPageClick} disabled={currentPage === totalPages}
                      className="px-2 py-1 mr-2 border">⇥
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        // @media (max-width: 1024px) {
          .root-container {
            padding: 0px;
          }
          .category-list-container, .video-list-container {
            position: relative;
          }
          .category-list-container {
            margin-bottom: 16px;
            padding-top: 24px;
          }
          .search-box-sticky {
            position: sticky;
            top: 0px;
            z-index: 10;
            padding-top: 24px;
            background-color: rgb(var(--background-start-rgb));
          }
        // }
        // @media (min-width: 1025px) {
        //   .root-container {
        //     padding: 24px;
        //   }
        //   .category-list-container {
        //     position: fixed;
        //     inset-y: 12;
        //     left: 20;
        //     width: 25%;
        //   }
        //   .video-list-container {
        //     position: fixed;
        //     width: 60%;
        //     left: 25%;
        //     padding-left: 4%;
        //   }
        //   .search-box-sticky {
        //     position: static;
        //   }
        // }
      `}</style>
    </main>
  );
};

export default VideoPage;
