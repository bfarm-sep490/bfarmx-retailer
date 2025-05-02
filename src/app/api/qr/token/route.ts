import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'bfarmx-retail-auth');

export async function POST(request: Request) {
  try {
    const { contract_address } = await request.json();

    if (!contract_address) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 },
      );
    }

    const token = await new SignJWT({ contract_address })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating QR token:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR token' },
      { status: 500 },
    );
  }
}
