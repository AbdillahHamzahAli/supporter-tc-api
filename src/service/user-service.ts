import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  toUserResponse,
  userResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";

export class UserService {
  static async register(request: CreateUserRequest): Promise<userResponse> {
    const regiterRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const totalUserWithSameEmail = await prismaClient.user.count({
      where: {
        email: regiterRequest.email,
      },
    });

    if (totalUserWithSameEmail != 0) {
      throw new ResponseError(400, "Email already exists");
    }

    regiterRequest.password = await bcrypt.hash(regiterRequest.password, 10);

    const user = await prismaClient.user.create({
      data: regiterRequest,
    });

    return toUserResponse(user);
  }
}
