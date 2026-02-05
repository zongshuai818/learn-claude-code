// 地下城与智能体 - 游戏引擎
// 课程的入门骨架

// ============ 游戏状态 ============

let rooms = {}
let items = {}
let characters = {}
let enemies = {}
let inventory = []
let currentRoom = "cave-entrance"
let playerHp = 100
const maxHp = 100
let visitedRooms = new Set(["cave-entrance"])
let talkingTo = null
let talkingToId = null
let conversationState = {}
let storyFlags = new Set()

// ============ 数据加载 ============

async function loadRooms() {
  const response = await fetch("data/rooms.json")
  rooms = await response.json()
}

async function loadItems() {
  const response = await fetch("data/items.json")
  items = await response.json()
}

async function loadCharacters() {
  try {
    const response = await fetch("data/characters.json")
    characters = await response.json()
  } catch (e) {
    characters = {}
  }
}

async function loadEnemies() {
  try {
    const response = await fetch("data/enemies.json")
    enemies = await response.json()
  } catch (e) {
    enemies = {}
  }
}

// ============ 命令处理 ============

function processCommand(input) {
  const command = input.trim().toLowerCase()

  // 回显命令
  print(`> ${input}`, "command")

  // 如果在对话模式，将输入视为消息（除非是 leave/go）
  if (talkingTo) {
    if (command === "leave") {
      leaveConversation()
      return
    }
    if (command.startsWith("go ") || ["up", "down", "left", "right"].includes(command)) {
      leaveConversation()
      const direction = command.startsWith("go ") ? command.slice(3) : command
      goDirection(direction)
      return
    }
    // 视为对 NPC 的消息
    sayTo(input)
    return
  }

  // 基本命令
  if (command === "help") {
    print(
      "可用命令：help, look, go, take, inventory, attack, talk, leave",
    )
  } else if (command === "look") {
    const room = rooms[currentRoom]
    if (room) {
      print(room.description)

      // 显示房间中的物品
      const roomItems = Object.entries(items)
        .filter(([id, item]) => item.room === currentRoom)
        .map(([id, item]) => item.name)
      if (roomItems.length > 0) {
        print(`物品：${roomItems.join(", ")}`)
      }

      // 显示房间中的敌人
      const roomEnemies = Object.entries(enemies)
        .filter(([id, enemy]) => enemy.room === currentRoom && enemy.hp > 0)
        .map(([id, enemy]) => `${enemy.name} (${enemy.hp} 生命值)`)
      if (roomEnemies.length > 0) {
        print(`敌人：${roomEnemies.join(", ")}`)
      }

      const exitList = Object.keys(room.exits).join(", ")
      if (exitList) {
        print(`出口：${exitList}`)
      }
    }
  } else if (command.startsWith("go ")) {
    const direction = command.slice(3).trim()
    goDirection(direction)
  } else if (command === "take" || command.startsWith("take ")) {
    const itemName = command === "take" ? "" : command.slice(5)
    take(itemName)
  } else if (command === "inventory" || command === "inv") {
    showInventory()
  } else if (command === "attack") {
    attack()
  } else if (command === "talk" || command.startsWith("talk ")) {
    const name = command === "talk" ? "" : command.slice(5)
    talk(name)
  } else if (command === "leave") {
    leaveConversation()
  } else if (command.startsWith("say ")) {
    const message = input.slice(4) // 使用 'input' 保留大小写
    sayTo(message)
  } else {
    print("我不理解那个命令。", "error")
  }
}

// ============ 移动 ============

function goDirection(direction) {
  const room = rooms[currentRoom]
  if (room && room.exits[direction]) {
    currentRoom = room.exits[direction]
    visitedRooms.add(currentRoom)
    updateUI()
    const newRoom = rooms[currentRoom]
    if (newRoom) {
      print(`你向${direction}走。`)
      print(newRoom.description)

      // 显示房间中的角色
      const roomCharacters = Object.entries(characters)
        .filter(([id, char]) => char.location === currentRoom)
        .map(([id, char]) => char.name)
      if (roomCharacters.length > 0) {
        print(`与以下角色对话：${roomCharacters.join(", ")}`)
      }

      // 显示房间中的物品
      const roomItems = Object.entries(items)
        .filter(([id, item]) => item.room === currentRoom)
        .map(([id, item]) => item.name)
      if (roomItems.length > 0) {
        print(`物品：${roomItems.join(", ")}`)
      }

      // 显示房间中的敌人
      const roomEnemies = Object.entries(enemies)
        .filter(([id, enemy]) => enemy.room === currentRoom && enemy.hp > 0)
        .map(([id, enemy]) => `${enemy.name} (${enemy.hp} 生命值)`)
      if (roomEnemies.length > 0) {
        print(`敌人：${roomEnemies.join(", ")}`)
      }

      const exitList = Object.keys(newRoom.exits).join(", ")
      if (exitList) {
        print(`出口：${exitList}`)
      }
    }
  } else {
    print("你不能往那个方向走。", "error")
  }
}

// ============ 物品清单系统 ============

function take(itemName) {
  // 在当前房间查找物品
  let entry
  if (itemName === "") {
    // 未指定目标 - 拾取房间中的第一个物品
    entry = Object.entries(items).find(
      ([id, item]) => item.room === currentRoom,
    )
  } else {
    // 指定了目标 - 按名称匹配（不区分大小写，部分匹配）
    entry = Object.entries(items).find(
      ([id, item]) =>
        item.room === currentRoom &&
        item.name.toLowerCase().includes(itemName.toLowerCase()),
    )
  }

  if (entry) {
    const [id, item] = entry
    item.room = null // 从房间移除
    inventory.push(id) // 添加到物品清单
    print(`你拾起了 ${item.name}。`, "success")
    updateInventory()
    updateTakeButton()
    showItemsBar()
  } else {
    print("你在这里看不到那个东西。", "error")
  }
}

function showInventory() {
  if (inventory.length === 0) {
    print("你什么都没有携带。")
  } else {
    const carried = inventory.map((id) => items[id].name).join(", ")
    print(`你携带了：${carried}`)
  }
}

// ============ 战斗系统 ============

function attack() {
  // 在当前房间查找生命值大于 0 的敌人
  const entry = Object.entries(enemies).find(
    ([id, enemy]) => enemy.room === currentRoom && enemy.hp > 0,
  )

  if (!entry) {
    print("这里没有什么可以攻击的。", "error")
    return
  }

  const [id, enemy] = entry

  // 检查武器伤害加成
  const weapon = inventory.find((itemId) => items[itemId].damage)
  const playerDamage = weapon ? items[weapon].damage : 5

  // 玩家攻击
  enemy.hp -= playerDamage
  print(`你攻击了 ${enemy.name}，造成 ${playerDamage} 点伤害！`, "combat")

  if (enemy.hp <= 0) {
    print(`${enemy.name} 被击败了！`, "success")
    enemy.room = null // 将敌人从房间移除
    updateAttackButton()
    showEncounterBox()
    return
  }

  print(`${enemy.name} 还剩 ${enemy.hp} 点生命值。`, "combat")

  // 敌人反击
  playerHp -= enemy.damage
  print(`${enemy.name} 攻击了你，造成 ${enemy.damage} 点伤害！`, "combat")

  updateHpBar()

  if (playerHp <= 0) {
    print("你被击败了。游戏结束。", "error")
    print("刷新页面重新开始。")
    commandInput.disabled = true
    return
  }

  print(`你还剩 ${playerHp} 点生命值。`, "combat")
}

// ============ NPC 对话系统 ============

function talk(name) {
  // 查找当前房间中的 NPC
  const npcsInRoom = Object.entries(characters).filter(
    ([id, c]) => c.location === currentRoom,
  )

  if (npcsInRoom.length === 0) {
    // 复活节彩蛋：与地精对话
    const goblin = Object.entries(enemies).find(
      ([id, e]) => id === "goblin" && e.room === currentRoom && e.hp > 0
    )
    if (goblin) {
      print(`地精："GRAK SNORK BLURGLE!! MEEP GRONK SKREEEE!!"`, "npc")
      return
    }

    print("这里没有人可以对话。", "error")
    return
  }

  let entry
  if (name === "") {
    // 未指定目标 - 与房间中的第一个 NPC 对话
    entry = npcsInRoom[0]
  } else {
    // 按名称或 ID 匹配（不区分大小写，部分匹配）
    entry = npcsInRoom.find(
      ([id, c]) =>
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        id.toLowerCase().includes(name.toLowerCase()),
    )
  }

  if (!entry) {
    print("我在这里看不到叫那个名字的人。", "error")
    return
  }

  const [id, character] = entry
  talkingTo = character
  talkingToId = id

  // 只有在遭遇框隐藏时才显示肖像（已经显示角色信息）
  if (encounterBox.hidden) {
    showPortrait(character)
  }
  print(`${character.name}："${character.greeting}"`)
  print("")
  print("输入你的消息，或输入 'leave' 结束对话。")
}

function leaveConversation() {
  if (!talkingTo) return

  print(`你停止与 ${talkingTo.name} 对话。`)
  talkingTo = null
  talkingToId = null
  hidePortrait()
}

async function sayTo(message) {
  if (!talkingTo) {
    print("你没有和任何人对话。", "error")
    return
  }

  print(`你："${message}"`)

  try {
    const res = await fetch("/api/talk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        character: talkingTo,
        message,
      }),
    })

    const data = await res.json()
    print(`${talkingTo.name}："${data.response}"`, "npc")
  } catch (err) {
    console.error("Say error:", err)
    // 如果 API 失败，回退到问候语
    print(`${talkingTo.name}："${talkingTo.greeting}"`, "npc")
  }
}

// ============ 事件处理器 ============

// 处理输入
commandInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const input = commandInput.value
    if (input.trim()) {
      processCommand(input)
      commandInput.value = ""
    }
  }
})

// 点击任意位置聚焦输入框
document.addEventListener("click", () => commandInput.focus())

// 按钮处理器
document.querySelectorAll(".pixel-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation()
    const cmd = btn.dataset.cmd
    if (cmd && !btn.disabled) {
      processCommand(cmd)
    }
  })
})

// 键盘快捷键（当不在输入框中输入时）
// 在命令实现之前禁用
// document.addEventListener("keydown", (e) => {
//   if (document.activeElement === commandInput) return
//   const shortcuts = { l: "look", i: "inventory", h: "help", a: "attack" }
//   if (shortcuts[e.key.toLowerCase()]) {
//     e.preventDefault()
//     processCommand(shortcuts[e.key.toLowerCase()])
//   }
// })

// 肖像关闭按钮
portraitClose.addEventListener("click", (e) => {
  e.stopPropagation()
  leaveConversation()
})

// 对话按钮 - 与房间中的第一个 NPC 对话
talkBtn.addEventListener("click", (e) => {
  e.stopPropagation()
  const npc = Object.values(characters).find((c) => c.location === currentRoom)
  if (npc) {
    const name = npc.name.split(" ")[0].toLowerCase()
    processCommand(`talk ${name}`)
  }
})

// 拾取按钮 - 拾取房间中的第一个物品
takeBtn.addEventListener("click", (e) => {
  e.stopPropagation()
  const item = Object.values(items).find((i) => i.room === currentRoom)
  if (item) {
    const name = item.name.split(" ")[0].toLowerCase()
    processCommand(`take ${name}`)
  }
})

// 方向键导航
document.addEventListener("keydown", (e) => {
  // 只在输入框为空时捕获方向键（以便输入仍能正常工作）
  if (document.activeElement === commandInput && commandInput.value !== "")
    return

  const arrowMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  }

  if (arrowMap[e.key]) {
    e.preventDefault()
    processCommand(`go ${arrowMap[e.key]}`)
  }
})

// ============ 初始化 ============

async function init() {
  await loadRooms()
  await loadItems()
  await loadCharacters()
  await loadEnemies()

  updateUI()
  enableCommandButtons()

  print("欢迎来到地下城与智能体！")
  print("")
  const room = rooms[currentRoom]
  if (room) {
    print(room.description)

    // 显示起始房间中的物品
    const roomItems = Object.entries(items)
      .filter(([id, item]) => item.room === currentRoom)
      .map(([id, item]) => item.name)
    if (roomItems.length > 0) {
      print(`物品：${roomItems.join(", ")}`)
    }
  }
}

init()
