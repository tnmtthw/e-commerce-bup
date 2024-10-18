"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@nextui-org/navbar";
import { Input } from "@nextui-org/input";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/user/theme-switch";
import {
  ArrowRightIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingLogo,
} from "@/components/user/icons";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export const NavbarMobile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null); // Added userLastName state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
      setUserFirstName(localStorage.getItem("firstName"));
      setUserLastName(localStorage.getItem("lastName")); // Fixed missing variable definition
    }
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <NextUINavbar position="sticky" className="block md:hidden">
      <NavbarContent justify="start">
        <NextLink
          className="flex justify-start items-center gap-1"
          href="/user"
        >
          <ShoppingLogo />
        </NextLink>
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          labelPlacement="outside"
          placeholder="Search..."
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none" />
          }
          type="search"
        />
        {userId ? (
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                isIconOnly
                className="text-default-600"
              >
                <SettingsIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="flat" aria-label="Dropdown menu with shortcut">
              <DropdownItem>
                <span className="font-medium text-default-600">
                  {userFirstName} {userLastName}
                </span>
              </DropdownItem>
              <DropdownItem>
                <Button 
                  variant="light"
                  className="text-default-600"
                >
                  Themes <ThemeSwitch />
                </Button>
              </DropdownItem>
              <DropdownItem color="danger">
                <Button 
                  onPress={handleSignOut}
                  variant="light" 
                  className="text-default-600"
                >
                  Sign out <ArrowRightIcon />
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <ThemeSwitch />
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};