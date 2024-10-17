"use client";

import React, { useState } from "react";
import { Input, Button, Textarea } from "@nextui-org/react"; // Ensure the correct imports

const NewCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Product saved:", data);
      // Reset form or provide feedback to the user
      setFormData({
        name: "",
      });
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        fullWidth
        isClearable
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <Button type="submit" color="primary">
        Save Category
      </Button>
    </form>
  );
};

export default NewCategoryForm;
