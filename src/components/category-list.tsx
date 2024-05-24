interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-48 border-r border-gray-300">
      {categories.map(category => (
        <div
          key={category}
          className={`p-4 cursor-pointer ${category === selectedCategory ? 'bg-gray-200' : 'bg-white'}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
