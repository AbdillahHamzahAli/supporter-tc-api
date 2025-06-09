import { generateQR } from "../utils/generate-qr";
import { ResponseError } from "../error/response-error";
import {
  CreateScheduleRequest,
  GetSceduleResponse,
  SceduleResponse,
  UpdateScheduleRequest,
  code,
  toSceduleResponse,
} from "../model/schedule-model";
import { LocationRepository } from "../repository/location-repository";
import { ScheduleRepository } from "../repository/schedule-repostitory";
import { generateCode } from "../utils/generate-code";
import { ScheduleValidation } from "../validation/scedule-validation";
import { Validation } from "../validation/validation";
import { uploadImage } from "../utils/s3-storage/upload-image";

export class ScheduleService {
  static async create(
    request: CreateScheduleRequest
  ): Promise<SceduleResponse> {
    const validated = Validation.validate(ScheduleValidation.CREATE, request);

    let code: code;
    if (validated.generateCode) {
      const code6 = await generateCode(6);
      const qrcode = await generateQR(code6);
      const location = await uploadImage(qrcode, `qrcode-${code6}.png`);
      code = {
        code: code6,
        qrcode: location,
      };
    }

    const location = await this.getOrCreateLocation(validated.location);
    validated.location = location.id; // ubah menjadi location id

    const scheduleResult = await ScheduleRepository.create(validated, code);

    return toSceduleResponse(
      scheduleResult.schedule,
      scheduleResult.code,
      scheduleResult.location
    );
  }

  static async update(
    request: UpdateScheduleRequest
  ): Promise<SceduleResponse> {
    const updateRequest = Validation.validate(
      ScheduleValidation.UPDATE,
      request
    );

    const exists = await ScheduleRepository.getScheduleById(updateRequest.id);

    if (!exists) {
      throw new ResponseError(404, "Schedule not found");
    }

    const location = await this.getOrCreateLocation(updateRequest.location);
    updateRequest.location = location.id;

    const scheduleResult = await ScheduleRepository.update(updateRequest);

    return toSceduleResponse(
      scheduleResult.schedule,
      scheduleResult.code,
      scheduleResult.location
    );
  }

  static async getAll(): Promise<GetSceduleResponse[]> {
    const schedules = await ScheduleRepository.getAll();
    const schedulesResponse = schedules.map((schedule) => {
      return {
        id: schedule.id,
        title: schedule.title,
        start: schedule.start,
        end: schedule.end,
        location: schedule.location,
      };
    });
    return schedulesResponse;
  }

  // ===== Schedule Code =====
  static async createScheduleCode(
    scheduleId: string
  ): Promise<SceduleResponse> {
    const exists = await ScheduleRepository.getScheduleById(scheduleId);

    if (!exists) {
      throw new ResponseError(404, "Schedule not found");
    }

    let code: code;
    const code6 = await generateCode(6);
    const qrcode = await generateQR(code6);
    const location = await uploadImage(qrcode, `qrcode-${code6}.png`);
    code = {
      code: code6,
      qrcode: location,
    };

    const scheduleCode = await ScheduleRepository.createCode(code);
    const schedule = await ScheduleRepository.updateScheduleCode(
      scheduleCode.id,
      scheduleId
    );

    return toSceduleResponse(
      schedule.schedule,
      schedule.code,
      schedule.location
    );
  }

  private static async getOrCreateLocation(locationInput: string) {
    const existing = await LocationRepository.getLocation(locationInput);
    return existing ?? (await LocationRepository.create(locationInput));
  }
}
