"use client";

import Headers from "@/components/headers/Headers";
import { googleLogin } from "@/firebase/googlelogin";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  const handleFunction = () => {
    googleLogin()
      .then((res) => {
        if (res.success) {
          router.replace("/");
        }
      })
      .catch(() => {
        router.refresh();
      });
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <Headers/>
      <button
        className="h-[42px] px-8 py-4 rounded-full bg-[#242424] border border-[#323232] text-white flex justify-center items-center"
        onClick={handleFunction}
      >
        <img src="/google_login_img.png" width={250} alt="google_login" />
      </button>
    </div>
  );
};

export default page;
