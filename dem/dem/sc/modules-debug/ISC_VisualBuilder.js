/*

  SmartClient Ajax RIA system
  Version v12.1p_2021-11-17/Enterprise Deployment (2021-11-17)

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

if(window.isc&&window.isc.module_Core&&!window.isc.module_VisualBuilder){isc.module_VisualBuilder=1;isc._moduleStart=isc._VisualBuilder_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'VisualBuilder load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.ClassFactory.defineClass("Project");
isc.A=isc.Project;
isc.A.AUTOSAVE="VB_AUTOSAVE_PROJECT";
isc.A.AUTOSAVE_MOCKUPS="MOCKUPS_AUTOSAVE_PROJECT";
isc.A.AUTOSAVE_SINGLE_SCREEN="VB_SINGLE_SCREEN"
;

isc.A=isc.Project.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.screensDefaults={
        _constructor:"Tree",
        openProperty:"_isOpen_",
        parentProperty:"_parent_"
    };
isc.A._$copySuffix="_"+"copy";
isc.A.saveScreenDialogConstructor='ProjectFileSaveDialog';
isc.A.saveScreenDialogDefaults={
        title:'Save Screen',
        actionButtonTitle:'Save Screen',
        fileType:'ui',
        fileFormat:'xml'
    };
isc.A.autoSavePause=500;
isc.A.disableAutoSave=0;
isc.A.saveProjectDialogConstructor='ProjectFileSaveDialog';
isc.A.saveProjectDialogDefaults={
        title:'Save Project',
        actionButtonTitle:'Save Project',
        fileType:'proj',
        fileFormat:'xml'
    };
isc.B.push(isc.A.setFileName=function isc_Project_setFileName(fileName){
        this.fileName=fileName;
        if(!this.fileSpec){
            this.fileSpec={fileType:"proj",fileFormat:"xml"};
            if(this.builder.userId)this.fileSpec.ownerId=this.builder.userId;
        }
        this.fileSpec.fileName=fileName;
    }
,isc.A.setFileSpec=function isc_Project_setFileSpec(fileSpec){
        this.fileSpec={
            fileName:fileSpec.fileName,
            fileType:fileSpec.fileType,
            fileFormat:fileSpec.fileFormat,
            ownerId:fileSpec.ownerId
        };
        this.setFileName(fileSpec.fileName);
        this.setName(fileSpec.fileName);
        this._projectID=fileSpec.id;
        var projectDS=this.builder.projectDataSource;
        this.lastLoadVersion=projectDS._getFileSpecFileVersion(fileSpec);
        this.setReadOnly(this.builder.mustBeOwnerToSave&&
            this.builder.userId&&fileSpec.ownerId!=this.builder.userId);
    }
,isc.A.setReadOnly=function isc_Project_setReadOnly(readOnly){
        if(this.readOnly!=readOnly){
            this.readOnly=readOnly;
            if(this.readOnly)this.promptToCopy=true;
        }
    }
,isc.A.isReadOnly=function isc_Project_isReadOnly(){
        return this.readOnly;
    }
,isc.A.getOwnerId=function isc_Project_getOwnerId(){
        return(this.fileSpec?this.fileSpec.ownerId:null);
    }
,isc.A.setName=function isc_Project_setName(name){
        this.name=name;
        this._ID=null;
    }
,isc.A.getID=function isc_Project_getID(){
        if(!this._ID){
            var ID=this.name;
            if(ID){
                if(!String.isValidID(ID)){
                    ID=ID.replace(/ /g,"_");
                }
                if(!String.isValidID(ID)){
                    ID="c"+ID.replace(/[^a-zA-Z0-9]/g,"_");
                }
            }
            this._ID=ID;
        }
        return this._ID;
    }
,isc.A.addDatasource=function isc_Project_addDatasource(dsName,dsType){
        var current=this.datasources.findIndex("dsName",dsName);
        if(current==-1){
            this.datasources.addAt({
                dsName:dsName,
                dsType:dsType
            },0);
            this.autoSaveSoon();
        }
        this.builder.lastUsedDataSource=dsName;
    }
,isc.A.removeDatasource=function isc_Project_removeDatasource(dsName){
        var current=this.datasources.findIndex("dsName",dsName);
        if(current>=0){
            var project=this,
                builder=this.builder,
                dsRelations
            ;
            var removeIt=function(relatedDataSources){
                var finishRemove=function(){
                    current=this.datasources.findIndex("dsName",dsName);
                    project.datasources.removeAt(current);
                    project.autoSaveSoon();
                };
                if(relatedDataSources){
                    isc.showPrompt("Removing relations... ${loadingImage}");
                    var count=relatedDataSources.length;
                    for(var i=0;i<relatedDataSources.length;i++){
                        var sourceDS=isc.DS.get(relatedDataSources[i]);
                        dsRelations.removeRelationsToDataSource(sourceDS,dsName,function(){
                            if(--count==0){
                                isc.clearPrompt();
                                finishRemove();
                            }
                        });
                    }
                }else{
                    finishRemove();
                }
            };
            if(builder.cleanupRelationsOnDataSourceRemove){
                isc.showPrompt("Checking for affected relations... ${loadingImage}");
                builder.loadAllProjectDataSources(function(){
                    var projectDataSources=project.datasources;
                    var dsList=[];
                    projectDataSources.map(function(rec){
                        if(!rec)return;
                        var ds=isc.DS.get(rec.dsName);
                        if(ds)dsList.add(ds);
                    });
                    dsRelations=isc.DSRelations.create({
                        dsDataSource:builder.dsDataSource,
                        ownerId:builder.userId,
                        dataSources:dsList
                    });
                    var relations=dsRelations.getRelationsForDataSource(dsName),
                        relatedDataSources=[]
                    ;
                    for(var i=0;i<relations.length;i++){
                        var relation=relations[i];
                        if(relation.type=="1-M")relatedDataSources.add(relation.dsId);
                    }
                    var systemDataSources=[];
                    for(var i=0;i<relatedDataSources.length;i++){
                        var dsId=relatedDataSources[i],
                            ds=isc.DS.get(dsId)
                        ;
                        if(ds&&ds.apidoc==false||ds.isSampleDS==true){
                            systemDataSources.add(relatedDataSources[i]);
                        }
                    }
                    if(systemDataSources.length>0){
                        relatedDataSources.removeList(systemDataSources);
                    }
                    isc.clearPrompt();
                    if(relatedDataSources.length==0){
                        removeIt();
                        return;
                    }
                    var relatedDataSourcesString=relatedDataSources.join(", "),
                        message="This DataSource has relations to the following "+
                        "other DataSources: "+relatedDataSourcesString+".<P>"+
                        "If you remove this DataSource these relations will be removed as well"
                    ;
                    isc.confirm(message,function(response){
                        if(response==true)removeIt(relatedDataSources);
                    },{
                        buttons:[
                            isc.Dialog.CANCEL,
                            {title:"Continue",width:75,overflow:"visible",
                                click:function(){this.topElement.okClick()}
                            }
                        ],
                        autoFocusButton:0
                    });
                });
            }else{
                removeIt();
            }
        }
    }
,isc.A.setCurrentScreenId=function isc_Project_setCurrentScreenId(screenId){
        if(this.currentScreenId!==screenId){
            this.currentScreenId=screenId;
            this.autoSaveSoon();
        }
    }
,isc.A.setCurrentScreenFileName=function isc_Project_setCurrentScreenFileName(fileName){
        if(this.currentScreenFileName!==fileName){
            this.currentScreenFileName=fileName;
            this.autoSaveSoon();
            this.builder.updateRecentScreens();
        }
    }
,isc.A.init=function isc_Project_init(){
        this.Super("init",arguments);
        if(!this.datasources)this.datasources=[];
        this.addAutoChild("screens");
        this.observe(this.screens,"dataChanged","observer.autoSaveSoon();");
    }
,isc.A.destroy=function isc_Project_destroy(){
        this.ignore(this.screens,"dataChanged");
        this.Super("destroy",arguments);
    }
,isc.A.autoAssignProjectName=function isc_Project_autoAssignProjectName(callback){
        var builder=this.builder,
            baseFileName=(builder.userId?builder.userId+"'s Project":"Starter Project"),
            fileSpec={
                fileName:baseFileName,
                fileType:"proj",
                fileFormat:"xml",
                indexPrefix:" "
            }
        ;
        builder.projectDataSource.uniqueName(fileSpec,function(dsResponse,data,dsRequest){
            if(data){
                callback(data.fileName);
                return;
            }
            isc.Notify.addMessage("Unable to obtain a new unique project name");
        });
    }
,isc.A.autoAssignScreenName=function isc_Project_autoAssignScreenName(callback){
        var builder=this.builder,
            fileSpec={
                fileName:"New Screen",
                firstFileName:"Main Screen",
                fileType:"ui",
                fileFormat:"xml",
                fileLastModified:new Date(),
                lastUsedInProject:this.fileName,
                indexPrefix:" "
            }
        ;
        builder.screenDataSource.uniqueName(fileSpec,function(dsResponse,data,dsRequest){
            if(data){
                callback(data.fileName);
                return;
            }
            isc.Notify.addMessage("Unable to obtain a new unique screen name");
        });
    }
,isc.A.getUniqueProjectCopyName=function isc_Project_getUniqueProjectCopyName(baseFileName,callback){
        var builder=this.builder;
        baseFileName=baseFileName.replace(/\s+copy(?:\s+\(\d+\))?$/,"");
        var fileSpec={
                fileName:baseFileName+" copy",
                fileType:"proj",
                fileFormat:"xml",
                indexPrefix:" (",
                indexSuffix:")"
            }
        ;
        builder.projectDataSource.uniqueName(fileSpec,function(dsResponse,data,dsRequest){
            if(data){
                callback(data.fileName);
                return;
            }
            isc.Notify.addMessage("Unable to obtain a new unique project copy name");
        });
    }
,isc.A.getUniqueScreenCopyName=function isc_Project_getUniqueScreenCopyName(baseFileName,callback){
        var builder=this.builder;
        baseFileName=baseFileName.replace(/\s+copy(?:\s+\(\d+\))?$/,"");
        var fileSpec={
                fileName:baseFileName+" copy",
                fileType:"ui",
                fileFormat:"xml",
                indexPrefix:" (",
                indexSuffix:")"
            }
        ;
        builder.screenDataSource.uniqueName(fileSpec,function(dsResponse,data,dsRequest){
            if(data){
                callback(data.fileName);
                return;
            }
            isc.Notify.addMessage("Unable to obtain a new unique screen copy name");
        });
    }
,isc.A.getUniqueDataSourceCopyName=function isc_Project_getUniqueDataSourceCopyName(baseFileName,callback){
        var builder=this.builder;
        var regex=new RegExp(this._$copySuffix+"(?:\\d+)?$");
        baseFileName=baseFileName.replace(regex,"");
        var fileSpec={
                fileName:baseFileName+this._$copySuffix,
                fileType:"ds",
                fileFormat:"xml"
            }
        ;
        builder.dsDataSource.uniqueName(fileSpec,function(dsResponse,data,dsRequest){
            if(data){
                callback(data.fileName);
                return;
            }
            isc.Notify.addMessage("Unable to obtain a new unique data source name");
        });
    }
,isc.A.isEmpty=function isc_Project_isEmpty(){
       return this.screens.getLength()==0;
    }
,isc.A.addScreen=function isc_Project_addScreen(parent,fileName,title,contents,clobberExistingContents){
        if(!parent)parent=this.screens.getRoot();
        if(!fileName)fileName="";
        var currentScreen;
        if(this.builder.singleScreenMode){
            this.screens.removeList(this.screens.getAllNodes());
        }else{
            currentScreen=this.findScreen(fileName);
            if(currentScreen){
                if(fileName){
                    if(!clobberExistingContents){
                        return currentScreen;
                    }
                }else{
                    if(!this.builder||!this.builder.singleScreenMode){
                        currentScreen=null;
                    }
                }
            }
        }
        var screen=this.screens.add({
            fileName:fileName,
            title:title,
            contents:contents,
            isFolder:false
        },parent);
        if(currentScreen)this.removeScreen(currentScreen);
        this.autoSaveSoon();
        return screen;
    }
,isc.A.removeScreen=function isc_Project_removeScreen(screen,trackUsage){
        if(!screen)return;
        this.screens.remove(screen);
        if(trackUsage){
            var projectName=this.builder.getProjectDisplayName();
            this.builder._addUsageRecord("removeScreen",screen.title,projectName);
        }
    }
,isc.A.addGroup=function isc_Project_addGroup(parent,title){
        if(!parent)parent=this.screens.getRoot();
        return this.screens.add({
            title:title,
            isFolder:true
        },parent);
    }
,isc.A.removeGroup=function isc_Project_removeGroup(group){
        if(group)this.screens.remove(group);
    }
,isc.A.findScreen=function isc_Project_findScreen(fileName){
        if(!fileName)fileName="";
        return this.screens.find({
            fileName:fileName,
            isFolder:false
        });
    }
,isc.A.firstScreen=function isc_Project_firstScreen(mockupMode){
        var criteria={isFolder:false};
        if(mockupMode!=null)criteria.mockupMode=mockupMode;
        return this.screens.find(criteria);
    }
,isc.A.lastSavedScreen=function isc_Project_lastSavedScreen(mockupMode){
        var criteria={isFolder:false};
        if(mockupMode!=null)criteria.mockupMode=mockupMode;
        var screenNodes=this.screens.findAll(criteria);
        if(!screenNodes||screenNodes.length==0)return null;
        screenNodes=screenNodes.sortByProperty("lastSave",false,function(item,propertyName,context){
            var value=item[propertyName];
            return(isc.isA.String(value)?new Date(value):value);
        });
        return screenNodes[0];
    }
,isc.A.untitledScreen=function isc_Project_untitledScreen(){
        return this.findScreen(null);
    }
,isc.A.setScreenProperties=function isc_Project_setScreenProperties(screen,properties){
        isc.addProperties(screen,properties);
        this.autoSaveSoon(!screen.fileName);
        return screen;
    }
,isc.A.setScreenDirty=function isc_Project_setScreenDirty(screen,isDirty){
        var dirty=isDirty?new Date():null;
        if(dirty)this.screenDirty=dirty;
        this.setScreenProperties(screen,{
            dirty:dirty
        });
        this.autoSaveScreenSoon(screen);
    }
,isc.A.updateReifyPreviewSoon=function isc_Project_updateReifyPreviewSoon(){
        var builder=this.builder;
        if(builder&&builder.reifyWindow)builder.updateReifyPreviewSoon();
    }
,isc.A._launchGoToBuilder=function isc_Project__launchGoToBuilder(){
        if(this.builder)this.builder._launchGoToBuilder();
    }
,isc.A._createConfirmDialogButton=function isc_Project__createConfirmDialogButton(name,title){
        return{
            title:title,width:1,
            overflow:"visible",
            click:function(){
                var dialog=this.topElement;
                dialog.clear();
                dialog.returnValue(name);
            }
        };
    }
,isc.A._saveScreenContentsConfirmOverwrite=function isc_Project__saveScreenContentsConfirmOverwrite(screen){
        var project=this;
        isc.confirm("You are editing an old screen version. Would you like to make it the "+
            "current version or save it as a new screen? ",function(response){
            switch(response){
            case"overwrite":
                delete screen.oldVersionLoaded;
                project.saveScreenContents(screen);
                break;
            case"saveAs":
                project.builder.saveScreenAs(screen,function(){
                    delete screen.contents;
                    delete screen.oldVersionLoaded;
                });
                break;
            }
        },{
            buttons:[
                isc.Dialog.CANCEL,
                this._createConfirmDialogButton("overwrite","Make Current Version"),
                this._createConfirmDialogButton("saveAs","Save as New Screen")
            ]
        });
    }
,isc.A.saveScreenContents=function isc_Project_saveScreenContents(screen,autoSaved,callback,saveReason,initialVersion){
        if(!screen)return;
        if(screen.oldVersionLoaded){
            return this._saveScreenContentsConfirmOverwrite(screen);
        }
        var self=this,
            dirty=screen.dirty,
            screenDataSource=this.screenDataSource
        ;
        if(screen.fileName){
            if(autoSaved){
                this.builder.savingScreenLabel.setContents("Saving ...");
            }
            screenDataSource.saveFile({
                fileName:screen.fileName,
                fileType:'ui',
                fileFormat:'xml',
                fileAutoSaved:!!autoSaved,
                lastUsedInProject:self.fileName,
                saveReason:saveReason
            },screen.contents,function(dsResponse,data,dsRequest){
                if(!data){
                    isc.Notify.addMessage("Error saving screen '"+
                        dsRequest.data.fileName+"':<br>Your network connection may be down "+
                        "or the server unavailable. Will retry in 10 seconds.");
                    self.autoSaveScreenSoon(screen,10000);
                    return;
                }
                screen.lastSaveVersion=screenDataSource._getFileSpecFileVersion(data);
                if(dirty==screen.dirty)self.setScreenDirty(screen,false);
                if(initialVersion&&screen.versions&&screen.versions.length==1){
                    screenDataSource.removeFileVersion({
                        fileName:screen.fileName,
                        fileType:'ui',
                        fileFormat:'xml',
                        fileLastModified:screen.versions[0].fileLastModified
                    });
                    screen.versions=[];
                }
                if(self.builder.showRecentVersions){
                    if(!screen.versions)screen.versions=[];
                    else if(!isc.isAn.Array(screen.versions))screen.versions=[screen.versions];
                    screen.versions.unshift(data);
                }
                if(autoSaved){
                    self.builder.savingScreenLabel.setContents("All changes saved");
                }
                self.builder.resetUndoPosition(screen.lastSaveVersion);
                if(isc.Messaging&&screen.realTimeUpdates){
                    isc.Messaging.send([screen.realTimeUpdates],"refresh");
                }
                self.fireCallback(callback,"screen",[screen]);
            },{
                showPrompt:!autoSaved
            });
        }else{
            if(!this.saveScreenDialog){
                this.saveScreenDialog=this.createAutoChild('saveScreenDialog',{
                    dataSource:screenDataSource
                });
            }
            this.saveScreenDialog.showSaveFileUI(screen.contents,null,
                                                 function(dsResponse,data,dsRequest){
                if(dirty==screen.dirty)self.setScreenDirty(screen,false);
                if(data.fileName){
                    var existingScreen=self.findScreen(data.fileName);
                    if(existingScreen)self.removeScreen(existingScreen);
                }
                self.setScreenProperties(screen,{
                    fileName:data.fileName,
                    title:data.fileName
                });
                self.fireCallback(callback,"screen",[screen]);
            });
        }
    }
,isc.A.saveScreenAs=function isc_Project_saveScreenAs(screen,callback){
        var self=this;
        var initialSave=(screen.fileName==null||screen.fileName=="");
        if(!this.saveScreenDialog){
            this.saveScreenDialog=this.createAutoChild('saveScreenDialog',{
                dataSource:this.screenDataSource
            });
        }
        this.saveScreenDialog.showSaveFileUI(screen.contents,null,
                                             function(dsResponse,data,dsRequest){
            if(initialSave){
                self.setScreenDirty(screen,false);
                if(data.fileName){
                    var existingScreen=self.findScreen(data.fileName);
                    if(existingScreen)self.removeScreen(existingScreen);
                }
                self.setScreenProperties(screen,{
                    fileName:data.fileName,
                    title:data.fileName
                });
                self.setCurrentScreenFileName(data.fileName);
                newScreen=screen;
            }else{
                var newScreen=self.addScreen(self.screens.getParent(screen),data.fileName,
                                            data.fileName,screen.contents,true);
                self.setScreenProperties(newScreen,{lastSave:new Date()});
                self.builder.setCurrentScreen(newScreen);
            }
            self.fireCallback(callback,"screen",[newScreen]);
        });
    }
,isc.A.fetchScreenContents=function isc_Project_fetchScreenContents(screen,callback,version,useAsCurrent){
        if(screen){
            if(screen.contents||!screen.fileName){
                this.fireCallback(callback,"contents",[screen.contents]);
            }else{
                var self=this,
                    ownerId=self.getOwnerId(),
                    fileSpec={
                        ownerId:ownerId,
                        fileName:screen.fileName,
                        fileType:'ui',
                        fileFormat:'xml'
                    },
                    screenDataSource=this.screenDataSource,
                    dsCallback=function(dsResponse,data,dsRequest){
                        if(dsResponse.status<0){
                            self.fireCallback(callback,"contents",[null]);
                        }else{
                            var fileSpec=data?dsResponse.data[0]:null,
                                loadVersion=screenDataSource._getFileSpecFileVersion(fileSpec)
                            ;
                            screen.contents=data;
                            screen.lastLoad=(!version||useAsCurrent?new Date():null);
                            screen.lastLoadVersion=loadVersion;
                            screen.saveReason=(fileSpec?fileSpec.saveReason:null);
                            self.builder.withoutAutoSaving(function(){
                                self.setScreenDirty(screen,false);
                            });
                            self.fetchScreenHistory(screen);
                            self.fireCallback(callback,"contents",[data]);
                            if(useAsCurrent)self.builder.resetUndoPosition(loadVersion);
                        }
                    },
                    params={operationId:(ownerId?"allOwners":null)}
                ;
                if(version!=null){
                    screenDataSource.getFileVersion(fileSpec,version,dsCallback,params);
                }else{
                    screenDataSource.getFile(fileSpec,dsCallback,params);
                }
            }
        }else{
            this.fireCallback(callback,"contents",[null]);
        }
    }
,isc.A.fetchScreenHistory=function isc_Project_fetchScreenHistory(screen){
        var builder=this.builder;
        if(!builder.showRecentVersions)return;
        var screenDS=builder.project.screenDataSource;
        if(screenDS)screenDS.listFileVersions({
            fileName:builder.getCurrentScreenTitle(),
            fileType:'ui',
            fileFormat:'xml'
        },function(dsResponse,data){
            if(data&&!isc.isAn.Array(data))data=[data];
            screen.versions=data;
        });
    }
,isc.A.getCurrentScreen=function isc_Project_getCurrentScreen(){
        var builder=this.builder;
        if(!builder)return;
        return builder.currentScreen;
    }
,isc.A.xmlSerialize=function isc_Project_xmlSerialize(){
        var currentScreen=this.getCurrentScreen();
        if(currentScreen)currentScreen.isCurrent=true;
        var cleanProject={
            screens:this.createAutoChild("screens"),
            currentScreenFileName:this.currentScreenFileName,
            datasources:this.datasources
        };
        if(this.runConfigurations)cleanProject.runConfigurations=this.runConfigurations;
        if(this.authentication)cleanProject.authentication=this.authentication;
        cleanProject.screens.setRoot(
            this.screens.getCleanNodeData(this.screens.getRoot(),true,true,true)
        );
        cleanProject.screens.getAllNodes().map(function(node){
            if(!node.dirty||node.fileName){
                delete node.contents;
            }
            delete node.dirty;
            delete node.name;
            delete node.id;
            delete node.parentId;
            if(node.children&&node.children.length==0)delete node.children;
        });
        var authDS=isc.DS.get("ProjectAuthentication"),
            authDSUsersField=(authDS?authDS.getField("users"):null)
        ;
        if(authDSUsersField){
            authDSUsersField.type=isc.Auth.getUserSchema();
        }
        var xml=isc.DS.get("Project").xmlSerialize(cleanProject);
        if(currentScreen)delete currentScreen.isCurrent;
        cleanProject.screens.destroy();
        return xml;
    }
,isc.A.autoSaveSoon=function isc_Project_autoSaveSoon(updateReify){
        if(!this.disableAutoSave){
            this.fireOnPause("autoSave",function(){
                this.autoSave(updateReify!=false?"updateReifyPreviewSoon":null);
            },this.autoSavePause,"return !isc.EH.dragging");
        }
    }
,isc.A.autoSave=function isc_Project_autoSave(callback){
        if(this.disableAutoSave||this.isReadOnly())return;
        if(this.fileName){
            this.save(callback,{showPrompt:false},true);
        }else{
            var key=isc.Project.AUTOSAVE;
            if(this.builder){
                this.builder.cacheCurrentScreenContents();
                if(this.builder.singleScreenMode)key=isc.Project.AUTOSAVE_SINGLE_SCREEN;
                if(this.builder.mockupMode)key=isc.Project.AUTOSAVE_MOCKUPS;
            }
            isc.Offline.put(key,this.xmlSerialize());
            this.screenDirty=null;
            this.fireCallback(callback);
        }
    }
,isc.A.save=function isc_Project_save(callback,requestProperties,autoSaved){
        if(this.isReadOnly())return;
        if(this.fileName){
            if(this.builder)this.builder.cacheCurrentScreenContents();
            var self=this,
                screenDirty=this.screenDirty,
                projectDataSource=this.projectDataSource,
                spec=isc.addProperties({fileAutoSaved:!!autoSaved},this.fileSpec)
            ;
            projectDataSource.saveFile(spec,this.xmlSerialize(),function(dsResponse,data){
                if(screenDirty==self.screenDirty)self.screenDirty=null;
                self.lastSaveVersion=projectDataSource._getFileSpecFileVersion(data);
                self.fireCallback(callback);
            },requestProperties);
        }else if(!autoSaved){
            this.saveAs(callback);
        }
    }
,isc.A.autoSaveScreenSoon=function isc_Project_autoSaveScreenSoon(screen,delay){
        if(this.disableAutoSave||this.isReadOnly())return;
        if(!screen.dirty||!screen.fileName||screen.oldVersionLoaded)return;
        this.fireOnPause("autoSaveScreen"+screen.fileName,function(){
            this.saveScreenNow(screen);
        },delay||this.autoSavePause,"return !isc.EH.dragging");
        this.cancelActionOnPause("autoSave");
    }
,isc.A.saveScreenNow=function isc_Project_saveScreenNow(screen,callback){
        if(!screen.dirty||!screen.fileName||screen.oldVersionLoaded){
            if(callback)this.fireCallback(callback);
            return;
        }
        var project=this,
            builder=this.builder
        ;
        var saveScreen=function(reason,initialVersion,callback){
            project.setScreenProperties(screen,{lastSave:new Date()});
            project.saveScreenContents(screen,true,callback,reason,initialVersion);
        };
        var finalCallback=function(){
            project.updateReifyPreviewSoon();
            if(callback)project.fireCallback(callback);
        };
        var saveReason,
            initialVersion
        ;
        if(builder.addScreenSaveReasonFromUndoLog){
            var lastSave=screen.lastSave;
            if(lastSave!=null){
                if(isc.isA.String(lastSave))lastSave=new Date(lastSave);
                saveReason=builder.projectComponents.editContext.getCombinedUndoLogDescriptions(lastSave.getTime());
            }
        }
        if(builder.currentScreen==screen){
            if(builder.screenIsUndoVersion()){
                var markerVersions=builder.getUndoMarkerVersions()||[];
                if(markerVersions.length>0){
                    var loadedVersions=[],
                        loadCount=markerVersions.length
                    ;
                    var saveLoadedVersions=function(){
                        isc.RPC.startQueue();
                        for(var i=0;i<loadedVersions.length;i++){
                            var version=markerVersions[i],
                                contents=loadedVersions[i]
                            ;
                            builder.screenDataSource.saveFile({
                                fileName:screen.fileName,
                                fileType:'ui',
                                fileFormat:'xml',
                                fileAutoSaved:true,
                                fileLastModified:version,
                                lastUsedInProject:project.fileName,
                                saveReason:"Undo marker"
                            },contents,function(dsResponse,data,dsRequest){
                                if(!data)return;
                                if(builder.showRecentVersions)screen.versions.unshift(data);
                            });
                        }
                        saveScreen("Undo marker",initialVersion,function(){
                            screen.contents=builder.getUpdatedSource();
                            saveScreen(saveReason,initialVersion,finalCallback);
                        });
                        isc.RPC.sendQueue();
                    };
                    for(var i=0;i<loadCount;i++){
                        var ownerId=project.getOwnerId();
                        builder.screenDataSource.getFileVersion({
                            ownerId:ownerId,
                            fileName:screen.fileName,
                            fileType:'ui',
                            fileFormat:'xml'
                        },
                        markerVersions[i],
                        function(dsResponse,data,dsRequest){
                            var index=dsResponse.clientContext.markerIndex;
                            loadedVersions[index]=data;
                            if(--loadCount==0)saveLoadedVersions();
                        },
                        {
                            operationId:(ownerId?"allOwners":null),
                            clientContext:{markerIndex:i}
                        });
                    }
                    if(loadCount==0&&callback)project.fireCallback(callback);
                }else{
                    saveScreen("Undo marker",initialVersion,function(){
                        screen.contents=builder.getUpdatedSource();
                        saveScreen(saveReason,initialVersion,finalCallback);
                    });
                }
                return;
            }
            initialVersion=(screen.contents==null);
            screen.contents=builder.getUpdatedSource();
        }
        saveScreen(saveReason,initialVersion,finalCallback);
    }
,isc.A.exportProjectWindow=function isc_Project_exportProjectWindow(screen,vb){
        var vb=vb,
            project=vb.project,
            title="Export Project";
        var exportProjectDialog=isc.Window.create({
            title:title,
            width:520,
            overflow:"visible",
            autoSize:true,
            isModal:true,
            showModalMask:true,
            autoCenter:true,
            padding:8,
            items:[
                isc.DynamicForm.create({
                    isGroup:false,
                    width:"100%",
                    numCols:2,
                    colWidths:["40%","*"],
                    items:[
                        {title:"Project File",name:"projectArchiveName",type:"text",hint:".proj.zip",
                         defaultValue:(!project.name)?"":project.name,required:true},
                        {title:"Project Type",name:"projectType",type:"select",
                            redrawOnChange:true,
                            defaultValue:"smartclient",
                            valueMap:{
                                "smartclient":"SmartClient",
                                "smartgwt":"Smart GWT"
                            },
                            changed:function(form,item,value){
                                if(value=="smartclient"){
                                    form.setValue("includeJSP",true);
                                    form.setValue("includeHTML",false);
                                    form.setValue("datasourcesDir","shared/ds");
                                }else{
                                    form.setValue("includeJSP",false);
                                    form.setValue("includeHTML",true);
                                    form.setValue("datasourcesDir","ds");
                                }
                            }
                        },
                        {defaultValue:"Advanced Settings",type:"section",sectionExpanded:false,
                            itemIds:["datasourcesDir","includeTestData",
                                     "uiDir","projectToExport","includeHTML","htmlFilePath",
                                     "includeJSP","jspFilePath","includeProjectFile",
                                     "projectDir"]
                        },
                        {title:"DataSources directory",name:"datasourcesDir",type:"text",
                            defaultValue:"shared/ds"},
                        {title:"Include Test Data?",name:"includeTestData",type:"checkbox",
                            height:25,value:true,showIf:(vb.hostedMode?"false":null)},
                        {title:"Screens directory",name:"uiDir",type:"text",
                            defaultValue:"shared/ui"},
                        {title:"Include Project file?",name:"includeProjectFile",type:"checkbox",height:25,
                         redrawOnChange:true,value:true},
                        {title:"Project File Name",name:"projectToExport",type:"text",hint:".proj.xml",
                         showIf:"form.getValue('includeProjectFile') == true",defaultValue:(!project.name)?"":project.name,required:true},
                        {title:"Path to the Project file",name:"projectDir",type:"text",
                         showIf:"form.getValue('includeProjectFile') == true",defaultValue:"shared/ui"},
                        {title:"Include HTML launch file?",name:"includeHTML",type:"checkbox",height:25,
                         showIf:"form.getValue('projectType') == 'smartgwt'",
                         redrawOnChange:true,value:false},
                        {title:"Path to the HTML launch file",name:"htmlFilePath",type:"text",
                         showIf:"form.getValue('includeHTML') == true",required:true,hint:".html",
                         defaultValue:(!project.name)?"":project.name},
                        {title:"Include JSP launch file?",name:"includeJSP",type:"checkbox",height:25,
                         redrawOnChange:true,value:true},
                        {title:"Path to the JSP launch file",name:"jspFilePath",type:"text",
                         showIf:"form.getValue('includeJSP') == true",required:true,hint:".jsp",
                         defaultValue:(!project.name)?"":project.name},
                        {type:"RowSpacerItem",shouldSaveValue:false},
                        {type:"button",title:"Export",width:100,colSpan:2,align:"right",
                         click:function(form,item){
                             if(!form.validate())return;
                             var includeProjFile=form.getValue('includeProjectFile'),
                                 includeJspFile=form.getValue('includeJSP'),
                                 includeHtmlFile=form.getValue('includeHTML'),
                                 includeTestData=form.getValue('includeTestData'),
                                 projArchiveName=form.getValue('projectArchiveName'),
                                 projectToExport=form.getValue('projectToExport'),
                                 pathToProj=form.getValue('projectDir')||"",
                                 userFiles={},
                                 jspFilePath={},
                                 htmlFilePath={},
                                 projectDir="",
                                 projectLoaderPath="";
                             if(projectToExport.toLowerCase().indexOf(".proj.xml")!=-1){
                                 projectToExport=projectToExport.substring(0,projectToExport.indexOf(".proj.xml"));
                             }
                             if(projArchiveName.toLowerCase().indexOf(".proj.zip")==-1){
                                 projArchiveName=projArchiveName+".proj.zip";
                             }
                             if(includeJspFile&&screen){
                                 var jsp=form.getValue('jspFilePath');
                                 if(jsp.toLowerCase().indexOf(".jsp")==-1)jsp=jsp+".jsp";
                                 jspFilePath={
                                     path:jsp,
                                     content:vb._exportProjectScreenAsJSP(projectToExport,screen)
                                 };
                                 userFiles["README.txt"]=vb._exportProjectReadmeForSC();
                             }
                             if(includeHtmlFile){
                                 var html=form.getValue('htmlFilePath');
                                 if(html.toLowerCase().indexOf(".html")==-1)html=html+".html";
                                 if(html.contains("/")){
                                     projectLoaderPath=html.substring(0,html.lastIndexOf("/")+1);
                                 }
                                 htmlFilePath={
                                     path:html,
                                     content:vb._exportProjectAsHTML(projectToExport,screen,projectLoaderPath)
                                 };
                                 userFiles["README.txt"]=vb._exportProjectReadmeForSGWT();
                             }
                             if(includeProjFile&&pathToProj.trim().length>0){
                                 if(pathToProj.substring(pathToProj.length-1,pathToProj.length)!="/"){
                                     pathToProj=pathToProj+"/";
                                 }
                                 projectDir=pathToProj;
                             }
                             var settings={
                                 projectType:form.getValue('projectType'),
                                 datasourcesDir:form.getValue('datasourcesDir'),
                                 includeTestData:includeTestData,
                                 uiDir:form.getValue('uiDir'),
                                 includeJSP:includeJspFile,
                                 jspFilePath:jspFilePath,
                                 includeHTML:includeHtmlFile,
                                 htmlFilePath:htmlFilePath,
                                 includeProjectFile:includeProjFile,
                                 projectDir:projectDir,
                                 projectArchiveName:projArchiveName,
                                 userFiles:userFiles
                             };
                             vb.exportProject(projectToExport,settings);
                             exportProjectDialog.destroy();
                         }
                        }
                    ]
                })
            ]
        });
        exportProjectDialog.show();
    }
);
isc.evalBoundary;isc.B.push(isc.A.saveAs=function isc_Project_saveAs(callback){
        if(this.isReadOnly())return;
        if(this.builder)this.builder.cacheCurrentScreenContents();
        if(!this.saveProjectDialog){
            this.saveProjectDialog=this.createAutoChild("saveProjectDialog",{
                dataSource:this.projectDataSource
            });
        }
        var self=this;
        var screenDirty=this.screenDirty;
        this.saveProjectDialog.showSaveFileUI(this.xmlSerialize(),null,function(dsResponse,data,dsRequest){
            isc.Offline.remove(isc.Project.AUTOSAVE);
            if(screenDirty==self.screenDirty)self.screenDirty=null;
            self.setFileName(data.fileName);
            self.setName(data.fileName);
            self.fireCallback(callback);
        });
    }
,isc.A.rename=function isc_Project_rename(callback){
        if(this.isReadOnly())return;
        if(this.fileName==null){
            this.saveAs();
            return;
        }
        var self=this;
        this.showRenameDialog("Rename Project",this.fileName,"proj","xml",this.builder.projectDataSource,
            function(newFileName){
                self.setFileName(newFileName);
                self.setName(newFileName);
                self.save(callback);
            }
        );
    }
,isc.A.renameCurrentScreen=function isc_Project_renameCurrentScreen(callback){
        var self=this,
            screen=this.getCurrentScreen()
        ;
        if(this.currentScreenFileName==null||!screen.fileName==null){
            this.saveScreenAs(screen,callback);
            return;
        }
        this.showRenameDialog("Rename Screen",screen.fileName,"ui","xml",this.builder.screenDataSource,
            function(newFileName){
                self.finishRenameScreenTo(newFileName);
            }
        );
    }
,isc.A.showRenameDialog=function isc_Project_showRenameDialog(title,oldFileName,fileType,fileFormat,ds,callback){
        var self=this,
            dialog
        ;
        var form=isc.DynamicForm.create({
            width:500,autoDraw:false,autoFocus:true,
            bottomPadding:5,topPadding:5,cellPadding:5,
            numCols:2,colWidths:[50,"*"],
            items:[
                {showTitle:false,editorType:"CanvasItem",height:50,
                    icons:[{width:32,height:32,src:"[SKIN]/Dialog/ask.png"}]},
                {name:"newFileName",editorType:"TextItem",width:"*",
                    title:"Rename "+oldFileName+" to",titleOrientation:"top",
                    required:true,
                    changed:"form.clearValue('message'); form.markForRedraw()"},
                {type:"SpacerItem"},
                {name:"message",editorType:"BlurbItem",showTitle:false,startRow:false,
                        showIf:"value != null"}
            ],
            saveOnEnter:true,
            submit:function(){
                this.rename();
            },
            rename:function(){
                if(!this.validate())return;
                var form=this,
                    newFileName=this.getValue("newFileName")
                ;
                self.renameFile(oldFileName,newFileName,fileType,fileFormat,ds,
                    function(fileName,errorSource){
                        if(fileName){
                            dialog.destroy();
                            callback(fileName);
                            return;
                        }
                        if(errorSource=="oldFileName"){
                            if(fileType=="proj"){
                                self.setFileName(newFileName);
                                self.setName(newFileName);
                                self.autoSave(function(){
                                    dialog.destroy();
                                    callback(newFileName);
                                });
                            }else{
                                var screen=self.getCurrentScreen();
                                screen.fileName=newFileName;
                                self.saveScreenContents(screen,true,function(){
                                    dialog.destroy();
                                    callback(newFileName);
                                });
                            }
                            return;
                        }
                        var revisedFileName=newFileName+" ("+self.fileName+")";
                        self.screenDataSource.getFile({
                            fileName:newFileName,
                            fileType:'ui',
                            fileFormat:'xml'
                        },function(dsResponse,data,dsRequest){
                            var fileSpec=dsResponse.data[0],
                                lastUsedInProject=fileSpec.lastUsedInProject
                            ;
                            if(lastUsedInProject&&lastUsedInProject==self.fileName){
                                var message=isc.Canvas.imgHTML({
                                    src:"[SKINIMG]actions/exclamation.png"
                                })+" "+newFileName+" already exists";
                                form.setValue("message",message);
                                form.focusInItem("newFileName");
                                form.markForRedraw();
                                return;
                            }
                            var message="You already have screen called \""+newFileName+
                                "\""+(lastUsedInProject?", last used in project \""+
                                        lastUsedInProject+"\"":"")+
                                ".<P>Would you like to name your screen \""+
                                revisedFileName+"\" instead?"
                            ;
                            isc.warn(message,function(value){
                                if(value){
                                    form.setValue("newFileName",revisedFileName);
                                    form.delayCall("rename");
                                    return;
                                }
                                var message=isc.Canvas.imgHTML({
                                    src:"[SKINIMG]actions/exclamation.png"
                                })+" "+newFileName+" already exists";
                                form.setValue("message",message);
                                form.focusInItem("newFileName");
                                form.markForRedraw();
                            },{
                                buttons:[
                                    isc.Dialog.CANCEL,
                                    isc.Dialog.OK
                                ],
                                autoFocusButton:1
                            });
                        });
                    }
                );
            }
        });
        var buttonsLayout=isc.HLayout.create({
            autoDraw:false,
            width:500,
            height:20,
            align:"right",
            membersMargin:10,
            padding:10,
            members:[
                isc.Button.create({title:"Cancel",click:function(){
                    dialog.destroy();
                }}),
                isc.Button.create({title:"Rename",name:"rename",click:function(){
                    form.rename();
                }})
            ]
        });
        dialog=isc.Window.create({
            title:title,autoSize:true,items:[form,buttonsLayout],autoCenter:true
        });
        dialog.show();
    }
,isc.A.renameScreenTo=function isc_Project_renameScreenTo(newFileName){
        var self=this,
            screen=this.getCurrentScreen(),
            oldFileName=screen.fileName
        ;
        this.renameFile(oldFileName,newFileName,"ui","xml",this.builder.screenDataSource,
                        function(fileName,errorSource){
            if(errorSource=="oldFileName"){
                var screen=self.getCurrentScreen();
                screen.fileName=newFileName;
                self.saveScreenContents(screen,true,function(){
                    self.finishRenameScreenTo(newFileName);
                });
                return;
            }
            self.finishRenameScreenTo(fileName);
        });
    }
,isc.A.finishRenameScreenTo=function isc_Project_finishRenameScreenTo(newFileName){
        var screen=this.getCurrentScreen();
        if(screen)this.builder._addUsageRecord("renameScreen",newFileName,screen.fileName);
        var newScreen=this.addScreen(this.screens.getParent(screen),
                        newFileName,newFileName,screen.contents,true);
        this.setScreenProperties(newScreen,{lastSave:new Date()});
        this.builder.setCurrentScreen(newScreen);
        this.removeScreen(screen);
    }
,isc.A.renameFile=function isc_Project_renameFile(oldFileName,newFileName,fileType,fileFormat,ds,callback){
        ds.renameFile({
            fileName:oldFileName,
            fileType:fileType,
            fileFormat:fileFormat
        },{
            fileName:newFileName,
            fileType:fileType,
            fileFormat:fileFormat
        },function(dsResponse,data,dsRequest){
            var errorSource=null;
            if(dsResponse.status<0){
                newFileName=null;
                if(dsResponse.data=="destination file already exists"){
                    errorSource="newFileName";
                }else if(dsResponse.data=="source file does not exist"){
                    errorSource="oldFileName";
                }
            }
            callback(newFileName,errorSource);
        });
    }
,isc.A.duplicate=function isc_Project_duplicate(){
        var project=this,
            builder=this.builder
        ;
        builder.withoutDirtyTracking(function(){
            builder.clearScreenUI();
        });
        isc.showPrompt("Copying project datasources... ${loadingImage}");
        this.duplicateProjectDataSources(function(dsMap){
            isc.showPrompt("Copying project screens... ${loadingImage}");
            project.duplicateProjectScreens(dsMap,function(){
                isc.showPrompt("Saving copied project... ${loadingImage}");
                project.getUniqueProjectCopyName(project.fileName,function(fileName){
                    project.setFileName(fileName);
                    project.setReadOnly(false);
                    var screenNodes=project.screens.getAllNodes(),
                        saveCount=screenNodes.length
                    ;
                    for(var i=0;i<screenNodes.length;i++){
                        var node=screenNodes[i];
                        project.saveScreenContents(node,true,function(){
                            if(--saveCount==0){
                                project.autoSave(function(){
                                    builder.loadProject(project.fileName);
                                    isc.clearPrompt();
                                });
                            }
                        });
                    }
                });
            });
        });
    }
,isc.A.duplicateProjectDataSources=function isc_Project_duplicateProjectDataSources(callback){
        var project=this,
            builder=project.builder,
            ownerId=this.getOwnerId(),
            dsList=this.datasources,
            dsMap={},
            dsCount=0
        ;
        if(!dsList||dsList.length==0){
            project.fireCallback(callback,"dsMap",[dsMap]);
        }
        for(var i=0;i<dsList.length;i++){
            dsMap[dsList[i].dsName]=null;
            dsCount++;
        }
        for(var i=0;i<dsList.length;i++){
            var fileName=dsList[i].dsName;
            builder.dsDataSource.getFile({
                ownerId:ownerId,
                fileName:fileName,
                fileType:"ds",
                fileFormat:"xml"
            },function(dsResponse,data,dsRequest){
                var fileName=dsResponse.data[0].fileName;
                project.getUniqueDataSourceCopyName(fileName,function(uniqueFileName){
                    data=data.replace("ID=\""+fileName+"\"","ID=\""+uniqueFileName+"\"");
                    builder.dsDataSource.saveFile({
                        fileName:uniqueFileName,
                        fileType:"ds",
                        fileFormat:"xml"
                    },data,function(dsResponse,data,dsRequest){
                        if(dsResponse.status>=0){
                            isc.ClassFactory._setVBLoadingDataSources(true);
                            isc.DS.get(uniqueFileName,function(dsID){
                                var ds=isc.DS.get(isc.isAn.Array(dsID)?dsID[0]:dsID);
                                isc.ClassFactory._setVBLoadingDataSources(null);
                                dsMap[fileName]=ds.ID;
                                for(var i=0;i<dsList.length;i++){
                                    if(dsList[i].dsName==fileName){
                                        dsList[i].dsName=ds.ID;
                                    }
                                }
                                if(--dsCount==0){
                                    project.fireCallback(callback,"dsMap",[dsMap]);
                                }
                            },{loadParents:true});
                        }
                    },{
                        operationId:"allOwners"
                    });
                });
            },{
                operationId:(ownerId?"allOwners":null)
            });
        }
    }
,isc.A.duplicateProjectScreens=function isc_Project_duplicateProjectScreens(dsMap,callback){
        var project=this,
            builder=this.builder,
            screenNodes=this.screens.getAllNodes(),
            screenCount=screenNodes.length,
            skippedNodes=[]
        ;
        var editPane=isc.EditPane.create({
            autoDraw:false,
            defaultPalette:builder.libraryComponents
        });
        var screenUpdated=function(node){
            project.getUniqueScreenCopyName(node.fileName,function(fileName){
                node.fileName=fileName;
                node.title=fileName;
                if(--screenCount==0){
                    if(skippedNodes.length>0)project.screens.removeList(skippedNodes);
                    project.fireCallback(callback);
                }
            });
        };
        var screenSkipped=function(node){
            skippedNodes.add(node);
            if(--screenCount==0){
                if(skippedNodes.length>0)project.screens.removeList(skippedNodes);
                project.fireCallback(callback);
            }
        };
        var updateScreen=function(node){
            if(node.contents){
                project.renameScreenDataSources(editPane.getEditContext(),dsMap,node.contents,function(contents){
                    node.contents=contents;
                    screenUpdated(node);
                });
            }else if(node.fileName){
                var ownerId=project.getOwnerId(),
                    fileSpec={
                        ownerId:ownerId,
                        fileName:node.fileName,
                        fileType:'ui',
                        fileFormat:'xml'
                    }
                ;
                builder.screenDataSource.getFile(fileSpec,function(dsResponse,data,dsRequest){
                    if(dsResponse.status<0||!dsResponse.data||dsResponse.data.length==0){
                        screenSkipped(node);
                    }else{
                        project.renameScreenDataSources(editPane.getEditContext(),dsMap,data,function(contents){
                            node.contents=contents;
                            screenUpdated(node);
                        });
                    }
                },{
                    operationId:(ownerId?"allOwners":null)
                });
            }
        };
        for(var i=0;i<screenNodes.length;i++){
            var node=screenNodes[i];
            updateScreen(node);
        }
    }
,isc.A.renameScreenDataSources=function isc_Project_renameScreenDataSources(editContext,dsMap,contents,callback){
        var project=this;
        editContext.getPaletteNodesFromXML(contents,function(paletteNodes){
            editContext.destroyAll();
            editContext.addFromPaletteNodes(paletteNodes);
            var editTree=editContext.getEditNodeTree(),
                editNodes=editTree.getAllNodes(),
                changed=false
            ;
            if(editNodes)editNodes.map(function(node){
                if(node.isLoaded&&node.liveObject&&isc.isA.DataSource(node.liveObject)){
                    if(dsMap[node.ID]!=null){
                        var paletteNode=isc.Tree.getCleanNodeData(node,false,false,false,editTree);
                        delete paletteNode.liveObject;
                        delete paletteNode.parentId;
                        paletteNode.ID=dsMap[node.ID];
                        if(paletteNode.name)paletteNode.name=dsMap[node.ID];
                        if(paletteNode.defaults&&paletteNode.defaults.ID)paletteNode.defaults.ID=dsMap[node.ID];
                        var newNode=editContext.makeEditNode(paletteNode),
                            parentNode=editTree.getParent(node)
                        ;
                        editContext.removeNode(node);
                        editContext.addNode(newNode,parentNode,0);
                        changed=true;
                    }
                }
            });
            var xml=editContext.serializeAllEditNodes();
            project.fireCallback(callback,"contents,changed",[xml,changed]);
        });
    }
,isc.A.renameDataSource=function isc_Project_renameDataSource(oldID,newID,fieldRenames,callback){
        var dsMap={};
        dsMap[oldID]=newID;
        var project=this,
            builder=this.builder,
            screenNodes=this.screens.getAllNodes()
        ;
        isc.showPrompt("Updating DataSource references in project screens... ${loadingImage}");
        builder.withoutDirtyTracking(function(){
            builder.clearScreenUI(true);
        });
        var editPane=isc.EditPane.create({
            autoDraw:false,
            defaultPalette:builder.libraryComponents,
            editContextDefaults:{
                editNodeUpdated:function(editNode,editContext,modifiedProperties){
                    var editTree=this.creator,
                        libraryComponents=editTree.defaultPalette,
                        autoIdField=isc.DS.getToolAutoIdField(editNode)
                    ;
                    if(autoIdField&&editNode.defaults&&editNode.defaults[autoIdField]){
                        var newAutoID;
                        if(modifiedProperties.contains("dataSource")){
                            var dataSource=isc.DS.get(editNode.liveObject.dataSource),
                                dsID=(dataSource?dataSource.ID:null)
                            ;
                            if(dsID){
                                var type=editNode.idName||editNode.idPrefix||editNode.type;
                                newAutoID=libraryComponents.getNextAutoId(type,editNode,dsID,
                                    editTree.editContext.editNodeTree);
                            }
                        }
                        if(newAutoID&&autoIdField){
                            var props={};
                            props[autoIdField]=newAutoID;
                            editContext.setNodeProperties(editNode,props);
                        }
                    }
                }
            }
        });
        var editContext=editPane.getEditContext();
        if(fieldRenames)editContext.fieldRenames=fieldRenames;
        this._renameDataSourceOnScreens(editContext,dsMap,screenNodes,function(){
            editPane.destroy();
            builder.loadProject(project.fileName);
            isc.clearPrompt();
            isc.Notify.addMessage("DataSource successfully renamed");
            if(callback)callback();
        });
    }
,isc.A._renameDataSourceOnScreens=function isc_Project__renameDataSourceOnScreens(editContext,dsMap,screenNodes,callback,currentIndex,context){
        var project=this;
        if(currentIndex==null)currentIndex=0;
        if(!context){
            context={
                screenNodes:screenNodes,
                screenCount:screenNodes.length,
                saveCount:screenNodes.length,
                screensChanged:{}
            };
        }
        var node=screenNodes[currentIndex];
        this._renameDataSourceOnScreen(editContext,dsMap,context,node,function(){
            if(++currentIndex<screenNodes.length){
                project._renameDataSourceOnScreens(editContext,dsMap,screenNodes,callback,currentIndex,context);
                return;
            }
            for(var i=0;i<context.screenNodes.length;i++){
                var screenNode=context.screenNodes[i],
                    saveComplete=function(){
                        if(--context.saveCount==0){
                            project.autoSave(function(){
                                if(callback)callback();
                            });
                        }
                    }
                ;
                if(!context.screensChanged[screenNode.title]){
                    saveComplete();
                }else{
                    project.saveScreenContents(screenNode,true,saveComplete);
                }
            }
        });
    }
,isc.A._renameDataSourceOnScreen=function isc_Project__renameDataSourceOnScreen(editContext,dsMap,context,node,callback){
        var project=this,
            builder=this.builder
        ;
        var screenUpdated=function(node,changed){
            context.screensChanged[node.title]=changed;
        };
        if(node.contents){
            project.renameScreenDataSources(editContext,dsMap,node.contents,function(contents,changed){
                node.contents=contents;
                screenUpdated(node,changed);
                project.fireCallback(callback);
            });
        }else if(node.fileName){
            var fileSpec={
                    ownerId:project.getOwnerId(),
                    fileName:node.fileName,
                    fileType:'ui',
                    fileFormat:'xml'
                }
            ;
            builder.screenDataSource.getFile(fileSpec,function(dsResponse,data,dsRequest){
                if(dsResponse.status<0){
                    screenUpdated(node);
                    project.fireCallback(callback);
                }else{
                    project.renameScreenDataSources(editContext,dsMap,data,function(contents,changed){
                        node.contents=contents;
                        screenUpdated(node,changed);
                        project.fireCallback(callback);
                    });
                }
            });
        }
    }
,isc.A.saveGoToBuilderScreen=function isc_Project_saveGoToBuilderScreen(desiredScreenName,xml,callback){
        var advancedCriteria={_constructor:"AdvancedCriteria",operator:"and",criteria:[
            {fieldName:"fileName",operator:"startsWith",value:desiredScreenName},
            {fieldName:"fileType",operator:"equals",value:"ui"},
            {fieldName:"fileFormat",operator:"equals",value:"xml"}
        ]};
        var screenDataSource=this.builder.screenDataSource;
        screenDataSource.listFiles(advancedCriteria,function(rpcResponse){
            var saltId,
                fileNames=rpcResponse.data,
                screenName=desiredScreenName;
            for(var saltId=2;fileNames.find("fileName",screenName);saltId++){
                screenName=desiredScreenName+" ("+saltId+")";
            }
            screenDataSource.saveFile({
                fileName:screenName,fileType:'ui',fileFormat:'xml'
            },xml,callback);
        });
    }
,isc.A.rebindCurrentScreenDataSources=function isc_Project_rebindCurrentScreenDataSources(renames,adds){
        var tree=this.builder.projectComponents,
            editContext=tree.getEditContext(),
            _this=this
        ;
        var editNodes=editContext.getEditNodeArray();
        if(editNodes)editNodes.map(function(node){
            if(node.liveObject&&isc.isA.DataSource(node.liveObject)){
                var ds=node.liveObject;
                var paletteNode=_this.builder.dataSourceList.data.find("ID",ds.ID);
                if(!paletteNode)return;
                var newEditNode=_this.builder.dataSourceList.makeEditNode(paletteNode),
                    undef
                ;
                newEditNode.liveObject=isc.DS.get(ds.ID);
                if(node.referenceInProject!=undef)newEditNode.referenceInProject=node.referenceInProject;
                var dsFieldRenames=(renames!=null?renames[ds.ID]:null);
                if(dsFieldRenames){
                    editContext.fieldRenames=dsFieldRenames;
                }
                var parentNode=tree.data.getParent(node);
                editContext.addNode(newEditNode,parentNode,0,null,false,true,true);
                editContext.fieldRenames=null;
            }
        });
    }
,isc.A.updateCurrentScreenDataSourcesSecurity=function isc_Project_updateCurrentScreenDataSourcesSecurity(){
        var tree=this.builder.projectComponents,
            editContext=tree.getEditContext(),
            _this=this,
            updatedDataSources={}
        ;
        var editNodes=editContext.getEditNodeArray();
        if(editNodes)editNodes.map(function(node){
            if(node.liveObject&&isc.isA.DataSource(node.liveObject)){
                var ds=node.liveObject;
                if(updatedDataSources[ds.ID]||ds.calculateDeclarativeSecuritySettings()){
                    updatedDataSources[ds.ID]=true;
                    var paletteNode=_this.builder.dataSourceList.data.find("ID",ds.ID);
                    if(!paletteNode)return;
                    var newEditNode=_this.builder.dataSourceList.makeEditNode(paletteNode),
                        undef
                    ;
                    newEditNode.liveObject=isc.DS.get(ds.ID);
                    if(node.referenceInProject!=undef)newEditNode.referenceInProject=node.referenceInProject;
                    var parentNode=tree.data.getParent(node);
                    editContext.addNode(newEditNode,parentNode,0,null,false,true,true);
                }
            }
        });
    }
);
isc.B._maxIndex=isc.C+62;

isc.ClassFactory.defineClass("VisualBuilder","VLayout");
isc.A=isc.VisualBuilder;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.titleEditEvent="doubleClick";
isc.A.timeFormats=[
        [60,'seconds ago'],
        [120,'1 minute ago'],
        [3600,'minutes',60],
        [7200,'about 1 hour ago'],
        [86400,'hours',3600]
    ];
isc.B.push(isc.A.timeSince=function isc_c_VisualBuilder_timeSince(time){
        if(time==null||!time.getTime)return"";
        time=time.getTime();
        var now=new Date().getTime();
        var seconds=(now-time)/1000;
        if(seconds==0)return"Just now";
        var yesterday=new Date();
        yesterday.setDate(yesterday.getDate()-1);
        var lastWeekStart=new Date();
        lastWeekStart.setDate(lastWeekStart.getDate()-6);
        var checkDate=new Date(now-seconds*1000);
        if(isc.DateUtil.compareLogicalDates(checkDate,yesterday)==0){
            return"yesterday at "+isc.DateUtil.format(checkDate,"h:mm a");
        }else if(isc.DateUtil.compareLogicalDates(checkDate,yesterday)>0&&isc.DateUtil.compareLogicalDates(checkDate,lastWeekStart)<=0){
            return"on "+checkDate.getDayName()+" at  "+isc.DateUtil.format(checkDate,"h:mm a");
        }else if(isc.DateUtil.compareLogicalDates(checkDate,lastWeekStart)>0){
            return"on "+isc.DateUtil.format(checkDate,"d MMMM, yyyy");
        }
        var i=0,
            format;
        while(format=this.timeFormats[i++]){
            if(seconds<format[0]){
                if(format[2]==null){
                    return format[1];
                }else{
                    return Math.floor(seconds/format[2])+' '+format[1]+' ago';
                }
            }
        }
        return time;
    }
,isc.A.getEventDefinition=function isc_c_VisualBuilder_getEventDefinition(className,methodName){
        var docRef="method:"+className+"."+methodName,
            docItem=isc.jsdoc.getDocItem(docRef)
        ;
        if(docItem){
            var type=isc.jsdoc.getAttribute(docItem,isc.jsdoc._$jsType);
            if(type=="method"){
                if(!isc.jsdoc.getAttribute(docItem,"deprecated")){
                    return docItem;
                }
                return null;
            }
        }
        var type=isc.DS.get(className);
        if(!type||!type.inheritsFrom)return null;
        var parentType=isc.DS.get(type.inheritsFrom);
        if(!parentType)return null;
        return this.getEventDefinition(parentType.ID,methodName);
    }
);
isc.B._maxIndex=isc.C+2;

isc.A=isc.VisualBuilder.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.hostedMode=false;
isc.A.mockDataSourceSampleWizardName="sampleData";
isc.A.saveFileBuiltinIsEnabled=false;
isc.A.loadFileBuiltinIsEnabled=false;
isc.A.filesystemDataSourceEnabled=false;
isc.A.skin="Tahoe";
isc.A.defaultApplicationMode="edit";
isc.A.skinValueMap={
    Tahoe:"Tahoe",
    Stratus:"Stratus",
    Obsidian:"Obsidian",
    Enterprise:"Enterprise",
    Graphite:"Graphite",
    EnterpriseBlue:"Enterprise Blue",
    Simplicity:"Simplicity",
    BlackOps:"Black Ops",
    TreeFrog:"TreeFrog"
};
isc.A.showScreenList=false;
isc.A.immediatelySaveComponentChanges=true;
isc.A.autoNameAndSaveProjectsAndScreens=!isc.Browser.seleniumPresent;
isc.A.maxAutoSavesInRevertMenu=8;
isc.A.keepUndoLog=false;
isc.A.addScreenSaveReasonFromUndoLog=false;
isc.A.allowLoadingOtherUsersScreensAndDataSources=false;
isc.A.mustBeOwnerToSave=true;
isc.A.enableRelationEditor=true;
isc.A.openFullBuilderSeparately=true;
isc.A.defaultComponentsURL="defaultComponents.xml";
isc.A.defaultMockupComponentsURL="defaultMockupComponents.xml";
isc.A.customComponentsURL="customComponents.xml";
isc.A.globalDependenciesURL="globalDependencies.xml";
isc.A.projectRunnerURL="projectRunner.jsp";
isc.A.deploymentConsoleURL="deploymentConsole.jsp";
isc.A.canAddRootComponents=false;
isc.A.storageMode="dataSourceOnly";
isc.A.offlineStorageKey="VisualBuilder-savedSettings";
isc.A.settingsFile="vb.settings.xml";
isc.A.dsWizardsFile="dataSourceWizards.xml";
isc.A.defaultSettingsURL="default.vb.settings.xml";
isc.A.defaultProjectURL="default.proj.xml";
isc.A._saveSettingsCallbacks=[];
isc.A.loadProjectDialogConstructor='ProjectFileLoadDialog';
isc.A.loadProjectDialogDefaults={
    title:'Open Project',
    actionButtonTitle:'Open Project',
    fileType:'proj',
    fileFormat:'xml',
    useXmlToJs:true,
    showLoadFileUI:function(){
        if(this.creator.hostedMode){
            this.noFilesMessage="No projects found";
            this.disableFileName(true);
        }
        this.Super("showLoadFileUI",arguments);
        if(this.creator.userId&&!this.creator.userIsGuest()){
            this.directoryListing.showField("ownerId");
            this.directoryListing.initialCriteria={ownerId:this.creator.userId};
            delete this.directoryListing._setFilter;
        }
    },
    directoryListingProperties:{
        canEdit:false,
        showFilterEditor:true,
        filterOnKeypress:true,
        filterLocalData:true,
        fields:[{
            name:"fileName",
            title:"Name",
            width:"*"
        },{
            name:"ownerId",
            title:"Owner",
            width:"*",
            hidden:true
        },{
            name:"fileLastModified",
            title:"Last Modified",
            type:"datetime",
            width:150
        }],
        setData:function(data){
            if(data&&!isc.isA.ResultSet(data)&&!isc.isAn.emptyArray(data)){
                data=isc.ResultSet.create({
                    dataSource:this.dataSource,
                    allRows:data
                });
                if(!this._setFilter){
                    this._setFilter=true;
                    if(this.initialCriteria){
                        this.setFilterEditorCriteria(this.initialCriteria);
                        data.setCriteria(this.initialCriteria);
                    }
                }
            }
            this.Super("setData",arguments);
        }
    }
};
isc.A.dataSourcesSlowLoadInitialDelay=0;
isc.A.dataSourcesSlowLoadDelay=0;
isc.A.recentProjectsCount=5;
isc.A._updateReifyPreviewDelay=5000;
isc.A._confirmReifyPreviewId="confirmReify";
isc.A._confirmOpenInBuilderId="confirmOpenInBuilder";
isc.A.jspFileSourceDefaults={
    _constructor:"FileSource",
    defaultPath:"[VBWORKSPACE]",
    webrootOnly:false,
    saveWindowProperties:{
        title:"Export JSP",
        actionButtonTitle:"Export JSP",
        webrootOnly:false,
        fileFilters:[{
            filterName:"JSP Files",
            filterExpressions:[/.*\.jsp$/i]
        }],
        directoryListingProperties:{
            canEdit:false
        },
        getFileName:function(fileName){
            if(fileName.toLowerCase().endsWith(".jsp")){
                return fileName;
            }else{
                return fileName+".jsp";
            }
        }
    }
};
isc.A.loadScreenDialogConstructor='ProjectFileLoadDialog';
isc.A.loadScreenDialogDefaults={
    title:'Load Shared Screen',
    actionButtonTitle:'Load Screen',
    fileNameTitle:"Screen name",
    fileType:'ui',
    fileFormat:'xml',
    showLoadFileUI:function(){
        if(this.creator.hostedMode){
            this.noScreensMessage="No screens found";
            this.disableFileName(true);
        }
        this.Super("showLoadFileUI",arguments);
        if(this.creator.hostedMode){
            var ds=isc.DS.get(this.creator.screenDataSource);
            if(ds&&ds.getField("lastUsedInProject")){
                this.directoryListing.showField("lastUsedInProject");
            }
        }
        if(this.creator.userId&&!this.creator.userIsGuest()){
            if(this.creator.allowLoadingOtherUsersScreensAndDataSources){
               this.directoryListing.showField("ownerId");
            }
            this.directoryListing.initialCriteria={ownerId:this.creator.userId};
            delete this.directoryListing._setFilter;
        }
    },
    directoryListingProperties:{
        canEdit:false,
        showFilterEditor:true,
        filterOnKeypress:true,
        filterLocalData:true,
        fields:[{
            name:"fileName",
            title:"Name",
            width:"*"
        },{
            name:"lastUsedInProject",
            title:"Last used in project",
            autoFitWidth:true,
            autoFitWidthApproach:"both",
            hidden:true
        },{
            name:"ownerId",
            title:"Owner",
            width:"*",
            hidden:true
        },{
            name:"fileLastModified",
            title:"Last Modified",
            type:"datetime",
            width:150
        }],
        setData:function(data){
            if(data&&!isc.isA.ResultSet(data)&&!isc.isAn.emptyArray(data)){
                data=isc.ResultSet.create({
                    dataSource:this.dataSource,
                    allRows:data
                });
                if(!this._setFilter){
                    this._setFilter=true;
                    if(this.initialCriteria){
                        this.setFilterEditorCriteria(this.initialCriteria);
                        data.setCriteria(this.initialCriteria);
                    }
                }
            }
            this.Super("setData",arguments);
        }
    }
};
isc.A._loadSharedScreenId="loadSharedScreen";
isc.A.recentScreensCount=3;
isc.A.singleScreenMode=false;
isc.A.singleScreenModeProjectFileName="vb.singleScreen";
isc.A.vertical=true;
isc.A.sControlIsomorphicDir="http://www.isomorphic.com/isomorphic/";
isc.A.sControlSkin="SmartClient";
isc.A.workspacePath="[VBWORKSPACE]";
isc.A.workspaceURL="workspace/";
isc.A.basePathRelWorkspace="..";
isc.A.webRootRelWorkspace="../../..";
isc.A.useFieldMapper=false;
isc.A.helpPaneProperties={
    headerTitle:"Learn to Reify",
    contentsURL:(window.vbRootURL||"")+"visualBuilderHelp.html"
};
isc.A.canEditExpressions=true;
isc.A.typeCount={};
isc.A.disableDirtyTracking=0;
isc.A.workspaceDefaults={
    _constructor:"TLayout",
    vertical:false,
    autoDraw:false,
    resizeBarProperties:{
        showRollOverTab:true,
        rollOverTabProperties:{
            hoverStyle:"darkHover"
        },
        rollOverTabCollapsedPrompt:"Expand side panel",
        rollOverTabExpandedPrompt:"Collapse side panel"
    },
    backgroundColor:isc.nativeSkin?null:"black"
};
isc.A.leftStackDefaults={
    _constructor:"TSectionStack",
    autoDraw:false,
    width:320,
    showResizeBar:true,
    visibilityMode:"multiple"
};
isc.A.middleStackDefaults={
    _constructor:"TSectionStack",
    sectionHeaderClass:"SectionHeaderLayout",
    autoDraw:false,
    showResizeBar:true,
    resizeBarTarget:"next",
    visibilityMode:"multiple",
    collapseSection:function(sections,callback){
        if(!this.creator.isInPreviewMode()){
            this.Super("collapseSection",arguments);
        }
    }
};
isc.A.modeSwitcherDefaults={
    _constructor:"ImgButton",
    autoDraw:false,
    size:24,
    src:"actions/preview.png",
    showFocused:false,
    actionType:"checkbox",
    editModeHoverTitle:"Preview your design",
    previewModeHoverTitle:"Exit preview mode and continue editing",
    canHover:true,
    hoverStyle:"darkHover",
    getHoverHTML:function(){
        var editingOn=!this.isSelected();
        if(editingOn)return this.editModeHoverTitle;
        else return this.previewModeHoverTitle;
    },
    click:function(){
        this.updateSelectedMode();
    },
    updateSelectedMode:function(autoSwitch){
        if(autoSwitch)this.setSelected(!this.isSelected());
        var editingOn=!this.isSelected();
        var builder=this.creator;
        builder.editingOn=editingOn;
        builder.rootLiveObject.editingOn=editingOn;
        builder.projectComponents.switchEditMode(editingOn);
        if(editingOn)this.showEditMode(null,autoSwitch);
        else this.showPreview();
    },
    previewModeLabelConstructor:"Label",
    previewModeLabelDefaults:{
        autoDraw:false,
        height:24,
        autoFit:true,
        wrap:false,
        styleName:"previewModeLabel",
        contents:"Preview Mode"
    },
    showPreview:function(callback){
        var _this=this,
            builder=this.creator,
            screen=builder.currentScreen
        ;
        if(screen.dirty){
            if(screen.fileName&&!screen.oldVersionLoaded){
                builder.project.saveScreenNow(builder.currentScreen,function(){
                    _this.showPreview(callback);
                });
                return;
            }
            screen.contents=builder.getUpdatedSource();
        }
        if(builder.showComponentAttributeEditor!=false){
            this._attributeEditorViewState=builder.componentAttributeEditor.getViewState();
        }
        if(builder.showComponentMethodEditor!=false){
            this._methodEditorViewState=builder.componentMethodEditor.getViewState();
        }
        this._projectComponentsViewState=builder.projectComponents.getViewState();
        this._projectComponentsSelectedPaths=builder.projectComponents.getSelectedPaths();
        this._projectComponentsScrollTop=builder.projectComponents.getBody().getScrollTop();
        this.setEditMode(false);
        this.previewAreaBorder=builder.previewArea.getBorder();
        builder.previewArea.setBorder("6px solid #cccccc");
        if(!builder._loadingCurrentScreen){
            var mockupMode=builder.getScreenMockupMode(builder.currentScreen),
                editNodeTree=builder.projectComponents.getEditNodeTree(),
                length=editNodeTree.getLength()
            ;
            if(length==(mockupMode?0:1)){
                builder.hideInstructions();
            }
        }
        var components=builder.projectComponents.data.getAllNodes();
        for(var i=0;i<components.length;i++){
            var component=components[i],
                liveObject=component.liveObject
            ;
            if(isc.isA.ModalWindow(liveObject))liveObject.hide();
        }
        builder.pageHeader.showComponentMask();
        builder.screenMenuButton.hide();
        builder.savingScreenLabel.hide();
        builder._hideSavingScreenLabel=true;
        builder.middleStack.expandSection("applicationSection");
        var sectionHeader=builder.middleStack.getSectionHeader("applicationSection"),
            sectionControlsLayout=sectionHeader.controlsLayout
        ;
        if(!this.previewModeLabel){
            var top=Math.floor((sectionHeader.getVisibleHeight()-24)/2);
            this.previewModeLabel=this.createAutoChild("previewModeLabel",{top:top});
        }
        if(sectionHeader.title!=this._lastTitle){
            var measureHeader=isc.SectionHeader.create({
                autoDraw:true,
                 top:-9999,
                 autoFit:true,
                 title:sectionHeader.title
             });
             var left=measureHeader.getVisibleWidth()+20;
             measureHeader.destroy();
            this.previewModeLabel.setLeft(left);
            this._lastTitle=sectionHeader.title;
        }
        sectionHeader.addChild(this.previewModeLabel);
        if(builder.showDevicePreview){
            var deviceSelector=this.getDeviceSelector(),
                saveScreenLabelIndex=sectionControlsLayout.getMemberNumber(builder.savingScreenLabel)
            ;
            if(saveScreenLabelIndex>=0){
                sectionControlsLayout.addMember(deviceSelector,saveScreenLabelIndex);
            }
            this.showAsDevice(this.previewDevice,this.previewOrientation);
        }
        builder.leftStack.animateHide({effect:"slide",startFrom:"R",endAt:"L"},function(){
            _this.observe(builder.leftStack,"visibilityChanged","observer.updateSelectedMode(true)");
        },150);
        builder.rightStack.animateHide({effect:"slide",startFrom:"L",endAt:"R"},function(){
            _this.observe(builder.rightStack,"visibilityChanged","observer.updateSelectedMode(true)");
        },150);
        builder.middleStack.hideSection("componentTree");
        var ruleScopeComponent=builder.getTargetRuleScope();
        if(ruleScopeComponent)ruleScopeComponent.fireRuleContextChanged(ruleScopeComponent);
        if(!this.jsScreenContents||screen.contents!=this.xmlScreenContents){
            this.xmlScreenContents=screen.contents;
            this.jsScreenContents=null;
            isc.DMI.callBuiltin({
                methodName:"xmlToJS",
                arguments:[screen.contents,true],
                callback:function(rpcResponse){
                    _this.jsScreenContents=rpcResponse.data;
                }
            });
        }
        this.fireCallback(callback);
    },
    showEditMode:function(callback,autoSwitch){
        var builder=this.creator,
            screen=builder.currentScreen,
            mockupMode=builder.getScreenMockupMode(screen)
        ;
        builder.previewArea.setBorder(this.previewAreaBorder);
        if(builder.showDevicePreview){
            this.showAsDevice("desktop");
        }
        if(!builder._loadingCurrentScreen){
            var mockupMode=builder.getScreenMockupMode(builder.currentScreen),
                editNodeTree=builder.projectComponents.getEditNodeTree(),
                length=editNodeTree.getLength()
            ;
            if(length==(mockupMode?0:1)){
                builder.showInstructions();
            }
        }
        builder.pageHeader.hideComponentMask();
        builder.screenMenuButton.show();
        builder.savingScreenLabel.show();
        builder._hideSavingScreenLabel=false;
        var sectionHeader=builder.middleStack.getSectionHeader("applicationSection");
        sectionHeader.removeChild(this.previewModeLabel);
        if(builder.showDevicePreview){
            sectionHeader.controlsLayout.removeMember(this.deviceSelector);
        }
        this.resetScreenMockDataSources();
        builder._loadingCurrentScreen=true;
        builder.withoutDirtyTracking(function(){
            builder.projectComponents.destroyAll();
        });
        this.ignore(builder.leftStack,"visibilityChanged");
        this.ignore(builder.rightStack,"visibilityChanged");
        var _this=this,
            callbackCount=3,
            restoreScreen=function(){
                if(--callbackCount>0)return;
                builder.withoutDirtyTracking(function(){
                    builder.setScreenContents(screen.contents,mockupMode,_this.jsScreenContents);
                });
                builder._loadingCurrentScreen=false;
                builder.projectComponents.setViewState(_this._projectComponentsViewState);
                builder.projectComponents.setSelectedPaths(_this._projectComponentsSelectedPaths);
                builder.projectComponents.getBody().delayCall("scrollTo",[0,_this._projectComponentsScrollTop]);
                delete _this._projectComponentsViewState;
                delete _this._projectComponentsSelectedPaths;
                delete _this._projectComponentsScrollTop;
                var editContext=builder.projectComponents.getEditContext(),
                    selectedRecords=builder.projectComponents.getSelectedRecords()
                ;
                editContext.deselectAllComponents();
                isc.Timer.setTimeout(function(){
                    for(var i=0;i<selectedRecords.length;i++){
                        editContext.selectComponent(selectedRecords[i].liveObject);
                    }
                    builder._pendingAttributeEditorViewState=_this._attributeEditorViewState;
                    builder._pendingMethodEditorViewState=_this._methodEditorViewState;
                },100);
                if(autoSwitch){
                    isc.Timer.setTimeout(function(){
                        _this.showAutoSwitchedLabel();
                    },100);
                }
                _this.fireCallback(callback);
            }
        ;
        callbackCount=(!builder.middleStack.sectionIsVisible("componentTree")&&1)+
            (!builder.leftStack.isVisible()&&1)+
            (!builder.rightStack.isVisible()&&1);
        builder.middleStack.showSection("componentTree",restoreScreen);
        builder.leftStack.animateShow({effect:"slide",startFrom:"L",endAt:"R"},restoreScreen,150);
        builder.rightStack.animateShow({effect:"slide",startFrom:"R",endAt:"L"},restoreScreen,150);
    },
    deviceSelectorDefaults:{
        _constructor:"ToolStrip",
        autoDraw:false,
        width:140,
        height:20,
        padding:0,
        membersMargin:0,
        desktopDeviceButtonDefaults:{
            _constructor:"ToolStripButton",
            autoDraw:false,
            height:20,
            title:"Desktop",
            showRollOver:false,
            showFocused:false,
            actionType:"radio",
            radioGroup:"device",
            click:function(){
                this.modeSwitcher.setDevice("desktop");
            }
        },
        tabletDeviceButtonDefaults:{
            _constructor:"ToolStripButton",
            autoDraw:false,
            height:20,
            title:"Tablet",
            showRollOver:false,
            showFocused:false,
            actionType:"radio",
            radioGroup:"device",
            click:function(){
                this.modeSwitcher.setDevice("tablet");
            }
        },
        handsetDeviceButtonDefaults:{
            _constructor:"ToolStripButton",
            autoDraw:false,
            height:20,
            title:"Smartphone",
            showRollOver:false,
            showFocused:false,
            actionType:"radio",
            radioGroup:"device",
            click:function(){
                this.modeSwitcher.setDevice("handset");
            }
        },
        initWidget:function(){
            var params={modeSwitcher:this.creator},
                desktopDeviceButton=this.createAutoChild("desktopDeviceButton",params),
                tabletDeviceButton=this.createAutoChild("tabletDeviceButton",params),
                handsetDeviceButton=this.createAutoChild("handsetDeviceButton",params)
            ;
            this.members=[desktopDeviceButton,tabletDeviceButton,handsetDeviceButton];
            this.Super("initWidget",arguments);
        }
    },
    getDeviceSelector:function(){
        if(!this.deviceSelector){
            this.deviceSelector=this.createAutoChild("deviceSelector");
        }
        return this.deviceSelector;
    },
    setDevice:function(device){
        if(device!=this.previewDevice){
            this.previewDevice=device;
            this.previewOrientation=null;
            this.showAsDevice(device,this.previewOrientation);
        }
    },
    rotateDevice:function(){
        var orientation=this.previewOrientation||"portrait";
        var orientation=(orientation=="portrait"?"landscape":"portrait");
        this.previewOrientation=orientation;
        this.showAsDevice(this.previewDevice,orientation);
    },
    _deviceSettings:{
        desktop:{
            memberNumber:0,
            sizes:{
                portrait:{width:"100%",height:"100%"},
                landscape:{width:"100%",height:"100%"}
            }
        },
        tablet:{
            memberNumber:1,
            sizes:{
                portrait:{width:1024,height:1366},
                landscape:{width:1366,height:1024}
            },
            canReorient:true,
            border:"4px solid #222222",
            outline:{
                portrait:{
                    adjustments:[-20,-20,40,60],
                    items:[
                        {
                            _constructor:isc.DrawOval,
                            width:30,
                            height:30,
                            centerAt:["50%",-25]
                        }
                    ]
                },
                landscape:{adjustments:[-20,-20,60,40],
                    items:[
                        {
                            _constructor:isc.DrawOval,
                            width:30,
                            height:30,
                            centerAt:[-25,"50%"]
                        }
                    ]
                }
            }
        },
        handset:{
            memberNumber:2,
            sizes:{
                portrait:{width:414,height:717},
                landscape:{width:717,height:414}
            },
            canReorient:true,
            border:"4px solid #222222",
            outline:{
                portrait:{
                    adjustments:[-20,-20,40,60],
                    items:[
                        {
                            _constructor:isc.DrawRect,
                            width:50,
                            height:5,
                            centerAt:["50%",7]
                        },
                        {
                            _constructor:isc.DrawOval,
                            width:30,
                            height:30,
                            centerAt:["50%",-25]
                        }
                    ]
                },
                landscape:{adjustments:[-20,-20,60,40],
                    items:[
                        {
                            _constructor:isc.DrawRect,
                            width:5,
                            height:50,
                            centerAt:[7,"50%"]
                        },
                        {
                            _constructor:isc.DrawOval,
                            width:30,
                            height:30,
                            centerAt:[-25,"50%"]
                        }
                    ]
                }
            }
        }
    },
    deviceOutlineDefaults:{
        _constructor:isc.DrawPane,
        autoDraw:false,
        top:-1000,
        border:"4px solid #222222",
        styleName:"previewDeviceOutline",
        show:function(){
            var rootLiveObject=this.builder.rootLiveObject;
            if(!this.isObserving(rootLiveObject,"moved")){
                this.observe(rootLiveObject,"moved","observer.updatePositionAndSize()");
            }
            if(!this.isObserving(rootLiveObject,"resized")){
                this.observe(rootLiveObject,"resized","observer.updatePositionAndSize()");
            }
            this.updatePositionAndSize();
            this.Super("show",arguments);
        },
        hide:function(){
            var rootLiveObject=this.builder.rootLiveObject;
            this.ignore(rootLiveObject,"moved");
            this.ignore(rootLiveObject,"resized");
            this.setTop(-1000);
            this.Super("show",arguments);
        },
        updatePositionAndSize:function(){
            var modeSwitcher=this.modeSwitcher,
                rootLiveObject=this.builder.rootLiveObject,
                device=modeSwitcher.previewDevice,
                orientation=modeSwitcher.previewOrientation
            ;
            device=device||"desktop";
            orientation=orientation||"portrait";
            var settings=modeSwitcher._deviceSettings[device],
                outlineSettings=(settings.outline?settings.outline[orientation]:null),
                adjustments=(outlineSettings?outlineSettings.adjustments:[0,0,0,0])
            ;
            var rect=rootLiveObject.getRect();
            for(var i=0;i<4;i++)rect[i]+=adjustments[i];
            this.setRect(rect);
            this.createItems();
        },
        createItems:function(){
            if(this._createdItems){
                for(var i=0;i<this._createdItems.length;i++){
                    this._createdItems[i].destroy();
                }
            }
            var modeSwitcher=this.modeSwitcher,
                device=modeSwitcher.previewDevice,
                orientation=modeSwitcher.previewOrientation
            ;
            device=device||"desktop";
            orientation=orientation||"portrait";
            var settings=modeSwitcher._deviceSettings[device],
                outlineSettings=(settings.outline?settings.outline[orientation]:null),
                items=(outlineSettings?outlineSettings.items:null)
            ;
            this._createdItems=[];
            if(items){
                for(var i=0;i<items.length;i++){
                    var itemDefaults=items[i],
                        item=isc.ClassFactory.newInstance(itemDefaults._constructor,
                            this.commonItemsDefaults,
                            itemDefaults,
                            {drawPane:this})
                    ;
                    this._createdItems.add(item);
                }
            }
        },
        commonItemsDefaults:{
            init:function(){
                this.Super("init",arguments);
                this.resolvePlacement();
            },
            parentResized:function(skipResolve){
                this.resolvePlacement();
                this.Super("parentResized",arguments);
            },
            resolvePlacement:function(){
                if(!this.centerAt)return;
                var left=this.centerAt[0],
                    top=this.centerAt[1]
                ;
                if(isc.isA.String(left)){
                    left=parseInt(left);
                    if(left!=null){
                        if(!isc.isA.Number(left))left=0;
                        left=parseInt(left/100*Math.max(0,this.drawPane.getVisibleWidth()));
                    }
                }
                if(left<0)left=this.drawPane.getVisibleWidth()+left;
                left-=Math.floor(this.width/2);
                if(isc.isA.String(top)){
                    top=parseInt(top);
                    if(top!=null){
                        if(!isc.isA.Number(top))top=0;
                        top=parseInt(top/100*Math.max(0,this.drawPane.getVisibleHeight()));
                    }
                }
                if(top<0)top=this.drawPane.getVisibleHeight()+top;
                top-=Math.floor(this.height/2);
                this.moveTo(left,top);
            }
        }
    },
    orientationButtonDefaults:{
        _constructor:isc.ImgButton,
        autoDraw:false,
        top:-1000,
        width:64,
        height:64,
        src:"deviceOrientation.png",
        canFocus:false,
        showDown:false,
        showFocused:false,
        showRollOver:false,
        click:function(){
            this.modeSwitcher.rotateDevice();
        },
        show:function(){
            var rootLiveObject=this.builder.rootLiveObject;
            if(!this.isObserving(rootLiveObject,"moved")){
                this.observe(rootLiveObject,"moved","observer.updatePosition()");
            }
            if(!this.isObserving(rootLiveObject,"resized")){
                this.observe(rootLiveObject,"resized","observer.updatePosition()");
            }
            this.updatePosition();
            this.Super("show",arguments);
        },
        hide:function(){
            var rootLiveObject=this.builder.rootLiveObject;
            this.ignore(rootLiveObject,"moved");
            this.ignore(rootLiveObject,"resized");
            this.setTop(-1000);
            this.Super("show",arguments);
        },
        updatePosition:function(){
            var modeSwitcher=this.modeSwitcher,
                rootLiveObject=this.builder.rootLiveObject,
                device=modeSwitcher.previewDevice,
                orientation=modeSwitcher.previewOrientation
            ;
            device=device||"desktop";
            orientation=orientation||"portrait";
            var settings=modeSwitcher._deviceSettings[device],
                outlineSettings=(settings.outline?settings.outline[orientation]:null),
                adjustments=(outlineSettings?outlineSettings.adjustments:[0,0,0,0])
            ;
            var previewBottom=rootLiveObject.getTop()+rootLiveObject.getVisibleHeight()+adjustments[1]+adjustments[3],
                previewRight=rootLiveObject.getLeft()+rootLiveObject.getVisibleWidth()+adjustments[0]+adjustments[2],
                buttonLeft=previewRight+25,
                buttonTop=previewBottom-this.getHeight()
            ;
            this.setRect(buttonLeft,buttonTop);
        }
    },
    showAsDevice(device,orientation){
        var modeSwitcher=this,
            builder=this.creator,
            rootLiveObject=builder.rootLiveObject,
            previewArea=builder.previewArea,
            deviceSelector=this.getDeviceSelector()
        ;
        device=device||"desktop";
        orientation=orientation||"portrait";
        if(!this._origDeviceSettings){
            this._origDeviceSettings={
                isDesktop:isc.Browser.isDesktop,
                isTablet:isc.Browser.isTablet,
                isHandset:isc.Browser.isHandset,
                orientation:isc.Page.getOrientation()
            };
        }
        var settings=this._deviceSettings[device],
            sizes=settings.sizes[orientation],
            memberNumber=settings.memberNumber,
            border=settings.border
        ;
        rootLiveObject.setRect(null,null,sizes.width,sizes.height);
        rootLiveObject.setBorder(border);
        if(!deviceSelector.getMember(memberNumber).isSelected()){
            deviceSelector.getMember(memberNumber).select();
        }
        if(settings.canReorient){
            if(!previewArea.deviceOutline){
                var deviceOutline=this.createAutoChild("deviceOutline",{
                    modeSwitcher:modeSwitcher,
                    builder:builder
                });
                deviceOutline.moveBelow(rootLiveObject);
                previewArea.addChild(deviceOutline);
                previewArea.deviceOutline=deviceOutline;
            }
            previewArea.deviceOutline.show();
            if(!previewArea.orientationButton){
                var button=this.createAutoChild("orientationButton",{
                    modeSwitcher:modeSwitcher,
                    builder:builder
                });
                previewArea.addChild(button);
                previewArea.orientationButton=button;
            }
            previewArea.orientationButton.show();
        }else{
            if(previewArea.deviceOutline){
                previewArea.deviceOutline.hide();
            }
            if(previewArea.orientationButton){
                previewArea.orientationButton.hide();
            }
        }
    },
    setEditMode:function(editingOn){
        var builder=this.creator,
            components=builder.projectComponents.data.getAllNodes()
        ;
        for(var i=0;i<components.length;i++){
            var component=components[i],
                liveObject=component.liveObject
            ;
            if(liveObject.setEditMode){
                liveObject.setEditMode(editingOn,builder.projectComponents,component);
            }else{
                liveObject.editingOn=editingOn;
            }
        }
    },
    resetScreenMockDataSources:function(){
        var builder=this.creator,
            components=builder.projectComponents.data.getAllNodes()
        ;
        for(var i=0;i<components.length;i++){
            var component=components[i],
                liveObject=component.liveObject
            ;
            if(isc.isA.MockDataSource(liveObject)&&liveObject.resetData){
                liveObject.resetData();
            }
        }
    },
    autoSwitchToPreviewMode:function(){
        var editingOn=!this.isSelected();
        if(!editingOn)return;
        this.select();
        this.updateSelectedMode();
    },
    autoSwitchToEditMode:function(){
        var editingOn=!this.isSelected();
        if(editingOn)return;
        this.deselect();
        this.updateSelectedMode();
        var _this=this;
        isc.Timer.setTimeout(function(){
            _this.showAutoSwitchedLabel();
        },100);
    },
    showAutoSwitchedLabel:function(){
        if(!this._autoSwitchedLabel){
            this._autoSwitchedLabel=isc.Label.create({
                height:25,autoFit:true,wrap:false,
                backgroundColor:"#ffff66",
                align:"center",autoDraw:false,
                contents:"<<< Auto-switched to Edit mode",
                top:this.getPageTop(),left:this.getPageLeft()+25
            });
        }
        this._autoSwitchedLabel.show();
        this._autoSwitchedLabel.setOpacity(100);
        isc.Timer.setTimeout(this.ID+".fadeOutAutoSwitchedLabel()",5000);
    },
    fadeOutAutoSwitchedLabel:function(){
        var _this=this;
        this._autoSwitchedLabel.animateFade(0,function(){
            _this._autoSwitchedLabel.hide();
        },1000);
    }
};
isc.A.rightStackDefaults={
    _constructor:"TSectionStack",
    autoDraw:false,
    width:225,
    visibilityMode:"multiple"
};
isc.A.canvasItemWrapperConstructor="CanvasItem";
isc.A.canvasItemWrapperDefaults={
    showTitle:false,
    colSpan:"*",
    width:"*"
};
isc.A.Constructor="FormItem";
isc.A.simpleTypeNodeDefaults={
    isGroup:true,
    cellPadding:5,
    showComplexFields:false,
    doNotUseDefaultBinding:true
};
isc.A.complexTypeNodeConstructor="DynamicForm";
isc.A.complexTypeNodeDefaults={
    isGroup:true,
    cellPadding:5,
    showComplexFields:false,
    doNotUseDefaultBinding:true
};
isc.A.repeatingComplexTypeNodeDefaults={
    autoFitData:"vertical",
    leaveScrollbarGap:false
};
isc.A.logoConstructor="Img";
isc.A.logoDefaults={
    autoParent:"pageHeader",
    autoDraw:false,
    width:24,
    height:24,
    src:"ReifyLogo.png",
    layoutAlign:"center"
};
isc.A.projectNamePaneConstructor="EditPane";
isc.A.projectNamePaneDefaults={
    autoParent:"pageHeader",
    autoDraw:false,
    height:26,
    width:100,
    border:"0px",
    canHover:true,
    hoverWrap:false,
    hoverAutoFitWidth:false,
    hoverStyle:"darkHover",
    prompt:"Double-click to rename project",
    canAcceptDrop:false,
    selectedAppearance:"none",
    showSelectedLabel:false,
    editContextProperties:{
        canGroupSelect:false,
        selectionType:"single",
        enableInlineEdit:true,
        editNodeUpdated:function(editNode,editContext,modifiedProperties){
            if(modifiedProperties.contains("contents")){
                var editPane=editContext.creator,
                    builder=editPane.creator,
                    project=builder.project,
                    oldFileName=project.fileName,
                    newFileName=editNode.defaults.contents
                ;
                if(oldFileName!=newFileName){
                    if(newFileName==null||newFileName==""){
                        editContext.setNodeProperties(editNode,{contents:oldFileName});
                    }else{
                        project.renameFile(oldFileName,newFileName,"proj","xml",
                            builder.projectDataSource,
                            function(fileName,errorSource){
                                if(!fileName){
                                    if(errorSource!="oldFileName"){
                                        isc.warn("Cannot rename project: "+newFileName+" already exists.");
                                        return;
                                    }
                                }
                                project.setFileName(newFileName);
                                project.setName(newFileName);
                                project.save(function(){
                                    builder.removeRecentProject(oldFileName);
                                });
                            }
                        );
                    }
                }
            }
        }
    },
    editProxyProperties:{
        autoMaskChildren:true
    },
    setReadOnly:function(readOnly){
        var tree=this.getEditNodeTree(),
            rootNode=tree.getRoot(),
            editNode=tree.getChildren(rootNode)[0],
            label=editNode.liveObject
        ;
        this.setEditMode(!readOnly);
        var builder=this.creator,
            project=builder.project
        ;
        label.showRollOver=!readOnly;
        label.setIcon(readOnly?"lock.png":null);
        label.prompt=(readOnly
            ?"This project is read-only. If you would like to edit, please make a copy."
            :null);
    }
};
isc.A.projectNameConstructor="Label";
isc.A.projectNameDefaults={
    autoParent:"pageHeader",
    autoDraw:false,
    height:26,
    minWidth:250,
    autoFit:true,
    wrap:false,
    styleName:null,
    baseStyle:"pageTitle",
    hoverWrap:false,
    hoverAutoFitWidth:false,
    hoverStyle:"darkHover",
    showRollOver:true,
    iconOrientation:"right",
    setContents:function(contents){
        this.Super("setContents",arguments);
        this.parentElement.setWidth(this.getVisibleWidth());
    },
    editProxyProperties:{
        inlineEditEvent:"click",
        inlineEditFormProperties:{
            minHeight:26
        },
        editMaskProperties:{
            canDrag:false,
            canDragReposition:false,
            showContextMenu:function(){return false;},
            handleMouseOver:function(){
                var masked=this.masterElement;
                return masked.handleMouseOver();
            },
            handleMouseOut:function(){
                var masked=this.masterElement;
                return masked.handleMouseOut();
            }
        }
    }
};
isc.A.projectNameSpacerConstructor="LayoutSpacer";
isc.A.projectNameSpacerDefaults={
    autoParent:"pageHeader",
    autoDraw:false,
    width:25
};
isc.A.mockupsMenuButtonConstructor="TMenuButton";
isc.A.mockupsMenuButtonDefaults={
    autoDraw:false,
    title:"Mockups",
    width:75
};
isc.A.mockupsMenuControlConstructor="RibbonBar";
isc.A.mockupsMenuControlDefaults={
    autoDraw:false,
    height:22,width:1,layoutMargin:0,
    overflow:"visible",
    layoutAlign:"center"
};
isc.A.projectMenuButtonConstructor="TMenuButton";
isc.A.projectMenuButtonDefaults={
    autoDraw:false,
    title:"Project",
    width:75,
    border:"0px"
};
isc.A.projectMenuControlConstructor="RibbonBar";
isc.A.projectMenuControlDefaults={
    autoDraw:false,
    height:22,width:1,layoutMargin:0,
    overflow:"visible",
    layoutAlign:"center"
};
isc.A.runButtonConstructor="TButton";
isc.A.runButtonDefaults={
    autoDraw:false,
    minWidth:75,
    autoFit:true,
    wrap:false,
    border:"0px"
};
isc.A.deployButtonConstructor="TButton";
isc.A.deployButtonDefaults={
    title:"Deploy",
    minWidth:75,
    autoDraw:false,autoFit:true,
    border:"0px",
    wrap:false
};
isc.A.deployMenuButtonConstructor="TMenuButton";
isc.A.deployMenuButtonDefaults={
    title:"Deploy",
    iconSpacing:0,border:"0px",
    width:75,
    autoDraw:false
};
isc.A.runMenuButtonConstructor="TMenuButton";
isc.A.runMenuButtonDefaults={
    autoDraw:false,
    iconSpacing:0,
    title:"",
    border:"0px",
    width:1,
    overflow:"visible"
};
isc.A.runMenuControlConstructor="RibbonBar";
isc.A.runMenuControlDefaults={
    autoDraw:false,
    height:22,width:1,layoutMargin:0,
    overflow:"visible",
    layoutAlign:"center"
};
isc.A.deployMenuControlConstructor="RibbonBar";
isc.A.deployMenuControlDefaults={
    autoDraw:false,
    height:22,width:1,layoutMargin:0,
    overflow:"visible",
    layoutAlign:"center"
};
isc.A.userNameSpacerConstructor="LayoutSpacer";
isc.A.userNameSpacerDefaults={
    autoParent:"pageHeader",
    autoDraw:false,
    width:"*"
};
isc.A.userMenuButtonConstructor="MenuButton";
isc.A.userMenuButtonDefaults={
    autoParent:"pageHeader",
    autoDraw:false,
    title:isc.Canvas.imgHTML("profile.png",24,24),
    hoverStyle:"darkHover",
    prompt:"Your account",
    showMenuButtonImage:false,
    baseStyle:"normal",
    width:30,
    height:30,
    menu:null
};
isc.A.userMenuConstructor="Menu";
isc.A.userMenuDefaults={
    autoDraw:false,
    width:250,
    showKeys:false,
    showSubmenus:false,
    iconFieldProperties:{baseStyle:"menuTitleField"},
    data:[
        {
            isSeparator:true
        },
        {
            title:"Log out",
            click:function(target,item,menu){
                menu.creator.signOut();
            }
        }
    ],
    regDevItems:[{
        title:"Update Account",
        click:function(target,item,menu){
            menu.creator.showUpdateAccountWindow();
        }
    }],
    init:function(){
        var builder=this.creator;
        if(builder.shouldShowRegDevUserMenuItems())this.data.addListAt(this.regDevItems,1);
        else this.logWarn("Create a developer account to show all user menu options");
        this.data.addAt({
            showRollOver:false,
            embeddedComponent:isc.VLayout.create({
                autoDraw:false,
                height:1,
                width:"100%",
                padding:10,
                members:[
                    isc.HLayout.create({
                        autoDraw:false,
                        width:"100%",
                        height:1,
                        members:[
                            isc.Img.create({
                                autoDraw:false,
                                width:50,height:50,
                                imageType:"center",
                                src:"profile.png",
                                imageWidth:40,imageHeight:40
                            }),
                            isc.Label.create({
                                autoDraw:false,
                                height:50,
                                padding:10,
                                autoFit:true,
                                contents:"<b>Account</b>"
                            })
                        ]
                    }),
                    isc.Label.create({
                        autoDraw:false,
                        height:30,
                        contents:window.user&&window.user.username?window.user.username:""
                    })
                ]
            }),
            embeddedComponentFields:["title","key","submenu"]
        },0);
        this.Super("init",arguments);
    }
};
isc.A.pageHeaderConstructor="HLayout";
isc.A.pageHeaderDefaults={
    autoDraw:false,
    width:"100%",
    height:24,
    membersMargin:10,
    layoutMargin:3,
    layoutLeftMargin:5,
    layoutRightMargin:5
};
isc.A.savingScreenLabelConstructor="Label";
isc.A.savingScreenLabelDefaults={
    autoDraw:false,
    width:100,
    height:20,
    styleName:"labelAnchor",
    canHover:true,
    hoverStyle:"darkHover",
    wrap:false,
    hoverWrap:false,
    hoverAutoFitWidth:false,
    getHoverHTML:function(){
        if(!this.creator.currentScreen||!this.creator.currentScreen.lastSave){
            return null;
        }
        if(this.creator.currentScreen.oldVersionLoaded){
            return"Old version loaded. Auto save disabled.";
        }
        var lastSave=this.creator.currentScreen.lastSave;
        if(isc.isA.String(lastSave))lastSave=this.creator.currentScreen.lastSave=new Date(lastSave);
        return"Last edit was saved "+isc.VisualBuilder.timeSince(lastSave);
    }
};
isc.A.usersRolesLabelConstructor="Label";
isc.A.usersRolesLabelDefaults={
    cursor:"hand",
    wrap:false,
    overflow:"hidden",
    width:80,
    click:function(){
        var menuButton=this.creator.usersRolesMenuButton;
        menuButton.showMenu();
        if(menuButton.showOpened)menuButton.setCustomState("Opened");
    },
    dynamicContents:true,
    contents:"${this.creator.getUsersRolesMenuButtonTitle()}",
    hoverStyle:"darkHover",
    canHover:true,
    getHoverHTML:function(){
        if(isc.Auth.isSuperUser())return this.creator.superUserHelpText;
    }
};
isc.A.usersRolesMenuButtonConstructor="ToolStripMenuButton";
isc.A.usersRolesMenuButtonDefaults={
    menuAlign:"right",
    showMenuButtonImage:false,
    title:null,
    icon:"switch_user.png",
    showRollOver:true,
    showRollOverIcon:true,
    autoApplyDownState:false,
    hoverStyle:"darkHover",
    prompt:"Change user view, or edit roles and users.",
    getStateName:function(){
        return this.baseStyle;
    },
    iconSize:20,iconWidth:20,iconHeight:20,
    width:30,autoFit:false,
    menu:null
};
isc.A.usersRolesMenuConstructor="Menu";
isc.A.usersRolesMenuDefaults={
    initWidget:function(){
        var _vb=this.creator;
        var items=[
            {title:"Current User",
             icon:"currentUser.png"
            },
            {title:"Edit Test Users...",
             icon:"actions/editSampleUsers.png",
             click:function(){
                 _vb.editSampleUsers();
             }
            },
            {title:"Edit Roles...",
             icon:"actions/editSampleRoles.png",
             click:function(){
                 _vb.editSampleRoles();
             }
            }
        ];
        this.items=items;
        return this.Super("initWidget",arguments);
    }
};
isc.A.sampleUsersMenuConstructor="Menu";
isc.A.sampleUsersMenuDefaults={
    width:250,
    getItemTitle:function(item){
        var title=item.title;
        var roles=item.roles;
        if(roles!=null&&!isc.isAn.emptyString(roles)){
            title+=" <i>("+roles+")</i>";
        }
        return title;
    },
    fields:[
        "icon",
        "title"
    ]
};
isc.A.paletteNodeDSDefaults={
    _constructor:"DataSource",
    ID:"paletteNode",
    recordXPath:"/PaletteNodes/PaletteNode",
    fields:{
        name:{name:"name",type:"text",length:8,required:true},
        title:{name:"title",type:"text",title:"Title",length:128,required:true},
        type:{name:"type",type:"text",title:"Type",length:128,required:true},
        icon:{name:"icon",type:"image",title:"Icon Filename",length:128},
        iconWidth:{name:"iconWidth",type:"number",title:"Icon Width"},
        iconHeight:{name:"iconHeight",type:"number",title:"Icon Height"},
        iconSize:{name:"iconSize",type:"number",title:"Icon Size"},
        showDropIcon:{name:"showDropIcon",type:"boolean",title:"Show Drop Icon"},
        defaults:{name:"defaults",type:"Canvas",propertiesOnly:true},
        children:{name:"children",type:"paletteNode",multiple:true}
    }
};
isc.A.paletteDSDefaults={
    _constructor:"DataSource",
    ID:"paletteDS",
    clientOnly:true,
    dataProtocol:"clientCustom",
    fields:[
        {name:"id",type:"integer",primaryKey:true},
        {name:"parentId",type:"integer"},
        {name:"title",title:"Component",type:"text"},
        {name:"description",type:"text"},
        {name:"isFolder",type:"boolean"},
        {name:"type",type:"text"},
        {name:"excludeFromSearch",type:"text"},
        {name:"children"}
    ],
    performDSOperation:function(operationType,data,callback,requestProperties){
        if(this._dataMockupMode==this.mockupMode&&this.getCacheData()!=null){
            return this.Super("performDSOperation",arguments);
        }
        this._dataMockupMode=this.mockupMode;
        this.setCacheData(null);
        this._pendingData=null;
        this._pendingFetchCount=2;
        isc.RPCManager.startQueue();
        this.paletteNodeDS.dataURL=this.customComponentsURL;
        this.paletteNodeDS.fetchData({},this.getID()+".fetchComponentsReply(dsResponse.clientContext,data)",{
            clientContext:{
                operationType:operationType,
                data:data,
                callback:callback,
                requestProperties:requestProperties
            }
        });
        this.paletteNodeDS.dataURL=this.mockupMode?this.defaultMockupComponentsURL:this.defaultComponentsURL;
        this.paletteNodeDS.fetchData({},this.getID()+".fetchComponentsReply(dsResponse.clientContext,data)",{
            clientContext:{
                operationType:operationType,
                data:data,
                callback:callback,
                requestProperties:requestProperties
            }
        });
        isc.RPCManager.sendQueue();
    },
    fetchComponentsReply:function(clientContext,data){
        if(!this._pendingData)this._pendingData=data;
        else this._pendingData.addList(data);
        if(--this._pendingFetchCount==0){
            data=this.flattenTree(this._pendingData);
            this.setCacheData(data);
            this._pendingData=null;
            this.Super("performDSOperation",[clientContext.operationType,clientContext.data,clientContext.callback,clientContext.requestProperties]);
        }
    },
    assignIds:function(data,parentId){
        if(parentId==null)this._nextId=0;
        for(var i=0;i<data.length;i++){
            var node=data[i];
            node.id=this._nextId++;
            if(parentId!=null)node.parentId=parentId;
            if(node.children)this.assignIds(node.children,node.id);
            else node.isFolder=false;
        }
    },
    flattenTree:function(data,parentId,flatData){
        if(parentId==null)this._nextId=0;
        if(!flatData)flatData=[];
        for(var i=0;i<data.length;i++){
            var node=data[i];
            node.id=this._nextId++;
            if(parentId!=null)node.parentId=parentId;
            if(node.children){
                this.flattenTree(node.children,node.id,flatData);
                delete node.children;
            }else{
                node.isFolder=false;
            }
            flatData.add(node);
        }
        return flatData;
    },
    transformRequest:function(dsRequest){
        if(dsRequest.operationType==="fetch"){
            var data=this.getCacheData(),
                matchingRecords=[]
            ;
            if(dsRequest.data&&!isc.isAn.emptyObject(dsRequest.data)){
                var criteria=dsRequest.data;
                for(var i=0;i<data.length;i++){
                    var record=data[i];
                    if(this.recordMatchesFilter(record,criteria,dsRequest)){
                        matchingRecords.add(record);
                    }
                }
                this.addChildren(data,matchingRecords);
                this.addParents(data,matchingRecords);
            }else{
                matchingRecords=data;
            }
            var resultTree=dsRequest.resultTree;
            if(resultTree){
                matchingRecords=isc.Tree.getCleanNodeData(matchingRecords,false,false,true,resultTree);
            }
            var dsResponse={
                data:matchingRecords
            };
            this.processResponse(dsRequest.requestId,dsResponse);
        }
    },
    addChildren:function(data,matchingRecords){
        var matched;
        do{
            matched=false;
            for(var i=0;i<matchingRecords.length;i++){
                var matchingRecord=matchingRecords[i],
                    match=data.find("parentId",matchingRecord.id)
                ;
                if(match){
                    if(!matchingRecords.contains(match)){
                        matchingRecords.add(match);
                        matched=true;
                    }
                }
            }
        }while(matched);
    },
    addParents:function(data,matchingRecords){
        var matched;
        do{
            matched=false;
            for(var i=0;i<matchingRecords.length;i++){
                var matchingRecord=matchingRecords[i],
                    match=data.find("id",matchingRecord.parentId)
                ;
                if(match){
                    if(!matchingRecords.contains(match)){
                        matchingRecords.add(match);
                        matched=true;
                    }
                }
            }
        }while(matched);
    }
};
isc.A.libraryComponentsDefaults={
    _constructor:"TTreePalette",
    autoShowParents:true,
    autoDraw:false,
    dataSource:"paletteDS",
    loadDataOnDemand:false,
    cellHeight:22,
    fixedRowHeights:false,
    virtualScrolling:true,
    showRoot:false,
    showHeader:false,
    showConnectors:true,
    selectionType:Selection.SINGLE,
    iconSize:16,
    emptyMessage:"No items match your search criteria",
    styleName:"libraryComponentsGrid",
    _getFollowingSiblingLevels:function(record,level){
        if(level<=2)return[];
        var levels=this.data._getFollowingSiblingLevels(record);
        levels.pop();
        return levels;
    },
    getIndentHTML:function(level,record,recordNum,returnCellWidth){
        level=(level>1?level-1:level);
        var result=this.Super("getIndentHTML",[level,record,recordNum,returnCellWidth]);
        return result;
    },
    getRowHeight:function(record,rowNum){
        if(record&&(record.isHeader==true||record.isHeader=="true"))return 35;
        return this.Super("getRowHeight",arguments);
    },
    getOpenIcon:function(record){
        if(this.showOpener==false&&!this.showConnectors)return null;
        if(!this.data)return null;
        var recordNum,recordPath,nodeLocator;
        if(isc.isA.Number(record)){
            recordNum=record;
            record=this.data.get(recordNum);
            nodeLocator=this.data.isMultiLinkTree()?this.data.getNodeLocator(recordNum):null;
        }
        if(record==null)return null;
        if(record.isHeader==true||record.isHeader=="true"){
            var isOpen=this.data.isOpen(record);
            return(isOpen?"[SKINIMG]SectionHeader/opener_opened.png"
                           :"[SKINIMG]SectionHeader/opener_closed.png");
        }
        var parent=this.data.getParent(record);
        if(parent.isHeader==true||parent.isHeader=="true")return null;
        return this.Super("getOpenIcon",arguments);
    },
    getOpenerIconWidth:function(record){
        if(record.isHeader==true||record.isHeader=="true")return 16;
        return this.Super("getOpenerIconWidth",arguments);
    },
    getTreeCellValue:function(value,record,recordNum,fieldNum,gridBody){
        var cellHeight=this.cellHeight;
        if(record.isHeader==true||record.isHeader=="true")this.cellHeight=16;
        var result=this.Super("getTreeCellValue",arguments);
        this.cellHeight=cellHeight;
        return result;
    },
    getIcon:function(node,rowNum){
        if(node.isHeader==true||node.isHeader=="true")return null;
        return this.Super("getIcon",arguments);
    },
    getCellStyle:function(record,rowNum,colNum){
        if(record&&(record.isHeader==true||record.isHeader=="true")){
            return"paletteTreeCell";
        }
        return this.Super("getCellStyle",arguments);
    },
    _$headerBorderStyle:"17px solid",
    getCellCSSText:function(record,rowNum,colNum){
        if(record&&(record.isHeader==true||record.isHeader=="true")){
            var tree=this.data,
                isOpen=tree.isOpen(record),
                previousRecord=(rowNum>0?this.getRecord(rowNum-1):null),
                previousIsHeader=(previousRecord&&(previousRecord.isHeader==true||previousRecord.isHeader=="true")),
                skinBackgroundColor=(isc.currentSkin&&isc.currentSkin.backgroundColor)||"white",
                borderStyle=this._$headerBorderStyle+" "+skinBackgroundColor,
                cssText=""
            ;
            if(previousRecord&&!previousIsHeader){
                cssText="border-top: "+borderStyle;
            }
            if(isOpen){
                var nextRecord=this.getRecord(rowNum+1),
                    nextIsHeader=(nextRecord&&(nextRecord.isHeader==true||nextRecord.isHeader=="true"))
                ;
                if(nextRecord&&!nextIsHeader){
                    cssText+=(cssText!=""?";":"")+"border-bottom: "+borderStyle;
                }
            }
            return cssText;
        }
        if(rowNum==(this.getTotalRows()-1)){
            return"padding-bottom: 15px";
        }
        return this.Super("getCellCSSText",arguments);
    },
    canDragRecordsOut:true,
    canAcceptDroppedRecords:false,
    dragDataAction:isc.TreeViewer.COPY,
    dragStart:function(){
        var result=this.Super("dragStart",arguments);
        if(result==false)return result;
        var dragData=this.getDragData();
        for(var i=0;i<dragData.length;i++){
            if(dragData[i].isHeader==true||dragData[i].isHeader=="true")return false;
        }
        this.topElement.autoSwitchToEditMode();
        this.creator.projectComponents.editContext.hideSelection();
        return result;
    },
    canHover:true,
    hoverAutoFitMaxWidth:360,
    hoverStyle:"darkHover",
    cellHoverHTML:function(record,rowNum,colNum){
        if(record&&record.prompt)return record.prompt;
    },
    getNextAutoId:function(type,paletteNode,prefix,editTree){
        var maxPrefixWords=(type=="HeaderItem"?2:null);
        if(!prefix&&paletteNode&&paletteNode.defaults&&paletteNode.defaults.title){
            prefix=paletteNode.defaults.title;
        }
        prefix=(prefix?this.getPrefixAsId(prefix,maxPrefixWords):"");
        if(type==null){
            type="Object";
        }else{
            if(type.contains("."))type=type.split(/\./).pop();
        }
        var suffix=(paletteNode?paletteNode.idName||paletteNode.idPrefix||paletteNode.type:type),
            baseAutoId=prefix+suffix
        ;
        var theTree=editTree||this.creator.projectComponents.data,
            parentNode=theTree.getParent(paletteNode)
        ;
        var idField=isc.DS.getAutoIdField(paletteNode);
        if(parentNode&&idField=="name"){
            return this._makeUniqueName(baseAutoId,paletteNode.liveObject,parentNode,theTree);
        }else{
            if(!parentNode&&baseAutoId==type)return this.Super("getNextAutoId",arguments);
            return this._makeUniqueId(baseAutoId,paletteNode.liveObject);
        }
    },
    getPrefixAsId:function(prefix,maxPrefixWords){
        var parts=prefix.split(/ /);
        if(maxPrefixWords!=null&&parts.length>maxPrefixWords)parts.length=maxPrefixWords;
        var prefix="";
        for(var i=0;i<parts.length;i++){
            prefix+=(i==0?parts[i].substring(0,1).toLowerCase()
                        :parts[i].substring(0,1).toUpperCase())+parts[i].substring(1);
        }
        if(!String.isValidID(prefix)){
            prefix=prefix.replace(/'/g,"")
                           .replace(/'/g,"")
                           .replace(/[^a-zA-Z0-9_]/g,"_")
                           .replace(/^([0-9])/,"$$$1");
        }
        return prefix;
    },
    _makeUniqueId:function(baseId,liveObject){
        if(window[baseId]==null||(liveObject&&window[baseId]==liveObject))return baseId;
        var index=2,
            id
        ;
        while(!id){
            var nextId=baseId+index++;
            if(window[nextId]==null||(liveObject&&window[nextId]==liveObject))id=nextId;
        }
        return id;
    },
    _makeUniqueName:function(baseId,liveObject,parentNode,theTree){
        var childNodes=theTree.getChildren(parentNode),
            idsInUse={}
        ;
        for(var i=0;i<childNodes.length;i++){
            if(childNodes[i].liveObject!=liveObject)idsInUse[childNodes[i].ID]=true;
        }
        if(!idsInUse[baseId])return baseId;
        var index=2,
            id
        ;
        while(!id){
            var nextId=baseId+index++;
            if(!idsInUse[nextId])id=nextId;
        }
        return id;
    }
};
isc.A.screenListToolbarDefaults={
    _constructor:"TLayout",
    vertical:false,
    autoDraw:true,
    membersMargin:10,
    margin:2,
    height:20,
    autoParent:"screenPane"
};
isc.A.screenAddButtonDefaults={
    _constructor:"TMenuButton",
    autoDraw:false,
    title:"Add...",
    showMenuBelow:false,
    width:70,
    autoParent:"screenListToolbar"
};
isc.A.dataSourceListDefaults={
    _constructor:"TListPalette",
    showHeader:false,
    autoDraw:false,
    leaveScrollbarGap:false,
    selectionType:"single",
    canDragRecordsOut:true,
    sortField:"ID",
    emptyMessage:"<span style='color: #0066CC'>Use the 'Add...' button below to add DataSources.</span>",
    editSelectedDataSource:function(){
        var record=this.getSelectedRecord();
        isc.ClassFactory._setVBLoadingDataSources(true);
        if(record)isc.DS.get(record.ID,this.creator.getID()+".showDSEditor(dsID)",
                                                {loadParents:true});
    },
    doubleClick:function(){this.editSelectedDataSource();},
    selectionChanged:function(){
        this.creator.dsEditButton.setDisabled(this.getSelectedRecord()==null);
    },
    fields:[{
        name:"ID",
        width:"*"
    },{
        name:"dsType",
        title:"Type",
        autoFitWidth:true,
        valueMap:{
            "sql":"SQL",
            "hibernate":"Hibernate",
            "jpa":"JPA 2.0",
            "jpa1":"JPA 1.0",
            "generic":"Generic",
            "projectFile":"Project File"
        },
        width:65
    },{
        name:"download",
        showTitle:false,
        width:22,
        formatCellValue:function(value,record,rowNum,colNum,grid){
            return grid.imgHTML({
                src:"actions/exportDataSource.png",
                width:16,height:16,
                extraCSSText:"cursor:"+isc.Canvas.POINTER_OR_HAND,
                imgDir:grid.widgetImgDir
            });
        },
        showHover:true,
        hoverWrap:false,
        hoverAutoFitWidth:false,
        hoverStyle:"darkHover",
        hoverHTML:function(record,value,rowNum,colNum,grid){
            return"Export DataSource as ...";
        }
    }],
    cellClick:function(record,rowNum,colNum){
        var field=this.getField(colNum);
        if(field.name=="download"){
            isc.ClassFactory._setVBLoadingDataSources(true);
            isc.DS.get(record.ID,this.creator.getID()+".downloadDataSource(dsID)",
                                            {loadParents:true});
        }else return this.Super("cellClick",arguments);
    },
    transferDragData:function(transferExceptionList,targetWidget){
        var selection=this.getDragData();
        var paletteNode=selection[0];
        if(paletteNode.dsType=="MockDataSource"&&paletteNode.referenceInProject==false){
            var editContext=this.creator.projectComponents.getEditContext(),
                existingNode=editContext.getEditNodeArray().find("ID",paletteNode.ID);
            ;
            if(!existingNode){
                isc.warn("An embedded MockDataSource can only be used with the screen that defines it");
                return null;
            }
        }
        return this.Super("transferDragData",arguments);
    },
    dsContextMenuDefaults:{
        _constructor:"Menu",
        autoDraw:false,
        showIcon:false,
        showMenuFor:function(record,recordNum){
            this._record=record;
            this._recordNum=recordNum;
            this.showContextMenu();
        }
    },
    menuData:[{
        title:"Edit...",
        click:function(target,item,menu){
            isc.ClassFactory._setVBLoadingDataSources(true);
            isc.DS.get(menu._record.ID,menu.creator.creator.getID()+".showDSEditor(dsID)",
                                            {loadParents:true});
        }
    },{
        title:"Create relation...",
        click:function(target,item,menu){
            menu.creator.creator.showRelationEditor(menu._record.ID);
        }
    },{
        title:"Remove from project",
        enableIf:function(target,menu,item){
            return(!menu.creator.creator.project.isReadOnly()&&
                menu._record.referenceInProject!=false);
        },
        click:function(target,item,menu){
            menu.creator.creator.project.removeDatasource(menu._record.ID);
        }
    },{
        title:"Save separately from screen..",
        enableIf:function(target,menu,item){
            return(menu._record.referenceInProject==false);
        },
        click:function(target,item,menu){
            isc.ClassFactory._setVBLoadingDataSources(true);
            isc.DS.get(menu._record.ID,function(dsID){
                menu.creator.creator.saveDSToFile(dsID,menu._record);
            },{loadParents:true});
        }
    }],
    rowContextClick:function(record,rowNum,colNum){
        this.dsContextMenu.showMenuFor(record,rowNum);
        return false;
    },
    initWidget:function(){
        this.Super("initWidget",arguments);
        var data=this.menuData.duplicate();
        if(!this.creator.enableRelationEditor){
            data.remove(data.find("title","Create relation..."));
        }
        this.dsContextMenu=this.createAutoChild("dsContextMenu",{data:data});
    },
    autoParent:"dataSourcePane",
    dragStart:function(){
        this.topElement.autoSwitchToEditMode();
    }
};
isc.A.dataSourceListToolbarDefaults={
    _constructor:"TLayout",
    vertical:false,
    autoDraw:true,
    align:"right",
    membersMargin:10,
    margin:2,
    height:20,
    autoParent:"dataSourcePane"
};
isc.A.dsNewButtonDefaults={
    _constructor:"TMenuButton",
    autoDraw:false,
    title:"Add...",
    showMenuBelow:false,
    showDisabledIcon:false,
    width:70,
    autoParent:"dataSourceListToolbar"
};
isc.A.dsNewButtonMenuDefaults={
    _constructor:"Menu",
    submenuDelay:0,
    wizardData:[{
        title:"New DataSource",
        icon:"[SKINIMG]actions/plus.png",
        click:function(target,item,menu){
            menu.creator.showDSWizard();
        }
    },{
        title:"Copy an existing DataSource",
        icon:"page_copy.png",
        click:function(target,item,menu){
            menu.creator.showCopyExistingDataSourceUI();
        }
    },{
        title:"Use a shared DataSource",
        icon:"[SKINIMG]actions/search.png",
        click:function(target,item,menu){
            menu.creator.showLoadSharedDataSourceUI();
        }
    }],
    nonWizardData:[{
        title:"New DataSource",
        icon:"[SKINIMG]actions/plus.png",
        click:function(target,item,menu){
            menu.showNewDataSourceDialog();
        }
    },{
        title:"Copy an existing DataSource",
        icon:"page_copy.png",
        click:function(target,item,menu){
            menu.creator.showCopyExistingDataSourceUI();
        }
    },{
        title:"Use a shared DataSource",
        icon:"[SKINIMG]actions/search.png",
        click:function(target,item,menu){
            menu.creator.showLoadSharedDataSourceUI();
        }
    }],
    init:function(){
        this.data=(this.creator.useMenuForDSWizardPicker?this.nonWizardData:this.wizardData);
        this.Super("init",arguments);
    },
    getSubmenu:function(item){
        item=this.getItem(item);
        if(this.creator.useMenuForDSWizardPicker&&item.title=="New DataSource"){
            this.createNewDSSubMenu();
            return this.dsTypeSubmenu;
        }
    },
    createNewDSSubMenu:function(){
        if(this.dsTypeSubmenu)return;
        var data=this.creator._dsWizards,
            submenuData=[]
        ;
        for(var i=0;i<data.length;i++){
            var record=data[i];
            if(record.canSelect=="false")continue;
            var menuItem={
                title:record.title,
                icon:record.icon,
                wizardRecord:record
            };
            submenuData.add(menuItem);
        }
        var _this=this;
        this.dsTypeSubmenu=isc.Menu.create({
            autoDraw:false,
            showShadow:true,
            shadowDepth:10,
            data:submenuData,
            itemClick:function(item){
                _this.creator.showDSWizard(item.wizardRecord);
            }
        });
    },
    showNewDataSourceDialog:function(){
        var data=this.creator._dsWizards,
            choices=[]
        ;
        for(var i=0;i<data.length;i++){
            var record=data[i];
            if(record.canSelect=="false")continue;
            var choice={
                title:record.title,
                icon:record.icon,
                wizardRecord:record
            };
            choices.add(choice);
        }
        this.creator.showNewDataSourceDialog(choices);
    }
};
isc.A.dsEditButtonDefaults={
    _constructor:"TButton",
    autoDraw:false,
    disabled:true,
    title:"Edit...",
    width:70,
    click:"this.creator.dataSourceList.editSelectedDataSource()",
    autoParent:"dataSourceListToolbar"
};
isc.A.projectComponentsMenuDefaults={
    _constructor:"Menu",
    autoDraw:false,
    showIcon:false,
    enableIf:function(target,menu){
        var selection=target?target.getSelection():null,
            node=selection?selection[0]:null,
            removeOK=true;
        if(!target.creator.canAddRootComponents){
            var data=target.data,
                selectionLength=(selection==null?0:selection.length);
            for(var i=0;i<selectionLength;++i){
                if(data.isRoot(data.getParent(selection[i]))&&
                    selection[i].alwaysAllowRootDrop!=true&&
                    selection[i].alwaysAllowRootDrop!="true")
                {
                    removeOK=false;
                }
            }
        }
        return{selection:selection,node:node,removeOK:removeOK};
    },
    data:[
        {title:"Remove",enableIf:"node != null && removeOK",
            click:function(target){
                var selection=target.getSelection(),
                    selectionLength=(selection==null?0:selection.length);
                for(var i=0;i<selectionLength;++i){
                    var node=selection[i];
                    target.destroyNode(node);
                }
                target.data.removeList(selection);
            }
        }
    ]
};
isc.A.projectComponentsDefaults={
    _constructor:"TEditTree",
    showHeaderMenuButton:false,
    styleName:"pageBackground",
    editContextDefaults:{
        persistCoordinates:null,
        selectedAppearance:"outlineEdges",
        canGroupSelect:false,
        enableInlineEdit:true,
        isVisualBuilder:true,
        addNode:function(newNode,parent,index,parentField,skipParentComponentAdd,forceSingularFieldReplace,skipNodeAddedNotification){
            var editTree=this.creator;
            var iscClass=isc.DataSource.getNearestSchemaClass(newNode.type);
            if(iscClass&&(iscClass.isA(isc.DataSource)||newNode.deferCreation)){
                if(newNode.loadData!=null&&!newNode.isLoaded){
                    var _this=this;
                    newNode.loadData(newNode,function(){
                        _this.addNode(newNode,parent,index,parentField,skipParentComponentAdd,forceSingularFieldReplace,skipNodeAddedNotification);
                    });
                    return;
                }
                if(!this.dontShowFieldMapper){
                    var _this=this;
                    var showed=editTree.showFieldMapper(parent.liveObject,newNode,parent,function(){
                        _this.dontShowFieldMapper=true;
                        _this.addNode(newNode,parent,index,parentField,skipParentComponentAdd,forceSingularFieldReplace,skipNodeAddedNotification);
                        delete _this.dontShowFieldMapper;
                    });
                    if(showed){
                        return;
                    }
                }
                if(!this.dontShowTreeRelationConfirm){
                    var bindTarget=parent.liveObject;
                    if(isc.isA.TreeGrid(bindTarget)||isc.isA.PickTreeItem(bindTarget)){
                        var ds=newNode.liveObject;
                        if(!isc.isA.MockDataSource(ds)||ds.mockDataType!="tree"){
                            var relationship=ds.getTreeRelationship(ds);
                            if(!relationship||!relationship.parentIdField||
                                (relationship.idField&&
                                    relationship.childDS==relationship.parentDS&&
                                    relationship.parentIdField==relationship.idField))
                            {
                                var _this=this,
                                    builder=editTree.creator,
                                    callArgs=arguments
                                ;
                                isc.ask("This DataSource does not contain a tree relationship. Create one now?",
                                    function(value){
                                        if(value){
                                            builder.showSimpleTreeRelationEditor(ds,function(){
                                                var newNode=callArgs[0];
                                                newNode.liveObject=isc.DS.get(ds.ID);
                                                _this.dontShowTreeRelationConfirm=true;
                                                _this.addNode.apply(_this,callArgs);
                                                delete _this.dontShowTreeRelationConfirm;
                                            });
                                        }else{
                                            _this.dontShowTreeRelationConfirm=true;
                                            _this.addNode.apply(_this,callArgs);
                                            delete _this.dontShowTreeRelationConfirm;
                                        }
                                    },{
                                        buttons:[isc.Dialog.NO,isc.Dialog.YES],
                                        autoFocusButton:1
                                    }
                                );
                                return;
                            }
                        }
                    }
                }
            }
            newNode=this.Super("addNode",arguments);
            if(!newNode)return;
            if(!this.creator.canDropRootNodes&&
                    this.getRootEditNode()==parent&&
                    !(newNode.alwaysAllowRootDrop==true||newNode.alwaysAllowRootDrop=="true"))
            {
                if(!isc.isA.ValuesManager(newNode.liveObject)){
                    newNode._canRemove=false;
                }
            }
            if(!newNode.dropped||(newNode.loadData!=null&&!newNode.isLoaded)){
                editTree.observeNodeDragResized(newNode,parent);
                editTree.creator.componentAdded();
                return newNode;
            }
            var iscClass=isc.ClassFactory.getClass(newNode.type);
            if(iscClass!=null&&iscClass.isA(isc.DataSource)){
                var ds=newNode.liveObject,
                    type=ds.serverType||ds.dsType||ds.dataSourceType,
                    bindTargetNode=parent,
                    bindTarget=parent.liveObject;
                if((isc.isA.ListGrid(bindTarget)||isc.isA.TileGrid(bindTarget))&&
                    (type=="sql"||type=="hibernate"||ds.dataURL!=null||
                     ds.clientOnly||ds.serviceNamespace!=null)&&
                    !ds.noAutoFetch&&
                    bindTarget.autoFetchData!=false)
                {
                    editTree.setNodeProperties(bindTargetNode,{autoFetchData:true});
                    if(isc.SForce&&isc.isA.SFDataSource(ds)&&!isc.SForce.sessionId){
                        isc.SForce.ensureLoggedIn(function(){bindTarget.fetchData();},true);
                    }else{
                        bindTarget.fetchData();
                    }
                }
                this.deselectAllComponents();
                this.selectSingleComponent(bindTarget);
            }
            var liveObject=this.getLiveObject(newNode);
            if(!liveObject.getEditableProperties){
                editTree.creator.componentAdded();
                return newNode;
            }
            editTree.observeNodeDragResized(newNode,parent);
            if(liveObject.setEditableProperties){
                liveObject.setEditableProperties({});
                if(liveObject.markForRedraw)liveObject.markForRedraw();
                else if(liveObject.redraw)liveObject.redraw();
            }
            editTree.delayCall("hiliteSelected");
            editTree.creator.componentAdded();
            return newNode;
        },
        removeNode:function(editNode,skipLiveRemoval,skipNodeRemovedNotification){
            var editTree=this.creator,
                parentNode=editTree.data.getParent(editNode)
            ;
            if(!parentNode)return;
            var liveObject=editNode.liveObject;
            if(liveObject&&editTree.creator.isObserving(liveObject,"dragResized")){
                editTree.creator.ignore(liveObject,"dragResized");
            }
            this.Super("removeNode",[editNode,skipLiveRemoval,skipNodeRemovedNotification],arguments);
            if(!skipNodeRemovedNotification){
                editTree.creator.componentRemoved(editNode,parentNode);
            }
        },
        removeAll:function(){
            var editTree=this.creator;
            editTree.creator.clearComponent();
            return this.Super("removeAll",arguments);
        },
        destroyAll:function(){
            var editTree=this.creator;
            editTree.creator.clearComponent();
            var libraryComponents=editTree.defaultPalette;
            libraryComponents.typeCount={};
            return this.Super("destroyAll",arguments);
        },
        destroyNode:function(editNode){
            var editTree=this.creator,
                libraryComponents=editTree.defaultPalette,
                updateTypeCount=!isc.isAn.emptyObject(libraryComponents.typeCount),
                type=editNode.type||editNode.className,
                idName=editNode.idName
            ;
            if(updateTypeCount){
                if(!idName){
                    var paletteNode=editTree.editContext.findPaletteNode("type",type);
                    if(paletteNode)idName=paletteNode.idName;
                }
                if(idName)type=idName;
            }
            this.Super("destroyNode",arguments);
            if(!updateTypeCount)return;
            var ID=editNode.ID;
            if(ID&&ID.startsWith(type)){
                var index=parseInt(ID.substring(type.length));
                if(index!=null&&!isNaN(index)){
                    var nextIndex=libraryComponents.typeCount[type]||0;
                    if(index==(nextIndex-1)){
                        while(index>=0&&!window[type+index]){
                            libraryComponents.typeCount[type]--;
                            index--;
                        }
                        if(index<0){
                            delete libraryComponents.typeCount[type];
                        }
                    }
                }
            }
        },
        setNodeProperties:function(editNode,properties,skipLiveObjectUpdate){
            var editTree=this.creator,
                libraryComponents=editTree.defaultPalette,
                idField=isc.DS.getAutoIdField(editNode),
                autoIdField=isc.DS.getToolAutoIdField(editNode),
                idChanged=false,
                oldID,
                newID,
                undef
            ;
            if(autoIdField&&editNode.defaults&&editNode.defaults[autoIdField]&&!properties[autoIdField]){
                var newAutoID,
                    defaults=isc.addProperties({},editNode.defaults,properties)
                ;
                if(properties[idField]!=undef){
                }else if(properties.title!=undef){
                    if(defaults.title&&defaults.title!=editNode.ID){
                        var id=isc.DS.getAutoId(defaults),
                            type=editNode.idName||editNode.idPrefix||editNode.type
                        ;
                        newAutoID=libraryComponents.getNextAutoId(type,editNode,defaults.title);
                        if(newAutoID==id)newAutoID=null;
                    }
                }else if(properties.defaultValue!=undef){
                    if(editNode.liveObject&&isc.isA.HeaderItem(editNode.liveObject)){
                        var id=isc.DS.getAutoId(defaults),
                            type=editNode.idName||editNode.idPrefix||editNode.type
                        ;
                        if(defaults.defaultValue!=id){
                            newAutoID=libraryComponents.getNextAutoId(type,editNode,defaults.defaultValue);
                        }
                    }
                }
                if(newAutoID&&autoIdField){
                    var props={};
                    props[autoIdField]=newAutoID;
                    properties=isc.addProperties(props,properties);
                    idChanged=true;
                    oldID=defaults[autoIdField]||defaults[idField];
                    newID=newAutoID;
                }
            }
            this.addUsageRecord("componentEdit",properties);
            this.Super("setNodeProperties",[editNode,properties,skipLiveObjectUpdate]);
            if(autoIdField&&editNode.defaults&&editNode.defaults[autoIdField]){
                if(properties[idField]!=undef){
                    this.removeNodeProperties(editNode,autoIdField);
                    idChanged=true;
                    oldID=defaults[autoIdField]||defaults[idField];
                    newID=properties[idField];
                }
            }
            if(idChanged){
                var component=editNode.liveObject;
                editTree.creator.delayCall("notifyIDOrFieldNameChange",
                    [component,autoIdField,oldID,newID]);
            }
        },
        getSelectedLabelTools:function(object){
            var node=this.getSelectedEditNode(),
                tools=[]
            ;
            if(!node)return;
            var editTree=this.creator,
                builder=editTree.creator
            ;
            if((node.liveObject&&isc.isA.Window(node.liveObject)&&node.liveObject.isModal)||
                node._hiddenByRule)
            {
                var img=this._eyeImage;
                if(!img){
                    img=this._eyeImage=isc.Img.create({
                        src:"hiddenComponent.png",
                        hoverWrap:false,
                        hoverAutoFitWidth:false,
                        hoverStyle:"darkHover",
                        width:16,height:16
                    });
                }
                img.prompt=(node._hiddenByRule
                    ?"Component would be hidden by visibility rule - edit Visible When property to change"
                    :"Component is marked as initially hidden");
                tools[0]=img;
            }
            if(isc.isA.DataBoundComponent(object)&&object.dataSource){
                var img=this._dbcImage;
                if(!img){
                    img=this._dbcImage=isc.Img.create({
                        src:"[SKIN]DatabaseBrowser/data.png",
                        prompt:"Edit data binding",
                        hoverWrap:false,
                        hoverAutoFitWidth:false,
                        hoverStyle:"darkHover",
                        width:16,height:16,
                        cursor:"pointer",
                        click:function(){
                            var selected=isc.SelectionOutline.getSelectedObject(),
                                ds,
                                node
                            ;
                            if(selected&&selected.editContext){
                                node=selected.editNode;
                                ds=selected.dataSource;
                                if(isc.isA.String(selected.dataSource)){
                                    ds=isc.DS.get(selected.dataSource);
                                }
                            }
                            if(ds){
                                if(isc.isA.MockDataSource(ds)){
                                    var data=builder._dsWizards,
                                        wizardName=builder.mockDataSourceSampleWizardName
                                    ;
                                    var wizardRecord=data.find("name",wizardName);
                                    if(!wizardRecord){
                                        isc.warn("Sample Data wizard '"+wizardName+"' not found");
                                        return;
                                    }
                                    wizardRecord=isc.addProperties({},wizardRecord,{
                                        wizardDefaults:{
                                            targetDSType:"MockDataSource",
                                            existingDS:ds
                                        }
                                    });
                                    builder.showDSWizard(wizardRecord,node);
                                }else{
                                    builder.showDSEditor(ds.ID);
                                }
                            }
                        }
                    });
                }
                if(tools[0]!=null)tools[0]=[tools[0],img];
                else tools[0]=img;
            }
            if((object.getClassName&&
                (object.getClassName()=="VLayout"||object.getClassName()=="HLayout"))||
                    (isc.isA.LayoutResizeBar(object)&&
                        isc.isA.Layout(object.parentElement)&&
                        !isc.isA.DataView(object.parentElement)&&
                        !isc.isA.Deck(object.parentElement)))
            {
                var img=this._rotateImage;
                if(!img){
                    img=this._rotateImage=isc.Img.create({
                        src:"actions/rotate.png",
                        hoverWrap:false,
                        hoverAutoFitWidth:false,
                        hoverStyle:"darkHover",
                        width:16,height:16,
                        showRollOver:true,
                        cursor:"pointer",
                        click:function(){
                            var selected=isc.SelectionOutline.getSelectedObject(),
                                node
                            ;
                            if(selected&&selected.editContext){
                                node=selected.editNode;
                                if(node){
                                    selected.editContext.changeOrientationOfNode(node);
                                }
                            }
                        }
                    });
                }
                var vertical=(isc.isA.LayoutResizeBar(object)?!object.vertical:object.vertical);
                img.prompt="Flip layout to "+(vertical?"horizontal":"vertical");
                tools[1]=img;
            }
            if(node._canRemove!==false){
                var img=this._removeImage;
                if(!img){
                    img=this._removeImage=isc.Img.create({
                        src:"[SKIN]/../../ToolSkin/images/actions/remove.png",
                        prompt:"Remove component",
                        hoverWrap:false,
                        hoverAutoFitWidth:false,
                        hoverStyle:"darkHover",
                        width:16,height:16,
                        cursor:"pointer",
                        click:function(){
                            var selected=isc.SelectionOutline.getSelectedObject();
                            if(selected&&selected.editContext){
                                if(isc.isA.DataBoundComponent(selected)){
                                    var message="Remove component?";
                                    isc.confirm(message,function(response){
                                        if(response)selected.editContext.destroyNode(selected.editNode);
                                    },{
                                        buttons:[isc.Dialog.CANCEL,isc.Dialog.OK],
                                        autoFocusButton:1
                                    });
                                }else{
                                    selected.editContext.destroyNode(selected.editNode);
                                }
                            }
                        }
                    });
                }
                if(tools[1]!=null)tools[1]=[tools[1],img];
                else tools[1]=img;
            }
            return tools;
        },
        changeOrientationOfNode:function(editNode){
            var editTree=this.creator.getEditNodeTree();
            var resizeBarID;
            if(editNode.liveObject&&isc.isA.LayoutResizeBar(editNode.liveObject)){
                resizeBarID=editNode.ID;
                editNode=editTree.getParent(editNode);
            }
            var autoIdField=isc.DS.getToolAutoIdField(editNode),
                userDefinedId=!(autoIdField&&editNode.defaults&&editNode.defaults[autoIdField])
            ;
            var parentNode=editTree.getParent(editNode),
                index=editTree.getChildren(parentNode).findIndex(editNode)
            ;
            this.logInfo("using remove/re-add cycle to change orientation of: "+
                        isc.echoLeaf(editNode.liveObject)+" within parent node "+
                        isc.echoLeaf(parentNode));
            var childNodes=editTree.getChildren(editNode);
            if(childNodes){
                childNodes=childNodes.duplicate();
                for(var i=0;i<childNodes.length;i++){
                    var liveChild=this.getLiveObject(childNodes[i]);
                    if(this.isComponentSelected(liveChild))this.deselectComponents(liveChild,true);
                    this.removeNode(childNodes[i],true);
                }
            }
            var liveChild=this.getLiveObject(editNode),
                schema=isc.DS.getSchema(editNode)
            ;
            if(this.isComponentSelected(liveChild))this.deselectComponents(liveChild,true);
            this.removeNode(editNode);
            if(liveChild&&liveChild.destroy)liveChild.destroy();
            var paletteNode=this.makePaletteNode(editNode);
            if(!paletteNode.defaults)paletteNode.defaults={};
            if(schema.ID=="VLayout"){
                paletteNode.type="HLayout";
                paletteNode.defaults._constructor="HLayout";
                if(!userDefinedId)delete paletteNode.defaults[autoIdField];
            }else if(schema.ID=="HLayout"){
                paletteNode.type="VLayout";
                paletteNode.defaults._constructor="VLayout";
                if(!userDefinedId)delete paletteNode.defaults[autoIdField];
            }
            editNode=this.makeEditNode(paletteNode);
            var node=this.addNode(editNode,parentNode,index);
            if(childNodes){
                for(var i=0;i<childNodes.length;i++){
                    var childNode=childNodes[i];
                    if(childNode.type=="LayoutResizeBar"){
                        var paletteNode=this.makePaletteNode(childNode);
                        if(childNode.liveObject.destroy)childNode.liveObject.destroy();
                        childNode=this.makeEditNode(paletteNode);
                    }
                    this.addNode(childNode,node);
                }
            }
            if(parentNode.type=="NavItem"){
                var navPanelNode=editTree.getParent(parentNode);
                navPanelNode.liveObject.setItemPane(parentNode.liveObject,node.liveObject);
            }
            if(resizeBarID){
                childNodes=editTree.getChildren(editNode);
                editNode=childNodes.find("ID",resizeBarID);
            }
            this.selectSingleEditNode(editNode);
            if(this.creator.nodeClick){
                this.creator.nodeClick(this.creator,editNode,this.creator.getRecordIndex(editNode));
            }
            if(this.markForRedraw)this.markForRedraw();
            editTree.dataChanged();
        },
        nodeAdded:function(newNode,parentNode,rootNode){
            var editTree=this.creator,
                builder=editTree.creator
            ;
            if(!builder.offerImmediateBinding||builder.mockupMode)return;
            if(isc._loadingNodeTree)return;
            var liveObject=newNode.liveObject;
            if(!liveObject)return;
            if(!isc.isA.DynamicForm(liveObject)&&
                !isc.isA.ListGrid(liveObject)&&
                !isc.isA.TileGrid(liveObject)&&
                !isc.isA.DetailViewer(liveObject))
            {
                return;
            }
            if(isc.isA.Menu(liveObject))return;
            if(liveObject.dataSource)return;
            builder.offerBinding(newNode);
        },
        editNodeUpdated:function(editNode,editContext,modifiedProperties){
            var editTree=this.creator,
                builder=editTree.creator,
                libraryComponents=editTree.defaultPalette,
                autoIdField=isc.DS.getToolAutoIdField(editNode)
            ;
            if(autoIdField&&editNode.defaults&&editNode.defaults[autoIdField]){
                var newAutoID;
                if(modifiedProperties.contains("dataSource")){
                    var dataSource=isc.DS.get(editNode.liveObject.dataSource),
                        dsID=(dataSource?dataSource.ID:null)
                    ;
                    if(dsID){
                        newAutoID=libraryComponents.getNextAutoId(editNode.idName||
                                        editNode.idPrefix||editNode.type,editNode,dsID);
                    }
                }
                if(newAutoID&&autoIdField){
                    var props={};
                    props[autoIdField]=newAutoID;
                    editContext.setNodeProperties(editNode,props);
                }
            }
            var rowNum=editTree.getRecordIndex(editNode);
            editTree.refreshRecordComponent(rowNum,0);
            if(!this.savingComponentProperties&&builder){
                var currentComponent=builder.getCurrentComponent();
                if(currentComponent&&currentComponent.liveObject==editNode.liveObject){
                    builder.refreshComponent();
                }
            }
        },
        canAddToParent:function(targetNode,type){
            if(!this.creator.canDropRootNodes&&this.getRootEditNode()==targetNode){
                return false;
            }
            return this.Super("canAddToParent",arguments);
        },
        nodeMoved:function(oldNode,oldParentNode,newNode,newParentNode,rootNode){
            this.addUsageRecord("componentMove",newNode,newParentNode);
        },
        getExtraComponentsToSerialize:function(){
            var editTree=this.creator,
                builder=editTree.creator,
                defaultsBlocks=[]
            ;
            var projectDataSources=builder.project.datasources,
                editNodes=this.getEditNodeArray(),
                dataSourceNames=[]
            ;
            for(var i=0;i<projectDataSources.length;i++){
                var dsID=projectDataSources[i].dsName,
                    existingNode=editNodes.find("ID",dsID)
                ;
                if(!existingNode)dataSourceNames.add(dsID);
            }
            if(dataSourceNames.length>0){
                var ids=dataSourceNames.join(",");
                var defaults={
                    _constructor:"DataSource",
                    $schemaId:"DataSource",
                    loadID:ids,
                    loadParents:true
                };
                defaultsBlocks.add(defaults);
            }
            return defaultsBlocks;
        },
        addUsageRecord:function(action,data,data2){
            var components=this.creator,
                builder=components.creator;
            if(!builder.hostedMode)return;
            switch(action){
            case"componentAdd":
            case"componentMove":
                var droppedNodeTitle=data.title||data.type,
                    parentNodeTitle=data2.title||data2.type;
                builder._addUsageRecord(action,droppedNodeTitle,parentNodeTitle);
                break;
            case"componentEdit":
                for(var property in data){
                    var value=data[property];
                    builder._addUsageRecord(action,property,value);
                    break;
                }
                break;
            }
        }
    },
    shouldShowDragLineForRecord:function(){
        if(this.Super("shouldShowDragLineForRecord",arguments)){
            return!!this.willAcceptDrop();
        }
        return false;
    },
    autoDraw:false,
    canSort:false,
    leaveScrollbarGap:false,
    selectionUpdated:function(record){
        if(this._pendingEditComponent){
            isc.Timer.clear(this._pendingEditComponent);
            delete this._pendingEditComponent;
        }
        if(!this.editContext._updatingDynamicProperties){
            if(record){
                this._pendingEditComponent=this.creator.delayCall("editComponent",
                    [record,record.liveObject],50);
            }else{
                this.creator.clearComponent();
                this.editContext.hideSelection();
            }
        }
    },
    hiliteSelected:function(repeated){
        var node=this.getSelectedRecord();
        while(node){
            var object=node?node.liveObject:null;
            if(((isc.isA.Canvas(object)||isc.isA.FormItem(object))
                    &&object.isDrawn()&&object.isVisible())||
                (object.editProxy&&object.editProxy.canSelect==true))
            {
                var outlineTarget=isc.SelectionOutline.getSelectedObject();
                if(outlineTarget&&object!=outlineTarget&&outlineTarget.editProxy){
                    outlineTarget.editProxy.showSelectedAppearance(false);
                }
                if(object!=outlineTarget&&object.editProxy){
                    object.editProxy.showSelectedAppearance(true);
                }
                if(!repeated&&!isc.isA.Canvas(object)&&!isc.isA.FormItem(object)&&
                    object.editProxy&&object.editProxy.canSelect==true)
                {
                    this.delayCall("hiliteSelected",[true]);
                    return;
                }
                break;
            }
            node=this.data.getParent(node);
        }
    },
    initWidget:function(){
        this.Super("initWidget",arguments);
        if(!isc.jsdoc.hasData()){
            this.delayCall("refreshWithJSDocs",null,250);
        }
    },
    refreshWithJSDocs:function(){
        if(!isc.jsdoc.hasData()){
            this.delayCall("refreshWithJSDocs",null,250);
        }else if(this.body){
            var visibleRows=this.getVisibleRows();
            if(visibleRows[0]>=0){
                for(var rowNum=visibleRows[0];rowNum<visibleRows[1];rowNum++){
                    this.refreshRecordComponent(rowNum,0,true);
                }
            }
            this.markForRedraw("jsdoc refresh");
        }
    },
    showRecordComponents:true,
    showRecordComponentsByCell:true,
    recordComponentPoolingMode:"recycle",
    createRecordComponent:function(record,colNum){
        var fieldName=this.getFieldName(colNum);
        if(fieldName!="ID")return null;
        if(!isc.jsdoc.hasData())return null;
        var hasEvents=this.hasEvents(record),
            hasWhenRules=this.hasWhenRules(record),
            hasValuesManager=this.hasValuesManager(record),
            hasDynamicProperties=this.hasDynamicProperties(record)
        ;
        if(!hasEvents&&!hasWhenRules&&!hasValuesManager&&!hasDynamicProperties)return null;
        var grid=this,
            rowNum=this.getRecordIndex(record),
            offset=this.body.getColumnAutoSize(colNum,rowNum,rowNum+1)+10
        ;
        var recordCanvas=isc.HLayout.create({
            height:grid.cellHeight,
            width:1,
            membersMargin:10,
            snapOffsetLeft:offset
        });
        var eventsImg=isc.Img.create({
            layoutAlign:"center",
            src:"hasEvents.png",
            height:16,
            width:16,
            visibility:(hasEvents?"inherit":"hidden"),
            canHover:true,
            hoverWidth:250,
            hoverAutoFitWidth:false,
            hoverWrap:false,
            hoverStyle:"darkHover",
            getHoverHTML:function(){
                return grid.getEventsHoverHTML(record);
            }
        });
        recordCanvas.addMember(eventsImg);
        var rulesImg=isc.Img.create({
            layoutAlign:"center",
            src:"hasWhenRules.png",
            height:16,
            width:16,
            visibility:(hasWhenRules?"inherit":"hidden"),
            canHover:true,
            hoverWidth:250,
            hoverAutoFitWidth:false,
            hoverWrap:false,
            hoverStyle:"darkHover",
            getHoverHTML:function(){
                return grid.getWhenRulesHoverHTML(record);
            }
        });
        recordCanvas.addMember(rulesImg);
        var vmImg=isc.ImgButton.create({
            canFocus:false,
            showDown:false,
            showRollOver:false,
            layoutAlign:"center",
            src:"database.png",
            height:16,
            width:16,
            imageType:"center",
            imageHeight:16,
            visibility:(hasValuesManager?"inherit":"hidden"),
            canHover:true,
            hoverWidth:250,
            hoverAutoFitWidth:false,
            hoverWrap:false,
            hoverStyle:"darkHover",
            getHoverHTML:function(){
                return grid.getValuesManagerHoverHTML(record);
            },
            click:function(){
                grid.selectNodeForValuesManager(record);
            }
        });
        recordCanvas.addMember(vmImg);
        var dynPropsImg=isc.Img.create({
            layoutAlign:"center",
            src:"[SKINIMG]DynamicForm/dynamic.png",
            height:16,
            width:16,
            visibility:(hasDynamicProperties?"inherit":"hidden"),
            canHover:true,
            hoverWidth:250,
            hoverAutoFitWidth:false,
            hoverWrap:false,
            hoverStyle:"darkHover",
            getHoverHTML:function(){
                return grid.getDynamicPropertiesHoverHTML(record);
            }
        });
        recordCanvas.addMember(dynPropsImg);
        return recordCanvas;
    },
    updateRecordComponent:function(record,colNum,component,recordChanged){
        var fieldName=this.getFieldName(colNum);
        if(fieldName!="ID")return null;
        var hasEvents=this.hasEvents(record),
            hasWhenRules=this.hasWhenRules(record),
            hasValuesManager=this.hasValuesManager(record),
            hasDynamicProperties=this.hasDynamicProperties(record)
        ;
        if(hasEvents)component.getMember(0).show();
        else component.getMember(0).hide();
        if(hasWhenRules)component.getMember(1).show();
        else component.getMember(1).hide();
        if(hasValuesManager)component.getMember(2).show();
        else component.getMember(2).hide();
        if(hasDynamicProperties)component.getMember(3).show();
        else component.getMember(3).hide();
        var rowNum=this.getRecordIndex(record),
            offset=this.body.getColumnAutoSize(colNum,rowNum,rowNum+1)+10
        ;
        component.setSnapOffsetLeft(offset);
        return component;
    },
    selectNodeForValuesManager:function(record){
        var liveObject=record.liveObject;
        if(!liveObject||(!liveObject.getClassName&&!liveObject._constructor)){
            return false;
        }
        var vmID=liveObject.valuesManager;
        if(!isc.isA.String(vmID))vmID=vmID.ID;
        var editContext=this.getEditContext(),
            node=editContext&&editContext.getEditNodeArray().find("ID",vmID)
        ;
        if(node)editContext.selectSingleEditNode(node);
    },
    hoverStyle:"darkHover",
    removeFieldProperties:{
        hoverWrap:false,
        hoverAutoFitWidth:false
    },
    cellHoverHTML:function(record,rowNum,colNum){
        var field=this.getField(colNum),
            fieldName=this.getFieldName(colNum)
        ;
        if(field.isRemoveField){
            return"Remove component";
        }
    },
    hasEvents:function(record){
        if(!isc.jsdoc.hasData())return false;
        var liveObject=record.liveObject;
        if(!liveObject||(!liveObject.getClassName&&!liveObject._constructor)){
            return false;
        }
        var editNode=liveObject.editNode;
        if(!editNode)return false;
        var defaults=editNode.defaults,
            className=(liveObject.getClassName?liveObject.getClassName():liveObject._constructor)
        ;
        for(var key in defaults){
            var value=defaults[key];
            if(value==null||value=="")continue;
            var docItem=isc.VisualBuilder.getEventDefinition(className,key);
            if(docItem){
                return true;
            }
        }
        return false;
    },
    maxEventsToShow:3,
    getEventsHoverHTML:function(record){
        if(!isc.jsdoc.hasData())return null;
        var liveObject=record.liveObject,
            editNode=liveObject.editNode,
            defaults=editNode.defaults,
            className=(liveObject.getClassName?liveObject.getClassName():liveObject._constructor),
            html="",
            eventCount=0;
        ;
        for(var key in defaults){
            var docItem=isc.VisualBuilder.getEventDefinition(className,key);
            if(docItem){
                if(++eventCount>this.maxEventsToShow){
                    html+="<P>More events defined, go to Events tab for info</P>";
                    break;
                }
                var value=defaults[key],
                    builder=this.creator,
                    actionTitle=isc.ExpressionItem.getActionTitle(value,builder,true)
                ;
                if(actionTitle){
                    html+=key+" : "+actionTitle+"<br>";
                }
            }
        }
        return html;
    },
    hasValuesManager:function(record){
        var liveObject=record.liveObject;
        if(!liveObject||(!liveObject.getClassName&&!liveObject._constructor)){
            return false;
        }
        return(liveObject.valuesManager!=null);
    },
    getValuesManagerHoverHTML:function(record){
        var liveObject=record.liveObject;
        var vm=liveObject.valuesManager;
        if(!isc.isA.String(vm))vm=vm.ID;
        return"This form is part of the ValuesManager '"+vm+"'";
    },
    hasWhenRules:function(record){
        var liveObject=record.liveObject;
        if(!liveObject){
            return false;
        }
        return((liveObject.visibleWhen!=null&&!isc.isA.emptyObject(liveObject.visibleWhen))||
            (liveObject.enableWhen!=null&&!isc.isA.emptyObject(liveObject.visibleWhen))||
            (liveObject.readOnlyWhen!=null&&!isc.isA.emptyObject(liveObject.visibleWhen)));
    },
    _getCriteriaDescriptionFunc:function(record){
        var liveObject=record.liveObject;
        if(!this._ruleScopeDataSources){
            var targetRuleScope=this.creator.getTargetRuleScope();
            if(targetRuleScope){
                this._ruleScopeDataSources=
                    isc.Canvas.getAllRuleScopeDataSources(targetRuleScope);
            }
        }
        var ds=this._ruleScopeDataSources,
            localComponent=liveObject
        ;
        if(localComponent&&isc.isA.FormItem(localComponent)){
            localComponent=localComponent.form;
        }
        return function getCriteriaDescription(value){
            var description=isc.DS.getAdvancedCriteriaDescription(value,ds,localComponent);
            return(!description||description==""?null:description);
        };
    },
    getWhenRulesHoverHTML:function(record){
        var getCriteriaDescription=this._getCriteriaDescriptionFunc(record),
            liveObject=record.liveObject,
            rules=[]
        ;
        if(liveObject.visibleWhen!=null&&!isc.isA.emptyObject(liveObject.visibleWhen)){
            rules.add("Visible when ["+getCriteriaDescription(liveObject.visibleWhen)+"]");
        }
        if(liveObject.enableWhen!=null&&!isc.isA.emptyObject(liveObject.enableWhen)){
            rules.add("Enable when ["+getCriteriaDescription(liveObject.enableWhen)+"]");
        }
        if(liveObject.readOnlyWhen!=null&&!isc.isA.emptyObject(liveObject.readOnlyWhen)){
            rules.add("Read-only when ["+getCriteriaDescription(liveObject.readOnlyWhen)+"]");
        }
        return(rules.length==0?null:rules.join("<br>"));
    },
    hasDynamicProperties:function(record){
        var liveObject=record.liveObject;
        if(!liveObject||isc.isA.DynamicProperty(liveObject)){
            return false;
        }
        return(liveObject._dynamicProperties&&!isc.isAn.emptyObject(liveObject._dynamicProperties));
    },
    getDynamicPropertiesHoverHTML:function(record){
        var liveObject=record.liveObject;
        if(!liveObject._dynamicProperties||isc.isAn.emptyObject(liveObject._dynamicProperties)){
            return null;
        }
        var dynProps=liveObject._dynamicProperties,
            properties=[]
        ;
        for(var key in dynProps){
            var dynamicProperty=dynProps[key],
                formula
            ;
            if(isc.isA.String(dynamicProperty)){
                formula="[DataPath: \""+dynamicProperty+"\"]";
            }else if(dynamicProperty.dataPath){
                formula="[DataPath: \""+dynamicProperty.dataPath+"\"]";
            }else if(dynamicProperty.trueWhen){
                var critDescFunc=this._getCriteriaDescriptionFunc(record);
                formula="[Criteria: \""+critDescFunc(dynamicProperty.trueWhen)+"\"]";
            }else{
                var type=(dynamicProperty.textFormula?"Text ":"")+"Formula",
                    formulaText=(dynamicProperty.textFormula?
                        dynamicProperty.textFormula.text:dynamicProperty.formula.text);
                ;
                formula="["+type+": \""+formulaText+"\"]";
            }
            properties.add(key+": "+formula);
        }
        return(properties.length==0?null:properties.join("<br>"));
    },
    canRemoveRecords:true,
    removeIcon:"[SKIN]/../../ToolSkin/images/actions/remove.png",
    removeIconSize:16,
    removeRecordClick:function(rowNum){
        var node=this.getRecord(rowNum);
        if(!node||(node&&node._canRemove===false)){
            return;
        }
        this.removeEditNode(node);
    },
    bodyKeyPress:function(event){
        var keyName=event.keyName;
        if(keyName=="Delete"||keyName=="Backspace"){
            var node=this.getSelectedRecord(),
                grid=this
            ;
            if(node&&node._canRemove!==false){
                this.creator.confirmComponentDelete(node,function(){
                    var parentNode=grid.data.getParent(node);
                    if(parentNode){
                        isc.EditContext.selectCanvasOrFormItem(parentNode.liveObject);
                    }
                    grid.removeEditNode(node);
                });
                return false;
            }
        }
        return this.Super("bodyKeyPress",arguments);
    },
    removeEditNode:function(node){
        this.destroyNode(node);
    },
    autoShowParents:true,
    dragStart:function(){
        var dragData=this.ns.EH.dragTarget.getDragData();
        if(isc.isAn.Array(dragData)){
            if(dragData.length==0)return;
            dragData=dragData[0];
        }
        if(dragData._canRemove==false)return false;
        return this.Super("dragStart",arguments);
    },
    observeNodeDragResized:function(newNode,parent){
        if(parent==null)parent=this.editContext.getDefaultParent(newNode);
        var liveParent=this.editContext.getLiveObject(parent);
        if(liveParent&&isc.isA.Layout(liveParent)&&!isc.isA.ListGrid(liveParent)){
            var liveObject=newNode.liveObject;
            if(liveObject.dragResized&&!this.isObserving(liveObject,"dragResized")){
                this.observe(liveObject,"dragResized","observer.liveObjectDragResized(observed)");
            }
        }
    },
    liveObjectDragResized:function(liveObject){
        var parentLiveObject=liveObject.parentElement;
        if(parentLiveObject){
            var editNode=liveObject.editNode;
            if(parentLiveObject.vertical){
                var newHeight=liveObject.getHeight();
                this.creator.projectComponents.setNodeProperties(editNode,{height:newHeight});
                this.creator.componentAttributeEditor.setValue("height",newHeight);
            }else{
                var newWidth=liveObject.getWidth();
                this.creator.projectComponents.setNodeProperties(editNode,{width:newWidth});
                this.creator.componentAttributeEditor.setValue("width",newWidth);
            }
        }
    },
    showFieldMapper:function(component,newNode,parent,callback){
        if(!isc.isA.ListGrid(component)&&
            !isc.isA.TileGrid(component)&&
            !isc.isA.DynamicForm(component)&&
            !isc.isA.DetailViewer(component))
        {
            return;
        }
        var _this=this,
            mockDs=component.getDataSource(),
            fields=component.getAllFields(),
            callFieldMapper=mockDs&&mockDs.isA("MockDataSource");
        if(!callFieldMapper&&this.creator.useFieldMapper){
            if(mockDs&&mockDs.isA("DataSource")){
                callFieldMapper=true;
            }else if(fields&&fields.length>0){
                callFieldMapper=true;
            }
        }
        if(callFieldMapper){
            var ds=newNode.liveObject;
            if(isc.isA.MockDataSource(newNode.liveObject))return false;
            var mapper=isc.FieldMapper.create({
                callback:callback,
                mockFields:fields,
                mockDataSource:mockDs,
                targetDataSource:ds
            });
            var wnd=isc.Window.create({
                items:[{
                    _constructor:"Label",
                    contents:mapper.description,
                    width:"100%",
                    height:1
                },
                mapper,
                {
                    _constructor:"DynamicForm",
                    colWidths:"120, *, 75, 75",
                    numCols:4,
                    width:"100%",
                    items:[{
                        _constructor:"ButtonItem",
                        title:"Use New Fields",
                        width:120,
                        endRow:false,
                        click:function(){
                            mapper.setDefaultData(true);
                        }
                    },{
                        _constructor:"SpacerItem"
                    },{
                        _constructor:"ButtonItem",
                        title:"Cancel",
                        width:75,
                        endRow:false,
                        startRow:false,
                        click:function(){
                            wnd.destroy();
                        }
                    },{
                        _constructor:"ButtonItem",
                        title:"OK",
                        endRow:false,
                        startRow:false,
                        width:75,
                        click:function(){
                            var changes=mapper.getChanges(),
                                deletes=mapper.getDeletes();
                            var dbcList=component.getRuleScopeDataBoundComponents();
                            for(var i=0;i<dbcList.length;i++){
                                _this.creator.updateComponentRuleScopeProperties(dbcList[i],changes,deletes);
                            }
                            var builder=_this.creator,
                                projectComponents=builder.projectComponents,
                                editContext=projectComponents.editContext
                            ;
                            editContext.dontShowFieldMapper=true;
                            mapper.applyMap(component,parent,wnd);
                            delete editContext.dontShowFieldMapper;
                        }
                    }]
                }],
                bodyProperties:{
                    layoutMargin:8,defaultLayoutAlign:"center"
                },
                width:800,
                title:"Fields mapping",
                autoCenter:true,
                autoSize:true,
                isModal:true
            });
        }
        return callFieldMapper;
    },
    hasComponents:function(){
        var tree=this.getData();
        var length=tree.getLength();
        return length>1||(length==1&&tree.get(0).type!="DataView");
    },
    canEdit:true,
    modalEditing:true,
    editorExit:function(event,record,newValue,rowNum,colNum){
        if(!this.validateRow(rowNum)){
            return false;
        }
        var autoIdField=isc.DS.getAutoIdField(record),
            oldValue=record[autoIdField]
        ;
        if(oldValue==this.getEditedCell(rowNum,colNum)){
            return;
        }
        var nodeProps={};
        nodeProps[autoIdField]=newValue;
        this.setNodeProperties(record,nodeProps);
        var editorValues=this.creator.componentAttributeEditor.getValues();
        if(editorValues[autoIdField]==oldValue){
            this.creator.componentAttributeEditor.setValue(autoIdField,newValue);
        }
    },
    recordDoubleClick(viewer,record,recordNum,field,fieldNum,value,rawValue){
        if(field.name=="ID"&&record&&record.type=="DataSource"){
            isc.ClassFactory._setVBLoadingDataSources(true);
            isc.DS.get(record.ID,this.creator.getID()+".showDSEditor(dsID)",
                            {loadParents:true});
            return false;
        }
    }
};
isc.A.vbExtraPalettesDefaults={
    _constructor:"HiddenPalette",
    data:[
        {title:"DataView",type:"DataView",icon:"[TOOLSIMG]classes/DataView.png",showDropIcon:true,
            addToChild:{
                ifDropClass:"LayoutResizeBar",
                childClass:"VLayout",
                createFrom:"vlayout"
            },
            insertContainer:{
                ifDropClass:"Portlet",
                type:"PortalLayout"
            }
        },
        {title:"DynamicProperty",type:"DynamicProperty",icon:"[SKINIMG]DynamicForm/dynamic.png"}
    ]
};
isc.A.mockupExtraPalettesDefaults={
    _constructor:"HiddenPalette",
    data:[
       {title:"Tab",type:"Tab"}
    ]
};
isc.A.codePreviewDefaults={
    _constructor:"DynamicForm",
    autoDraw:false,
    overflow:"hidden",
    autoFocus:false,
    height:"*",
    numCols:1,
    browserSpellCheck:false,
    fields:[
        {
            formItemType:"textArea",
            name:"codeField",
            showTitle:false,
            height:"*",
            width:"*",
            wrap:"OFF",
            browserAutoCapitalize:false,
            browserAutoCorrect:false
        }
    ],
    hasChanged:function(){
        return this.valuesHaveChanged();
    },
    discardChanges:function(){
        this.resetValues();
    },
    saveChanges:function(){
        var xmlSource=this.getValue("codeField");
        var builder=this.creator,
            screen=builder.currentScreen
        ;
        builder.loadViewFromXML(screen,xmlSource);
        this.resetValues();
    }
};
isc.A.jsCodePreviewDefaults={
    _constructor:"DynamicForm",
    autoParent:"codePane",
    autoDraw:false,
    overflow:"hidden",
    autoFocus:false,
    height:"*",
    numCols:1,
    browserSpellCheck:false,
    fields:[
        {
            formItemType:"textArea",
            name:"codeField",
            showTitle:false,
            height:"*",
            width:"*",
            wrap:"OFF",
            browserAutoCapitalize:false,
            browserAutoCorrect:false
        }
    ],
    setContents:function(contents){
        this.setValue("codeField",contents);
    }
};
isc.A.codePaneDefaults={
    _constructor:"TTabSet",
    autoDraw:false,
    paneMargin:0,
    hasChanged:function(){
        var codePreview=this.getTabPane(0);
        if(codePreview){
            return codePreview.valuesHaveChanged();
        }
        return false;
    },
    discardChanges:function(){
        var codePreview=this.getTabPane(0);
        if(codePreview){
            codePreview.resetValues();
        }
    },
    saveChanges:function(){
        var codePreview=this.getTabPane(0);
        if(codePreview){
            var xmlSource=codePreview.getValue("codeField");
            var builder=this.creator,
                screen=builder.currentScreen
            ;
            builder.loadViewFromXML(screen,xmlSource);
            codePreview.resetValues();
        }
    }
};
isc.A.codeWindowDefaults={
    _constructor:"Window",
    autoDraw:false,
    autoCenter:true,
    isModal:true,
    showMinimizeButton:false,
    width:"100%",
    height:"100%",
    title:"Source Code",
    closeClick:function(){
        if(this.canSaveChanges&&this.codePane.hasChanged&&this.codePane.hasChanged()){
            this.saveChanges();
        }else{
            this.close();
        }
    },
    saveChanges:function(){
        var self=this,
            codePane=this.codePane
        ;
        var dialog=isc.Dialog.create({
            message:"Code changes have been made to the generated XML. Should these code changes be saved to the current screen definition?",
            icon:"[SKIN]ask.png",
            buttons:[
                isc.Button.create({title:"Discard",click:function(){
                    codePane.discardChanges();
                    this.topElement.cancelClick();
                    self.close();
                }}),
                isc.Button.create({title:"Cancel",click:function(){
                    this.topElement.closeClick();
                }}),
                isc.Button.create({title:"Save",click:function(){
                    codePane.saveChanges();
                    this.topElement.cancelClick();
                    self.close();
                }})
            ],
            autoFocusButton:2
        });
        dialog.show();
    }
};
isc.A.multiActionWindowDefaults={
    _constructor:"Window",
    autoCenter:true,
    autoSize:true,
    isModal:true,
    showMinimizeButton:false,
    dismissOnEscape:true
};
isc.A.multiActionPanelDefaults={
    _constructor:"MultiActionPanel"
};
isc.A.componentAttributeEditorDefaults={
    _constructor:"TComponentEditor",
    _localId:"componentEditor",
    autoDraw:false,
    autoFocus:false,
    overflow:"auto",
    alwaysShowVScrollbar:true,
    showAttributes:true,
    showMethods:false,
    backgroundColor:isc.nativeSkin?null:"black",
    basicMode:true,
    allowDynamicProperties:true,
    iconHoverStyle:"darkHover",
    itemHoverDelay:300,
    shouldUseField:function(field){
        var vb=this.creator,
            defaultShouldUse=this.Super("shouldUseField",arguments);
        if(vb._attributeFilter==null||!defaultShouldUse)return defaultShouldUse;
        return(field.name.toLowerCase().contains(vb._attributeFilter)||
                field.title.toLowerCase().contains(vb._attributeFilter));
    },
    editComponent:function(component,liveObject){
        this.Super("editComponent",arguments);
        var editableFields=this._boundFields;
        if(!editableFields)return;
        var idField=(isc.DS.getAutoIdField?isc.DS.getAutoIdField(component):null);
        if(!idField||idField!="name")return;
        for(var i=0;i<editableFields.length;i++){
            var item=editableFields[i];
            if(item.name!="name")continue;
            var validators=item.validators;
            if(!validators){
                validators=item.validators=[];
            }
            validators.add({
                type:"custom",
                errorMessage:"Two fields in the same component cannot have the same name",
                condition:function(item,validator,value,record,additionalContext){
                    var editor=item.form,
                        editNode=editor.currentComponent,
                        liveObject=editNode.liveObject,
                        editContext=liveObject.editContext
                    ;
                    if(!editContext)return true;
                    var tree=editContext.getEditNodeTree(),
                        parentNode=tree.getParent(editNode)
                    ;
                    if(parentNode){
                        var childNodes=tree.getChildren(parentNode);
                        for(var i=0;i<childNodes.length;i++){
                            var childNode=childNodes[i],
                                childIdField=isc.DS.getAutoIdField(childNode)
                            ;
                            if(childNode!=editNode&&
                                childIdField=="name"&&
                                value==childNode[childIdField])
                            {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            });
            item.validateOnExit=true;
        }
    }
};
isc.A.componentAttributeEditorLayoutDefaults={
    _constructor:"VLayout",
    layoutMargin:0,membersMargin:0
};
isc.A.componentAttributeEditorFilterDefaults={
    _constructor:"DynamicForm",
    numCols:1,padding:0,cellPadding:0,colWidths:["*"],
    height:35,
    defaultItems:[
        {name:"filter",
         editorType:"TextItem",changeOnKeypress:true,
         width:"*",height:"*",showTitle:false,
         showHintInField:true,
         suppressBrowserClearIcon:true,
         hint:"Search All Attributes...",
         icons:[{
                    name:"go",
                    src:"search.png",
                    hspace:5,
                    inline:true,
                    showRTL:true,
                    click:function(form,item,icon){
                        form.search();
                    }
                },{
                    name:"clear",
                    src:"actions/clear.png",
                    height:12,width:12,
                    inline:true,
                    prompt:"Clear search",
                    click:function(form,item,icon){
                        form.clearSearch();
                    }
                }
         ],
         changed:function(form,item,value){
             form.fireOnPause("searchOnKP",{
                    target:form,
                    methodName:"search"
                },
                300);
         },
         keyPress:function(item,form,keyName){
            if(keyName=="Escape"){
                form.clearSearch();
                return false;
            }
         }
        }
    ],
    clearSearch:function(){
        this.getItem("filter").clearValue();
        this.search();
    },
    search:function(){
        var searchVal=this.getItem("filter").getValue();
        this.creator.filterComponentAttributeEditor(searchVal);
    }
};
isc.A.componentMethodEditorDefaults={
    _constructor:"TComponentEditor",
    sortFields:true,
    autoDraw:false,
    autoFocus:false,
    overflow:"auto",
    alwaysShowVScrollbar:true,
    showAttributes:false,
    showMethods:true,
    backgroundColor:isc.nativeSkin?null:"black",
    basicMode:true,
    iconHoverStyle:"darkHover",
    itemHoverDelay:300,
    tipDetails:{
        changed:{
            message:"Did you know? You can use Visible When or Enabled When to make "+
                "components or fields responsive to changes in value.",
            detail:"If you use the Changed event with a Workflow or Action to show or hide "+
                "a component, that will only work when a user changes a value.<P>"+
                "Instead of using the Changed event, use the \"Visible When\" property on "+
                "the target component to control when it should be shown. This works no "+
                "matter how a field gets a value, in situations where the Changed event "+
                "doesn't fire (such as when a form begins editing an existing record).<P>"+
                "The same is true for using a Changed event to enable or disable components "+
                "or make form controls read-only. Use \"Enable When\" or \"Read Only When\" "+
                "instead.<P>"+
                "\"Visible When\", \"Enable When\" and \"Read Only When\" can be configured "+
                "on many types of components, including Form Controls, Buttons, Menu Items "+
                "and more. See below for the documentation<P>",
            docs:["Canvas.visibleWhen","FormItem.readOnlyWhen","Canvas.enableWhen"]
        }
    },
    showNotifications:function(){
        this.dismissOldNotifications();
        var fields=this._editableMethodFields||[];
        for(var i=0;i<fields.length;i++){
            if(fields[i].whenRuleTip!="true")continue;
            var component=this.currentComponent,
                eventName=fields[i].name,
                schema=component&&isc.DS.getNearestSchema(component.type),
                tip
            ;
            while(!tip&&schema){
                var t=schema.ID+"_"+eventName;
                if(this.tipDetails[t]){
                    tip=t;
                    break;
                }
                schema=schema.superDS();
            }
            if(!tip&&this.tipDetails[eventName])tip=eventName;
            if(!tip)continue;
            var field=this.getField(fields[i].name);
            if(!field){
                this.delayCall("showNotifications",arguments);
                return;
            }
            if(this.builder.getHelpDialogEnabled(tip)){
                var tipDetail=this.tipDetails[tip],
                    yOffset=0
                ;
                var allFields=this.getFields();
                for(var j=0;j<allFields.length;j++){
                    var f=allFields[j];
                    if(f==field)break;
                    if(isc.isA.SectionItem(f)){
                        yOffset+=f.getHeight();
                    }
                }
                var message=tipDetail.message,
                    actions=[{
                        title:"Click to learn more...",
                        separator:"&nbsp;",
                        target:this,
                        methodName:"showLearnMore",
                        argNames:["tipDetails"],
                        args:[tipDetail]
                    }],
                    settings={
                        autoFitMaxWidth:340,
                        appearMethod:"instant",
                        duration:7000,
                        messageIcon:"[SKIN]/Dialog/notify.png",
                        messageIconWidth:32,
                        messageIconHeight:32,
                        x:field.getPageLeft()+40,
                        y:field.getPageTop()+field.getHeight()+yOffset
                    }
                ;
                if(!this._tipMessageIds)this._tipMessageIds=[];
                this._tipMessageIds.add(isc.Notify.addMessage(message,
                    actions,
                    "tipNotifications",
                    settings));
                this.builder.setHelpDialogEnabled(tip,false);
            }
        }
    },
    dismissOldNotifications:function(){
        if(!this._tipMessageIds)return;
        for(var i=0;i<this._tipMessageIds.length;i++){
            isc.Notify.dismissMessage(this._tipMessageIds[i]);
        }
        delete this._tipMessageIds;
    },
    showLearnMore:function(tipDetail){
        this.dismissOldNotifications();
        var detail=tipDetail.detail,
            members=[]
        ;
        var detailCanvas=isc.Canvas.create({
            autoDraw:false,
            contents:detail
        });
        members.add(detailCanvas);
        if(tipDetail.docs){
            var docs=tipDetail.docs;
            for(var i=0;i<docs.length;i++){
                isc.DocUtils.suppressOnClick=true;
                var html=isc.JSDoc.hoverHTML(docs[i]);
                delete isc.DocUtils.suppressOnClick;
                var docCanvas=isc.Canvas.create({
                    autoDraw:false,
                    styleName:"docHover",
                    contents:html
                });
                members.add(docCanvas);
            }
        }
        var layout=isc.VLayout.create({
            top:-9999,
            width:600,
            overflow:"visible",
            membersMargin:10,
            padding:10,
            members:members
        });
        if(layout.getVisibleHeight()>600){
            layout.setOverflow("auto");
            layout.setHeight(600);
        }
        isc.Window.create({
            title:"More information",
            autoSize:true,
            autoCenter:true,
            isModal:true,
            dismissOnEscape:true,
            canDragReposition:true,
            canDragResize:true,
            maxWidth:600,
            showMinimizeButton:false,
            items:[
                layout
            ]
        });
    }
};
isc.A.editorPaneDefaults={
    _constructor:"TTabSet",
    autoDraw:false,
    paneMargin:0,
    paneContainerProperties:{customEdges:["T"],overflow:"hidden"},
    tabBarProperties:{baseLineCapSize:0},
    tabBarControls:[
        isc.Img.create({
            src:"actions/rotate.png",
            autoDraw:false,
            width:16,height:16,
            layoutAlign:"center",
            cursor:"pointer",
            showRollOver:true,
            canHover:true,showHover:true,
            hoverWrap:false,
            hoverAutoFitWidth:false,
            hoverStyle:"darkHover",
            click:function(){
                var selected=isc.SelectionOutline.getSelectedObject();
                if(selected&&selected.editContext){
                    selected.editContext.changeOrientationOfNode(selected.editNode);
                }
            }
        }),
        isc.Img.create({
            src:"[SKIN]/../../ToolSkin/images/actions/remove.png",
            autoDraw:false,
            width:16,height:16,
            layoutAlign:"center",
            cursor:"pointer",
            canHover:true,showHover:true,
            hoverWrap:false,
            hoverAutoFitWidth:false,
            hoverStyle:"darkHover",
            prompt:"Remove current component",
            click:function(){
                var selected=isc.SelectionOutline.getSelectedObject();
                if(selected&&selected.editContext){
                    selected.editContext.destroyNode(selected.editNode);
                }
            }
        }),
        isc.LayoutSpacer.create({width:10}),
        "tabScroller","tabPicker"
    ],
    tabDeselected:function(tabNum,tabPane,ID,tab){
        this._fromEditor=tabPane.ID;
    },
    tabSelected:function(tabNum,tabPane,ID,tab){
        if(!this._fromEditor)return;
        var component=this.creator.getCurrentComponent(),
            fromBasic=component?component[this._fromEditor+"BasicMode"]:null,
            toBasic=component?component[tabPane.ID+"BasicMode"]:null;
        if(fromBasic!=toBasic){
            this.creator.editComponent(component,component.liveObject);
        }else{
            this.creator.applyBasicModeSettings(component);
        }
    },
    selectedEditorName:function(){
        var tab=this.getTabObject(this.selectedTab);
        if(tab&&tab.title)return tab.title.toLowerCase();
        return null;
    },
    PROPERTIES:"properties",
    EVENTS:"events"
};
isc.A.applyButtonDefaults={
    _constructor:"TButton",
    resizeable:false,
    autoDraw:false,
    title:"Apply",
    click:"this.creator.saveComponentEditors();",
    disabled:true,
    width:75
};
isc.A.advancedButtonDefaults={
    _constructor:"TButton",
    resizeable:false,
    autoDraw:false,
    click:function(){
        var component=this.creator.getCurrentComponent();
        if(this.creator._attributeFilter!=null){
            this.creator.clearComponentAttributeFilter(component);
        }else{
            this.creator.toggleBasicMode(component);
        }
        this.creator._editComponent(component,component.liveObject);
    },
    disabled:true,
    width:75
};
isc.A.helpPaneDefaults={
    _constructor:"THTMLFlow",
    padding:10,
    autoDraw:false,
    overflow:"auto"
};
isc.A.projectPaneDefaults={
    _constructor:"TTabSet",
    paneMargin:0,
    autoDraw:false
};
isc.A.recentProjectsMenuDefaults={
    _constructor:"Menu",
    width:100,
    itemClick:function(item){
        var creator=this.creator;
        creator.confirmSaveProject(function(){
            creator.loadProject(item.projectFileName,item.projectOwnerId);
        });
    },
    setDynamicItems:function(){
        var items=this.data,
            currentProject=this.creator.project&&this.creator.project.fileName;
        if(currentProject!=null&&items!=null){
            for(var i=0;i<items.length;i++){
                var item=items[i];
                this._setItemChecked(i,(item.projectFileName==currentProject));
            }
        }
         return this.Super("setDynamicItems",arguments);
    }
};
isc.A.existingDeploymentsMenuConstructor="Menu";
isc.A.existingDeploymentsMenuDefaults={
    minFieldWidth:1,
    canHover:true,
    cellHoverHTML:function(record,rowNum,colNum){
        var deploymentRecord=record.record;
        if(deploymentRecord&&deploymentRecord.fileLastModified){
            return"<u>Last deployed:</u><br><br><nobr>"+deploymentRecord.fileLastModified+"</nobr>";
        }
        return null;
    },
    fields:[{
        name:"title",autoFitWidth:true
    },{
        name:"actions",width:1
    }],
    actionButtonsConstructor:"HLayout",
    actionButtonsDefaults:{
        layoutMargin:5,
        membersMargin:5,
        defaultLayoutAlign:"center",
        height:"100%"
    },
    redeployButtonTitle:"Redeploy",
    redeployButtonConstructor:"Button",
    redeployButtonDefaults:{
        width:80,
        click:function(){
            var menu=this.creator,
                builder=menu.creator;
            builder.showDeploymentWindow(menu.getEventDeploymentRecord());
        }
    },
    manageButtonTitle:"Manage",
    manageButtonConstructor:"Button",
    manageButtonDefaults:{
        width:80,
        click:function(){
            var menu=this.creator,
                builder=menu.creator;
            builder.manageDeployment(menu.getEventDeploymentRecord());
            isc.Menu.hideAllMenus();
        }
    },
    visitButtonTitle:"Visit",
    visitButtonConstructor:"Button",
    visitButtonDefaults:{
        width:80,
        click:function(){
            var record=this.creator.getEventDeploymentRecord();
            window.open(isc.DeploymentEditor.getDeploymentURL(record.fileName,
                                                              record.fileType));
            isc.Menu.hideAllMenus();
        }
    },
    getEventDeploymentRecord:function(){
        var item=this.getRecord(this.getEventRow());
        return item?item.record:null;
    },
    maxDeploymentLength:5,
    setData:function(data,b,c,d){
        data.setSort([{property:"fileLastModified",direction:"descending"}]);
        var items=[],
            builder=this.creator,
            maxLength=this.maxDeploymentLength;
        for(var i=0;i<data.length&&i<maxLength;i++){
            var menuItem={
                record:data[i],
                title:isc.DeploymentEditor.getDeploymentTitle(data[i]),
                embeddedComponentFields:["actions"],
                embeddedComponent:this.createAutoChild("actionButtons",{
                    members:[
                        this.createAutoChild("redeployButton",{
                            title:this.redeployButtonTitle
                        }),
                        this.createAutoChild("visitButton",{
                            title:this.visitButtonTitle
                        }),
                        this.createAutoChild("manageButton",{
                            title:this.manageButtonTitle
                        })
                    ]
                })
            };
            items.add(menuItem);
        }
        if(data.length>maxLength){
            items.add({
                title:"See all...",
                click:function(){
                    builder.showDeploymentsWindow();
                    return false;
                }
            });
        }
        this.invokeSuper(null,"setData",items,b,c,d);
    },
    initWidget:function(){
        this.Super("initWidget",arguments);
        this.observe(this.dataSource,"dataChanged",
                     "observer.setData(observed.getCacheData())");
    },
    itemClick:function(item){
        var builder=this.creator;
        builder.manageDeployment(item.record);
        isc.Menu.hideAllMenus();
    }
};
isc.A.screenMenuButtonDefaults={
    _constructor:"TMenuButton",
    autoDraw:false,
    title:"Screen",
    width:80
};
isc.A.removeButtonDefaults={
    _constructor:"ImgButton",
    autoDraw:false,
    src:"[SKIN]/../../ToolSkin/images/actions/remove.png",
    width:16,height:16,
    showRollOver:false,
    showDown:false,
    prompt:"Remove",
    hoverStyle:"darkHover",
    visibility:"hidden",
    click:function(){
        var editContext=this.creator.projectComponents.getEditContext(),
            selection=editContext.getSelectedEditNodes()
        ;
        for(var i=0;i<selection.length;i++){
            editContext.destroyNode(selection[i]);
        }
    }
};
isc.A.bringToFrontButtonDefaults={
    _constructor:"TButton",
    autoDraw:false,
    title:"Bring to front",
    height:20,
    width:80,
    visibility:"hidden",
    click:function(){
        var editContext=this.creator.projectComponents.getEditContext(),
            selection=editContext.getSelectedEditNodes()
        ;
        for(var i=0;i<selection.length;i++){
            selection[i].liveObject.bringToFront();
        }
    }
};
isc.A.sendToBackButtonDefaults={
    _constructor:"TButton",
    autoDraw:false,
    title:"Send to back",
    height:20,
    width:80,
    visibility:"hidden",
    click:function(){
        var editContext=this.creator.projectComponents.getEditContext(),
            selection=editContext.getSelectedEditNodes()
        ;
        for(var i=0;i<selection.length;i++){
            selection[i].liveObject.sendToBack();
        }
    }
};
isc.A.operationsPaletteDefaults={
    _constructor:isc.TTreePalette,
    getIcon:function(node){
        var icon=this.creator.getServiceElementIcon(node);
        if(icon)return icon;
        return this.Super("getIcon",arguments);
    }
};
isc.A.schemaViewerDefaults={
    _constructor:isc.TTreeGrid,
    autoDraw:false,
    recordDoubleClick:"this.creator.operationSelected()",
    fields:[
        {name:"name",title:"Service/PortType/Operation",treeField:true},
        {name:"serviceType",title:"Type"}
    ],
    getIcon:function(node){
        var icon=this.creator.getServiceElementIcon(node);
        if(icon)return icon;
        return this.Super("getIcon",arguments);
   }
};
isc.A.schemaViewerSelectButtonDefaults={
    _constructor:isc.TButton,
    autoDraw:false,
    title:"Select",
    click:"this.creator.operationSelected()"
};
isc.A.commonEditorFunctions={
    itemChange:function(item,value,oldValue){
        this.logInfo("itemChange on: "+item+", value now: "+value,"editing");
        if(item.name=="classSwitcher"){
            this.builder.switchComponentClass(value);
            return true;
        }
        if(item.name=="type"){
            var listGridFieldDS=isc.DataSource.get("ListGridField"),
                formItemDS=isc.DataSource.get("FormItem"),
                currentDS=this.dataSource,
                mustUpdateItems=false;
            if(listGridFieldDS||formItemDS){
                while(currentDS!=null){
                    if(currentDS==listGridFieldDS||currentDS==formItemDS){
                        mustUpdateItems=true;
                        break;
                    }
                    currentDS=(currentDS.inheritsFrom?isc.DS.get(currentDS.inheritsFrom):null);
                }
            }
            if(mustUpdateItems){
                this.saveItem(item,value);
                this.editComponent(this.currentComponent,this.currentComponent.liveObject);
            }
        }
        if(this.immediateSave){
            if(this.canImmediateSaveItem(item,value)){
                this.saveItem(item,value);
            }else{
                item._changed=true;
            }
            return true;
        }else{
            if(
                isc.isA.ExpressionItem(item)||
                isc.isA.CheckboxItem(item)||
                isc.isA.CriteriaItem(item)||
                isc.isA.FormulaEditorItem(item)||
                isc.isA.SummaryEditorItem(item)||
                isc.isA.ExpressionEditorItem(item)||
                (isc.isA.DynamicPropertyEditorItem(item)&&isc.isA.DynamicProperty(value)))
            {
                this.saveItem(item,value);
            }else{
                item._changed=true;
            }
            return true;
        }
    },
    implicitSaveOnBlur:true,
    performImplicitSave:function(item,onPause){
        if(onPause)return;
        if(this.immediateSave&&item._changed&&
            !this.canImmediateSaveItem(item)&&
            item.validate())
        {
            var value=this.getValue(item.name);
            if(value!=null){
                this.saveItem(item,value);
            }
        }
    },
    canImmediateSaveItem:function(item,value){
        if(!this.currentComponent)return false;
        var editNode=this.currentComponent,
            targetObject=editNode.liveObject||
                this.builder.projectComponents.getLiveObject(editNode)
        ;
        if(
            isc.isA.ExpressionItem(item)||
            isc.isA.CheckboxItem(item)||
            isc.isA.CriteriaItem(item)||
            isc.isA.FormulaEditorItem(item)||
            isc.isA.SummaryEditorItem(item)||
            isc.isA.ExpressionEditorItem(item)||
            (isc.isA.DynamicPropertyEditorItem(item)&&isc.isA.DynamicProperty(value)))
        {
            return true;
        }
        if(isc.isA.FormItem(targetObject)){
            if(item.name=="name"||item.name=="title")return false;
            if(isc.isA.HeaderItem(targetObject)&&item.name=="defaultValue")return false;
        }else if(targetObject._constructor&&
            (targetObject._constructor=="ListGridField"||
                targetObject._constructor=="TreeGridField"||
                targetObject._constructor=="TileGridField"||
                targetObject._constructor=="DetailViewerField"))
        {
            if(item.name=="name"||item.name=="title")return false;
        }else if(item.name=="ID"||item.name=="title"){
            return false;
        }
        return true;
    },
    itemKeyPress:function(item,keyName){
        if(keyName=="Enter"&&(!this.immediateSave||!this.canImmediateSaveItem(item))){
            this.save();
        }
    },
    saveItem:function(item,value){
        return this.saveItems([item],[value]);
    },
    save:function(){
        if(!this.validate())return;
        var changedItems=[],
            values=[]
        ;
        for(var i=0;i<this.items.length;i++){
            var item=this.items[i];
            if(item._changed){
                changedItems.add(item);
                values.add(this.getValue(item.name));
                item._changed=false;
            }
        }
        var result=this.saveItems(changedItems,values);
        return result;
    },
    saveItems:function(items,values){
        if(!items||items.length==0)return true;
        var editNode=this.currentComponent,
            properties={}
        ;
        for(var i=0;i<items.length;i++){
            var item=items[i],
                value=values[i]
            ;
            properties[item.name]=value;
        }
        return this.saveProperties(properties,editNode);
    },
    saveProperties:function(properties,editNode){
        if(!editNode)return;
        var targetObject=editNode.liveObject||
                           this.builder.projectComponents.getLiveObject(editNode);
        this.logInfo("applying changed properties: "+this.echo(properties)+
                     " to: "+this.echoLeaf(targetObject),"editing");
        var component=targetObject,
            ruleScopeChange,
            undef;
        if(isc.isA.FormItem(targetObject)||(targetObject._constructor&&targetObject._constructor=="ListGridField")){
            if(properties["name"]!=undef){
                ruleScopeChange={property:"name",oldValue:targetObject.name,newValue:properties.name};
            }
            if(isc.isA.FormItem(targetObject)){
                component=targetObject.form;
            }else{
                var editNodeTree=this.builder.projectComponents.getEditContext().getEditNodeTree(),
                    parentNode=editNodeTree.getParent(editNode)
                ;
                component=parentNode.liveObject;
            }
        }else if(properties["ID"]!=undef){
            ruleScopeChange={property:"ID",oldValue:targetObject.ID,newValue:properties.ID};
        }
        var ctx=targetObject.editContext,
            tree=this.builder.projectComponents.getEditNodeTree(),
            children=tree.getChildren(editNode),
            selection=this.builder.projectComponents.getSelectedRecords(),
            propertiesToRemove=[]
        ;
        if(!ctx)return;
        ctx.savingComponentProperties=true;
        ctx._updatingDynamicProperties=true;
        for(var i=0;i<children.length;i++){
            var node=children[i],
                liveObject=node.liveObject
            ;
            if(node.type=="DynamicProperty"){
                var propertyValue=properties[liveObject.name];
                if(propertyValue&&!isc.isA.DynamicProperty(propertyValue)){
                    targetObject.clearDynamicProperty(liveObject.name);
                    ctx.removeNode(node,true);
                }
            }
        }
        for(var key in properties){
            var value=properties[key];
            if(value!=null&&isc.isA.DynamicProperty(value)){
                var props=value.getUniqueProperties(),
                    editFields=ctx.getEditFieldsList(value),
                    foundNode=false
                ;
                props=isc.applyMask(props,editFields);
                for(var i=0;i<children.length;i++){
                    var node=children[i],
                        liveObject=node.liveObject
                    ;
                    if(node.type=="DynamicProperty"&&liveObject.name==key){
                        ctx.removeNodeProperties(editNode,key);
                        ctx.removeNodeProperties(node,["dataPath","formula","textFormula"]);
                        ctx.setNodeProperties(node,props);
                        propertiesToRemove.add(key);
                        foundNode=true;
                        break;
                    }
                }
                if(!foundNode){
                    var paletteNode=isc.addProperties({
                        type:"DynamicProperty",defaults:props,name:props.name
                    },ctx.findPaletteNode("type","DynamicProperty"));
                    var node=ctx.makeEditNode(paletteNode);
                    ctx.addNode(node,editNode,null,"dynamicProperties");
                    ctx.removeNodeProperties(editNode,key);
                    propertiesToRemove.add(key);
                }
            }
        }
        if(propertiesToRemove.length>0){
            for(var i=0;i<propertiesToRemove.length;i++){
                delete properties[propertiesToRemove[i]];
            }
        }
        if(propertiesToRemove.length>0){
            this.builder.projectComponents.deselectAllRecords();
            this.builder.projectComponents.selectRecords(selection);
        }
        delete ctx._updatingDynamicProperties;
        this.builder.projectComponents.setNodeProperties(editNode,properties);
        ctx.savingComponentProperties=false;
        this.builder.updateComponentPropertiesSectionTitle(targetObject);
        var editor=this.builder.getCurrentlyVisibleEditor(),
            basicMode=editNode[editor.ID+"BasicMode"];
        if(basicMode==false){
            editNode._notSwitchable=true;
        }
        if(ruleScopeChange){
            this.builder.notifyIDOrFieldNameChange(component,ruleScopeChange.property,ruleScopeChange.oldValue,ruleScopeChange.newValue);
        }
        return true;
    }
};
isc.A._cachedTypeFieldnames={};
isc.A.rootComponentDefaults={
    _constructor:"Canvas",
    overflow:"hidden",
    getObjectField:function(type){
        var mockupMode=this.creator.getScreenMockupMode(this.creator.currentScreen);
        if(!mockupMode)return this.Super("getObjectField",arguments);
        var classObject=isc.ClassFactory.getClass(type);
        if(isc.isA.Canvas(classObject)){
            return"children";
        }else{
            return null;
        }
    },
    visibilityChanged:function(isVisible){
        if(isVisible&&this._showInstructions){
            this.creator.showInstructions();
            delete this._showInstructions;
        }
    },
    editProxyDefaults:{
        dropOut:function(){
            var result=this.Super("dropOut",arguments);
            var outlineTarget=isc.SelectionOutline.getSelectedObject();
            if(outlineTarget&&outlineTarget.editProxy){
                outlineTarget.editProxy.showSelectedAppearance(false);
            }
            return result;
        }
    }
};
isc.A.librarySearchDefaults={
    _constructor:"DynamicForm",
    autoDraw:false,
    height:35,
    numCols:1,
    cellPadding:0,
    selectOnFocus:true,
    searchDefaults:{
        name:"search",
        editorType:"TextItem",
        height:"*",
        width:"*",
        showTitle:false,
        hint:"Search...",showHintInField:true,
        suppressBrowserClearIcon:true,
        icons:[{
            name:"go",
            src:"search.png",
            hspace:5,
            inline:true,
            showRTL:true,
            click:function(form,item,icon){
                form.search();
            }
        },{
            name:"clear",
            src:"actions/clear.png",
            height:12,width:12,
            inline:true,
            prompt:"Clear search",
            click:function(form,item,icon){
                form.clearSearch();
                item.focusInItem();
            }
        }],
        iconWidth:16,
        iconHeight:16,
        keyPress:function(item,form,keyName){
            if(keyName=="Enter"){
                form.search();
                return false;
            }
            if(keyName=="Escape"){
                form.clearSearch();
                return false;
            }
            this.fireOnPause("paletteSearch",{
                target:form,
                methodName:"search"
            },
            300);
        }
    },
    initWidget:function(){
        this.fields=[isc.addProperties({},this.searchDefaults,this.searchProperties)];
        this.Super("initWidget",arguments);
    },
    clearSearch:function(skipRefresh){
        this.clearValue("search");
        if(this._lastSearchValue!=null){
            this._lastSearchValue=null;
            if(!skipRefresh)this._search();
        }
        this.creator.librarySearchClear.hide();
    },
    isSearching:function(){
        return(this._lastSearchValue!=null);
    },
    search:function(){
        var value=this.getValue("search");
        if(value==this._lastSearchValue)return;
        if(value==null||value==""){
            this.clearSearch();
            return;
        }
        this.creator._addUsageRecord("paletteSearch",value);
        this._search(value);
    },
    _search:function(value){
        this.creator.refreshLibraryComponents(null,true,value);
        this._lastSearchValue=value;
        this.creator.librarySearchClear.show();
    },
    addNode:function(node){
        var mockupMode=this.creator.getScreenMockupMode(this.creator.currentScreen),
            nodeType=node.type||node.className,
            clazz=isc.ClassFactory.getClass(nodeType),
            projectComponents=this.creator.projectComponents,
            editContext=projectComponents.getEditContext(),
            editNode=editContext.makeEditNode(node),
            parentNode=this.creator.projectComponents.getDefaultParent(editNode,true)
        ;
        if(!parentNode){
            var message="No applicable parent component was found for the new component";
            if(!projectComponents.getSelectedRecord()){
                message="No parent component was selected for the new component";
            }
            isc.Notify.addMessage(message);
            return;
        }
        editNode.dropped=true;
        if(!isc.isA.DynamicForm(parentNode.liveObject)&&clazz&&clazz.isA("FormItem")){
            editNode=editContext.addWithWrapper(editNode,parentNode);
        }else{
            editNode=editContext.addNode(editNode,parentNode);
        }
        if(mockupMode)editNode.liveObject.moveTo(20,20);
    }
};
isc.A.librarySearchClearDefaults={
    _constructor:"Label",
    autoDraw:false,
    height:25,
    width:"100%",
    align:"right",
    wrap:false,
    contents:"Clear filter/show all components",
    styleName:"searchStatusBar",
    cursor:"pointer",
    click:function(){
        this.creator.librarySearch.clearSearch();
    }
};
isc.A.projectComponentsSearchDefaults={
    _constructor:"GridSearch",
    searchProperty:"ID",
    hint:"Find Live Component By ID..."
};
isc.A.dataSourceListSearchDefaults={
    _constructor:"GridSearch",
    searchProperty:"title",
    hint:"Find DataSource...",
    autoParent:"dataSourcePane"
};
isc.A.dataSourcePaneDefaults={
    _constructor:"VLayout",
    height:225
};
isc.A.screenPaneDefaults={
    _constructor:"VLayout"
};
isc.A.deploymentWindowConstructor="Window";
isc.A.deploymentWindowDefaults={
    autoCenter:true,
    isModal:true,
    showModalMask:true,
    showMinimizeButton:false,
    title:"New Deployment",
    visibility:"hidden",
    width:700,
    height:500
};
isc.A.deploymentEditorConstructor="DeploymentEditor";
isc.A.deploymentEditorDefaults={
    width:"100%",membersMargin:5,margin:5
};
isc.A.deploymentsWindowConstructor="Window";
isc.A.deploymentsWindowDefaults={
    title:"Pick a Deployment to Manage",
    showMinimizeButton:false,
    showModalMask:true,
    visibility:"hidden",
    autoCenter:true,
    isModal:true,
    width:500,
    height:400
};
isc.A.deploymentsManagerConstructor="DeploymentManagerLauncher";
isc.A.deploymentsManagerDefaults={
    width:"100%",membersMargin:5,margin:5
};
isc.A.superUserHelpText="A superuser is treated as having access to all roles.";
isc.A.editSampleUsersWindowConstructor="Window";
isc.A.editSampleUsersWindowDefaults={
    isModal:true,
    autoCenter:true,
    showMinimizeButton:false,
    width:"80%",
    autoSize:true,
    getBodyBreadthPolicy:function(){
        return"fill";
    },
    showModalMask:true,
    title:"Edit Test Users",
    initWidget:function(){
        var builder=this.creator;
        var _window=this;
        this.info=isc.Label.create({
            padding:5,
            contents:"Edit test users and roles below.<P>"+
                    "You can switch users while designing screens to try out role-based rules, "+
                    "and test users can also be used with test deployments."
        });
        var currentUser=isc.Auth.getCurrentUser();
        this.currentUserSelector=isc.DynamicForm.create({
            items:[
                {editorType:"SelectItem",name:"user",title:"Current User",
                    value:currentUser?currentUser.userId:null,
                    getValueMap:function(){
                        if(_window.editGrid==null)return;
                        var map={};
                        for(var i=0;i<_window.editGrid.getTotalRows();i++){
                            if(_window.editGrid.recordMarkedAsRemoved(i))continue;
                            var sampleUser=_window.editGrid.getEditedRecord(i);
                            map[sampleUser.userId]=(sampleUser.firstName+" "+sampleUser.lastName);
                        }
                        return map;
                    }
                }
            ]
        });
        var superUserHelpText=this.creator.superUserHelpText;
        var emailValidators=isc.Validator.getStandardEmailValidators();
        emailValidators.add(
            {
                type:"custom",
                errorMessage:"User email must be unique",
                condition:function(item,validator,value,record,additionalContext){
                    var grid=additionalContext.component,
                        rowNum=additionalContext.rowNum;
                    for(var i=0;i<grid.getTotalRows();i++){
                        if(rowNum==i)continue;
                        if(grid.getEditedRecord(i).email==value){
                            return false;
                        }
                    }
                    return true;
                }
            }
        );
        var editGrid=this.editGrid=isc.ListGrid.create({
            autoFetchData:false,
            dataSource:isc.Auth.getUserSchema(),
            showHeaderMenuButton:false,
            selectionType:"none",
            showRollOver:false,
            canEdit:true,
            editEvent:"click",
            stopOnErrors:true,
            modalEditing:true,
            listEndEditAction:"next",
            saveLocally:true,
            autoSaveEdits:false,
            autoFitData:"vertical",
            autoFitMaxHeight:200,
            canRemoveRecords:true,
            removeRecordClick:function(rowNum,colNum){
                if(!this.recordMarkedAsRemoved(rowNum)){
                    var recordCount=0;
                    for(var i=0;i<this.getTotalRows();i++){
                        if(this.recordMarkedAsRemoved(i))continue;
                        recordCount++;
                    }
                    if(recordCount<2)return;
                }
                var user=this.getEditedRecord(rowNum);
                var userPicker=_window.currentUserSelector.getItem("user");
                var removedCurrentUser=false;
                if(userPicker.getValue()==user.userId){
                    removedCurrentUser=true;
                }
                this.Super("removeRecordClick",arguments);
                if(removedCurrentUser){
                    userPicker.setValue(this.data.get(0).userId);
                }
                userPicker.updateValueMap();
            },
            canEditCell:function(rowNum,colNum){
                if(colNum==0)return(this.data.get(rowNum)==null);
                return this.Super("canEditCell",arguments);
            },
            useAllDataSourceFields:true,
            fields:[
                {name:"userId",required:true,
                    validators:[{
                        type:"custom",
                        errorMessage:"User ID must be unique",
                        condition:function(item,validator,value,record,additionalContext){
                            var grid=additionalContext.component,
                                rowNum=additionalContext.rowNum;
                            for(var i=0;i<grid.getTotalRows();i++){
                                if(rowNum==i)continue;
                                if(grid.getEditedRecord(i).userId==value){
                                    return false;
                                }
                            }
                            return true;
                        }
                    }],
                    change:function(form,item,value,oldValue){
                        var userPicker=_window.currentUserSelector.getItem("user");
                        if(userPicker.getValue()==oldValue){
                            userPicker.setValue(value);
                        }
                    },
                    changed:function(form,item,value){
                        var userPicker=_window.currentUserSelector.getItem("user");
                        userPicker.updateValueMap();
                    }
                },
                {name:"email",required:true,validators:emailValidators},
                {
                    name:"firstName",required:true,changed:function(form,item,value){
                        var userPicker=_window.currentUserSelector.getItem("user");
                        userPicker.updateValueMap();
                    }
                },
                {
                    name:"lastName",required:true,changed:function(form,item,value){
                        var userPicker=_window.currentUserSelector.getItem("user");
                        userPicker.updateValueMap();
                    }
                },
                {
                    name:"superUser",
                    icon:"[SKINIMG]actions/help.png",
                    padding:5,
                    getFieldTitle:function(){
                        return"<span style='padding-left:5px;'>"+this.title+"</span>";
                    },
                    iconClick:function(){
                        isc.say(superUserHelpText);
                        return false;
                    },
                    prompt:superUserHelpText
                },
                {
                    name:"roles",
                    getEditorValueMap:function(){
                        return isc.Auth.getAvailableRoles();
                    }
                }
            ]
        });
        this.addNewButton=isc.Button.create({
            title:"Add New",
            click:function(){
                editGrid.startEditingNew();
            }
        });
        this.saveButton=isc.Button.create({
            title:"Save",
            click:function(){
                var grid=_window.editGrid,
                    stopOnError=false;
                if(grid.hasErrors()){
                    var rows=grid.getAllEditRows();
                    for(var i=0;i<rows.length;i++){
                        if(!grid.recordMarkedAsRemoved(rows[i])&&grid.rowHasErrors(rows[i])){
                            stopOnError=true;
                            break;
                        }
                    }
                }
                if(stopOnError){
                    isc.warn("Test User data did not pass validation");
                    return;
                }
                grid.saveAllEdits();
                builder.updateSampleUsers(grid.getData(),true);
                builder.updateCurrentUser({userId:_window.currentUserSelector.getValue("user")});
                _window.hide();
            }
        });
        this.cancelButton=isc.Button.create({
            title:"Cancel",
            click:function(){
                _window.hide();
            }
        });
        this.items=[
            this.info,
            this.currentUserSelector,
            isc.VStack.create({
                height:"*",
                membersMargin:5,
                layoutMargin:10,
                defaultLayoutAlign:"right",
                members:[
                    this.editGrid,
                    this.addNewButton
                ]
            }),
            isc.HLayout.create({
                height:30,
                align:"center",
                membersMargin:5,
                members:[
                    this.saveButton,
                    this.cancelButton
                ]
            })
        ];
        return this.Super("initWidget",arguments);
    },
    show:function(){
        var project=this.creator.project,
            auth=project&&project.authentication,
            sampleUsers=auth&&auth.users;
        if(sampleUsers==null)sampleUsers=[];
        this.editGrid.setData(sampleUsers.duplicate());
        this.currentUserSelector.setValue("user",auth.lastSelectedUser);
        return this.Super("show",arguments);
    }
};
isc.A.editSampleRolesWindowConstructor="Window";
isc.A.editSampleRolesWindowDefaults={
    isModal:true,
    showMinimizeButton:false,
    autoCenter:true,
    width:"80%",
    autoSize:true,
    getBodyBreadthPolicy:function(){
        return"fill";
    },
    showModalMask:true,
    title:"Edit Roles",
    description:"Define the available roles below.  Once these roles have been defined, "+
                "you can use them to control whether controls are visible or enabled, whether "+
                "fields can be edited by the current user, and more.",
    blurbConstructor:"Label",
    blurbDefaults:{
        padding:10,
        height:10
    },
    roleGridConstructor:"ListGrid",
    roleGridDefaults:{
        autoFetchData:true,
        selectionType:"none",
        showRollOver:false,
        canEdit:true,
        editEvent:"click",
        stopOnErrors:true,
        modalEditing:true,
        listEndEditAction:"next",
        autoSaveEdits:false,
        autoFitData:"vertical",
        autoFitMaxHeight:200,
        canRemoveRecords:true,
        useAllDataSourceFields:true,
        fields:[
            {name:"name",required:true,
                validators:[
                    {
                        type:"custom",
                        errorMessage:"Role name must be unique",
                        condition:function(item,validator,value,record,additionalContext){
                            var grid=additionalContext.component,
                                rowNum=additionalContext.rowNum;
                            for(var i=0;i<grid.getTotalRows();i++){
                                if(rowNum==i)continue;
                                if(grid.getEditedRecord(i).name==value){
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    {
                        type:"custom",
                        errorMessage:'The string "*super*" cannot be used as a role-name. '+
                            'It is reserved for super-users. See documentation for '+
                            'dataSourceField.editRequiresRole for details.',
                        condition:function(item,validator,value){
                            if(value=="*super*")return false;
                            return true;
                        }
                    }
                ]
            }
        ]
    },
    addNewButtonConstructor:"Button",
    addNewButtonDefaults:{
        title:"Add New",
        click:function(){
            this.creator.roleGrid.startEditingNew();
        }
    },
    saveButtonConstructor:"Button",
    saveButtonDefaults:{
        title:"Save",
        click:function(){
            var grid=this.creator.roleGrid,
                stopOnError=false;
            if(grid.hasErrors()){
                var rows=grid.getAllEditRows();
                for(var i=0;i<rows.length;i++){
                    if(!grid.recordMarkedAsRemoved(rows[i])&&grid.rowHasErrors(rows[i])){
                        stopOnError=true;
                        break;
                    }
                }
            }
            if(stopOnError){
                isc.warn("Role data did not pass validation");
            }else if(!grid.hasChanges()){
                this.creator.hide();
            }else{
                grid.saveAllEdits(null,{target:this.creator,methodName:"updateSampleRoles"});
            }
        }
    },
    updateSampleRoles:function(){
        this.creator.updateSampleRolesFromDS();
        this.hide();
    },
    cancelButtonConstructor:"Button",
    cancelButtonDefaults:{
        title:"Cancel",
        click:function(){
            this.creator.hide();
        }
    },
    initWidget:function(){
        this.blurb=this.createAutoChild("blurb",{
            contents:this.description
        });
        this.roleGrid=this.createAutoChild("roleGrid",{
            dataSource:this.creator.roleDS
        });
        this.addNewButton=this.createAutoChild("addNewButton");
        this.saveButton=this.createAutoChild("saveButton");
        this.cancelButton=this.createAutoChild("cancelButton");
        this.items=[
            this.blurb,
            isc.VStack.create({
                height:"*",
                membersMargin:5,
                layoutMargin:10,
                defaultLayoutAlign:"right",
                members:[
                    this.roleGrid,this.addNewButton
                ]
            }),
            isc.HLayout.create({
                height:30,
                align:"center",
                membersMargin:5,
                members:[
                    this.saveButton,
                    this.cancelButton
                ]
            })
        ];
        return this.Super("initWidget",arguments);
    }
};
isc.A.runConfigFormDefaults={
    _constructor:isc.DynamicForm,
    autoDraw:false,
    width:650,
    height:"100%",
    colWidths:[100,"*"],
    wrapItemTitles:false,
    setSkin:function(skin){
        var density=this.creator.getDefaultDensity(skin);
        if(!density){
            density=this.creator.getDefaultDensity("default");
        }
        this.setValue("density",density);
    }
};
isc.A.runConfigSkinFieldDefaults={
    name:"skin",editorType:"TSelectItem",title:"Skin",width:280,
    changed:function(form,item,value){
        form.setSkin(value);
    }
};
isc.A.runConfigDensityFieldDefaults={
    name:"density",editorType:"TSelectItem",title:"Density",width:280,
    valueMap:{
        "dense":"Dense",
        "compact":"Compact",
        "medium":"Medium",
        "expanded":"Expanded",
        "spacious":"Spacious"
    }
};
isc.A.runConfigDeviceFieldDefaults={
    name:"device",editorType:"TSelectItem",title:"Device",width:280,
    defaultToFirstOption:true,
    valueMap:{
        "auto":"Auto-detect",
        "desktop":"Desktop",
        "tablet":"Tablet",
        "handset":"Phone"
    },
    valueIcons:{
        "auto":"",
        "desktop":"desktop.png",
        "tablet":"tablet.png",
        "handset":"smartphone.png"
    }
};
isc.A.runConfigUserIdFieldDefaults={
    name:"userId",editorType:"TSelectItem",title:"User",width:280,
    allowEmptyValue:true,
    addUnknownValues:false
};
isc.A._deviceRecords=[
    {value:"auto",title:"Auto-detect"},
    {value:"desktop",title:"Desktop",icon:"desktop.png"},
    {value:"tablet",title:"Tablet",icon:"tablet.png"},
    {value:"handset",title:"Phone",icon:"smartphone.png"}
];
isc.A._skinDefaultDensity={
    Tahoe:"spacious",
    Obsidian:"spacious",
    Stratus:"spacious",
    "default":"compact"
};
isc.A.updateAccountWindowConstructor="Window";
isc.A.updateAccountWindowDefaults={
    width:850,autoSize:true,
    isModal:true,showModalMask:true,
    autoCenter:true,
    showMinimizeButton:false,
    title:"Update Account",
    visibility:"hidden",
    bodyProperties:{
        layoutMargin:10
    },
    hide:function(){
        var editor=this.creator.updateAccountEditor;
        if(editor)editor.clearValues();
        this.Super("hide",arguments);
    }
};
isc.A.updateAccountEditorConstructor="UpdateAccountEditor";
isc.A.updateAccountEditorDefaults={
    width:"100%"
};
isc.A.manageUsersWindowConstructor="Window";
isc.A.manageUsersWindowDefaults={
    width:600,height:400,
    autoCenter:true,
    isModal:true,
    showModalMask:true,
    showMinimizeButton:false,
    title:"Manage Users",
    visibility:"hidden"
};
isc.A.manageUsersPanelConstructor="ManageUsersPanel";
isc.A.manageUsersPanelDefaults={
    width:"100%"
};
isc.A.instructionsPaneDefaults={
    _constructor:"VLayout",
    autoDraw:false,
    textDefaults:{
        _constructor:"Canvas",
        autoDraw:false,
        width:"100%",
        height:140,
        padding:20,
        contents:"Drag and drop components from<br>the library to create your screen.",
        styleName:"instructionsPane"
    },
    imageDefaults:{
        _constructor:"Img",
        autoDraw:false,
        src:"newScreenInstructions.png",
        layoutAlign:"center",
        overflow:"hidden",
        maxWidth:330,
        maxHeight:232,
        redrawOnResize:true,
        imageType:"center",
        getInnerHTML:function(){
            if(this._imageRatio==null){
                this._imageRatio=this.maxHeight/this.maxWidth;
            }
            var width=this.width,
                height=this.height,
                targetWidth=width,
                targetHeight=Math.floor(width*this._imageRatio);
            if(targetHeight>height){
                targetHeight=height;
                targetWidth=Math.floor(height/this._imageRatio);
            }
            this.imageWidth=targetWidth;
            this.imageHeight=targetHeight;
            return this.Super("getInnerHTML",arguments);
        }
    },
    init:function(){
        this.Super("init",arguments);
        this.addAutoChild("text");
        this.addAutoChild("image");
    },
    _resizeWithMaster:false,
    _fitToMaster:function(){
        var master=this.masterElement,
            rect=master.getRect();
        rect[0]+=master.getLeftBorderSize()+master.getLeftMargin();
        rect[1]+=master.getTopBorderSize()+master.getTopMargin();
        rect[2]-=master.getLeftBorderSize()+master.getRightBorderSize()+master.getLeftMargin()+master.getRightMargin();
        rect[3]-=master.getTopBorderSize()+master.getBottomBorderSize()+master.getTopMargin()+master.getTopMargin();
        if(this.top<=-9000)rect[1]=this.top;
        this.setRect(rect);
    },
    masterResized:function(){
        this._fitToMaster();
    },
    editProxyDefaults:{
        willAcceptDrop:function(changeObjectSelection,recursed){
            return this.getPassThruComponent().editProxy.willAcceptDrop();
        },
        drop:function(){
            return this.getPassThruComponent().editProxy.drop();
        },
        dropOver:function(){
            return this.getPassThruComponent().editProxy.dropOver();
        },
        dropMove:function(){
            return this.getPassThruComponent().editProxy.dropMove();
        },
        dropOut:function(){
            return this.getPassThruComponent().editProxy.dropOut();
        },
        dragOver:function(){
            return this.getPassThruComponent().editProxy.dragOver();
        },
        getPassThruComponent:function(){
            var liveObject=this.creator,
                builder=liveObject.creator,
                component=builder.getBaseOrRootComponent()
            ;
            return component;
        }
    }
};
isc.A.dataSourcePickerConstructor='ProjectFileLoadDialog';
isc.A.dataSourcePickerDefaults={
    title:'Pick DataSource',
    actionButtonTitle:'Pick DataSource',
    fileNameTitle:"DataSource name",
    fileType:'ds',
    fileFormat:'xml',
    showLoadFileUI:function(){
        if(this.creator.hostedMode){
            this.noFilesMessage="No datasources found";
            this.disableFileName(true);
        }
        this.Super("showLoadFileUI",arguments);
        this.excludeFiles=this.creator.project.datasources.map(function(ds){return ds.dsName;});
        if(this.creator.userId&&!this.creator.userIsGuest()){
            this.directoryListing.setSort([{
                property:"fileLastModified",
                direction:"descending"
            }]);
            if(this.creator.allowLoadingOtherUsersScreensAndDataSources){
                this.directoryListing.showField("ownerId");
            }
            this.directoryListing.initialCriteria={ownerId:this.creator.userId};
            delete this.directoryListing._setFilter;
        }
    },
    directoryListingProperties:{
        canEdit:false,
        showFilterEditor:true,
        filterOnKeypress:true,
        filterLocalData:true,
        fields:[{
            name:"fileName",
            title:"Name",
            width:"*"
        },{
            name:"ownerId",
            title:"Owner",
            width:"*",
            hidden:true
        },{
            name:"fileLastModified",
            title:"Last Modified",
            type:"datetime",
            width:150
        }],
        setData:function(data){
            if(data&&!isc.isA.ResultSet(data)&&!isc.isAn.emptyArray(data)){
                data=isc.ResultSet.create({
                    dataSource:this.dataSource,
                    allRows:data
                });
                if(!this._setFilter){
                    this._setFilter=true;
                    if(this.initialCriteria){
                        this.setFilterEditorCriteria(this.initialCriteria);
                        data.setCriteria(this.initialCriteria);
                    }
                }
            }
            this.Super("setData",arguments);
        }
    }
};
isc.A._loadSharedDataSourceId="loadSharedDataSource";
isc.A.downloadDataSourceDialogTitle="Export DataSource [\${dsID}]";
isc.A.downloadDataSourceDialogPrompt="Choose the format in which to export this DataSource "+
    "definition.  If you're making use of server capabilities, you should export to XML.";
isc.A.downloadDataSourceDialogButtonTitle="Export";
isc.A.dsEditorPropertyNames=[
    "requirePK","autoAddPK","makeUniqueTableName","canSelectPrimaryKey",
    "canAddChildSchema","showMoreButton","showLegalValuesButton"
];
isc.A.gridDropBindingDialogDefaults={
    _constructor:isc.DynamicForm,
    width:"100%",
    height:"100%",
    autoDraw:false,
    width:350,
    colWidths:[30,"*"],
    defaultFields:[
        {name:"bindToDataSource",type:"checkbox",showTitle:false,showLabel:false},
        {shouldSaveValue:false,showTitle:false,type:"staticText",defaultValue:"Bind to existing DataSource",
            click:function(form){form.selectAction("bindToDataSource");}
        },
        {showSaveValue:false,type:"SpacerItem",showTitle:false},
        {name:"dataSource",showTitle:false,type:"comboboxitem",width:"*",showHintInField:true,hint:"DataSource..",
            changed:function(form){form.selectAction("bindToDataSource");},
            validators:[
                {type:"requiredIf",expression:"item.form.getValue('bindToDataSource') == true"}
            ]
        },
        {name:"createDataSource",type:"checkbox",showTitle:false,showLabel:false},
        {shouldSaveValue:false,showTitle:false,type:"staticText",defaultValue:"Create a new DataSource..",
            click:function(form){form.selectAction("createDataSource");}
        },
        {showSaveValue:false,type:"SpacerItem",showTitle:false},
        {name:"dsWizard",showTitle:false,type:"comboboxitem",width:"*",showHintInField:true,hint:"Type..",
            changed:function(form){form.selectAction("createDataSource");},
            validators:[
                {type:"requiredIf",expression:"item.form.getValue('createDataSource') == true"}
            ]
        },
        {name:"doNothing",type:"checkbox",showTitle:false,showLabel:false},
        {shouldSaveValue:false,showTitle:false,type:"staticText",defaultValue:"Do nothing now; add data later",
            click:function(form){form.selectAction("doNothing");}
        }
    ],
    values:{doNothing:true},
    init:function(){
        this.fields=isc.shallowClone(this.defaultFields);
        if(this.targetDataSources==null||this.targetDataSources.length==0){
            this.fields.find("name","bindToDataSource").disabled=true;
            this.fields.find("name","dataSource").disabled=true;
        }else{
            this.fields.find("name","dataSource").valueMap=this.targetDataSources;
        }
        this.fields.find("name","dsWizard").valueMap=this.targetDSWizards;
        this.Super("init",arguments);
    },
    selectAction:function(name){
        var oldValue=this.getValue(name);
        if(!oldValue&&this.itemChange(this.getItem(name),true,oldValue)){
            this.setValue(name,true);
        }
    },
    mutexItems:["bindToDataSource","createDataSource","doNothing"],
    itemChange:function(item,newValue,oldValue){
        if(!this.mutexItems.contains(item.name))return true;
        if(oldValue&&!newValue)return false;
        for(var i=0;i<this.mutexItems.length;i++){
            var mutexItem=this.getItem(this.mutexItems[i]);
            if(mutexItem.name!=item.name){
                this.setValue(mutexItem.name,false);
            }
        }
        if(newValue&&item.name=="createDataSource"&&!this.getValue("dsWizard")){
            var field=this.getField("dsWizard");
            field.setValue(field.valueMap[0]);
        }
        return true;
    }
};
isc.A.formDropBindingDialogDefaults={
    _constructor:isc.DynamicForm,
    width:"100%",
    height:"100%",
    autoDraw:false,
    width:350,
    colWidths:[30,"*"],
    defaultFields:[
        {name:"bindToDataSource",type:"checkbox",showTitle:false,showLabel:false},
        {shouldSaveValue:false,showTitle:false,type:"staticText",defaultValue:"Bind to existing DataSource",
            click:function(form){form.selectAction("bindToDataSource");}
        },
        {showSaveValue:false,type:"SpacerItem",showTitle:false},
        {name:"dataSource",showTitle:false,type:"comboboxitem",width:"*",showHintInField:true,hint:"DataSource..",
            changed:function(form){form.selectAction("bindToDataSource");},
            validators:[
                {type:"requiredIf",expression:"item.form.getValue('bindToDataSource') == true"}
            ]
        },
        {name:"createDataSource",type:"checkbox",showTitle:false,showLabel:false},
        {shouldSaveValue:false,showTitle:false,type:"staticText",defaultValue:"Create a new DataSource..",
            click:function(form){form.selectAction("createDataSource");}
        },
        {showSaveValue:false,type:"SpacerItem",showTitle:false},
        {name:"dsWizard",showTitle:false,type:"comboboxitem",width:"*",showHintInField:true,hint:"Type..",
            changed:function(form){form.selectAction("createDataSource");},
            validators:[
                {type:"requiredIf",expression:"item.form.getValue('createDataSource') == true"}
            ]
        },
        {name:"doNothing",type:"checkbox",showTitle:false,showLabel:false},
        {shouldSaveValue:false,showTitle:false,type:"staticText",defaultValue:"Do nothing now; add fields by hand",
            click:function(form){form.selectAction("doNothing");}
        }
    ],
    values:{doNothing:true},
    init:function(){
        this.fields=isc.shallowClone(this.defaultFields);
        if(this.targetDataSources==null||this.targetDataSources.length==0){
            this.fields.find("name","bindToDataSource").disabled=true;
            this.fields.find("name","dataSource").disabled=true;
        }else{
            this.fields.find("name","dataSource").valueMap=this.targetDataSources;
        }
        this.fields.find("name","dsWizard").valueMap=this.targetDSWizards;
        this.Super("init",arguments);
    },
    selectAction:function(name){
        var oldValue=this.getValue(name);
        if(!oldValue&&this.itemChange(this.getItem(name),true,oldValue)){
            this.setValue(name,true);
        }
    },
    mutexItems:["bindToDataSource","createDataSource","doNothing"],
    itemChange:function(item,newValue,oldValue){
        if(!this.mutexItems.contains(item.name))return true;
        if(oldValue&&!newValue)return false;
        for(var i=0;i<this.mutexItems.length;i++){
            var mutexItem=this.getItem(this.mutexItems[i]);
            if(mutexItem.name!=item.name){
                this.setValue(mutexItem.name,false);
            }
        }
        if(newValue&&item.name=="createDataSource"&&!this.getValue("dsWizard")){
            var field=this.getField("dsWizard");
            field.setValue(field.valueMap[0]);
        }
        return true;
    }
};
isc.A.captureErrorReport=true;
isc.A.captureUsageData=true;
isc.A.monitorServerConnection=true;
isc.A.ignoreServerCommLoss=isc.Browser.seleniumPresent;
isc.A.serverReconnectWindowConstructor="ServerReconnectWindow";
isc.A.initialServerCheckInterval=2;
isc.A.serverCommLossWaitText="Trying to reconnect in ... ${time}";
isc.A.serverReconnectNowText="Reconnect Now";
isc.A.serverCommLossPingText="<span style='line-height:250%'>Pinging now to check server status<span>";
isc.A.showPingDuration=1500;
isc.A.failedLoadWindowConstructor="Window";
isc.A.failedLoadWindowDefaults={
    title:"Problem with your project",
    showMinimizeButton:false,
    showCloseButton:false,
    dismissOnEscape:true,
    visibility:"hidden",
    showModalMask:true,
    autoCenter:true,
    autoSize:true,
    isModal:true,
    width:400
};
isc.A.failedLoadHostedMessage="There is a critical issue with this project, preventing it from being developed further. We are aware of this and have captured data for analysis. Please create a new project or open another project to proceed.";
isc.A.failedLoadLocalMessage="There is a critical issue with this project, preventing it from being developed further.  Consult the client and server logs for details. Please create a new project or open another project to proceed.";
isc.A.failedLoadViewConstructor="VBFailedLoadView";
isc.A.pageReloadWindowConstructor="Window";
isc.A.pageReloadWindowDefaults={
    title:"An error has occurred",
    showMinimizeButton:false,
    showCloseButton:false,
    dismissOnEscape:true,
    visibility:"hidden",
    showModalMask:true,
    autoCenter:true,
    autoSize:true,
    isModal:true,
    width:400
};
isc.A.pageReloadTimeoutSeconds=8;
isc.A.pageReloadWindowMessage="Oops, something's gone wrong and we need to reload the page. Don't worry, your work is safe and you can keep going where you left off.  Reloading in ${countdown} seconds.";
isc.A.pageReloadViewConstructor="VBReloadView";
isc.B.push(isc.A._updateEditComponentRemovability=function isc_VisualBuilder__updateEditComponentRemovability(node){
    if(node==null)node=this._lastEditNode;
    else this._lastEditNode=node;
    var data=this.projectComponents.data,
        removeOK=this.canAddRootComponents||
            !data.isRoot(data.getParent(node))||
            (node.alwaysAllowRootDrop==true||node.alwaysAllowRootDrop=="true");
    this.editorPane.tabBarControls[1].setVisibility(removeOK);
}
);
isc.evalBoundary;isc.B.push(isc.A._updateEditComponentRotatability=function isc_VisualBuilder__updateEditComponentRotatability(node){
    if(node==null)node=this._lastEditNode;
    else this._lastEditNode=node;
    var type=(node?node.type||node.className:null),
        liveObject=(node?node.liveObject:null),
        rotateOK=(node&&(type=="VLayout"||type=="HLayout"||
                                (type=="LayoutResizeBar"&&
                                    isc.isA.Layout(liveObject.parentElement)&&
                                    !isc.isA.DataView(liveObject.parentElement)&&
                                    !isc.isA.Deck(liveObject.parentElement)))),
        vertical=(liveObject&&(type=="LayoutResizeBar"?!liveObject.vertical:liveObject.vertical))
    ;
    this.editorPane.tabBarControls[0].setVisibility(rotateOK);
    this.editorPane.tabBarControls[0].prompt="Flip layout to "+(vertical?"horizontal":"vertical");
}
);
isc.evalBoundary;isc.B.push(isc.A.setCanAddRootComponents=function isc_VisualBuilder_setCanAddRootComponents(canAddRootComponents){
    this.canAddRootComponents=canAddRootComponents;
    this.projectComponents.setProperty("canDropRootNodes",canAddRootComponents);
    this._updateEditComponentRemovability();
}
);
isc.evalBoundary;isc.B.push(isc.A._forceOfflineStorage=function isc_VisualBuilder__forceOfflineStorage(){
    if(this.storageMode=="dataSourceOnly"){
        return false;
    }else if(this.storageMode=="offlineOnly"){
        return true;
    }else{
        return!this.userId;
    }
}
);
isc.evalBoundary;isc.B.push(isc.A.exportProject=function isc_VisualBuilder_exportProject(project,settings){

    var self=this;
    var projectName=null;
    if(project!=null)projectName=project;
    else if(this.project.name)projectName=this.project.name;
    if(projectName==null){
        isc.warn("You need to specify the project you want to export");
        return;
    }else{
        this._addUsageRecord("export",projectName);
    }
    var ownerId=this.getProjectOwnerId(),
        fileName=this.getProjectFileName()
    ;
    this.projectDataSource.getFile({
        ownerId:ownerId,
        fileName:fileName,
        fileType:'proj',
        fileFormat:'xml'
        },function(dsResponse,data,dsRequest){

            if(!data){
                isc.warn("Failed to read project. Check the project you want to export");
                return;
            }
            var dataSourcesIDs=[],
                screensIDs=[],
                treeNodes=[];
            settings.projectDir={
                path:settings.projectDir+projectName+".proj.xml",
                content:data
            };
            isc.DMI.callBuiltin({
                methodName:"xmlToJS",
                arguments:[data],
                callback:function(rpcResponse,jsData){

                    var project=isc.eval(jsData);
                    treeNodes=project.screens.getAllNodes();
                    for(var i=0;i<treeNodes.size();i++){
                        if(treeNodes[i].fileName&&treeNodes[i].fileName.length>0){
                            screensIDs.push(treeNodes[i].fileName);
                        }
                    }
                    for(var i=0;i<project.datasources.length;i++){
                        dataSourcesIDs.push(project.datasources[i].dsName);
                    }
                    settings.screensIDs=screensIDs;
                    settings.dataSourcesIDs=dataSourcesIDs;
                    isc.DMI.callBuiltin({
                        methodName:"downloadZip",
                        arguments:[settings||this.ProjectExportSettings],
                        requestParams:{
                            showPrompt:false,
                            useXmlHttpRequest:false,
                            timeout:0
                        }
                    });
                    isc.Notify.addMessage("Export initiated",null,null,{duration:4000});
                }
            });
        },{
            willHandleError:true,
            operationId:(ownerId?"allOwners":null)
        }
    );
}
,isc.A.autoSaveCurrentSettings=function isc_VisualBuilder_autoSaveCurrentSettings(callback){
    if(callback)this._saveSettingsCallbacks.add(callback);
    this.fireOnPause("saveCurrentSettings","saveCurrentSettings",null,
                     "return !isc.EH.dragging");
}
,isc.A.saveCurrentSettings=function isc_VisualBuilder_saveCurrentSettings(){
    if(!isc.Browser.seleniumPresent){
        var settingsDS=this.settingsDataSource;
        if(settingsDS&&!this._forceOfflineStorage()){
            var xml=isc.DS.get("VisualBuilder").xmlSerialize(this.currentSettings);
            settingsDS.saveFile(this.settingsFile,xml,null,{showPrompt:false});
        }else{
            isc.Offline.put(this.offlineStorageKey,isc.JSON.encode(this.currentSettings,
                                                                    {strictQuoting:true}));
        }
    }
    var callbacks=this._saveSettingsCallbacks;
    for(var i=0;i<callbacks.length;i++)callbacks[i]();
    this._saveSettingsCallbacks=[];
}
,isc.A._restoreSettings=function isc_VisualBuilder__restoreSettings(json){
    this.currentSettings=isc.JSON.decode(json);
    if(this.currentSettings){
        if(this.currentSettings.projectID&&!this.currentSettings.projectFileName){
            this.currentSettings.projectFileName=this._convertIDtoFileName(this.currentSettings.projectID);
            delete this.currentSettings.projectID;
        }
        if(this.currentSettings.recentProjects&&isc.isAn.Array(this.currentSettings.recentProjects)){
            var self=this;
            this.currentSettings.recentProjects.map(function(project){
                if(project.projectID&&!project.projectFileName){
                    project.projectFileName=self._convertIDtoFileName(project.projectID);
                    delete project.projectID;
                }
            });
        }
    }
    this.setProperties(this.currentSettings);
}
,isc.A.loadCurrentSettings=function isc_VisualBuilder_loadCurrentSettings(callback){
    var self=this;
    var settingsDS=this.settingsDataSource;
    if(settingsDS&&!this._forceOfflineStorage()){
        settingsDS.getFile(this.settingsFile,function(dsResponse,data,dsRequest){
            if(dsResponse.status>=0&&data){
                if(isc.isAn.Array(dsResponse.data)&&dsResponse.data.length>0&&dsResponse.data[0].fileContentsJS){
                    self._loadCurrentSettingsReplyJs(dsResponse.data[0].fileContentsJS,callback);
                }else{
                    self._loadCurrentSettingsReply(data,callback);
                }
            }else{
                isc.RPCManager.sendRequest({
                    actionURL:self.defaultSettingsURL,
                    willHandleError:true,
                    httpMethod:'GET',
                    useSimpleHttp:true,
                    timeout:6000,
                    callback:function(response,data,request){
                        if(response.status>=0&&data){
                            self._loadCurrentSettingsReply(data,callback);
                        }else{
                            self._loadCurrentSettingsReplyJs("{}",callback);
                        }
                    }
                });
            }
        },{
            willHandleError:true,
            timeout:6000,
            operationId:"xmlToJs"
        });
    }else{
        try{
            var json=isc.Offline.get(this.offlineStorageKey);
            if(json)this._restoreSettings(json);
        }finally{
            this.fireCallback(callback);
        }
    }
}
,isc.A._loadCurrentSettingsReply=function isc_VisualBuilder__loadCurrentSettingsReply(data,callback){
    var self=this;
    isc.DMI.callBuiltin({
        methodName:"xmlToJS",
        arguments:[data],
        requestParams:{
            willHandleError:true,
            timeout:6000
        },
        callback:function(rpcResponse,data){
            try{
                if(rpcResponse.status>=0){
                    self._restoreSettings(data);
                }
            }
            finally{
                self.fireCallback(callback);
            }
        }
    });
}
);
isc.evalBoundary;isc.B.push(isc.A._loadCurrentSettingsReplyJs=function isc_VisualBuilder__loadCurrentSettingsReplyJs(jsData,callback){
    try{
        this._restoreSettings(jsData);
    }finally{
        this.fireCallback(callback);
    }
}
,isc.A.userIsGuest=function isc_VisualBuilder_userIsGuest(){
    return!this.userId;
}
,isc.A.getProjectFileName=function isc_VisualBuilder_getProjectFileName(){
    return this.project?this.project.fileName:null;
}
,isc.A.getProjectOwnerId=function isc_VisualBuilder_getProjectOwnerId(){
    return this.project?this.project.getOwnerId():null;
}
,isc.A.getProjectDisplayName=function isc_VisualBuilder_getProjectDisplayName(){
    var name=this.project?this.project.name:null;
    if(!name)return"Untitled Project";
    if(name.endsWith(".proj.xml")){
        return name.slice(0,-9);
    }else if(name.endsWith(".xml")){
        return name.slice(0,-4);
    }else{
        return name;
    }
}
,isc.A.setProject=function isc_VisualBuilder_setProject(project){
    if(project==this.project)return;
    if(this.project){
        this.ignore(this.project,"setFileName");
        this.ignore(this.project,"setName");
        this.ignore(this.project,"setScreenProperties");
        this.ignore(this.project,"removeScreen");
        this.ignore(this.project,"removeGroup");
        if(this.dataSourceList)this.ignore(this.project.datasources,"dataChanged");
        this.project.builder=null;
    }
    this.project=project;
    if(project){
        project.projectDataSource=this.projectDataSource;
        project.screenDataSource=this.screenDataSource;
        this.observe(project,"setFileName","observer.updateProjectFileName();");
        this.observe(project,"setName","observer.updateProjectName();");
        this.observe(project,"setScreenProperties","observer.updateScreenProperties(returnVal);");
        this.observe(project,"removeScreen","observer.checkCurrentScreen();");
        this.observe(project,"removeGroup","observer.checkCurrentScreen();");
        if(this.dataSourceList)this.observe(project.datasources,"dataChanged","observer.updateDataSourceList();");
        project.builder=this;
    }
    this.updateProjectFileName();
    this.updateProjectName();
    if(this.screenList){
        this.screenList.setData(project?project.screens:isc.Tree.create());
    }
    if(this.dataSourceList)this.updateDataSourceList();
    if(this.project.currentScreenID&&!this.project.currentScreenFileName){
        this.project.currentScreenFileName=this._convertIDtoFileName(this.project.currentScreenID);
        delete this.project.currentScreenID;
    }
    delete this.currentScreen;
    this.clearRecentScreens();
    this.lastUsedDataSource=null;
    this._loadAllProjectDataSources=true;
    if(this.initialScreen){
        this.loadScreen(null,this.initialScreen);
        delete this.initialScreen;
        return;
    }
    var foundProjectScreen;
    if(this.project.currentScreenFileName){
        var screen=this.project.findScreen(this.project.currentScreenFileName);
        if(screen&&screen.mockupMode==this.mockupMode){
            this.setCurrentScreen(screen);
            foundProjectScreen=true;
        }
    }
    if(!foundProjectScreen)this.openDefaultScreen();
}
,isc.A._convertIDtoFileName=function isc_VisualBuilder__convertIDtoFileName(id){
    var fileSpec=isc.DataSource.makeFileSpec(id);
    return fileSpec.fileName.split("/").last();
}
,isc.A.updateDataSourceList=function isc_VisualBuilder_updateDataSourceList(){
    var self=this;
    var tempNodes=self.dataSourceList.data.findAll("referenceInProject",false)||[];
    var pNodes=this.project.datasources.map(function(ds){
        var existingNode=self.dataSourceList.data.find("ID",ds.dsName);
        if(existingNode){
            return existingNode;
        }else{
            var dsType=(isc.isA.MockDataSource(ds)?"MockDataSource":ds.dsType);
            return self.projectComponents.editContext.makeDSPaletteNode(ds.dsName,dsType);
        }
    });
    pNodes.addList(tempNodes);
    this.dataSourceList.setData(pNodes);
}
,isc.A.checkCurrentScreen=function isc_VisualBuilder_checkCurrentScreen(){
    if(this.currentScreen){
        if(this.currentScreen.fileName&&this.currentScreen.fileName!=""){
            var screen=this.project.findScreen(this.currentScreen.fileName);
            if(!screen)this.openDefaultScreen();
        }else{
            var screenNodes=this.project.screens.getAllNodes();
            for(var i=0;i<screenNodes.length;i++){
                var node=screenNodes[i];
                if(this.currentScreen==node){
                    return;
                }
            }
            this.openDefaultScreen();
        }
    }
}
,isc.A.openDefaultScreen=function isc_VisualBuilder_openDefaultScreen(){
    var screen;
    if(this.singleScreenMode){
        screen=this.project.untitledScreen();
    }else{
        screen=this.project.lastSavedScreen(this.mockupMode);
    }
    if(!screen){
        this.createNewScreen();
    }else{
        this.setCurrentScreen(screen);
    }
}
,isc.A.createNewScreen=function isc_VisualBuilder_createNewScreen(callback,baseFileName){
    var self=this,
        project=this.project
    ;
    var createScreen=function(fileName,title){
        self.resetUndoPosition();
        var screen=project.addScreen(null,fileName,title);
        screen.mockupMode=self.mockupMode;
        self.setCurrentScreen(screen);
        self._addUsageRecord("createScreen",screen.title);
        return screen;
    };
    if(this.autoNameAndSaveProjectsAndScreens){
        project.autoAssignScreenName(function(screenFileName){
            var screen=createScreen(screenFileName,screenFileName);
            project.setScreenDirty(screen,true);
            if(callback)callback(screen);
        },baseFileName);
    }else{
        var screen=createScreen(null,"Untitled Screen");
        if(callback)callback(screen);
    }
}
,isc.A.updateProjectFileName=function isc_VisualBuilder_updateProjectFileName(){
    if(this.singleScreenMode)return;
    this.currentSettings.projectFileName=this.project.fileName;
    this.currentSettings.projectOwnerId=this.project.getOwnerId();
    this.autoSaveCurrentSettings();
    this.updateRecentProjects();
}
,isc.A.updateProjectName=function isc_VisualBuilder_updateProjectName(){
    if(this.projectName){
        this.projectName.setContents(this.getProjectDisplayName());
        var readOnly=this.project.isReadOnly();
        this.projectNamePane.setReadOnly(readOnly);
        this.dsNewButton.setDisabled(readOnly);
    }
    this.updateRecentProjects();
}
,isc.A.shareProject=function isc_VisualBuilder_shareProject(){
    var builder=this;
    var callback=function(){
        window.sharedProjects.fetchData({ownerId:window.user.username},function(dsResponse){
            var overwriteId=null;
            if(dsResponse.totalRows>=20){
                var overwriteId=dsResponse.data[0].id;
            }
            var shareId=isc.Math.randomUUID();
            var params=builder.getParamsForProjectRunner();
            window.sharedProjects[overwriteId===null?"addData":"updateData"]({
                id:overwriteId,
                shareId:shareId,
                parameters:isc.RPC.addParamsToURL("",params)
            },function(dsResponse){
                var baseURL;
                var shareURL;
                if(builder.projectRunnerShareBaseURL){
                    baseURL=builder.projectRunnerShareBaseURL;
                    shareURL=baseURL+shareId+"/";
                }else{
                    var url=window.location.href,
                        path=window.location.pathname,
                        pathIntro=path.substring(0,path.lastIndexOf("/")+1);
                    baseURL=url.substring(0,url.lastIndexOf(pathIntro))+pathIntro+builder.projectRunnerURL;
                    shareURL=isc.RPC.addParamsToURL(baseURL,{shareId:shareId});
                }
                var message="Your project has been shared at the following URL:<br><br>"
                            +"<a target=_blank href='"+shareURL+"'>"+shareURL+"</a>";
                isc.say(message,null,{
                    title:"Share with others",
                    icon:"actions/shareProjectLarge.png",
                    buttons:[
                        {title:"Copy URL",width:75,overflow:"visible",
                            click:function(){
                                var aux=document.createElement("input");
                                aux.setAttribute("value",shareURL);
                                document.body.appendChild(aux);
                                aux.select();
                                document.execCommand("copy");
                                document.body.removeChild(aux);
                                this.topElement.okClick();
                            }
                        },
                        isc.Dialog.OK
                    ],
                    autoFocusButton:1
                });
                builder._addUsageRecord("projectShare",builder.getProjectDisplayName());
            });
        },{sortBy:"lastAccessed",startRow:0,endRow:1});
    };
    this[this.singleScreenMode?"confirmSaveScreen":"confirmSaveProject"](callback);
}
,isc.A.getParamsForProjectRunner=function isc_VisualBuilder_getParamsForProjectRunner(runConfig){
    var params={};
    if(this.mockupMode){
        isc.addProperties(params,{
            type:"screen",
            screen:this.currentScreen.fileName
        });
    }else if(this.singleScreenMode){
        isc.addProperties(params,{
            type:"screen",
            screen:this.currentScreen.fileName
        });
    }else{
        var project=this.project;
        isc.addProperties(params,{
            type:"project",
            project:project.fileName
        });
        if(project.getOwnerId()!=null){
            isc.addProperties(params,{ownerId:project.getOwnerId()});
        }
        if(project.currentScreenId!=null){
            params.screenId=project.currentScreenId;
        }
        if(project.currentScreenFileName){
            params.currentScreen=project.currentScreenFileName;
        }
        if(this.screenList){
            var record=this.screenList.getSelectedRecord();
            if(record)params.currentScreen=record.fileName;
        }
        params.singleScreenMode=1;
    }
    if(runConfig){
        isc.addProperties(params,{
            skin:runConfig.skin,
            density:runConfig.density,
            device:runConfig.device
        });
        if(runConfig.userId)params.userId=runConfig.userId;
        if(runConfig.live&&isc.Messaging){
            var channelName=""+isc.timestamp();
            params.realTimeUpdates=channelName;
            this.currentScreen.realTimeUpdates=channelName;
        }
    }
    return params;
}
,isc.A.runProject=function isc_VisualBuilder_runProject(runConfig){
    var builder=this;
    var callback=function(){
        if(!builder.mockupMode&&(!builder.project||!builder.project.fileName)){
            isc.say("Project must be saved before you can run it");
            return;
        }
        var params=builder.getParamsForProjectRunner(runConfig);
        var projectRunnerURL=builder.projectRunnerURL;
        if(builder.projectRunnerRunBaseURL){
            projectRunnerURL=builder.projectRunnerRunBaseURL;
        }
        window.open(isc.RPC.addParamsToURL(projectRunnerURL,params));
        builder._addUsageRecord("runProject",builder.getProjectDisplayName(),
                                runConfig?runConfig.name:null);
    };
    if(this.mockupMode){
        var fileName="autoSave.ui.xml";
        var screen=this.currentScreen;
        this.screenDataSource.saveFile({
            fileName:fileName,
            fileType:'ui',
            fileFormat:'xml',
            fileAutoSaved:false,
            lastUsedInProject:builder.currentProject.fileName
        },screen.contents,function(){
            var params=builder.getParamsForProjectRunner();
            params.screen=fileName;
            window.open(isc.RPC.addParamsToURL(builder.projectRunnerURL,params));
        },{showPrompt:false});
        return;
    }
    this.saveUnsavedScreen(function(){
        builder[builder.singleScreenMode?"confirmSaveScreen":"confirmSaveProject"](callback);
    });
}
,isc.A.saveUnsavedScreen=function isc_VisualBuilder_saveUnsavedScreen(callback){
    var currentScreenName,
        _this=this;
    if(this.screenList){
        var record=this.screenList.getSelectedRecord();
        if(record)currentScreenName=record.fileName;
    }
    if(!currentScreenName&&!this.project.currentScreenFileName){
        var confirmCallback=function(value){
            if(!value)return;
            _this.cacheCurrentScreenContents();
            _this.project.saveScreenContents(_this.currentScreen,false,function(screen){
                if(screen.fileName){
                    _this.project.currentScreenFileName=screen.fileName;
                    if(_this.project.fileName){
                        _this.project.save(function(){
                            _this.fireCallback(callback);
                        });
                    }else{
                        _this.fireCallback(callback);
                    }
                }
            });
        };
        var saveNow=isc.Button.create({
            title:"Save Now",
            click:function(){
                _this.fireCallback(confirmCallback,["value"],[true]);
                isc.dismissCurrentDialog();
            }
        });
        isc.confirm("The current screen must be saved before it can be run",confirmCallback,
                    {buttons:[isc.Dialog.CANCEL,saveNow],autoFocusButton:1});
    }else{
        this.fireCallback(callback);
    }
}
,isc.A.confirmSaveScreen=function isc_VisualBuilder_confirmSaveScreen(callback){
    if(this.singleScreenMode&&this.currentScreen&&this.currentScreen.dirty){
        var self=this;
        isc.confirm("Save current screen?",function(response){
            if(response==true){
                self.saveScreenAs(self.currentScreen,callback);
            }else if(response==false){
                self.fireCallback(callback);
            }
        },{
            buttons:[isc.Dialog.CANCEL,isc.Dialog.NO,isc.Dialog.YES],
            autoFocusButton:2
        });
    }else{
        this.fireCallback(callback);
    }
}
,isc.A.confirmSaveProject=function isc_VisualBuilder_confirmSaveProject(callback){
    if(!this.project||this.project.isEmpty()||this.getProjectFileName()){
        this.fireCallback(callback);
    }else{
        var self=this;
        isc.confirm("Save current project?",function(response){
            if(response==true){
                self.project.save(callback);
            }else if(response==false){
                self.fireCallback(callback);
            }
        },{
            buttons:[isc.Dialog.CANCEL,isc.Dialog.NO,isc.Dialog.YES],
            autoFocusButton:2
        });
    }
}
,isc.A.makeDefaultProject=function isc_VisualBuilder_makeDefaultProject(){
    var self=this;
    isc.RPCManager.sendRequest({
        actionURL:self.defaultProjectURL,
        willHandleError:true,
        httpMethod:'GET',
        useSimpleHttp:true,
        timeout:6000,
        callback:function(response,data,request){
            if(response.status>=0&&data){
                self.loadProjectReply(response,{
                    fileContents:data
                },request);
            }else{
                self.makeNewProject(!self._projectRecentlyRemoved);
            }
        }
    });
}
,isc.A.addSampleDataSources=function isc_VisualBuilder_addSampleDataSources(suppressNotification){
    if(isc.Browser.seleniumPresent)return;
    var samples=[
        "ProductLine",
        "Product",
        "Office",
        "Employee",
        "Customer",
        "Order",
        "OrderDetail",
        "Payment"
    ];
    var builder=this,
        dsDataSource=builder.dsDataSource,
        missingSamples=[],
        remaining=samples.length
    ;
    for(var i=0;i<samples.length;i++){
        var id=samples[i];
        dsDataSource.hasFile({fileName:id,fileType:"ds",fileFormat:"xml"},function(dsResponse,data,dsRequest){
            if(!data){
                missingSamples.add(dsRequest.data.fileName);
            }
            builder._addSampleDataSourcesPending=missingSamples.length;
            if(--remaining==0){
                builder._addSampleDataSources(samples,missingSamples,suppressNotification);
            }
        });
    }
}
,isc.A._addSampleDataSources=function isc_VisualBuilder__addSampleDataSources(allSamples,missingSamples,suppressNotification){
    var queued=isc.RPCManager.startQueue();
    var builder=this;
    var addSampleDSToProject=function(id){
        builder.project.addDatasource(id);
    };
    for(var i=0;i<allSamples.length;i++){
        var id=allSamples[i];
        if(missingSamples.contains(id)){
            this.dsDataSource.addData(
                {"fileName":id},
                function(dsResponse){
                    addSampleDSToProject(dsResponse.clientContext.id);
                },
                {"operationId":"copyClassicModels",clientContext:{id:id}}
            );
        }else{
            addSampleDSToProject(id);
        }
    }
    if(!queued){
        var msg="<br>We've automatically added some sample DataSources to get you started."+
            "<p>"+
            "You can drag & drop DataSources onto grids, table layouts and other bindable "+
            "components to configure them."
        ;
        isc.RPCManager.sendQueue(function(responses){
            var width=350;
            if(!suppressNotification){
                isc.Notify.addMessage(
                    msg,
                    [],
                    "dsListNotifications",
                    {
                        duration:0,
                        canDismiss:true,
                        messageIcon:isc.Canvas._blankImgURL,
                        disappearMethod:"instant",
                        x:builder.dataSourceList.body.getPageLeft()-(width),
                        y:builder.dataSourceList.body.getPageTop(),
                        labelProperties:{
                            width:width
                        }
                    }
                );
            }
            delete builder._addSampleDataSourcesPending;
        });
    }
}
,isc.A.getDefaultProjectAuthenticationData=function isc_VisualBuilder_getDefaultProjectAuthenticationData(){
    if(!this.useSampleUsersAndRoles)return null;
    return{
        provider:"inlineSampleUsers",
        users:[
            {userId:"joe",email:"jpadmin@company.com",firstName:"Joe",lastName:"Admin",title:"Admin",superUser:true},
            {userId:"steve",email:"stuser@company.com",firstName:"Steve",lastName:"User",title:"Staff",roles:["view"],phone:"867 5309"}
        ],
        lastSelectedUser:"joe",
        availableRoles:[
            {name:"admin",description:"This role allows users to administrate the application"},
            {name:"view",description:"This role allows users to view the application"}
        ]
    };
}
,isc.A.makeNewProject=function isc_VisualBuilder_makeNewProject(addSampleDataSources,callback){
    var project=isc.Project.create({builder:this});
    project.authentication=this.getDefaultProjectAuthenticationData();
    if(this.autoNameAndSaveProjectsAndScreens){
        var self=this;
        project.autoAssignProjectName(function(projectFileName){
            project.setFileName(projectFileName);
            project.setName(projectFileName);
            if(addSampleDataSources)self.addSampleDataSources();
            self.setProject(project);
            self._addUsageRecord("createProject",projectFileName);
            self._isNewProject=true;
            if(callback)callback();
        });
    }else{
        this.setProject(project);
        this._addUsageRecord("createProject",project.name);
        if(callback)callback();
    }
}
,isc.A.showLoadProjectUI=function isc_VisualBuilder_showLoadProjectUI(){
    if(!this.loadProjectDialog)this.loadProjectDialog=this.createAutoChild('loadProjectDialog',{
        dataSource:this.projectDataSource
    });
    this.loadProjectDialog.showLoadFileUI({
        target:this,
        methodName:"loadProjectReply"
    },"allOwners");
}
,isc.A.loadProjectReply=function isc_VisualBuilder_loadProjectReply(dsResponse,data,dsRequest){

    if(!data||!data.fileContents){
        if(data&&data.fileName){
            var project=isc.Project.create({builder:this});
            project.setFileSpec(data);
            project.authentication=this.getDefaultProjectAuthenticationData();
            this.setProject(project);
            this.project.autoSave();
        }else{
            isc.warn("Failed to open project");
        }
        return;
    }
    if(data.fileContentsJS){
        this.loadProjectReplyJs(data);
    }else{
        var self=this;
        isc.DMI.callBuiltin({
            methodName:"xmlToJS",
            arguments:[data.fileContents],
            callback:function(rpcResponse,jsData){
                data.fileContentsJS=jsData;
                self.loadProjectReplyJs(data);
            }
        });
    }
}
,isc.A.loadProjectReplyJs=function isc_VisualBuilder_loadProjectReplyJs(data){

    var project=isc.eval(data.fileContentsJS);
    if(project.screens){
        project.screens.getAllNodes().map(function(node){

            if(node.contents)node.dirty=new Date();
            if(isc.isA.String(node.mockupMode)){
                node.mockupMode=(node.mockupMode=="true");
            }
            if(isc.isA.String(node.oldVersionLoaded)){
                node.oldVersionLoaded=(node.oldVersionLoaded=="true");
            }
            if(node.screenID){
                node.fileName=this._convertIDtoFileName(node.screenID);
                delete node.screenID;
            }
        });
    }
    if(project.authentication==null||isc.isAn.emptyObject(project.authentication)){
        project.authentication=this.getDefaultProjectAuthenticationData();
    }else if(project.authentication.sampleUsers&&project.authentication.sampleUsers.currentUser){
        project.authentication.users=project.authentication.sampleUsers.currentUser;
        delete project.authentication.sampleUsers;
        var users=project.authentication.users;
        for(var i=0;i<users.length;i++){
            var user=users[i];
            if(isc.isAn.Object(user.roles)){
                user.roles=isc.getValues(user.roles);
            }
        }
    }
    project.builder=this;
    project.setFileSpec(data);
    this.setProject(project);
}
,isc.A.loadProject=function isc_VisualBuilder_loadProject(fileName,ownerId){
    if(!fileName){
        this.logWarn("Tried to loadProject without a fileName");
        return;
    }
    this._loadingProject=fileName;
    isc.showPrompt("Loading Project... ${loadingImage}");
    var self=this;
    this.projectDataSource.getFile({
        fileName:fileName,
        ownerId:ownerId,
        fileType:'proj',
        fileFormat:'xml'
    },function(dsResponse,data,dsRequest){
        delete self._loadingProject;
        if(dsResponse.status==0&&isc.isAn.Array(dsResponse.data)&&dsResponse.data.length>0){
            self.loadProjectReply(dsResponse,dsResponse.data[0],dsRequest);
        }else{
            self.removeRecentProject(fileName);
            isc.clearPrompt();
            var recentProjects=self.getRecentProjects(),
                recentProjectFileName=(recentProjects.length>0?
                                         recentProjects[0].projectFileName:null),
                solution=(recentProjectFileName?"Attempting to load "+
                            recentProjectFileName+" instead.":
                            "Starting a new project instead.")
            ;
            isc.warn("Error loading project: "+fileName+"<p>"+solution,function(value){
                if(recentProjectFileName)self.loadProject(recentProjectFileName);
                else self.makeDefaultProject();
            });
        }
    },{
        willHandleError:true,
        operationId:(ownerId?"allOwners":"xmlToJs")
    });
}
,isc.A.resetProjectState=function isc_VisualBuilder_resetProjectState(){
    var self=this,
        message="Actions and workflows can update DataSources, hide/show components, "+
            "change component titles, etc."+
            "<P>Would you like to reset the project to its initial state?";
    ;
    isc.confirm(message,function(response){
        if(response)self._resetProjectState();
    },{
        buttons:[isc.Dialog.CANCEL,isc.Dialog.OK],
        autoFocusButton:1,
        width:400,
        height:180
    });
}
,isc.A._resetProjectState=function isc_VisualBuilder__resetProjectState(){
    if(this.currentScreen&&this.currentScreen.dirty){
        this.delayCall("_resetProjectState");
        return;
    }
    var self=this,
        project=this.project
    ;
    this.withoutDirtyTracking(function(){
        self.projectComponents.destroyAll();
        self.project.datasources.map(function(dataSource){
            var ds=isc.DS.get(dataSource.dsName);
            if(ds)ds.destroy();
        });
        self.loadProject(project.fileName,project.getOwnerId());
    });
}
,isc.A.confirmDeleteProject=function isc_VisualBuilder_confirmDeleteProject(callback){
    var self=this;
    var dialog=isc.ConfirmDeleteProjectDialog.create({
        projectName:this.getProjectFileName(),
        buttons:[isc.Dialog.CANCEL,isc.Dialog.OK],
        autoFocusButton:1,
        callback:function(value){
            if(value)self.deleteProject(this.deleteAllResources,callback);
        }
    });
    dialog.show();
}
,isc.A.deleteProject=function isc_VisualBuilder_deleteProject(deleteAllResources,callback){
    var self=this;
    var doDeleteProject=function(){
        self.projectDataSource.removeFile({
            fileName:self.project.fileName,
            fileType:'proj',
            fileFormat:'xml'
        },function(){
            self._projectRecentlyRemoved=true;
            self.removeRecentProject(self.project.fileName);
            isc.Notify.addMessage("The project "+self.project.fileName+" has been successfully deleted.");
            var recentProjects=self.getRecentProjects();
            if(recentProjects&&recentProjects.length>0){
                self.loadProject(recentProjects[0].projectFileName,recentProjects[0].projectOwnerId);
            }else{
                self.makeDefaultProject();
            }
            if(callback)self.fireCallback(callback);
        });
    };
    if(!deleteAllResources){
        doDeleteProject();
        return;
    }
    var screenNodes=this.project.screens.getAllNodes(),
        projectDataSources=this.project.datasources,
        filesToRemove=[],
        dataSourcesToRemove=[]
    ;
    for(var i=0;i<screenNodes.length;i++){
        var node=screenNodes[i];
        if(node.fileName)filesToRemove.add(node.fileName);
    }
    this.loadAllProjectDataSources(function(){
        for(var i=0;i<projectDataSources.length;i++){
            var dsName=projectDataSources[i].dsName,
                ds=isc.DS.get(dsName)
            ;
            if(ds&&ds.apidoc!=false&&ds.isSampleDS!=true){
                dataSourcesToRemove.add(projectDataSources[i].dsName);
            }
        }
        var pendingCount=filesToRemove.length+dataSourcesToRemove.length;
        if(pendingCount>0){
            if(filesToRemove.length>0){
                for(var i=0;i<filesToRemove.length;i++){
                    var fileName=filesToRemove[i];
                    self.screenDataSource.removeFile({
                        fileName:fileName,
                        fileType:'ui',
                        fileFormat:'xml'
                    },function(){
                        if(--pendingCount==0){
                            doDeleteProject();
                        }
                    });
                }
            }
            if(dataSourcesToRemove.length>0){
                for(var i=0;i<dataSourcesToRemove.length;i++){
                    var fileName=dataSourcesToRemove[i];
                    self.dsDataSource.removeFile({
                        fileName:fileName,
                        fileType:'ds',
                        fileFormat:'xml'
                    },function(){
                        if(--pendingCount==0){
                            doDeleteProject();
                        }
                    });
                }
            }
        }else{
            doDeleteProject();
        }
    });
}
,isc.A.slowLoadAllProjectDataSources=function isc_VisualBuilder_slowLoadAllProjectDataSources(callback){
    if(this._addSampleDataSourcesPending){
        this.logDebug("Delaying DS load due to pending addSampleDataSources()");
        this.delayCall("slowLoadAllProjectDataSources",[callback],100);
        return;
    }
    var projectDataSources=this.project.datasources,
        dsList=projectDataSources.getProperty("dsName")
    ;
    if(dsList.length>0){
        this.delayCall("_loadNextDataSource",[dsList,callback],this.dataSourcesSlowLoadInitialDelay);
    }else{
        this.fireCallback(callback);
    }
}
,isc.A._loadNextDataSource=function isc_VisualBuilder__loadNextDataSource(dsList,finalCallback){
    var dsId=dsList.pop();
    if(dsId&&!isc.DS.get(dsId)){
        var self=this;
        isc.DS.load(dsId,function(){
            self.delayCall("_loadNextDataSource",[dsList,finalCallback],self.dataSourcesSlowLoadDelay);
        });
        return;
    }else if(dsId){
        this.delayCall("_loadNextDataSource",[dsList,finalCallback]);
        return;
    }
    this.fireCallback(finalCallback);
}
,isc.A.loadAllRelatedDataSources=function isc_VisualBuilder_loadAllRelatedDataSources(ds,callback,specificFields){
    if(specificFields&&!isc.isAn.Array(specificFields))specificFields=[specificFields];
    var fieldNames=ds.getFieldNames(),
        dataSources=[]
    ;
    for(var i=0;i<fieldNames.length;i++){
        var fieldName=fieldNames[i],
            field=ds.getField(fieldName)
        ;
        if(!field.includeFrom)continue;
        if(specificFields&&!specificFields.contains(fieldName))continue;
        var path=field.includeFrom,
            splitPath=path.split(".")
        ;
        for(var j=0;j<splitPath.length-1;j++){
            var dsName=splitPath[j];
            if(!dataSources.contains(dsName))dataSources.add(dsName);
        }
    }
    if(dataSources.length>0){
        var self=this;
        var postProcessDataSources=function(){
            for(var i=0;i<dataSources.length;i++){
                var dsName=dataSources[i],
                    loadedDS=isc.DS.get(dsName)
                ;
                self.project.addDatasource(dsName,loadedDS.serverType);
                isc.ClassFactory._setVBLoadingDataSources(null);
                var dsType=loadedDS.hasOwnProperty("mockData")?"mock":"fields";
                self._addUsageRecord("addSharedDS",dsName,dsType);
            }
            var indirectIncludes={};
            for(var i=0;i<fieldNames.length;i++){
                var fieldName=fieldNames[i],
                    field=ds.getField(fieldName)
                ;
                if(!field.includeFrom)continue;
                var path=field.includeFrom,
                    splitPath=path.split("."),
                    relatedDSName=splitPath[splitPath.length-2],
                    relatedDSFieldName=splitPath[splitPath.length-1],
                    relatedDS=isc.DS.get(relatedDSName)
                ;
                if(!relatedDS)continue;
                var relatedDSField=relatedDS.getField(relatedDSFieldName);
                if(!relatedDSField)continue;
                if(relatedDSField.includeFrom){
                    if(!indirectIncludes[relatedDSName]){
                        indirectIncludes[relatedDSName]=[];
                    }
                    indirectIncludes[relatedDSName].add(relatedDSFieldName);
                }
            }
            if(isc.isAn.emptyObject(indirectIncludes)){
                if(callback)self.fireCallback(callback,"relatedDataSources",[dataSources]);
                return;
            }
            var remaining=isc.getKeys(indirectIncludes).length;
            for(var dsName in indirectIncludes){
                var relatedDS=isc.DS.get(dsName),
                    relatedFieldNames=indirectIncludes[dsName]
                ;
                self.loadAllRelatedDataSources(relatedDS,function(additionalDataSources){
                    if(additionalDataSources)dataSources.addList(additionalDataSources);
                    if(--remaining==0){
                        if(callback)self.fireCallback(callback,"relatedDataSources",[dataSources]);
                    }
                },relatedFieldNames);
            }
        };
        var loadThese=[];
        for(var i=0;i<dataSources.length;i++){
            if(!isc.DS.get(dataSources[i]))loadThese.add(dataSources[i]);
        }
        if(loadThese.length>0){
            isc.ClassFactory._setVBLoadingDataSources(true);
            isc.DS.load(loadThese,function(){
                postProcessDataSources();
            });
        }else{
            postProcessDataSources();
        }
    }
}
,isc.A.loadAllProjectDataSources=function isc_VisualBuilder_loadAllProjectDataSources(callback){
    var projectDataSources=this.project.datasources,
        loadThese=[]
    ;
    for(var i=0;i<projectDataSources.length;i++){
        if(!isc.DS.get(projectDataSources[i].dsName))loadThese.add(projectDataSources[i].dsName);
    }
    if(loadThese.length>0){
        isc.DS.load(loadThese,callback);
    }else{
        this.fireCallback(callback);
    }
}
,isc.A.getRecentProjects=function isc_VisualBuilder_getRecentProjects(){
    if(!this.recentProjects)this.recentProjects=[];
    return this.recentProjects;
}
,isc.A.setRecentProjects=function isc_VisualBuilder_setRecentProjects(projects){
    var recent=this.getRecentProjects();
    recent.setLength(0);
    recent.addList(projects);
}
,isc.A.removeRecentProject=function isc_VisualBuilder_removeRecentProject(fileName){
    var recentProjects=this.recentProjects;
    if(recentProjects){
        var match=recentProjects.find("projectFileName",fileName);
        if(match){
            recentProjects.remove(match);
            this.autoSaveCurrentSettings();
        }
    }
}
,isc.A.updateRecentProjects=function isc_VisualBuilder_updateRecentProjects(){
    var projectFileName=this.getProjectFileName();
    if(!projectFileName||projectFileName==this.singleScreenModeProjectFileName)return;
    var projects=this.getRecentProjects();
    var currentIndex=projects.findIndex("projectFileName",projectFileName);
    if(currentIndex!=-1)projects.removeAt(currentIndex);
    projects.addAt({
        projectFileName:projectFileName,
        projectOwnerId:this.getProjectOwnerId(),
        title:this.getProjectDisplayName()
    },0);
    if(projects.getLength()>this.recentProjectsCount){
        projects.setLength(this.recentProjectsCount);
    }
    this.currentSettings.recentProjects=projects;
    this.autoSaveCurrentSettings();
}
,isc.A.launchReifyPreview=function isc_VisualBuilder_launchReifyPreview(){
    var builder=this,
        project=this.project,
        screen=this.currentScreen,
        params="?reifyPreview=yes";
    var callback=function(){
        builder.reifyWindow=window.open("/tools/bmmlImporter.jsp"+params);
    };
    var offline=isc.isA.OfflineFileSource(this.screenDataSource);
    if(!offline)params+="&screenDS="+builder.screenDataSource.getID();
    if(screen.fileName){
        params+="&mockup="+screen.fileName;
        builder.cacheCurrentScreenContents();
        builder.project.saveScreenContents(screen,true,callback);
    }else{
        if(project.fileName){
            params+="&mockup="+project.fileName+
                "&projectDS="+(offline?"":builder.projectDataSource.getID());
        }
        project.autoSave(callback);
    }
}
,isc.A.launchGoToBuilder=function isc_VisualBuilder_launchGoToBuilder(){
    var builder=this,
        project=this.project,
        screen=this.currentScreen;
    if(screen==null)return;
    builder.cacheCurrentScreenContents();
    if(builder.openFullBuilderSeparately){
        this.fireCallback("_launchGoToBuilder");
    }else if(screen.fileName){
        builder.project.saveScreenContents(screen,true,"_launchGoToBuilder");
    }else{
        project.autoSave("_launchGoToBuilder");
    }
}
,isc.A._launchGoToBuilder=function isc_VisualBuilder__launchGoToBuilder(){
    var builder=this,
        project=this.project,
        screen=this.currentScreen,
        importer=isc.MockupImporter.create(),
        separateWindow=builder.openFullBuilderSeparately
    ;
    importer.reifyComponentXml(screen.contents,function(xmlContent,layout){
        isc.DMI.callBuiltin({
            methodName:"xmlToJS",
            "arguments":xmlContent,
            callback:function(rpcResponse,data,rpcRequest){
                var origAutoDraw=isc.Canvas.getPrototype().autoDraw;
                isc.setAutoDraw(false);
                var topLevelIds=[];
                isc.Class.globalEvalAndRestore(rpcResponse.data+"; getTopLevelWidgets()",
                    null,null,{getTopLevelWidgets:function(){
                        for(var i=0;i<layout.length;i++){
                            var layoutID=layout[i].ID||layout[i].autoID;
                            if(layout[i]._constructor!="ValuesManager"&&
                                layout[i]._constructor!="MockDataSource"&&
                                window[layoutID].parentElement==null)
                            {
                                window[layoutID].destroy();
                                topLevelIds.add(layoutID);
                            }
                        }
                }});
                xmlContent+=isc.MockupImporter.getDataViewXml(topLevelIds);
                isc.setAutoDraw(origAutoDraw);
                project.saveGoToBuilderScreen("New Screen",xmlContent,
                                              function(response,data){
                    var uriBuilder=isc.URIBuilder.create(builder.fullBuilderURL||
                                                           window.location.href);
                    uriBuilder.setQueryParam("currentScreen",data.fileName);
                    uriBuilder.setQueryParam("mockups",0);
                    if(separateWindow)window.open(uriBuilder.uri);
                    else window.location.assign(uriBuilder.uri);
                });
            }
        });
    });
}
,isc.A.updateReifyPreviewSoon=function isc_VisualBuilder_updateReifyPreviewSoon(){
    var builder=this;
    if(builder.pendingActionOnPause("updateReify"))return;
    var reifyWindow=builder.reifyWindow;
    builder.fireOnPause("updateReify",function(){
        if(reifyWindow.closed){
            delete builder.reifyWindow;
        }else{
            reifyWindow.scheduleReifyUpdate();
        }
    },this._updateReifyPreviewDelay,"return !isc.EH.dragging");
}
);
isc.evalBoundary;isc.B.push(isc.A.confirmMenuAction=function isc_VisualBuilder_confirmMenuAction(actionId,actionName,actionMethod,actionWidth,message){
    var dialog,builder=this;
    var confirm=this.getHelpDialogEnabled(actionId);
    if(!confirm)return this[actionMethod]();
    var form=isc.DynamicForm.create({
        width:500,autoDraw:false,
        bottomPadding:5,topPadding:5,cellPadding:5,
        numCols:3,colWidths:[50,actionWidth,"*"],
        items:[{showTitle:false,editorType:"CanvasItem",height:50,
                 icons:[{width:32,height:32,src:"[SKIN]/Dialog/confirm.png"}]},
                {name:"message",editorType:"StaticTextItem",showTitle:false,
                 colSpan:2,cellHeight:50,height:50,
                 value:message},
                {editorType:"ButtonItem",title:"Cancel",width:125,
                 align:"right",endRow:false,colSpan:2,
                 click:function(){dialog.destroy();}},
                {editorType:"ButtonItem",title:actionName,width:125,
                 startRow:false,
                 click:function(){
                     builder[actionMethod]();
                     dialog.destroy();
                 }},
                {name:"hide",editorType:"CheckboxItem",
                 title:"Don't show this message again",
                 colSpan:2,
                 changed:function(form,item,value){
                     builder.setHelpDialogEnabled(actionId,!value);
                 },
                 showIf:function(){
                     return!builder.hostedmode||!builder.userIsGuest();
                 }}]
    });
    dialog=isc.Window.create({
        title:"Confirm",autoSize:true,items:[form],autoCenter:true
    });
    dialog.show();
}
,isc.A.confirmReifyPreview=function isc_VisualBuilder_confirmReifyPreview(){
    this.confirmMenuAction(this._confirmReifyPreviewId,"Reify now","launchReifyPreview",200,
        "Reify Preview will analyze your mockup and produce a screen from it, and show that "+
                           "screen in a new browser window.  If you continue to change your "+
                           "mockup, the Reify Preview window will automatically update.");
}
,isc.A.confirmOpenInBuilder=function isc_VisualBuilder_confirmOpenInBuilder(){
    this.confirmMenuAction(this._confirmOpenInBuilderId,"Go to Visual Builder",
                           "launchGoToBuilder",235,"Visual Builder is a tool that allows "+
                           "you to add more advanced capabilities to your mockup.<p>"+
                           "You can use Visual Builder to take the next steps required to "+
                           "turn your mockup into a working application, or just to produce "+
                           "a high-fidelity mockup for usability or user acceptance testing.");
}
,isc.A.warnOnce=function isc_VisualBuilder_warnOnce(dialogId,message,callback,properties){
    var confirm=this.getHelpDialogEnabled(dialogId);
    if(!confirm)return callback(true);
    if(!properties)properties={};
    if(!properties.icon)properties.icon=isc.Dialog.getInstanceProperty("warnIcon");
    if(!properties.title)properties.title=isc.Dialog.WARN_TITLE;
    var dialog=isc.ConfirmOnceDialog.create(isc.addProperties({
        builder:this,
        dialogId:dialogId,
        message:message,
        buttons:[isc.Dialog.CANCEL,isc.Dialog.OK],
        autoFocusButton:1,
        callback:callback
    },properties));
    dialog.show();
}
,isc.A.setHelpDialogEnabled=function isc_VisualBuilder_setHelpDialogEnabled(dialogId,value,callback){
    var settings=this.currentSettings,
        helpDialogs=settings.helpDialogs||{}
    ;
    if(this.hostedMode&&this.userIsGuest()){
        this.logInfo("setHelpDialogEnabled(): settings may not be changed by guest");
        return;
    }
    if(!isc.isA.String(dialogId)){
        this.logWarn("setHelpDialogEnabled() called with an invalid dialogId: "+dialogId);
        return;
    }
    helpDialogs[dialogId]=!!value;
    settings.helpDialogs=helpDialogs;
    this.autoSaveCurrentSettings(callback);
}
,isc.A.getHelpDialogEnabled=function isc_VisualBuilder_getHelpDialogEnabled(dialogId){
    var settings=this.currentSettings,
        helpDialogs=settings.helpDialogs||{}
    ;
    var enabled=helpDialogs[dialogId];
    if(enabled!=null&&isc.isA.String(enabled))enabled=(enabled.toLowerCase()=="true");
    return(this.hostedMode&&this.userIsGuest())||enabled!=false;
}
,isc.A.showAddScreenGroupUI=function isc_VisualBuilder_showAddScreenGroupUI(parent){
    var group=this.project.addGroup(parent,"New Group");
    var index=this.screenList.getRecordIndex(group);
    this.screenList.delayCall("startEditing",[index,0]);
}
,isc.A.loadScreen=function isc_VisualBuilder_loadScreen(parent,fileName,title,actionButtonTitle,callback,usageId){
    var self=this;
    if(!callback){
        callback=function(dsResponse,data,dsRequest){
            if(!fileName){
                fileName=data.fileName;
                data=data.fileContents;
            }
            var screen=self.project.addScreen(parent,fileName,fileName,data,false);
            self.setCurrentScreen(screen);
            if(usageId){
                self._addUsageRecord(usageId,screen.title,self.getProjectDisplayName());
            }
        };
    }
    if(fileName){
        var ownerId=this.project.getOwnerId();
        this.screenDataSource.getFile({
            ownerId:ownerId,
            fileName:fileName,
            fileType:'ui',
            fileFormat:'xml'
        },callback,{operationId:(ownerId?"allOwners":null)});
    }else{
        if(!this.loadScreenDialog){
            this.loadScreenDialog=this.createAutoChild('loadScreenDialog',{
                dataSource:this.screenDataSource
            });
        }
        if(title)this.loadScreenDialog.setTitle(title);
        if(actionButtonTitle)this.loadScreenDialog.setActionButtonTitle(actionButtonTitle);
        this.loadScreenDialog.showLoadFileUI(callback);
    }
}
,isc.A.showCopyExistingScreenUI=function isc_VisualBuilder_showCopyExistingScreenUI(parent){
    var self=this;
    this.loadScreen(parent,null,"Copy Screen","Copy Screen",function(dsResponse,data,dsRequest){
        var fileName=data.fileName,
            data=data.fileContents
        ;
        self.project.getUniqueScreenCopyName(fileName,function(uniqueFileName){
            var screen=self.project.addScreen(parent,uniqueFileName,uniqueFileName,data,false);
            self.project.saveScreenContents(screen);
            self.setCurrentScreen(screen);
        });
    });
}
,isc.A.showLoadSharedScreenUI=function isc_VisualBuilder_showLoadSharedScreenUI(parent){
    var self=this;
    this.warnOnce(this._loadSharedScreenId,
        "Since the selected screen will be shared, changes made by any user can affect multiple projects.",
        function(value){
            if(value){
                self.loadScreen(parent,null,"Load Shared Screen","Load Screen",null,
                                "addSharedScreen");
            }
        },{
            buttons:[
                isc.Dialog.CANCEL,
                {title:"Continue",width:75,overflow:"visible",
                    click:function(){this.topElement.okClick()}
                }
            ],
            autoFocusButton:1
        }
    );
}
,isc.A.deleteScreen=function isc_VisualBuilder_deleteScreen(screen){
    var self=this;
    this.screenDataSource.removeFile({
        fileName:screen.fileName,
        fileType:'ui',
        fileFormat:'xml'
    },function(){
        self.project.removeScreen(screen);
        isc.Notify.addMessage("The screen "+screen.fileName+" has been successfully deleted.");
    });
    this._addUsageRecord("deleteScreen",screen.title,this.getProjectDisplayName());
}
,isc.A.removeEmbeddedDataSources=function isc_VisualBuilder_removeEmbeddedDataSources(){
    if(!this.projectComponents)return;
    var editNodes=this.projectComponents.getEditContext().getEditNodeArray();
    if(editNodes&&editNodes.length>0){
        for(var i=0;i<editNodes.length;i++){
            var node=editNodes[i];
            if(isc.isA.MockDataSource(node.liveObject)){
                var dsPaletteNode=this.dataSourceList.data.find("ID",node.ID);
                if(dsPaletteNode&&dsPaletteNode.referenceInProject==false){
                    this.dataSourceList.removeData(dsPaletteNode);
                }
            }
        }
    }
}
,isc.A.cacheCurrentScreenContents=function isc_VisualBuilder_cacheCurrentScreenContents(){
    if(this.currentScreen==null)return;
    this.currentScreen.contents=this.getUpdatedSource();
}
,isc.A.setCurrentScreen=function isc_VisualBuilder_setCurrentScreen(newScreen){
    var oldScreen=this.currentScreen,
        oldMockupMode=(oldScreen?this.currentScreen.mockupMode:null)
    ;
    if(oldScreen==newScreen)return;
    this.cacheCurrentScreenContents();
    this.removeEmbeddedDataSources();
    this.currentScreen=newScreen;
    this.resetUndoPosition();
    if(this.savingScreenLabel)this.savingScreenLabel.setContents("");
    if(!this.projectComponentsMenu)this.addChildren();
    if(newScreen){
        if(!this._screenSet){
            this._screenSet=true;
            this._addUsageRecord("appStart",this.getProjectFileName(),newScreen.title);
        }
        if(newScreen.contents){
            this.withoutDirtyTracking(function(){
                this.projectComponents.destroyAll();
            });
            this.setScreenContents(newScreen.contents,oldMockupMode);
        }else{
            this.hideInstructions();
            this._loadingCurrentScreen=true;
            this.withoutDirtyTracking(function(){
                this.clearScreenUI();
            });
            var self=this;
            this.project.fetchScreenContents(newScreen,function(contents){
                if(contents){
                    self.withoutDirtyTracking(function(){
                        self.projectComponents.destroyAll();
                    });
                    self.setScreenContents(contents,oldMockupMode);
                    if(newScreen.fileName&&!self.project.isReadOnly()){
                        self.savingScreenLabel.setContents("All changes saved");
                    }
                }else{
                    self.updateScreenTitle();
                    self.showScreenUI();
                    self.refreshLibraryComponents();
                    self.updateProjectMenuControl();
                    self.updateRunMenuControl();
                    self.showInstructions();
                    self.updateUsersRolesMenuControl();
                    self.project.setScreenDirty(newScreen,true);
                }
                self._loadingCurrentScreen=false;
                if(self._isNewProject){
                    self._newProjectReady();
                }
                if(self._loadAllProjectDataSources){
                    self.slowLoadAllProjectDataSources(function(){
                        isc.clearPrompt();
                    });
                }
            });
        }
    }else{
        this.show();
        this.updateScreenTitle();
        if(self._loadAllProjectDataSources){
            self.slowLoadAllProjectDataSources(function(){
                isc.clearPrompt();
            });
        }
    }
    this.project.setCurrentScreenFileName(newScreen.fileName);
    this.project.setCurrentScreenId(newScreen.id);
    this.updateProjectName();
    if(this.screenList)this.screenList.selectSingleRecord(newScreen);
    this.updateRecentScreens();
    if(!this._loadingCurrentScreen&&this._isNewProject){
        this._newProjectReady();
    }
}
,isc.A._newProjectReady=function isc_VisualBuilder__newProjectReady(){
    if(!this._isNewProject)return;
    this._isNewProject=false;
    isc.Notify.addMessage("New Project created");
    this.projectName.editProxy.startInlineEditing();
}
,isc.A.setScreenContents=function isc_VisualBuilder_setScreenContents(contents,oldMockupMode,jsContents){
    var _this=this,
        screenContents=jsContents||contents,
        getPaletteNodesFunc=(jsContents?"getPaletteNodesFromJS":"getPaletteNodesFromXML")
    ;
    this.projectComponents[getPaletteNodesFunc](screenContents,function(paletteNodes){
        var firstNode=(paletteNodes&&paletteNodes.length>0?paletteNodes[0]:null),
            lastNode=(paletteNodes&&paletteNodes.length>0?paletteNodes[paletteNodes.length-1]:null)
        ;
        if((firstNode&&firstNode.type=="MockupContainer")||
            (lastNode&&lastNode.type=="MockupContainer"))
        {
            var containerNode=(firstNode.type=="MockupContainer"?firstNode:lastNode),
                defaults=containerNode.defaults,
                nodeList=paletteNodes
            ;
            if(defaults.dataSources||defaults.components){
                nodeList=[];
                nodeList.addList(defaults.dataSources);
                nodeList.addList(defaults.components);
            }
            var nodes=[];
            for(var i=0;i<nodeList.length;i++){
                var node=nodeList[i],
                    type=node.type||node._constructor
                ;
                if(type&&type!="MockupContainer"){
                    var defaults=(node.defaults?node.defaults:isc.addProperties({},node));
                    nodes.add({
                        type:type,
                        defaults:defaults
                    });
                }
            }
            _this.mockupMode=_this.currentScreen.mockupMode=true;
            _this.refreshLibraryComponents(function(){
                _this.updateScreenTitle();
                if(oldMockupMode!=_this.currentScreen.mockupMode){
                    _this.showScreenUI();
                }
                if(nodes)_this.projectComponents.addFromPaletteNodes(nodes);
                _this.updateSelectionActionButtons();
                _this.promptUserToCopyProject();
                if(_this.initialVersion){
                    _this.revertScreen(_this.currentScreen,_this.initialVersion);
                    delete _this.initialVersion;
                }
            });
        }else{
            _this.mockupMode=_this.currentScreen.mockupMode=false;
            _this.refreshLibraryComponents(function(){
                _this.updateScreenTitle();
                if(oldMockupMode!=_this.currentScreen.mockupMode){
                    _this.showScreenUI();
                }
                if(paletteNodes){
                    _this.projectComponents.addFromPaletteNodes(paletteNodes);
                    _this.withoutDirtyTracking(function(){
                        _this.projectComponents.getEditContext().screenLoadComplete();
                    });
                    var loadingErrors=_this.projectComponents.getEditContext().getLoadingErrors();
                    if(loadingErrors){
                        var message="Screen loaded with errors:<ul>";
                        for(var i=0;i<loadingErrors.length;i++){
                            message+="<li>"+loadingErrors[i]+"</li>";
                        }
                        isc.Notify.addMessage(message,null,null,{canDismiss:true,duration:0});
                    }
                    var editNodes=_this.projectComponents.getEditContext().getEditNodeArray();
                    if(editNodes&&editNodes.length>0){
                        for(var i=0;i<editNodes.length;i++){
                            var node=editNodes[i];
                            if(isc.isA.Canvas(node.liveObject)){
                                if(_this.editingOn){
                                    _this.projectComponents.getEditContext().selectSingleEditNode(node);
                                }
                                _this.projectComponents.scrollRecordIntoView(_this.projectComponents.getRecordIndex(node));
                                if(node.type==_this.initialComponent.type){
                                    node.showDropIcon=true;
                                }
                                break;
                            }
                        }
                    }
                }
                _this.updateSelectionActionButtons();
                if(!_this.canAddRootComponents){
                    var rootEditNode=_this.projectComponents.getRootEditNode(),
                        children=_this.projectComponents.getEditNodeTree().getChildren(rootEditNode)
                    ;
                    for(var i=0;i<children.length;i++){
                        var child=children[i];
                        if(isc.isA.Canvas(child)){
                            child._canRemove=false;
                            _this.projectComponents.markForRedraw();
                            break;
                        }
                    }
                }
                var editNodes=_this.projectComponents.getEditContext().getEditNodeArray();
                if(editNodes)editNodes.map(function(node){
                    if(node.isLoaded&&node.liveObject&&isc.isA.DataSource(node.liveObject)){
                        var ds=node.liveObject;
                        var existingNode=_this.dataSourceList.data.find("ID",ds.name);
                        if(existingNode&&existingNode.referenceInProject!=false){
                            node.referenceInProject=true;
                        }
                    }
                });
                _this.addCurrentScreenMockDataSourcesToList();
                _this.promptUserToCopyProject();
                if(_this.initialVersion){
                    _this.revertScreen(_this.currentScreen,_this.initialVersion);
                    delete _this.initialVersion;
                }
            });
        }
        _this.updateRunMenuControl();
    });
}
,isc.A.promptUserToCopyProject=function isc_VisualBuilder_promptUserToCopyProject(){
    var project=this.project;
    if(project.promptToCopy&&project.isReadOnly()){
        isc.warn("This project is read-only. If you would like to edit, please make a copy.",function(value){
            if(value){
                project.duplicate();
                return;
            }
        },{
            buttons:[
                isc.Dialog.CANCEL,
                {title:"Copy Project",width:75,overflow:"visible",
                    click:function(){this.topElement.okClick()}
                }
            ],
            autoFocusButton:1
        });
    }
    delete project.promptToCopy;
}
,isc.A.addCurrentScreenMockDataSourcesToList=function isc_VisualBuilder_addCurrentScreenMockDataSourcesToList(){
    var _this=this;
    var editNodes=_this.projectComponents.getEditContext().getEditNodeArray();
    var addedDSNames=[];
    if(editNodes)editNodes.map(function(node){
        if(node.isLoaded&&node.liveObject&&isc.isA.DataSource(node.liveObject)){
            var ds=node.liveObject;
            var existingNode=_this.dataSourceList.data.find("ID",ds.name);
            if(!existingNode&&!addedDSNames.contains(ds.name)){
                var dsType=(isc.isA.MockDataSource(ds)?"MockDataSource":ds.serverType);
                var dsNode=_this.projectComponents.editContext.makeDSPaletteNode(ds.name,dsType);
                dsNode.referenceInProject=false;
                _this.dataSourceList.addData(dsNode);
                addedDSNames.add(ds.name);
            }
        }
    });
}
,isc.A.updateScreenProperties=function isc_VisualBuilder_updateScreenProperties(screen){
    if(this.screenList){
        var index=this.screenList.getRecordIndex(screen);
        if(index>=0){
            this.screenList.refreshRow(index);
            this.screenList.applyHilites();
        }
    }
    this.updateScreenTitle();
}
,isc.A.getCurrentScreenTitle=function isc_VisualBuilder_getCurrentScreenTitle(){
    var title="Untitled screen";
    if(this.currentScreen&&this.currentScreen.title){
        title=this.currentScreen.title;
        if(title.endsWith(".xml"))title=title.slice(0,-4);
    }
    return title;
}
,isc.A.updateScreenTitle=function isc_VisualBuilder_updateScreenTitle(){
    if(this.middleStack){
        var mockupMode=this.getScreenMockupMode(this.currentScreen),
            title=(mockupMode&&this.singleScreenMode?"Mockup":this.getCurrentScreenTitle()),
            canCollapse=(!mockupMode&&!this.singleScreenMode)
        ;
        var sectionNumber=this.middleStack.getSectionNumber("applicationSection");
        if(canCollapse!=this.middleStack.sections[sectionNumber].canCollapse&&this.middleStack.isDrawn()){
            var header=this.middleStack.getSectionHeader(sectionNumber),
                section=this.middleStack.sections[sectionNumber],
                members=header.controlsLayout.getMembers(),
                previewArea=section.items[0],
                controls=[]
            ;
            for(var i=members.length-1;i>=0;i--){
                controls.addAt(members[i],0);
                header.controlsLayout.removeMember(members[i]);
            }
            section.items=[];
            this.middleStack.removeSection(section);
            this.middleStack.addSection({title:title,autoShow:true,ID:"applicationSection",
                canCollapse:canCollapse,
                items:[previewArea],
                controls:controls
            },0);
        }else{
            this.middleStack.setSectionTitle("applicationSection",title);
            this.middleStack.getSections()[0].canCollapse=canCollapse;
        }
        this.enableScreenTitleEditing();
    }
    if(this.runButton)this.runButton.setDisabled(!this._runProjectEnabled());
}
,isc.A.enableScreenTitleEditing=function isc_VisualBuilder_enableScreenTitleEditing(){
    var self=this,
        sectionHeader=this.middleStack.getSectionHeader("applicationSection")
    ;
    var editTarget=isc.isA.SectionHeaderLayout(sectionHeader)
                        ?sectionHeader.titleLabel:sectionHeader;
    if(!this.currentScreen.fileName||
        this.currentScreen.oldVersionLoaded||
        this.project.isReadOnly())
    {
        if(editTarget&&editTarget.editNode){
            editTarget.setEditMode(false,editTarget.editContext,editTarget.editNode);
        }
        return;
    }
    var editContext=editTarget.editContext,
        editNode=editTarget.editNode
    ;
    if(!editContext){
        editContext=isc.EditContext.create({
            rootComponent:{type:"Canvas"},
            rootLiveObject:isc.Canvas.create({left:-5000,autoDraw:false}),
            enableInlineEdit:true,
            editNodeUpdated:function(editNode,editContext,modifiedProperties){
                if(modifiedProperties.contains("title")){
                    var builder=self,
                        project=builder.project,
                        oldFileName=builder.currentScreen.title,
                        newFileName=editNode.defaults.title
                    ;
                    if(oldFileName!=newFileName){
                        if(newFileName==null||newFileName==""){
                            editContext.setNodeProperties(editNode,{title:oldFileName});
                        }else{
                            project.screenDataSource.getFile({
                                ownerId:project.getOwnerId(),
                                fileName:newFileName,
                                fileType:'ui',
                                fileFormat:'xml'
                            },function(dsResponse,data,dsRequest){
                                if(dsResponse.data&&dsResponse.data.length>0){
                                    var revisedFileName=newFileName+" ("+project.fileName+")";
                                    var fileSpec=dsResponse.data[0],
                                        lastUsedInProject=fileSpec.lastUsedInProject
                                    ;
                                    if(lastUsedInProject&&lastUsedInProject==project.fileName){
                                        isc.warn("Cannot rename screen: "+newFileName+" already exists.");
                                        editContext.setNodeProperties(editNode,{title:oldFileName});
                                        return;
                                    }
                                    var message="You already have screen called \""+newFileName+
                                        "\""+(lastUsedInProject?", last used in project \""+
                                                lastUsedInProject+"\"":"")+
                                        ".<P>Would you like to name your screen \""+
                                        revisedFileName+"\" instead?"
                                    ;
                                    isc.warn(message,function(value){
                                        if(value){
                                            project.renameScreenTo(revisedFileName);
                                            return;
                                        }
                                        editContext.setNodeProperties(editNode,{title:oldFileName});
                                    },{
                                        buttons:[
                                            isc.Dialog.CANCEL,
                                            isc.Dialog.OK
                                        ],
                                        autoFocusButton:1
                                    });
                                    return;
                                }
                                project.renameScreenTo(newFileName);
                            });
                        }
                    }
                }
            }
        });
        var paletteNode={
            type:"SectionStackSection",
            liveObject:editTarget,
            editProxyProperties:{
                getOverrideProperties:function(){
                    var properties=this.Super("getOverrideProperties",arguments);
                    isc.addProperties(properties,{
                        prompt:"Double-click to rename screen",
                        hoverStyle:"darkHover",
                        hoverWrap:false,
                        hoverAutoFitWidth:false
                    });
                    return properties;
                }
            }
        };
        editNode=editContext.makeEditNode(paletteNode);
    }
    editContext.enableEditing(editNode);
}
,isc.A.getScreenMockupMode=function isc_VisualBuilder_getScreenMockupMode(screen){
    if(!screen)return this.mockupMode;
    var mockupMode=(screen.mockupMode!=null?screen.mockupMode:this.mockupMode);
    if(isc.isA.String(mockupMode))mockupMode=(mockupMode=="true");
    return mockupMode;
}
,isc.A.saveScreenAs=function isc_VisualBuilder_saveScreenAs(screen,callback){
    this.cacheCurrentScreenContents();
    var self=this;
    this.project.saveScreenAs(screen,function(newScreen){
        if(callback){
            self.fireCallback(callback);
        }else if(screen==self.currentScreen){
            self.setCurrentScreen(newScreen);
        }
    });
}
,isc.A.revertScreen=function isc_VisualBuilder_revertScreen(screen,version,useAsCurrent){
    if(screen==this.currentScreen)this.cacheCurrentScreenContents();
    var oldContents=screen.contents;
    delete screen.contents;
    var self=this;
    this.project.fetchScreenContents(screen,function(contents){
        if(contents){
            if(screen==self.currentScreen){
                self.withoutDirtyTracking(function(){
                    self._revertingScreen=true;
                    self.projectComponents.destroyAll();
                    delete self._revertingScreen;
                });
                self.projectComponents.addPaletteNodesFromXML(contents);
                if(version!=null&&!useAsCurrent){
                    isc.Notify.addMessage("You are viewing an older version of this screen. "+
                        "Save to create a new screen and continue design without the changes "+
                        "made in subsequent versions.");
                }
            }
            screen.oldVersionLoaded=(!useAsCurrent&&version!=null);
            if(self.savingScreenLabel){
                if(self.project.isReadOnly()){
                    self.savingScreenLabel.setContents("");
                }else if(screen.oldVersionLoaded){
                    self.savingScreenLabel.setContents(version.toShortDateTime());
                }else{
                    self.savingScreenLabel.setContents("All changes saved");
                }
            }
        }else{
            isc.say("Reversion failed.");
            screen.contents=oldContents;
        }
    },version,useAsCurrent);
}
,isc.A.loadProjectScreen=function isc_VisualBuilder_loadProjectScreen(projectFileName,screenFileName,screenVersion){
    this.initialScreen=screenFileName;
    this.initialVersion=screenVersion;
    this.loadProject(projectFileName);
}
,isc.A.loadViewFromXML=function isc_VisualBuilder_loadViewFromXML(screen,contents){
    this.cacheCurrentScreenContents();
    screen.contents=contents;
    this.project.setScreenDirty(screen,false);
    var self=this;
    this.withoutDirtyTracking(function(){
        self.projectComponents.destroyAll();
    });
    var oldMockupMode=(this.currentScreen?this.currentScreen.mockupMode:null);
    this.setScreenContents(screen.contents,oldMockupMode);
}
,isc.A._exportProjectReadmeForSC=function isc_VisualBuilder__exportProjectReadmeForSC(){
    return"This is an export of a Reify (Reify.com) project intended for use with SmartClient.  If you are instead using\n"+
        "SmartGWT, please return to Reify and export in SmartGWT format.\n\n"+
        "Please read the Reify for Developers overview to understand what to do with this export:\n\n"+
        "\thttps://www.smartclient.com/smartclient-latest/isomorphic/system/reference/?id=group..reifyForDevelopers\n\n"+
        "If all you want to do is see your Reify project running outside of Reify.com, you can just download a standard\n"+
        "SmartClient SDK from SmartClient.com, start the included Tomcat server, overlay the files from this export\n"+
        "onto the \"isomorphicSDK\" directory structure, and navigate to the .jsp from this export, which should be\n"+
        "directly in the isomorphicSDK directory if you have overlaid files properly.\n\n"+
        "The same approach will work for any existing SmartClient project if you overlay the files onto your webroot,\n"+
        "assuming that you have not, for whatever reason, disabled the default JSP tags from the SDK, or disabled\n"+
        "the ProjectLoader or ScreenLoader servlets that are present by default in web.xml.\n\n"+
        "Running in this mode will use the MockDataSources from your Reify project, so reloading the page will drop\n"+
        "any changes made to data.  To actually deploy your application with persistent storage, those MockDataSources\n"+
        "will need to be replaced with real DataSources - the Reify for Developers overview linked above explains\n"+
        "this in detail.\n\n"+
        "Enjoy!\n\n"+
        "\t- the Reify.com team";
}
,isc.A._exportProjectReadmeForSGWT=function isc_VisualBuilder__exportProjectReadmeForSGWT(){
    return"This is an export of a Reify (Reify.com) project intended for use with SmartGWT.  If you are instead using\n"+
        "SmartClient, please return to Reify and export in SmartClient format.\n\n"+
        "Please read the Reify for Developers overview to understand what to do with this export:\n\n"+
        "\thttps://smartclient.com/smartgwtee-latest/javadoc/com/smartgwt/client/docs/ReifyForDevelopers.html\n\n"+
        "If all you want to do is see your Reify project running outside of Reify.com, you can just download a standard\n"+
        "SmartGWT SDK from SmartClient.com, set up a project, overlay the files from this export onto the \"war\"\n"+
        "folder of your GWT project, and navigate to the .html file from this export, which should be right next to\n"+
        "your host .html file if you have overlaid files properly.\n\n"+
        "The same approach will work for any existing SmartGWT project, assuming that you have not, for whatever\n"+
        "reason, disabled the ProjectLoader or ScreenLoader servlets that are included in the web.xml file provided\n"+
        "with our sample SmartGWT projects.\n\n"+
        "Running in this mode will use the MockDataSources from your Reify project, so reloading the page will drop\n"+
        "any changes made to data.  To actually deploy your application with persistent storage, those MockDataSources\n"+
        "will need to be replaced with real DataSources - the Reify for Developers overview linked above explains\n"+
        "this in detail.\n\n"+
        "Enjoy!\n\n"+
        "\t- the Reify.com team";
}
,isc.A._exportProjectScreenAsJSP=function isc_VisualBuilder__exportProjectScreenAsJSP(projectName,currentScreen){
    var _builder=this;
    var additionalModules="Drawing,Analytics,Workflow";
    if(currentScreen==this.currentScreen)this.cacheCurrentScreenContents();
    var page='<%@ page contentType="text/html; charset=UTF-8"%>\n'+
                '<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>\n'+
                '<HTML><HEAD><TITLE>'+
                currentScreen.title+
                '</TITLE>\n'+
                '</HEAD><BODY>\n'+
                '<SCRIPT>\n'+
                '<isomorphic:loadISC skin="'+
                _builder.skin+
                '"'+
                (_builder.modulesDir?' modulesDir="'+_builder.modulesDir+'"':"")+
                (additionalModules?(' includeModules="'+additionalModules+'"'):"")+
                '/>\n'+
                '</SCRIPT>\n';
    for(var i=0;i<_builder.globalDependencies.deps.length;i++){
        var dep=_builder.globalDependencies.deps[i];
        if(dep.type=="js"){
            page+='<SCRIPT SRC='+
            (dep.url.startsWith("/")?
                _builder.webRootRelWorkspace:
                _builder.basePathRelWorkspace+"/"
                )+
            dep.url+
            '></SCRIPT>\n';
        }else if(dep.type=="schema"){
            page+='<SCRIPT>\n<isomorphic:loadDS name="'+dep.id+'"/></SCRIPT>\n';
        }else if(dep.type=="ui"){
            page+='<SCRIPT>\n<isomorphic:loadUI name="'+dep.id+'"/></SCRIPT>\n';
        }else if(dep.type=="css"){
            page+='<LINK REL="stylesheet" TYPE="text/css" HREF='+
            (dep.url.startsWith("/")?
                _builder.webRootRelWorkspace:
                _builder.basePathRelWorkspace+"/"
                )+
            dep.url+
            '>\n';
        }
    }
    var scriptData;
    if(projectName!=null){
        var currentScreenName=(currentScreen.fileName&&currentScreen.fileName.length>0?currentScreen.title:null);
        scriptData='<isomorphic:loadProject name="'+projectName+'" '+(currentScreenName?'currentScreenName="'+currentScreenName+'" ':'')+' />\n';
    }else{
        scriptData='<isomorphic:XML>\n'+currentScreen.contents+'\n</isomorphic:XML>';
    }
    page+='<SCRIPT>\n'+
            'isc.Page.setAppImgDir("'+_builder.basePathRelWorkspace+'/graphics/");\n'+
            scriptData+
            '</SCRIPT>\n'+
            '</BODY></HTML>';
    return page;
}
,isc.A._exportProjectAsHTML=function isc_VisualBuilder__exportProjectAsHTML(projectName,currentScreen,projectLoaderPath){
    if(currentScreen==this.currentScreen)this.cacheCurrentScreenContents();
    var currentScreenName=(currentScreen.fileName&&currentScreen.fileName.length>0?currentScreen.title:null);
    var parts=projectLoaderPath.split('/'),
        depth=parts.length-1,
        relativePathParts=[]
    ;
    for(var i=0;i<depth;i++){
        relativePathParts.add('..');
    }
    var relativePath=relativePathParts.join("/");
    if(relativePath.length>0)relativePath+="/";
    var page='<!DOCTYPE html>\n'+
                '<HTML><HEAD>\n'+
                '<META http-equiv="content-type" content="text/html; charset=UTF-8">\n'+
                '<TITLE>'+currentScreen.title+'</TITLE>\n'+
                '<SCRIPT>window.isomorphicDir = "isomorphic/"; </SCRIPT>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Core.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Foundation.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Containers.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Grids.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Forms.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_DataBinding.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Calendar.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Drawing.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Analytics.js"></script>\n'+
                '<script type="text/javascript" src="isomorphic/system/modules/ISC_Workflow.js"></script>\n'+
                '<SCRIPT SRC="isomorphic/skins/Tahoe/load_skin.js"></SCRIPT>\n'+
                '</HEAD><BODY>\n'+
                '<SCRIPT src="isomorphic/projectLoader?projectName='+projectName+
                    (currentScreenName?'&currentScreenName='+currentScreenName:'')+'"></SCRIPT>\n'+
                '</BODY></HTML>\n';
    return page;
}
,isc.A.exportScreenAsJSP=function isc_VisualBuilder_exportScreenAsJSP(screen){
    var _builder=this,
        page=this._exportProjectScreenAsJSP(null,screen);
    this.addAutoChild("jspFileSource");
    this.jspFileSource.showSaveFileUI(page,function(dsResponse,data,dsRequest){
        if(!isc.isAn.Array(data))data=[data];
        var url=window.location.href;
        if(url.indexOf("?")>0)url=url.substring(0,url.indexOf("?"));
        url=url.substring(0,url.lastIndexOf("/"));
        url+=(url.endsWith("/")?"":"/")+_builder.workspaceURL+data[0].name;
        isc.say(
            "Your screen can be accessed at:<P>"+
            "<a target=_blank href='"+
            url+"'>"+url+"</a>"
        );
    });
}
,isc.A.getRecentScreens=function isc_VisualBuilder_getRecentScreens(){
    if(!this.recentScreens)this.recentScreens=[];
    return this.recentScreens;
}
,isc.A.clearRecentScreens=function isc_VisualBuilder_clearRecentScreens(){
    this.recentScreens=null;
}
,isc.A.updateRecentScreens=function isc_VisualBuilder_updateRecentScreens(){
    var screens=this.getRecentScreens();
    var currentIndex=screens.findIndex("screen",this.currentScreen);
    if(currentIndex!=-1)screens.removeAt(currentIndex);
    screens.addAt({
        screenFileName:this.currentScreen.fileName,
        title:this.getCurrentScreenTitle(),
        screen:this.currentScreen
    },0);
    if(screens.getLength()>this.recentScreensCount){
        screens.setLength(this.recentScreensCount);
    }
}
,isc.A.markDirty=function isc_VisualBuilder_markDirty(){
    if(!this.disableDirtyTracking&&!isc._loadingNodeTree&&this.project){
        this.project.setScreenDirty(this.currentScreen,true);
    }
}
,isc.A.withoutDirtyTracking=function isc_VisualBuilder_withoutDirtyTracking(callback){
    try{
        this.disableDirtyTracking+=1;
        this.fireCallback(callback);
    }
    finally{
        this.disableDirtyTracking-=1;
    }
}
);
isc.evalBoundary;isc.B.push(isc.A.withoutAutoSaving=function isc_VisualBuilder_withoutAutoSaving(callback){
    var project=this.project||{};
    try{
        project.disableAutoSave+=1;
        this.fireCallback(callback);
    }
    finally{
        project.disableAutoSave-=1;
    }
}
,isc.A.previewAreaResized=function isc_VisualBuilder_previewAreaResized(){
    if(this.rootLiveObject==null)return;
    var width=this.rootLiveObject.getVisibleWidth();
    var height=this.rootLiveObject.getVisibleHeight();
    if(this.projectMenu)this.projectMenu.previewAreaResized(width,height);
}
,isc.A.getUsersRolesTitleSizes=function isc_VisualBuilder_getUsersRolesTitleSizes(){
    if(!this._usersRolesTitleSizes){
        var styleName=this.usersRolesLabel?this.usersRolesLabel.getStateName():"normal",
            shortTitle=this.getUsersRolesMenuButtonTitle(true,false),
            mediumTitle=this.getUsersRolesMenuButtonTitle(false,true),
            longTitle=this.getUsersRolesMenuButtonTitle(false,false);
        this._usersRolesTitleSizes=[
            isc.Canvas.measureContent("<nobr><b>"+shortTitle+"</b></nobr>",styleName,false,true),
            isc.Canvas.measureContent("<nobr><b>"+mediumTitle+"</b></nobr>",styleName,false,true),
            isc.Canvas.measureContent("<nobr><b>"+longTitle+"</b></nobr>",styleName,false,true)
        ];
    }
    return this._usersRolesTitleSizes;
}
,isc.A.getUsersRolesMenuButtonTitle=function isc_VisualBuilder_getUsersRolesMenuButtonTitle(short,medium){
    if(short==null&&medium==null){
        short=this.shortURTitle;
        medium=this.mediumURTitle;
    }
    var currentUser=isc.Auth.getCurrentUser(),
        superUser=isc.Auth.isSuperUser(),
        roles=isc.Auth.getRoles();
    if(currentUser==null)return"Users & Roles";
    else{
        var userTitle="";
        if(currentUser.firstName)userTitle+=currentUser.firstName;
        if(currentUser.lastName)userTitle+=" "+currentUser.lastName;
        if(!short){
            if(roles&&roles.length>0){
                userTitle+=" ("+
                    (superUser
                        ?isc.Canvas.imgHTML("[SKINIMG]actions/help.png",16,16)+" super-user"
                        :roles.join(","))
                    +")";
            }
            if(!medium){
                userTitle="Viewing as "+userTitle;
            }
        }
        return"<i>"+userTitle+"</i>";
    }
}
,isc.A.showImportDialog=function isc_VisualBuilder_showImportDialog(menu){
    if(!this._importDialog){
        this._importDialog=isc.LoadFileDialog.create({
            actionStripControls:["spacer:10","pathLabel","previousFolderButton","spacer:10",
                                  "upOneLevelButton","spacer:10","refreshButton","spacer:2"],
            directoryListingProperties:{
                canEdit:false
            },
            title:"Import File",
            rootDir:"/",
            initialDir:"[VBWORKSPACE]",
            webrootOnly:false,
            loadFile:function(fileName){
                if(fileName.match(/\.(xml|js)$/i)==null){
                    isc.say("Only JS or XML files may be imported (must end with .js or .xml");
                    return;
                }
                var self=this;
                isc.DMI.callBuiltin({
                    methodName:"loadFile",
                    arguments:[this.currentDir+"/"+fileName],
                    callback:function(rpcResponse){
                        if(fileName.match(/\.xml$/i)!=null){
                            isc.DMI.callBuiltin({
                                methodName:"xmlToJS",
                                arguments:rpcResponse.data,
                                callback:function(rpcResponse){
                                    self.fileLoaded(rpcResponse.data);
                                }
                            });
                        }else{
                            self.fileLoaded(rpcResponse.data);
                        }
                    }
                });
            },
            fileLoaded:function(jsCode){
                var screen=menu.creator.project.addScreen(null,null,"Imported Screen");
                menu.creator.setCurrentScreen(screen);
                menu.creator.projectComponents.destroyAll();
                menu.creator.projectComponents.addPaletteNodesFromJS(jsCode);
                this.hide();
            }
        });
    }else{
        this._importDialog.directoryListing.data.invalidateCache();
    }
    this._importDialog.show();
}
,isc.A.showNewDataSourceDialog=function isc_VisualBuilder_showNewDataSourceDialog(choices){
    var builder=this;
    var header=isc.Label.create({
        width:"100%",
        height:30,
        contents:"How do you want to create your DataSource?"
    });
    var valueMap=choices.map(function(choice){return choice.title;});
    var choiceForm=isc.DynamicForm.create({
        width:"100%",
        height:"*",
        numCols:1,
        items:[
            {name:"wizard",showTitle:false,type:"radioGroup",width:"*",wrap:false,
                defaultValue:valueMap[0],
                valueMap:valueMap
            }
        ]
    });
    var cancelButton=isc.IButton.create({
        autoDraw:false,
        title:"Cancel",
        width:75,
        click:function(){
            this.topElement.closeClick();
        }
    });
    var okButton=isc.IButton.create({
        autoDraw:false,
        title:"OK",
        width:75,
        click:function(){
            var wizard=choiceForm.getValue("wizard"),
                choice=choices.find("title",wizard),
                wizardRecord=choice.wizardRecord
            ;
            builder.showDSWizard(wizardRecord);
            this.topElement.closeClick();
        }
    });
    var buttonsLayout=isc.HLayout.create({
        autoDraw:false,
        height:30,
        membersMargin:10
    });
    buttonsLayout.addMembers([isc.LayoutSpacer.create(),cancelButton,okButton]);
    var layout=isc.VLayout.create({
        width:"100%",
        height:"100%",
        padding:10,
        membersMargin:10,
        members:[header,choiceForm,buttonsLayout]
    });
    var dialog=isc.TWindow.create({
        title:"Create new DataSource",
        width:300,
        height:225,
        isModal:true,
        showModalMask:true,
        autoCenter:true,
        items:[layout]
    });
    dialog.show();
}
,isc.A.showScreenSourceCode=function isc_VisualBuilder_showScreenSourceCode(){
    var codeWindow=this.codeWindow,
        currentScreen=this.currentScreen;
    if(currentScreen)this._addUsageRecord("viewScreenCode",currentScreen.title);
    var mockupMode=this.getScreenMockupMode(currentScreen),
        showXml=(this.showXmlScreenCode!=false),
        showJs=(this.showJsScreenCode!=false&&!mockupMode)
    ;
    if(codeWindow&&!codeWindow.destroyed){
        if((showXml&&!this.codePreview)||(showJs&&!this.jsCodePreview)){
            codeWindow.destroy();
            codeWindow=null;
        }
    }
    if(codeWindow==null||codeWindow.destroyed){
        if(showXml)this.codePreview=this.createAutoChild("codePreview");
        if(showJs)this.jsCodePreview=this.createAutoChild("jsCodePreview");
        if(showXml&&showJs){
            this.codePane=this.createAutoChild("codePane");
            this.codePane.addTab({title:"XML Code",pane:this.codePreview,width:150,
                click:this.getID()+".updateSource();"
            });
            this.codePane.addTab({title:"JS Code",pane:this.jsCodePreview,width:150,
                click:this.getID()+".updateSource();"
            });
        }
        var pane=(showXml&&showJs?this.codePane:(showXml?this.codePreview:this.jsCodePreview)),
            canSaveChanges=(!mockupMode&&this.allowScreenCodeEditing)
        ;
        codeWindow=this.codeWindow=this.createAutoChild("codeWindow",{
            codePane:pane,
            canSaveChanges:canSaveChanges
        });
        codeWindow.addItems([pane]);
    }
    this.updateSource();
    codeWindow.animateShow();
}
,isc.A.updateSource=function isc_VisualBuilder_updateSource(){
    var xmlSource=this.getUpdatedSource();
    if(!xmlSource)return;
    var lineBreakValueRegex=new RegExp("(\\r\\n|[\\r\\n])","g");
    xmlSource=xmlSource.replace(lineBreakValueRegex,"\n");
    if(this.codePreview){
        this.codePreview.setValues({codeField:xmlSource});
    }
    if(this.jsCodePreview&&
        (!this.codePane||(this.codePane.isDrawn()&&this.codePane.getSelectedTab().pane==this.jsCodePreview)))
    {
        isc.xml.toJSCode(xmlSource,this.getID()+".jsCodePreview.setContents(data)");
    }
}
,isc.A.showMultiActionWindow=function isc_VisualBuilder_showMultiActionWindow(actionMenu){
    var multiActionWindow=this.multiActionWindow;
    if(multiActionWindow==null||multiActionWindow.destroyed){
        multiActionWindow=this.multiActionWindow=this.createAutoChild("multiActionWindow");
    }
    multiActionWindow.setTitle(actionMenu.sourceComponent.ID+" "+actionMenu.sourceMethod+"() Actions");
    var multiActionPanel=this.multiActionPanel;
    if(multiActionPanel==null||multiActionPanel.destroyed){
        multiActionPanel=this.multiActionPanel=this.createAutoChild("multiActionPanel",{
            builder:this,
            cancelClick:function(){
                this.builder.multiActionWindow.hide();
            }
        });
        if(multiActionWindow.items!=null)multiActionWindow.removeItems(multiActionWindow.items);
        multiActionWindow.addItems([multiActionPanel]);
    }
    multiActionPanel.configureFor(actionMenu);
    multiActionPanel.saveClick=function(bindings){
        this.builder.multiActionWindow.hide();
        actionMenu.bindingComplete(bindings);
    };
    var builder=this;
    multiActionPanel.getActionTitle=function(targetComponentId,actionId,showTarget){
        return builder.getActionTitle(targetComponentId,actionId,showTarget);
    };
    multiActionWindow.show();
}
,isc.A.filterComponentAttributeEditor=function isc_VisualBuilder_filterComponentAttributeEditor(filterValue){
    if(filterValue)filterValue=filterValue.toLowerCase();
    if(filterValue==this._attributeFilter)return;
    var component=this.getCurrentComponent();
    if(!component)return;
    if(filterValue==null||filterValue==""){
        this.clearComponentAttributeFilter(component);
    }else{
        if(this.componentAttributeEditor._basicMode){
            this.toggleBasicMode(component);
            this._basicUnfilteredAttributes=true;
        }
        this._attributeFilter=filterValue;
    }
    this._editComponent(component,component.liveObject);
}
,isc.A.clearComponentAttributeFilter=function isc_VisualBuilder_clearComponentAttributeFilter(component){
    if(this.componentAttributeEditorFilter){
        this.componentAttributeEditorFilter.clearValue("filter");
    }
    delete this._attributeFilter;
    if(this._basicUnfilteredAttributes){
        this.toggleBasicMode(component);
        delete this._basicUnfilteredAttributes;
    }
}
,isc.A.manageDeployment=function isc_VisualBuilder_manageDeployment(record){
    var consoleURL=this.deploymentConsoleURL;
    window.open(isc.RPC.addParamsToURL(consoleURL,{
        id:record.id
    }));
}
,isc.A.loadBMMLMockup=function isc_VisualBuilder_loadBMMLMockup(mockupName,id,fileContent,dropMarkup,trimSpace,fillSpace,fieldNamingConvention,useDataSourceReferences){
    isc.showPrompt("Importing mockup... ${loadingImage}");
    var vb=this,
        callback=function(data,methodName,screenName,symbolLibraries,assets){
            var pathPrefix=mockupName.substring(0,mockupName.lastIndexOf("/")),
                assetPath=(pathPrefix=="[READ_ONLY]"?"[VBWORKSPACE]":pathPrefix)
            ;
            var bmmlImporter=isc.MockupImporter.create({
                dropMarkup:dropMarkup==null?true:dropMarkup,
                trimSpace:trimSpace==null?true:trimSpace,
                fillSpace:fillSpace==null?true:fillSpace,
                mockupPath:mockupName,
                assetPath:assetPath,
                fieldNamingConvention:fieldNamingConvention
            });
            bmmlImporter[methodName](data,function(xmlContent,layout,layoutIds){
                if(xmlContent){
                    vb.createNewScreen(function(screen){
                        vb.projectComponents.destroyAll();
                        var topLevelIds=[];
                        for(var i=0;i<layout.length;i++){
                            var l=layout[i],
                                layoutID=l.ID||l.autoID;
                            if(l._constructor!="ValuesManager"&&
                                l._constructor!="MockDataSource"&&
                                l.autoDraw==null)
                            {
                                topLevelIds.add(layoutID);
                            }
                        }
                        var screenId=vb.libraryComponents.getPrefixAsId(screen.title);
                        xmlContent+=isc.MockupImporter.getDataViewXml(topLevelIds,screenId,true);
                        vb.projectComponents.getPaletteNodesFromXML(xmlContent,function(nodes){
                            for(var i=0;i<nodes.length;i++){
                                var node=nodes[i];
                                if(
                                    node.autoDraw!==false&&
                                    node.component&&
                                    node.component.defaults
                                ){
                                    delete node.component.defaults.autoDraw;
                                }
                            }
                            var editContext=vb.projectComponents.getEditContext();
                            editContext.reassignIDs=true;
                            vb.projectComponents.addFromPaletteNodes(nodes);
                            editContext.reassignIDs=false;
                            if(useDataSourceReferences){
                                var editNodes=editContext.getEditNodeArray();
                                if(editNodes)editNodes.map(function(node){
                                    if(node.isLoaded&&node.liveObject&&isc.isA.DataSource(node.liveObject)){
                                        var ds=node.liveObject;
                                        if(isc.isA.MockDataSource(ds)){
                                            node.referenceInProject=true;
                                            var dsType="MockDataSource";
                                            vb.project.addDatasource(ds.name,dsType);
                                            var dsData=editContext.makeDSPaletteNode(ds.name,dsType);
                                            vb.saveDSToFile(ds.name,dsData);
                                        }
                                    }
                                });
                            }
                            vb.addCurrentScreenMockDataSourcesToList();
                            isc.clearPrompt();
                        });
                    },screenName);
                }else{
                    isc.clearPrompt();
                }
            },symbolLibraries,assets);
        }
    ;
    if(mockupName.match(/^https?:\/\//,"i")){
        isc.RPCManager.sendRequest({
            useHttpProxy:true,
            actionURL:mockupName,
            callback:function(rpcResponse){callback(rpcResponse.data,"bmmlToXml","Imported BMML");}
        });
    }else{
        if(id){
            var ds=isc.DS.get("BMPRReader");
            ds.fetchData({ID:id,recordType:"resource",branchId:"Master"},function(dsResponse){
                if(dsResponse.status<0){
                    isc.clearPrompt();
                    isc.RPC.runDefaultErrorHandling(dsResponse);
                    return;
                }
                var resources=dsResponse.data,
                    mockupData,
                    symbolLibraries,
                    assets
                ;
                for(var i=0;i<resources.length;i++){
                    var resource=resources[i],
                        attributes=resource.attributes,
                        data=resource.data
                    ;
                    if(attributes.kind=="mockup"){
                        mockupData=data;
                    }else if(attributes.kind=="symbolLibrary"){
                        if(!symbolLibraries)symbolLibraries=[];
                        symbolLibraries.add(resource);
                    }else if(attributes.kind=="asset"){
                        if(!assets)assets=[];
                        assets.add(resource);
                    }
                }
                if(mockupData){
                    callback(mockupData,"bmmlJsToXml","Imported BMPR",symbolLibraries,assets);
                }
            },{willHandleError:true});
        }else if(fileContent!=null){
           callback(fileContent,"bmmlToXml","Imported BMML");
        }else{
            isc.DMI.callBuiltin({
                methodName:"loadFile",
                arguments:[mockupName],
                callback:function(rpcResponse){callback(rpcResponse.data,"bmmlToXml","Imported BMML");}
            });
        }
    }
}
,isc.A.getServiceElementIcon=function isc_VisualBuilder_getServiceElementIcon(elementNode){
    var type=elementNode.serviceType;
    if(type=="service"||type=="categoryProject")return"service.png";
    else if(type=="portType")return"portType.png";
    else if(type=="operation")return"operation.png";
    else if(type=="message_in")return"email_in.png";
    else if(type=="message_out")return"email_out.png";
    else if(type=="simpleType")return"page_single.png";
    else if(type=="complexType")return"page_multiple.png";
    return null;
}
,isc.A.notifyIDOrFieldNameChange=function isc_VisualBuilder_notifyIDOrFieldNameChange(component,property,oldValue,newValue){
    this.updateAllComponentEventReferences(component,property,oldValue,newValue);
    var componentValueTerm=(isc.isA.ListGrid(component)?"selectedRecord":"values"),
        changes=[]
    ;
    if(property=="ID"){
        changes[changes.length]={
            pattern:new RegExp("^"+oldValue+"\\."+componentValueTerm),
            replacement:newValue+"."+componentValueTerm
        };
    }else{
        var newValuePath=component.ID+"."+componentValueTerm+"."+newValue;
        changes[changes.length]={
            pattern:new RegExp(component.ID+"\\."+componentValueTerm+"\\."+oldValue),
            replacement:newValuePath
        };
        if(component.dataSource){
            var ds=(isc.isA.DataSource(component.dataSource)?component.dataSource:isc.DS.get(component.dataSource)),
                dsId=ds.ID
            ;
            if(ds.getField(oldValue)){
                changes[changes.length]={
                    pattern:new RegExp(dsId+"\\."+oldValue),
                    replacement:(ds.getField(newValue)?dsId+"."+newValue:newValuePath)
                };
            }
        }
    }
    if(isc.isA.FormItem(component))component=component.form;
    if(component.getRuleScopeDataBoundComponents){
        var dbcList=component.getRuleScopeDataBoundComponents();
        for(var i=0;i<dbcList.length;i++){
            this.updateComponentRuleScopeProperties(dbcList[i],changes);
        }
    }
}
,isc.A.updateAllComponentEventReferences=function isc_VisualBuilder_updateAllComponentEventReferences(component,property,oldValue,newValue){
    if(!isc.jsdoc.hasData())return false;
    var editNodes=this.projectComponents.editContext.getEditNodeArray();
    for(var i=0;i<editNodes.length;i++){
        var editNode=editNodes[i];
        var defaults=editNode.defaults,
            liveObject=editNode.liveObject,
            className=(liveObject.getClassName?liveObject.getClassName():liveObject._constructor),
            changedProperties={}
        ;
        for(var key in defaults){
            var value=defaults[key];
            if(value==null||value=="")continue;
            if(isc.isA.StringMethod(value)&&value.value)value=value.value;
            var docItem=isc.VisualBuilder.getEventDefinition(className,key);
            if(docItem){
                var changed=false;
                {
                    if(isc.isAn.Array(value)){
                        for(var j=0;j<value.length;j++){
                            var action=value[j];
                            if(action.target==oldValue){
                                action.target=newValue;
                                changed=true;
                            }
                        }
                    }else if(isc.isA.StringMethod(value)){
                        var action=value.value;
                        if(action.target==oldValue){
                            action.target=newValue;
                            changed=true;
                        }
                    }else{
                        var action=value;
                        if(action.target==oldValue){
                            action.target=newValue;
                            changed=true;
                        }
                    }
                }
                if(changed)changedProperties[key]=value;
            }
        }
        if(!isc.isAn.emptyObject(changedProperties)){
            this.projectComponents.setNodeProperties(editNode,changedProperties);
        }
    }
}
,isc.A.updateComponentRuleScopeProperties=function isc_VisualBuilder_updateComponentRuleScopeProperties(component,changes,deletes,className){
    var type=isc.DS.getNearestSchema(className||component.getClassName());
    var fieldNames=this._getTypeFieldnames(type);
    if(fieldNames){
        var editContext=this.projectComponents.getEditContext(),
            editNode=editContext.getEditNodeArray().find("liveObject",component)
        ;
        if(!editNode)return;
        for(var i=0;i<fieldNames.length;i++){
            var fieldName=fieldNames[i];
            var groupNames=isc.jsdoc.getAllGroupsForAttribute(type.ID,fieldName);
            if(groupNames!=null&&(groupNames.contains("dynamicCriteria")||groupNames.contains("ruleCriteria"))){
                var criteria=editNode.defaults[fieldName];
                if(criteria){
                    if(deletes&&deletes.length>0&&this._criteriaHasMatchingValuePath(criteria,deletes)){
                        this.projectComponents.removeNodeProperties(editNode,fieldName);
                    }else if(changes&&changes.length>0&&this._replaceCriteriaValuePaths(criteria,changes)){
                        var properties={};
                        properties[fieldName]=criteria;
                        this.projectComponents.setNodeProperties(editNode,properties);
                    }
                }
            }
            var field=type.getField(fieldName);
            if(field&&(field.type=="UserFormula"||field.type=="UserSummary")&&(field.useRuleScope==true||field.useRuleScope=="true")){
                var formula=editNode.defaults[fieldName];
                if(formula&&formula.text){
                    if(deletes&&deletes.length>0&&this._formulaHasVariable(formula,deletes)){
                        this.projectComponents.removeNodeProperties(editNode,fieldName);
                    }else if(changes&&changes.length>0&&this._replaceFormulaVariables(formula,changes)){
                        var properties={};
                        properties[fieldName]=formula;
                        this.projectComponents.setNodeProperties(editNode,properties);
                    }
                }
            }
        }
    }
    if(isc.isA.DynamicForm(component)){
        var items=component.items;
        for(var i=0;i<items.length;i++){
            this.updateComponentRuleScopeProperties(items[i],changes,deletes);
        }
    }
    if(isc.isA.ListGrid(component)){
        var fields=component.getAllFields();
        for(var i=0;i<fields.length;i++){
            this.updateComponentRuleScopeProperties(fields[i],changes,deletes,"ListGridField");
        }
    }
}
,isc.A._getTypeFieldnames=function isc_VisualBuilder__getTypeFieldnames(type){
    var fieldNames;
    if(type&&type.fields){
        fieldNames=this._cachedTypeFieldnames[type.ID];
        if(!fieldNames){
            fieldNames=(isc.isAn.Array(type.fields)?type.fields.getProperty("name"):isc.getKeys(type.fields));
            var classObj=isc.ClassFactory.getClass(type.ID);
            if(classObj){
                var superClass=classObj.getSuperClass();
                if(superClass){
                    var superType=isc.DS.getNearestSchema(superClass.getClassName()),
                        superFieldNames=this._getTypeFieldnames(superType)
                    ;
                    if(superFieldNames){
                        fieldNames.addList(superFieldNames);
                    }
                }
            }
            this._cachedTypeFieldnames[type.ID]=fieldNames;
        }
    }
    return fieldNames;
}
,isc.A._replaceCriteriaValuePaths=function isc_VisualBuilder__replaceCriteriaValuePaths(criteria,changes){
    var operator=criteria.operator,
        changed=false
    ;
    if(operator=="and"||operator=="or"){
        var innerCriteria=criteria.criteria;
        for(var i=0;i<innerCriteria.length;i++){
            if(this._replaceCriteriaValuePaths(innerCriteria[i],changes)){
                changed=true;
            }
        }
    }else{
        for(var i=0;i<changes.length;i++){
            var change=changes[i];
            if(criteria.valuePath!=null){
                var newValuePath=criteria.valuePath.replace(change.pattern,change.replacement);
                if(criteria.valuePath!=newValuePath){
                    criteria.valuePath=newValuePath;
                    changed=true;
                }
            }
            if(criteria.fieldName!=null){
                var newFieldName=criteria.fieldName.replace(change.pattern,change.replacement);
                if(criteria.fieldName!=newFieldName){
                    criteria.fieldName=newFieldName;
                    changed=true;
                }
            }
        }
    }
    return changed;
}
,isc.A._criteriaHasMatchingValuePath=function isc_VisualBuilder__criteriaHasMatchingValuePath(criteria,deletes){
    var operator=criteria.operator;
    if(operator=="and"||operator=="or"){
        var innerCriteria=criteria.criteria;
        for(var i=0;i<innerCriteria.length;i++){
            if(this._criteriaHasMatchingValuePath(innerCriteria[i],deletes)){
                return true;
            }
        }
    }else{
        for(var i=0;i<deletes.length;i++){
            var pattern=deletes[i];
            if((criteria.valuePath!=null&&criteria.valuePath.match(pattern))||
                (criteria.fieldName!=null&&criteria.fieldName.match(pattern)))
            {
                return true;
            }
        }
    }
    return false;
}
,isc.A._replaceFormulaVariables=function isc_VisualBuilder__replaceFormulaVariables(formula,changes){
    if(!formula.text)return false;
    var changed=false;
    for(var i=0;i<changes.length;i++){
        var change=changes[i];
        var newText=formula.text.replace(change.pattern,change.replacement);
        if(formula.text!=newText){
            formula.text=newText;
            changed=true;
        }
    }
    return changed;
}
,isc.A._formulaHasVariable=function isc_VisualBuilder__formulaHasVariable(formula,deletes){
    if(!formula.text)return false;
    for(var i=0;i<deletes.length;i++){
        var pattern=deletes[i];
        if(formula.text.match(pattern))return true;
    }
    return false;
}
,isc.A.keyPress=function isc_VisualBuilder_keyPress(){
    if(isc.EH.getKey()=="Delete"||isc.EH.getKey()=="Backspace"){
        if(!this.editingOn)return;
        var selected=isc.SelectionOutline.getSelectedObject();
        if(selected&&selected.editContext){
            var node=selected.editNode;
            if(node&&node._canRemove===false){
                return;
            }
            var grid=this.projectComponents;
            var self=this;
            this.confirmComponentDelete(node,function(rowNum){
                var parentNode=grid.data.getParent(node);
                if(parentNode){
                    isc.EditContext.selectCanvasOrFormItem(parentNode.liveObject);
                }
                selected.editContext.destroyNode(node);
            });
            return false;
        }
    }
}
,isc.A.confirmComponentDelete=function isc_VisualBuilder_confirmComponentDelete(node,callback){
    var grid=this.projectComponents;
    var getFormattedValue=function(value,record,rowNum,colNum){
        var field=grid.getField(colNum);
        if(field.formatCellValue){
            value=field.formatCellValue(value,record,rowNum,colNum,grid);
        }else{
            value=grid.formatCellValue(value,record,rowNum,colNum);
        }
        return value;
    };
    var ID=node.ID,
        type=node.type
    ;
    var rowNum=this.projectComponents.getRecordIndex(node);
    if(rowNum>=0){
        ID=getFormattedValue(ID,node,rowNum,grid.getFieldNum("ID"));
        type=getFormattedValue(type,node,rowNum,grid.getFieldNum("type"));
    }
    var component=ID+" ["+type+"]";
    isc.ask("Do you want to delete "+component+"?",
        function(value){
            if(value)callback(rowNum);
        },{
            buttons:[isc.Dialog.CANCEL,isc.Dialog.OK],
            autoFocusButton:1
        }
    );
}
,isc.A.destroy=function isc_VisualBuilder_destroy(){
    this.setProject(null);
    this.ignore(this.projectComponents,"editNodeUpdated");
    this.Super("destroy",arguments);
}
,isc.A.init=function isc_VisualBuilder_init(){
    this.mockupsMenuDefaults={
        _constructor:"Menu",
        title:"Mockups",
        width:60,
        getSubmenu:function(item){
            item=this.getItem(item);
            if(item.title=="Switch Mockup"&&item.submenu.length==0){
                var builder=this.creator,
                    parentMenu=this,
                    screenNodes=builder.project.screens.getAllNodes(),
                    click=function(target,item,menu){
                        if(item.record==builder.currentScreen)return;
                        parentMenu.confirmSaveMockup(function(){
                            builder.setCurrentScreen(item.record);
                        });
                    },
                    checkIf=function(target,menu,item){
                        return(item.record==builder.currentScreen);
                    },
                    subitems=[]
                ;
                for(var i=0;i<screenNodes.length;i++){
                    var node=screenNodes[i];
                    if(node.mockupMode){
                        subitems.add({title:node.title,record:node,checkIf:checkIf,click:click});
                    }
                }
                item.submenu=subitems;
            }else if(item.title=="Switch Project"&&item.submenu.length==0){
                var builder=this.creator,
                    parentMenu=this,
                    projects=builder.getRecentProjects(),
                    click=function(target,item,menu){
                        var project=item.record;
                        if(project.projectFileName==builder.project.fileName)return;
                        parentMenu.confirmSaveProject(function(){
                            builder.loadProject(item.record.projectFileName,item.record.projectOwnerId);
                        });
                    },
                    checkIf=function(target,menu,item){
                        return(item.record.projectFileName==builder.project.fileName);
                    },
                    subitems=[]
                ;
                for(var i=0;i<projects.length;i++){
                    var project=projects[i];
                    subitems.add({title:project.title,record:project,checkIf:checkIf,click:click});
                }
                item.submenu=subitems;
            }
            return this.Super("getSubmenu",arguments);
        },
        confirmSaveMockup:function(callback){
            var builder=this.creator;
            if(builder.currentScreen&&builder.currentScreen.dirty){
                isc.confirm("Save current screen?",function(response){
                    if(response==true){
                        builder.saveScreenAs(builder.currentScreen,callback);
                    }else if(response==false){
                        builder.fireCallback(callback);
                    }
                },{
                    buttons:[isc.Dialog.CANCEL,isc.Dialog.NO,isc.Dialog.YES],
                    autoFocusButton:2
                });
            }else{
                this.fireCallback(callback);
            }
        },
        confirmSaveProject:function(callback){
            var builder=this.creator;
            if(!builder.project||builder.project.isEmpty()||builder.getProjectFileName()){
                this.fireCallback(callback);
            }else{
                var self=this;
                isc.confirm("Save current project?",function(response){
                    if(response==true){
                        builder.project.save(callback);
                    }else if(response==false){
                        self.fireCallback(callback);
                    }
                },{
                    buttons:[isc.Dialog.CANCEL,isc.Dialog.NO,isc.Dialog.YES],
                    autoFocusButton:2
                });
            }
        },
        data:[
            {
                title:"Clear Mockup",
                icon:"actions/revertScreen.png",
                click:function(target,item,menu){
                    var builder=menu.creator;
                    builder.projectComponents.destroyAll();
                }
            },{
                isSeparator:true
            },{
                title:"Switch Mockup",
                icon:"actions/switchScreen.png",
                enableIf:function(target,menu,item){
                    var builder=menu.creator,
                        screenNodes=builder.project.screens.getAllNodes()
                    ;
                    var screenCount=0;
                    for(var i=0;i<screenNodes.length;i++){
                        if(screenNodes[i].mockupMode){
                            if(++screenCount>1)break;
                        }
                    }
                    return screenCount>1;
                },
                submenu:[]
            },{
                isSeparator:true
            },{
                title:"Save",
                icon:"actions/saveScreen.png",
                dynamicTitle:function(target,menu,item){
                    return"Save '"+menu.creator.getCurrentScreenTitle()+"'";
                },
                enableIf:function(target,menu,item){
                    return menu.creator.currentScreen.fileName;
                },
                click:function(target,item,menu){
                    var builder=menu.creator;
                    builder.cacheCurrentScreenContents();
                    builder.project.saveScreenContents(builder.currentScreen);
                }
            },{
                title:"Save mockup as ...",
                icon:"actions/saveScreenAs.png",
                click:function(target,item,menu){
                    var builder=menu.creator;
                    builder.saveScreenAs(builder.currentScreen);
                }
            },{
                isSeparator:true
            },{
                title:"Switch Project",
                icon:"actions/recentProjects.png",
                submenu:[]
            }
        ]
    };
    if(this.showXmlScreenCode!=false||this.showJsScreenCode!=false){
        this.mockupsMenuDefaults.data.add({isSeparator:true});
        this.mockupsMenuDefaults.data.add({
            title:"Show code for screen",
            icon:"actions/showScreenCode.png",
            click:function(target,item,menu){
                menu.creator.showScreenSourceCode();
            }
        });
    }
    var screenMenuTitles=[
        "New screen","Import from Balsamiq","Copy an existing screen","Load a shared screen",
        "Switch screen",
        "Skin","Resolution",
        "Rename screen","Save screen","Save screen as ...",
        "View recent version",
        "Remove from project","Delete screen",
        "Show code for screen"
    ];
    var hostedScreenMenuTitles=[
        "New screen","Import from Balsamiq","Copy an existing screen","Load a shared screen",
        "Switch screen",
        "Skin","Resolution",
        "Rename screen","Save screen","Save screen as ...",
        "View recent version","Revert",
        "Remove from project","Delete screen",
        "Show code for screen"
    ];
    var screenMenuData=[
    {
        title:"New screen",
        icon:"actions/newScreen.png",
        enableIf:function(target,menu,item){
            return!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            var builder=menu.creator;
            builder.confirmSaveScreen(function(){
                builder.createNewScreen();
            });
        }
    },{
        title:"Import screen",
        enabled:this.filesystemDataSourceEnabled,
        enableIf:function(target,menu,item){
            return!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            menu.creator.confirmSaveScreen(function(){
                var refDocURL="../../isomorphic/system/reference/SmartClient_Reference.html#group..visualBuilder";
                isc.ask("This feature allows you to import externally edited XML or JS code."+
                        " The Visual Builder cannot fully capture all externally edited files."+
                        " For more information, see the <a target=_blank href='"+refDocURL+
                        "'>Visual Builder Docs</a><br><br>Proceed with Import?",function(response){
                    if(response)menu.creator.showImportDialog(menu);
                });
            });
        }
    },{
        title:"Import from Balsamiq",
        icon:"actions/importScreen.png",
        enableIf:function(target,menu,item){
            return!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            menu.creator.confirmSaveScreen(function(){
                isc.BMMLImportDialog.create({
                    isModal:true,
                    showFileNameField:menu.creator.loadFileBuiltinIsEnabled,
                    showAssetsNameField:menu.creator.saveFileBuiltinIsEnabled,
                    showOutputField:menu.creator.saveFileBuiltinIsEnabled,
                    showSkinSelector:false,
                    submit:function(fileName,id,outputFileName,fileContent,skin,dropMarkup,trimSpace,fillSpace,fieldNamingConvention){
                        menu.creator.loadBMMLMockup(fileName,id,fileContent,dropMarkup,trimSpace,fillSpace,fieldNamingConvention,true);
                        this.markForDestroy();
                    }
                });
            });
        }
    },{
        title:"Copy an existing screen",
        icon:"actions/copyScreen.png",
        enableIf:function(target,menu,item){
            return!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            menu.creator.confirmSaveScreen(function(){
                menu.creator.showCopyExistingScreenUI();
            });
        }
    },{
        title:"Load a shared screen",
        icon:"actions/loadSharedScreen.png",
        enableIf:function(target,menu,item){
            return!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            menu.creator.confirmSaveScreen(function(){
                menu.creator.showLoadSharedScreenUI();
            });
        }
    },{
        title:"Recent screens",
        submenu:[]
    },{
        title:"Switch screen",
        icon:"actions/switchScreen.png",
        enableIf:function(target,menu,item){
            var builder=menu.creator,
                screenNodes=builder.project.screens.getAllNodes()
            ;
            return screenNodes.length>1;
        },
        submenu:[]
    },{
        isSeparator:true
    },{
        title:"Rename screen",
        icon:"actions/renameScreen.png",
        enableIf:function(target,menu,item){
            return(menu.creator.currentScreen.fileName&&
                !menu.creator.currentScreen.oldVersionLoaded&&
                !menu.creator.project.isReadOnly());
        },
        click:function(target,item,menu){
            menu.creator.cacheCurrentScreenContents();
            menu.creator.project.renameCurrentScreen();
        }
    },{
        title:"Save screen",
        icon:"actions/saveScreen.png",
        dynamicTitle:function(target,menu,item){
            return"Save '"+menu.creator.getCurrentScreenTitle()+"'";
        },
        enableIf:function(target,menu,item){
            return menu.creator.currentScreen.fileName&&!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            var saveDate=new Date();
            menu.creator.cacheCurrentScreenContents();
            var saveReason;
            if(menu.creator.addScreenSaveReasonFromUndoLog){
                var lastSave=menu.creator.currentScreen.lastSave;
                if(lastSave!=null){
                    if(isc.isA.String(lastSave))lastSave=new Date(lastSave);
                    saveReason=menu.creator.projectComponents.editContext.getCombinedUndoLogDescriptions(lastSave.getTime());
                }
            }
            menu.creator.project.setScreenProperties(menu.creator.currentScreen,{lastSave:saveDate,lastExplicitSave:saveDate});
            menu.creator.project.saveScreenContents(menu.creator.currentScreen,null,null,saveReason);
        }
    },{
        title:"Save screen as ...",
        icon:"actions/saveScreenAs.png",
        enableIf:function(target,menu,item){
            return!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            menu.creator.saveScreenAs(menu.creator.currentScreen);
        }
    },{
        title:"Export as JSP",
        enabled:this.filesystemDataSourceEnabled,
        click:function(target,item,menu){
            menu.creator.exportScreenAsJSP(menu.creator.currentScreen);
        }
    },{
        isSeparator:true
    },{
        title:"View recent version",
        icon:"actions/recentScreenVersions.png",
        submenu:[]
    },{
        title:"Revert",
        icon:"actions/revertScreen.png",
        dynamicTitle:function(target,menu,item){
            return"Revert";
        },
        enableIf:function(target,menu,item){
            return menu.creator.currentScreen.fileName&&!menu.creator.project.isReadOnly();
        },
        submenu:[]
    },{
        isSeparator:true
    },{
        title:"Remove from project",
        icon:"actions/removeScreen.png",
        removeInSingleScreenMode:true,
        enableIf:function(target,menu,item){
            return!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            menu.creator.project.removeScreen(menu.creator.currentScreen,true);
        }
    },{
        title:"Delete screen",
        icon:"actions/deleteScreen.png",
        dynamicTitle:function(target,menu,item){
            return"Delete '"+menu.creator.getCurrentScreenTitle()+"'";
        },
        enableIf:function(target,menu,item){
            return menu.creator.currentScreen.fileName&&!menu.creator.project.isReadOnly();
        },
        click:function(target,item,menu){
            var message="Delete screen '"+menu.creator.currentScreen.title+"' from server? "+
                            "This operation cannot be undone.";
            isc.confirm(message,function(response){
                if(response)menu.creator.deleteScreen(menu.creator.currentScreen);
            },{
                buttons:[isc.Dialog.CANCEL,isc.Dialog.OK],
                autoFocusButton:1
            });
        }
    }];
    var applicableTitles=(this.hostedMode?hostedScreenMenuTitles:screenMenuTitles),
        data=[]
    ;
    for(var j=0;j<screenMenuData.length;j++){
        var menuItem=screenMenuData[j];
        if(menuItem.isSeparator||applicableTitles.contains(menuItem.title)){
            data.add(menuItem);
        }
    }
    if((this.showXmlScreenCode!=false||this.showJsScreenCode!=false)&&
        applicableTitles.contains("Show code for screen"))
    {
        data.add({isSeparator:true});
        data.add({
            title:"Show code for screen",
            icon:"actions/showScreenCode.png",
            click:function(target,item,menu){
                menu.creator.showScreenSourceCode();
            }
        });
    }
    this.screenMenuDefaults={
        _constructor:"Menu",
        title:"Screen",
        width:60,
        draw:function(){
            this.Super("draw",arguments);
            this.refreshRecentVersions();
        },
        getSubmenu:function(item){
            var existingMenu;
            item=this.getItem(item);
            if(item.title=="Recent screens"){
                var builder=this.creator,
                    screenNodes=builder.getRecentScreens(),
                    click=function(target,item,menu){
                        if(item.record==builder.currentScreen)return;
                        builder.setCurrentScreen(item.record);
                    },
                    checkIf=function(target,menu,item){
                        return(item.record==builder.currentScreen);
                    },
                    subitems=[]
                ;
                for(var i=0;i<screenNodes.length;i++){
                    var node=screenNodes[i];
                    subitems.add({title:node.title,record:node.screen,checkIf:checkIf,click:click});
                }
                if(item.submenu&&item.submenu.length>0){
                    existingMenu=this.Super("getSubmenu",arguments);
                }
                if(existingMenu)existingMenu.setData(subitems);
                else item.submenu=subitems;
            }else if(item.title=="Switch screen"){
                var builder=this.creator,
                    screenNodes=builder.project.screens.getAllNodes(),
                    click=function(target,item,menu){
                        var newScreen=item.record,
                            oldScreen=builder.currentScreen;
                        if(newScreen==oldScreen)return;
                        builder._addUsageRecord("switchScreen",newScreen.title,
                                                                oldScreen.title);
                        builder.setCurrentScreen(newScreen);
                    },
                    subitems=[]
                ;
                screenNodes=screenNodes.sortByProperty("lastSave",false,function(item,propertyName,context){
                    var value=item[propertyName];
                    return(isc.isA.String(value)?new Date(value):value);
                });
                for(var i=0;i<screenNodes.length;i++){
                    var node=screenNodes[i];
                    if(node==builder.currentScreen)continue;
                    subitems.add({title:node.title,record:node,click:click});
                }
                if(item.submenu&&item.submenu.length>0){
                    existingMenu=this.Super("getSubmenu",arguments);
                }
                if(existingMenu)existingMenu.setData(subitems);
                else item.submenu=subitems;
            }else if(item.title=="View recent version"){
                if(item.submenu&&item.submenu.length>0){
                    existingMenu=this.Super("getSubmenu",arguments);
                }
                this.refreshRecentVersions(existingMenu);
            }else if(item.title.startsWith("Revert")){
                if(item.submenu&&item.submenu.length>0){
                    existingMenu=this.Super("getSubmenu",arguments);
                }
                this.refreshRevertVersions(item,existingMenu);
            }
            if(!existingMenu){
                existingMenu=this.Super("getSubmenu",arguments);
                if(existingMenu)existingMenu.emptyMessage="[No entries]";
            }
            return existingMenu;
        },
        refreshRecentVersions:function(existingMenu){
            var undef,
                builder=this.creator,
                showRecentVersions=builder.showRecentVersions;
            if(!showRecentVersions)return;
            var items=this.data,
                item=items.find("title","View recent version");
            if(!item)return;
            var screen=builder.currentScreen,
                data=screen.versions||[],
                origSubItems=(existingMenu?existingMenu.data:item.submenu),
                subitems=[],
                maxId=data.map(function(fileSpec){return fileSpec.id;}).max(),
                loadVersionedScreen=function(){
                    var version=this.id==maxId?undef:this.version;
                    builder.revertScreen(screen,version);
                    builder._addUsageRecord("loadRecentVersion",
                        builder.getCurrentScreenTitle(),version);
                }
            ;
            for(var i=0,length=data.getLength();i<length;i++){
                var lastSave=data[i].fileLastModified,
                    saveReason=data[i].saveReason,
                    checked=(!screen.oldVersionLoaded?i==0:
                        isc.DateUtil.compareDates(screen.lastLoadVersion,lastSave)==0)
                ;
                if(isc.isA.String(lastSave))lastSave=new Date(lastSave);
                var title=(i==length-1?"Initial version":
                    (data[i].fileAutoSaved?"Auto saved ":"Manually saved ")+
                        isc.VisualBuilder.timeSince(lastSave))
                ;
                subitems.add({
                    id:data[i].id,
                    version:lastSave,
                    checked:checked,
                    title:title,
                    saveReason:saveReason,
                    click:loadVersionedScreen
                });
            }
            if(origSubItems&&origSubItems.length==subitems.length)return;
            if(existingMenu){
                existingMenu.setData(subitems);
                existingMenu.autoFitData=(subitems?"vertical":null);
                existingMenu.overflow=(subitems?"hidden":"visible");
                existingMenu.bodyOverflow=(subitems?"auto":"visible");
            }else{
                item.submenu=isc.Menu.create({
                    ID:"recentMenu",
                    width:425,
                    overflow:(subitems?"hidden":"visible"),
                    bodyOverflow:(subitems?"auto":"visible"),
                    autoFitData:(subitems?"vertical":null),
                    height:(subitems?null:50),
                    fixedFieldWidths:true,
                    fixedRecordHeights:true,
                    fields:[
                        {name:"icon",width:25,
                            getCellValue:function(list,item){return list.getIcon(item)},
                            showIf:function(list,field,fieldNum){
                                return list.shouldShowIconField();
                            }
                        },
                        {name:"title",width:173,baseStyle:"menuTitleField",
                            showHover:true,hoverWidth:400,hoverStyle:"darkHover",
                            hoverHTML:function(record,value,rowNum,colNum,grid){
                                if(!grid.cellValueIsClipped(rowNum,colNum))return null;
                                return value;
                            }
                        },
                        {name:"saveReason",width:200,baseStyle:"menuTitleField",
                            showHover:true,hoverWidth:400,hoverStyle:"darkHover",
                            hoverHTML:function(record,value,rowNum,colNum,grid){
                                if(!grid.cellValueIsClipped(rowNum,colNum))return null;
                                return value;
                            }
                        }
                    ],
                    items:subitems
                });
            }
        },
        refreshRevertVersions:function(item,existingMenu){
            var undef,
                builder=this.creator,
                showRecentVersions=builder.showRecentVersions;
            if(!showRecentVersions)return;
            var data=builder.currentScreen.versions||[],
                subitems=[],
                maxId=data.map(function(fileSpec){return fileSpec.id;}).max(),
                revertToScreen=function(){
                    var item=this;
                    isc.confirm("Revert screen to selected version?",function(response){
                        if(response){
                            var version=item.id==maxId?undef:item.version;
                            builder.revertScreen(builder.currentScreen,version,true);
                            builder._addUsageRecord("revert",builder.getCurrentScreenTitle(),
                                                              builder.getProjectDisplayName());
                        }
                    },{
                        buttons:[isc.Dialog.CANCEL,isc.Dialog.OK],
                        autoFocusButton:1
                    });
                }
            ;
            var lastExplicitSave,
                lastExplicitSaveNode,
                maxAutoSaves=builder.maxAutoSavesInRevertMenu,
                lastAutoSaves=[],
                skippedFirstAutoSave=false
            ;
            for(var i=0;i<data.getLength();i++){
                if(lastExplicitSave==null&&!data[i].fileAutoSaved){
                    lastExplicitSave=data[i].fileLastModified;
                    if(isc.isA.String(lastExplicitSave))lastExplicitSave=new Date(lastExplicitSave);
                    lastExplicitSaveNode=data[i];
                }else if(lastAutoSaves.length<maxAutoSaves&&data[i].fileAutoSaved){
                    if(!skippedFirstAutoSave){
                        skippedFirstAutoSave=true;
                        continue;
                    }
                    var node=isc.shallowClone(data[i]);
                    if(isc.isA.String(node.fileLastModified)){
                        node.fileLastModified=new Date(node.fileLastModified);
                    }
                    lastAutoSaves.add(node);
                }
            }
            if(lastAutoSaves.length>0){
                for(var i=0;i<lastAutoSaves.length;i++){
                    var node=lastAutoSaves[i],
                        title=(i==lastAutoSaves.length-1?"Initial version":
                            "Auto saved "+isc.VisualBuilder.timeSince(node.fileLastModified))
                    ;
                    subitems.add({
                        id:node.id,
                        version:node.fileLastModified,
                        title:title,
                        saveReason:node.saveReason,
                        click:revertToScreen
                    });
                }
            }
            if(lastExplicitSave||lastLoad){
                subitems.add({isSeparator:true});
                if(lastExplicitSave){
                    var title="Last manual save "+isc.VisualBuilder.timeSince(lastExplicitSave);
                    subitems.add({
                        icon:"actions/saveScreen.png",
                        id:lastExplicitSaveNode.id,
                        version:lastExplicitSaveNode.fileLastModified,
                        title:title,
                        saveReason:lastExplicitSaveNode.saveReason,
                        click:revertToScreen
                    });
                }
                var lastLoad=builder.currentScreen.lastLoad,
                    lastLoadNode=builder.currentScreen
                ;
                if(lastLoad){
                    var title="Last loaded "+isc.VisualBuilder.timeSince(lastLoad);
                    subitems.add({
                        icon:"actions/loadSharedScreen.png",
                        id:maxId,
                        title:title,
                        saveReason:lastLoadNode.saveReason,
                        click:revertToScreen
                    });
                }
            }
            if(subitems.length==0)subitems=null;
            if(existingMenu){
                existingMenu.setData(subitems);
                existingMenu.autoFitData=(subitems?"vertical":null);
                existingMenu.overflow=(subitems?"hidden":"visible");
                existingMenu.bodyOverflow=(subitems?"auto":"visible");
            }else{
                item.submenu=isc.Menu.create({
                    ID:"revertMenu",
                    width:400,
                    overflow:(subitems?"hidden":"visible"),
                    bodyOverflow:(subitems?"auto":"visible"),
                    autoFitData:(subitems?"vertical":null),
                    height:(subitems?null:50),
                    fixedFieldWidths:true,
                    fixedRecordHeights:true,
                    fields:[
                        {name:"icon",
                            width:25,
                            getCellValue:function(list,item){return list.getIcon(item)},
                            showIf:function(list,field,fieldNum){
                                return list.shouldShowIconField();
                            }
                        },
                        {name:"title",width:173,baseStyle:"menuTitleField",
                            showHover:true,hoverWidth:400,hoverStyle:"darkHover",
                            hoverHTML:function(record,value,rowNum,colNum,grid){
                                if(!grid.cellValueIsClipped(rowNum,colNum))return null;
                                return value;
                            }
                        },
                        {name:"saveReason",width:200,baseStyle:"menuTitleField",
                            showHover:true,hoverWidth:400,hoverStyle:"darkHover",
                            hoverHTML:function(record,value,rowNum,colNum,grid){
                                if(!grid.cellValueIsClipped(rowNum,colNum))return null;
                                return value;
                            }
                        }
                    ],
                    items:subitems
                });
            }
        },
        data:data
    };
    if(this.singleScreenMode){
        var menuData=this.screenMenuDefaults.data;
        menuData.removeList(menuData.findAll("removeInSingleScreenMode",true));
    }
    var projectMenuData=[
        {
            title:"New project",
            icon:"actions/newProject.png",
            click:function(target,item,menu){
                menu.creator.confirmSaveProject("this.makeNewProject()");
            }
        },{
            title:"Open project",
            icon:"actions/loadProject.png",
            click:function(target,item,menu){
                menu.creator.confirmSaveProject("this.showLoadProjectUI();");
            }
        },{
            isSeparator:true
        },{
            title:"Recent projects",
            icon:"actions/recentProjects.png",
            enableIf:function(target,menu,item){
                if(!item.submenu)item.submenu=menu.creator.recentProjectsMenu;
                return item.submenu&&item.submenu.data.getLength()>0;
            }
        },{
            isSeparator:true
        },{
            title:"Rename project",
            icon:"actions/renameProject.png",
            enableIf:function(target,menu,item){
                return menu.creator.project.fileName&&!menu.creator.project.isReadOnly();
            },
            click:function(target,item,menu){
                var builder=menu.creator,
                    origFileName=menu.creator.project.fileName;
                builder.project.rename(function(){
                    builder.removeRecentProject(origFileName);
                });
            }
        },{
            title:"Save project",
            icon:"actions/saveProject.png",
            enableIf:function(target,menu,item){
                return menu.creator.project.fileName&&!menu.creator.project.isReadOnly();
            },
            click:function(target,item,menu){
                menu.creator.project.save();
            }
        },{
            title:"Save project as ...",
            icon:"actions/saveProjectAs.png",
            enableIf:function(target,menu,item){
                return!menu.creator.project.isReadOnly();
            },
            click:function(target,item,menu){
                menu.creator.project.saveAs();
            }
        },{
            title:"Copy project",
            icon:"actions/copyProject.png",
            click:function(target,item,menu){
                menu.creator.project.duplicate();
            }
        },{
            title:"Export Project",
            icon:"actions/exportProject.png",
            enabled:this.filesystemDataSourceEnabled||this.hostedMode,
            click:function(target,item,menu){
                menu.creator.project.exportProjectWindow(menu.creator.currentScreen,menu.creator);
            }
        },{
            isSeparator:true
        },{
            title:"Delete project",
            icon:"actions/deleteProject.png",
            enableIf:function(target,menu,item){
                return menu.creator.project.fileName&&!menu.creator.project.isReadOnly();
            },
            click:function(target,item,menu){
                menu.creator.confirmDeleteProject();
            }
        },{
            isSeparator:true
        },{
            title:"Reset project state",
            icon:"actions/revertScreen.png",
            enableIf:function(target,menu,item){
                return menu.creator.project.fileName;
            },
            click:function(target,item,menu){
                menu.creator.resetProjectState();
            }
        },{
            isSeparator:true
        },{
            title:"Skin",
            icon:"actions/skin.png",
            submenu:[
            ]
        },{
            title:"Resolution",
            icon:"actions/resolution.png",
            submenu:[]
        }
    ];
    if(this.hostedMode){
        projectMenuData.addList([{isSeparator:true},{
            title:"Share",
            icon:"actions/shareProject.png",
            enableIf:function(target,menu,item){
                if(!window.user)return false;
                var builder=menu.creator;
                if(builder.singleScreenMode&&builder.currentScreen)return true;
                else if(builder.project&&!builder.project.isEmpty())return true;
            },
            click:function(target,item,menu){
                var builder=menu.creator;
                builder.shareProject();
            }
        }]);
    }
    this.projectMenuDefaults={
        _constructor:"Menu",
        title:"Project",
        width:100,
        data:projectMenuData,
        setSkin:function(value){
            this.creator.doAutoSave(this.getID()+".doSetSkin('"+value+"')");
        },
        doSetSkin:function(value){
            var qParams=isc.clone(isc.params);
            qParams.skin=value;
            var url=location.href;
            if(url.contains("?"))url=url.substring(0,url.indexOf("?"));
            url+="?";
            for(var key in qParams){
                url+=encodeURIComponent(key)+"="+encodeURIComponent(qParams[key])+"&";
            }
            url=url.substring(0,url.length-1);
            isc.Cookie.set(this.creator.loadAutoSaveCookie,"true");
            this.creator._addUsageRecord("skinChange",value);
            location.replace(url);
        },
        setNativeSkin:function(value){
            this.creator.doAutoSave(this.getID()+".doSetNativeSkin("+value+")");
        },
        doSetNativeSkin:function(value){
            var qParams=isc.clone(isc.params);
            qParams.useNativeSkin=value?1:0;
            var url=location.href;
            if(url.contains("?"))url=url.substring(0,url.indexOf("?"));
            url+="?";
            for(var key in qParams){
                url+=encodeURIComponent(key)+"="+encodeURIComponent(qParams[key])+"&";
            }
            url=url.substring(0,url.length-1);
            isc.Cookie.set(this.creator.loadAutoSaveCookie,"true");
            location.replace(url);
        },
        setResolution:function(width,height){
            this.creator.middleStack.setWidth(width);
            this.creator.rootLiveObject.setHeight(height);
            this.creator._addUsageRecord("resolutionChange",width,height);
            isc.Page.scrollTo(0,0);
        },
        previewAreaResized:function(width,height){
            if(this._resolutionMenu==null)return;
            if(this._resolutionMenu.currentResolutionItem.defaultResolutionItem){
                delete this._defaultPreviewWidth;
                delete this._defaultPreviewHeight;
            }
        },
        getDefaultPreviewWidth:function(){
            if(this._defaultPreviewWidth==null){
                this._defaultPreviewWidth=this.creator.middleStack.width;
            }
            return this._defaultPreviewWidth;
        },
        getDefaultPreviewHeight:function(){
            if(this._defaultPreviewHeight==null){
                this._defaultPreviewHeight=this.creator.rootLiveObject.height;
            }
            return this._defaultPreviewHeight;
        },
        getSubmenu:function(item){
            var existingMenu;
            item=this.getItem(item);
            if(item.title=="Skin"){
                if(this._skinMenu==null){
                    var skinValueMap=this.creator.skinValueMap,
                        subitems=[],
                        projectMenu=this,
                        builder=this.creator;
                    if(!this.creator.hostedMode){
                        subitems.addList([{
                            title:"Use high contrast tool skin",
                            checked:!isc.nativeSkin,
                            click:function(target,item,menu){
                                item.checked=!item.checked;
                                menu._parentMenu.setNativeSkin(!item.checked);
                            }
                        },{
                            isSeparator:true
                        }]);
                    }
                    if(this.creator.canOpenSkinEditor){
                        var userSkinsMenu=isc.Menu.create({
                            title:'Custom Skins',
                            submenu:[]
                        });
                        var userSkinDS=isc.DataSource.get('userSkin');
                        userSkinDS.fetchData(null,function(dsResponse,data,dsRequest){
                            for(var index=0;index<data.length;index++){
                                var rec=data[index];
                                userSkinsMenu.submenu.add({
                                    name:rec.name,
                                    title:rec.title,
                                    click:function(target,item,menu,colNum){
                                        projectMenu.setSkin(item.name);
                                    },
                                    checkIf:function(target,menu,item){
                                        return builder.skin==item.name;
                                    }
                                });
                            }
                        },{fetchMode:'local',sortBy:'-created_at'});
                        subitems.add(userSkinsMenu);
                    }
                    var standardSkinsMenu=isc.Menu.create({
                        title:'Standard Skins',
                        submenu:[]
                    });
                    for(var skinName in skinValueMap){
                        standardSkinsMenu.submenu.add({
                            name:skinName,title:skinValueMap[skinName],
                            click:function(target,item,menu,colNum){
                                projectMenu.setSkin(item.name);
                            },
                            checkIf:function(target,menu,item){
                                return builder.skin==item.name;
                            }
                        });
                    }
                    subitems.add(standardSkinsMenu);
                    subitems.add({isSeparator:true});
                    if(builder.canOpenSkinEditor){
                        subitems.add({
                            title:'Open Skin Editor...',
                            click:function(target,item,menu,colNum){
                                var href=(builder.hostedMode?"/themes/":"/tools/skinTools/skinEditor.jsp");
                                window.open(href,"_blank");
                            }
                        });
                    }
                    this._skinMenu=this.Super("getSubmenu",arguments);
                    this._skinMenu.addProperties({
                        data:subitems
                    });
                }
                return this._skinMenu;
            }else if(item.title=="Resolution"){
                var defaultPreviewWidth=this.getDefaultPreviewWidth(),
                    defaultPreviewHeight=this.getDefaultPreviewHeight();
                if(this._resolutionMenu==null){
                    var staticResolutions=[[1024,768],[1280,1024]],
                        subItems=[];
                    subItems[0]={
                        defaultResolutionItem:true,
                        checkIf:function(target,menu,item){
                            return(item==menu.currentResolutionItem);
                        },
                        dynamicTitle:function(target,menu,item){
                            return item.width+"x"+item.height+" [fit to browser]";
                        },
                        width:defaultPreviewWidth,
                        height:defaultPreviewHeight
                    };
                    for(var i=0;i<staticResolutions.length;i++){
                        subItems.add({
                            checkIf:function(target,menu,item){
                                return(item==menu.currentResolutionItem);
                            },
                            dynamicTitle:function(target,menu,item){
                                return item.width+"x"+item.height;
                            },
                            width:staticResolutions[i][0],
                            height:staticResolutions[i][1]
                        });
                    }
                    this._resolutionMenu=this.Super("getSubmenu",arguments);
                    this._resolutionMenu.addProperties({
                        data:subItems,
                        itemClick:function(item,colNum){
                            this.currentResolutionItem=item;
                            this._parentMenu.setResolution(item.width,item.height);
                        }
                    });
                    this._resolutionMenu.currentResolutionItem=subItems[0];
                }else{
                    this._resolutionMenu.data[0].width=defaultPreviewWidth;
                    this._resolutionMenu.data[0].height=defaultPreviewHeight;
                }
                return this._resolutionMenu;
            }
            if(!existingMenu){
                existingMenu=this.Super("getSubmenu",arguments);
                if(existingMenu)existingMenu.emptyMessage="[No entries]";
            }
            return existingMenu;
        }
    };
    this.screenListDefaults={
        _constructor:"TTreeGrid",
        autoParent:"screenPane",
        canReparentNodes:true,
        canReorderRecords:true,
        canEdit:true,
        modalEditing:true,
        rowEditorEnter:function(){
            if(this._editRowForm){
                isc.RPCManager.registerUnmaskedTarget(this._editRowForm);
            }
            if(this._exitAction){
                isc.Timer.clear(this._exitAction);
                delete this._exitAction;
            }
            if(!this.fieldIsVisible("fileName"))this.showField("fileName");
        },
        rowEditorExit:function(){
            if(!this._exitAction)this._exitAction=this.delayCall("hideFileNameField");
        },
        hideFileNameField:function(){
            if(this._editRowForm){
                isc.RPCManager.unregisterUnmaskedTarget(this._editRowForm);
            }
            delete this._exitAction;
            this.hideField("fileName");
        },
        validateRow:function(rowNum){
            var screenNodes=this.creator.project?this.creator.project.screens.getAllNodes():[],
                editValues=this.getEditValues(rowNum);
            for(var i=0;screenNodes&&i<screenNodes.length;i++){
                if(i==rowNum)continue;
                if(screenNodes[i].fileName==editValues.fileName){
                    var uniqueName=this.getUniqueName(screenNodes,editValues.fileName);
                    if(uniqueName==null){
                        isc.say("File name is already in use for another screen, and we "+
                                "cannot derive a unique alternative");
                        return;
                    }
                    var _this=this;
                    var dialog=isc.Dialog.create({
                        title:"Duplicate file name",
                        message:"File name is already in use for another screen.  Please "+
                                  "select how to proceed",
                        icon:"[SKIN]ask.png",
                        buttons:[
                            isc.Button.create({title:"Overwrite '"+editValues.fileName+"'"}),
                            isc.Button.create({title:"Save As '"+uniqueName+"'"}),
                            isc.Button.create({title:"Cancel"})
                        ],
                        buttonClick:function(button,index){
                            if(index<2){
                                if(index==1){
                                    this.setEditValue(rowNum,"fileName",uniqueName);
                                }
                                _this.endEditing();
                            }
                            this.hide();
                            this.destroy();
                        }
                    });
                    dialog.show();
                    return false;
                }
            }
            return true;
        },
        getUniqueName:function(screens,fileName){
            for(var i=1;i<1000;i++){
                var uniqueName=fileName+i;
                var collision=false;
                for(var j=0;j<screens.length;j++){
                    if(screens.fileName==uniqueName){
                        collision=true;
                        break;
                    }
                    if(!collision){
                        return uniqueName;
                    }
                }
            }
        },
        showHeader:false,
        hilites:[{
            criteria:{
                _constructor:"AdvancedCriteria",
                fieldName:"dirty",
                operator:"notNull"
            },
            cssText:"color: red;"
        }],
        fields:[
            {
                name:"title",
                title:"Description",
                treeField:true,
                formatCellValue:function(value,record,rowNum,colNum,grid){
                    return value.endsWith(".xml")?value.slice(0,-4):value;
                }
            },
            {
                name:"fileName",
                title:"Filename",
                hidden:true
            }
        ],
        screenContextMenuDefaults:{
            _constructor:"Menu",
            autoDraw:false,
            showIcon:false,
            showMenuFor:function(record,recordNum){
                this._record=record;
                this._recordNum=recordNum;
                this.showContextMenu();
            },
            data:[{
                title:"Rename screen...",
                click:function(target,item,menu){
                    menu.creator.edit(menu._recordNum);
                }
            },{
                title:"Save",
                click:function(target,item,menu){
                    menu.creator.creator.cacheCurrentScreenContents();
                    menu.creator.creator.project.saveScreenContents(menu._record);
                }
            },{
                title:"Save as ...",
                click:function(target,item,menu){
                    menu.creator.creator.saveScreenAs(menu._record);
                }
            },{
                title:"Export as JSP ...",
                enabled:this.filesystemDataSourceEnabled,
                click:function(target,item,menu){
                    menu.creator.creator.exportScreenAsJSP(menu._record);
                }
            },{
                title:"Remove from project",
                click:function(target,item,menu){
                    menu.creator.creator.project.removeScreen(menu._record,true);
                }
            },{
                title:"Delete on server",
                enableIf:function(target,menu,item){
                    if(item.enabled===false)return false;
                    return menu._record.fileName;
                },
                click:function(target,item,menu){
                    var message="Delete screen '"+menu._record.title+"' on the server? "+
                                  "This operation cannot be undone.";
                    isc.confirm(message,function(response){
                        if(response)menu.creator.creator.deleteScreen(menu._record);
                    });
                }
            }]
        },
        groupContextMenuDefaults:{
            _constructor:"Menu",
            autoDraw:false,
            showIcon:false,
            showMenuFor:function(record,recordNum){
                this._record=record;
                this._recordNum=recordNum;
                this.showContextMenu();
            },
            data:[{
                title:"Remove from project",
                click:function(target,item,menu){
                    menu.creator.creator.project.removeGroup(menu._record);
                }
            },{
                title:"Rename",
                click:function(target,item,menu){
                    menu.creator.startEditing(menu._recordNum,0);
                }
            }]
        },
        initWidget:function(){
            this.Super("initWidget",arguments);
            this.screenContextMenu=this.createAutoChild("screenContextMenu");
            this.groupContextMenu=this.createAutoChild("groupContextMenu");
        },
        folderContextClick:function(viewer,folder,recordNum){
            this.groupContextMenu.showMenuFor(folder,recordNum);
            return false;
        },
        leafContextClick:function(viewer,leaf,recordNum){
            this.screenContextMenu.showMenuFor(leaf,recordNum);
            return false;
        },
        selectionStyle:"single",
        selectionChanged:function(record,state){
            if(this._inSelectionChanged)return;
            this._inSelectionChanged=true;
            this.cancelEditing();
            if(state&&!record.isFolder)this.creator.setCurrentScreen(record);
            delete this._inSelectionChanged;
        }
    };
    this.screenAddButtonMenuDefaults={
        _constructor:"Menu",
        data:[{
            title:"New screen",
            click:function(target,item,menu){
                menu.creator.createNewScreen();
            }
        },{
            title:"Import screen",
            enabled:this.filesystemDataSourceEnabled,
            click:function(target,item,menu){
                var refDocURL="../../isomorphic/system/reference/SmartClient_Reference.html#group..visualBuilder";
                isc.ask("This feature allows you to import externally edited XML or JS code."+
                        " The Visual Builder cannot fully capture all externally edited files."+
                        " For more information, see the <a target=_blank href='"+refDocURL+
                        "'>Visual Builder Docs</a><br><br>Proceed with Import?",function(response){
                    if(response)menu.creator.showImportDialog(menu);
                });
            }
        },{
            title:"Import from Balsamiq",
            click:function(target,item,menu){
                isc.BMMLImportDialog.create({
                    showFileNameField:menu.creator.loadFileBuiltinIsEnabled,
                    showAssetsNameField:menu.creator.saveFileBuiltinIsEnabled,
                    showOutputField:menu.creator.saveFileBuiltinIsEnabled,
                    showSkinSelector:false,
                    submit:function(fileName,id,outputFileName,fileContent,skin,dropMarkup,trimSpace,fillSpace,fieldNamingConvention){
                        menu.creator.loadBMMLMockup(fileName,id,fileContent,dropMarkup,trimSpace,fillSpace,fieldNamingConvention,true);
                        this.markForDestroy();
                    }
                });
            }
        },{
            title:"Load a shared screen",
            click:function(target,item,menu){
                menu.creator.showLoadSharedScreenUI();
            }
        },{
            isSeparator:true
        },{
            title:"New group",
            click:function(target,item,menu){
                menu.creator.showAddScreenGroupUI();
            }
        }]
    };
    this.Super("init",arguments);
    if(this.showRecentVersions==null)this.showRecentVersions=this.hostedMode;
    if(!this.showRecentVersions){
        var menuData=this.screenMenuDefaults.data;
        menuData.remove(menuData.find("title","View recent version"));
    }
    var _this=this;
    isc.DSWizard.loadWizardNodes(this,function(data){
        _this._dsWizards=data;
    });
}
);
isc.evalBoundary;isc.B.push(isc.A.initWidget=function isc_VisualBuilder_initWidget(){
    this.Super('initWidget',arguments);
    var streamLogging,
        hostedMode=this.hostedMode;
    if(hostedMode){
        this.clickStream=isc.ClickStream.getCommonFrameworkStream();
        if(this.captureUsageData)this._startCapturingUsageData();
        if(this.captureErrorReport)this._startCapturingErrorReports();
        this.deployDataSource=isc.DS.get(this.deployDataSource||"hostedDeployments");
        if(this.shouldShowRegDevUserMenuItems())this.authorizeManageUsersPanel();
    }
    if(!this.ignoreProgramErrors){
        this.observe(isc.Log,"_reportJSErrorStack","observer.handleProgramError()");
    }
    if(this.monitorServerConnection)this.startMonitoringServer();
    if(this.sessionTimeout)this.startTrackingSessionTimeout();
    if(this._forceOfflineStorage()){
        this.screenDataSource=this.projectDataSource=isc.OfflineFileSource.create();
    }else{
        this.screenDataSource=isc.DS.get(this.screenDataSource||
                                            (hostedMode?"hostedScreens":"vbScreens"));
        this.projectDataSource=isc.DS.get(this.projectDataSource||
                                            (hostedMode?"hostedProjects":"vbProjects"));
        streamLogging=hostedMode;
    }
    if(this.screenDataSource)this.screenDataSource.streamLogging=streamLogging;
    if(this.projectDataSource)this.projectDataSource.streamLogging=streamLogging;
    this.settingsDataSource=isc.DS.get(this.settingsDataSource||
                                         (hostedMode?"hostedSettings":"vbSettings"));
    this.dsDataSource=isc.DS.get(this.dsDataSource||
                                   (hostedMode?"hostedDataSources":"vbDataSources"));
    var undef;
    this.canExportJSP=this.canExportJSP!==undef?
        this.canExportJSP:hostedMode?false:true;
    isc.addProperties(this.projectComponentsDefaults,{
        canDropRootNodes:this.canAddRootComponents
    });
    isc.designTime=true;
    this.loadCurrentSettings({target:this,methodName:"finishInitWidget"});
    isc.DynamicForm.addProperties({dragLineStyle:"vbDragLine"});
    var loadingWrapper=document.getElementById('loadingWrapper');
    if(loadingWrapper)isc.Element.clear(loadingWrapper);
}
);
isc.evalBoundary;isc.B.push(isc.A.finishInitWidget=function isc_VisualBuilder_finishInitWidget(){
    if(!this.currentSettings)this.currentSettings={};
    isc.Page.setEvent("mouseDown",function(){
        var editor=isc.EditContext.titleEditor;
        if(editor){
            var x=isc.EH.getX(),
                y=isc.EH.getY();
            var editorRect=editor.getPageRect();
            if(x>=editorRect[0]&&x<=editorRect[0]+editorRect[2]&&
                y>=editorRect[1]&&y<=editorRect[1]+editorRect[3])
            {
            }else{
                editor.blur(editor,editor.getItem("title"));
            }
        }
    });
    this.enableKeyHandler(true);
    if(this.defaultApplicationMode){
        this.editingOn=this.defaultApplicationMode.toLowerCase()=="edit";
    }else{
        this.editingOn=false;
    }
    this.paletteNodeDS=this.createAutoChild("paletteNodeDS");
    this.paletteDS=this.createAutoChild("paletteDS",{
        paletteNodeDS:this.paletteNodeDS,
        customComponentsURL:this.getCustomComponentsURL(),
        defaultComponentsURL:this.defaultComponentsURL,
        defaultMockupComponentsURL:this.defaultMockupComponentsURL
    });
    var _this=this;
    this.rootLiveObject=this.createAutoChild("rootComponent",{
       autoDraw:false,
       editorRoot:true,
       canFocus:true,
       width:"100%",height:"100%",
       resized:function(){
           _this.previewAreaResized();
       }
    });
    var preview=isc.VLayout.create({
        autoDraw:false,
        canFocus:false,
        width:"100%",
        height:"50%",
        border:"6px groove #666666",
        align:"center",
        defaultLayoutAlign:"center",
        members:[this.rootLiveObject]
    });
    this.previewArea=preview;
var _this=this;
this.globalDependencies=isc.DataSource.create({
    dataURL:this.globalDependenciesURL,
    recordXPath:"//dependency",
    fields:[
        {name:"type"}
    ],
    loadDependencies:function(data){
        this.deps=data;
        for(var i=0;i<data.length;i++){
            var dep=data[i];
            if(dep.type=="js"||dep.type=="css"){
                if(dep.url.startsWith("/")){
                    isc.FileLoader.loadFile("../.."+dep.url);
                }else{
                    isc.FileLoader.loadFile(dep.url);
                }
            }else if(dep.type=="schema"){
                isc.DataSource.get(dep.id,function(){});
            }else if(dep.type=="ui"){
            }
        }
    }
});
this.globalDependencies.fetchData(null,this.getID()+".globalDependencies.loadDependencies(data)");
    if(this.singleScreenMode){
        this.showScreenList=false;
        this.showProjectMenu=false;
    }
    if(this.projectID&&!this.projectFileName){
        this.projectFileName=this._convertIDtoFileName(this.projectID);
        delete this.projectID;
    }
    if(this.singleScreenMode){
        var contents=isc.Offline.get(this.mockupMode?isc.Project.AUTOSAVE_MOCKUPS:isc.Project.AUTOSAVE_SINGLE_SCREEN);
        if(contents){
            this.loadProjectReply(null,{
                fileName:null,
                fileContents:contents
            },null);
        }else{
            this.makeDefaultProject();
        }
    }else if(this.project&&!isc.Browser.seleniumPresent){
        var project=this.project;
        this.project=null;
        this.setProject(project);
    }else if(this.projectFileName&&!isc.Browser.seleniumPresent){
        this.loadProject(this.projectFileName,this.projectOwnerId);
        if(!this.autoNameAndSaveProjectsAndScreens){
            this.makeNewProject();
        }
    }else{
        var contents=isc.Offline.get(this.mockupMode?isc.Project.AUTOSAVE_MOCKUPS:isc.Project.AUTOSAVE);
        if(contents){
            this.loadProjectReply(null,{
                fileName:null,
                fileContents:contents
            },null);
        }else{
            this.makeDefaultProject();
        }
    }
}
,isc.A.doAutoSave=function isc_VisualBuilder_doAutoSave(callback){
    if(this.project){
        this.project.autoSave(callback);
    }
}
,isc.A.hide=function isc_VisualBuilder_hide(){
    isc.SelectionOutline.deselect();
    this.Super("hide",arguments);
}
,isc.A.clear=function isc_VisualBuilder_clear(){
    isc.SelectionOutline.deselect();
    this.Super("clear",arguments);
}
,isc.A.showScreenUI=function isc_VisualBuilder_showScreenUI(){
    var mockupMode=this.getScreenMockupMode(this.currentScreen);
    if(mockupMode){
        this.mockupsMenuControl.show();
        this.projectMenuControl.hide();
        if(this.leftStack.getSectionNumber("componentProperties")>=0)this.leftStack.hideSection("componentProperties");
        if(this.leftStack.getSectionNumber("helpPane")>=0)this.leftStack.hideSection("helpPane");
        if(this.leftStack.getSectionNumber("componentLibrary")<0){
            var section=this.rightStack.sectionForItem(this.librarySearch);
            this.librarySearch.deparent();
            this.libraryComponents.deparent();
            this.librarySearchClear.deparent();
            section.items=[];
            this.rightStack.removeSection(section);
            this.leftStack.addSection({title:"Component Library",ID:"componentLibrary",autoShow:true,
                items:[this.librarySearch,this.libraryComponents,this.librarySearchClear]
            },0);
            this.librarySearchClear.hide();
        }
        this.middleStack.hideSection("componentTree");
        this.middleStack.setShowResizeBar(false);
        this.rightStack.hide();
        this.removeButton.show();
        this.bringToFrontButton.show();
        this.sendToBackButton.show();
        if(this.modeSwitcher)this.modeSwitcher.hide();
        this.screenMenuButton.hide();
        var editContext=this.projectComponents.getEditContext();
        editContext.isVisualBuilder=false;
        if(!this.mockupExtraPalettes)this.mockupExtraPalettes=this.createAutoChild("mockupExtraPalettes");
        editContext.extraPalettes=this.mockupExtraPalettes;
        editContext.allowNestedDrops=false;
        editContext.selectedAppearance="outlineMask";
        editContext.showSelectedLabel=false;
        this.rootLiveObject.childrenSnapToGrid=true;
        this.rootLiveObject.snapGridStyle="lines";
        editContext.canSelectEditNodes=true;
        editContext.selectionType=isc.Selection.MULTIPLE;
        editContext.setEditProxyProperties(this.rootLiveObject,{
            supportsInlineEdit:false,
            allowNestedDrops:true,
            autoMaskChildren:true,
            persistCoordinates:true
        });
        this.rootLiveObject.setEditMode(true,this.projectComponents.getEditContext(),this.projectComponents.getRootEditNode());
        this.enableDeleteKeyHandler(true);
    }else{
        this.mockupsMenuControl.hide();
        this.projectMenuControl.show();
        if(this.leftStack.getSectionNumber("componentProperties")>=0)this.leftStack.showSection("componentProperties");
        if(this.leftStack.getSectionNumber("helpPane")>=0)this.leftStack.showSection("helpPane");
        this.middleStack.showSection("componentTree");
        this.middleStack.setShowResizeBar(true);
        if(this.rightStack.getSectionNumber("componentLibrary")<0){
            var section=this.leftStack.sectionForItem(this.librarySearch);
            this.librarySearch.deparent();
            this.libraryComponents.deparent();
            this.librarySearchClear.deparent();
            section.items=[];
            this.leftStack.removeSection(section);
            this.rightStack.addSection({title:"Component Library",ID:"componentLibrary",autoShow:true,
                items:[this.librarySearch,this.libraryComponents,this.librarySearchClear]
            },0);
            this.librarySearchClear.hide();
            this.rightStack.show();
        }
        this.removeButton.hide();
        this.bringToFrontButton.hide();
        this.sendToBackButton.hide();
        if(this.modeSwitcher&&this.middleStack.isDrawn()){
            this.modeSwitcher.show();
        }
        if(this.previewArea.isVisible()){
            this.screenMenuButton.show();
        }
        var editContext=this.projectComponents.getEditContext();
        editContext.isVisualBuilder=true;
        editContext.allowNestedDrops=true;
        editContext.selectionType=isc.Selection.SINGLE;
        editContext.selectedAppearance="outlineEdges";
        editContext.showSelectedLabel=true;
        if(!this.vbExtraPalettes)this.vbExtraPalettes=this.createAutoChild("vbExtraPalettes");
        editContext.extraPalettes=this.vbExtraPalettes;
        this.rootLiveObject.autoMaskChildren=false;
        this.rootLiveObject.childrenSnapToGrid=false;
        this.rootLiveObject.setChildrenSnapAlign(false);
        editContext.setEditProxyProperties(this.rootLiveObject,{
            supportsInlineEdit:false,
            allowNestedDrops:false,
            persistCoordinates:false
        });
        this.rootLiveObject.setEditMode(true,this.projectComponents.getEditContext(),this.projectComponents.getRootEditNode());
        this.enableDeleteKeyHandler(false);
    }
    this.show();
}
,isc.A.updateSelectionActionButtons=function isc_VisualBuilder_updateSelectionActionButtons(){
    var selection=this.projectComponents.getEditContext().getSelectedEditNodes();
    if(selection.length==0){
        this.removeButton.disable();
        this.sendToBackButton.disable();
        this.bringToFrontButton.disable();
    }else{
        this.removeButton.enable();
        this.sendToBackButton.enable();
        this.bringToFrontButton.enable();
    }
}
,isc.A.enableKeyHandler=function isc_VisualBuilder_enableKeyHandler(enable){
    if(enable){
        if(!this._keyPressEventID){
            this._keyPressEventID=isc.Page.setEvent("keyPress",this);
        }
    }else{
        if(this._keyPressEventID){
            isc.Page.clearEvent("keyPress",this._keyPressEventID);
            delete this._keyPressEventID;
        }
    }
}
,isc.A.enableDeleteKeyHandler=function isc_VisualBuilder_enableDeleteKeyHandler(enable){
    this._keyPressAllowDeletes=enable;
}
,isc.A.pageKeyPress=function isc_VisualBuilder_pageKeyPress(target,eventInfo){
    if(!this.project||(this.project.saveScreenDialog&&this.project.saveScreenDialog.containsFocus()))return;
    var key=isc.EH.getKey();
    if(this._keyPressAllowDeletes){
        var selection=this.projectComponents.getEditContext().getSelectedEditNodes();
        if(selection.length==0){
            if(key=="Delete"||key=="Backspace"){
                if(this.codePreview&&this.codePreview.hasFocus)return true;
                return false;
            }
            return;
        }
        if(!this.previewArea.containsFocus())return;
        if(key=="Delete"||key=="Backspace"){
            var editContext=this.projectComponents.getEditContext();
            for(var i=0;i<selection.length;i++){
                editContext.removeNode(selection[i]);
            }
            return false;
        }
    }
    if(this.hostedMode&&(key=="Z"||key=="Y")){
        if(isc.EH.ctrlKeyDown()){
            var readOnly=(this.project?this.project.isReadOnly():true);
            if(!readOnly){
                var shift=isc.EH.shiftKeyDown(),
                    revertVersion;
                if(key=="Z"&&!shift){
                    revertVersion=this.getUndoRedoVersion(true);
                }else if((key=="Z"&&shift)||key=="Y"){
                    revertVersion=this.getUndoRedoVersion(false);
                }
                if(revertVersion){
                    this.revertScreen(this.currentScreen,revertVersion,true);
                    this._addUsageRecord("revert",this.getCurrentScreenTitle(),
                                                   this.getProjectDisplayName());
                }
                return false;
            }
        }
    }
}
,isc.A.screenIsUndoVersion=function isc_VisualBuilder_screenIsUndoVersion(){
    if(!this._undoCurrentVersion||!this.currentScreen.versions)return false;
    var data=this.currentScreen.versions;
    if(!data||data.getLength()==0)return false;
    return(isc.DateUtil.compareDates(this._undoCurrentVersion,data[0].fileLastModified)!=0);
}
,isc.A.resetUndoPosition=function isc_VisualBuilder_resetUndoPosition(version){
    this._undoCurrentVersion=version;
}
,isc.A.getUndoRedoVersion=function isc_VisualBuilder_getUndoRedoVersion(undo){
    var data=this.currentScreen.versions;
    if(!data)return null;
    var currentVersion=this._undoCurrentVersion,
        lastVersion
    ;
    if(!currentVersion&&data.getLength()==0)return null;
    if(!currentVersion){
        currentVersion=data[0].fileLastModified;
        this._undoCurrentVersion=currentVersion;
    }
    for(var i=0;i<data.getLength();i++){
        if(data[i].fileAutoSaved){
            if(undo&&isc.DateUtil.compareDates(lastVersion,currentVersion)==0){
                return data[i].fileLastModified;
            }else if(!undo&&isc.DateUtil.compareDates(data[i].fileLastModified,currentVersion)==0){
                return lastVersion;
            }
            lastVersion=data[i].fileLastModified;
        }
    }
    return null;
}
,isc.A.getUndoMarkerVersions=function isc_VisualBuilder_getUndoMarkerVersions(){
    var data=this.currentScreen.versions;
    if(!data)return null;
    var currentVersion=this._undoCurrentVersion;
    if(!currentVersion&&(!data||data.getLength()==0))return null;
    var markers=[];
    for(var i=1;i<data.getLength();i++){
        if(data[i].fileAutoSaved){
            if(isc.DateUtil.compareDates(data[i].fileLastModified,currentVersion)==0){
                break;
            }
            markers.add(data[i].fileLastModified);
        }
    }
    return markers;
}
,isc.A.updateMockupsMenuControl=function isc_VisualBuilder_updateMockupsMenuControl(){
    if(this.mockupsMenu)return;
    this.mockupsMenu=this.createAutoChild("mockupsMenu");
    this.mockupsMenuButton=this.createAutoChild("mockupsMenuButton",{
        menu:this.mockupsMenu
    });
    var controlGroup=isc.RibbonGroup.create({
        bodyProperties:{membersMargin:0,layoutMargin:0},
        showTitle:false,layoutMargin:0,rowHeight:22,border:"0px",
        controls:[
            this.mockupsMenuButton
        ]
    });
    this.mockupsMenuControl=this.createAutoChild("mockupsMenuControl",{
        members:[controlGroup]
    });
}
,isc.A.updateProjectMenuControl=function isc_VisualBuilder_updateProjectMenuControl(){
    if(this.projectName){
        this.projectName.setContents(this.getProjectDisplayName());
        var readOnly=this.project.isReadOnly();
        this.projectNamePane.setReadOnly(readOnly);
        this.dsNewButton.setDisabled(readOnly);
    }
    if(this.projectMenu)return;
    if(this.showProjectMenu!=false){
        var items=this.getRecentProjects();
        this.recentProjectsMenu=this.createAutoChild("recentProjectsMenu",{
            data:items
        });
        this.projectMenu=this.createAutoChild("projectMenu");
        this.projectMenuButton=this.createAutoChild("projectMenuButton",{
            menu:this.projectMenu
        });
        var controlGroup=isc.RibbonGroup.create({
            bodyProperties:{membersMargin:0,layoutMargin:0},
            showTitle:false,layoutMargin:0,rowHeight:22,border:"0px",
            controls:[
                this.projectMenuButton
            ]
        });
        this.projectMenuControl=this.createAutoChild("projectMenuControl",{
            members:[controlGroup]
        });
    }
}
,isc.A.updateRunMenuControl=function isc_VisualBuilder_updateRunMenuControl(){
    var builder=this,
        project=this.project,
        runConfigs=project.runConfigurations,
        defaultRunConfig,
        runButtonTitle="Run"
    ;
    if(runConfigs&&runConfigs.length>0){
        for(var i=0;i<runConfigs.length;i++){
            var runConfig=runConfigs[i];
            if(runConfig.default==true||runConfig.default=="true"){
                defaultRunConfig=runConfig;
                runButtonTitle="Run "+runConfig.name;
                break;
            }
        }
    }
    this.runMenuData=[];
    if(this.mockupMode){
        this.runMenuData.addList([{
            title:"Reify Preview",
            showIf:function(){return false;},
            click:function(){
                builder.confirmReifyPreview();
            }
        },{
            title:"Open in Visual Builder",
            click:function(){
                builder.confirmOpenInBuilder();
            }
        }]);
    }else{
        this.runMenuData.addList([{
            title:runButtonTitle,
            icon:"actions/run.png",
            enableIf:function(target,menu,item){
                return builder._runProjectEnabled();
            },
            click:function(target,item,menu){
                builder.runProject();
            }
        },{
            title:"Run as...",
            icon:"actions/runAs.png",
            click:function(){
                builder.editRunConfiguration(null,function(runConfig){
                    if(runConfig.name){
                        builder.saveRunConfiguration(runConfig);
                    }
                    builder.runProject(runConfig);
                });
            }
        }]);
        if(runConfigs&&runConfigs.length>0){
            this.runMenuData.addList([{
                isSeparator:true
            },{
                title:"Saved Configurations",
                enabled:false
            }]);
            for(var i=0;i<runConfigs.length;i++){
                var runConfig=runConfigs[i];
                this.runMenuData.add({
                    title:runConfig.name,
                    checked:(runConfig.default==true||runConfig.default=="true"),
                    enableIf:function(target,menu,item){
                        return builder._runProjectEnabled();
                    },
                    runConfig:runConfig,
                    canCopy:true,
                    canEdit:true,
                    canDelete:true
                });
            }
        }
    }
    if(this.runMenuData.length>1){
        if(this.runMenu){
            this.runButton.setTitle(runButtonTitle);
            this.runMenu.setData(this.runMenuData);
            return;
        }
        this.runMenuDefaults={
            _constructor:"Menu",
            hoverStyle:"darkHover",
            fields:[
                "icon",
                "title",
                {name:"canCopy",width:16,
                    showValueIconOnly:true,
                    valueIcons:{
                        "true":"actions/copyScreen.png"
                    },
                    showHover:true,
                    hoverWrap:false,
                    hoverHTML:function(record,value,rowNum,colNum,grid){
                        return(value?"Copy configuration":null);
                    }
                },
                {name:"canEdit",width:16,
                    showValueIconOnly:true,
                    valueIcons:{
                        "true":"workflow/update.png"
                    },
                    showHover:true,
                    hoverWrap:false,
                    hoverHTML:function(record,value,rowNum,colNum,grid){
                        return(value?"Edit configuration":null);
                    }
                },
                {name:"canDelete",width:16,
                    showValueIconOnly:true,
                    valueIcons:{
                        "true":"[SKIN]/../../../ToolSkin/images/actions/remove.png"
                    },
                    showHover:true,
                    hoverWrap:false,
                    hoverHTML:function(record,value,rowNum,colNum,grid){
                        return(value?"Delete configuration":null);
                    }
                }
            ],
            data:this.runMenuData,
            itemClick:function(item,colNum){
                if(colNum==2&&item.runConfig){
                    builder.editRunConfiguration(item.runConfig,function(runConfig,action){
                        if(action=="save"){
                            builder.saveRunConfiguration(runConfig);
                        }
                    },true);
                }else if(colNum==3&&item.runConfig){
                    builder.editRunConfiguration(item.runConfig,function(runConfig,action){
                        if(action=="save"){
                            builder.saveRunConfiguration(runConfig,item.runConfig.name);
                        }else if(action=="delete"){
                            builder.removeRunConfiguration(runConfig);
                        }
                    });
                }else if(colNum==4&&item.runConfig){
                    builder.removeRunConfiguration(item.runConfig,true);
                }else if(item.runConfig){
                    builder.runProject(item.runConfig);
                }
            }
        };
        this.runMenu=this.createAutoChild("runMenu");
    }
    var controls=[
        this.runButton=this.createAutoChild("runButton",{
            title:runButtonTitle,
            click:function(){
                builder.runProject(defaultRunConfig);
            }
        })
    ];
    if(this.runMenuData.length>1){
        controls.add(
            this.createAutoChild("runMenuButton",{menu:this.runMenu})
        );
    }
    var controlGroup=isc.RibbonGroup.create({
        bodyProperties:{membersMargin:0,layoutMargin:0},
        showTitle:false,layoutMargin:0,rowHeight:22,border:"0px",
        controls:controls
    });
    this.runMenuControl=this.createAutoChild("runMenuControl",{
        members:[controlGroup]
    });
}
,isc.A.updateDeployMenuControl=function isc_VisualBuilder_updateDeployMenuControl(){
    if(!this.hostedMode)return;
    var builder=this,
        project=this.project
    ;
    this.deployMenuData=[{
        title:"Deploy to",
        icon:"actions/deploy.png",
        click:function(){
            builder.showDeploymentsWindow();
        },
        enableIf:function(target,menu,item){
            if(!item.submenu)item.submenu=menu.creator.existingDeploymentsMenu;
            return builder.hasExistingDeployments();
        }
    },{
        title:"New Deployment...",
        icon:"actions/new_deployment.png",
        click:function(){
            builder.showDeploymentWindow();
        }
    },{
        isSeparator:true
    },{
        title:"Manage...",
        click:function(){
            builder.showDeploymentsWindow();
        },
        enableIf:function(){
            return builder.hasExistingDeployments();
        }
    }];
    if(this.deployMenu){
        return;
    }
    this.deployMenuDefaults={
        _constructor:"Menu",
        title:"Deploy",
        width:200,
        data:this.deployMenuData,
        rowClick:function(record,rowNum,colNum){
            this.Super("rowClick",arguments);
            if(this.hasSubmenu(record)){
                if(record.click)record.click();
            }
        }
    };
    this.existingDeploymentsMenu=this.createAutoChild("existingDeploymentsMenu",{
        dataSource:builder.createExistingDeploymentsDS()
    });
    this.updateExistingDeployments();
    this.deployMenu=this.createAutoChild("deployMenu");
    var controls=[
        this.deployMenuButton=this.createAutoChild("deployMenuButton",{
            menu:this.deployMenu
        })
    ];
    var controlGroup=isc.RibbonGroup.create({
        bodyProperties:{membersMargin:0,layoutMargin:0},
        showTitle:false,layoutMargin:0,rowHeight:22,border:"0px",
        controls:controls
    });
    this.deployMenuControl=this.createAutoChild("deployMenuControl",{
        members:[controlGroup]
    });
}
,isc.A.updateExistingDeployments=function isc_VisualBuilder_updateExistingDeployments(){
    var builder=this;
    this.deployDataSource.listFiles(null,function(response,data,request){
        if(data==null){
            builder.logWarn("unable to get existing deployments from DS: "+response.data);
        }else{
            var ds=builder.existingDeployments;
            ds.setCacheData(response.data);
            ds.updateCaches({dataSource:ds,invalidateCache:true});
        }
    },{operationId:"allOwners"});
}
,isc.A.createExistingDeploymentsDS=function isc_VisualBuilder_createExistingDeploymentsDS(){
    var ds=this.existingDeployments;
    if(ds!=null)return ds;
    var builder=this;
    return this.existingDeployments=isc.DataSource.create({
        clientOnly:true,
        fields:[{name:"id",primaryKey:true},
                 {name:"fileName",title:"Name"},
                 {name:"fileType",title:"Type"}],
        updateCacheFromServer:function(dsResponse,data){
            switch(dsResponse.operationType){
            case"add":this.addData(data);break;
            case"update":this.updateData(data);break;
            }
        },
        getCacheLength:function(){
            return this.cacheData.getLength();
        },
        getRecord:function(id){
            return this.cacheData.find("id",id);
        }
    });
}
,isc.A.hasExistingDeployments=function isc_VisualBuilder_hasExistingDeployments(){
    var ds=this.existingDeployments;
    return ds?ds.getCacheLength()>0:null;
}
,isc.A.showDeploymentWindow=function isc_VisualBuilder_showDeploymentWindow(record){
    var deploymentWindow=this.deploymentWindow;
    if(deploymentWindow==null||deploymentWindow.destroyed){
        deploymentWindow=this.deploymentWindow=this.createAutoChild("deploymentWindow");
    }
    deploymentWindow.setTitle(record?"Deploy to: "+
        isc.DeploymentEditor.getDeploymentTitle(record):"New Deployment");
    var deploymentEditor=this.deploymentEditor;
    if(deploymentEditor==null||deploymentEditor.destroyed){
        deploymentEditor=this.deploymentEditor=this.createAutoChild("deploymentEditor");
    }
    deploymentWindow.addItem(deploymentEditor);
    deploymentWindow.show();
    deploymentEditor.updateData();
    if(record)deploymentEditor.editRecord(record);
    else deploymentEditor.editNewRecord();
}
,isc.A.showDeploymentsWindow=function isc_VisualBuilder_showDeploymentsWindow(){
    var deploymentsWindow=this.deploymentsWindow;
    if(deploymentsWindow==null||deploymentsWindow.destroyed){
        deploymentsWindow=this.deploymentsWindow=this.createAutoChild("deploymentsWindow");
    }
    var deploymentsManager=this.deploymentsManager;
    if(deploymentsManager==null||deploymentsManager.destroyed){
        deploymentsManager=this.deploymentsManager=this.createAutoChild("deploymentsManager");
    }
    deploymentsWindow.addItem(deploymentsManager);
    deploymentsWindow.show();
    deploymentsManager.updateData();
}
,isc.A.editSampleUsers=function isc_VisualBuilder_editSampleUsers(){
    if(this.editSampleUsersWindow==null){
        this.editSampleUsersWindow=this.createAutoChild("editSampleUsersWindow");
    }
    this.editSampleUsersWindow.show();
}
,isc.A.updateCurrentUser=function isc_VisualBuilder_updateCurrentUser(user){
    if(this.project==null)return;
    if(this.project.authentication==null)this.project.authentication={};
    var authConfig=this.project.authentication;
    authConfig.lastSelectedUser=user.userId;
    this.project.autoSaveSoon(true);
    this.updateUsersRolesMenuControl();
}
,isc.A.updateSampleUsers=function isc_VisualBuilder_updateSampleUsers(users,suppressRolesMenuUpdate){
    if(this.project==null)return;
    if(this.project.authentication==null)this.project.authentication={};
    this.project.authentication.users=users.duplicate();
    this.project.autoSaveSoon();
    if(!suppressRolesMenuUpdate)this.updateUsersRolesMenuControl();
}
,isc.A.editSampleRoles=function isc_VisualBuilder_editSampleRoles(){
    if(this.editSampleRolesWindow==null){
        var project=this.project,
        auth=project&&project.authentication,
        sampleRoles=auth&&auth.availableRoles;
        if(sampleRoles==null)sampleRoles=[];
        else{
            if(sampleRoles[0]&&sampleRoles[0].internalId==null){
                var count=0;
                for(var i=0;i<sampleRoles.length;i++){
                    if(sampleRoles[i].internalId==null){
                        sampleRoles[i].internalId=count++;
                    }
                }
            }
        }
        this.roleDS=isc.DataSource.create({
            clientOnly:true,
            cacheData:sampleRoles.duplicate(),
            fields:[
                {name:"internalId",hidden:true,primaryKey:true,type:"sequence"},
                {name:"name",required:true,type:"identifier",
                    validators:[{
                        type:"isUnique"
                    }]
                },
                {name:"description",type:"text",length:150}
            ]
        });
        this.editSampleRolesWindow=this.createAutoChild("editSampleRolesWindow");
    }
    this.editSampleRolesWindow.show();
}
,isc.A.updateSampleRolesFromDS=function isc_VisualBuilder_updateSampleRolesFromDS(){
    var sampleRoleData=this.roleDS.fetchData(null,{target:this,methodName:"updateSampleRoles"});
}
,isc.A.updateSampleRoles=function isc_VisualBuilder_updateSampleRoles(dsResponse,roleData,dsRequest){
    if(this.project==null)return;
    if(this.project.authentication==null)this.project.authentication={};
    this.project.authentication.availableRoles=roleData.duplicate();
    var roles=roleData.getProperty("name");
    isc.Auth.setAvailableRoles(roles);
    this.project.autoSaveSoon();
    this.updateUsersRolesMenuControl();
    var mismatchedUserRoles=false;
    var sampleUsers=this.project.authentication.users;
    if(sampleUsers&&sampleUsers.length>0){
        for(var i=0;(i<sampleUsers.length)&&!mismatchedUserRoles;i++){
            var userRoles=sampleUsers[i].roles;
            if(!isc.isAn.Array(userRoles))userRoles=[userRoles];
            for(var ii=0;ii<userRoles.length;ii++){
                if(userRoles[ii]==null||isc.isAn.emptyString(userRoles[ii]))continue;
                if(roles.indexOf(userRoles[ii])==-1){
                    mismatchedUserRoles=true;
                    break;
                }
            }
        }
    }
    if(mismatchedUserRoles){
        var _this=this;
        isc.ask("Available roles updated.<P>"+
            "Specified roles for test users no longer match the roles available"+
            " - update test user data?",
            function(value){
                if(value){
                    _this.editSampleUsers();
                }
            },
            {title:"Update Test Users?"}
        );
    }else{
        isc.notify("Available roles updated");
    }
}
,isc.A.updateUsersRolesMenuControl=function isc_VisualBuilder_updateUsersRolesMenuControl(){
    if(!this.showUsersAndRoles)return;
    var builder=this,
        project=this.project,
        authConfig=project.authentication||{},
        availableRoles=authConfig.availableRoles;
    var allRoleNames=[],
        availableRolesChanged=false;
    if(availableRoles!=null){
        for(var i=0;i<availableRoles.length;i++){
            allRoleNames[i]=isc.isAn.Object(availableRoles[i])?availableRoles[i].name:availableRoles[i];
        }
        availableRolesChanged=(Array.compareAscending(allRoleNames,isc.Auth.getAvailableRoles())!=0);
        isc.Auth.setAvailableRoles(allRoleNames);
    }
    var sampleUsers=authConfig.users||[];
    if(this.sampleUsersMenu==null){
        this.sampleUsersMenu=this.createAutoChild("sampleUsersMenu");
        this.usersRolesMenu.items[0].submenu=this.sampleUsersMenu;
    }
    var sampleUsersItems=[];
    for(var i=0;i<sampleUsers.length;i++){
        var user=sampleUsers[i];
        var userRoles=user.superUser?["super-user"]:[];
        if(user.roles!=null&&!user.superUser){
            var roles=user.roles;
            if(!isc.isAn.Array(roles))roles=[roles];
            for(var ii=0;ii<roles.length;ii++){
                if(userRoles.indexOf(roles[ii])==-1){
                    userRoles.add(roles[ii]);
                }
            }
        }
        sampleUsersItems[i]={
            checkIf:function(target,menu,item){
                var currentUser=isc.Auth.getCurrentUser();
                return(currentUser!=null&&currentUser.userId!=null&&
                            (currentUser.userId==item.userId));
            },
            title:user.firstName+" "+user.lastName,
            roles:userRoles.join(", "),
            userId:user.userId,
            click:function(target,item,menu){
                builder.updateCurrentUser(item);
            }
        };
    }
    this.sampleUsersMenu.setItems(sampleUsersItems);
    var currentUser=authConfig.lastSelectedUser,
        userChanged=false,
        rolesChanged=false
    ;
    if(currentUser!=null){
        currentUser=sampleUsers.find("userId",currentUser);
    }
    if(currentUser==null){
        currentUser=sampleUsers[0];
    }
    if(currentUser){
        var roles=currentUser.roles;
        if(isc.isA.String(roles)&&authConfig.provider=="inlineSampleUsers"){
            roles=roles.split(",");
        }
        if(roles!=null&&!isc.isAn.Array(roles))roles=[roles];
        userChanged=(currentUser!=isc.Auth.getCurrentUser());
        rolesChanged=(Array.compareAscending(roles,isc.Auth.getRoles())!=0);
        isc.Auth.setCurrentUser(currentUser);
        isc.Auth.setRoles(roles);
        isc.Auth.setSuperUser(currentUser.superUser);
    }
    delete this._usersRolesTitleSizes;
    if(this.usersRolesLabel)this.usersRolesLabel.markForRedraw();
    if(this.editSampleUsersWindow&&this.editSampleUsersWindow.currentUserSelector!=null){
        this.editSampleUsersWindow.currentUserSelector.getItem("user").updateValueMap();
        this.editSampleUsersWindow.currentUserSelector.setValue("user",currentUser.userId);
    }
    if(availableRolesChanged||userChanged||rolesChanged){
        project.updateCurrentScreenDataSourcesSecurity();
    }
}
,isc.A.saveRunConfiguration=function isc_VisualBuilder_saveRunConfiguration(config,oldName){
    var project=this.project,
        runConfigs=project.runConfigurations,
        name=config.name
    ;
    if(!runConfigs)runConfigs=project.runConfigurations=[];
    if(config.default){
        var defaultConfigs=runConfigs.findAll("default","true");
        if(defaultConfigs)defaultConfigs.map(function(config){delete config.default});
    }
    if(oldName&&oldName!=name){
        var duplicateConfig=runConfigs.find("name",name);
        if(duplicateConfig)runConfigs.remove(duplicateConfig);
    }
    var targetConfigIndex=runConfigs.findIndex("name",oldName||name);
    if(targetConfigIndex>=0){
        runConfigs[targetConfigIndex]=config;
    }else{
        runConfigs.add(config);
    }
    runConfigs.sortByProperty("name",true);
    project.autoSaveSoon();
    this.updateRunMenuControl();
    isc.Notify.addMessage("Run configuration successfully saved");
}
);
isc.evalBoundary;isc.B.push(isc.A.editRunConfiguration=function isc_VisualBuilder_editRunConfiguration(config,callback,makeCopy){
    var that=this;
    var createAndShowDialog=function(ds){
        var data=ds.cacheData;
        data.add({name:'group2',title:'Standard Skins',customStyle:'cellDarkAltCol',canSelect:false});
        for(var skinName in that.skinValueMap){
            ds.addData({name:skinName,title:that.skinValueMap[skinName]});
        }
        if(that.canOpenSkinEditor){
            var href=(that.hostedMode?"/themes/":"/tools/skinTools/skinEditor.jsp");
            ds.addData({name:'launcher',title:'<a class="calMonthEventLink" target="_blank" href="'+href+'">Open Skin Editor...</a>',customStyle:'cellDarkAltCol',canSelect:false});
        }
        that.makeRunConfigDialog(config,ds,callback,makeCopy);
        that.runConfigWindow.show();
    };
    if(this.canOpenSkinEditor){
        var userSkinDS=isc.DataSource.get('userSkin');
        userSkinDS.getClientOnlyDataSource(null,function(allSkinsDS){
            var data=allSkinsDS.cacheData;
            if(!data.isEmpty()){
                data.addAt({name:'group1',title:'Custom Skins',customStyle:'cellDarkAltCol',canSelect:false},0);
            }
            createAndShowDialog(allSkinsDS);
        },{sortBy:'-pk'});
    }else{
        var ds=isc.DataSource.create({
            clientOnly:true,
            fields:[
                {name:"pk",type:"sequence",primaryKey:true},
                {name:"name",type:"text"},
                {name:"title",type:"text"}
            ],
            cacheData:[]
        });
        createAndShowDialog(ds);
    }
}
,isc.A.removeRunConfiguration=function isc_VisualBuilder_removeRunConfiguration(config,confirm){
    var builder=this,
        project=this.project,
        runConfigs=project.runConfigurations,
        deleteConfig=function(){
            runConfigs.remove(config);
            project.autoSaveSoon();
            builder.updateRunMenuControl();
            isc.Notify.addMessage("Run configuration successfully deleted");
        }
    ;
    if(confirm){
        isc.confirm("Delete saved configuration '"+config.name+"'?",function(response){
            if(response)deleteConfig();
        },{
            buttons:[isc.Dialog.NO,isc.Dialog.YES],
            autoFocusButton:1
        });
    }else{
        deleteConfig();
    }
}
,isc.A.getRunConfigurationCopyName=function isc_VisualBuilder_getRunConfigurationCopyName(config){
    var project=this.project,
        runConfigs=project.runConfigurations,
        name=config.name,
        count=1,
        copyName
    ;
    name=name.replace(/\s+copy(?:\s+\d+)?$/,"");
    do{
        copyName=name+" copy "+count++;
        var foundMatch=runConfigs.containsProperty("name",copyName);
    }while(foundMatch);
    return copyName;
}
,isc.A.getDefaultDensity=function isc_VisualBuilder_getDefaultDensity(skin){
    return this._skinDefaultDensity[skin];
}
,isc.A.getUserValueMap=function isc_VisualBuilder_getUserValueMap(){
    var auth=this.project&&this.project.authentication,
        sampleUsers=(auth&&auth.users)||[],
        userValueMap={}
    ;
    for(var i=0;i<sampleUsers.length;i++){
        var user=sampleUsers[i],
            roles=user.roles,
            userTitle=""
        ;
        if(user.firstName)userTitle+=user.firstName;
        if(user.lastName)userTitle+=" "+user.lastName;
        if(roles){
            if(!isc.isAn.Array(roles))roles=[roles];
            if(roles.length>0){
                userTitle+=" ("+
                    (user.superUser
                        ?"super-user"
                        :roles.join(","))
                    +")";
            }
        }else if(user.superUser){
            userTitle+=" (super-user)";
        }
        userValueMap[user.userId]=userTitle;
    }
    return userValueMap;
}
,isc.A.makeRunConfigDialog=function isc_VisualBuilder_makeRunConfigDialog(config,skinsDS,callback,makeCopy){
    var _this=this;
    if(this.runConfigForm)this.runConfigForm.markForDestroy();
    if(config&&makeCopy){
        config=isc.addProperties({},config,{
            name:this.getRunConfigurationCopyName(config),
            default:false
        });
    }
    var currentSkin=isc.currentSkin.name,
        density=this.getDefaultDensity(currentSkin)
    ;
    if(!density){
        density=this.getDefaultDensity("default");
    }
    var values=(config?config:{skin:currentSkin,density:density}),
        nameRequired=(config!=null),
        nameHint=(config?"":"(Optionally enter a name to re-use this config)");
    var fields=[
        {name:"name",type:"text",title:"Name",required:nameRequired,hint:nameHint,
            width:280,wrapHintText:false},
        isc.addProperties({},this.runConfigSkinFieldDefaults,{
            optionDataSource:skinsDS,valueField:'name',displayField:'title',
            pickListProperties:{
                formatCellValue:function(value,record,rowNum,colNum){
                    var indent='&nbsp;&nbsp;';
                    return record.canSelect===false?value:indent+value;
                }
            }
        }),
        isc.addProperties({},this.runConfigDensityFieldDefaults)
    ];
    if(this.showUsersAndRoles){
        var currentUser=isc.Auth.getCurrentUser(),
            currentUserTitle=(currentUser&&currentUser.firstName?currentUser.firstName:"")+" "+
                (currentUser&&currentUser.lastName?currentUser.lastName:""),
            userValueMap=this.getUserValueMap()
        ;
        fields.add(isc.addProperties({},this.runConfigUserIdFieldDefaults,{
            emptyDisplayValue:"Current user in Preview ("+currentUserTitle+")",
            valueMap:userValueMap
        }));
    }
    fields.add(isc.addProperties({},this.runConfigDeviceFieldDefaults));
    if(isc.Messaging){
        fields.add({name:"live",type:"boolean",title:"Live (auto-refresh)"});
    }
    fields.add({name:"default",type:"boolean",title:"Make default configuration"});
    this.runConfigForm=this.createAutoChild("runConfigForm",{fields:fields,values:values});
    if(this.runConfigWindow)this.runConfigWindow.markForDestroy();
    var saveButtonTitle=(config?"Save":"Run"),
        saveButtonAction=(config?"save":"run"),
        buttons=[
            isc.IButton.create({
                title:"Cancel",
                width:75,
                layoutAlign:"center",
                click:function(){
                    _this.runConfigWindow.closeClick();
                }
            }),
            isc.IButton.create({
                title:saveButtonTitle,
                width:75,
                layoutAlign:"center",
                click:function(){
                    if(!_this.runConfigForm.validate())return;
                    var values=_this.runConfigForm.getValues();
                    if(callback)callback(values,saveButtonAction);
                    _this.runConfigWindow.closeClick();
                }
            })
        ]
    ;
    var buttonsLayout=isc.HLayout.create({
        height:30,
        width:this.runConfigForm.width,
        membersMargin:10
    });
    buttonsLayout.addMember(isc.LayoutSpacer.create());
    buttonsLayout.addMembers(buttons);
    var layout=isc.VLayout.create({
        padding:5,
        membersMargin:5,
        members:[this.runConfigForm,buttonsLayout]
    });
    this.runConfigWindow=isc.Window.create({
        title:(config?"Edit Configuration":"Run Configuration"),
        showMinimizeButton:false,
        builder:this,
        isModal:true,showModalMask:true,
        autoCenter:true,
        autoSize:true,
        items:[layout]
    });
    buttons[buttons.length-1].focus();
}
,isc.A.addChildren=function isc_VisualBuilder_addChildren(){
    this.hide();
    var self=this;
    this.projectComponentsMenu=this.createAutoChild("projectComponentsMenu");
    this.addAutoChild("libraryComponents");
    this.addAutoChild("librarySearch",{grid:this.libraryComponents});
    this.addAutoChild("librarySearchClear");
    this.addAutoChild("projectComponents",{
        contextMenu:this.projectComponentsMenu,
        rootComponent:this.rootComponent,
        rootLiveObject:this.rootLiveObject,
        defaultPalette:this.libraryComponents,
        editContextProperties:{
            showSelectedLabelOnSelect:(this.hideLabelWhenSelecting!=true),
            canSelectEditNodes:true,
            useCopyPasteShortcuts:true,
            selectedEditNodesUpdated:function(){
                self.updateSelectionActionButtons();
            },
            keepUndoLog:this.keepUndoLog
        }
    });
    this.libraryComponents.defaultEditContext=this.projectComponents.editContext;
    this.observe(this.projectComponents.editContext,"editNodeUpdated",
                 "observer.markDirty();");
    this.projectTree=this.projectComponents.data;
    if(this.showComponentAttributeEditor!=false){
        this.addAutoChild("componentAttributeEditorFilter",
        {
            backgroundColor:"papayawhip"
        });
        this.addAutoChild("componentAttributeEditor",
            isc.addProperties(this.commonEditorFunctions,{
                builder:this,
                immediateSave:this.immediatelySaveComponentChanges
            })
        );
        this.addAutoChild("componentAttributeEditorLayout",{
            members:[
                this.componentAttributeEditorFilter,
                this.componentAttributeEditor
            ]
        });
    }
    if(this.showComponentMethodEditor!=false){
        this.addAutoChild("componentMethodEditor",
            isc.addProperties(this.commonEditorFunctions,{
                canEditExpressions:this.canEditExpressions,
                builder:this
            })
        );
    }
    this.addAutoChild("editorPane");
    if(this.showComponentAttributeEditor!=false){
        this.editorPane.addTab({
            title:"Properties",
            pane:this.componentAttributeEditorLayout
        });
    }
    if(this.showComponentMethodEditor!=false){
        this.editorPane.addTab({
            title:"Events",
            pane:this.componentMethodEditor,
            tabSelected:function(tabSet,tabNum,tabPane){
                tabPane.showNotifications();
            }
        });
    }
    if(!this.immediatelySaveComponentChanges){
        this.applyButton=this.createAutoChild("applyButton");
    }
    if(this.showHelpPane!=false){
        this.helpPane=this.createAutoChild("helpPane",{
            contentsURL:this.helpPaneProperties.contentsURL
        });
    }
    if(this.showLeftStack!=false){
        this.addAutoChild("leftStack",{
            visibility:(this.editingOn?"inherit":"hidden")
        });
        if(this.showEditorPane!=false){
            if(this.showAdvancedButton!=false){
                this.editorPaneButtonBar=isc.HStack.create({
                    membersMargin:10,
                    margin:2,
                    height:20,
                    align:"right"
                });
                this.advancedButton=this.createAutoChild("advancedButton");
                this.advancedButton.setTitle(this.componentAttributeEditor.basicMode?
                                             this.componentAttributeEditor.moreTitle:
                                             this.componentAttributeEditor.lessTitle);
                this.editorPaneButtonBar.addMember(this.advancedButton);
                if(this.applyButton)this.editorPaneButtonBar.addMember(this.applyButton);
            }
            this.leftStack.addSection({
                title:"Component Properties",
                ID:"componentProperties",
                autoShow:true,
                items:[this.editorPane,this.editorPaneButtonBar]
            });
        }
        if(this.showHelpPane!=false){
            this.leftStack.addSection({
                title:this.helpPaneProperties.headerTitle,
                ID:"helpPane",
                autoShow:false,
                items:[this.helpPane]
            });
        }
    }
    this.showMiddleStack=this.showPreviewArea!=false||this.showProjectComponents!=false;
    var controls=[];
    if(this.showScreenMenu!=false){
        this.screenMenu=this.createAutoChild("screenMenu");
        this.screenMenuButton=this.createAutoChild("screenMenuButton",{
            menu:this.screenMenu,
            visibility:(this.editingOn?"inherit":"hidden")
        });
        controls.add(this.screenMenuButton);
    }
    this.savingScreenLabel=this.createAutoChild("savingScreenLabel",{
        visibility:(this.editingOn?"inherit":"hidden")
    });
    this.savingScreenLabelSpacers=[
        isc.LayoutSpacer.create({width:"*"}),
        isc.LayoutSpacer.create({width:"*"})
    ];
    controls.add(this.savingScreenLabelSpacers[0]);
    controls.add(this.savingScreenLabel);
    controls.add(this.savingScreenLabelSpacers[1]);
    if(this.showUsersAndRoles){
        this.usersRolesLabel=this.createAutoChild("usersRolesLabel");
        this.usersRolesMenuButton=this.createAutoChild("usersRolesMenuButton");
        controls.add(this.usersRolesLabel);
        controls.add(this.usersRolesMenuButton);
        this.usersRolesMenu=this.createAutoChild("usersRolesMenu");
        this.usersRolesMenuButton.menu=this.usersRolesMenu;
        this.updateUsersRolesMenuControl();
    }
    this.removeButton=this.createAutoChild("removeButton");
    controls.add(this.removeButton);
    this.bringToFrontButton=this.createAutoChild("bringToFrontButton");
    controls.add(this.bringToFrontButton);
    this.sendToBackButton=this.createAutoChild("sendToBackButton");
    controls.add(this.sendToBackButton);
    if(this.showModeSwitcher!=false){
        var switcher=this.modeSwitcher=this.createAutoChild("modeSwitcher");
        controls.add(switcher);
    }
    if(this.showMiddleStack!=false){
        this.addAutoChild("middleStack");
        if(this.showPreviewArea!=false){
            this.middleStack.addSection({
                titleLabelProperties:{
                    overflow:"visible",width:150,padding:5,
                    click:function(){
                        if(this.editingOn){
                            this.creator.getSectionStack().sectionHeaderClick(this.creator);
                        }
                    }
                },
                controlsLayoutConstructor:"HLayout",
                controlsLayoutProperties:{
                    width:"*",
                    overflow:"hidden",
                    canAdaptWidth:true,
                    adaptWidthBy:function(delta,unadaptedWidth){
                        var desiredWidth=unadaptedWidth+delta;
                        var vb=this.creator.getSectionStack().creator,
                            fixedControls=[
                                vb.screenMenuButton,
                                vb.usersRolesMenuButton,
                                vb.removeButton,
                                vb.bringToFrontButton,
                                vb.sendToBackButton,
                                vb.modeSwitcher
                            ];
                        var fixedControlsWidth=this.layoutMargin!=null?(2*this.layoutMargin):0;
                        var multipleFixedMembers=false;
                        for(var i=0;i<fixedControls.length;i++){
                            if(fixedControls[i]==null){
                                continue;
                            }
                            if(fixedControls[i].isDrawn()&&fixedControls[i].isVisible()){
                                fixedControlsWidth+=fixedControls[i].getWidth();
                                if(multipleFixedMembers){
                                    fixedControlsWidth+=this.membersMargin;
                                }else{
                                    multipleFixedMembers=true;
                                }
                            }
                        }
                        var ssl=vb.savingScreenLabel,
                            sslWidth=ssl.getWidth();
                        var usersRolesLabel=vb.usersRolesLabel;
                        if(desiredWidth<(fixedControlsWidth+sslWidth+this.membersMargin)){
                            ssl.hide();
                            if(usersRolesLabel)usersRolesLabel.hide();
                            return delta;
                        }else{
                            if(!ssl.isVisible()&&!vb._hideSavingScreenLabel){
                                ssl.show();
                            }
                            fixedControlsWidth+=sslWidth+this.membersMargin;
                        }
                        var spaceForURLabel=desiredWidth-fixedControlsWidth;
                        var urTitleSizes=vb.getUsersRolesTitleSizes();
                        if(spaceForURLabel<urTitleSizes[0]){
                            if(usersRolesLabel)usersRolesLabel.hide();
                        }else{
                            if(usersRolesLabel)usersRolesLabel.markForRedraw();
                            if(spaceForURLabel<(urTitleSizes[1]+this.membersMargin)){
                                vb.shortURTitle=true;
                                vb.mediumURTitle=false;
                                if(usersRolesLabel)usersRolesLabel.setWidth(urTitleSizes[0]);
                            }else if(spaceForURLabel<(urTitleSizes[2]+this.membersMargin)){
                                vb.shortURTitle=false;
                                vb.mediumURTitle=true;
                                if(usersRolesLabel)usersRolesLabel.setWidth(urTitleSizes[1]);
                            }else{
                                vb.shortURTitle=false;
                                vb.mediumURTitle=false;
                                if(usersRolesLabel)usersRolesLabel.setWidth(urTitleSizes[2]);
                            }
                            if(usersRolesLabel&&!usersRolesLabel.isVisible())usersRolesLabel.show();
                        }
                        return delta;
                    }
                },
                title:"Application",autoShow:true,ID:"applicationSection",
                items:[this.previewArea],controls:controls
            });
            this.enableScreenTitleEditing();
        }
        if(this.showProjectComponents!=false){
            this.projectComponentsSearch=this.createAutoChild("projectComponentsSearch",
                                                                {grid:this.projectComponents});
            this.middleStack.addSection({name:"componentTree",
                                          title:"Component Tree",autoShow:this.editingOn,
                items:[this.projectComponents],
                controls:[this.projectComponentsSearch]
            });
        }
    }
    if(this.collapseComponentTree==true)this.middleStack.collapseSection(1);
    this.showRightStack=(this.showLibraryComponents!=false||
                            this.showScreenList!=false||this.showDataSourceList!=false);
    if(this.showRightStack!=false){
        this.addAutoChild("rightStack",{
            visibility:(this.editingOn?"inherit":"hidden")
        });
        if(this.showLibraryComponents!=false){
            this.rightStack.addSection({title:"Component Library",ID:"componentLibrary",
                autoShow:true,
                items:[this.librarySearch,this.libraryComponents,this.librarySearchClear]
            });
            this.librarySearchClear.hide();
        }
        if(this.showScreenList!=false||this.showDataSourceList!=false){
            var showBoth=this.showScreenList!=false&&this.showDataSourceList!=false;
            if(showBoth){
                this.projectPane=this.createAutoChild("projectPane");
                this.rightStack.addSection({
                    name:"project",
                    title:"Project Resources",
                    autoShow:true,
                    items:[this.projectPane]
                });
            }
            if(this.showScreenList!=false){
                this.screenPane=this.createAutoChild("screenPane");
                this.addAutoChild("screenList");
                this.addAutoChild("screenListToolbar");
                this.screenAddButtonMenu=this.createAutoChild("screenAddButtonMenu");
                this.addAutoChild("screenAddButton",{
                    menu:this.screenAddButtonMenu
                });
                if(this.projectPane){
                    this.projectPane.addTab({
                        title:"Screens",
                        pane:this.screenPane
                    });
                }else{
                    this.rightStack.addSection({
                        title:"Screens",
                        autoShow:true,
                        items:[this.screenPane]
                    });
                }
            }
            if(this.showDataSourceList!=false){
                this.dataSourcePane=this.createAutoChild("dataSourcePane");
                this.addAutoChildren(["dataSourceList","dataSourceListToolbar",
                                      "dsEditButton","dsNewButton"]);
                if(this.hostedMode)this.dataSourceList.hideField("dsType");
                this.dsNewButton.menu=this.createAutoChild("dsNewButtonMenu");
                this.dataSourceListSearch=this.createAutoChild("dataSourceListSearch",
                                                                 {grid:this.dataSourceList});
                if(this.projectComponents){
                    this.projectComponents.extraPalettes=[this.dataSourceList];
                }
                if(this.projectPane){
                    this.projectPane.addTab({
                        title:"DataSources",
                        pane:this.dataSourcePane
                    });
                }else{
                    this.rightStack.addSection({
                        name:"dataSources",
                        title:"DataSources",
                        autoShow:true,
                        items:[this.dataSourcePane]
                    });
                }
                if(this.project){
                    this.observe(this.project.datasources,"dataChanged",
                                 "observer.updateDataSourceList();");
                    this.updateDataSourceList();
                }
            }
        }
    }
    this.updateMockupsMenuControl();
    this.updateProjectMenuControl();
    this.updateRunMenuControl();
    this.updateDeployMenuControl();
    this.addAutoChild("pageHeader");
    this.addAutoChild("logo");
    this.addAutoChild("projectName");
    this.addAutoChild("projectNamePane");
    var nodeProperties=isc.addProperties({},this.projectNameDefaults);
    nodeProperties.type=this.projectNameConstructor;
    nodeProperties.liveObject=this.projectName;
    this.projectNamePane.addNode(this.libraryComponents.makeEditNode(nodeProperties));
    this.addAutoChild("projectNameSpacer");
    this.pageHeader.addMember(this.mockupsMenuControl);
    this.pageHeader.addMember(this.projectMenuControl);
    this.pageHeader.addMember(this.runMenuControl);
    if(this.hostedMode){
        this.pageHeader.addMember(this.deployMenuControl);
    }
    this.addAutoChild("userNameSpacer");
    if(this.hostedMode){
        this.addAutoChild("userMenuButton");
        this.userMenuButton.menu=this.createAutoChild("userMenu");
    }
    this.addAutoChild("workspace");
    if(this.showLeftStack!=false)this.workspace.addMember(this.leftStack);
    if(this.showMiddleStack!=false)this.workspace.addMember(this.middleStack);
    if(this.showRightStack!=false)this.workspace.addMember(this.rightStack);
    if(this.modeSwitcher&&!this.editingOn){
        this.modeSwitcher.autoSwitchToPreviewMode();
    }
}
,isc.A.isInPreviewMode=function isc_VisualBuilder_isInPreviewMode(){
    return(this.modeSwitcher?this.modeSwitcher.isSelected():false);
}
,isc.A.autoSwitchToEditMode=function isc_VisualBuilder_autoSwitchToEditMode(){
    if(this.modeSwitcher)return this.modeSwitcher.autoSwitchToEditMode();
}
,isc.A._runProjectEnabled=function isc_VisualBuilder__runProjectEnabled(){
    if(this.singleScreenMode&&this.currentScreen)return true;
    else if(this.project&&!this.project.isEmpty())return true;
    return false;
}
,isc.A.signOut=function isc_VisualBuilder_signOut(){
    if(this.signOutURL)window.location.assign(this.signOutURL);
    this._addUsageRecord("logout",this.getSessionLengthInSeconds());
}
,isc.A.showUpdateAccountWindow=function isc_VisualBuilder_showUpdateAccountWindow(){
    var updateAccountWindow=this.updateAccountWindow;
    if(updateAccountWindow==null||updateAccountWindow.destroyed){
        updateAccountWindow=this.updateAccountWindow=
            this.createAutoChild("updateAccountWindow");
    }
    var updateAccountEditor=this.updateAccountEditor;
    if(updateAccountEditor==null||updateAccountEditor.destroyed){
        updateAccountEditor=this.updateAccountEditor=
            this.createAutoChild("updateAccountEditor");
    }
    updateAccountEditor.refreshData();
    updateAccountWindow.addItem(updateAccountEditor);
    updateAccountWindow.show();
}
,isc.A.shouldShowRegDevUserMenuItems=function isc_VisualBuilder_shouldShowRegDevUserMenuItems(){
    return this.hasDevRecord?!!isc.DS.get("registeredDevelopers"):false;
}
,isc.A.authorizeManageUsersPanel=function isc_VisualBuilder_authorizeManageUsersPanel(){
    var builder=this,
        organization=builder.organization;
    if(!organization||organization=="-"){
        this.logWarn("Can't manager users - you haven't entered an organization");
        return;
    }
    isc.DS.get("registeredDevelopers").fetchData(null,function(response,data,request){
        if(data&&data.length!=0){
            builder.logInfo("Can't manage users - your organization already has an owner");
            return;
        }
        var manageItem={
            title:"Manage Users",
            click:function(target,item,menu){
                menu.creator.showManageUsersWindow();
            }
        };
        var menu=builder.userMenuButton&&builder.userMenuButton.menu;
        if(menu){
            if(menu.findIndex({title:manageItem.title})<0){
                var updateIndex=menu.findIndex({title:"Update Account"});
                if(updateIndex>=0)menu.addItem(manageItem,updateIndex+1);
            }
        }else{
            var items=builder.userMenuDefaults.regDevItems;
            var updateIndex=items.findIndex({title:"Update Account"});
            if(updateIndex>=0)items.addAt(manageItem,updateIndex+1);
        }
    },{operationId:"ownerRecord"});
}
,isc.A.showManageUsersWindow=function isc_VisualBuilder_showManageUsersWindow(){
    var manageUsersWindow=this.manageUsersWindow;
    if(manageUsersWindow==null||manageUsersWindow.destroyed){
        manageUsersWindow=this.manageUsersWindow=
            this.createAutoChild("manageUsersWindow");
    }
    var manageUsersPanel=this.manageUsersPanel;
    if(manageUsersPanel==null||manageUsersPanel.destroyed){
        manageUsersPanel=this.manageUsersPanel=
            this.createAutoChild("manageUsersPanel");
    }else{
        manageUsersPanel.usersGrid.refresh();
    }
    manageUsersWindow.addItem(manageUsersPanel);
    manageUsersWindow.show();
}
,isc.A.editComponent=function isc_VisualBuilder_editComponent(node,liveObject){
    var currentComponent=this.getCurrentComponent(),
        currentFilter=this._attributeFilter
    ;
    if((!currentComponent||currentComponent!=node)&&currentFilter!=null){
        this.clearComponentAttributeFilter(currentComponent);
    }
    this._editComponent(node,liveObject);
    if(!currentComponent&&currentFilter){
        if(this.componentAttributeEditorFilter){
            this.componentAttributeEditorFilter.setValue("filter",currentFilter);
        }
        this.filterComponentAttributeEditor(currentFilter);
    }
}
,isc.A._editComponent=function isc_VisualBuilder__editComponent(node,liveObject){
    if(isc.isA.DataSource(liveObject))return;
    if(isc.isA.DynamicProperty(liveObject)){
        var tree=this.projectComponents.data,
            parent=tree.getParent(node)
        ;
        if(parent)node=parent;
    }
    if(node!=null)this._updateEditComponentRemovability(node);
    if(node!=null)this._updateEditComponentRotatability(node);
    this.setBasicMode(node);
    if(this.showComponentAttributeEditor!=false&&
        this._pendingAttributeEditorViewState&&
        !this._pendingAttributeEditorViewState.basicMode)
    {
        this.toggleBasicMode(node,this.componentAttributeEditor);
    }
    if(this.showComponentMethodEditor!=false&&
        this._pendingMethodEditorViewState&&
        !this._pendingMethodEditorViewState.basicMode)
    {
        this.toggleBasicMode(node,this.componentMethodEditor);
    }
    if(this.showComponentAttributeEditor!=false){
        this.componentAttributeEditor.editComponent(node,liveObject);
    }
    if(this.showComponentMethodEditor!=false){
        this.componentMethodEditor.editComponent(node,liveObject);
        var currentTab=this.editorPane.getSelectedTab();
        if(currentTab&&currentTab.title=="Events"){
            this.editorPane.getTabPane(currentTab).showNotifications();
        }
    }
    if(this.showComponentAttributeEditor!=false||this.showComponentMethodEditor!=false){
        this.applyBasicModeSettings(node);
    }
    if(isc.Browser.isIE&&this.editorPane.paneContainer&&
        this.editorPane.paneContainer.isVisible())
    {
        this.editorPane.paneContainer.hide();
        this.editorPane.paneContainer.show();
    }
    if(this.leftStack){
        var obj=liveObject;
        if(!obj._constructor)obj=node;
        this.updateComponentPropertiesSectionTitle(obj);
    }
    this.setComponentList();
    if(this.showComponentAttributeEditor!=false&&this._pendingAttributeEditorViewState){
        this.componentAttributeEditor.setViewState(this._pendingAttributeEditorViewState);
    }
    if(this.showComponentMethodEditor!=false&&this._pendingMethodEditorViewState){
        this.componentMethodEditor.setViewState(this._pendingMethodEditorViewState);
    }
    delete this._pendingAttributeEditorViewState;
    delete this._pendingMethodEditorViewState;
}
,isc.A.updateComponentPropertiesSectionTitle=function isc_VisualBuilder_updateComponentPropertiesSectionTitle(obj){
    if(this.leftStack){
        this.leftStack.setSectionTitle("componentProperties",
                                       isc.DS.getAutoId(obj)+" Properties");
    }
}
,isc.A.setBasicMode=function isc_VisualBuilder_setBasicMode(component){
    if(!component)return;
    var editors=[this.componentAttributeEditor,this.componentMethodEditor];
    for(var i=0;i<editors.length;i++){
        var editor=editors[i];
        if(!editor)continue;
        var attrName=editor.ID+"BasicMode";
        if(component[attrName]==null){
            component[attrName]=editor.basicMode;
        }
        editor._basicMode=component[attrName];
    }
}
,isc.A.toggleBasicMode=function isc_VisualBuilder_toggleBasicMode(component,editor){
    if(!component)return;
    editor=editor||this.getCurrentlyVisibleEditor();
    editor._basicMode=editor._basicMode==null?!editor.basicMode:!editor._basicMode;
    component[editor.ID+"BasicMode"]=editor._basicMode;
}
,isc.A.applyBasicModeSettings=function isc_VisualBuilder_applyBasicModeSettings(component){
    if(!component)return;
    var editor=this.getCurrentlyVisibleEditor();
    this.setComponentEditorButtonState(component);
    this.setClassSwitcherState(component);
}
,isc.A.setComponentEditorButtonState=function isc_VisualBuilder_setComponentEditorButtonState(component){
    if(!component)return;
    if(this.showAdvancedButton!=false){
        var editor=this.getCurrentlyVisibleEditor(),
            basicMode=component[editor.ID+"BasicMode"];
        if(basicMode){
            this.advancedButton.setTitle(editor.moreTitle);
        }else{
            this.advancedButton.setTitle(editor.lessTitle);
        }
        if(editor.showMethods){
            this.advancedButton.setDisabled(!editor.hasMethods);
        }else{
            this.advancedButton.setDisabled(false);
        }
    }
    if(this.applyButton)this.applyButton.setDisabled(false);
}
,isc.A.setClassSwitcherState=function isc_VisualBuilder_setClassSwitcherState(component){
    if(this.getCurrentlyVisibleEditor()!=this.componentAttributeEditor)return;
    if(!this.componentAttributeEditor.canSwitchClass)return;
    if(!this.componentAttributeEditor.getField("classSwitcher"))return;
    if(!this.componentAttributeEditor._basicMode||component._notSwitchable){
        this.componentAttributeEditor.getField("classSwitcher").setDisabled(true);
    }else{
        this.componentAttributeEditor.getField("classSwitcher").setDisabled(false);
    }
}
,isc.A.getCurrentlyVisibleEditor=function isc_VisualBuilder_getCurrentlyVisibleEditor(){
    if(this.editorPane.selectedEditorName()==this.editorPane.PROPERTIES){
        return this.componentAttributeEditor;
    }
    return this.componentMethodEditor;
}
,isc.A.saveComponentEditors=function isc_VisualBuilder_saveComponentEditors(){
    if(this.componentMethodEditor)this.componentMethodEditor.save();
    if(this.componentAttributeEditor)this.componentAttributeEditor.save();
}
,isc.A.getCurrentComponent=function isc_VisualBuilder_getCurrentComponent(){
    return this.componentAttributeEditor?this.componentAttributeEditor.currentComponent:
        this.componentMethodEditor?this.componentMethodEditor.currentComponent:null;
}
,isc.A.setComponentList=function isc_VisualBuilder_setComponentList(){
    var comp=this.projectComponents,
        descendants=comp.data.getDescendants(comp.data.getRoot());
    for(var i=0;i<descendants.length;i++){
        var descendant=descendants[i];
        if(descendant.type=="DataView"&&!descendant.icon)descendant.icon="[TOOLSIMG]classes/DataView.png";
        if(descendant.type=="ValuesManager"&&!descendant.icon)descendant.icon="database.png";
    }
    var actionComponents=descendants,
        classActionsComponents=isc.Class.getClassActionsComponents()
    ;
    if(classActionsComponents!=null){
        actionComponents=descendants.duplicate();
        actionComponents.addList(classActionsComponents);
    }
    if(this.componentMethodEditor)this.componentMethodEditor.allComponents=actionComponents;
    if(this.componentAttributeEditor)this.componentAttributeEditor.allComponents=descendants;
}
,isc.A.getActionTitle=function isc_VisualBuilder_getActionTitle(targetComponentId,actionId,showTarget){
    if(this.componentMethodEditor.allComponents){
        var components=this.componentMethodEditor.allComponents,
            targetComponent=components.find("ID",targetComponentId)
        ;
        if(targetComponent){
            var actions=isc.jsdoc.getActions(targetComponent.type),
                action=(actions?actions.find("name",actionId):null)
            ;
            if(action){
                var title=(action.title?action.title:isc.DataSource.getAutoTitle(action.name));
                return"["+(showTarget?targetComponentId+".":"")+title+"]";
            }
        }
    }
    var className=targetComponentId;
    if(className.startsWith(isc._$iscPrefix))className=className.substring(isc._$iscPrefix.length);
    var clazz=isc.ClassFactory.getClass(className);
    if(clazz){
        var actions=clazz.getClassActions(),
            action=(actions?actions.find("name",actionId):null)
        ;
        if(action){
            var title=(action.title?action.title:isc.DataSource.getAutoTitle(action.name));
            return"["+(showTarget?targetComponentId+".":"")+title+"]";
        }
    }
    return null;
}
,isc.A.componentAdded=function isc_VisualBuilder_componentAdded(){
    this.setComponentList();
    this.markDirty();
    if(!this._loadingCurrentScreen){
        var mockupMode=this.getScreenMockupMode(this.currentScreen),
            editNodeTree=this.projectComponents.getEditNodeTree(),
            length=editNodeTree.getLength()
        ;
        if(length==(mockupMode?0:1)){
            this.showInstructions();
        }else{
            this.hideInstructions();
        }
    }
}
,isc.A.componentRemoved=function isc_VisualBuilder_componentRemoved(node,parentNode){
    var selectedRecord=this.projectComponents.getSelectedRecord();
    if(!selectedRecord){
        var editContext=this.projectComponents.getEditContext(),
            rootNode=this.projectComponents.getRootEditNode()
        ;
        editContext.deselectAllComponents();
        if(parentNode!=null&&parentNode!=rootNode){
            editContext.selectSingleEditNode(parentNode);
        }else if(!parentNode||parentNode==rootNode){
            var baseComponent=this.getBaseComponent();
            if(baseComponent){
                editContext.selectSingleEditNode(baseComponent.editNode);
            }
        }
    }
    this.setComponentList();
    this.markDirty();
    if(!this._loadingCurrentScreen){
        var mockupMode=this.getScreenMockupMode(this.currentScreen),
            editNodeTree=this.projectComponents.getEditNodeTree(),
            length=editNodeTree.getLength()
        ;
        if(length==(mockupMode?0:1)){
            this.showInstructions();
        }
    }
}
,isc.A.clearComponent=function isc_VisualBuilder_clearComponent(){
    if(this._revertingScreen)return;
    if(this.componentAttributeEditor)this.componentAttributeEditor.clearComponent();
    if(this.componentMethodEditor)this.componentMethodEditor.clearComponent();
    if(this.leftStack){
        this.leftStack.setSectionTitle("componentProperties","Component Properties");
        if(this.applyButton)this.applyButton.setDisabled(true);
        if(this.advancedButton)this.advancedButton.setDisabled(true);
    }
}
,isc.A.refreshComponent=function isc_VisualBuilder_refreshComponent(){
    var comp=this.getCurrentComponent();
    this.editComponent(comp,comp.liveObject);
}
,isc.A.switchComponentClass=function isc_VisualBuilder_switchComponentClass(newClassName){
    var comp=this.getCurrentComponent(),
        tree=this.projectComponents.data,
        parent=tree.getParent(comp),
        index=tree.getChildren(parent).indexOf(comp);
    var newNode=this.projectComponents.makeEditNode({
        type:newClassName,
        defaults:comp.defaults
    });
    this.projectComponents.removeNode(comp);
    newNode=this.projectComponents.addComponent(newNode,parent,index);
    if(newNode&&newNode.liveObject){
        isc.EditContext.selectCanvasOrFormItem(newNode.liveObject,true);
    }
}
,isc.A.createInstructionsPane=function isc_VisualBuilder_createInstructionsPane(){
    if(!this.instructionsPane){
        this.instructionsPane=this.createAutoChild("instructionsPane");
        this.instructionsPane.setEditMode(true,this.projectComponents);
        var editTree=this.projectComponents,
            rootComponent=editTree.getRootEditNode().liveObject
        ;
        rootComponent.addPeer(this.instructionsPane);
        this.instructionsPane._fitToMaster();
    }
}
,isc.A.showInstructions=function isc_VisualBuilder_showInstructions(){
    if(!this.instructionsPane)this.createInstructionsPane();
    var editTree=this.projectComponents,
        rootComponent=editTree.getRootEditNode().liveObject
    ;
    if(rootComponent.isVisible()){
        this.instructionsPane.moveAbove(rootComponent);
        this.instructionsPane.moveTo(
            rootComponent.left+rootComponent.getLeftBorderSize()+rootComponent.getLeftMargin(),
            rootComponent.top+rootComponent.getTopBorderSize()+rootComponent.getTopMargin());
        this.instructionsPane.show();
    }else{
        rootComponent._showInstructions=true;
    }
}
);
isc.evalBoundary;isc.B.push(isc.A.hideInstructions=function isc_VisualBuilder_hideInstructions(){
    if(this.instructionsPane){
        this.instructionsPane.hide();
        this.instructionsPane.moveTo(null,-9999);
        var editTree=this.projectComponents,
            rootComponent=editTree.getRootEditNode().liveObject
        ;
        delete rootComponent._showInstructions;
    }
}
,isc.A.getCustomComponentsURL=function isc_VisualBuilder_getCustomComponentsURL(){
    return this.customComponentsURL;
}
,isc.A.refreshLibraryComponents=function isc_VisualBuilder_refreshLibraryComponents(callback,forceRefresh,searchValue){
    if(this._refreshingLibrary){
        this.delayCall("refreshLibraryComponents",arguments);
        return;
    }
    var mockupMode=this.getScreenMockupMode(this.currentScreen),
        searchingLibrary=this.librarySearch.isSearching()
    ;
    if(!searchingLibrary&&!forceRefresh&&this.paletteDS.mockupMode!=null&&mockupMode==this.paletteDS.mockupMode){
        if(callback)callback();
        return;
    }
    this.paletteDS.mockupMode=mockupMode;
    var _this=this,
        criteria={}
    ;
    if(searchValue)criteria.title=searchValue;
    else if(searchingLibrary)this.librarySearch.clearSearch(true);
    this.libraryComponents.invalidateCache();
    if(!this.libraryComponents.willFetchData(criteria)&&callback){
        callback();
        return;
    }
    this._refreshingLibrary=true;
    this.libraryComponents.fetchData(criteria,function(){
        var tree=_this.libraryComponents.getData();
        tree.openAll();
        if(isc.isA.emptyObject(criteria)){
            var closedNodes=tree.findAll("isClosed","true");
            if(closedNodes&&closedNodes.length){
                var excludeNodes=[];
                for(var i=0;i<closedNodes.length;i++){
                    var node=closedNodes[i],
                        parentNode=tree.getParent(node)
                    ;
                    if(parentNode.isHeader==true||parentNode.isHeader=="true"){
                        excludeNodes.add(node);
                    }
                }
                closedNodes.removeList(excludeNodes);
                tree.closeFolders(closedNodes);
            }
        }
        delete _this._refreshingLibrary;
        if(callback)callback();
    },{textMatchStyle:"substring"});
}
,isc.A.showCopyExistingDataSourceUI=function isc_VisualBuilder_showCopyExistingDataSourceUI(){
    var self=this;
    this.loadDataSource("Copy DataSource","Copy DataSource",function(fileName,data){
        self.project.getUniqueDataSourceCopyName(fileName,function(uniqueFileName){
            data=data.replace("ID=\""+fileName+"\"","ID=\""+uniqueFileName+"\"");
            self.dsDataSource.saveFile({
                fileName:uniqueFileName,
                fileType:"ds",
                fileFormat:"xml"
            },data,function(dsResponse,data,dsRequest){
                if(dsResponse.status>=0){
                    isc.ClassFactory._setVBLoadingDataSources(true);
                    isc.DS.get(uniqueFileName,function(dsID){
                        var ds=isc.DS.get(isc.isAn.Array(dsID)?dsID[0]:dsID);
                        self.project.addDatasource(uniqueFileName,ds.serverType);
                        isc.ClassFactory._setVBLoadingDataSources(null);
                    },{loadParents:true});
                }
            },{
                operationId:"allOwners"
            });
        });
    });
}
,isc.A.showLoadSharedDataSourceUI=function isc_VisualBuilder_showLoadSharedDataSourceUI(){
    var self=this;
    this.warnOnce(this._loadSharedDataSourceId,
        "Since the selected DataSource will be shared, changes made by any user can affect multiple projects.",
        function(value){
            if(value){
                self.loadDataSource("Add Shared DataSource","Add DataSource",function(fileName,data){
                    isc.ClassFactory._setVBLoadingDataSources(true);
                    isc.DS.get(fileName,function(dsID){
                        var ds=isc.DS.get(isc.isAn.Array(dsID)?dsID[0]:dsID);
                        self.project.addDatasource(fileName,ds.serverType);
                        isc.ClassFactory._setVBLoadingDataSources(null);
                        var dsType=ds.hasOwnProperty("mockData")?"mock":"fields";
                        self._addUsageRecord("addSharedDS",ds.ID,dsType);
                        self.loadAllRelatedDataSources(ds,function(relatedDataSources){
                            if(relatedDataSources&&relatedDataSources.length>0){
                                isc.Notify.addMessage("The dataSource "+dsID+" has been added, "+
                                    "together with the following related dataSources to "+
                                    "ensure your data is complete: "+relatedDataSources.join(", "));
                            }
                        });
                    },{loadParents:true});
                });
            }
        },{
            buttons:[
                isc.Dialog.CANCEL,
                {title:"Continue",width:75,overflow:"visible",
                    click:function(){this.topElement.okClick()}
                }
            ],
            autoFocusButton:1
        }
    );
}
,isc.A.loadDataSource=function isc_VisualBuilder_loadDataSource(title,actionButtonTitle,callback){
    if(!this.dataSourcePicker)this.dataSourcePicker=this.createAutoChild('dataSourcePicker',{
        dataSource:this.dsDataSource
    });
    if(title)this.dataSourcePicker.setTitle(title);
    if(actionButtonTitle)this.dataSourcePicker.setActionButtonTitle(actionButtonTitle);
    this.dataSourcePicker.showLoadFileUI(function(dsResponse,data,dsRequest){
        callback(data.fileName,data.fileContents);
    });
}
,isc.A.getDataSourceType=function isc_VisualBuilder_getDataSourceType(ds){
    var dsType=ds.serviceNamespace
        ?"webService"
        :(isc.isA.MockDataSource(ds)?"MockDataSource":ds.serverType||ds.dataFormat);
    return dsType;
}
,isc.A.addDataSource=function isc_VisualBuilder_addDataSource(ds,fromWizard){
    var renames,
        adds
    ;
    if(this.dsEditorWindow||fromWizard){
        if(this.dsEditorWindow)this.dsEditorWindow.hide();
        if(ds.serverType=="sql"||ds.serverType=="hibernate"){
            if(this.dsWizard!=null&&this.dsWizard.dsTypeRecord!=null){
                var node=this.dsWizard.dsTypeRecord,
                    wizardDefaults=node.wizardDefaults,
                    showDSImporter=wizardDefaults?wizardDefaults.existingTable!="true":true;
                if(showDSImporter){
                    var importSilently=wizardDefaults?wizardDefaults.importSilently=="true":false;
                    if(importSilently)this.dsImportSilently(ds.ID);
                    else this.showDSImporter(ds.ID,fromWizard);
                }
            }
        }
        if(!fromWizard){
            renames=this.dsEditor.getFieldRenames();
            adds=this.dsEditor.getFieldAdds();
        }
    }
    var dsType=this.getDataSourceType(ds);
    this.project.addDatasource(ds.ID,dsType);
    if(renames){
        var fieldRenames=renames;
        renames={};
        renames[ds.ID]=fieldRenames;
    }
    if(adds){
        var fieldAdds=adds;
        adds=[];
        adds[ds.ID]=fieldAdds;
    }
    this.project.rebindCurrentScreenDataSources(renames,adds);
    if(fromWizard&&this._bindNewDSToNode){
        this.bindDataSourceToNode(ds,this._bindNewDSToNode);
        delete this._bindNewDSToNode;
    }
    if(fromWizard&&!showDSImporter){
        this.dsWizardComplete(ds.ID);
    }
}
,isc.A.removeDataSource=function isc_VisualBuilder_removeDataSource(dsID){
    this.project.removeDatasource(dsID);
}
,isc.A.dsWizardComplete=function isc_VisualBuilder_dsWizardComplete(dsID){
    isc.Notify.addMessage("Success! New DataSource '"+dsID+"' added to your project");
}
,isc.A.clearScreenUI=function isc_VisualBuilder_clearScreenUI(skipInitialComponent){
    if(this.projectComponents){
        this.projectComponents.destroyAll();
        if(!this.currentScreen.mockupMode&&this.initialComponent&&!skipInitialComponent){
            var paletteNode=isc.addProperties({},
                this.projectComponents.editContext.findPaletteNode("type",this.initialComponent.type),
                this.initialComponent);
            if(this.currentScreen&&this.currentScreen.title){
                var screenId=this.libraryComponents.getPrefixAsId(this.currentScreen.title);
                if(screenId){
                    paletteNode.defaults=isc.addProperties({},paletteNode.defaults,{autoID:screenId});
                }
            }
            var initialComponent=this.projectComponents.makeEditNode(paletteNode);
            delete initialComponent.defaults.autoDraw;
            initialComponent.showDropIcon=true;
            initialComponent._canRemove=false;
            this.projectComponents.addNode(initialComponent);
        }
        this.projectComponents.resetUndoLog();
    }
}
,isc.A.getUpdatedJSSource=function isc_VisualBuilder_getUpdatedJSSource(callback){
    isc.xml.toJSCode(this.getUpdatedSource(),callback);
}
,isc.A.getUpdatedSource=function isc_VisualBuilder_getUpdatedSource(){
    var mockupMode=this.getScreenMockupMode(this.currentScreen),
        settings={outputComponentsIndividually:!mockupMode,ignoreConstructor:true,
                     separateComponents:mockupMode}
    ;
    var source;
    this.withoutDirtyTracking(function(){
        source=this.projectComponents.serializeAllEditNodes(settings);
    });
    if(mockupMode){
        var container="<MockupContainer>\n",
            components=source.components.trim(),
            dataSources=source.dataSources.trim();
        if(dataSources)container+="<dataSources>\n"+dataSources+"\n</dataSources>\n";
        if(components)container+="<components>\n"+components+"\n</components>\n";
        source=container+"</MockupContainer>\n";
    }
    return source;
}
,isc.A.downloadDataSource=function isc_VisualBuilder_downloadDataSource(dsID){
    isc.ClassFactory._setVBLoadingDataSources(false);
    var ds=isc.DS.get(isc.isAn.Array(dsID)?dsID[0]:dsID);
    var vb=this;
    var title=this.downloadDataSourceDialogTitle.evalDynamicString(this,{dsID:ds.ID}),
        prompt=this.downloadDataSourceDialogPrompt,
        buttonTitle=this.downloadDataSourceDialogButtonTitle;
    this.downloadDataSourceDialog=isc.TWindow.create({
        title:title,
        width:500,
        height:140,
        isModal:true,
        showModalMask:true,
        autoCenter:true,
        padding:8,
        items:[
            isc.Label.create({
                width:"100%",
                height:60,
                padding:8,
                contents:prompt
            }),
            isc.DynamicForm.create({
                width:"100%",
                numCols:3,
                items:[
                    {name:"formatType",title:"Format",type:"select",width:"*",
                        defaultValue:"XML",
                        valueMap:["XML","JavaScript"]
                    },
                    {name:"downloadButton",title:buttonTitle,type:"button",startRow:false,
                        click:function(){
                            vb.continueDSDownload(ds,this.form.getValue("formatType"));
                        }
                    }
                ]
            })
        ]
    });
    this.downloadDataSourceDialog.show();
}
,isc.A.continueDSDownload=function isc_VisualBuilder_continueDSDownload(ds,formatType){
    this.downloadDataSourceDialog.hide();
    this.downloadDataSourceDialog.markForDestroy();
    var vb=this,
        dsClass=ds.getClassName(),
        schema;
    if(isc.DS.isRegistered(dsClass)){
        schema=isc.DS.get(dsClass);
    }else{
        schema=isc.DS.get("DataSource");
        ds._constructor=dsClass;
    }
    var xml=schema.xmlSerialize(ds);
    if(formatType=="XML"){
        vb.downloadDataSourceReply(ds,formatType,xml);
    }else{
        isc.XMLTools.toJSCode(xml,
            function(response){
                vb.downloadDataSourceReply(ds,formatType,response.data);
            }
        );
    }
}
,isc.A.downloadDataSourceReply=function isc_VisualBuilder_downloadDataSourceReply(ds,formatType,data){
    var fileName=ds.ID+".ds."+(formatType=="XML"?"xml":"js"),
        mimeType=(formatType=="XML"?"text/xml":"application/json");
    isc.DMI.callBuiltin({
        methodName:"downloadClientContent",
        arguments:[data,fileName,mimeType],
        requestParams:{
            showPrompt:false,
            useXmlHttpRequest:false,
            timeout:0
        }
     });
}
,isc.A.showDSWizard=function isc_VisualBuilder_showDSWizard(wizardRecord,bindToNode){
    if(bindToNode)this._bindNewDSToNode=bindToNode;
    this.logDebug("Show DS Wizard: "+this.echo(wizardRecord),"dsWizard");
    if(!this.wizardWindow){
        var _this=this;
        this.wizardWindow=isc.TWindow.create({
            autoDraw:false,
            title:"DataSource Wizard",
            autoCenter:true,
            width:"85%",
            height:"85%",
            isModal:true,showModalMask:true,
            canDragResize:true,
            builder:_this,
            closeClick:function(){
                this.Super("closeClick",arguments);
                _this.dsWizard.resetWizard();
                delete _this._bindNewDSToNode;
            },
            items:[
                _this.dsWizard=isc.DSWizard.create({
                    callingBuilder:_this,
                    dsDataSource:_this.dsDataSource
                })
            ]
        });
    }
    if(wizardRecord){
        this.dsWizard.startAt(wizardRecord);
    }else{
        this.wizardWindow.show();
    }
}
,isc.A.isEmbeddedMockDataSource=function isc_VisualBuilder_isEmbeddedMockDataSource(dsID){
    var dataSource=isc.isAn.Array(dsID)?dsID[0]:dsID,
        isEmbeddedMock=false
    ;
    if(isc.isA.String(dataSource)||isc.isA.DataSource(dataSource)){
        dataSource=isc.DS.get(dataSource);
    }
    if(isc.isA.MockDataSource(dataSource)){
        var dsNode=this.dataSourceList.data.find("ID",dsID);
        isEmbeddedMock=(dsNode!=null&&dsNode.referenceInProject==false);
    }
    return isEmbeddedMock;
}
,isc.A.showDSEditor=function isc_VisualBuilder_showDSEditor(dsID,isNew,instructions){
    isc.ClassFactory._setVBLoadingDataSources(null);
    isc.showPrompt("Loading all project datasources... ${loadingImage}");
    var _this=this;
    this.loadAllProjectDataSources(function(){
        isc.clearPrompt();
        _this._showDSEditor(dsID,isNew,instructions);
    });
}
,isc.A._showDSEditor=function isc_VisualBuilder__showDSEditor(dsID,isNew,instructions){
    if(this.isEmbeddedMockDataSource(dsID)){
        isc.warn("Edit embedded MockDataSources by editing ListGrids where they are used");
        return;
    }
    var dataSource=isc.isAn.Array(dsID)?dsID[0]:dsID;
    if(isc.isA.String(dataSource)||isc.isA.DataSource(dataSource)){
        dataSource=isc.DS.get(dataSource);
    }
    if(!dataSource)return;
    if(!isc.isA.String(dsID))dsID=dataSource.ID;
    var importData=(dataSource.wizardDefaults?dataSource.wizardDefaults.importData:null);
    var _this=this,
        editComplete=function(dataSource,nextDataSource){
            if(_this.dsEditorWindow)_this.dsEditorWindow.hide();
            if(_this.project.isReadOnly()){
                if(nextDataSource){
                    nextDataSource=isc.DS.get(nextDataSource);
                    _this.delayCall("_showDSEditor",[nextDataSource]);
                }
                else isc.warn("Project is read-only so DataSource changes are being ignored.");
                return;
            }
            _this.withoutAutoSaving(function(){
                if(dsID!=dataSource.ID){
                    _this.removeDataSource(dsID);
                    _this.project.addDatasource(dataSource.ID,_this.getDataSourceType(dataSource));
                }else{
                    _this.addDataSource(dataSource,isNew);
                }
                if(isNew&&dataSource){
                    var dsType=dataSource.hasOwnProperty("mockData")?"mock":"fields";
                    _this._addUsageRecord("createDataSource",dataSource.ID,dsType);
                }
                if(importData){
                    var fileType=importData.fileType,
                        fileFormat=(fileType=="XML"?"xml":(fileType=="JSON"?"js":"csv")),
                        data=importData.rawData
                    ;
                    if(fileType=="JSON"){
                        data="var "+dataSource.ID+"TestData = "+
                            isc.JSON.encode(importData.guessedRecords)+";";
                    }
                    _this.dsDataSource.saveFile({
                        fileName:"test_data/"+dataSource.ID,
                        fileType:"data",
                        fileFormat:fileFormat
                    },data,null,{
                        operationId:"allOwners"
                    });
                }
                if(dsID&&dsID!=dataSource.ID){
                    var fieldRenames=_this.dsEditor.getFieldRenames();
                    _this.project.renameDataSource(dsID,dataSource.ID,fieldRenames);
                }else{
                    _this.project.delayCall("autoSaveSoon");
                }
            });
            if(nextDataSource)_this.delayCall("_showDSEditor",[nextDataSource]);
        }
    ;
    var dsEditorProperties=null;
    if(dataSource.wizardDefaults){
        dsEditorProperties={};
        for(var i=0;i<this.dsEditorPropertyNames.length;i++){
            var propName=this.dsEditorPropertyNames[i],
                propValue=dataSource.wizardDefaults[propName],
                undef
            ;
            if(propValue!=null&&isc.isA.String(propValue)){
                var lowerValue=propValue.toLowerCase();
                if(lowerValue=="true"||lowerValue=="false"){
                    propValue=(lowerValue=="true");
                }
            }
            if(propValue!=undef)dsEditorProperties[propName]=propValue;
        }
    }else if(isc.isA.MockDataSource(dataSource)){
        dsEditorProperties={
            autoAddPK:true,
            canAddChildSchema:false,
            showMoreButton:false,
            showLegalValuesButton:true
        };
    }
    if(!isNew){
        if(!dsEditorProperties)dsEditorProperties={};
        dsEditorProperties.ownerId=this.project.getOwnerId();
    }
    if(this.logIsDebugEnabled("dsWizard")){
        this.logDebug("DS Editor properties: "+this.echoFull(dsEditorProperties),"dsWizard");
    }
    this.makeDSEditor(dsEditorProperties,importData,isNew,dataSource);
    if(isNew)this.dsEditor.editNew(dataSource,editComplete,instructions);
    else this.dsEditor.editSaved(dataSource,editComplete,instructions);
    this.dsEditor.setKnownDataSources(this.dataSourceList.data);
    if(this.project.isReadOnly())this.dsEditor.readOnly=true;
    var showEditor=(dataSource.wizardDefaults?dataSource.wizardDefaults.showDSEditor:null)||true;
    if(isc.isA.String(showEditor))showEditor=(showEditor.toLowerCase()!="false");
    if(showEditor)this.dsEditorWindow.show();
    else this.dsEditor.save();
}
,isc.A.makeDSEditor=function isc_VisualBuilder_makeDSEditor(dsEditorProperties,importData,isNew,dataSource){
    if(!dsEditorProperties)dsEditorProperties={};
    if(this.dsEditor){
        this.dsEditor.destroy();
        this.dsEditorWindow.destroy();
    }
    var _this=this;
    if((isNew&&!isc.isA.DataSource(dataSource)&&dataSource.defaults&&dataSource.defaults._constructor=="MockDataSource")||
        (!isNew&&isc.isA.MockDataSource(dataSource)&&dataSource.hasExplicitFields()))
    {
        dsEditorProperties.editSampleData=true;
    }
    dsEditorProperties.enableRelationEditor=this.enableRelationEditor;
    if(importData&&importData.guessedRecords){
        this._makeParsedDSEditor(dsEditorProperties,importData);
    }else{
        this._makeBasicDSEditor(dsEditorProperties);
    }
    this.dsEditorWindow=isc.Window.create({
        title:"DataSource Editor",
        autoDraw:false,
        visibility:"hidden",
        builder:this,
        isModal:true,showModalMask:true,
        autoCenter:true,
        width:"85%",
        height:"85%",
        canDragResize:true,
        closeClick:function(){
            this.Super("closeClick",arguments);
            delete _this._bindNewDSToNode;
        },
        items:[
            this.dsEditor
        ]
    });
}
,isc.A._makeBasicDSEditor=function isc_VisualBuilder__makeBasicDSEditor(dsEditorProperties){
    var _this=this;
    this.dsEditor=isc.DataSourceEditor.create({
        dataSource:"DataSource",
        dsDataSource:this.dsDataSource,
        width:"100%",
        height:"80%",
        autoDraw:false,
        canAddChildSchema:true,
        canEditChildSchema:true,
        builder:_this,
        mainStackProperties:{
            _constructor:"TSectionStack"
        },
        instructionsProperties:{
            _constructor:"THTMLFlow"
        },
        mainEditorProperties:{
            _constructor:"TComponentEditor",
            formConstructor:isc.TComponentEditor
        },
        fieldLayoutProperties:{
            _constructor:"TLayout"
        },
        getUniqueDataSourceID:function(callback){
            var baseFileName="dataSource";
            var fileSpec={
                    fileName:baseFileName,
                    firstFileName:baseFileName+"1",
                    fileType:"ds",
                    fileFormat:"xml"
                }
            ;
            _this.dsDataSource.uniqueName(fileSpec,function(dsResponse,data,dsRequest){
                if(data){
                    var fileName=data.fileName;
                    _this.dsDataSource.removeFile(data,function(){
                        callback(fileName);
                    });
                    return;
                }
                isc.Notify.addMessage("Unable to obtain a new unique data source name");
                callback();
            });
        }
    },dsEditorProperties);
}
,isc.A._makeParsedDSEditor=function isc_VisualBuilder__makeParsedDSEditor(dsEditorProperties,importData){
    var dsEditorPaneProperties=isc.addProperties({},{
        dataSource:"DataSource",
        dsDataSource:this.dsDataSource,
        builder:_this,
        getUniqueDataSourceID:function(callback){
            var baseFileName="dataSource";
            var fileSpec={
                    fileName:baseFileName,
                    firstFileName:baseFileName+"1",
                    fileType:"ds",
                    fileFormat:"xml"
                }
            ;
            _this.dsDataSource.uniqueName(fileSpec,function(dsResponse,data,dsRequest){
                if(data){
                    var fileName=data.fileName;
                    _this.dsDataSource.removeFile(data,function(){
                        callback(fileName);
                    });
                    return;
                }
                isc.Notify.addMessage("Unable to obtain a new unique data source name");
                callback();
            });
        }
    },dsEditorProperties);
    var _this=this;
    this.dsEditor=isc.ParsedDataDSEditor.create({
        width:"100%",
        height:"80%",
        autoDraw:false,
        fileType:importData.fileType,
        rawData:importData.rawData,
        dsProperties:importData.dsProperties,
        dsEditorPaneProperties:dsEditorPaneProperties
    });
}
,isc.A.showDSImporter=function isc_VisualBuilder_showDSImporter(dsID,fromWizard){
    this.makeDSImporter(dsID);
    this.dsImporterWindow.fromWizard=fromWizard;
    this.dsImporterWindow.show();
}
,isc.A.dsImportSilently=function isc_VisualBuilder_dsImportSilently(dsID,importTestData){
    var builder=this,
        dsList=[dsID],
        replaceTables=false
    ;
    if(importTestData==null)importTestData=true;
    isc.DMI.call({
        appID:"isc_builtin",
        className:"com.isomorphic.tools.AdminConsole",
        methodName:"importDataSources",
        arguments:[dsList,importTestData,replaceTables],
        requestParams:{
            prompt:"Importing Datasource - This may take a few minutes.",
            showPrompt:true,
            promptStyle:"dialog"
        },
        callback:function(){
            builder.dsWizardComplete(dsID);
        }
    });
}
,isc.A.makeDSImporter=function isc_VisualBuilder_makeDSImporter(dsID){
    var builder=this;
    if(!this.dsImporter){
        this.dsImporter=isc.DynamicForm.create({
            autoDraw:false,
            width:"100%",
            numCols:1,
            fields:[
                {name:"createTable",type:"boolean",title:"Create (or replace) table",showTitle:false,
                    changed:function(form,item,value){
                        form.getItem("importTestData").setDisabled(!value);
                    }
                },
                {name:"importTestData",type:"boolean",title:"Import test data",showTitle:false}
            ]
        });
    }
    this.dsImporter.setValues({createTable:true,importTestData:true});
    if(this.dsImporterWindow){
        this.dsImporterWindow.dsID=dsID;
        return;
    }
    var instructions=isc.Label.create({
        autoDraw:false,
        width:"100%",
        height:1,
        overflow:"visible",
        contents:"Finalize DataSource creation with what operations?"
    });
    var submitButton=isc.IButton.create({
        autoDraw:false,
        title:"Done",
        autoFit:true,
        click:function(){
            var options=builder.dsImporter.getValues();
            if(!options.createTable){
                builder.dsImporterWindow.closeClick();
            }else{
                builder.dsImporterWindow.close();
                builder.dsImportSilently(builder.dsImporterWindow.dsID,options.importTestData);
            }
        }
    });
    var buttonsLayout=isc.HLayout.create({
        autoDraw:false,
        height:30,
        membersMargin:10
    });
    buttonsLayout.addMembers([isc.LayoutSpacer.create(),submitButton]);
    var layout=isc.VLayout.create({
        width:"100%",
        padding:5,
        membersMargin:10,
        members:[instructions,this.dsImporter,buttonsLayout]
    });
    this.dsImporterWindow=isc.Window.create({
        title:"Import DataSource",
        autoDraw:true,
        builder:this,
        dsID:dsID,
        isModal:true,showModalMask:true,
        autoCenter:true,
        width:300,
        height:165,
        canDragResize:true,
        items:[
            layout
        ],
        closeClick:function(){
            this.Super("closeClick",arguments);
            if(this.fromWizard&&this.dsID){
                this.builder.dsWizardComplete(this.dsID);
            }
        }
    });
}
,isc.A.showRelationEditor=function isc_VisualBuilder_showRelationEditor(dataSource){
    isc.ClassFactory._setVBLoadingDataSources(null);
    isc.showPrompt("Loading all project datasources... ${loadingImage}");
    var _this=this;
    this.loadAllProjectDataSources(function(){
        isc.clearPrompt();
        if(_this.isEmbeddedMockDataSource(dataSource.ID)){
            isc.warn("Edit embedded MockDataSources by editing ListGrids where they are used");
            return;
        }
        _this._showRelationEditor(dataSource);
    });
}
,isc.A._showRelationEditor=function isc_VisualBuilder__showRelationEditor(dataSource){
    if(isc.isA.String(dataSource)||isc.isA.DataSource(dataSource)){
        dataSource=isc.DS.get(dataSource);
    }
    if(!dataSource)return;
    var _this=this,
        editComplete=function(){
            if(_this.relationEditorWindow)_this.relationEditorWindow.hide();
            if(_this.project.isReadOnly()){
                isc.warn("Project is read-only so DataSource relation changes are being ignored.");
                return;
            }
            _this.relationEditor.save(true,function(dsList){
                for(var i=0;i<dsList.length;i++){
                    _this.addDataSource(isc.DS.get(dsList[i]));
                }
                _this.relationEditor.showNewRelationNotifications(null,null,function(dsId){
                    if(dsId)_this.delayCall("_showDSEditor",[dsId]);
                });
            });
        }
    ;
    this.makeRelationEditor(dataSource);
    var dsList=[];
    this.dataSourceList.data.map(function(node){
        if(!node)return;
        var ds=isc.DS.get(node.ID);
        dsList.add(ds);
    });
    this.relationEditor.setKnownDataSources(dsList);
    if(this.project.isReadOnly())this.relationEditor.readOnly=true;
    this.relationEditor.edit(dataSource,editComplete);
    this.relationEditorWindow.show();
}
,isc.A.makeRelationEditor=function isc_VisualBuilder_makeRelationEditor(dataSource){
    if(this.relationEditorWindow){
        this.relationEditorWindow.setTitle("Relations for DataSource '"+dataSource.ID+"'");
        return;
    }
    this.relationEditor=isc.RelationEditor.create({
        autoDraw:false,
        width:850,
        dsDataSource:this.dsDataSource,
        ownerId:this.project.ownerId
    });
    this.relationEditorWindow=isc.Window.create({
        title:"Relations for DataSource '"+dataSource.ID+"'",
        autoDraw:false,
        visibility:"hidden",
        builder:this,
        isModal:true,showModalMask:true,
        autoCenter:true,
        autoSize:true,
        canDragResize:true,
        closeClick:function(){
            this.Super("closeClick",arguments);
        },
        items:[
            this.relationEditor
        ]
    });
}
,isc.A.showSimpleTreeRelationEditor=function isc_VisualBuilder_showSimpleTreeRelationEditor(dataSource,callback){
    if(isc.isA.String(dataSource)||isc.isA.DataSource(dataSource)){
        dataSource=isc.DS.get(dataSource);
    }
    if(!dataSource)return;
    var _this=this,
        editComplete=function(){
            if(_this.simpleTreeRelationEditorWindow)_this.simpleTreeRelationEditorWindow.hide();
            _this.simpleTreeRelationEditor.save(function(dsList){
                for(var i=0;i<dsList.length;i++){
                    _this.addDataSource(isc.DS.get(dsList[i]));
                }
                callback();
            });
        }
    ;
    this.makeSimpleTreeRelationEditor(dataSource);
    this.simpleTreeRelationEditor.edit(dataSource,editComplete);
    this.simpleTreeRelationEditorWindow.show();
}
,isc.A.makeSimpleTreeRelationEditor=function isc_VisualBuilder_makeSimpleTreeRelationEditor(dataSource){
    if(this.simpleTreeRelationEditorWindow){
        this.simpleTreeRelationEditorWindow.setTitle("Relations for DataSource '"+dataSource.ID+"'");
        return;
    }
    this.simpleTreeRelationEditor=isc.SimpleTreeRelationEditor.create({
        autoDraw:false,
        width:500,
        dsDataSource:this.dsDataSource,
        ownerId:this.project.ownerId
    });
    this.simpleTreeRelationEditorWindow=isc.Window.create({
        title:"Define Tree Relation for DataSource '"+dataSource.ID+"'",
        autoDraw:false,
        visibility:"hidden",
        builder:this,
        isModal:true,showModalMask:true,
        autoCenter:true,
        autoSize:true,
        canDragResize:true,
        closeClick:function(){
            this.Super("closeClick",arguments);
        },
        items:[
            this.simpleTreeRelationEditor
        ]
    });
}
,isc.A.saveDSToFile=function isc_VisualBuilder_saveDSToFile(dsID,dsData){
    isc.ClassFactory._setVBLoadingDataSources(null);
    var ds=isc.isAn.Array(dsID)?dsID[0]:dsID;
    if(isc.isA.String(ds)||isc.isA.DataSource(ds)){
        ds=isc.DS.get(ds);
    }
    var vb=this,
        dsClass=ds.getClassName(),
        schema;
    if(isc.DS.isRegistered(dsClass)){
        schema=isc.DS.get(dsClass);
    }else{
        schema=isc.DS.get("DataSource");
        ds._constructor=dsClass;
    }
    var xml=schema.xmlSerialize(ds);
    this.dsDataSource.saveFile({
        fileName:dsID,
        fileType:"ds",
        fileFormat:"xml"
    },xml,function(){
        delete dsData.referenceInProject;
        vb.dataSourceList.removeData(dsData);
        vb.project.addDatasource(dsID,dsData.dsType);
        if(isc.isA.MockDataSource(ds)){
            var editNodes=vb.projectComponents.editContext.getEditNodeArray(),
                updatedScreen=false
            ;
            for(var i=0;i<editNodes.length;i++){
                var editNode=editNodes[i];
                if(editNode.ID==dsID){
                    editNode.referenceInProject=true;
                    updatedScreen=true;
                }
            }
            if(updatedScreen){
                vb.markDirty();
            }
        }
        vb.project.autoSaveSoon();
    },{
        operationId:"allOwners"
    });
}
,isc.A.offerBinding=function isc_VisualBuilder_offerBinding(newNode){
    this.makeOfferBindingDialog(newNode);
    this.showOfferBinding(newNode.liveObject);
}
,isc.A.showOfferBinding=function isc_VisualBuilder_showOfferBinding(parent){
    if(!parent.isDrawn()){
        if(!this.isObserving(parent,"draw")){
            this.observe(parent,"draw","observer.showOfferBinding(observed)");
        }
        this.offerBindingWindow.hide();
        return;
    }
    if(this.isObserving(parent,"draw")){
        this.ignore(parent,"draw");
    }
    this._showOfferBinding(parent);
}
,isc.A._showOfferBinding=function isc_VisualBuilder__showOfferBinding(parent){
    if(parent.getTop()<0){
        if(!this.isObserving(parent,"moved")){
            this.observe(parent,"moved","observer._showOfferBinding(observed)");
        }
        return;
    }
    if(this.isObserving(parent,"moved")){
        this.ignore(parent,"moved");
    }
    var window=this.offerBindingWindow;
    var width=window.getVisibleWidth(),
        height=window.getVisibleHeight(),
        left=((parent.getWidth()-width)/2)+
                    Math.max(0,
                        parent.getScrollLeft()
                    ),
        top=((parent.getHeight()-height)/2)+
                    Math.max(0,
                        parent.getScrollTop()
                    );
    left=Math.round(left);
    top=Math.max(Math.round(top),0);
    window.placeNear(left+parent.getPageLeft(),top+parent.getPageTop());
    window.show();
}
,isc.A.makeOfferBindingDialog=function isc_VisualBuilder_makeOfferBindingDialog(parentNode){
    var liveObject=parentNode.liveObject;
    var _this=this;
    if(this.offerBindingForm)this.offerBindingForm.markForDestroy();
    var childName=(isc.isA.ListGrid(liveObject)?"gridDropBindingDialog":"formDropBindingDialog");
    var projectDataSources=this.project.datasources,
        dataSources=[]
    ;
    for(var i=0;i<projectDataSources.length;i++){
        dataSources.add(projectDataSources[i].dsName);
    }
    dataSources.sort();
    var data=this._dsWizards,
        choices=[]
    ;
    for(var i=0;i<data.length;i++){
        var record=data[i];
        if(record.canSelect=="false")continue;
        choices.add(record.title);
    }
    this.offerBindingForm=this.createAutoChild(childName,{
        targetDataSources:dataSources,
        targetDSWizards:choices
    });
    if(this.offerBindingWindow)this.offerBindingWindow.markForDestroy();
    var submitButton=isc.IButton.create({
        title:"Submit",
        autoFit:true,
        click:function(){
            var form=_this.offerBindingForm;
            if(!form.validate())return;
            _this.offerBindingWindow.hide();
            var values=form.getValues();
            if(values.doNothing)return;
            if(values.bindToDataSource){
                var dataSource=values.dataSource;
                var paletteNode=_this.dataSourceList.data.find("ID",dataSource);
                if(!paletteNode)return;
                var newEditNode=_this.dataSourceList.makeEditNode(paletteNode);
                newEditNode.dropped=true;
                newEditNode.liveObject=isc.DS.get(dataSource);
                var tree=_this.projectComponents,
                    editContext=tree.getEditContext()
                ;
                editContext.addNode(newEditNode,parentNode,0);
            }else if(values.createDataSource){
                var data=_this._dsWizards,
                    wizardName=values.dsWizard,
                    wizardRecord
                ;
                if(wizardName){
                    wizardRecord=data.find("title",wizardName);
                    if(!wizardRecord){
                        isc.warn("New DataSource wizard '"+wizardName+"' not found");
                        return;
                    }
                }
                _this.showDSWizard(wizardRecord,parentNode);
            }
        }
    });
    var buttonsLayout=isc.HLayout.create({
        height:30,
        membersMargin:10
    });
    buttonsLayout.addMembers([isc.LayoutSpacer.create(),submitButton]);
    var layout=isc.VLayout.create({
        width:400,
        padding:5,
        members:[this.offerBindingForm,buttonsLayout]
    });
    var title=(isc.isA.ListGrid(liveObject)?"How do you want to provide data for this grid?":"How do you want to define the fields for this form?");
    this.offerBindingWindow=isc.Window.create({
        title:title,
        autoDraw:true,
        top:-500,left:-1000,
        showCloseButton:false,
        showMinimizeButton:false,
        builder:this,
        isModal:true,showModalMask:true,
        autoSize:true,
        items:[layout]
    });
}
,isc.A.bindDataSourceToNode=function isc_VisualBuilder_bindDataSourceToNode(ds,parentNode){
    var paletteNode=this.dataSourceList.data.find("ID",ds.ID);
    if(!paletteNode)return;
    var newEditNode=this.dataSourceList.makeEditNode(paletteNode);
    newEditNode.liveObject=ds;
    newEditNode.dropped=true;
    var tree=this.projectComponents,
        editContext=tree.getEditContext()
    ;
    editContext.addNode(newEditNode,parentNode,0);
    this.lastUsedDataSource=ds.ID;
}
,isc.A.hideRightMostResizeBar=function isc_VisualBuilder_hideRightMostResizeBar(){
    this.workspace.getMember(this.workspace.getMembers().length-1).showResizeBar=false;
}
,isc.A.addOperation=function isc_VisualBuilder_addOperation(){
    if(!this.schemaWindow){
        this.schemaWindow=isc.TWindow.create({
            title:this.schemaWindowTitle||"Webservice Operations",
            autoCenter:true,
            autoDraw:false,
            width:Math.round(this.width*.6),height:Math.round(this.height*.9),
            items:[
                this.addAutoChild("schemaViewer"),
                this.addAutoChild("schemaViewerSelectButton")
            ]
        });
    }
    this.getOperationsTreeData(this.getID()+".addOperationReply(data)");
}
,isc.A.addOperationReply=function isc_VisualBuilder_addOperationReply(data){
    this.schemaViewer.setData(isc.Tree.create({
        modelType:"children",
        root:data,
        nameProperty:"name",
        childrenProperty:"children"
    }));
    this.schemaViewer.getData().openAll();
    this.schemaWindow.show();
}
);
isc.evalBoundary;isc.B.push(isc.A.operationSelected=function isc_VisualBuilder_operationSelected(){
    var oldTree=this.schemaViewer.data,
        record=this.schemaViewer.getSelectedRecord();
    if(record!=null){
        if(record.serviceType=="service")record=oldTree.getChildren(record)[0];
        if(record.serviceType=="portType")record=oldTree.getChildren(record)[0];
        var portType=oldTree.getParent(record);
        var service=oldTree.getParent(portType);
        var location=record.location||portType.location||service.location;
        var tree=this.projectComponents.data;
        location=this.getOperationWSDLLocation(location);
        var _this=this;
        this.loadWebService(location,service.name,portType.name,record.name);
    }
}
,isc.A.getOperationWSDLLocation=function isc_VisualBuilder_getOperationWSDLLocation(location){return location;}
,isc.A.loadWebService=function isc_VisualBuilder_loadWebService(location,service,portType,operation){
    var _this=this;
    isc.xml.loadWSDL(location,function(webService){
                        _this.newServiceLoaded(webService,service,portType,operation,location);
                     },null,true);
}
,isc.A.newServiceLoaded=function isc_VisualBuilder_newServiceLoaded(webService,service,portType,operation,location){
    var soConfig={
        operationName:operation,
        serviceNamespace:webService.serviceNamespace,
        serviceName:webService.name,
        serviceDescription:service,
        portTypeName:portType,
        location:location
    };
    this.addWebService(webService,soConfig);
    this.schemaWindow.hide();
}
,isc.A.getOperationsTreeData=function isc_VisualBuilder_getOperationsTreeData(){
    var grid=this.operationsPalette,
        tree=grid?grid.data:null,
        data=tree?tree.getChildren(tree.getRoot()):null
    ;
    return data;
}
,isc.A.trimOperationsTreeData=function isc_VisualBuilder_trimOperationsTreeData(theTree,isInput){
    if(!theTree)return null;
    var messageType=isInput?"message_in":"message_out",
        preparedTree=isc.addProperties({},theTree),
        exitNow=false
    ;
    while(!exitNow){
        var node=preparedTree.find("serviceType",messageType);
        if(node){
            preparedTree.remove(node);
        }else exitNow=true;
    }
    return preparedTree;
}
,isc.A.addWebService=function isc_VisualBuilder_addWebService(service,serviceOperationConfig){
    var serviceInfo={};
    serviceInfo.webService=service;
    serviceInfo.inputSchema=service.getRequestMessage(serviceOperationConfig.operationName);
    serviceInfo.outputSchema=service.getResponseMessage(serviceOperationConfig.operationName);
    serviceOperationConfig.inputSchema=serviceInfo.inputSchema;
    serviceOperationConfig.outputSchema=serviceInfo.outputSchema;
    var soNode=this.addServiceOperation(serviceOperationConfig);
    var newTreeData=this.getComplexOperationsPaletteTreeData(),
        path="|"+serviceOperationConfig.serviceDescription+
               "|"+serviceOperationConfig.portTypeName+
               "|"+serviceOperationConfig.operationName,
        data;
    if(this.operationsPalette.getData()){
        data=isc.Tree.create({root:this.operationsPalette.getData().getRoot()});
    }else{
        data=isc.Tree.create({});
    }
    newTreeData.pathDelim="|";
    data.pathDelim="|";
    if(data.find(path)){
        this.logWarn("Attempting to add webservice operation that is already in the tree");
        this.schemaWindow.hide();
        return;
    }
    var operationNode;
    if(soNode){
        operationNode={
            name:serviceOperationConfig.operationName,
            serviceType:"operation",
            type:"IButton",
            defaults:{
                title:"Invoke "+serviceOperationConfig.operationName,
                autoFit:true,
                click:{
                    target:soNode.liveObject.ID,
                    name:"invoke",
                    title:"Invoke "+serviceOperationConfig.operationName
                }
            }
        };
    }else{
        operationNode={
            name:serviceOperationConfig.operationName,
            serviceType:"operation",
            canDrag:false
        };
    }
    path="|"+serviceOperationConfig.serviceDescription+
           "|"+serviceOperationConfig.portTypeName;
    var parentNode=data.find(path);
    var parentCreated=false;
    if(parentNode){
        data.add(operationNode,parentNode);
        parentCreated=true;
        this.operationsPalette.setData(data);
    }else{
        path="|"+serviceOperationConfig.serviceDescription;
        var parentNode=data.find(path);
        var parentCreated=false;
        if(parentNode){
            data.add({
                        name:serviceOperationConfig.portTypeName,
                        serviceType:"portType",
                        canDrag:false,
                        children:[operationNode]
                    },parentNode);
            parentCreated=true;
        }else{
            var subTree={
                name:serviceOperationConfig.serviceDescription,
                serviceType:"service",
                canDrag:false,
                children:[
                    {
                        name:serviceOperationConfig.portTypeName,
                        serviceType:"portType",
                        canDrag:false,
                        children:[operationNode]
                    }
                ]
            };
        }
        newTreeData.children.add(subTree);
        this.operationsPalette.setData(isc.Tree.create({
            modelType:"children",
            root:newTreeData,
            nameProperty:"name",
            childrenProperty:"children"
        }));
    }
    var path="|"+serviceOperationConfig.serviceDescription+
               "|"+serviceOperationConfig.portTypeName+
               "|"+serviceOperationConfig.operationName,
    parentNode=data.find(path);
    var settings={
        palette:this.operationsPalette,
        isOutput:false,
        operation:serviceOperationConfig.operationName,
        serviceName:serviceOperationConfig.serviceName,
        serviceNamespace:serviceOperationConfig.serviceNamespace
    };
    if(serviceInfo.inputSchema){
        this.setSchema(serviceInfo.inputSchema,parentNode,null,"",settings);
    }
    if(serviceInfo.outputSchema){
        settings.isOutput=true;
        this.setSchema(serviceInfo.outputSchema,parentNode,null,"",settings);
    }
    this.operationsPalette.getData().openAll();
}
,isc.A.addServiceOperation=function isc_VisualBuilder_addServiceOperation(config){
    var inVM,outVM;
    if(config.inputSchema){
        inVM={
            type:"ValuesManager",
            defaults:{
                parentProperty:"inputVM",
                dataSource:config.inputSchema.ID,
                serviceName:config.serviceName,
                serviceNamespace:config.serviceNamespace
            }
        };
    }
    if(config.outputSchema){
        outVM={
            type:"ValuesManager",
            defaults:{
                parentProperty:"outputVM",
                dataSource:config.outputSchema.ID,
                serviceName:config.serviceName,
                serviceNamespace:config.serviceNamespace
            }
        };
    }
    var so={
        type:"ServiceOperation",
        defaults:{
            operationName:config.operationName,
            serviceNamespace:config.serviceNamespace,
            serviceName:config.serviceName,
            serviceDescription:config.serviceDescription,
            portTypeName:config.portTypeName,
            location:config.location
        }
    };
    var tree=this.projectComponents;
    var soNode=tree.makeEditNode(so);
    tree.addNode(soNode);
    if(inVM)tree.addNode(tree.makeEditNode(inVM),soNode,null,"inputVM");
    if(outVM)tree.addNode(tree.makeEditNode(outVM),soNode,null,"outputVM");
    return soNode;
}
,isc.A.shouldShowDataPathFields=function isc_VisualBuilder_shouldShowDataPathFields(){
    return this.operationsPalette?true:false;
}
,isc.A.getComplexOperationsPaletteTreeData=function isc_VisualBuilder_getComplexOperationsPaletteTreeData(){
    if(!this.operationsPalette||!this.operationsPalette.data)return{children:[]};
    var tree=this.operationsPalette.data,
        topLevelNodes=tree.getChildren(tree.getRoot());
    return{children:topLevelNodes};
}
,isc.A.setSchema=function isc_VisualBuilder_setSchema(schema,paletteParent,editParent,dataPath,settings){
    var populateTarget=settings.populateTarget&&this.targetContext!=null;
    var fieldNames=schema.getFieldNames();
    for(var i=0;i<fieldNames.length;i++){
        var fieldName=fieldNames[i],
            field=schema.getField(fieldName),
            complexType=schema.fieldIsComplexType(fieldName),
            editorType;
        var paletteNode=this.getFieldPaletteNode(schema,fieldName,dataPath,settings);
        var paletteTree=settings.palette.data;
        paletteTree.add(paletteNode,paletteParent||paletteTree.getRoot());
        if(populateTarget&&editParent&&editParent.type==this.complexTypeNodeConstructor){
            var canvasItem=null;
            if(complexType){
                var defaults={};
                isc.addProperties(defaults,this.canvasItemWrapperDefaults);
                isc.addProperties(defaults,this.canvasItemWrapperProperties);
                canvasItem=settings.palette.makeEditNode({
                    type:this.canvasItemWrapperConstructor,
                    defaults:defaults
                });
                this.targetContext.addNode(canvasItem,editParent);
            }
            var newEditNode=settings.palette.makeEditNode(paletteNode);
            this.targetContext.addNode(newEditNode,canvasItem||editParent);
            if(isc.EditContext)isc.EditContext.clearSchemaProperties(newEditNode);
        }
        if(complexType){
            var subSchema=schema.getSchema(field.type);
            this.setSchema(subSchema,paletteNode,newEditNode,
                (dataPath?dataPath+"/":"")+fieldName,settings);
        }
    }
}
,isc.A.getFieldPaletteNode=function isc_VisualBuilder_getFieldPaletteNode(schema,fieldName,dataPath,settings){
    var complexType=schema.fieldIsComplexType(fieldName),
        field=schema.getField(fieldName),
        isOutput=settings.isOutput,
        displayOnly=settings.displayOnly!=null
                        ?settings.displayOnly:isOutput,
        dsIDs=this.getSchemaDataSourceIDs(settings.operation,settings.serviceName,
                                            settings.serviceNamespace),
        defaults={
            schemaDataSource:isOutput?dsIDs.output:dsIDs.input,
            serviceNamespace:settings.serviceNamespace,
            serviceName:settings.serviceName,
            isComplexType:complexType,
            type:complexType?"complexType":"simpleType"
        },
        title=isc.DataSource.getAutoTitle(fieldName),
        paletteNode={
            name:fieldName,
            defaults:defaults
        },
        itemDataPath=(dataPath?dataPath+"/":"")+fieldName;
    defaults.dataPath=itemDataPath;
    if(displayOnly){
        defaults.inputDataPath=itemDataPath;
        defaults.inputSchemaDataSource=defaults.schemaDataSource;
        defaults.inputServiceNamespace=defaults.serviceNamespace;
        defaults.inputServiceName=defaults.serviceName;
    }
    if(displayOnly)defaults.canEdit=false;
    var maxOccurs=field.xmlMaxOccurs;
    if(maxOccurs=="unbounded")maxOccurs=1000;
    if(!complexType){
        paletteNode=this.getSimpleTypeNode(paletteNode,displayOnly,title);
    }else{
        defaults.dataSource=defaults.schemaDataSource;
        delete defaults.schemaDataSource;
        if(maxOccurs==null||maxOccurs<=1){
            paletteNode=this.getComplexTypeNode(paletteNode,displayOnly,title);
        }else{
            paletteNode=this.getRepeatingComplexTypeNode(paletteNode,maxOccurs,displayOnly,
                                                           schema,field.type,title);
        }
    }
    paletteNode.title=defaults.title;
    paletteNode.type=defaults.type;
    return paletteNode;
}
,isc.A.getSimpleTypeNode=function isc_VisualBuilder_getSimpleTypeNode(paletteNode,displayOnly,title){
    paletteNode.type=this.simpleTypeNodeConstructor;
    paletteNode.defaults.title=title;
    isc.addProperties(paletteNode.defaults,this.simpleTypeNodeDefaults);
    isc.addProperties(paletteNode.defaults,this.simpleTypeNodeProperties);
    return paletteNode;
}
,isc.A.getComplexTypeNode=function isc_VisualBuilder_getComplexTypeNode(paletteNode,displayOnly,title){
    paletteNode.type=this.complexTypeNodeConstructor;
    delete paletteNode.defaults.dataPath;
    delete paletteNode.defaults.inputDataPath;
    paletteNode.defaults.groupTitle=title;
    isc.addProperties(paletteNode.defaults,this.complexTypeNodeDefaults);
    isc.addProperties(paletteNode.defaults,this.complexTypeNodeProperties);
    return paletteNode;
}
,isc.A.getRepeatingComplexTypeNode=function isc_VisualBuilder_getRepeatingComplexTypeNode(paletteNode,maxOccurs,displayOnly,schema,type,title){
    if(maxOccurs<5&&displayOnly){
        paletteNode.type="DetailViewer";
    }else{
        paletteNode.type=(displayOnly?"ListGrid":"LineEditor");
    }
    var fieldSchema=schema.getSchema(type);
    var pathProperty=displayOnly?"inputDataPath":"dataPath";
    if(displayOnly){
        paletteNode.defaults.height=80;
        paletteNode.defaults.autoFitMaxRecords=10;
        paletteNode.defaults.canDragSelectText=true;
    }else{
        paletteNode.defaults.saveLocally=true;
    }
    var gridFields=fieldSchema.getFlattenedFields(null,paletteNode.defaults.dataPath,pathProperty);
    gridFields=isc.getValues(gridFields);
    gridFields=isc.applyMask(gridFields,["name","title","dataPath","inputDataPath"]);
    paletteNode.defaults.defaultFields=gridFields;
    isc.addProperties(paletteNode.defaults,this.repeatingComplexTypeNodeDefaults);
    isc.addProperties(paletteNode.defaults,this.repeatingComplexTypeNodeProperties);
    return paletteNode;
}
,isc.A.getSchemaDataSourceIDs=function isc_VisualBuilder_getSchemaDataSourceIDs(operation,serviceName,serviceNamespace){
    var schemaDSIDs={};
    var serviceOp=isc.ServiceOperation.getServiceOperation(operation,serviceName,
                                                             serviceNamespace);
    if(serviceOp){
        if(serviceOp.inputVM){
            schemaDSIDs.input=isc.DataSource.get(serviceOp.inputVM.dataSource).ID;
        }
        if(serviceOp.outputVM){
            schemaDSIDs.output=isc.DataSource.get(serviceOp.outputVM.dataSource).ID;
        }
    }
    return schemaDSIDs;
}
,isc.A.getBaseComponent=function isc_VisualBuilder_getBaseComponent(){
    var projectData=this.projectComponents.data,
        children=projectData.getChildren(projectData.getRoot())
    ;
    if(children.length==1)return children[0].liveObject;
    var lastCanvas=null;
    for(var i=children.length-1;i>=0;i--){
        var child=children[i].liveObject;
        if(!isc.isA.Canvas(child))continue;
        if(child.visibility!=isc.Canvas.HIDDEN&&
            (!Object.getOwnPropertyNames(child).contains("autoDraw")||
                child._defaultedAutoDraw||
                child.autoDraw!==false))
        {
            return child;
        }else if(!lastCanvas){
            lastCanvas=child;
        }
    }
    return lastCanvas;
}
,isc.A.getBaseOrRootComponent=function isc_VisualBuilder_getBaseOrRootComponent(){
    var mockupMode=this.getScreenMockupMode(this.currentScreen);
    return(mockupMode?this.rootLiveObject:this.getBaseComponent());
}
,isc.A.getTargetRuleScope=function isc_VisualBuilder_getTargetRuleScope(){
    return this.getBaseComponent();
}
,isc.A._startCapturingErrorReports=function isc_VisualBuilder__startCapturingErrorReports(){
    var clickStream=this.clickStream;
    var ds=this.errorDataSource=isc.DS.get(this.errorDataSource||"hostedErrorReports");
    if(ds){
        clickStream.setEventErrorListener({target:this,methodName:"_reportEventError"});
        this.logInfo("JS errors will now log reports with context to hostedErrorReports DS");
    }else{
        this.logWarn("No ClickStream available.  Unable to log JavaScript error reports");
    }
}
,isc.A._reportEventError=function isc_VisualBuilder__reportEventError(csData){
    var ds=this.errorDataSource,
        stream=this.clickStream,
        record={
        sessionStart:stream.getStartTime(),
        errorTime:new Date(),
        userId:this.userId
    };
    var screen=this.currentScreen;
    if(screen)isc.addProperties(record,{
        currentScreen:screen.fileName,
        screenLoadVersion:isc.DateUtil.parseSchemaDate(screen.lastLoadVersion),
        screenSaveVersion:isc.DateUtil.parseSchemaDate(screen.lastSaveVersion)
    });
    var project=this.project;
    if(project)isc.addProperties(record,{
        currentProject:project.fileName,
        projectLoadVersion:isc.DateUtil.parseSchemaDate(project.lastLoadVersion),
        projectSaveVersion:isc.DateUtil.parseSchemaDate(project.lastSaveVersion)
    });
    var extraNotes="",
        components=this.projectComponents;
    try{
        var selectedRecord=components.getSelectedRecord();
        if(selectedRecord)record.selectedComponent=selectedRecord.ID;
    }catch(e){
        var errorReport=(e.stack||e).toString();
        extraNotes="Got exception while getting selectedRecord: "+errorReport;
    }
    try{
        var cleanNodes=components.getCleanComponentData(),
            componentJSON=isc.JSON.encode(cleanNodes),
            componentTreeMax=ds.getField("componentTree").length;
        if(componentTreeMax&&componentJSON.length>componentTreeMax){
            componentJSON=componentJSON.substring(0,componentTreeMax);
        }
        record.componentTree=componentJSON;
    }catch(e){
        var errorReport=(e.stack||e).toString();
        if(extraNotes)extraNotes+="\n";
        extraNotes+="Got exception while getting componentTree: "+errorReport;
    }
    var lastEvent=csData.events.last();
    if(lastEvent){
        var errorTrace=lastEvent.errorTrace,
            errorTraceMax=ds.getField("errorTrace").length;
        if(errorTrace&&errorTrace.length>errorTraceMax){
            errorTrace=errorTrace.substring(0,errorTraceMax);
        }
        record.errorTrace=errorTrace;
        lastEvent=isc.addProperties({},lastEvent);
        csData.events[csData.events.length-1]=lastEvent;
        delete lastEvent.errorTrace;
    }
    var csJSON,clickStreamMax=ds.getField("clickStream").length,
        encoder=isc.JSONEncoder.create({dateFormat:"dateConstructor"});
    for(var events=csData.events;events.length>0;csData.events=events){
        csJSON=encoder.encode(csData);
        if(csJSON.length<=clickStreamMax)break;
        events=events.slice(-Math.floor(events.length/2));
    }
    record.clickStream=csJSON;
    ds.addData(record,null,{showPrompt:false});
}
,isc.A._startCapturingUsageData=function isc_VisualBuilder__startCapturingUsageData(){
    var ds=this.usageDataSource=isc.DS.get(this.usageDataSource||"hostedUsageData");
    if(ds){
        var builder=this;
        this.observe(isc.RPCManager,"handleLoginSuccess",function(){
            builder._addUsageRecord("relogin",builder.getSessionLengthInSeconds());
        });
        this.logInfo("Capturing usage data to DS "+ds.getID());
    }else this.logWarn("Unable to capture usage data; the DS could not be loaded");
}
,isc.A._addUsageRecord=function isc_VisualBuilder__addUsageRecord(action,data,data2){
    var ds=this.usageDataSource;
    if(!ds)return;
    if(data!=null&&!isc.isA.String(data))data=data.toString();
    if(data2!=null&&!isc.isA.String(data2))data2=data2.toString();
    ds.addData({
        timeStamp:new Date(),
        userId:this.userId,
        organization:this.organization,
        action:action,
        data:data,
        data2:data2
    },null,{showPrompt:false});
}
,isc.A.getSessionLengthInSeconds=function isc_VisualBuilder_getSessionLengthInSeconds(){
    var clickStream=this.clickStream;
    if(!clickStream)return null;
    return Math.floor((new Date()-clickStream.getStartTime())/1000);
}
,isc.A.startTrackingSessionTimeout=function isc_VisualBuilder_startTrackingSessionTimeout(){
    var builder=this,
        timeout=this.sessionTimeout;
    isc.RPCManager.addClassProperties({
        transformResponse:function(rpcResponse,rpcRequest,data){
            if(builder._sessionTimeoutTimer)isc.Timer.clear(builder._sessionTimeoutTimer);
            builder._sessionTimeoutTimer=isc.Timer.setTimeout({
                action:"isc.RPCManager.handleSessionTimeout()",
                delay:timeout+1,units:isc.Timer.SEC},null,null,true);
            return rpcResponse;
        },
        handleSessionTimeout:function(){
            this.logInfo("session has expired; forcing re-authenication");
            if(isc.RPCManager.loginRequired)isc.RPCManager.loginRequired();
        }
    });
}
,isc.A.startMonitoringServer=function isc_VisualBuilder_startMonitoringServer(){
    var window=this.serverReconnectWindow=this.createAutoChild("serverReconnectWindow");
    if(this.logIsDebugEnabled("serverCommLoss")){
        this.logDebug("installing hooks to monitor the server connection","serverCommLoss");
    }
    var builder=this;
    isc.RPCManager.addClassProperties({
        handleTransportError:function(txNum,status,httpResponseCode,httpResponseText){
            if(this._isHttpResponseCommFailure(httpResponseCode)){
                if(builder.ignoreServerCommLoss)return;
                if(builder.logIsDebugEnabled("serverCommLoss")){
                    builder.logDebug("transaction "+txNum+" failed with http status: "+
                                  httpResponseCode+(httpResponseText?" and text '"+
                                                      httpResponseText+"'":""),
                                  "serverCommLoss");
                }
                window.handleServerCommLoss("transportError");
            }else{
                if(builder.ignoreProgramErrors)return;
                builder.logWarn("Scheduling page reload due to transport error with http "+
                                "response code: "+httpResponseCode+". response text:\n"+
                                httpResponseText);
                builder.handleProgramError();
            }
            return false;
        },
        handleError:function(response,request){
            if(response.status!=isc.RPCResponse.STATUS_SERVER_TIMEOUT||
                builder.ignoreServerCommLoss)
            {
                return this.runDefaultErrorHandling(response,request);
            }
            window.handleServerCommLoss("timeoutError");
            window.serverTimeoutError={response:response,request:request};
        }
    });
    window.observe(isc.Offline,"nativeOffline",function(){
        window.handleServerCommLoss("nativeOffline");
    });
    window.observe(isc.RPCManager,"_timeoutTransaction",function(){
        window.handleServerCommLoss("txTimeout");
    });
}
,isc.A.handleProgramError=function isc_VisualBuilder_handleProgramError(errorTrace){
    if(this.ignoreProgramErrors)return;
    if(this._loadingProject){
        var fileName=this._loadingProject;
        delete this._loadingProject;
        this.removeRecentProject(fileName);
        this.showFailedProjectLoadWindow();
    }else{
        this.showPageReloadWindow();
    }
}
,isc.A.showFailedProjectLoadWindow=function isc_VisualBuilder_showFailedProjectLoadWindow(){
    var failedLoadWindow=this.failedLoadWindow;
    if(failedLoadWindow==null||failedLoadWindow.destroyed){
        failedLoadWindow=this.failedLoadWindow=this.createAutoChild("failedLoadWindow");
    }
    var failedLoadView=this.failedLoadView;
    if(failedLoadView==null||failedLoadView.destroyed){
        failedLoadView=this.failedLoadView=this.createAutoChild("failedLoadView");
    }
    failedLoadWindow.addItem(failedLoadView);
    failedLoadWindow.show();
}
,isc.A.showPageReloadWindow=function isc_VisualBuilder_showPageReloadWindow(){
    var pageReloadWindow=this.pageReloadWindow;
    if(pageReloadWindow==null||pageReloadWindow.destroyed){
        pageReloadWindow=this.pageReloadWindow=this.createAutoChild("pageReloadWindow");
    }
    var pageReloadView=this.pageReloadView;
    if(pageReloadView==null||pageReloadView.destroyed){
        pageReloadView=this.pageReloadView=this.createAutoChild("pageReloadView");
    }
    pageReloadWindow.addItem(pageReloadView);
    pageReloadWindow.show();
}
);
isc.B._maxIndex=isc.C+252;

isc.defineClass("VBFailedLoadView","VStack");
isc.A=isc.VBFailedLoadView.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="100%";
isc.A.layoutMargin=5;
isc.A.membersMargin=5;
isc.A.loadFailureMessageConstructor="Label";
isc.A.loadFailureMessageDefaults={
        overflow:"visible",height:1,
        width:"100%"
    };
isc.A.loadFailureButtonsConstructor="HLayout";
isc.A.loadFailureButtonsDefaults={
        overflow:"visible",height:1,
        membersMargin:5,
        align:"right"
    };
isc.A.openProjectButtonConstructor="Button";
isc.A.openProjectButtonDefaults={
        title:"Open a Project",
        layoutAlign:"right",
        click:function(){
            var view=this.creator,
                builder=view.creator;
            builder.failedLoadWindow.close();
            builder.showLoadProjectUI();
        }
    };
isc.A.createProjectButtonConstructor="Button";
isc.A.createProjectButtonDefaults={
        title:"Create a Project",
        layoutAlign:"right",
        click:function(){
            var view=this.creator,
                builder=view.creator;
            builder.failedLoadWindow.close();
            builder.makeNewProject();
        }
    };
isc.B.push(isc.A.initWidget=function isc_VBFailedLoadView_initWidget(){
        this.Super("initWidget",arguments);
        var builder=this.creator;
        this.addMembers([
            this.addAutoChild("loadFailureMessage",{
                contents:builder.hostedMode?builder.failedLoadHostedMessage:
                                               builder.failedLoadLocalMessage
            }),
            this.addAutoChild("loadFailureButtons",{
                members:[
                    this.addAutoChild("openProjectButton"),
                    this.addAutoChild("createProjectButton")
                ]
            })
        ]);
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("VBReloadView","VStack");
isc.A=isc.VBReloadView.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="100%";
isc.A.layoutMargin=5;
isc.A.membersMargin=5;
isc.A.reloadMessageConstructor="Label";
isc.A.reloadMessageDefaults={
        overflow:"visible",height:1,
        width:"100%"
    };
isc.A.reloadButtonConstructor="Button";
isc.A.reloadButtonDefaults={
        title:"Reload Now",
        layoutAlign:"right",
        click:function(){
            this.creator.reload();
        }
    };
isc.B.push(isc.A.reload=function isc_VBReloadView_reload(){
        var location=window.location;
        if(location)location.reload();
    }
,isc.A.initWidget=function isc_VBReloadView_initWidget(){
        this.Super("initWidget",arguments);
        this.addMembers([
            this.addAutoChild("reloadMessage"),
            this.addAutoChild("reloadButton")
        ]);
    }
,isc.A.visibilityChanged=function isc_VBReloadView_visibilityChanged(){
        if(this.isVisible()){
            this.timeout=this.creator.pageReloadTimeoutSeconds;
            this.tickTock();
        }else if(this._updateTimer){
            isc.Timer.clear(this._updateTimer);
            delete this._updateTimer;
        }
    }
,isc.A.tickTock=function isc_VBReloadView_tickTock(){
        var timeout=this.timeout--;
        this.creator.pageReloadWindow.bringToFront();
        this.reloadButton.setFocus(true);
        var message=this.creator.pageReloadWindowMessage;
        this.reloadMessage.setContents(message.evalDynamicString(this,{
            countdown:timeout
        }));
        if(timeout<=0){
            this.reload();
            return;
        }
        this._updateTimer=this.delayCall("tickTock",null,1000);
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("ServerReconnectWindow","Window");
isc.A=isc.ServerReconnectWindow.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.top=-10000;
isc.A.isModal=true;
isc.A.showModalMask=true;
isc.A.visibility="hidden";
isc.A.serverCommLossCount=0;
isc.B.push(isc.A.handleServerCommLoss=function isc_ServerReconnectWindow_handleServerCommLoss(reason){
        if(this.ignoreServerCommLoss)return;
        if(this.isVisible())return;
        else this.show();
        var builder=this.creator;
        if(builder.logIsDebugEnabled("serverCommLoss")){
            builder.logDebug("handling communication loss due to: "+reason,"serverCommLoss");
        }
        this.serverCommLossCount++;
        this.checkServerStatus(true);
    }
,isc.A.showServerCommLossMessage=function isc_ServerReconnectWindow_showServerCommLossMessage(contents,actions){
        var message=this.serverCommLossMessage;
        if(message){
            isc.Notify.setMessageContents(message,contents,actions);
            return;
        }
        this.serverCommLossMessage=isc.Notify.addMessage(contents,actions,null,{
            messagePriority:isc.Notify.WARN,duration:0
        });
    }
,isc.A.showServerCommWaitMessage=function isc_ServerReconnectWindow_showServerCommWaitMessage(){
        var actions,builder=this.creator,
            message=this.serverCommLossMessage;
        if(!message||!isc.Notify.messageHasActions(message))actions=[{
            title:builder.serverReconnectNowText,target:this,
            methodName:"restartServerCheckCountdown"
        }];
        this.showServerCommLossMessage(this.getServerCommLossWaitText(),actions);
    }
,isc.A.getServerCommLossWaitText=function isc_ServerReconnectWindow_getServerCommLossWaitText(){
        var builder=this.creator,seconds=this.serverCountdown,
            time=seconds>600?Math.ceil(seconds/60)+" minutes":seconds+" seconds";
        return builder.serverCommLossWaitText.evalDynamicString(this,{time:time});
    }
,isc.A.restartServerCheckCountdown=function isc_ServerReconnectWindow_restartServerCheckCountdown(){
        isc.Timer.clear(this.serverCommLossTimer);
        this.serverCommLossTick(true);
    }
,isc.A.checkServerStatus=function isc_ServerReconnectWindow_checkServerStatus(resetInterval){
        var builder=this.creator;
        this.serverCountdown=resetInterval?
            (this.serverCheckInterval=builder.initialServerCheckInterval):
            (this.serverCheckInterval*=2);
        this.showServerCommLossMessage(builder.serverCommLossPingText,null);
        delete this.serverTimeoutError;
        if(builder.logIsDebugEnabled("serverCommLoss")){
            builder.logDebug("sending ping to server to verify connection","serverCommLoss");
        }
        var window=this,
            errorId=this.serverCommLossCount;
        isc.DMI.callBuiltin({
            methodName:"ping",
            callback:function(response,data){
                if(errorId!=window.serverCommLossCount)return;
                if(builder.logIsDebugEnabled("serverCommLoss")){
                    builder.logDebug("got ping response; clearing modal mask","serverCommLoss");
                }
                window.hide();
            }
        });
        this.serverCommLossTimer=this.delayCall("serverCommLossTick",[],
                                                   builder.showPingDuration);
    }
,isc.A.serverCommLossTick=function isc_ServerReconnectWindow_serverCommLossTick(resetInterval){
        if(--this.serverCountdown>0&&!resetInterval){
            this.showServerCommWaitMessage();
            this.serverCommLossTimer=this.delayCall("serverCommLossTick",[],1000);
        }else{
            this.checkServerStatus(resetInterval);
        }
    }
,isc.A.clearServerCommLoss=function isc_ServerReconnectWindow_clearServerCommLoss(){
        var error=this.serverTimeoutError;
        if(error){
            isc.RPCManager.runDefaultErrorHandling(error.response,error.request);
            delete this.serverTimeoutError;
        }
        isc.Timer.clear(this.serverCommLossTimer);
        delete this.serverCommLossTimer;
        isc.Notify.dismissMessage(this.serverCommLossMessage);
        delete this.serverCommLossMessage;
    }
,isc.A.hide=function isc_ServerReconnectWindow_hide(){
        this.Super("hide",arguments);
        this.clearServerCommLoss();
    }
);
isc.B._maxIndex=isc.C+9;

isc.defineClass("MultiActionPanel","VLayout");
isc.A=isc.MultiActionPanel.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=450;
isc.A.height=250;
isc.A.layoutMargin=10;
isc.A.membersMargin=10;
isc.A.instructions="Click the <q>Add additional action</q> button to add a new action.&nbsp; "+
                  "Drag and drop to change the order of actions.&nbsp; Click on a row in the "+
                  "grid below to change the action, or click on the remove icon next to an "+
                  "action to remove it.";
isc.A.instructionsLabelDefaults={
        _constructor:"Label",
        width:"100%",
        height:1,
        overflow:"visible"
    };
isc.A.mainLayoutDefaults={
        _constructor:"HLayout",
        width:"100%",
        height:"100%",
        membersMargin:10
    };
isc.A.actionsGridDefaults={
        _constructor:"ListGrid",
        autoParent:"mainLayout",
        width:"100%",
        height:"100%",
        showHeader:false,
        defaultFields:[{
            name:"value",
            escapeHTML:true,
            formatCellValue:function(value,record,rowNum,colNum,actionsGrid){
                var title=null;
                if(actionsGrid.creator.getActionTitle){
                    title=actionsGrid.creator.getActionTitle(value.target,value.name,true);
                }
                title=title||("["+value.target+"."+value.title+"]");
                return title.replace(/^\[/,"").replace(/\]$/,"");
            }
        }],
        emptyMessage:"No Actions",
        selectionType:"single",
        autoSelectEditors:false,
        canRemoveRecords:true,
        canReorderRecords:true,
        rowClick:function(record,recordNum,fieldNum,keyboardGenerated){
            var actionsGrid=this,
                multiActionPanel=actionsGrid.creator,
                menu=multiActionPanel.getActionMenu();
            menu.bindingComplete=function(binding){
                record.value=binding;
                var i=actionsGrid.getRowNum(record),
                    data=actionsGrid.data;
                data._startChangingData();
                data.removeAt(i);
                data.addAt(record,i);
                data._doneChangingData();
            };
            menu.show();
            var EH=this.ns.EH;
            menu.placeNear(EH.getX(),EH.getY());
        }
    };
isc.A.sideControlsLayoutDefaults={
        _constructor:"VLayout",
        autoParent:"mainLayout",
        height:"100%",
        membersMargin:5,
        align:"center"
    };
isc.A.moveToBeginningButtonDefaults={
        _constructor:"ImgButton",
        autoParent:"sideControlsLayout",
        src:"[SKINIMG]TransferIcons/up_first.png",
        size:15,
        showDown:false,
        prompt:"Move the selected action to the beginning",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid,
                selectedRecord=actionsGrid.getSelectedRecord();
            if(selectedRecord!=null){
                var i=actionsGrid.getRowNum(selectedRecord);
                if(i>0){
                    var data=actionsGrid.data;
                    data._startChangingData();
                    data.removeAt(i);
                    data.addAt(selectedRecord,0);
                    data._doneChangingData();
                }
            }
        }
    };
isc.A.moveUpButtonDefaults={
        _constructor:"ImgButton",
        autoParent:"sideControlsLayout",
        src:"[SKINIMG]TransferIcons/up.png",
        size:15,
        showDown:false,
        prompt:"Move the selected action up one",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid,
                selectedRecord=actionsGrid.getSelectedRecord();
            if(selectedRecord!=null){
                var i=actionsGrid.getRowNum(selectedRecord);
                if(i>0){
                    var data=actionsGrid.data;
                    data._startChangingData();
                    data.removeAt(i);
                    data.addAt(selectedRecord,i-1);
                    data._doneChangingData();
                }
            }
        }
    };
isc.A.moveDownButtonDefaults={
        _constructor:"ImgButton",
        autoParent:"sideControlsLayout",
        src:"[SKINIMG]TransferIcons/down.png",
        size:15,
        showDown:false,
        prompt:"Move the selected action down one",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid,
                selectedRecord=actionsGrid.getSelectedRecord();
            if(selectedRecord!=null){
                var i=actionsGrid.getRowNum(selectedRecord),
                    data=actionsGrid.data;
                if(i<data.getLength()-1){
                    data._startChangingData();
                    data.removeAt(i);
                    data.addAt(selectedRecord,i+1);
                    data._doneChangingData();
                }
            }
        }
    };
isc.A.moveToEndButtonDefaults={
        _constructor:"ImgButton",
        autoParent:"sideControlsLayout",
        src:"[SKINIMG]TransferIcons/down_last.png",
        size:15,
        showDown:false,
        prompt:"Move the selected action to the end",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid,
                selectedRecord=actionsGrid.getSelectedRecord();
            if(selectedRecord!=null){
                var i=actionsGrid.getRowNum(selectedRecord),
                    data=actionsGrid.data;
                if(i<data.getLength()-1){
                    data._startChangingData();
                    data.removeAt(i);
                    data.add(selectedRecord);
                    data._doneChangingData();
                }
            }
        }
    };
isc.A.buttonsLayoutDefaults={
        _constructor:"HLayout",
        width:"100%",
        membersMargin:10
    };
isc.A.saveButtonDefaults={
        _constructor:"IButton",
        autoParent:"buttonsLayout",
        title:"Save",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid;
            actionsGrid.endEditing();
            var data=actionsGrid.data,
                bindings;
            if(isc.isAn.Array(data)&&data.length>0){
                bindings=data.getProperty("value");
            }
            this.creator.saveClick(bindings);
        }
    };
isc.A.cancelButtonDefaults={
        _constructor:"IButton",
        autoParent:"buttonsLayout",
        title:"Cancel",
        click:function(){
            this.creator.cancelClick();
        }
    };
isc.A.addAdditionalActionButtonTitle="Add additional action";
isc.A.addAdditionalActionButtonDefaults={
        _constructor:"IButton",
        autoParent:"buttonsLayout",
        addAsPeer:true,
        snapTo:"L",
        autoFit:true,
        icon:"actions/addAction.png",
        iconSize:16,
        showRollOverIcon:false,
        click:function(){
            var multiActionPanel=this.creator,
                menu=multiActionPanel.getActionMenu();
            menu.bindingComplete=function(binding){
                multiActionPanel.actionsGrid.data.add({value:binding});
            };
            menu.show();
            var rect=this.getPageRect();
            menu.placeNear(rect[0],rect[1]+rect[3]);
        }
    };
isc.A.actionMenuDefaults={
        _constructor:"ActionMenu",
        isForMultiActionPanel:true
    };
isc.A.autoChildren=["instructionsLabel","mainLayout","actionsGrid","sideControlsLayout","moveToBeginningButton","moveUpButton","moveDownButton","moveToEndButton","buttonsLayout","addAdditionalActionButton","cancelButton","saveButton"];
isc.B.push(isc.A.getActionMenu=function isc_MultiActionPanel_getActionMenu(){
        var actionMenu=this.actionMenu;
        if(actionMenu)actionMenu.markForDestroy();
        actionMenu=this.actionMenu=this.createAutoChild("actionMenu",{
            builder:this.builder,
            sourceComponent:this.sourceComponent,
            sourceMethod:this.sourceMethod,
            components:this.currentComponents
        });
        return actionMenu;
    }
,isc.A.initWidget=function isc_MultiActionPanel_initWidget(){
        this.Super("initWidget",arguments);
        this.addAutoChildren(this.autoChildren);
    }
,isc.A.getDynamicDefaults=function isc_MultiActionPanel_getDynamicDefaults(childName){
        if(childName==="instructionsLabel"){
            return{contents:this.instructions};
        }else if(childName==="buttonsLayout"){
            return{align:this.isRTL()?"left":"right"};
        }else if(childName==="addAdditionalActionButton"){
            return{title:this.addAdditionalActionButtonTitle};
        }
    }
,isc.A.configureFor=function isc_MultiActionPanel_configureFor(actionMenu){
        var currentStringMethods=actionMenu.currentStringMethods;
        if(currentStringMethods==null)currentStringMethods=[];
        var numStringMethods=currentStringMethods.length;
        var gridData=[];
        for(var i=0;i<numStringMethods;++i){
            var val=currentStringMethods[i].getValue();
            if(isc.isAn.Array(val)){
                for(var j=0;j<val.length;++j){
                    gridData.add({value:val[j]});
                }
            }else{
                gridData.add({value:val});
            }
        }
        this.actionsGrid.setData(gridData);
        this.sourceComponent=actionMenu.sourceComponent;
        this.sourceMethod=actionMenu.sourceMethod;
        this.currentComponents=actionMenu.components;
        this.cancelButton.delayCall("focus");
    }
);
isc.B._maxIndex=isc.C+4;

isc.MultiActionPanel.registerStringMethods({
    "saveClick":"bindings",
    "cancelClick":""
});
isc.defineClass("DeploymentEditor","VLayout");
isc.A=isc.DeploymentEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.deploymentNameTitle="Deployment name";
isc.A.deploymentTypeTitle="Deployment type";
isc.A.deploymentURLTitle="Deployment URL";
isc.A.newDeploymentSuccess="New ${type} deployment '${name}' succeeded";
isc.A.redeploymentSuccess="Redeployment of '${name}' (${type}) succeeded";
isc.A.idFormDefaults={
        _constructor:"DynamicForm",
        dataSource:"hostedDeployments",
        clipStaticValue:true,
        validateOnChange:true,
        wrapItemTitles:false,
        titleAlign:"left",
        width:"100%",
        autoFocus:true,
        numCols:4,
        handleAsyncValidationReply:function(){
            var editor=this.creator;
            editor.checkErrorStatus();
        },
        updateDeploymentURL:function(){
            var urlItem=this.getItem("deploymentURL"),
                values=this.getValues(),
                fileName=values.fileName
            ;
            if(fileName)fileName=fileName.replace(/\s/g,"_").replace(/['"`]/g,"");
            var url=isc.DeploymentEditor.getDeploymentURL(fileName,values.fileType);
            if(url)urlItem.setValue(url);
            else urlItem.clearValue();
        }
    };
isc.A.formManagerDefaults={
        _constructor:"ValuesManager",
        dataSource:"hostedDeployments"
    };
isc.A.dsImportSelectTitle="Choose DataSources to import";
isc.A.dsImportSelectInfo="Note: all DataSources will exist and have storage.  Above, you are only choosing whether the sample data you have been using should be present in the deployment.";
isc.A.dsImportSelectStackDefaults={
        _constructor:"SectionStack",
        width:"100%",height:205
    };
isc.A.dsImportSelectGridDefaults={
        _constructor:"ListGrid",
        selectionProperty:"_deploymentSelect",
        selectionAppearance:"checkbox",border:0,
        fields:[{name:"dsName",title:"DataSource Name"}],
        getExcludedDataSources:function(){
            var excluded=[];
            for(var i=0;i<this.getTotalRows();i++){
                var record=this.getRecord(i);
                if(!record._deploymentSelect)excluded.add(record.dsName);
            }
            return excluded;
        },
        setExcludedDataSources:function(excluded){
            if(!excluded)return;
            var excludedHash={};
            for(var i=0;i<excluded.length;i++){
                excludedHash[excluded[i]]=true;
            }
            for(var i=0;i<this.getTotalRows();i++){
                var record=this.getRecord(i);
                if(excludedHash[record.dsName])this.deselectRecord(record);
            }
        }
    };
isc.A.dsImportSelectInfoDefaults={
        _constructor:"Label",
        height:40,valign:"top",
        overflow:"visible"
    };
isc.A.authenticationTitle="Authentication";
isc.A.sampleUsersTitle="Users & roles you used for testing inside the Reify visual environment. "+
                        " Enter a single password for all test users below:";
isc.A.sampleUsersInfo="Note: you will be able to use the Deployment Console to add or remove users after deployment";
isc.A.passwordTitle="Password";
isc.A.passwordConfirmTitle="Password confirm";
isc.A.authShareUsersTitle="Share users with existing deployment?";
isc.A.authShareUsersHint="If users are not shared, a copy of the user database is created at deployment";
isc.A.authDeploymentTitle="Deployment";
isc.A.authDeploymentHint="[pick deployment]";
isc.A.authFormDefaults={
        _constructor:"DynamicForm",
        dataSource:"hostedDeployments",
        wrapItemTitles:false,isGroup:true,showGroupLabel:false,
        width:"100%",numCols:4,
        validateOnChange:true,
        wrapHintText:false,
        titleAlign:"left"
    };
isc.A.buttonLayoutDefaults={
        _constructor:"HLayout",
        align:"right",height:"*",
        defaultLayoutAlign:"center",
        membersMargin:10
    };
isc.A.applyButtonTitle="Apply";
isc.A.applyButtonConstructor="IButton";
isc.A.applyButtonDefaults={
        layoutAlign:"bottom",
        width:80,canHover:true,
        click:"this.creator.saveData()",
        getHoverHTML:function(){
            if(!this.disabled)return;
            var formManager=this.creator.formManager;
            if(formManager.hasErrors())return"Fix validation errors";
            var idForm=this.creator.idForm;
            if(!idForm.getValue("fileName"))return"Type a deployment name";
            var authForm=this.creator.authForm;
            return authForm.getValue("sampleUsersPassword")?
                "Enter password confirmation":"Enter a password for sample users";
        }
    };
isc.A.cancelButtonTitle="Cancel";
isc.A.cancelButtonConstructor="IButton";
isc.A.cancelButtonDefaults={
        layoutAlign:"bottom",
        click:"this.creator.close()",
        width:80
    };
isc.B.push(isc.A.initWidget=function isc_DeploymentEditor_initWidget(){
        this.Super("initWidget",arguments);
        var builder=this.creator;
        this.idForm=this.createAutoChild("idForm",{
            items:[{
                name:"fileName",type:"text",title:this.deploymentNameTitle,
                changed:function(form){form.updateDeploymentURL();}
            },{
                name:"fileType",type:"enum",title:this.deploymentTypeTitle,
                changed:function(form){form.updateDeploymentURL();}
            },{
                name:"deploymentURL",editorType:"StaticTextItem",
                cellHeight:32,shouldSaveValue:false,colSpan:3,
                title:this.deploymentURLTitle
            }]
        });
        this.dsImportSelectGrid=this.createAutoChild("dsImportSelectGrid");
        this.dsImportSelectInfo=this.createAutoChild("dsImportSelectInfo",{
            contents:this.dsImportSelectInfo
        });
        this.dsImportSelectStack=this.createAutoChild("dsImportSelectStack",{
            sections:[{title:this.dsImportSelectTitle,canCollapse:false,
                         items:[this.dsImportSelectGrid]}]
        });
        var sampleUsersCrit={
            _constructor:"AdvancedCriteria",operator:"and",
            criteria:[
                {fieldName:"authentication",operator:"equals",value:"sampleUsers"}
            ]
        };
        this.authForm=this.createAutoChild("authForm",{
            items:[{
                name:"authentication",type:"enum",title:this.authenticationTitle
            },{
                shouldSaveValue:false,editorType:"StaticTextItem",
                showTitle:false,colSpan:4,height:24,
                defaultValue:this.sampleUsersTitle,
                showIf:"values.authentication=='sampleUsers'"
            },{
                name:"sampleUsersPassword",type:"password",title:this.passwordTitle,
                changed:"form.creator.checkErrorStatus()",
                visibleWhen:sampleUsersCrit,
                validators:[{
                    type:"custom",
                    dependentFields:["sampleUsersPassword2"],
                    condition:function(item,validator,value,record){
                        var otherItem=item.form.getItem("sampleUsersPassword2"),
                            otherValue=otherItem.getValueForMatch(record);
                        return!otherValue||value==otherValue;
                    },
                    errorMessage:"Passwords do not match"
                }]
            },{
                name:"sampleUsersPassword2",type:"password",
                title:this.passwordConfirmTitle,shouldSaveValue:false,
                changed:"form.creator.checkErrorStatus()",
                visibleWhen:sampleUsersCrit,
                getValueForMatch:function(record){
                    return record.hasOwnProperty(this.name)?
                           record[this.name]:this.getValue();
                }
            },{
                shouldSaveValue:false,editorType:"StaticTextItem",
                showTitle:false,colSpan:4,height:24,
                showIf:"values.authentication=='sampleUsers'",
                defaultValue:this.sampleUsersInfo
            },{
                name:"authDeployment",editorType:"SelectItem",
                optionDataSource:builder.existingDeployments,
                defaultToFirstOption:true,startRow:true,
                showIf:"values.authentication!='sampleUsers'",
                pickListFields:[{name:"fileName"},{name:"fileType"}],
                title:this.authDeploymentTitle,valueField:"id",displayField:"id",
                hint:this.authDeploymentHint,
                formatValue:function(value){
                    var record=this.optionDataSource.getRecord(value);
                    if(record)return isc.DeploymentEditor.getDeploymentTitle(record);
                }
            },{
                name:"authShareUsers",startRow:true,
                showIf:"values.authentication!='sampleUsers'",
                showTitle:false,colSpan:4,
                title:this.authShareUsersTitle,
                hint:this.authShareUsersHint
            }]
        });
        this.buttonLayout=this.createAutoChild("buttonLayout");
        this.applyButton=this.createAutoChild("applyButton",{
            title:this.applyButtonTitle
        });
        this.cancelButton=this.createAutoChild("cancelButton",{
            title:this.cancelButtonTitle
        });
        this.buttonLayout.addMembers([this.cancelButton,this.applyButton]);
        this.addMembers([this.idForm,this.dsImportSelectStack,this.dsImportSelectInfo,
                         this.authForm,this.buttonLayout]);
        this.formManager=this.createAutoChild("formManager",{
            members:[this.idForm,this.authForm]
        });
    }
,isc.A.checkErrorStatus=function isc_DeploymentEditor_checkErrorStatus(){
        var manager=this.formManager,
            nameItem=this.idForm.getItem("fileName");
        this.applyButton.setDisabled(
            manager.hasErrors()||
            !nameItem.getValue()||
            (!this.authForm.isDisabled()&&(!this.authForm.getValue("sampleUsersPassword")||
                                             !this.authForm.getValue("sampleUsersPassword2")))
        );
    }
,isc.A.updateData=function isc_DeploymentEditor_updateData(){
        this.formManager.clearErrors();
        var builder=this.creator;
        this.dsImportSelectGrid.setData(builder.project.datasources);
        this.dsImportSelectGrid.selectAllRecords();
    }
,isc.A.editNewRecord=function isc_DeploymentEditor_editNewRecord(){
        this.formManager.editNewRecord();
        this.applyButton.setDisabled(true);
        this.idForm.setDisabled(false);
        this.authForm.setDisabled(false);
    }
,isc.A.editRecord=function isc_DeploymentEditor_editRecord(record){
        this.formManager.editRecord(record);
        this.idForm.updateDeploymentURL();
        this.applyButton.setDisabled(false);
        this.idForm.setDisabled(true);
        this.authForm.setDisabled(true);
        this.dsImportSelectGrid.setExcludedDataSources(record.excludedImports);
    }
,isc.A.saveData=function isc_DeploymentEditor_saveData(){
        var builder=this.creator,
            project=builder.project,
            manager=this.formManager
        ;
        manager.setValue("fileFormat","xml");
        manager.setValue("fileLastModified",new Date());
        manager.setValue("sourceProjectId",project.projectId||project._projectID);
        manager.setValue("sourceProjectName",builder.getProjectFileName());
        manager.setValue("fileContents",project.xmlSerialize());
        manager.setValue("excludedImports",this.dsImportSelectGrid.getExcludedDataSources());
        var mockDataSources=[];
        var gridData=this.dsImportSelectGrid.getData();
        for(var i=0;i<gridData.getLength();i++){
            var dsRow=gridData.get(i),
                dsName=dsRow.dsName,
                dsType=dsRow.dsType||builder.getDataSourceType(dsName);
            if(dsType=="MockDataSource")mockDataSources.add(dsName);
        }
        var _this=this,
            isNew=manager.saveOperationType=="add";
        var completeSaveData=function(){
            _this.formManager.saveData(function(dsResponse,data,dsRequest){
                if(data!=null){
                    delete data.fileContents;
                    var ds=builder.existingDeployments;
                    ds.updateCacheFromServer(dsResponse,data);
                    var successText=isNew?_this.newDeploymentSuccess:
                                              _this.redeploymentSuccess;
                    isc.Notify.addMessage(successText.evalDynamicString(_this,{
                        name:manager.getValue("fileName"),
                        type:manager.getValue("fileType")
                    }));
                }
                _this.formManager.clearValue("isc_mockDSConfig");
            },{
                promptStyle:"dialog",
                prompt:"Deploying project... ${loadingImage}"
            });
            _this.close();
        };
        if(mockDataSources.length!=0){
            var mockDSConfig={};
            for(var i=0;i<mockDataSources.length;i++){
                var dsName=mockDataSources[i];
                var ds=isc.DataSource.get(dsName);
                if(ds==null){
                    this.logWarn("MockDataSource "+dsName+" was not found");
                    continue;
                }
                if(ds.hasExplicitFields())continue;
                var fields=isc.clone(ds._baseFields),
                    testData=ds.testData||[];
                mockDSConfig[dsName]={
                    ID:dsName,
                    fields:fields,
                    testData:testData
                };
            }
            this.formManager.setValue("isc_mockDSConfig",mockDSConfig);
        }
        completeSaveData();
    }
,isc.A.close=function isc_DeploymentEditor_close(){
        var builder=this.creator;
        builder.deploymentWindow.close();
    }
);
isc.B._maxIndex=isc.C+7;

isc.A=isc.DeploymentEditor;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getDeploymentURL=function isc_c_DeploymentEditor_getDeploymentURL(fileName,fileType){
        if(!fileName||!fileType)return null;
        var url=(location.origin+"").replace("create",
                      fileType=="production"?"app":fileType)+"/";
        return url+window.user.orgUrlFragment+"/"+fileName+"/";
    }
,isc.A.getDeploymentTitle=function isc_c_DeploymentEditor_getDeploymentTitle(record){
        return record.fileName+" <I>("+record.fileType+")</i>";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("DeploymentManagerLauncher","VLayout");
isc.A=isc.DeploymentManagerLauncher.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.deploymentGridConstructor="ListGrid";
isc.A.deploymentGridDefaults={
        autoFetchData:true,
        selectionType:"single",
        leaveScrollbarGap:false,
        sortField:"fileLastModified",
        sortDirection:"descending",
        defaultFields:[{
            name:"fileName"
        },{
            name:"fileType",width:70
        },{
            name:"fileLastModified",hidden:true
        }],
        redeployFieldDefaults:{
            name:"redeploy",type:"icon",
            width:40,showHover:true,
            cellIcon:"actions/deploy.png",
            cellPrompt:"Redeploy",
            recordClick:function(viewer,record){
                var builder=viewer.creator.creator;
                builder.showDeploymentWindow(record);
            }
        },
        visitFieldDefaults:{
            name:"visit",type:"icon",
            width:40,showHover:true,
            cellIcon:"actions/exportProject.png",
            cellPrompt:"Visit deployment",
            recordClick:function(viewer,record){
                window.open(isc.DeploymentEditor.getDeploymentURL(record.fileName,
                                                                  record.fileType));
            }
        },
        initWidget:function(a,b,c){
            if(!this.fields)this.fields=isc.shallowClone(this.defaultFields);
            if(this.showRedeployField!=false){
                this.fields.add(isc.addProperties({},this.redeployFieldDefaults,
                                                  this.redeployFieldProperties));
            }
            if(this.showVisitField!=false){
                this.fields.add(isc.addProperties({},this.visitFieldDefaults,
                                                  this.visitFieldProperties));
            }
            this.invokeSuper(null,"initWidget",a,b,c);
        },
        recordDoubleClick:function(viewer,record){
            this.creator.manage();
        },
        selectionUpdated:function(record){
            this.creator.manageButton.setDisabled(!record);
        }
    };
isc.A.buttonLayoutDefaults={
        _constructor:"HLayout",
        defaultLayoutAlign:"center",
        membersMargin:10,height:1,
        overflow:"visible",
        align:"right"
    };
isc.A.manageButtonTitle="Manage";
isc.A.manageButtonConstructor="IButton";
isc.A.manageButtonDefaults={
        click:"this.creator.manage()",
        width:80
    };
isc.A.cancelButtonTitle="Cancel";
isc.A.cancelButtonConstructor="IButton";
isc.A.cancelButtonDefaults={
        layoutAlign:"bottom",
        click:"this.creator.close()",
        width:80
    };
isc.B.push(isc.A.initWidget=function isc_DeploymentManagerLauncher_initWidget(){
        this.Super("initWidget",arguments);
        var builder=this.creator;
        this.deploymentGrid=this.createAutoChild("deploymentGrid",{
            dataSource:builder.existingDeployments
        });
        this.buttonLayout=this.createAutoChild("buttonLayout");
        this.manageButton=this.createAutoChild("manageButton",{
            title:this.manageButtonTitle
        });
        this.cancelButton=this.createAutoChild("cancelButton",{
            title:this.cancelButtonTitle
        });
        this.buttonLayout.addMembers([this.cancelButton,this.manageButton]);
        this.addMembers([this.deploymentGrid,this.buttonLayout]);
    }
,isc.A.updateData=function isc_DeploymentManagerLauncher_updateData(){
        this.deploymentGrid.deselectAllRecords();
    }
,isc.A.manage=function isc_DeploymentManagerLauncher_manage(record){
        if(!record)record=this.deploymentGrid.getSelectedRecord();
        if(!record)return;
        this.creator.manageDeployment(record);
        this.close();
    }
,isc.A.close=function isc_DeploymentManagerLauncher_close(){
        var builder=this.creator;
        builder.deploymentsWindow.close();
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("UpdateAccountEditor","DynamicForm");
isc.A=isc.UpdateAccountEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.numCols=4;
isc.A.autoFocus=true;
isc.A.saveOnEnter=true;
isc.A.colWidths=[80,"*",170,"*"];
isc.A.fetchOperation="authedUserOnly";
isc.A.updateOperation="authedUserOnly";
isc.A.dataSource="registeredDevelopers";
isc.A.formTitle="To update your profile, simply change any applicable fields and click "+
        "'Save Changes'.  (To update your username, please contact Isomorphic support.)";
isc.A.readOnlyOrgText="Only the owner can rename your organization";
isc.A.defaultItems=[{
        name:"help",colSpan:4,showTitle:false,vAlign:"top",
        editorType:"StaticTextItem",canSave:false,height:20,
        getDefaultValue:function(){
            return this.form.formTitle;
        }
    },
    {name:"email",width:"*",endRow:true,canEdit:true},
    {name:"firstname",width:"*"},
    {name:"lastname",width:"*"},
    {name:"phone",width:"*"},
    {name:"organization",width:"*",canEdit:true,
     itemHoverHTML:function(item,form){
         if(item.disabled)return form.readOnlyOrgText;
     }
    },
    {name:"title",width:"*"},
    {name:"url",width:"*"},
    {
        name:"password",title:"Password",type:"password",
        width:"*",startRow:true,validators:[
            {type:"matchesField",otherField:"password2",
             errorMessage:"Passwords don't match"},
            {type:"lengthRange",max:32}
        ]
    },{
        name:"password2",title:"Password again",type:"password",
        width:"*",validators:[
            {type:"matchesField",otherField:"password",
             errorMessage:"Passwords don't match"},
            {type:"lengthRange",max:32}
        ]
    },
    {editorType:"SpacerItem"},{editorType:"SpacerItem"},{editorType:"SpacerItem"},
    {
        name:"save",title:"Save Changes",editorType:"ButtonItem",
        startRow:false,align:"right",
        click:function(form,item){
            var window=form.creator.updateAccountWindow;
            form.saveData(function(){
                isc.notify("Account details updated");
                window.hide();
            });
        }
    }];
isc.B.push(isc.A.refreshData=function isc_UpdateAccountEditor_refreshData(){
        this.fetchData(null,"this.updateState()");
    }
,isc.A.updateState=function isc_UpdateAccountEditor_updateState(){
        var userId=this.getValue("userid"),
            ownerId=this.getValue("ownerId"),
            orgItem=this.getItem("organization");
        orgItem.setDisabled(ownerId!=null&&ownerId!=userId);
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ManageUsersPanel","VLayout");
isc.A=isc.ManageUsersPanel.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.membersMargin=5;
isc.A.layoutMargin=5;
isc.A.inviteTitle="Send an Invitation";
isc.A.inviteMessage="Enter an email to invite";
isc.A.reinviteMessage="Click to re-send invitation";
isc.A.invitedMessage="Successfully sent an invite to ${email}";
isc.A.emailYourselfMessage="${email} is your own email!";
isc.A.alreadyMemberMessage="${email} is already a member of Isomorphic Software";
isc.A.usersGridDefaults={
        _constructor:"ListGrid",
        canRemoveRecords:true,
        dataSource:"managedUsers",
        showClippedValuesOnHover:true,
        dataFetchMode:"local",
        emptyMessage:"Click \"Invite\" to add people to your organization",
        initialSort:[{property:"lastname",direction:"ascending"},
                      {property:"firstname",direction:"ascending"},
                      {property:"email",direction:"ascending"}],
        defaultFields:[{
            name:"firstname",hidden:true,
            sortNormalizer:function(record){
                return!record.firstname?"\uFFFF":record.firstname;
            }
        },{
            name:"lastname",hidden:true,
            sortNormalizer:function(record){
                return!record.lastname?"\uFFFF":record.lastname;
            }
        },{
            name:"person",title:"Person",
            sortNormalizer:function(record){
                return record.username?
                    record.firstname+" "+record.lastname+" ("+record.email+")":
                    record.email;
            },
            formatCellValue:function(value,record){
                return record.username?
                    record.firstname+" "+record.lastname+" ("+record.email+")":
                    record.email;
            }
        },{
            name:"orgRole",title:"Status",width:80,showHover:true,
            hoverHTML:function(record,value,rowNum,colNum,grid){
                return value=="Invited"?grid.creator.reinviteMessage:null;
            },
            recordClick:function(viewer,record,recordNum,field,fieldNum,value){
                if(value=="Invited")viewer.sendInvite(record.email);
            }
        },{
            name:"_canRemove",hidden:true,canHide:false,
            userFormula:{text:"record.orgRole != 'Inactive'"}
        }],
        sendInvite:function(email){
            if(!email)return;
            var panel=this.creator,
                builder=panel.creator;
            if(email==builder.email){
                isc.notify(panel.emailYourselfMessage.evalDynamicString(this,
                    {email:email}),null,null,{messagePriority:isc.Notify.WARN});
                return;
            }
            var record=this.find({email:email}),
                organization=builder.organization;
            if(record&&record.orgRole=="Member"){
                isc.notify(panel.alreadyMemberMessage.evalDynamicString(this,
                               {email:email,organization:organization}),
                           null,null,{messagePriority:isc.Notify.WARN});
                return;
            }
            var grid=this,
                callback=function(response,data,request){
                    if(response.status<0){
                        builder.logWarn("failed to invite "+email+" to "+organization);
                        var errors=isc.DS.getSimpleErrors(response)||{};
                        if(errors.email){
                            isc.notify(errors.email,null,null,{
                                messagePriority:isc.Notify.WARN,autoFitMaxWidth:400,
                                canDismiss:true,duration:0});
                        }else isc.RPCManager.runDefaultErrorHandling(response,request);
                        return;
                    }
                    isc.notify(panel.invitedMessage.evalDynamicString(grid,{email:email}));
            };
            if(record){
                this.updateData({userid:record.userid,orgRole:"Invited"},callback,
                                {oldValues:record,willHandleError:true});
            }else{
                this.addData({orgRole:"Invited",email:email},callback,
                             {willHandleError:true});
            }
        },
        removeRecord:function(rowNum,record){
            var key=record.userid;
            switch(record.orgRole){
            case"Invited":
                if(key<0){
                    this.Super("removeRecord",arguments);
                    return;
                }
            case"Member":
                this.updateData({userid:key,orgRole:"Inactive"},null,{oldValues:record});
                break;
            }
        },
        initWidget:function(){
            this.Super("initWidget",arguments);
            this._initialState=this.getViewState();
        },
        refresh:function(){
            this.invalidateCache();
            this.setViewState(this._initialState);
        }
    };
isc.A.emailFormDefaults={
        _constructor:"DynamicForm",
        numCols:1,padding:3,
        saveOnEnter:true,
        items:[
            {name:"message",type:"blurb"},
            {name:"value",showTitle:false,width:"*",
              validators:[{
                  type:"regexp",
                  errorMessage:"Please enter a valid email address",
                  expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$"
              }]
            }
        ],
        submit:function(){
            this.creator.emailDialog.okClick();
        },
        clearEmail:function(){
            this.clearErrors();
            this.clearValue("value");
            this.focusInItem("value");
        },
        initWidget:function(){
            this.Super("initWidget",arguments);
            this.setValues({
                message:this.creator.inviteMessage
            });
        }
    };
isc.A.emailDialogDefaults={
        _constructor:"Dialog",
        width:300,isModal:true,
        canDragReposition:true,
        placement:"none",
        overflow:"visible",
        ariaRole:"alertdialog",
        bodyProperties:{overflow:"visible"},
        buttons:[isc.Dialog.OK,isc.Dialog.CANCEL],
        okClick:function(){
            if(!this.askForm.validate())return;
            var value=this.askForm.getValue("value");
            if(value)this.returnValue(value);
            else this.close();
        },
        show:function(){
            this.askForm.clearEmail();
            this.Super("show",arguments);
        }
    };
isc.A.inviteButtonDefaults={
        _constructor:"Button",
        layoutAlign:"right",
        title:"Invite...",
        click:function(){
            var creator=this.creator;
            creator.emailDialog.show();
        }
    };
isc.B.push(isc.A.initWidget=function isc_ManageUsersPanel_initWidget(){
        this.Super("initWidget",arguments);
        this.addAutoChild("usersGrid");
        this.addAutoChild("inviteButton");
        var emailForm=this.createAutoChild("emailForm");
        this.emailDialog=this.createAutoChild("emailDialog",{
            items:[emailForm],
            askForm:emailForm,
            title:this.inviteTitle,
            callback:{target:this.usersGrid,methodName:"sendInvite"}
        });
        this.usersGrid.fetchData();
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("ActionMenu","Menu");
isc.A=isc.ActionMenu.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.isForMultiActionPanel=false;
isc.A.titleFieldProperties={
        showHover:true,
        hoverHTML:"return record.prompt",
        hoverWrap:false,
        hoverAutoFitWidth:false,
        hoverStyle:"darkHover"
    };
isc.A._basicTypes=["string","number","boolean","object","array"];
isc.B.push(isc.A.initWidget=function isc_ActionMenu_initWidget(){
        this.setComponents(this.components);
        this.Super("initWidget",arguments);
    }
,isc.A.draw=function isc_ActionMenu_draw(){
        if(!this._origSelectedState){
            this._origSelectedState=isc.SelectionOutline.getSelectedState();
            isc.SelectionOutline.deselect();
        }
        return this.Super("draw",arguments);
    }
,isc.A.hide=function isc_ActionMenu_hide(){
        if(this._origSelectedState){
            isc.SelectionOutline.setSelectedState(this._origSelectedState);
            delete this._origSelectedState;
        }
        return this.Super("hide",arguments);
    }
,isc.A.setComponents=function isc_ActionMenu_setComponents(components){
        var items=[];
        if(!components)components=[];
        for(var i=0;i<components.length;i++){
            var component=components[i];
            if(!component.ID)continue;
            var item={
                    component:component,
                    icon:component.icon,
                    title:component.liveObject.getActionTargetTitle
                                        ?component.liveObject.getActionTargetTitle()
                                        :component.ID+" ("+component.type+")"
                };
            var actions;
            if(isc.isA.ClassObject(component.liveObject)){
                actions=component.liveObject.getClassActions(this.sourceComponent.liveObject);
            }else{
                actions=isc.jsdoc.getActions(component.type);
            }
            if(actions){
                item.submenu=this.getActionsMenu(component,actions);
                items.add(item);
            }
        }
        if(!this.isForMultiActionPanel){
            items.add({
                title:"[None]",
                icon:"[SKINIMG]/actions/close.png",
                click:function(target,item,actionMenu){
                    actionMenu.clearAction();
                }
            });
            items.add({
                isSeparator:true
            });
            items.add({
                title:"Multiple Actions&hellip;",
                icon:"actions/addMultipleActions.png",
                click:function(target,item,actionMenu){
                    var editAction=function(){
                        actionMenu.builder.showMultiActionWindow(actionMenu);
                    };
                    var editWorkflow=function(){
                    };
                    actionMenu.confirmOverwriteWorkflow(editAction,editWorkflow);
                }
            });
        }
        this.setData(items);
    }
,isc.A.rowOver=function isc_ActionMenu_rowOver(record){
        this.Super("rowOver",arguments);
        var component=record.component;
        if(component&&component.liveObject)isc.SelectionOutline.select(component.liveObject);
        else isc.SelectionOutline.deselect();
        this.bringToFront();
    }
,isc.A.getActionsMenu=function isc_ActionMenu_getActionsMenu(component,actions){
        var actionMenu=this,
            items=[];
        for(var i=0;i<actions.length;i++){
            var action=actions[i],
                item={
                    title:action.title?action.title:isc.DataSource.getAutoTitle(action.name),
                    icon:action.icon,
                    component:component,
                    targetAction:action,
                    click:function(target,item,menu){
                        var editAction=function(){
                            actionMenu.bindAction(item.component,item.targetAction);
                        };
                        var editWorkflow=function(){
                        };
                        actionMenu.confirmOverwriteWorkflow(editAction,editWorkflow);
                    }
                };
            items.add(item);
        }
        return items;
    }
,isc.A.getInheritedMethod=function isc_ActionMenu_getInheritedMethod(type,methodName){
        while(type){
            var docItem=isc.jsdoc.getDocItem("method:"+type+"."+methodName);
            if(docItem!=null)return docItem;
            var ds=isc.DS.get(type);
            if(ds&&ds.methods){
                var method=ds.methods.find("name",methodName);
                if(method)return method;
            }
            var clazz=isc.ClassFactory.getClass(type);
            if(clazz==null)return null;
            clazz=clazz.getSuperClass();
            if(clazz==null)return null;
            type=clazz.getClassName();
        }
    }
,isc.A.bindAction=function isc_ActionMenu_bindAction(component,actionMethod){
        var sourceComponent=this.sourceComponent,
            sourceMethodDoc=this.getInheritedMethod(sourceComponent.type,this.sourceMethod),
            sourceMethod=isc.isAn.XMLNode(sourceMethodDoc)?isc.jsdoc.toJS(sourceMethodDoc):sourceMethodDoc;
        if(this.logIsDebugEnabled("actionBinding")){
            this.logDebug("bindAction: component "+component.ID+
                          ", sourceMethod: "+this.echoFull(sourceMethod)+
                          ", action method: "+this.echoFull(actionMethod),
                          "actionBinding");
        }
        var binding={
            target:component.ID,
            name:actionMethod.name
        };
        if(isc.isA.ClassObject(component.liveObject)){
            binding.type="static";
        }
        var sourceParams;
        if(actionMethod.params){
            var mapping=[],
                foundMatchingParams=false;
            sourceParams=sourceMethod.params;
            if(!sourceParams)sourceParams=[];
            else if(!isc.isAn.Array(sourceParams))sourceParams=[sourceParams];
            else sourceParams=sourceParams.duplicate();
            sourceParams.add({
                name:"this",
                type:this.sourceComponent.type,
                pseudo:true
            });
            for(var i=0;i<actionMethod.params.length;i++){
                var actionParam=actionMethod.params[i];
                this.logInfo("considering actionMethod "+actionMethod.name+" param: "+
                              actionParam.name+" of type "+actionParam.type,
                             "actionBinding");
                var actionParamIsOptional=
                        actionParam.optional!=null&&actionParam.optional.toString()!="false"
                ;
                if(!actionParamIsOptional||actionParam.type!=null&&
                    !this._basicTypes.contains(actionParam.type.toLowerCase()))
                {
                    var sourceParam=this.getMatchingSourceParam(actionParam,sourceParams);
                    if(sourceParam!=null){
                        if(!actionParamIsOptional||!sourceParam.pseudo){
                            mapping[i]=sourceParam.name;
                            sourceParam._used=true;
                            foundMatchingParams=true;
                            continue;
                        }
                    }else if(!actionParamIsOptional){
                        this.logInfo("action binding failed, actionMethod param "+
                                      actionParam.name+" of type "+actionParam.type+
                                     " couldn't be fulfilled",
                                     "actionBinding");
                        isc.say("An automatic binding could not be found from event "+
                                sourceMethod.name+
                                " to action "+(actionMethod.title||actionMethod.name));
                        return null;
                    }
                }
                mapping[i]="null";
            }
            if(foundMatchingParams)binding.mapping=mapping;
        }
        if(this.logIsInfoEnabled("actionBinding")){
            this.logWarn("generated binding: "+this.echoFull(binding),"actionBinding");
        }
        if(sourceParams)sourceParams.setProperty("_used",null);
        this.bindingComplete(binding);
    }
,isc.A.bindingComplete=function isc_ActionMenu_bindingComplete(bindings){
    }
,isc.A.clearAction=function isc_ActionMenu_clearAction(){
        var binding=null;
        this.bindingComplete(binding);
    }
,isc.A.getMatchingSourceParam=function isc_ActionMenu_getMatchingSourceParam(actionParam,sourceParams){
        var actionParamTypes=this.getActionTypes(actionParam.type);
        for(var j=0;j<actionParamTypes.length;j++){
            var actionParamType=actionParamTypes[j],
                actionParamDS=isc.DS.get(actionParamType)
            ;
            this.logInfo("selected type "+actionParamType+
                        " has schema: "+actionParamDS,"actionBinding");
            for(var i=0;i<sourceParams.length;i++){
                var sourceParam=sourceParams[i];
                if(sourceParam._used)continue;
                this.logDebug("considering source param: "+sourceParam.name+
                            " of type "+sourceParam.type,
                            "actionBinding");
                var sourceParamType=this.getActionTypes(sourceParam.type)[0];
                var sourceParamDS=isc.DS.get(sourceParamType);
                if(!sourceParamDS){
                    if(actionParamType==sourceParamType)return sourceParam;
                    continue;
                }
                if(sourceParamDS.inheritsSchema(actionParamDS)){
                    return sourceParam;
                }
            }
        }
    }
,isc.A.getActionTypes=function isc_ActionMenu_getActionTypes(type){
        var types=type.split(/[ \t]*[|]+[ \t]*/);
        for(var i=0;i<types.length;i++){
            var type=types[i];
            type=type.split(/[ \t]+/)[0];
            type=type.substring(0,1).toUpperCase()+type.substring(1);
            types[i]=type;
        }
        return types;
    }
,isc.A.isWorkflowAction=function isc_ActionMenu_isWorkflowAction(){
        var currentStringMethods=this.currentStringMethods;
        if(currentStringMethods==null)currentStringMethods=[];
        var numStringMethods=currentStringMethods.length;
        if(numStringMethods>0){
            for(var i=0;i<numStringMethods;++i){
                var val=currentStringMethods[i].getValue();
                if(isc.isAn.Object(val)&&val._constructor=="Process"){
                    return true;
                }
            }
        }
        return false;
    }
,isc.A.confirmOverwriteWorkflow=function isc_ActionMenu_confirmOverwriteWorkflow(editAction,editWorkflow){
        if(!this.isWorkflowAction()){
            editAction();
            return;
        }
        var actionMenu=this;
        isc.warn("This will delete an existing workflow.",function(){},{
            buttons:[
                isc.Button.create({
                    title:"Delete Workflow",
                    click:function(){
                        this.topElement.hide();
                        actionMenu.currentStringMethods=null;
                        editAction();
                    }
                }),
                isc.Button.create({
                    title:"Edit Workflow",
                    click:function(){
                        this.topElement.hide();
                        editWorkflow();
                    }
                }),
                isc.Button.create({
                    title:"Cancel",
                    click:function(){
                        this.topElement.hide();
                    }
                })
            ]
        });
    }
);
isc.B._maxIndex=isc.C+14;

isc.defineClass("GridSearch","DynamicForm");
isc.A=isc.GridSearch.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.browserSpellCheck=false;
isc.A.height=20;
isc.A.numCols=2;
isc.A.cellPadding=0;
isc.A.colWidths=[46,200];
isc.A.titleSuffix=":&nbsp;";
isc.A.showSearchTitle=false;
isc.A.wrapItemTitles=false;
isc.A.selectOnFocus=true;
isc.A.hint="Find...";
isc.A.searchTitle="<span style='color:#FFFFFF'>Search</span>";
isc.B.push(isc.A.initWidget=function isc_GridSearch_initWidget(){
        this.items=[isc.addProperties(
            {name:"search",width:"*",colSpan:"*",showTitle:this.showSearchTitle,
             editorType:"TTextItem",
             selectOnFocus:true,
             title:this.searchTitle,showHintInField:true,hint:this.hint,
             changed:"form.findNode()",
             keyPress:function(item,form,keyName){
                 if(keyName=="Enter"){
                     form.findNode();
                     return false;
                 }
                 if(keyName=="Escape"){
                     form.revertState();
                     return false;
                 }
             }},this.searchItemProperties)
        ];
        this.Super("initWidget",arguments);
        if(this.grid)this.setGrid(this.grid);
    }
,isc.A.setGrid=function isc_GridSearch_setGrid(grid){
        this.grid=grid;
        this.defaultSearchProperty();
        var searchField=grid.getField(this.searchProperty);
        if(searchField&&searchField.formatCellValue){
            if(searchField._formatCellValueMovedBySearchGrid)searchField.formatCellValue=searchField._formatCellValueMovedBySearchGrid;
            searchField._formatCellValueMovedBySearchGrid=searchField.formatCellValue;
            searchField.formatCellValue=function(value,record,rowNum,colNum,grid){
                if(searchField._formatCellValueMovedBySearchGrid){
                    value=searchField._formatCellValueMovedBySearchGrid(value,record,rowNum,colNum,grid);
                }
                if(value!=null&&record._searchHit){
                    var newValue,searchRe;
                    if(value.match(/<.*>/)){
                        searchRe=new RegExp("(^|>)([^<]*?)("+record._searchHit+")","ig");
                        newValue=value.replace(searchRe,"$1$2<span style='background-color:#FF0000;'>$3</span>");
                    }else{
                        searchRe=new RegExp("("+record._searchHit+")","ig");
                        newValue=value.replace(searchRe,"<span style='background-color:#FF0000;'>$1</span>");
                    }
                    value=newValue;
                }
                return value;
            };
        }else{
            if(isc.isA.TreeGrid(grid)){
                if(grid._getNodeTitleMovedBySearchGrid)grid.getNodeTitle=grid._getNodeTitleMovedBySearchGrid;
                grid._getNodeTitleMovedBySearchGrid=grid.getNodeTitle;
                grid.getNodeTitle=function(record,recordNum,field){
                    var value=grid._getNodeTitleMovedBySearchGrid(record,recordNum,field);
                    if(record._searchHit){
                        var newValue,searchRe;
                        if(value.match(/<.*>/)){
                            searchRe=new RegExp("(^|>)([^<]*?)("+record._searchHit+")","ig");
                            newValue=value.replace(searchRe,"$1$2<span style='background-color:#FF0000;'>$3</span>");
                        }else{
                            searchRe=new RegExp("("+record._searchHit+")","ig");
                            newValue=value.replace(searchRe,"<span style='background-color:#FF0000;'>$1</span>");
                        }
                        value=newValue;
                    }
                    return value;
                };
            }else{
                if(grid._formatCellValueMovedBySearchGrid)grid.formatCellValue=grid._formatCellValueMovedBySearchGrid;
                grid._formatCellValueMovedBySearchGrid=grid.formatCellValue;
                grid.formatCellValue=function(value,record,rowNum,colNum){
                    if(grid._formatCellValueMovedBySearchGrid){
                        value=grid._formatCellValueMovedBySearchGrid(value,record,rowNum,colNum);
                    }
                    if(value!=null&&record._searchHit){
                        var newValue,searchRe;
                        if(value.match(/<.*>/)){
                            searchRe=new RegExp("(^|>)([^<]*?)("+record._searchHit+")","ig");
                            newValue=value.replace(searchRe,"$1$2<span style='background-color:#FF0000;'>$3</span>");
                        }else{
                            searchRe=new RegExp("("+record._searchHit+")","ig");
                            newValue=value.replace(searchRe,"<span style='background-color:#FF0000;'>$1</span>");
                        }
                        value=newValue;
                    }
                    return value;
                };
            }
        }
    }
,isc.A.defaultSearchProperty=function isc_GridSearch_defaultSearchProperty(){
        if(!this.searchProperty&&this.grid){
            if(isc.isA.TreeGrid(this.grid)){
                this.searchProperty=this.grid.getTitleField();
            }else{
                this.searchProperty=this.grid.getFieldName(0);
            }
        }
    }
,isc.A.revertState=function isc_GridSearch_revertState(){
        var grid=this.grid;
        if(this._lastMatch){
            delete this._lastMatch._searchHit;
            grid.refreshRow(grid.getRecordIndex(this._lastMatch));
        }
        this._lastValue=this._lastMatch=null;
        if(this._lastOpenedFolders){
            for(var i=0;i<this._lastOpenedFolders.length;i++)grid.data.closeFolder(this._lastOpenedFolders[i]);
        }
        this._lastOpenedFolders=null;
        this.clearValue("search");
    }
,isc.A.findNode=function isc_GridSearch_findNode(){
        if(!this.grid||!this.grid.getData())return;
        var search=this.getValue("search");
        if(search==null){
            this.revertState();
            return;
        }
        search=search.toLowerCase();
        var findNext=this._lastValue==search&&this._lastMatch;
        this._lastValue=search;
        var grid=this.grid;
        var des=isc.isA.TreeGrid(grid)?grid.data.getAllNodes():grid.getData();
        var startIndex=this._lastMatch?des.indexOf(this._lastMatch):0;
        if(findNext)startIndex++;
        if(this._lastMatch){
            delete this._lastMatch._searchHit;
            grid.refreshRow(grid.getRecordIndex(this._lastMatch));
            this._lastMatch=null;
        }
        var match=this.findNext(des,startIndex,search);
        if(!match)match=this.findNext(des,0,search);
        if(match){
            this._lastMatch=match;
            match._searchHit=search;
            if(this._lastOpenedFolders){
                for(var i=0;i<this._lastOpenedFolders.length;i++)grid.data.closeFolder(this._lastOpenedFolders[i]);
            }
            this._lastOpenedFolders=null;
            if(isc.isA.TreeGrid(grid)){
                var parents=grid.data.getParents(match);
                this._lastOpenedFolders=[];
                for(var i=0;i<parents.length;i++){
                    var parent=parents[i];
                    if(!grid.data.isOpen(parent)){
                        this._lastOpenedFolders.add(parent);
                        grid.data.openFolder(parent);
                    }
                }
                if(grid.data.isFolder(match)&&!grid.data.isOpen(match)){
                    grid.data.openFolder(match);
                    this._lastOpenedFolders.add(match);
                }
            }
            var recordIndex=grid.getRecordIndex(match);
            grid.refreshRow(recordIndex);
            grid.scrollRecordIntoView(recordIndex);
        }
    }
,isc.A.findNext=function isc_GridSearch_findNext(des,startIndex,search){
        for(var i=startIndex;i<des.getLength();i++){
            var node=des.get(i);
            if(node[this.searchProperty]&&node[this.searchProperty].toLowerCase().contains(search)){
                return node;
            }
        }
    }
);
isc.B._maxIndex=isc.C+6;

isc.ClassFactory.defineClass("ConfirmDeleteProjectDialog",isc.Dialog);
isc.A=isc.ConfirmDeleteProjectDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.canDeleteDataSources=true;
isc.A.width=360;
isc.A.height=138;
isc.A.isModal=true;
isc.A.canDragReposition=true;
isc.A.keepInParentRect=true;
isc.A.placement="none";
isc.A.autoDraw=false;
isc.A.autoSize=true;
isc.A.autoCenter=true;
isc.A.title=isc.Dialog.CONFIRM_TITLE;
isc.A.autoFocusButton=1;
isc.A.warningMessage="Delete project '\${projectName}' from server? This operation cannot be undone.";
isc.A.confirmationFormDefaults={
        _constructor:"DynamicForm",
        autoDraw:false,
        width:"100%",
        numCols:2
    };
isc.B.push(isc.A.initWidget=function isc_ConfirmDeleteProjectDialog_initWidget(){
        this.icon=this.confirmIcon;
        this.message=this.warningMessage.evalDynamicString(this,{projectName:this.projectName});
        this.Super("initWidget",arguments);
    }
,isc.A.createChildren=function isc_ConfirmDeleteProjectDialog_createChildren(){
        this.Super("createChildren",arguments);
        var dsMessage=(this.canDeleteDataSources?" and DataSources":"");
        var fields=[
            {name:"deleteAllResources",type:"boolean",title:"Also remove all Screens"+dsMessage+" that are part of the project",
                changed:function(form,item,value){
                    if(value){
                        var message="Permanently remove all Screens"+dsMessage+" for this project? "+
                            "This operation cannot be undone. Other projects that use the same Screens "+
                            dsMessage+" will also lose access to them.";
                        isc.confirm(message,function(response){
                            if(!response)item.delayCall("setValue",[false]);
                        },{
                            buttons:[isc.Dialog.CANCEL,isc.Dialog.OK],
                            autoFocusButton:1
                        });
                    }
                }
            }
        ];
        this.confirmationForm=this.createAutoChild("confirmationForm",{fields:fields});
        this.addItem(this.confirmationForm,1);
    }
,isc.A.saveData=function isc_ConfirmDeleteProjectDialog_saveData(){
        this.deleteAllResources=this.confirmationForm.getValue("deleteAllResources");
    }
);
isc.B._maxIndex=isc.C+3;

isc.ClassFactory.defineClass("ConfirmOnceDialog",isc.Dialog);
isc.A=isc.ConfirmOnceDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=360;
isc.A.height=138;
isc.A.isModal=true;
isc.A.canDragReposition=true;
isc.A.keepInParentRect=true;
isc.A.placement="none";
isc.A.autoDraw=false;
isc.A.autoSize=true;
isc.A.autoCenter=true;
isc.A.title=isc.Dialog.CONFIRM_TITLE;
isc.A.autoFocusButton=1;
isc.A.confirmationFormDefaults={
        _constructor:"DynamicForm",
        autoDraw:false,
        width:"100%",
        numCols:1,
        colWidths:["*"],
        cellPadding:0
    };
isc.B.push(isc.A.initWidget=function isc_ConfirmOnceDialog_initWidget(){
        if(this.icon)this.icon=this.warnIcon;
        this.Super("initWidget",arguments);
    }
,isc.A.show=function isc_ConfirmOnceDialog_show(){
        this.Super("show",arguments);
        if(this.toolbar!=null&&this.autoFocus){
            var button=this._getAutoFocusButton();
           if(button)button.focus();
        }
    }
,isc.A.createChildren=function isc_ConfirmOnceDialog_createChildren(){
        this.Super("createChildren",arguments);
        var builder=this.builder,
            dialogId=this.dialogId
        ;
        var fields=[
            {name:"dontShowAgain",type:"boolean",title:"Don't show this message again",
                showTitle:false,
                changed:function(form,item,value){
                    builder.setHelpDialogEnabled(dialogId,!value);
                },
                showIf:function(){
                    return!builder.hostedmode||!builder.userIsGuest();
                }
            }
        ];
        this.confirmationForm=this.createAutoChild("confirmationForm",{fields:fields});
        this.confirmationStack=this.createAutoChild("messageStack",null,isc.HLayout);
        var iconWidth=this.iconWidth||this.messageIconDefaults.width;
        this.confirmationStack.addMembers([isc.LayoutSpacer.create({width:iconWidth}),this.confirmationForm]);
        this.addItem(this.confirmationStack,1);
    }
);
isc.B._maxIndex=isc.C+3;

isc.Notify.configureDefaultSettings({
    position:"T",
    duration:3000,
    autoFitMaxWidth:340,
    actionSeparator:"<br> ",
    styleName:"vbNotification",
    repositionMethod:"instant",
    messageControlPadding:30,
    messageIcon:null
});
isc.Notify.configureMessages("warn",{
    styleName:"vbWarn",messageControlPadding:35
});
isc.Notify.configureMessages("error",{
    styleName:"vbError",messageControlPadding:35
});
if(isc.ExpressionItem){
    isc.A=isc.ExpressionItem.getPrototype();
isc.A.actionIconSrc="actions/addAction.png"
    ;

}
isc.DataSource.create({
    isServerDS:true,
    operationBindings:[
        {
            operationId:"checkUploadFeature",
            operationType:"custom"
        }
    ],
    allowAdvancedCriteria:true,
    addGlobalId:false,
    ID:"SCUploadSaveFile",
    fields:[
        {
            name:"path",
            hidden:true,
            validators:[
            ],
            primaryKey:true
        },
        {
            name:"file",
            type:"binary",
            validators:[
            ]
        },
        {
            hidden:true,
            name:"file_dir",
            validators:[
            ]
        }
    ]
})
isc.defineClass("MockupImporter");
isc.A=isc.MockupImporter;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A._isValidID=function isc_c_MockupImporter__isValidID(id){
        return(id.match(isc.MockupImporter._identifierRegexp)!=null);
    }
,isc.A._createStrRegexp=function isc_c_MockupImporter__createStrRegexp(c){
        return c+"(?:[^\\"+c+"]|\\.)*?"+c;
    }
,isc.A._createKeyValueRegexp=function isc_c_MockupImporter__createKeyValueRegexp(key,sep,value){
        return"\\s*"+key+"\\s*"+sep+"\\s*"+value+"\\s*";
    }
,isc.A._createEntryRegexp=function isc_c_MockupImporter__createEntryRegexp(sep){
        var singleQuotedStr="("+isc.MockupImporter._createStrRegexp("'")+")",
            doubleQuotedStr="("+isc.MockupImporter._createStrRegexp("\"")+")",
            unquotedStr="([^;\\s"+sep+"](?:[^;"+sep+"]*[^;\\s"+sep+"])?)",
            str="(?:"+
                   singleQuotedStr+"|"+
                   doubleQuotedStr+"|"+
                   unquotedStr+")",
            kv=isc.MockupImporter._createKeyValueRegexp(str,sep,str),
            regexp="^(?:(?:"+kv+")|([^;]*))";
        return regexp;
    }
,isc.A._parseCustomProperties=function isc_c_MockupImporter__parseCustomProperties(str){

        var parse=function(str,kvRegexp){

            var keys=[],values=[],errors=[];
            for(var j=0,len=str.length;j<len;++j){
                var s=str.substring(j);
                var match=s.match(kvRegexp);
                if(match[7]!=null){
                    var err=match[7].toString().trim();
                    if(err!=""){
                        errors.push(err);
                    }
                }else{
                    var key,value;
                    if(match[1]!=null)key=eval(match[1].toString());
                    else if(match[2]!=null)key=eval(match[2].toString());
                    else key=match[3].toString();
                    if(match[4]!=null)value=eval(match[4].toString());
                    else if(match[5]!=null)value=eval(match[5].toString());
                    else value=match[6].toString();
                    keys.push(key);
                    values.push(value);
                }
                j+=match[0].toString().length;
            }
            return{keys:keys,values:values,errors:errors};
        };
        var result1=parse(str,isc.MockupImporter._keyColonValueRegexp),
            result2=parse(str,isc.MockupImporter._keyEqualValueRegexp);
        return(result1.errors.length<=result2.errors.length?result1:result2);
    }
,isc.A.getDataViewXml=function isc_c_MockupImporter_getDataViewXml(topLevelIds,dataViewId,useAutoId){
        var idField=(useAutoId?"autoID":"ID"),
            extraDVProperties=(dataViewId?" "+idField+"=\""+dataViewId+"\"":"")
        ;
        var dataView='<DataView width="100%" height="100%"\n'+
                       '          overflow="hidden" autoDraw="true"'+extraDVProperties+'>\n'+
            '    <minMemberLength>18</minMemberLength>\n'+
            '    <members>\n'+
            '        <Canvas '+idField+'="MockupCanvas">\n'+
            '            <children>\n';
        for(var i=0;i<topLevelIds.length;i++){
            dataView+='                <Canvas ref="'+topLevelIds[i]+'"/>\n';
        }
        dataView+='            </children>\n'+
            '        </Canvas>\n'+
            '    </members>\n'+
            '</DataView>\n';
        return dataView;
    }
);
isc.B._maxIndex=isc.C+6;

isc.A=isc.MockupImporter;
isc.A._identifierRegexp=new RegExp("^[a-zA-Z_$][a-zA-Z0-9_$]*$");
isc.A._keyColonValueRegexp=new RegExp(isc.MockupImporter._createEntryRegexp(":"));
isc.A._keyEqualValueRegexp=new RegExp(isc.MockupImporter._createEntryRegexp("="))
;

isc.A=isc.MockupImporter.getPrototype();
isc.A.transformRules=isc.Page.getToolsDir()+"visualBuilder/balsamiqTransformRules.js";
isc.A.useLayoutHeuristics=true;
isc.A.sloppyEdgeControlOverflow=10;
isc.A.maxControlOverlap=20;
isc.A.stackContainerFillInset=20;
isc.A.labelMaxOffset=10;
isc.A.dropExtraProperties=true;
isc.A.tallFormItems=["TextAreaItem","RadioGroupItem","SpacerItem","ButtonItem"];
isc.A.ignoreWidthFormItems=["DateItem","StaticTextItem"];
isc.A.dropMarkup=true;
isc.A.trimSpace=true;
isc.A.fillSpace=true;
isc.A.trimWhitespace=true;
isc.A.formsGridCellWidth=5;
isc.A.formsGridCellHeight=22;
isc.A.maxOuterControlsDistance=50;
isc.A.stackFlexMaxSizeMatch=10;
isc.A.formExtraSpaceThreshold=15;
isc.A.formExtraWidthThreshold=30;
isc.A.defaultButtonSize=27;
isc.A.buttonMinimumChangeSize=3;
isc.A._additionalLayouts=["HStack","HLayout","VStack","VLayout"];
isc.A._titledFormItems=["ButtonItem","CheckboxItem","RadioItem"];
isc.A.fieldNamingConvention="camelCaps";
isc.A.warnings=""
;

isc.A=isc.MockupImporter.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._delayedCalls=[];
isc.A._init=false;
isc.B.push(isc.A.init=function isc_MockupImporter_init(){
        this.globalIDs=[];
        this.allowedExtraProperties=[];
        this._linkedLayouts={};
        this._notFoundLinkTargets=[];
        var _this=this;
        isc.FL.loadJSFiles(this.transformRules,function(){
            _this._init=true;
            var transformRules=window.transformRules;
            if(transformRules==null){
                isc.logWarn("The MockupImporter could not find window.transformRules.");
                transformRules={
                    classTranslations:{},
                    propertyTranslations:{},
                    formItems:[],
                    markupItems:[],
                    widgetPropertyTranslations:{}
                };
            }
            _this._transformRules=transformRules;
            transformRules.mockupImporter=_this;
            for(var i=0;i<_this._delayedCalls.length;i++){
                var delayedCall=_this._delayedCalls[i];
                try{
                    _this.fireCallback(delayedCall.callback,delayedCall.argNames,delayedCall.args);
                }catch(e){
                    _this.logError("MockupImporter.init(): "+e+". Stack: "+e.stack);
                }
            };
            _this._delayedCalls.clear();
            delete _this._delayedCalls;
        });
    }
,isc.A.bmmlToXml=function isc_MockupImporter_bmmlToXml(bmmlXmlString,callback){
        if(!this._init){
            this._delayedCalls.add({callback:"bmmlToXml",argNames:["bmmlXmlString","callback"],args:[bmmlXmlString,callback]});
        }else{
            this.warnings="";
            this._bmmlToXml(bmmlXmlString,callback);
        }
    }
,isc.A._bmmlToXml=function isc_MockupImporter__bmmlToXml(bmmlXmlString,callback,fileName){
        var bmmlDataJS=isc.XMLTools.toJS(isc.XMLTools.parseXML(bmmlXmlString));
        this._bmmlJsToXml(bmmlDataJS,callback,fileName);
    }
,isc.A.bmmlJsToXml=function isc_MockupImporter_bmmlJsToXml(bmmlJsString,callback,symbolLibraries,assets){
        if(!this._init){
            this._delayedCalls.add({callback:"bmmlJsToXml",argNames:["bmmlJsString","callback","symbolLibraries","assets"],args:[bmmlJsString,callback,symbolLibraries,assets]});
        }else{
            this.warnings="";
            var bmmlDataJS=(isc.isA.String(bmmlJsString)?isc.JSON.decode(bmmlJsString):bmmlJsString);
            if(symbolLibraries){
                for(var i=0;i<symbolLibraries.length;i++){
                    var symbolLibrary=symbolLibraries[i],
                        bmmlJsString=symbolLibrary.data
                    ;
                    symbolLibrary.data=(isc.isA.String(bmmlJsString)?isc.JSON.decode(bmmlJsString):bmmlJsString);
                }
            }
            this.assets=assets;
            this._bmmlJsToXml(bmmlDataJS,callback,null,symbolLibraries);
        }
    }
,isc.A._bmmlJsToXml=function isc_MockupImporter__bmmlJsToXml(bmmlDataJS,callback,fileName,symbolLibraries){
        var file=fileName;
        if(file==null){
            file=this.mockupPath;
        }else{
            this.dropMarkup=true;
        }
        if(this._linkedLayouts[file]==null){
            this._linkedLayouts[file]={
                widgets:[]
            };
        }
        if(bmmlDataJS.mockup)bmmlDataJS=bmmlDataJS.mockup;
        var widgets=this._convertBMMLWidgetsToISCWidgets(bmmlDataJS,file);
        if(file==this.mockupPath&&!this.dropMarkup){
            this._mockupElements=[];
        }
        for(var i=0;i<widgets.length;i++){
            if(widgets[i]._constructor=="MockupElement"&&
                widgets[i].controlName!="com.balsamiq.mockups::HSplitter"&&
                widgets[i].controlName!="com.balsamiq.mockups::VSplitter"){
                if(file==this.mockupPath&&!this.dropMarkup){
                    this._mockupElements.add(isc.clone(widgets[i]));
                }
                widgets.removeAt(i);
                i--;
            }else if(this.dropMarkup&&
                       widgets[i].specialProperties&&
                       widgets[i].specialProperties.markup)
            {
                widgets.removeAt(i);
                i--;
            }
        }
        var _this=this;
        var afterLoadAssetsCallback=function(resultLayout){
            var transformRules=_this._transformRules;
            if(resultLayout==null){
                callback(null);
                return;
            }
            _this.adjustLayoutPosition(resultLayout);
            if(file==_this.mockupPath&&_this._mockupElements){
                var links=_this._getLinks(resultLayout);
                if(links.length==0){
                    resultLayout.addList(_this._mockupElements);
                    delete _this._mockupElements;
                }
            }
            if(_this.useLayoutHeuristics){
                resultLayout=_this.processHeuristics(resultLayout);
            }
            _this.postProcessLayout(resultLayout);
            _this._linkedLayouts[file].layout=resultLayout;
            _this._processLinks(resultLayout,fileName,callback);
        };
        if(symbolLibraries){
            this._downgradeSymbolAssets(symbolLibraries);
            this._processSymbolsAssets(widgets,symbolLibraries,afterLoadAssetsCallback);
        }else{
            this._loadSymbolsAssets(widgets,afterLoadAssetsCallback);
        }
    }
,isc.A.reifyComponentXml=function isc_MockupImporter_reifyComponentXml(componentXmlString,callback){
        if(!this._init){
            this._delayedCalls.add({callback:"reifyComponentXml",argNames:["componentXmlString","callback"],args:[componentXmlString,callback]});
        }else{
            this.warnings="";
            var _this=this;
            isc.DMI.callBuiltin({
                methodName:"xmlToJS",
                arguments:[componentXmlString],
                callback:function(rpcResponse,jsData){
                    _this._reifyComponentXml(jsData,callback);
                }
            });
        }
    }
,isc.A._reifyComponentXml=function isc_MockupImporter__reifyComponentXml(js,callback){
        var _this=this,
            editContext=isc.EditContext.create()
        ;
        editContext.getPaletteNodesFromJS(js,function(nodes){
            var widgets=nodes,
                transformRules=_this._transformRules,
                classTranslations=transformRules.classTranslations
            ;
            if(nodes.length==1&&nodes[0].defaults.components){
                var defaults=nodes[0].defaults;
                widgets=[];
                widgets.addList(defaults.dataSources);
                widgets.addList(defaults.components);
            }
            for(var i=0;i<widgets.length;i++){
                var widget=widgets[i];
                var autoIdField=isc.DS.getAutoIdField(widget),
                    toolAutoIdField=isc.DS.getToolAutoIdField(widget)
                ;
                if(autoIdField&&toolAutoIdField&&!widget[autoIdField]&&widget[toolAutoIdField]){
                    widget[autoIdField]=widget[toolAutoIdField];
                }
                delete widget[toolAutoIdField];
                if(widget._constructor=="DynamicForm"&&widget.fields.length==1){
                    var field=widget.fields[0],
                        controlName=_this.getBalsamiqControlNameForSCControl(field._constructor)
                    ;
                    if(!widget.specialProperties)widget.specialProperties={};
                    widget.specialProperties.controlName=controlName;
                    widget.specialProperties.markup=false;
                    widget.fields[0].specialProperties=isc.shallowClone(widget.specialProperties);
                }
                if(!widget.specialProperties||!widget.specialProperties.controlName){
                    var controlName=_this.getBalsamiqControlNameForSCControl(widget._constructor);
                    if(controlName){
                        if(!widget.specialProperties)widget.specialProperties={};
                        widget.specialProperties.controlName=controlName;
                    }
                }
                if(widget.zIndex==null)widget.zIndex=100000;
            }
            var resultLayout=widgets;
            _this.adjustLayoutPosition(resultLayout);
            if(_this.useLayoutHeuristics){
                resultLayout=_this.processHeuristics(resultLayout);
            }
            _this.postProcessLayout(resultLayout);
            _this._setAutoIds(resultLayout);
            if(callback){
                var res=isc.EditContext.serializeDefaults(_this._cleanLayout(resultLayout));
                callback(res.replace(/\r/g,"\n"),resultLayout,
                         _this._getLayoutIds(resultLayout));
            }
        },[isc.RPC.ALL_GLOBALS]);
    }
,isc.A._setAutoIds=function isc_MockupImporter__setAutoIds(layout,schema){
        for(var cnt=0;cnt<layout.length;cnt++){
            var widget=layout[cnt];
            var autoIdField=(schema?schema.getAutoIdField(widget):isc.DS.getAutoIdField(widget)),
                toolAutoIdField=(schema?schema.getToolAutoIdField(widget):isc.DS.getToolAutoIdField(widget))
            ;
            if(autoIdField&&toolAutoIdField&&widget[autoIdField]&&!widget[toolAutoIdField]){
                widget[toolAutoIdField]=widget[autoIdField];
            }
            if(autoIdField&&toolAutoIdField&&widget[autoIdField]&&widget[toolAutoIdField]){
                delete widget[autoIdField];
            }
            var childField=(widget.items?"items":(widget.fields?"fields":null)),
                childWidgets=widget[childField],
                childSchema=null
            ;
            if(childWidgets){
                var schema=isc.DataSource.getNearestSchema(widget),
                    field=schema.getField(childField)
                ;
                if(field)childSchema=isc.DataSource.getNearestSchema(field.type);
            }
            if(childWidgets)this._setAutoIds(childWidgets,childSchema);
        }
    }
,isc.A.adjustLayoutPosition=function isc_MockupImporter_adjustLayoutPosition(layout){
        if(this.trimSpace){
            var minLeft=10000;
            var minTop=10000;
            for(var i=0;i<layout.length;i++){
                if(layout[i].left!=null&&layout[i].top!=null){
                    minLeft=Math.min(minLeft,layout[i].left);
                    minTop=Math.min(minTop,layout[i].top);
                }
            }
            for(var i=0;i<layout.length;i++){
                if(layout[i].left!=null&&layout[i].top!=null){
                    layout[i].left-=minLeft;
                    layout[i].top-=minTop;
                }
            }
        }
    }
,isc.A.postProcessLayout=function isc_MockupImporter_postProcessLayout(layout){
        var transformRules=this._transformRules;
        for(var i=0;i<layout.length;i++){
            var layoutItem=layout[i];
            var specialProperties=layoutItem.specialProperties;
            if(specialProperties!=null&&
                    (specialProperties.overrideWidth||specialProperties.overrideHeight))
            {
                if(specialProperties.overrideWidth){
                    if(layoutItem._constructor=="DynamicForm"){
                        layoutItem.width="100%";
                    }else{
                        layoutItem.width="*";
                    }
                }
                if(specialProperties.overrideHeight){
                    if(layoutItem._constructor=="DynamicForm"){
                        layoutItem.height="100%";
                    }else{
                        layoutItem.height="*";
                    }
                }
            }
            if(specialProperties!=null&&
               (specialProperties.fullWidth||specialProperties.fullHeight)&&
               layoutItem._constructor!="FacetChart")
            {
                if(specialProperties.containerName=="TabSet"||
                    specialProperties.containerName=="Window"||
                    specialProperties.containerName=="SectionStack"||
                    specialProperties.containerName=="HStack"||
                    specialProperties.containerName=="HLayout"||
                    specialProperties.containerName=="VLayout")
                {
                    if(specialProperties.fullWidth){
                        delete layoutItem.width;
                    }
                    if(specialProperties.fullHeight){
                        delete layoutItem.height;
                    }
                }else if(specialProperties.containerName=="VStack"||
                    specialProperties.controlName=="com.balsamiq.mockups::FieldSet"||
                    specialProperties.controlName=="com.balsamiq.mockups::Canvas"||
                    specialProperties.controlName=="com.balsamiq.mockups::TabBar")
                {
                    if(specialProperties.fullWidth){
                        layoutItem.width="100%";
                    }
                    if(specialProperties.fullHeight){
                        layoutItem.height="100%";
                    }
                }
            }
            delete layoutItem.absX;
            delete layoutItem.absY;
            if(layoutItem._constructor=="DynamicForm"&&
                layoutItem.isGroup!=true&&layoutItem.height!="*")
            {
                if(layoutItem.specialProperties.calculatedHeight!=null){
                    layoutItem.height=layoutItem.specialProperties.calculatedHeight;
                    if(layoutItem.padding!=null){
                        layoutItem.height+=(2*layoutItem.padding);
                        layoutItem.specialProperties.calculatedHeight+=(2*layoutItem.padding);
                    }
                }
            }
            if(layoutItem.specialProperties){
                var controlName=layoutItem.specialProperties.controlName;
                var widgetProperties=transformRules.widgetPropertyTranslations[controlName];
                if(widgetProperties&&widgetProperties.onProcessFinished){
                    widgetProperties.onProcessFinished(layoutItem);
                }
            }
            if(layoutItem._constructor=="DynamicForm"){
                var items=layoutItem.items||layoutItem.fields;
                if(items){
                    for(var j=0;j<items.length;j++){
                        var sp=items[j].specialProperties;
                        if(sp){
                            var controlName=sp.controlName;
                            var widgetProperties=transformRules.widgetPropertyTranslations[controlName];
                            if(widgetProperties&&widgetProperties.onProcessFinished){
                                widgetProperties.onProcessFinished(items[j]);
                            }
                        }
                    }
                }
            }
        }
    }
,isc.A.getBalsamiqControlNameForSCControl=function isc_MockupImporter_getBalsamiqControlNameForSCControl(type){
        var transformRules=this._transformRules,
            classTranslations=transformRules.classTranslations,
            controlName
        ;
        for(var key in classTranslations){
            if(classTranslations[key]==type){
                controlName=key;
                break;
            }
        }
        return controlName;
    }
,isc.A._processLinks=function isc_MockupImporter__processLinks(layout,fileName,callback){
        if(this._linksCounter==null){
            this._linksCounter=0;
        }
        var _this=this;
        var loadLinksCounter=0;
        for(var i=0;i<layout.length;i++){
            var widgets=[layout[i]];
            if(layout[i]._constructor=="DynamicForm"&&layout[i].items){
                widgets=layout[i].items;
            }
            if(layout[i]._constructor=="SectionStack"&&layout[i].specialProperties.widgets){
                widgets=layout[i].specialProperties.widgets;
                widgets.add(layout[i]);
            }
            for(var widgetCounter=0;widgetCounter<widgets.length;widgetCounter++){
                var widget=widgets[widgetCounter];
                if(widget.specialProperties==null||
                    (widget.specialProperties.hrefs==null&&
                     widget.specialProperties.href==null))continue;
                var links=null;
                if(widget.specialProperties.hrefs){
                    if(isc.isA.String(widget.specialProperties.hrefs)){
                        links=widget.specialProperties.hrefs.split(",");
                    }else{
                    }
                }else if(widget.specialProperties.href){
                    links=[widget.specialProperties.href];
                }
                if(links==null)continue;
                var dir=this.mockupPath.substring(0,this.mockupPath.lastIndexOf("/"));
                widget.specialProperties.links=[];
                for(var j=0;j<links.length;j++){
                    var linkData=links[j].split("&bm;");
                    var linkFileName=linkData[1];
                    if(linkFileName==null){
                        widget.specialProperties.links.add(null);
                        continue;
                    }
                    linkFileName=dir+"/"+linkFileName;
                    widget.specialProperties.links.add({
                        fileName:linkFileName,
                        name:linkData[0]
                    });
                    if(this._linkedLayouts[linkFileName]){
                        this._linkedLayouts[linkFileName].widgets.add(widget);
                    }else{
                        this._linkedLayouts[linkFileName]={
                            widgets:[widget],
                            fileName:linkFileName,
                            layoutName:linkData[0]
                        };
                        loadLinksCounter++;
                        var processLinksCallback=function(linkLayout){
                            loadLinksCounter--;
                            if(loadLinksCounter==0){
                                if(linkLayout==null){
                                    callback(null);
                                }else if(fileName){
                                    callback(_this._clone(layout));
                                }else{
                                    layout=_this._mergeLinksLayout(layout);
                                    if(_this._mockupElements){
                                        layout.addList(_this._mockupElements);
                                    }
                                    var res=isc.EditContext.serializeDefaults(_this._cleanLayout(layout));
                                    callback(res.replace(/\r/g,"\n"),[],_this._getLayoutIds(layout));
                                    if(_this._notFoundLinkTargets.length>0){
                                        _this.logWarn("During import these custom components were not found: "+
                                            _this._notFoundLinkTargets);
                                    }
                                }
                            }
                        };
                        this._loadLinkedLayout(linkFileName,processLinksCallback);
                    }
                };
            };
        }
        if(loadLinksCounter==0){
            if(fileName){
                callback(this._clone(layout));
            }else if(this._linksCounter==0){
                if(this._mockupElements){
                    layout.addList(this._mockupElements);
                }
                var res=isc.EditContext.serializeDefaults(this._cleanLayout(layout));
                callback(res.replace(/\r/g,"\n"),layout,this._getLayoutIds(layout));
                if(this._notFoundLinkTargets.length>0){
                    this.logWarn("During import these custom components were not found: "+
                        this._notFoundLinkTargets);
                }
            }
        }
    }
,isc.A._getLayoutIds=function isc_MockupImporter__getLayoutIds(layout){
        var res=[];
        for(var i=0;i<layout.length;i++){
            if(layout[i].ID)res.add(layout[i].ID);
        }
        return res;
    }
,isc.A._loadLinkedLayout=function isc_MockupImporter__loadLinkedLayout(linkFileName,processLinksCallback,actualLinkFileName){
        var _this=this;
        isc.DMI.callBuiltin({
            methodName:"loadFile",
            arguments:[linkFileName],
            callback:function(rpcResponse){
                var loadedLinkFileName=actualLinkFileName||linkFileName;
                if(rpcResponse.status==isc.RPCResponse.STATUS_FAILURE){
                    var slashInd=linkFileName.lastIndexOf("/");
                    var prefix=linkFileName.substring(0,slashInd);
                    var fileName=linkFileName.substring(slashInd+1);
                    if(!prefix.endsWith("/assets")){
                        var newLinkFileName=prefix+"/assets/"+fileName;
                        _this._loadLinkedLayout(newLinkFileName,processLinksCallback,loadedLinkFileName);
                        return;
                    }
                    if(_this._inaccessibleResourcesList==null){
                        _this._inaccessibleResourcesList=[];
                    }
                    _this._inaccessibleResourcesList.add(loadedLinkFileName);
                    var missingResourcesString="<ul><li>"+_this._inaccessibleResourcesList.join("<li>")+"</ul>";
                    isc.warn("This mockup may not render correctly in Reify as the following resource"+
                            (_this._inaccessibleResourcesList.length>1?"s are":" is")+" missing:"+
                            missingResourcesString+
                            "<P>If you choose to continue Reify will add placeholders.",function(){},{
                                buttons:[
                                    isc.Button.create({
                                        title:"Abort",
                                        click:function(){
                                            this.topElement.hide();
                                            processLinksCallback(null);
                                        }
                                    }),
                                    isc.Button.create({
                                        title:"Continue",
                                        click:function(){
                                            this.topElement.hide();
                                            for(var i=0;i<_this._inaccessibleResourcesList.length;i++){
                                                _this._linkedLayouts[_this._inaccessibleResourcesList[i]].layout=[];
                                                processLinksCallback(loadedLinkFileName);
                                            }
                                        }
                                    })
                                ]});
                    return;
                }
                _this._bmmlToXml(rpcResponse.data,processLinksCallback,loadedLinkFileName);
            },
            requestParams:{willHandleError:true}
        });
    }
,isc.A._cleanLayout=function isc_MockupImporter__cleanLayout(layout){
        for(var cnt=0;cnt<layout.length;cnt++){
            var item=layout[cnt];
            delete item.specialProperties;
            if(item._constructor=="DynamicForm"){
                var items=item.items||item.fields;
                if(items){
                    for(var i=0;i<items.length;i++){
                        var fi=items[i];
                        if(this.ignoreWidthFormItems.contains(fi._constructor)){
                            delete fi.width;
                        }else if(isc.isA.Number(fi.width)){
                            var width=isc[fi._constructor].getInstanceProperty("width");
                            if(Math.abs(fi.width-width)<this.formExtraWidthThreshold){
                                delete fi.width;
                            }
                        }
                        fi._tagName=fi._constructor;
                        delete fi._constructor;
                        if(fi.showTitle==true)delete fi.showTitle;
                    }
                }
            }
            if(item._constructor=="TabSet"&&item.selectedTab==0){
                delete item.selectedTab;
            }
            var childItems=item.items||item.fields||item.members;
            if(childItems)this._cleanLayout(childItems);
        }
        return layout;
    }
,isc.A._getLinks=function isc_MockupImporter__getLinks(layout){
        var links=[];
        for(var i=0;i<layout.length;i++){
            var widgets=[layout[i]];
            if(layout[i]._constructor=="DynamicForm"&&(layout[i].items||layout[i].fields)){
                widgets=layout[i].items||layout[i].fields;
            }
            if(layout[i]._constructor=="SectionStack"&&layout[i].specialProperties.widgets){
                widgets=layout[i].specialProperties.widgets;
                widgets.add(layout[i]);
            }
            for(var widgetCounter=0;widgetCounter<widgets.length;widgetCounter++){
                var widget=widgets[widgetCounter];
                if(widget.specialProperties==null||
                    (widget.specialProperties.hrefs==null&&
                     widget.specialProperties.href==null))continue;
                if(widget.specialProperties.hrefs){
                    if(isc.isA.String(widget.specialProperties.hrefs)){
                        links.addAll(widget.specialProperties.hrefs.split(","));
                    }else{
                    }
                }else if(widget.specialProperties.href){
                    links.add(widget.specialProperties.href);
                }
            }
        }
        return links;
    }
,isc.A._mergeLinksLayout=function isc_MockupImporter__mergeLinksLayout(layout){
        for(var layoutName in this._linkedLayouts){
            var linkedLayout=this._linkedLayouts[layoutName];
            if(layoutName==this.mockupPath){
                linkedLayout.prefix="";
                linkedLayout.processed=true;
            }else{
                linkedLayout.prefix=linkedLayout.layoutName.replace(/[^a-zA-Z0-9_]/g,"_")+"_";
            }
            linkedLayout.topLevelElements=this._getLayoutTopLevelElements(linkedLayout.layout);
        }
        var dir=this.mockupPath.substring(0,this.mockupPath.lastIndexOf("/"));
        var layoutName=this.mockupPath;
        var resultLayout=[];
        do{
            var linkedLayout=this._linkedLayouts[layoutName];
            if(linkedLayout.layout.length>0){
                if(linkedLayout.prefix!=""){
                    this._addPrefixToIds(linkedLayout.layout,linkedLayout.prefix);
                }
                this._mergeLinksLayoutProcessTabsAndStacks(linkedLayout);
                if(linkedLayout.prefix!=""){
                    this._addPrefixToIds(linkedLayout.layout,linkedLayout.prefix);
                    for(var i=0;i<linkedLayout.topLevelElements.length;i++){
                        linkedLayout.topLevelElements[i].autoDraw=false;
                    };
                }
                resultLayout.addList(linkedLayout.layout);
            }
            layoutName=null;
            for(var name in this._linkedLayouts){
                var linkedLayout=this._linkedLayouts[name];
                if(linkedLayout.processed!=true){
                    layoutName=name;
                    linkedLayout.processed=true;
                    break;
                }
            }
        }while(layoutName);
        for(var name in this._linkedLayouts){
            var linkedLayout=this._linkedLayouts[name];
            if(linkedLayout.activateCode==null){
                linkedLayout.activateCode=this._getActivateLayoutCode(linkedLayout.layout);
            }
            linkedLayout.showCode=this._getShowLayoutCode(linkedLayout);
            linkedLayout.hideCode=this._getHideLayoutCode(linkedLayout);
        }
        for(var layoutName in this._linkedLayouts){
            if(this._linkedLayouts[layoutName].mergedWith)continue;
            layout=this._linkedLayouts[layoutName].layout
            for(var i=0;i<layout.length;i++){
                var widget=layout[i];
                if(widget.specialProperties&&widget.specialProperties.links&&
                    (widget._constructor!="TabSet"&&widget._constructor!="SectionStack"))
                {
                    var links=widget.specialProperties.links;
                    for(var j=0;j<links.length;j++){
                        if(links[j]==null)continue;
                        var linkFileName=links[j].fileName;
                        var activateCode=this._constructActivateCode(linkFileName,
                            layoutName,widget.customData,resultLayout);
                        if(widget._constructor=="TreeGrid"||
                            widget._constructor=="ListGrid")
                        {
                            if(widget.selectionChanged==null){
                                widget.selectionChanged="";
                            }
                            widget.selectionChanged+=
                                "if (this.getRecordIndex(record) == "+(j-1)+") {"+
                                activateCode+"}";
                        }else{
                            widget.click=activateCode;
                        }
                    }
                }else if(widget._constructor=="DynamicForm"){
                    var items=widget.items||widget.fields;
                    for(var j=0;j<items.length;j++){
                        if(items[j].specialProperties&&
                            items[j].specialProperties.links)
                        {
                            var links=items[j].specialProperties.links;
                            for(var k=0;k<links.length;k++){
                                if(links[k]==null)continue;
                                var linkFileName=links[k].fileName;
                                widget.items[j].click=
                                    this._constructActivateCode(linkFileName,layoutName,
                                        items[j].customData,resultLayout);
                            }
                        }
                    };
                }else if(widget._constructor=="SectionStack"&&widget.specialProperties.widgets){
                    var items=widget.specialProperties.widgets;
                    for(var j=0;j<items.length;j++){
                        if(widget!=items[j]&&items[j].specialProperties&&items[j].specialProperties.links)
                        {
                            var links=items[j].specialProperties.links;
                            for(var k=0;k<links.length;k++){
                                if(links[k]==null)continue;
                                var linkFileName=links[k].fileName;
                                items[j].click=
                                    this._constructActivateCode(linkFileName,layoutName,
                                        items[j].customData,resultLayout);
                            }
                        }
                    };
                }else if(widget._constructor=="TabSet"&&widget.specialProperties.links){
                    var tabs=widget.tabs;
                    for(var j=0;j<tabs.length;j++){
                        var link=widget.specialProperties.links[j];
                        if(link){
                            var linkFileName=link.fileName;
                            tabs[j].click=this._constructActivateCode(linkFileName,
                                layoutName,tabs[j].customData,resultLayout);
                        }
                    };
                }
            }
        }
        return resultLayout;
    }
,isc.A._constructActivateCode=function isc_MockupImporter__constructActivateCode(linkLayoutName,currentLayoutName,customData,resultLayout){
        var linkLayout=this._linkedLayouts[linkLayoutName];
        var activateCode="";
        if(customData){
            var customData=decodeURIComponent(customData);
            var ind=customData.indexOf("linkTarget=");
            if(ind>=0){
                var linkTarget=customData.substring(ind+"linkTarget=".length).trim();
                if(linkTarget.contains("\n")){
                    linkTarget=linkTarget.substring(0,linkTarget.indexOf("\n")).trim();
                }
                linkTarget=linkTarget.replace(/['"]/g,"");
                var target=null;
                for(var k=0;k<resultLayout.length;k++){
                    if(resultLayout[k].customID==linkTarget){
                        target=resultLayout[k];
                        break;
                    }
                }
                if(target==null){
                    this._notFoundLinkTargets.add(linkTarget);
                    return activateCode+linkLayout.activateCode;
                }
                if(target._constructor=="Window"){
                    activateCode="for (var i = 0; i < "+target.ID+
                        ".items.length; i++) { "+target.ID+
                        ".items[i].hide(); }\n";
                    for(var k=0;k<linkLayout.topLevelElements.length;k++){
                        if(target.ID==linkLayout.topLevelElements[k].ID){
                            for(var l=0;l<target.items.length;l++){
                                activateCode+=target.ID+".addItem("+
                                    target.items[l].ref+");";
                                activateCode+=target.items[l].ref+".show();";
                            }
                        }else{
                            activateCode+=target.ID+".addItem("+
                                linkLayout.topLevelElements[k].ID+");";
                            activateCode+=linkLayout.topLevelElements[k].ID+".show();";
                        }
                    }
                }else if(target._constructor=="TabSet"){
                    var currIndex=target.selectedTab==null?0:target.selectedTab;
                    if(currIndex>=target.tabs.length)currIndex=target.tabs.length-1;
                    var paneCode=target.ID+".tabs["+currIndex+"].pane";
                    activateCode="for (var i = 0; i < "+paneCode+
                        ".members.length; i++) { "+paneCode+
                        ".members[i].hide(); }\n";
                    for(var k=0;k<linkLayout.topLevelElements.length;k++){
                        if(target.ID==linkLayout.topLevelElements[k].ID){
                            var innerItems=target.specialProperties.innerItems;
                            for(var l=0;l<innerItems.length;l++){
                                activateCode+=paneCode+".addMember("+innerItems[l].ID+
                                    ");";
                                activateCode+=innerItems[l].ID+".show();";
                            }
                        }else{
                            activateCode+=paneCode+".addMember("+
                                linkLayout.topLevelElements[k].ID+");";
                            activateCode+=linkLayout.topLevelElements[k].ID+".show();";
                        }
                    }
                }else if(target._constructor=="SectionStack"){
                    var section=target.ID+".sections["+target._sectionIndex+"]";
                    activateCode="for (var i = "+section+".items.length - 1; i >= 0; "+
                        "i--) { "+section+".items[i].hide();\n"+
                        target.ID+".removeItem("+target._sectionIndex+
                        ","+section+".items[i]); }\n";
                    for(var k=0;k<linkLayout.topLevelElements.length;k++){
                        if(target.ID==linkLayout.topLevelElements[k].ID){
                            var innerItems=target.specialProperties.innerItems;
                            for(var l=0;l<innerItems.length;l++){
                                activateCode+=target.ID+".addItem("+
                                    target._sectionIndex+","+innerItems[l].ID+", "+k+
                                    ");";
                                activateCode+=innerItems[l].ID+".show();\n";
                            }
                        }else{
                            activateCode+=target.ID+".addItem("+target._sectionIndex+
                                ","+linkLayout.topLevelElements[k].ID+", "+k+");";
                            activateCode+=linkLayout.topLevelElements[k].ID+".show();\n";
                        }
                    }
                }else{
                    activateCode="for (var i = 0; i < "+target.ID+
                        ".members.length; i++) { "+target.ID+
                        ".members[i].hide(); }\n";
                    for(var k=0;k<linkLayout.topLevelElements.length;k++){
                        if(target.ID==linkLayout.topLevelElements[k].ID){
                            var innerItems=target.specialProperties.innerItems;
                            for(var l=0;l<innerItems.length;l++){
                                activateCode+=target.ID+".addMember("+innerItems[l].ID+
                                    ");";
                                activateCode+=innerItems[l].ID+".show();";
                            }
                        }else{
                            activateCode+=target.ID+".addMember("+
                                linkLayout.topLevelElements[k].ID+");";
                            activateCode+=linkLayout.topLevelElements[k].ID+".show();";
                        }
                    }
                }
            }
            return activateCode+linkLayout.activateCode;
        }else{
            if(linkLayout.prefix!=this._linkedLayouts[currentLayoutName].prefix){
                var fromLayout=this._linkedLayouts[currentLayoutName];
                if(fromLayout.mergedWith!=null){
                    if(fromLayout.mergedWith==""){
                        fromLayout=this._linkedLayouts[this.mockupPath];
                    }else{
                        fromLayout=this._linkedLayouts[fromLayout.mergedWith];
                    }
                }
                activateCode+=fromLayout.hideCode;
                activateCode+=linkLayout.showCode;
            }
            activateCode+=linkLayout.activateCode;
            return activateCode;
        }
    }
,isc.A._mergeLinksLayoutProcessTabsAndStacks=function isc_MockupImporter__mergeLinksLayoutProcessTabsAndStacks(layoutData){
        var layout=layoutData.layout;
        do{
            var changed=false;
            for(var i=0;i<layout.length;i++){
                var widget=layout[i];
                if(widget.specialProperties&&widget.specialProperties.links&&
                    (widget._constructor=="TabSet"||widget._constructor=="SectionStack")){
                    var links=widget.specialProperties.links;
                    for(var j=0;j<links.length;j++){
                        if(links[j]==null)continue;
                        var linkLayout=this._linkedLayouts[links[j].fileName];
                        if(!linkLayout.processed&&linkLayout.layout.length>0&&
                            this._compareParentLayout(layout,linkLayout,widget))
                        {
                            var innerContent=null;
                            if(widget._constructor=="TabSet"){
                                innerContent=this._mergeTabLayout(j,widget,linkLayout,
                                    linkLayout.prefix);
                            }else{
                                innerContent=this._mergeSectionStackLayout(j,widget,
                                    linkLayout,linkLayout.prefix);
                            }
                            var innerLayout=innerContent.layout;
                            if(innerLayout){
                                layout.addListAt(innerLayout,layout.indexOf(widget)-1);
                                changed=true;
                                linkLayout.processed=true;
                                linkLayout.mergedWith=layoutData.prefix;
                                linkLayout.topLevelElements=layoutData.topLevelElements;
                                innerContent.widget.ID=widget.ID;
                                linkLayout.activateCode=widget.ID+".showRecursively();\n"+
                                    this._getActivateLayoutCode([innerContent.widget])+
                                    this._getActivateLayoutCode(innerLayout);
                            }
                        }
                    }
                }
            }
        }while(changed);
    }
);
isc.evalBoundary;isc.B.push(isc.A._getActivateLayoutCode=function isc_MockupImporter__getActivateLayoutCode(layout){
        var activateCode="";
        for(var i=0;i<layout.length;i++){
            if(layout[i]._constructor=="TabSet"){
                activateCode=layout[i].ID+".selectTab("+layout[i].selectedTab+");\n"+activateCode;
            }else if(layout[i]._constructor=="SectionStack"){
                for(var j=0;j<layout[i].sections.length;j++){
                    if(layout[i].sections[j].expanded){
                        activateCode=layout[i].ID+".expandSection("+j+");\n"+activateCode;
                    }else if(layout[i].sections[j].items){
                        activateCode=layout[i].ID+".collapseSection("+j+");\n"+activateCode;
                    }
                };
            }
        };
        return activateCode;
    }
,isc.A._getShowLayoutCode=function isc_MockupImporter__getShowLayoutCode(layoutData){
        var showLayoutCode="";
        for(var k=0;k<layoutData.topLevelElements.length;k++){
            showLayoutCode+=layoutData.topLevelElements[k].ID+".show();\n";
        };
        return showLayoutCode;
    }
,isc.A._getHideLayoutCode=function isc_MockupImporter__getHideLayoutCode(layoutData){
        var hideLayoutCode="";
        for(var k=0;k<layoutData.topLevelElements.length;k++){
            hideLayoutCode+=layoutData.topLevelElements[k].ID+".hide();\n";
        };
        return hideLayoutCode;
    }
,isc.A._getLayoutTopLevelElements=function isc_MockupImporter__getLayoutTopLevelElements(layout){
        var topLevelElements=[];
        for(var i=0;i<layout.length;i++){
            if(layout[i]._constructor!="MockDataSource"&&
                layout[i]._constructor!="ValuesManager"&&
                this._findParentWidget(layout,layout[i])==null)
            {
                topLevelElements.add(layout[i]);
            }
        };
        return topLevelElements;
    }
,isc.A._mergeTabLayout=function isc_MockupImporter__mergeTabLayout(linkIndex,widget,linkLayout,prefix){
        if(widget.tabs[linkIndex].pane)return null;
        var tabPaneContent=this._getWidgetContentLayout(linkLayout,widget);
        if(tabPaneContent==null)return null;
        var tabLayout=tabPaneContent.layout;
        this._addPrefixToIds(tabLayout,prefix);
        widget.specialProperties.innerItems.addList(tabLayout);
        for(var i=0;i<tabPaneContent.widget.tabs.length;i++){
            var pane=tabPaneContent.widget.tabs[i].pane;
            if(pane==null)continue;
            if(isc.isA.String(pane)){
                widget.tabs[i].pane=prefix+pane
            }else{
                for(var j=0;j<pane.VStack.members.length;j++){
                    pane.VStack.members[j]=prefix+pane.VStack.members[j];
                };
                widget.tabs[i].pane=pane
            }
            break;
        };
        return tabPaneContent;
    }
,isc.A._mergeSectionStackLayout=function isc_MockupImporter__mergeSectionStackLayout(linkIndex,widget,linkLayout,linkIdPrefix){
        for(var sc=0;sc<widget.sections.length;sc++){
            if(widget.sections[sc]._index!=linkIndex)continue;
            var sectionContent=this._getWidgetContentLayout(linkLayout,widget);
            if(sectionContent==null)return;
            var sectionLayout=sectionContent.layout;
            this._addPrefixToIds(sectionLayout,linkIdPrefix);
            widget.specialProperties.innerItems.addList(sectionLayout);
            widget.sections[sc].items=sectionContent.widget.sections[sc].items;
            return sectionContent;
        };
    }
,isc.A._addPrefixToIds=function isc_MockupImporter__addPrefixToIds(layout,prefix){
        for(var i=0;i<layout.length;i++){
            var item=layout[i];
            if(item.ID&&!item.ID.startsWith(prefix)){
                item.ID=prefix+item.ID;
            }
            if(item.dataSource&&!item.dataSource.startsWith(prefix)){
                item.dataSource=prefix+item.dataSource
            }
            if(item.valuesManager&&!item.valuesManager.startsWith(prefix)){
                item.valuesManager=prefix+item.valuesManager
            }
            if(item.specialProperties){
                var refs=item.specialProperties.refs;
                if(refs){
                    for(var j=0;j<refs.length;j++){
                        refs[j].ref=item.ID;
                    }
                }
            }
            if(item._constructor=="TabSet"){
                for(var j=0;j<item.tabs.length;j++){
                    if(item.tabs[j].pane==null)continue;
                    if(isc.isA.String(item.tabs[j].pane)&&
                        !item.tabs[j].pane.startsWith(prefix))
                    {
                        item.tabs[j].pane=prefix+item.tabs[j].pane;
                    }else{
                        var pane=item.tabs[j].pane;
                        if(pane.VStack){
                            for(var k=0;k<pane.VStack.members.length;k++){
                                if(!pane.VStack.members[k].startsWith(prefix)){
                                    pane.VStack.members[k]=prefix+pane.VStack.members[k];
                                }
                            };
                        }else if(pane.children){
                            for(var k=0;k<pane.children.length;k++){
                                if(!pane.children[k].ref.startsWith(prefix)){
                                    pane.children[k].ref=prefix+pane.children.members[k].ref;
                                }
                            };
                        }
                    }
                };
            }
        };
    }
,isc.A._compareParentLayout=function isc_MockupImporter__compareParentLayout(layout,linkLayout,widget){
        var layoutOuter=this._clone(layout);
        var linkLayoutOuter=this._clone(linkLayout.layout);
        var layoutInner=this._getWidgetContentLayout({layout:layout},widget);
        var linkLayoutInner=this._getWidgetContentLayout(linkLayout,widget);
        if(linkLayoutInner==null)return false;
        for(var i=0;i<layoutInner.layout.length;i++){
            for(var j=0;j<layoutOuter.length;j++){
                if(layoutInner.layout[i].ID==layoutOuter[j].ID){
                    layoutOuter.removeAt(j);
                    break;
                }
            }
        };
        for(var i=0;i<linkLayoutInner.layout.length;i++){
            for(var j=0;j<linkLayoutOuter.length;j++){
                if(linkLayoutInner.layout[i].ID==linkLayoutOuter[j].ID){
                    linkLayoutOuter.removeAt(j);
                    break;
                }
            }
        };
        var parent=layoutInner.widget;
        var linkParent=linkLayoutInner.widget;
        do{
            parent=this._findParentWidget(layoutOuter,parent);
            linkParent=this._findParentWidget(linkLayoutOuter,linkParent);
            if(parent==null||linkParent==null)break;
            if(parent._constructor=="TabSet"&&linkParent._constructor=="TabSet"){
                delete linkParent.layoutLeftMargin;
                delete linkParent.layoutTopMargin;
                delete linkParent.layoutRightMargin;
                delete linkParent.layoutBottomMargin;
                delete parent.layoutLeftMargin;
                delete parent.layoutTopMargin;
                delete parent.layoutRightMargin;
                delete parent.layoutBottomMargin;
                var parentInnerItems=parent.specialProperties.innerItems;
                for(var i=0;i<linkParent.tabs.length;i++){
                    if(linkParent.tabs[i].pane!=null||parent.tabs[i].pane==null){
                        continue;
                    }
                    var pane=parent.tabs[i].pane;
                    if(isc.isA.String(pane)){
                        for(var k=0;k<parentInnerItems.length;k++){
                            var item=parentInnerItems[k]
                            if(item.ID!=pane)continue;
                            this._removeItemWithChildItemsFromLayout(layoutOuter,item);
                        };
                    }else{
                        for(var j=0;j<pane.VStack.members.length;j++){
                            for(var k=0;k<parentInnerItems.length;k++)
                            {
                                var item=parentInnerItems[k]
                                if(item.ID!=pane.VStack.members[j])continue;
                                this._removeItemWithChildItemsFromLayout(layoutOuter,item);
                            };
                        };
                    }
                };
            }else if(parent._constructor=="SectionStack"&&
                linkParent._constructor=="SectionStack")
            {
                var parentInnerItems=parent.specialProperties.innerItems;
                for(var i=0;i<linkParent.sections.length;i++){
                    if(linkParent.sections[i].items!=null||
                        parent.sections[i].items==null)
                    {
                        continue;
                    }
                    parent.sections[i].expanded=linkParent.sections[i].expanded;
                    for(var j=0;j<parent.sections[i].items.length;j++){
                        for(var k=0;k<parentInnerItems.length;k++)
                        {
                            var item=parentInnerItems[k]
                            if(item.ID!=parent.sections[i].items[j].ref)continue;
                            this._removeItemWithChildItemsFromLayout(layoutOuter,item);
                        };
                    };
                    delete parent.sections[i].items;
                };
            }
        }while(true);
        for(var j=0;j<layoutOuter.length;j++){
            if(layoutInner.widget.ID==layoutOuter[j].ID){
                layoutOuter.removeAt(j);
                break;
            }
        }
        for(var j=0;j<linkLayoutOuter.length;j++){
            if(linkLayoutInner.widget.ID==linkLayoutOuter[j].ID){
                linkLayoutOuter.removeAt(j);
                break;
            }
        }
        this._cleanObjects(layoutOuter);
        this._cleanObjects(linkLayoutOuter);
        var layoutSortFunction=function(a,b){
            return isc.echoAll(a)<isc.echoAll(b);
        };
        layoutOuter.sort(layoutSortFunction);
        linkLayoutOuter.sort(layoutSortFunction);
        var layoutOuterJSON=isc.JSON.encode(layoutOuter);
        var linkLayoutOuterJSON=isc.JSON.encode(linkLayoutOuter);
        return layoutOuterJSON===linkLayoutOuterJSON;
    }
,isc.A._removeItemWithChildItemsFromLayout=function isc_MockupImporter__removeItemWithChildItemsFromLayout(layout,item){
        for(var l=0;l<layout.length;l++){
            if(layout[l].ID==item.ID){
                layout.removeAt(l);
                break;
            }
        };
        var items=this._getInnerComponents(item);
        for(var m=0;m<items.length;m++){
           for(var l=0;l<layout.length;l++){
                if(layout[l].ID==items[m].ID){
                    layout.removeAt(l);
                    break;
                }
            };
        };
        var additionalComponents=item.specialProperties.additionalElements;
        if(additionalComponents){
            for(var m=0;m<additionalComponents.length;m++){
               for(var l=0;l<layout.length;l++){
                    if(layout[l].ID==additionalComponents[m].ID){
                        layout.removeAt(l);
                        break;
                    }
                };
            };
        }
    }
,isc.A._findParentWidget=function isc_MockupImporter__findParentWidget(layout,childWidget){
        for(var i=0;i<layout.length;i++){
            if(layout[i].specialProperties&&layout[i].specialProperties.innerItems){
                for(var j=0;j<layout[i].specialProperties.innerItems.length;j++){
                    if(layout[i].specialProperties.innerItems[j].ID==childWidget.ID){
                        return layout[i];
                    }
                };
            }
        };
    }
,isc.A._cleanObjects=function isc_MockupImporter__cleanObjects(object){
        if(this._isPlainObject(object)){
        }else if(isc.isA.Array(object)){
            for(var i=0;i<object.length;i++){
                if(!this._isPlainObject(object[i])){
                    this._cleanObjects(object[i]);
                }
            };
        }else{
            for(var name in object){
                if(name=="ID"||name=="ref"||name=="specialProperties"||
                    name=="pane"||name=="selectedTab"||name=="zIndex"||
                    name=="expanded"||name=="_sectionIndex"){
                    delete object[name];
                }else if(!this._isPlainObject(object[name])){
                    this._cleanObjects(object[name]);
                }
            }
        }
    }
,isc.A._clone=function isc_MockupImporter__clone(objectToClone,stackDeepness){
        if(stackDeepness==null)stackDeepness=10;
        var resultObject=null;
        if(this._isPlainObject(objectToClone)){
            resultObject=this._clonePlainObject(objectToClone);
        }else if(isc.isA.Array(objectToClone)){
            resultObject=[];
            for(var i=0;i<objectToClone.length;i++){
                var item=objectToClone[i];
                if(this._isPlainObject(item)){
                    resultObject.add(this._clonePlainObject(item));
                }else if(stackDeepness==0){
                    resultObject.add(isc.isA.Array(item)?[]:{});
                }else{
                    resultObject.add(this._clone(item,stackDeepness-1));
                }
            };
        }else{
            resultObject={};
            for(var name in objectToClone){
                var item=objectToClone[name];
                if(this._isPlainObject(item)){
                    resultObject[name]=this._clonePlainObject(item);
                }else if(stackDeepness==0){
                    resultObject[name]=(isc.isA.Array(item)?[]:{});
                }else{
                    resultObject[name]=this._clone(item,stackDeepness-1);
                }
            }
        }
        return resultObject;
    }
,isc.A._isPlainObject=function isc_MockupImporter__isPlainObject(object){
        var undef;
        return(object===undef)||(object==null)||isc.isA.String(object)||
            isc.isA.Boolean(object)||isc.isA.Number(object)||isc.isA.Function(object)||
            isc.isA.Date(object);
    }
,isc.A._clonePlainObject=function isc_MockupImporter__clonePlainObject(object){
        var undef;
        if(object===undef)return undef;
        if(object==null)return null;
        if(isc.isA.String(object)||isc.isA.Boolean(object)||
            isc.isA.Number(object)||isc.isA.Function(object))return object;
        if(isc.isA.Date(object))return object.duplicate();
        return null;
    }
,isc.A._getWidgetContentLayout=function isc_MockupImporter__getWidgetContentLayout(linkLayout,widget){
        if(widget._constructor=="TabSet"){
            var tabSet=this._findSameTabSet(linkLayout.layout,widget.tabs);
            if(tabSet){
                return{
                    layout:this._getInnerComponents(tabSet),
                    widget:tabSet
                };
            }
        }else if(widget._constructor=="SectionStack"){
            var sectionStack=this._findSameSectionStack(linkLayout.layout,widget.sections);
            if(sectionStack){
                return{
                    layout:this._getInnerComponents(sectionStack),
                    widget:sectionStack
                };
            }
        }
    }
,isc.A._findSameTabSet=function isc_MockupImporter__findSameTabSet(layout,tabs){
        for(var i=0;i<layout.length;i++){
            var linkWidget=layout[i];
            if(linkWidget._constructor=="TabSet"&&linkWidget.tabs.length==tabs.length){
                var tabSet=linkWidget;
                var sameTabs=true;
                for(var j=0;j<tabs.length;j++){
                    if(tabs[j].title!=linkWidget.tabs[j].title){
                        sameTabs=false;
                        break;
                    }
                };
                if(sameTabs){
                    return tabSet;
                }
            }
        };
        return null;
    }
,isc.A._findSameSectionStack=function isc_MockupImporter__findSameSectionStack(layout,sections){
        for(var i=0;i<layout.length;i++){
            var linkWidget=layout[i];
            if(linkWidget._constructor=="SectionStack"&&
                linkWidget.sections.length==sections.length)
            {
                var sectionStack=linkWidget;
                var sameSections=true;
                for(var j=0;j<sections.length;j++){
                    if(sections[j].title!=linkWidget.sections[j].title){
                        sameSections=false;
                        break;
                    }
                };
                if(sameSections){
                    return sectionStack;
                }
            }
        };
        return null;
    }
,isc.A._getInnerComponents=function isc_MockupImporter__getInnerComponents(container){
        var childWidgets=this._getInnerComponentsRecursive(container);
        for(var i=childWidgets.length-1;i>=1;i--){
            for(var j=i-1;j>=0;j--){
                if(childWidgets[i].ID==childWidgets[j].ID){
                    childWidgets.removeAt(i);
                    i--;
                    break;
                }
            };
        };
        return childWidgets;
    }
,isc.A._getInnerComponentsRecursive=function isc_MockupImporter__getInnerComponentsRecursive(container){
        var childWidgets=[];
        if(container.specialProperties.innerItems==null)return[];
        for(var i=0;i<container.specialProperties.innerItems.length;i++){
            var widget=container.specialProperties.innerItems[i];
            if(widget.specialProperties&&widget.specialProperties.innerItems){
                childWidgets.addList(this._getInnerComponentsRecursive(widget));
            }
            if(widget.specialProperties&&widget.specialProperties.additionalElements){
                childWidgets.addList(widget.specialProperties.additionalElements);
            }
            childWidgets.add(widget);
        };
        return childWidgets;
    }
,isc.A._convertBMMLWidgetsToISCWidgets=function isc_MockupImporter__convertBMMLWidgetsToISCWidgets(bmmlDataJS,fileName){
        for(var p=0;p<this.globalIDs.length;p++){
            if(!isc.isA.String(this.globalIDs[p])){
                if(!(this.globalIDs[p]&&window[this.globalIDs[p].ID])){
                    this.logWarn("Error - null entry or not a real global ID at index: "+p+
                                 " of: "+isc.echoFull(this.globalIDs));
                }
                window[this.globalIDs[p].ID].destroy();
            }else if(isc.DataSource.getDataSource(this.globalIDs[p])){
                isc.DataSource.getDataSource(this.globalIDs[p]).destroy();
            }
        }
        var resultLayout=[];
        var controls;
        if(bmmlDataJS&&bmmlDataJS.controls){
            controls=bmmlDataJS.controls.control;
        }else{
            this.logWarn("The data is not in BMML format"+
                    (fileName!=null?":  "+fileName:"."));
            isc.warn("The file is not in BMML format.",{target:this,methodName:"bmmlImportFailed"});
            controls=[];
        }
        if(!isc.isAn.Array(controls)){
            controls=[controls];
        }
        for(var i=0;i<controls.length;i++){
            var control=controls[i];
            this._downgradeControl(control);
            if("__group__"==control.controlTypeID){
                resultLayout.addList(this.convertGroup(control));
            }else{
                resultLayout.addList(this.convertControl(control));
            }
        };
        this.globalIDs.length=0;
        for(var p in resultLayout){
            if(resultLayout[p].ID)this.globalIDs.push(resultLayout[p].ID);
        }
        return resultLayout;
    }
,isc.A._downgradeControl=function isc_MockupImporter__downgradeControl(control){
        if(control.ID!=null&&control.controlID==null){
            control.controlID=control.ID;
            delete control.ID;
        }
        if(control.typeID!=null&&control.controlTypeID==null){
            control.controlTypeID=(control.typeID!="__group__"?"com.balsamiq.mockups::":"")+control.typeID;
            delete control.typeID;
        }
        if(control.properties!=null&&control.controlProperties==null){
            control.controlProperties=control.properties;
            delete control.properties;
        }
        if(control.children!=null&&control.groupChildrenDescriptors==null){
            control.groupChildrenDescriptors=control.children;
            delete control.children;
        }
        if(control.groupChildrenDescriptors){
            var children=control.groupChildrenDescriptors;
            var controls=children.control||children.controls.control;
            for(var i=0;i<controls.length;i++){
                this._downgradeControl(controls[i]);
            }
        }
        return control;
    }
,isc.A._downgradeSymbolAssets=function isc_MockupImporter__downgradeSymbolAssets(symbolLibraries){
        for(var i=0;i<symbolLibraries.length;i++){
            var symbolLibrary=symbolLibraries[i],
                controls=symbolLibrary.data.mockup.controls.control
            ;
            for(var k=0;k<controls.length;k++){
                var control=controls[k];
                this._downgradeControl(control);
            }
        }
    }
,isc.A._processSymbolsAssets=function isc_MockupImporter__processSymbolsAssets(resultLayout,symbolLibraries,callback){
        if(!this.mockupPath){
            callback(resultLayout);
            return;
        }
        var symbolsInfo=[];
        for(var i=0;i<resultLayout.length;i++){
            if(resultLayout[i]._constructor=="Symbol"){
                var symbol=resultLayout[i];
                var path=symbol.symbolPath,
                    ID=path.ID,
                    anchor=path.Anchor
                ;
                var bmmlDataJS=null;
                for(var j=0;j<symbolLibraries.length;j++){
                    var symbolLibrary=symbolLibraries[j];
                    if(ID!=symbolLibrary.ID)continue;
                    bmmlDataJS=symbolLibrary.data.mockup;
                    var symbolControl;
                    var symbolControlsArray=bmmlDataJS.controls?bmmlDataJS.controls.control:[];
                    if(anchor==null){
                        symbolControl={
                            groupChildrenDescriptors:{control:symbolControlsArray},
                            zOrder:0,
                            width:symbol.width,
                            height:symbol.height,
                            controlTypeID:"__group__",
                            measuredW:symbol.width,
                            measuredH:symbol.height
                        }
                    }else{
                        for(var k=0;k<symbolControlsArray.length;k++){
                            var controlID=symbolControlsArray[k].controlID;
                            if(controlID==anchor){
                                symbolControl=symbolControlsArray[k];
                                break;
                            }
                        };
                    }
                    symbolControl.x=0;
                    symbolControl.y=0;
                    symbolControl=this._handleSymbolOverride(symbolControl,symbol);
                    this._realignControlsOfSymbol(symbolControl);
                    var symbolLayout=
                        this._convertBMMLWidgetsToISCWidgets({
                            controls:{
                                control:[
                                    symbolControl
                                ]
                            }
                        });
                    resultLayout.addListAt(symbolLayout,resultLayout.indexOf(symbol));
                    resultLayout.remove(symbol);
                }
            }
        };
        callback(resultLayout);
    }
,isc.A._loadSymbolsAssets=function isc_MockupImporter__loadSymbolsAssets(resultLayout,callback){
        if(!this.mockupPath){
            callback(resultLayout);
            return;
        }
        var symbolsPath=this.assetPath||this.mockupPath.substring(0,this.mockupPath.lastIndexOf("/"));
        var symbolsInfo=[];
        var assetsToLoad=[];
        for(var i=0;i<resultLayout.length;i++){
            if(resultLayout[i]._constructor=="Symbol"){
                var path=resultLayout[i].symbolPath;
                if(path.startsWith("./")){
                    path=path.substring(2);
                }
                path=symbolsPath+"/"+path;
                var ind=path.indexOf("#");
                var symbolName=null;
                if(ind>0){
                    symbolName=path.substring(path.indexOf("#")+1);
                    path=path.substring(0,path.indexOf("#"));
                }
                symbolsInfo.add({
                    symbol:resultLayout[i],
                    path:path,
                    symbolName:symbolName
                })
                if(!assetsToLoad.contains(path)){
                    assetsToLoad.add(path);
                }
            }
        };
        if(assetsToLoad.length==0){
            callback(resultLayout);
            return;
        }
        var _this=this,
            assets={},
            loadCounter=0
        ;
        var updateLayoutWithAssets=function(){
            for(var j=0;j<symbolsInfo.length;j++){
                var symbolInfo=symbolsInfo[j],
                    asset=assets[symbolInfo.path]
                ;
                if(asset.failed){
                    var symbol=symbolInfo.symbol;
                    var symbolControl={
                        _constructor:"Label",
                        ID:"symbol_"+j,
                        contents:symbolInfo.symbolName,
                        left:symbol.left,
                        top:symbol.top,
                        width:symbol.width,
                        height:symbol.height,
                        border:"1px solid black",
                        align:"center",
                        zIndex:symbol.zIndex,
                        specialProperties:{
                            controlName:"com.balsamiq.mockups::Label"
                        }
                    };
                    resultLayout.addAt(symbolControl,resultLayout.indexOf(symbol));
                    resultLayout.remove(symbol);
                }else{
                    var bmmlDataJS=isc.XMLTools.toJS(isc.XMLTools.parseXML(asset.data)),
                        symbolControl,
                        symbolControlsArray=bmmlDataJS.controls?bmmlDataJS.controls.control:[]
                    ;
                    if(!isc.isAn.Array(symbolControlsArray))symbolControlsArray=[symbolControlsArray];
                    if(!symbolInfo.symbolName){
                        symbolControl={
                            groupChildrenDescriptors:{control:symbolControlsArray},
                            zOrder:0,
                            width:symbolInfo.symbol.width,
                            height:symbolInfo.symbol.height,
                            controlTypeID:"__group__",
                            measuredW:symbolInfo.symbol.width,
                            measuredH:symbolInfo.symbol.height
                        }
                    }else{
                        for(var k=0;k<symbolControlsArray.length;k++){
                            var controlName=symbolControlsArray[k].controlProperties.controlName;
                            if(unescape(controlName)==symbolInfo.symbolName){
                                symbolControl=symbolControlsArray[k];
                                break;
                            }
                        }
                    }
                    symbolControl.x=0;
                    symbolControl.y=0;
                    symbolControl=_this._handleSymbolOverride(symbolControl,
                        symbolInfo.symbol);
                    _this._realignControlsOfSymbol(symbolControl);
                    var symbolLayout=
                        _this._convertBMMLWidgetsToISCWidgets({
                            controls:{
                                control:[
                                    symbolControl
                                ]
                            }
                        });
                    resultLayout.addListAt(symbolLayout,resultLayout.indexOf(symbolInfo.symbol));
                    resultLayout.remove(symbolInfo.symbol);
                }
            }
            callback(resultLayout);
        };
        var assetsLoadedCallback=function(){
            var failedAssets=[];
            for(var path in assets){
                if(assets[path].failed){
                    var lastSlashIndex=path.lastIndexOf("/");
                    failedAssets.add(path.substring(lastSlashIndex+1));
                }
            }
            if(failedAssets.length>0){
                var failedAssetString="<ul><li>"+failedAssets.join("<li>")+"</ul>";
                isc.ask("This mockup may not render correctly in Reify as the following asset"+
                        (failedAssets.length>1?"s are":" is")+" missing:"+
                        failedAssetString+
                        "<P>If you choose to continue Reify will add placeholders.",function(){},{
                    buttons:[
                        isc.Button.create({
                            title:"Abort",
                            click:function(){
                                this.topElement.hide();
                                callback(null);
                            }
                        }),
                        isc.Button.create({
                            title:"Continue",
                            click:function(){
                                this.topElement.hide();
                                updateLayoutWithAssets()
                            }
                        })
                    ]
                });
            }else{
                updateLayoutWithAssets()
            }
        };
        for(var i=0;i<assetsToLoad.length;i++){
            var assetPath=assetsToLoad[i];
            assets[assetPath]={path:assetPath};
            isc.DMI.callBuiltin({
                methodName:"loadFile",
                arguments:[assetPath],
                callback:function(rpcResponse){
                    var loadedAssetPath=rpcResponse.context.data.arguments[0];
                    if(rpcResponse.status==isc.RPCResponse.STATUS_FAILURE){
                        assets[loadedAssetPath].failed=true;
                    }else{
                        assets[loadedAssetPath].data=rpcResponse.data;
                    }
                    loadCounter++;
                    if(loadCounter==assetsToLoad.length){
                        assetsLoadedCallback();
                    }
                },
                requestParams:{willHandleError:true}
            });
        }
    }
,isc.A._handleSymbolOverride=function isc_MockupImporter__handleSymbolOverride(symbolControl,widget){
        if(symbolControl.controlID){
            symbolControl.controlID=widget.ID+"_symbol"+symbolControl.controlID;
        }else{
            symbolControl.controlID=widget.ID;
        }
        symbolControl.x+=widget.left;
        symbolControl.y+=widget.top;
        symbolControl.zOrder=parseInt(symbolControl.zOrder)+widget.zIndex-1000000;
        var overrides=(widget.override?[widget.override]:widget.overrides);
        if(overrides){
            for(var o=0;o<overrides.length;o++){
                var override=overrides[o];
                var ID=override.ID||override.controlID;
                var path=ID.split(":");
                var control=symbolControl;
                for(var i=0;i<path.length;i++){
                    var children=control.groupChildrenDescriptors||control.children;
                    var controls=children.control||children.controls.control;
                    for(var j=0;j<controls.length;j++){
                        if(controls[j].controlID==path[i]){
                            control=controls[j];
                            break;
                        }
                    };
                };
                for(var overridePropertyName in override){
                    if(overridePropertyName!="ID"&&overridePropertyName!="controlID"){
                        for(var controlPropertyName in control){
                            if(overridePropertyName==controlPropertyName){
                                control[controlPropertyName]=override[overridePropertyName];
                            }
                        }
                    }
                    for(var controlPropertyName in control.controlProperties){
                        if(overridePropertyName==controlPropertyName){
                            control.controlProperties[controlPropertyName]=
                                override[overridePropertyName];
                        }
                    }
                }
            }
        }
        return symbolControl;
    }
,isc.A._realignControlsOfSymbol=function isc_MockupImporter__realignControlsOfSymbol(symbolControl){
        var children=symbolControl.groupChildrenDescriptors||symbolControl.children;
        var controls=children.control||children.controls.control;
        if(!isc.isAn.Array(controls))controls=[controls];
        var xMin=controls[0].x;
        var yMin=controls[0].y;
        for(var i=1;i<controls.length;i++){
            if(controls[i].x<xMin)xMin=controls[i].x;
            if(controls[i].y<yMin)yMin=controls[i].y;
        }
        for(var i=0;i<controls.length;i++){
            controls[i].x-=xMin;
            controls[i].y-=yMin;
        }
    }
,isc.A.convertGroup=function isc_MockupImporter_convertGroup(control){
        var transformRules=this._transformRules;
        var controls=[];
        var children=control.groupChildrenDescriptors||control.children;
        var innerControls=children.control||children.controls.control;
        if(!isc.isA.Array(innerControls)){
            innerControls=[innerControls];
        }
        for(var i=0;i<innerControls.length;i++){
            var innerControl=innerControls[i];
            var objects;
            if("__group__"==innerControl.controlTypeID){
                objects=this.convertGroup(innerControl);
            }else{
                objects=this.convertControl(innerControl);
            }
            for(var j=0;j<objects.length;j++){
                var propertyTranslations=transformRules.propertyTranslations;
                if(objects[j][propertyTranslations.x]!=null){
                    objects[j][propertyTranslations.x]=
                        parseInt(objects[j][propertyTranslations.x])+parseInt(control.x);
                }
                if(objects[j][propertyTranslations.y]!=null){
                    objects[j][propertyTranslations.y]=
                        parseInt(objects[j][propertyTranslations.y])+parseInt(control.y);
                }
                if(objects[j][propertyTranslations.zOrder]!=null){
                    objects[j][propertyTranslations.zOrder]=
                        parseInt(objects[j][propertyTranslations.zOrder])+
                        parseInt(control.zOrder);
                }
                if(control.isInGroup<0||innerControls.length>1){
                    objects[j].ID="group"+control.controlID+"_"+objects[j].ID;
                    if(objects[j].dataSource!=null){
                        objects[j].dataSource=
                            "group"+control.controlID+"_"+objects[j].dataSource;
                    }
                }
            }
            controls.addList(objects);
        }
        return controls;
    }
,isc.A.convertControl=function isc_MockupImporter_convertControl(control){
        var undef;
        var transformRules=this._transformRules;
        var scClass=this.getSCClass(control.controlTypeID);
        var componentType=control.controlTypeID.substring(control.controlTypeID.indexOf("::")+2);
        var smartclientWidget={
            ID:componentType+control.controlID,
            _constructor:scClass,
            specialProperties:{
                controlName:control.controlTypeID
            }
        };
        if(scClass==null){
            scClass="MockupElement";
            smartclientWidget._constructor=scClass;
            smartclientWidget.controlName=control.controlTypeID;
        }
        for(var attributeName in control){
            if(attributeName!="controlProperties"&&attributeName!="controlTypeID"){
                var value=control[attributeName];
                var smartclientAttributeName=
                    this.getSCPropertyName(control.controlTypeID,attributeName,value);
                if(smartclientAttributeName!=null){
                    smartclientWidget[smartclientAttributeName]=value;
                }else{
                    if(!this.dropExtraProperties||
                        this.allowedExtraProperties.contains(attributeName))
                    {
                        smartclientWidget[attributeName]=value;
                    }else{
                        smartclientWidget.specialProperties[attributeName]=value;
                    }
                }
            }
        }
        var markup;
        if(control.controlProperties!=null){
            for(var attributeName in control.controlProperties){
                var value=control.controlProperties[attributeName];
                if(typeof value=="string")value=unescape(value);
                if(markup===undef&&attributeName=="markup"){
                    markup=(value=="true");
                }
                if(attributeName=="customID"){
                    var customID=decodeURIComponent(value);
                    if(isc.MockupImporter._isValidID(customID)){
                        smartclientWidget.ID=customID;
                    }else{
                        this.logWarn("Ignoring invalid customID \""+customID+"\".");
                    }
                }else if(attributeName=="customData"){
                    var customProperties=decodeURIComponent(value),
                        result=isc.MockupImporter._parseCustomProperties(customProperties),
                        keys=result.keys,
                        values=result.values,
                        errors=result.errors,
                        i,len;
                    if(!errors.isEmpty()){
                        var sb=isc.StringBuffer.create();
                        sb.append("Ignoring invalid customData configurations:  ");
                        for(i=0,len=errors.length;i<len;++i){
                            if(i>0)sb.append(", ");
                            sb.append("\"",errors[i],"\"");
                        }
                        this.logWarn(sb.release(false));
                    }
                    var isValidID=isc.MockupImporter._isValidID;
                    for(i=0,len=keys.length;i<len;++i){
                        var key=keys[i],value=values[i];
                        if(isValidID(key)){
                            if(key=="schemaName"){
                                smartclientWidget._tagName=value;
                                delete smartclientWidget._constructor;
                                scClass=null;
                            }else if(key=="constructor"){
                                scClass=smartclientWidget._constructor=value;
                            }else{
                                smartclientWidget[key]=value;
                            }
                        }else{
                            this.logWarn(
                                    "Ignoring customData for invalid property name "+
                                    "\""+key+"\".");
                        }
                    }
                }else{
                    var smartclientAttributeName=
                        this.getSCPropertyName(control.controlTypeID,attributeName,value);
                    value=this.getSCPropertyValue(control.controlTypeID,attributeName,value);
                    if(smartclientAttributeName!=null){
                        smartclientWidget[smartclientAttributeName]=value;
                    }else{
                        if(!this.dropExtraProperties||
                            this.allowedExtraProperties.contains(attributeName))
                        {
                            smartclientWidget[attributeName]=value;
                        }else{
                            smartclientWidget.specialProperties[attributeName]=value;
                        }
                    }
                }
            }
        }
        var controlName=smartclientWidget.specialProperties.controlName,
            usuallyMarkup=transformRules.markupItems.contains(controlName);
        smartclientWidget.specialProperties.markup=markup||(markup===undef&&usuallyMarkup);
        smartclientWidget=this.afterConvert(control.controlTypeID,scClass,
            smartclientWidget);
        var result=[smartclientWidget];
        var additionalElements=
            this.getAdditionalElements(control.controlTypeID,scClass,smartclientWidget);
        if(additionalElements!=null){
            if(smartclientWidget.specialProperties==null){
                smartclientWidget.specialProperties={};
            }
            smartclientWidget.specialProperties.additionalElements=[];
            smartclientWidget.specialProperties.additionalElements.addAll(additionalElements);
            additionalElements.add(smartclientWidget);
            result=additionalElements
        }
        return result;
    }
);
isc.evalBoundary;isc.B.push(isc.A.getSCClass=function isc_MockupImporter_getSCClass(bmmlControlName){
        return this._transformRules.classTranslations[bmmlControlName];
    }
,isc.A.getSCPropertyName=function isc_MockupImporter_getSCPropertyName(bmmlControlName,bmmlPropertyName,bmmlPropertyValue){
        var transformRules=this._transformRules;
        var widgetProperties=transformRules.widgetPropertyTranslations[bmmlControlName];
        if(widgetProperties!=null){
            var scPropertyName=widgetProperties[bmmlPropertyName];
            if(scPropertyName!=null){
                return scPropertyName;
            }
        }
        return transformRules.propertyTranslations[bmmlPropertyName];
    }
,isc.A.getSCPropertyValue=function isc_MockupImporter_getSCPropertyValue(bmmlControlName,bmmlPropertyName,bmmlPropertyValue){
        var widgetProperties=this._transformRules.widgetPropertyTranslations[bmmlControlName];
        if(widgetProperties!=null&&widgetProperties.controlPropertiesParser!=null){
            var value=
                widgetProperties.controlPropertiesParser(bmmlPropertyName,bmmlPropertyValue);
            if(value!=null){
                if(this.trimWhitespace&&value.MockDataSource&&value.MockDataSource.mockDataType!="tree"){
                    var md=value.MockDataSource.mockData;
                    var processedMd=isc.SB.create();
                    var rowsData=md.split("\n");
                    for(var i=0;i<rowsData.length;i++){
                        var row="";
                        var d=rowsData[i].split(",");
                        for(var j=0;j<d.length;j++){
                            processedMd.append(d[j].trim());
                            if(j+1<d.length){
                                processedMd.append(",");
                            }else if(i+1<rowsData.length){
                                processedMd.append("\n");
                            }
                        }
                    }
                    value.MockDataSource.mockData=processedMd.release(false);
                }
                return value;
            }
        }
        return bmmlPropertyValue;
    }
,isc.A.afterConvert=function isc_MockupImporter_afterConvert(bmmlName,name,widget){
        var transformRules=this._transformRules;
        if(widget.zIndex!=null){
            widget.zIndex=1000000+parseInt(widget.zIndex);
        }
        if(widget.width==null||widget.width=='-1'){
            if(widget.measuredW&&widget.measuredW!="0"){
                widget.width=widget.measuredW;
            }else{
                if(widget.specialProperties.measuredW!="0"){
                    widget.width=widget.specialProperties.measuredW;
                }
            }
        }
        if(widget.height==null||widget.height=='-1'){
            if(widget.measuredH&&widget.measuredH!="0"){
                widget.height=widget.measuredH;
            }else{
                if(widget.specialProperties.measuredH!="0"){
                    widget.height=widget.specialProperties.measuredH;
                }
            }
        }
        var widgetPropertyTranslations=transformRules.widgetPropertyTranslations[bmmlName];
        if(widgetPropertyTranslations&&widgetPropertyTranslations.afterInit){
            widgetPropertyTranslations.afterInit(name,widget);
        }
        if(widgetPropertyTranslations&&widgetPropertyTranslations.mapAsset&&this.assets){
            var asset=widgetPropertyTranslations.mapAsset(name,widget,this.assets);
        }
        if(widget.height)widget.height=parseInt(widget.height);
        if(widget.top)widget.top=parseInt(widget.top);
        if(widget.left)widget.left=parseInt(widget.left);
        if(widget.width)widget.width=parseInt(widget.width);
        if(transformRules.formItems.contains(name)){
            widget.showTitle=false;
            var form={
                _constructor:'DynamicForm',
                ID:widget.ID,
                height:widget.height,
                top:widget.top,
                left:widget.left,
                width:widget.width,
                zIndex:widget.zIndex,
                title:widget.title,
                items:[widget],
                specialProperties:widget.specialProperties
            };
            if(widget.title==null){
                delete form.title;
                form.numCols=1;
            }
            if(form.height<widget.height){
                widget.height=form.height;
            }
            delete widget.ID;
            delete widget.zIndex;
            delete widget.left;
            delete widget.top;
            widget=form;
        }
        return widget;
    }
,isc.A.getAdditionalElements=function isc_MockupImporter_getAdditionalElements(bmmlName,name,widget){
        var widgetPropertyTranslations=this._transformRules.widgetPropertyTranslations[bmmlName];
        if(widgetPropertyTranslations&&widgetPropertyTranslations.getAdditionalElements){
            return widgetPropertyTranslations.getAdditionalElements(name,widget);
        }
        return null;
    }
,isc.A.processHeuristics=function isc_MockupImporter_processHeuristics(layout){
        var containers=[],
            transformRules=this._transformRules;
        for(var i=0;i<layout.length;i++){
            if(layout[i].specialProperties){
                var controlName=layout[i].specialProperties.controlName;
                var widgetProperties=transformRules.widgetPropertyTranslations[controlName];
                if(widgetProperties&&widgetProperties.addChild){
                    containers.add(layout[i]);
                    layout[i].contained=[];
                    layout[i].headerContained=[];
                    layout[i].markupContained=[];
                }
                if(layout[i].members){
                    layout[i].contained=[];
                }
            }
        }
        layout=this.processContainersHeuristic(layout,containers);
        layout=this.processStackHeuristic(layout,containers);
        layout=this.processFormsHeuristic(layout,containers);
        layout=this.removeExtraContainers(layout,containers);
        layout=this.processValuesManagers(layout,containers);
        layout=this.processVLayoutForms(layout,containers);
        layout=this.processAddingToContainersHeuristic(layout,containers);
        if(this.fillSpace){
            layout=this.processFluidLayoutHeuristic(layout,containers);
        }
        layout=this.processTabVStackHeuristic(layout,containers);
        return layout;
    }
,isc.A.processVLayoutForms=function isc_MockupImporter_processVLayoutForms(layout,containers){
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(container._constructor=="VLayout"||container._constructor=="VStack"){
                for(var j=0;j<container.contained.length;j++){
                    var item=container.contained[j];
                    if(item._constructor=="DynamicForm"&&(item.items||item.fields)){
                        var items=item.items||item.fields;
                        for(var k=0;k<items.length;k++){
                            var formItem=items[k];
                            if(formItem._constructor=="TextAreaItem"){
                                formItem.height="*";
                            }
                        }
                    }
                }
            }
            var isHorizontal=container._constructor=="HStack"||
                container._constructor=="HLayout";
            var isVertical=container._constructor=="VStack"||
                container._constructor=="VLayout";
            if(isHorizontal||isVertical){
                if((isHorizontal&&(container.specialProperties.overrideHeight||container.specialProperties.fullHeight))||
                    (isVertical&&(container.specialProperties.overrideWidth||container.specialProperties.fullWidth))){
                    for(var j=0;j<container.contained.length;j++){
                        var item=container.contained[j];
                        if(item.showResizeBar)item.resizeBarTarget="next";
                    }
                }
            }
        }
        return layout;
    }
,isc.A.processContainersHeuristic=function isc_MockupImporter_processContainersHeuristic(layout,containers){
        var transformRules=this._transformRules;
        var controlList=[];
        var dataSourceList=[];
        for(var i=0;i<layout.length;i++){
            if(layout[i].left!=null){
                layout[i].absX=layout[i].left;
            }
            if(layout[i].top!=null){
                layout[i].absY=layout[i].top;
            }
        }
        for(var i=0;i<layout.length;i++){
            var control=layout[i];
            if(control._constructor=="MockDataSource"){
                dataSourceList.addAt(control,0);
            }else{
                var container=this.findBestContainer(containers,control);
                if(container!=null){
                    var containerBmmlName=container.specialProperties.controlName;
                    var controlBmmlName=control.specialProperties.controlName;
                    var controlBmmlMarkup=control.specialProperties.markup;
                    var rules=transformRules.widgetPropertyTranslations[containerBmmlName];
                    control.top-=container.absY;
                    control.left-=container.absX;
                    control.autoDraw=false;
                    if(controlBmmlMarkup){
                        container.markupContained.add(control);
                        control.top-=rules.getTopMargin(container);
                        control.left-=rules.getLeftMargin(container);
                    }else{
                        var controlAreaName=null;
                        if(rules.getControlAreaName){
                            controlAreaName=rules.getControlAreaName(container,control);
                        }
                        if(controlAreaName){
                            container.headerContained.add({
                                controlAreaName:controlAreaName,
                                control:control
                            });
                        }else{
                            container.contained.add(control);
                            control.top-=rules.getTopMargin(container);
                            control.left-=rules.getLeftMargin(container);
                            var controlRules=
                                transformRules.widgetPropertyTranslations[controlBmmlName];
                            if(controlRules&&controlRules.sloppyEdgeControl){
                                if((control.left+control.width)>container.width){
                                    control.width=container.width-control.left;
                                }
                                if((control.top+control.height)>container.height){
                                    control.height=container.height-control.top;
                                }
                            }
                        }
                    }
                    control.top=Math.max(0,control.top);
                    control.left=Math.max(0,control.left);
                }
                controlList.add(control);
            }
        }
        var orderedControlList=[];
        for(var i=0;i<controlList.length;i++){
            var control=controlList[i];
            var childItems=this.getAllChildItems(control);
            if(childItems.length==0){
                orderedControlList.add(control,0);
            }else{
                var lastIndex=-1;
                for(var j=0;j<childItems.length;j++){
                    var index=orderedControlList.indexOf(childItems[j]);
                    if(index>=0&&lastIndex<index){
                        lastIndex=index;
                    }
                }
                if(lastIndex>=0){
                    orderedControlList.add(control,lastIndex+1);
                }else{
                    orderedControlList.add(control,0);
                }
            }
        }
        var outerControls=[];
        for(var i=0;i<orderedControlList.length;i++){
            var control=orderedControlList[i];
            if(containers.contains(control))continue;
            var hasContainer=false;
            for(var j=0;j<containers.length;j++){
                var container=containers[j];
                if((container.contained&&container.contained.contains(control))||
                    (container.markupContained&&container.markupContained.contains(control)))
                {
                    hasContainer=true;
                    break;
                }
                if(container.headerContained){
                    for(var k=0;k<container.headerContained.length;k++){
                        if(container.headerContained[k].control==control){
                            hasContainer=true;
                            break;
                        }
                    }
                    if(hasContainer){
                        break;
                    }
                }
            }
            if(!hasContainer){
                outerControls.add(control);
            }
        }
        if(outerControls.length>0){
            for(var j=0;j<outerControls.length-1;j++){
                outerControls[j].autoDraw=false;
                var fakeContainer={
                    ID:"outer_"+j,
                    _constructor:"VStack",
                    fake:true,
                    contained:[outerControls[j]],
                    markupContained:[],
                    specialProperties:{
                        controlName:"Stack"
                    },
                    top:outerControls[j].top,
                    left:outerControls[j].left,
                    width:outerControls[j].width,
                    height:outerControls[j].height
                };
                var changed;
                do{
                    changed=false;
                    for(var k=j+1;k<outerControls.length;k++){
                        var outerControl=outerControls[k];
                        var outerControlLeft=outerControl.left;
                        var outerControlRight=outerControl.left+outerControl.width;
                        var outerControlTop=outerControl.top;
                        var outerControlBottom=outerControl.top+outerControl.height;
                        var fakeContainerLeft=fakeContainer.left;
                        var fakeContainerRight=fakeContainer.left+fakeContainer.width;
                        var fakeContainerTop=fakeContainer.top;
                        var fakeContainerBottom=fakeContainer.top+fakeContainer.height;
                        var fakeContainerLeftZone=fakeContainerLeft-this.maxOuterControlsDistance;
                        var fakeContainerRightZone=fakeContainerRight+this.maxOuterControlsDistance;
                        var fakeContainerTopZone=fakeContainerTop-this.maxOuterControlsDistance;
                        var fakeContainerBottomZone=fakeContainerBottom+this.maxOuterControlsDistance;
                        var overlap=
                            outerControlLeft<fakeContainerRightZone&&
                            outerControlRight>fakeContainerLeftZone&&
                            outerControlTop<fakeContainerBottomZone&&
                            outerControlBottom>fakeContainerTopZone;
                        if(overlap){
                            fakeContainer.contained.add(outerControl);
                            outerControl.autoDraw=false;
                            var bottom=Math.max(fakeContainerBottom,outerControlBottom);
                            var right=Math.max(fakeContainerRight,outerControlRight);
                            fakeContainer.top=Math.min(fakeContainerTop,outerControlTop);
                            fakeContainer.left=Math.min(fakeContainerLeft,outerControlLeft);
                            fakeContainer.height=bottom-fakeContainer.top;
                            fakeContainer.width=right-fakeContainer.left;
                            outerControls.removeAt(k);
                            k--;
                            changed=true;
                        }
                    }
                }while(changed);
                for(var k=0;k<fakeContainer.contained.length;k++){
                    fakeContainer.contained[k].left-=fakeContainer.left;
                    fakeContainer.contained[k].top-=fakeContainer.top;
                    var specialProperties=fakeContainer.contained[k].specialProperties;
                    if(specialProperties&&specialProperties.markup){
                        fakeContainer.markupContained.add(fakeContainer.contained[k]);
                        fakeContainer.contained.removeAt(k);
                        k--;
                    }
                }
                fakeContainer.absX=fakeContainer.left;
                fakeContainer.absY=fakeContainer.top;
                containers.add(fakeContainer);
                orderedControlList.add(fakeContainer);
            }
        }
        orderedControlList.addListAt(dataSourceList,0);
        return orderedControlList;
    }
,isc.A.getAllChildItems=function isc_MockupImporter_getAllChildItems(control,containedOnly){
        if(control.contained==null){
            return[];
        }
        var childItems=[];
        childItems.addList(control.contained);
        if(containedOnly!=true){
            if(control.markupContained){
                childItems.addList(control.markupContained);
            }
            if(control.headerContained){
                for(var i=0;i<control.headerContained.length;i++){
                    childItems.add(control.headerContained[i].control);
                }
            }
        }
        for(var i=0;i<control.contained.length;i++){
            if(control.contained[i].contained&&control.contained[i].contained.length>0){
                childItems.addList(this.getAllChildItems(control.contained[i]));
            }
        }
        return childItems;
    }
,isc.A.findBestContainer=function isc_MockupImporter_findBestContainer(containers,control){
        var transformRules=this._transformRules;
        var right=control.absX+(control.width==null?0:control.width);
        var bottom=control.absY+(control.height==null?0:control.height);
        var match=[];
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(container==control){
                continue;
            }
            var specialProperties=container.specialProperties;
            if(specialProperties&&specialProperties.markup){
                continue;
            }
            var containerLeft=container.absX-2;
            var containerRight=container.absX+container.width+2;
            var containerTop=container.absY-2;
            var containerBottom=container.absY+container.height+2;
            if(containerLeft<=control.absX&&containerTop<=control.absY&&
                control.zIndex>=container.zIndex)
            {
                var prop;
                if(control.specialProperties){
                    var controlName=control.specialProperties.controlName;
                    prop=transformRules.widgetPropertyTranslations[controlName];
                }
                if(prop!=null&&prop.sloppyEdgeControl){
                    if((containerRight+this.sloppyEdgeControlOverflow)>=right&&
                        (containerBottom+this.sloppyEdgeControlOverflow)>=bottom)
                    {
                        match.add(container);
                    }
                }else{
                    if(containerRight>=right&&containerBottom>=bottom){
                        match.add(container);
                    }
                }
            }
        }
        if(match.length>0){
            var container=match[0];
            for(var i=1;i<match.length;i++){
                if(container.width>match[i].width||container.height>match[i].height){
                    container=match[i];
                }
            }
            return container;
        }else{
            return null;
        }
    }
,isc.A.processStackHeuristic=function isc_MockupImporter_processStackHeuristic(layout,containers){
        var transformRules=this._transformRules;
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            var isHorizontal=container._constructor=="HStack"||
                container._constructor=="HLayout";
            for(var cind=0;cind<container.contained.length;cind++){
                var widget=container.contained[cind];
                if(widget._constructor=="Scrollbar"){
                    var cName=widget.specialProperties.controlName;
                    var containerBmmlName=container.specialProperties.controlName;
                    var containerPropertyTranslations=
                        transformRules.widgetPropertyTranslations[containerBmmlName];
                    var isRemove=false;
                    if(cName=="com.balsamiq.mockups::VerticalScrollBar"){
                        var widgetRightBorder=widget.left+widget.width;
                        var containerRightBorder=container.width-containerPropertyTranslations.getRightMargin(container);
                        isRemove=Math.abs(containerRightBorder-widgetRightBorder)<10;
                    }else{
                        var widgetBottomBorder=widget.top+widget.height;
                        var containerBottomBorder=container.height-containerPropertyTranslations.getBottomMargin(container);
                        isRemove=Math.abs(containerBottomBorder-widgetBottomBorder)<10;
                    }
                    if(isRemove){
                        container.overflow="auto";
                        layout.remove(widget);
                        container.contained.removeAt(cind);
                        cind--;
                    }
                }
            }
            container.contained.sort(function(a,b){
                if(a.top==b.top){
                    return a.left-b.left;
                }
                return a.top-b.top;
            });
            this.handleElementsOverlap(container.contained);
            this.addLabelsToFormItems(layout,container);
            var verticallySplitted=
                this.splitElementsByContainers(container.contained,"top","height");
            var horizontallySplitted=
                this.splitElementsByContainers(container.contained,"left","width");
            var processed;
            if(horizontallySplitted.size()>1&&horizontallySplitted.size()<5&&
                (verticallySplitted.size()<2||
                    horizontallySplitted.size()<verticallySplitted.size())&&
                container._constructor!="HStack"&&container._constructor!="HLayout")
            {
                processed=this.processStacksRecursively(container,"root_horizontal");
                var stack={
                    _constructor:"HStack",
                    ID:container.ID+"_HStack",
                    contained:container.contained,
                    specialProperties:{
                        controlName:"Stack",
                        containerName:"HStack",
                        fullWidth:true,
                        fullHeight:true
                    }
                };
                var zIndex=1000000;
                var maxHeight=0;
                for(var j=0;j<stack.contained.length;j++){
                    if(stack.contained[j].zIndex){
                       zIndex=Math.max(zIndex,stack.contained[j].zIndex);
                    }
                    if(stack.contained[j].height){
                        maxHeight=Math.max(maxHeight,stack.contained[j].height);
                    }
                };
                stack.zIndex=zIndex;
                stack.height=maxHeight;
                container.contained=[stack];
                processed.add(stack);
            }else{
                processed=this.processStacksRecursively(container,"root_vertical");
            }
            containers.addListAt(processed,i);
            var containerIndex=layout.indexOf(container);
            layout.addListAt(processed,containerIndex);
            i+=processed.length;
        }
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            var isHorizontal=container._constructor=="HStack"||
                container._constructor=="HLayout";
            var membersMargin=0;
            for(var j=1;j<container.contained.length;j++){
                var currentWidget=container.contained[j];
                var previousWidget=container.contained[j-1];
                var nextWidget=container.contained[j+1];
                var specialProperties=currentWidget.specialProperties;
                var cName=specialProperties&&specialProperties.controlName;
                if(cName=="com.balsamiq.mockups::HSplitter"||
                    cName=="com.balsamiq.mockups::HRule"||
                    cName=="com.balsamiq.mockups::VSplitter"||
                    cName=="com.balsamiq.mockups::VRule")
                {
                    previousWidget.showResizeBar=true;
                    container.overflow="auto";
                    layout.remove(container.contained[j]);
                    container.contained.removeAt(j);
                    j--;
                    continue;
                }
                if((isHorizontal&&cName=="com.balsamiq.mockups::VerticalScrollBar")||
                    (!isHorizontal&&cName=="com.balsamiq.mockups::HorizontalScrollBar"))
                {
                    container.overflow="auto";
                    if(isHorizontal){
                        previousWidget.width+=currentWidget.width;
                    }else{
                        previousWidget.height+=currentWidget.height;
                    }
                    layout.remove(currentWidget);
                    container.contained.removeAt(j);
                    j--;
                    continue;
                }
                var margin;
                if(isHorizontal){
                    margin=currentWidget.left-previousWidget.left-previousWidget.width;
                }else{
                    margin=currentWidget.top-previousWidget.top-previousWidget.height;
                }
                if(membersMargin==0){
                    membersMargin=margin;
                }else if(Math.abs(membersMargin-margin)>5){
                    membersMargin=0;
                    break;
                }
            }
            var containerBmmlName=container.specialProperties.controlName;
            var widgetPropertyTranslations=
                transformRules.widgetPropertyTranslations[containerBmmlName];
            if(widgetPropertyTranslations.canUseMargin==null||
                widgetPropertyTranslations.canUseMargin)
            {
                if(membersMargin>0){
                    for(var j=0;j<container.contained.length-1;j++){
                        if(container.contained[j].showResizeBar!=true){
                            container.membersMargin=membersMargin;
                            break;
                        }
                    }
                }
            }else{
                membersMargin=0;
            }
            for(var j=1;j<container.contained.length;j++){
                var currentWidget=container.contained[j];
                var previousWidget=container.contained[j-1];
                var extraSpace=0;
                if(isHorizontal){
                    if(currentWidget.absX!=null&&previousWidget.absX!=null){
                        extraSpace=currentWidget.absX-membersMargin-
                        (previousWidget.absX+previousWidget.width);
                    }else{
                        extraSpace=currentWidget.left-membersMargin-
                        (previousWidget.left+previousWidget.width);
                    }
                }else{
                    if(currentWidget.absY!=null&&previousWidget.absY!=null){
                        extraSpace=currentWidget.absY-membersMargin-
                        (previousWidget.absY+previousWidget.height);
                    }else{
                        extraSpace=currentWidget.top-membersMargin-
                        (previousWidget.top+previousWidget.height);
                    }
                }
                if(previousWidget.showResizeBar){
                    var halfSpace=Math.round((extraSpace+membersMargin-4)/2);
                    if(isHorizontal){
                        previousWidget.width+=halfSpace;
                        currentWidget.width+=halfSpace;
                        currentWidget.left-=halfSpace;
                        if(currentWidget.contained){
                            for(var k=0;k<currentWidget.contained.length;k++){
                                currentWidget.contained[k].specialProperties.left=
                                    currentWidget.contained[k].left;
                                currentWidget.contained[k].left+=halfSpace
                            }
                        }
                    }else{
                        previousWidget.height+=halfSpace;
                        currentWidget.height+=halfSpace;
                        currentWidget.top-=halfSpace;
                        if(currentWidget.contained){
                            for(var k=0;k<currentWidget.contained.length;k++){
                                currentWidget.contained[k].specialProperties.top=
                                    currentWidget.contained[k].top;
                                currentWidget.contained[k].top+=halfSpace
                            }
                        }
                    }
                }else if(extraSpace>0){
                    previousWidget.extraSpace=extraSpace;
                }
            }
        }
        return layout;
    }
,isc.A.addLabelsToFormItems=function isc_MockupImporter_addLabelsToFormItems(layout,container){
        for(var i=0;i<container.contained.length;i++){
            var label=container.contained[i];
            if(label._constructor!="Label")continue;
            if(label.specialProperties.controlName=="com.balsamiq.mockups::Icon")continue;
            for(var j=0;j<container.contained.length;j++){
                var formItem=container.contained[j],
                    items=formItem.items||formItem.fields
                ;
                if(formItem._constructor!="DynamicForm"||items==null){
                    continue;
                }
                var below=(formItem.top>label.top)&&
                     (formItem.top-(label.top+label.height)<this.labelMaxOffset)&&
                     ((Math.abs(formItem.left-label.left)<this.labelMaxOffset)||
                     (label.left<=formItem.left&&
                         (label.left+label.width)>=(formItem.left+formItem.width)
                     ));
                var right=(formItem.left>label.left)&&
                      (formItem.left-(label.left+label.width)<2*this.labelMaxOffset)&&
                      (label.top+this.labelMaxOffset>formItem.top)&&
                      (label.top+label.height-this.labelMaxOffset<
                      formItem.top+formItem.height);
                if(below||right){
                    if(items[0].title){
                        if(below){
                            var isLabelAbove=false;
                            for(var l=0;l<container.contained.length;l++){
                                var label2=container.contained[l];
                                if(i!=l&&label2._constructor=="Label"){
                                    var above=(label.top>label2.top&&
                                          (label.top-(label2.top+label2.height))<
                                            this.labelMaxOffset)&&
                                          (Math.abs(label.left-label2.left)<
                                            this.labelMaxOffset);
                                    if(above){
                                        isLabelAbove=true;
                                        break;
                                    }
                                }
                            }
                            if(isLabelAbove){
                                continue;
                            }
                        }
                    }else{
                        if(label.contents==null)continue;
                        items[0].showTitle=true;
                        label.contents=String(label.contents);
                        if(label.contents.endsWith(":")){
                            label.contents=label.contents.substring(0,label.contents.length-1);
                        }
                        items[0].title=label.contents;
                        if(below){
                            formItem.numCols=1;
                            items[0].titleOrientation="top";
                            var labHeight=17;
                            formItem.height+=labHeight;
                            formItem.top=Math.max(0,formItem.top-labHeight);
                            formItem.absY-=labHeight;
                        }else{
                            var oldFormItemWidth=formItem.width;
                            formItem.numCols=2;
                            formItem.width=formItem.left+formItem.width-label.left;
                            formItem.left=label.left;
                            formItem.absX=label.absX;
                            if(formItem.height>label.height*2){
                                var td=Math.abs(label.top-formItem.top);
                                var cd=Math.abs(formItem.top+formItem.height/2-label.top-label.height/2);
                                var bd=Math.abs(formItem.height-label.top-label.height);
                                if(td<cd&&td<bd){
                                    items[0].titleVAlign="top";
                                }else if(bd<cd&&bd<td){
                                    items[0].titleVAlign="bottom";
                                }
                            }
                            if(isc.isA.String(items[0].width)){
                                formItem.titleWidth=formItem.width-oldFormItemWidth+1;
                            }else{
                                formItem.titleWidth=formItem.width-items[0].width+1;
                            }
                        }
                        container.contained.removeAt(i);
                        layout.remove(label);
                        i--;
                        break;
                    }
                }
            }
        }
    }
,isc.A.processStacksRecursively=function isc_MockupImporter_processStacksRecursively(container,orientation){
        container.contained.sort(function(a,b){
            if(a.top==b.top){
                return a.left-b.left;
            }
            return a.top-b.top;
        });
        var elements=container.contained;
        if(orientation=="vertical"||orientation=="root_vertical"){
            var splittedElements=this.splitElementsByContainers(elements,"top","height");
            if(orientation=="vertical"&&splittedElements.length==1){
                return[];
            }
            splittedElements.sort(function(a,b){
                return a.top-b.top;
            });
            container.contained=[];
            var stacks=[];
            for(var i=0;i<splittedElements.length;i++){
                var elementsData=splittedElements[i];
                if(elementsData.children.length==1){
                    container.contained.add(elementsData.children[0]);
                }else{
                    var stack={
                        _constructor:"HStack",
                        ID:container.ID+"_HStack"+i,
                        contained:elementsData.children,
                        top:elementsData.top,
                        height:elementsData.height,
                        absY:elementsData.children[0].absY,
                        absX:elementsData.children[0].absX,
                       specialProperties:{
                            controlName:"Stack"
                       }
                    };
                    var zIndex=1000000;
                    var minX=1000000;
                    var maxX=0;
                    for(var j=0;j<elementsData.children.length;j++){
                        var childElement=elementsData.children[j];
                        childElement.top-=stack.top;
                        if(childElement.top<0)childElement.top=0;
                        if(childElement.zIndex){
                           zIndex=Math.max(zIndex,childElement.zIndex);
                        }
                        minX=Math.min(minX,childElement.left);
                        maxX=Math.max(maxX,childElement.left+childElement.width);
                    }
                    stack.zIndex=zIndex;
                    stack.width=maxX-minX;
                    stack.left=minX;
                    for(var j=0;j<elementsData.children.length;j++){
                        elementsData.children[j].left-=stack.left;
                    }
                    var innerStacks=this.processStacksRecursively(stack,"horizontal");
                    container.contained.add(stack);
                    if(innerStacks.length!=0){
                        stacks.addList(innerStacks);
                    }
                    stacks.add(stack);
                }
            }
            return stacks;
        }else{
            var splittedElements=this.splitElementsByContainers(elements,"left","width");
            if(orientation=="horizontal"&&splittedElements.length==1){
                return[];
            }
            splittedElements.sort(function(a,b){
                return a.left-b.left;
            });
            container.contained=[];
            var stacks=[];
            for(var i=0;i<splittedElements.length;i++){
                var elementsData=splittedElements[i];
                if(elementsData.children.length==1){
                    container.contained.add(elementsData.children[0]);
                }else{
                    var stack={
                        _constructor:"VStack",
                        ID:container.ID+"_VStack"+i,
                        contained:elementsData.children,
                        left:elementsData.left,
                        width:elementsData.width,
                        absX:elementsData.children[0].absX,
                        absY:elementsData.children[0].absY,
                        autoDraw:false,
                        specialProperties:{
                            controlName:"Stack"
                        }
                    };
                    var zIndex=1000000;
                    var minY=1000000;
                    var maxY=0;
                    for(var j=0;j<elementsData.children.length;j++){
                        var childElement=elementsData.children[j];
                        childElement.left-=stack.left;
                        if(childElement.left<0){
                            childElement.left=0;
                        }
                        if(childElement.zIndex){
                           zIndex=Math.max(zIndex,childElement.zIndex);
                        }
                        minY=Math.min(minY,childElement.top);
                        maxY=Math.max(maxY,childElement.top+childElement.height);
                    }
                    stack.zIndex=zIndex;
                    stack.height=maxY-minY;
                    stack.top=minY;
                    for(var j=0;j<elementsData.children.length;j++){
                        elementsData.children[j].top-=stack.top;
                    }
                    var innerStacks=this.processStacksRecursively(stack,"vertical");
                    container.contained.add(stack);
                    if(innerStacks.length!=0){
                        stacks.addList(innerStacks);
                    }
                    stacks.add(stack);
                }
            }
            return stacks;
        }
    }
);
isc.evalBoundary;isc.B.push(isc.A.splitElementsByContainers=function isc_MockupImporter_splitElementsByContainers(elements,minName,sizeName){
        var containersData=[],
            transformRules=this._transformRules;
        for(var i=0;i<elements.length;i++){
            var element=elements[i],
                elementSize=element[sizeName],
                specialProperties=element.specialProperties;
            if(specialProperties){
                var elementBmmlName=specialProperties.controlName;
                var widgetPropertyTranslations=
                    transformRules.widgetPropertyTranslations[elementBmmlName];
                if(widgetPropertyTranslations&&widgetPropertyTranslations.sloppyEdgeControl&&
                    widgetPropertyTranslations.estimateControlSize)
                {
                    elementSize=
                        widgetPropertyTranslations.estimateControlSize(element)[sizeName];
                    element[sizeName]=elementSize;
                }
            }
            var matchingContainer=null;
            for(var j=0;j<containersData.length;j++){
                var container=containersData[j];
                var elementSizeQuarter=elementSize/4;
                var containerSizeQuarter=container[sizeName];
                containerSizeQuarter/=4;
                var minOverlap=Math.min(elementSizeQuarter,containerSizeQuarter);
                if((element[minName]+minOverlap>=container[minName])&&
                    (element[minName]+minOverlap<container[minName]+container[sizeName]))
                {
                    matchingContainer=container;
                    break;
                }
            }
            if(matchingContainer!=null){
                matchingContainer.children.add(element);
                if(element[minName]<matchingContainer[minName]||
                   (element[minName]+elementSize>
                    matchingContainer[minName]+matchingContainer[sizeName]))
                {
                    var containerMaxCoord=matchingContainer[minName]+matchingContainer[sizeName];
                    var elementMaxCoord=element[minName]+element[sizeName];
                    matchingContainer[minName]=
                        Math.min(element[minName],matchingContainer[minName]);
                    matchingContainer[sizeName]=
                        Math.max(containerMaxCoord,elementMaxCoord)-matchingContainer[minName];
                    for(var j=0;j<containersData.length;j++){
                        var container=containersData[j];
                        var elementSizeQuarter=elementSize/4;
                        var containerSizeQuarter=container[sizeName];
                        containerSizeQuarter/=4;
                        var minOverlap=Math.min(elementSizeQuarter,containerSizeQuarter);
                        if(container!=matchingContainer&&
                            (matchingContainer[minName]+minOverlap)<
                                (container[minName]+container[sizeName])&&
                            (matchingContainer[minName]+matchingContainer[sizeName])>
                                (container[minName]+minOverlap))
                        {
                            matchingContainer.children.addList(container.children);
                            if(matchingContainer[minName]>container[minName]){
                                matchingContainer[minName]=container[minName];
                            }
                            if(matchingContainer[minName]+matchingContainer[sizeName]<
                                container[minName]+container[sizeName])
                            {
                                matchingContainer[sizeName]=container[minName]+
                                    container[sizeName]-matchingContainer[minName];
                            }
                            containersData.removeAt(j);
                            j--;
                        }
                    }
                }
            }else{
                var containerData={children:[element]};
                containerData[minName]=element[minName];
                containerData[sizeName]=elementSize;
                containersData.add(containerData);
            }
        }
        return containersData;
    }
,isc.A.handleElementsOverlap=function isc_MockupImporter_handleElementsOverlap(elements){
        for(var i=0;i<elements.length-1;i++){
            for(var j=i+1;j<elements.length;j++){
                var element1=elements[i];
                var element2=elements[j];
                var element1Right=element1.left+element1.width;
                var element1Bottom=element1.top+element1.height;
                var element2Right=element2.left+element2.width;
                var element2Bottom=element2.top+element2.height;
                if(element1.left<element2Right&&element1Right>element2.left&&
                        element1.top<element2Bottom&&element1Bottom>element2.top)
                {
                    var dy=Math.abs(element1Bottom-element2.top);
                    var dx=Math.abs(element1Right-element2.left);
                    if(dy>0&&dy<this.maxControlOverlap){
                        element1.height-=dy+1;
                        if(element1._constructor=="DynamicForm"&&(element1.items||element1.fields)){
                            var items=element1.items||element1.fields;
                            for(var k=0;k<items.length;k++){
                                items[k].height=
                                    Math.min(items[k].height,element1.height-2);
                            }
                        }
                    }
                    if(dx>0&&dx<this.maxControlOverlap){
                        element1.width-=dx+1;
                        if(element1._constructor=="DynamicForm"&&(element1.items||element1.fields)){
                            var items=element1.items||element1.fields;
                            for(var k=0;k<items.length;k++){
                                items[k].width=
                                    Math.min(items[k].width,element1.width-2);
                            }
                        }
                    }
                }
            }
        }
    }
,isc.A.processFormsHeuristic=function isc_MockupImporter_processFormsHeuristic(layout,containers){
        var transformRules=this._transformRules;
        var formLayouts=[];
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(this.isFormsOnlyContainer(container)){
                formLayouts.add(container);
            }
        }
        var partialFormLayouts=[];
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(formLayouts.contains(container))continue;
            var startIndex=-1;
            var endIndex=-1;
            for(var j=0;j<container.contained.length;j++){
                var item=container.contained[j];
                var end=(j==(container.contained.length-1));
                if((item._constructor=="DynamicForm"&&(item.items!=null||item.fields!=null))||
                     (item._constructor!="DynamicForm"&&formLayouts.contains(item)&&
                     this._additionalLayouts.contains(item._constructor)))
                {
                    if(startIndex<0)startIndex=j;
                    endIndex=j;
                }else{
                    end=true
                }
                if(end&&startIndex>=0){
                    if(startIndex!=endIndex){
                        partialFormLayouts.add({
                            container:container,
                            startInd:startIndex,
                            endInd:endIndex
                        });
                        for(var k=startIndex;k<=endIndex;k++){
                            formLayouts.remove(container.contained[k]);
                            var child=this.getAllChildItems(container.contained[k],true);
                            for(var ci=0;ci<child.length;ci++){
                                if(child[ci].contained)formLayouts.remove(child[ci]);
                            }
                        }
                    }
                    startIndex=-1;
                    endIndex=-1;
                }
            }
        }
        for(var i=0;i<formLayouts.length;i++){
            for(var j=0;j<formLayouts.length;j++){
                if(formLayouts[j].contained.contains(formLayouts[i])){
                    formLayouts.removeAt(i);
                    i--;
                    break;
                }
            }
        }
        var formIdInd=1;
        for(var i=0;i<formLayouts.length;i++){
            var formLayout=formLayouts[i];
            var childItems=this.getAllChildItems(formLayout,true)
            if(childItems.length<=1)continue;
            var form=this.combineItemsIntoAForm(childItems);
            var bmmlName=formLayout.specialProperties.controlName;
            var widgetPropertyTranslations=
                transformRules.widgetPropertyTranslations[bmmlName];
            form.left=Math.max(0,form.absX-formLayout.absX-
                widgetPropertyTranslations.getLeftMargin(formLayout));
            form.top=Math.max(0,form.absY-formLayout.absY-
                widgetPropertyTranslations.getTopMargin(formLayout));
            form.specialProperties={};
            form.specialProperties.calculatedHeight=form.calculatedHeight;
            delete form.calculatedHeight;
            form.ID="form"+formIdInd++;
            formLayout.contained=[form];
            delete form.additionalExtraSpace;
            if(isc.isA.Number(formLayout.height)&&isc.isA.Number(form.height)){
                formLayout.height=Math.max(formLayout.height,form.height);
            }
            layout.addAt(form,layout.indexOf(formLayout));
            for(var j=0;j<childItems.length;j++){
                layout.remove(childItems[j]);
                containers.remove(childItems[j]);
            }
        }
        for(var i=0;i<partialFormLayouts.length;i++){
            var partialFormsData=partialFormLayouts[i];
            var formItemsContainer=partialFormsData.container;
            var childItems=[];
            for(var j=partialFormsData.startInd;j<=partialFormsData.endInd;j++){
                var formItem=formItemsContainer.contained[j];
                if(formItem.contained){
                    childItems.addList(this.getAllChildItems(formItem,true));
                }else{
                    childItems.add(formItem);
                }
            }
            if(childItems.length<=1)continue;
            var form=this.combineItemsIntoAForm(childItems);
            form.left=formItemsContainer.contained[partialFormsData.startInd].left;
            form.top=formItemsContainer.contained[partialFormsData.startInd].top;
            form.specialProperties={};
            form.specialProperties.calculatedHeight=form.calculatedHeight;
            delete form.calculatedHeight;
            form.ID="form"+formIdInd++;
            var lastItem=formItemsContainer.contained[partialFormsData.endInd]
            if(lastItem.extraSpace){
                form.extraSpace=lastItem.extraSpace;
            }
            for(var j=partialFormsData.endInd;j>=partialFormsData.startInd;j--){
                layout.remove(formItemsContainer.contained[j]);
                containers.remove(formItemsContainer.contained[j]);
                formItemsContainer.contained.removeAt(j);
            };
            formItemsContainer.contained.addAt(form,partialFormsData.startInd);
            layout.addAt(form,layout.indexOf(formItemsContainer));
            for(var j=0;j<childItems.length;j++){
                layout.remove(childItems[j]);
                containers.remove(childItems[j]);
            }
        }
        for(var i=0;i<layout.length;i++){
            var item=layout[i],
                items=item.items||item.fields
            ;
            if(item._constructor=="DynamicForm"&&
                items&&items.length==1&&
                items[0]._constructor=="ButtonItem")
            {
                var extraSpace=item.extraSpace;
                var button=items[0];
                if(item.extraSpace)button.extraSpace=item.extraSpace;
                button.left=item.left;
                button.top=item.top;
                button._constructor="Button";
                delete button.startRow;
                delete button.endRow;
                for(var attributeName in item){
                    if(attributeName!="ID"&&attributeName!="specialProperties"){
                        delete item[attributeName];
                    }
                }
                for(var attributeName in button){
                    item[attributeName]=button[attributeName];
                }
            }else if(item._constructor=="DynamicForm"&&items){
                var form=item;
                var formItems=items;
                var numCols=form.numCols||2;
                var colsOccupied=0;
                var rowSpans=[];
                for(var j=0;j<formItems.length;j++){
                    var item=formItems[j];
                    var nextItem=null;
                    var itemCols=item.colSpan||(item.showTitle?2:1);
                    var itemsToCombine=[item];
                    var valueMap=[item.title];
                    var disabledMap=[];
                    var value=null;
                    if(item.value==true){
                        value=item.title;
                    }
                    var isHorizontal=numCols>itemCols&&item.endRow!=true;
                    if(item.rowSpan!=null){
                        for(var s=0;s<(colsOccupied+itemCols-1);s++){
                            rowSpans[s]=item.rowSpan;
                        }
                    }else{
                        for(var s=colsOccupied-1;s<(colsOccupied+itemCols-1);s++){
                            if(rowSpans[s]==null)break;
                            colsOccupied++;
                            if(--rowSpans[s]==0){
                                rowSpans[s]=null;
                            }
                        }
                    }
                    colsOccupied+=itemCols;
                    if(item._constructor=="RadioItem"){
                        for(var k=j+1;k<formItems.length;k++){
                            nextItem=formItems[k];
                            if(nextItem._constructor!="RadioItem")break;
                            if(nextItem.value==true){
                                if(value!=null)break;
                                value=nextItem.title;
                            }
                            itemsToCombine.add(nextItem);
                            valueMap.add(nextItem.title);
                            if(nextItem.disabled){
                                disabledMap.add(nextItem.title);
                            }
                            var nextItemCols=nextItem.colSpan||(nextItem.showTitle?2:1);
                            colsOccupied+=nextItemCols;
                            if(nextItem.endRow||colsOccupied==numCols){
                                if(isHorizontal)break;
                                colsOccupied=0;
                            }
                        }
                    }
                    if(itemsToCombine.length>1){
                        formItems.removeList(itemsToCombine);
                        var radioGroup={
                            _constructor:"RadioGroupItem",
                            type:"radioGroup",
                            showTitle:false,
                            valueMap:valueMap,
                            value:item.title
                        };
                        if(itemsToCombine[0].cellHeight){
                            radioGroup.cellHeight=itemsToCombine[0].cellHeight;
                        }
                        if(disabledMap.length>0){
                            radioGroup.disabledValues=disabledMap;
                        }
                        if(isHorizontal){
                            radioGroup.vertical=false;
                            radioGroup.colSpan=colsOccupied;
                            if(nextItem.endRow){
                                radioGroup.endRow=true;
                            }
                        }
                        formItems.addAt(radioGroup,j);
                        if(j>0&&formItems[j-1]._constructor=="StaticTextItem"&&!formItems[j-1].endRow){
                            formItems[j].showTitle=true;
                            formItems[j].title=formItems[j-1].value;
                            formItems.remove(formItems[j-1]);
                        }
                    }
                    if(item.endRow||colsOccupied==numCols||(nextItem&&nextItem.endRow)){
                        colsOccupied=0;
                    }
                }
                var lastItem=formItems[formItems.length-1];
                var extraSpace=0;
                if(form.extraSpace){
                    extraSpace=form.extraSpace;
                }
                if(lastItem.extraSpace){
                    extraSpace+=lastItem.extraSpace;
                }
                if(form.additionalExtraSpace){
                    extraSpace+=form.additionalExtraSpace;
                    form.height-=form.additionalExtraSpace;
                    delete form.additionalExtraSpace;
                }
                if(extraSpace>0){
                    form.extraSpace=extraSpace;
                }
            }
        }
        return layout;
    }
,isc.A.isFormsOnlyContainer=function isc_MockupImporter_isFormsOnlyContainer(container){
        var childItems=this.getAllChildItems(container,true)
        if(childItems.length==0)return false;
        var labelsOnly=true;
        for(var j=0;j<childItems.length;j++){
            var isForm=childItems[j]._constructor=="DynamicForm";
            var isLabel=childItems[j]._constructor=="Label"&&childItems[j].icon==null;
            var isLayout=this._additionalLayouts.contains(childItems[j]._constructor);
            if(!isForm&&!isLabel&&!isLayout)return false;
            if(isForm&&childItems[j].items==null&&childItems[j].fields==null)return false;
            labelsOnly=labelsOnly&&(isLabel||isLayout);
        }
        return!labelsOnly;
    }
,isc.A.combineItemsIntoAForm=function isc_MockupImporter_combineItemsIntoAForm(forms){
        var formItems=[];
        for(var i=0;i<forms.length;i++){
            if(forms[i]._constructor=="Label"){
                var label=forms[i];
                label._constructor="DynamicForm";
                label.items=[{
                    _constructor:"StaticTextItem",
                    showTitle:false,
                    width:label.width,
                    value:label.contents
                }];
            }
        }
        for(var j=0;j<forms.length;j++){
            if(forms[j]._constructor!="DynamicForm"||(forms[j].items==null&&forms[j].fields==null))continue;
            var x=forms[j].absX;
            var y=forms[j].absY;
            var isHorizontal=forms[j].orientation=="horizontal";
            var items=forms[j].items||forms[j].fields;
            for(var k=0;k<items.length;k++){
                var item=items[k];
                item._pos={
                    x:x,
                    y:y,
                    width:item.width?item.width:forms[j].width,
                    height:item.height?item.height:this.formsGridCellHeight
                };
                if(item.title&&!this._titledFormItems.contains(item._constructor)){
                    if(item.titleOrientation=="top"){
                        item._pos.height+=17;
                    }else if(forms[j].titleWidth){
                        item._pos.x+=forms[j].titleWidth;
                        item.titleWidth=forms[j].titleWidth;
                    }
                }
                if(isHorizontal){
                    x+=item._pos.width;
                }else{
                    y+=item._pos.height;
                }
                formItems.add(item);
            }
        }
        var resultingForm={
            _constructor:"DynamicForm",
            items:[]
        }
        var minX=10000;
        var minY=10000;
        for(var j=0;j<formItems.length;j++){
            minX=Math.min(minX,formItems[j]._pos.x);
            minY=Math.min(minY,formItems[j]._pos.y);
        }
        resultingForm.absX=minX;
        resultingForm.absY=minY;
        var formWidth=0;
        var formHeight=0;
        var xCoordinates=[];
        var yCoordinates=[];
        for(var j=0;j<formItems.length;j++){
            formItems[j]._pos.x-=minX;
            formItems[j]._pos.y-=minY;
            formWidth=Math.max(formWidth,formItems[j]._pos.x+formItems[j]._pos.width);
            formHeight=Math.max(formHeight,formItems[j]._pos.y+formItems[j]._pos.height);
            if(!xCoordinates.contains(formItems[j]._pos.x)){
                xCoordinates.add(formItems[j]._pos.x);
            }
            if(!yCoordinates.contains(formItems[j]._pos.y)){
                yCoordinates.add(formItems[j]._pos.y);
            }
        }
        xCoordinates.sort(function(a,b){
            return a-b;
        });
        yCoordinates.sort(function(a,b){
            return a-b;
        });
        for(var i=0;i<xCoordinates.length-1;i++){
            if(xCoordinates[i+1]-xCoordinates[i]<this.formsGridCellWidth){
                for(var j=0;j<formItems.length;j++){
                    if(formItems[j]._pos.x==xCoordinates[i+1]){
                        formItems[j]._pos.width+=(xCoordinates[i+1]-xCoordinates[i]);
                        formItems[j]._pos.x=xCoordinates[i];
                    }
                }
                xCoordinates.removeAt(i+1);
                i--;
            }
        }
        for(var i=0;i<yCoordinates.length-1;i++){
            if(yCoordinates[i+1]-yCoordinates[i]<this.formsGridCellHeight*2/3){
                for(var j=0;j<formItems.length;j++){
                    if(formItems[j]._pos.y==yCoordinates[i+1]){
                        formItems[j]._pos.height+=(yCoordinates[i+1]-yCoordinates[i]);
                        formItems[j]._pos.y=yCoordinates[i];
                    }
                }
                yCoordinates.removeAt(i+1);
                i--;
            }
        }
        var grid=[];
        for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
            var row=[];
            grid.add(row);
            for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
                row.add(null);
            }
        }
        for(var j=0;j<formItems.length;j++){
            var item=formItems[j];
            var startRow=0;
            var endRow=0;
            for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
                if(item._pos.y>=yCoordinates[rowIndex]){
                    startRow=rowIndex;
                    endRow=rowIndex;
                }
                if((item._pos.y+item._pos.height)<=yCoordinates[rowIndex]){
                    break;
                }
                endRow=rowIndex;
            }
            var startCell=0;
            var endCell=0;
            for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
                if(item._pos.x>=xCoordinates[cellIndex]){
                    startCell=cellIndex;
                    endCell=cellIndex;
                }
                if((item._pos.x+item._pos.width)<=xCoordinates[cellIndex]){
                    break;
                }
                endCell=cellIndex;
            }
            if(endCell-startCell>=1){
                item.colSpan=endCell-startCell+1;
            }
            if(endRow-startRow>=1){
                item.rowSpan=endRow-startRow+1;
            }
            delete item._pos;
            for(var cellIndex=startCell;cellIndex<=endCell;cellIndex++){
                for(var rowIndex=startRow;rowIndex<=endRow;rowIndex++){
                    var oldItem=grid[rowIndex][cellIndex];
                    if(oldItem){
                        if(cellIndex>0&&oldItem==grid[rowIndex][cellIndex-1]){
                            var clearCell=function(ci){
                                if(oldItemTitleColSpan>1&&ci<(oldItemStartCell+oldItemTitleColSpan)){
                                    oldItem.titleColSpan--;
                                    if(oldItem.titleColSpan==1)delete oldItem.titleColSpan;
                                    oldItemTitleColSpan--;
                                }else if(oldItem.colSpan){
                                    oldItem.colSpan--;
                                    if(oldItem.colSpan==1)delete oldItem.colSpan;
                                    oldItemColSpan--;
                                }
                                grid[rowIndex][ci]=null;
                            }
                            var oldItemTitleColSpan=(oldItem.titleColSpan?oldItem.titleColSpan:(oldItem.showTitle?1:0));
                            var oldItemColSpan=(oldItem.colSpan?oldItem.colSpan:1);
                            var oldItemRowCellCount=oldItemTitleColSpan+oldItemColSpan;
                            var oldItemStartCell=0;
                            for(var ci=startCell;ci<=endCell;ci++){
                                if(oldItem==grid[rowIndex][ci]){
                                    oldItemStartCell=ci;
                                    break;
                                }
                            }
                            clearCell(cellIndex);
                            if(cellIndex<grid[rowIndex].length&&oldItem==grid[rowIndex][cellIndex+1]){
                                clearCell(cellIndex-1);
                            }
                        }else if(rowIndex>0&&oldItem==grid[rowIndex-1][cellIndex]){
                            oldItem.rowSpan--;
                            for(var i=cellIndex+1;i<grid[rowIndex].length;i++){
                                if(grid[rowIndex][i]==oldItem){
                                    grid[rowIndex][i]=null;
                                }
                            }
                            if(oldItem.rowSpan==1)delete oldItem.rowSpan;
                        }
                    }
                    grid[rowIndex][cellIndex]=item;
                    if(item.titleWidth!=null){
                        var index=cellIndex-1;
                        var titleColSpan=0;
                        while(index>=0&&grid[rowIndex][index]==null){
                            grid[rowIndex][index]=item;
                            titleColSpan++;
                            index--;
                        }
                        if(titleColSpan>1)item.titleColSpan=titleColSpan;
                        if(titleColSpan>0)delete item.titleWidth;
                    }
                }
            }
        }
        for(var ri=0;ri<grid.length;ri++){
            for(var ci=0;ci<grid[ri].length-1;ci++){
                if(grid[ri][ci]&&grid[ri][ci+1]&&
                    grid[ri][ci]._constructor=="StaticTextItem"&&
                    grid[ri][ci+1]._constructor!="StaticTextItem"&&
                    grid[ri][ci+1]._constructor!="SpacerItem"&&
                    !this._titledFormItems.contains(grid[ri][ci+1]._constructor)&&
                    grid[ri][ci+1].showTitle==false)
                {
                    if(grid[ri][ci+1].rowSpan){
                        var c=false;
                        for(var rowIndex=0;rowIndex<grid.length;rowIndex++){
                            if(grid[rowIndex][ci+1]==grid[ri][ci+1]){
                                if(grid[rowIndex][ci]!=grid[ri][ci]&&
                                    grid[rowIndex][ci]!=null){
                                    c=true;
                                    break;
                                }
                                if(grid[rowIndex][ci]==null){
                                    grid[rowIndex][ci]=grid[ri][ci+1];
                                }
                            }
                        }
                        if(c){
                            continue;
                        }
                    }
                    var labelItem=grid[ri][ci];
                    grid[ri][ci+1].title=grid[ri][ci].value;
                    grid[ri][ci+1].width+=grid[ri][ci].width;
                    grid[ri][ci+1].showTitle=true;
                    grid[ri][ci]=grid[ri][ci+1];
                    var colInd=ci-1;
                    if(colInd>=0&&grid[ri][colInd]==labelItem){
                        while(colInd>=0&&grid[ri][colInd]==labelItem){
                            grid[ri][colInd]=grid[ri][ci+1];
                            if(grid[ri][ci+1].titleColSpan){
                                grid[ri][ci+1].titleColSpan++;
                            }else{
                                grid[ri][ci+1].titleColSpan=1;
                            }
                            colInd--;
                        }
                    }else{
                        grid[ri][ci+1].width-=labelItem.width;
                    }
                }
            }
        }
        for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
            for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
                var currentItem=grid[rowIndex][cellIndex];
                if(currentItem==null){
                    if(cellIndex>0&&grid[rowIndex][cellIndex-1]._constructor=="SpacerItem"){
                        grid[rowIndex][cellIndex]=grid[rowIndex][cellIndex-1];
                        if(grid[rowIndex][cellIndex].colSpan==null){
                            grid[rowIndex][cellIndex].colSpan=2;
                        }else{
                            grid[rowIndex][cellIndex].colSpan++;
                        }
                    }else{
                        grid[rowIndex][cellIndex]={
                            _constructor:"SpacerItem"
                        };
                        resultingForm.items.add(grid[rowIndex][cellIndex]);
                    }
                }else if(!resultingForm.items.contains(currentItem)){
                    resultingForm.items.add(currentItem);
                }
                currentItem=grid[rowIndex][cellIndex];
                if(currentItem.rowSpan==null&&rowIndex<(yCoordinates.length-1)){
                    var skinCellPadding=isc.ListGrid.getInstanceProperty("cellPadding");
                    currentItem.cellHeight=
                        yCoordinates[rowIndex+1]-yCoordinates[rowIndex]-
                        (2*skinCellPadding);
                    var defaultHeight=isc.TextItem.getInstanceProperty("height");
                    defaultHeight+=2*skinCellPadding;
                    if(Math.abs(defaultHeight-currentItem.cellHeight)<=this.formExtraSpaceThreshold){
                        delete currentItem.cellHeight;
                    }
                    if(currentItem.cellHeight>=3*defaultHeight){
                        currentItem.vAlign="top";
                        currentItem.titleVAlign="top";
                    }
                    if(currentItem._constructor=="ButtonItem"){
                        delete currentItem.cellHeight;
                    }
                }
            }
            for(var i=resultingForm.items.length-1;i>=0;i--){
                if(resultingForm.items[i]._constructor=="SpacerItem"){
                    resultingForm.items.removeAt(i);
                    if(rowIndex!=(yCoordinates.length-1)){
                        resultingForm.items[resultingForm.items.length-1].endRow=true;
                    }
                }else{
                    break;
                }
            }
        }
        var revisedGrid=[],
            currentRowIndex=0
        ;
        for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
            revisedGrid[currentRowIndex]=[];
            var skinCellPadding=isc.ListGrid.getInstanceProperty("cellPadding"),
                spacerHeight=null
            ;
            for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
                var currentItem=grid[rowIndex][cellIndex];
                if(currentItem._constructor!="SpacerItem"){
                    var height=currentItem.height,
                        cellHeight=currentItem.cellHeight
                    ;
                    if(currentItem.showTitle&&currentItem.titleOrientation=="top"){
                        height+=17;
                    }
                    if(cellHeight-height-(2*skinCellPadding)>0){
                        spacerHeight=cellHeight-height-(2*skinCellPadding);
                    }
                }
                revisedGrid[currentRowIndex][cellIndex]=currentItem;
            }
            var lastItemOnRow=null;
            if(spacerHeight!=null){
                for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
                    var currentItem=revisedGrid[currentRowIndex][cellIndex];
                    if(currentItem&&currentItem._constructor!="SpacerItem"){
                        if(currentItem.cellHeight>spacerHeight){
                            delete currentItem.cellHeight;
                        }
                        lastItemOnRow=currentItem;
                    }
                }
            }
            currentRowIndex++;
            if(spacerHeight!=null){
                var spacer={_constructor:"RowSpacerItem",height:spacerHeight};
                revisedGrid[currentRowIndex]=[];
                var templateRow=revisedGrid[currentRowIndex-1],
                    addedRowSpacer=false
                ;
                for(var col=0;col<templateRow.length;col++){
                    if(templateRow[col].rowSpan>0){
                        revisedGrid[currentRowIndex][col]=templateRow[col];
                        if(col==0||templateRow[col-1]!=templateRow[col]){
                            templateRow[col].rowSpan=templateRow[col].rowSpan+1;
                        }
                    }else if(!addedRowSpacer){
                        revisedGrid[currentRowIndex][col]=spacer;
                        addedRowSpacer=true;
                    }else{
                        revisedGrid[currentRowIndex][col]={
                            _constructor:"SpacerItem"
                        };
                    }
                }
                var itemIndex=resultingForm.items.indexOf(lastItemOnRow);
                resultingForm.items.addAt(spacer,itemIndex+1);
                currentRowIndex++;
            }
        }
        grid=revisedGrid;
        var calculatedFormHeight=0;
        var textAreaItemFound=false;
        var skinCellPadding=isc.ListGrid.getInstanceProperty("cellPadding");
        var defaultHeight=isc.TextItem.getInstanceProperty("height");
        for(var i=0;i<grid.length;i++){
            var item=grid[i][0];
            if(item==null)continue;
            if(i>0&&item==grid[i-1][0])continue;
            var itemHeight=0;
            var cellHeight;
            if(item._constructor=="TextAreaItem"){
                textAreaItemFound=true;
                itemHeight=item.height;
            }else if(item._constructor=="SpacerItem"){
                for(var j=0;j<grid[i].length;j++){
                    if(grid[i][j]._constructor!="SpacerItem"){
                        item=grid[i][j];
                        if(item._constructor=="TextAreaItem"){
                            textAreaItemFound=true;
                            itemHeight=item.height;
                        }else{
                            if(isc[item._constructor])itemHeight=
                                isc[item._constructor].getInstanceProperty("height");
                            cellHeight=item.cellHeight;
                        }
                        break;
                    }
                }
            }else{
                if(isc[item._constructor])itemHeight=isc[item._constructor].getInstanceProperty("height");
                cellHeight=item.cellHeight;
            }
            if(itemHeight==null||itemHeight==0)itemHeight=defaultHeight;
            calculatedFormHeight+=(2*skinCellPadding)+(cellHeight!=null?Math.max(itemHeight,cellHeight):itemHeight);
            if(item.showTitle&&item.titleOrientation=="top"){
                calculatedFormHeight+=17;
            }
        }
        if(textAreaItemFound){
            resultingForm.calculatedHeight=calculatedFormHeight;
        }
        if(grid.length>0)formHeight+=skinCellPadding;
        var widths=[];
        for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
            var maxTitleWidth=0;
            for(var rowIndex=0;rowIndex<grid.length;rowIndex++){
                if(grid[rowIndex][cellIndex].titleWidth!=null){
                    if(cellIndex==0){
                        maxTitleWidth=Math.max(maxTitleWidth,grid[rowIndex][cellIndex].titleWidth);
                    }else{
                        var tw=xCoordinates[cellIndex]-xCoordinates[cellIndex-1]-
                                 grid[rowIndex][cellIndex-1].width;
                        if(maxTitleWidth==0){
                            maxTitleWidth=tw;
                        }else{
                            maxTitleWidth=Math.min(maxTitleWidth,tw);
                        }
                    }
                }
            }
            if(maxTitleWidth>0){
                if(cellIndex!=0){
                    widths[widths.length-1]-=maxTitleWidth;
                }else{
                    resultingForm.absX-=maxTitleWidth;
                }
                for(var rowIndex=0;rowIndex<grid.length;rowIndex++){
                    if(grid[rowIndex][cellIndex].titleWidth==null){
                        if(grid[rowIndex][cellIndex]._constructor=="ButtonItem"){
                            var ci=resultingForm.items.indexOf(grid[rowIndex][cellIndex]);
                            var prevItem=resultingForm.items[ci-1];
                            if(cellIndex>0&&prevItem._constructor=="SpacerItem"){
                                if(prevItem.colSpan==null){
                                    prevItem.colSpan=2;
                                }else{
                                    prevItem.colSpan++;
                                }
                            }else{
                                resultingForm.items.addAt({
                                    _constructor:"SpacerItem"
                                },ci);
                            }
                        }else{
                            if(grid[rowIndex][cellIndex].colSpan==null){
                                grid[rowIndex][cellIndex].colSpan=2;
                            }else{
                                grid[rowIndex][cellIndex].colSpan++;
                            }
                        }
                    }
                }
                widths.add(maxTitleWidth);
            }
            if(cellIndex==xCoordinates.length-1){
                widths.add(formWidth-xCoordinates[cellIndex]);
            }else{
                widths.add(xCoordinates[cellIndex+1]-xCoordinates[cellIndex]);
            }
        }
        for(var i=0;i<formItems.length;i++){
            delete formItems[i].titleWidth;
        }
        var colWidths="";
        resultingForm.width=0;
        for(var j=0;j<widths.length;j++){
            if(j!=widths.length-1){
                colWidths+=widths[j];
                colWidths+=",";
            }else{
                colWidths+="*";
            }
            resultingForm.width+=widths[j];
        }
        for(var j=0;j<grid.length;j++){
            for(var k=0;k<grid[j].length;k++){
                var item=grid[j][k];
                if(item._constructor=="ButtomItem"){
                    continue;
                }
                if(item.width==null||item.width=="*")continue;
                var colWidth=widths[k];
                var colSpan=item.colSpan||item.titleColSpan;
                if(colSpan){
                    for(var cnt=1;cnt<colSpan;cnt++){
                        colWidth+=widths[j+cnt];
                    }
                    k+=colSpan;
                }
                if(Math.abs(colWidth-item.width)<2){
                    item.width="*";
                }
            }
        }
        for(var i=0;i<resultingForm.items.length;i++){
            var item=resultingForm.items[i];
            if(item._constructor=="TextAreaItem"){
                if(item.rowSpan>1&&item.rowSpan!=grid.length){
                    item.height="*";
                }
                if((item.colSpan||1)!=grid[0].length){
                    item.width="*";
                }
            }
        }
        resultingForm.colWidths=colWidths;
        resultingForm.numCols=widths.length;
        resultingForm.height=formHeight;
        var rawHeaders=[];
        for(var i=0;i<formItems.length;i++){
            var item=formItems[i];
            var title=item.title||item.defaultValue||item._constructor;
            rawHeaders.add(title);
        }
        for(var i=0;i<formItems.length;i++){
            var item=formItems[i];
            if(item._constructor=="SpacerItem")continue;
            var title=item.title||item.defaultValue||item._constructor;
            var name=isc.MockDataSource.convertTitleToName(title,this.fieldNamingConvention,rawHeaders);
            var actualName=name;
            var iter=0;
            do{
                var wasSame=false;
                for(var j=0;j<items.length;j++){
                    if(items[j].name==actualName){
                        iter++;
                        actualName=name+iter;
                        wasSame=true;
                        break;
                    }
                }
            }while(wasSame);
            item.name=actualName;
        }
        return resultingForm;
    }
);
isc.evalBoundary;isc.B.push(isc.A.removeExtraContainers=function isc_MockupImporter_removeExtraContainers(layout,containers){
        var changed;
        do{
            changed=false;
            for(var i=0;i<containers.length;i++){
                var container=containers[i];
                if(container.contained.length==1&&
                    (this._additionalLayouts.contains(container._constructor)||
                     "Canvas"==container._constructor&&
                     container.contained[0]._constructor=="DynamicForm")&&
                    !(container.overflow&&container.contained[0]._constructor!="ListGrid"))
                {
                    var first=container.contained[0];
                    if((container.width-first.width)>(this.stackContainerFillInset*2)||
                        (container.height-first.height)>(this.stackContainerFillInset*2))
                    {
                        continue;
                    }
                    for(var j=0;j<containers.length;j++){
                        var index=containers[j].contained.indexOf(container);
                        if(index>=0){
                            var second=containers[j].contained[index];
                            var lm=first.left;
                            var tm=first.top;
                            var bm=container.height-tm-first.height;
                            var rm=container.width-lm-first.width;
                            if(!first.specialProperties)first.specialProperties={};
                            var sp=first.specialProperties;
                            sp.lm=(sp.lm||0)+lm;
                            sp.tm=(sp.tm||0)+tm;
                            sp.bm=(sp.bm||0)+bm;
                            sp.rm=(sp.rm||0)+rm;
                            var isFirstHorizontal=first._constructor=="HStack"||
                                first._constructor=="HLayout";
                            var isSecondHorizontal=second._constructor=="HStack"||
                                second._constructor=="HLayout";
                            var isContainerHorizontal=container._constructor=="HStack"||
                                container._constructor=="HLayout";
                            if(isFirstHorizontal&&isSecondHorizontal&&!isContainerHorizontal||
                                (!isFirstHorizontal&&!isSecondHorizontal))
                            {
                                first.extraSpace=(first.extraSpace||0)+
                                    (containers[j].contained[index].extraSpace||0);
                            }else{
                                first.extraSpace=containers[j].contained[index].extraSpace||0;
                            }
                            if(first.extraSpace==0){
                                delete first.extraSpace;
                            }
                            var fieldsToCopy=["border","width","height","top","left",
                                                "isGroup","groupTitle","markupContained"];
                            var specialFieldsToCopy=["measuredW","measuredH",
                                                       "overrideWidth","top","left"];
                            for(var cnt=0;cnt<fieldsToCopy.length;cnt++){
                                if(container[fieldsToCopy[cnt]]){
                                    first[fieldsToCopy[cnt]]=
                                        container[fieldsToCopy[cnt]];
                                }
                            }
                            if(container.specialProperties&&container.contained[0].specialProperties){
                                if((container.specialProperties.controlName=="com.balsamiq.mockups::Canvas"||
                                     container.specialProperties.controlName=="com.balsamiq.mockups::FieldSet")&&
                                    first._constructor=="DynamicForm")
                                {
                                    specialFieldsToCopy.add("controlName");
                                }
                                for(var cnt=0;cnt<specialFieldsToCopy.length;cnt++){
                                    first.specialProperties[specialFieldsToCopy[cnt]]=
                                        container.specialProperties[specialFieldsToCopy[cnt]];
                                }
                            }
                            if(container.showResizeBar){
                                container.contained[0].showResizeBar=container.showResizeBar;
                            }
                            containers[j].contained[index]=container.contained[0];
                            layout.remove(container);
                            if(first.markupContained&&container.contained[0].markupContained.length>0){
                                first.contained=[];
                                containers.set(i,container.contained[0])
                            }else{
                                containers.removeAt(i);
                                i--;
                            }
                            changed=true
                            break;
                        }
                    }
                    var specialProperties=container.specialProperties,
                        controlName=specialProperties&&specialProperties.controlName;
                    if(!changed&&controlName!="com.balsamiq.mockups::BrowserWindow"){
                        if(container.top)first.top=(first.top||0)+container.top;
                        if(container.left)first.left=(first.left||0)+container.left;
                        if(container.width)first.width=container.width;
                        if(container.height)first.height=container.height;
                        if(container.border)first.border=container.border;
                        if(container.zIndex)first.zIndex=container.zIndex;
                        if(container.isGroup)first.isGroup=container.isGroup;
                        if(container.groupTitle)first.groupTitle=container.groupTitle;
                        if(container.markupContained){
                            first.markupContained=container.markupContained;
                        }
                        if(specialProperties){
                            if(!first.specialProperties)first.specialProperties={};
                            first.specialProperties.fullHeight=specialProperties.fullHeight;
                            first.specialProperties.fullWidth=specialProperties.fullWidth;
                        }
                        delete first.extraSpace;
                        delete first.autoDraw;
                        layout.remove(container);
                        if(first.markupContained&&first.markupContained.length>0){
                            first.contained=[];
                            containers.set(i,first)
                        }else{
                            containers.removeAt(i);
                            i--;
                        }
                        changed=true
                    }
                }
            }
        }while(changed);
        return layout;
    }
,isc.A.processValuesManagers=function isc_MockupImporter_processValuesManagers(layout,containers){
        for(var i=0;i<containers.length;i++){
            if(containers[i].specialProperties!=null&&
                containers[i].specialProperties.controlName!=null&&
                containers[i].specialProperties.controlName.startsWith("com.balsamiq.mockups::")&&
                containers[i]._constructor!="DynamicForm")
            {
                var forms=this.findDynamicFormsRecursively(containers[i]);
                if(forms.length>1){
                    var vm={
                        _constructor:"ValuesManager",
                        ID:"ValuesManager"+i
                    };
                    this.globalIDs.push(vm.ID);
                    for(var j=0;j<forms.length;j++){
                        forms[j].valuesManager=vm.ID;
                        if(forms[j].specialProperties.additionalElements==null){
                            forms[j].specialProperties.additionalElements=[];
                        }
                        forms[j].specialProperties.additionalElements.add(vm);
                    }
                    layout.addAt(vm,0);
                }
                var items=[];
                for(var j=0;j<forms.length;j++){
                    items.addList(forms[j].items);
                }
                var rawHeaders=[];
                for(var j=0;j<items.length;j++){
                    var item=items[j];
                    var title=item.title||item.defaultValue||item._constructor;
                    rawHeaders.add(title);
                }
                for(var j=0;j<items.length;j++){
                    var item=items[j];
                    if(item._constructor=="SpacerItem")continue;
                    var title=item.title||item.defaultValue||item._constructor;
                    var name=isc.MockDataSource.convertTitleToName(title,this.fieldNamingConvention,rawHeaders);
                    var actualName=name;
                    var iter=0;
                    do{
                        var wasSame=false;
                        for(var k=0;k<items.length;k++){
                            if(items[k].name==actualName){
                                iter++;
                                actualName=name+iter;
                                wasSame=true;
                                break;
                            }
                        }
                    }while(wasSame);
                    item.name=actualName;
                    if(item._constructor=="CheckboxItem"&&item.showTitle==false&&
                        item.colSpan==2)
                    {
                        delete item.showTitle;
                        delete item.colSpan;
                    }
                }
            }
        }
        return layout;
    }
,isc.A.findDynamicFormsRecursively=function isc_MockupImporter_findDynamicFormsRecursively(container){
        if(!container||!container.contained)return[];
        var resultingArray=[];
        for(var i=0;i<container.contained.length;i++){
            var widget=container.contained[i];
            if(widget._constructor=="DynamicForm"&&(widget.items!=null||widget.fields!=null)){
                resultingArray.add(widget);
            }
            if(this._additionalLayouts.contains(widget._constructor)||
                (widget._constructor=="DynamicForm"&&widget.items==null&&widget.fields==null))
            {
                resultingArray.addAll(this.findDynamicFormsRecursively(widget));
            }
        }
        return resultingArray;
    }
,isc.A.processAddingToContainersHeuristic=function isc_MockupImporter_processAddingToContainersHeuristic(layout,containers){
        var transformRules=this._transformRules;
        this.cleanZIndexParam(layout,containers);
        for(var i=0;i<containers.length;i++){
            this.processRemoveWidths(layout,containers,containers[i]);
            var widgetProperties=transformRules.widgetPropertyTranslations[containers[i].specialProperties.controlName];
            var widgetsContainer=null;
            if(containers[i].markupContained!=null&&containers[i].markupContained.length>0){
                widgetsContainer={
                    _constructor:"VStack",
                    ID:"VStack"+i,
                    position:"absolute",
                    top:0,
                    autoDraw:false,
                    width:"100%",
                    height:"100%",
                    zIndex:containers[i].zIndex,
                    members:[]
                };
                var childCanvas={
                    _constructor:"Canvas",
                    height:"100%",
                    width:"100%",
                    autoDraw:false,
                    children:[this._getRefCanvas(widgetsContainer)]
                }
                for(var j=0;j<containers[i].markupContained.length;j++){
                    containers[i].markupContained[j].position="absolute";
                    childCanvas.children.add(
                        this._getRefCanvas(containers[i].markupContained[j]));
                }
                widgetProperties.addChild(containers[i],childCanvas,layout);
                layout.addAt(widgetsContainer,layout.indexOf(containers[i]));
            }
            var container=containers[i];
            this.processLayoutMargin(layout,containers,container,widgetsContainer);
            if(container.contained.length==1&&
                (container._constructor=="TabSet"||container._constructor=="SectionStack")&&
                container.verticalScrollBar!=null&&
                container.contained[0]._constructor=="VStack")
            {
                container.contained[0]._constructor="VLayout";
                container.contained[0].overflow="auto";
                delete container.verticalScrollBar;
            }
            for(var j=0;j<container.contained.length;j++){
                var widget=container.contained[j];
                widget.autoDraw="false";
                if(widgetsContainer!=null){
                    widgetsContainer.members.add(this._getRefCanvas(widget));
                }else{
                    widgetProperties.addChild(container,this._getRefCanvas(widget),layout);
                }
                if(widget._constructor=="DynamicForm"&&(widget.items!=null||widget.fields!=null)){
                    var items=widget.items||widget.fields;
                    for(var k=0;k<items.length;k++){
                        var item=items[k];
                        delete item.left;
                        delete item.top;
                        if(!this.tallFormItems.contains(item._constructor)&&
                            !this.tallFormItems.contains(item.type)&&
                            "RowSpacerItem"!=item._constructor&&
                            ("SelectItem"!=item._constructor||item.multipleAppearance!="grid"))
                        {
                            delete item.height;
                        }else if(item._constructor=="ButtonItem"){
                            if(Math.abs(item.height-this.defaultButtonSize)<=this.buttonMinimumChangeSize){
                                delete item.height;
                            }
                        }
                    }
                }
            }
            if(container.headerContained!=null){
                container.headerContained.sort(function(a,b){
                    return a.control.left-b.control.left;
                });
                for(var j=0;j<container.headerContained.length;j++){
                    if(j>0&&
                        container.headerContained[j].control.specialProperties.controlName=="com.balsamiq.mockups::VSplitter"||
                        container.headerContained[j].control.specialProperties.controlName=="com.balsamiq.mockups::VRule")
                    {
                        container.headerContained[j-1].control.showResizeBar=true;
                        container.overflow="auto";
                        layout.remove(container.headerContained[j].control);
                        container.headerContained.removeAt(j);
                        j--;
                        continue;
                    }
                    delete container.headerContained[j].control.height;
                    delete container.headerContained[j].control.zIndex;
                    delete container.headerContained[j].control.top;
                    delete container.headerContained[j].control.left;
                    container.headerContained[j].control.autoDraw="false";
                    if(widgetProperties.addControl){
                        widgetProperties.addControl(container,{
                            controlAreaName:container.headerContained[j].controlAreaName,
                            control:this._getRefCanvas(container.headerContained[j].control)
                            }
                        );
                    }else{
                        isc.logWarn("no add control method for "+
                            containers[i].specialProperties.controlName+" unable to add "+
                            isc.echoAll(container.headerContained[j].control));
                    }
                }
            }
            if(container._constructor!="DynamicForm"&&
                container._constructor!="Canvas"&&
                (container.markupContained==null||container.markupContained.length==0))
            {
                for(var j=0;j<container.contained.length;j++){
                    var widget=container.contained[j];
                    if(widget._constructor=="Label"){
                        var horiz=container._constructor=="HStack"||container._constructor=="HLayout";
                        if(widget.specialProperties.align&&widget.specialProperties.align=="center"){
                            widget.align=widget.specialProperties.align;
                        }
                        if(!horiz&&widget.left>this.stackContainerFillInset){
                            widget.width+=widget.left;
                            if(!widget.align)widget.align="right";
                        }
                        if(horiz&&widget.top>this.stackContainerFillInset){
                            widget.height+=widget.top;
                            widget.valign="bottom";
                        }
                    }
                    delete widget.left;
                    delete widget.top;
                }
            }
            if(container.fake){
                if(container.layoutLeftMargin==null){
                    container.layoutLeftMargin=0;
                }
                if(container.layoutTopMargin==null){
                    container.layoutTopMargin=0;
                }
                if(container.contained.length==1&&container.markupContained==0){
                    container.contained[0].left=container.left+container.layoutLeftMargin;
                    container.contained[0].top=container.top+container.layoutTopMargin;
                    if(container.contained[0].specialProperties){
                        delete container.contained[0].specialProperties.fullWidth;
                        delete container.contained[0].specialProperties.fullHeight;
                    }
                    delete container.contained[0].autoDraw;
                    layout.remove(container);
                }else{
                    container.left=container.left+container.layoutLeftMargin;
                    container.top=container.top+container.layoutTopMargin;
                    delete container.layoutLeftMargin;
                    delete container.layoutTopMargin;
                    delete container.fake;
                }
            }
        }
        if(this.fillSpace){
            var rootLayout=null;
            for(var i=0;i<containers.length;i++){
                var root=true;
                for(var j=0;j<containers.length;j++){
                    if(containers[j].contained.contains(containers[i])){
                        root=false;
                        break;
                    }
                }
                if(root){
                    for(var j=0;j<layout.length;j++){
                        if(containers.contains(layout[j]))continue;
                        var sp=layout[j].specialProperties;
                        if(sp){
                            if(sp.refs==null||sp.refs.length==0){
                                root=false;
                            }
                        }
                    }
                }
                if(root){
                    if(rootLayout!=null){
                        rootLayout=null;
                        break;
                    }else{
                        rootLayout=containers[i];
                    }
                }
            }
            if(rootLayout!=null&&
                ((this._additionalLayouts.contains(rootLayout._constructor)||
                 "SectionStack"==rootLayout._constructor||
                ((rootLayout._constructor=="Window"||
                  rootLayout._constructor=="Canvas")&&rootLayout.contained.length==1&&
                  this._additionalLayouts.contains(rootLayout.contained[0]._constructor)&&
                  ((rootLayout.contained[0].width==null||rootLayout.contained[0].width=="100%")&&
                   (rootLayout.contained[0].height==null||rootLayout.contained[0].height=="100%"))
                ))||
                (rootLayout._constructor=="TabSet")))
            {
                rootLayout.width="100%";
                rootLayout.height="100%";
                delete rootLayout.left;
                delete rootLayout.top;
            }
        }
        for(var i=0;i<containers.length;i++){
            containers[i].specialProperties.innerItems=[];
            containers[i].specialProperties.innerItems.addList(containers[i].contained);
            containers[i].specialProperties.innerItems.addList(containers[i].headerContained);
            containers[i].specialProperties.innerItems.addList(containers[i].markupContained);
            delete containers[i].contained;
            delete containers[i].headerContained;
            delete containers[i].markupContained;
        }
        return layout;
    }
,isc.A._getRefCanvas=function isc_MockupImporter__getRefCanvas(widget){
        var refCanvas={
            _constructor:"Canvas",
            ref:widget.ID
        };
        if(widget.specialProperties==null){
            widget.specialProperties={};
        }
        if(widget.specialProperties.refs==null){
            widget.specialProperties.refs=[];
        }
        widget.specialProperties.refs.add(refCanvas);
        return refCanvas;
    }
,isc.A.cleanZIndexParam=function isc_MockupImporter_cleanZIndexParam(layout,containers){
        var _this=this;
        var checkAndCleanZIndex=function(container,absEl){
            var els=_this.getAllChildItems(container);
            for(var j=0;j<els.length;j++){
                var widEl=els[j];
                var wWidth=widEl.width;
                if(wWidth==null&&widEl.specialProperties!=null){
                    wWidth=widEl.specialProperties.measuredWidth;
                }
                var wHeight=widEl.height;
                if(wHeight==null&&widEl.specialProperties!=null){
                    wHeight=widEl.specialProperties.measuredHeight;
                }
                if(wHeight!=null&&wWidth!=null&&
                    widEl.absX!=null&&widEl.absY!=null&&
                    absEl.absX<(widEl.absX+wWidth)&&
                    (absEl.absX+absEl.width)>widEl.absX&&
                    absEl.absY<(widEl.absY+wHeight)&&
                    (absEl.absY+absEl.height)>widEl.absY)
                {
                    absEl.doNotRemoveIndex=true;
                }
            }
            if(absEl.doNotRemoveIndex){
                delete absEl.doNotRemoveIndex;
            }else{
                delete absEl.zIndex;
            }
        }
        for(var i=0;i<containers.length;i++){
            var noParent=true;
            for(var j=0;j<containers.length;j++){
                if(containers[j].contained!=null&&
                        containers[j].contained.contains(containers[i]))
                {
                    noParent=false;
                    break;
                }
            }
            if(noParent)delete containers[i].zIndex;
            if(containers[i].markupContained!=null){
                for(var k=0;k<containers[i].markupContained.length;k++){
                    var absEl=containers[i].markupContained[k];
                    checkAndCleanZIndex(containers[i],absEl);
                }
            }
            for(var j=0;j<containers[i].contained.length;j++){
                if(containers[i].children==null){
                    delete containers[i].contained[j].zIndex;
                }else{
                    checkAndCleanZIndex(containers[i],containers[i].contained[j]);
                }
            }
        }
    }
,isc.A.processLayoutMargin=function isc_MockupImporter_processLayoutMargin(layout,containers,container,widgetsContainer){
        var maxLayoutMargin=40;
        var minLeftMargin=maxLayoutMargin+1;
        var minTopMargin=maxLayoutMargin+1;
        var minRightMargin=maxLayoutMargin+1;
        var minBottomMargin=maxLayoutMargin+1;
        var horiz=container._constructor=="HStack"||container._constructor=="HLayout";
        var wHeight=this.getControlHeightUsingItsParents(containers,container);
        var wWidth=this.getControlWidthUsingItsParents(containers,container);
        var parentContainer=this.getParent(layout,container);
        for(var j=0;j<container.contained.length;j++){
            var c=container.contained[j];
            if(horiz){
                if(j==0&&c.left)minLeftMargin=Math.min(minLeftMargin,c.left);
                if(c.top!=null){
                    minTopMargin=Math.min(minTopMargin,c.top);
                    if(c.height&&wHeight){
                        minBottomMargin=Math.min(minBottomMargin,wHeight-c.top-c.height-1);
                    }
                }
                if(j==(container.contained.length-1)&&c.left&&wWidth&&c.width){
                    minRightMargin=Math.min(minRightMargin,(wWidth-c.left-c.width-1));
                }
            }else{
                if(j==0&&c.top)minTopMargin=Math.min(minTopMargin,c.top);
                if(c.left!=null){
                    minLeftMargin=Math.min(minLeftMargin,c.left);
                    if(wWidth&&c.width){
                        minRightMargin=Math.min(minRightMargin,(wWidth-c.left-c.width-1));
                    }
                }
                if(j==(container.contained.length-1)&&c.top&&wHeight&&c.height){
                    minBottomMargin=Math.min(minBottomMargin,(wHeight-c.top-c.height-1));
                }
            }
        }
        for(var j=0;j<container.contained.length;j++){
            var c=container.contained[j];
            if(this._additionalLayouts.contains(c._constructor)||
                "DynamicForm"==c._constructor)
            {
                var lm=0;
                var tm=0;
                var rm=0;
                if(horiz){
                    if(j==0&&c.left!=null){
                        lm=c.left-minLeftMargin;
                    }else if(j!=0&&container.contained[j-1].showResizeBar&&
                            container.contained[j-1].extraSpace){
                        lm=container.contained[j-1].extraSpace-12;
                        delete container.contained[j-1].extraSpace;
                    }
                    if(c.top!=null){
                        tm=c.top-minTopMargin;
                    }
                    if(j==(container.contained.length-1)&&c.left!=null&&wWidth!=null&&c.width!=null){
                        rm=wWidth-c.left-c.width-minRightMargin;
                    }
                }else{
                    if(c.left!=null){
                        lm=c.left-minLeftMargin;
                    }
                    if(j==0&&c.top!=null){
                        tm=c.top-minTopMargin;
                    }else if(j!=0&&container.contained[j-1].showResizeBar&&
                            container.contained[j-1].extraSpace){
                        tm=container.contained[j-1].extraSpace-12;
                        delete container.contained[j-1].extraSpace;
                    }
                    if(c.left!=null&&wWidth!=null&&c.width!=null){
                        rm=wWidth-c.left-c.width-minRightMargin;
                    }
                }
                lm+=c.specialProperties.lm||0;
                rm+=c.specialProperties.rm||0;
                tm+=c.specialProperties.tm||0;
                if("DynamicForm"==c._constructor){
                    var minPadding=Math.min(lm,Math.min(rm,tm));
                    if(minPadding>0){
                        c.padding=minPadding;
                        lm-=minPadding;
                        tm-=minPadding;
                        rm-=minPadding
                    }
                    var isHorizontal=container._constructor=="HStack"||
                        container._constructor=="HLayout";
                    if(!isHorizontal&&j>0&&tm>0){
                        container.contained[j-1].extraSpace=
                            (container.contained[j-1].extraSpace||0)+tm;
                    }else{
                        var skinCellPadding=isc.ListGrid.getInstanceProperty("cellPadding");
                        tm-=skinCellPadding;
                        if(c.items&&tm>3){
                            c.items.addAt({
                                type:"SpacerItem",
                                height:tm,
                                colSpan:"*"
                            },0);
                        }
                    }
                }else{
                    if(lm>0&&c.layoutLeftMargin==null)c.layoutLeftMargin=lm;
                    if(tm>0&&c.layoutTopMargin==null)c.layoutTopMargin=tm;
                    if(rm>0&&c.layoutRightMargin==null)c.layoutRightMargin=rm;
                }
            }
        }
        if(container._constructor=="SectionStack"&&
            ((minLeftMargin>0&&minLeftMargin<=maxLayoutMargin)||
            (minTopMargin>0&&minTopMargin<=maxLayoutMargin)||
            (minRightMargin>0&&minRightMargin<=maxLayoutMargin)||
            (container.membersMargin!=null)))
        {
            var c={
                ID:container.ID+"_VStack",
                _constructor:"VStack",
                autoDraw:false,
                contained:container.contained,
                specialProperties:{
                    controlName:"Stack"
                }
            };
            containers.addAt(c,containers.indexOf(container)+1);
            layout.addAt(c,widgetsContainer?layout.indexOf(widgetsContainer):layout.indexOf(container));
            if(container.membersMargin){
                c.membersMargin=container.membersMargin;
                delete container.membersMargin;
            }
            container.contained=[c];
        }
        if(parentContainer&&parentContainer._constructor=="SectionStack")
        {
            minRightMargin=0;
            minBottomMargin=0;
            delete container.layoutRightMargin;
            delete container.layoutBottomMargin;
        }
        if((minLeftMargin>0&&minLeftMargin<=maxLayoutMargin)||
            (minTopMargin>0&&minTopMargin<=maxLayoutMargin)||
            (minRightMargin>0&&minRightMargin<=maxLayoutMargin)||
            (minBottomMargin>0&&minBottomMargin<=maxLayoutMargin))
        {
            var c=null;
            if(widgetsContainer!=null){
                c=widgetsContainer;
            }else if(container._constructor=="Window"){
                c={};
                container.bodyDefaults=c;
            }else if(container._constructor=="SectionStack"){
                c=container.contained[0];
            }else{
                c=container;
            }
            if(c!=null){
                if(container.specialProperties==null){
                    container.specialProperties={};
                }
                container.specialProperties.layoutContainer=c;
                if(c._constructor=="DynamicForm"){
                    var avgPadding=Math.round((minLeftMargin+minTopMargin)/2);
                    var maxDiff=10;
                    if(Math.abs(minTopMargin-avgPadding)<maxDiff&&
                        Math.abs(minLeftMargin-avgPadding)<maxDiff&&
                        (avgPadding-minRightMargin)<maxDiff)
                    {
                        c.padding=avgPadding;
                    }
                }else if(!c.specialProperties||
                    c.specialProperties.controlName!="com.balsamiq.mockups::BrowserWindow")
                {
                    if(minLeftMargin>0&&minLeftMargin<=maxLayoutMargin){
                        c.layoutLeftMargin=minLeftMargin;
                    }
                    if(minTopMargin>0&&minTopMargin<=maxLayoutMargin){
                        c.layoutTopMargin=minTopMargin;
                    }
                    if(minRightMargin>0&&minRightMargin<=maxLayoutMargin){
                        c.layoutRightMargin=minRightMargin;
                    }
                    if(minBottomMargin>0&&minBottomMargin<=maxLayoutMargin){
                        c.layoutBottomMargin=minBottomMargin;
                    }
                }
            }
        }
    }
,isc.A.processRemoveWidths=function isc_MockupImporter_processRemoveWidths(layout,containers,container){
        var transformRules=this._transformRules;
        var prop=transformRules.widgetPropertyTranslations[container.specialProperties.controlName];
        for(var j=0;j<container.contained.length;j++){
            var control=container.contained[j];
            var fullWidth=null;
            var fullHeight=null;
            var parent=this.getParent(layout,container);
            var specialProperties=control.specialProperties;
            var layoutWidth=this.getControlWidthUsingItsParents(layout,container);
            var lm=0;
            var rm=0;
            var tm=0;
            var bm=0;
            if(specialProperties&&specialProperties.controlName){
                var controlProp=transformRules.widgetPropertyTranslations[control.specialProperties.controlName];
                if(controlProp){
                    var lm=controlProp.getLeftMargin?controlProp.getLeftMargin(control):0;
                    var rm=controlProp.getRightMargin?controlProp.getRightMargin(control):0;
                    var tm=controlProp.getTopMargin?controlProp.getTopMargin(control):0;
                    var bm=controlProp.getLeftMargin?controlProp.getLeftMargin(control):0;
                }
            }
            var controlLeft=specialProperties&&specialProperties.left||control.left;
            var controlTop=specialProperties&&specialProperties.top||control.top;
            if(controlLeft<=(this.stackContainerFillInset+lm)
                &&(control.left+control.width)>=
                (layoutWidth-(this.stackContainerFillInset+rm))||
                ((container._constructor=="VStack"||container._constructor=="VLayout")&&
                (control._constructor=="HStack"||control._constructor=="HLayout")))
            {
                if(!control.specialProperties)control.specialProperties={};
                control.specialProperties.fullWidth=true;
                control.specialProperties.containerName=container._constructor;
                fullWidth=true;
            }
            var layoutHeight=this.getControlHeightUsingItsParents(layout,container);
            if((controlTop<=(this.stackContainerFillInset+tm)
                &&((control.top+control.height)>=
                (layoutHeight-(this.stackContainerFillInset+bm))))||
                ((container._constructor=="HStack"||container._constructor=="HLayout")&&
                 (control._constructor=="VStack"||control._constructor=="VLayout")))
            {
                if(!control.specialProperties)control.specialProperties={};
                control.specialProperties.fullHeight=true;
                control.specialProperties.containerName=container._constructor;
                fullHeight=true;
            }
            if((container._constructor=="TabSet"||
                container._constructor=="Window"||
                container._constructor=="SectionStack"||
                container._constructor=="VStack"||
                container._constructor=="VLayout")&&
                control.width!=null&&
                (control.specialProperties==null||
                 control.specialProperties.overrideWidth==null))
            {
                if(control.left<=this.stackContainerFillInset){
                    control.layoutAlign="left";
                }else if(control.left+control.width>=
                  (container.width-this.stackContainerFillInset-prop.getLeftMargin(container)
                 -prop.getRightMargin(container)))
                {
                    control.layoutAlign="right";
                }else if(Math.abs(control.left+control.width/2-
                  (container.width-prop.getLeftMargin(container)
                 -prop.getRightMargin(container))/2)<=this.stackContainerFillInset)
                {
                    control.layoutAlign="center";
                }else if(control._constructor=="Label"){
                    var margin=control.left-container.left+prop.getLeftMargin(container);
                    if(margin>this.stackContainerFillInset/2){
                        control.align="right";
                    }
                }
                if(!control.layoutAlign&&control.width>10){
                    var smaller=true;
                    for(var i=0;i<container.contained.length;i++){
                        var c=container.contained[i];
                        if(c!=control&&control.width>(c.width*0.85)){
                            smaller=false;
                            break;
                        }
                    }
                    if(smaller){
                        var innerWidth=(container.width-prop.getLeftMargin(container)-prop.getRightMargin(container));
                        var rightSpace=innerWidth-(control.left+control.width);
                        if(control.left>rightSpace)control.layoutAlign="right";
                    }
                }
            }else if((container._constructor=="HStack"||container._constructor=="HLayout")
                &&control.height!=null)
            {
                if(control.top<=this.stackContainerFillInset){
                    control.layoutAlign="top";
                }else if(control.top+control.height>=
                  (container.height-this.stackContainerFillInset-prop.getTopMargin(container)
                 -prop.getBottomMargin(container)))
                {
                    control.layoutAlign="bottom";
                }else if(Math.abs(control.top+control.height/2-
                  (container.height-prop.getTopMargin(container)
                 -prop.getBottomMargin(container))/2)<this.stackContainerFillInset)
                {
                    control.layoutAlign="center";
                }
                if(control._constructor=="Label"&&control.layoutAlign&&
                    control.layoutAlign!="center")
                {
                }
            }
            if(fullWidth&&fullHeight&&container.contained.length>1){
                this.processSnapToHeuristic(layout,container,control);
                break;
            }
        }
    }
);
isc.evalBoundary;isc.B.push(isc.A.processSnapToHeuristic=function isc_MockupImporter_processSnapToHeuristic(layout,container,fullSizeControl){
        var snapToMaxOffset=5;
        for(var i=0;i<container.contained.length;i++){
            var control=container.contained[i];
            if(control!=fullSizeControl){
                if(control.width!=null){
                    var width=this.getControlWidthUsingItsParents(layout,container);
                    if(Math.abs(width-control.width)<=snapToMaxOffset*2){
                    }else if(Math.abs(width-(control.left+control.width))<=snapToMaxOffset){
                       control.snapToHor="R";
                       delete control.left;
                    }else if(Math.abs(width/2-(control.left+control.width/2))<=snapToMaxOffset){
                       control.snapToHor="C";
                       delete control.left;
                    }else if(control.left<=snapToMaxOffset){
                       control.snapToHor="L";
                       delete control.left;
                    }
                }
                if(control.height!=null){
                    var height=this.getControlHeightUsingItsParents(layout,container);
                    if(Math.abs(height-control.height)<=snapToMaxOffset*2){
                    }else if(Math.abs(height-(control.top+control.height))<=snapToMaxOffset){
                       control.snapToVer="B";
                       delete control.top;
                    }else if(Math.abs(height/2-(control.top+control.height/2))<=snapToMaxOffset){
                       control.snapToVer="C";
                       delete control.top;
                    }else if(control.top<=snapToMaxOffset){
                       control.snapToVer="T";
                       delete control.top;
                    }
                }
                var snapTo="";
                if(control.snapToVer!=null){
                    snapTo+=control.snapToVer;
                    delete control.snapToVer;
                    delete control.layoutTopMargin;
                }
                if(control.snapToHor!=null){
                    if(control.snapToVer=="C"){
                        snapTo=control.snapToHor;
                    }else{
                        snapTo+=control.snapToHor;
                    }
                    delete control.snapToHor;
                    delete control.layoutLeftMargin;
                }
                if(container.markupContained==null){
                    container.markupContained=[];
                }
                if(snapTo!=null&&snapTo!=""){
                    control.snapTo=snapTo;
                    container.markupContained.add(control);
                    container.contained.removeAt(i);
                    i--;
                }else{
                    container.markupContained.add(control);
                    container.contained.removeAt(i);
                    i--;
                }
            }
        }
        return layout;
    }
,isc.A.getControlHeightUsingItsParents=function isc_MockupImporter_getControlHeightUsingItsParents(layout,control){
        var height=control.height,
            transformRules=this._transformRules;
        if(height==null){
            var wel=this.getParent(layout,control);
            while(wel!=null&&wel.height==null){
                wel=this.getParent(layout,wel);
            }
            if(wel!=null){
                var prop=transformRules.widgetPropertyTranslations[wel.specialProperties.controlName];
                height=wel.height-prop.getTopMargin(wel)-prop.getBottomMargin(wel);
            }
        }else{
            var prop=transformRules.widgetPropertyTranslations[control.specialProperties.controlName];
            if(prop.getTopMargin!=null&&prop.getBottomMargin!=null){
                height=control.height-prop.getTopMargin(control)-prop.getBottomMargin(control);
            }
        }
        return height;
    }
,isc.A.getControlWidthUsingItsParents=function isc_MockupImporter_getControlWidthUsingItsParents(layout,control){
        var width=control.width,
            transformRules=this._transformRules;
        if(width==null){
            var wel=this.getParent(layout,control);
            while(wel!=null&&wel.width==null){
                wel=this.getParent(layout,wel);
            }
            if(wel!=null){
                var prop=transformRules.widgetPropertyTranslations[wel.specialProperties.controlName];
                width=wel.width-prop.getLeftMargin(wel)-prop.getRightMargin(wel);
            }
        }else{
            var prop=transformRules.widgetPropertyTranslations[control.specialProperties.controlName];
            if(prop.getLeftMargin!=null&&prop.getRightMargin!=null){
                width=control.width-prop.getLeftMargin(control)-prop.getRightMargin(control);
            }
        }
        return width;
    }
,isc.A.getParent=function isc_MockupImporter_getParent(layout,child){
        for(var i=0;i<layout.length;i++){
            if(layout[i].contained!=null&&layout[i].contained.contains(child)){
                return layout[i];
            }
            if(layout[i].children!=null&&layout[i].children.contains(child)){
                return layout[i];
            }
        }
        return null;
    }
,isc.A.processFluidLayoutHeuristic=function isc_MockupImporter_processFluidLayoutHeuristic(layout,containers){
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            var specialProperties=container.specialProperties;
            if(container._constructor=="TabSet"){
                var pane=container.tabs&&container.tabs[container.selectedTab]?container.tabs[container.selectedTab].pane:null;
                if(pane&&pane.VStack){
                    container=pane.VStack;
                    container._constructor="VStack";
                }
            }
            if((specialProperties&&(specialProperties.fullWidth||specialProperties.fullHeight))||
                    container.height==null||container.height=="100%"||container.width==null||container.width=="100%")
            {
                var breadthProp=(container._constructor=="HStack"||container._constructor=="HLayout"?"height":"width"),
                    lengthProp=(container._constructor=="HStack"||container._constructor=="HLayout"?"width":"height");
                if(container._constructor=="HStack"||container._constructor=="HLayout"||container._constructor=="VStack"){
                    for(var j=0;j<specialProperties.innerItems.length;j++){
                        var widget=specialProperties.innerItems[j],
                            widgetSize=widget[breadthProp],
                            containerSize=container[breadthProp];
                        if(widgetSize>(containerSize-this.stackContainerFillInset)){
                            this.removeWidgetSizeProperty(widget,(breadthProp=="width"));
                        }
                    }
                }
                if(container._constructor=="HStack"||container._constructor=="HLayout"||container._constructor=="VStack"){
                    var widgetToExpand=[];
                    var priority=0;
                    for(var j=0;j<specialProperties.innerItems.length;j++){
                        var widget=specialProperties.innerItems[j];
                        if(widgetToExpand.isEmpty()&&
                            ((widget._constructor=="HLayout"&&container._constructor=="HStack")||
                             (widget._constructor=="VLayout"&&container._constructor=="VStack")))
                        {
                            if(priority!=1){
                                widgetToExpand.clear();
                                priority=1;
                            }
                            widgetToExpand.add(widget);
                        }
                        if(widget._constructor=="ListGrid"&&
                            (widgetToExpand.isEmpty()||priority>=2))
                        {
                            if(priority!=2){
                                widgetToExpand.clear();
                                priority=2;
                            }
                            widgetToExpand.add(widget);
                        }
                        if(widget._constructor=="DynamicForm"&&
                            container._constructor=="VStack"&&
                            (widgetToExpand.isEmpty()||priority>=3))
                        {
                            if(widget.items!=null||widget.fields!=null){
                                var items=widget.items||widget.fields;
                                for(var k=0;k<items.length;k++){
                                    var item=items[k];
                                    if(item._constructor=="TextAreaItem"){
                                        if(priority!=3){
                                            widgetToExpand.clear();
                                            priority=3;
                                        }
                                        widgetToExpand.add(widget);
                                        break;
                                    }
                                }
                            }
                        }
                        if(widget._constructor=="TabSet"&&
                            (widgetToExpand.isEmpty()||priority>=4))
                        {
                            var innerItems=widget.specialProperties&&widget.specialProperties.innerItems,
                                pane=innerItems&&innerItems[0];
                            if(pane&&pane._constructor!="HStack"&&pane._constructor!="VStack"&&
                                    pane.specialProperties&&pane.specialProperties.fullHeight&&pane.specialProperties.fullWidth)
                            {
                                if(priority!=4){
                                    widgetToExpand.clear();
                                    priority=4;
                                }
                                widgetToExpand.add(widget);
                            }
                        }
                        if(widget.specialProperties&&widget.specialProperties.innerItems&&
                            (widgetToExpand.isEmpty()||priority>=5))
                        {
                            var innerItems=widget.specialProperties.innerItems,
                                singleInnerItem=(innerItems.length==1&&innerItems[0]),
                                singleControlName=(
                                    singleInnerItem&&
                                    singleInnerItem.specialProperties!=null&&
                                    singleInnerItem.specialProperties.controlName),
                                singleTagCloud=(singleControlName=="com.balsamiq.mockups::TagCloud");
                            if(!singleTagCloud){
                                if(priority!=5){
                                    widgetToExpand.clear();
                                    priority=5;
                                }
                                widgetToExpand.add(widget);
                            }
                        }
                    }
                    if(!widgetToExpand.isEmpty()){
                        if(widgetToExpand.length>1){
                            var propName=(container._constructor=="HStack"||container._constructor=="HLayout")?"width":"height";
                            var minSize=widgetToExpand[0][propName];
                            var maxSize=widgetToExpand[0][propName];
                            var largestWidget=widgetToExpand[0];
                            for(var ind=1;ind<widgetToExpand.length;ind++){
                                var currentWidget=widgetToExpand[ind];
                                var currentSize=currentWidget[propName];
                                if(currentSize<minSize){
                                    minSize=currentSize;
                                }else if(currentSize>maxSize){
                                    maxSize=currentSize;
                                    largestWidget=currentWidget;
                                }
                            }
                            if(maxSize-minSize<this.stackFlexMaxSizeMatch){
                                for(var ind=0;ind<widgetToExpand.length;ind++){
                                    this.removeWidgetSizeProperty(widgetToExpand[ind],(propName=="width"));
                                }
                            }else{
                                this.removeWidgetSizeProperty(largestWidget,(propName=="width"));
                            }
                        }else{
                            this.removeWidgetSizeProperty(widgetToExpand[0],
                                    (container._constructor=="HStack"||container._constructor=="HLayout"));
                        }
                        if(container._constructor=="HStack"){
                            container._constructor="HLayout";
                        }else if(container._constructor=="VStack"){
                            container._constructor="VLayout";
                        }
                    }
                }
            }
        }
        return layout;
    }
,isc.A.removeWidgetSizeProperty=function isc_MockupImporter_removeWidgetSizeProperty(widget,isWidth){
        if(isWidth){
            delete widget.width;
            if(widget._constructor=="DynamicForm"){
                widget.width="*";
                var items=widget.items||widget.fields;
                if(items){
                    for(var i=0;i<items.length;i++){
                        if(items[i]._constructor=="TextAreaItem"){
                            items[i].width="*";
                        }
                    }
                }
            }
        }else{
            delete widget.height;
            if(widget._constructor=="DynamicForm"){
                var items=widget.items||widget.fields,
                    foundTextAreaItem=false
                ;
                if(items){
                    for(var i=0;i<items.length;i++){
                        if(items[i]._constructor=="TextAreaItem"){
                            items[i].height="*";
                            foundTextAreaItem=true;
                        }
                    }
                    if(foundTextAreaItem)widget.height="*";
                }
            }
        }
    }
,isc.A.processTabVStackHeuristic=function isc_MockupImporter_processTabVStackHeuristic(layout,containers){
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(container._constructor=="TabSet"){
                var tabs=container.tabs;
                for(var j=0;j<tabs.length;j++){
                    var tab=tabs[j];
                    if(tab.pane&&tab.pane.VStack){
                        var pane=tab.pane.VStack,
                            innerItems=container.specialProperties.innerItems
                        ;
                        pane.ID=container.ID+"_pane"+j;
                        if(!pane._constructor)pane._constructor="VStack";
                        if(!pane.specialProperties)pane.specialProperties={};
                        if(!pane.specialProperties.innerItems)pane.specialProperties.innerItems=[];
                        for(var k=0;k<pane.members.length;k++){
                            var item=innerItems.find("ID",pane.members[k]);
                            if(item){
                                innerItems.remove(item);
                                pane.specialProperties.innerItems.add(item);
                            }
                            pane.members[k]={ref:pane.members[k]};
                        }
                        tab.pane=pane.ID;
                        layout.addAt(pane,layout.indexOf(container));
                        innerItems.add(pane);
                    }
                }
            }
        }
        return layout;
    }
,isc.A.logWarn=function isc_MockupImporter_logWarn(message,category){
        this.Super("logWarn",arguments);
        this.warnings+="\n"+message;
    }
);
isc.B._maxIndex=isc.C+81;

isc.ClassFactory.defineClass("BMMLImportDialog",isc.Dialog);
isc.A=isc.BMMLImportDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.showFileNameField=true;
isc.A.showAssetsNameField=true;
isc.A.showOutputField=true;
isc.A.outputFieldTitle="Output File Name";
isc.A.showSkinSelector=true;
isc.A.showImportForm=true;
isc.A.autoSize=true;
isc.A.autoCenter=true;
isc.A.showMinimize=false;
isc.A.title="Import Balsamiq File";
isc.A.showToolbar=false;
isc.A.skin="Tahoe";
isc.A.importFormDefaults={
        _constructor:"FilePickerForm",
        autoDraw:false,
        showPickButton:false,
        showPasteForm:false,
        isGroup:true,
        groupTitle:"Mockup File Location",
        uploadFormProperties:{
            initWidget:function(){
                this.Super("initWidget",arguments);
                var fileField=this.getField("file");
                fileField.accept=".bmml,.bmpr";
                if(!this.creator.showAssetsNameField)return;
                var uploadForm=this;
                this.addField({
                    name:"assetsName",
                    title:"Upload assets",
                    editorType:isc.TLinkItem||isc.LinkItem,
                    target:"javascript",
                    defaultValue:"upload an asset file",
                    width:"*",colSpan:"*",
                    startRow:true,
                    canEdit:false,
                    click:function(form,item){
                        var windowClass=isc.TWindow||isc.Dialog;
                        var loadAssetDialog=windowClass.create({
                            title:"Load asset",
                            height:140,
                            width:400,
                            showToolbar:false,
                            autoCenter:true
                        });
                        var _form=form;
                        var loadAssetForm=isc.DynamicForm.create({
                            dataSource:form.dataSource,
                            numCols:3,
                            cellPadding:5,
                            colWidths:"140, 180, *",
                            autoDraw:false,
                            fields:[
                                {
                                    name:"file",
                                    editorType:isc.TFileItem||isc.FileItem,
                                    title:"Asset file",
                                    colSpan:3,
                                    endRow:true
                                },{
                                    type:"SpacerItem"
                                },{
                                    name:"submitButton",
                                    title:"Load",
                                    editorType:isc.TButtonItem||isc.ButtonItem,
                                    endRow:false,
                                    startRow:false,
                                    align:"right",
                                    click:function(assetForm,item){
                                        if(assetForm.getValues().file!=null){
                                            assetForm.getValues().file_dir="[VBWORKSPACE]/assets";
                                            loadAssetDialog.hide();
                                            assetForm.saveData(uploadForm.getID()+
                                                ".uploadAssetCallback(dsResponse, data)");
                                        }else{
                                            isc.warn("Select asset to upload");
                                        }
                                    }
                                },{
                                    name:"cancelButton",
                                    title:"Cancel",
                                    align:"right",
                                    editorType:isc.TButtonItem||isc.ButtonItem,
                                    startRow:false,
                                    click:function(form,item){
                                        loadAssetDialog.hide();
                                    }
                                }
                            ]
                        });
                        loadAssetDialog.addItem(loadAssetForm);
                        loadAssetDialog.show();
                    }
                });
            },
            uploadAssetCallback:function(dsResponse,data,clearFile){
                var form=this;
                var assetFile=data.fileName;
                if(form.assetFiles==null){
                    form.assetFiles=[];
                }
                if(!form.assetFiles.contains(assetFile))
                {
                    form.assetFiles.add(assetFile);
                }
                if(form.assetFiles.length==1){
                    form.setValue("assetsName",
                        form.assetFiles[0]+
                        " (click to upload more)");
                }else{
                    form.setValue("assetsName",
                        form.assetFiles.length+
                        " assets (click to upload more)");
                }
                if(clearFile){
                    form.getField("file").clearValue();
                }
            }
        },
        selectFormProperties:{
            selectFileDialogProperties:{
                actionStripControls:["spacer:10","pathLabel",
                    "previousFolderButton","spacer:10","upOneLevelButton",
                    "spacer:10","refreshButton","spacer:2"],
                title:"Import Balsamiq File",
                initialDir:"[VBWORKSPACE]",
                rootDir:"/",
                webrootOnly:false,
                fileFilters:[{
                    filterName:"BMPR/BMML Files",
                    filterExpressions:[new RegExp("\\.bmpr$"),new RegExp("\\.bmml$")]
                }],
                checkFile:function(fileName){
                    if(fileName.match(/\.(bmpr)$/i)==null&&fileName.match(/\.(bmml)$/i)==null){
                        isc.say("Only BMPR and BMML files may be imported (must end with .bmpr or .bmml)");
                        return false;
                    }else{
                        return true;
                    }
                }
            },
            initWidget:function(){
                this.Super("initWidget",arguments);
                this.getField("fileName").setPrompt("Click to select the BMPR or BMML file you want to import.");
            }
        },
        uploadCallback:function(dsResponse,data){
            var filePath=data.path;
            var id=data.id;
            var fileName=data.fileName;
            var v=this.valuesToSend;
            this.creator.submit(filePath,id,v.outputFileName,data.file,v.skin,
                v.dropMarkup,v.trimSpace,v.fillSpace,v.fieldNamingConvention,false,true);
        }
    };
isc.A.formsDefaults={
        titleWidth:140,
        cellPadding:6,
        width:"100%"
    };
isc.B.push(isc.A.initWidget=function isc_BMMLImportDialog_initWidget(){
        this.Super("initWidget",arguments);
        this.vm=isc.ValuesManager.create();
        this.vm.setValues({
            uploadFromURL:this.uploadFromURL,
            outputFileName:this.outputFileName,
            skin:this.skin,
            dropMarkup:this.dropMarkup,
            trimSpace:this.trimSpace,
            fillSpace:this.fillSpace,
            fieldNamingConvention:this.fieldNamingConvention
        });
        if(this._fileUploaded!=null&&!this._fileUploaded){
            this.vm.getValues().fileName=this.fileName;
        }
        var showFileNameField=this.showFileNameField;
        var scUploadSaveFileDS=isc.DataSource.get("SCUploadSaveFile");
        var importer=this;
        scUploadSaveFileDS.performCustomOperation("checkUploadFeature",null,
            function(response,data){
                if(response.status==isc.RPCResponse.STATUS_SUCCESS){
                    importer.importForm=importer.createAutoChild("importForm",{
                        visibility:importer.showImportForm?"inherit":"hidden",
                        showSelectForm:importer.showFileNameField,
                        showAssetsNameField:importer.showAssetsNameField,
                        showUploadForm:true,
                        valuesManager:importer.vm,
                        formsProperties:importer.formsDefaults
                    });
                }else{
                    importer.importForm=importer.createAutoChild("importForm",{
                        visibility:importer.showImportForm?"inherit":"hidden",
                        showSelectForm:importer.showFileNameField,
                        showAssetsNameField:false,
                        showUploadForm:false,
                        valuesManager:importer.vm,
                        formsProperties:importer.formsDefaults
                    });
                }
                importer.importForm.setDataSource(scUploadSaveFileDS);
                importer.addItem(importer.importForm);
                importer.addItem(importer._createHeadForm());
                importer.addItem(importer._createSettingsHeaderForm());
                importer.addItem(importer._createFlagsForm());
                importer.addItem(importer._createActionsForm());
                importer.addItem(importer._createButtonBar());
                importer.importForm.delayCall("focus",[]);
            },
            {willHandleError:true}
        );
    }
,isc.A.submit=function isc_BMMLImportDialog_submit(fileName,outputFileName,fileContent,skin,dropMarkup,trimSpace,fillSpace,fieldNamingConvention,autoRefresh,fileUploaded){
    }
,isc.A._createActionsForm=function isc_BMMLImportDialog__createActionsForm(){
        var dialog=this;
        var fields=[{
            name:"fieldNamingConvention",
            editorType:isc.TSelectItem||isc.SelectItem,
            width:175,
            title:"Field Naming Convention",
            defaultValue:"camelCaps",
            startRow:false,endRow:true,
            valueMap:{
                camelCaps:"camelCaps",
                underscores:"Underscores",
                underscoresAllCaps:"Underscores All Caps",
                underscoresKeepCase:"Underscores Keep Case"
            },
            hoverWidth:200,
            titleHoverHTML:function(item,form){
                return"Naming convention used when translating grid column labels and input "+
                       "field labels to DataSource field identifiers.  This does not affect the "+
                       "appearance or behavior of the imported mockup, just the identifiers "+
                       "used when connecting your imported mockup to real data."+
                       "<P>"+
                       "Choose a naming convention that is similar to how your Java code or "+
                       "database columns are named - hover options in the drop-down list for "+
                       "details."+
                       "<P>"+
                       "If unsure, keep the default of \"camelCaps\".";
            },
            itemHoverHTML:function(item,form){
                var value=item.getValue();
                if(value=="camelCaps"){
                    return"For example, \"First Name\" becomes \"firstName\".  Best setting "+
                           "for binding to Java Beans (including Hibernate and JPA) and databases "+
                           "where columns names have no underscores, for example, \"FIRSTNAME\".";
                }else if(value=="underscores"){
                    return"For example, \"First Name\" becomes \"first_name\".  Best setting for "+
                           "databases that have underscores in column names, for example, "+
                           "\"FIRST_NAME\".";
                }else if(value=="underscoresAllCaps"){
                    return"For example, \"First Name\" becomes \"FIRST_NAME\".  Alternative to "+
                           "\"Underscores\" for developers who prefer field identifiers to be "+
                           "all caps.";
                }else if(value=="underscoresKeepCase"){
                    return"For example, \"First Name\" becomes \"First_Name\".  Alternative to "+
                           "\"Underscores\" for developers who prefer field identifiers to be "+
                           "mixed case.";
                }
            }
        }];
        if(this.showOutputField){
             fields.add({
                 name:"outputFileName",
                 title:this.outputFieldTitle,
                 type:isc.TTextItem||isc.TextItem,
                 width:450,
                 hoverWidth:200,
                 hint:"Optional",
                 itemHoverHTML:function(){
                     return"Writes the source code of the imported screen to the specified "+
                            "path.  If the specified path is relative (does not start with "+
                            "a slash), it is assumed to be relative to webroot/tools.  "+
                            "If the file name ends in 'js' the output is JavaScript, "+
                            "otherwise it's XML.";
                 },
                 titleHoverHTML:function(){
                     return this.itemHoverHTML()
                 }
             });
        }
        return isc.DynamicForm.create(isc.addProperties({
            autoDraw:false,
            autoFocus:true,
            saveOnEnter:true,
            wrapItemTitles:false,
            width:"100%",
            useAllDataSourceFields:false,
            valuesManager:this.vm,
            fields:fields,
            isGroup:true,
            showGroupLabel:false,
            groupBorderCSS:"1px solid transparent"
        },this.formsDefaults,this.formsProperties));
    }
,isc.A._createButtonBar=function isc_BMMLImportDialog__createButtonBar(){
        var dialog=this;
        var button=isc.Button.create({
            title:dialog.showImportForm?"Import":"Update",
            width:100,
            layoutAlign:"right",
            click:function(form,item){
                var values=isc.addProperties(dialog.vm.getValues());
                if(dialog.importForm.uploadForm){
                    values=isc.addProperties(values,dialog.importForm.uploadForm.getValues());
                }
                var fileUrl=values.fileURL;
                if(values.fileName=='select file'&&values.file==null&&fileUrl==null&&
                    !(dialog._fileUploaded&&dialog.fileName!=null)&&dialog.showImportForm)
                {
                    isc.warn("Select a file to process.");
                }else{
                    if(values.file!=null){
                        values.file_dir="[READ_ONLY]";
                        if(dialog.showAssetsNameField&&
                            (values.file=="symbols.bmml"||
                             values.file.endsWith("\symbols.bmml")))
                        {
                            isc.ask("The file 'symbols.bmml' looks like an asset file. "+
                                "Do you want to convert it or add to assets?",
                                function(value){
                                },{buttons:[
                                    isc.Button.create({
                                        title:"Convert",
                                        click:function(){
                                            this.topElement.hide();
                                            if(dialog.importForm.creator)dialog.importForm.creator.hide();
                                            values.file_dir="[READ_ONLY]";
                                            dialog.importForm.valuesToSend=isc.clone(values);
                                            dialog.importForm.saveData(dialog.importForm.getID()+
                                                ".uploadCallback(dsResponse, data)");
                                        }
                                    }),
                                    isc.Button.create({
                                        title:"Add to assets",
                                        click:function(){
                                            this.topElement.hide();
                                            values.file_dir="[VBWORKSPACE]/assets";
                                            dialog.importForm.valuesToSend=isc.clone(values);
                                            dialog.importForm.saveData(dialog.importForm.getID()+
                                                ".uploadAssetCallback(dsResponse, data, true)");
                                        }
                                    })
                                ]});
                        }else{
                            if(dialog.importForm.creator)dialog.importForm.creator.hide();
                            values.file_dir=(values.file.endsWith(".bmpr")?"[BMPR]":"[READ_ONLY]");
                            dialog.importForm.valuesToSend=isc.clone(values);
                            if(values.file_dir&&dialog.importForm.uploadForm){
                               dialog.importForm.uploadForm.setValue("file_dir",values.file_dir);
                            }
                            dialog.importForm.saveData(dialog.importForm.getID()+
                                ".uploadCallback(dsResponse, data)");
                        }
                    }else{
                        if(fileUrl!=null){
                            if(!fileUrl.startsWith("http")){
                                fileUrl="http://"+fileUrl;
                            }
                            var regexp=new RegExp("^http(?:s)?://([^/:]+)(?::[0-9]+)?(/.*)?$"),
                                matches=fileUrl.match(regexp),
                                hostname=(matches!=null&&matches[1]!=null?
                                        matches[1].toString():""),
                                mybalsamiq=hostname=="mybalsamiq.com"||
                                             hostname.endsWith(".mybalsamiq.com");
                            if(mybalsamiq){
                                var path=(matches!=null&&matches[2]!=null?
                                            matches[2].toString():""),
                                    offset=fileUrl.length-path.length;
                                if(path!=""&&path!="/"&&!fileUrl.endsWith(".bmml")){
                                    fileUrl+=".bmml";
                                }
                                var j=-1;
                                while((j=path.indexOf("/edit/",j+1))!=-1){
                                    var k=j+offset;
                                    fileUrl=fileUrl.substring(0,k)+fileUrl.substring(k+5);
                                    offset=offset-5;
                                }
                            }
                        }
                        var autoRefresh=fileUrl!=null,
                            fileUploaded=dialog._fileUploaded,
                            fileName=fileUploaded&&values.fileName=="select file"&&
                                                      !values.fileURL&&dialog.fileName;
                        if(!dialog.showImportForm)autoRefresh=true;
                        else fileName=fileName||fileUrl||values.fileName;
                        if(dialog.importForm.creator)dialog.importForm.creator.hide();
                        dialog.submit(fileName,values.outputFileName,null,
                            values.skin,values.dropMarkup,values.trimSpace,
                            values.fillSpace,values.fieldNamingConvention,autoRefresh,fileUploaded);
                    }
                }
            }
        });
        var layout=isc.HLayout.create({
            autoDraw:false,
            height:10,
            width:"100%",
            layoutTopMargin:5,
            members:[
                isc.LayoutSpacer.create(),
                button
            ]
        });
        return layout;
    }
,isc.A._createSettingsHeaderForm=function isc_BMMLImportDialog__createSettingsHeaderForm(){
        var fields=[];
        fields.addList([
            {
                name:"header",
                type:"header",
                defaultValue:"Advanced Settings",
                width:"*",
                align:"center"
            }
        ]);
        return isc.DynamicForm.create(isc.addProperties({
            autoDraw:false,
            numCols:1,
            width:"100%",
            wrapItemTitles:false,
            fields:fields,
            isGroup:true,
            showGroupLabel:false,
            groupBorderCSS:"1px solid transparent"
        },this.formsDefaults,this.formsProperties));
    }
,isc.A._createFlagsForm=function isc_BMMLImportDialog__createFlagsForm(){
        var fields=[];
        fields.addList([
            {
                name:"dropMarkup",
                title:"Drop Markup",
                titleAlign:"left",
                editorType:isc.TCheckboxItem||isc.CheckboxItem,
                labelAsTitle:true,
                defaultValue:true,
                hoverWidth:200,
                width:"*",
                startRow:true,
                itemHoverHTML:function(){
                    return"If enabled, markup elements such as sticky notes and "+
                        "strikethroughs are dropped during import.";
                },
                titleHoverHTML:function(){
                    return this.itemHoverHTML()
                }
            },
            {
                name:"trimSpace",
                title:"Trim Space",
                editorType:isc.TCheckboxItem||isc.CheckboxItem,
                labelAsTitle:true,
                defaultValue:true,
                hoverWidth:200,
                width:"*",
                itemHoverHTML:function(){
                    return"If enabled, and there is empty space to the left/top of the "+
                        "mockup, the mockup is moved to 0,0 instead.  In combination with "+
                        "dropMarkup, this also means that a mockup with only markup "+
                        "elements to the left/top of it will be moved to 0,0 as part of "+
                        "importing."
                 },
                 titleHoverHTML:function(){
                    return this.itemHoverHTML()
                 }
            },
            {
                name:"fillSpace",
                title:"Fill Space",
                editorType:isc.TCheckboxItem||isc.CheckboxItem,
                labelAsTitle:true,
                defaultValue:true,
                hoverWidth:200,
                width:"*",
                itemHoverHTML:function(){
                    return"If enabled and a mockup-import results in a single "+
                        "layout or single top-level container with a single layout within "+
                        "it, the top-level widget will be set to 100% width and height so "+
                        "that it fills available space.";
                },
                titleHoverHTML:function(){
                    return this.itemHoverHTML()
                }
            }
        ]);
        return isc.DynamicForm.create(isc.addProperties({
            autoDraw:false,
            saveOnEnter:true,
            numCols:6,
            width:"100%",
            wrapItemTitles:false,
            useAllDataSourceFields:false,
            valuesManager:this.vm,
            fields:fields,
            isGroup:true,
            showGroupLabel:false,
            groupBorderCSS:"1px solid transparent"
        }));
    }
,isc.A._createHeadForm=function isc_BMMLImportDialog__createHeadForm(){
        var fields=[];
        if(this.showSkinSelector){
            fields.add({
                name:"skin",
                editorType:isc.TSelectItem||isc.SelectItem,
                width:175,
                title:"Skin",
                defaultValue:this.skin,
                endRow:false,
                valueMap:{
                    Enterprise:"Enterprise",
                    EnterpriseBlue:"Enterprise Blue",
                    Graphite:"Graphite",
                    Tahoe:"Tahoe",
                    Simplicity:"Simplicity",
                    TreeFrog:"TreeFrog",
                    BlackOps:"Black Ops",
                    standard:"Basic"
                },
                changed:function(form,item,value){
                    var uriBuilder=isc.URIBuilder.create(window.location.href);
                    uriBuilder.setQueryParam("skin",value);
                    window.location.replace(uriBuilder.uri);
                }
            });
        }
        return isc.DynamicForm.create(isc.addProperties({
            autoDraw:false,
            saveOnEnter:true,
            wrapItemTitles:false,
            width:"100%",
            useAllDataSourceFields:false,
            valuesManager:this.vm,
            fields:fields,
            isGroup:true,
            showGroupLabel:false,
            groupBorderCSS:"1px solid transparent"
        },this.formsDefaults,this.formsProperties));
    }
);
isc.B._maxIndex=isc.C+7;

isc.BMMLImportDialog.changeDefaults("bodyDefaults",{
    width:"100%"
});
isc.defineClass("FieldMapper","HStack");
isc.A=isc.FieldMapper.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=772;
isc.A.height=380;
isc.A.membersMargin=10;
isc.A.layoutTopMargin=10;
isc.A.description='The "Component Fields" list below shows how your existing fields will be '+
        'connected to new DataSource fields.  Drag fields from the new DataSource to the '+
        'Component Fields grid to create a mapping or add new field. Field names and titles '+
        'can also be edited by Double-clicking on a row.';
isc.B.push(isc.A.initWidget=function isc_FieldMapper_initWidget(){
        this.Super("initWidget",arguments);
        var _this=this;
        var mockDataSource=this.mockDataSource;
        if(isc.isA.DataSource(mockDataSource)){
            this.mockDataSourceFields=mockDataSource.getFields();
        }
        var mockFields=this.mockFields;
        if(mockFields&&mockFields.length>0){
            var fields={};
            for(var i=0;i<mockFields.length;i++){
                fields[mockFields[i].name]=mockFields[i];
            }
            this.mockDataSource={
                fields:fields,
                getFields:function(){
                    return this.fields;
                }
            };
        };
        this.targetDataSourceList=isc.ListGrid.create({
            width:(this.width-20)/2,
            height:"100%",
            alternateRecordStyles:true,
            fields:[
                {name:"name",title:"Name"},
                {name:"title",title:"Title"},
                {name:"type",title:"Type"},
                {name:"inUse",title:"Used?",type:"boolean",
                    showValueIconOnly:true,
                    valueIcons:{
                        "true":"[SKINIMG]actions/approve.png",
                        "false":"[SKINIMG]blank.gif"
                    }
                }
            ],
            canDragRecordsOut:true,
            dragDataAction:"copy",
            autoDraw:false,
            selectionUpdated:function(record,recordList){
                _this._moveLeft.setDisabled(recordList.length==0);
            },
            updateInUseFields:function(value,oldValue){
                if(oldValue){
                    this.setValue(oldValue,false);
                }
                this.setValue(value,true);
                var fields=_this.targetDataSource.getFields();
                var cbMap=[];
                for(var i=0;i<this.data.length;i++){
                    if(!this.data[i].inUse){
                        cbMap.add(this.data[i].name);
                    }
                }
                _this._mockupDataSourceList.getField("mappedTo").valueMap=cbMap;
            },
            setValue:function(name,value){
                for(var i=0;i<this.data.length;i++){
                   if(this.data[i].name==name){
                       this.data[i].inUse=value;
                       this.redraw();
                       return;
                   }
                };
            }
        });
        this._mockupDataSourceList=isc.ListGrid.create({
            width:(this.width-20)/2,
            height:"100%",
            alternateRecordStyles:true,
            fields:[
                {name:"name",title:"Name"},
                {name:"title",title:"Title"},
                {name:"mappedTo",title:"Mapped To",type:"SelectItem",
                    change:function(form,item,value,oldValue){
                        _this.targetDataSourceList.updateInUseFields(value,oldValue)
                    }
                }
            ],
            canReorderRecords:true,
            canAcceptDroppedRecords:true,
            canRemoveRecords:true,
            selectionUpdated:function(record,recordList){
                _this._moveUp.setDisabled(recordList.length==0);
                _this._moveDown.setDisabled(recordList.length==0);
            },
            getCellCSSText:function(record,rowNum,colNum){
                return(record.origName&&record.origName!=record.name&&colNum==this.getFieldNum("name")?this.editPendingCSSText:"");
            },
            removeRecordClick:function(rowNum){
                var record=this.getRecord(rowNum),
                    mappedTo=record&&record.mappedTo;
                this.Super("removeRecordClick",arguments);
                _this.targetDataSourceList.updateInUseFields(null,mappedTo);
            },
            _transferRecord:function(dropRecord,targetRecord){
                for(var i=0;i<this.data.length;i++){
                    if(this.data[i].mappedTo==dropRecord.name){
                        delete this.data[i].mappedTo;
                        break;
                    }
                 };
                if(targetRecord==null){
                    targetRecord=this.data.find("name",dropRecord.name);
                }
                var targetList=_this.targetDataSourceList;
                if(targetRecord==null){
                    var newRec=isc.clone(dropRecord);
                    newRec.mappedTo=newRec.name;
                    this.data.add(newRec);
                    targetList.updateInUseFields(newRec.name);
                    return;
                }
                targetList.updateInUseFields(dropRecord.name,targetRecord.mappedTo);
                targetRecord.mappedTo=dropRecord.name;
            },
            transferRecords:function(dropRecords,targetRecord,index,sourceWidget){
                if(this==sourceWidget){
                    this.Super("transferRecords",arguments);
                    return;
                }
                if(index==null)index=this.getRecordIndex(targetRecord);
                for(var i=0;i<dropRecords.length;i++){
                    this._transferRecord(dropRecords[i],index<0?null:
                                          this.getRecord(index+i));
                }
                this.redraw();
            },
            recordDrop:function(dropRecords,targetRecord,index,sourceWidget){
                if(this==sourceWidget){
                    this.Super("recordDrop",arguments);
                    return;
                }
                var targetRecord=this.getRecord(this.hilitedRecord);
                return this.transferRecords(dropRecords,targetRecord,null,sourceWidget);
            },
            dropMove:function(){
                this.hilitedRecord=this.getEventRecordNum();
                if(this.hilitedRecord==-2){
                    delete this.hilitedRecord;
                    this.clearLastHilite();
                }else{
                    this._hiliteRecord(this.hilitedRecord);
                }
            },
            canEdit:true,
            modalEditing:true,
            autoDraw:false
        });
        this._mapperConfig=isc.DynamicForm.create({
            items:[{
                name:"keepUnmapped",
                 _constructor:"CheckboxItem",
                title:"Keep unmapped fields",
                width:"100%",
                height:1
            }]
        });
        var shiftSelected=function(grid,up){
            var recordList=grid.getSelectedRecords(),
                firstIndex=grid.getRecordIndex(recordList[0]);
            if(firstIndex>=0){
                if(!up){
                    var length=grid.getTotalRows();
                    for(var i=firstIndex;i<length;i++){
                        if(!grid.isSelected(grid.getRecord(i))){
                            firstIndex=i;
                            break;
                        }
                    }
                }
                return grid.recordDrop(recordList,null,firstIndex+(up?-1:1),grid);
            }
        };
        this._moveUp=isc.ImgButton.create({
            size:16,showDown:false,disabled:true,
            src:"[SKINIMG]TransferIcons/up.png",
            click:function(){return shiftSelected(_this._mockupDataSourceList,true);}
        });
        this._moveLeft=isc.ImgButton.create({
            size:16,showDown:false,disabled:true,
            src:"[SKINIMG]TransferIcons/left.png",
            click:function(){
                var sourceWidget=_this.targetDataSourceList,
                    targetWidget=_this._mockupDataSourceList,
                    recordList=sourceWidget.getSelectedRecords(),
                    targetRecord=targetWidget.getSelectedRecord();
                var editRecord=targetWidget.getRecord(targetWidget.getEditRow());
                if(editRecord==targetRecord)targetRecord=null;
                targetWidget.transferRecords(recordList,targetRecord,null,sourceWidget);
            }
        });
        this._moveDown=isc.ImgButton.create({
            size:16,showDown:false,disabled:true,
            src:"[SKINIMG]TransferIcons/down.png",
            click:function(){return shiftSelected(_this._mockupDataSourceList);}
        });
        this.setMembers([
            isc.VStack.create({
                members:[
                    {
                        _constructor:"Label",
                        contents:"Component Fields",
                        height:1,
                        width:this._mockupDataSourceList.width,
                        baseStyle:"headerItem"
                    },
                    this._mockupDataSourceList,
                    this._mapperConfig
                ]
            }),
            this._shuttleButtons=isc.VStack.create({
                width:1,
                height:75,
                layoutAlign:"center",
                members:[
                    this._moveUp,this._moveLeft,this._moveDown
                ]
            }),
            isc.VStack.create({
                members:[
                    {
                        _constructor:"Label",
                        contents:"New DataSource Fields",
                        height:1,
                        width:this.targetDataSourceList.width,
                        baseStyle:"headerItem"
                    },
                    this.targetDataSourceList
                ]
        })]);
        if(this.mockDataSource==null){
            isc.logWarn("MockDataSource should be set");
        }else if(this.targetDataSource==null){
            isc.logWarn("TargetDataSource should be set");
        }else{
            this.setDefaultData();
        }
    }
,isc.A.getMockFieldDefaults=function isc_FieldMapper_getMockFieldDefaults(fieldName){
        var fields=this.mockDataSource.getFields(),
            field=fields[fieldName],
            editNode=field.editNode;
        if(editNode)return editNode.defaults;
        var dsFields=this.mockDataSourceFields;
        if(dsFields){
            var dsField=dsFields[fieldName];
            if(dsField)return dsField;
        }
        return field;
    }
,isc.A.getChanges=function isc_FieldMapper_getChanges(){
        var keepUnmapped=this._mapperConfig.getValue("keepUnmapped"),
            fields=this.getMappedFields(keepUnmapped,false)
        ;
        if(fields==null)return null;
        var changes={};
        for(var i=0;i<fields.length;i++){
            var field=fields[i],
                mappedTo=field.mappedTo
            ;
            if(field.type){
                changes[field.name]=null;
            }else if((mappedTo&&mappedTo!=field.name)||(!mappedTo&&field.name!=field.origName)){
                changes[field.mappedTo||field.name]=field.origName;
            }
        }
        return changes;
    }
,isc.A.getDeletes=function isc_FieldMapper_getDeletes(){
        var keepUnmapped=this._mapperConfig.getValue("keepUnmapped"),
            fields=this.getMappedFields(keepUnmapped,false)
        ;
        if(fields==null)return null;
        var fieldNames=isc.getKeys(this.mockDataSource.getFields()),
            deletes=[]
        ;
        for(var i=0;i<fieldNames.length;i++){
            if(!fields.find("origName",fieldNames[i])){
                deletes[deletes.length]=fieldNames[i];
            }
        }
        return deletes;
    }
,isc.A.applyMap=function isc_FieldMapper_applyMap(component,parent,wnd,confirmed){
        var fieldMapper=this;
        var keepUnmapped=this._mapperConfig.getValue("keepUnmapped"),
            fields=this.getMappedFields(keepUnmapped,!confirmed,function(value){
                if(value)fieldMapper.applyMap(component,parent,wnd,true);});
        if(fields==null)return false;
        var liveFieldMap=this.mockDataSource.getFields();
        this.callback();
        var componentSchema=isc.DS.get(component.getClassName()),
            isForm=isc.isA.DynamicForm(component),
            fieldType=componentSchema.getField("fields").type
        ;
        var editContext=component.editContext;
        for(var i=parent.children.length-1;i>=0;i--){
            if((isForm&&parent.children[i].type!="DataSource")||parent.children[i].type==fieldType){
                editContext.removeNode(parent.children[i],true);
            }
        }
        var targetFields=this.targetDataSourceList.getData();
        var ds=this.targetDataSource;
        for(var i=0;i<fields.length;i++){
            var field=fields[i],
                mappedTo=field.mappedTo,
                editProxy=component.editProxy;
            isc.FieldMapper._assert(mappedTo||field.inUse==null,
                "Target fields copied to the mockup fields list cannot to be unmapped");
            var liveField=field.inUse==null&&liveFieldMap[field.name],
                editNode=liveField&&liveField.editNode;
            if(!mappedTo&&editNode){
                field=liveField;
            }else{
                var defaults=editNode&&editNode.defaults?
                    isc.EditProxy.filterLiveObjectBySchema(fieldType,editNode.defaults):
                    {};
                var fieldConfig=(mappedTo?isc.addProperties({},field,{name:mappedTo}):field);
                if(!isForm)delete fieldConfig.type;
                delete fieldConfig.inUse;
                delete fieldConfig.mappedTo;
                delete fieldConfig.origName;
                var paletteNode=editProxy.makeFieldPaletteNode(editContext,fieldConfig,ds,defaults),
                    editNode=editContext.makeEditNode(paletteNode);
                field=isc.addProperties({},paletteNode.defaults,{editNode:editNode});
            }
            fields[i]=field;
        }
        component.setFields(fields);
        editContext.dontShowFieldMapper=true;
        for(var i=0;i<fields.length;i++){
            var editNode=fields[i].editNode;
            editContext.addNode(editNode,parent);
        }
        delete editContext.dontShowFieldMapper;
        wnd.destroy();
    }
,isc.A.setDefaultData=function isc_FieldMapper_setDefaultData(dropExistingFields){
        var mockupDS=this.mockDataSource,
            mockupGrid=this._mockupDataSourceList;
        var data=[],
            fields=mockupDS.getFields();
        for(var name in fields){
            data.add(isc.addProperties({origName:name},fields[name]));
        };
        this._automaticDefaultMapping(data);
        mockupGrid.setData(data);
        var mappedFields={};
        for(var i=0;i<data.length;i++){
            if(data[i].mappedTo)mappedFields[data[i].mappedTo]=data[i].name;
        }
        var targetDS=this.targetDataSource,
            targetGrid=this.targetDataSourceList;
        var cbMap=[];
        data=[];
        fields=targetDS.getFields();
        for(var name in fields){
            if(fields[name].hidden)continue;
            data.add(isc.addProperties({
                inUse:mappedFields[name]!=null
            },fields[name]));
            if(mappedFields[name]==null){
                cbMap.add(name);
            }
        };
        targetGrid.setData(data);
        mockupGrid.getField("mappedTo").valueMap=cbMap;
        if(dropExistingFields){
            mockupGrid.setData([]);
            mockupGrid.transferRecords(data,null,null,targetDS);
        }
    }
,isc.A.startEditingMapping=function isc_FieldMapper_startEditingMapping(){
        var mockupGrid=this._mockupDataSourceList,
            firstEditRow=mockupGrid.data.findIndex("mappedTo",null);
        mockupGrid.startEditing(Math.max(firstEditRow,0),mockupGrid.getFieldNum("mappedTo"));
    }
,isc.A._automaticDefaultMapping=function isc_FieldMapper__automaticDefaultMapping(data){
        var targetDataSourceTitles=[];
        var targetDS=isc.shallowClone(this.targetDataSource);
        targetDS.autoDeriveTitles=true;
        var targetFields=targetDS.getFields();
        for(var name in targetFields){
            targetDataSourceTitles.add({
                name:name,
                splittedTitle:targetFields[name].title.toLowerCase().split(" ")
            });
        };
        for(var i=0;i<data.length;i++){
            if(data[i].title==null){
                continue;
            }
            var mockSplittedTitle=data[i].title.toLowerCase().split(" ");
            var bestTargetFieldData=null;
            var maxSameWordsCount=0;
            for(var j=0;j<targetDataSourceTitles.length;j++){
                if(targetDataSourceTitles[j].occupied)continue;
                var sameWordsCount=0;
                var targetSplittedTitle=targetDataSourceTitles[j].splittedTitle;
                for(var ti=0;ti<targetSplittedTitle.length;ti++){
                    for(var mi=0;mi<mockSplittedTitle.length;mi++){
                        if(mockSplittedTitle[mi]==targetSplittedTitle[ti]){
                            sameWordsCount++;
                        }
                    }
                }
                if(sameWordsCount>maxSameWordsCount){
                    maxSameWordsCount=sameWordsCount;
                    bestTargetFieldData=targetDataSourceTitles[j];
                }
            };
            if(bestTargetFieldData){
                bestTargetFieldData.occupied=true;
                data[i].mappedTo=bestTargetFieldData.name;
            }
        };
    }
,isc.A._getMappedToNames=function isc_FieldMapper__getMappedToNames(){
        var data=this._mockupDataSourceList.getData(),
            names={};
        for(var i=0;i<data.length;i++){
            var mappedTo=data[i].mappedTo;
            if(mappedTo!=null)names[mappedTo]=data[i];
        }
        return names;
    }
,isc.A.getMappedFields=function isc_FieldMapper_getMappedFields(includeUnmapped,confirm,callback){
        var data=this._mockupDataSourceList.getData(),
            mappedToNames=this._getMappedToNames();
        var mappedFields=[],
            skippedTitles=[];
        for(var i=0;i<data.length;i++){
            var field=data[i],
                title=field.title,
                mappedTo=field.mappedTo;
            if(!mappedTo){
                if(!includeUnmapped||mappedToNames[field.name]){
                    skippedTitles.add("'"+title+"'");
                    continue;
                }
            }
            mappedFields.add(field);
        };
        if(confirm&&skippedTitles.length>0){
            isc.confirm("The following field definitions will be discarded: "+
                skippedTitles.join(", "),callback);
            return null;
        }
        return mappedFields;
    }
);
isc.B._maxIndex=isc.C+10;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('VisualBuilder');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._VisualBuilder_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('VisualBuilder module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'VisualBuilder', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'VisualBuilder'.");}
/*

  SmartClient Ajax RIA system
  Version v12.1p_2021-11-17/Enterprise Deployment (2021-11-17)

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

