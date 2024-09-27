import { Outlet } from "react-router-dom";

export const PublicFormLayout = () => {
  return (
    <div className="flex">
      <div className="flex flex-col min-h-screen flex-1">
        <div className="flex flex-col p-5 bg-[#f5f4f4] min-h-[calc(100%-4rem)]">
          <Outlet />
        </div>{" "}
      </div>
    </div>
  );
};
