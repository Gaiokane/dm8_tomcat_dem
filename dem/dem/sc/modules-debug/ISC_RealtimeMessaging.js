/*

  SmartClient Ajax RIA system
  Version v12.1p_2021-11-17 (2021-11-17)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

if(window.isc&&window.isc.module_Core&&!window.isc.module_RealtimeMessaging){isc.module_RealtimeMessaging=1;isc._moduleStart=isc._RealtimeMessaging_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'RealtimeMessaging load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;if(window.isc&&isc.version!="v12.1p_2021-11-17"&&!isc.DevUtil){
    isc._optionalModuleCompare=function(){
        var incompatibleVersions=false;
        if(isc.version.toLowerCase().contains("pro")||isc.version.toLowerCase().contains("lgpl")){
            incompatibleVersions=true;
        }else{
            var coreVersion=isc.version;
            if(coreVersion.indexOf("/")!=-1){
                coreVersion=coreVersion.substring(0,coreVersion.indexOf("/"));
            }
            var moduleVersion="v12.1p_2021-11-17";
            if(moduleVersion.indexOf("/")!=-1){
                moduleVersion=moduleVersion.substring(0,moduleVersion.indexOf("/"));
            }
            if(coreVersion!=moduleVersion){
                incompatibleVersions=true;
            }
        }
        if(incompatibleVersions){
            isc.logWarn("SmartClient module version mismatch detected: This application is loading the core module from "
                +"SmartClient version '"+isc.version+"' and additional modules from 'v12.1p_2021-11-17'. Mixing resources from different "
                +"SmartClient packages is not supported and may lead to unpredictable behavior. If you are deploying resources "
                +"from a single package you may need to clear your browser cache, or restart your browser."
                +(isc.Browser.isSGWT?" SmartGWT developers may also need to clear the gwt-unitCache and run a GWT Compile.":""));
        }
    }
    isc._optionalModuleCompare();
}
isc.ClassFactory.defineClass("Messaging");
isc.A=isc.Messaging;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.messagingURL="[ISOMORPHIC]/messaging";
isc.A.websocketURL="[ISOMORPHIC]/websocket";
isc.A.useEventSource=true;
isc.A.useWebSocket=true;
isc.A.webSocketConnectTimeout=10000;
isc.A._subscribeReconnectDelay=1;
isc.A._channels={};
isc.A._recentIDList=[];
isc.A._maxRecentIDLength=250;
isc.A.connectTimeout=4000;
isc.A.clientID=isc.Math.randomUUID();
isc.A.legacyCommHTTPMethod="GET";
isc.A.enableServerLogging=isc.Log.logIsEnabledFor(isc.Log.DEBUG,"Messaging")
;
isc.B.push(isc.A._useEventSource=function isc_c_Messaging__useEventSource(){
        return this.useEventSource&&!!window.EventSource&&
            (!isc.Browser.isSafari||
             parseFloat(isc.Browser.rawSafariVersion)>=534.29);
    }
,isc.A._useWebSocket=function isc_c_Messaging__useWebSocket(){
        return this.useWebSocket&&!!window.WebSocket;
    }
,isc.A.useAJAX=function isc_c_Messaging_useAJAX(){
        return!this._useEventSource()&&!this._useWebSocket()&&
            ((isc.Browser.isFirefox&&isc.Browser.minorVersion<4)||isc.Browser.isSafari);
    }
,isc.A._sendDisconnectUponConnect=function isc_c_Messaging__sendDisconnectUponConnect(){
        return!this._useEventSource()&&!this._useWebSocket()
            &&isc.Browser.isSafari&&!this._sentDisconnectUponConnect;
    }
);
isc.B._maxIndex=isc.C+4;

isc.A=isc.Messaging;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._sequencedQueue=[];
isc.A._connectionPrefix="conn_";
isc.A._nextConnectionID=1;
isc.B.push(isc.A.send=function isc_c_Messaging_send(channels,data,callback,requestProperties){
    if(!isc.hasOptionalModules("RealtimeMessaging")&&!this.isRemoteDebug){
        this.logWarn("RealtimeMessaging not licensed - refusing to send()");
        return;
    }
    if(!isc.isAn.Array(channels))channels=[channels];
    if(requestProperties&&requestProperties.sequenced){
        this._sequencedQueue.add({
            channels:channels,
            data:data,
            callback:callback,
            requestProperties:requestProperties
        });
        if(this._sequencedQueue.length>1)return;
    }
    this._send(channels,data,callback,requestProperties);
}
,isc.A._send=function isc_c_Messaging__send(channels,data,callback,requestProperties){
    if(this._useWebSocket()&&this._conn&&window[this._conn]){
        window[this._conn].send(isc.Comm.serialize({
            command:"send",
            sendToChannels:channels,
            data:data
        },false));
        this.fireCallback(callback);
    }else{
        isc.DMI.callBuiltin({
            methodName:"messagingSend",
            callback:"isc.Messaging._sendCallback(data, rpcRequest)",
            arguments:[{
                type:"send",
                sendToChannels:channels,
                subscribedChannels:this._channels,
                data:data
            }],
            requestParams:isc.addProperties({
                showPrompt:false,
                callback:callback,
                willHandleError:callback!=null
            },requestProperties)
        });
    }
}
,isc.A._sendCallback=function isc_c_Messaging__sendCallback(data,rpcRequest){
    if(rpcRequest&&rpcRequest.sequenced){
        this._sequencedQueue.removeAt(0);
        var nextRequest=this._sequencedQueue[0];
        if(nextRequest){
            this._send(nextRequest.channels,nextRequest.data,nextRequest.callback,nextRequest.requestProperties);
        }
    }
}
,isc.A.getSubscribedChannels=function isc_c_Messaging_getSubscribedChannels(){
    return isc.getKeys(this._channels);
}
,isc.A.subscribe=function isc_c_Messaging_subscribe(channel,callback,subscriptionCallback,selector,data){
    if(!isc.hasOptionalModules("RealtimeMessaging")&&!this.isRemoteDebug){
        this.logWarn("RealtimeMessaging not licensed - refusing to subscribe()");
        return;
    }
    var fireSubscriptionCallback=true;
    if(!this._channels[channel]||selector!=null||data!=null){
        this._channels[channel]={};
        if(data)this._channels[channel].data=data;
        if(selector)this._channels[channel].selector=selector;
        this._channels[channel].subscriptionCallback=subscriptionCallback;
        this._reconnect("subscribe ("+channel+")");
        fireSubscriptionCallback=false;
    }
    this._channels[channel].callback=callback;
    if(fireSubscriptionCallback){
        this.fireCallback(subscriptionCallback,null,null,null,true);
    }
    return;
}
,isc.A.unsubscribe=function isc_c_Messaging_unsubscribe(channel){
    if(!this._channels[channel])return;
    delete this._channels[channel];
    this._reconnect("unsubscribe ("+channel+")");
    if(isc.isAn.emptyObject(this._channels))this.disconnect();
}
,isc.A.connected=function isc_c_Messaging_connected(){
    return this._channels&&isc.getKeys(this._channels).length>0&&this._serverIsConnected;
}
,isc.A.disconnect=function isc_c_Messaging_disconnect(callback){
    this._channels={};
    this._destroyConns({noConnectionDownCallback:true});
    this._haveConnectAck=null;
    isc.Timer.clear(this._subscribeReconnectTimer);
    this._subscribeReconnectTimer=null;
    isc.Timer.clear(this._keepaliveTimer);
    this._keepaliveTimer=null;
    this.connectionDown();
    if(callback)this.fireCallback(callback);
}
,isc.A._reconnect=function isc_c_Messaging__reconnect(reason){
    this.logDebug("_reconnect: "+(reason||"No reason provided"));
    this._clearKeepaliveTimer();
    if(!isc.Page.isLoaded()){
        if(!this._setLoadEventHandler){
            isc.Page.setEvent("load","isc.Messaging._reconnect('page load')");
            this._setLoadEventHandler=true;
        }
        return;
    }
    if(!this._subscribeReconnectTimer){
        this._subscribeReconnectTimer=
            isc.Timer.setTimeout("isc.Messaging._connect()",
                                 this._subscribeReconnectDelay,isc.Timer.MSEC);
    }
}
,isc.A._connectRetry=function isc_c_Messaging__connectRetry(){
    this._destroyConn(this._pendingConn);
    this._pendingConn=null;
    this.logDebug("connect within specified connectTimeout: "+this.connectTimeout+"ms failed, retrying");
    this._reconnect('connect retry');
}
,isc.A._serverConnTerminate=function isc_c_Messaging__serverConnTerminate(connectionID){
    this._reconnect('serverConnTerminate: '+connectionID);
}
,isc.A.generateNextConnectionID=function isc_c_Messaging_generateNextConnectionID(){
    return this._connectionPrefix+(this._nextConnectionID++);
}
,isc.A._connect=function isc_c_Messaging__connect(){

    if(this.usingAJAX&&!isc.Page.isLoaded()){
        if(!this._setLoadEventHandler){
            isc.Page.setEvent("load","isc.Messaging._reconnect('page load')");
            this._setLoadEventHandler=true;
        }
        return;
    }
    isc.Timer.clear(this._subscribeReconnectTimer);
    this._subscribeReconnectTimer=null;
    if(this._pendingConn){
        this._reconnectOnEstablish=true;
        this.logDebug("connect pending - deferring openConnection request.");
        return;
    }
    if(this.getSubscribedChannels().length==0)return;
    this._pendingConn={
        connectionID:this.generateNextConnectionID()
    };
    var data={
        type:"connect",
        clientID:this.clientID,
        connectionID:this._pendingConn.connectionID,
        subscribedChannels:isc.Comm.serialize(this._channels)
    };
    var url=this._useWebSocket()?isc.Page.getURL(this.websocketURL).replace(/^http(s)?/i,"ws$1")
        :isc.Page.getURL(this.messagingURL);
    var uriBuilder=isc.URIBuilder.create(url);
    uriBuilder.setQueryParam("ts",isc.timestamp());
    if(!this.enableServerLogging)uriBuilder.setQueryParam("isc_noLog","1");
    if(this._sendDisconnectUponConnect()){
        uriBuilder.setQueryParam("disconnectUponConnect","true");
        this._sentDisconnectUponConnect=true;
    }
    this.logDebug("proceeding to connect");
    var _this=this;
    if(this._useWebSocket()){
        this.logDebug("Using WebSocket for comm");
        for(var fieldName in data){
            if(!data.hasOwnProperty(fieldName))continue;
            uriBuilder.setQueryParam(fieldName,String(data[fieldName]));
        }
        var webSocket=this._pendingConn.webSocket=new WebSocket(uriBuilder.uri);
        this._webSocketInitTimer=isc.Timer.setTimeout(function(){
            if(_this._serverIsConnected)return;
            _this.logDebug("websocket timed out to: "+uriBuilder.uri+" - downgrading to next available protocol");
            _this.useWebSocket=false;
            _this._pendingConn=null;
            _this._connectionDown();
            _this._reconnect('downgrade from websocket - initial timer');
        },this.webSocketConnectTimeout,isc.Timer.MSEC);
        webSocket.onopen=function(event){
            isc.Timer.clearTimeout(_this._webSocketInitTimer);
            delete _this.webSocketInitTimer;
            _this.logDebug("websocket connected to: "+uriBuilder.uri);
        };
        webSocket.onerror=function(event){
            isc.Timer.clearTimeout(_this._webSocketInitTimer);
            delete _this._webSocketInitTimer;
            _this.logDebug("websocket error connecting to: "+uriBuilder.uri+": "+isc.echoFull(event));
            if(_this._webSocketKnownWorking){
                _this.logDebug("websocket protocol known working - continuing to retry");
            }else{
                _this.logDebug("marking websocket protocol unavailable - downgrading to next available protocol");
                _this.useWebSocket=false;
                _this._pendingConn=null;
                _this._connectionDown();
                _this._reconnect('downgrade from websocket - onerror handler');
            }
        };
        webSocket.onmessage=function(event){

            var message=isc.eval("var message = "+event.data+";message;");
            if(message.command){
                if(message.command=="connectCallback"){
                    _this._webSocketKnownWorking=true;
                    _this._connectCallback(message.connectionID,message.config);
                    _this._sendKeepalive();
                }else if(message.command=="keepalive"){
                    _this._keepalive(message.connectionID);
                }else if(message.command=="serverConnTerminate"){
                    _this._serverConnTerminate(message.connectionID);
                }
            }else{
                _this._message(message);
            }
        };
        webSocket.onclose=function(event){
            var code=event.code;
            var reason=event.reason;
            _this.logDebug("Connection closed - code: "+code+", reason: "+reason);
        };
    }else if(this._useEventSource()){
        this.logDebug("Using EventSource for comm");
        var commFrame=isc.HiddenFrame.create({useHtmlfile:isc.Browser.isIE});
        commFrame._draw();
        this._pendingConn.commFrame=commFrame;
        for(var fieldName in data){
            if(!data.hasOwnProperty(fieldName))continue;
            uriBuilder.setQueryParam(fieldName,String(data[fieldName]));
        }
        uriBuilder.setQueryParam("eventStream","true");
        this._eventSourceInitTimer=isc.Timer.setTimeout(function(){
            if(_this._serverIsConnected)return;
            _this.logDebug("EventSource connect timed out to: "+uriBuilder.uri+" - downgrading to next available protocol");
            _this.useEventSource=false;
            _this._pendingConn=null;
            _this._connectionDown();
            _this._reconnect('downgrade from EventSource - initial timer');
        },this.connectTimeout,isc.Timer.MSEC);
        var es=this._pendingConn.eventSource=new EventSource(uriBuilder.uri);
        es.onerror=isc.Messaging._handleEventSourceError||function(event){
            isc.Timer.clearTimeout(_this._eventSourceInitTimer);
            delete _this._eventSourceInitTimer;
            _this.logDebug("EventSource error connecting to: "+uriBuilder.uri+": "+isc.echoFull(event));
            if(_this._eventSourceKnownWorking){
                _this.logDebug("EventSource protocol known working - continuing to retry");
            }else{
                _this.logDebug("marking EventSource protocol unavailable - downgrading to next available protocol");
                _this.useEventSource=false;
                _this._pendingConn=null;
                _this._connectionDown();
                _this._reconnect('downgrade from EventSource - onerror handler');
            }
        }
        var eventListenerFun=function eventListenerFun(e){
            var expectedOrigin=location.origin;
            if(expectedOrigin==null){
                expectedOrigin=location.protocol+"//"+location.host;
            }
            if(e.origin==null||e.origin!=expectedOrigin){
                isc.Messaging.logWarn("'"+e.type+"' event received with wrong origin: "+
                                      e.origin+" (should be "+expectedOrigin+")");
                return;
            }
            if(commFrame._windowHandle!=null){
                _this._eventSourceKnownWorking=true;
                commFrame._windowHandle.document.write("<SCRIPT>"+e.data+"</SCRIPT>");
            };
        }
        es.addEventListener("connectCallback",eventListenerFun,false);
        es.addEventListener("keepalive",eventListenerFun,false);
        es.addEventListener("message",eventListenerFun,false);
        es.addEventListener("serverConnTerminate",eventListenerFun,false);
    }else if(this.useAJAX()){
        this.logDebug("Using AJAX for comm");
        var commFrame=isc.HiddenFrame.create({useHtmlfile:isc.Browser.isIE});
        commFrame._draw();
        var conn=this._pendingConn;
        conn.commFrame=commFrame;
        var lastOffset=0;
        var onreadystatechange=this._onreadystatechange=function(){
            if(onreadystatechange!=isc.Messaging._onreadystatechange)return;
            var xmlHttpRequest=conn.xmlHttpRequest;
            if(!xmlHttpRequest)return;
            if(xmlHttpRequest.readyState==3||xmlHttpRequest.readyState==4||
                (isc.Browser.isOpera&&xmlHttpRequest.readyState==2))
            {
                var newResponseText=xmlHttpRequest.responseText.substring(lastOffset);
                lastOffset=xmlHttpRequest.responseText.length;
                commFrame._windowHandle.document.write(newResponseText);
            }
        };
        this._pendingConn.xmlHttpRequest=isc.Comm.sendXmlHttpRequest({
            URL:uriBuilder.uri,
            fields:data,
            httpMethod:this.legacyCommHTTPMethod,
            transaction:{
                changed:function(){},
                requestData:data
            },
            onreadystatechange:onreadystatechange
        });
    }else{
        this.logDebug("Using HiddenFrame for comm");
        var commFrame=isc.HiddenFrame.create({useHtmlfile:isc.Browser.isIE});
        commFrame._draw();
        this._pendingConn.commFrame=commFrame;
        isc.Comm.sendHiddenFrame({
            URL:uriBuilder.uri,
            fields:data,
            httpMethod:this.legacyCommHTTPMethod,
            transaction:{
                changed:function(){},
                requestData:data
            },
            frame:commFrame
        });
    }
    this._reconnectTimer=isc.Timer.setTimeout("isc.Messaging._connectRetry()",this.connectTimeout,isc.Timer.MSEC);
}
,isc.A._connectCallback=function isc_c_Messaging__connectCallback(connectionID,config){
    if(this._pendingConn==null||this._pendingConn.connectionID!=connectionID){
        this.logDebug("Ignoring _connectCallback to old connectionID: "+connectionID);
        return;
    }
    this._keepaliveInterval=config.keepaliveInterval;
    this._keepaliveReestablishDelay=config.keepaliveReestablishDelay;
    this._keepaliveDelay=this._keepaliveInterval+this._keepaliveReestablishDelay;
    this._connectionTTL=config.connectionTTL;
    this.connectTimeout=config.connectTimeout;
    this.logDebug("connection "+connectionID+" established");
    this._destroyConn(this._conn);
    this._conn=this._pendingConn;
    this._pendingConn=null;
    isc.Timer.clear(this._reconnectTimer);
    this._reconnectTimer=null;
    this._resetStatusBar();
    this._resetKeepaliveTimer();
    this.logDebug("persistent server connection open - ttl: "+this._connectionTTL
                  +"ms, keepaliveDelay: "+this._keepaliveDelay
                  +"ms, connectTimeout: "+this.connectTimeout+"ms.")
    this._connectionUp();
    if(this._reconnectOnEstablish){
        this._reconnectOnEstablish=false;
        this._reconnect('reconnectOnEstablish');
        return;
    }
    if(this._useWebSocket()){
        if(this._connectionTTL!=-1){
            var _this=this;
            isc.Timer.setTimeout(function(){
                _this._reconnect('connectionTTL ('+this._connectionTTL+'ms) expired');
            },this._connectionTTL,isc.Timer.MSEC);
        }else{
            this.logDebug("websocket: server specifies no connection timeout");
        }
    }
    for(var key in this._channels){
        var channel=this._channels[key];
        if(channel.subscriptionCallback){
            this.fireCallback(channel.subscriptionCallback,null,null,null,true);
            delete channel.subscriptionCallback;
        }
    }
}
,isc.A._connectionUp=function isc_c_Messaging__connectionUp(){
    this._serverIsConnected=true;
    this.connectionUp();
}
,isc.A.connectionUp=function isc_c_Messaging_connectionUp(){
}
,isc.A._connectionDown=function isc_c_Messaging__connectionDown(){
    this._serverIsConnected=false;
    this.connectionDown();
}
,isc.A.connectionDown=function isc_c_Messaging_connectionDown(){
}
,isc.A._resetStatusBar=function isc_c_Messaging__resetStatusBar(){
    var status=isc.Browser.isIE?"Done":"Stopped";
    isc.Timer.setTimeout("window.status='"+status+"'",0);
}
,isc.A._sendKeepalive=function isc_c_Messaging__sendKeepalive(){
    if(this._conn&&this._conn.webSocket){
        this._conn.webSocket.send(isc.Comm.serialize({
            command:"keepalive"
        },false));
    }
}
,isc.A._keepalive=function isc_c_Messaging__keepalive(connectionID){
    this._resetStatusBar();
    isc.Timer.clear(this._keepaliveBounceTimer);
    this._keepaliveBounceTimer=isc.Timer.setTimeout("isc.Messaging._sendKeepalive()",this._keepaliveInterval-100,isc.Timer.MSEC);
    if(!this._conn||this._conn.connectionID!=connectionID)return;
    this._resetKeepaliveTimer();
    this.logDebug("keepalive on conn: "+connectionID);
}
,isc.A._keepaliveWatchdog=function isc_c_Messaging__keepaliveWatchdog(){
    this.logDebug("connection to server lost, re-establishing...");
    this._reconnect("keepaliveWatchdog");
    this._connectionDown();
}
,isc.A._clearKeepaliveTimer=function isc_c_Messaging__clearKeepaliveTimer(){
    isc.Timer.clear(this._keepaliveTimer);
}
,isc.A._resetKeepaliveTimer=function isc_c_Messaging__resetKeepaliveTimer(){
    this._clearKeepaliveTimer();
    this._keepaliveTimer=isc.Timer.setTimeout("isc.Messaging._keepaliveWatchdog()",
                                                this._keepaliveDelay,
                                                isc.Timer.MSEC);
}
,isc.A._message=function isc_c_Messaging__message(message){

    if(isc.isA.String(message))message=isc.eval("var message = "+message+";message;");
    var connectionID=message.connectionID,
        channels=message.channels,
        id=message.id,
        data=message.data;
    this._resetStatusBar();
    this._resetKeepaliveTimer();
    if(this._recentIDList.contains(id)){
        this.logDebug("ignoring duplicate messageID: "+id);
        return;
    }
    this._recentIDList.push(id);
    if(this._recentIDList.length>this._maxRecentIDLength)this._recentIDList.shift();
    for(var i=0;i<channels.length;i++){
        var channel=channels[i];
        if(!this._channels[channel])continue;
        var channelName=channel;
        var channel=this._channels[channel],
            callback=channel.callback
        if(callback)this.fireCallback(callback,"data,channel",[data,channelName],channel,true);
    }
}
,isc.A._destroyConn=function isc_c_Messaging__destroyConn(conn){
    if(!conn)return;
    this.logDebug("Destroying connection: "+conn.connectionID);
    if(conn.webSocket){
        try{
            conn.webSocket.close();
        }catch(e){}
    }
    if(conn.eventSource){
        try{
            conn.eventSource.close();
        }catch(e){}
    }
    if(conn.xmlHttpRequest){
        try{
            conn.xmlHttpRequest.abort();
        }catch(e){}
    }
    if(conn.commFrame){
        conn.commFrame.destroy();
    }
}
,isc.A._destroyConns=function isc_c_Messaging__destroyConns(opts){
    if(!opts)opts={};
    this._destroyConn(this._conn);
    delete this._conn;
    this._destroyConn(this._pendingConn);
    delete this._pendingConn;
    if(opts.noConnectionDownCallback)return;
    this._connectionDown();
}
);
isc.B._maxIndex=isc.C+27;

isc.Page.setEvent("unload",function(){isc.Messaging._destroyConns()});
isc.defineClass("MessagingDMIDiscoveryDS","DataSource");
isc.A=isc.MessagingDMIDiscoveryDS.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.clientOnly=true;
isc.A.fields=[
        {name:"GUID",primaryKey:true},
        {name:"userAgent",title:"User Agent"},
        {name:"lastContact",title:"Last Contact",type:"datetime"}
    ];
isc.B.push(isc.A.init=function isc_MessagingDMIDiscoveryDS_init(){
        this.Super("init",arguments);
        this.cacheData=[];
        this.discover();
    }
,isc.A.invalidateCache=function isc_MessagingDMIDiscoveryDS_invalidateCache(){
        var _this=this;
        var cacheData=this.getCacheData();
        while(cacheData.length)_this.removeData(cacheData[0]);
        this.delayCall("discover");
    }
,isc.A.discover=function isc_MessagingDMIDiscoveryDS_discover(){
        var _this=this;
        if(!this.client){
            this.client=isc.MessagingDMIClient.create({
                socketProperties:{
                    doNotTrackRPC:true,
                    isRemoteDebug:this.isRemoteDebug
                }
            });
        }
        this.client.call({
            sendChannel:this.discoverOnChannel,
            methodName:"discover",
            timeout:this.discoveryTimeout,
            callback:function(serverProperties){
                _this.updateServer(serverProperties);
            }
        });
    }
,isc.A.updateServer=function isc_MessagingDMIDiscoveryDS_updateServer(serverProperties){
        serverProperties.lastContact=new Date();
        var _this=this;
        this.fetchData({GUID:serverProperties.GUID},function(dsResponse){
            if(dsResponse.data&&dsResponse.data.getLength()==0){
                _this.addData(serverProperties);
            }else{
                _this.updateData(serverProperties);
            }
        });
    }
);
isc.B._maxIndex=isc.C+4;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('RealtimeMessaging');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._RealtimeMessaging_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('RealtimeMessaging module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'RealtimeMessaging', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'RealtimeMessaging'.");}isc.$P5hy05Xgj7AN("RealtimeMessaging");
/*

  SmartClient Ajax RIA system
  Version v12.1p_2021-11-17 (2021-11-17)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

