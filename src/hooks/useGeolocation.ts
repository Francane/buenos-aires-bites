import { useState, useCallback, useEffect } from 'react';

const CONSENT_KEY = 'weeat-geo-consent';
const CONSENT_DAYS = 7;

interface GeoState {
  lat: number;
  lng: number;
}

function getStoredConsent(): boolean | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { value, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return value as boolean;
  } catch {
    return null;
  }
}

function storeConsent(value: boolean) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify({
    value,
    expiry: Date.now() + CONSENT_DAYS * 24 * 60 * 60 * 1000,
  }));
}

export function useGeolocation() {
  const [consent, setConsent] = useState<boolean | null>(getStoredConsent);
  const [position, setPosition] = useState<GeoState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const acceptConsent = useCallback(() => {
    storeConsent(true);
    setConsent(true);
  }, []);

  const dismissConsent = useCallback(() => {
    storeConsent(false);
    setConsent(false);
  }, []);

  useEffect(() => {
    if (consent === true && !position && !loading) {
      requestLocation();
    }
  }, [consent, position, loading, requestLocation]);

  return {
    consent,
    position,
    error,
    loading,
    acceptConsent,
    dismissConsent,
    showBanner: consent === null,
  };
}
