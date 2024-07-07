import { app } from 'electron';

const pluginSlug = 'QuickReply';

app.whenReady().then(async () => {
  const mirrors: ILLCUMMirror[] = [
    {
      type: 'total',
      domain: 'https://mirror.ghproxy.com',
    },
  ];
  LiteLoader.api.useMirrors(pluginSlug, mirrors);
  if(await LiteLoader.api.checkUpdate(pluginSlug)){
    if(await LiteLoader.api.downloadUpdate(pluginSlug)) await LiteLoader.api.showRelaunchDialog(pluginSlug, true);
  }
});