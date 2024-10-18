"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Input,
    Select,
    SelectItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
} from "@nextui-org/react";

import { 
    Slide, 
    toast, 
} from 'react-toastify';
import { useTheme } from 'next-themes';

import 'react-toastify/dist/ReactToastify.css';

interface Category {
    id: number;
    name: string;
}

interface AddProductModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onProductAdded: () => void;
}


const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onOpenChange, onProductAdded }) => {
    const { theme } = useTheme();
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
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`, {
                method: "post",
                body: formDataToSend, // Send FormData instead of JSON
            });
    
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log("Product saved:", data);
    
            // Call the onProductAdded (mutate) function here
            onProductAdded(); // Trigger the mutate function
    
            toast.success('Successfully added a new product.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme === 'dark' ? 'dark' : 'light',
                transition: Slide,
            });
    
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
            onOpenChange(false); // Close the modal after successful submission
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error('Failed to add the product. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme === 'dark' ? 'dark' : 'light',
                transition: Slide,
            });
        }
    };

    return (
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add new product</ModalHeader>
                        <ModalBody>
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
                                        label="Image File"
                                        name="image_path"
                                        id="image_path"
                                        onChange={handleFileChange}
                                        type="file"
                                        accept="image/*"
                                        required
                                        ref={fileInputRef}
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
                                        label="Category"
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
                                    <div className="col-span-2 gap-x-2 flex items-end justify-end mb-4">
                                        <Button onPress={() => onOpenChange(false)}>Close</Button>
                                        <Button type="submit" color="primary">
                                            Save Product
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddProductModal;