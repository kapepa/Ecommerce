"use client"

import { FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Copy, Server } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";

enum EVariant {
  public,
  admin,
}

enum EBadge {
  public = "secondary",
  admin = "destructive",
}

enum ERole {
  public = "Public",
  admin = "Admin",
}

interface ApiAlertProps {
  title: string,
  description: string,
  variant: keyof typeof EVariant,
}

const ApiAlert: FC<ApiAlertProps> = (prosp) => {
  const { title, description, variant } = prosp;

  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API Route copied to the clipboard.")
  }

  return (
    <Alert>
      <Server
        className="h-4 w-4"
      />
      <AlertTitle
        className="flex items-center gap-x-2"
      >
        { title }
        <Badge 
          variant={EBadge[variant]}
        >
          {ERole[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription
        className="mt-4 flex items-center justify-between"
      >
        <code 
          className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        >
          { description }
        </code>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => onCopy()}
        >
          <Copy
            className="h-4 w-4"
          />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export { ApiAlert };