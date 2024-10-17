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
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import SkeletonTable from "./loading";

// Assume you have an Invoice component
// import Invoice from "./Invoice";

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

const ReceivedTable: React.FC = () => {
  const { data: orders = [], error, mutate } = useSWR<Order[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-received-orders`,
    fetcher
  );
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order); // Set the selected order
    onOpen(); // Open the modal
  };

  if (error) return <div>Table is Empty</div>;
  if (!orders) return <SkeletonTable />;
  if (!orders.length) return <div>Table is Empty</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableColumn>ORDER ID</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ADDRESS</TableColumn>
          <TableColumn>PHONE</TableColumn>
          <TableColumn>ORDER ITEMS</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
          <TableColumn>DATE / TIME</TableColumn>
          <TableColumn>ACTION</TableColumn>
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
              <TableCell>₱ {order.total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell>{`${new Date(order.updated_at).toLocaleDateString()} / ${new Date(order.updated_at).toLocaleTimeString()}`}</TableCell>
              <TableCell>
                <Button color="primary" onPress={() => handleOpenModal(order)}>
                  Receipt
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for displaying the invoice */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            {/* {selectedOrder && <Invoice order={selectedOrder} />} */}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onPress={() => onOpenChange()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReceivedTable;