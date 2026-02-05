# 游戏开发规则

在创建或修改游戏元素时，请始终保持这些元素同步。请参考下方的 **UI 组件参考** 部分了解组件名称和位置。

## 角色

在添加或修改角色时：

1. **数据文件**：添加到 `data/characters.json`
2. **肖像艺术**：如果不存在，在 `ui/portraits.js` 中创建像素艺术
3. **对话按钮**：通过操作区的 `updateTalkButton()` 启用
4. **肖像显示**：对话时通过 `showPortrait()` 显示角色
5. **终端输出**：在房间描述文本中提及角色

## 房间

在添加或修改房间时：

1. **数据文件**：添加到 `data/rooms.json`
2. **位置名称**：通过位置区的 `updateLocation()` 更新
3. **小地图**：在 `ui/ui.js` 中更新 `mapLayout` 网格
4. **地图可视化**：通过 `updateMap()` 同步
5. **终端输出**：通过 `print()` 显示房间描述
6. **出口**：确保房间出口与空间网格布局匹配

## 物品

在添加或修改物品时：

1. **数据文件**：添加到 `data/items.json`
2. **拾取按钮**：通过操作区的 `updateTakeButton()` 启用
3. **物品清单**：通过物品区的 `updateInventory()` 更新
4. **终端输出**：当物品存在时，在房间描述中提及
5. **小地图**：确保小地图继续正常工作

## 敌人

在添加或修改敌人时：

1. **数据文件**：添加到 `data/enemies.json`
2. **攻击按钮**：通过操作区的 `updateAttackButton()` 启用
3. **像素艺术**：如果不存在，在 `ui/portraits.js` 中创建
4. **终端输出**：当敌人存在时，在房间描述中提及

## 导航

- 键盘导航**仅**支持方向键
- **不要**添加 WASD (w/a/s/d) 键支持 —— 它会干扰文本输入
- 方向键：ArrowUp、ArrowDown、ArrowLeft、ArrowRight

## 参考实现

- `reference/complete/` 目录包含游戏的完整、成品版本
- 在实现功能时，请检查 reference/complete/game.js、reference/complete/ui/ui.js 和 reference/complete/data/ 作为参考
- 使用这些作为指导，确保你的实现符合预期的模式和结构

## 一般原则

当你添加任何游戏元素（角色、房间、物品、敌人）时，请更新：

1. 数据文件（JSON）
2. 显示/与之交互的 UI 元素
3. 任何视觉资源（像素艺术）（如适用）

---

## UI 组件参考

了解游戏的 UI 结构有助于添加功能。以下是完整的层次结构：

### 布局结构

**状态面板**（左侧边栏）

- **状态区**：HP 显示，带心形和文本（100/100）
- **位置区**：位置名称、小地图网格、地图图例
- **物品区**：携带物品的物品清单
- **操作区**：操作按钮网格，包含：
  - 查看按钮、物品按钮、帮助按钮（始终可见）
  - 拾取按钮（当存在物品时显示）
  - 对话按钮（当存在角色时显示）
  - 攻击按钮（当存在敌人时显示）

**主面板**（右侧）

- **肖像显示**：对话期间的角色肖像
- **终端输出**：游戏文本消息和房间描述
- **命令输入**：玩家命令的文本字段

### 代码参考

| 组件名称   | HTML/CSS 引用                        | 更新函数                           |
| ---------- | ------------------------------------ | ---------------------------------- |
| 状态面板   | `.status-panel`                      | N/A（容器）                        |
| HP 显示    | `.hp-display`, `#hp-bar`, `#hp-text` | `updateHpBar()`                    |
| 位置名称   | `#location-name`                     | `updateLocation()`                 |
| 小地图     | `#pixel-map`                         | `updateMap()`                      |
| 物品清单   | `#inventory-list`                    | `updateInventory()`                |
| 拾取按钮   | `#take-btn`                          | `updateTakeButton()`               |
| 对话按钮   | `#talk-btn`                          | `updateTalkButton()`               |
| 攻击按钮   | `#attack-btn`                        | `updateAttackButton()`             |
| 肖像显示   | `#portrait-container`                | `showPortrait()`, `hidePortrait()` |
| 终端输出   | `#output`                            | `print(text, className)`           |
| 命令输入   | `#command`                           | N/A（用户输入）                    |
