import { useEffect, useState } from "react"

const useOrigin = () => {
  const [moundted, setMounted] = useState<boolean>(false);
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  useEffect(() => {
    setMounted(true);
  },[]);

  if(!moundted) return '';
  return origin;
};

export { useOrigin };