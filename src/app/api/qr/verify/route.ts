import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'bfarmx-retail-auth');

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 },
      );
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return NextResponse.json({ contract_address: payload.contract_address });
    } catch (error: any) {
      console.error('Token verification failed:', error.message);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error('Error verifying QR token:', error);
    return NextResponse.json(
      { error: 'Failed to verify QR token' },
      { status: 500 },
    );
  }
}
