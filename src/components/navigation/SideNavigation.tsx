import { createContext, useContext, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type TSideNavigation = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  groupOpen: string[] | string | null;
  handleGroupTrigger: (group: string) => void;
  groupBehavior: "single" | "multiple";
  setGroupBehavior: React.Dispatch<React.SetStateAction<"single" | "multiple">>;
};

const SideNavigationContext = createContext<ReturnType<
  typeof SideNavigationHook
> | null>(null);

const SideNavigationHook = (): TSideNavigation => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [groupOpen, setGroupOpen] = useState<string[] | string | null>(null);
  const [groupBehavior, setGroupBehavior] = useState<"single" | "multiple">(
    "single"
  );

  useEffect(() => {
    if (groupBehavior == "single") {
      setGroupOpen(null);
    } else {
      setGroupOpen([]);
    }
  }, [groupBehavior]);

  const handleGroupTrigger = (group: string) => {
    if (groupBehavior == "single") {
      if (groupOpen == group) {
        setGroupOpen(null);
        return;
      }

      setGroupOpen(group);
    } else if (groupBehavior == "multiple" && Array.isArray(groupOpen)) {
      if (groupOpen?.includes(group)) {
        const groups = groupOpen.filter((prevGroup) => prevGroup != group);
        setGroupOpen(groups);
        return;
      }

      const groups = [...groupOpen, group];
      setGroupOpen(groups);
    }
  };

  return {
    expanded,
    setExpanded,
    groupOpen,
    handleGroupTrigger,
    groupBehavior,
    setGroupBehavior,
  };
};

const useSideNavigation = () => {
  const context = useContext(SideNavigationContext);

  if (!context) {
    throw new Error(
      "useSideNavigation should only be used inside a SideNavigationProvider"
    );
  }

  return context;
};

const SideNavigationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sideNavigation = SideNavigationHook();
  return (
    <SideNavigationContext.Provider value={sideNavigation}>
      {children}
    </SideNavigationContext.Provider>
  );
};

const SideNavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SideNavigationContextProvider>{children}</SideNavigationContextProvider>
  );
};

type TSideNavigationProps = {
  groupBehavior?: "single" | "multiple";
  className?: string;
  children?: React.ReactNode;
};

const SideNavigation = ({ children, ...props }: TSideNavigationProps) => {
  return (
    <SideNavigationProvider>
      <Root {...props}>{children}</Root>
    </SideNavigationProvider>
  );
};

const Root = ({
  groupBehavior = "single",
  className,
  children,
}: TSideNavigationProps) => {
  const { setGroupBehavior } = useSideNavigation();

  useEffect(() => {
    setGroupBehavior(groupBehavior);
  }, [groupBehavior]);

  return (
    <div
      className={twMerge(
        "sticky top-0 left-0 flex flex-col gap-6 h-screen bg-white border-r border-border-base",
        className
      )}
    >
      {children}
    </div>
  );
};

const NavigationLink = ({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const handleNavLinkStyle = (activeClass?: string) => {
    return twMerge(
      "flex gap-4 items-center w-full px-5 py-3 hover:bg-primary-base/20 transition-[background] whitespace-nowrap",
      activeClass,
      className
    );
  };

  return (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }): string =>
        isActive
          ? handleNavLinkStyle(
              "text-project-white bg-primary-base hover:bg-primary-base"
            )
          : handleNavLinkStyle("")
      }
    >
      {children}
    </NavLink>
  );
};

const NavigationGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="navigation-group flex flex-col w-full">{children}</div>
  );
};

const NavigationGroupTrigger = ({
  group,
  className,
  children,
}: {
  group: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const { handleGroupTrigger } = useSideNavigation();
  return (
    <button
      onClick={() => handleGroupTrigger(group)}
      className={twMerge(
        "flex gap-4 items-center w-full px-10 py-3 hover:bg-primary-base/20 transition-[background] whitespace-nowrap",
        className
      )}
    >
      {children}
      <FaChevronDown size={12} />
    </button>
  );
};

const NavigationGroupContent = ({
  group,
  children,
}: {
  group: string;
  children: React.ReactNode;
}) => {
  const { groupBehavior, groupOpen } = useSideNavigation();
  const open =
    groupBehavior == "single" ? groupOpen == group : groupOpen?.includes(group);

  return open && <div className="flex flex-col">{children}</div>;
};

SideNavigation.NavLink = NavigationLink;
SideNavigation.Group = NavigationGroup;
SideNavigation.GroupTrigger = NavigationGroupTrigger;
SideNavigation.GroupContent = NavigationGroupContent;

export { SideNavigation };
