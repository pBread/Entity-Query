import t from"lodash.difference";import e from"lodash.intersection";import n from"lodash.isplainobject";import r from"lodash.mergewith";function i(){return(i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}const c=Symbol(),o=new WeakMap;function u(t){return{filter:(e,n)=>a(t,e,s(n)).map(e=>t[e]),search:(e,n)=>a(t,e,s(n))}}function a(u,a=c,s){if(a===c)return Object.keys(u);const h=o.get(u)||o.set(u,(y=u,Object.values(y).flatMap(t=>function(t){return function t(e,r){let i=function(t,e){if(null==t)return{};var n,r,i={},c=Object.keys(t);for(r=0;r<c.length;r++)e.indexOf(n=c[r])>=0||(i[n]=t[n]);return i}(e,["id"]);return Object.entries(i).flatMap(([e,i])=>n(i)?t(i,l(e,r)):l(`${e}__.${i}`,r))}(t).map(e=>function(t,e){return e.reduceRight((n,r,i)=>e.length-1<=i?{[r]:t}:{[r]:n},{})}([t.id],e.split("__.")))}(t)).reduce((t,e)=>r(t,e,(t,e)=>{if(Array.isArray(t))return t.concat(e)}),{}))).get(u);var y;const m=(Array.isArray(a)?a:[a]).map(t=>function(t,r){return e(...function t(e,r){return Object.keys(e).flatMap(i=>n(e[i])?t(e[i],l(i,r)):{[l(i,r)]:e[i]})}(r).map(e=>function t(e,n,r){if(!n.length)return f(r)?p(e,d(r)).map(t=>e[t]).flat():e[""+r];const[c,...o]=n;let u;if(f(c)){const t=p(e,d(c));if(!t.length)return[];u=t.reduce((t,n)=>i({},t,e[n]||{}),{})}else u=e[c];return u?t(u,o,r):[]}(t,Object.keys(e)[0].split("__."),Object.values(e)[0])))}(h,t));switch(s.conditions){case"all":return e(...m);case"any":return[...new Set(...m)];case"diff":return m.length>=2?t(m[0],...m.slice(1)):[];case"none":return t(Object.keys(u),...m);default:return e(...m)}}function s(t){return{conditions:null==t?void 0:t.conditions}}function f(t){try{return"string"==typeof t&&!!d(t)}catch(t){return!1}}function l(t,e=c){return e===c?""+t:`${e}__.${t}`}function p(t,e){return Object.keys(t).filter(t=>e.test(t))}function d(t){const e=t.slice(1,t.lastIndexOf("/")),n=t.slice(t.lastIndexOf("/")+1);return new RegExp(e,n)}export default u;export{u as EntityQuery};
//# sourceMappingURL=index.modern.js.map
