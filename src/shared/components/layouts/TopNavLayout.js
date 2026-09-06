"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import { APP_CONFIG, GITHUB_CONFIG } from "@/shared/constants/config";
import { useNotificationStore } from "@/store/notificationStore";
import { useTheme } from "@/shared/hooks/useTheme";
import HeaderMenu from "../HeaderMenu";
import HeaderLanguage from "../HeaderLanguage";
import ThemeToggle from "../ThemeToggle";
import { ConfirmModal } from "../Modal";
import Button from "../Button";
import ChangelogModal from "../ChangelogModal";

const NAV_TABS = [
  { id: "gateway", label: "Gateway", icon: "api", href: "/dashboard/endpoint", description: "API endpoint & key configuration" },
  { id: "analytics", label: "Analytics", icon: "bar_chart", href: "/dashboard/usage", description: "Usage, quota & cost tracking" },
  { id: "tools", label: "Tools", icon: "terminal", href: "/dashboard/cli-tools", description: "CLI tools, MITM proxy & media providers" },
  { id: "system", label: "System", icon: "settings", href: "/dashboard/profile", description: "Settings, proxy pools, skills & debug" },
];

const NAV_DROPDOWN_ITEMS = {
  gateway: [
    { label: "Endpoint & Key", href: "/dashboard/endpoint", icon: "api" },
    { label: "Providers", href: "/dashboard/providers", icon: "dns" },
    { label: "Combos", href: "/dashboard/combos", icon: "layers" },
    { label: "Token Saver", href: "/dashboard/token-saver", icon: "savings" },
  ],
  analytics: [
    { label: "Usage & Analytics", href: "/dashboard/usage", icon: "bar_chart" },
    { label: "Quota Tracker", href: "/dashboard/quota", icon: "data_usage" },
    { label: "Console Log", href: "/dashboard/console-log", icon: "terminal" },
  ],
  tools: [
    { label: "CLI Tools", href: "/dashboard/cli-tools", icon: "terminal" },
    { label: "MITM Proxy", href: "/dashboard/mitm", icon: "security" },
    { label: "Media Providers", href: "/dashboard/media-providers/embedding", icon: "perm_media" },
    { label: "PXPIPE", href: "/dashboard/pxpipe", icon: "image" },
    { label: "Translator Debug", href: "/dashboard/translator", icon: "translate" },
  ],
  system: [
    { label: "Settings", href: "/dashboard/profile", icon: "settings" },
    { label: "Proxy Pools", href: "/dashboard/proxy-pools", icon: "lan" },
    { label: "Skills", href: "/dashboard/skills", icon: "extension" },
    { label: "Change Log", action: "changelog", icon: "history" },
  ],
};

export default function TopNavLayout({ children }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("gateway");
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shutdownCountdown, setShutdownCountdown] = useState(0);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const dropdownRef = useRef(null);
  const { toggleTheme, isDark } = useTheme();
  const INSTALL_CMD = "npx nzrouter@latest";

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, { ...notification, id: Date.now() + Math.random() }]);
  };

  useEffect(() => {
    const unsubscribe = useNotificationStore.subscribe((state) => {
      setNotifications(state.notifications);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.enableTranslator) {
          // Translator enabled
        }
      })
      .catch(() => {});

    fetch("/api/version")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.hasUpdate) setUpdateInfo(data);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const handleCopyAndShutdown = async () => {
    try { await navigator.clipboard.writeText(INSTALL_CMD); } catch { }
    addNotification({ type: "success", title: "Copied", message: "Install command copied to clipboard" });
    let remaining = 3;
    setShutdownCountdown(remaining);
    const timer = setInterval(() => {
      remaining -= 1;
      setShutdownCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        fetch("/api/version/shutdown", { method: "POST" }).catch(() => {});
        setIsDisconnected(true);
      }
    }, 1000);
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setShutdownCountdown(0);
  };

  const handleShutdown = async () => {
    setIsShuttingDown(true);
    try {
      await fetch("/api/version/shutdown", { method: "POST" });
    } catch (e) { }
    setIsShuttingDown(false);
    setShutdownOpen(false);
  };

  const getActiveTabFromPath = (path) => {
    if (path.startsWith("/dashboard/endpoint") || path.startsWith("/dashboard/providers") || path.startsWith("/dashboard/combos") || path.startsWith("/dashboard/token-saver")) return "gateway";
    if (path.startsWith("/dashboard/usage") || path.startsWith("/dashboard/quota") || path.startsWith("/dashboard/console-log")) return "analytics";
    if (path.startsWith("/dashboard/cli-tools") || path.startsWith("/dashboard/mitm") || path.startsWith("/dashboard/media-providers") || path.startsWith("/dashboard/pxpipe") || path.startsWith("/dashboard/translator")) return "tools";
    if (path.startsWith("/dashboard/profile") || path.startsWith("/dashboard/proxy-pools") || path.startsWith("/dashboard/skills")) return "system";
    return "gateway";
  };

  useEffect(() => {
    setActiveTab(getActiveTabFromPath(pathname));
  }, [pathname]);

  const getToastStyle = (type) => {
    if (type === "success") return { wrapper: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400", icon: "check_circle" };
    if (type === "error") return { wrapper: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400", icon: "error" };
    if (type === "warning") return { wrapper: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: "warning" };
    return { wrapper: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: "info" };
  };

  const isTabActive = (tabId) => {
    const tab = NAV_TABS.find((t) => t.id === tabId);
    return pathname === tab.href || pathname.startsWith(tab.href + "/");
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-[80] flex w-[min(92vw,380px)] flex-col gap-2">
        {notifications.map((n) => {
          const style = getToastStyle(n.type);
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm ${style.wrapper}`}
            >
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] leading-5">{style.icon}</span>
                <div className="min-w-0 flex-1">
                  {n.title ? <p className="text-xs font-semibold mb-0.5">{n.title}</p> : null}
                  <p className="text-xs whitespace-pre-wrap break-words">{n.message}</p>
                </div>
                {n.dismissible ? (
                  <button onClick={() => removeNotification(n.id)} className="text-current/70 hover:text-current" aria-label="Dismiss notification">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex h-screen w-full overflow-hidden bg-bg">
        <header className="shrink-0 z-30 relative">
          <nav
            className="fixed top-0 left-0 right-0 z-30 backdrop-blur-xl border-b border-border-subtle bg-surface/60 dark:bg-surface/40"
            style={{ background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          >
            <div className="mx-auto max-w-full px-4 lg:px-8">
              <div className="flex h-16 items-center justify-between gap-4">
                <div className="flex items-center gap-4 shrink-0">
                  <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="NzRouter Home">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-primary via-primary-hover to-primary shadow-[0_0_20px_rgba(99,102,241,0.4)] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                      <img
                        src="https://avatars.githubusercontent.com/u/181945053?v=4"
                        alt="NzRouter"
                        className="size-8 rounded-lg relative z-10"
                      />
                    </motion.div>
                    <div className="hidden sm:block">
                      <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-text-main via-primary to-primary-hover bg-clip-text text-transparent">
                        NzRouter
                      </h1>
                      <span className="text-xs text-text-muted font-medium">by N4tzzOfficial</span>
                    </div>
                  </Link>

                  <div className="hidden md:flex items-center gap-1 bg-surface/50 dark:bg-surface/30 rounded-xl border border-border-subtle p-1" role="tablist" aria-label="Main navigation">
                    {NAV_TABS.map((tab) => {
                      const active = activeTab === tab.id;
                      return (
                        <motion.button
                          key={tab.id}
                          role="tab"
                          aria-selected={active}
                          aria-controls={`${tab.id}-panel`}
                          id={`${tab.id}-tab`}
                          onClick={() => setActiveTab(tab.id)}
                          onMouseEnter={() => setHoveredTab(tab.id)}
                          onMouseLeave={() => setHoveredTab(null)}
                          className={cn(
                            "relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            active
                              ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                              : "text-text-muted hover:text-text-main hover:bg-surface/50"
                          )}
                          whileHover={{ scale: active ? 1 : 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.span
                            className="material-symbols-outlined text-[20px]"
                            animate={{ rotate: active ? 0 : hoveredTab === tab.id ? 15 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            {tab.icon}
                          </motion.span>
                          <span>{tab.label}</span>
                          {active && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {updateInfo && !isUpdating && !isDisconnected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px] animate-bounce">system_update_alt</span>
                      <span>v{updateInfo.latestVersion} available</span>
                      <motion.button
                        onClick={() => setShowUpdateModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-semibold"
                      >
                        Update
                      </motion.button>
                    </motion.div>
                  )}

                  <ThemeToggle />
                  <HeaderLanguage />
                  <HeaderMenu
                    onLogout={() => window.location.assign("/login")}
                    onChangelog={() => setChangelogOpen(true)}
                    onShutdown={() => setShutdownOpen(true)}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 bg-surface/95 dark:bg-surface/90 backdrop-blur-xl border-b border-border-subtle px-4 py-3"
                >
                  <div className="mx-auto max-w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                    {NAV_DROPDOWN_ITEMS[showDropdown]?.map((item) => (
                      <motion.button
                        key={item.href || item.action}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ delay: 0.05 }}
                        onClick={() => {
                          if (item.action === "changelog") {
                            setChangelogOpen(true);
                            setShowDropdown(null);
                          } else if (item.href) {
                            window.location.href = item.href;
                          }
                        }}
                        className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-text-muted hover:text-primary hover:bg-primary/5 transition-all text-sm"
                      >
                        <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                        <span className="font-medium text-center">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          <div className="h-16 md:h-16" aria-hidden="true" />
        </header>

        <main className="flex-1 overflow-y-auto pt-0" style={{ scrollPaddingTop: "4rem" }}>
          <div className="max-w-full mx-auto px-4 lg:px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-[calc(100vh-4rem)]"
            >
              {children}
            </motion.div>
          </div>
        </main>

        <ConfirmModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onConfirm={() => { setShowUpdateModal(false); setIsUpdating(true); }}
          title="Update NzRouter"
          message={`Show install command for v${updateInfo?.latestVersion || ""}? You can copy it and shutdown to install manually.`}
          confirmText="Show Command"
          cancelText="Cancel"
          variant="primary"
        />

        {(isDisconnected || isUpdating) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            {isUpdating ? (
              <ManualUpdatePanel
                latestVersion={updateInfo?.latestVersion}
                installCmd={INSTALL_CMD}
                onCopyAndShutdown={handleCopyAndShutdown}
                onCancel={handleCancelUpdate}
                countdown={shutdownCountdown}
                isDisconnected={isDisconnected}
              />
            ) : (
              <div className="text-center p-8">
                <div className="flex items-center justify-center size-16 rounded-full bg-red-500/20 text-red-500 mx-auto mb-4">
                  <span className="material-symbols-outlined text-[32px]">power_off</span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Server Disconnected</h2>
                <p className="text-text-muted mb-6">The proxy server has been stopped.</p>
                <Button variant="secondary" onClick={() => globalThis.location.reload()}>
                  Reload Page
                </Button>
              </div>
            )}
          </div>
        )}

        <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
        <ConfirmModal
          isOpen={shutdownOpen}
          onClose={() => setShutdownOpen(false)}
          onConfirm={handleShutdown}
          title="Close Proxy"
          message="Are you sure you want to close the proxy server?"
          confirmText="Close"
          cancelText="Cancel"
          variant="danger"
          loading={isShuttingDown}
        />
      </div>
    </>
  );
}

function ManualUpdatePanel({ latestVersion, installCmd, onCopyAndShutdown, onCancel, countdown, isDisconnected }) {
  const isCountingDown = countdown > 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-lg rounded-2xl bg-neutral-900/95 border border-white/10 p-6 text-white shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          className="flex items-center justify-center size-11 rounded-full bg-amber-500/20 text-amber-400"
        >
          <span className="material-symbols-outlined text-[24px]">content_copy</span>
        </motion.div>
        <div>
          <h2 className="text-lg font-semibold">Update NzRouter{latestVersion ? ` to v${latestVersion}` : ""}</h2>
          <p className="text-xs text-white/60">
            {isDisconnected
              ? "Server stopped. Paste the command into a terminal to install."
              : isCountingDown
              ? `Command copied. Server will stop in ${countdown}s...`
              : "Click the button below to copy the install command and shutdown."}
          </p>
        </div>
      </div>

      <p className="text-sm text-white/80 mb-2">Install command:</p>
      <div className="w-full px-3 py-2 rounded bg-white/5 mb-4">
        <code className="text-xs font-mono text-amber-400 break-all">{installCmd}</code>
      </div>

      <ol className="text-xs text-white/70 space-y-1 list-decimal list-inside mb-4">
        <li>Click <strong>Copy & Shutdown</strong> below.</li>
        <li>Paste the command into your terminal and press Enter.</li>
        <li>Run <code className="px-1 rounded bg-white/10 text-green-400">nzrouter</code> again after install.</li>
      </ol>

      {isDisconnected ? (
        <Button variant="secondary" fullWidth onClick={() => globalThis.location.reload()}>
          Reload Page
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isCountingDown}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={onCopyAndShutdown} disabled={isCountingDown}>
            {isCountingDown ? `Shutting down in ${countdown}s` : "Copy & Shutdown"}
          </Button>
        </div>
      )}
    </motion.div>
  );
}