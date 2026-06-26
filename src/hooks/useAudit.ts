import { useState, useEffect } from 'react';
import { runAudit } from '@/lib/github.functions';
import type { AuditResult } from '@/lib/types';

export function useAudit(username: string | undefined) {
  const [data, setData] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    runAudit({ data: { username } })
      .then((result) => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [username]);

  return { data, loading, error };
}
