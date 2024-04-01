import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode,
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      { children }
    </div>
  )
}

export default AuthLayout;