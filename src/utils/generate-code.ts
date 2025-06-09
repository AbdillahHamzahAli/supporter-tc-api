import { randomInt } from "crypto";
import { code } from "../model/schedule-model";

export async function generateCode(length: number): Promise<string> {
  const code = randomInt(10 ** (length - 1), 10 ** length).toString();
  return code;
}
