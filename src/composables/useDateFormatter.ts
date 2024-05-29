export const useDateFormatter = () => {
  const format = (dateString: string,options: Intl.DateTimeFormatOptions): string => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", options);
  };

  return { format };
};
