import { type Size } from "@/types/Component"
import type { DirectChannel, PublicChannel } from "@/types/Channel"
import type { Status } from "@/types/User"
import type { Message } from "@/types/Message"
import type { Invitation } from "@/types/Notification"

interface AvatarProp {
  image: string
  type: string
  size: string
  status: Status
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
interface ChatInfoProp {
  images: Array<string>
  channel: PublicChannel | DirectChannel
  title: string
  sender?: string
}

interface ChatBalloonProp {
  message: Message
  color?: string
}

interface ChannelTypeProp {
  channel: PublicChannel | DirectChannel
}

interface ChannelMessageProp {
  messages: Message[]
  channel: PublicChannel | DirectChannel
}

interface ProfileProp {
  sender?: string
  viewOnly?: boolean
}

interface ChatTitleProp {
  channel: PublicChannel | DirectChannel
  sender?: string
  collapse: boolean
}

interface InvitationCardProp {
  notification: Invitation
  name: string
}

interface SettingProp {
  profileImage?: string
  username: string
}

interface InvitationProp {
  color: string
  idChannel: string
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
  ToastProp,
  ChatInfoProp,
  ChatBalloonProp,
  ChannelTypeProp,
  ChannelMessageProp,
  ProfileProp,
  ChatTitleProp,
  InvitationCardProp,
  SettingProp,
  InvitationProp
}

