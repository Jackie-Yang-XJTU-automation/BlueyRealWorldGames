# 项目文档导航

这个目录只放长期有用的项目文档。临时计划、一次性分析、抓取原文和剧情资料要和产品规范分开，避免同一件事在多个地方反复维护。

## 权威文档

- `REQUIREMENTS.md`：产品需求、路线图、已完成状态。面向产品决策和功能范围。
- `CLAUDE.md`：仓库结构、开发约定、可玩游戏实现要求。面向编码代理和开发者。
- `AGENTS.md`：本地 Codex 会话规则。该文件被 `.gitignore` 忽略，但仍作为本机工作约定使用。
- `docs/game-design-patterns.md`：所有可玩游戏的唯一设计规范。新增或重做游戏时先看这里。

## 剧情参考资料

- `docs/superpowers/specs/bluey-s1-game-analysis_codex.md`：保留的 S1 剧集可玩性分析，用来辅助挑选下一批可深度集成的游戏候选。
- `docs/superpowers/data/`：每集剧情摘要与角色信息，作为设计任务卡和随机事件的首要依据。
- `docs/superpowers/scripts/`：更长的剧本/剧情资料，只在摘要不够时查阅。
- `docs/superpowers/data/episodes.json`：批量抓取的原始数据索引。

`docs/superpowers/` 是资料库，不是项目规范库。除上述保留的 S1 分析文档外，不要把新的产品要求、实现计划或设计结论继续写进这个目录。

## 文档维护规则

1. 产品事实只维护在 `REQUIREMENTS.md`。
2. 实现约定只维护在 `CLAUDE.md` 和本地 `AGENTS.md`。
3. 游戏玩法模式只维护在 `docs/game-design-patterns.md`。
4. 每个新可玩游戏必须引用对应剧集资料，再产出任务卡、随机事件和现实安全约束。
5. 临时计划实现完后不要长期保留；把仍有价值的结论合并进上述权威文档。
