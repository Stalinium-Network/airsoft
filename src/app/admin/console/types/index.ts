import { Game } from '@/services/gameService'

export interface GameFormData extends Omit<Game, '_id'> {
  _id?: string | number
}

export interface UserInfo {
  email: string
  isAdmin: boolean
  iat: number
  exp: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
