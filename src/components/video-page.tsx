'use client';

import React, { useEffect, useRef, useState } from 'react';
import CategoryList from './category-list';
import VideoList from './video-list';
import SearchBox from './search-box';
import { CAT_FAVOURITES, Category, KEY_FAVOURITES, Video, videoMatchesQuery } from '@/types/video';
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
    const videos = selectedCategory === CAT_FAVOURITES
      ? (JSON.parse(localStorage.getItem(KEY_FAVOURITES) ?? "[]") as Video[])
      : categories.find(category => category.title === selectedCategory)?.entries || [];
    const filtered = videos.filter(video => {
      return videoMatchesQuery(video, searchTerm);
    });
    setFilteredVideos(filtered);
  }, [selectedCategory, searchTerm, categories]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page whenever filter changes
  }, [filteredVideos]);

  const setCurrentScrollPosition = (position: number) => {
    videoListRef?.current?.scrollTo(0, position);
    setCategoryScrollPositions(prevPositions => ({
      ...prevPositions,
      [selectedCategory]: position,
    }));
  }

  const handleClearSearch = () => {
    setCurrentScrollPosition(0);
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
    setCurrentScrollPosition(0);
  };

  const handleLastPageClick = () => {
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    setCurrentPage(totalPages);
    setCurrentScrollPosition(0);
  };

  const handleNextPageClick = () => {
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    setCurrentPage(Math.min(totalPages, currentPage + 1));
    setCurrentScrollPosition(0);
  }

  const handlePreviousPageClick = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
    setCurrentScrollPosition(0);
  }

  const handlePageChange = () => {
    if (inputPage && inputPage.trim() !== '') {
      let page = parseInt(inputPage, 10);
      const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
      page = Math.min(Math.max(page, 1), totalPages);
      setCurrentPage(page);
      setInputPage(null);
      setCurrentScrollPosition(0);
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
        <div className="video-list-container flex-1 flex flex-col px-4 h-full">
          <div className="search-box-sticky">
            <SearchBox
              onSearchTermClear={handleClearSearch}
              onSearchTermChange={(e) => setSearchTerm(e)}
              itemsMatched={filteredVideos.length}
              itemNounSingular={`Video in ${selectedCategory}`}
              itemNounPlural={`Videos in ${selectedCategory}`}
              navigateButtons={[
                {
                  image: '/github-mark.svg',
                  alt: 'GitHub',
                  className: 'animate-spin',
                  onClick: () => {
                    window.open('https://github.com/ClownpieceStripedAbyss/aya-dance-server');
                  },
                },
              ]}
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-custom" ref={videoListRef} onScroll={handleScroll}>
            <VideoList videos={paginatedVideos}/>
          </div>
          <div className="paging-container-sticky flex justify-between mt-4">
            <div>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border px-2 py-1 mr-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              >
                <option value="50">50 首/页</option>
                <option value="100">100 首/页</option>
                <option value="300">300 首/页</option>
              </select>
            </div>
            <div>
              <button onClick={handleFirstPageClick} disabled={currentPage === 1}
                      className="px-2 py-1 mr-2 border border-gray-300 dark:border-gray-700">⇤
              </button>
              <button onClick={handlePreviousPageClick} disabled={currentPage === 1}
                      className="px-2 py-1 mr-2 border border-gray-300 dark:border-gray-700">←
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
                className="border px-2 py-1 mr-2 w-12 text-center text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              />
              <span className="px-2 py-1 mr-2 w-12 text-base">/ {totalPages}</span>
              <button onClick={handleNextPageClick}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 mr-2 border border-gray-300 dark:border-gray-700">→
              </button>
              <button onClick={handleLastPageClick} disabled={currentPage === totalPages}
                      className="px-2 py-1 mr-2 border border-gray-300 dark:border-gray-700">⇥
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .root-container {
          padding: 0px;
        }
        .category-list-container {
          position: sticky;
          top: 0;
          height: calc(100vh - 24px); /* Adjust height to ensure it fits within the viewport */
          padding-top: 24px;
        }
        .video-list-container {
          width: 100%;
          height: calc(100vh); /* Adjust height to ensure it fits within the viewport */
          padding-bottom: 24px;
        }
        .search-box-sticky {
          position: sticky;
          top: 0px;
          z-index: 10;
          padding-top: 24px;
          background-color: rgb(var(--background-start-rgb));
        }
      `}</style>
    </main>
  );
};

export default VideoPage;
