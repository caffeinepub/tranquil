/**
 * useBiometricAuth - Web Authentication API hook for biometric re-authentication.
 * Provides checkBiometricAvailability() and performBiometricChallenge() utilities.
 */

import { useState, useEffect } from 'react';

export function useBiometricAuth() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkBiometricAvailability().then(available => {
      setIsAvailable(available);
      setIsChecking(false);
    });
  }, []);

  return { isAvailable, isChecking, performBiometricChallenge };
}

export async function checkBiometricAvailability(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    if (!window.PublicKeyCredential) return false;
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
}

export async function performBiometricChallenge(): Promise<boolean> {
  try {
    if (!window.PublicKeyCredential) return false;

    // Generate a random challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'required',
        rpId: window.location.hostname,
      },
    });

    return credential !== null;
  } catch (err: unknown) {
    // User cancelled or biometric failed
    if (err instanceof Error && err.name === 'NotAllowedError') {
      return false;
    }
    return false;
  }
}
