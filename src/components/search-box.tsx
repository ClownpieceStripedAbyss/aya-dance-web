import React, { useState } from "react";

interface SearchBoxProps {
  onSearchTermChange: (searchTerm: string) => void;
  onSearchTermClear: () => void;
  itemNounSingular: string;
  itemNounPlural: string;
  itemsMatched: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearchTermChange,
  onSearchTermClear,
  itemNounSingular,
  itemNounPlural,
  itemsMatched,
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
    ? `No matches found for "${searchTerm}"`
    : itemsMatched === 1 ? `${itemsMatched} ${itemNounSingular}${matching}`
      : `${itemsMatched} ${itemNounPlural}${matching}`;

  return (
    <section>
      <div className="relative mb-4">
        <div
          className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <img src={"/search.svg"} className="text-gray-30 w-4"/>
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="text-tertiary w-full p-2 border border-gray-300 flex ps-11 py-4 h-10 text-start bg-secondary-button outline-none betterhover:hover:bg-opacity-80 pointer items-center text-primary rounded-full align-middle text-base"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="w-4 absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
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
      <h2 className="font-bold text-l text-primary mb-4 leading-snug">{heading}</h2>
    </section>
  );
};

export default SearchBox;
