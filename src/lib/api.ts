import { UserData } from './types'

let users: UserData[] = [
  { id: 0, name: "Administrador", email: "Admin@company.com", role: "Administrador" },
  { id: 1, name: "Usuario", email: "Usuario1@company.com", role: "Usuario" },
  { id: 2, name: "Usuario2", email: "Usuario2@company.com", role: "Usuario" },
  { id: 3, name: "Usuario3", email: "Usuario3@company.com", role: "Usuario" },
]

export const fetchUsers = async (): Promise<UserData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users), 500)
  })
}

export const addUser = async (user: UserData): Promise<UserData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = { ...user, id: users.length }
      users.push(newUser)
      resolve(newUser)
    }, 500)
  })
}

export const updateUser = async (user: UserData): Promise<UserData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      users = users.map(u => u.id === user.id ? user : u)
      resolve(user)
    }, 500)
  })
}

export const deleteUser = async (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      users = users.filter(u => u.id !== id)
      resolve()
    }, 500)
  })
}