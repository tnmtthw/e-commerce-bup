"use client";

import React, { useState } from "react";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { CloseIcon, MinusSymbol, PlusSymbol, ShoppingCart } from "./icons";

const ProductDetails = ({ product, onClose }) => {
  const [counter, setCounter] = useState(Number(product.quantity));

  const handleDecrement = () => {
    setCounter((prevCounter) => (prevCounter > 1 ? prevCounter - 1 : 1));
  };

  const handleIncrement = () => {
    setCounter((prevCounter) => {
      const quantity = Number(product.quantity);
      return prevCounter < quantity ? prevCounter + 1 : quantity;
    });
  };

  const handleClick = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "Please sign in to proceed with add to cart.",
        showConfirmButton: false,
        timer: 2000,
        background: "#dc3545",
        color: "#ffffff",
      });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id,
          quantity: counter,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();

      Swal.fire({
        position: "bottom-start",
        text: data.message || "Item has been added to your shopping cart",
        showConfirmButton: false,
        timer: 1000,
        background: "#28a745",
        color: "#ffffff",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "bottom-start",
        text: error.message || "Failed to add item to cart",
        showConfirmButton: false,
        timer: 2000,
        background: "#dc3545",
        color: "#ffffff",
      });
    }
  };

  return (
    <div className="z-50 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto">
      <Card className="max-w-sm sm:max-w-4xl">
        <CardBody>
          <div className="flex justify-end">
            <Button
              isIconOnly
              radius="sm"
              onClick={onClose}
              className="lg:hidden"
              variant="light"
              size="lg"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-4 text-white">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <Image
                    height={350}
                    width={400}
                    src={product.image_path}
                    alt={product.name}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="p-4 h-full">
              <span className="text-2xl">{product.name}</span>
              <br />
              <br />
              <span className="text-slate-500 dark:text-slate-300 text-sm">
                {product.description}
              </span>
              <br />
              <br />
              <br />
              <span className="dark:text-slate-100 text-xl">
                ₱
                {product.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <Chip className="ml-3" size="sm" color="warning">
                50%
              </Chip>
              <br />
              <span className="dark:text-slate-100 text-xs line-through">
                ₱3,650.00
              </span>
              <br />
              <br />
              <br />
              <div className="grid grid-cols-2 gap-2">
                {product.quantity > 0 ? (
                  <div className="flex items-center justify-between">
                    <Button
                      variant="light"
                      startContent={<MinusSymbol />}
                      id="decrement-button"
                      onClick={handleDecrement}
                    />
                    <span>{counter}</span>
                    <Button
                      variant="light"
                      startContent={<PlusSymbol />}
                      id="increment-button"
                      onClick={handleIncrement}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Chip color="danger">Out of Stock</Chip>
                  </div>
                )}
                <div className="text-black">
                  <Button
                    isDisabled={product.quantity === "0"}
                    radius="sm"
                    fullWidth={true}
                    startContent={<ShoppingCart />}
                    onPress={handleClick}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-xl hidden lg:block"
      >
        Close
      </button>
    </div>
  );
};

export default ProductDetails;
