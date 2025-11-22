'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"
import crypto from "crypto";

export function generateUniqueString(length = 32) {
    // Generate cryptographically strong random bytes
    const bytes = crypto.randomBytes(length);
  
    // Convert to hex string (2 chars per byte)
    return bytes.toString("hex").slice(0, length);
}

export const usegenerateMd5 = ()=>{

    const pathname = usePathname();
    const [session_key,setSessionKey] = useState("");

    useEffect(()=>{
     const isKeyExist = localStorage.getItem("session_key");
     if(isKeyExist){
        setSessionKey(isKeyExist);
        return;
     }
     setSessionKey(generateUniqueString());
     return;
    },[pathname]);

    return {session_key};
} 