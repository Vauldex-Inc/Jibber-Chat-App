export const useFileValidator = () => {
  const VALID_FILES = [
    'image/jpg', 
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/svg'
  ]

  const checkFile = (file: File) => {
    return VALID_FILES.includes(file.type)
  }

  return {
    checkFile
  }  
}