import type { NextRequest } from 'next/server';
import { AES, enc } from 'crypto-js';
import { NextResponse } from 'next/server';

type EncryptedData = {
  a: string; // contract_address
  e?: number; // expires_at
  x?: number; // access_expires_at
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contract_address, qrExpiryHours, accessExpiryHours } = body;

    if (!contract_address) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 },
      );
    }

    const data: EncryptedData = {
      a: contract_address,
    };

    if (qrExpiryHours) {
      data.e = Date.now() + (qrExpiryHours * 60 * 60 * 1000);
    }
    if (accessExpiryHours) {
      data.x = Date.now() + (accessExpiryHours * 60 * 60 * 1000);
    }

    const encryptedData = AES.encrypt(
      JSON.stringify(data),
      process.env.ENCRYPTION_KEY || 'default-key',
    ).toString();

    const base64url = encryptedData
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return NextResponse.json({
      encrypted_data: base64url,
      expires_at: data.e,
      access_expires_at: data.x,
    });
  } catch (error) {
    console.error('Error encrypting data:', error);
    return NextResponse.json(
      { error: 'Failed to encrypt data' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const base64url = searchParams.get('data');

    if (!base64url) {
      return NextResponse.json(
        { error: 'Encrypted data is required' },
        { status: 400 },
      );
    }

    const base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      + '='.repeat((4 - base64url.length % 4) % 4);

    const bytes = AES.decrypt(base64, process.env.ENCRYPTION_KEY || 'default-key');
    const decryptedData = JSON.parse(bytes.toString(enc.Utf8)) as EncryptedData;

    if (decryptedData.e && Date.now() > decryptedData.e) {
      return NextResponse.json(
        { error: 'QR code has expired' },
        { status: 400 },
      );
    }

    if (decryptedData.x && Date.now() > decryptedData.x) {
      return NextResponse.json(
        { error: 'Access has expired' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      contract_address: decryptedData.a,
      expires_at: decryptedData.e,
      access_expires_at: decryptedData.x,
    });
  } catch (error) {
    console.error('Error decrypting data:', error);
    return NextResponse.json(
      { error: 'Failed to decrypt data' },
      { status: 500 },
    );
  }
}
