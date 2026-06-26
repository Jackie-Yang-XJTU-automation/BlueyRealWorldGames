# BlueyRealWorldGames

## 项目简介
Bluey 主题的亲子互动游戏助手。面向 3-8 岁儿童，PWA 可安装到手机桌面，离线可用。

## 产品北极星
这个 App 的核心不是儿童手游、规则百科或积分挑战，而是 **给家长看的 Bluey 陪玩提词器**。典型用户是周末有点累、只偶尔看过 Bluey、不一定记得剧情细节、但想陪 3-8 岁孩子真实玩起来的家长。

玩法选择优先级是：**不依托剧情也好玩的现实玩法** > **App 能明显提高耐玩性** > **Bluey 剧情调味**。第一梯队不是“剧情精彩”，而是“去掉剧情后孩子和家长仍然想玩”，例如顶气球、魔法木琴、出租车乘客模拟这类玩法本身成立的游戏。剧情资料用来取灵感、笑点和安全边界，不用来要求家长复现动画桥段。

所有体验改动都优先回答三件事：
1. **现在玩什么**：家长一眼知道当前游戏和现实场景。
2. **我对孩子说什么**：运行页必须优先给出一句可直接读给孩子听的主持词或任务提示。
3. **下一步怎么安全做**：动作、安全边界、暂停和结束必须比积分、排行榜、完整进度更显眼。

避免把体验做成“给孩子独立操作的屏幕游戏”或“给开发者看的系统面板”。孩子可以看一眼，但不应需要持续盯屏、理解分数系统或自己管理任务树。

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
    games.ts                 #   13 个游戏
    keepyUppyEvents.ts       #   15 个随机事件
    keepyUppyTasks.ts        #   5 个任务关卡
    daddyRobotTasks.ts       #   5 个机器人任务
    daddyRobotEvents.ts      #   机器人故障事件
    hospitalTasks.ts         #   医院阶梯任务
    hospitalEvents.ts        #   医院剧情随机事件
    magicXylophoneTasks.ts   #   魔法木琴阶梯任务
    magicXylophoneEvents.ts  #   魔法木琴随机事件
    shadowLandsTasks.ts      #   影子陆地阶梯任务
    shadowLandsEvents.ts     #   影子陆地随机事件
    bbqTasks.ts              #   假装烧烤阶梯任务
    bbqEvents.ts             #   假装烧烤剧情随机事件
    magicStatueTasks.ts      #   魔法雕像商店阶梯任务
    magicStatueEvents.ts     #   魔法雕像商店剧情随机事件
    hotelTasks.ts            #   酒店阶梯任务
    hotelEvents.ts           #   酒店剧情随机事件
    spyGameTasks.ts          #   间谍任务阶梯任务
    spyGameEvents.ts         #   间谍任务剧情随机事件
    shopsTasks.ts            #   开商店阶梯任务
    shopsEvents.ts           #   开商店剧情随机事件
    piratesTasks.ts          #   海盗船阶梯任务
    piratesEvents.ts         #   海盗船剧情随机事件
    storyPlayConfigs.ts      #   共享角色/故事游戏配置
    taxiGame.ts              #   出租车乘客模拟路况回合配置
    recommendationRules.ts   #   今日推荐规则与场景标签
    clawTasks.ts             #   13 个抓娃娃机任务
    clawEvents.ts            #   抓娃娃机剧情随机事件
  types/
    playExperience.ts        # 今日推荐/家庭足迹类型
    sound.ts                 # 程序音效类型
  utils/storage.ts           # localStorage 封装
  utils/playHistory.ts       # 家庭足迹本地存储
  utils/soundEffects.ts      # Web Audio 程序音效
  hooks/
    useTimer.ts              # 通用 RAF 计时器
    useRandomEvent.ts        # 随机事件调度
    useFavorites.ts          # 收藏管理
    useLeaderboard.ts        # 排行榜管理
    useKeepyUppyGame.ts      # 顶气球游戏逻辑
    useHospitalGame.ts       # 医院游戏逻辑
    useDaddyRobotGame.ts     # 爸爸机器人游戏逻辑
    useShadowLandsGame.ts    # 影子陆地游戏逻辑
    useMagicXylophoneGame.ts # 魔法木琴游戏逻辑
    useBbqGame.ts            # 假装烧烤游戏逻辑
    useClawGame.ts           # 抓娃娃机游戏逻辑
    useStoryPlayGame.ts      # 共享角色/故事游戏逻辑
    useTaxiGame.ts           # 出租车乘客模拟路况抽取状态机
    useTodayRecommendations.ts # 今日推荐状态与算法
    usePlayRouteLogger.ts    # 直接进入运行页的足迹记录
    useSoundSettings.ts      # 音效设置管理
  components/
    Layout.tsx               # 全局布局 + 导航
    Clouds.tsx               # 蓝天白云草地背景
    GameCard.tsx              # 游戏卡片
    GameTimer.tsx             # 通用计时器展示
    FilterBar.tsx             # 筛选栏
    Leaderboard.tsx           # 排行榜
    PlayableGameChrome.tsx   # 可玩游戏通用 HUD + 暂停/确认弹窗
    TaskLadderPanel.tsx      # 五级任务阶梯面板
    RandomEventPopup.tsx      # 随机事件弹窗
    StoryPlayPage.tsx         # 共享角色/故事游戏运行页
    ClawResultPopup.tsx       # 抓娃娃结果弹窗
    QRCode.tsx                # 首页二维码
    TodayRecommendationPanel.tsx # 今日推荐面板
    SoundSettingsCard.tsx    # 工具箱音效设置
    DeliveryReadinessCard.tsx # 交付状态提示
  pages/
    HomePage.tsx              # 首页（游戏库 + 筛选 + 随机 + 收藏 + 二维码）
    GameDetailPage.tsx        # 游戏详情（PLAYABLE 集中注册可玩游戏）
    KeepyUppyPage.tsx         # 顶气球游戏
    HospitalPage.tsx          # 医院游戏
    MagicXylophonePage.tsx    # 魔法木琴游戏
    DaddyRobotPage.tsx        # 爸爸机器人游戏
    ShadowLandsPage.tsx       # 影子陆地游戏
    BbqPage.tsx               # 假装烧烤游戏
    ClawGamePage.tsx          # 抓娃娃机游戏
    TaxiPage.tsx              # 出租车乘客模拟游戏
    StoryPlayPages.tsx        # 魔法雕像/酒店/间谍/商店/海盗包装页面
    FamilyPlayLogPage.tsx    # 本地家庭记录页
    TimerPage.tsx             # 通用计时器
    DicePage.tsx              # 虚拟骰子
  App.tsx                     # 路由配置
  main.tsx                    # 入口
  index.css                   # 全局样式 + Bluey.tv 设计系统
```

## 当前进度
- ✅ P0 MVP：首页 + 13 款可玩游戏（魔法木琴、医院、顶气球、影子陆地、爸爸机器人、假装烧烤、抓娃娃机、魔法雕像商店、酒店角色扮演、间谍任务、开商店、出租车乘客模拟、海盗船冒险）
- ✅ PWA：可安装、离线可用
- ✅ 移动端触摸适配
- ✅ GitHub Pages 自动部署
- ✅ 通用计时器（TimerPage）
- ✅ 虚拟骰子（DicePage）
- ✅ PWA 图标规范化（192/512/maskable/apple-touch）
- ✅ P1：第二个可玩游戏（已超额，实际完成 13 款）
- ✅ 13 款可玩游戏玩法一致性优化：抓娃娃机接入统一剧情随机事件；影子陆地/爸爸机器人事件更贴剧情；顶气球/影子陆地任务盖章增加节奏门槛；5 款 S1 角色/故事游戏接入共享家长主持器；出租车乘客模拟使用独立路况抽取器
- ✅ 新增 2 款可玩游戏：医院、假装烧烤，均接入任务阶梯、剧情随机事件、倒计时、暂停与结束确认
- ✅ 家长主持提词器优化：首页生活场景入口、13 款任务主持词/等价主持提示、结算弱化输赢均已落地
- ✅ 音效系统（Web Audio 程序生成，工具箱可开关/调音量）
- ✅ T8 今日游戏推荐（时间/场景/状态/家庭足迹驱动）
- ✅ 本地家庭记录页（工具箱入口，记录推荐/随机/收藏/卡片/直接路由打开）
- ⬜ 骑马游戏安全降级后再考虑可玩版本

## 编码规范
- 组件文件和目录使用 PascalCase 命名
- hooks 使用 camelCase 命名，以 `use` 开头
- 类型文件使用 PascalCase 命名
- 使用函数组件 + Hooks，避免 class 组件
- Props 使用 interface 定义类型
- 样式优先使用 Tailwind，全局样式放在 index.css
- 新游戏逻辑提取为独立 hook，页面只负责渲染
- 新增可玩游戏时，在 `src/data/playableGames.ts` 中加一条记录（route + label），详情页会自动识别。

### 文档职责
- `REQUIREMENTS.md`：产品需求、路线图、完成状态。
- `docs/game-design-patterns.md`：所有可玩游戏的唯一玩法设计规范。
- `docs/superpowers/data/`：剧情摘要参考资料，新增或重做游戏前优先阅读。
- `docs/superpowers/scripts/`：更长剧情/脚本资料，仅在摘要不够时查阅。
- `docs/superpowers/specs/bluey-s1-game-analysis_codex.md`：保留的 S1 可玩性分析参考，用来辅助挑选后续深度集成候选。
- 不再把新的产品规范写进 `docs/superpowers/specs/` 或 `docs/superpowers/plans/`。

### 可玩游戏必需模式
所有深度可玩游戏都是现实亲子游戏主持器，不是屏幕小游戏。App 负责发任务、制造随机事件、记录节奏；孩子和家长在现实空间里完成动作、角色扮演和协作。

1. **玩法自立优先**：第一梯队必须是不依托剧情也好玩的现实玩法。先用一句话讲清规则，确认家长和孩子不熟剧情也能开玩。
2. **剧情只做调味和避坑**：任务和随机事件可以参考对应 `docs/superpowers/data/SxEy-*.md`，必要时查 `docs/superpowers/scripts/SxEy-*.md`，但目标是提取玩法灵感、笑点和安全边界，不是复现剧情。
3. **玩法结构分型**：不要默认套 5 级任务阶梯。先判断玩法适合规则挑战、角色扮演喜剧、路线规划、订单循环、线索修复还是故事冒险，再选择任务卡、方向盘、地图、病历、订单票、声音板等主交互。
4. **随机事件**：运行中事件调度统一走 `useRandomEvent`、阶段状态机或同等 hook。事件优先服务现实玩法，例如顶气球规则变化、出租车路况提示、影子路线机会、魔法木琴冻结变化，不在页面里散落 setTimeout。
5. **现实合理性**：每个任务必须适合 3-8 岁儿童在家庭/户外真实场景中完成；场地要求高的游戏要先有替代玩法，否则不能作为第一梯队。
6. **Bluey 味道退到第二层**：保留剧集里的家庭协作、规则冲突、家长夸张表演和孩子主导想象，但这些只能增强玩法，不能替代玩法。
7. **开始倒计时**：点「开始玩」后先显示 `<CountdownOverlay emoji="..." onComplete={...} />`，再进入 running 状态。
8. **暂停/继续**：running 状态显示暂停按钮；暂停时冻结计时器、停止随机事件；显示「继续玩」和「重来」。
9. **结束确认**：点击结束按钮先弹出确认弹窗，再执行结束逻辑，避免孩子误触。
10. **家长主持卡优先**：运行中第一屏只突出当前主持词/当前任务/必要动作/安全提醒/暂停结束。星星、排行榜、分数说明、完整五级任务树属于记录层，默认收起或放到暂停、结算、详情中。
11. **少解释，多可说可看可听**：优先给家长可直接说的话、图片/图标和声音提示，少写系统术语。好的任务文案像“红灯，安全刹车！”而不是“完成第 1 阶段任务获得 100 星”。

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
- 主文字/主按钮：`#2C4364`（班底特深蓝，CSS `--color-btv-dark`）
- 辅助文字：`#5a5a87`（紫灰，用于次要信息和半透明叠加）、`#5C728D`（`--color-btv-text-muted`）
- 主按钮：`#2C4364` bg + 白色（`#FDFBF7`）字
- 天空背景：`linear-gradient(180deg, #87CEEB, #B3E5FC, #E1F5FE, #F9F6EE)`
- 点缀暖色：`#F39C62`（宾果橙，用于标签/收藏）、`#FCD882`（玛芬黄，用于星级）
- 卡片边框：`#E3F2FD`（浅蓝），hover 边框 `#BBDEFB`
- 绿色：`#90C79A`（成功/确认按钮）、红色：`#D96B62`（危险操作）

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
- 移动端触屏是主体验，桌面只是辅助预览；户外亲子游戏默认由家长单手拿手机主持。
- `hover` 只能作为桌面增强，不能承载核心趣味、状态变化或可点击暗示。
- 重要动效必须有触屏等价：按下反馈、滚动聚焦、卡片入场、收藏/任务/事件即时反馈。
- UI 验收要检查手机滚动和点按手感，不只检查桌面 hover 或静态截图。
- 可玩游戏运行页默认由家长单手拿手机主持。第一屏信息密度必须低，当前任务必须比星星、排行榜、完整任务树更突出。

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
| Hover | 仅作为桌面增强；手机必须提供按下反馈或滚动聚焦等触屏等价 |
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
- **触屏现场优先**：如果一个动效只在桌面 hover 可见，它不能算核心体验完成。手机上应通过滚动到视口中心、按下、收藏、任务盖章或弹窗状态变化看见反馈。
- **滚动聚焦克制**：移动端列表可以突出视口中心卡片，但一次只突出一张，使用轻微阴影/边框/图标放大，不制造布局跳动。
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
- [ ] 核心动效在手机触屏上可见，而不是只依赖桌面 hover？
- [ ] 手机滚动时是否稳定、可读、不跳动？
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
