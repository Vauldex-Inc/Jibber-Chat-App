const sizeClass = (size?: string) => {
  switch (size) {
    case "extraSmall":
      return "text-xs"
    case "small":
      return "py-2 px-3 text-sm";
    case "medium":
      return "py-3 px-5 text-base";
    case "large":
      return "py-4 px-6 text-lg";
    default:
      return "py-3 px-5 text-base";
  }
};

const imageSizeClass = (size?: string) => {
  switch (size) {
    case "small":
      return "h-10";
    case "medium":
      return "h-12";
    case "large":
      return "h-16";
    default:
      return "h-12";
  }
};

const customImageSizeClass = (size?: string) => {
  switch (size) {
    case "small":
      return "h-4";
    case "medium":
      return "h-6";
    case "large":
      return "h-8";
    case "extraLarge":
      return "h-12";
    default:
      return "h-4";
  }
};

const inputSizeClass = (size?: string) => {
  switch (size) {
    case "small":
      return "py-1 px-2 text-sm";
    case "medium":
      return "py-2 px-4 text-base";
    case "large":
      return "py-3 px-5 text-lg";
    default:
      return "py-2 px-4 text-base";
  }
};

export { 
  sizeClass, 
  imageSizeClass, 
  customImageSizeClass, 
  inputSizeClass
}