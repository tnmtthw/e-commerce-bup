"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
} from "@nextui-org/react";

// Define the structure of a category
interface Category {
  id: number;
  name: string;
}

const NewProductForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image_path: "",
    quantity: "",
    category_id: "",
  });

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/categories");
        const categoryData = await res.json();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image_path: file.name, // Adjust this if needed
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      category_id: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("category_id", formData.category_id);

    // Append the file to the FormData object
    if (fileInputRef.current?.files?.[0]) {
      formDataToSend.append("image_path", fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "post",
        body: formDataToSend, // Send FormData instead of JSON
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Product saved:", data);

      // Reset form data
      setFormData({
        name: "",
        price: "",
        description: "",
        image_path: "",
        quantity: "",
        category_id: "",
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-2">
            <Input
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">₱</span>
                </div>
              }
            />
            <Input
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <Input
              fullWidth
              label="Image URL"
              name="image_path"
              id="image_path"
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              required
              ref={fileInputRef} // Attach the ref here
            />
            <Input
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <Select
              label="Category ID"
              name="category_id"
              id="category_id"
              onChange={handleSelectChange}
              required
            >
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id.toString()}
                  textValue={category.name}
                >
                  {category.name}
                </SelectItem>
              ))}
            </Select>
            <div className="col-span-2 flex items-end justify-end">
              <Button type="submit" color="primary">
                Save Product
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default NewProductForm;
