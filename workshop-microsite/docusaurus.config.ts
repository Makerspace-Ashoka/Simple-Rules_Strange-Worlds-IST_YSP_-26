import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const siteUrl = process.env.SITE_URL || 'http://localhost';
const baseUrl = process.env.BASE_URL || '/';

const config: Config = {
  title: 'Simple Rules, Strange Worlds',
  tagline: 'Exploring Complexity through Cellular Automata',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: siteUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'DeeprajPandey', // Usually your GitHub org/user name.
  projectName: 'cellular-automata-workshop', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: ['@docusaurus/theme-live-codeblock'],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/cellular-automata-workshop-social-card.png',
    liveCodeBlock: {
      /**
       * The position of the live playground, above or under the editor
       * Possible values: "top" | "bottom"
       */
      playgroundPosition: 'bottom',
    },
    navbar: {
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'workshopSidebar',
          position: 'left',
          label: 'Workshop',
        },
        {
          position: 'left',
          label: 'Sandpile Game',
          to: '/sandpile-game',
        },
        {
          position: 'left',
          label: 'Applications',
          to: '/applications',
        },
        {
          position: 'left',
          label: 'Game of Life',
          to: '/game-of-life',
        },
        {
          position: 'left',
          label: 'Submit Your Work',
          to: '/submit',
        },
        {
          position: 'left',
          label: 'Start State Gallery',
          to: '/start-state-gallery',
        },
        {
          position: 'left',
          label: 'Project Gallery',
          to: '/project-gallery',
        },
        {
          href: 'https://github.com/Yesy01',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Workshop',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Makerspace Ashoka',
              href: 'https://www.ashoka.edu.in/digital-makerspace/',
            },
            {
              label: 'Email',
              href: 'mailto:yesirat.sanni_ug2023@ashoka.edu.in',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Yesy01',
            },
          ],
        },
        {
          title: 'Contributors',
          items: [
            {
              html: '<a class="footer-contributor-link" href="https://yesy01.github.io/YesiratSanni/" target="_blank" rel="noopener noreferrer"><span class="footer-contributor-name">Yesirat Adesola Sanni</span><span class="footer-contributor-icon" aria-hidden="true">↗</span></a>',
            },
            {
              html: '<span class="footer-contributor-text">Kanishka Girish Shetty</span>',
            },
          ],
        },
      ],
      copyright: '<span class="footer-copyright-placeholder" aria-hidden="true">&nbsp;</span>',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
