"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import { NextPage } from "next";
import { useEffect } from "react";

const SetupPage: NextPage = () => {
  const { isOpen, onOpen } = useStoreModal();

  useEffect(() => {
    if(!isOpen) onOpen();
  }, [isOpen, onOpen]);
  
  return null;
}

export default SetupPage;