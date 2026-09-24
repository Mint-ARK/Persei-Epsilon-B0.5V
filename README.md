# 卷舌二 (Persei-ε-B0.5V)

<div align="center">

**简体中文** | [English](./README_EN.md)

![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB?style=flat-square&logo=react)
![Build Tool](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite)
![Styling](https://img.shields.io/badge/CSS-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-Non--Commercial%20Research-grey?style=flat-square)

<p align="center">
  <b>Aether Gazer 本地仿真服务 Web 运维控制面板纯源码仓库 (Frontend Source Code)</b>
</p>

</div>

> 📖 **项目杂谈 / 开发者手记**：  
> 想了解本项目立项背后的心路历程、开发故事与作者的碎碎念？欢迎阅读博文：[《关于LocalServer》- MoriaRuRuka](https://moriaruruka.com/2026/09/24/411/)。

---

## 模块定位

`Persei-ε-B0.5V`（卷舌二）是 **Alpha Persei Cluster** 体系中的前端控制面板纯源码仓库。

本仓库**仅包含前端工程的源代码、TypeScript 类型定义、组件逻辑及 Vite 构建配置**，严格剥离了全部游戏立绘、背景插画、贴纸表情等重型媒体资产。

---

## 目录结构说明

本仓库集中收录了两套不同演进阶段的前端面板源码实现：

```
Persei-Epsilon-B0.5V/
├── web_current/            # 现行生效版 Web 管理面板源码
│   ├── src/                # 页面组件、路由、API 请求与 TypeScript 类型
│   ├── scripts/            # 构建与自动化生成辅助脚本
│   ├── templates/          # 模板定义
│   ├── package.json        # 依赖声明 (React 19 + Tailwind CSS)
│   ├── tsconfig.json       # TypeScript 编译配置
│   └── vite.config.ts      # Vite 构建流水线配置
│
└── web_opus_legacy/        # 早期 OPUS 母版原型源码 (归档参考)
    ├── src/                # 原型面板组件 (Overview, Heroes, Gacha, Warehouse 等)
    ├── package.json        # 依赖声明
    ├── tsconfig.json       # TypeScript 配置
    └── vite.config.ts      # Vite 配置
```

---

## 核心设计与功能板块

面板主要定位为服务状态与玩家资产的**数据浏览与辅助观察工具**，包含以下主要视图：

1. **状态总览 (Overview)**：展示服务器运行状态、在线连接信息与账号简报；
2. **账号画像 (Accounts)**：展示体力恢复时钟、当前看板娘设置与个性化签名；
3. **修正者名册 (Heroes)**：查看角色列表、等级突破、神格搭配与技能详情；
4. **资源背包 (Inventory)**：分类浏览货币、升级素材与消耗品库存；
5. **定向寻访 (Gacha)**：查看当前卡池配置与保底计数，支持 229 与 311 版本卡池切换；
6. **协议与帮助 (Agreement)**：排障指引与常见问题解答；
7. **物资采购 (Shop)**：常规货架商品与限购数据浏览；
8. **邮件终端 (Mail)**：信件列表查看与邮件发送调试；
9. **AI 角色对话 (AIChat)**：调用大语言模型进行修正者人设对话测试；
10. **系统设置 (Settings)**：网络端口监控与基础版本配置。

---

## 本地开发与构建

如需本地调试或重新编译现行面板：

```powershell
cd web_current

# 安装开发依赖
npm install

# 启动本地热重载调试开发服务器
npm run dev

# 编译打包静态输出文件 (产物将输出至 dist 目录)
npm run build
```

---

## 免责声明

本项目仅供现代化前端工程开发架构（React 19 / TypeScript / Vite）、组件化状态管理及单机模拟系统运维界面的学习与交流使用。严禁用于任何商业目的。
