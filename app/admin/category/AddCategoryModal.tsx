"use client";

import React, {
  useState,
} from "react";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import {
  toast,
} from 'react-toastify';
import CustomToastContainer from "../components/CustomToastContainer";

interface AddCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: () => void;
}

const AddcCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onOpenChange, onCategoryAdded }) => {
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

      toast.success("Successfully added a new category");
      const data = await response.json();
      console.log("Category saved:", data);
      onCategoryAdded();
      setFormData({
        name: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Error saving category");
    }
  };


  return (
    <div>
      <CustomToastContainer />
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add new category</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <Input
                    fullWidth
                    isClearable
                    label="Category Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <div className="col-span-2 gap-x-2 flex items-end justify-end mt-4 mb-4">
                    <Button onPress={() => onOpenChange(false)}>Close</Button>
                    <Button type="submit" color="primary">
                      Save Category
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddcCategoryModal;