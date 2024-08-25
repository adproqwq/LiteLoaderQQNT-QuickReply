import { IConfig, ISettingConfig } from '../config/config';

export default async (rawReplies: string, userConfig: IConfig, currentConfig: ISettingConfig, currentConfigIndex: number) => {
  const replyBlocks = rawReplies.split(']]');

  const replies: string[] = [];
  replyBlocks.forEach((replyBlock) => {
    if(!replyBlock) return;

    if(replyBlock.startsWith('\n')){
      let splitedReplyBlock = replyBlock.split('\n');
      for(let i = 0;i < splitedReplyBlock.length;i++){
        if(!splitedReplyBlock[i]) continue;
        else splitedReplyBlock = splitedReplyBlock.slice(i);
      }
      replyBlock = splitedReplyBlock.join('\n');
    }

    if(replyBlock.startsWith('[[')) replies.push(replyBlock.slice(2));
  });

  currentConfig.messages = replies;
  userConfig.data[currentConfigIndex] = currentConfig;
  await LiteLoader.api.config.set('QuickReply', userConfig);
};