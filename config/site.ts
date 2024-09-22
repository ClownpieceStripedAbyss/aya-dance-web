export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Udon Dance",
  description: "舞蹈收集列表",
  navItems: [
    {
      label: "首页",
      href: "/",
    },
    // TODO 跳舞功能
    // {
    //   label: "跳舞",
    //   href: "/dance",
    // },
  ],

  links: {
    github: "https://github.com/ClownpieceStripedAbyss/aya-dance-web",
  },
};
