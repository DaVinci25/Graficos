import{fu as a,fv as i,fw as c,fx as d,fy as f}from"./index-C-PTO5zq.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const w=()=>{const e=window;e.addEventListener("statusTap",()=>{a(()=>{const o=e.innerWidth,s=e.innerHeight,n=document.elementFromPoint(o/2,s/2);if(!n)return;const t=i(n);t&&new Promise(r=>c(t,r)).then(()=>{d(async()=>{t.style.setProperty("--overflow","hidden"),await f(t,300),t.style.removeProperty("--overflow")})})})})};export{w as startStatusTap};
