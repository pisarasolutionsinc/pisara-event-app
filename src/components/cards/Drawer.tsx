import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  children: ReactNode;
  title?: string;
  bgColor?: string;
  titleColor?: string;
}

function Drawer({
  isOpen,
  toggleDrawer,
  children,
  title = "Drawer",
  bgColor = "bg-light",
  titleColor = "text-dark",
}: DrawerProps) {
  return (
    <>
      {/* Background overlay with opacity */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={toggleDrawer} // Close drawer when clicking on the overlay
        />
      )}

      <div
        className={`w-[100vw]  lg:w-[45vw] xl:w-[35vw] fixed top-0 right-0 z-50 h-full transform p-5 rounded-tl-3xl ${bgColor} space-y-5 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between">
          <h1 className={`text-base font-semibold ${titleColor}`}>{title}</h1>
          <button onClick={toggleDrawer}>
            <IoClose className="text-lg" />
          </button>
        </div>
        <section className="flex flex-col gap-5 h-full overflow-y-auto ">
          {children}
        </section>
      </div>
    </>
  );
}

export default Drawer;

// import { ReactNode } from "react";
// // import { GoKebabHorizontal } from "react-icons/go";
// import { IoClose } from "react-icons/io5";

// interface DrawerProps {
//   isOpen: boolean;
//   toggleDrawer: () => void;
//   children: ReactNode;
//   title?: string;
//   bgColor?: string;
//   titleColor?: string;
// }

// function Drawer({
//   isOpen,
//   toggleDrawer,
//   children,
//   title = "Drawer",
//   bgColor = "bg-light",
//   titleColor = "text-dark",
// }: DrawerProps) {
//   return (
//     <>
//       <div
//         className={`w-[35vw] fixed top-0 right-0 z-50 h-full transform p-5 rounded-tl-3xl ${bgColor} space-y-5 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } transition-transform duration-300 ease-in-out`}
//       >
//         <div className="flex items-center justify-between">
//           <h1 className={`text-base font-semibold ${titleColor}`}>{title}</h1>
//           <button onClick={toggleDrawer}>
//             <IoClose className="text-lg" />
//           </button>
//         </div>
//         <section className="flex flex-col gap-5 h-full overflow-y-auto pb-36">
//           {children}
//         </section>
//       </div>

//       {/* <button
//         className={`fixed top-[4vh] right-0 z-50 transform -translate-y-1/2 bg-primary text-white p-3 rounded-l-full`}
//         onClick={toggleDrawer}
//       >
//         {isOpen ? (
//           <IoClose className="text-base" />
//         ) : //   <GoKebabHorizontal className="text-lg rotate-90" />
//         null}
//       </button> */}
//     </>
//   );
// }

// export default Drawer;
