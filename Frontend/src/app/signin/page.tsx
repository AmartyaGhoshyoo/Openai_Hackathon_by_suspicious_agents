"use client";

import Headers from "@/components/headers/Headers";
import { googleLogin } from "@/firebase/googlelogin";
import { setUser } from "@/store/slice/loginuserSlice";
import { RootState, useAppSelector } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export interface GoogleLoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  photo: string;
}

const page = () => {
  const { login } = useAppSelector((state: RootState) => state.loginuserSlice);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleFunction = () => {
    googleLogin()
      .then((res) => {
        if (res.success) {
          dispatch(
            setUser({
              id: res.user?.uid || "",
              img: res.user?.photo || "",
              login: res.success || false,
              name: res.user?.name || "",
            })
          );
          router.replace("/");
        }
      })
      .catch(() => {
        router.refresh();
      });
  };

  useEffect(() => {
    if (login) {
      router.back();
    }
  }, [pathname]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Headers />
      <button
        // className="h-[42px] px-8 py-4 rounded-full bg-[#242424] border border-[#323232] text-white flex justify-center items-center"
        onClick={handleFunction}
      >
        <img src="/google_login_img.png" width={250} alt="google_login" />
      </button>
    </div>
  );
};

export default page;
