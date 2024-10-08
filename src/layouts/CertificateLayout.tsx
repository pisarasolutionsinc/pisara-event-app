import { Outlet } from "react-router-dom";

export const CertificateLayout = () => {
  return (
    <div className="flex">
      <div className="flex flex-col min-h-screen flex-1">
        <div className="flex flex-col  bg-[#f5f4f4] min-h-[calc(100%-4rem)]">
          <Outlet />
        </div>{" "}
      </div>
    </div>
  );
};
