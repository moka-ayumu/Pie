import { fs, path } from "@tauri-apps/api";
import { get, writable } from "svelte/store";

export class Shortcuts {
  data: [string, string, string[]][];
  constructor() {
    this.data = [];
  }
  add(name: string, shortcut: string[], icon?: string) {
    shortcutStore.update((store) => {
      this.data.push([name, icon, shortcut]);
      return store;
    });
  }
  edit(i: number, name?: string, shortcut?: string[], icon?: string) {
    shortcutStore.update((store) => {
      if (name !== undefined) this.data[i][0] = name;
      if (shortcut !== undefined) this.data[i][2] = shortcut;
      if (icon !== undefined) this.data[i][1] = icon;
      return store;
    });
  }
  remove(e: number) {
    shortcutStore.update((store) => {
      this.data.splice(e, 1);
      return store;
    });
  }
}

export const shortcutStore = writable({
  default: new Shortcuts(),
});

const defaultTheme = {
  default: "#F28DB2",
  unselected: "#F2AEC7",
  selected: "#F22771",
  text: {
    color: "#F2F2F2",
    size: 12,
  },
  windowsize: [190, 190],
  thickness: 30,
  radius: 30,
  followThickness: 5,
  followRadius: undefined,
};

export type Ttheme = typeof defaultTheme;

export const themeStore = writable({ ...defaultTheme, text: { ...defaultTheme.text } });

export function resetTheme() {
  themeStore.set({ ...defaultTheme, text: { ...defaultTheme.text } });
}

let appDir = "";

export async function read() {
  return new Promise((resolve, reject) => {
    if (appDir === "") {
      path.appDir().then((v) => {
        appDir = v;
        next();
      });
    } else next();

    function next() {
      fs.readTextFile(`${appDir}settings.json`).then((v) => {
        const settings = JSON.parse(v);
        const shortcuts = Object.entries(settings.shortcuts);
        const readStore = {
          default: new Shortcuts(),
        };
        for (let i = 0; i < shortcuts.length; i++) {
          const shortcut = shortcuts[i] as [string, [string, string, string[]][]];
          if (!readStore.hasOwnProperty(shortcut[0])) {
            readStore[shortcut[0]] = new Shortcuts();
          }
          for (let i = 0; i < shortcut[1].length; i++) {
            const item = shortcut[1][i];
            readStore[shortcut[0]].add(item[0], item[2], item[1]);
          }
        }
        shortcutStore.set(readStore);
        themeStore.set(settings.theme);
        resolve("");
      });
    }
  });
}

export function save() {
  const res = {
    shortcuts: {},
    theme: get(themeStore),
  };
  const shortcuts = Object.entries(get(shortcutStore));

  for (let i = 0; i < shortcuts.length; i++) {
    const shortcut = shortcuts[i];
    res.shortcuts[shortcut[0]] = shortcut[1].data;
  }

  if (appDir === "") {
    path.appDir().then((v) => {
      appDir = v;
      chkAppDir();
    });
  } else chkAppDir();

  function chkAppDir() {
    fs.createDir(appDir, { recursive: true }).then(() => {
      fs.writeFile({ contents: JSON.stringify(res, null, 2), path: `${appDir}settings.json` });
    });
  }
}
