"use client";

import React from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import useSWR from "swr";

interface Category {
  id: number;
  name: string;
}

interface CategoryButtonProps {
  onCategorySelect: (categoryName: string) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CategoryButton: React.FC<CategoryButtonProps> = ({
  onCategorySelect,
}) => {
  const { data: categories = [], error } = useSWR<Category[]>(
    "http://127.0.0.1:8000/api/categories",
    fetcher,
  );

  const handleCardClick = (categoryName: string) => {
    onCategorySelect(categoryName);
  };

  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <ButtonGroup className="w-full flex flex-wrap" radius="none">
        <Button
          onPress={() => handleCardClick("All")}
          className="flex-grow flex-shrink flex-basis-1/5 min-w-[150px] hover:bg-blue-600"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            onPress={() => handleCardClick(category.name)}
            className="flex-grow flex-shrink flex-basis-1/5 min-w-[150px] hover:bg-blue-600"
          >
            {category.name}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default CategoryButton;
