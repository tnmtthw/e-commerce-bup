"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/user/theme-switch";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  GmailIcon,
  SearchIcon,
  ShoppingLogo,
  UserIcon,
  ShoppingCart,
  ShoppingCart1,
} from "@/components/user/icons";
import { fetchUserCartItemAndOrderCount } from "./NavbarData";
import { Badge } from "@nextui-org/badge";
import SigninModal from "@/app/user/components/SigninModal";
import SignupModal from "@/app/user/components/SignupModal";

export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSignupOpen, setSignupOpen] = useState(false);

  const [cartItemAndOrderCount, setCartItemAndOrderCount] = useState<number | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserFirstName(localStorage.getItem("firstName"));
      setUserLastName(localStorage.getItem("lastName"));
    }

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

  const clearLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSignUpClick = () => {
    setSignupOpen(true);
    onOpenChange();
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-1"
            href="/user"
          >
            <ShoppingLogo />
            <p className="font-bold text-inherit dark:text-white hidden md:flex">
              E-COMMERCE
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          labelPlacement="outside"
          placeholder="Search..."
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="search"
        />
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link
            isExternal
            aria-label="Facebook"
            href={siteConfig.links.facebook}
          >
            <FacebookIcon className="text-default-500" />
          </Link>
          <Link
            isExternal
            aria-label="Instagram"
            href={siteConfig.links.instagram}
          >
            <InstagramIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Gmail" href={siteConfig.links.gmail}>
            <GmailIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          {!userFirstName ? (
            <Button
              onPress={onOpen}
              className="text-sm font-normal text-default-600 bg-default-100"
              startContent={<UserIcon className="text-danger" />}
              variant="flat"
            >
              Sign in
            </Button>
          ) : (
            <div className="flex items-center">
              <span className="mr-2">
                {userFirstName} {userLastName}
              </span>
              <Badge
                content={cartItemAndOrderCount}
                shape="circle"
                color="danger"
                placement="top-left"
              >
                <Button
                  href="/user/shop"
                  as={Link}
                  isIconOnly
                  className="mr-2 text-sm font-normal text-default-600 bg-default-100"
                  variant="flat"
                >
                  {<ShoppingCart />}
                </Button>
              </Badge>
              <Button
                onPress={clearLocalStorage}
                className="text-sm font-normal text-default-600 bg-default-100"
                startContent={<UserIcon className="text-danger" />}
                variant="flat"
              >
                Sign out
              </Button>
            </div>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link
          aria-label="Shop"
          href={siteConfig.links.shop}
          className="text-inherit"
        >
          <ShoppingCart1 className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          {!userFirstName ? (
            <Button
              onPress={onOpen}
              className="text-lg font-medium text-default-600 flex items-center space-x-2"
              startContent={<UserIcon className="text-danger" />}
              variant="flat"
            >
              Sign in
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium text-default-600">
                {userFirstName} {userLastName}
              </span>
              <Button
                onPress={clearLocalStorage}
                className="text-sm font-normal text-default-600 bg-default-100 flex items-center space-x-2"
                startContent={<UserIcon className="text-danger" />}
                variant="flat"
              >
                Sign out
              </Button>
            </div>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
      <SigninModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSignUpClick={handleSignUpClick}
      />
      <SignupModal isOpen={isSignupOpen} onOpenChange={setSignupOpen} />
    </NextUINavbar>
  );
};