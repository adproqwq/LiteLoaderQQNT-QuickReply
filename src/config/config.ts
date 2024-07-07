export const config: IConfig = {
  data: [
    {
      uin: '-1',
      messages: [],
    },
  ],
};

export interface ISettingConfig {
  uin: string;

  messages: string[];
};

export interface IConfig {
  data: ISettingConfig[];
};