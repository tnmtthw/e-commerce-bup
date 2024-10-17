"use client";
import { Tabs, Tab } from "@nextui-org/react";
import OrderCard from "@/app/user/shop/card/order";
import PendingCard from "@/app/user/shop/card/pending";
import Paid from "@/app/user/shop/card/paid";
import Shipped from "@/app/user/shop/card/shipped";
import Received from "@/app/user/shop/card/received";

export default function App() {
  return (
    <div className="flex w-full flex-col">
      <Tabs radius="sm" size="md" className="w" aria-label="Options">
        <Tab key="all" title="All">
          <OrderCard />
        </Tab>
        <Tab key="pending" title="Pending">
          <PendingCard />
        </Tab>
        <Tab key="paid" title="Paid">
          <Paid />
        </Tab>
        <Tab key="shipped" title="Shipped">
          <Shipped />
        </Tab>
        <Tab key="received" title="Received">
          <Received />
        </Tab>
      </Tabs>
    </div>
  );
}
