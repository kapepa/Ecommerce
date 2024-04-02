"use client"

import { Button } from "@/components/ui/button";
import { useStoreModal } from "@/hooks/use-store-modal";
import { NextPage } from "next";
import { useEffect } from "react";

const SetupPage: NextPage = () => {
  // const onOpen = useStoreModal((state) => state.onOpen);
  // const onClose = useStoreModal((state) => state.onClose);
  // const isOpen = useStoreModal((state) => state.isOpen);
  const { isOpen, onOpen } = useStoreModal();

  useEffect(() => {
    if(!isOpen) onOpen();
  }, [isOpen, onOpen]);
  
  return (
    <div className="p-4">
      {/* <Button onClick={onOpen}>Open Store</Button> */}
      root page
    </div>
  )
}

export default SetupPage;