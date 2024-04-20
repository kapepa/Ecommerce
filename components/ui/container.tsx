import { FC, ReactNode } from "react"

interface ContainerProps {
  children: ReactNode,
}

const Container: FC<ContainerProps> = (props) => {
  const { children } = props;

  return (
    <div
      className="mx-auto max-w-7xl"
    >
      {children}
    </div>
  )
}

export { Container }