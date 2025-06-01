import { Location } from "@prisma/client";
import { prismaClient } from "../application/database";

export class LocationRepository {
  static async create(location: string): Promise<Location> {
    return prismaClient.location.create({
      data: {
        locationName: location,
      },
    });
  }

  static async getLocation(location: string): Promise<Location | null> {
    return prismaClient.location.findFirst({
      where: {
        locationName: location,
      },
    });
  }
}
