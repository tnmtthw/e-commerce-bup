"use client";

import React, { useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import useSWR from "swr";
import ProductListLoading from "./productListLoading";
import ReviewRatingIcon from "@/components/user/reviewRatingIcon";
import ProductDetails from "@/components/user/productDetails";
import { useDisclosure } from "@nextui-org/modal";
import { Chip } from "@nextui-org/chip";
import { RiDiscountPercentFill } from "react-icons/ri";

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

interface ProductListProps {
  categoryName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProductList: React.FC<ProductListProps> = ({ categoryName }) => {
  const { data: products = [], error } = useSWR<Product[]>(
    `http://127.0.0.1:8000/api/product-by/${categoryName}`,
    fetcher,
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleCardClick = async (product: Product) => {
    console.log({ product, isOpen, onOpenChange });

    setSelectedProduct(product);
    onOpen();
    try {
      await fetch(`http://localhost:8000/api/products/${product.id}/click`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error logging click:", error);
    }
  };

  if (error) return <div>Error loading products</div>;
  if (!products.length) return <ProductListLoading />;

  const getAverageRating = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const getTotalRating = (reviews?: Review[]) => {
    return reviews ? reviews.length : 0;
  };

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

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {products.map((product) => {
          const finalPrice = calculateFinalPrice(
            product.price,
            product.discount_type,
            product.discount_value,
          );
          const hasDiscount = product.discount_type !== null;

          return (
            <div key={product.id} className="flex justify-center w-full">
              <Card
                isPressable
                isHoverable={true}
                onPress={() => handleCardClick(product)}
                className="w-full overflow-hidden"
              >
                <Image
                  isZoomed
                  alt={product.name}
                  src={product.image_path}
                  width={400}
                  height={200}
                  className="object-cover"
                />
                <h2 className="ml-3 text-lg font-semibold text-left">
                  {product.name}
                </h2>
                <CardBody className="flex items-start justify-end">
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
                  <div className="text-yellow-500">
                    <ReviewRatingIcon
                      RatingValue={getAverageRating(product.review)}
                    />
                    <small>
                      {getAverageRating(product.review).toFixed(1)} (
                      {getTotalRating(product.review)} reviews)
                    </small>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          finalPrice={calculateFinalPrice(
            selectedProduct.price,
            selectedProduct.discount_type,
            selectedProduct.discount_value
          )}
          isOpen={isOpen}
          onOpenChange={onOpenChange} categoryName={""}        />
      )}
    </div>
  );
};

export default ProductList;
