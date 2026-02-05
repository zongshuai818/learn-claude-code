═══════════════════════════════════════════════════════════════════
第 10 课：应用智能体
═══════════════════════════════════════════════════════════════════

你使用 Claude 子智能体创建了新的游戏角色。角色存在，但他们的回复是静态的。

现在让我们让它们使用 AI 动态回复用户。

对于本课，你需要拥有 Anthropic API 密钥，这需要至少 5 美元的积分。本课中的提示词还将安装 Anthropic SDK。如果你希望跳过，只需输入 `/course complete`。

## 区别

- **Claude 子智能体** —— 帮助你编写代码
- **应用智能体** —— 在应用中运行并与玩家互动。

## 安全提示

小心你的 API 密钥。它不应该被提交、暴露给浏览器或与任何人共享。

## 试试看

1. 要求 Claude 创建 `.env` 文件：

   > 在 dungeon 目录中创建一个带有我的 API 密钥的 `.env` 文件。文件应包含：
   >
   > ```
   > ANTHROPIC_API_KEY=sk-ant-xxxxx
   > ```
   >
   > 将 .env 文件添加到 .gitignore。

2. 从 https://console.anthropic.com/settings/keys 获取你的 API 密钥，并将 `sk-ant-xxxxx` 替换为你的实际 API 密钥。

3. 在计划模式下，要求 Claude 添加 API 集成：

   > 添加 Claude API 集成，使 NPC 动态回复：
   >
   > - 安装 Anthropic SDK 和 dotenv
   > - 在 server.js 中创建 POST /api/talk 端点
   > - 从环境使用 ANTHROPIC_API_KEY
   > - 它应该接收 { character, message } 并返回 AI 回复
   > - 角色的个性和知识应该塑造回复
   > - 在对话模式下，玩家直接输入消息（不需要前缀）
   > - 输入 "leave" 或移动到另一个房间会退出对话模式

4. 重启服务器：

   ```bash
   node dungeon/server.js
   ```

5. 在游戏中测试它（使用方向键或输入命令）：

   ```
   ↑（或 go up）
   ↑（或 go up）
   talk
   你对地精了解什么？
   告诉我关于你自己的事
   leave
   ```

NPC 现在应该动态回复，使用他们的个性和知识。他们不仅仅是数据 —— 他们是智能体。

## 你做到了！

你已经到达课程结尾。

准备好后，运行：

```
/course complete
```
