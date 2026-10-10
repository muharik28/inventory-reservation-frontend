// Shared TypeScript interfaces for the Inventory Reservation API

export interface StockResponse {
  item_id: string;
  total_stock: number;
  reserved_stock: number;
  available_stock: number;
}

export interface ReserveRequest {
  item_id: string;
  quantity: number;
  user_id: string;
}

export interface ReserveResponse {
  status: string;
  reservation_id: string;
  item_id: string;
  quantity: number;
  expires_at: string; // ISO 8601 timestamp
}

export interface ConfirmRequest {
  reservation_id: string;
}

export interface ConfirmResponse {
  status: string;
  reservation_id: string;
  confirmed_at: string; // ISO 8601 timestamp
}

export interface ApiError {
  message: string;
  code?: string;
}

// Internal reservation state tracked by the UI
export type ReservationStatus = 'idle' | 'active' | 'expired' | 'confirmed';

export interface ActiveReservation {
  reservation_id: string;
  item_id: string;
  quantity: number;
  expires_at: string;
  status: ReservationStatus;
  confirmed_at?: string;
}
