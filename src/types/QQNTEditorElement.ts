// 使程序不报错，不严谨、不完整
export interface QQNTEditorElement extends HTMLTextAreaElement {
  ckeditorInstance: CkeditorInstance;

};

interface CkeditorInstance {
  model: CkeditorInstanceModel;
};

interface CkeditorInstanceModel {
  document: {
    selection: CkeditorInstanceModelDocumentSelection;
  };
  change: (callback: (any) => void) => void;
};

interface CkeditorInstanceModelDocumentSelection {
  getFirstPosition: () => number;
};