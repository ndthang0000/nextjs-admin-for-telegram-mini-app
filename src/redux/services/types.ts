export interface ResponseApi<T> {
  status: boolean;
  message?: string;
  data?: T;
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

