// =================================
// SHIPPING TYPES
// =================================

export interface Address {
  name: string;
  street1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Parcel {
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  distance_unit?: string;
}

export interface ShipmentRequest {
  from_address: Address;
  to_address: Address;
  parcels: Parcel[];
}

export interface ShippingRate {
  id: string;
  provider: string;
  service: string;
  rate: number;
  currency: string;
  estimated_days: number;
}

export interface ShippingRatesResult {
  success: boolean;
  rates?: ShippingRate[];
  error?: string;
}

export interface TrackingResult {
  success: boolean;
  tracking_number?: string;
  status?: string;
  location?: string;
  estimated_delivery?: string;
  error?: string;
}
