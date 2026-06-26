import { z } from "zod";
import type { AuditResult } from "./types";

const InputSchema = z.object({ username: z.string().min(1).max(40) });

const cache = new Map<string, { at: number; data: AuditResult }>();
const TTL = 10 * 60 * 1000;

export const runAudit = async ({ data: inputData }: { data: { username: string } }): Promise<AuditResult> => {
    const data = InputSchema.parse(inputData);
    const username = data.username.trim();
    const cached = cache.get(username.toLowerCase());
    if (cached && Date.now() - cached.at < TTL) return cached.data;

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    
    const res = await fetch(`${API_BASE_URL}/api/github/audit/${encodeURIComponent(username)}`);
    
    if (!res.ok) {
      let msg = "Failed to fetch audit data";
      try {
        const errJson = await res.json();
        if (errJson.message) msg = errJson.message;
      } catch (e) {}
      throw new Error(msg);
    }

    const result = (await res.json()) as AuditResult;

    cache.set(username.toLowerCase(), { at: Date.now(), data: result });
    return result;
};
