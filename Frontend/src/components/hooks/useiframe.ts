import { useEffect, useRef, useState } from "react";

export function useIframeStatus() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let loaded = false;

    const onLoad = () => {
      loaded = true;
      setIsLoaded(true);
      setIsFailed(false);
      setIsLoading(false);
    };

    iframe.addEventListener("load", onLoad);

    // Timeout → assume blocked (LinkedIn, FB, etc.)
    const timer = setTimeout(() => {
      if (!loaded) {
        setIsFailed(true);
        setIsLoaded(false);
        setIsLoading(false);
      }
    }, 1500);

    return () => {
      iframe.removeEventListener("load", onLoad);
      clearTimeout(timer);
    };
  }, []);

  return { iframeRef, isLoaded, isFailed, isLoading };
}
