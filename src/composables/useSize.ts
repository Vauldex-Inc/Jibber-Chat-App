const sizeClass = (size?: string) => {
  switch (size) {
    case "sm":
      return "py-2 px-4 text-sm";
    case "md":
      return "py-3 px-5 text-base";
    case "lg":
      return "py-4 px-6 text-lg";
    default:
      return "py-3 px-5 text-base";
  }
};

const imageSizeClass = (size?: string) => {
  switch (size) {
    case "sm":
      return "h-10";
    case "md":
      return "h-12";
    case "lg":
      return "h-16";
    default:
      return "h-12";
  }
};

const customImageSizeClass = (size?: string) => {
  switch (size) {
    case "sm":
      return "h-4";
    case "md":
      return "h-6";
    case "lg":
      return "h-8";
    case "xl":
      return "h-12";
    default:
      return "h-6";
  }
};

const inputSizeClass = (size?: string) => {
  switch (size) {
    case "sm":
      return "py-1 px-2 text-sm";
    case "md":
      return "py-2 px-4 text-base";
    case "lg":
      return "py-3 px-5 text-lg";
    default:
      return "py-2 px-4 text-base";
  }
};

export { sizeClass, imageSizeClass, customImageSizeClass, inputSizeClass }