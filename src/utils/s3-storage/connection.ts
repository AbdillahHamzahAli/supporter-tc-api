import * as AWS from "aws-sdk";
import { MYENV } from "../../config/environment";

export const connectS3 = new AWS.S3({
  s3ForcePathStyle: true,
  region: MYENV.S3_REGION,
  endpoint: MYENV.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: MYENV.S3_ACCESS_KEY,
    secretAccessKey: MYENV.S3_SECRET_KEY,
  },
});
