"use client";

import { ObfuscationResult } from "@/lib/types";
import { formatBytes } from "@/lib/obfuscate";

export default function StatsBar({ result }: { result: ObfuscationResult | null }) {
  if (!result) return null;

  const delta = result.outputSizeBytes - result.originalSizeBytes;
  const deltaLabel = delta >= 0 ? `+${formatBytes(delta)}` : `-${formatBytes(Math.abs(delta))}`;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 border border-charcoal-700 rounded-md px-4 py-3">
      <span>
        Original: <span className="text-slate-200">{formatBytes(result.originalSizeBytes)}</span>
      </span>
      <span>
        Output: <span className="text-slate-200">{formatBytes(result.outputSizeBytes)}</span>
      </span>
      <span>
        Size change: <span className="text-neon-500">{deltaLabel}</span>
      </span>
      <span>
        Time: <span className="text-slate-200">{result.elapsedMs} ms</span>
      </span>
    </div>
  );
}
