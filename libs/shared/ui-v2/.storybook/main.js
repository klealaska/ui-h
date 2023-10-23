const rootMain = require('../../../../.storybook/main');
const path = require('path');
module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack5' },

  features: { buildStoriesJson: true }, // added for zeroheight integration

  stories: [
    './wiki/*.stories.mdx',
    './components/*.stories.@(js|jsx|ts|tsx)',
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    // add your own webpack tweaks if needed
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('tailwindcss'), require('autoprefixer')],
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../../../'),
    });

    return config;
  },

  staticDirs: ['../src/lib/assets'],
};
