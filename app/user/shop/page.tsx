"use client";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Badge } from "@nextui-org/badge";
import CartCard from "@/app/user/shop/addToCart/CartCard";
import OrderTab from "./orderTab";
import { useEffect, useState } from "react";
import {
  fetchUserCartItemAndOrderCount
} from "@/app/user/components/NavbarData";

export default function ShopTab() {

  const [cartItemCount, setCartItemCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserCartItemAndOrderCount();
        setCartItemCount(data.cartItemCount); 
        setOrderCount(data.orderCount); 

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="flex flex-col w-full">
      <Tabs radius="sm" size="lg" aria-label="Options">
        <Tab
          key="Cart"
          title={
            <div className="relative">
              Cart
              {/* <Badge
                showOutline={false}
                size="sm"
                content={cartItemCount}
                shape="circle"
                color="danger"
                placement="top-right"
                className="absolute -top-5 -right-3"
              /> */}
            </div>
          }
        >
          <CartCard />
        </Tab>
        <Tab
          key="Order"
          title={
            <div className="relative">
              Order
              {/* <Badge
                showOutline={false}
                size="sm"
                content={orderCount}
                shape="circle"
                color="danger"
                placement="top-right"
                className="absolute -top-5 -right-1"
              /> */}
            </div>
          }
        >
          <OrderTab />
        </Tab>
      </Tabs>
    </div>
  );
}
