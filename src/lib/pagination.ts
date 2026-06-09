// Server-side pagination helpers for admin list pages.

export function getPageParam(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export interface PageInfo {
  page: number;
  totalPages: number;
  skip: number;
  take: number;
}

export function paginate(total: number, page: number, pageSize: number): PageInfo {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  return { page: current, totalPages, skip: (current - 1) * pageSize, take: pageSize };
}
