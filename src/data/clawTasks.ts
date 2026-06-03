export interface ClawTask {
  id: string
  emoji: string
  title: string
  description: string
  completed: boolean
}

export const clawTasks: ClawTask[] = [
  // 家务类（贴近 S1E19 剧场版）
  { id: 'make-bed', emoji: '🛏️', title: '整理床铺', description: '把枕头和被子整理好，让床看起来整洁！', completed: false },
  { id: 'water-plant', emoji: '🌱', title: '浇植物', description: '给家里的植物浇点水，叶子会开心！', completed: false },
  { id: 'dust-shelf', emoji: '🧹', title: '擦柜子', description: '拿一块抹布擦一擦柜子或桌子！', completed: false },
  { id: 'pickup-toys', emoji: '🧸', title: '收拾玩具', description: '把散落在地上的玩具捡起来放回原位！', completed: false },
  { id: 'fold-laundry', emoji: '👕', title: '叠衣服', description: '帮忙叠 3 件衣服，每件都要叠整齐！', completed: false },
  // 动作类
  { id: 'horsey', emoji: '🐴', title: '骑马任务', description: '在家长背上骑 3 圈，每圈换一种动物叫声！', completed: false },
  { id: 'robot-dance', emoji: '💃', title: '机器人舞', description: '学 Bandit 跳 10 秒机器人舞！', completed: false },
  { id: 'kangaroo', emoji: '🦘', title: '袋鼠跳', description: '双手抱胸前跳 5 下！', completed: false },
  { id: 'freeze', emoji: '🧍', title: '木头人', description: '保持一个搞笑姿势不动 10 秒！', completed: false },
  // 声音类
  { id: 'animals', emoji: '🐔', title: '动物合奏', description: '学 3 种动物的叫声！', completed: false },
  { id: 'theme-song', emoji: '🎵', title: '哼主题曲', description: '唱一段 Bluey 片头曲！', completed: false },
  { id: 'announce', emoji: '📣', title: '宣布仪式', description: '大声宣布"我要抓娃娃啦！"', completed: false },
  // 互动类
  { id: 'hug', emoji: '🫂', title: '抱抱攻击', description: '抱住爪子机器（家长）3 秒！', completed: false },
  { id: 'highfive', emoji: '✋', title: '击掌接力', description: '和每个人击掌一圈！', completed: false },
  { id: 'fix-machine', emoji: '🔧', title: '修理机器', description: '拍拍家长的头说"你是最棒的机器！"', completed: false },
]
