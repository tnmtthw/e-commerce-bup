"use client";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@nextui-org/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import SkeletonTable from "./loading";
import Swal from "sweetalert2";
import { Image } from "@nextui-org/react";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

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
  order_items: OrderItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PendingTable: React.FC = () => {
  const {
    data: orders,
    error,
    mutate,
  } = useSWR<Order[]>("http://localhost:8000/api/user-pending-orders", fetcher);

  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

  if (error) return <div>Table is Empty</div>;
  if (!orders) return <SkeletonTable />;
  if (!orders.length) return <div>Table is Empty</div>;

  const handleUpdateStatus = async (orderId: number) => {
    setLoadingOrderId(orderId); // Set loading for this order
    try {
      const response = await fetch(
        `http://localhost:8000/api/order-paid/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Paid" }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update the order");
      }

      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "Success",
        showConfirmButton: false,
        timer: 1000,
        background: "#28a745",
        color: "#ffffff",
      });

      console.log("Order updated successfully!");

      await mutate();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableColumn>ORDER ID</TableColumn>
        <TableColumn>NAME</TableColumn>
        <TableColumn>ADDRESS</TableColumn>
        <TableColumn>PHONE</TableColumn>
        <TableColumn>ORDER ITEMS</TableColumn>
        <TableColumn>PAYMENT</TableColumn>
        <TableColumn>AMOUNT</TableColumn>
        <TableColumn>DATE / TIME</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
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
            <TableCell>
              <Gallery withDownloadButton>
                <Item
                  original={`http://localhost:8000/${order.payment}`}
                  width="1080"
                  height="1920"
                >
                  {({ ref, open }) => (
                    <Image
                      ref={ref}
                      onClick={open}
                      src={`http://localhost:8000/${order.payment}`}
                      alt="Payment Receipt"
                      width={50}
                      height={50}
                      className="object-cover cursor-pointer"
                    />
                  )}
                </Item>
              </Gallery>
            </TableCell>
            <TableCell>
              ₱{" "}
              {order.total_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell>{`${new Date(order.created_at).toLocaleDateString()} / ${new Date(order.created_at).toLocaleTimeString()}`}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  isLoading={loadingOrderId === order.id}
                  color="primary"
                  onClick={() => handleUpdateStatus(order.id)}
                >
                  {loadingOrderId !== order.id && "Paid"}
                </Button>
                <Button color="danger">Cancel</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PendingTable;
