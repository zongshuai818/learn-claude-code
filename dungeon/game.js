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

  // 处理命令
  if (command === "help") {
    print("可用命令：")
    print("  help - 显示此帮助信息")
    print("  look - 查看周围环境")
    return
  }

  if (command === "look") {
    print("你身处一个黑暗的洞穴。出口：上")
    return
  }

  print("我不理解那个命令。", "error")
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

// 肖像关闭按钮
portraitClose.addEventListener("click", (e) => {
  e.stopPropagation()
  hidePortrait()
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

// ============ 初始化 ============

async function init() {
  await loadRooms()
  await loadItems()
  await loadCharacters()
  await loadEnemies()

  updateUI()

  print("欢迎来到地下城与智能体！")
  print("输入 'help' 查看可用命令。")
  print("")
  const room = rooms[currentRoom]
  if (room) {
    print(room.description)
  }
}

init()
