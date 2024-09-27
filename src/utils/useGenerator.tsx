export const useGenerator = () => {
  const customIDGenerator = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return {
    customIDGenerator,
    generateRandomNumber,
  };
};
