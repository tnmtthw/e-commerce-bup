"use client";

import React, { useState, FormEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Link } from "@nextui-org/link";
import { MailIcon, LockIcon } from "@/components/user/icons";
import Swal from "sweetalert2";

interface SigninModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSignUpClick: () => void;
}

const SigninModal: React.FC<SigninModalProps> = ({
  isOpen,
  onOpenChange,
  onSignUpClick,
}) => {
  // State to manage email validation
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    // Basic email validation
    const emailIsValid = email.includes("@");
    setIsEmailInvalid(!emailIsValid);

    if (!emailIsValid) {
      return; // Stop submission if email is invalid
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.user;

      console.log(user);
      localStorage.clear();
      localStorage.setItem("userId", user.id);
      localStorage.setItem("firstName", user.first_name);
      localStorage.setItem("lastName", user.last_name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("phone", user.phone);
      localStorage.setItem("address", user.address);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "Sign in success",
        showConfirmButton: false,
        timer: 1000,
        background: "#28a745",
        color: "#ffffff",
      });

      window.location.reload();
    } else {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "Sign in failed",
        showConfirmButton: false,
        timer: 1000,
        background: "#dc3545",
        color: "#ffffff",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Sign in</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-1">
                <Input
                  autoFocus
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  variant="bordered"
                  isInvalid={isEmailInvalid} // Set based on validation
                  errorMessage={
                    isEmailInvalid ? "Please enter a valid email" : ""
                  }
                  required
                />
                <Input
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                  required
                />
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary">
                    Sign in
                  </Button>
                </ModalFooter>
                </div>
              </form>
              <div className="flex py-2 px-1 justify-between">
                <Checkbox classNames={{ label: "text-small" }}>
                  Remember me
                </Checkbox>
                <Link
                  color="primary"
                  href="#"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onSignUpClick();
                  }}
                >
                  Don't have an account yet? Sign up
                </Link>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SigninModal;
