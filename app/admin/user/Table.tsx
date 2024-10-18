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
import { EditIcon, DeleteIcon } from "@/components/admin/icon";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
}
import { 
  toast 
} from 'react-toastify';
import CustomToastContainer from "../components/CustomToastContainer";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UserTable: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // For delete modal
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure(); // For update modal
  const {
    data: users = [],
    error,
    mutate,
  } = useSWR<User[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, fetcher);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Handle input changes for the update modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle product update
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update the product");
      }

      console.log("User updated successfully!");
      toast.success("Updated successfully!");
      // Refresh the product list after updating
      await mutate();

      // Close the modal
      onEditOpenChange();
    } catch (error) {
      console.error("Error updating the product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${selectedUser.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }

      console.log("User deleted successfully!");
      toast.success("Deleted successfully!");

      // Refresh the product list after deletion
      await mutate();

      // Close the modal
      onOpenChange();
    } catch (error) {
      console.error("Error deleting the product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open the edit modal and populate form with selected product
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    onEditOpen();
  };

  if (error) return <div>Error loading user</div>;
  if (!users.length) return <div>Loading...</div>;

  return (
    <div>
      <CustomToastContainer/>
      <Table>
        <TableHeader>
          <TableColumn>FULLNAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>PHONE</TableColumn>
          <TableColumn>ADDRESS</TableColumn>
          <TableColumn className="text-center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                <Tooltip content="Edit product">
                    <span
                      onClick={() => handleEditUser(user)}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    >
                      <EditIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete product">
                    <span
                      onClick={() => {
                        setSelectedUser(user);
                        onOpen();
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{selectedUser?.first_name}</ModalHeader>
          <ModalBody>Are you sure you want to delete this user?</ModalBody>
          <ModalFooter>
            <Button onClick={() => onOpenChange()}>Close</Button>
            <Button
              color="danger"
              onClick={handleDeleteProduct}
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
          <ModalHeader>Edit {selectedUser?.first_name}</ModalHeader>
          <ModalBody>
            <Input
              name="first_name"
              label="First name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
            <Input
              name="last_name"
              label="Last name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
            <Input
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Input
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => onEditOpenChange()}>Close</Button>
            <Button color="primary" onClick={handleUpdateUser} isLoading={loading}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserTable;
