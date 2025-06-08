import QRCode from "qrcode";

export async function generateQR(
  code: string,
  scheduleId: string
): Promise<string> {
  return await QRCode.toDataURL(code);
}
