"use client";
import { Card, CardBody } from "@nextui-org/card";

import React, { useState } from "react";
import CategoryButton from "@/components/user/categoryButton";
import ProductList from "@/components/user/productList";
import HomeBanner from "@/components/user/homeBanner";
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  return (
    <div>
      <div>
        <HomeBanner />
      </div>
      <Card className="mb-5">
        <CardBody>
          Shop by Category
          <div className="w-100">
            <CategoryButton onCategorySelect={setSelectedCategory} />
          </div>
        </CardBody>
      </Card>
      <div className="mb-5">
        <div>
          <ProductList categoryName={selectedCategory} isOpen={false} onOpenChange={function (isOpen: boolean): void {
            throw new Error("Function not implemented.");
          } } />
        </div>
      </div>
    </div>
  );
}
