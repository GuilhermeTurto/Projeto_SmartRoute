export enum ViewMode {
  HOME = 'HOME',
  PROSPECT = 'PROSPECT',
  ROUTE = 'ROUTE',
  HISTORY = 'HISTORY'
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SearchParams {
  businessType: string;
  location: string;
  count: number;
}

export interface RouteParams {
  addresses: string[] | string;
}
