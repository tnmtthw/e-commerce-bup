"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { Image, Tooltip, Select, SelectItem, Pagination } from "@nextui-org/react";
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
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import { EditIcon, DeleteIcon } from "@/components/admin/icon";
import Header from "./Header";
import { PlusSymbol } from '@/components/admin/icon';
import AddProductModal from "./AddProductModal";

interface Product {
  id: number;
  name: string;
  discount_type: string;
  discount_value: number;
  price: number;
  description: string;
  image_path: string;
  quantity: number;
  category: Category;
}

interface Category {
  id: number;
  name: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProductTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange, } = useDisclosure();
  const {
    data: products = [],
    error,
    mutate,
  } = useSWR<Product[]>("http://127.0.0.1:8000/api/products", fetcher);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(products.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products.slice(start, end);
  }, [page, products]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    discount_type: "",
    discount_value: "",
    price: "0",
    description: "",
    quantity: "0",
    category_id: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "discount_value" || name === "price" || name === "quantity") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      category_id: value,
    });
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            quantity: Number(formData.quantity),
            category_id: formData.category_id,
            discount_type: formData.discount_type,
            discount_value: Number(formData.discount_value),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update the product");
      }

      console.log("Product updated successfully!");

      await mutate();

      onEditOpenChange();
    } catch (error) {
      console.error("Error updating the product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${selectedProduct.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }

      console.log("Product deleted successfully!");

      await mutate();

      onDeleteOpenChange();
    } catch (error) {
      console.error("Error deleting the product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      discount_type: product.discount_type || "",
      discount_value:
        product.discount_value !== null
          ? product.discount_value.toString()
          : "0",
      price: product.price.toString(),
      description: product.description,
      quantity: product.quantity.toString(),
      category_id: product.category.id.toString(),
    });
    onEditOpen();
    onDeleteOpen();
  };

  if (error) return <div>Error loading products</div>;
  if (!products.length) return <div>Loading...</div>;

  return (
    <div>
    <Button 
        onPress={onOpen}
        color="primary" 
        endContent={<PlusSymbol />}
      >
        Add new
      </Button>
      <AddProductModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onProductAdded={mutate}
      />  
      <Table
        selectionMode="single"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>DISCOUNT</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>QTY</TableColumn>
          <TableColumn className="text-center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((product) => ( 
            <TableRow key={product.id}>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Gallery withDownloadButton>
                    <Item original={product.image_path} height="500" width="500">
                      {({ ref, open }) => (
                        <Image
                          ref={ref}
                          onClick={open}
                          src={product.image_path}
                          alt="Product Image"
                          width={50}
                          height={50}
                          className="object-cover cursor-pointer"
                        />
                      )}
                    </Item>
                  </Gallery>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <small className="text-gray-600">Product # : {product.id}</small>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                {product.discount_value !== null
                  ? product.discount_type === "percent"
                    ? `${product.discount_value}%`
                    : `₱${product.discount_value}`
                  : "0"}
              </TableCell>
              <TableCell>
                {product.discount_value !== null && product.discount_value > 0 ? (
                  <>
                    <span className="line-through text-slate-500 dark:text-slate-300">
                      ₱
                      {Intl.NumberFormat("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(product.price)}
                    </span>
                    <br />
                    <span className="text-red-600">
                      ₱
                      {Intl.NumberFormat("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(product.price - product.discount_value)}
                    </span>
                  </>
                ) : (
                  <span className="text-red-600">
                    ₱
                    {Intl.NumberFormat("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(product.price)}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center">{product.quantity}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Tooltip content="Edit product">
                    <span
                      onClick={() => handleEditProduct(product)}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    >
                      <EditIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete product">
                    <span 
                    onClick={() => {setSelectedProduct(product);}}
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
          <ModalHeader>{selectedProduct?.name}</ModalHeader>
          <ModalBody>Are you sure you want to delete this product?</ModalBody>
          <ModalFooter>
            <Button onClick={onDeleteOpenChange}>Close</Button>
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
          <ModalHeader>Edit {selectedProduct?.name}</ModalHeader>
          <ModalBody>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              label="Product Name"
              placeholder="Enter product name"
              required
            />
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              label="Product Price"
              placeholder="Enter product price"
              required
            />
            <RadioGroup
              value={formData.discount_type}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "") {
                  setFormData({
                    ...formData,
                    discount_type: value,
                    discount_value: "0",
                  });
                } else {
                  setFormData({ ...formData, discount_type: value });
                }
              }}
              label="Select your discount type"
              orientation="horizontal"
            >
              <Radio value="percent">Percentage</Radio>
              <Radio value="fixed">Fixed</Radio>
              <Radio value="">None</Radio>
            </RadioGroup>
            <Input
              name="discount_value"
              type="number"
              value={formData.discount_value}
              onChange={handleInputChange}
              label="Discount Value"
              placeholder="Enter discount value"
              required
              disabled={formData.discount_type === ""}
            />
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              label="Product Description"
              placeholder="Enter product description"
              required
            />
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              label="Product Quantity"
              placeholder="Enter product quantity"
              required
            />
            <Select
              value={formData.category_id}
              onChange={handleSelectChange}
              label="Select Category"
              placeholder="Select category"
              required
            >
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onEditOpenChange}>Close</Button>
            <Button color="primary" onClick={handleUpdateProduct} isLoading={loading}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductTable;