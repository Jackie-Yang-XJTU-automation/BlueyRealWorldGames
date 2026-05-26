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

## 待探索工具
- Frontend Design Toolkit: github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit — 70+ 前端设计工具
- IconScout 儿童 Lottie 动画: iconscout.com/lottie-animations/kid-cartoon — 2346 个免费动画
