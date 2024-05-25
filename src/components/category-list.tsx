import React from 'react';
import { Category } from "@/types/video";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-48 border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800 flex-shrink-0 rounded-lg">
      {categories.map((category, index) => (
        <div
          key={category.title}
          className={`p-4 border-b border-gray-300 dark:border-gray-700 cursor-pointer ${category.title === selectedCategory ? 'bg-gray-200 dark:bg-neutral-700' : 'bg-white dark:bg-neutral-800'} ${
            index === 0 ? 'rounded-t-lg' : index === categories.length - 1 ? 'rounded-b-lg border-b-0' : ''
          }`}
          onClick={() => onSelectCategory(category.title)}>
          {category.title}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
