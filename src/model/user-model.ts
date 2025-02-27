import { User } from "@prisma/client";

export type userResponse = {
  name: string;
  email: string;
  role: string;
};

export type CreateUserRequest = {
  name?: string;
  email: string;
  password: string;
  role?: Role;
};

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export function toUserResponse(user: User): userResponse {
  return {
    name: user.name || "",
    email: user.email,
    role: user.role,
  };
}
