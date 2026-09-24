/**
 * Multi-account pool manager for Google Antigravity / Cloud Code Assist.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { randomBytes } from "node:crypto";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";

export function accountsPoolPath() {
  return dshHomePath("storages", "antigravity-pool-accounts.json");
}

export function legacyCredentialPath() {
  return dshHomePath("storages", "antigravity-oauth.json");
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export class AccountPoolManager {
  #file;
  #legacyFile;
  #chain = Promise.resolve();
  #accounts = [];
  #schedulingMode = "auto"; // "auto" | "primary-backup" | "manual"
  #activeAccountId = null;
  #defaultImageModel = "gemini-3.1-flash-image";
  #imageOutputDir = "./assets/images";
  #initialized = false;

  constructor(file = accountsPoolPath(), legacyFile = legacyCredentialPath()) {
    this.#file = file;
    this.#legacyFile = legacyFile;
  }

  async init() {
    if (this.#initialized) return;
    await this.#load();
    this.#initialized = true;
  }

  async #load() {
    try {
      if (existsSync(this.#file)) {
        const raw = JSON.parse(await readFile(this.#file, "utf8"));
        if (isRecord(raw)) {
          this.#schedulingMode = raw.schedulingMode || "auto";
          this.#activeAccountId = raw.activeAccountId || null;
          this.#defaultImageModel = raw.defaultImageModel || "gemini-3.1-flash-image";
          this.#imageOutputDir = raw.imageOutputDir || "./assets/images";
          this.#accounts = Array.isArray(raw.accounts) ? raw.accounts : [];
          return;
        }
      }
    } catch (err) {
      console.error("[Antigravity Pool] Error loading accounts pool:", err);
    }

    // Migration fallback: import legacy antigravity-oauth.json if pool is empty
    if (this.#accounts.length === 0 && existsSync(this.#legacyFile)) {
      try {
        const legacy = JSON.parse(await readFile(this.#legacyFile, "utf8"));
        if (isRecord(legacy) && legacy.refresh) {
          const legacyAccount = {
            id: "acc_" + Date.now().toString(36),
            email: legacy.email || "primary@gmail.com",
            planLabel: "PRO",
            refresh: legacy.refresh,
            access: legacy.access || "",
            expires: typeof legacy.expires === "number" ? legacy.expires : 0,
            projectId: legacy.projectId || "",
            isPrimary: true,
            cooldownUntil: 0,
            lastError: null,
            quota: null,
            createdAt: Date.now(),
          };
          this.#accounts = [legacyAccount];
          this.#activeAccountId = legacyAccount.id;
          await this.#save();
          console.log("[Antigravity Pool] Migrated legacy credentials to Account 1:", legacyAccount.email);
        }
      } catch (err) {
        console.error("[Antigravity Pool] Error migrating legacy credentials:", err);
      }
    }
  }

  async #save() {
    await mkdir(dirname(this.#file), { recursive: true });
    const payload = {
      schedulingMode: this.#schedulingMode,
      activeAccountId: this.#activeAccountId,
      defaultImageModel: this.#defaultImageModel,
      imageOutputDir: this.#imageOutputDir,
      updatedAt: Date.now(),
      accounts: this.#accounts,
    };
    const tempFile = `${this.#file}.tmp`;
    await writeFile(tempFile, JSON.stringify(payload, null, 2), { mode: 0o600 });
    await rename(tempFile, this.#file);
  }

  async getStatus() {
    await this.init();
    return {
      schedulingMode: this.#schedulingMode,
      activeAccountId: this.#activeAccountId,
      defaultImageModel: this.#defaultImageModel,
      imageOutputDir: this.#imageOutputDir,
      accounts: this.#accounts.map((acc) => ({
        id: acc.id,
        email: acc.email,
        planLabel: acc.planLabel || "PRO",
        isPrimary: Boolean(acc.isPrimary),
        inCooldown: (acc.cooldownUntil || 0) > Date.now(),
        cooldownRemainingMs: Math.max(0, (acc.cooldownUntil || 0) - Date.now()),
        lastError: acc.lastError || null,
        quota: acc.quota || null,
      })),
    };
  }

  async addOrUpdateAccount(credentials) {
    await this.init();
    return this.#modify(async () => {
      const email = credentials.email || "unknown@gmail.com";
      const existing = this.#accounts.find((a) => a.email === email || (credentials.id && a.id === credentials.id));
      if (existing) {
        existing.refresh = credentials.refresh || existing.refresh;
        existing.access = credentials.access || existing.access;
        existing.expires = credentials.expires || existing.expires;
        existing.projectId = credentials.projectId || existing.projectId;
        existing.planLabel = credentials.planLabel || existing.planLabel || "PRO";
        existing.lastError = null;
        existing.cooldownUntil = 0;
        existing.updatedAt = Date.now();
        console.log("[Antigravity Pool] Updated account tokens:", email);
      } else {
        const isFirst = this.#accounts.length === 0;
        const newAcc = {
          id: "acc_" + Date.now().toString(36) + "_" + randomBytes(2).toString("hex"),
          email,
          planLabel: credentials.planLabel || "PRO",
          refresh: credentials.refresh,
          access: credentials.access,
          expires: credentials.expires,
          projectId: credentials.projectId,
          isPrimary: isFirst,
          cooldownUntil: 0,
          lastError: null,
          quota: null,
          createdAt: Date.now(),
        };
        this.#accounts.push(newAcc);
        if (isFirst || !this.#activeAccountId) {
          this.#activeAccountId = newAcc.id;
        }
        console.log("[Antigravity Pool] Added new account:", email);
      }
      await this.#save();
    });
  }

  async removeAccount(id) {
    await this.init();
    return this.#modify(async () => {
      const idx = this.#accounts.findIndex((a) => a.id === id);
      if (idx !== -1) {
        const wasPrimary = this.#accounts[idx].isPrimary;
        this.#accounts.splice(idx, 1);
        if (wasPrimary && this.#accounts.length > 0) {
          this.#accounts[0].isPrimary = true;
        }
        if (this.#activeAccountId === id) {
          this.#activeAccountId = this.#accounts[0]?.id || null;
        }
        await this.#save();
      }
    });
  }

  async setPrimaryAccount(id) {
    await this.init();
    return this.#modify(async () => {
      for (const acc of this.#accounts) {
        acc.isPrimary = acc.id === id;
      }
      this.#activeAccountId = id;
      await this.#save();
    });
  }

  async updateConfig(config) {
    await this.init();
    return this.#modify(async () => {
      if (typeof config.schedulingMode === "string") {
        this.#schedulingMode = config.schedulingMode;
      }
      if (typeof config.activeAccountId === "string") {
        this.#activeAccountId = config.activeAccountId;
      }
      if (typeof config.defaultImageModel === "string") {
        this.#defaultImageModel = config.defaultImageModel;
      }
      if (typeof config.imageOutputDir === "string") {
        this.#imageOutputDir = config.imageOutputDir;
      }
      await this.#save();
    });
  }

  async updateAccountQuota(id, quota, planLabel) {
    await this.init();
    const acc = this.#accounts.find((a) => a.id === id);
    if (acc) {
      acc.quota = quota;
      if (planLabel) acc.planLabel = planLabel;
      await this.#save();
    }
  }

  markCooldown(id, durationMs = 60000, reason = "") {
    const acc = this.#accounts.find((a) => a.id === id);
    if (acc) {
      acc.cooldownUntil = Date.now() + durationMs;
      acc.lastError = reason || "Rate limited (429)";
      console.warn(`[Antigravity Pool] Account ${acc.email} entered cooldown for ${Math.round(durationMs / 1000)}s: ${reason}`);
      void this.#save();
    }
  }

  clearCooldown(id) {
    const acc = this.#accounts.find((a) => a.id === id);
    if (acc) {
      acc.cooldownUntil = 0;
      acc.lastError = null;
      void this.#save();
    }
  }

  /**
   * Return candidate accounts ordered by selection priority for model category.
   * category: "gemini" | "claude"
   */
  async getCandidateAccounts(category = "gemini") {
    await this.init();
    if (this.#accounts.length === 0) return [];

    const now = Date.now();
    const available = this.#accounts.filter((a) => (a.cooldownUntil || 0) <= now);
    const inCooldown = this.#accounts.filter((a) => (a.cooldownUntil || 0) > now)
      .sort((a, b) => (a.cooldownUntil || 0) - (b.cooldownUntil || 0));

    if (this.#schedulingMode === "manual") {
      const active = this.#accounts.find((a) => a.id === this.#activeAccountId) ||
        this.#accounts.find((a) => a.isPrimary) ||
        this.#accounts[0];
      const others = this.#accounts.filter((a) => a.id !== active.id);
      return [active, ...others];
    }

    if (this.#schedulingMode === "primary-backup") {
      const primary = this.#accounts.find((a) => a.isPrimary) || this.#accounts[0];
      const backups = this.#accounts.filter((a) => a.id !== primary.id);
      if (available.some((a) => a.id === primary.id)) {
        return [primary, ...backups.filter((b) => available.includes(b)), ...inCooldown];
      }
      return [...backups.filter((b) => available.includes(b)), primary, ...inCooldown];
    }

    // "auto": Smart balancing based on highest remaining quota fraction
    const quotaFraction = (acc) => {
      const group = acc.quota?.groups?.find((g) =>
        category === "claude" ? /claude|gpt/i.test(g.name) : /gemini/i.test(g.name)
      );
      if (!group) return 1.0;
      const fiveHour = group.limits?.find((l) => /five|5.*hour/i.test(l.label));
      if (fiveHour && typeof fiveHour.remainingFraction === "number") {
        return fiveHour.remainingFraction;
      }
      const weekly = group.limits?.find((l) => /week/i.test(l.label));
      if (weekly && typeof weekly.remainingFraction === "number") {
        return weekly.remainingFraction;
      }
      return 1.0;
    };

    const sortedAvailable = [...available].sort((a, b) => quotaFraction(b) - quotaFraction(a));
    return [...sortedAvailable, ...inCooldown];
  }

  get defaultImageModel() {
    return this.#defaultImageModel;
  }

  get imageOutputDir() {
    return this.#imageOutputDir;
  }

  get allAccounts() {
    return this.#accounts;
  }

  #modify(fn) {
    const next = (async () => {
      await this.#chain.catch(() => {});
      await fn();
    })();
    this.#chain = next.catch(() => {});
    return next;
  }
}
