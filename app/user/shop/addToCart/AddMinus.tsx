"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import Swal from "sweetalert2";

interface AddMinusProps {
  item: {
    id: number;
    product_id: number;
    quantity: number;
    product: {
      quantity: number;
    };
  };
  userId: number;
  onQuantityUpdate: () => void;
}

const AddMinus: React.FC<AddMinusProps> = ({ item, userId, onQuantityUpdate }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.quantity) return;
    setQuantity(newQuantity);
    const response = await fetch(
      `http://localhost:8000/api/cart/item/quantity/${item.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, quantity: newQuantity }),
      }
    );

    onQuantityUpdate()

    if (!response.ok) {
      console.log()
    }
  };

  return (
    <div className="flex justify-between">
      <Button
        variant="light"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <span>{quantity}</span>
      <Button
        variant="light"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= item.product.quantity}
      >
        +
      </Button>
    </div>
  );
};

export default AddMinus;