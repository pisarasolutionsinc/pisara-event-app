export const isExcludedCreateItemOption = (name: string): boolean => {
  const excludedNames = [
    "Total Expenses",
    "Total Attendees",
    "Leaders",
    "Members",
    "Attendees",
  ];
  return excludedNames.includes(name);
};
