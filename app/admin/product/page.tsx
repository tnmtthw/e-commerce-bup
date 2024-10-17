import React from "react";
import Table from "@/app/admin/product/components/Table";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


const ProductPage = () => {
  return (
    <div>
      <ToastContainer />
      <Table />
    </div>
  );
};

export default ProductPage;
