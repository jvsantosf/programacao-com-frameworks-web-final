import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export function useFlashMessage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>(location.state?.success ?? "");

  useEffect(() => {
    if (location.state?.success) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return [message, setMessage] as const;
}
