/**
 * Tests for lib/auth.ts — JWT sign/verify helpers.
 *
 * jose's SignJWT / jwtVerify work in Node.js without any special polyfills,
 * so no mocking is needed here.
 */

import { signToken, verifyToken } from '@/lib/auth';
import { SignJWT } from 'jose';

// The module uses this secret internally; we replicate it so we can craft
// tokens with controlled expiry for the "expired token" test.
const JWT_SECRET_RAW =
  process.env.JWT_SECRET || 'fallback-secret-change-in-production-32c';
const secret = new TextEncoder().encode(JWT_SECRET_RAW);

describe('auth — signToken', () => {
  it('returns a non-empty JWT string', async () => {
    const token = await signToken({ userId: 1, email: 'test@example.com' });
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // header.payload.signature
  });

  it('encodes userId and email in the payload', async () => {
    const token = await signToken({ userId: 42, email: 'user@domain.io' });
    const payload = await verifyToken(token);

    expect(payload).not.toBeNull();
    expect(payload!.userId).toBe(42);
    expect(payload!.email).toBe('user@domain.io');
  });

  it('includes standard JWT claims (iat, exp)', async () => {
    const before = Math.floor(Date.now() / 1000);
    const token = await signToken({ userId: 7, email: 'a@b.com' });
    const after = Math.floor(Date.now() / 1000);

    const payload = await verifyToken(token);
    expect(payload!.iat).toBeGreaterThanOrEqual(before);
    expect(payload!.iat).toBeLessThanOrEqual(after + 1);
    // 7 days window
    expect(payload!.exp! - payload!.iat!).toBeCloseTo(7 * 24 * 60 * 60, -2);
  });
});

describe('auth — verifyToken', () => {
  it('returns the payload for a valid token', async () => {
    const token = await signToken({ userId: 5, email: 'valid@test.com' });
    const payload = await verifyToken(token);

    expect(payload).not.toBeNull();
    expect(payload!.userId).toBe(5);
    expect(payload!.email).toBe('valid@test.com');
  });

  it('returns null for a completely invalid string', async () => {
    const result = await verifyToken('this.is.not.a.jwt');
    expect(result).toBeNull();
  });

  it('returns null for a tampered signature', async () => {
    const token = await signToken({ userId: 1, email: 'x@x.com' });
    const [header, payload] = token.split('.');
    const tampered = `${header}.${payload}.invalidsignature`;
    const result = await verifyToken(tampered);
    expect(result).toBeNull();
  });

  it('returns null for a token signed with a different secret', async () => {
    const wrongSecret = new TextEncoder().encode('completely-different-secret-xyz');
    const fakeToken = await new SignJWT({ userId: 99, email: 'hacker@evil.com' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(wrongSecret);

    const result = await verifyToken(fakeToken);
    expect(result).toBeNull();
  });

  it('returns null for an expired token', async () => {
    // Create a token that expired 1 second in the past
    const expiredToken = await new SignJWT({ userId: 3, email: 'old@example.com' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('-1s') // expired 1 second ago
      .sign(secret);

    const result = await verifyToken(expiredToken);
    expect(result).toBeNull();
  });
});
