import { useEffect, useState } from "react";
import baseUrl from "../baseUrl";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${baseUrl.INVENTORY}/api/v1/auth/check`,
          { credentials: "include" }
        );
        console.log(res);
        
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return { isLoggedIn };
};
