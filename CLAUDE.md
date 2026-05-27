# BlueyRealWorldGames

## 项目简介
Bluey 主题的亲子互动游戏助手。面向 3-8 岁儿童，PWA 可安装到手机桌面，离线可用。

## 部署
- 线上：https://jackie-yang-xjtu-automation.github.io/BlueyRealWorldGames/
- 部署方式：GitHub Pages + GitHub Actions 自动部署
- 本地开发：`npm run dev`
- 本地预览生产版本：`npm run preview`

## 技术栈
- React 19 + TypeScript + Vite 8
- Tailwind CSS 4
- react-router-dom 7（BrowserRouter + basename）
- vite-plugin-pwa（Workbox，离线可用）
- localStorage（数据持久化）
- 无后端，纯静态

## 项目结构
```
src/
  types/game.ts              # 所有 TS 类型
  data/                      # 游戏静态数据
    games.ts                 #   9 个游戏
    keepyUppyEvents.ts       #   15 个随机事件
    keepyUppyTasks.ts        #   5 个任务关卡
  utils/storage.ts           # localStorage 封装
  hooks/
    useTimer.ts              # 通用 RAF 计时器
    useRandomEvent.ts        # 随机事件调度
    useFavorites.ts          # 收藏管理
    useLeaderboard.ts        # 排行榜管理
    useKeepyUppyGame.ts      # 顶气球游戏逻辑
  components/
    Layout.tsx               # 全局布局 + 导航
    Clouds.tsx               # 蓝天白云草地背景
    GameCard.tsx              # 游戏卡片
    GameTimer.tsx             # 通用计时器展示
    FilterBar.tsx             # 筛选栏
    Leaderboard.tsx           # 排行榜
    RandomEventPopup.tsx      # 随机事件弹窗
    QRCode.tsx                # 首页二维码
  pages/
    HomePage.tsx              # 首页（游戏库 + 筛选 + 随机 + 收藏 + 二维码）
    GameDetailPage.tsx        # 游戏详情（其他8个游戏的规则/材料/贴士）
    KeepyUppyPage.tsx         # 顶气球游戏（唯一可玩的游戏）
  App.tsx                     # 路由配置
  main.tsx                    # 入口
  index.css                   # 全局样式 + Bluey.tv 设计系统
```

## 当前进度
- ✅ P0 MVP：首页 + 顶气球完整游戏
- ✅ PWA：可安装、离线可用
- ✅ 移动端触摸适配
- ✅ GitHub Pages 自动部署
- ✅ 通用计时器（TimerPage）
- ✅ 虚拟骰子（DicePage）
- ✅ 音效系统（ZzFX <1KB 程序生成）
- ⬜ T8 今日游戏推荐
- ⬜ P1：第二个可玩游戏

## 编码规范
- 组件文件和目录使用 PascalCase 命名
- hooks 使用 camelCase 命名，以 `use` 开头
- 类型文件使用 PascalCase 命名
- 使用函数组件 + Hooks，避免 class 组件
- Props 使用 interface 定义类型
- 样式优先使用 Tailwind，全局样式放在 index.css
- 新游戏逻辑提取为独立 hook，页面只负责渲染

### 可玩游戏必需模式（P1 防误触）
所有可玩游戏页面必须实现以下两个交互保护：
1. **暂停**：running 状态显示暂停按钮 → 暂停时冻结计时器+停止事件 → 显示「继续玩」+「重来」
2. **结束确认**：点击结束按钮弹出确认弹窗（"确定要结束吗？"）→「还没！继续玩」/「是，结束！」→ 确认后才执行 handleLand
实现方式：useTimer 已有 pause/resume，game hook 添加 handlePause/handleResume，页面添加 showLandConfirm 状态控制确认弹窗

## 会话规则
- 使用中文回复
- git 操作需要手动确认后才能提交，不自动提交
- 优先使用 Edit 工具修改已有文件，避免不必要地创建新文件
- 不要过度设计，保持代码简洁
- 只在系统边界（用户输入、外部 API）做校验，不要对内部代码做防御性校验

## Frontend Theme
<always_use_bluey_theme>
Always design with Bluey cartoon + official website aesthetic:

**色彩体系**
- 主文字：`#5a5a87`（紫灰，Bluey 官网正文色）
- 主按钮：`#5a5a87`（紫灰 bg + 白色字）
- 天空背景：`linear-gradient(180deg, #87CEEB, #B3E5FC, #E1F5FE, #FFFFFF)`
- 点缀暖色：`#F58634`（橙，用于标签/收藏）、`#FFC107`（黄，用于星级）
- 卡片边框：`#E3F2FD`（浅蓝），hover 边框 `#BBDEFB`
- 绿色：`#4CAF50`（成功/确认按钮）、红色：`#F44336`（危险操作）

**排版**
- 字体：Nunito（优先），fallback 到 system-ui
- 标题：`font-extrabold`，`tracking-tight`
- 卡片标题：`text-sm`（14px），正文：`text-xs`（12px）
- 主页面标题：`text-2xl`（36px），`font-black`

**组件风格**
- 卡片：`rounded-2xl`（16px），白底 + 浅蓝边框，轻微阴影，hover 上浮 2px
- 按钮：`rounded-full` 药丸形，`min-height: 56px`（桌面）/ 48px（移动端）
- 标签/徽章：`rounded-full`，`text-[11px] font-extrabold`，彩色半透明底色
- 游戏卡片结构：`[彩色 emoji 区 80px] → [类型标签 pill] → [游戏名] → [难度+人数]`
- 游戏类型配色：运动型=橙、扮演型=紫、安静型=绿、故事型=蓝
- emoji 彩色背景区按类型取色，底部信息区白底

**移动端优先**
- 最小触控区域 44px（按钮/链接），推荐 48px
- `touch-action: manipulation` 防双击缩放
- `user-select: none` 禁止文字选中
- `overscroll-behavior: none` 防橡皮筋效果
- iOS 安全区 `env(safe-area-inset-*)`

**设计原则**
- 儿童友好：大字号、大按钮、鲜艳但不刺眼的色彩
- 不堆砌：留白充足，一个卡片只传达一组信息
- 不跟风：不用通用 AI 风（紫色渐变、玻璃态、无意义的动画）
- 参考：Bluey 官网 bluey.tv（本地已保存 HTML 在 assets/）
- 官网设计令牌：卡片圆角 8px（App 改为 16px 更适合儿童）
</always_use_bluey_theme>

## UI 工艺规范（精选自 Impeccable，已适配 Bluey 儿童风格）

### 交互状态 — 8 态检查表
每个可交互元素必须覆盖：

| 状态 | 处理方式 |
|------|---------|
| Default | 基础样式 |
| Hover | 弹性缩放+阴影提升（Bluey 特有：`cubic-bezier(0.175,0.885,0.32,1.275)`） |
| Focus | `:focus-visible` 显示 2px 紫灰轮廓，鼠标点击不显示 |
| Active | `scale(0.95)` 按压反馈 |
| Disabled | `opacity: 0.5`，`pointer-events: none` |
| Loading | 骨架屏或旋转动画，禁用按钮防重复提交 |
| Error | 红色边框 + 图标 + 具体错误信息 |
| Success | 绿色勾 + 确认文案 |

**聚焦环规则**：永远不用 `outline: none` 而不给替代。用 `:focus-visible` 区分键盘和鼠标：
```css
button:focus { outline: none; }
button:focus-visible { outline: 2px solid #5a5a87; outline-offset: 2px; }
```

### 动效规范（Bluey 覆盖 Impeccable 原生规则）
- **弹性缓动允许**：`cubic-bezier(0.175,0.885,0.32,1.275)` 用于卡片 hover/emoji 旋转，这是 Bluey 卡通感的核心，**不走 Impeccable 的"禁止弹性"规则**
- 过渡时长：150-300ms 用于微交互，300-500ms 用于卡片/弹窗
- **必须**支持 `prefers-reduced-motion`：
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
- 按钮禁用弹性缓动，用标准 ease-out（`cubic-bezier(0.1,0.8,0.25,1)`）

### 间距系统
- 4px 基准：4, 8, 12, 16, 24, 32, 48, 64px
- 优先用 `gap` 而非 `margin` 处理兄弟元素间距
- 触控目标 ≥ 44px，推荐 48px

### 文案规范（适配中国家长）
- **按钮标签**：用具体动词+对象，不用"确定/提交/是/否"
  - ✅ "保存更改" / "删除游戏" / "开始顶气球"
  - ❌ "OK" / "Submit" / "Yes"
- **错误信息**：说清 (1) 发生什么 (2) 为什么 (3) 怎么办
  - ✅ "计时器还没开始，请先点「开始玩」"
  - ❌ "错误"
- **空状态**：简短承认 + 价值说明 + 行动引导
  - ✅ "还没有收藏游戏，去游戏库里找喜欢的吧！"
  - ❌ "无数据"
- **加载状态**：说清在加载什么，不用通用文案
  - ✅ "正在准备你的气球..."
  - ❌ "Loading..."
  - ❌ 不用 AI 陈词滥调（"正在召集像素小马..." 之类）
- **术语一致性**：全文统一用词
  - 收藏（不用"收藏/喜欢/点赞"混用）
  - 游戏（不用"游戏/活动/玩法"混用）
  - 开始玩（不用"开始/启动/进入"混用）

### 破坏性操作：撤销 > 确认框
- 删除等操作：立即从界面移除 → 显示底部撤销 Toast → 等 5 秒后真删
- 确认弹窗仅用于：账号删除、批量操作、高代价操作

### 空状态 & 边界用例
- 空列表 → 有插画/emoji + 引导文案 + CTA 按钮
- 长文本 → `truncate` 或 `line-clamp`，flex 子元素加 `min-width: 0`
- 加载中 → 骨架屏优于空白 spinner
- 错误 → 说明原因 + 重试按钮
- 离线 → 不崩溃，已有数据正常展示（PWA 已支持）

### 设计审计检查表（实现新功能后自查）
- [ ] 8 个交互状态都覆盖了吗？
- [ ] 触控区域 ≥ 44px？
- [ ] 动画尊重 `prefers-reduced-motion`？
- [ ] 文案一致（术语、语气、句式）？
- [ ] 空状态有引导？
- [ ] 长文本/短文本/缺失数据都处理了？
- [ ] 键盘可导航（Tab 顺序正确）？
- [ ] 无 console 报错或未使用导入？
- [ ] `z-index` 使用语义层级（dropdown 100 → sticky 200 → modal 400 → toast 500）而非随意写 9999？

### Impeccable 规则中明确不采纳的部分
以下 Impeccable 原生规则与 Bluey 儿童风格冲突，**故意不遵守**：
- ❌ "禁止弹性/回弹缓动" → Bluey 需要弹性动效营造卡通趣味
- ❌ "禁止纯白底色" → 儿童卡片白底干净清晰，不适用
- ❌ "禁止嵌套卡片" → Bluey 部分场景需要内嵌信息区，不过度嵌套即可
- ❌ "灰色文字不能放在彩色背景上" → Bluey 浅蓝背景上紫灰文字是官网标准做法
- ❌ "错误信息禁止幽默" → 儿童产品可以有温和的趣味表达，但要对家长保持清晰

## 待探索工具
- Frontend Design Toolkit: github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit — 70+ 前端设计工具
- IconScout 儿童 Lottie 动画: iconscout.com/lottie-animations/kid-cartoon — 2346 个免费动画
