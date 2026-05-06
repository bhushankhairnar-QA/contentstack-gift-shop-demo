import React, { useEffect } from "react";

const lyticsId = process.env.REACT_APP_LYTICS_ID;

export default function LyticsProvider({ children }) {
  useEffect(() => {
    if (document.getElementById("lytics-init")) return;
    const script = document.createElement("script");
    script.id = "lytics-init";
    script.innerHTML = ` !function(){"use strict";var o=window.jstag||(window.jstag={}),r=[];function n(e){o[e]=function(){for(var n=arguments.length,t=new Array(n),i=0;i<n;i++)t[i]=arguments[i];r.push([e,t])}}n("send"),n("mock"),n("identify"),n("pageView"),n("unblock"),n("getid"),n("setid"),n("loadEntity"),n("getEntity"),n("on"),n("once"),n("call"),o.loadScript=function(n,t,i){var e=document.createElement("script");e.async=!0,e.src=n,e.onload=t,e.onerror=i;var o=document.getElementsByTagName("script")[0],r=o&&o.parentNode||document.head||document.body,c=o||r.lastChild;return null!=c?r.insertBefore(e,c):r.appendChild(e),this},o.init=function n(t){return this.config=t,this.loadScript(t.src,function(){if(o.init===n)throw new Error("Load error!");o.init(o.config),function(){for(var n=0;n<r.length;n++){var t=r[n][0],i=r[n][1];o[t].apply(o,i)}r=void 0}()}),this}}();
  jstag.init({
    src: 'https://c.lytics.io/api/tag/${lyticsId}/latest.min.js'
  });
  jstag.pageView();`;
    document.head.appendChild(script);
  }, []);

  return <>{children}</>;
}
