"use client"

import { FC, ReactNode } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "./dialog";

interface ModalProps {
  title: string,
  desription: string,
  isOpen: boolean,
  onClose: () => void,
  children?: ReactNode,
}

const Modal: FC<ModalProps> = (props) => {
  const { title, desription, isOpen, onClose, children } = props;

  console.log(isOpen)

  const onChange = (open: boolean) => {
    if(open) onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>{ title }</DialogHeader>
        <DialogDescription>{ desription }</DialogDescription>
        <div>
          { children }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { Modal }