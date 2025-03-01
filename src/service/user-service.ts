import { prismaClient } from "../application/database";
import { MYENV } from "../config/environment";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  toUserResponse,
  userResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  static async login(request: LoginUserRequest): Promise<userResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    const user = await prismaClient.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new ResponseError(401, "Email or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(401, "Email or password wrong");
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      MYENV.JWT_SCRET,
      {
        expiresIn: "1h",
      }
    );

    const response = toUserResponse(user);
    response.token = token;

    return response;
  }
}
