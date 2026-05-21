# BlueyRealWorldGames

## 项目简介
Bluey 主题的互动游戏项目，基于 React + TypeScript 构建。

## 技术栈
- React 19
- TypeScript
- Vite（构建工具）
- CSS Modules 或 Tailwind CSS（样式方案）
- 状态管理：React Context / zustand（按需选择）

## 项目结构
```
src/
  components/   # 通用组件
  pages/        # 页面组件
  hooks/        # 自定义 hooks
  utils/        # 工具函数
  types/        # TypeScript 类型定义
  assets/       # 静态资源（图片、音频等）
  styles/       # 全局样式
```

## 编码规范
- 组件文件和目录使用 PascalCase 命名（如 `GameBoard.tsx`）
- 工具函数和 hooks 使用 camelCase 命名（如 `useGameState.ts`）
- 类型文件使用 PascalCase 命名（如 `GameTypes.ts`）
- 使用函数组件 + Hooks，避免 class 组件
- Props 使用 interface 定义类型
- 避免 `any`，优先使用具体类型或 `unknown`
- 使用 2 空格缩进

## 会话规则
- 使用中文回复
- git 操作需要手动确认后才能提交，不自动提交
- 优先使用 Edit 工具修改已有文件，避免不必要地创建新文件
- 不要过度设计，保持代码简洁
- 避免添加 docstring、注释或类型标注到你未改动的代码
- 只在系统边界（用户输入、外部 API）做校验，不要对内部代码做防御性校验
