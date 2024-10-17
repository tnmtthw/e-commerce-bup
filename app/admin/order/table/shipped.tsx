"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import SkeletonTable from "./loading";

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
  updated_at: string;
  order_items: OrderItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PaidTable: React.FC = () => {
  const {
    data: orders = [],
    error,
    mutate,
  } = useSWR<Order[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-shipped-orders`, fetcher);

  if (error) return <div>Table is Empty</div>;
  if (!orders) return <SkeletonTable />;
  if (!orders.length) return <div>Table is Empty</div>;

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
        <TableColumn>DATE / TIME</TableColumn>
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
            <TableCell>₱ {order.total_price.toLocaleString()}</TableCell>
            <TableCell>{`${new Date(order.updated_at).toLocaleDateString()} / ${new Date(order.updated_at).toLocaleTimeString()}`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PaidTable;
