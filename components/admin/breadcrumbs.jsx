"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // For getting the current path
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

export default function App() {
  const pathname = usePathname(); // Get the current URL path
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    // Split the path and get the last part to determine the current page
    const pathSegments = pathname.split("/").filter(Boolean); // Filter out empty segments
    setCurrentPage(pathSegments[pathSegments.length - 1]); // Set the last part of the path as the current page
  }, [pathname]);

  return (
    <Breadcrumbs
      className="mb-5"
      underline="active"
      onAction={(key) => setCurrentPage(key)}
    >
      <BreadcrumbItem key="dashboard" isCurrent={currentPage === "dashboard"}>
        Dashboard
      </BreadcrumbItem>
      <BreadcrumbItem key="user" isCurrent={currentPage === "user"}>
        Users
      </BreadcrumbItem>
      <BreadcrumbItem key="category" isCurrent={currentPage === "category"}>
        Categories
      </BreadcrumbItem>
      <BreadcrumbItem key="product" isCurrent={currentPage === "product"}>
        Products
      </BreadcrumbItem>
      <BreadcrumbItem key="order" isCurrent={currentPage === "order"}>
        Orders
      </BreadcrumbItem>
      {/* <BreadcrumbItem key="artist" isCurrent={currentPage === "artist"}>
        Artist
      </BreadcrumbItem>
      <BreadcrumbItem key="album" isCurrent={currentPage === "album"}>
        Album
      </BreadcrumbItem>
      <BreadcrumbItem key="song" isCurrent={currentPage === "song"}>
        Song
      </BreadcrumbItem> */}
    </Breadcrumbs>
  );
}
