import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { PlusSymbol } from '@/components/admin/icon';
import AddProductModal from './AddProductModal';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <div className="mb-4">
      <Button 
        onPress={onOpen}
        color="primary" 
        endContent={<PlusSymbol />}
      >
        Add new
      </Button>
      {/* <AddProductModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onProductAdded={mutate}
      />   */}
    </div>
  )
}

export default Header;