const path = require('path');

// ref: https://umijs.org/config/
export default {
  targets: {
    ie: 9,
    android: 6,
    ios: 7,
  },
  hash: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dll: true,
      fastClick: true,
      dynamicImport: true,
      routes: {
        exclude: [
          /model.js/,
          /service.js/,
          /components/,
        ],
      },
      hardSource: false,
    }],
  ],
  alias: {
    'components': path.resolve(__dirname, 'src/components/'),
    'layouts': path.resolve(__dirname, 'src/layouts/'),
    'models': path.resolve(__dirname, 'src/models/'),
    'pages': path.resolve(__dirname, 'src/pages/'),
    'utils': path.resolve(__dirname, 'src/utils/'),
    'common': path.resolve(__dirname, 'src/common/'),
    'assets': path.resolve(__dirname, 'src/assets/'),
  },
}
