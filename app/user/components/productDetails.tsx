"use client";

import React, { useState, useEffect } from "react";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Modal, ModalContent, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ReactStars from "react-stars";
import { Divider } from "@nextui-org/divider";
import { RiDiscountPercentFill } from "react-icons/ri";

import { MinusSymbol, PlusSymbol, ShoppingCart } from "@/components/user/icons";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_path: string;
  discount_type: string;
  discount_value: number;
  quantity: number;
  review: Review[];
}

interface Review {
  id: number;
  rating: number;
  text: string;
}

interface ProductDetailsProps {
  categoryName: string;
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  finalPrice: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  isOpen,
  onOpenChange,
  finalPrice,
}) => {
  const [counter, setCounter] = useState(Number(product.quantity) || 1);
  console.log({ product, isOpen, onOpenChange });
  const handleDecrement = () => {
    setCounter((prevCounter) => (prevCounter > 1 ? prevCounter - 1 : 1));
  };

  const hasDiscount = product.discount_type !== null;

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/add`, {
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

      await response.json();

      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "Item has been added to your shopping cart",
        showConfirmButton: false,
        timer: 1000,
        background: "#28a745",
        color: "#ffffff",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "Failed to add item to cart",
        showConfirmButton: false,
        timer: 2000,
        background: "#dc3545",
        color: "#ffffff",
      });
    }
  };

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product-reviews/${product.id}`,
      );
      const data = await response.json();
      setReviews(data);
    };

    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, product.id]);

  return (
    <Modal
      size="5xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      scrollBehavior="outside"
    >
      <ModalContent>
        <ModalBody>
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
                    width={500}
                    src={product.image_path}
                    alt={product.name}
                    className="object-cover"
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
              {hasDiscount ? (
                <>
                  <p className="font-bold text-xl">
                    ₱
                    {finalPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-slate-500 dark:text-slate-300 line-through text-sm">
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
                        ? `${product.discount_value}%`
                        : `₱${product.discount_value}`}
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
                    isDisabled={product.quantity === 0}
                    fullWidth={true}
                    startContent={<ShoppingCart />}
                    onPress={handleClick}
                    color="primary"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Divider className="my-4" />
          <h2 className="text-2xl font-semibold">Product Reviews</h2>
          <div className="mt-4 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border p-4 rounded">
                  <ReactStars
                    count={5}
                    value={review.rating}
                    edit={false}
                    size={24}
                    color2={"#ffd700"}
                  />
                  <p className="mt-2">{review.text}</p>
                </div>
              ))
            ) : (
              <p>No reviews available for this product.</p>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetails;
