function dem(){var Q='bootstrap',R='begin',S='gwt.codesvr.dem=',T='gwt.codesvr=',U='dem',V='startup',W='DUMMY',X=0,Y=1,Z='iframe',$='position:absolute; width:0; height:0; border:none; left: -1000px;',_=' top: -1000px;',ab='CSS1Compat',bb='<!doctype html>',cb='',db='<html><head><\/head><body><\/body><\/html>',eb='undefined',fb='readystatechange',gb=10,hb='Chrome',ib='eval("',jb='");',kb='script',lb='javascript',mb='moduleStartup',nb='moduleRequested',ob='Failed to load ',pb='head',qb='meta',rb='name',sb='dem::',tb='::',ub='gwt:property',vb='content',wb='=',xb='gwt:onPropertyErrorFn',yb='Bad handler "',zb='" for "gwt:onPropertyErrorFn"',Ab='gwt:onLoadErrorFn',Bb='" for "gwt:onLoadErrorFn"',Cb='#',Db='?',Eb='/',Fb='img',Gb='clear.cache.gif',Hb='baseUrl',Ib='dem.nocache.js',Jb='base',Kb='//',Lb='locale',Mb='default',Nb='locale=',Ob=7,Pb='&',Qb='__gwt_Locale',Rb='_',Sb='Unexpected exception in locale detection, using default: ',Tb=2,Ub='user.agent',Vb='webkit',Wb='safari',Xb='msie',Yb=11,Zb='ie10',$b=9,_b='ie9',ac=8,bc='ie8',cc='gecko',dc='gecko1_8',ec=3,fc=4,gc='selectingPermutation',hc='dem.devmode.js',ic='en',jc='070F2B32AC05D0FFE274CA93B0A6E907',kc='07CF384CA27C5876A8EDC415F9EC9FD5',lc='zh_CN',mc='09685B1D00180C1FFA9D1C2C09A719CF',nc='123A3A006EC56A97918E6FFF28D692A2',oc='14D47B8C427CE96CD742E4E61EA41D6D',pc='2DFBF17B91A0D9E23F9FD0389A2A34DE',qc='3002FC7C82DB2E8DA41C60DCAD308B96',rc='30F9E1984F0E7461F39001650163A472',sc='82A51D49257B6760A9926F7EF9D3B683',tc='83AE6A81A883B22CBD8A9FD850935ACB',uc='8A626494CD9232AF8E534B44972D6A6C',vc='932B1435EBB83D1F864B2F2BA8A9DEE9',wc='A516D7136FDF22707951332DDAFB23D5',xc='A649C837B08CB07AAB31EC659C0FC700',yc='D9AA12C6C1801284A5B5B829FFE61F4C',zc=':',Ac='.cache.js',Bc='loadExternalRefs',Cc='end',Dc='http:',Ec='file:',Fc='_gwt_dummy_',Gc='__gwtDevModeHook:dem',Hc='Ignoring non-whitelisted Dev Mode URL: ',Ic=':moduleBase';var q=window;var r=document;t(Q,R);function s(){var a=q.location.search;return a.indexOf(S)!=-1||a.indexOf(T)!=-1}function t(a,b){if(q.__gwtStatsEvent){q.__gwtStatsEvent({moduleName:U,sessionId:q.__gwtStatsSessionId,subSystem:V,evtGroup:a,millis:(new Date).getTime(),type:b})}}dem.__sendStats=t;dem.__moduleName=U;dem.__errFn=null;dem.__moduleBase=W;dem.__softPermutationId=X;dem.__computePropValue=null;dem.__getPropMap=null;dem.__installRunAsyncCode=function(){};dem.__gwtStartLoadingFragment=function(){return null};dem.__gwt_isKnownPropertyValue=function(){return false};dem.__gwt_getMetaProperty=function(){return null};var u=null;var v=q.__gwt_activeModules=q.__gwt_activeModules||{};v[U]={moduleName:U};dem.__moduleStartupDone=function(e){var f=v[U].bindings;v[U].bindings=function(){var a=f?f():{};var b=e[dem.__softPermutationId];for(var c=X;c<b.length;c++){var d=b[c];a[d[X]]=d[Y]}return a}};var w;function A(){B();return w}function B(){if(w){return}var a=r.createElement(Z);a.id=U;a.style.cssText=$+_;a.tabIndex=-1;r.body.appendChild(a);w=a.contentWindow.document;w.open();var b=document.compatMode==ab?bb:cb;w.write(b+db);w.close()}function C(k){function l(a){function b(){if(typeof r.readyState==eb){return typeof r.body!=eb&&r.body!=null}return /loaded|complete/.test(r.readyState)}var c=b();if(c){a();return}function d(){if(!c){if(!b()){return}c=true;a();if(r.removeEventListener){r.removeEventListener(fb,d,false)}if(e){clearInterval(e)}}}if(r.addEventListener){r.addEventListener(fb,d,false)}var e=setInterval(function(){d()},gb)}function m(c){function d(a,b){a.removeChild(b)}var e=A();var f=e.body;var g;if(navigator.userAgent.indexOf(hb)>-1&&window.JSON){var h=e.createDocumentFragment();h.appendChild(e.createTextNode(ib));for(var i=X;i<c.length;i++){var j=window.JSON.stringify(c[i]);h.appendChild(e.createTextNode(j.substring(Y,j.length-Y)))}h.appendChild(e.createTextNode(jb));g=e.createElement(kb);g.language=lb;g.appendChild(h);f.appendChild(g);d(f,g)}else{for(var i=X;i<c.length;i++){g=e.createElement(kb);g.language=lb;g.text=c[i];f.appendChild(g);d(f,g)}}}dem.onScriptDownloaded=function(a){l(function(){m(a)})};t(mb,nb);var n=r.createElement(kb);n.src=k;if(dem.__errFn){n.onerror=function(){dem.__errFn(U,new Error(ob+code))}}r.getElementsByTagName(pb)[X].appendChild(n)}dem.__startLoadingFragment=function(a){return G(a)};dem.__installRunAsyncCode=function(a){var b=A();var c=b.body;var d=b.createElement(kb);d.language=lb;d.text=a;c.appendChild(d);c.removeChild(d)};function D(){var c={};var d;var e;var f=r.getElementsByTagName(qb);for(var g=X,h=f.length;g<h;++g){var i=f[g],j=i.getAttribute(rb),k;if(j){j=j.replace(sb,cb);if(j.indexOf(tb)>=X){continue}if(j==ub){k=i.getAttribute(vb);if(k){var l,m=k.indexOf(wb);if(m>=X){j=k.substring(X,m);l=k.substring(m+Y)}else{j=k;l=cb}c[j]=l}}else if(j==xb){k=i.getAttribute(vb);if(k){try{d=eval(k)}catch(a){alert(yb+k+zb)}}}else if(j==Ab){k=i.getAttribute(vb);if(k){try{e=eval(k)}catch(a){alert(yb+k+Bb)}}}}}__gwt_getMetaProperty=function(a){var b=c[a];return b==null?null:b};u=d;dem.__errFn=e}function F(){function e(a){var b=a.lastIndexOf(Cb);if(b==-1){b=a.length}var c=a.indexOf(Db);if(c==-1){c=a.length}var d=a.lastIndexOf(Eb,Math.min(c,b));return d>=X?a.substring(X,d+Y):cb}function f(a){if(a.match(/^\w+:\/\//)){}else{var b=r.createElement(Fb);b.src=a+Gb;a=e(b.src)}return a}function g(){var a=__gwt_getMetaProperty(Hb);if(a!=null){return a}return cb}function h(){var a=r.getElementsByTagName(kb);for(var b=X;b<a.length;++b){if(a[b].src.indexOf(Ib)!=-1){return e(a[b].src)}}return cb}function i(){var a=r.getElementsByTagName(Jb);if(a.length>X){return a[a.length-Y].href}return cb}function j(){var a=r.location;return a.href==a.protocol+Kb+a.host+a.pathname+a.search+a.hash}var k=g();if(k==cb){k=h()}if(k==cb){k=i()}if(k==cb&&j()){k=e(r.location.href)}k=f(k);return k}function G(a){if(a.match(/^\//)){return a}if(a.match(/^[a-zA-Z]+:\/\//)){return a}return dem.__moduleBase+a}function H(){var i=[];var j=X;function k(a,b){var c=i;for(var d=X,e=a.length-Y;d<e;++d){c=c[a[d]]||(c[a[d]]=[])}c[a[e]]=b}var l=[];var m=[];function n(a){var b=m[a](),c=l[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(u){u(a,d,b)}throw null}m[Lb]=function(){var b=null;var c=Mb;try{if(!b){var d=location.search;var e=d.indexOf(Nb);if(e>=X){var f=d.substring(e+Ob);var g=d.indexOf(Pb,e);if(g<X){g=d.length}b=d.substring(e+Ob,g)}}if(!b){b=__gwt_getMetaProperty(Lb)}if(!b){b=q[Qb]}if(b){c=b}while(b&&!__gwt_isKnownPropertyValue(Lb,b)){var h=b.lastIndexOf(Rb);if(h<X){b=null;break}b=b.substring(X,h)}}catch(a){alert(Sb+a)}q[Qb]=c;return b||Mb};l[Lb]={'default':X,'en':Y,'zh_CN':Tb};m[Ub]=function(){var a=navigator.userAgent.toLowerCase();var b=r.documentMode;if(function(){return a.indexOf(Vb)!=-1}())return Wb;if(function(){return a.indexOf(Xb)!=-1&&(b>=gb&&b<Yb)}())return Zb;if(function(){return a.indexOf(Xb)!=-1&&(b>=$b&&b<Yb)}())return _b;if(function(){return a.indexOf(Xb)!=-1&&(b>=ac&&b<Yb)}())return bc;if(function(){return a.indexOf(cc)!=-1||b>=Yb}())return dc;return cb};l[Ub]={'gecko1_8':X,'ie10':Y,'ie8':Tb,'ie9':ec,'safari':fc};__gwt_isKnownPropertyValue=function(a,b){return b in l[a]};dem.__getPropMap=function(){var a={};for(var b in l){if(l.hasOwnProperty(b)){a[b]=n(b)}}return a};dem.__computePropValue=n;q.__gwt_activeModules[U].bindings=dem.__getPropMap;t(Q,gc);if(s()){return G(hc)}var o;try{k([ic,Zb],jc);k([Mb,Wb],kc);k([lc,_b],mc);k([lc,Wb],nc);k([lc,Zb],oc);k([Mb,bc],pc);k([ic,bc],qc);k([Mb,Zb],rc);k([ic,Wb],sc);k([ic,dc],tc);k([lc,dc],uc);k([Mb,_b],vc);k([Mb,dc],wc);k([ic,_b],xc);k([lc,bc],yc);o=i[n(Lb)][n(Ub)];var p=o.indexOf(zc);if(p!=-1){j=parseInt(o.substring(p+Y),gb);o=o.substring(X,p)}}catch(a){}dem.__softPermutationId=j;return G(o+Ac)}function I(){if(!q.__gwt_stylesLoaded){q.__gwt_stylesLoaded={}}t(Bc,R);t(Bc,Cc)}D();dem.__moduleBase=F();v[U].moduleBase=dem.__moduleBase;var J=H();if(q){var K=!!(q.location.protocol==Dc||q.location.protocol==Ec);q.__gwt_activeModules[U].canRedirect=K;function L(){var b=Fc;try{q.sessionStorage.setItem(b,b);q.sessionStorage.removeItem(b);return true}catch(a){return false}}if(K&&L()){var M=Gc;var N=q.sessionStorage[M];if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/.*$/.test(N)){if(N&&(window.console&&console.log)){console.log(Hc+N)}N=cb}if(N&&!q[M]){q[M]=true;q[M+Ic]=F();var O=r.createElement(kb);O.src=N;var P=r.getElementsByTagName(pb)[X];P.insertBefore(O,P.firstElementChild||P.children[X]);return false}}}I();t(Q,Cc);C(J);return true}dem.succeeded=dem();if (!/loaded|interactive|complete/.test(document.readyState)) {document.write('<script src="dem/loadScriptTagFiles.js"></script>');}