"use client";
import { Card, CardBody } from "@nextui-org/card";

import React, { useState } from "react";
import CategoryButton from "@/app/user/components/CategoryButton";
import ProductList from "@/app/user/components/ProductList";
import HomeBanner from "@/app/user/components/HomeBanner";
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
