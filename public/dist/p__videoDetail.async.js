(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"0lfv":function(e,t,a){"use strict";a.d(t,"b",function(){return i}),a.d(t,"f",function(){return s}),a.d(t,"e",function(){return c}),a.d(t,"c",function(){return o}),a.d(t,"d",function(){return d}),a.d(t,"a",function(){return u});var r=a("p46w"),n=e=>{return e.stopPropagation&&e.stopPropagation(),!1},i=()=>{document.addEventListener("touchmove",n,!1)},s=e=>{var t=document.getElementById("loadinging");t&&(t.innerText=e,t.style.display="block",document.body.style.overflow="hidden")},c=()=>{var e=document.getElementById("loadinging");e&&(e.style.display="none"),document.body.style.overflow="scroll"},o=e=>{for(var t=window.location.search.substring(1),a=t.split("&"),r=0;r<a.length;r++){var n=a[r].split("=");if(n[0]==e)return n[1]}return 0},d=()=>{return{userId:r.get("userId"),source:r.get("source")}},u=e=>{if(!e||0===e.length)return"#f2f2f2";var t="rgba(";return e.forEach(e=>{t+=e+","}),t=t.slice(0,-1),t+=")",t}},Lwym:function(e,t,a){"use strict";a.d(t,"a",function(){return d});var r,n=a("p0pE"),i=a.n(n),s=a("vDqi"),c=a.n(s),o=a("0lfv"),d="//www.jarton.cn",u=a("bKgH"),m=6,l="/api/images/list",g=(e,t)=>"/api/images/update?userId=".concat(e,"&source=").concat(t),p=(e,t)=>"/api/user/image?userId=".concat(e,"&source=").concat(t,"&screen=").concat(Object(o["c"])("id")),v="/api/user/images/list",h="/api/user/images/list",b="/api/user/detail",f="/api/images/display",I="/api/images/displaynew",w="/api/image/detail",y="/api/system/info",E="/api/images/captioned/list",_="/api/images/display_screen";(function(e){e[e["reviewed"]=0]="reviewed",e[e["deleted"]=1]="deleted"})(r||(r={}));var N=(e,t)=>{return c.a.put(g(t,2),{images:[{imageId:e,status:"2"}]}).then(e=>e.data)},O=(e,t)=>{return c.a.put(g(t,2),{images:[{imageId:e,status:"5"}]}).then(e=>e.data)},j=e=>{return Object(o["f"])("\u4e0a\u4f20\u4e2d"),u(e,{width:1024,fieldName:"image"}).then(e=>{var t=Object(o["d"])(),a=t.userId,r=t.source;return c.a.post(p(a,r),e.formData,{headers:{"Content-Type":"multipart/form-data"},onUploadProgress:function(e){var t=Math.round(100*e.loaded/e.total)||0;t<100&&Object(o["f"])("\u4e0a\u4f20\u4e2d..."+t+"%")}}).then(e=>{var t=e.data;return Object(o["e"])(),t})})},S=e=>{return c.a.get(v,{params:i()({},Object(o["d"])(),{pageNumber:e,pageSize:m})}).then(e=>{var t=e.data;return t})},k=e=>{return c.a.get(h,{params:i()({},Object(o["d"])(),{pageNumber:e,pageSize:m})}).then(e=>{var t=e.data;return t})},R=e=>{return c.a.get(w,{params:i()({},Object(o["d"])(),{imageId:e})}).then(e=>{var t=e.data;return t})},x=(e,t)=>{return c.a.get(l,{params:{source:2,userId:t,pageNumber:e,pageSize:30}}).then(e=>e.data)},W=()=>{return c.a.get(f,{params:{pageNumber:0,pageSize:20}}).then(e=>e.data)},q=()=>{return c.a.get(I,{params:{pageNumber:0,pageSize:5}}).then(e=>e.data)},L=e=>{return c.a.get(_,{params:{pageNumber:0,pageSize:5,screen:e}}).then(e=>e.data)},z=e=>{return c.a.get(E,{params:{pageNumber:e,pageSize:m}}).then(e=>e.data)},T=()=>{return c.a.get(b,{params:i()({},Object(o["d"])())}).then(e=>e.data)},C=e=>{return c.a.get(y,{params:{source:2,userId:e}}).then(e=>e.data)},B=e=>{return c.a.get(e)};t["b"]={upImage:j,reviewImage:N,getAllImageList:x,getImageList:S,myImageList:k,getImageRandom:W,getUserInfo:T,getImageDetail:R,getSystemInfo:C,getImageListNoLogin:z,delImage:O,getImageRandomNew:q,getImageByScreen:L,liveOk:B}},OU95:function(e,t,a){"use strict";a.r(t);var r=a("qIgq"),n=a.n(r),i=a("q1tI"),s=a.n(i),c=a("OS56"),o=a.n(c),d=a("zLop"),u=a.n(d),m=a("Lwym"),l=a("0lfv"),g={dots:!1,infinite:!0,useTransform:!1,slidesToShow:1,slidesToScroll:1,autoplay:!0,pauseOnHover:!1,arrows:!1,speed:0,autoplaySpeed:13e3};t["default"]=function(){var e=Object(i["useState"])([]),t=n()(e,2),a=t[0],r=t[1],c=Object(i["useState"])(300),d=n()(c,2),p=d[0],v=d[1];Object(i["useEffect"])(()=>{var e=document.createElement("meta");e.httpEquiv="Cache-Control",e.content="no-cache, must-revalidate",document.getElementsByTagName("head")[0].appendChild(e),e=document.createElement("meta"),e.httpEquiv="expires",e.content="0",document.getElementsByTagName("head")[0].appendChild(e),e=document.createElement("meta"),e.httpEquiv="pragma",e.content="no-cache",document.getElementsByTagName("head")[0].appendChild(e),m["b"].getImageRandom().then(e=>{r(e.images)}),document.documentElement.webkitRequestFullScreen(),setTimeout(()=>{var e=screen.height;v(e)},1e3)},[]);var h=e=>{29===e&&m["b"].getImageRandom().then(e=>{r(e.images)})},b=[],f=e=>{var t=s.a.createElement("div",{className:u.a.colorReviewWrap,key:e.imageId+"img"},s.a.createElement("div",{className:u.a.colorReviewWrap,style:{background:Object(l["a"])(e.color)}},s.a.createElement("img",{className:u.a.scImg,alt:"",src:m["a"]+"/"+e.url,style:{width:"100%"}}))),a=s.a.createElement("div",{className:u.a.colorReviewWrap,key:e.imageId+"color"},s.a.createElement("div",{style:{background:Object(l["a"])(e.color),height:p+"px"}})),r=s.a.createElement("div",{className:u.a.textReviewWrap,key:e.imageId+"text"},s.a.createElement("div",{className:u.a.text,style:{background:Object(l["a"])(e.color),height:p}},s.a.createElement("span",{className:u.a.textInline},e.caption||"no caption")));b.push(t),b.push(a),b.push(r)};a&&a.forEach(f);var I=()=>{document.documentElement.webkitRequestFullScreen();var e=screen.height;v(e)};return s.a.createElement("div",{onClick:I},a&&s.a.createElement("div",{className:u.a.sliderWrap},s.a.createElement(o.a,Object.assign({},g,{afterChange:h}),b)))}},zLop:function(e,t,a){e.exports={scImg:"scImg___VO-6e",sliderWrap:"sliderWrap___2dWXh",textReviewWrap:"textReviewWrap___1Mf48",text:"text___2qRQb",textInline:"textInline___2drlG",colorReviewWrap:"colorReviewWrap___3QYPd",back:"back___26GrX"}}}]);