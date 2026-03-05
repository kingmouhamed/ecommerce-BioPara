// =================================
// SHIPPING API ROUTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { ShippingService } from '@/lib/services/shipping';
import { validateSchema, shippingRateRequestSchema } from '@/lib/utils/validation';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { action, ...data } = body;

    let result;

    switch (action) {
      case 'get_rates':
        // Validate shipping request
        const validation = validateSchema(shippingRateRequestSchema, data);

        if (!validation.success) {
          return NextResponse.json(
            { success: false, error: 'Invalid shipping request', details: validation.errors },
            { status: 400 }
          );
        }

        result = await ShippingService.getInstance().getShippingRates(validation.data!);
        break;

      case 'create_shipment':
        // Validate shipment creation request
        const shipmentValidation = validateSchema(z.object({
          rate: z.any(),
          request: z.any(),
        }), data);

        if (!shipmentValidation.success) {
          return NextResponse.json(
            { success: false, error: 'Invalid shipment request', details: shipmentValidation.errors },
            { status: 400 }
          );
        }

        result = await ShippingService.getInstance().createShipment(data.rate, data.request);
        break;

      case 'track_shipment':
        // Validate tracking request
        const trackingValidation = validateSchema(z.object({
          tracking_number: z.string(),
          carrier: z.string(),
        }), data);

        if (!trackingValidation.success) {
          return NextResponse.json(
            { success: false, error: 'Invalid tracking request', details: trackingValidation.errors },
            { status: 400 }
          );
        }

        result = await ShippingService.getInstance().trackShipment(data.tracking_number, data.carrier);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.success && 'rates' in result ? result.rates : result,
      message: 'Shipping operation completed successfully',
    });
  } catch (error) {
    console.error('Shipping API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const weight = parseFloat(searchParams.get('weight') || '0');
    const length = parseFloat(searchParams.get('length') || '0');
    const width = parseFloat(searchParams.get('width') || '0');
    const height = parseFloat(searchParams.get('height') || '0');
    const country = searchParams.get('country') || 'domestic';

    const shippingService = ShippingService.getInstance();
    let rates = [];

    if (country === 'domestic') {
      rates = await shippingService.calculateDomesticRates(weight, { length, width, height });
    } else {
      rates = await shippingService.calculateInternationalRates(weight, { length, width, height }, country);
    }

    return NextResponse.json({
      success: true,
      data: {
        rates,
        zones: shippingService.getShippingZones(),
      },
      message: 'Shipping rates retrieved successfully',
    });
  } catch (error) {
    console.error('Shipping GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
