import observeElement from '../utils/observeElement';
import { log } from '../utils/log';
import getCurrentUserConfig from '../utils/getCurrentUserConfig';
import insertEditor from '../utils/insertEditor';

const pluginSlug = 'QuickReply';

const barIconClick = async () => {
  let [_, currentConfig, __] = await getCurrentUserConfig();

  if(document.getElementsByClassName('quickReply-reply-list').length == 0){
    const replyList = document.createElement('div');
    replyList.classList.add('quickReply-reply-list');
    currentConfig.messages.forEach((msg) => {
      const btn = document.createElement('button');
      btn.classList.add('quickReply-reply-list-button');
      btn.innerText = msg;
      btn.onclick = (e) => {
        insertEditor((e.target! as HTMLButtonElement).innerText);
        document.getElementsByClassName('quickReply-bar')[0].removeChild(replyList);
      };
      replyList.appendChild(btn);
    });
    document.getElementsByClassName('quickReply-bar')[0].appendChild(replyList);
    log('创建快捷回复语列表完成');
  }
  else document.getElementsByClassName('quickReply-bar')[0].removeChild(document.getElementsByClassName('quickReply-reply-list')[0]);
};

const onMessageLoad = async () => {
  const iconSvg = await (await fetch(`local:///${LiteLoader.plugins[pluginSlug].path.plugin}/assets/barIcon.svg`)).text();
  const qTooltips = document.createElement('div');
  const qTooltipsContent = document.createElement('div');
  const icon = document.createElement('i');
  const barIcon = document.createElement('div');
  
  barIcon.classList.add('quickReply-bar');
  barIcon.appendChild(qTooltips);
  
  qTooltips.classList.add('quickReply-q-tooltips');
  qTooltips.addEventListener('click', barIconClick);
  qTooltips.appendChild(icon);
  qTooltips.appendChild(qTooltipsContent);
  
  qTooltipsContent.classList.add('quickReply-q-tooltips__content');
  qTooltipsContent.innerText = '快捷回复';
  
  icon.classList.add('quickReply-q-icon');
  icon.innerHTML = iconSvg;

  document.querySelector('.chat-func-bar')!.lastElementChild!.appendChild(barIcon);
  log('创建工具栏图标完成');
};

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = `local:///${LiteLoader.plugins[pluginSlug].path.plugin}/style/global.css`;
document.head.appendChild(style);
log('获取样式文件完成');

document.onkeydown = async (e) => {
  const key = e.key;
  // 监听快捷键
  // 添加回复语
  // 大小写需要同时监听
  if((key == 'a' || key == 'A') && e.altKey){
    const selected = window.getSelection()?.toString();
    if(selected){
      let [userConfig, currentConfig, currentConfigIndex] = await getCurrentUserConfig();
      currentConfig.messages.push(selected);
      userConfig.data[currentConfigIndex] = currentConfig;
      await LiteLoader.api.config.set(pluginSlug, userConfig);
    }
  }
};

// 顶排数字键无keydown事件
document.onkeyup = async (e) => {
  // 快捷插入前9个回复语
  const key = e.key;
  if(LiteLoader.os.platform == 'darwin' ? e.metaKey : e.ctrlKey && !isNaN(Number(key))){
    let keyNumber: number = Number(key);
    if(keyNumber > 0 && keyNumber <= 9){
      let [_, currentConfig, __] = await getCurrentUserConfig();
      if(keyNumber <= currentConfig.messages.length) insertEditor(currentConfig.messages[keyNumber - 1]);
    }
  }
};

observeElement('.chat-func-bar', () => {
  if(document.getElementsByClassName('quickReply-bar').length == 0) onMessageLoad();
}, true);

export const onSettingWindowCreated = async (view: HTMLElement) => {
  let [userConfig, currentConfig, currentConfigIndex] = await getCurrentUserConfig();
  view.innerHTML = await (await fetch(`local:///${LiteLoader.plugins[pluginSlug].path.plugin}/pages/settings.html`)).text();

  (view.querySelector('#pluginVersion') as HTMLParagraphElement).innerHTML = LiteLoader.plugins[pluginSlug].manifest.version;
  (view.querySelector('#setReplies') as HTMLTextAreaElement).value = currentConfig.messages.join('\r\n');

  (view.querySelector('#setReplies') as HTMLTextAreaElement).addEventListener('change', async () => {
    // 换行分割
    let replies = (view.querySelector('#setReplies') as HTMLTextAreaElement).value.split(/[(\r\n)\r\n]+/);
    // 忽略空项
    replies.forEach((reply, index) => {
      if(!reply) replies.splice(index, 1);
    });
    currentConfig.messages = replies;
    userConfig.data[currentConfigIndex] = currentConfig;
    await LiteLoader.api.config.set(pluginSlug, userConfig);
  });

  (view.querySelector('#github') as HTMLButtonElement).addEventListener('click', () => {
    LiteLoader.api.openExternal('https://github.com/adproqwq/LiteLoaderQQNT-QuickReply');
  });
};