import React, { useState } from "react";
import Image from "next/image";
import { Search } from "@/assets/icon";

interface SearchBoxButtonProps {
  image: string;
  alt: string;
  onClick: () => void;
  className?: string;
}

interface SearchBoxProps {
  onSearchTermChange: (searchTerm: string) => void;
  onSearchTermClear: () => void;
  itemNounSingular: string;
  itemNounPlural: string;
  itemsMatched: number;
  navigateButtons?: SearchBoxButtonProps[];
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearchTermChange,
  onSearchTermClear,
  itemNounSingular,
  itemNounPlural,
  itemsMatched,
  navigateButtons,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearchTermClear();
  };

  const handleSearchChange = (x: string) => {
    setSearchTerm(x);
    onSearchTermChange(x);
  };

  let matching = searchTerm !== '' ? ` filtered by "${searchTerm}"` : '';
  let heading = itemsMatched === 0
    ? searchTerm === ''
      ? ''
      : `No matches found for "${searchTerm}"`
    : itemsMatched === 1
      ? `${itemsMatched} ${itemNounSingular}${matching}`
      : `${itemsMatched} ${itemNounPlural}${matching}`;

  return (
    <section>
      <div className="flex justify-normal mb-4">
        <div className="relative w-full">
          <div
            className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <Search className="text-gray-30 dark:text-gray-970 w-4"/>
          </div>
          <input
            type="text"
            placeholder="搜索：ID、全名、关键字、拼音首字母..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="text-gray-900 dark:text-gray-100 bg-gray-50 border-gray-300 placeholder-gray-600 focus:ring-blue-500 focus:border-blue-500 text-tertiary w-full p-2 border flex ps-11 py-4 h-10 text-start bg-secondary-button outline-none betterhover:hover:bg-opacity-80 pointer items-center text-primary rounded-full align-middle text-base
              dark:bg-gray-950 dark:border-gray-700 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="w-4 absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-full"
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &times;
            </button>
          )}
        </div>
        {navigateButtons && (
          <div className="relative flex justify-end items-center">
            {
              navigateButtons?.map((button, index) => (
                <button key={index} onClick={button.onClick} className={`ml-4 ${button.className}`}>
                  <Image width={24} height={24} src={button.image} alt={button.alt}/>
                </button>
              ))
            }
          </div>
        )}
      </div>
      <h2 className="font-bold text-l text-primary mb-4 leading-snug">{heading}</h2>
    </section>
  );
};

export default SearchBox;
