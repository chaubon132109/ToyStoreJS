export interface ReportServiceInterface {
  getTotal(): Promise<any>;
  getTop3Items();
}
