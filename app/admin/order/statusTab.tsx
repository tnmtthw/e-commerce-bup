"use client";
import { Tabs, Tab } from "@nextui-org/react";
import Order from "./table/order";
import Pending from "./table/pending";
import Paid from "./table/paid";
import Shipped from "./table/shipped";
import Received from "./table/received";

export default function App() {
  return (
    <div className="flex w-full flex-col">
      <Tabs radius="sm" size="md" className="w" aria-label="Options">
        <Tab key="all" title="All">
          <Order />
        </Tab>
        <Tab key="pending" title="Pending">
          <Pending />
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
