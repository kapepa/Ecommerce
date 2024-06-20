import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";

interface LinkProductProps {
  id: string
}

const LinkProduct: FC<LinkProductProps> = (props) => {
  const { id } = props;

  return (
    <div>
      <Button
        variant="default"
      >
        <Link
          href={`/product/${id}`}
        >
          Перейтии
        </Link>
      </Button>
    </div>
  )
}

export { LinkProduct }