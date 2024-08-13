import { IConfig, ISettingConfig } from '../config/config';

export default async (rawReplies: string, userConfig: IConfig, currentConfig: ISettingConfig, currentConfigIndex: number) => {
  const replyBlocks = rawReplies.split(']]');

  const replies: string[] = [];
  replyBlocks.forEach((replyBlock) => {
    if(!replyBlock) return;
    if(replyBlock.startsWith('\n')){
      let splitedReplyBlock = replyBlock.split('\n');
      while(!splitedReplyBlock[0]){
        splitedReplyBlock = splitedReplyBlock.slice(1);
      }
      replyBlock = splitedReplyBlock.join('\n');
      console.log(replyBlock);
    }
    if(replyBlock.startsWith('[[')) replies.push(replyBlock.slice(2));
  });

  currentConfig.messages = replies;
  userConfig.data[currentConfigIndex] = currentConfig;
  await LiteLoader.api.config.set('QuickReply', userConfig);
};