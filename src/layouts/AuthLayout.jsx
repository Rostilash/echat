import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="Auth">
      <Outlet />
    </div>
  );
};
