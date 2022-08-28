export const getDefaultDarkmodeSetting = () => {
  const localStorageValue = localStorage.getItem("color-setting");
  if (localStorageValue) {
    return localStorageValue === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
