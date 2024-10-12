export const safeMapFields = (
  fields: any[] | undefined,
  callback: (field: any, index: number) => JSX.Element
): JSX.Element[] | null => {
  if (Array.isArray(fields) && fields.length > 0) {
    return fields.map((field, index) => callback(field, index));
  }
  return null;
};
