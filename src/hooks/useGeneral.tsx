export const useGeneral = () => {
  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.map((n) => n[0]).join("");
  };

  return { getInitials };
};
