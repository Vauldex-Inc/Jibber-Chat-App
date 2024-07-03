import { type Size } from "@/types/Component"
interface AvatarProp {
  image: string
  type: string
  size: string
  status: "offline" | "online"
}
interface BadgeProp {
  color?: string
  count: number
}

interface ButtonProp {
  size?: "small" | "medium" | "large"
  action?: "submit" | "button"
}

interface ImageProp {
  source?: string
  type: string
  size?: string
  invert?: boolean
}

interface IconButtonProp {
  size?: Size
  icon: string
  type?: string
  invert?: boolean
  rounded?: boolean
  hasPadding?: boolean
  toolTip?: string
}

interface InputProp {
  type?: "text" | "file" | "password"
  size?: "small" | "medium" | "large"
}

interface ModalProp {
  isOpen: boolean
  closeButton?: boolean
}

interface TextGroupProp {
  title: string
  text: string
  subText?: string
  isBold?: boolean
}

interface ToastProp {
  toastId: string
  message: string
  title: string
}

export type {
  AvatarProp,
  BadgeProp,
  ButtonProp,
  IconButtonProp,
  ImageProp,
  InputProp,
  ModalProp,
  TextGroupProp,
  ToastProp
}