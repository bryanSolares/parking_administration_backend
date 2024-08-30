import {
  LocationRepository,
  OverviewDataResult,
  TrendDataResult
} from '@src/location/core/repositories/location-repository';

export class StatisticsDataUseCase {
  constructor(private readonly locationRepository: LocationRepository) {}

  async overviewData(): Promise<OverviewDataResult> {
    const data = await this.locationRepository.overviewData();
    return data;
  }

  async trendData(
    limit: number,
    page: number,
    startDate: string,
    endDate: string
  ): Promise<TrendDataResult[]> {
    const data = await this.locationRepository.trendData(
      limit,
      page,
      startDate,
      endDate
    );

    return data;
  }
}
