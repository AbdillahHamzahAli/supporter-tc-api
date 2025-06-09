import { MYENV } from "../../config/environment";
import { connectS3 } from "./connection";

export async function uploadImage(
  data: Buffer,
  filename: string
): Promise<string> {
  try {
    const res = await connectS3
      .upload({
        Bucket: MYENV.S3_BUCKET_NAME,
        Key: filename,
        Body: data,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();

    return MYENV.SUPABASE_BUCKET_LINK + filename;
  } catch (err) {
    throw err;
  }
}
