import { QQNTEditorElement } from '../types/QQNTEditorElement';
import { log } from './log';

// From LLAPI
export default (text: string) => {
  const ckeditor = document.querySelector('.ck.ck-content.ck-editor__editable')! as QQNTEditorElement;
  const ckeditorInstance = ckeditor.ckeditorInstance;
  const editorModel = ckeditorInstance.model; // 获取编辑器的 model
  const editorSelection = editorModel.document.selection; // 获取光标的当前选择
  const position = editorSelection.getFirstPosition(); // 获取当前光标的位置
  editorModel.change((writer) => {
    const emojiElement = text;
    writer.insert(emojiElement, position);
    log('插入输入框完成');
  });
};