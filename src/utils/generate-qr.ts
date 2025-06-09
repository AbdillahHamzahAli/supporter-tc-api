import QRCode from "qrcode";

export async function generateQR(url: string): Promise<Buffer> {
  return await QRCode.toBuffer(url, { type: "png" });
}
