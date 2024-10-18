"use client";

import React, { useEffect, useState } from "react";
import { Button, Badge, useDisclosure } from '@nextui-org/react';
import { HomeIcon, ProfileIcon, ShoppingCart3 } from '@/components/user/icons';
import Link from 'next/link';
import { fetchUserCartItemAndOrderCount } from "./NavbarData";
import SigninModal from "@/app/user/components/SigninModal";
import SignupModal from "@/app/user/components/SignupModal";

const NavbarBottom = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [cartItemAndOrderCount, setCartItemAndOrderCount] = useState<number | null>(null);
  const [activeButton, setActiveButton] = useState<string>('home'); // Set default active button to 'home'
  const [userId, setUserId] = useState<string | null>(null); // State to hold user ID

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchData = async () => {
      try {
        const data = await fetchUserCartItemAndOrderCount();
        setCartItemAndOrderCount(data.cartItemAndOrderCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSignUpClick = () => {
    setSignupOpen(true);
    onOpenChange();
  };

  return (
    <div>
      <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 rounded-t-lg bg-white border border-gray-200 bottom-0 left-1/2 dark:bg-black dark:border-gray-600">
        <div className="grid grid-cols-2 h-full">
          <Button
            href="/user"
            as={Link}
            radius="none"
            isIconOnly
            variant="light"
            className={`w-full rounded-tl-lg h-full text-default-600 ${activeButton === 'home' ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => setActiveButton('home')}
          >
            <HomeIcon />
          </Button>
          {userId ? (
            <Badge
              content={cartItemAndOrderCount}
              shape="circle"
              color="danger"
              className="absolute top-4 right-20"
            >
              <Button
                href="/user/shop"
                as={Link}
                radius="none"
                isIconOnly
                variant="light"
                className={`rounded-tr-lg w-full h-full text-default-600 ${activeButton === 'shop' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => setActiveButton('shop')}
              >
                <ShoppingCart3 />
              </Button>
            </Badge>
          ) : (
            <Button
              onPress={onOpen}
              radius="none"
              isIconOnly
              variant="light"
              className="rounded-tr-lg w-full h-full text-default-600"
              onClick={() => setActiveButton('profile')}
            >
              <ProfileIcon />
            </Button>
          )}
          <SigninModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onSignUpClick={handleSignUpClick}
          />
          <SignupModal
            isOpen={isSignupOpen}
            onOpenChange={setSignupOpen} />
        </div>
      </div>
    </div>
  );
};

export default NavbarBottom;