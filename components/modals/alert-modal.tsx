"use client"

import { FC, useLayoutEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean,
  loading: boolean,
  onClose: () => void,
  onConfirm: () => void,
}

const AlertModal: FC<AlertModalProps> = (props) => {
  const { isOpen, loading, onClose, onConfirm } = props;
  const [isMounted, setMounted] = useState<boolean>();

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  if(!isMounted) return null

  return (
    <Modal
      title="Вы уверены.?"
      desription="Это действие нельзя отменить"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div
        className="pt-6 space-x-2 flex items-center justify-end w-full"
      >
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClose}
        >
          Отмена
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          onClick={onConfirm}
        >
          Продолжить
        </Button>
      </div>
    </Modal>
  )
}

export { AlertModal }