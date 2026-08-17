"use client";

import { AlertTriangle, ShieldCheck, ShieldAlert, Info } from "lucide-react";
import { SecurityAlert } from "@/lib/types";

interface SecurityAnalyzerProps {
  alerts: SecurityAlert[];
  onFixAutomatically: (alert: SecurityAlert) => void;
}

const ICONS: Record<SecurityAlert["type"], typeof AlertTriangle> = {
  critical: ShieldAlert,
  warning: AlertTriangle,
  info: Info,
};

const STYLES: Record<SecurityAlert["type"], string> = {
  critical: "border-red-500/40 bg-red-500/5 text-red-300",
  warning: "border-amber-500/40 bg-amber-500/5 text-amber-300",
  info: "border-slate-500/40 bg-slate-500/5 text-slate-300",
};

export default function SecurityAnalyzer({ alerts, onFixAutomatically }: SecurityAnalyzerProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 border border-charcoal-700 rounded-md px-3 py-2">
        <ShieldCheck size={16} className="text-neon-500" />
        <span>No exposed secrets detected in the pasted code.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const Icon = ICONS[alert.type];
        return (
          <div
            key={alert.id}
            className={`border rounded-md px-3 py-2.5 ${STYLES[alert.type]}`}
          >
            <div className="flex items-start gap-2">
              <Icon size={16} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm">{alert.message}</p>
                {alert.suggestedSettings.length > 0 && (
                  <button
                    onClick={() => onFixAutomatically(alert)}
                    className="mt-2 text-xs font-medium px-2.5 py-1 rounded border border-neon-500 text-neon-500 hover:bg-neon-500 hover:text-charcoal-950 transition-colors focus-ring"
                  >
                    Fix automatically
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
