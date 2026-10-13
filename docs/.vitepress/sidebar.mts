import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 侧边栏自动生成
 * ---------------------------------------------------------------
 * 约定（改内容时只需遵守这两条，侧边栏会自动更新，不用碰 config.mts）：
 *  1. 一节一页，文件放在 docs/ch1|ch2|ch3 下，命名 `序号-英文短名.md`
 *     → 序号决定小节编号：docs/ch2/03-internship.md 显示为「2.3 实习」
 *  2. 每页开头写 frontmatter：title: 小节名（不要带编号，编号由文件名生成）
 *     → 附录例外，附录编号写在 title 里（因为存在 A.3-A.4 这种合并页）
 *
 * 布局策略：
 *  第一/二/三章**统一**挂在同一个侧边栏里（顶部导航不放这三章的入口），
 *  所以在任意一章的页面上，都能直接跳到另外两章的小节。
 *  附录独立成栏，入口在顶部导航。
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '..')

interface SidebarItem {
  text: string
  link?: string
}

interface SidebarGroup {
  text: string
  link?: string
  collapsed?: boolean
  items: SidebarItem[]
}

/** 读取 frontmatter 的 title，没有就退回一级标题，再退回文件名 */
function readTitle(file: string): string {
  const src = fs.readFileSync(file, 'utf-8')
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (fm) {
    const m = fm[1].match(/^title\s*:\s*(.+)$/m)
    if (m) return m[1].trim().replace(/^["']|["']$/g, '')
  }
  const h1 = src.match(/^#\s+(.+)$/m)
  return h1 ? h1[1].trim() : path.basename(file, '.md')
}

/** 扫描一个章节目录，生成「章号.序号 标题」列表 */
function buildChapter(dirName: string, chapterNo: number, label: string): SidebarGroup {
  const dir = path.join(docsRoot, dirName)
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()

  const items: SidebarItem[] = files.map((f) => {
    const num = f.match(/^(\d+)/)?.[1]
    const primary = num ? `${chapterNo}.${Number(num)} ` : ''
    return {
      text: primary + readTitle(path.join(dir, f)),
      link: `/${dirName}/${f.replace(/\.md$/, '')}`,
    }
  })

  return {
    text: label,
    // 组标题可点击 → 直接跳到该章第一节
    link: items[0]?.link,
    collapsed: false,
    items,
  }
}

/** 附录：按文件名首字母 a / b / c / d / e 自动分组，条目文字直接用 frontmatter title */
function buildAppendix(): SidebarGroup[] {
  const dir = path.join(docsRoot, 'appendix')
  const groups: Array<{ prefix: string; label: string }> = [
    { prefix: 'a', label: '附录 A 搜索方法论' },
    { prefix: 'b', label: '附录 B 批判性思维' },
    { prefix: 'c', label: '附录 C 学科知识地图' },
    { prefix: 'd', label: '附录 D 实用工具' },
    { prefix: 'e', label: '附录 E 华工友情链接' },
  ]

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()

  return groups
    .map(({ prefix, label }) => {
      const items: SidebarItem[] = files
        .filter((f) => f.toLowerCase().startsWith(prefix))
        .map((f) => ({
          text: readTitle(path.join(dir, f)),
          link: `/appendix/${f.replace(/\.md$/, '')}`,
        }))
      return { text: label, link: items[0]?.link, collapsed: false, items }
    })
    .filter((g) => g.items.length > 0)
}

/** 三章正文，统一组成一栏。故意展开全部三组，避免章节被折叠后看不见、找不到 */
const chapters: SidebarGroup[] = [
  buildChapter('ch1', 1, '第一章 认清现状'),
  buildChapter('ch2', 2, '第二章 基本方向'),
  buildChapter('ch3', 3, '第三章 存在主义'),
]

export const sidebar: Record<string, SidebarGroup[]> = {
  // 三章共用同一份目录，任意一章页面都能跳到另外两章
  '/ch1/': chapters,
  '/ch2/': chapters,
  '/ch3/': chapters,
  '/appendix/': buildAppendix(),
}
