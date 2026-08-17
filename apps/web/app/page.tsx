"use client";

import { useMemo, useState } from "react";
import { ScanSearch, Wand2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import CodeEditorPanel from "@/components/CodeEditorPanel";
import SettingsPanel from "@/components/SettingsPanel";
import WatermarkSettings from "@/components/WatermarkSettings";
import SecurityAnalyzer from "@/components/SecurityAnalyzer";
import StatsBar from "@/components/StatsBar";
import { DEFAULT_SETTINGS } from "@/lib/presets";
import { runObfuscation } from "@/lib/obfuscate";
import { analyzeSourceForSecrets } from "@/lib/securityScanner";
import { ObfuscationResult, ObfuscationSettings, SecurityAlert } from "@/lib/types";

const SAMPLE_CODE = `function greet(name) {
  const apiKey = "sk_live_51NxSampleKeyDoNotUse";
  console.log("Hello, " + name);
  return apiKey;
}

greet("world");
`;

const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "Adevos-X Tech";

type View = "obfuscator" | "settings" | "history" | "about";

export default function Home() {
  const [view, setView] = useState<View>("obfuscator");
  const [sourceCode, setSourceCode] = useState(SAMPLE_CODE);
  const [settings, setSettings] = useState<ObfuscationSettings>(DEFAULT_SETTINGS);
  const [result, setResult] = useState<ObfuscationResult | null>(null);
  const [scanned, setScanned] = useState(false);

  const alerts: SecurityAlert[] = useMemo(
    () => (scanned ? analyzeSourceForSecrets(sourceCode) : []),
    [scanned, sourceCode]
  );

  const handleObfuscate = () => {
    const res = runObfuscation(sourceCode, settings, BRAND_NAME);
    setResult(res);
  };

  const handleScan = () => setScanned(true);

  const handleFixAutomatically = (alert: SecurityAlert) => {
    let next = { ...settings, level: "custom" as const };
    if (alert.suggestedSettings.includes("stringArrayEncoding")) {
      next = { ...next, stringArrayEncoding: "rc4" };
    }
    if (alert.suggestedSettings.includes("domainLock")) {
      next = { ...next, locks: { ...next.locks, domainLockEnabled: true } };
    }
    if (alert.suggestedSettings.includes("deadCodeInjection")) {
      next = { ...next, deadCodeInjection: true };
    }
    setSettings(next);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={view} onNavigate={setView} />

      <main className="flex-1 min-w-0 p-4 lg:p-8 space-y-6">
        {view === "obfuscator" && (
          <>
            <header>
              <h1 className="font-display text-xl lg:text-2xl text-slate-100">
                Obfuscate JavaScript
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Everything runs in your browser. Your source code is never uploaded to a server.
              </p>
            </header>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleScan}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-charcoal-600 text-slate-200 hover:border-neon-500 hover:text-neon-500 transition-colors focus-ring"
              >
                <ScanSearch size={16} />
                Scan code
              </button>
              <button
                onClick={handleObfuscate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-neon-500 text-charcoal-950 font-medium hover:bg-neon-400 transition-colors focus-ring"
              >
                <Wand2 size={16} />
                Obfuscate
              </button>
            </div>

            {scanned && (
              <SecurityAnalyzer alerts={alerts} onFixAutomatically={handleFixAutomatically} />
            )}

            <div className="grid lg:grid-cols-2 gap-4 h-[420px]">
              <CodeEditorPanel
                title="Input"
                value={sourceCode}
                onChange={setSourceCode}
              />
              <CodeEditorPanel
                title="Output"
                value={result?.code ?? "// Obfuscated code will appear here"}
                readOnly
                downloadFileName="obfuscated.js"
              />
            </div>

            <StatsBar result={result} />
          </>
        )}

        {view === "settings" && (
          <>
            <header>
              <h1 className="font-display text-xl lg:text-2xl text-slate-100">
                Advanced settings
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Fine-tune every part of the obfuscation pipeline.
              </p>
            </header>
            <div className="max-w-2xl space-y-6">
              <SettingsPanel settings={settings} onChange={setSettings} />
              <WatermarkSettings
                settings={settings}
                onChange={setSettings}
                brandName={BRAND_NAME}
              />
            </div>
          </>
        )}

        {view === "history" && (
          <>
            <header>
              <h1 className="font-display text-xl lg:text-2xl text-slate-100">
                Obfuscation vault
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to keep a history of the settings you have used. Source code itself is
                never stored -- only the settings, so you can repeat a past run.
              </p>
            </header>
            <div className="border border-dashed border-charcoal-700 rounded-md px-6 py-10 text-center text-sm text-slate-500">
              No account connected yet. This view is ready for a login integration on the backend.
            </div>
          </>
        )}

        {view === "about" && (
          <>
            <header>
              <h1 className="font-display text-xl lg:text-2xl text-slate-100">
                About {BRAND_NAME}
              </h1>
            </header>
            <div className="max-w-2xl space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                {BRAND_NAME} Obfuscator is a client-side JavaScript protection tool. Obfuscation,
                including string encoding, control flow flattening, and dead code injection, runs
                entirely inside your browser. Nothing is uploaded to a server unless you choose to
                save settings to an account.
              </p>
              <p>
                The security analyzer is a regex-based scanner that also runs locally, checking for
                common leaks such as database URIs, bot tokens, and hard-coded API keys before you
                share your code.
              </p>
              <p>
                Remember to keep a safe copy of your original source. Obfuscation is one-directional
                and cannot be reversed by this tool.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
