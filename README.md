# 学习 Claude Code

一个用于在 Claude Code 中学习 Claude Code 的交互式课程。

Claude 会以对话方式教学，一步步带你了解概念和实践练习。

## 快速开始

1. 首先，如果你还没有安装 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)，请安装：

```bash
npm install -g @anthropic-ai/claude-code
```

2. 克隆这个仓库：

```bash
git clone https://github.com/delbaoliveira/learn-claude-code
cd learn-claude-code
```

3. 启动 Claude 会话：

```bash
claude
```

4. 然后输入 `/course` 开始课程。

---

## 你将构建什么

在整个课程中，你将构建 **地下城与智能体** —— 一个在你的浏览器中运行的文字冒险游戏。

```
╔═══════════════════════════════════════════╗
║            地下城 与  智能体            ║
╚═══════════════════════════════════════════╝

你站在一个黑暗洞穴的入口。
一股冷风吹过。

> 向北走
```

每节课教授一个 Claude Code 概念，然后让你在项目中应用它。到第 10 课时，你将拥有一个完整的游戏，包含房间、物品、战斗系统，以及对 Claude Code 的基础理解。

启动游戏服务器：

```bash
node dungeon/server.js
```

然后在浏览器中打开 http://localhost:3000。

---

## 课程结构

**介绍**

0. 欢迎

**第 1 部分：入门**

1. 你的第一次会话
2. 命令行导航
3. 管理上下文
4. 模式

**第 2 部分：项目上下文**

5. CLAUDE.md
6. 编写规则
7. 提示词技巧
8. 创建技能

**第 3 部分：智能体**

9. 子智能体
10. 应用智能体

---

## 目录结构

```
learn-claude-code/
├── learn-claude/               # 11 节课
├── dungeon/                    # 你的工作区
│   ├── server.js               # 游戏服务器
│   ├── index.html              # 终端风格界面
│   ├── game.js                 # 游戏引擎（由你构建！）
│   ├── data/                   # 游戏数据（房间、物品、敌人）
│   └── course-progress.json    # 你的保存进度
├── reference/
│   ├── starter/                # 起始状态（用于 /course reset）
│   └── complete/               # 完整参考实现
├── .claude/
│   └── skills/
│       ├── course/             # 交互式课程运行器
│       └── dungeon/            # 游戏构建技能（第 09 课）
└── README.md
```

## 课程命令

| 命令               | 描述                         |
| ------------------ | ---------------------------- |
| `/course`          | 显示进度仪表板               |
| `/course next`     | 继续下一课                   |
| `/course progress` | 查看详细统计                 |
| `/course exit`     | 暂停并保存位置               |
| `/course reset`    | 重新开始                     |
| `/course update`   | 更新到最新版本               |

---

## 给贡献者

### 根据官方文档审查课程

```
/review-lesson 03
```

### 生成新课程

```
/lesson "主题名称"
```
