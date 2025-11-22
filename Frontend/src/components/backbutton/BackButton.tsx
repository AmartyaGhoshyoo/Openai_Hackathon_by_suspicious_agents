"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
    >
      <ArrowLeft className="size-4" />
      Back
    </div>
  );
};

export default BackButton;
