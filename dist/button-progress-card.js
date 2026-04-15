/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const CARD_VERSION = "1.0.0";
const CARD_TAG_NAME = "button-progress-card";
const EDITOR_TAG_NAME = "button-progress-card-editor";
const TIMER_DOMAIN = "timer";
const NUMERIC_DOMAINS = ["input_number", "number", "counter", "sensor"];
const DEFAULT_CONFIG = {
    name: "",
    icon: "",
    bar_color: "var(--accent-color)",
    bar_height: 4,
    reverse: true,
    bar_min: 0,
    bar_max: 100,
    tap_action: { action: "toggle" },
    hold_action: { action: "more-info" },
    double_tap_action: { action: "none" },
};
const HOLD_THRESHOLD_MS = 500;
const DOUBLE_TAP_THRESHOLD_MS = 300;
const DOMAIN_ICON_MAP = {
    light: "mdi:lightbulb",
    switch: "mdi:toggle-switch",
    input_boolean: "mdi:checkbox-marked-circle",
    fan: "mdi:fan",
    media_player: "mdi:cast",
    climate: "mdi:thermostat",
    cover: "mdi:window-shutter",
    lock: "mdi:lock",
    vacuum: "mdi:robot-vacuum",
    automation: "mdi:robot",
    script: "mdi:script-text",
};
const ON_STATES = ["on", "active", "playing", "open", "unlocked", "home"];

/**
 * Returns true if the entity ID belongs to the timer domain.
 *
 * @param entityId - The full entity ID string
 * @returns Whether the entity is a timer
 */
function isTimerEntity(entityId) {
    return entityId.split(".")[0] === TIMER_DOMAIN;
}
/**
 * Returns true if the entity ID belongs to a supported numeric domain.
 *
 * @param entityId - The full entity ID string
 * @returns Whether the entity is numeric
 */
function isNumericEntity(entityId) {
    const domain = entityId.split(".")[0];
    return NUMERIC_DOMAINS.includes(domain);
}
/**
 * Returns true if the given entity state represents an active/on condition.
 *
 * @param state - The entity state string
 * @returns Whether the entity is considered active
 */
function isEntityActive(state) {
    return ON_STATES.includes(state);
}
/**
 * Derives a default MDI icon string from an entity state object based on its domain.
 *
 * @param entityState - The HA entity state object
 * @returns An MDI icon string
 */
function deriveDefaultIcon(entityState) {
    const domain = entityState.entity_id.split(".")[0];
    return DOMAIN_ICON_MAP[domain] ?? "mdi:power";
}
/**
 * Resolves a HA action config and fires the appropriate event or service call.
 *
 * @param element - The card element to dispatch events from
 * @param hass - The Home Assistant object
 * @param config - The full card config
 * @param action - The action config to execute
 */
function handleAction(element, hass, config, action) {
    if (!action || action.action === "none")
        return;
    switch (action.action) {
        case "toggle":
            hass.callService("homeassistant", "toggle", { entity_id: config.entity });
            break;
        case "more-info":
            element.dispatchEvent(new CustomEvent("hass-more-info", {
                bubbles: true,
                composed: true,
                detail: { entityId: config.entity },
            }));
            break;
        case "call-service":
        case "perform-action": {
            const serviceAction = action.perform_action ?? action.service;
            if (!serviceAction)
                return;
            const [domain, service] = serviceAction.split(".");
            hass.callService(domain, service, action.target ?? action.service_data ?? {});
            break;
        }
        case "navigate":
            if (action.navigation_path) {
                window.history.pushState(null, "", action.navigation_path);
                window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
            }
            break;
        case "url":
            if (action.url_path) {
                window.open(action.url_path);
            }
            break;
    }
}
/**
 * Parses a timer duration string in HH:MM:SS format into milliseconds.
 *
 * @param duration - Duration string in HH:MM:SS format
 * @returns Duration in milliseconds
 */
function parseDurationToMs(duration) {
    const parts = duration.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN))
        return 0;
    const [hours, minutes, seconds] = parts;
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Config editor element for button-progress-card.
 * Renders the HA form schema used in the Lovelace card editor UI.
 */
class ButtonProgressCardEditor extends i {
    constructor() {
        super(...arguments);
        this._schema = [
            {
                name: "entity",
                selector: { entity: {} },
            },
            {
                name: "name",
                selector: { text: {} },
            },
            {
                name: "icon",
                selector: { icon: {} },
            },
            {
                name: "timer_entity",
                selector: { entity: {} },
            },
            {
                name: "bar_color",
                selector: { text: {} },
            },
            {
                name: "bar_height",
                selector: { number: { min: 1, max: 20, mode: "slider" } },
            },
            {
                name: "reverse",
                selector: { boolean: {} },
            },
            {
                name: "bar_min",
                selector: { number: { mode: "box" } },
            },
            {
                name: "bar_max",
                selector: { number: { mode: "box" } },
            },
            {
                name: "tap_action",
                selector: { ui_action: {} },
            },
            {
                name: "hold_action",
                selector: { ui_action: {} },
            },
            {
                name: "double_tap_action",
                selector: { ui_action: {} },
            },
        ];
        this._computeLabel = (schema) => {
            const labels = {
                entity: "Entity",
                name: "Name",
                icon: "Icon",
                timer_entity: "Progress bar entity (timer or numeric)",
                bar_color: "Bar color",
                bar_height: "Bar height (px)",
                reverse: "Reverse bar direction (full → empty)",
                bar_min: "Bar minimum value (numeric entities)",
                bar_max: "Bar maximum value (numeric entities)",
                tap_action: "Tap action",
                hold_action: "Hold action",
                double_tap_action: "Double tap action",
            };
            return labels[schema.name] ?? schema.name;
        };
        this._computeHelper = (schema) => {
            const helpers = {
                entity: "The entity this button controls.",
                name: "Display name. Leave empty to use the entity friendly name.",
                icon: "Icon to display. Leave empty to use the entity default icon.",
                timer_entity: "Optional. A timer.* entity for animated countdown, or a numeric entity (input_number, number, counter, sensor) for value-based progress.",
                bar_color: "CSS color value for the progress bar. Default: var(--accent-color).",
                bar_height: "Height of the progress bar in pixels.",
                reverse: "When enabled the bar starts full and shrinks (countdown). When disabled the bar starts empty and grows.",
                bar_min: "Minimum value for numeric entity progress bar. Used if the entity does not expose a min attribute.",
                bar_max: "Maximum value for numeric entity progress bar. Used if the entity does not expose a max attribute.",
                tap_action: "Action to perform on single tap.",
                hold_action: "Action to perform on long press.",
                double_tap_action: "Action to perform on double tap.",
            };
            return helpers[schema.name];
        };
    }
    /**
     * Sets the card configuration for the editor.
     *
     * @param config - The current card configuration
     */
    setConfig(config) {
        this._config = config;
    }
    /**
     * Handles config change events from the HA form and dispatches
     * a config-changed event to notify the Lovelace editor.
     *
     * @param event - The config-changed custom event from ha-form
     */
    _onConfigChanged(event) {
        event.stopPropagation();
        const updatedConfig = {
            ...this._config,
            ...event.detail.value,
        };
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: updatedConfig },
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (!this.hass || !this._config)
            return b ``;
        return b `
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._onConfigChanged}
      ></ha-form>
    `;
    }
}
ButtonProgressCardEditor.styles = i$3 `
    :host {
      display: block;
    }
  `;
__decorate([
    n({ attribute: false })
], ButtonProgressCardEditor.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], ButtonProgressCardEditor.prototype, "_config", void 0);
if (!customElements.get(EDITOR_TAG_NAME)) {
    customElements.define(EDITOR_TAG_NAME, ButtonProgressCardEditor);
}

/**
 * ButtonProgressCard — A generic toggle button with an optional animated
 * progress bar driven by a timer or numeric entity.
 */
class ButtonProgressCard extends i {
    constructor() {
        super(...arguments);
        this._progressPercentage = 0;
        this._barVisible = false;
        this._animationFrameId = null;
        this._pressTimer = null;
        this._lastTapTime = 0;
        this._holdFired = false;
    }
    /**
     * Sets the card configuration, merging with defaults.
     *
     * @param config - The user-provided card configuration
     */
    setConfig(config) {
        if (!config.entity) {
            throw new Error("entity is required");
        }
        this._config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Returns the editor element tag name for the Lovelace UI editor.
     */
    static getConfigElement() {
        return document.createElement(EDITOR_TAG_NAME);
    }
    /**
     * Returns a stub config for the card picker preview.
     */
    static getStubConfig() {
        return {
            entity: "light.example",
            timer_entity: "",
            name: "",
            icon: "",
            bar_color: "var(--accent-color)",
            bar_height: 4,
            reverse: true,
            bar_min: 0,
            bar_max: 100,
            tap_action: { action: "toggle" },
            hold_action: { action: "more-info" },
            double_tap_action: { action: "none" },
        };
    }
    updated(changedProperties) {
        if (changedProperties.has("hass")) {
            this._updateProgressBar();
        }
    }
    /**
     * Evaluates the progress bar entity and delegates to the appropriate
     * update handler based on entity domain.
     */
    _updateProgressBar() {
        const timerEntityId = this._config?.timer_entity;
        if (!timerEntityId || !this.hass) {
            this._barVisible = false;
            this._cancelAnimation();
            return;
        }
        const barEntityState = this.hass.states[timerEntityId];
        if (!barEntityState) {
            this._barVisible = false;
            this._cancelAnimation();
            return;
        }
        if (isTimerEntity(timerEntityId)) {
            this._updateTimerBar(barEntityState.state, barEntityState.attributes);
        }
        else if (isNumericEntity(timerEntityId)) {
            this._updateNumericBar(barEntityState.state, barEntityState.attributes);
        }
        else {
            this._barVisible = false;
            this._cancelAnimation();
        }
    }
    /**
     * Starts or maintains an animated countdown progress bar for a timer entity.
     * Uses requestAnimationFrame for smooth animation.
     *
     * @param state - Current timer state string
     * @param attributes - Timer entity attributes
     */
    _updateTimerBar(state, attributes) {
        if (state !== "active") {
            this._barVisible = false;
            this._cancelAnimation();
            return;
        }
        this._barVisible = true;
        if (this._animationFrameId !== null)
            return;
        const finishesAt = new Date(attributes.finishes_at).getTime();
        const durationMs = parseDurationToMs(attributes.duration);
        if (durationMs === 0)
            return;
        const animate = () => {
            const remaining = finishesAt - Date.now();
            const clampedRemaining = Math.max(0, Math.min(durationMs, remaining));
            const percentage = (clampedRemaining / durationMs) * 100;
            this._progressPercentage = this._config?.reverse ?? true
                ? percentage
                : 100 - percentage;
            if (remaining > 0) {
                this._animationFrameId = requestAnimationFrame(animate);
            }
            else {
                this._animationFrameId = null;
                this._barVisible = false;
                this._progressPercentage = 0;
            }
        };
        this._animationFrameId = requestAnimationFrame(animate);
    }
    /**
     * Updates the progress bar percentage for a numeric entity based on
     * its current value relative to configured or attribute-defined min/max.
     *
     * @param state - Current numeric entity state string
     * @param attributes - Numeric entity attributes
     */
    _updateNumericBar(state, attributes) {
        const currentValue = parseFloat(state);
        if (isNaN(currentValue)) {
            this._barVisible = false;
            return;
        }
        const minValue = attributes.min ?? this._config?.bar_min ?? 0;
        const maxValue = attributes.max ?? this._config?.bar_max ?? 100;
        if (maxValue === minValue) {
            this._barVisible = false;
            return;
        }
        const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        this._progressPercentage = this._config?.reverse ?? true
            ? 100 - clampedPercentage
            : clampedPercentage;
        this._barVisible = true;
    }
    /**
     * Cancels any active requestAnimationFrame animation loop.
     */
    _cancelAnimation() {
        if (this._animationFrameId !== null) {
            cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }
    }
    /**
     * Handles pointer down — starts hold timer.
     */
    _onPointerDown() {
        this._holdFired = false;
        this._pressTimer = setTimeout(() => {
            this._holdFired = true;
            if (this._config && this.hass) {
                handleAction(this, this.hass, this._config, this._config.hold_action);
            }
        }, HOLD_THRESHOLD_MS);
    }
    /**
     * Handles pointer up — fires tap or double-tap action.
     */
    _onPointerUp() {
        if (this._pressTimer !== null) {
            clearTimeout(this._pressTimer);
            this._pressTimer = null;
        }
        if (this._holdFired)
            return;
        const now = Date.now();
        const timeSinceLastTap = now - this._lastTapTime;
        if (timeSinceLastTap < DOUBLE_TAP_THRESHOLD_MS) {
            this._lastTapTime = 0;
            if (this._config && this.hass) {
                handleAction(this, this.hass, this._config, this._config.double_tap_action);
            }
        }
        else {
            this._lastTapTime = now;
            setTimeout(() => {
                if (this._lastTapTime === now && this._config && this.hass) {
                    handleAction(this, this.hass, this._config, this._config.tap_action);
                }
            }, DOUBLE_TAP_THRESHOLD_MS);
        }
    }
    /**
     * Handles pointer leave — cancels hold timer.
     */
    _onPointerLeave() {
        if (this._pressTimer !== null) {
            clearTimeout(this._pressTimer);
            this._pressTimer = null;
        }
    }
    render() {
        if (!this._config || !this.hass)
            return b ``;
        const entityState = this.hass.states[this._config.entity];
        if (!entityState)
            return b `<ha-card></ha-card>`;
        const isOn = isEntityActive(entityState.state);
        const name = this._config.name || entityState.attributes.friendly_name || this._config.entity;
        const icon = this._config.icon || entityState.attributes.icon || deriveDefaultIcon(entityState);
        const barColor = isOn
            ? "var(--primary-background-color)"
            : (this._config.bar_color ?? "var(--accent-color)");
        const barHeight = this._config.bar_height ?? 4;
        return b `
      <ha-card
        style="--bpc-bar-color: ${barColor}; --bpc-bar-height: ${barHeight}px;"
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointerleave=${this._onPointerLeave}
      >
        <div class="bpc-state-overlay ${isOn ? "is-on" : ""}"></div>
        <div class="bpc-content">
          <div class="bpc-icon-container">
            <ha-icon class="bpc-icon ${isOn ? "is-on" : ""}" .icon=${icon}></ha-icon>
          </div>
          <span class="bpc-name">${name}</span>
        </div>
        ${this._barVisible
            ? b `
              <div class="bpc-progress-bar">
                <div
                  class="bpc-progress-fill"
                  style="width: ${this._progressPercentage}%"
                ></div>
              </div>
            `
            : ""}
      </ha-card>
    `;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._cancelAnimation();
        if (this._pressTimer !== null) {
            clearTimeout(this._pressTimer);
        }
    }
    getCardSize() {
        return 1;
    }
}
ButtonProgressCard.styles = i$3 `
    :host {
      display: block;
    }

    ha-card {
      position: relative;
      display: flex;
      align-items: center;
      height: calc(
        var(--row-height, 56px) * var(--row-size, 1) +
        var(--row-gap, 8px) * (var(--row-size, 1) - 1)
      );
      min-height: 50px;
      padding: 0;
      border-radius: var(--bubble-border-radius, var(--ha-card-border-radius, 28px));
      background-color: var(
        --bubble-button-main-background-color,
        var(--secondary-background-color)
      );
      overflow: hidden;
      cursor: pointer;
      box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow, none));
      border: var(--bubble-border, none);
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    .bpc-state-overlay {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: transparent;
      pointer-events: none;
      z-index: 0;
      transition: background-color 0.4s ease;
    }

    .bpc-state-overlay.is-on {
      background-color: color-mix(
        in srgb,
        var(--accent-color) 20%,
        var(--bubble-button-main-background-color, var(--secondary-background-color))
      );
    }

    .bpc-content {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
    }

    .bpc-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      margin: 0 6px 0 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .bpc-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
      opacity: 0.6;
      transition: color 0.4s ease, opacity 0.4s ease;
    }

    .bpc-icon.is-on {
      color: var(--accent-color);
      opacity: 1;
    }

    .bpc-name {
      flex-grow: 1;
      margin: 0 16px 0 4px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.4s ease;
      pointer-events: none;
    }

    .bpc-progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: var(--bpc-bar-height, 4px);
      background-color: color-mix(
        in srgb,
        var(--bpc-bar-color) 25%,
        transparent
      );
      pointer-events: none;
      z-index: 2;
    }

    .bpc-progress-fill {
      height: 100%;
      width: 0%;
      background-color: var(--bpc-bar-color);
      will-change: width;
    }
  `;
__decorate([
    n({ attribute: false })
], ButtonProgressCard.prototype, "hass", void 0);
__decorate([
    r()
], ButtonProgressCard.prototype, "_config", void 0);
__decorate([
    r()
], ButtonProgressCard.prototype, "_progressPercentage", void 0);
__decorate([
    r()
], ButtonProgressCard.prototype, "_barVisible", void 0);
if (!customElements.get(CARD_TAG_NAME)) {
    customElements.define(CARD_TAG_NAME, ButtonProgressCard);
}
window.customCards = window.customCards || [];
window.customCards.push({
    type: CARD_TAG_NAME,
    name: "Button Progress Card",
    preview: true,
    description: "A generic toggle button with an optional animated progress bar driven by a timer or numeric entity.",
});
console.info(`%c BUTTON-PROGRESS-CARD %c v${CARD_VERSION} `, "color: white; background: #4a90e2; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;", "color: #4a90e2; background: white; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");
//# sourceMappingURL=button-progress-card.js.map
