export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Aya Dance",
  description: "舞蹈收集列表",
  navItems: [
    {
      label: "首页",
      href: "/",
    },
    {
      label: "跳舞",
      href: "/dance",
    },
  ],

  links: {
    github: "https://github.com/nextui-org/nextui",
  },
}
