export default defineEventHandler(async (event) => {
  // MVP：静态数据源（先跑通）
  // 未来方案1：从 Supabase 表读取（例如 interest_contents 表，type='notice'）
  // 未来方案2：从 i18n 或 CMS 拉取
  return {
    content: "欢迎参与 Interest 活动！后续公告会在这里更新～",
    lang: "zh-CN",
    updatedAt: new Date().toISOString(),
  }
})
