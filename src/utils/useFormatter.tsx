export const displayValue = (value: any) => {
  return value === "" || value === null || value === undefined ? "N/A" : value;
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeFullName = (firstName: string, lastName: string) => {
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};
