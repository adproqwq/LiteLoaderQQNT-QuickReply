import { IConfig, ISettingConfig, config } from '../config/config';
import observeElement from '../utils/observeElement';
import getUin from '../utils/getUin';
import { QQNTEditorElement } from '../types/QQNTEditorElement';

const pluginSlug = 'QuickReply';

const getUserConfig = async (): Promise<[IConfig, ISettingConfig, number]> => {
  let userConfig: IConfig = await LiteLoader.api.config.get(pluginSlug, config);
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

  return [userConfig, currentConfig, currentConfigIndex];
};

const barIconClick = async () => {
  let [_, currentConfig, __] = await getUserConfig();
  const editorInsert = (text: string) => {
    const ckeditorInstance = (document.querySelector('.ck.ck-content.ck-editor__editable')! as QQNTEditorElement).ckeditorInstance;
    const editorModel = ckeditorInstance.model; // 获取编辑器的 model
    const editorSelection = editorModel.document.selection; // 获取光标的当前选择
    const position = editorSelection.getFirstPosition(); // 获取当前光标的位置
    editorModel.change((writer) => {
      const emojiElement = text;
      writer.insert(emojiElement, position);
    });
  };

  const replyList = document.createElement('div');
  replyList.classList.add('quickReply-reply-list');
  currentConfig.messages.forEach((msg) => {
    const btn = document.createElement('button');
    btn.classList.add('quickReply-reply-list-button');
    btn.innerText = msg;
    btn.onclick = (e) => {
      editorInsert((e.target! as HTMLButtonElement).innerText);
      document.getElementsByClassName('quickReply-bar')[0].removeChild(replyList);
    };
    replyList.appendChild(btn);
  });
  document.getElementsByClassName('quickReply-bar')[0].appendChild(replyList);
};

observeElement('.chat-func-bar', () => {
  if(document.getElementsByClassName('quickReply-bar').length == 0) onMessageLoad();
}, true);

const onMessageLoad = () => {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = `local:///${LiteLoader.plugins[pluginSlug].path.plugin}/style/replyList.css`;
  document.head.appendChild(style);
  
  const iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m5.921 11.5l3.746 3.746q.147.146.153.344q.007.199-.158.364q-.166.16-.354.162q-.189.003-.354-.162l-4.389-4.389q-.242-.242-.242-.565t.243-.565l4.388-4.389q.14-.14.341-.15t.366.15q.166.165.166.357t-.165.357l-3.74 3.74H15.5q1.864 0 3.182 1.318T20 15v2.5q0 .214-.143.357T19.5 18t-.357-.143T19 17.5V15q0-1.442-1.029-2.471T15.5 11.5z"/></svg>';
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
};