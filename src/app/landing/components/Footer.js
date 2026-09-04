"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://i.imgur.com/U2JAm7E.png"
                alt="NzRouter Logo"
                className="size-6 rounded-lg ring-2 ring-primary/30"
              />
              <h3 className="text-white text-lg font-black">NzRouter</h3>
            </div>
            <p className="text-text-muted text-sm max-w-xs mb-6">
              The unified endpoint for AI generation. Connect, route, and manage your AI providers with ease.
            </p>
            <div className="flex gap-4">
              <a className="text-text-muted hover:text-primary transition-colors" href="https://github.com/decolua/nzrouter" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined">code</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white">Product</h4>
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="#features">Features</a>
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="/dashboard">Dashboard</a>
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="https://github.com/decolua/nzrouter" target="_blank" rel="noopener noreferrer">Changelog</a>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white">Resources</h4>
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="https://github.com/decolua/nzrouter#readme" target="_blank" rel="noopener noreferrer">Documentation</a>
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="https://github.com/decolua/nzrouter" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="https://www.npmjs.com/package/nzrouter" target="_blank" rel="noopener noreferrer">NPM</a>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-white">Legal</h4>
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="https://github.com/decolua/nzrouter/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">© 2025 NzRouter by N4tzzTeam. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="https://github.com/decolua/nzrouter" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-text-muted hover:text-primary text-sm transition-colors" href="https://www.npmjs.com/package/nzrouter" target="_blank" rel="noopener noreferrer">NPM</a>
          </div>
        </div>
      </div>
    </footer>
  );
}