window.__ModuleLoader__.load({
  id: "dsh-antigravity",
  factory(require) {
    const React = require("react");
    const { useCallback, useEffect, useMemo, useRef, useState } = React;

    const STYLE_ID = "dsh-antigravity-pool-settings-style";
    const API = "/antigravity/api";
    const NS = "dsh-antigravity";
    const ANTIGRAVITY_SVG_PATH =
      "M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z";

    const zh = {
      pageTitle: "Antigravity Pool",
      pageDesc: "Google Antigravity 多账号池与无感轮换。支持自动负载均衡、429 无感故障转移与前端生图工具绑定。",
      schedulerTitle: "账号调度策略",
      modeAuto: "智能均衡 (推荐)",
      modeAutoDesc: "每次请求自动挑选剩余额度最健康的账号，遇 429 速率限制毫秒级自动切换备用账号，前端零感知。",
      modePrimary: "主备切换",
      modePrimaryDesc: "平时固定使用主账号；仅当主账号额度见底或被限额时，才自动启用备用账号顶上。",
      modeManual: "手动指定",
      modeManualDesc: "锁定仅使用下方指定的当前账号（类似单账号模式，用于调试或单账号专跑）。",
      imageConfigTitle: "默认生图配置 (前端插画/素材生成)",
      imageModelLabel: "默认生图模型",
      imageOutputDirLabel: "出图保存目录",
      imageConfigDesc: "在编写前端代码时，AI 可自动调用此模型生成插图并保存在本地项目中，无需手动在模型菜单来回切换。",
      accountsTitle: "Google 账号池",
      addAccount: "＋ 添加 Google 账号",
      refreshAllQuotas: "刷新全部额度",
      loggingIn: "正在发起授权...",
      refreshing: "刷新中...",
      primaryTag: "主账号",
      backupTag: "备用账号",
      setPrimary: "设为主账号",
      setManualActive: "设为当前使用",
      logout: "退出登录",
      inCooldown: "冷却中 (429)",
      online: "在线正常",
      noAccounts: "账号池暂无账号",
      noAccountsDesc: "点击上方“添加 Google 账号”登录你的第一个 Google 账号。可添加多个账号共享额度。",
      quota: "额度",
      resetPrefix: "重置: {time}",
      resetUnavailable: "重置: n/a",
      resetNow: "现在",
      timeDayHour: "{days}天 {hours}时",
      timeHourMin: "{hours}h {minutes}m",
      timeMin: "{minutes}m",
      updatedAt: "更新时间：{time}",
      modelSelector: "模型选择器",
      modelSelectorDesc: "勾选后会出现在 DSH 模型列表中（所有账号共享此模型集）。",
      selectAll: "全选",
      unselectAll: "全不选",
      loadingModels: "正在加载模型列表...",
      modelSelectorNote: "勾选即自动保存。重新打开模型选择器即可生效。",
      quotaLabel: "池最高额度: {percent}%",
      loginFailed: "登录失败",
      imageGenBadge: "🎨 图像生成",
      reasoningBadge: "⚡️ 智能思考",
    };

    const en = {
      pageTitle: "Antigravity Pool",
      pageDesc: "Google Antigravity Multi-Account Pool & Auto-Failover. Automatically balances quota, fails over on 429 errors, and provides seamless frontend image generation.",
      schedulerTitle: "Dispatch Strategy",
      modeAuto: "Smart Balance (Recommended)",
      modeAutoDesc: "Automatically picks the healthiest account with highest quota. Fails over to backup accounts instantly on 429 rate limits.",
      modePrimary: "Primary & Backup",
      modePrimaryDesc: "Always uses the primary account, seamlessly switching to backup accounts only when primary is exhausted.",
      modeManual: "Manual",
      modeManualDesc: "Lock to the specified account below.",
      imageConfigTitle: "Image Generation Defaults (Frontend Assets)",
      imageModelLabel: "Default Image Model",
      imageOutputDirLabel: "Save Directory",
      imageConfigDesc: "Allows the AI to generate website illustrations/assets automatically into your project without switching models manually.",
      accountsTitle: "Google Accounts Pool",
      addAccount: "＋ Add Google Account",
      refreshAllQuotas: "Refresh All Quotas",
      loggingIn: "Authorizing...",
      refreshing: "Refreshing...",
      primaryTag: "PRIMARY",
      backupTag: "BACKUP",
      setPrimary: "Set as Primary",
      setManualActive: "Select for Use",
      logout: "Sign out",
      inCooldown: "Cooling down (429)",
      online: "Healthy",
      noAccounts: "No accounts in pool",
      noAccountsDesc: "Click Add Google Account above to sign in. You can add multiple accounts to double your capacity.",
      quota: "Quota",
      resetPrefix: "Reset: {time}",
      resetUnavailable: "Reset: n/a",
      resetNow: "now",
      timeDayHour: "{days}d {hours}h",
      timeHourMin: "{hours}h {minutes}m",
      timeMin: "{minutes}m",
      updatedAt: "Updated: {time}",
      modelSelector: "Model Selector",
      modelSelectorDesc: "Checked models will appear in DSH's model list (shared across pool).",
      selectAll: "Select all",
      unselectAll: "Deselect all",
      loadingModels: "Loading model configuration...",
      modelSelectorNote: "Saved automatically.",
      quotaLabel: "Pool Max: {percent}%",
      loginFailed: "Login failed",
      imageGenBadge: "🎨 Image Gen",
      reasoningBadge: "⚡️ Thinking",
    };

    function createTranslator(ctx) {
      const boundT = (ctx && ctx.locale && typeof ctx.locale.bind === "function")
        ? ctx.locale.bind(NS)
        : null;

      return function t(key, params) {
        if (boundT) {
          try {
            const res = boundT(key, params);
            if (res && res !== key && res !== `${NS}.${key}`) return res;
          } catch (_) {}
        }
        const active = (ctx && ctx.locale && typeof ctx.locale.getLocale === "function")
          ? ctx.locale.getLocale()?.active
          : null;
        const isZh = active ? active.startsWith("zh") : (typeof navigator !== "undefined" && navigator.language && navigator.language.startsWith("zh"));
        const dict = isZh ? zh : en;
        let text = dict[key] || en[key] || zh[key] || key;
        if (params && typeof params === "object") {
          for (const [k, v] of Object.entries(params)) {
            text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
          }
        }
        return text;
      };
    }

    function installStyle() {
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
.dshap-wrap{box-sizing:border-box;width:100%;max-width:780px;padding:0 0 32px;color:#111827;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.dshap-page-head{display:flex;align-items:center;gap:10px}
.dshap-page-title{margin:0;color:#111827;font-size:20px;font-weight:700;line-height:28px}
.dshap-page-desc{margin:8px 0 18px;color:#6b7280;font-size:13px;line-height:20px}
.dshap-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.02)}
.dshap-card-title{font-size:14px;font-weight:700;color:#111827;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.dshap-card-desc{color:#6b7280;font-size:12px;margin-top:2px;margin-bottom:12px;line-height:18px}
.dshap-radio-group{display:grid;grid-template-columns:1fr;gap:10px}
.dshap-radio-item{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;cursor:pointer;transition:all .15s ease}
.dshap-radio-item:hover{border-color:#d1d5db;background:#fafbfc}
.dshap-radio-item.active{border-color:#2563eb;background:#f0f7ff}
.dshap-radio-label{font-size:13px;font-weight:650;color:#111827}
.dshap-radio-desc{font-size:12px;color:#6b7280;margin-top:3px;line-height:16px}
.dshap-input-row{display:flex;gap:16px;flex-wrap:wrap}
.dshap-input-group{flex:1;min-width:220px}
.dshap-input-label{display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:6px}
.dshap-input{width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;font-size:13px;box-sizing:border-box;background:#fff;color:#111827}
.dshap-input:focus{outline:none;border-color:#2563eb}
.dshap-accounts-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;flex-wrap:wrap}
.dshap-account-card{border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:14px;background:#fafbfc;transition:all .2s ease}
.dshap-account-card.primary{border-color:#bfdbfe;background:#fff}
.dshap-account-card.cooldown{border-color:#fed7aa;background:#fffaf5}
.dshap-acc-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap}
.dshap-acc-left{display:flex;align-items:center;gap:8px;min-width:0}
.dshap-email{font-size:14px;font-weight:700;color:#111827}
.dshap-tag{font-size:11px;font-weight:700;padding:2px 7px;border-radius:6px;text-transform:uppercase}
.dshap-tag-primary{background:#dbeafe;color:#1d4ed8}
.dshap-tag-backup{background:#f3f4f6;color:#6b7280}
.dshap-tag-pro{background:#e0e7ff;color:#4338ca}
.dshap-status{display:flex;align-items:center;gap:5px;font-size:12px;color:#059669;font-weight:600}
.dshap-status.cooldown{color:#ea580c}
.dshap-dot{width:7px;height:7px;border-radius:999px;background:#10b981}
.dshap-dot.cooldown{background:#f97316}
.dshap-quota-section{margin-top:10px;padding-top:10px;border-top:1px solid #edf1f5}
.dshap-group-box{margin-bottom:10px;padding:10px 12px;background:#fff;border:1px solid #edf1f5;border-radius:8px}
.dshap-rowtop{display:flex;align-items:baseline;justify-content:space-between;gap:12px;font-size:12px;color:#4b5563;font-weight:600}
.dshap-metrics{display:flex;align-items:baseline;gap:8px;font-size:11px;color:#6b7280}
.dshap-percent{font-weight:750;color:#059669}
.dshap-percent-cyan{color:#0284c7}
.dshap-bar{height:6px;margin-top:6px;margin-bottom:8px;border-radius:999px;background:#e5e7eb;overflow:hidden}
.dshap-fill{height:100%;border-radius:999px;background:#10b981;min-width:3px;transition:width .3s ease}
.dshap-fill-cyan{height:100%;border-radius:999px;background:#06b6d4;min-width:3px;transition:width .3s ease}
.dshap-acc-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px;border-top:1px solid #edf1f5;padding-top:10px}
.dshap-btn{border:1px solid #d1d5db;background:#fff;color:#374151;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s ease}
.dshap-btn:hover{background:#f9fafb;border-color:#9ca3af}
.dshap-btn:disabled{opacity:.5;cursor:not-allowed}
.dshap-btn-primary{border-color:#111827;background:#111827;color:#fff}
.dshap-btn-primary:hover{background:#272d38}
.dshap-btn-add{border:1.5px dashed #cbd5e1;background:#fafbfc;color:#2563eb;width:100%;padding:12px;font-size:13px;font-weight:700;border-radius:10px;cursor:pointer;margin-bottom:14px;transition:all .15s ease}
.dshap-btn-add:hover{border-color:#93c5fd;background:#eff6ff}
.dshap-badge-image{background:#fae8ff;color:#a21caf;font-size:11px;font-weight:700;padding:2px 6px;border-radius:5px}
.dshap-badge-think{background:#ecfdf5;color:#047857;font-size:11px;font-weight:700;padding:2px 6px;border-radius:5px}
.dshap-model-list{border:1px solid #e5e7eb;border-radius:10px;overflow:hidden}
.dshap-model-row{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:#fff;border-top:1px solid #e5e7eb;cursor:pointer}
.dshap-model-row:hover{background:#fafbfc}
.dshap-model-row:first-child{border-top:0}
.dshap-error{color:#dc2626;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 12px;font-size:12px;margin-bottom:12px}
`;
      document.head.append(style);
    }

    async function api(path, options) {
      const response = await fetch(`${API}${path}`, {
        ...options,
        headers: {
          "content-type": "application/json",
          ...(options && options.headers ? options.headers : {}),
        },
      });
      const body = await response.json().catch(() => ({ ok: false, error: "invalid-json" }));
      if (!response.ok || !body.ok) {
        throw new Error(body.error || `HTTP ${response.status}`);
      }
      return body.value;
    }

    function formatTimeRemaining(ms, tr) {
      if (typeof ms !== "number" || isNaN(ms) || ms <= 0) return tr("resetNow");
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (days > 0) return tr("timeDayHour", { days, hours: hours % 24 });
      if (hours > 0) return tr("timeHourMin", { hours, minutes: minutes % 60 });
      return tr("timeMin", { minutes: Math.max(1, minutes) });
    }

    function QuotaCardRows({ quota, tr }) {
      if (!quota || !Array.isArray(quota.groups) || quota.groups.length === 0) return null;

      return React.createElement(
        "div",
        { className: "dshap-quota-section" },
        quota.groups.map((group, gIdx) => {
          const groupTitle = group.displayName || group.name || "Models";
          const isClaude = /claude|gpt/i.test(groupTitle);
          const isCyan = isClaude;
          const buckets = group.buckets || group.limits || [];

          return React.createElement(
            "div",
            { key: `g_${gIdx}`, className: "dshap-group-box" },
            React.createElement(
              "div",
              { style: { fontSize: "12px", fontWeight: 700, color: "#111827", marginBottom: "6px" } },
              groupTitle,
            ),
            buckets.map((bucket, bIdx) => {
              const fraction = typeof bucket.remainingFraction === "number" ? bucket.remainingFraction : 1;
              const percent = Math.round(fraction * 1000) / 10;
              const resetMs = bucket.resetTime ? new Date(bucket.resetTime).getTime() - Date.now() : undefined;
              const resetLabel = resetMs !== undefined ? formatTimeRemaining(resetMs, tr) : tr("resetUnavailable");
              const label = bucket.displayName || bucket.label || "Limit";

              return React.createElement(
                "div",
                { key: `b_${bIdx}`, style: { marginTop: bIdx > 0 ? "8px" : "0" } },
                React.createElement(
                  "div",
                  { className: "dshap-rowtop" },
                  React.createElement("span", null, label),
                  React.createElement(
                    "div",
                    { className: "dshap-metrics" },
                    React.createElement("span", null, tr("resetPrefix", { time: resetLabel })),
                    React.createElement(
                      "span",
                      { className: isCyan ? "dshap-percent-cyan" : "dshap-percent" },
                      `${percent}%`,
                    ),
                  ),
                ),
                React.createElement(
                  "div",
                  { className: "dshap-bar" },
                  React.createElement("div", {
                    className: isCyan ? "dshap-fill-cyan" : "dshap-fill",
                    style: { width: `${Math.min(100, Math.max(0, percent))}%` },
                  }),
                ),
              );
            }),
          );
        }),
      );
    }

    function AntigravitySettingsPage({ ctx }) {
      const tr = useMemo(() => createTranslator(ctx), [ctx]);
      const [poolStatus, setPoolStatus] = useState({ accounts: [], schedulingMode: "auto" });
      const [loading, setLoading] = useState(true);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState("");
      const [modelConfig, setModelConfig] = useState({ options: [], enabledModelIds: [] });
      const pollRef = useRef();

      useEffect(() => {
        installStyle();
      }, []);

      const refreshStatus = useCallback(async () => {
        try {
          const value = await api("/status", { method: "GET" });
          setPoolStatus(value);
          if (value.models) setModelConfig(value.models);
          return value;
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          return null;
        } finally {
          setLoading(false);
        }
      }, []);

      const refreshAllQuotas = useCallback(async () => {
        setBusy(true);
        setError("");
        try {
          const value = await api("/quota", { method: "GET" });
          setPoolStatus(value);
          if (value.models) setModelConfig(value.models);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setBusy(false);
        }
      }, []);

      useEffect(() => {
        void refreshStatus();
        return () => {
          if (pollRef.current) clearInterval(pollRef.current);
        };
      }, [refreshStatus]);

      const startLogin = useCallback(async () => {
        setBusy(true);
        setError("");
        try {
          const value = await api("/login", { method: "POST" });
          if (value.authUrl) window.open(value.authUrl, "_blank", "noopener,noreferrer");
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = setInterval(async () => {
            const next = await refreshStatus();
            if (next && next.login && next.login.status === "complete") {
              clearInterval(pollRef.current);
              pollRef.current = undefined;
              await refreshAllQuotas();
            }
            if (next && next.login && next.login.status === "error") {
              clearInterval(pollRef.current);
              pollRef.current = undefined;
              setError(next.login.error || tr("loginFailed"));
            }
          }, 2000);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setBusy(false);
        }
      }, [refreshAllQuotas, refreshStatus, tr]);

      const updateConfig = useCallback(async (patch) => {
        setError("");
        try {
          const updated = await api("/config", { method: "POST", body: JSON.stringify(patch) });
          setPoolStatus(updated);
          if (updated.models) setModelConfig(updated.models);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }, []);

      const setPrimary = useCallback(async (id) => {
        setError("");
        try {
          const updated = await api("/accounts/set-primary", { method: "POST", body: JSON.stringify({ id }) });
          setPoolStatus(updated);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }, []);

      const removeAccount = useCallback(async (id) => {
        setError("");
        try {
          const updated = await api("/accounts/remove", { method: "POST", body: JSON.stringify({ id }) });
          setPoolStatus(updated);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }, []);

      const saveModels = useCallback(async (enabledModelIds) => {
        setError("");
        try {
          const value = await api("/models", {
            method: "POST",
            body: JSON.stringify({ enabledModelIds }),
          });
          setModelConfig(value);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }, []);

      const toggleModel = useCallback((modelId, enabled) => {
        const current = new Set(modelConfig?.enabledModelIds || []);
        if (enabled) current.add(modelId);
        else current.delete(modelId);
        void saveModels([...current]);
      }, [modelConfig, saveModels]);

      const setAllModels = useCallback((enabled) => {
        const ids = enabled && modelConfig?.options ? modelConfig.options.map((o) => o.id) : [];
        void saveModels(ids);
      }, [modelConfig, saveModels]);

      const accounts = (poolStatus.accounts && poolStatus.accounts.length > 0)
        ? poolStatus.accounts
        : (poolStatus.email
            ? [{
                id: "acc_active",
                email: poolStatus.email,
                planLabel: poolStatus.planLabel || "Google AI Pro",
                isPrimary: true,
                inCooldown: false,
                cooldownRemainingMs: 0,
                lastError: null,
                quota: poolStatus.quota,
              }]
            : []);

      return React.createElement(
        "div",
        { className: "dshap-wrap" },
        // Header
        React.createElement(
          "div",
          { className: "dshap-page-head" },
          React.createElement("h2", { className: "dshap-page-title" }, tr("pageTitle")),
        ),
        React.createElement("p", { className: "dshap-page-desc" }, tr("pageDesc")),

        // Error banner
        error ? React.createElement("div", { className: "dshap-error" }, error) : null,

        // 1. Dispatch Strategy Card
        React.createElement(
          "div",
          { className: "dshap-card" },
          React.createElement("div", { className: "dshap-card-title" }, `⚙️ ${tr("schedulerTitle")}`),
          React.createElement(
            "div",
            { className: "dshap-radio-group" },
            [
              { key: "auto", title: tr("modeAuto"), desc: tr("modeAutoDesc") },
              { key: "primary-backup", title: tr("modePrimary"), desc: tr("modePrimaryDesc") },
              { key: "manual", title: tr("modeManual"), desc: tr("modeManualDesc") },
            ].map((item) =>
              React.createElement(
                "div",
                {
                  key: item.key,
                  className: `dshap-radio-item ${poolStatus.schedulingMode === item.key ? "active" : ""}`,
                  onClick: () => updateConfig({ schedulingMode: item.key }),
                },
                React.createElement("input", {
                  type: "radio",
                  name: "dshap_mode",
                  checked: poolStatus.schedulingMode === item.key,
                  onChange: () => updateConfig({ schedulingMode: item.key }),
                  style: { marginTop: "3px" },
                }),
                React.createElement(
                  "div",
                  null,
                  React.createElement("div", { className: "dshap-radio-label" }, item.title),
                  React.createElement("div", { className: "dshap-radio-desc" }, item.desc),
                ),
              ),
            ),
          ),
        ),

        // 2. Default Image Generation Card
        React.createElement(
          "div",
          { className: "dshap-card" },
          React.createElement("div", { className: "dshap-card-title" }, `🎨 ${tr("imageConfigTitle")}`),
          React.createElement("div", { className: "dshap-card-desc" }, tr("imageConfigDesc")),
          React.createElement(
            "div",
            { className: "dshap-input-row" },
            React.createElement(
              "div",
              { className: "dshap-input-group" },
              React.createElement("label", { className: "dshap-input-label" }, tr("imageModelLabel")),
              React.createElement(
                "select",
                {
                  className: "dshap-input",
                  value: poolStatus.defaultImageModel || "gemini-3.1-flash-image",
                  onChange: (e) => updateConfig({ defaultImageModel: e.target.value }),
                },
                React.createElement("option", { value: "gemini-3.1-flash-image" }, "Gemini 3.1 Flash Image (Nano Banana 2)"),
              ),
            ),
            React.createElement(
              "div",
              { className: "dshap-input-group" },
              React.createElement("label", { className: "dshap-input-label" }, tr("imageOutputDirLabel")),
              React.createElement("input", {
                type: "text",
                className: "dshap-input",
                value: poolStatus.imageOutputDir || "./assets/images",
                onChange: (e) => updateConfig({ imageOutputDir: e.target.value }),
                placeholder: "./assets/images",
              }),
            ),
          ),
        ),

        // 3. Google Accounts Pool Card
        React.createElement(
          "div",
          { className: "dshap-card" },
          React.createElement(
            "div",
            { className: "dshap-accounts-head" },
            React.createElement("div", { className: "dshap-card-title", style: { margin: 0 } }, `👥 ${tr("accountsTitle")}`),
            React.createElement(
              "button",
              {
                className: "dshap-btn",
                onClick: refreshAllQuotas,
                disabled: busy,
              },
              busy ? tr("refreshing") : tr("refreshAllQuotas"),
            ),
          ),

          // Add Account Button
          React.createElement(
            "button",
            {
              className: "dshap-btn-add",
              onClick: startLogin,
              disabled: busy,
            },
            busy ? tr("loggingIn") : tr("addAccount"),
          ),

          // Accounts list
          accounts.length === 0
            ? React.createElement(
                "div",
                { style: { padding: "20px", textAlign: "center", color: "#6b7280", fontSize: "13px" } },
                tr("noAccountsDesc"),
              )
            : accounts.map((account) => {
                const isPrimary = Boolean(account.isPrimary);
                const isManualSelected = poolStatus.activeAccountId === account.id;
                const isCooling = Boolean(account.inCooldown);

                return React.createElement(
                  "div",
                  {
                    key: account.id,
                    className: `dshap-account-card ${isPrimary ? "primary" : ""} ${isCooling ? "cooldown" : ""}`,
                  },
                  // Card Header
                  React.createElement(
                    "div",
                    { className: "dshap-acc-head" },
                    React.createElement(
                      "div",
                      { className: "dshap-acc-left" },
                      React.createElement("span", { className: "dshap-email" }, account.email),
                      React.createElement("span", { className: "dshap-tag dshap-tag-pro" }, account.planLabel || "PRO"),
                      isPrimary
                        ? React.createElement("span", { className: "dshap-tag dshap-tag-primary" }, tr("primaryTag"))
                        : React.createElement("span", { className: "dshap-tag dshap-tag-backup" }, tr("backupTag")),
                      isManualSelected && poolStatus.schedulingMode === "manual"
                        ? React.createElement("span", { className: "dshap-tag dshap-tag-primary" }, "CURRENT")
                        : null,
                    ),
                    React.createElement(
                      "div",
                      { className: `dshap-status ${isCooling ? "cooldown" : ""}` },
                      React.createElement("div", { className: `dshap-dot ${isCooling ? "cooldown" : ""}` }),
                      isCooling
                        ? `${tr("inCooldown")} (${Math.round((account.cooldownRemainingMs || 0) / 1000)}s)`
                        : tr("online"),
                    ),
                  ),

                  // Quotas for this account
                  React.createElement(QuotaCardRows, { quota: account.quota, tr }),

                  // Card actions
                  React.createElement(
                    "div",
                    { className: "dshap-acc-actions" },
                    !isPrimary
                      ? React.createElement(
                          "button",
                          { className: "dshap-btn", onClick: () => setPrimary(account.id) },
                          tr("setPrimary"),
                        )
                      : null,
                    poolStatus.schedulingMode === "manual" && !isManualSelected
                      ? React.createElement(
                          "button",
                          { className: "dshap-btn", onClick: () => updateConfig({ activeAccountId: account.id }) },
                          tr("setManualActive"),
                        )
                      : null,
                    React.createElement(
                      "button",
                      { className: "dshap-btn", onClick: () => removeAccount(account.id) },
                      tr("logout"),
                    ),
                  ),
                );
              }),
        ),

        // 4. Model Selector Card
        React.createElement(
          "div",
          { className: "dshap-card" },
          React.createElement(
            "div",
            { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" } },
            React.createElement("div", { className: "dshap-card-title", style: { margin: 0 } }, tr("modelSelector")),
            React.createElement(
              "div",
              { style: { display: "flex", gap: "10px", fontSize: "12px" } },
              React.createElement("a", { style: { color: "#2563eb", cursor: "pointer" }, onClick: () => setAllModels(true) }, tr("selectAll")),
              React.createElement("a", { style: { color: "#2563eb", cursor: "pointer" }, onClick: () => setAllModels(false) }, tr("unselectAll")),
            ),
          ),
          React.createElement("div", { className: "dshap-card-desc" }, tr("modelSelectorDesc")),

          React.createElement(
            "div",
            { className: "dshap-model-list" },
            (modelConfig.options || []).map((model) => {
              const isChecked = (modelConfig.enabledModelIds || []).includes(model.id);
              const isImage = model.id.includes("image");
              const isTiered = model.id.includes("tiered");

              return React.createElement(
                "div",
                {
                  key: model.id,
                  className: "dshap-model-row",
                  onClick: () => toggleModel(model.id, !isChecked),
                },
                React.createElement("input", {
                  type: "checkbox",
                  checked: isChecked,
                  onChange: () => toggleModel(model.id, !isChecked),
                  style: { marginTop: "3px" },
                }),
                React.createElement(
                  "div",
                  { style: { flex: 1, minWidth: 0 } },
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "6px" } },
                    React.createElement("span", { style: { fontSize: "13px", fontWeight: 700, color: "#111827" } }, model.name || model.id),
                    isImage ? React.createElement("span", { className: "dshap-badge-image" }, tr("imageGenBadge")) : null,
                    isTiered ? React.createElement("span", { className: "dshap-badge-think" }, tr("reasoningBadge")) : null,
                  ),
                  React.createElement(
                    "div",
                    { style: { fontSize: "12px", color: "#6b7280", marginTop: "2px" } },
                    `${model.id} · ${model.remainingPercent !== undefined ? tr("quotaLabel", { percent: model.remainingPercent }) : ""}`,
                  ),
                ),
              );
            }),
          ),
        ),
      );
    }

    function patchNavIcon() {
      const spans = document.querySelectorAll("span");
      for (const span of spans) {
        if (span.textContent && span.textContent.trim() === "Antigravity") {
          const btn = span.closest("button");
          if (btn) {
            const svg = btn.querySelector("svg");
            if (svg) {
              svg.setAttribute("viewBox", "0 0 110 113");
              svg.setAttribute("width", "16");
              svg.setAttribute("height", "16");
              svg.setAttribute("fill", "none");
              const path = svg.querySelector("path");
              if (!path || path.getAttribute("d") !== ANTIGRAVITY_SVG_PATH) {
                svg.innerHTML = `<path d="${ANTIGRAVITY_SVG_PATH}" fill="currentColor"/>`;
              }
            }
          }
        }
      }
    }

    function initNavObserver() {
      patchNavIcon();
      if (window.__antigravityNavObserver) return;
      const observer = new MutationObserver(() => {
        patchNavIcon();
      });
      observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
      window.addEventListener("click", patchNavIcon, true);
      window.setInterval(patchNavIcon, 300);
      window.__antigravityNavObserver = observer;
    }

    return {
      inject: ["slots", "locale"],
      apply(ctx) {
        installStyle();
        initNavObserver();
        if (ctx.locale && typeof ctx.locale.register === "function") {
          ctx.locale.register(NS, { zh, en });
        }
        ctx.slots.inject("settings.section", () => ctx.slots.register({
          name: "settings.section",
          id: "antigravity",
          order: 12,
          label: () => "Antigravity",
        }, (props) => React.createElement(AntigravitySettingsPage, { ...props, ctx })));
      },
    };
  },
});
