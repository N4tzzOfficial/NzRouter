"use client";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";

export default function GetStarted() {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = (text) => {
    copy(text, "landing");
  };

  return (
    <section className="py-24 px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Steps */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Get Started in 30 Seconds</h2>
            <p className="text-text-muted text-lg mb-8">
              Install NzRouter, configure your providers via web dashboard, and start routing AI requests.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-lg">Install NzRouter</h4>
                  <p className="text-sm text-text-muted mt-1">Run npx command to start the server instantly</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-lg">Open Dashboard</h4>
                  <p className="text-sm text-text-muted mt-1">Configure providers and API keys via web interface</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-lg">Route Requests</h4>
                  <p className="text-sm text-text-muted mt-1">Point your CLI tools to http://localhost:20128</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Code block */}
          <div className="flex-1 w-full">
            <div className="rounded-xl overflow-hidden bg-surface border border-border shadow-2xl card-glass">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-2 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs text-text-muted font-mono">terminal</div>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                <div
                  className="flex items-center gap-2 mb-4 group cursor-pointer"
                  onClick={() => handleCopy("npx nzrouter")}
                >
                  <span className="text-green-400">$</span>
                  <span className="text-white">npx nzrouter</span>
                  <span className="ml-auto text-text-muted text-xs opacity-0 group-hover:opacity-100">
                    {copied === "landing" ? "✓ Copied" : "Copy"}
                  </span>
                </div>

                <div className="text-text-muted mb-6">
                  <span className="text-primary">></span> Starting NzRouter...<br/>
                  <span className="text-primary">></span> Server running on <span className="text-primary">http://localhost:20128</span><br/>
                  <span className="text-primary">></span> Dashboard: <span className="text-primary">http://localhost:20128/dashboard</span><br/>
                  <span className="text-green-400">></span> Ready to route! ✓
                </div>

                <div className="text-xs text-text-muted mb-2 border-t border-border pt-4">
                  📝 Configure providers in dashboard or use environment variables
                </div>

                <div className="text-text-muted text-xs">
                  <span className="text-purple-400">Data Location:</span><br/>
                  <span className="text-text-muted">  macOS/Linux:</span> ~/.nzrouter/db/data.sqlite<br/>
                  <span className="text-text-muted">  Windows:</span> %APPDATA%/NzRouter/db/data.sqlite
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}