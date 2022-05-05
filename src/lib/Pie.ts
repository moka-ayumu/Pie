import { getAll, WebviewWindow } from "@tauri-apps/api/window";
import { get } from "svelte/store";
import { Shortcuts, shortcutStore, themeStore } from "./Store";

export function drawPie(
  canvas: HTMLCanvasElement,
  shortcuts: Shortcuts["data"],
  x: number,
  y: number,
  width = get(themeStore).windowsize[0],
  height = get(themeStore).windowsize[1],
  thickness: number = get(themeStore).thickness,
  radius: number = get(themeStore).radius,
  followThickness: number = get(themeStore).followThickness,
  followRadius: number = get(themeStore).followRadius === undefined
    ? positive(radius - thickness / 2 - followThickness)
    : get(themeStore).followRadius
) {
  let angle = -Math.atan2(y, x);
  let selectedAngle = (Math.PI * 2) / shortcuts.length;
  let selected = Math.floor((angle + Math.PI) / selectedAngle);
  const theme = get(themeStore);
  const center = [width / 2, height / 2];
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (shortcuts.length > 0) {
      ctx.lineWidth = thickness;
      ctx.strokeStyle = theme.unselected;
      ctx.beginPath();
      ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < shortcuts.length; i++) {
        const element = shortcuts[i];
        if (selected === i) {
          ctx.strokeStyle = theme.selected;
          ctx.beginPath();
          ctx.arc(center[0], center[1], radius, Math.PI + selectedAngle * i, Math.PI + selectedAngle * (i + 1));
          ctx.stroke();
        }
        const txtpos = calCenter(
          Math.PI + selectedAngle * (i + 0.5),
          positive(radius - thickness / 2),
          radius + thickness / 2
        );
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = `${theme.text.size}px IBM Plex Sans, IBM Plex Sans KR`;
        ctx.fillStyle = theme.text.color;
        ctx.fillText(element[0], txtpos[0] + center[0], txtpos[1] + center[1]);
      }
    }

    ctx.strokeStyle = theme.unselected;
    ctx.lineWidth = followThickness;
    ctx.beginPath();
    ctx.arc(center[0], center[1], followRadius, angle - 0.5, angle + 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + center[0], -y + center[1], 5, 0, 10);
    ctx.fillStyle = theme.default;
    ctx.fill();
  }
  return selected;
}

function calCenter(theta: number, r: number, mr: number = 0) {
  const a = getroundxy(theta, r);
  if (mr === 0) return a;
  else {
    const b = getroundxy(theta, mr);
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  }
}

export function getroundxy(theta: number, r: number) {
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

export function getPie() {
  let pie = getAll().find((v) => v.label === "piefront");
  if (pie === undefined) {
    pie = new WebviewWindow("piefront");
    pie.emit("update", { shortcuts: get(shortcutStore).default.data });
    pie.emit("updateTheme", { theme: get(themeStore) });
  }
  return pie;
}

function positive(num: number) {
  return num < 0 ? 0 : num;
}
