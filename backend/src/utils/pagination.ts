import { ParsedQs } from 'qs';
import { PaginationMeta, PaginationQuery } from '../types/common.types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

type QueryValue = string | number | ParsedQs | string[] | ParsedQs[] | undefined;

const toPositiveNumber = (value: QueryValue, fallback: number): number => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return fallback;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const getPagination = (query: Partial<Record<keyof PaginationQuery, QueryValue>>): PaginationQuery => ({
  page: toPositiveNumber(query.page, DEFAULT_PAGE),
  limit: toPositiveNumber(query.limit, DEFAULT_LIMIT),
});

export const buildPaginationMeta = (totalItems: number, page: number, limit: number): PaginationMeta => {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : DEFAULT_PAGE;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : DEFAULT_LIMIT;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
  const currentPage = Math.min(safePage, totalPages);

  return {
    page: currentPage,
    limit: safeLimit,
    total: totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};
