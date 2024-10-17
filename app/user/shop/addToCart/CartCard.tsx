"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Card, CardBody } from "@nextui-org/card";
import { Image, Input, Tooltip, Spinner } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import useSWR, { mutate } from "swr";
import { DeleteIcon, PlusSymbol } from "@/components/user/icons";
import EmptyCard from "@/app/user/shop/addToCart/EmptyCart";
import { redirect } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Checkbox } from "@nextui-org/checkbox";
import { Chip } from "@nextui-org/chip";
import { RiDiscountPercentFill } from "react-icons/ri";
import AddMinus from "./AddMinus";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_path: string;
  discount_type: string | null;
  discount_value: number;
  quantity: number;
}

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const calculateFinalPrice = (
  price: number,
  discountType: string | null,
  discountValue: number,
) => {
  if (discountType === "percent") {
    return price - (price * discountValue) / 100;
  } else if (discountType === "fixed") {
    return price - discountValue;
  }
  return price;
};

const CartCard: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const fullName = `${firstName} ${lastName}`;
  const phone = localStorage.getItem("phone");
  const address = localStorage.getItem("address");

  const [name, setName] = useState(fullName);
  const [phoneNumber, setPhoneNumber] = useState(phone ?? "");
  const [userAddress, setUserAddress] = useState(address ?? "");
  const [payment, setPayment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]); // State for selected product IDs

  useEffect(() => {
    if (!userId) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "User not logged in",
        showConfirmButton: false,
        timer: 2000,
        background: "#dc3545",
        color: "#ffffff",
      });
      redirect("/user");
    }
  }, [userId]);

  const { data: cartItems = [], error, mutate } = useSWR<CartItem[]>(
    userId ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${userId}` : null,
    fetcher,
  );

  if (error) return <Spinner className="z-50 place-items-center" size="lg" />;
  if (!cartItems.length) return <EmptyCard />;

  // Calculate total price based on selected products
  const totalPrice = cartItems.reduce((sum, item) => {
    const finalPrice = calculateFinalPrice(
      item.product.price,
      item.product.discount_type,
      item.product.discount_value,
    );

    return selectedProducts.includes(item.product_id)
      ? sum + finalPrice * item.quantity
      : sum; // Only add to total if product is selected
  }, 0);

  const handleCheckout = async () => {
    setIsLoading(true);

    // Prepare order items
    const orderItems = cartItems
      .filter((item) => selectedProducts.includes(item.product_id))
      .map((item) => {
        const finalPrice = calculateFinalPrice(
          item.product.price,
          item.product.discount_type,
          item.product.discount_value,
        );

        return {
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: finalPrice,
        };
      });

    console.log("Order Items:", orderItems);

    // Calculate total price
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const formData = new FormData();
    formData.append("user_id", userId!);
    formData.append("total_price", totalPrice.toFixed(2)); // Append total price
    formData.append("name", name);
    formData.append("phone", phoneNumber);
    formData.append("address", userAddress);

    // Check for payment file input
    const paymentInput = document.getElementById("payment") as HTMLInputElement;
    if (paymentInput && paymentInput.files && paymentInput.files.length > 0) {
      const paymentFile = paymentInput.files[0];
      formData.append("payment", paymentFile); // Append payment file
    }

    // Append order items as a single JSON string
    formData.append("order_items", JSON.stringify(orderItems));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Checkout failed");
      }

      // Show success message
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Order placed successfully!",
        showConfirmButton: false,
        timer: 2000,
        background: "#28a745",
        color: "#ffffff",
      });

      setPayment(result.path); // Save payment path from response
      await mutate(); // Update cart items
      onOpenChange();
    } catch (error) {
      console.error("Checkout error:", error);
      // Show error message
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error during checkout",
        showConfirmButton: true,
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const removeCartItem = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/item/remove/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to remove item');
      }

      await mutate();

      Swal.fire({
        toast: true,
        position: 'bottom-start',
        title: 'Item removed successfully!',
        showConfirmButton: false,
        timer: 2000,
        background: '#28a745',
        color: '#ffffff',
      });
    } catch (error) {
      console.error('Remove item error:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error removing item',
        showConfirmButton: true,
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full ">
      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 col-span-2 order-2">
        {cartItems.map((item) => {
          const product = item.product;
          const finalPrice = calculateFinalPrice(
            product.price,
            product.discount_type,
            product.discount_value,
          );
          const hasDiscount = product.discount_type !== null;

          return (
            <Card
              fullWidth={true}
              key={item.id}
            >
              <CardBody>
                <div className="z-50 flex absolute right-4 top-4 sm:bg-transparent sm:rounded-none bg-white rounded-lg p-1">
                  <Checkbox
                    isSelected={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                  <Tooltip color="danger" content="Delete product">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => removeCartItem(item.id)}>
                      <DeleteIcon />
                    </span>
                  </Tooltip>
                </div>
                <div className="grid items-end grid-cols-1 gap-6 md:grid-cols-12">
                  <div className="relative col-span-6 md:col-span-4">
                    <Image
                      alt={item.product.name}
                      className="object-cover w-full h-48"
                      height={200}
                      src={item.product.image_path}
                      width="100%"
                      radius="sm"
                    />
                  </div>
                  <div className="flex flex-col col-span-6 md:col-span-8">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-0">
                        <h3 className="text-lg font-semibold text-left">
                          {product.name}
                        </h3>
                        {hasDiscount ? (
                          <>
                            <p className="font-bold">
                              ₱
                              {finalPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm line-through text-slate-500 dark:text-slate-300">
                                ₱
                                {product.price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                              <Chip
                                startContent={<RiDiscountPercentFill size={18} />}
                                variant="faded"
                                color="danger"
                                size="sm"
                              >
                                {product.discount_type === "percent"
                                  ? `${product.discount_value}% off`
                                  : `₱${product.discount_value} off`}
                              </Chip>
                            </div>
                          </>
                        ) : (
                          <p className="font-bold">
                            ₱
                            {product.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <AddMinus item={item} userId={Number(userId)} onQuantityUpdate={mutate} />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Checkout Card */}
      <div className="order-1 mb-4 lg:order-2 w-full lg:col-span-1 lg:ml-4">
        <Card
          fullWidth={true}>
          <CardBody>
            <h3 className="text-xl font-bold">Total Price: ₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <Button onClick={onOpen} className="mt-4" color="primary">
              Proceed to Checkout
            </Button>
          </CardBody>
        </Card>
        <Modal
          placement="center"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          closeButton
        >
          <ModalContent>
            <ModalHeader>
              <h2 className="font-bold">Checkout</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <Input
                label="Address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                required
              />
              <Input label="Payment" type="file" id="payment" />
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isLoading}
                onClick={handleCheckout}
                disabled={isLoading}
                color="primary"
              >
                Confirm Checkout
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default CartCard;