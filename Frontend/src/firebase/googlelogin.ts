import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    User 
  } from "firebase/auth";
import { app } from "./init";
  
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  
  export interface GoogleLoginPayload {
    customParams?: Record<string, string>;
    redirectURL?: string;
    signupSource?: string;
    [key: string]: any; // allow extra fields
  }
  
  export interface GoogleLoginResponse {
    success: boolean;
    token?: string;
    user?: {
      uid: string;
      name: string | null;
      email: string | null;
      photo: string | null;
    };
    payloadUsed?: GoogleLoginPayload;
    error?: string;
  }
  
  export async function googleLogin(
    payload: GoogleLoginPayload = {}
  ): Promise<GoogleLoginResponse> {
    try {
      provider.setCustomParameters({
        prompt: "select_account",
        ...(payload.customParams || {}),
      });
  
      const result = await signInWithPopup(auth, provider);
      const user: User = result.user;
      const token = await user.getIdToken();
  
      return {
        success: true,
        token,
        user: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        },
        payloadUsed: payload,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message ?? "Google login failed",
      };
    }
  }
  