"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/rooms");
  }, [router]);

  return <div></div>;
};

export default Index;
