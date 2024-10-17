import React from "react";
import Table from "@/app/admin/category/Table";
import HeaderCard from "@/components/admin/headerCard";

const ProductPage = () => {
  const btnName = "NEW CATEGORY";
  const url = "/admin/category/create";
  const className = "";
  return (
    <div>
      <HeaderCard className={className} btnName={btnName} url={url} />
      <Table />
    </div>
  );
};

export default ProductPage;
