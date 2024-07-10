import { IConfig, ISettingConfig, config } from '../config/config';
import getUin from './getUin';
import { log } from './log';

export default async (): Promise<[IConfig, ISettingConfig, number]> => {
  const pluginSlug = 'QuickReply';
  let userConfig = await LiteLoader.api.config.get(pluginSlug, config);
  let currentConfigIndex = -1;
  const uin = getUin();
  userConfig.data.forEach((c, i) => {
    if(c.uin == uin) currentConfigIndex = i;
  });
  let currentConfig: ISettingConfig;
  if(currentConfigIndex == -1){
    let newUserConfig = config.data[0];
    newUserConfig.uin = uin;
    userConfig.data.push(newUserConfig);
    await LiteLoader.api.config.set(pluginSlug, userConfig);
    currentConfig = newUserConfig;
    currentConfigIndex = userConfig.data.length - 1;
  }
  else currentConfig = userConfig.data[currentConfigIndex];

  log('获取当前账号配置完成');
  return [userConfig, currentConfig, currentConfigIndex];
};