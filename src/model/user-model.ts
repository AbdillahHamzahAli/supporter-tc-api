import { Role, User } from "@prisma/client";

export type userResponse = {
  name: string;
  email: string;
  role: string;
  token?: string;
};

export type CreateUserRequest = {
  name?: string;
  email: string;
  password: string;
  role?: Role;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export function toUserResponse(user: User): userResponse {
  return {
    name: user.name || "",
    email: user.email,
    role: user.role,
  };
}
