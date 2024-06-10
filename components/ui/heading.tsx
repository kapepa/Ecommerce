import { FC } from "react";

interface HeadingProps {
  title: string,
  description?: string,
}

const Heading: FC<HeadingProps> = (prosp) => {
  const { title, description } = prosp;

  return (
    <div>
      <h2
        className="text-3xl font-bold tracking-tight"
      >
        { title }
      </h2>
      {
        !!description && (
          <p
            className="text-sm text-muted-foreground"
          >
            { description }
          </p>
        )
      }
    </div>
  )
}

export { Heading }