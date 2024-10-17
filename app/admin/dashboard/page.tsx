"use client";
import React, { useEffect, useState } from 'react';
import { fetchDataCount } from './components/data';
import TotalSales from "./components/TotalSales";
import TotalOrders from "./components/TotalOrders";
import TotalCarts from "./components/TotalCarts";
import TotalProductViewed from "./components/TotalProductViewed";
import MostProductViewed from "./components/MostProductViewed";
import MostProductOrdered from "./components/MostProductOrdered";
import SalesChart from "./components/SalesChart";
import DashboardLoading from './DashboardLoading';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_path: string;
  discount_type: string;
  discount_value: number;
  quantity: number;
  category_id: number;
  created_at: string | null;
  updated_at: string | null;
}

interface MostClickProduct {
  product_id: number;
  click_count: number;
  product: Product;
}


interface DashboardData {
  totalSales: number;
  orderCount: number;
  cartItemCount: number;
  productClickCount: number;
  mostClickProduct: MostClickProduct;
  mostOrderedProduct: MostClickProduct;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDataCount();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); 

    return () => clearInterval(intervalId);
  }, []);

  if (!data) return <div><DashboardLoading/></div>;

  return (
    <div>
      <div className="grid grid-rows-3 grid-cols-4 gap-4">
        <TotalProductViewed productClickCount={data.productClickCount} />
        <TotalCarts cartItemCount={data.cartItemCount} />
        <TotalOrders orderCount={data.orderCount} />
        <TotalSales totalSales={data.totalSales} />
        <div className="row-span-4 col-span-3 h-full">
          <SalesChart />
        </div>
        <div className="row-span-2 h-full">
          <MostProductViewed mostClickProduct={data.mostClickProduct} />
        </div>
        <div className="row-span-2 h-full">
          <MostProductOrdered mostOrderedProduct={data.mostOrderedProduct} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;