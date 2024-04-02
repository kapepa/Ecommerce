import { create } from 'zustand';

interface useStoreModaleProps {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
}

const useStoreModal = create<useStoreModaleProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export { useStoreModal };