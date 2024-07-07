export default (): string => {
  return window.app?.__vue_app__?.config?.globalProperties?.$store?.state?.common_Auth?.authData?.uin;
};