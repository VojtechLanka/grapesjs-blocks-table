export default ({ config }) => {
  // This is how you can distinguish the `build` command from the `serve`
  const isBuild = config.mode === 'production';

  config.output.filename = 'grapesjs-blocks-table.min.js';

  return config;
}
