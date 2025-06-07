import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Category } from "../models/category.model";

interface CategoryContextType {
  categories: Category[];
  refreshCategories: () => void;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth0();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const fetchCategories = async () => {
    if (!isAuthenticated || !user?.sub) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/categories?userId=${user.sub}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user, isAuthenticated]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        refreshCategories: fetchCategories,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook to use in components
export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
