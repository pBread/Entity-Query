import t from"lodash.difference";import n from"lodash.intersection";import r from"lodash.isplainobject";import e from"lodash.mergewith";function u(){return(u=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(t[e]=r[e])}return t}).apply(this,arguments)}function c(t,n){return(c=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function o(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function i(t,n,r){return(i=o()?Reflect.construct:function(t,n,r){var e=[null];e.push.apply(e,n);var u=new(Function.bind.apply(t,e));return r&&c(u,r.prototype),u}).apply(null,arguments)}var f=Symbol(),a=new WeakMap;function l(t){return{filter:function(n,r){return p(t,n,s(r)).map(function(n){return t[n]})},search:function(n,r){return p(t,n,s(r))}}}function p(c,o,l){if(void 0===o&&(o=f),o===f)return Object.keys(c);var p,s=a.get(c)||a.set(c,(p=c,Object.values(p).flatMap(function(t){return function(t){return function t(n,e){var u=function(t,n){if(null==t)return{};var r,e,u={},c=Object.keys(t);for(e=0;e<c.length;e++)n.indexOf(r=c[e])>=0||(u[r]=t[r]);return u}(n,["id"]);return Object.entries(u).flatMap(function(n){var u=n[0],c=n[1];return r(c)?t(c,d(u,e)):d(u+"__."+c,e)})}(t).map(function(n){return function(t,n){return n.reduceRight(function(r,e,u){var c,o;return n.length-1<=u?((c={})[e]=t,c):((o={})[e]=r,o)},{})}([t.id],n.split("__."))})}(t)}).reduce(function(t,n){return e(t,n,function(t,n){if(Array.isArray(t))return t.concat(n)})},{}))).get(c),O=(Array.isArray(o)?o:[o]).map(function(t){return function(t,e){return n.apply(void 0,function t(n,e){return Object.keys(n).flatMap(function(u){var c;return r(n[u])?t(n[u],d(u,e)):((c={})[d(u,e)]=n[u],c)})}(e).map(function(n){return function t(n,r,e){if(!r.length)return y(e)?v(n,h(e)).map(function(t){return n[t]}).flat():n[""+e];var c,o=r[0],i=r.slice(1);if(y(o)){var f=v(n,h(o));if(!f.length)return[];c=f.reduce(function(t,r){return u({},t,n[r]||{})},{})}else c=n[o];return c?t(c,i,e):[]}(t,Object.keys(n)[0].split("__."),Object.values(n)[0])}))}(s,t)});switch(l.conditions){case"all":return n.apply(void 0,O);case"any":return[].concat(i(Set,O));case"diff":return O.length>=2?t.apply(void 0,[O[0]].concat(O.slice(1))):[];case"none":return t.apply(void 0,[Object.keys(c)].concat(O));default:return n.apply(void 0,O)}}function s(t){return{conditions:null==t?void 0:t.conditions}}function y(t){try{return"string"==typeof t&&!!h(t)}catch(t){return!1}}function d(t,n){return void 0===n&&(n=f),n===f?""+t:n+"__."+t}function v(t,n){return Object.keys(t).filter(function(t){return n.test(t)})}function h(t){var n=t.slice(1,t.lastIndexOf("/")),r=t.slice(t.lastIndexOf("/")+1);return new RegExp(n,r)}export{l as EntityQuery};
//# sourceMappingURL=index.esm.js.map