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
- ⬜ T5 通用计时器（独立组件）
- ⬜ T6 虚拟骰子
- ⬜ T8 今日游戏推荐
- ⬜ P1：第二个游戏 + 音效

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
