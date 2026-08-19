window.__ModuleLoader__.load({
  id: "dsh-antigravity",
  factory(require) {
    const React = require("react");
    const { useCallback, useEffect, useMemo, useRef, useState } = React;

    const STYLE_ID = "dsh-antigravity-settings-style";
    const API = "/antigravity/api";
    const ANTIGRAVITY_SVG_PATH =
      "M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z";

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

    function installStyle() {
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
.dsha-wrap{box-sizing:border-box;width:100%;max-width:760px;padding:0 0 24px;color:#111827}
.dsha-page-head{display:flex;align-items:center;gap:10px}
.dsha-brand-icon{color:#111827;flex-shrink:0}
.dsha-page-title{margin:0;color:#111827;font-size:20px;font-weight:700;line-height:28px}
.dsha-page-desc{margin:8px 0 18px;color:#8b93a1;font-size:13px;line-height:20px}
.dsha-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;box-shadow:none}
.dsha-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.dsha-title{display:flex;align-items:center;gap:9px;font-size:15px;font-weight:700;color:#111827}
.dsha-ok{width:18px;height:18px;border-radius:999px;border:2px solid #10b981;position:relative;flex:0 0 auto}
.dsha-ok:after{content:"";position:absolute;left:4px;top:2px;width:6px;height:9px;border:solid #10b981;border-width:0 2px 2px 0;transform:rotate(45deg)}
.dsha-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.dsha-btn{border:1px solid #d7dce3;background:#fff;color:#111827;border-radius:10px;padding:7px 12px;font-size:13px;line-height:18px;cursor:pointer}
.dsha-btn:hover{background:#f7f8fa}
.dsha-btn:disabled{cursor:not-allowed;opacity:.55}
.dsha-btn-primary{border-color:#111827;background:#111827;color:white}
.dsha-btn-primary:hover{background:#272d38}
.dsha-account{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;padding:12px;border:1px solid #eef1f5;border-radius:10px;background:#fafbfc;color:#4b5563}
.dsha-email{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:650;min-width:0}
.dsha-email-mark{width:16px;height:12px;border:1.8px solid #7f8a9a;border-radius:3px;position:relative;flex:0 0 auto}
.dsha-email-mark:before{content:"";position:absolute;left:1px;right:1px;top:1px;height:7px;border-bottom:1.8px solid #7f8a9a;transform:skewY(-28deg)}
.dsha-email-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsha-badge{display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:#eef2ff;color:#3f46d8;border:1px solid #dfe5ff;padding:4px 9px;font-size:12px;font-weight:800;letter-spacing:.02em}
.dsha-diamond{width:8px;height:8px;border-radius:2px;background:#4f5bf6;transform:rotate(45deg)}
.dsha-quota-title{margin:16px 0 6px;color:#111827;font-size:14px;font-weight:700}
.dsha-quota-group{margin-top:10px;padding:12px 14px;background:#fafbfc;border:1px solid #eef1f5;border-radius:10px}
.dsha-group-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap}
.dsha-group-title{font-size:13px;font-weight:700;color:#111827}
.dsha-group-desc{font-size:12px;color:#8b93a1}
.dsha-row{padding:8px 0;border-top:1px solid #edf1f5}
.dsha-row:first-of-type{border-top:0;padding-top:0}
.dsha-rowtop{display:flex;align-items:baseline;justify-content:space-between;gap:12px;color:#4b5563;font-weight:600;font-size:13px}
.dsha-metrics{display:flex;align-items:baseline;gap:10px;white-space:nowrap;color:#8b93a1;font-size:12px}
.dsha-percent{font-size:13px;font-weight:750;color:#059669}
.dsha-percent-cyan{color:#0284c7}
.dsha-bar{height:6px;margin-top:6px;border-radius:999px;background:#edf1f5;overflow:hidden}
.dsha-fill{height:100%;border-radius:999px;background:#10b981}
.dsha-fill-cyan{background:#06b6d4}
.dsha-empty{border:1px dashed #d8dee8;border-radius:10px;padding:14px;color:#747f90;background:#fafbfc;font-size:13px;line-height:20px}
.dsha-error{margin-top:12px;color:#991b1b;background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:10px 12px;font-size:13px;white-space:pre-wrap}
.dsha-note{margin-top:12px;color:#8b93a1;font-size:12px;line-height:18px}
.dsha-model-card{margin-top:14px}
.dsha-model-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}
.dsha-model-title{font-size:14px;font-weight:700;color:#111827}
.dsha-model-desc{margin-top:3px;color:#8b93a1;font-size:12px;line-height:18px}
.dsha-mini-actions{display:flex;gap:8px;white-space:nowrap}
.dsha-mini-btn{border:0;background:transparent;color:#4f5bf6;font-size:12px;line-height:18px;cursor:pointer;padding:0}
.dsha-mini-btn:hover{text-decoration:underline}
.dsha-model-list{border:1px solid #eef1f5;border-radius:10px;overflow:hidden}
.dsha-model-row{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;background:#fff;border-top:1px solid #eef1f5;cursor:pointer}
.dsha-model-row:hover{background:#fafbfc}
.dsha-model-row:first-child{border-top:0}
.dsha-check{margin-top:1px;width:16px;height:16px;accent-color:#111827;flex:0 0 auto}
.dsha-model-text{min-width:0;flex:1 1 auto}
.dsha-model-name{display:block;font-size:13px;font-weight:650;color:#111827;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsha-model-sub{display:block;margin-top:3px;color:#9aa3b0;font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
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

    function AntigravityIcon({ size = 20, className = "" }) {
      return React.createElement(
        "svg",
        {
          viewBox: "0 0 110 113",
          width: size,
          height: size,
          fill: "none",
          className,
          style: { flexShrink: 0, display: "inline-block", verticalAlign: "middle" },
          xmlns: "http://www.w3.org/2000/svg",
          "aria-hidden": "true",
        },
        React.createElement("path", {
          d: "M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z",
          fill: "currentColor",
        }),
      );
    }

    function extractModelVersion(model) {
      const name = String(model && model.name ? model.name : "");
      const id = String(model && model.id ? model.id : "");
      const idMatch = id.match(/(?:gemini|claude|gpt)[-_ ]*v?(\d+(?:\.\d+)*)/i)
        || id.match(/\b(\d+(?:\.\d+)+)\b/);
      if (idMatch) return idMatch[1].split(".").map((num) => parseInt(num, 10) || 0);

      const nameMatch = name.match(/(?:gemini|claude|gpt)[-_ ]*v?(\d+(?:\.\d+)*)/i)
        || name.match(/\b(\d+(?:\.\d+)+)\b/);
      if (nameMatch) return nameMatch[1].split(".").map((num) => parseInt(num, 10) || 0);

      return [0];
    }

    function compareVersionsDesc(v1, v2) {
      const len = Math.max(v1.length, v2.length);
      for (let i = 0; i < len; i++) {
        const num1 = v1[i] !== undefined ? v1[i] : 0;
        const num2 = v2[i] !== undefined ? v2[i] : 0;
        if (num1 !== num2) return num2 - num1;
      }
      return 0;
    }

    function getFamilyOrder(model) {
      const text = `${model && model.id ? model.id : ""} ${model && model.name ? model.name : ""}`.toLowerCase();
      if (text.includes("gemini")) return 1;
      if (text.includes("claude")) return 2;
      if (text.includes("gpt")) return 3;
      return 4;
    }

    function getVariantScore(model) {
      const text = `${model && model.name ? model.name : ""} ${model && model.id ? model.id : ""}`.toLowerCase();
      if (text.includes("ultra")) return 1;
      if (text.includes("pro") && !text.includes("lite")) return 2;
      if (text.includes("flash") && !text.includes("lite") && !text.includes("thinking") && !text.includes("image")) return 3;
      if (text.includes("flash") && text.includes("thinking") && !text.includes("lite")) return 4;
      if (text.includes("image")) return 5;
      if (text.includes("lite") && !text.includes("thinking")) return 6;
      if (text.includes("lite") && text.includes("thinking")) return 7;
      return 10;
    }

    function compareAntigravityModels(a, b) {
      const famA = getFamilyOrder(a);
      const famB = getFamilyOrder(b);
      if (famA !== famB) return famA - famB;

      const verA = extractModelVersion(a);
      const verB = extractModelVersion(b);
      const verComp = compareVersionsDesc(verA, verB);
      if (verComp !== 0) return verComp;

      const variantA = getVariantScore(a);
      const variantB = getVariantScore(b);
      if (variantA !== variantB) return variantA - variantB;

      return (a.name || a.id || "").localeCompare(b.name || b.id || "") || (a.id || "").localeCompare(b.id || "");
    }

    function formatReset(resetTime) {
      if (!resetTime) return "n/a";
      const timestamp = Date.parse(resetTime);
      if (!Number.isFinite(timestamp)) return resetTime;
      const delta = timestamp - Date.now();
      if (delta <= 0) return "now";
      const totalMinutes = Math.round(delta / 60000);
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }

    function resetText(row) {
      if (row && row.resetLabel) return `重置: ${row.resetLabel}`;
      if (row && row.resetTime) return `重置: ${formatReset(row.resetTime)}`;
      return "重置: n/a";
    }

    function percentOf(row) {
      if (typeof row.remainingPercent === "number") return row.remainingPercent;
      if (typeof row.remainingFraction === "number") return Math.round(row.remainingFraction * 1000) / 10;
      return 0;
    }

    function QuotaRow({ row, accent }) {
      const percent = percentOf(row);
      const width = Math.max(0, Math.min(100, percent));
      return React.createElement("div", { className: "dsha-row" },
        React.createElement("div", { className: "dsha-rowtop" },
          React.createElement("div", null, row.label || row.displayName || row.id || "Quota"),
          React.createElement("div", { className: "dsha-metrics" },
            React.createElement("span", null, resetText(row)),
            React.createElement("span", { className: `dsha-percent${accent === "cyan" ? " dsha-percent-cyan" : ""}` }, `${percent}%`),
          ),
        ),
        React.createElement("div", { className: "dsha-bar" },
          React.createElement("div", {
            className: `dsha-fill${accent === "cyan" ? " dsha-fill-cyan" : ""}`,
            style: { width: `${width}%` },
          }),
        ),
      );
    }

    function QuotaGroup({ group, accent }) {
      const buckets = Array.isArray(group && group.buckets) ? group.buckets : [];
      return React.createElement("div", { className: "dsha-quota-group" },
        React.createElement("div", { className: "dsha-group-head" },
          React.createElement("span", { className: "dsha-group-title" }, group.displayName || "Quota group"),
          group.description && React.createElement("span", { className: "dsha-group-desc" }, group.description),
        ),
        buckets.map((bucket, index) => React.createElement(QuotaRow, {
          key: bucket.id || bucket.bucketId || bucket.label || bucket.displayName || index,
          row: bucket,
          accent,
        })),
      );
    }

    function modelMeta(option) {
      const parts = [];
      if (Array.isArray(option.inputModalities) && option.inputModalities.includes("image")) parts.push("image");
      if (Array.isArray(option.reasoningEfforts) && option.reasoningEfforts.length) {
        parts.push(`thinking: ${option.reasoningEfforts.join("/")}`);
      }
      if (typeof option.remainingPercent === "number") {
        parts.push(`额度: ${option.remainingPercent}%`);
      }
      return parts.join(" · ");
    }

    function ModelOptionRow({ option, disabled, onToggle }) {
      return React.createElement("label", { className: "dsha-model-row" },
        React.createElement("input", {
          className: "dsha-check",
          type: "checkbox",
          checked: !!option.enabled,
          disabled,
          onChange: (event) => onToggle(option.id, event.target.checked),
        }),
        React.createElement("span", { className: "dsha-model-text" },
          React.createElement("span", { className: "dsha-model-name" }, option.name || option.id),
          React.createElement("span", { className: "dsha-model-sub" }, modelMeta(option) || option.id),
        ),
      );
    }

    function AntigravitySettings() {
      const [status, setStatus] = useState({ loading: true });
      const [quota, setQuota] = useState(undefined);
      const [modelConfig, setModelConfig] = useState(undefined);
      const [busy, setBusy] = useState(false);
      const [modelBusy, setModelBusy] = useState(false);
      const [error, setError] = useState("");
      const pollRef = useRef(undefined);

      const refreshStatus = useCallback(async () => {
        const value = await api("/status");
        setStatus({ loading: false, ...value });
        if (value.quota) setQuota(value.quota);
        if (value.models) setModelConfig(value.models);
        return value;
      }, []);

      const refreshQuota = useCallback(async () => {
        setBusy(true);
        setError("");
        try {
          const value = await api("/quota", { method: "POST" });
          setQuota(value);
          if (value.models) setModelConfig(value.models);
          await refreshStatus();
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setBusy(false);
        }
      }, [refreshStatus]);

      useEffect(() => {
        installStyle();
        initNavObserver();
        patchNavIcon();
        let cancelled = false;
        void refreshStatus()
          .then((value) => {
            if (!cancelled && value.authenticated) void refreshQuota();
          })
          .catch((err) => {
            if (!cancelled) {
              setStatus({ loading: false, authenticated: false });
              setError(err instanceof Error ? err.message : String(err));
            }
          });
        return () => {
          cancelled = true;
          if (pollRef.current !== undefined) window.clearInterval(pollRef.current);
        };
      }, [refreshQuota, refreshStatus]);

      const startLogin = useCallback(async () => {
        setBusy(true);
        setError("");
        try {
          const value = await api("/login", { method: "POST" });
          if (value.authUrl) window.open(value.authUrl, "_blank", "noopener,noreferrer");
          if (pollRef.current !== undefined) window.clearInterval(pollRef.current);
          pollRef.current = window.setInterval(async () => {
            try {
              const next = await refreshStatus();
              if (next.login && next.login.status === "complete") {
                window.clearInterval(pollRef.current);
                pollRef.current = undefined;
                await refreshQuota();
              }
              if (next.login && next.login.status === "error") {
                window.clearInterval(pollRef.current);
                pollRef.current = undefined;
                setError(next.login.error || "Login failed");
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : String(err));
            }
          }, 2000);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setBusy(false);
        }
      }, [refreshQuota, refreshStatus]);

      const logout = useCallback(async () => {
        setBusy(true);
        setError("");
        try {
          const value = await api("/logout", { method: "POST" });
          setStatus({ loading: false, ...value });
          setQuota(undefined);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setBusy(false);
        }
      }, []);

      const saveModels = useCallback(async (enabledModelIds) => {
        setModelBusy(true);
        setError("");
        try {
          const value = await api("/models", {
            method: "POST",
            body: JSON.stringify({ enabledModelIds }),
          });
          setModelConfig(value);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setModelBusy(false);
        }
      }, []);

      const toggleModel = useCallback((modelId, enabled) => {
        const current = new Set(modelConfig && Array.isArray(modelConfig.enabledModelIds) ? modelConfig.enabledModelIds : []);
        if (enabled) current.add(modelId);
        else current.delete(modelId);
        void saveModels([...current]);
      }, [modelConfig, saveModels]);

      const setAllModels = useCallback((enabled) => {
        const ids = enabled && modelConfig && Array.isArray(modelConfig.options)
          ? modelConfig.options.map((option) => option.id)
          : [];
        void saveModels(ids);
      }, [modelConfig, saveModels]);

      const quotaGroups = useMemo(() => {
        if (!quota) return [];
        if (Array.isArray(quota.groups) && quota.groups.length > 0) {
          return quota.groups;
        }
        if (Array.isArray(quota.bucketRows) && quota.bucketRows.length > 0) {
          const map = new Map();
          for (const b of quota.bucketRows) {
            const grp = b.group || "Quota";
            if (!map.has(grp)) map.set(grp, []);
            map.get(grp).push(b);
          }
          return [...map.entries()].map(([displayName, buckets]) => ({ displayName, buckets }));
        }
        return [];
      }, [quota]);

      const fallbackModelRows = useMemo(() => {
        if (quotaGroups.length > 0) return [];
        if (!quota || !Array.isArray(quota.modelRows)) return [];
        return quota.modelRows.filter((row) => typeof row.remainingFraction === "number");
      }, [quota, quotaGroups]);

      const modelOptions = useMemo(() => {
        const options = modelConfig && Array.isArray(modelConfig.options) ? modelConfig.options : [];
        return [...options].sort(compareAntigravityModels);
      }, [modelConfig]);
      const plan = quota && quota.planLabel ? quota.planLabel : "";
      const isPro = /pro|paid|plus/i.test(plan);
      const email = status.email || "Not signed in";

      return React.createElement("div", { className: "dsha-wrap" },
        React.createElement("div", { className: "dsha-page-head" },
          React.createElement(AntigravityIcon, { size: 24, className: "dsha-brand-icon" }),
          React.createElement("h2", { className: "dsha-page-title" }, "Antigravity"),
        ),
        React.createElement("p", { className: "dsha-page-desc" }, "登录 Google Antigravity / Cloud Code Assist，并查看当前账号的共享额度。"),
        React.createElement("section", { className: "dsha-card" },
          React.createElement("div", { className: "dsha-head" },
            React.createElement("div", { className: "dsha-title" },
              React.createElement(AntigravityIcon, { size: 18, className: "dsha-brand-icon" }),
              React.createElement("span", null, "当前账号"),
            ),
            React.createElement("div", { className: "dsha-actions" },
              !status.authenticated && React.createElement("button", { className: "dsha-btn dsha-btn-primary", disabled: busy, onClick: startLogin }, busy ? "登录中..." : "登录"),
              status.authenticated && React.createElement("button", { className: "dsha-btn dsha-btn-primary", disabled: busy, onClick: refreshQuota }, busy ? "刷新中..." : "刷新"),
              status.authenticated && React.createElement("button", { className: "dsha-btn", disabled: busy, onClick: logout }, "退出"),
            ),
          ),
          React.createElement("div", { className: "dsha-account" },
            React.createElement("div", { className: "dsha-email" },
              React.createElement("span", { className: "dsha-email-mark", "aria-hidden": "true" }),
              React.createElement("span", { className: "dsha-email-text" }, status.loading ? "Loading..." : email),
            ),
            isPro && React.createElement("span", { className: "dsha-badge" },
              React.createElement("span", { className: "dsha-diamond", "aria-hidden": "true" }),
              "PRO",
            ),
          ),
          !status.authenticated && React.createElement("div", { className: "dsha-empty" }, "点击右上角登录后，会在浏览器中完成 Google OAuth，登录成功后这里会显示 quota。"),
          status.authenticated && !quota && React.createElement("div", { className: "dsha-empty" }, busy ? "正在获取 quota..." : "暂无 quota 数据，点击刷新。"),
          status.authenticated && (quotaGroups.length > 0 || fallbackModelRows.length > 0) && React.createElement("div", { className: "dsha-quota-title" }, "额度"),
          status.authenticated && quotaGroups.map((group, index) => {
            const isCyan = /claude|gpt|3p|openai|anthropic/i.test(`${group.displayName || ""} ${group.description || ""}`);
            return React.createElement(QuotaGroup, {
              key: group.displayName || index,
              group,
              accent: isCyan ? "cyan" : "green",
            });
          }),
          status.authenticated && quotaGroups.length === 0 && fallbackModelRows.map((row, index) => {
            const isCyan = /claude|gpt|3p|openai|anthropic/i.test(`${row.id || ""} ${row.label || ""}`);
            return React.createElement(QuotaRow, {
              key: row.id || row.label || index,
              row,
              accent: isCyan ? "cyan" : "green",
            });
          }),
          error && React.createElement("div", { className: "dsha-error" }, error),
          quota && React.createElement("div", { className: "dsha-note" },
            `更新时间：${new Date(quota.fetchedAt).toLocaleString()}`,
          ),
        ),
        status.authenticated && React.createElement("section", { className: "dsha-card dsha-model-card" },
          React.createElement("div", { className: "dsha-model-head" },
            React.createElement("div", null,
              React.createElement("div", { className: "dsha-model-title" }, "模型选择器"),
              React.createElement("div", { className: "dsha-model-desc" }, "勾选后会出现在 DSH 的 Antigravity 模型列表中。"),
            ),
            React.createElement("div", { className: "dsha-mini-actions" },
              React.createElement("button", { className: "dsha-mini-btn", disabled: modelBusy, onClick: () => setAllModels(true) }, "全选"),
              React.createElement("button", { className: "dsha-mini-btn", disabled: modelBusy, onClick: () => setAllModels(false) }, "全不选"),
            ),
          ),
          modelOptions.length === 0
            ? React.createElement("div", { className: "dsha-empty" }, "正在加载模型配置...")
            : React.createElement("div", { className: "dsha-model-list" },
                modelOptions.map((option) => React.createElement(ModelOptionRow, {
                  key: option.id,
                  option,
                  disabled: modelBusy,
                  onToggle: toggleModel,
                })),
              ),
          React.createElement("div", { className: "dsha-note" }, "勾选即自动保存。重新打开模型选择器即可看到最新列表；运行中的旧会话不受影响。"),
        ),
      );
    }

    return {
      inject: ["slots"],
      apply(ctx) {
        installStyle();
        initNavObserver();
        ctx.slots.inject("settings.section", () => ctx.slots.register({
          name: "settings.section",
          id: "antigravity",
          order: 12,
          label: () => "Antigravity",
        }, AntigravitySettings));
      },
    };
  },
});
