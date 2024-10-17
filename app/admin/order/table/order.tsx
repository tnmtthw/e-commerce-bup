"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { useDisclosure } from "@nextui-org/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import SkeletonTable from "./loading";
import { Chip } from "@nextui-org/react";

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    description: string;
  };
}

interface Order {
  id: number;
  name: string;
  address: string;
  phone: string;
  payment: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OrderTable: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    data: orders = [],
    error,
    mutate,
  } = useSWR<Order[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, fetcher);
  
  const [selectedCategory, setSelectedCategory] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  if (error) return <div>Error loading orders</div>;
  if (!orders.length) return <SkeletonTable />;

  return (
    <Table>
      <TableHeader>
        <TableColumn>ORDER ID</TableColumn>
        <TableColumn>NAME</TableColumn>
        <TableColumn>ADDRESS</TableColumn>
        <TableColumn>PHONE</TableColumn>
        <TableColumn>ORDER ITEMS</TableColumn>
        {/* <TableColumn>PAYMENT</TableColumn> */}
        <TableColumn>AMOUNT</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>DATE / TIME CREATED</TableColumn>
        <TableColumn>DATE / TIME UPDATED</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.name}</TableCell>
            <TableCell>{order.address}</TableCell>
            <TableCell>{order.phone}</TableCell>
            <TableCell>
              {order.order_items.map((item) => (
                <div key={item.id}>
                  {item.product.name} (x{item.quantity})
                </div>
              ))}
            </TableCell>
            {/* <TableCell>{order.payment}</TableCell> */}
            <TableCell>
              ₱{" "}
              {order.total_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell>
              {(() => {
                switch (order.status) {
                  case "Received":
                    return (
                      <div className="text-center rounded-md bg-blue-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                        Received
                      </div>
                    );
                  case "Shipped":
                    return (
                      <div className="text-center rounded-md bg-cyan-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                        Shipped
                      </div>
                    );
                  case "Paid":
                    return (
                      <div className="text-center rounded-md bg-teal-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                        Paid
                      </div>
                    );
                  case "Pending":
                    return (
                      <div className="text-center rounded-md bg-purple-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                        Pending
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </TableCell>
            <TableCell>
              {new Date(order.created_at).toLocaleDateString()} /{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </TableCell>
            <TableCell>
              {new Date(order.updated_at).toLocaleDateString()} /
              {new Date(order.updated_at).toLocaleTimeString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
