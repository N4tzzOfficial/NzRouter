import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "material-symbols/outlined.css";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import "@/lib/network/initOutboundProxy"; // Auto-initialize outbound proxy env
import "@/shared/services/bootstrap"; // Auto-run initializeApp (watchdog, auto-resume tunnel)
import { initConsoleLogCapture } from "@/lib/consoleLogBuffer";
import { RuntimeI18nProvider } from "@/i18n/RuntimeI18nProvider";

// Hook console immediately at module load time (server-side only, runs once)
initConsoleLogCapture();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "NzRouter - AI Infrastructure Management",
  description: "One endpoint for all your AI providers. Manage keys, monitor usage, and scale effortlessly.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport = {
  themeColor: "#0a0f1f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `var d=document,r=d.documentElement,f=function(){r.classList.add('fonts-loaded')};if(d.fonts&&d.fonts.load){d.fonts.load('24px "Material Symbols Outlined"').then(f).catch(f);setTimeout(f,3000)}else{f()}`,
          }}
        />
        {/* Strip BIS (browser extension) injected attributes before React hydrates.
            The BIS extension adds bis_skin_checked/bis_id/bis_use/etc. during the
            initial paint; without this every dashboard page emits a hydration
            mismatch warning. We remove them here and watch for late injections. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var a=['bis_skin_checked','bis_id','bis_use','bis_name','bis_comply','bis_size'];function s(n){if(!n||!n.hasAttribute)return;for(var i=0;i<a.length;i++)if(n.hasAttribute(a[i]))n.removeAttribute(a[i])}function w(n){var c=n&&n.children;if(!c)return;for(var i=0;i<c.length;i++)w(c[i]);s(c[i])}try{s(document.documentElement);w(document);var o=new MutationObserver(function(rs){for(var i=0;i<rs.length;i++){var r=rs[i];if(r.type==='attributes'){s(r.target)}else if(r.type==='childList'){for(var j=0;j<r.addedNodes.length;j++){var n=r.addedNodes[j];if(n.nodeType===1){s(n);w(n)}}}}});o.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:a})}catch(e){}})();`,
          }}
        />
     </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <RuntimeI18nProvider>
            {children}
          </RuntimeI18nProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={"G-LC959F603F"} />
      </body>
    </html>
  );
}