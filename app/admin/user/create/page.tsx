"use client";

import React, { useState } from "react";
import { Input, Button, Textarea } from "@nextui-org/react"; // Ensure the correct imports

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/users", {
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
      console.log("User saved:", data);
      // Reset form or provide feedback to the user
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        type: "",
      });
    } catch (error) {
      console.error("Error saving User:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        fullWidth
        name="type"
        type="email"
        value="user"
        className="hidden"
      />
      <Input
        fullWidth
        clearable
        label="First name"
        name="first_name"
        type="text"
        value={formData.first_name}
        onChange={handleChange}
        required
      />
      <Input
        fullWidth
        clearable
        label="Last name"
        name="last_name"
        type="text"
        value={formData.last_name}
        onChange={handleChange}
        required
      />
      <Input
        fullWidth
        clearable
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        fullWidth
        clearable
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <Button type="submit" color="primary">
        Save User
      </Button>
    </form>
  );
};

export default NewUserForm;
