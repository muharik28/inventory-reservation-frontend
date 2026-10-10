import type {
  StockResponse,
  ReserveRequest,
  ReserveResponse,
  ConfirmRequest,
  ConfirmResponse,
} from '../types';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/inventory`;

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    // Surface backend error message if available
    const message =
      data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

/**
 * GET /stock?item_id=...
 * Fetch current stock levels for a given item.
 */
export async function fetchStock(itemId: string): Promise<StockResponse> {
  const res = await fetch(`${BASE_URL}/stock?item_id=${encodeURIComponent(itemId)}`, {
    headers: { Accept: 'application/json' },
  });
  return handleResponse<StockResponse>(res);
}

/**
 * POST /reserve
 * Reserve a quantity of an item for a user.
 */
export async function reserveItem(payload: ReserveRequest): Promise<ReserveResponse> {
  const res = await fetch(`${BASE_URL}/reserve`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<ReserveResponse>(res);
}

/**
 * POST /confirm
 * Confirm a reservation to complete the purchase.
 */
export async function confirmReservation(payload: ConfirmRequest): Promise<ConfirmResponse> {
  const res = await fetch(`${BASE_URL}/confirm`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<ConfirmResponse>(res);
}
