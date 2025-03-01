import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

export const MYENV = {
  JWT_SCRET: process.env.JWT_SECRET as string,
};

// console.log(MYENV);
