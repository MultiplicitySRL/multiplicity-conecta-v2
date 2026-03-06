"use client"

import { createContext, useContext } from "react"

export interface UserInfo {
  id: string
  nombre: string
  email: string
  cargo: string
  empresa: string
}

export const UserContext = createContext<UserInfo | null>(null)

export function useUser(): UserInfo | null {
  return useContext(UserContext)
}
