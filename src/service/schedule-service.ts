import {
  CreateScheduleRequest,
  SceduleResponse,
  code,
  toSceduleResponse,
} from "../model/schedule-model";
import { LocationRepository } from "../repository/location-repository";
import { ScheduleRepository } from "../repository/schedule-repostitory";
import { generateCode } from "../utils/generate-code";
import { ScheduleValidation } from "../validation/scedule-validation";
import { Validation } from "../validation/validation";

export class ScheduleService {
  static async create(
    request: CreateScheduleRequest
  ): Promise<SceduleResponse> {
    const validated = Validation.validate(ScheduleValidation.CREATE, request);

    const code: code | undefined = validated.generateCode
      ? await generateCode(6)
      : undefined;

    const location = await this.getOrCreateLocation(validated.location);
    validated.location = location.id; // ubah menjadi location id

    const scheduleResult = await ScheduleRepository.create(validated, code);

    return toSceduleResponse(
      scheduleResult.schedule,
      scheduleResult.code,
      scheduleResult.location
    );
  }

  private static async getOrCreateLocation(locationInput: string) {
    const existing = await LocationRepository.getLocation(locationInput);
    return existing ?? (await LocationRepository.create(locationInput));
  }
}
