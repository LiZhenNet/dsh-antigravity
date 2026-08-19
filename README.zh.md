# dsh-antigravity

<p align="center">
  <img src="./assets/images/chat-model-picker.png" alt="dsh-antigravity" width="100%" />
</p>

[English](./README.md) | 简体中文

适用于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 Google Antigravity / Cloud Code Assist 模型提供商插件。

这是一个 DSH Web 插件。它在 provider 路由 `antigravity` 下注册 DSH `LlmAdapter`，OAuth 凭证存储于 DSH home 目录下，直接与 Cloud Code Assist 流式 API 通信。

> 非官方集成。本项目与 Google 无关，亦未获得 Google 认可。请仅在您有权访问的账号和服务中使用。

---

## 安装到 DSH Web

### 方式一：直接从 GitHub 安装

```sh
dsh plugin --profile web add github:LiZhenNet/dsh-antigravity
```

### 方式二：通过本地 Release 包安装

```sh
npm run pack:dist
dsh plugin --profile web add ./dist/dsh-antigravity-0.0.4.tgz
```

该 package 声明了 DSH bundle patch，安装后会自动挂载 host 插件与浏览器设置页面。

如果您的 DSH 版本暂不支持 `dsh plugin add`，可手动复制到 Web profile：

```sh
cp -R dsh-antigravity "$DSH_HOME/profiles/web/node_modules/"
```

然后在 profile 的 `cordis.patch.yml` 中添加该插件：

```yaml
- insert:
    - id: llm-antigravity
      name: dsh-antigravity
```

重启 DSH：

```sh
dsh web
```

---

## 登录与授权

打开 **设置（Settings）> Antigravity** 并点击 **登录（Login）**。设置页面将发起 Google OAuth 授权流程，并在登录完成后自动刷新配额（Quota）。

![Antigravity Settings - 未登录](./assets/images/settings-not-signed-in.png)

登录成功后，设置页面将展示账号信息、按模型分组的实时配额进度条、重置倒计时以及模型选择器：

- **Gemini Models** —— Gemini Flash / Pro 变体共享同一个配额池（绿色进度条）。
- **Claude and GPT models** —— Claude Opus、Claude Sonnet 与 GPT-OSS 共享独立的 3P 配额池（青色进度条）。

每个分组均展示 **5 小时限额**（平滑短期突发用量）与 **每周限额**（绑定至订阅级别，如 Google AI Pro），并配有实时重置倒计时。

![Antigravity Settings - 已登录](./assets/images/settings-signed-in.png)

插件会在本地启动一个 loopback OAuth 回调服务（`http://localhost:51121/oauth-callback`）。如果 Web 服务无法自动唤起浏览器，可在同机器终端运行命令行登录助手：

```sh
node "$DSH_HOME/profiles/web/node_modules/dsh-antigravity/bin/antigravity-login.mjs"
```

凭证存储路径：

```text
$DSH_HOME/storages/antigravity-oauth.json
```

> 请妥善保管该文件，其中包含 access token 与 refresh token。

---

## 模型列表

登录后，在 DSH 模型选择器中选择 **Antigravity** 提供商。您可以在 **设置 > Antigravity** 的模型选择器中按需勾选或关闭单个模型（已勾选的模型将自动置顶展示），每个模型副标题均会显示其实时可用额度百分比。

支持注册的模型 ID：

| 模型 ID | 名称 | 额度池 |
|---|---|---|
| `gemini-3.7-flash` | Gemini 3.7 Flash | Gemini |
| `gemini-3.6-flash` | Gemini 3.6 Flash | Gemini |
| `gemini-3.5-flash` | Gemini 3.5 Flash | Gemini |
| `gemini-3.1-pro` | Gemini 3.1 Pro | Gemini |
| `gemini-3.1-flash-image` | Gemini 3.1 Flash Image | Gemini |
| `gemini-3-flash` | Gemini 3 Flash | Gemini |
| `gemini-2.5-pro` | Gemini 2.5 Pro | Gemini |
| `gemini-2.5-flash` | Gemini 2.5 Flash | Gemini |
| `claude-opus-4-6` | Claude Opus 4.6 | Claude & GPT (3P) |
| `claude-sonnet-4-6` | Claude Sonnet 4.6 | Claude & GPT (3P) |
| `gpt-oss-120b` | GPT-OSS 120B | Claude & GPT (3P) |

同一额度池内的模型共享 5 小时与每周额度。额度按 Token 成本比例扣除，因此较重的大模型（如 Claude Opus）消耗额度速度会快于轻量模型。

插件会在可用时通过实时的 `fetchAvailableModels` 目录将这些公开 ID 解析为内部运行时模型 ID，并自带静态路由兜底。

---

## 许可证

[MIT](./LICENSE)
