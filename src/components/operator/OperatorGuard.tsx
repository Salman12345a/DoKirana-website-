import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isOperatorSessionValid } from "../../services/operatorService";

interface OperatorGuardProps { children: React.ReactNode; }

/**
 * OperatorGuard — protects /operator/* routes.
 * Reads operatorAccessToken ONLY. Never touches admin accessToken.
 */
const OperatorGuard = ({ children }: OperatorGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith("/operator")) return;
    const publicPaths = ["/operator/login", "/operator/register"];
    if (publicPaths.includes(location.pathname)) return;

    if (!isOperatorSessionValid()) {
      navigate("/operator/login", { replace: true });
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export default OperatorGuard;
