import { LocationRepository } from '@src/location/core/repositories/location-repository';
import { OverviewDataResult } from '@src/location/core/repositories/location-repository';
import { TrendDataResult } from '@src/location/core/repositories/location-repository';
import { TrendDataType } from '@src/location/core/repositories/location-repository';

export class StatisticsDataUseCase {
  constructor(private readonly locationRepository: LocationRepository) {}

  async overviewData(): Promise<OverviewDataResult> {
    const data = await this.locationRepository.overviewData();
    return data;
  }

  async trendData(type: TrendDataType): Promise<TrendDataResult[] | []> {
    const data = await this.locationRepository.trendData(type);

    return data;
  }
}
