/// <reference types="vite/client" />

declare interface ILiteLoaderManifestConfig {
  manifest_version: 4;

  type?: 'extension' | 'theme' | 'framework';

  name: string;

  slug: string;

  description: string;

  version: string;

  icon?: string | null;

  thumb?: string | null;

  authors: ILiteLoaderManifestAuthorsConfig[];

  dependencies?: string[];

  platform: [
    'win32'?,
    'linux'?,
    'darwin'?,
  ];

  injects: {
    main?: string;

    preload?: string;

    renderer?: string;
  };

  repository?: {
    repo: string;

    branch: string;

    release?: {
      tag: string;

      file?: string;
    }
  };
}

declare interface ILiteLoaderManifestAuthorsConfig {
  name: string;

  link: string;
}

declare interface ILLCUMMirror {
  type: 'total' | 'domain' | 'off';
  domain: string;
}

declare namespace LiteLoader {
  const path: ILiteLoaderPath;
  const versions: ILiteLoaderVersion;
  const os: ILiteLoaderOS;
  const package: ILiteLoaderPackage;
  const config: {
    LiteLoader: {
      disabled_plugins: string[],
    }
  };
  const plugins: Record<string, ILiteLoaderPlugin>;
  const api: ILiteLoaderAPI;

  interface ILiteLoaderPath {
    root: string,
    profile: string,
    data: string,
    plugins: string,
  }

  interface ILiteLoaderVersion {
    qqnt: string,
    liteloader: string,
    node: string,
    chrome: string,
    electron: string,
  }

  interface ILiteLoaderOS {
    platform: 'win32' | 'linux' | 'darwin',
  }

  interface ILiteLoaderPackage {
    liteloader: object,
    qqnt: object,
  }

  interface ILiteLoaderPlugin {
    manifest: ILiteLoaderManifestConfig,
    incompatible: boolean,
    disabled: boolean,
    path: ILiteLoaderPluginPath
  }

  interface ILiteLoaderPluginPath {
    plugin: string,
    data: string,
    injects: ILiteLoaderPluginPathInject
  }

  interface ILiteLoaderPluginPathInject {
    main: string,
    renderer: string,
    preload: string,
  }

  interface ILiteLoaderAPI {
    openPath: (path: string) => void,
    openExternal: (url: string) => void,
    disablePlugin: (slug: string) => void,
    useMirrors: (slug: string, mirrors: ILLCUMMirror[]) => void,
    checkUpdate: (slug: string, type?: string) => Promise<boolean | null>,
    downloadUpdate: (slug: string, url?: string) => Promise<boolean | null>,
    showRelaunchDialog: (slug: string, showChangeLog?: boolean, changeLogFile?: string) => Promise<void>,
    config: ILiteLoaderAPIConfig,
  }

  interface ILiteLoaderAPIConfig {
    set: <IConfig = unknown>(slug: string, new_config: IConfig) => boolean,
    get: <IConfig = unknown>(slug: string, default_config?: IConfig) => IConfig | Promise<IConfig>,
  }
}

interface Window {
  app: AppElement;
}

interface AppElement extends HTMLDivElement {
  __vue_app__?: any;
}