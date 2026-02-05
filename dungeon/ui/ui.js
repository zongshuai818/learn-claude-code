// 地下城与智能体 - UI 管理
// 处理所有 DOM 更新和视觉元素

// DOM 元素引用
const output = document.getElementById("output")
const commandInput = document.getElementById("command")
const hpBar = document.getElementById("hp-bar")
const hpText = document.getElementById("hp-text")
const locationName = document.getElementById("location-name")
const inventoryList = document.getElementById("inventory-list")
const attackBtn = document.getElementById("attack-btn")
const talkBtn = document.getElementById("talk-btn")
const takeBtn = document.getElementById("take-btn")
const itemsBar = document.getElementById("items-bar")
const itemsList = document.getElementById("items-list")
const pixelMap = document.getElementById("pixel-map")
const portraitContainer = document.getElementById("portrait-container")
const portraitArt = document.getElementById("portrait-art")
const portraitName = document.getElementById("portrait-name")
const portraitTrait = document.getElementById("portrait-trait")
const portraitClose = document.getElementById("portrait-close")

// 地图配置 - 房间在网格上的位置
const mapLayout = {
  grid: [
    [null, null, null],
    [null, null, null],
    [null, "cave-entrance", null],
  ],
}

// 在终端中显示文本
function print(text, className = "") {
  const p = document.createElement("p")
  p.textContent = text
  if (className) p.className = className
  output.appendChild(p)
  output.scrollTop = output.scrollHeight
}

// 使用心形图标更新生命值条
function updateHpBar() {
  hpBar.innerHTML = ""
  const hearts = 10
  const hpPerHeart = maxHp / hearts
  const filledHearts = Math.ceil(playerHp / hpPerHeart)
  const hpPercent = playerHp / maxHp

  for (let i = 0; i < hearts; i++) {
    const heart = document.createElement("span")
    heart.className = "hp-heart"
    heart.textContent = "♥"

    if (i >= filledHearts) {
      heart.classList.add("empty")
    } else if (hpPercent <= 0.25) {
      heart.classList.add("low")
    } else {
      heart.classList.add("full")
    }

    hpBar.appendChild(heart)
  }

  hpText.textContent = `${playerHp}/${maxHp}`
}

// 更新位置显示
function updateLocation() {
  const room = rooms[currentRoom]
  if (room) {
    locationName.textContent = room.name
    visitedRooms.add(currentRoom)
  } else {
    locationName.textContent = "未知"
  }
}

// 获取物品图标
function getItemIcon(itemName) {
  const name = itemName.toLowerCase()
  if (name.includes("剑")) return "⚔"
  if (name.includes("钥匙")) return "🗝"
  if (name.includes("火把")) return "🔥"
  if (name.includes("药水")) return "🧪"
  if (name.includes("盾牌")) return "🛡"
  if (name.includes("宝石") || name.includes("珠宝")) return "💎"
  return "◆"
}

// 更新物品清单显示
function updateInventory() {
  inventoryList.innerHTML = ""

  if (inventory.length === 0) {
    const li = document.createElement("li")
    li.className = "inventory-empty"
    li.textContent = "空"
    inventoryList.appendChild(li)
  } else {
    inventory.forEach((id) => {
      const item = items[id]
      const li = document.createElement("li")
      const icon = document.createElement("span")
      icon.className = "item-icon"
      icon.textContent = getItemIcon(item.name)
      li.appendChild(icon)
      li.appendChild(document.createTextNode(item.name))
      inventoryList.appendChild(li)
    })
  }
}

// 更新攻击按钮状态
function updateAttackButton() {
  const hasEnemy = Object.values(enemies).some(
    (e) => e.room === currentRoom && e.hp > 0,
  )
  attackBtn.disabled = !hasEnemy
}

// 更新对话按钮状态
function updateTalkButton() {
  const hasNPC = Object.values(characters).some(
    (c) => c.location === currentRoom,
  )
  talkBtn.disabled = !hasNPC
}

// 更新拾取按钮状态
function updateTakeButton() {
  const hasItems = Object.values(items).some(
    (item) => item.location === currentRoom,
  )
  takeBtn.disabled = !hasItems
}

// 启用基本操作按钮（查看、帮助、物品清单）
function enableBasicButtons() {
  document.querySelectorAll('.pixel-btn[data-cmd="look"], .pixel-btn[data-cmd="help"], .pixel-btn[data-cmd="inventory"]').forEach(btn => {
    btn.disabled = false
  })
}

// 获取房间的地图单元格 HTML
function getMapCell(roomId) {
  if (!roomId) {
    return '<div class="map-cell empty"></div>'
  }

  const isCurrent = roomId === currentRoom
  const isVisited = visitedRooms.has(roomId)

  let className = "map-cell"
  if (isCurrent) {
    className += " current"
  } else if (isVisited) {
    className += " visited"
  } else {
    className += " unknown"
  }

  return `<div class="${className}"></div>`
}

// 更新小地图
function updateMap() {
  let html = ""

  for (const row of mapLayout.grid) {
    for (const roomId of row) {
      html += getMapCell(roomId)
    }
  }

  pixelMap.innerHTML = html
}

// 显示角色肖像
function showPortrait(character) {
  const charId = Object.keys(characters).find(
    (id) => characters[id].name === character.name,
  )

  const pixelArt = generatePixelArt(charId)
  if (pixelArt) {
    portraitArt.style.boxShadow = pixelArt
    portraitArt.textContent = ''
  } else {
    portraitArt.style.boxShadow = 'none'
    portraitArt.textContent = '?'
  }
  portraitName.textContent = character.name
  portraitTrait.textContent = character.personality
  portraitContainer.hidden = false
}

// 隐藏角色肖像
function hidePortrait() {
  portraitContainer.hidden = true
}

// 更新所有 UI 元素
function updateUI() {
  updateHpBar()
  updateLocation()
  updateInventory()
  updateAttackButton()
  updateTalkButton()
  updateTakeButton()
  updateMap()
  enableBasicButtons()
}
