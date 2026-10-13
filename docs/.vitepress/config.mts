import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.mts'

// GitHub Pages 部署路径。仓库名不是 <用户名>.github.io 时必须与仓库名一致，
// 否则线上全站样式与链接会 404。绑定自定义域名后改回 '/'。
// 注意：head 里的资源路径不会自动加 base，必须用这个常量拼接。
const BASE = '/SCUTIE_SurvivalManual/'

export default defineConfig({
  lang: 'zh-CN',
  title: '华工工工生存手册',
  description: '华南理工大学工业工程（SCUT IE）非官方生存指南 — 认清现状、选定方向、学会生活',

  base: BASE,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE}xiaohui.png` }],
    ['meta', { name: 'theme-color', content: '#325395' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '华工工工生存手册' }],
    ['meta', { property: 'og:description', content: '华南理工大学工业工程（SCUT IE）非官方生存指南' }],
    ['meta', { property: 'og:image', content: `${BASE}xiaohui.png` }],
  ],

  markdown: {
    lineNumbers: false,
    image: { lazyLoading: true },
  },

  themeConfig: {
    logo: '/xiaohui.png',
    siteTitle: '华工工工生存手册',

    // 顶部导航只留全局入口；第一/二/三章不放这里，
    // 统一由左侧侧边栏承载（见 sidebar.mts 自动生成）
    nav: [
      { text: '首页', link: '/' },
      { text: '附录', link: '/appendix/a', activeMatch: '^/appendix/' },
      { text: '关于', link: '/about' },
    ],

    // 侧边栏由 sidebar.mts 扫描目录自动生成：
    // 新增页面只要放进对应章节目录、按 `序号-短名.md` 命名、写好 frontmatter 的 title，
    // 侧边栏会自动出现，不需要改这个文件。
    sidebar,

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    // 每页底部显示「在 GitHub 上编辑此页」，配合「关于」页的零基础贡献指南
    editLink: {
      pattern: 'https://github.com/Linch4444/SCUTIE_SurvivalManual/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Linch4444/SCUTIE_SurvivalManual' },
    ],

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true,

    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'short', timeStyle: 'short' },
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索本站',
            buttonAriaLabel: '搜索本站',
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    footer: {
      message: '学生自发编写的非官方经验手册 · 内容以教务系统与学院最新通知为准',
      copyright: 'SCUT IE Survival Manual · 开源贡献 · 欢迎增删改',
    },
  },
})
