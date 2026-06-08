import { useMemo } from 'react';

function getSearchParams(): URLSearchParams | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search);
}

export function useIsElectron(): boolean {
  return useMemo(() => {
    const params = getSearchParams();
    return params?.has('electron') ?? false;
  }, []);
}

export function useElectronPlatform(): string | null {
  return useMemo(() => {
    const params = getSearchParams();
    return params?.get('platform') ?? null;
  }, []);
}
