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
import { MailIcon, LockIcon } from "@/components/user/icons";
import Swal from "sweetalert2";

interface SignupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onOpenChange }) => {
  const [email, setEmail] = useState("");
  
  const validateEmail = (value: string) => 
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(value);  

  const [isInvalid, setIsInvalid] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsInvalid(!validateEmail(value));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);

    const response = await fetch("http://127.0.0.1:8000/api/users", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "Sign up success",
        showConfirmButton: false,
        timer: 1000,
        background: "#28a745",
        color: "#ffffff",
      });
      window.location.reload();
    } else if (response.status === 409) {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "The email has already been taken.",
        showConfirmButton: false,
        timer: 1000,
        background: "#dc3545",
        color: "#ffffff",
      });
    } else {
      Swal.fire({
        toast: true,
        position: "bottom-start",
        text: "Sign up failed",
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
            <ModalHeader className="flex flex-col gap-1">Sign up</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-1">
                  <Input
                    variant="bordered"
                    type="text"
                    label="First Name"
                    name="first_name"
                    id="first_name"
                    required
                  />
                  <Input
                    variant="bordered"
                    type="text"
                    label="Last Name"
                    name="last_name"
                    id="last_name"
                    required
                  />
                  <Input
                    variant="bordered"
                    type="text"
                    label="Phone"
                    name="phone"
                    id="phone"
                    required
                  />
                  <Input
                    variant="bordered"
                    type="text"
                    label="Address"
                    name="address"
                    id="address"
                    required
                  />
                  <Input
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    variant="bordered"
                    type="email"
                    label="Email"
                    name="email"
                    id="email"
                    isInvalid={isInvalid}
                    color={isInvalid ? "danger" : "default"}
                    errorMessage="Please enter a valid email"
                    onValueChange={handleEmailChange}
                    required
                  />
                  <Input
                     endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    variant="bordered"
                    type="password"
                    label="Password"
                    name="password"
                    id="password"
                    required
                  />
                  <Input
                    variant="bordered"
                    type="hidden"
                    name="type"
                    id="type"
                    value="user"
                  />
                </div>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary" disabled={isInvalid}>
                    Sign up
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;