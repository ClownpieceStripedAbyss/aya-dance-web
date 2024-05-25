import React from "react";

interface ProcessingProps {
  className?: string;
}

export const Processing: React.FC<ProcessingProps> = ({ className }) => {
  return (
    // <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    // </svg>

    <svg className={`animate-spin ${className}`} viewBox="0 0 1024 1024" version="1.1"
         xmlns="http://www.w3.org/2000/svg">
      <path
        d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 128a298.666667 298.666667 0 1 0 0 597.333334 298.666667 298.666667 0 0 0 0-597.333334z"
        fill="currnetColor" fillOpacity=".05"/>
      <path
        d="M813.696 813.696c166.613333-166.613333 166.613333-436.778667 0-603.392-166.613333-166.613333-436.778667-166.613333-603.392 0A64 64 0 0 0 300.8 300.8a298.666667 298.666667 0 1 1 422.4 422.4 64 64 0 0 0 90.496 90.496z"
        fill="currentColor"/>
    </svg>
  );
}

interface SearchProps {
  className?: string;
}

export const Search: React.FC<SearchProps> = ({ className }) => {
  return (
    <svg className={className}
         viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M696.533333 635.690667l229.546667 229.546666a43.008 43.008 0 0 1-60.885333 60.842667l-229.546667-229.546667a341.333333 341.333333 0 1 1 60.842667-60.842666zM426.666667 682.666667a256 256 0 1 0 0-512 256 256 0 0 0 0 512z"
        fill="currentColor"/>
    </svg>
  );
}

