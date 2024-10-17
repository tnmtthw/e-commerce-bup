"use client";
import { useEffect } from "react";
import useSWR from "swr";
import Swal from "sweetalert2";

interface Order {
  id: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OrderNotification = () => {
  const { data: orders, error } = useSWR<Order[]>(
    "http://localhost:8000/api/orders",
    fetcher,
    {
      refreshInterval: 10000,
    },
  );

  useEffect(() => {
    const shownOrders = new Set(
      JSON.parse(localStorage.getItem("shownOrders") || "[]"),
    );

    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        if (!shownOrders.has(order.id)) {
          Swal.fire({
            position: "bottom-right",
            title: `New order added: ${"Order ID: " + order.id}`,
            showConfirmButton: false,
            toast: true,
            background: "#28a745",
            color: "#ffffff",
          });

          shownOrders.add(order.id);
        }
      });

      localStorage.setItem(
        "shownOrders",
        JSON.stringify(Array.from(shownOrders)),
      );
    }
  }, [orders]);

  if (error) return null;
  if (!orders) return null;

  return null;
};

export default OrderNotification;
