"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Button } from "@nextui-org/button";
import {
  Tooltip,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { EditIcon, DeleteIcon, PlusSymbol } from "@/components/admin/icon";
import {
  toast
} from 'react-toastify';
import CustomToastContainer from "../components/CustomToastContainer";
import AddCategoryModal from "./AddCategoryModal";

interface Category {
  id: number;
  name: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CategoryTable: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange, } = useDisclosure();
  const {
    data: categories = [],
    error,
    mutate,
  } = useSWR<Category[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, fetcher);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  // Handle input changes for the update modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle category update
  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${selectedCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update the category");
      }

      console.log("Category updated successfully!");
      toast.success("Updated successfully!");

      await mutate();

      onEditOpenChange();
    } catch (error) {
      console.error("Error updating the category:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${selectedCategory.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete the category");
      }

      console.log("Category deleted successfully!");

      await mutate();
      toast.success("Deleted successfully!");

      onDeleteOpenChange();
    } catch (error) {
      console.error("Error deleting the category:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open the edit modal and populate form with selected category
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
    });
    onEditOpen();
  };

  if (error) return <div>Error loading categories</div>;
  if (!categories.length) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-4">
        <Button
          onPress={onOpen}
          color="primary"
          endContent={<PlusSymbol />}
        >
          Add new
        </Button>
        <AddCategoryModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onCategoryAdded={mutate}
        />
      </div>
      <CustomToastContainer />
      <Table>
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn className="text-center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Tooltip content="Edit product">
                    <span
                      onClick={() => handleEditCategory(category)}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    >
                      <EditIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete category">
                    <span
                      onClick={() => {
                        setSelectedCategory(category);
                        onDeleteOpen();
                      }}
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                    >
                      <DeleteIcon />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          <ModalHeader>{selectedCategory?.name}</ModalHeader>
          <ModalBody>Are you sure you want to delete this category?</ModalBody>
          <ModalFooter>
            <Button onClick={onDeleteOpenChange}>Close</Button>
            <Button
              color="danger"
              onClick={handleDeleteCategory}
              isLoading={loading}
            >
              Yes, Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          <ModalHeader>Edit {selectedCategory?.name}</ModalHeader>
          <ModalBody>
            <Input
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onEditOpenChange}>Close</Button>
            <Button color="primary" onClick={handleUpdateCategory} isLoading={loading}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default CategoryTable;