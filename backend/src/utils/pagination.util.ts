import { PaginationMeta } from "../types/response.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

interface PaginationInput {
  page?: number | string;
  limit?: number | string;
}

interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Parse et valide les paramètres de pagination depuis les query params.
 */
export function parsePagination(query: PaginationInput): PaginationResult {
  let page = Number(query.page) || DEFAULT_PAGE;
  let limit = Number(query.limit) || DEFAULT_LIMIT;

  if (page < 1) page = DEFAULT_PAGE;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Calcule les métadonnées de pagination à partir du total et des params.
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
