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

if(window.isc&&window.isc.module_Core&&!window.isc.module_Tools){isc.module_Tools=1;isc._moduleStart=isc._Tools_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'Tools load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("ComponentEditor","PropertySheet");
isc.A=isc.ComponentEditor;
isc.A._formItemTypeToFormulaFieldMap={
        integer:"formula",
        float:"formula",
        sequence:"formula",
        date:"formula",
        time:"formula",
        text:"textFormula"
    };
isc.A._listGridFieldTypeToFormulaFieldMap={
        integer:"editorFormula",
        float:"editorFormula",
        sequence:"editorFormula",
        date:"editorFormula",
        time:"editorFormula",
        text:"editorTextFormula"
    };
isc.A._dynamicPropertyTypes=[
        "string",
        "String",
        "HTMLString",
        "boolean",
        "Boolean",
        "number",
        "Number",
        "int",
        "integer",
        "Integer",
        "positiveInteger",
        "URL",
        "url"
    ]
;

isc.A=isc.ComponentEditor.getPrototype();
isc.A.immediateSave=false;
isc.A.itemHoverWidth=50;
isc.A.itemHoverAutoFitWidth=true;
isc.A.itemHoverAutoFitMaxWidth=500;
isc.A.titleHoverFocusKey="f2";
isc.A.showSuperClassEvents=true;
isc.A.initialGroups=5;
isc.A.showAttributes=true;
isc.A.showMethods=false;
isc.A.hasMethods=false;
isc.A.basicMode=false;
isc.A.lessTitle="Less...";
isc.A.moreTitle="More...";
isc.A.emptyMethodsMessage="There are no events for this component";
isc.A.emptyBasicMethodsMessage="There are no common events for this component. To view advanced events click the \"More...\" button.";
isc.A.handPlacedFormFieldsHover="Form fields placed in a Hand-Placed Form do not show titles. Use individual Labels to add custom titles.";
isc.A.readOnlyRequiresDSHover="Add a DataSource to enable";
isc.A.readOnlyIfDataBoundHover="Data type for this field is determined by the component's DataSource and cannot be changed for only this component/field. Change the data type in the DataSource Editor instead";
isc.A.readOnlyIfOptionDataSourceHover="A DataSource is being used for values";
isc.A.canSwitchClass=false;
isc.A.componentTypeTitle="Component Type"
;

isc.A=isc.ComponentEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.handlerFieldBase={
        validateOnChange:true,
        validators:[{type:"isFunction"}],
        showPopUpIcon:false,
        actionIconPosition:0,
        popUpOnAnyClick:false,
        itemHoverHTML:function(){
            var value=this._getDisplayValue(this.getValue());
            if(value==null)return value;
            value=String(value);
            if(value=="&nbsp;"||value.match(/^\W+$/))value="";
            return value.asHTML();
        }
    };
isc.A.itemHoverStyle="docHover";
isc.B.push(isc.A.shouldUseField=function isc_ComponentEditor_shouldUseField(field){
        if(!this.Super("shouldUseField",arguments)){
            return false;
        }
        if(field.hidden||field.inapplicable||field.advanced)return false;
        var localBasicMode=this._basicMode==null?this.basicMode:this._basicMode;
        if(localBasicMode&&!field.basic)return false;
        if(field.type&&isc.DS.isLoaded(field.type)&&field.type!="ValueMap"&&
             field.type!="Action"&&field.type!="AdvancedCriteria"&&
             field.type!="UserFormula"&&field.type!="UserSummary"&&
             field.type!="ValuesManager")
        {
            return false;
        }
        var ds=isc.DS.get(this.dataSource);
        if(!ds)return true;
        var className=ds.ID,
            fieldName=field[this.fieldIdProperty];
        if(isc.jsdoc.hasData()){
            var docItem=isc.jsdoc.getDocItem(className,fieldName,true);
            if(field.visibility!=null&&docItem==null)return false;
            if(docItem&&isc.jsdoc.getAttribute(docItem,"deprecated"))return false;
            if(docItem&&isc.jsdoc.isAdvancedAttribute(docItem))return false;
        }
        return true;
    }
,isc.A._setItems=function isc_ComponentEditor__setItems(itemList,delayed){
        var pendingTimer=this._pendingBindToDataSource;
        if(pendingTimer){
            isc.Timer.clear(pendingTimer);
            delete this._pendingBindToDataSource;
        }
        if(!delayed)this._canonicalizeItems(itemList);
        if(isc.jsdoc.hasData())
        {
            this.clearJsDocLoadingPrompt();
            if(delayed){
                this._expandInitialGroupsTimerId=this.delayCall("expandInitialGroups");
            }
            this.invokeSuper(isc.ComponentEditor,"_setItems",itemList);
            if(this._pendingEditComponent){
                this.delayCall("editComponent",this._pendingEditComponent);
                delete this._pendingEditComponent;
            }
        }else{
            this.showJsDocLoadingPrompt();
            this._pendingBindToDataSource=this.delayCall("_setItems",[itemList,true],200);
            this.items=[];
        }
    }
,isc.A.showJsDocLoadingPrompt=function isc_ComponentEditor_showJsDocLoadingPrompt(){
        if(this._loadingLabel)return;
        var imgHTML=this.imgHTML(isc.Canvas.loadingImageSrc,
                                   isc.Canvas.loadingImageSize,
                                   isc.Canvas.loadingImageSize)
        ;
        this._loadingLabel=isc.Label.create({
            align:"center",autoDraw:false,
            width:"100%",height:"100%",
            contents:imgHTML+"&nbsp;Loading SmartClient Reference..."
        });
        this.addChild(this._loadingLabel);
    }
,isc.A.clearJsDocLoadingPrompt=function isc_ComponentEditor_clearJsDocLoadingPrompt(){
        if(this._loadingLabel){
            this.removeChild(this._loadingLabel);
            delete this._loadingLabel;
        }
    }
,isc.A.bindToDataSource=function isc_ComponentEditor_bindToDataSource(fields,componentIsDetail){
        var boundFields=this._boundFields=this.Super("bindToDataSource",arguments);
        var ds=this.dataSource?isc.DS.get(this.dataSource):null;
        if(fields&&fields.length>0)return boundFields;
        if(ds==null||this._boundFields==null)return boundFields;
        for(var i=0;i<boundFields.length;i++){
            var field=boundFields[i],
                defaultValue=field.defaultValue;
            if(defaultValue==null)continue;
            if(defaultValue=="false")defaultValue=false;
            else if(defaultValue=="true")defaultValue=true;
            else if(parseInt(defaultValue).toString()==defaultValue){
                defaultValue=parseInt(defaultValue);
            }
            field.defaultValue=defaultValue;
        }
        if(!isc.jsdoc.hasData())return boundFields;
        var groups={},createGroups=false;
        if(this.showAttributes){
            for(var i=0;i<boundFields.length;i++){
                var field=boundFields[i],
                    name=field[this.fieldIdProperty]
                ;
                var groupName=field.group||isc.jsdoc.getGroupForAttribute(ds.ID,name)||
                                    "other";
                if(groupName==null)groupName="other";
                if(groupName!="other")createGroups=true;
                if(!groups[groupName])groups[groupName]=[];
                groups[groupName].add(field);
            }
        }
        if(this.showMethods){
            if(!this.createMethodGroups(groups,ds)&&!this.showAttributes){
                this.showEmptyMethodsLabel();
                return[];
            }else{
                this.hideEmptyMethodsLabel();
                createGroups=true;
            }
        }
        if(!createGroups){
            if(this.sortFields)boundFields.sortByProperty("name",Array.ASCENDING);
            return boundFields;
        }
        var groupNames=isc.getKeys(groups),
            dsGroupOrder=ds.getGroups(),
            groupOrder=[];
        if(dsGroupOrder!=null){
            for(var i=0;i<dsGroupOrder.length;i++){
                var index=groupNames.indexOf(dsGroupOrder[i]);
                if(index==-1)continue;
                groupNames.removeAt(index);
                groupOrder.add(dsGroupOrder[i]);
            }
            groupOrder.addList(groupNames);
        }else{
            groupOrder=groupNames;
        }
        var index=groupOrder.indexOf("other");
        if(index!=-1){
            groupOrder.removeAt(index);
            groupOrder.add("other");
        }
        fields=[];
        if(this.canSwitchClass){
            var switcherConfig=this.getClassSwitcher();
            if(switcherConfig)fields[0]=switcherConfig;
        }
        if(this.creator.shouldShowDataPathFields&&this.creator.shouldShowDataPathFields()){
            fields[fields.length]=this.getDataPathField(true);
        }
        for(var i=0;i<groupOrder.length;i++){
            var groupName=groupOrder[i],
                group=groups[groupName],
                groupItem=isc.jsdoc.getGroupItem(groupName),
                title=groupItem&&groupItem.title?groupItem.title:
                        isc.DataSource.getAutoTitle(groupName);
            if(this.sortFields)group.sortByProperty("name",Array.ASCENDING);
            fields[fields.length]=
                {
                    name:"group_"+groupName,
                    editorType:"TSectionItem",
                    defaultValue:title,
                    sectionExpanded:false,
                    items:group,
                    hoverFocusKey:"f2",
                    canvasProperties:{
                        hoverAutoFitWidth:this.itemHoverAutoFitWidth,
                        hoverAutoFitMaxWidth:this.itemHoverAutoFitMaxWidth,
                        hoverStyle:this.itemHoverStyle,
                        canHover:true,
                        groupName:groupName,
                        getHoverHTML:function(){
                            if(this.groupName){
                                var html=isc.jsdoc.hoverHTML(this.groupName);
                                return html;
                            }
                            return null;
                        }
                    }
                };
        }
        return fields;
    }
,isc.A.showEmptyMethodsLabel=function isc_ComponentEditor_showEmptyMethodsLabel(){
        if(this._emptyMethodsLabel)return;
        var message=(this.hasMethods?this.emptyBasicMethodsMessage:this.emptyMethodsMessage);
        this._emptyMethodsLabel=isc.Label.create({
            align:"center",autoDraw:false,
            width:"100%",
            padding:20,
            contents:message
        });
        this.addChild(this._emptyMethodsLabel);
    }
,isc.A.hideEmptyMethodsLabel=function isc_ComponentEditor_hideEmptyMethodsLabel(){
        if(this._emptyMethodsLabel){
            this.removeChild(this._emptyMethodsLabel);
            delete this._emptyMethodsLabel;
        }
    }
,isc.A.addField=function isc_ComponentEditor_addField(field,index){
        if(this.fields)this.fields.addAt(field,index);
    }
,isc.A.getDataPathField=function isc_ComponentEditor_getDataPathField(isInput){
        var creator=this.creator,
            grid=creator.operationsPalette,
            initData=grid?grid.data:null,
            data=creator.trimOperationsTreeData(initData,isInput)
        ;
        return{
            name:isInput?"inputDataPath":"dataPath",
            title:isInput?"Input DataPath":"DataPath",
            isInput:isInput,
            type:"DataPathItem",
            operationsPalette:grid,
            operationsTreeData:data
        };
    }
,isc.A.getClassSwitcher=function isc_ComponentEditor_getClassSwitcher(){
        var dataSource=isc.DS.get(this.dataSource),
            classObj=isc.ClassFactory.getClass(dataSource.ID);
        if(!classObj)return null;
        return{
            name:"classSwitcher",
            title:this.componentTypeTitle,
            defaultValue:classObj.getClassName(),
            type:"select",
            valueMap:this.getClassSwitcherValueMap(dataSource,classObj)
        };
    }
,isc.A.getClassSwitcherValueMap=function isc_ComponentEditor_getClassSwitcherValueMap(dataSource,classObj){
        var chain,
            valueMap=[];
        if(classObj)chain=this.getInheritanceChain(classObj,dataSource);
        if(!chain)return null;
        for(var i=0;i<chain.length;i++){
            var schema=isc.DS.getNearestSchema(chain[i].getClassName()),
                subs=schema.substituteClasses;
                if(schema.createStandalone!=false){
                    if(!valueMap.contains(chain[i].getClassName())){
                        valueMap.add(chain[i].getClassName());
                    }
                }
            if(!subs)continue;
            var subsArray=subs.split(",");
             for(var i=0;i<subsArray.length;i++){
                subsArray[i]=subsArray[i].trim();
                if(!valueMap.contains(subsArray[i]))valueMap.add(subsArray[i]);
            }
        }
        valueMap.sort();
        return valueMap;
    }
,isc.A.createMethodGroups=function isc_ComponentEditor_createMethodGroups(groups,dataSource){
        var classObj=isc.ClassFactory.getClass(dataSource.ID);
        this._editableMethodFields=[];
        var localBasicMode=this._basicMode==null?this.basicMode:this._basicMode;
        this.hasMethods=false;
        if(classObj&&classObj._stringMethodRegistry&&
            !isc.isAn.emptyObject(classObj._stringMethodRegistry))
        {
            var chain=this.getInheritanceChain(classObj,dataSource),
                classMethods,
                superclassMethods=[],
                newMethods,
                methodGroups={}
            ;
            for(var i=0;i<chain.length;i++){
                var currentClassObj=chain[i];
                var entries=currentClassObj._stringMethodRegistry._entries;
                classMethods=(entries?entries.duplicate():[]);
                newMethods=classMethods.duplicate();
                newMethods.removeList(superclassMethods);
                superclassMethods=classMethods;
                if(newMethods.length==0)continue;
                this.hasMethods=true;
                if(localBasicMode)break;
                var groupName=
                    (currentClassObj==isc.Canvas?"Basic":currentClassObj.getClassName())
                    +" Methods";
                methodGroups[groupName]=[];
                for(var j=0;j<newMethods.length;j++){
                    var methodName=newMethods[j];
                    var docRef="method:"+currentClassObj.getClassName()+"."+methodName,
                        docItem=isc.jsdoc.getDocItem(docRef);
                    if(!docItem){
                        if(!dataSource.methods||!dataSource.methods.find("name",methodName)){
                            superclassMethods.remove(methodName);
                            continue;
                        }
                    }
                    if(docItem&&isc.jsdoc.getAttribute(docItem,"deprecated"))continue;
                    var field=this.getMethodField(newMethods[j]);
                    methodGroups[groupName].add(field);
                }
                if(methodGroups[groupName].length==0){
                    delete methodGroups[groupName];
                    delete groups[groupName];
                }
            }
            if(!localBasicMode){
                var methodGroupsNames=isc.getKeys(methodGroups).reverse();
                for(var i=0;i<methodGroupsNames.length;i++){
                    groups[methodGroupsNames[i]]=methodGroups[methodGroupsNames[i]];
                }
                return true;
            }
        }
        if(dataSource.methods&&dataSource.methods.length>0){
            var methodFields=groups[dataSource.ID+localBasicMode?
                                                            " Basic":""+" Methods"]=[];
            for(var i=0;i<dataSource.methods.length;i++){
                var method=dataSource.methods[i];
                if((localBasicMode&&!method.basic)||method.action)continue;
                var field=this.getMethodField(method.name);
                if(localBasicMode&&method.whenRuleTip)field.whenRuleTip=method.whenRuleTip;
                methodFields.add(field);
            }
            this.hasMethods=true;
            return true;
        }
        return false;
    }
,isc.A.getInheritanceChain=function isc_ComponentEditor_getInheritanceChain(classObj,dataSource){
        var chain=[],
            showSuper=this._firstNonNull(dataSource.showSuperClassEvents,
                                           this.showSuperClassEvents);
        if(showSuper&&
            (classObj.isA("Canvas")||classObj.isA("FormItem"))){
            for(var currentClassObj=classObj;
                 currentClassObj!=isc.Class;
                 currentClassObj=currentClassObj.getSuperClass())
            {
                chain.add(currentClassObj);
            }
        }
        chain.reverse();
        return chain;
    }
,isc.A.getMethodField=function isc_ComponentEditor_getMethodField(methodName){
        var field=isc.clone(this.handlerFieldBase);
        field[this.fieldIdProperty]=methodName;
        field.type=this.canEditExpressions?"expression":"action";
        this._editableMethodFields.add(field);
        return field;
    }
,isc.A.clearComponent=function isc_ComponentEditor_clearComponent(){
        var comp=this.currentComponent;
        if(comp==null)return;
        delete this.currentComponent;
        delete this.dataSource;
        this.setFields([]);
    }
,isc.A.editComponent=function isc_ComponentEditor_editComponent(component,liveObject){
        delete this._boundFields;
        if(!isc.jsdoc.hasData()){
            this._pendingEditComponent=[component,liveObject];
            return;
        }
        var type=isc.DS.getNearestSchema(component.type),
            liveObject=liveObject||component.liveObject;
        if(liveObject.useCustomSchema)type=liveObject.useCustomSchema;
        this.currentComponent=component;
        if(this.logIsInfoEnabled("editing")){
            this.logInfo("Editing component of type: "+type+
                         ", defaults: "+this.echo(component.defaults)+
                         ", liveObject: "+this.echoLeaf(liveObject),"editing");
        }
        if(component.advancedMode)this._basicMode=false;
        this.setDataSource(type);
        var values={},
            editableFields=this._boundFields
        ;
        if(this._editableMethodFields){
            editableFields=editableFields.concat(this._editableMethodFields);
        }
        var editProperties=(!liveObject||!liveObject.getEditableProperties)
                    ?component.defaults:liveObject.getEditableProperties(editableFields);
        var undef;
        if(liveObject.editingOn&&liveObject._saveDisabled!=undef){
            editProperties.disabled=liveObject._saveDisabled;
        }
        var hideFields=["formula","textFormula","editorFormula","editorTextFormula"];
        if(isc.isA.FormItem(liveObject)||this.inheritsFrom(type,"ListGridField")){
            var isListGridField=this.inheritsFrom(type,"ListGridField"),
                fieldType=liveObject.type||liveObject.defaultType||"text";
            if(fieldType=="text"&&isc.isA.TimeItem(liveObject))fieldType="date";
            var applicableFormulaField=(isListGridField
                        ?isc.ComponentEditor._listGridFieldTypeToFormulaFieldMap[fieldType]
                        :isc.ComponentEditor._formItemTypeToFormulaFieldMap[fieldType])
            ;
            if(applicableFormulaField){
                hideFields.remove(applicableFormulaField);
            }
        }
        var parentDataSource=null;
        for(var i=0;i<editableFields.length;i++){
            var item=editableFields[i];
            if(item.advanced){
                item.showIf=this._falseFunc;
            }
            if(!item.name)continue;
            if(hideFields.contains(item.name)){
                item.showIf=this._falseFunc;
            }
            if(this.iconHoverStyle)item.iconHoverStyle=this.iconHoverStyle;
            if(item.width==null)item.width="*";
            if(this.builder&&item.type=="AdvancedCriteria"){
                item.targetRuleScope=this.builder.getTargetRuleScope();
                item.createRuleCriteria=item.isRuleCriteria;
                if(item.isRuleCriteria){
                    var attr=item.title.replace(" When","").toLowerCase();
                    if(attr=='enable')attr='enabled';
                    item.editorWindowProperties={
                        title:"Define when '"+component.name+"' is "+attr
                    };
                    item.iconPrompt="Edit form rule";
                }
                item.excludeAuthFromRuleScope=!this.builder.showUsersAndRoles;
            }else if(this.builder&&item.useRuleScope){
                item.targetRuleScope=this.builder.getTargetRuleScope();
            }
            if((item.type=="UserFormula"||item.type=="UserSummary")&&this.currentComponent.parentId){
                item.component=window[this.currentComponent.parentId];
            }
            if(isc.ComponentEditor._dynamicPropertyTypes.contains(item.type)){
                item.targetRuleScope=this.builder.getTargetRuleScope();
                item.editorWindowProperties={
                    title:"Define Dynamic Property for field '"+item.name+"'"
                };
                if(item.type.toLowerCase()=="boolean"){
                    item.createRuleCriteria=true;
                }
                if(this.currentComponent.parentId){
                    item.component=window[this.currentComponent.parentId];
                }
            }
            if(item.requiresDSField){
                item.readOnlyWhen={
                    _constructor:"AdvancedCriteria",
                    operator:"and",
                    criteria:[
                        {fieldName:this.getLocalId()+".values."+item.requiresDSField,operator:"isNull"}
                    ]
                };
                item.readOnlyHover=this.readOnlyRequiresDSHover;
            }else if(item.readOnlyIfDataBound=="true"){
                if(liveObject.form){
                    item.readOnlyWhen={
                        _constructor:"AdvancedCriteria",
                        operator:"and",
                        criteria:[
                            {fieldName:this.getLocalId()+".values._parentDataSource",operator:"notNull"}
                        ]
                    };
                    item.readOnlyDisplay="disabled";
                    item.disabledHover=this.readOnlyIfDataBoundHover;
                    parentDataSource=liveObject.form.dataSource;
                }
            }else if(item.readOnlyIfOptionDataSource=="true"){
                if(liveObject.form){
                    item.readOnlyWhen={
                        _constructor:"AdvancedCriteria",
                        operator:"and",
                        criteria:[
                            {fieldName:this.getLocalId()+".values.optionDataSource",operator:"notNull"}
                        ]
                    };
                    item.readOnlyHover=this.readOnlyIfOptionDataSourceHover;
                }
            }else if(item.readOnlyInLayout=="true"){
                if(isc.isA.Layout(liveObject.parentElement)){
                    item.canEdit=false;
                }
            }
            if(item.type=="color"){
                item.defaultPickerMode="complex";
            }
            if(item.name=="title"&&isc.isA.FormItem(liveObject)&&liveObject.form&&
                liveObject.form.itemLayout=="absolute")
            {
                item.disabled=true;
                item.prompt=this.handPlacedFormFieldsHover;
            }
            var propertyName=item.name,
                value=editProperties[propertyName];
            var undef;
            if(value===undef)continue;
            if(isc.isA.Function(value)){
                if(!liveObject.getClass)continue;
                var baseImpl=liveObject.getClass().getInstanceProperty(propertyName);
                if(baseImpl==value)continue;
            }
            values[propertyName]=value;
        }
        this._expandInitialGroupsTimerId=this.delayCall("expandInitialGroups");
        if(liveObject.dataSource&&isc.DS.get(liveObject.dataSource)!=null){
            values.dataSource=(isc.isA.DataSource(liveObject.dataSource)
                ?liveObject.dataSource.ID:liveObject.dataSource);
        }
        if(liveObject.optionDataSource&&isc.DS.get(liveObject.optionDataSource)!=null){
            values.optionDataSource=(isc.isA.DataSource(liveObject.optionDataSource)
                ?liveObject.optionDataSource.ID:liveObject.optionDataSource);
        }
        if(this.logIsDebugEnabled("editing")){
            this.logDebug("Live values: "+this.echo(values),"editing");
        }
        this.setValues(values);
        for(var propertyName in values){
            if(isc.isA.Function(values[propertyName])||
                isc.isA.StringMethod(values[propertyName])||
                isc.isA.ValuesManager(values[propertyName]))
            {
                this.setValue(propertyName,values[propertyName]);
            }
        }
        if(parentDataSource){
            if(isc.isA.DataSource(parentDataSource))parentDataSource=parentDataSource.ID;
            this.setValue("_parentDataSource",parentDataSource);
        }
        if(component.defaults.dataPath&&this.getItem("dataPath")){
            this.getItem("dataPath").setDataPathProperties(component);
        }
        if(component.defaults.inputDataPath&&this.getItem("inputDataPath")){
            this.getItem("inputDataPath").setDataPathProperties(component);
        }
    }
,isc.A.getViewState=function isc_ComponentEditor_getViewState(){
        var state={
            groups:{},
            position:[this.getScrollLeft(),this.getScrollTop()],
            basicMode:this._basicMode
        };
        var fields=this.items,
            groups=state.groups
        ;
        for(var i=0;i<fields.length;i++){
            var field=fields[i];
            if(field.editorType=="TSectionItem"){
                groups[field.name]=field.isExpanded();
            }
        }
        return state;
    }
,isc.A.setViewState=function isc_ComponentEditor_setViewState(state){
        if(!state)return;
        var groups=state.groups;
        for(var key in groups){
            var field=this.getField(key);
            if(field){
                if(groups[key]&&!field.isExpanded()){
                    field.expandSection();
                }else if(field.isExpanded()){
                    field.collapseSection();
                }
            }
        }
        if(this._expandInitialGroupsTimerId){
            isc.Timer.clear(this._expandInitialGroupsTimerId);
            delete this._expandInitialGroupsTimerId;
        }
        var position=state.position;
        if(position&&(position[0]!=this.getScrollLeft()||position[1]!=this.getScrollTop())){
            var _editor=this;
            isc.Timer.setTimeout(function(){
                _editor.scrollTo(position[0],position[1]);
            })
        }
    }
,isc.A._falseFunc=function isc_ComponentEditor__falseFunc(){

        return false;
    }
,isc.A.expandInitialGroups=function isc_ComponentEditor_expandInitialGroups(){
        var groupCount=0;
        for(var i=0;i<this.items.length;i++){
            var item=this.items[i];
            if(item.sectionExpanded!=null&&groupCount++<this.initialGroups){
                item.expandSection();
            }
        }
    }
,isc.A.wrapEditorColumns=function isc_ComponentEditor_wrapEditorColumns(){
        if(!this.items)return;
        var visibleCount=0;
        for(var i=0;i<this.items.length;i++){
            var item=this.items[i];
            if(item.visible&&!item.advanced)visibleCount++;
        }
        if(visibleCount>10)this.numCols=4;
        if(visibleCount>20)this.numCols=6;
    }
,isc.A.titleHoverHTML=function isc_ComponentEditor_titleHoverHTML(item){
        if(isc.jsdoc.hasData()){
            var html=isc.jsdoc.hoverHTML(isc.DataSource.get(this.dataSource).ID,item.name,
                 null,
                 ["getter","setter","examples"]
            );
            if(!html){
                if(this.showMethods){
                    var method=isc.jsdoc.docItemForDSMethod(this.dataSource,item.name);
                    if(method)html=isc.MethodFormatter.hoverHTML(method);
                }else{
                    var field=isc.jsdoc.docItemForDSField(this.dataSource,item.name);
                    if(field)html=isc.AttrFormatter.hoverHTML(field);
                }
            }
            if(html){
                html+=isc.Canvas.spacerHTML(1,30);
                return html;
            }
        }
        return"<nobr><code><b>"+item.name+"</b></code> (no doc available)</nobr>";
    }
,isc.A.getEditorType=function isc_ComponentEditor_getEditorType(item){
        if(item&&item.type=="ValueMap")return"ValueMapItem";
        if(item&&item.type=="AdvancedCriteria")return"CriteriaItem";
        if(item&&item.type=="UserFormula"){
            var componentType=isc.DS.getNearestSchema(this.currentComponent.type);
            if(!this.inheritsFrom(componentType,"TextItem")&&
                !this.inheritsFrom(componentType,"IntegerItem")&&
                !this.inheritsFrom(componentType,"FloatItem"))
            {
                return"ExpressionEditorItem";
            }
            return(isc.isA.DateItem(this.currentComponent.liveObject)?"ExpressionEditorItem":"FormulaEditorItem");
        }
        if(item&&item.type=="UserSummary")return"SummaryEditorItem";
        if(this.allowDynamicProperties&&
                item.type&&isc.ComponentEditor._dynamicPropertyTypes.contains(item.type)&&
                item.allowDynamicProperties!=false&&item.allowDynamicProperties!="false")
        {
            var componentType=isc.DS.getNearestSchema(this.currentComponent.type);
            if(!this.inheritsFrom(componentType,"FormItem")&&
                !this.inheritsFrom(componentType,"ListGridField"))
            {
                var ds=isc.DS.get(this.dataSource);
                if(ds&&isc.jsdoc.hasData()){
                    var className=ds.ID,
                        fieldName=item[this.fieldIdProperty]
                    ;
                    var docItem=isc.jsdoc.getDocItem(className,fieldName,true);
                    if(docItem&&docItem.flags&&docItem.flags.contains("W")){
                        var valueType=docItem.valueType;
                        if(isc.ComponentEditor._dynamicPropertyTypes.contains(valueType)){
                            return valueType.toLowerCase()=="boolean"?
                                "CheckboxDynamicPropertyItem":"DynamicPropertyEditorItem";
                        }
                    }
                }
            }
        }
        var baseType=this.Super("getEditorType",arguments);
        if(isc.FormItemFactory.getItemClass(baseType)==null){
            this.logWarn("Cannot find item class for "+baseType+" of field "+item.name+" in component type "+this.currentComponent.type);
        }
        baseType=isc.FormItemFactory.getItemClass(baseType).getClassName();
        var toolType="T"+baseType;
        if(isc[toolType]!=null&&isc.isA.FormItem(isc[toolType]))return toolType;
        return baseType;
    }
,isc.A.inheritsFrom=function isc_ComponentEditor_inheritsFrom(type,otherType){
        if(otherType==null){
            this.logWarn("inheritsFrom passed null type");
            return false;
        }
        if(isc.isA.String(type))type=isc.DS.get(type);
        if(type==null)return false;
        if(type.name==otherType)return true;
        while(type.inheritsFrom){
            var parentType=isc.DS.get(type.inheritsFrom);
            if(parentType==null)return null;
            if(parentType.name==otherType)return true;
            type=parentType;
        }
        return false;
    }
);
isc.B._maxIndex=isc.C+24;

isc.defineClass("Wizard","VLayout");
isc.A=isc.Wizard.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.stepInstructionsDefaults={
        _constructor:"Label",
        contents:"Instructions",
        padding:10,
        height:20
    };
isc.A.stepPaneDefaults={
        _constructor:"VLayout",
        padding:10
    };
isc.A.showStepIndicator=false;
isc.A.stepIndicatorDefaults={
        _constructor:"HLayout",
        height:22,
        layoutMargin:0,
        layoutLeftMargin:10,
        membersMargin:2
    };
isc.A.stepIndicatorItems=[];
isc.A.stepButtonDefaults={
        _constructor:"Img",
        layoutAlign:"center",
        showRollOver:false,
        height:18,
        width:18
    };
isc.A.stepSeparatorDefaults={
        _constructor:"Img",
        layoutAlign:"center",
        height:16,
        width:16,
        src:"[SKIN]/TreeGrid/opener_closed.gif"
    };
isc.A.navButtonsDefaults={
        _constructor:"ToolStrip",
        height:22,
        layoutMargin:5,
        membersMargin:10
    };
isc.A.navButtonsItems=["previousButton","nextButton","finishButton","cancelButton"];
isc.A.previousButtonDefaults={
        _constructor:"Button",
        layoutAlign:"center",
        title:"Previous",
        click:"this.creator.previousStep()",
        visibility:"hidden"
    };
isc.A.nextButtonDefaults={
        _constructor:"Button",
        layoutAlign:"center",
        title:"Next",
        click:"this.creator.nextStep()"
    };
isc.A.finishButtonDefaults={
        _constructor:"Button",
        layoutAlign:"center",
        title:"Finish",
        click:"this.creator.finished()",
        visibility:"hidden"
    };
isc.A.cancelButtonDefaults={
        _constructor:"Button",
        layoutAlign:"center",
        title:"Cancel",
        click:"this.creator.cancel()"
    };
isc.A.autoChildParentMap={
        nextButton:"navButtons",
        previousButton:"navButtons",
        finishButton:"navButtons"
    };
isc.A._$stepButton="_stepButton_";
isc.B.push(isc.A.initWidget=function isc_Wizard_initWidget(){
        this.Super(this._$initWidget,arguments);
        this.createSteps();
        this.addAutoChild("stepInstructions");
        this.addAutoChild("stepPane");
        this.addAutoChild("navButtons");
        this.addAutoChildren(this.navButtonsItems,this.navButtons);
        if(this.showStepIndicator){
            this.addAutoChild("stepIndicator");
            for(var i=0;i<this.steps.length;i++){
                var stepName=this.steps[i].stepName,
                    stepButtonProperties={src:stepName}
                ;
                var stepButton=this.createAutoChild("stepButton",stepButtonProperties);
                this.stepIndicator.addMember(stepButton);
                this.steps[i]._stepButton=stepButton;
                if(i+1<this.steps.length){
                    this.stepIndicator.addMember(this.createAutoChild("stepSeparator"));
                }
            }
            this.navButtons.addMember(this.stepIndicator,0);
        }
        this.goToStep(0,true);
    }
,isc.A.draw=function isc_Wizard_draw(showing){
        var returnValue=this.Super("draw",arguments);
        this.updateButtons();
        return returnValue;
    }
,isc.A.createSteps=function isc_Wizard_createSteps(steps){
        if(!steps)steps=this.steps;
        if(!steps)return;
        if(!isc.isAn.Array(steps))steps=[steps];
        for(var i=0;i<steps.length;i++){
            steps[i]=isc.WizardStep.create(steps[i],{wizard:this});
        }
    }
,isc.A.getStep=function isc_Wizard_getStep(stepId){return isc.Class.getArrayItem(stepId,this.steps)}
,isc.A.getCurrentStep=function isc_Wizard_getCurrentStep(){return this.getStep(this.currentStepNum);}
,isc.A.getCurrentStepIndex=function isc_Wizard_getCurrentStepIndex(){return this.currentStepNum;}
,isc.A.getStepIndex=function isc_Wizard_getStepIndex(stepId){return isc.Class.getArrayItemIndex(stepId,this.steps)}
,isc.A.getStepPane=function isc_Wizard_getStepPane(stepId){
        return this.getStep(stepId).pane;
    }
,isc.A.goToStep=function isc_Wizard_goToStep(stepId,firstStep){
        if(!firstStep){
            if(!this.getCurrentStep().exitStep(stepId))return;
            this.getStepPane(this.currentStepNum).hide();
        }
        var step=this.getStep(stepId);
        step.enterStep(this.currentStepNum);
        this.currentStepNum=this.getStepIndex(step);
        var pane=this.getStepPane(stepId);
        if(step.instructions)this.stepInstructions.setContents(step.instructions);
        else this.stepInstructions.hide();
        this.stepPane.addMember(pane,0);
        pane.show();
        this.updateButtons();
    }
,isc.A.go=function isc_Wizard_go(direction){
        var index=this.getStepIndex(this.currentStepNum);
        index+=direction;
        this.goToStep(this.getStep(index));
    }
,isc.A.nextStep=function isc_Wizard_nextStep(){
        var currentStep=this.getStep(this.currentStepNum);
        if(currentStep.hasNextStep())this.goToStep(currentStep.getNextStep());
        else this.go(1);
    }
,isc.A.previousStep=function isc_Wizard_previousStep(){
        var currentStep=this.getStep(this.currentStepNum);
        if(currentStep.hasPreviousStep())this.goToStep(currentStep.getPreviousStep());
        else this.go(-1);
    }
,isc.A.finished=function isc_Wizard_finished(){
        this.resetWizard();
    }
,isc.A.cancel=function isc_Wizard_cancel(){
        this.resetWizard();
    }
,isc.A.updateButtons=function isc_Wizard_updateButtons(){
        var stepNum=this.getStepIndex(this.currentStepNum),
            step=this.getCurrentStep()
        ;
        if(this.stepIndicator){
            for(var i=0;i<this.steps.length;i++){
                var stepButton=this.steps[i]._stepButton;
                if(stepNum>i){
                    stepButton.setState("");
                }else if(stepNum==i){
                    stepButton.setState("Down");
                }else{
                    stepButton.setState("Disabled");
                }
            }
        }
        if(stepNum==0||this.forwardOnly||!step.hasPreviousStep())this.previousButton.hide();
        else this.previousButton.show();
        if(!step.hasNextStep()||stepNum==this.steps.length-1){
            this.nextButton.hide();
            this.finishButton.show();
        }else{
            this.nextButton.show();
            this.finishButton.hide();
        }
    }
,isc.A.resetWizard=function isc_Wizard_resetWizard(){
        this.goToStep(0);
    }
);
isc.B._maxIndex=isc.C+16;

isc.defineClass("WizardStep").addMethods({
    enterStep:function(previousStepId){},
    exitStep:function(nextStepId){return true;},
    hasNextStep:function(){
        for(var i=this.wizard.getStepIndex(this.ID)+1;i<this.wizard.steps.length;i++)
            if(!this.wizard.getStep(i).hidden)return true;
        return false;
    },
    getNextStep:function(){
        for(var i=this.wizard.getStepIndex(this.ID)+1;i<this.wizard.steps.length;i++)
            if(!this.wizard.getStep(i).hidden)return i;
        return-1;
    },
    hasPreviousStep:function(){
        for(var i=this.wizard.getStepIndex(this.ID)-1;i>=0;i--)
            if(!this.wizard.getStep(i).hidden)return true;
        return false;
    },
    getPreviousStep:function(){
        for(var i=this.wizard.getStepIndex(this.ID)-1;i>=0;i--)
            if(!this.wizard.getStep(i).hidden)return i;
        return-1;
    },
    show:function(){
        this.hidden=false;
        this.wizard.updateButtons();
    },
    hide:function(){
        this.hidden=true;
        this.wizard.updateButtons();
        if(this.wizard.getCurrentStep()==this){
            var newStep=this.getPreviousStep();
            if(newStep==-1)newStep=this.getNextStep();
            this.wizard.goToStep(newStep);
        }
    }
});
isc.DataSource.create({
    ID:"isc_XMethodsServices",
    dataURL:"shortServiceListing.xml",
    recordName:"service",
    recordXPath:"/default:inspection/default:service",
    fields:[
        {name:"abstract",title:"Description"},
        {name:"xMethodsPage",title:"Site",type:"link",width:50,
          valueXPath:".//wsilxmethods:serviceDetailPage/@location"
        },
        {name:"wsdlURL",title:"WSDL",type:"link",width:50,
          valueXPath:
             "default:description[@referencedNamespace='http://schemas.xmlsoap.org/wsdl/']/@location"
        }
    ]
});
isc.defineClass("DSWizardBase","VLayout");
isc.A=isc.DSWizardBase.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.autoChildParentMap={
    nextButton:"navToolbar",
    previousButton:"navToolbar",
    finishButton:"navToolbar"
};
isc.B.push(isc.A.initWidget=function isc_DSWizardBase_initWidget(){
    this.Super(this._$initWidget,arguments);
    if(this.dsDataSource)this.dsDataSource=isc.DataSource.get(this.dsDataSource);
    this.addAutoChild("stepInstructions",{
        contents:"Instructions",
        padding:4,
        height:20,
        wrap:false,
        overflow:"visible"
    },isc.Label);
    this.addAutoChild("navToolbar",{
        height:22,
        layoutMargin:10,
        membersMargin:10
    },isc.HLayout);
    this.addAutoChild("previousButton",{
        title:"< Previous",
        click:"this.creator.previousPage()",
        visibility:"hidden"
    },isc.Button);
    this.navToolbar.addMember(isc.LayoutSpacer.create());
    this.addAutoChild("nextButton",{
        title:"Next >",
        click:"this.creator.nextPage()",
        disabled:true,
        setDisabled:function(disabled){
            var returnval=this.Super('setDisabled',arguments);
            this.creator._nextButtonDisabled(disabled);
        }
    },isc.Button);
    this.addAutoChild("finishButton",{
        title:"Finish",
        click:"this.creator.finish()",
        visibility:"hidden"
    },isc.Button);
    this.goToPage(0,true);
}
,isc.A.getPage=function isc_DSWizardBase_getPage(pageId){return isc.Class.getArrayItem(pageId,this.pages)}
,isc.A.getCurrentPage=function isc_DSWizardBase_getCurrentPage(){return this.getPage(this.currentPageNum);}
,isc.A.getPageIndex=function isc_DSWizardBase_getPageIndex(pageId){return isc.Class.getArrayItemIndex(pageId,this.pages)}
,isc.A.getPageView=function isc_DSWizardBase_getPageView(pageName,enteringPage){
    var page=this.getPage(pageName),
        pageId=page.ID;
    if(!pageId)return page.view;
    if(enteringPage){
        var enterFunction="enter"+pageId;
        if(this[enterFunction])this[enterFunction](page,pageId);
        else this.enterPage(page,pageId);
    }
    return page.view;
}
,isc.A.enterPage=function isc_DSWizardBase_enterPage(page,pageId){}
,isc.A.goToPage=function isc_DSWizardBase_goToPage(pageId,firstPage){
    if(firstPage){
        for(var i=0;i<this.pages.length;i++){
            if(this.pages[i].view)this.pages[i].view.hide();
        }
    }else{
        this.getPageView(this.currentPageNum).hide();
    }
    var page=this.getPage(pageId);
    this.currentPageNum=this.getPageIndex(page);
    var view=this.getPageView(pageId,true);
    if(page.instructions)this.stepInstructions.setContents(page.instructions);
    else this.stepInstructions.hide();
    this.addMember(view,1);
    view.show();
    this.updateButtons();
}
,isc.A.go=function isc_DSWizardBase_go(direction){
    var index=this.getPageIndex(this.currentPageNum);
    index+=direction;
    this.goToPage(this.getPage(index));
}
,isc.A.nextPage=function isc_DSWizardBase_nextPage(){
    var currentPage=this.getPage(this.currentPageNum);
    if(currentPage.nextPage)this.goToPage(currentPage.nextPage);
    else this.go(1);
}
,isc.A.previousPage=function isc_DSWizardBase_previousPage(){
    var currentPage=this.getPage(this.currentPageNum);
    if(currentPage.previousPage)this.goToPage(currentPage.previousPage);
    else this.go(-1);
}
,isc.A.finish=function isc_DSWizardBase_finish(){
    this.hide();
    this.resetWizard();
}
,isc.A.updateButtons=function isc_DSWizardBase_updateButtons(){
    var pageNum=this.getPageIndex(this.currentPageNum);
    if(pageNum==0)this.previousButton.hide();
    else this.previousButton.show();
    if(this.getPage(pageNum).endPage||pageNum==this.pages.length-1){
        this.nextButton.hide();
        this.finishButton.show();
    }else{
        this.nextButton.setDisabled(this.nextButtonIsDisabled(pageNum));
        this.nextButton.show();
        this.finishButton.hide();
    }
}
,isc.A._nextButtonDisabled=function isc_DSWizardBase__nextButtonDisabled(disabled){
    if(!this._nextEnabledMap)this._nextEnabledMap=[];
    this._nextEnabledMap[this.currentPageNum]=!disabled;
}
,isc.A.nextButtonIsDisabled=function isc_DSWizardBase_nextButtonIsDisabled(pageNum){
    return this._nextEnabledMap?!this._nextEnabledMap[pageNum]:true;
}
,isc.A.resetWizard=function isc_DSWizardBase_resetWizard(){
    delete this._nextEnabledMap;
    this.goToPage(0,true);
}
,isc.A.startAt=function isc_DSWizardBase_startAt(wizardRecord){
    this._startAtRecord=wizardRecord;
    this.resetWizard();
    if(wizardRecord)this.nextPage();
    if(!wizardRecord||!wizardRecord.wizardConstructor)this.show();
}
);
isc.B._maxIndex=isc.C+16;

isc.defineClass("DSWizard","DSWizardBase");
isc.A=isc.DSWizard;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.loadWizardNodes=function isc_c_DSWizard_loadWizardNodes(builder,callback){
        if(!builder)return;
        var wizardsDS=isc.DataSource.create({
            recordXPath:"/PaletteNodes/PaletteNode",
            fields:{
                name:{name:"name",type:"text",length:8,required:true},
                title:{name:"title",type:"text",title:"Title",length:128,required:true},
                className:{name:"className",type:"text",title:"Class Name",length:128,required:true},
                icon:{name:"icon",type:"image",title:"Icon Filename",length:128},
                iconWidth:{name:"iconWidth",type:"number",title:"Icon Width"},
                iconHeight:{name:"iconHeight",type:"number",title:"Icon Height"},
                iconSize:{name:"iconSize",type:"number",title:"Icon Size"},
                showDropIcon:{name:"showDropIcon",type:"boolean",title:"Show Drop Icon"},
                defaults:{name:"defaults",type:"Canvas",propertiesOnly:true},
                children:{name:"children",type:"paletteNode",multiple:true}
            }
        });
        wizardsDS.dataURL=builder.workspacePath+
            "/"+builder.basePathRelWorkspace+"/"+
            builder.dsWizardsFile;
        wizardsDS.fetchData({},function(dsResponse,data){
            callback(data);
            wizardsDS.destroy();
        });
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.DSWizard.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.pages=[
    {ID:"StartPage",
      instructions:"Select the source of data to bind to:"
    },
    {ID:"PickOperationPage",
      instructions:"Select a public Web Service, or enter a WSDL file URL.  Then select"+
                   " the operation to invoke"
    },
    {ID:"CallServicePage",
      instructions:"Use the provided form to invoke the web service and obtain a sample"+
                   " result, then select an approriate element set for list binding"
    },
    {ID:"BindingPage",
      instructions:"Below is a default binding to a ListGrid.  Use the field editor to "+
                   "customize the binding",
      endPage:true
    },
    {
      ID:"SFPickEntityPage",
      instructions:"Choose an object type you would like to use in SmartClient applications"
    },
    {
      ID:"SFDonePage",
      instructions:"Below is an example of a grid bound to the chosen SForce Object",
      endPage:true
    },
    {
      ID:"KapowPickRobotPage",
      instructions:"Choose the Kapow Robot(s) you would like to use in SmartClient applications"
    }
];
isc.A.servicePickerDefaults={
    recordClick:function(viewer,record,recordNum){
        var wsdlURL=this.getRawCellValue(record,recordNum,this.getFieldNum("wsdlURL"));
        this.logWarn("wsdlURL is: "+wsdlURL);
        this.creator.fetchWSDL(wsdlURL);
    }
};
isc.A.operationPickerDefaults={
    recordClick:function(viewer,record,recordNum){
        var operationName=this.getRawCellValue(record,recordNum,this.getFieldNum("name"));
        this.creator.wsdlDoc=this.data.document;
        this.creator.operationName=operationName;
        this.creator.nextButton.enable();
    },
    alternateRecordStyles:true
};
isc.B.push(isc.A.enterStartPage=function isc_DSWizard_enterStartPage(page){
    if(!this.dsTypePicker){
        this.createDSTypePicker();
        page.view=this.dsTypePicker;
    }
    this.nextButton.setDisabled(this.dsTypePicker.getValue("dsType")==null);
}
,isc.A.createDSTypePicker=function isc_DSWizard_createDSTypePicker(){
    this.dsTypePicker=this.createAutoChild("dsTypePicker",{
        layoutAlign:"center",
        width:350,
        showHeader:false,
        selectionType:"single",
        leaveScrollbarGap:false,
        width:300,
        showAllRecords:true,
        bodyOverflow:"visible",
        overflow:"visible",
        selectionChanged:function(){
            this.creator.nextButton.setDisabled(!this.anySelected());
        },
        getValue:function(){
            var record=this.getSelectedRecord();
            if(!record)return null;
            return record.name;
        },
        clearValues:function(){
            this.deselectAllRecords();
        },
        defaultEditContext:isc.EditPane.create({visibility:"hidden"}),
        recordDoubleClick:function(){
            this.creator.nextPage();
        }
    },isc.TreePalette);
    var _this=this;
    isc.DSWizard.loadWizardNodes(this.callingBuilder,function(data){
        _this.fetchWizardsReply(data);
        _this.openWizardTree();
    });
}
,isc.A.fetchWizardsReply=function isc_DSWizard_fetchWizardsReply(data){
    this.dsTypePicker.data.addList(data,this.dsTypePicker.data.getRoot());
}
,isc.A.openWizardTree=function isc_DSWizard_openWizardTree(data){
    var tree=this.dsTypePicker.data;
    tree.openAll();
}
,isc.A.nextPage=function isc_DSWizard_nextPage(){
    var dsType=this.dsTypePicker.getValue(),
        record=this.dsTypePicker.getSelectedRecord();
        _this=this;
    this.dsTypeRecord=record;
    if(this._startAtRecord){
        this.dsTypeRecord=record=this._startAtRecord;
        delete this._startAtRecord
        if(this.logIsDebugEnabled("dsWizard")){
            this.logDebug("Start DS Wizard at: "+this.echo(record),"dsWizard");
        }
    }
    if(this.currentPageNum==0){
        if(record.wizardConstructor){
            if(!record.wizardDefaults){
                record.wizardDefaults={};
            }
            record.wizardDefaults.width="85%";
            record.wizardDefaults.height="85%";
            record.wizardDefaults.autoCenter=true;
            record.wizardDefaults.showDataView=true;
            record.wizardDefaults.builder=this.callingBuilder;
            var context;
            if(isc.isAn.EditContext(this.dsTypePicker.defaultEditContext)){
                context=this.dsTypePicker.defaultEditContext;
            }else if(this.dsTypePicker.defaultEditContext.getEditContext&&
                        isc.isAn.EditContext(this.dsTypePicker.defaultEditContext.getEditContext()))
            {
                context=this.dsTypePicker.defaultEditContext.getEditContext();
            }else{
                this.logWarn("ERROR: dsTypePicker's defaultEditContext neither 'is an' "+
                                "nor 'has an' EditContext.  Expect a null pointer exception!");
            }
            if(this.logIsDebugEnabled("dsWizard")){
                this.logDebug("Request DS Wizard Object: "+this.echoFull(record),"dsWizard");
            }
            context.requestLiveObject(record,function(results){
                var wizardDefaults=(results?results.wizardDefaults:null),
                    isNew=(wizardDefaults?wizardDefaults.existingDS==null:true)
                ;
                _this.showDSEditor(results,isNew,instructions);
            },this.dsTypePicker);
            if(this.callingBuilder)this.callingBuilder.wizardWindow.hide();
            return;
        }
        if(record&&record.className=="JavaBean"){
            var _this=this,
                defaults=record?record.wizardDefaults:{};
            if(!defaults||!defaults.serverConstructor){
                isc.say("NOTE: This wizard <b>does not generate a fully functioning "+
                    "DataSource</b>; it creates a DataSource descriptor (.ds.xml file) which "+
                    "is ready to be loaded and bound to UI components, but does not provide "+
                    "CRUD functionality (search and editing of objects)."+
                    "<P>"+
                    "If you are using SQL or Hibernate, use the SQL or Hibernate wizards "+
                    "instead to generate a fully functional DataSource.  Otherwise, read the "+
                    "<a target='_blank' "+
                    "href='http://localhost:8080/isomorphic/system/reference/SmartClient_Reference.html#group..clientServerIntegration'>"+
                    "Client-Server Integration</a> topic in the <i>SmartClient Reference</i> "+
                    "to learn how to create a custom DataSource connector.",
                    function(){
                        _this.startJavaBeanWizard(_this,record);
                    }
                );
                return;
            }
            this.startJavaBeanWizard(this,record);
            return;
        }
        if(dsType=="sforce"){
            var wizard=this,
                service=isc.WebService.get("urn:partner.soap.sforce.com");
            service.ensureLoggedIn(
                function(){wizard.goToPage("SFPickEntityPage");},
                true
            );
            return;
        }else if(dsType=="kapow"){
            var wizard=this;
            if(!this.robotServerPicker)this.robotServerPicker=isc.RobotServerPicker.create({
                robotServerSelected:function(){wizard.goToPage("KapowPickRobotPage");}
            });
            this.robotServerPicker.show();
            return;
        }else if(dsType=="webService"){
            var wizard=this;
            var nextButton=isc.IButton.create({
                autoShow:false,
                title:"Next",
                autoFit:true,
                click:function(){wizard.servicePicker.hide();wizard.pickOperation()}
            });
            if(!this.servicePicker)this.servicePicker=isc.Dialog.create({
                title:"Enter WSDL Webservice URL",
                isModal:true,
                autoShow:false,
                autoSize:true,
                autoCenter:true,
                bodyDefaults:{padding:10},
                items:[
                    isc.DynamicForm.create({
                        autoShow:false,
                        values:{serviceURL:"http://"},
                        itemKeyPress:function(item,keyName){
                            if(keyName=='Enter'){
                                nextButton.click();
                            }
                        },
                        items:[
                            {name:"serviceURL",title:"WSDL URL",type:"text",width:400}
                        ]
                    }),
                    isc.LayoutSpacer.create({height:10}),
                    isc.HLayout.create({
                        height:1,
                        membersMargin:5,
                        members:[
                            nextButton,
                            isc.IButton.create({
                                autoShow:false,
                                title:"Cancel",
                                autoFit:true,
                                click:function(){wizard.servicePicker.hide();}
                            })
                        ]
                    })
                ]
            });
            this.servicePicker.show();
            return;
        }else if(dsType&&dsType!="webService"){
            var props,
                instructions;
            if(dsType.contains("Hibernate")){
                instructions="Each field you enter below corresponds to a database column "+
"of the same name.  The table name will be the same as the DataSource ID by default, or you "+
"may enter a Table Name below.  Hibernate database settings are in "+
"[webroot]/WEB-INF/classes/hibernate.cfg.xml"
                props={
                    dataFormat:"iscServer",
                    serverType:"hibernate"
                };
            }else if(dsType.contains("SQL")){
                instructions="Each field you enter below corresponds to a database column "+
"of the same name.  The table name will be the same as the DataSource ID by default, or you "+
"may enter a Table Name below.  By default, the default DataBase shown in the Admin Console "+
"will be used, or you may enter \"Database Name\" below.";
                props={
                    dataFormat:"iscServer",
                    serverType:"sql"
                };
            }else if(dsType=="simpleXML"){
                instructions="For \"dataURL\", enter a URL which will return XML data.<P>"+
"For \"recordXPath\", enter an XPath that will select the XML tags you wish to use as rows. "+
"For example, if the tag you want is named \"Person\", a recordXPath of \"//Person\" will "+
"work for most simple XML formats.<P>"+
"Enter fields named after the subelements and attributes of the tag used for rows.  Click "+
"the \"More\" button to see more field properties and documentation, particularly \"valueXPath\"";
                props={dataFormat:"xml"};
            }else if(dsType=="json"){
                instructions=
"For \"dataURL\", enter a URL which will return JSON data.<P>"+
"For \"recordXPath\", enter an XPath to an Array of Objects in the JSON data, then enter fields for each property of those Objects which you want to display, and its type.<P>"+
"Click the \"More\" button to see more field properties and documentation, particularly \"valueXPath\"";
                props={dataFormat:"json"};
            }else if(dsType=="rss"){
                instructions="Enter the URL of the RSS feed as \"dataURL\" below, then add or remove fields.";
                props={
                    dataFormat:"xml",
                    recordXPath:"//default:item|//item",
                    fields:[
                        {name:"title",title:"Title"},
                        {name:"link",title:"Story",type:"link"},
                        {name:"description",title:"Description"},
                        {name:"pubDate",title:"Published"}
                    ]
                }
            }
            if(record.wizardDefaults){
                props.wizardDefaults=isc.addProperties({},record.wizardDefaults);
            }
            this.showDSEditor(props,true,instructions);
            return;
        }
    }
    this.Super("nextPage");
}
,isc.A.pickOperation=function isc_DSWizard_pickOperation(){
    isc.showPrompt("Loading WSDL...");
    isc.XML.loadWSDL(this.servicePicker.items[0].getValue("serviceURL"),
        this.getID()+".webServiceLoaded(service)",
        null,
        true
    );
}
,isc.A.webServiceLoaded=function isc_DSWizard_webServiceLoaded(service){
    isc.clearPrompt();
    if(service){
        this.servicePicker.items[0].setValue("serviceURL","http://");
        var vb=this.callingBuilder;
        if(!vb.operationsPalette){
            if(vb.showRightStack!=false){
                vb.showOperationsPalette=true;
                vb.addAutoChild("operationsPalette");
                vb.rightStack.addSection({title:"Operations",autoShow:true,
                    items:[vb.operationsPalette]
                },1);
            }
            for(var i=0;i<service.portTypes.length;i++){
                var portType=service.portTypes[i];
                for(var j=0;j<portType.operation.length;j++){
                    var operation=portType.operation[j];
                    var soConfig={
                        operationName:operation.name,
                        serviceNamespace:service.serviceNamespace,
                        serviceName:service.serviceName||service.name,
                        serviceDescription:service.serviceName||service.serviceNamespace,
                        portTypeName:portType.portTypeName,
                        location:service.location
                    }
                    vb.addWebService(service,soConfig);
                }
            }
        }
        vb.wizardWindow.hide();
    }
}
,isc.A.fetchWSDL=function isc_DSWizard_fetchWSDL(wsdlURL){
    this.wsdlURL=wsdlURL;
    if(wsdlURL!=null){
        if(isc.isA.ResultSet(this.operationPicker.data)){
            this.operationPicker.data.invalidateCache();
        }
        this.operationPicker.fetchData(null,null,{dataURL:wsdlURL});
    }
}
,isc.A.enterCallServicePage=function isc_DSWizard_enterCallServicePage(page){
    var wsdlURL=this.wsdlURL;
    isc.xml.loadWSDL(wsdlURL,this.getID()+"._wsdlLoaded(service)");
    if(this.serviceInput!=null)return;
    var view=this.createAutoChild("callServicePage",{
        visibilityMode:"multiple"
    },isc.SectionStack);
    page.view=view;
    this.serviceInput=this.createAutoChild("serviceInput",{
    },isc.DynamicForm);
    var callServiceButton=this.createAutoChild("callServiceButton",{
        title:"Call Service",
        click:"this.creator.callService()",
        resizeable:false
    },isc.Button);
    view.addSection({title:"Service Inputs",autoShow:true,items:[
        this.serviceInput,
        callServiceButton
    ]});
    this.requestEditor=this.createAutoChild("requestEditor",{
        height:250,
        fields:[
            {name:"useEditedMessage",title:"Use Edited Message",type:"checkbox",
             defaultValue:false},
            {name:"requestBody",showTitle:false,type:"textArea",width:"*",height:"*",
             colSpan:"*"}
        ]
    },isc.DynamicForm);
    view.addSection({title:"Request Editor",items:[this.requestEditor]});
    this.serviceOutput=this.createAutoChild("serviceOutput",{
        showHeader:false,
        wrapCells:true,
        fixedRecordHeights:false
    },isc.DOMGrid);
    view.addSection({title:"Service Output",autoShow:true,items:[this.serviceOutput]});
    this.expressionForm=this.createAutoChild("expressionForm",{
        numCols:4,
        colWidths:[120,150,"*",50],
        items:[
            {name:"selectBy",title:"Select Records By",width:"*",
             valueMap:{tagName:"Tag Name",xpath:"XPath Expression"},
             defaultValue:"xpath"},
            {name:"expression",showTitle:false,width:"*"},
            {type:"button",title:"Select",width:"*",startRow:false,
             click:"form.creator.selectNodes()"}
        ]
    },isc.DynamicForm);
    this.selectedNodesView=this.createAutoChild("selectedNodesView",{
        showHeader:false,
        showRoot:false,
        wrapCells:true,
        fixedRecordHeights:false
    },isc.DOMGrid);
    view.addSection({title:"Select Elements",autoShow:true,
                      items:[this.expressionForm,this.selectedNodesView]});
}
,isc.A._wsdlLoaded=function isc_DSWizard__wsdlLoaded(service){
    this.service=service;
    this.serviceInput.setDataSource(this.service.getInputDS(this.operationName));
}
,isc.A.callService=function isc_DSWizard_callService(){
    if(!this.serviceInput.validate())return;
    var inputDS=this.serviceInput.dataSource,
        criteria=this.serviceInput.getValuesAsCriteria(),
        serviceInputs=this.serviceInputs=inputDS.getServiceInputs({data:criteria});
    if(this.requestEditor){
        if(this.requestEditor.getValue("useEditedMessage")){
            var requestBody=this.requestEditor.getValue("requestBody");
            serviceInputs.requestBody=requestBody;
        }else{
            this.requestEditor.setValue("requestBody",serviceInputs.requestBody);
        }
    }
    serviceInputs.callback=
        this.getID()+".serviceOutput.setRootElement(xmlDoc.documentElement)";
    isc.xml.getXMLResponse(serviceInputs);
}
,isc.A.selectNodes=function isc_DSWizard_selectNodes(){
    var expressionForm=this.expressionForm,
        sourceDoc=this.serviceOutput.rootElement,
        selectedNodes;
    this.selectBy=expressionForm.getValue("selectBy");
    if(this.selectBy=="xpath"){
        this.recordName=null;
        this.recordXPath=expressionForm.getValue("expression");
        selectedNodes=isc.xml.selectNodes(sourceDoc,this.recordXPath);
    }else{
        this.recordXPath=null;
        this.recordName=expressionForm.getValue("expression");
        var nodeList=sourceDoc.getElementsByTagName(this.recordName);
        selectedNodes=[];
        for(var i=0;i<nodeList.length;i++)selectedNodes.add(nodeList[i]);
    }
    this.selectedNodesView.setRootElement({childNodes:selectedNodes});
    this.selectedNodes=selectedNodes;
    this.nextButton.enable();
}
,isc.A.enterBindingPage=function isc_DSWizard_enterBindingPage(page){
    var sampleData=this.selectedNodesView.data,
        sampleNode=sampleData.get(0)._element,
        nodeType=sampleNode.getAttribute("xsi:type")||sampleNode.tagName;
    if(nodeType.contains(":"))nodeType=nodeType.substring(nodeType.indexOf(":")+1);
    var ds=this.outputDS=isc.DS.get(nodeType);
    this.logWarn("nodeType is: "+nodeType+", ds is: "+ds);
    this.boundGrid=this.createAutoChild("boundGrid",{
        dataSource:ds,
        data:this.selectedNodes,
        alternateRecordStyles:true
    },isc.ListGrid)
    page.view=this.boundGrid;
}
,isc.A.enterKapowPickRobotPage=function isc_DSWizard_enterKapowPickRobotPage(page){
    if(!this.kapowRobotList){
        this.kapowRobotList=this.createAutoChild("kapowRobotList",{
            selectionChanged:function(){
                var hasSelection=this.getSelectedRecord()!=null;
                this.creator.nextButton.setDisabled(!hasSelection);
            }
        },isc.ListGrid);
        page.view=this.kapowRobotList;
    }
    var kapowRobotListDS=isc.XJSONDataSource.create({
        ID:"kapowRobotListDS",
        callbackParam:"json.callback",
        dataURL:window.robotServerURL+"/ISCVBListAllRobots?format=JSON",
        fields:[
            {name:"name",title:"Robot"},
            {name:"type",title:"Type"}
        ],
        transformResponse:function(dsResponse){
            var data=[];
            for(var i=0;i<dsResponse.data.length;i++){
                var robot=dsResponse.data[i];
                if(robot.name.startsWith("ISCVB"))continue;
                data.add(robot);
            }
            dsResponse.data=data;
            dsResponse.totalRows=dsResponse.data.length;
            dsResponse.endRow=dsResponse.data.length-1;
            return dsResponse;
        }
    });
    this.kapowRobotList.setDataSource(kapowRobotListDS);
    this.kapowRobotList.fetchData();
}
,isc.A.kapowFinish=function isc_DSWizard_kapowFinish(){
    var robots=this.kapowRobotList.getSelection(),
        robotsLength=robots.length;
    for(var i=0;i<robotsLength;++i){
        var robot=robots[i];
        isc.XMLTools.loadXML(window.robotServerURL+"/admin/"+robot.name+".robot",this.getID()+".kapowRobotLoaded(xmlDoc,'"+robot.name+"','"+robot.type+"')");
    }
}
,isc.A.saveDataSource=function isc_DSWizard_saveDataSource(ds){
    var dsClass=ds.getClassName();
    var schema;
    if(isc.DS.isRegistered(dsClass)){
        schema=isc.DS.get(dsClass);
    }else{
        schema=isc.DS.get("DataSource");
        ds._constructor=dsClass;
    }
    var xml=schema.xmlSerialize(ds);
    this.logWarn("saving DS with XML: "+xml);
    this.dsDataSource.saveFile({
        fileName:ds.ID,
        fileType:"ds",
        fileFormat:"xml"
    },xml);
}
,isc.A.kapowRobotLoaded=function isc_DSWizard_kapowRobotLoaded(xmlDoc,robotName,robotType){
    this.logInfo("loaded robot: "+robotName);
    var outputs=isc.xml.selectNodes(xmlDoc,"//property[@name='startModelObjects']/element[@class='kapow.robot.common.domain.Entity']/property");
    outputs=isc.xml.toJS(outputs);
    var outputFields=[];
    for(var i=0;i<outputs.length;i++){
        var prop=outputs[i];
        if(!prop.xmlTextContent)continue;
        outputFields.add({
            name:prop.xmlTextContent,
            type:this.fieldTypeForJavaClass(prop["class"])
        });
    }
    this.logWarn("Robot: "+robotName+" - derived outputFields: "+isc.echoAll(outputFields));
    var outputDS;
    if(outputFields.length){
        outputDS=isc.DataSource.create({
            ID:robotName+"DS",
            callbackParam:"json.callback",
            dataURL:window.robotServerURL+"/"+robotName+"?format=JSON",
            noAutoFetch:true,
            fields:outputFields,
            dataFormat:"json",
            dataTransport:"scriptInclude"
        });
    }else if(robotType=="rss"){
        var outputDS=isc.DataSource.create({
            ID:robotName+"DS",
            dataURL:window.robotServerURL+"/"+robotName,
            recordXPath:"//default:item",
            noAutoFetch:true,
            fields:[
                {name:"title"},
                {name:"link",type:"link"},
                {name:"description"},
                {name:"created"},
                {name:"category"},
                {name:"email"},
                {name:"name"},
                {name:"rights"}
            ]
        });
    }
    if(outputDS){
        this.callingBuilder.addDataSource(outputDS);
        this.saveDataSource(outputDS);
    }
    var inputs=isc.xml.selectNodes(xmlDoc,"//property[@name='queryParameters']/element[@class='kapow.robot.common.domain.Entity']/property");
    inputs=isc.xml.toJS(inputs);
    var inputFields=[];
    for(var i=0;i<inputs.length;i++){
        var prop=inputs[i];
        if(!prop.xmlTextContent)continue;
        if(prop.name&&prop.name.startsWith("value"))continue;
        inputFields.add({
            name:prop.xmlTextContent,
            type:this.fieldTypeForJavaClass(prop["class"])
        });
    }
    this.logWarn("Robot: "+robotName+" - derived inputFields: "+isc.echoAll(inputFields));
    if(inputFields.length){
        var inputDS=isc.DataSource.create({
            ID:robotName+"InputDS",
            type:"generic",
            fields:inputFields
        });
        this.callingBuilder.addDataSource(inputDS);
        this.saveDataSource(inputDS);
    }
    if(this.callingBuilder)this.callingBuilder.wizardWindow.hide();
    this.resetWizard();
}
,isc.A.fieldTypeForJavaClass=function isc_DSWizard_fieldTypeForJavaClass(c){
    switch(c){
        case"java.lang.Boolean":
            return"boolean";
        case"java.util.Date":
            return"date";
        case"java.lang.Byte":
        case"java.lang.Short":
        case"java.lang.Integer":
        case"java.lang.Long":
        case"java.lang.BigInteger":
            return"integer";
        case"java.lang.Float":
        case"java.lang.Double":
        case"java.lang.BigDecimal":
            return"float";
        default:
            return"text";
    }
}
,isc.A.enterSFPickEntityPage=function isc_DSWizard_enterSFPickEntityPage(page){
    this.sfService=isc.WebService.get("urn:partner.soap.sforce.com");
    if(!this.sfEntityList){
        this.sfEntityList=this.createAutoChild("sfEntityList",{
            fields:[{name:"objectType",title:"Object Type"}],
            selectionChanged:function(){
                var hasSelection=this.getSelectedRecord()!=null;
                this.creator.nextButton.setDisabled(!hasSelection);
            }
        },isc.ListGrid);
        page.view=this.sfEntityList;
    }
    this.sfService.getEntityList({target:this,methodName:"getEntityListReply"});
}
,isc.A.getEntityListReply=function isc_DSWizard_getEntityListReply(list){
    var objects=[];
    for(var i=0;i<list.length;i++){
        objects.add({objectType:list[i]});
    }
    this.sfEntityList.setData(objects);
}
,isc.A.enterSFDonePage=function isc_DSWizard_enterSFDonePage(page){
    var objectType=this.sfEntityList.getSelectedRecord().objectType;
    if(!this.sfGrid){
        this.sfGrid=this.createAutoChild("sfGrid",{
        },isc.ListGrid);
    }
    this.sfService.getEntity(objectType,{target:this,methodName:"showSFBoundGrid"});
    page.view=this.sfGrid;
}
,isc.A.showSFBoundGrid=function isc_DSWizard_showSFBoundGrid(schema){
    this.sfGrid.setDataSource(schema);
    this.sfGrid.fetchData();
}
,isc.A.sfFinish=function isc_DSWizard_sfFinish(){
    this.showDSEditor(this.sfGrid.dataSource,true,
                      "You can remove fields below to prevent them from being shown, "+
                      "and alter user-visible titles.");
}
,isc.A.finish=function isc_DSWizard_finish(){
    if(this.getCurrentPage().ID=="SFDonePage")return this.sfFinish();
    if(this.getCurrentPage().ID=="KapowPickRobotPage")return this.kapowFinish();
    this.logWarn("passing output DS: "+this.echo(this.outputDS));
    var ds=this.service.getFetchDS(this.operationName,this.outputDS);
    ds.recordXPath=this.recordXPath;
    ds.recordName=this.recordName;
    ds.fetchSchema.defaultCriteria=isc.addProperties({},this.serviceInput.getValues());
    this.logWarn("created DataSource with props: "+this.echo(ds));
    this.showDSEditor(ds);
}
,isc.A.showDSEditor=function isc_DSWizard_showDSEditor(ds,isNew,instructions){
    if(this.logIsDebugEnabled("dsWizard")){
        this.logDebug("DS Wizard show DS Editor: "+this.echoFull(ds),"dsWizard");
    }
    this.callingBuilder.showDSEditor(ds,isNew,instructions);
    this.callingBuilder.wizardWindow.hide();
    this.resetWizard();
}
,isc.A.closeClick=function isc_DSWizard_closeClick(){
    this.Super("closeClick",arguments);
    this.resetWizard();
}
,isc.A.resetWizard=function isc_DSWizard_resetWizard(){
    if(this.dsTypePicker)this.dsTypePicker.clearValues();
    if(this.servicePicker&&this.servicePicker.selectionManager){
        this.servicePicker.selectionManager.deselectAll();
        this.servicePicker.fireSelectionUpdated();
    }
    if(this.operationPicker)this.operationPicker.setData([]);
    if(this.callServicePage){
        this.serviceInput.clearValues();
        this.serviceOutput.setData([]);
        this.expressionForm.clearValues();
        this.selectedNodesView.setData([]);
    }
    this.Super("resetWizard",arguments);
}
,isc.A.startJavaBeanWizard=function isc_DSWizard_startJavaBeanWizard(wizard,record){
    isc.askForValue("Enter the name of the JavaBean for which you want to generate a DataSource.",
        function(value){
            wizard.continueJavaBeanWizard(wizard,record,value);
        },{width:400}
    );
}
,isc.A.continueJavaBeanWizard=function isc_DSWizard_continueJavaBeanWizard(wizard,record,value){
    if(value){
        wizard.getJavaBeanDSConfig(wizard,record,value);
    }
}
,isc.A.getJavaBeanDSConfig=function isc_DSWizard_getJavaBeanDSConfig(wizard,record,className){
    if(className!=null){
        isc.DMI.call("isc_builtin","com.isomorphic.tools.BuiltinRPC",
            "getDataSourceConfigFromJavaClass",
            className,
            function(data){
                wizard.finishJavaBeanWizard(wizard,record,className,data)
            }
        );
    }
}
,isc.A.finishJavaBeanWizard=function isc_DSWizard_finishJavaBeanWizard(wizard,record,className,response){
    var config=response.data.dsConfig?response.data.dsConfig:null;
    if(isc.isAn.Object(config)){
        if(record.wizardDefaults)isc.addProperties(config,record.wizardDefaults);
        wizard.showDSEditor(config,true);
    }else{
        isc.say(config);
    }
}
);
isc.B._maxIndex=isc.C+31;

isc.defineClass("SampleDataDSWizard","Window");
isc.A=isc.SampleDataDSWizard.getPrototype();
isc.A.orientation="vertical";
isc.A.title="Create DataSource";
isc.A.width="85%";
isc.A.height="85%";
isc.A.isModal=true;
isc.A.showModalMask=true;
isc.A.canDragResize=true;
isc.A.formatHelpText="<h3>General data format</h3>"+
        "<p>"+
        "<h4>Mockup text</h4>"+
        "<p>"+
        "Data intended for a ListGrid or TreeGrid, expressed in a simple text "+
        "format popularized by mockup tools such as balsamiq and now "+
        "commonly supported in a variety of mockup tools."+
        "<p>"+
        "<b><i>Grid Data</i></b>"+
        "<p>"+
        "Data for a grid is expressed in rows of data with columns separated by "+
        "commas. The first row is assumed to the header titles and is also used "+
        "to name the DataSource fields. Default sort order for column can be "+
        "specified by a trailing v or ^."+
        "<p>"+
        "Column widths and simple formatting are optionally defined by adding a "+
        "trailing row after the data that is wrapped with {}. Each column width "+
        "is specified separated by a comma matching the header and data rows. "+
        "A column width of 0 means auto-fit column width to the data."+
        "<p>"+
        "The width values themselves are either a percentage value like 70 or 30 "+
        "for 70% and 30% respectively or relative size multiplier where 1 means "+
        "the normal size and 2 or 3, for example, indicate a field that is twice "+
        "or 3-times as large as the normal size (1)."+
        "<p>"+
        "Column alignment can be included with the column width by appending L, C "+
        "or R (left, center or right)."+
        "<p>"+
        "A single checkbox or radio button can be placed into a cell using:"+
            "<ul>"+
            "<li>Checkbox: [] or [ ]</li>"+
            "<li>Selected checkbox: [x] or [v] or [o] or [*] or [X] or [V] or [O]</li>"+
            "<li>Indeterminate checkbox: [-]</li>"+
            "<li>Radio button: () or ( )</li>"+
            "<li>Selected radio button: (x) or (v) or (o) or (*) or (X) or (V) or (O)</li>"+
            "<li>Indeterminate radio button: (-)</li>"+
            "</ul>"+
        "<p>"+
        "Field types are detected as specified below."+
        "<p>"+
        "<b><i>Tree Data</i></b>"+
        "<p>"+
        "Tree data is specified with one row of text for each node in the tree. "+
        "The first \"word\" indicates the type of node and the remaining words "+
        "are the node title. There must be at least one space after the node type."+
        "<p>"+
            "<ul>"+
            "<li>f - closed folder</li>"+
            "<li>F - open folder</li>"+
            "<li>&gt; - closed folder</li>"+
            "<li>v - open folder</li>"+
            "<li>[+] - folder with [+] icon</li>"+
            "<li>[-] - folder with [-] icon</li>"+
            "<li>[x] - node with checkbox that is checked</li>"+
            "<li>[ ] - node with an unchecked checkbox</li>"+
            "<li>- (dash) - node with a file icon</li>"+
            "<li>_ (underscore) - node with a blank icon</li>"+
            "</ul>"+
        "<p>"+
        "To indent nodes within the tree use spaces or dots. Each represents a new "+
        "level in the tree."+
        "<p>"+
        "A single text field named \"name\" is used."+
        "<p>"+
        "<h4>CSV</h4>"+
        "<p>"+
        "Data is expressed as rows of field values separated by commas. Values "+
        "can be wrapped in quotation marks (\") for clarity or to include a "+
        "comma within the field value. "+
        "<p>"+
        "Field types are detected as specified below."+
        "<p>"+
        "<h4>XML</h4>"+
        "<p>"+
        "Data is expressed as a list of XML elements containing similar element "+
        "values. The XML text is converted to JSON and then processed accordingly. "+
        "<p>"+
        "Field types are detected as specified below."+
        "<p>"+
        "<h4>JSON</h4>"+
        "<p>"+
        "Data is expressed as a list of JSON objects containing similar property "+
        "values. Fields are determined by extracting the unique keys from each "+
        "record. "+
        "<p>"+
        "Field types are detected as specified below."+
        "<p>"+
        "<h3>Field value format</h3>"+
        "<p>"+
        "Field types are guessed by processing the field values to find the best "+
        "match (i.e. least conversion errors). At least 10 matching examples "+
        "must be found before determining a specialized type. "+
        "<p>"+
        "The following specialized field types are detected:"+
            "<ul>"+
            "<li><b>Integer</b> - values consist of only numerals or thousands "+
            "separator (comma).</li>"+
            "<li><b>Float</b> - values consist of numerals with decimal point and "+
            "optional thousands separator.</li>"+
            "<li><b>Boolean</b> - <i>true</i> values can be expressed as t, true, yes, "+
            "[x] or 1. <i>false</i> values can be expressed as f, false, no, [], [ ], "+
            "or 0.</li>"+
            "<li><b>Time</b> - Some example formats: "+
            "21:23, 19:14:07, 1.00pm, 2am, 3:15 am, 21:2, 10:01 and 4:33pm</li>"+
            "<li><b>Date</b> - A date can be detected with a month and year or "+
            "with month, day and year. These can be specified in the common orders "+
            "using one or two digits for month and day and two or four digits for "+
            "the year. When a two-digit year is found if the value is less than "+
            "25 a leading \"20\" is added; otherwise a leading \"19\" is added. Note "+
            "that all dates in the field must match the same digit ordering. "+
            "The separator can be a slash (/), dash (-) or period (.)."+
            "<br>Some example formats: 6-01-10, 6-11-1, 16/07/30 and 13-5-1</li>"+
            "<li><b>DateTime</b> - A dateTime is the combination of a Date and "+
            "a Time value as detailed above separated by one or more spaces. A "+
            "special \"schema\" format is also allowed as commonly found in XML: "+
            "2006-01-10T12:22:04-04:00</li>"+
            "</ul>"+
        "If no specialized field type is detected, the default type is <b>text</b>"+
        "<p>";
isc.A.importFileTooLargeMessage="Please provide a smaller sample data set. Deployed application do not have such limits on data sets.";
isc.A.outerLayoutDefaults={
        _constructor:isc.VLayout,
        autoParent:"body",
        autoDraw:false,
        width:"100%",height:"100%",
        overflow:"hidden",
        padding:3
    };
isc.A.acceptedFileTypes={
        "XML":"text/xml",
        "CSV":"text/csv",
        "JSON":"application/json"
    };
isc.A.optionsFormDefaults={
        _constructor:isc.DynamicForm,
        autoParent:"outerLayout",
        autoDraw:false,
        dataSource:"SCUploadSaveFile",
        width:"100%",
        height:110,
        numCols:3,
        colWidths:[150,300,"*"],
        cellPadding:5,
        fields:[
            {
                name:"dataSourceName",
                type:"text",
                title:"DataSource name",
                width:"*",
                wrapTitle:false,
                required:true,
                hoverWidth:300,
                validators:[
                    {
                        type:"custom",
                        condition:function(item,validator,value,record,additionalContext){
                            if(!value)return true;
                            if(!validator.idMap){
                                var allDataSources=isc.DS.getRegisteredDataSourceObjects(),
                                    idMap={}
                                ;
                                for(var i=0;i<allDataSources.length;i++){
                                    var ds=allDataSources[i];
                                    if(ds&&ds.componentSchema){
                                        var id=ds.ID;
                                        idMap[id.toLowerCase()]=id;
                                    }
                                }
                                validator.idMap=idMap;
                            }
                            var ds=isc.DS.get(validator.idMap[value.toLowerCase()]);
                            return(!ds||!ds.componentSchema);
                        },
                        errorMessage:"DataSource name matches a system DataSource. Please choose another name."
                    }
                ]
            },
            {
                type:"staticText",
                canEdit:false,
                shouldSaveValue:false,
                showTitle:false,
                width:"*",
                defaultValue:'Choose a name the reflects the things being stored, for example, if storing data about people choose "people", or if about accounts, choose "accounts"'
            },
            {
                name:"inputFormat",
                type:"radioGroup",
                title:"Select input format",
                valueMap:["Mockup text","CSV","XML","JSON"],
                vertical:false,
                redrawOnChange:true,
                changed:function(form,item,value){
                    form.inputFormatChanged(value);
                }
            },
            {
                name:"formatHelpLink",
                type:"LinkItem",
                showTitle:false,
                linkTitle:"Format help",
                canEdit:false,
                target:"javascript",
                click:function(){
                    this.form.showFormatHelp();
                }
            },
            {
                type:"SpacerItem"
            },
            {
                type:"staticText",
                canEdit:false,
                shouldSaveValue:false,
                showTitle:false,
                width:"*",
                defaultValue:"Type or paste data below, or upload a file."
            },
            {
                name:"import",
                editorType:"UploadSampleDataItem",
                showTitle:false,
                width:"*",
                shouldSaveValue:false,
                init:function(){
                    if(this.form.values&&this.form.values.inputFormat){
                        var fileType=this.form.values.inputFormat,
                            accept;
                        if(fileType!="Mockup text"){
                            accept=this.form.creator.acceptedFileTypes[fileType];
                        }
                        if(accept)this.accept=accept;
                    }
                    this.Super("init",arguments);
                },
                importedData:function(data,fileName){
                    this.form.creator.importedData(data,fileName);
                }
            }
        ],
        draw:function(){
            this.Super("draw",arguments);
            if(!this._initiallyFocussed){
                this.focusInItem("dataSourceName");
                this._initiallyFocussed=true;
            }
        },
        showFormatHelp:function(){
            var window=isc.Window.create({
                autoDraw:false,
                title:"Format help",
                width:"70%",height:"70%",
                autoCenter:true,
                isModal:true,
                showModalMask:true,
                showMinimizeButton:false,
                dismissOnEscape:true,
                dismissOnOutsideClick:true,
                items:[
                    isc.HTMLPane.create({
                        autoDraw:false,
                        padding:10,
                        contents:this.formatHelpText
                    })
                ]
            });
            window.show();
            window.items[0].focus();
        },
        inputFormatChanged:function(value){}
    };
isc.A.dataFormDefaults={
        _constructor:isc.DynamicForm,
        autoParent:"outerLayout",
        autoDraw:false,
        width:"100%",
        height:"*",
        numCols:1,
        parentResized:function(skipResolve){
            this.Super("parentResized",arguments);
            this.markForRedraw();
        }
    };
isc.A.pasteDataFieldDefaults={
        name:"pasteData",
        type:"TextAreaItem",
        showTitle:false,
        width:"*",
        height:"*",
        hint:"Type or paste data here",
        showHintInField:true,
        browserSpellCheck:false
    };
isc.A.buttonLayoutDefaults={
        _constructor:isc.HLayout,
        autoParent:"outerLayout",
        autoDraw:false,
        width:"100%",height:35,
        padding:5,
        membersMargin:10,
        align:"right"
    };
isc.A.createDataSourceButtonDefaults={
        _constructor:isc.IButton,
        autoParent:"buttonLayout",
        autoDraw:false,
        title:"Create DataSource",
        click:function(){
            this.creator.createDataSourceClick(this.creator.targetDSType);
        }
    };
isc.A.createDataSourceMenuDefaults={
        _constructor:isc.Menu,
        autoDraw:false,
        showIcons:false,
        showShadow:true,
        shadowDepth:10,
        itemClick:function(item){
            this.creator.createDataSourceClick(item.title);
        }
    };
isc.A.createDataSourceMenuButtonDefaults={
        _constructor:isc.MenuButton,
        autoParent:"buttonLayout",
        autoDraw:false,
        title:"Create DataSource"
    }
;

isc.A=isc.SampleDataDSWizard.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.parseDetailsDialogDefaults={
    _constructor:isc.Dialog,
    autoDraw:false,
    autoCenter:true,
    isModal:true,
    autoSize:true,
    width:100,
    title:"Parse Details",
    bodyDefaults:{layoutMargin:10,membersMargin:10},
    buttons:[
        {title:"Go back and correct data",width:175,overflow:"visible",
            click:function(){this.topElement.cancelClick()}
        },
        {title:"Ignore and proceed",width:125,overflow:"visible",
            click:function(){this.topElement.okClick()}
        }
    ]
};
isc.A.parseDetailsMessageLabelDefaults={
    _constructor:isc.Labe,
    autoDraw:false,
    width:600,
    height:30,
    canSelectText:true,
    contents:"We've noticed some possible inconsistencies in your sample data - see below"
};
isc.A.errorViewerDefaults={
    _constructor:isc.ListGrid,
    autoDraw:false,
    width:600,
    autoFitData:"vertical",
    autoFitMaxRecords:10,
    hoverStyle:"darkHover",
    defaultFields:[
        {name:"fieldName",title:"Field",width:200},
        {name:"message",title:"Message",width:"*",showHover:true,hoverWidth:400}
    ]
};
isc.B.push(isc.A.destroy=function isc_SampleDataDSWizard_destroy(){
    this.Super("destroy",arguments);
    if(this.uploadDialog)this.uploadDialog.destroy();
}
,isc.A.createChildren=function isc_SampleDataDSWizard_createChildren(){
    this.Super("createChildren");
    this.body.hPolicy="fill";
    this.body.vPolicy="fill";
    var optionsFormProperties={
            formatHelpText:this.formatHelpText,
            inputFormatChanged:function(value){this.creator.inputFormatChanged();}
        },
        dataFormProperties={fields:[isc.addProperties({},this.pasteDataFieldDefaults)]}
    ;
    if(this.existingDS){
        var ds=this.existingDS,
            inputFormat=ds.mockDataFormat.toUpperCase()
        ;
        if(inputFormat=="MOCK")inputFormat="Mockup text";
        optionsFormProperties.values={inputFormat:inputFormat,dataSourceName:ds.ID};
        dataFormProperties.values={pasteData:ds.mockData};
    }
    if(this.defaultInputFormat&&!optionsFormProperties.values){
        optionsFormProperties.values={inputFormat:this.defaultInputFormat};
    }
    this.addAutoChild("outerLayout");
    this.addAutoChild("optionsForm",optionsFormProperties);
    this.addAutoChild("dataForm",dataFormProperties);
    this.addAutoChild("buttonLayout");
    var targetDSTypes=this.targetDSType.split(",");
    if(targetDSTypes.length==1){
        this.addAutoChild("createDataSourceButton");
    }else{
        var menuItems=targetDSTypes.map(function(dsType){
            return{title:dsType};
        });
        var menu=this.createAutoChild("createDataSourceMenu",{data:menuItems});
        this.addAutoChild("createDataSourceMenuButton",{menu:menu});
    }
    var scUploadSaveFileDS=isc.DataSource.get("SCUploadSaveFile"),
        _this=this
    ;
    scUploadSaveFileDS.performCustomOperation("checkUploadFeature",null,
        function(response,data){
            if(response.status==isc.RPCResponse.STATUS_SUCCESS){
                _this.enableImportButton();
            }
        },
        {willHandleError:true}
    );
}
,isc.A.createDataSourceClick=function isc_SampleDataDSWizard_createDataSourceClick(dsType){
    if(!this.optionsForm.validate()||!this.dataForm.validate()){
        return;
    }
    if(this.dataForm.getValue("pasteData")==null){
        isc.say("No data has been entered or uploaded.",null,{
            title:"Missing required field",
            icon:"[SKINIMG]Dialog/error.png"
        });
        return;
    }
    var _this=this,
        dataSourceName=this.optionsForm.getValue("dataSourceName"),
        fileSpec={
            fileName:dataSourceName,
            fileType:"ds",
            fileFormat:"xml"
        }
    ;
    this.builder.dsDataSource.hasFile(fileSpec,function(dsResponse,data,dsRequest){
        if(!data){
            _this._createDataSource(dsType);
            return;
        }
        isc.warn("DataSource name '"+dataSourceName+"' is already in use. "+
                    "Overwrite the existing DataSource?",
        function(value){
            if(value)_this._createDataSource(dsType);
        },{
            buttons:[
                isc.Dialog.CANCEL,
                {title:"Overwrite",width:75,overflow:"visible",
                    click:function(){this.topElement.okClick()}
                }
            ],
            autoFocusButton:1
        })
    },{
        operationId:"allOwners"
    });
}
,isc.A._createDataSource=function isc_SampleDataDSWizard__createDataSource(dsType){
    var fileType=this.optionsForm.getValue("inputFormat");
    if(fileType=="Mockup text")fileType="mock";
    isc.showPrompt("Analyzing sample data...");
    var rawData=this.dataForm.getValue("pasteData"),
        _this=this
    ;
    isc.Timer.setTimeout(function(){
        _this.parseData(fileType,rawData,function(parsedData,parsedFields,rawData){
            try{
                var guesser=isc.SchemaGuesser.create({minExampleCount:0,fields:parsedFields}),
                    guessedFields=guesser.extractFieldsFrom(parsedData),
                    guessedRecords=guesser.convertData(parsedData),
                    parseDetails=guesser.parseDetails
                ;
                isc.clearPrompt();
                if(parseDetails&&parseDetails.length>0){
                    var dialog=_this.createAutoChild("parseDetailsDialog",{
                        items:[
                            _this.createAutoChild("parseDetailsMessageLabel"),
                            _this.createAutoChild("errorViewer",{data:parseDetails})
                        ],
                        okClick:function(){
                            this.Super("okClick",arguments);
                            _this.__createDataSource(dsType,fileType,rawData,guessedFields,guessedRecords);
                        },
                        cancelClick:function(){
                            this.Super("cancelClick",arguments);
                        }
                    });
                    dialog.show();
                }else{
                    _this.__createDataSource(dsType,fileType,rawData,guessedFields,guessedRecords);
                }
            }catch(e){
                isc.clearPrompt();
                _this.logWarn("Error parsing data: "+e);
                isc.say("Failed to parse data.  Make sure you have the right format selected above!");
            }
        });
    },10);
}
,isc.A.__createDataSource=function isc_SampleDataDSWizard___createDataSource(dsType,fileType,rawData,guessedFields,guessedRecords){
    var dataSourceName=this.optionsForm.getValue("dataSourceName"),
        dsProperties={},
        ds;
    if(dsType=="MockDataSource"){
        isc.addProperties(dsProperties,{
            ID:dataSourceName,
            mockData:rawData,
            mockDataFormat:fileType.toLowerCase()
        });
        ds=isc.MockDataSource.create(dsProperties);
        this._paletteNode.wizardDefaults.showDSEditor="false";
    }else{
        if(dsType=="SQLDataSource"||dsType=="HibernateDataSource"){
            isc.addProperties(dsProperties,{
                ID:dataSourceName,
                serverType:dsType=="SQLDataSource"?"sql":"hibernate",
                fields:guessedFields
            });
        }
        ds=isc.DataSource.create(dsProperties);
        this._paletteNode.wizardDefaults.importData={
            fileType:fileType,
            rawData:rawData,
            guessedRecords:guessedRecords
        };
    }
    this._paletteNode.defaults=ds;
    this.fireCallback(this._getResultsCallback,"node",[this._paletteNode])
    this.hide();
}
,isc.A.parseData=function isc_SampleDataDSWizard_parseData(fileType,rawData,callback){
    var _this=this;
    var parse=function(data){
        var parsedData,
            parsedFields
        ;
        var parser=isc.FileParser.create({hasHeaderLine:true});
        if(fileType=="JSON"||fileType=="XML"){
            parsedData=parser.parseJsonData(data);
        }else if(fileType=="CSV"){
            parsedData=parser.parseCsvData(data);
            rawData=parser.getFilteredCsvData();
        }
        parsedFields=parser.getFields();
        callback(parsedData,parsedFields,rawData);
    };
    if(fileType=="XML"){
        var xmlData=isc.xml.parseXML(rawData);
        var elements=isc.xml.selectNodes(xmlData,"/"),
            jsElements=isc.xml.toJS(elements)
        ;
        if(jsElements.length==1){
            var encoder=isc.JSONEncoder.create({dateFormat:"dateConstructor",prettyPrint:false});
            var json=encoder.encode(jsElements[0]);
            parse(json);
        }
    }else if(fileType=="mock"){
        callback(rawData,rawData,rawData);
    }else{
        parse(rawData);
    }
}
,isc.A.importedData=function isc_SampleDataDSWizard_importedData(data,fileName){
    if(fileName)this.updateInputFormatFromFileName(fileName);
    this.dataForm.setValue("pasteData",data);
}
,isc.A.inputFormatChanged=function isc_SampleDataDSWizard_inputFormatChanged(){
    var fileType=this.optionsForm.getValue("inputFormat"),
        accept;
    if(fileType!="Mockup text"){
        accept=this.acceptedFileTypes[fileType];
    }
    var field=this.optionsForm.getItem("import");
    field.setAccept(accept);
}
,isc.A.updateInputFormatFromFileName=function isc_SampleDataDSWizard_updateInputFormatFromFileName(fileName){
    fileName=fileName.toLowerCase();
    var inputFormat;
    if(fileName.endsWith(".csv")){
        inputFormat="CSV";
    }else if(fileName.endsWith(".xml")){
        inputFormat="XML";
    }else if(fileName.endsWith(".json")){
        inputFormat="JSON";
    }
    if(inputFormat)this.optionsForm.setValue("inputFormat",inputFormat);
}
,isc.A.enableImportButton=function isc_SampleDataDSWizard_enableImportButton(){
    this.optionsForm.getItem("import").enableImport();
}
,isc.A.importFileClick=function isc_SampleDataDSWizard_importFileClick(){
    var dataForm=this.dataForm;
    if(this.optionsForm.getValue("file")==null)return;
    this.optionsForm.saveData(function(response,data,request){
        dataForm.setValue("pasteData",data.file);
    });
}
,isc.A.getResults=function isc_SampleDataDSWizard_getResults(newNode,callback,palette){
    this._getResultsCallback=callback;
    if(newNode.wizardDefaults){
        newNode=isc.addProperties({},newNode);
        newNode.wizardDefaults=isc.addProperties({},newNode.wizardDefaults);
    }
    this._paletteNode=newNode;
    var maxUploadFileSize=this._paletteNode.wizardDefaults.maxUploadFileSize;
    if(maxUploadFileSize!=null&&isc.isA.String(maxUploadFileSize)){
        maxUploadFileSize=maxUploadFileSize.asDataSizeBytes();
        if(maxUploadFileSize==0)maxUploadFileSize=null;
    }
    if(maxUploadFileSize!=null){
        var fields=[isc.addProperties({},this.pasteDataFieldDefaults,{length:maxUploadFileSize})];
        this.dataForm.setFields(fields);
        this.optionsForm.getItem("import").setMaxFileSize(maxUploadFileSize,this.importFileTooLargeMessage);
    }
}
);
isc.B._maxIndex=isc.C+12;

isc.ClassFactory.defineClass("UploadSampleDataItem","CanvasItem");
isc.A=isc.UploadSampleDataItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="*";
isc.A.canvasConstructor=isc.DynamicForm;
isc.A.canvasProperties={
        autoDraw:false,
        dataSource:"SCUploadSaveFile",
        width:"100%",
        numCols:2,
        colWidths:[250,"*"],
        init:function(){
            var disabledImportButton=(this.disabledImportButton==null?true:this.disabledImportButton);
            this.fields=[
                {
                    name:"file",
                    editorType:isc.TFileItem||isc.FileItem,
                    showTitle:false,
                    width:"*",
                    multiple:false,
                    validators:this.fileValidators,
                    accept:this.accept
                },
                {
                    name:"file_dir",
                    type:"HiddenItem",
                    defaultValue:"[READ_ONLY]"
                },
                {
                    name:"importButton",
                    type:"button",
                    title:"Import",
                    startRow:false,
                    disabled:disabledImportButton,
                    click:function(){
                        this.form.creator.importFileClick();
                    }
                }
            ];
            this.Super("init",arguments);
        }
    };
isc.B.push(isc.A.enableImport=function isc_UploadSampleDataItem_enableImport(){
        this.disabledImportButton=false;
        this.canvas.getItem("importButton").enable();
    }
,isc.A.setAccept=function isc_UploadSampleDataItem_setAccept(accept){
        this.accept=accept;
        this.setCanvas(null);
    }
,isc.A.setMaxFileSize=function isc_UploadSampleDataItem_setMaxFileSize(size,errorMessage){
        this.fileValidators=null;
        if(size!=null&&size>0){
            this.fileValidators=[
                {type:"maxFileSize",maxFileSize:size,errorMessage:errorMessage}
            ];
        }
        this.setCanvas(null);
    }
,isc.A.createCanvas=function isc_UploadSampleDataItem_createCanvas(){
        return this.createAutoChild("canvas",{
            disabledImportButton:this.disabledImportButton,
            accept:this.accept,
            fileValidators:this.fileValidators
        });
    }
,isc.A.importFileClick=function isc_UploadSampleDataItem_importFileClick(){
        var _this=this;
        if(this.canvas.getValue("file")==null)return;
        this.canvas.saveData(function(response,data,request){
            if(_this.importedData)_this.importedData(data.file,data.file_filename);
            _this.canvas.clearValues();
        });
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("BasicFieldsDSWizard");
isc.BasicFieldsDSWizard.addProperties({
})
isc.A=isc.BasicFieldsDSWizard.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.showDSEditor=function isc_BasicFieldsDSWizard_showDSEditor(){
    var node=this._paletteNode;
    node.wizardDefaults.dsEditorProperties={
        editMockData:false
    };
    if(this.autoAddPK)node.wizardDefaults.dsEditorProperties.autoAddPK=(this.autoAddPK!="false");
    if(this.requirePK)node.wizardDefaults.dsEditorProperties.requirePK=(this.requirePK!="false");
    if(this.canSelectPrimaryKey)node.wizardDefaults.dsEditorProperties.canSelectPrimaryKey=(this.canSelectPrimaryKey!="false");
    if(this.canAddChildSchema)node.wizardDefaults.dsEditorProperties.canAddChildSchema=(this.canAddChildSchema!="false");
    if(this.showMoreButton)node.wizardDefaults.dsEditorProperties.showMoreButton=(this.showMoreButton!="false");
    if(this.showLegalValuesButton)node.wizardDefaults.dsEditorProperties.showLegalValuesButton=(this.showLegalValuesButton.toLowerCase()=="true");
    this.fireCallback(this._getResultsCallback,"node",[node])
}
,isc.A.getResults=function isc_BasicFieldsDSWizard_getResults(newNode,callback,palette){
    this._getResultsCallback=callback;
    if(newNode.wizardDefaults){
        newNode=isc.addProperties({},newNode);
        newNode.wizardDefaults=isc.addProperties({},newNode.wizardDefaults);
    }
    var dsProperties=isc.addProperties({},{
        _constructor:this.targetDSType
    });
    newNode.defaults=dsProperties;
    this._paletteNode=newNode;
    this.delayCall("showDSEditor");
}
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("SampleDataSourceDSWizard","Window");
isc.A=isc.SampleDataSourceDSWizard.getPrototype();
isc.A.autoCenter=true;
isc.A.autoParent=false;
isc.A.showCloseButton=true;
isc.A.showMinimizeButton=false;
isc.A.isModal=true;
isc.A.showModalMask=true;
isc.A.title="Add Sample DataSources";
isc.A.labelContent="This will add a set of interconnected sample DataSources representing a simple "+
        "order fulfillment database.<br><br>"+
        "You can freely modify these DataSources and their data after adding them to your project."
;

isc.A=isc.SampleDataSourceDSWizard.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_SampleDataSourceDSWizard_initWidget(){
        this.Super("initWidget",arguments);
        this.setWidth(470);
        this.setHeight(170);
        var that=this;
        var ok=isc.Button.create({
            title:"OK",
            click:function(){
                that.builder.addSampleDataSources(true);
                that.close();
            }
        });
        var cancel=isc.Button.create({
            title:"Cancel",
            click:function(){
                that.close();
            }
        });
        var buttonLayout=isc.HLayout.create({
            padding:5,
            membersMargin:10,
            align:"right",
            members:[cancel,ok]
        });
        var label=isc.Label.create({
            width:"100%",
            padding:15,
            contents:this.labelContent
        });
        this.addItem(label);
        this.addItem(buttonLayout);
    }
,isc.A.showDSEditor=function isc_SampleDataSourceDSWizard_showDSEditor(){
    }
,isc.A.getResults=function isc_SampleDataSourceDSWizard_getResults(newNode,callback,palette){
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("DataImportDialog","Dialog");
isc.A=isc.DataImportDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.isModal=true;
isc.A.title="Import Data";
isc.A.width=700;
isc.A.height=490;
isc.A.padding=0;
isc.A.uploaderDefaults={
        showFilePickerForm:true,
        width:"100%",
        gridProperties:{
            defaultHeight:340
        },
        uploadReply:function(data){
            this.Super("uploadReply",arguments);
            var saveTestDataCheckboxField={
                type:"checkbox",
                name:"save_cb",
                title:"Save as test data (so you can re-import any time)."
            };
            if(!this.checkForData){
                saveTestDataCheckboxField.value=true;
            }else{
                saveTestDataCheckboxField.title+=
                    "<font color='red'>WARNING: will overwrite existing test data file and should not be checked.</font>";
            }
            var wipeDataCheckboxField={
                type:"checkbox",
                name:"wipe_cb",
                title:"Wipe existing data before import"
            };
            this.checkForDataForm=isc.DynamicForm.create({
                titleWidth:0,
                fields:[saveTestDataCheckboxField,wipeDataCheckboxField]
            });
            var dialog=this.creator.body;
            var oldReflowMethod=dialog.reflowNow;
            dialog.reflowNow=function(){
                this.Super("reflowNow",arguments);
                dialog.scrollToBottom();
                dialog.reflowNow=oldReflowMethod;
            }
            this.addMember(this.checkForDataForm,this.getMembers().indexOf(this.grid)+1);
        },
        commit:function(){
            if(this.checkForDataForm.getValue("save_cb")){
                this.storeTestData();
            }
            if(this.checkForDataForm.getValue("wipe_cb")){
                var _this=this;
                isc.confirm("Really remove all existing records from this DataSource? This operation cannot be undone.",
                    function(value){
                        if(value){
                            var ds=isc.DataSource.getDataSource(_this.grid.dataSource);
                            var batchUploadDs=isc.DataSource.getDataSource(_this.batchUploadDSName);
                            batchUploadDs.performCustomOperation("wipeData",{dsName:ds.ID},function(){
                                ds.updateCaches({invalidateCache:true});
                                _this.Super("commit",arguments);
                            },{});
                        }else{
                            _this.Super("commit",arguments);
                        }
                    });
            }else{
                this.Super("commit",arguments);
            }
        },
        setCheckForData:function(data){
            this.checkForData=data;
            if(this.checkForDataForm&&data){
                var saveTestDataCheckboxField=this.checkForDataForm.getField("save_cb");
                saveTestDataCheckboxField.title+=
                    "<font color='red'>WARNING: will overwrite existing test data file and should not be checked.</font>";
                saveTestDataCheckboxField.setValue(false);
            }
        },
        cleanup:function(){
            this.Super("cleanup",arguments);
            this.checkForDataForm.destroy();
            this.checkForDataForm=null;
            this.creator.close();
        }
    };
isc.A.uploaderConstructor="BatchUploader";
isc.A.helpMessageDefaults={
        contents:"Supported data formats are: "+
            "<ul>"+
                "<li> CSV or TSV (comma- or tab-separated values)"+
                "<li> JSON - an Array of Objects"+
                "<li> XML"+
            "</ul>"+
            "All data formats are described in more detail in the documentation under \"Test Data\" "+
            "<a href=\"http://www.smartclient.com/docs/release/a/b/c/go.html#group..testData\" target=\"_blank\">(click for docs at SmartClient.com)</a>"+
            "<p>Either DataSource field names or field titles may be used."
    };
isc.A.helpMessageConstructor="HTMLFlow";
isc.B.push(isc.A.initWidget=function isc_DataImportDialog_initWidget(){
        this.Super("initWidget",arguments);
        var dialog=this;
        this.helpMessage=this.createAutoChild("helpMessage");
        this.uploader=this.createAutoChild("uploader",{
            uploadDataSource:this.targetDataSource,
            dataFormat:"auto"
        });
        this.addItem(this.helpMessage);
        this.addItem(this.uploader);
        var dsName=this.targetDataSource.ID||this.targetDataSource;
        this.title="Import Data to "+dsName;
        var dataImportDialog=this;
        isc.DMI.callBuiltin({
            appID:"isc_builtin",
            className:"com.isomorphic.tools.BuiltinRPC",
            methodName:"checkForTestData",
            arguments:[{dsName:dsName}],
            callback:function(dsResponse,data,dsRequest){
                dataImportDialog.uploader.setCheckForData(data);
            }
        });
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("SchemaViewer","VLayout");
isc.A=isc.SchemaViewer;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getTreeFromService=function isc_c_SchemaViewer_getTreeFromService(service){
    return isc.Tree.create({
        service:service,
        nameProperty:"_nodeName",
        titleProperty:"name",
        loadChildren:function(parent){
            if(this.isLoaded(parent))return;
            if(parent==this.root&&isc.isA.WebService(this.service)){
                var operations=this.service.getOperations();
                operations.setProperty("type","Operation");
                this.addList(operations,parent);
            }else if(parent==this.root&&isc.isA.SchemaSet(this.service)){
                var schemaSet=this.service;
                for(var i=0;i<schemaSet.schema.length;i++){
                    this.add(this.getSchemaNode(schemaSet.schema[i]),
                             this.root);
                }
            }else if(parent.inputMessage){
                var message=this.getMessageNode(parent,true);
                if(message!=null)this.add(message,parent);
                message=this.getMessageNode(parent,false);
                if(message!=null)this.add(message,parent);
            }else if(parent.isComplexType){
                var parentDS=parent.liveSchema;
                for(var fieldName in parentDS.getFields()){
                    var field=parentDS.getField(fieldName);
                    if(!parentDS.fieldIsComplexType(fieldName)){
                        this.add(isc.addProperties({},field),parent);
                    }else{
                        var childDS=parentDS.getSchema(field.type);
                        var node=this.getSchemaNode(childDS,field.name,field.xmlMaxOccurs);
                        this.add(node,parent);
                    }
                }
            }
            this.setLoadState(parent,isc.Tree.LOADED);
        },
        isFolder:function(node){
            return(node==this.root||node.inputMessage||node.isComplexType);
        },
        getSchemaNode:function(childDS,fieldName,maxOccurs){
            var schemaSet=isc.SchemaSet.get(childDS.schemaNamespace),
                field=childDS.getField(fieldName),
                node={
                name:fieldName||childDS.tagName||childDS.ID,
                type:childDS.ID,
                isComplexType:true,
                xmlMaxOccurs:maxOccurs,
                liveSchema:childDS,
                namespace:childDS.schemaNamespace,
                location:schemaSet?schemaSet.location:null
            };
            return node;
        },
        getMessageNode:function(operation,isInput){
            var messageDS=isInput?this.service.getRequestMessage(operation):
                                      this.service.getResponseMessage(operation);
            if(!messageDS)return;
            return{
                name:messageDS.ID,
                type:messageDS.ID,
                isComplexType:true,
                liveSchema:messageDS
            };
        }
    });
}
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.SchemaViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.showTestUI=true;
isc.A.operationIcon="[SKINIMG]/SchemaViewer/operation.png";
isc.A.complexTypeIcon="[SKINIMG]/SchemaViewer/complexType.gif";
isc.A.simpleTypeIcon="[SKINIMG]/SchemaViewer/simpleType.png";
isc.B.push(isc.A.setWsdlURL=function isc_SchemaViewer_setWsdlURL(url){
    this.wsdlURL=url;
    this.urlForm.setValue("url",url);
}
,isc.A.getWsdlURLs=function isc_SchemaViewer_getWsdlURLs(){
    var loadedServiceURNs=isc.WebService.services.getProperty("serviceNamespace"),
        defaultWSDLs=this.wsdlURLs;
    if(defaultWSDLs==null&&loadedServiceURNs.length==0)return;
    if(defaultWSDLs==null)defaultWSDLs=[];
    defaultWSDLs.addList(loadedServiceURNs);
    return defaultWSDLs;
}
,isc.A.initWidget=function isc_SchemaViewer_initWidget(){
    this.Super("initWidget",arguments);
    this.createChildren();
}
,isc.A.createChildren=function isc_SchemaViewer_createChildren(){
    var wsdlURLs=this.getWsdlURLs();
    this.addAutoChild("urlForm",{
        numCols:4,
        colWidths:[100,"*",100,100],
        itemHoverWidth:300,
        saveOnEnter:true,
        saveData:function(){
            this.creator.fetchSchema();
        },
        items:[
            {name:"url",title:"WSDL",width:"*",defaultValue:this.wsdlURL,
                editorType:(wsdlURLs!=null?"ComboBoxItem":"TextItem"),
                autoComplete:(wsdlURLs!=null?"smart":null),
                showAllOptions:true,textMatchStyle:"substring",
                valueMap:wsdlURLs
            },
            {type:"submit",title:"Show Messages",
              startRow:false,colSpan:1,endRow:false,width:"*"
            },
            {showTitle:false,startRow:false,width:"*",
              formItemType:"pickTree",
              shouldSaveValue:false,
              buttonProperties:{
                unselectedTitle:"Download",
                itemSelected:function(item){
                    this.canvasItem.form.creator.download(item.name);
                    return false;
                }
              },
              valueTree:isc.Tree.create({
                  root:{name:"download",title:"Download",children:[
                          {name:"js",title:"as JS"},
                          {name:"xml",title:"as XML"}
                        ]}
              }),
              icons:[
                {src:"[SKIN]/actions/help.png",width:16,height:16,
                  prompt:"You can use the <b>Download</b> feature to download a SmartClient"
                         +" WebService definition for the specified WSDL file in either XML"
                         +" or JS format.  <p>You can achieve the same result by calling"
                         +" <i>XMLTools.loadWSDL()</i> or by using the <code>&lt;isomorphic"
                         +":loadWSDL&gt;</code> JSP tag, however, for non-Java backends or"
                         +" for production use, a .js file should be obtained from this"
                         +" interface and loaded via &lt;SCRIPT SRC=&gt; either individually"
                         +" or combined with other files.  <p>See the reference documentation"
                         +" for details.",
                  click:"isc.say(this.prompt)"
                }
              ]
            }
        ]
    },isc.DynamicForm);
    this.addMember(isc.VLayout.create({
        autoDraw:false,
        members:[
            isc.HLayout.create({
                autoDraw:false,
                members:[
                    this.addAutoChild("treeGrid",{
                        fields:[
                            {treeField:true},
                            {name:"type",title:"Type",width:140},
                            {name:"xmlMaxOccurs",title:"#",width:35},
                            {name:"namespace",title:"NS",width:35,showHover:true,
                             hoverHTML:function(record,value){return"<NOBR>"+value+"<NOBR>"}},
                            {name:"location",title:"URL",width:35,showHover:true,
                             hoverHTML:function(record,value){return"<NOBR>"+value+"<NOBR>"},
                             recordClick:function(viewer,record){
                                 viewer.creator.setWsdlURL(record.location);
                                 viewer.creator.fetchSchema();
                             }
                            }
                        ],
                        nodeClick:function(grid,node,rowNum){
                            if(this.creator.showTestUI){
                                this.creator.updateInputStack(node);
                            }
                        },
                        getIcon:function(node){
                            if(node.type=="Operation")return this.creator.operationIcon;
                            else if(node.isComplexType)return this.creator.complexTypeIcon;
                            else return this.creator.simpleTypeIcon;
                        },
                        showResizeBar:true
                    },isc.TreeGrid),
                    isc.VLayout.create({
                        visibility:(this.showTestUI?"inherit":"hidden"),
                        members:[
                            this.addAutoChild("inputStack",{
                                overflow:"auto",
                                visibilityMode:"multiple",
                                autoDraw:false,
                                sections:[
                                    {showHeader:true,title:"Input Message (Body)",
                                     items:[
                                        this.addAutoChild(
                                            "inputBodyForm",
                                            {useFlatFields:true},
                                            isc.DynamicForm)
                                     ]
                                    }
                                ]
                            },isc.SectionStack),
                            isc.IButton.create({
                                creator:this,
                                autoDraw:false,
                                title:"Invoke",
                                click:function(){
                                    this.creator.updateResponseTree();
                                }
                            })
                        ]
                    })
                ]
            }),
            this.addAutoChild("responseStack",{
                visibility:(this.showTestUI?"inherit":"hidden"),
                autoDraw:false,
                visibilityMode:"multiple",
                sections:[
                    this.getResponseSectionConfig()
                ]
            },
            isc.SectionStack)
        ]
    })
    );
}
,isc.A.download=function isc_SchemaViewer_download(format){
    var url=this.urlForm.getValue("url");
    if(!url){
        isc.warn("Please type in a WSDL URL");
        return;
    }
    var fileName=url.replace(/(.*\/)?(.*)/,"$2")
                      .replace(/(.*?)\?.*/,"$1")
                      .replace(/(.*)\..*/,"$1")
                   +"."+format;
    isc.DMI.callBuiltin({
        methodName:"downloadWSDL",
        arguments:[url,format,fileName],
        requestParams:{
            showPrompt:false,
            useXmlHttpRequest:false,
            timeout:0
        }
    });
}
,isc.A.fetchSchema=function isc_SchemaViewer_fetchSchema(){
    var url=this.urlForm.getValue("url");
    if(url==null||url=="")return;
    if(isc.WebService.get(url))return this.fetchSchemaReply(isc.WebService.get(url));
    isc.RPCManager.addClassProperties({
        defaultPrompt:"Loading WSDL Schema",
        showPrompt:true
    })
    isc.xml.loadWSDL(url,{target:this,methodName:"fetchSchemaReply"},null,true,
                     {captureXML:true});
}
,isc.A.fetchSchemaReply=function isc_SchemaViewer_fetchSchemaReply(service){
    isc.RPCManager.addClassProperties({
        defaultPrompt:"Contacting Server..."
    });
    this.service=service;
    delete this.operationName;
    var theTree=isc.SchemaViewer.getTreeFromService(service);
    this.treeGrid.setData(theTree);
    this.clearInputStack();
    this.clearResponseTree();
}
,isc.A.clearInputStack=function isc_SchemaViewer_clearInputStack(){
    var stack=this.inputStack,
        sectionsArr=stack.sections.duplicate(),
        headerSections=[];
    for(var i=0;i<sectionsArr.length;i++){
        if(sectionsArr[i].isHeaderSection)stack.removeSection(sectionsArr[i]);
    }
    this.inputBodyForm.hide();
    this.inputBodyForm.clearValues();
}
,isc.A.updateInputStack=function isc_SchemaViewer_updateInputStack(node){
    this.clearInputStack();
    var operationNode=node;
    while(operationNode.type!="Operation"){
        operationNode=this.treeGrid.data.getParent(operationNode);
    }
    if(!operationNode)return;
    var operationName=operationNode.name;
    this.operationName=operationName;
    var inputHeaderSchema=this.service.getInputHeaderSchema(operationName);
    if(inputHeaderSchema!=null){
        var index=0;
        for(var schemaName in inputHeaderSchema){
            var schema=inputHeaderSchema[schemaName],
                editForm;
            if(isc.isA.DataSource(schema)){
                editForm=isc.DynamicForm.create({
                    useFlatFields:true,
                    dataSource:schema
                })
            }else{
                editForm=isc.DynamicForm.create({
                    _singleField:true,
                    fields:[schema]
                })
            }
            this.inputStack.addSection({showHeader:true,isHeaderSection:true,
                              schemaName:schemaName,
                              title:"Header: "+schemaName,
                              items:[editForm]
            },index);
            index+=1;
        }
    }
    var inputDS=this.service.getInputDS(operationName);
    this.inputBodyForm.setDataSource(inputDS);
    if(!this.inputBodyForm.isVisible())this.inputBodyForm.show();
}
,isc.A.updateResponseTree=function isc_SchemaViewer_updateResponseTree(){
    if(this.operationName==null)return;
    var params=this.inputBodyForm.getValues(),
        headerParams,
        service=this.service;
    for(var i=0;i<this.inputStack.sections.length;i++){
        var section=this.inputStack.sections[i];
        if(!section.isHeaderSection)continue;
        if(headerParams==null)headerParams={};
        var editForm=section.items[0];
        if(editForm._singleField){
            headerParams[section.schemaName]=editForm.getValue(editForm.getItem(0));
        }else{
            headerParams[section.schemaName]=editForm.getValues();
        }
    }
    if(this.logIsDebugEnabled())
        this.logDebug("operation:"+this.operationName+
        ", body params:"+this.echoAll(params)+", headerParams:"+this.echoAll(headerParams));
    service.callOperation(this.operationName,
                            params,null,
                            this.getID()+".setResponseTreeDoc(xmlDoc, rpcResponse, wsRequest)",
                            {willHandleError:true,
                             headerData:headerParams,
                             useFlatFields:true,useFlatHeaderFields:true}
                            );
}
,isc.A.getResponseSectionConfig=function isc_SchemaViewer_getResponseSectionConfig(){
    return{expanded:true,title:"Service Response",
             headerControls:[
                 isc.LayoutSpacer.create(),
                 isc.IButton.create({
                    width:200,
                    title:"Generate Sample Response",
                    creator:this,
                    click:function(){
                        if(!this.creator.operationName)return;
                        var data=this.creator.service.getSampleResponse(this.creator.operationName);
                        data=isc.XMLTools.parseXML(data);
                        this.creator.setResponseTreeDoc(data);
                        this.creator.responseStack.setSectionTitle(0,"Service Response [Generated Sample]");
                        return false;
                    },
                    height:16,layoutAlign:"center",extraSpace:4,autoDraw:false
                 }),
                 isc.IButton.create({
                    width:200,
                    title:"Generate Sample Request",
                    creator:this,
                    click:function(){
                        if(!this.creator.operationName)return;
                        var data=this.creator.service.getSampleRequest(this.creator.operationName);
                        data=isc.XMLTools.parseXML(data);
                        this.creator.showSampleRequest(data);
                        return false;
                    },
                    height:16,layoutAlign:"center",extraSpace:4,autoDraw:false
                 })
             ],
             items:[
             ]
            }
}
,isc.A.setResponseTreeDoc=function isc_SchemaViewer_setResponseTreeDoc(xmlDoc,rpcResponse,wsRequest){
    if(rpcResponse&&rpcResponse.status<0){
        var faultStrings;
        if(rpcResponse.httpResponseCode==500){
            faultStrings=xmlDoc.selectNodes("//faultstring");
            if(faultStrings!=null)faultStrings=isc.XML.toJS(faultStrings);
            if(faultStrings.length==0)faultStrings=null;
        }
        if(faultStrings){
            isc.warn("<b>Server Returned HTTP Code 500 (Internal Error)</b>"
                    +(faultStrings&&faultStrings.length>0?
                        ("<br><br>"+faultStrings.join("<br>")):""));
        }else{
            isc.RPCManager.handleError(rpcResponse,wsRequest);
        }
        return;
    }
    this.logInfo("showing a tree response");
    if(this.logIsDebugEnabled())this.logDebug("response data:"+this.echoAll(xmlDoc));
    this.clearSampleRequest();
    this.xmlDoc=xmlDoc;
    var domTree=isc.DOMTree.create({rootElement:xmlDoc.documentElement});
    if(this.responseTree){
        this.responseTree.setData(domTree);
    }else{
        this.addAutoChild("responseTree",{data:domTree},isc.DOMGrid)
    }
    if(!this.showingResponseTree){
        this.responseStack.removeSection(0);
        this.responseStack.addSection(
            isc.addProperties(
                this.getResponseSectionConfig(),
                {items:[this.responseTree]}
            ),
            0
        );
    }
    this.showingResponseTree=true;
}
,isc.A.clearResponseTree=function isc_SchemaViewer_clearResponseTree(){
    this.clearSampleRequest();
    if(!this.showingResponseTree)return;
    this.responseStack.removeSection(0);
    this.responseStack.addSection(this.getResponseSectionConfig())
    delete this.showingResponseTree;
}
,isc.A.showSampleRequest=function isc_SchemaViewer_showSampleRequest(data){
    this.logInfo("showing a sample request");
    if(this.logIsDebugEnabled())this.logDebug("sample request data:"+this.echoAll(data));
    var domTree=isc.DOMTree.create({rootElement:data.documentElement});
    if(!this.showingSampleRequest){
        this.responseStack.addSection({
            isSampleRequest:true,
            expanded:true,resizable:true,
            title:"Generated Sample Service Request",
            items:[
                this.addAutoChild("requestTree",{data:domTree},isc.DOMGrid)
            ]
        });
    }else{
        this.requestTree.setData(domTree);
    }
    this.showingSampleRequest=true
}
,isc.A.clearSampleRequest=function isc_SchemaViewer_clearSampleRequest(){
    if(this.showingSampleRequest){
        for(var i=0;i<this.responseStack.sections.length;i++){
            if(this.responseStack.sections[i].isSampleRequest){
                this.responseStack.removeSection(i);
                break;
            }
        }
    }delete this.showingSampleRequest;
}
);
isc.B._maxIndex=isc.C+15;

isc.ClassFactory.defineClass("DatabaseBrowser","Window");
isc.A=isc.DatabaseBrowser.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.orientation="vertical";
isc.A.title="Database Browser";
isc.A.width="90%";
isc.A.height="90%";
isc.A.isModal=true;
isc.A.showModalMask=true;
isc.A.canDragResize=true;
isc.A.shouldAutoFetchData=true;
isc.A.serverType="sql";
isc.A.schemaTreeConstructor="ListGrid";
isc.A.schemaTreeDefaults={
        autoParent:"schemaView",
        dbBrowser:this.creator,
        dataSource:isc.DataSource.create({
            addGlobalId:false,
            ID:"isc_dbBrowserSchemaTreeDS",
            clientOnly:true,
            fields:[
                {name:"name",title:"Name",primaryKey:true},
                {name:"type",title:"Type",width:60,valueMap:["table","view"]}
            ]
        }),
        showFilterEditor:true,
        filterOnKeypress:true,
        canExpandRecords:true,
        detailDefaults:{
            _constructor:"ListGrid",
            autoFitData:"vertical",
            autoFitMaxRecords:8,
            showResizeBar:true
        },
        getExpansionComponent:function(record){
            var component=this.createAutoChild("detail",{
                sortField:"primaryKey",
                sortDirection:"descending",
                defaultFields:[
                    {name:"name",title:"Column",formatCellValue:function(value,record){
                        if(record.primaryKey)return"<b>"+value+"</b>";
                        return value;
                    }},
                    {name:"type",title:"Type",width:50},
                    {name:"length",title:"Length",width:45},
                    {name:"primaryKey",title:"PK",type:"boolean",showIf:"false",width:22}
                ]
            });
            isc.DMI.call("isc_builtin","com.isomorphic.tools.BuiltinRPC","getFieldsFromTable",
                record.name,this.schema,this.serverType,this.creator.dbName,
                function(rpcResponse,data){
                component.setData(data);
            });
            return component;
        },
        selectionChanged:function(record,state){
            if(state){
                var objectName=record.name;
                if(objectName&&objectName!=this.creator._selectedTable){
                    this.creator.getDataSourceFromTable(objectName);
                    this.creator.populateDataViewHeader();
                }
            }
        }
    };
isc.A.schemaRefreshButtonDefaults={
        _constructor:"Img",
        size:16,
        src:"[SKIN]/actions/refresh.png",
        click:"this.creator.getDatabaseTables()"
    };
isc.A.databaseListConstructor="ListGrid";
isc.A.databaseListDefaults={
        height:150,
        autoParent:"schemaView",
        dataSource:isc.DataSource.create({
            addGlobalId:false,
            ID:"isc_dbBrowserDBListDS",
            clientOnly:true,
            fields:[
                {name:"dbName",title:"Name",primaryKey:true},
                {name:"dbStatus",title:"Status"},
                {name:"dbProductName",title:"Product Name"},
                {name:"dbProductVersion",title:"Product Version"}
            ]
        }),
        defaultFields:[
            {name:"dbName"},
            {name:"dbStatus"}
        ],
        sortField:"dbName",
        showFilterEditor:true,
        filterOnKeypress:true,
        canDragSelectText:true,
        selectionChanged:function(record,state){
            if(state){
                this.creator.clearSchemaTree();
                this.creator.dbName=record.dbName;
                this.creator.getDatabaseTables();
            }
        },
        canHover:true,
        cellHoverHTML:function(record){
            if(!this.hoverDV)this.hoverDV=isc.DetailViewer.create({dataSource:this.dataSource,width:200,autoDraw:false});
            this.hoverDV.setData(record);
            return this.hoverDV.getInnerHTML();
        }
    };
isc.A.dbListConfigButtonDefaults={
        _constructor:"Img",
        size:16,
        src:"database_gear.png",
        click:"this.creator.configureDatabases()"
    };
isc.A.dbListRefreshButtonDefaults={
        _constructor:"Img",
        size:16,
        src:"[SKIN]/actions/refresh.png",
        click:"this.creator.getDefinedDatabases()"
    };
isc.A.dataGridConstructor="ListGrid";
isc.A.dataGridDefaults={
        canDragSelectText:true,
        autoFitFieldWidths:true,
        autoFitWidthApproach:"title",
        autoParent:"dataView",
        skipNullDataSourceCheck:true,
        dataArrived:function(){
            if(this.showFilterEditor!=false){
                this.setShowFilterEditor(true);
            }
        }
    };
isc.A.navToolbarConstructor="HLayout";
isc.A.navToolbarDefaults={
        height:22,
        layoutMargin:10,
        membersMargin:10,
        autoParent:"outerLayout"
    };
isc.A.showSelectButton=true;
isc.A.selectButtonConstructor="Button";
isc.A.selectButtonDefaults={
        title:"Next >",
        disabled:true,
        autoParent:"navToolbar"
    };
isc.A.outerLayoutDefaults={
         _constructor:isc.VLayout,
         width:"100%",height:"100%",
         autoSize:true,autoDraw:true,
         autoParent:"body"
    };
isc.A.innerLayoutDefaults={
         _constructor:isc.HLayout,
         width:"100%",height:"100%",
         autoDraw:true,
         autoParent:"outerLayout"
    };
isc.A.showSchemaView=true;
isc.A.schemaViewDefaults={
         _constructor:isc.SectionStack,
         visibilityMode:"multiple",
         autoParent:"innerLayout"
    };
isc.A.showDataView=true;
isc.A.dataViewDefaults={
         _constructor:isc.SectionStack,
         width:"65%",height:"100%",
         autoParent:"innerLayout"
    }
;
isc.B.push(isc.A.configureDatabases=function isc_DatabaseBrowser_configureDatabases(){
        var _this=this;
        var dbConsole=isc.DBConfigurator.showWindow({
            width:this.getVisibleWidth()-50,
            height:this.getVisibleHeight()-50,
            autoCenter:true,
            isModal:true,
            closeClick:function(){
                this.destroy();
                _this.getDefinedDatabases();
            }
        });
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.DatabaseBrowser.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_DatabaseBrowser_initWidget(){
    this.Super("initWidget",arguments);
    this.title="Database Browser - "+this.serverType.toUpperCase();
    this.createChildren();
}
,isc.A.createChildren=function isc_DatabaseBrowser_createChildren(){
    this.Super("createChildren");
    this.body.hPolicy="fill";
    this.body.vPolicy="fill";
    this.addAutoChild("outerLayout");
    this.addAutoChild("innerLayout",null,null,this.outerLayout);
    this.addAutoChild("schemaView",{showResizeBar:this.showDataView},null,this.innerLayout);
    this.databaseList=this.createAutoChild("databaseList");
    this.dbListConfigButton=this.createAutoChild("dbListConfigButton");
    this.dbListRefreshButton=this.createAutoChild("dbListRefreshButton");
    if(this.serverType=="sql"){
        this.schemaView.addSection({
            title:"Databases",showHeader:true,expanded:true,hidden:false,
            items:[this.databaseList],
            controls:[this.dbListConfigButton,this.dbListRefreshButton]
        });
    }
    this.addAutoChild("dataView",null,null,this.innerLayout);
    this.dataView.addSection({autoDraw:true,showHeader:true,expanded:true,hidden:false,
        title:"No table selected"
    });
    this.dataStack=this.dataView.sections[0];
    this.schemaTree=this.createAutoChild("schemaTree");
    this.schemaRefreshButton=this.createAutoChild("schemaRefreshButton");
    this.schemaView.addSection({
        title:"Tables & Views",
        showHeader:true,expanded:true,hidden:false,
        items:[this.schemaTree],
        controls:[this.schemaRefreshButton]
    });
    var dbBrowser=this;
    this.dataGrid=this.createAutoChild("dataGrid");
    this.dataStack.addItem(this.dataGrid);
    this.addAutoChild("navToolbar",null,this.outerLayout);
    this.navToolbar.addMember(isc.LayoutSpacer.create());
    this.addAutoChild("selectButton",{
        click:function(){
            dbBrowser.hide();
            dbBrowser._paletteNode.defaults=dbBrowser.getGeneratedDataSourceObject();
            dbBrowser.fireCallback(dbBrowser._getResultsCallback,"node",
                [dbBrowser._paletteNode])
        }
    });
    if(this.shouldAutoFetchData){
        this.delayCall("getDefinedDatabases");
    }
}
,isc.A.getDefinedDatabases=function isc_DatabaseBrowser_getDefinedDatabases(){
    if(this.serverType=="hibernate"){
        this.databaseList.hide();
        this.dbName=null;
        this.getDatabaseTables();
    }else{
        isc.DMI.call({
            appID:"isc_builtin",
            className:"com.isomorphic.tools.AdminConsole",
            methodName:"getDefinedDatabases",
            arguments:[true],
            callback:this.getID()+".populateDatabaseList(data)",
            requestParams:{
                showPrompt:true,
                promptStyle:"dialog",
                prompt:"Loading available databases..."
            }
        });
    }
}
,isc.A.getDatabaseTables=function isc_DatabaseBrowser_getDatabaseTables(){
    var dbBrowser=this;
    var includeList=this.includeSubstring;
    if(includeList&&!isc.isAn.Array(includeList))includeList=[includeList];
    var excludeList=this.excludeSubstring;
    if(excludeList&&!isc.isAn.Array(excludeList))excludeList=[excludeList];
    isc.DMI.call({
        appID:"isc_builtin",
        className:"com.isomorphic.tools.BuiltinRPC",
        methodName:"getTables",
        arguments:[this.serverType,this.dbName,true,true,this.catalog,this.schema,
                    includeList,excludeList],
        callback:function(data){
            dbBrowser.populateSchemaTree(data.data);
        },
        requestParams:{
            showPrompt:true,
            promptStyle:"dialog",
            prompt:"Loading schema..."
        }
    });
}
,isc.A.populateDatabaseList=function isc_DatabaseBrowser_populateDatabaseList(data){
    this.databaseList.dataSource.setCacheData(data);
    var crit={dbStatus:"OK"};
    this.databaseList.invalidateCache();
    this.databaseList.setFilterEditorCriteria(crit);
    this.databaseList.filterData(crit);
}
,isc.A.clearSchemaTree=function isc_DatabaseBrowser_clearSchemaTree(data){
    this.schemaTree.setData([]);
    this._selectedTable=null;
    this.populateDataViewHeader();
}
,isc.A.populateSchemaTree=function isc_DatabaseBrowser_populateSchemaTree(data){
    for(var i=0;i<data.length;i++){
        data[i].name=data[i].TABLE_NAME;
        data[i].type=data[i].TABLE_TYPE.toLowerCase();
        data[i].isFolder=true;
        data[i].customIcon="[SKIN]../DatabaseBrowser/data.png";
    }
    this.schemaTree.dataSource.setCacheData(data);
    this.schemaTree.invalidateCache();
    this.schemaTree.filterData();
    if(this.schemaTreeTitle){
        this.populateSchemaTreeHeader();
    }
    this.tablesRetrieved=true;
}
,isc.A.populateSchemaTreeHeader=function isc_DatabaseBrowser_populateSchemaTreeHeader(){
}
,isc.A.populateDataViewHeader=function isc_DatabaseBrowser_populateDataViewHeader(){
    if(this._selectedTable){
        this.dataGridTitle="Data from table "+this._selectedTable;
        this.dataGrid.setShowHeader(true);
    }else{
        this.dataGridTitle="No table selected";
        this.dataGrid.setDataSource(null);
        this.dataGrid.setFields([{name:"placeholder",title:" "}]);
    }
    this.dataStack.setTitle(this.dataGridTitle);
}
,isc.A.getDataSourceFromTable=function(tableName){

    var dbBrowser=this;
    var shouldQuoteTableName=!/^[A-Za-z][0-9A-Za-z_]*$/.test(tableName);
    dbBrowser._selectedTable=tableName;
    if(dbBrowser.selectButton)dbBrowser.selectButton.setDisabled(false);
    isc.DMI.call("isc_builtin","com.isomorphic.tools.BuiltinRPC","getDataSourceJSONFromTable",
        tableName,this.serverType,this.dbName,tableName+"_dbBrowser",
        {quoteTableName:shouldQuoteTableName},
        function(rpcResponse,data){
            var temp="dbBrowser.generatedDataSourceObject = "+data;
            eval(temp);
            var gdsoFields=dbBrowser.generatedDataSourceObject.fields,
                originalFieldsCopy=[];
            for(var i=0;i<gdsoFields.length;i++){
                originalFieldsCopy[i]=isc.addProperties({},gdsoFields[i]);
            }
            isc.addProperties(dbBrowser.generatedDataSourceObject,{
                tableName:tableName,
                quoteTableName:shouldQuoteTableName,
                dbName:dbBrowser.dbName
            });
            dbBrowser.generatedDataSource=isc.DataSource.create(dbBrowser.generatedDataSourceObject);
            dbBrowser.generatedDataSourceObject.fields=originalFieldsCopy;
            if(dbBrowser.showDataView){
                dbBrowser.dataGrid.setDataSource(dbBrowser.generatedDataSource);
                dbBrowser.dataGrid.fetchData();
            }
        });
}
,isc.A.getGeneratedDataSource=function isc_DatabaseBrowser_getGeneratedDataSource(){
    return this.generatedDataSource;
}
,isc.A.getGeneratedDataSourceObject=function isc_DatabaseBrowser_getGeneratedDataSourceObject(){
    return this.generatedDataSourceObject;
}
,isc.A.getResults=function isc_DatabaseBrowser_getResults(newNode,callback,palette){
    this._getResultsCallback=callback;
    this._paletteNode=newNode;
}
);
isc.B._maxIndex=isc.C+13;

isc.ClassFactory.defineClass("HibernateBrowser","Window");
isc.A=isc.HibernateBrowser.getPrototype();
isc.A.orientation="vertical";
isc.A.width="90%";
isc.A.height="90%";
isc.A.isModal=true;
isc.A.showModalMask=true;
isc.A.canDragResize=true;
isc.A.showMappingTree=true;
isc.A.mappingTreeConstructor="TreeGrid";
isc.A.mappingTreeDefaults={
        autoParent:"mappingView",
        showConnectors:true,
        showOpenIcons:false,
        showDropIcons:false,
        customIconProperty:"customIcon",
        fields:[
            {name:"name",title:"Name",width:"60%",showHover:true},
            {name:"type",title:"Type"},
            {name:"primaryKey",title:"PK",type:"boolean",width:"10%"},
            {name:"length",title:"Length",type:"number"}
        ],
        selectionChanged:function(record,state){
            if(state){
                var objectName=this.data.getLevel(record)==1?record.name:
                    this.data.getParent(record).name;
                if(objectName&&objectName!=this.creator._selectedEntity){
                    this.creator.getDataSourceFromMapping(objectName);
                    this.creator.populateDataViewHeader();
                }
            }
        },
        openFolder:function(node){
            if(this.data.getLevel(node)>1){
                return this.Super("openFolder",arguments);
            }
            this.Super("openFolder",arguments);
            var mappingTree=this;
            var className=node.name;
            isc.DMI.call("isc_builtin","com.isomorphic.tools.BuiltinRPC","getBeanFields",
                className,
                function(data){
                    mappingTree.populateFields(node,data.data);
                }
            );
        },
        getValueIcon:function(field,value,record){
            if(record.type=="entity"){
                return null;
            }else{
                return this.Super("getValueIcon",arguments);
            }
        },
        populateFields:function(node,paramData){
            var data=isc.clone(paramData)
            node.children=[];
            for(var i=0;i<data.length;i++){
                data[i].children=[];
                data[i].customIcon="[SKIN]../DatabaseBrowser/column.png";
            }
            this.data.addList(data,node);
        }
    };
isc.A.dataGridConstructor="ListGrid";
isc.A.dataGridDefaults={
    };
isc.A.title="Hibernate Browser";
isc.A.showSelectButton=true;
isc.A.selectButtonConstructor="Button";
isc.A.selectButtonDefaults={
        title:"Next >",
        enabled:false,
        autoParent:"outerLayout"
    };
isc.A.outerLayoutDefaults={
         _constructor:isc.VLayout,
         width:"100%",height:"100%",
         autoSize:true,autoDraw:true,
         autoParent:"body"
    };
isc.A.innerLayoutDefaults={
         _constructor:isc.HLayout,
         width:"100%",height:"100%",
         autoDraw:true,
         autoParent:"outerLayout"
    };
isc.A.showMappingView=true;
isc.A.mappingViewDefaults={
         _constructor:isc.SectionStack,
         autoParent:"innerLayout"
    };
isc.A.showDataView=true;
isc.A.dataViewDefaults={
         _constructor:isc.SectionStack,
         width:"65%",height:"100%",
         autoParent:"innerLayout"
    }
;

isc.A=isc.HibernateBrowser.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_HibernateBrowser_initWidget(){
    this.Super("initWidget",arguments);
    this.createChildren();
}
,isc.A.createChildren=function isc_HibernateBrowser_createChildren(){
    this.Super("createChildren");
    this.body.hPolicy="fill";
    this.body.vPolicy="fill";
    var hbBrowser=this;
    this.addAutoChild("outerLayout");
    this.addAutoChild("innerLayout",null,null,this.outerLayout);
    this.addAutoChild("mappingView",{showResizeBar:this.showDataView,
        title:"Hibernate Mappings"},null,this.innerLayout);
    this.mappingView.addSection({autoDraw:true,showHeader:true,expanded:true,
        hidden:false,title:"Hibernate Mappings"});
    this.mappingStack=this.mappingView.sections[0];
    this.addAutoChild("dataView",null,null,this.innerLayout);
    this.dataView.addSection({autoDraw:true,showHeader:true,expanded:true,hidden:false});
    this.dataStack=this.dataView.sections[0];
    this.mappingTree=this.createAutoChild("mappingTree");
    this.mappingStack.addItem(this.mappingTree);
    var includeList=this.includeSubstring;
    if(includeList&&!isc.isAn.Array(includeList))includeList=[includeList];
    var excludeList=this.excludeSubstring;
    if(excludeList&&!isc.isAn.Array(excludeList))excludeList=[excludeList];
    isc.DMI.call("isc_builtin","com.isomorphic.tools.BuiltinRPC","getHibernateBeans",
        includeList,excludeList,
        true,
        function(data){
            hbBrowser.populateMappingTree(data.data);
        }
    );
    this.dataGrid=this.createAutoChild("dataGrid");
    this.dataStack.addItem(this.dataGrid);
    this.outerLayout.addMember(isc.LayoutSpacer.create({height:"10"}));
    this.addAutoChild("selectButton",{
        click:function(){
            hbBrowser.hide();
            hbBrowser._paletteNode.defaults=hbBrowser.getGeneratedDataSourceObject();
            hbBrowser.fireCallback(hbBrowser._getResultsCallback,"node",
                [hbBrowser._paletteNode])
        }
     },null,this.outerLayout);
}
,isc.A.populateMappingTree=function isc_HibernateBrowser_populateMappingTree(data){
    for(var i=0;i<data.length;i++){
        data[i].name=data[i].entityName;
        data[i].type="entity";
        data[i].isFolder=true;
        data[i].customIcon="[SKIN]../DatabaseBrowser/data.png"
    }
    this.mappingTree.setData(isc.Tree.create({
        modelType:"children",
        root:{children:data}
    }));
    if(data.length==0){
        this.populateMappingTreeHeader("No Hibernate entities configured");
    }
    this.tablesRetrieved=true;
}
,isc.A.populateMappingTreeHeader=function isc_HibernateBrowser_populateMappingTreeHeader(headerText){
    this.mappingStack.setTitle(headerText);
}
,isc.A.populateDataViewHeader=function isc_HibernateBrowser_populateDataViewHeader(){
    this.dataGridTitle="Data from entity "+this._selectedEntity;
    this.dataStack.setTitle(this.dataGridTitle);
}
,isc.A.getDataSourceFromMapping=function(entityName){

    var hbBrowser=this;
    hbBrowser._selectedEntity=entityName;
    hbBrowser.selectButton.setEnabled(true);
    isc.DMI.call("isc_builtin","com.isomorphic.tools.BuiltinRPC","getDataSourceJSONFromHibernateMapping",
        entityName,entityName+"-hibernateBrowser",
        function(rpcResponse,data){
            var temp="hbBrowser.generatedDataSourceObject = "+data;
            eval(temp);
            hbBrowser.generatedDataSource=isc.DataSource.create(hbBrowser.generatedDataSourceObject);
            if(hbBrowser.showDataView){
                hbBrowser.dataGrid.setDataSource(hbBrowser.generatedDataSource);
                hbBrowser.dataGrid.fetchData();
            }
        });
}
,isc.A.getGeneratedDataSource=function isc_HibernateBrowser_getGeneratedDataSource(){
    return this.generatedDataSource;
}
,isc.A.getGeneratedDataSourceObject=function isc_HibernateBrowser_getGeneratedDataSourceObject(){
    return this.generatedDataSourceObject;
}
,isc.A.getResults=function isc_HibernateBrowser_getResults(newNode,callback,palette){
    this._getResultsCallback=callback;
    this._paletteNode=newNode;
}
);
isc.B._maxIndex=isc.C+9;

isc.defineClass("SelectionOutline","Class");
isc.A=isc.SelectionOutline;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.flashBorder="1px dashed white";
isc.A.flashCount=7;
isc.A.flashInterval=300;
isc.A.showLabel=true;
isc.A.labelSnapTo="TL";
isc.A.labelSnapEdge="BL";
isc.A.labelSnapOffset=-2;
isc.A.labelOpacity=100;
isc.A._dragHandleHeight=18;
isc.A._dragHandleWidth=18;
isc.A._dragHandleXOffset=-18;
isc.A._dragHandleYOffset=0;
isc.A.border="1px dashed #44ff44";
isc.A.labelBackgroundColor="#44ff44";
isc.B.push(isc.A.setBorder=function isc_c_SelectionOutline_setBorder(border){
        this.border=border;
    }
,isc.A.getBorder=function isc_c_SelectionOutline_getBorder(){
        return this.border;
    }
,isc.A.setLabelBackgroundColor=function isc_c_SelectionOutline_setLabelBackgroundColor(color){
        this.labelBackgroundColor=color;
    }
,isc.A.getLabelBackgroundColor=function isc_c_SelectionOutline_getLabelBackgroundColor(){
        return this.labelBackgroundColor;
    }
,isc.A.getSelectedState=function isc_c_SelectionOutline_getSelectedState(){
        var state={
            border:this.getBorder(),
            labelBackgroundColor:this.getLabelBackgroundColor(),
            selectedObject:this.getSelectedObject(),
            enableKeyMovement:this._allowKeyMovement,
            showingDragHandle:this._showingDragHandle,
            showingLabel:this._showingLabel,
            label:this._labelText,
            resizeFrom:this._resizeFrom
        };
        return state;
    }
,isc.A.setSelectedState=function isc_c_SelectionOutline_setSelectedState(state){
        if(state==null)return;
        this.setBorder(state.border);
        this.setLabelBackgroundColor(state.labelBackgroundColor);
        if(state.selectedObject){
            this.select(state.selectedObject,false,
                state.showingLabel,state.label,
                state.resizeFrom,state.enableKeyMovement);
            if(state.showingDragHandle)this.showDragHandle();
        }else{
            this.deselect();
        }
    }
,isc.A.select=function isc_c_SelectionOutline_select(name,flash,showLabel,label,resizeFrom,enableKeyMovement){
        var objects=name;
        if(isc.isA.String(name))objects=[window[name]];
        else if(!isc.isAn.Array(objects))objects=[objects];
        for(var i=0;i<objects.length;i++){
            var object=objects[i];
            if(!isc.isA.Canvas(object)&&!isc.isA.FormItem(object)){
                this.logInfo("Cannot hilite "+name+" - it is neither a Canvas nor a FormItem");
                return;
            }
        }
        this._allowKeyMovement=enableKeyMovement;
        if(showLabel==null&&objects.length==1)showLabel=true;
        if(!label&&(showLabel||(showLabel==null&&this.showLabel))){
            label="<b>"+object.toString()+"</b>";
        }
        var done=false,
            firstObject=(this._objects?this._objects[0]:null);
        for(var i=0;i<objects.length;i++){
            var object=objects[i];
            if(object==firstObject&&label==this._labelText&&
                ((showLabel&&this._showingLabel)||(!showLabel&&!this._showingLabel)))
            {
                if(!this._visible)this.showOutline();
                done=true;
            }
        }
        if(done){
            this.delayCall("_moveOutline",[],0);
            return;
        }
        this.logInfo("Selection changing from "+isc.SelectionOutline.getSelectedObject()+
            " to "+objects[0],"selectionOutline");
        this.deselect();
        this._createOutlines(objects);
        this._objects=[];
        this._objectCanvases=[];
        for(var i=0;i<objects.length;i++){
            var object=objects[i],
                objectCanvas=object
            ;
            if(isc.isA.FormItem(object)){
                if(!this._formItemProxyCanvas){
                    this._formItemProxyCanvas=isc.FormItemProxyCanvas.create();
                }
                objectCanvas=this._formItemProxyCanvas;
                objectCanvas.delayCall("setFormItem",[object]);
            }
            var outline=this._outlines[i];
            outline.top.canDragResize=false;
            outline.left.canDragResize=false;
            outline.bottom.canDragResize=false;
            outline.right.canDragResize=false;
            if(resizeFrom){
                if(!isc.isAn.Array(resizeFrom))resizeFrom=[resizeFrom];
                for(var j=0;j<resizeFrom.length;j++){
                    var edgeName=resizeFrom[j],
                        edge=null
                    ;
                    if(edgeName=="T"){
                        edge=outline.top;
                    }else if(edgeName=="L"){
                        edge=outline.left;
                    }else if(edgeName=="B"){
                        edge=outline.bottom;
                    }else if(edgeName=="R"){
                        edge=outline.right;
                    }else{
                        continue;
                    }
                    edge.dragTarget=objectCanvas;
                    edge.canDragResize=true;
                }
                this._resizeFrom=resizeFrom;
            }
            if(showLabel||(showLabel==null&&this.showLabel)){
                if(outline.label==null){
                    this._createLabel();
                }else{
                    outline.label.setBackgroundColor(this.labelBackgroundColor);
                }
                outline.label.setContents(label);
                this._showingLabel=true;
                this._labelText=label;
            }else{
                outline.label=null;
                this._showingLabel=false;
                this._labelText=null;
            }
            this._objects[i]=object;
            this._objectCanvases[i]=objectCanvas;
        }
        this._resetOutline();
        this._clearTools();
        this.delayCall("_moveOutline",[],0);
        this.delayCall("showOutline",[],0);
        if(objects.length==1){
            var object=objects[0];
            if(this.clipCanvas){
                this._observer.observe(this.clipCanvas,"resized",
                        "isc.Timer.setTimeout('isc.SelectionOutline._clipCanvasResized()',0)");
            }
            if(object.moved){
                this._observer.observe(object,"moved",
                        "isc.Timer.setTimeout('isc.SelectionOutline._moveOutline()',0)");
            }
            if(objectCanvas.parentMoved){
                this._observer.observe(objectCanvas,"parentMoved",
                        "isc.Timer.setTimeout('isc.SelectionOutline._moveOutline()',0)");
            }
            if(objectCanvas.parentResized){
                this._observer.observe(objectCanvas,"parentResized",
                        "isc.Timer.setTimeout('isc.SelectionOutline._parentResized()',0)");
            }
            if(objectCanvas.resized){
                this._observer.observe(objectCanvas,"resized",
                        "isc.Timer.setTimeout('isc.SelectionOutline._resizeOutline()',0)");
            }
            if(objectCanvas.dragResizeStart){
                this._observer.observe(objectCanvas,"dragResizeStart","isc.SelectionOutline.resizeStart()");
            }
            var scrollObj=isc.isA.FormItem(object)?object.form:object;
            while(scrollObj){
                if(scrollObj.scrolled){
                    this._observer.observe(scrollObj,"scrolled",
                            "isc.SelectionOutline._moveOutline()");
                }
                scrollObj=scrollObj.parentElement;
            }
            if(object.hide){
                this._observer.observe(object,"hide","isc.SelectionOutline.hideOutline()");
            }
            if(object.destroy){
                this._observer.observe(object,"destroy","isc.SelectionOutline.hideOutline()");
            }
            if(objectCanvas._visibilityChanged){
                this._observer.observe(objectCanvas,"_visibilityChanged","isc.SelectionOutline.visibilityChanged()");
            }
        }
        if(flash!=false)this._flashOutline()
    }
,isc.A.deselect=function isc_c_SelectionOutline_deselect(){
        this.hideOutline();
        if(this._observer&&this._objects&&this._objects[0]){
            var object=this._objects[0],
                objectCanvas=this._objectCanvases[0]||object
            ;
            if(this.clipCanvas)this._observer.ignore(this.clipCanvas,"resized");
            this._observer.ignore(object,"moved");
            this._observer.ignore(objectCanvas,"parentMoved");
            this._observer.ignore(objectCanvas,"parentResized");
            this._observer.ignore(objectCanvas,"resized");
            this._observer.ignore(objectCanvas,"dragResizeStart");
            this._observer.ignore(objectCanvas,"dragMove");
            this._observer.ignore(objectCanvas,"dragStop");
            this._observer.ignore(object,"hide");
            this._observer.ignore(object,"destroy");
            this._observer.ignore(objectCanvas,"_visibilityChanged");
            var scrollObj=isc.isA.FormItem(object)?object.form:object;
            while(scrollObj){
                this._observer.ignore(scrollObj,"scrolled");
                scrollObj=scrollObj.parentElement;
            }
            var outline=this._outlines[0];
            outline.top.canDragResize=false;
            outline.left.canDragResize=false;
            outline.bottom.canDragResize=false;
            outline.right.canDragResize=false;
            if(this._keyPressEventID){
                isc.Page.clearEvent("keyPress",this._keyPressEventID);
                delete this._keyPressEventID;
            }
        }
        this._objects=null;
        this._objectCanvases=null;
    }
,isc.A.getSelectedObject=function isc_c_SelectionOutline_getSelectedObject(){
        return(this._objects&&this._objects.length>0?this._objects[0]:null);
    }
,isc.A.getSelectedObjectCanvas=function isc_c_SelectionOutline_getSelectedObjectCanvas(){
        return(this._objectCanvases&&this._objectCanvases.length>0?this._objectCanvases[0]:null);
    }
,isc.A._createOutlines=function isc_c_SelectionOutline__createOutlines(objects){
        if(!isc.isAn.Array(objects))objects=[objects];
        if(this._outlines&&this._outlines.length>=objects.length){
            for(var i=this._outlines.length-1;i>=objects.length;i--){
                var outline=this._outlines[i];
                outline.top.destroy();
                outline.left.destroy();
                outline.bottom.destroy();
                outline.right.destroy();
            }
            this._outlines.length=objects.length;
            return;
        }
        if(!this._outlines)this._outlines=[];
        var baseProperties={
            autoDraw:false,
            overflow:"hidden",
            border:this.border,
            padding:0
        }
        for(var i=0;i<objects.length;i++){
            if(this._outlines[i])continue;
            this._outlines[i]={
                top:isc.Canvas.create(isc.addProperties(baseProperties,{
                            snapTo:"T",
                            snapEdge:"B",
                            width:"100%",
                            height:2,
                            canDragResize:false,
                            resizeFrom:["T"]
                    })),
                left:isc.Canvas.create(isc.addProperties(baseProperties,{
                            snapTo:"L",
                            snapEdge:"R",
                            width:2,
                            height:"100%",
                            canDragResize:false,
                            resizeFrom:["L"]
                    })),
                bottom:isc.Canvas.create(isc.addProperties(baseProperties,{
                            snapTo:"B",
                            snapEdge:"T",
                            width:"100%",
                            height:2,
                            canDragResize:false,
                            resizeFrom:["B"]
                        })),
                right:isc.Canvas.create(isc.addProperties(baseProperties,{
                            snapTo:"R",
                            snapEdge:"L",
                            width:2,
                            height:"100%",
                            canDragResize:false,
                            resizeFrom:["R"]
                    }))
            }
        }
        if(!this._observer)this._observer=isc.Class.create();
    }
,isc.A._createLabel=function isc_c_SelectionOutline__createLabel(){
        var outline=this._outlines[0];
        if(this._cachedLabel){
            outline.label=this._cachedLabel;
            return;
        }
        this._cachedLabel=outline.label=isc.Label.create({
            autoDraw:true,top:-1000,left:-1000,
            autoFit:true,
            autoFitDirection:"both",
            padding:2,
            wrap:false,
            isMouseTransparent:true,
            backgroundColor:this.labelBackgroundColor,
            opacity:this.labelOpacity,
            snapTo:this.labelSnapTo,
            snapEdge:this.labelSnapEdge,
            snapOffsetTop:this.labelSnapOffset,
            mouseOver:function(){
                if(this._movedAway){
                    isc.Timer.clear(this._snapBackTimer);
                    isc.SelectionOutline._moveOutline();
                    this._movedAway=false;
                }else{
                    var _this=this;
                    this._slideAwayTimer=isc.Timer.setTimeout(function(){
                        _this._slideAway();
                    },300);
                }
            },
            mouseOut:function(){
                if(this._slideAwayTimer){
                    isc.Timer.clear(this._slideAwayTimer);
                    delete this._slideAwayTimer;
                }
            },
            _slideAway:function(){
                isc.Timer.clear(this._snapBackTimer);
                this._movedAway=true;
                this.animateMove(null,(this.getPageTop()+this.getVisibleHeight())-
                                         isc.SelectionOutline.labelSnapOffset,null,200);
                if(isc.SelectionOutline._leadingTools){
                    var tools=isc.SelectionOutline._leadingTools;
                    tools.animateMove(null,(tools.getPageTop()+this.getVisibleHeight())-
                            isc.SelectionOutline.labelSnapOffset,null,200);
                }
                if(isc.SelectionOutline._trailingTools){
                    var tools=isc.SelectionOutline._trailingTools;
                    tools.animateMove(null,(tools.getPageTop()+this.getVisibleHeight())-
                            isc.SelectionOutline.labelSnapOffset,null,200);
                }
                this._snapBackTimer=isc.Timer.setTimeout(function(){
                    isc.SelectionOutline._moveOutline();
                    if(isc.SelectionOutline._outlines[0].label){
                        isc.SelectionOutline._outlines[0].label._movedAway=false;
                    }
                },3000);
            }
        });
    }
,isc.A._resizeOutline=function isc_c_SelectionOutline__resizeOutline(){
        this.logInfo("Resizing selected object "+isc.SelectionOutline.getSelectedObject(),"selectionOutline");
        this._refreshOutline();
        this.resizeStop();
    }
,isc.A._moveOutline=function isc_c_SelectionOutline__moveOutline(){
        this.logInfo("Moving selected object "+isc.SelectionOutline.getSelectedObject(),"selectionOutline");
        this._refreshOutline();
    }
,isc.A._parentResized=function isc_c_SelectionOutline__parentResized(){
        this.logInfo("Parent of selected object resized "+isc.SelectionOutline.getSelectedObject(),"selectionOutline");
        this._refreshOutline();
    }
,isc.A._clipCanvasResized=function isc_c_SelectionOutline__clipCanvasResized(){
        this.logInfo("Clip canvas resized "+isc.SelectionOutline.getSelectedObject(),"selectionOutline");
        this._refreshOutline();
    }
,isc.A._refreshOutline=function isc_c_SelectionOutline__refreshOutline(){
        if(!this._objects)return;
        for(var i=0;i<this._outlines.length;i++){
            var outline=this._outlines[i],
                object=this._objects[i]
            ;
            if(!object||object.destroyed||object.destroying)continue;
            var outlinePageRect=this._getObjectOutlineRect(object);
            if(outlinePageRect){
                var width=outlinePageRect[2],
                    height=outlinePageRect[3]
                ;
                outline.top.resizeTo(width,outline.top.height);
                outline.bottom.resizeTo(width,outline.bottom.height);
                outline.left.resizeTo(outline.left.width,height);
                outline.right.resizeTo(outline.right.width,height);
                var isACanvas=isc.isA.Canvas(object);
                for(var key in outline){
                    var piece=outline[key];
                    if(key=="_offscreen"||piece==null)continue;
                    if(isACanvas){
                        piece.show();
                        isc.Canvas.snapToEdge(outlinePageRect,piece.snapTo,piece,piece.snapEdge);
                    }else{
                        isc.Canvas.snapToEdge(object.getPageRect(),piece.snapTo,piece,
                                            piece.snapEdge);
                    }
                }
                delete outline._offscreen;
            }else{
                outline._offscreen=true;
                this.hideOutline();
            }
        }
        this.positionDragHandle();
        this.positionTools();
    }
,isc.A._flashOutline=function isc_c_SelectionOutline__flashOutline(){
        var borders=[this.border,this.flashBorder];
        for(var i=0;i<this.flashCount;i++){
            isc.Timer.setTimeout({
                    target:this,methodName:"_setOutline",
                    args:[borders[i%2]]
            },(this.flashInterval*i)
            )
        }
    }
,isc.A._resetOutline=function isc_c_SelectionOutline__resetOutline(){
        this._setOutline(this.border);
    }
,isc.A._setOutline=function isc_c_SelectionOutline__setOutline(border){
        for(var i=0;i<this._outlines.length;i++){
            var outline=this._outlines[i];
            for(var key in outline){
                if(key=="label"||key=="_offscreen")continue;
                var piece=outline[key];
                piece.setBorder(border);
            }
        }
    }
,isc.A._getObjectOutlineRect=function isc_c_SelectionOutline__getObjectOutlineRect(object){
        var clipCanvas=this.clipCanvas,
            outlinePageRect
        ;
        if(object&&clipCanvas){
            var clipPageRect=clipCanvas.getPageRect(),
                objectPageRect=object.getPageRect(),
                left=Math.max(clipPageRect[0],objectPageRect[0]),
                top=Math.max(clipPageRect[1],objectPageRect[1])
            ;
            if(objectPageRect[0]+objectPageRect[2]>=0&&
                objectPageRect[1]+objectPageRect[3]>=0&&
                top<clipPageRect[1]+clipPageRect[3]&&
                left<clipPageRect[0]+clipPageRect[2])
            {
                outlinePageRect=[
                    left,
                    top,
                    Math.min(clipPageRect[0]+clipPageRect[2],objectPageRect[0]+objectPageRect[2])-left,
                    Math.min(clipPageRect[1]+clipPageRect[3],objectPageRect[1]+objectPageRect[3])-top
                ];
            }
            if(outlinePageRect&&(outlinePageRect[2]<1||outlinePageRect[3]<1)){
                outlinePageRect=null;
            }
        }else{
            outlinePageRect=object.getPageRect();
        }
        return outlinePageRect;
    }
,isc.A.resizeStart=function isc_c_SelectionOutline_resizeStart(){
        var object=isc.SelectionOutline.getSelectedObject();
        if(object&&object.editProxy&&object.editProxy.resizeStart)object.editProxy.resizeStart();
    }
,isc.A.resizeStop=function isc_c_SelectionOutline_resizeStop(){
        var object=isc.SelectionOutline.getSelectedObject();
        if(object&&object.editProxy&&object.editProxy.resizeStart)object.editProxy.resizeStop();
    }
,isc.A.hideOutline=function isc_c_SelectionOutline_hideOutline(){
        if(!this._outlines)return;
        for(var i=0;i<this._outlines.length;i++){
            var outline=this._outlines[i];
            for(var key in outline){
                if(key!="_offscreen"&&outline[key])outline[key].hide();
            }
        }
        this._visible=false;
        this.hideDragHandle();
        this.hideTools();
    }
,isc.A.showOutline=function isc_c_SelectionOutline_showOutline(){
        if(!this._outlines||!this.getSelectedObject())return;
        var visible=false;
        for(var i=0;i<this._outlines.length;i++){
            var outline=this._outlines[i];
            for(var key in outline){
                if(key!="_offscreen"&&outline[key]){
                    if(outline._offscreen){
                        outline[key].hide();
                    }else{
                        outline[key].show();
                        visible=true;
                    }
                }
            }
        }
        this._visible=visible;
        if(visible){
            this.showDragHandle();
            this.showTools();
        }
    }
,isc.A.showDragHandle=function isc_c_SelectionOutline_showDragHandle(){
        var dragTarget=this.getSelectedObject();
        if(!dragTarget)return;
        if(!this._dragHandle){
            var _this=this;
            this._dragHandle=isc.Img.create({
                src:"[SKIN]/../../ToolSkin/images/controls/dragHandle.gif",
                prompt:"Grab here to drag component. Hold down shift to drag without a snap grid.",
                width:this._dragHandleWidth,height:this._dragHandleHeight,
                cursor:"move",
                backgroundColor:"white",
                opacity:80,
                canDrag:true,
                canDrop:true,
                isMouseTransparent:true,
                mouseDown:function(){
                    this.dragIconOffsetX=isc.EH.getX()-
                                              isc.SelectionOutline._draggingObject.getPageLeft();
                    this.dragIconOffsetY=isc.EH.getY()-
                                              isc.SelectionOutline._draggingObject.getPageTop();
                    _this._mouseDown=true;
                    this.Super("mouseDown",arguments);
                },
                mouseUp:function(){
                    _this._mouseDown=false;
                }
            });
        }
        if(!dragTarget.editProxy){
            this._dragHandle.hide();
            return;
        }
        var objectCanvas=this.getSelectedObjectCanvas();
        if(!this._draggingObject||this._draggingObject!=objectCanvas){
            this._dragHandle.setProperties({dragTarget:objectCanvas});
            isc.Timer.setTimeout("isc.SelectionOutline.positionDragHandle()",0);
            this._draggingObject=objectCanvas;
            this._observer.observe(this._draggingObject,"dragMove",
                        "isc.SelectionOutline.positionDragHandle(true)");
            this._observer.observe(this._draggingObject,"dragStop",
                        "isc.SelectionOutline._mouseDown = false");
        }
        if(!this._keyPressEventID&&this._allowKeyMovement!=false){
            this._keyPressEventID=isc.Page.setEvent("keyPress",this);
        }
        this._dragHandle.show();
        this._showingDragHandle=true;
    }
,isc.A.positionDragHandle=function isc_c_SelectionOutline_positionDragHandle(offset){
        if(!this._dragHandle||!this._showingDragHandle||!this._draggingObject)return;
        var selected=this._draggingObject;
        if(selected.destroyed||selected.destroying){
            this.logWarn("target of dragHandle: "+isc.Log.echo(selected)+" is invalid: "+
                         selected.destroyed?"already destroyed"
                                            :"currently in destroy()");
            return;
        }
        var height=selected.getVisibleHeight();
        if(height<this._dragHandleHeight*2){
            this._dragHandleYOffset=Math.round((height-this._dragHandle.height)/2)-1;
        }else{
            this._dragHandleYOffset=-1;
        }
        if(selected.isA("FormItemProxyCanvas")&&!this._mouseDown){
            selected.syncWithFormItemPosition();
        }
        if(!selected)return;
        var outlinePageRect=this._getObjectOutlineRect(selected);
        if(outlinePageRect){
            var left=outlinePageRect[0]+this._dragHandleXOffset;
            if(offset){
                left+=selected.getOffsetX()-this._dragHandle.dragIconOffsetX;
            }
            this._dragHandle.setPageLeft(left);
            var top=outlinePageRect[1]+this._dragHandleYOffset;
            if(offset){
                top+=selected.getOffsetY()-this._dragHandle.dragIconOffsetY;
            }
            this._dragHandle.setPageTop(top);
            this._dragHandle.moveAbove(this._outlines[0].label);
            this._dragHandle.show();
        }else{
            this._dragHandle.hide();
        }
    }
,isc.A.hideDragHandle=function isc_c_SelectionOutline_hideDragHandle(){
        if(this._dragHandle&&this._showingDragHandle){
            this._dragHandle.hide();
            if(this._keyPressEventID){
                isc.Page.clearEvent("keyPress",this._keyPressEventID);
                delete this._keyPressEventID;
            }
            this._showingDragHandle=false;
        }
    }
,isc.A.showTrailingTools=function isc_c_SelectionOutline_showTrailingTools(tools){
        if(!tools)return;
        if(!isc.isAn.Array(tools))tools=[tools];
        if(!this._trailingTools){
            var layout=isc.HLayout.create({
                autoDraw:false,
                snapTo:this.labelSnapTo,
                snapEdge:this.labelSnapEdge,
                snapOffsetTop:this.labelSnapOffset,
                width:1,
                membersMargin:2,
                members:tools
            });
            this._trailingTools=layout;
        }else{
            var members=this._trailingTools.getMembers();
            var changed=(members.length!=tools.length);
            if(!changed){
                for(var i=0;i<members.length;i++){
                    if(members[i]!=tools[i]){
                        changed=true;
                        break;
                    }
                }
            }
            if(changed)this._trailingTools.setMembers(tools);
        }
    }
,isc.A.showLeadingTools=function isc_c_SelectionOutline_showLeadingTools(tools){
        if(!tools)return;
        if(!isc.isAn.Array(tools))tools=[tools];
        if(!this._leadingTools){
            var layout=isc.HLayout.create({
                autoDraw:true,top:-100,left:-100,
                snapTo:this.labelSnapTo,
                snapEdge:this.labelSnapEdge,
                snapOffsetTop:this.labelSnapOffset,
                backgroundColor:"white",
                opacity:80,
                width:1,
                membersMargin:2,
                members:tools
            });
            this._leadingTools=layout;
        }else{
            var members=this._leadingTools.getMembers();
            var changed=(members.length!=tools.length);
            if(!changed){
                for(var i=0;i<members.length;i++){
                    if(members[i]!=tools[i]){
                        changed=true;
                        break;
                    }
                }
            }
            if(changed)this._leadingTools.setMembers(tools);
        }
    }
,isc.A._clearTools=function isc_c_SelectionOutline__clearTools(){
        if(this._leadingTools){
            this._leadingTools.removeMembers(this._leadingTools.getMembers());
        }
        if(this._trailingTools){
            this._trailingTools.removeMembers(this._trailingTools.getMembers());
        }
    }
,isc.A.hideTools=function isc_c_SelectionOutline_hideTools(){
        if(this._leadingTools){
            this._leadingTools.hide();
        }
        if(this._trailingTools){
            this._trailingTools.hide();
        }
    }
,isc.A.showTools=function isc_c_SelectionOutline_showTools(){
        if(this._leadingTools){
            this._leadingTools.show();
        }
        if(this._trailingTools){
            this._trailingTools.show();
        }
    }
,isc.A.positionTools=function isc_c_SelectionOutline_positionTools(offset){
        if(!this._showingLabel)return;
        var targetCanvas=this.getSelectedObjectCanvas(),
            outline=this._outlines[0],
            outlinePageRect
        ;
        if(!outline._offscreen){
            outlinePageRect=this._getObjectOutlineRect(targetCanvas)
        }
        if(this._leadingTools&&outlinePageRect){
            var tools=this._leadingTools;
            tools.snapOffsetLeft=-1*tools.getVisibleWidth();
            tools.setHeight(outline.label.getVisibleHeight());
            isc.Canvas.snapToEdge(outlinePageRect,tools.snapTo,tools,tools.snapEdge);
            tools.show();
        }else if(this._leadingTools){
            this._leadingTools.hide();
        }
        if(this._trailingTools&&outlinePageRect){
            var tools=this._trailingTools;
            tools.snapOffsetLeft=outline.label.getVisibleWidth();
            tools.setHeight(outline.label.getVisibleHeight());
            isc.Canvas.snapToEdge(outlinePageRect,tools.snapTo,tools,tools.snapEdge);
            tools.show();
        }else if(this._trailingTools){
            this._trailingTools.hide();
        }
    }
,isc.A.hideProxyCanvas=function isc_c_SelectionOutline_hideProxyCanvas(){
        if(this._dragTargetProxy)this._dragTargetProxy.hide();
    }
,isc.A.visibilityChanged=function isc_c_SelectionOutline_visibilityChanged(){
        var object=isc.SelectionOutline.getSelectedObject();
        if(!object)return;
        if(object.isVisible())isc.SelectionOutline.showOutline();
        else isc.SelectionOutline.hideOutline();
    }
,isc.A.pageKeyPress=function isc_c_SelectionOutline_pageKeyPress(target,eventInfo){
        var object=isc.SelectionOutline.getSelectedObject();
        if(!object||!object.parentElement)return;
        var focusCanvas=object.ns.EH.getFocusCanvas();
        if((isc.isA.DynamicForm&&isc.isA.DynamicForm(focusCanvas))||
            (isc.isA.GridRenderer&&isc.isA.GridRenderer(focusCanvas)&&focusCanvas.grid&&focusCanvas.grid.getEditRow()!=null)||
            (isc.isAn.ImgTab&&isc.isAn.ImgTab(focusCanvas))||
            (isc.isA.SimpleTabButton&&isc.isA.SimpleTabButton(focusCanvas)))
        {
            return;
        }
        if(object.ns.EH.clickMaskUp())return;
        var keyName=isc.EH.getKey();
        if(keyName==null||
            (keyName!="Arrow_Up"&&keyName!="Arrow_Down"&&keyName!="Arrow_Left"&&keyName!="Arrow_Right"))
        {
            return;
        }
        var parent=object.parentElement,
            shiftPressed=isc.EH.shiftKeyDown(),
            vGap=(shiftPressed?1:parent.snapVGap),
            hGap=(shiftPressed?1:parent.snapHGap),
            delta=[0,0]
        ;
        switch(keyName){
            case"Arrow_Up":
                delta=[0,vGap*-1];
                break;
            case"Arrow_Down":
                delta=[0,vGap];
                break;
            case"Arrow_Left":
                delta=[hGap*-1,0];
                break;
            case"Arrow_Right":
                delta=[hGap,0];
                break;
        }
        if(delta[0]!=0||delta[1]!=0){
            if(object.snapTo){
                object.setSnapOffsetLeft((object.snapOffsetLeft||0)+delta[0]);
                object.setSnapOffsetTop((object.snapOffsetTop||0)+delta[1]);
            }else{
                object.moveBy(delta[0],delta[1]);
            }
        }
        return false;
    }
);
isc.B._maxIndex=isc.C+37;

isc.ClassFactory.defineClass("Repo","Class");
isc.A=isc.Repo.getPrototype();
isc.A.idField="id";
isc.A.viewNameField="viewName";
isc.A.objectField="object";
isc.A.objectFormat="js"
;

isc.A=isc.Repo.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.init=function isc_Repo_init(){
    this.initDataSource();
}
,isc.A.initDataSource=function isc_Repo_initDataSource(){
    if(this.dataSource&&!isc.isA.DataSource(this.dataSource))
        this.dataSource=isc.DS.getDataSource(this.dataSource);
}
,isc.A.destroy=function isc_Repo_destroy(){
    this.Super("destroy",arguments);
}
,isc.A.loadObjects=function isc_Repo_loadObjects(context,callback){
}
,isc.A.loadObject=function isc_Repo_loadObject(context,callback){
}
,isc.A.saveObject=function isc_Repo_saveObject(contents,context,callback){
}
,isc.A.showLoadUI=function isc_Repo_showLoadUI(context,callback){
}
,isc.A.showSaveUI=function isc_Repo_showSaveUI(contents,context,callback){
}
,isc.A.isActive=function isc_Repo_isActive(){
    if(this._loadFileDialog&&this._loadFileDialog.isVisible())return true;
    if(this._saveFileDialog&&this._saveFileDialog.isVisible())return true;
    return false;
}
,isc.A.customFormatToJS=function isc_Repo_customFormatToJS(value){
    return value;
}
);
isc.B._maxIndex=isc.C+10;

isc.Repo.addClassProperties({
})
isc.Repo.registerStringMethods({
});
isc.ClassFactory.defineClass("ViewRepo","Repo");
isc.A=isc.ViewRepo.getPrototype();
isc.A.dataSource="Filesystem";
isc.A.idField="name";
isc.A.viewNameField="name";
isc.A.objectField="contents";
isc.A.objectFormat="xml"
;

isc.A=isc.ViewRepo.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.loadObjects=function isc_ViewRepo_loadObjects(context,callback){
    this.initDataSource();
    var ds=this.dataSource,
        _this=this;
    ds.fetchData(context?context.criteria:null,
        function(dsResponse){
            _this.loadObjectsReply(dsResponse.data,context,callback);
        }
    );
}
,isc.A.loadObjectsReply=function isc_ViewRepo_loadObjectsReply(data,context,callback){
    this.fireCallback(callback,"objects, context",[data,callback]);
}
,isc.A.loadObject=function isc_ViewRepo_loadObject(context,callback){
    this.initDataSource();
    var ds=this.dataSource,
        _this=this;
    ds.fetchData(context?context.criteria:null,
        function(dsResponse){
            _this.loadObjectReply(dsResponse.data,context,callback);
        },{operationId:"loadFile"}
    );
}
,isc.A.loadObjectReply=function isc_ViewRepo_loadObjectReply(data,context,callback){
    var record=isc.isAn.Array(data)?data[0]:data,
        value=record[this.objectField]
    ;
    if(this.objectFormat=="custom"){
        value=this.customFormatToJS(value);
    }
    context[this.idField]=context.fileName=record[this.idField];
    context[this.viewNameField]=context.screenName=record[this.viewNameField];
    if(context.screenName.indexOf(".")>0)
        context.screenName=context.screenName.substring(0,context.screenName.indexOf("."));
    context[this.objectField]=value;
    context.record=record;
    this.fireCallback(callback,"contents,context",[value,context]);
}
,isc.A.createLoadDialog=function isc_ViewRepo_createLoadDialog(context){
    var dialog=isc.TLoadFileDialog.create({
        directoryListingProperties:{
            canEdit:false
        },
        title:"Load View",
        initialDir:context.caller.workspacePath,
        rootDir:context.caller.workspacePath,
        fileFilter:".xml$",
        actionStripControls:["spacer:10","pathLabel","previousFolderButton","spacer:10",
                 "upOneLevelButton","spacer:10",
                 "refreshButton","spacer:2"
        ]
    });
    dialog.show();
    dialog.hide();
    return dialog;
}
,isc.A.showLoadUI=function isc_ViewRepo_showLoadUI(context,callback){
    var _this=this;
    if(!this._loadFileDialog){
        this._loadFileDialog=isc.TLoadFileDialog.create({
            directoryListingProperties:{
                canEdit:false
            },
            title:"Load View",
            initialDir:context.caller.workspacePath,
            rootDir:context.caller.workspacePath,
            fileFilter:".xml$",
            actionStripControls:["spacer:10","pathLabel","previousFolderButton","spacer:10",
                     "upOneLevelButton","spacer:10",
                     "refreshButton","spacer:2"
            ],
            loadFile:function(fileName){
                var name=fileName;
                if(name.endsWith(".jsp")||name.endsWith(".xml")){
                    name=name.substring(0,name.lastIndexOf("."));
                }
                _this.loadObject(
                    isc.addProperties(
                        {},
                        this._loadContext,
                        {criteria:{path:this.currentDir+"/"+fileName}}
                        ),
                    this._loadCallback
                );
                this.hide();
            }
        });
    }else{
        this._loadFileDialog.directoryListing.data.invalidateCache();
    }
    this._loadFileDialog._loadContext=context;
    this._loadFileDialog._loadCallback=callback;
    this._loadFileDialog.show();
}
,isc.A.saveObject=function isc_ViewRepo_saveObject(contents,context,callback){
    var fileName=context.fileName,
        dotIndex=fileName.lastIndexOf("."),
        code=contents,
        _builder=context.caller
    ;
    this.initDataSource();
    code=code.replaceAll("dataSource=\"ref:","dataSource=\"");
    if(dotIndex!=null&&(fileName.endsWith(".jsp")||fileName.endsWith(".xml"))){
        fileName=fileName.substring(0,dotIndex);
    }
    var index=fileName.lastIndexOf("/");
    var screenName=index>=0?fileName.substring(index+1):fileName,
        fileNameWithoutExtension=_builder.workspacePath+"/"+screenName,
        xmlFileName=fileNameWithoutExtension+".xml",
        ds=this.dataSource
    ;
    context.screenName=screenName;
    ds.updateData({path:xmlFileName,contents:code},
        null,{operationId:"saveFile",showPrompt:!context.suppressPrompt}
    );
    var page='<%@ page contentType="text/html; charset=UTF-8"%>\n'+
        '<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>\n'+
        '<HTML><HEAD><TITLE>'+
        screenName+
        '</TITLE>\n'+
        '<isomorphic:loadISC skin="'+
        _builder.skin+
        '"'+
        (_builder.modulesDir?'modulesDir="'+_builder.modulesDir+'"':"")+
        (context.additionalModules?(' includeModules="'+context.additionalModules+'"'):"")
        +'/>\n </HEAD><BODY>\n';
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
        }
        else
            if(dep.type=="schema"){
                page+='<SCRIPT>\n<isomorphic:loadDS name="'+dep.id+'"/></SCRIPT>\n';
            }
            else
                if(dep.type=="ui"){
                    page+='<SCRIPT>\n<isomorphic:loadUI name="'+dep.id+'"/></SCRIPT>\n';
                }
                else
                    if(dep.type=="css"){
                        page+='<LINK REL="stylesheet" TYPE="text/css" HREF='+
                        (dep.url.startsWith("/")?
                            _builder.webRootRelWorkspace:
                            _builder.basePathRelWorkspace+"/"
                            )+
                        dep.url+
                        '>\n';
                    }
    }
    page+='<SCRIPT>\n'+
        'isc.Page.setAppImgDir("'+_builder.basePathRelWorkspace+'/graphics/");\n'+
        '<isomorphic:XML>\n'+code+'\n</isomorphic:XML>'+
        '</SCRIPT>\n'+
        '</BODY></HTML>';
    _builder.projectComponents._tempScreen=screenName;
    var jspFileName=fileNameWithoutExtension+".jsp";
    ds.updateData({path:jspFileName,contents:page},
        function(){
            if(callback){
                isc.Class.fireCallback(callback,"success,context",[true,context]);
            }
            if(context.suppressPrompt)return;
            var url=window.location.href;
            if(url.indexOf("?")>0)url=url.substring(0,url.indexOf("?"));
            url=url.substring(0,url.lastIndexOf("/"));
            url+=(url.endsWith("/")?"":"/")+_builder.workspaceURL+screenName+".jsp";
            isc.say("Your screen can be accessed at:<P>"+
                "<a target=_blank href='"+
                url+
                "'>"+
                url+
                "</a>");
        },
        {operationId:"saveFile",showPrompt:!context.suppressPrompt}
    );
    if(_builder.saveURL){
        isc.RPCManager.send(null,null,
            {
                actionURL:_builder.saveURL,
                useSimpleHttp:true,
                showPrompt:!context.suppressPrompt,
                params:{
                    screen:code
                }
            }
        );
    }
}
,isc.A.showSaveUI=function isc_ViewRepo_showSaveUI(contents,context,callback){
    var _builder=context.caller,
        _this=this,
        code=contents,
        explicitScreenName=(context.saveAs?"":context.screenName),
        _callback=callback
    ;
    if(!this._saveFileDialog){
        this._saveFileDialog=isc.TSaveFileDialog.create({
            title:"Save View",
            fileFilter:".xml$",
            visibility:"hidden",
            actionStripControls:["spacer:10","pathLabel","previousFolderButton","spacer:10","upOneLevelButton","spacer:10","refreshButton","spacer:2"],
            directoryListingProperties:{
                canEdit:false
            },
            initialDir:_builder.workspacePath,
            rootDir:_builder.workspacePath,
            saveFile:function(fileName){
                _this.saveObject(
                    this._saveCode,
                    isc.addProperties(
                        this._saveContext,
                        {fileName:fileName}
                        ),
                    this._saveCallback
                    );
                this.hide();
            }
        })
    }
    else{
        this._saveFileDialog.directoryListing.data.invalidateCache();
    }
    this._saveFileDialog._saveCode=code;
    this._saveFileDialog._saveContext=context;
    this._saveFileDialog._saveCallback=callback;
    if(explicitScreenName&&explicitScreenName!=""){
        return this._saveFileDialog.saveFile(explicitScreenName);
    }
    this._saveFileDialog.show();
}
);
isc.B._maxIndex=isc.C+8;

isc.ClassFactory.defineClass("DSViewRepo","Repo");
isc.A=isc.DSViewRepo.getPrototype();
isc.A.idField="id";
isc.A.viewNameField="viewName";
isc.A.objectField="object"
;

isc.A=isc.DSViewRepo.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.loadObjects=function isc_DSViewRepo_loadObjects(context,callback){
    if(!this.dataSource){
        this.logWarn("No dataSource available in "+this.getClassName()+".loadObjects");
        return;
    }
    this.initDataSource();
    var ds=this.dataSource,
        _this=this;
    ds.fetchData(context.criteria,
        function(dsResponse){
            _this.loadObjectsReply(dsResponse.data,context,callback);
        }
    );
}
,isc.A.loadObjectsReply=function isc_DSViewRepo_loadObjectsReply(data,context,callback){
    this.fireCallback(callback,"data, context",[data,context]);
}
,isc.A.loadObject=function isc_DSViewRepo_loadObject(context,callback){
    if(!this.dataSource){
        this.logWarn("No dataSource available in "+this.getClassName()+".loadObject");
        return;
    }
    this.initDataSource();
    var _this=this,
        ds=this.dataSource;
    ds.fetchData(context.criteria,
        function(dsRequest){
            _this.loadObjectReply(dsRequest.data,context,callback);
        }
    );
}
,isc.A.loadObjectReply=function isc_DSViewRepo_loadObjectReply(data,context,callback){
    var record=isc.isAn.Array(data)?data[0]:data,
        value=record[this.objectField]
    ;
    if(this.objectFormat=="custom"){
        value=this.customFormatToJS(value);
    }
    context[this.idField]=record[this.idField];
    context[this.viewNameField]=context.screenName=record[this.viewNameField];
    context[this.objectField]=value;
    context.record=record;
    this.fireCallback(callback,"contents,context",[value,context]);
}
,isc.A.saveObject=function isc_DSViewRepo_saveObject(contents,context,callback){
    if(!this.dataSource){
        this.logWarn("No dataSource available in "+this.getClassName()+".saveObject");
        return;
    }
    this.initDataSource();
    var _this=this,
        ds=this.dataSource;
    contents=contents.replaceAll("dataSource=\"ref:","dataSource=\"");
    var record={};
    if(context[this.idField])record[this.idField]=context[this.idField];
    record[this.viewNameField]=context[this.viewNameField];
    record[this.objectField]=contents;
    if(!record[this.idField]){
        ds.addData(record,
            function(dsResponse){
                _this.saveObjectReply(dsResponse,callback,context);
            }
        );
    }else{
        ds.updateData(record,
            function(dsResponse){
                _this.saveObjectReply(dsResponse,callback,context);
            }
        );
    }
}
,isc.A.saveObjectReply=function isc_DSViewRepo_saveObjectReply(dsResponse,callback,context){
    if(callback)this.fireCallback(callback,"success",[true]);
}
,isc.A.showLoadUI=function isc_DSViewRepo_showLoadUI(context,callback){
    var _this=this;
    if(!this._loadFileDialog){
        this._loadFileDialog=isc.TLoadFileDialog.create({
            showPreviousFolderButton:false,
            showUpOneLevelButton:false,
            showCreateNewFolderButton:false,
            actionFormProperties:{
                process:function(){
                    if(this.validate())
                        this.creator.recordSelected(this.creator.directoryListing._lastRecord);
                }
            },
            directoryListingProperties:{
                canEdit:false,
                dataSource:this.dataSource,
                fields:[
                    {name:_this.idField,width:0},
                    {name:_this.viewNameField,width:"*"}
                ],
                recordDoubleClick:function(viewer,record){
                    if(record.isFolder){
                        this.creator.setDir(record.path);
                    }else{
                        this.creator.recordSelected(record);
                    }
                    return false;
                }
            },
            dataSource:this.dataSource,
            title:"Load View",
            fileFilter:".xml$",
            actionStripControls:["spacer:10","pathLabel","previousFolderButton","spacer:10",
                     "upOneLevelButton","spacer:10",
                     "refreshButton","spacer:2"
            ],
            recordSelected:function(record){
                this._loadContext.criteria={record:record};
                this._loadContext.criteria[_this.idField]=record[_this.idField];
                _this.loadObject(this._loadContext,this._loadCallback);
                this.hide();
            }
        })
    }else{
        this._loadFileDialog.directoryListing.data.invalidateCache();
    }
    this._loadFileDialog._loadContext=context;
    this._loadFileDialog._loadCallback=callback;
    this._loadFileDialog.show();
}
,isc.A.showSaveUI=function isc_DSViewRepo_showSaveUI(contents,context,callback){
    var _this=this;
    if(context.screenName){
        this.saveObject(contents,context,callback);
        return;
    }
    if(!this._saveFileDialog){
        this._saveFileDialog=isc.TSaveFileDialog.create({
            title:"Save File",
            actionButtonTitle:"Save",
            showPreviousFolderButton:false,
            showUpOneLevelButton:false,
            showCreateNewFolderButton:false,
            actionFormProperties:{
                process:function(){
                    if(this.validate())
                        this.creator.recordSelected(this.creator.directoryListing._lastRecord);
                }
            },
            directoryListingProperties:{
                canEdit:false,
                dataSource:this.dataSource,
                fields:[
                    {name:_this.idField,width:0},
                    {name:_this.viewNameField,width:"*"}
                ],
                recordDoubleClick:function(viewer,record){
                    if(record.isFolder){
                        this.creator.setDir(record.path);
                    }else{
                        this.creator.recordSelected(record);
                    }
                    return false;
                }
            },
            dataSource:this.dataSource,
            title:"Load View",
            fileFilter:".xml$",
            actionStripControls:["spacer:10","pathLabel","previousFolderButton","spacer:10",
                     "upOneLevelButton","spacer:10",
                     "refreshButton","spacer:2"
            ],
            recordSelected:function(record){
                var context=this._saveContext;
                if(record){
                    context.criteria[_this.idField]=record[_this.idField];
                    context.record=record;
                    context[_this.idField]=record[_this.idField];
                    context[_this.viewNameField]=record[_this.viewNameField];
                }else{
                    context[_this.viewNameField]=this.actionForm.getValue("fileName");
                    context[_this.idField]=null;
                }
                _this.saveObject(this._saveContents,context,this._saveCallback);
                this.hide();
            }
        })
    }else{
        this._saveFileDialog.directoryListing.data.invalidateCache();
    }
    this._saveFileDialog._saveContents=contents;
    this._saveFileDialog._saveContext=context;
    this._saveFileDialog._saveCallback=callback;
    this._saveFileDialog.show();
}
);
isc.B._maxIndex=isc.C+8;

isc.ClassFactory.defineClass("DSRepo","Repo");
isc.DSRepo.addProperties({
})
isc.A=isc.DSRepo.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.loadObjects=function isc_DSRepo_loadObjects(context,callback){
    var _this=this;
    if(!this.dataSource){
        isc.DMI.call({
            appID:"isc_builtin",
            className:"com.isomorphic.tools.BuiltinRPC",
            methodName:"getDefinedDataSources",
            args:[],
            callback:function(response){
                _this.loadObjectsReply(response.data,context,callback);
            }
        });
    }else{
        this.initDataSource();
        this.dataSource.fetchData(context?context.criteria:null,
            function(dsResponse){
                _this.loadObjectsReply(dsResponse.data,context,callback);
            }
        );
    }
}
,isc.A.loadObjectsReply=function isc_DSRepo_loadObjectsReply(data,context,callback){
    this.fireCallback(callback,"objects, context",[data,context]);
}
,isc.A.showLoadUI=function isc_DSRepo_showLoadUI(context,callback){
    if(!this._pickDataSourceDialog){
        this._pickDataSourceDialog=isc.PickDataSourceDialog.create();
    }
    var self=this;
    this.loadObjects(null,function(data){
        self._pickDataSourceDialog.callback=function(records){
            if(!isc.isAn.Array(records))records=[records];
            self.fireCallback(callback,"records, context",[records,context]);
        }
        self._pickDataSourceDialog.setData(data);
        self._pickDataSourceDialog.show();
    });
}
);
isc.B._maxIndex=isc.C+3;

isc.ClassFactory.defineClass("PickDataSourceDialog","Window");
isc.A=isc.PickDataSourceDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="DataSource Picker";
isc.A.autoCenter=true;
isc.A.modal=true;
isc.A.width=460;
isc.A.height=300;
isc.A.canDragResize=true;
isc.A.bodyConstructor="VLayout";
isc.A.dsListingDataSourceDefaults={
        _constructor:"DataSource",
        clientOnly:true,
        fields:[{
            name:"dsName",
            title:"ID",
            primaryKey:true
        },{
            name:"dsType",
            title:"Type",
            valueMap:{
                "sql":"SQL",
                "hibernate":"Hibernate",
                "jpa":"JPA 2.0",
                "jpa1":"JPA 1.0",
                "generic":"Generic",
                "projectFile":"Project File"
            }
        }]
    };
isc.A.dsListingDefaults={
        _constructor:"ListGrid",
        defaultFields:[{
            name:"dsName",
            width:"*"
        },{
            name:"dsType",
            width:150,
            filterOperator:"equals"
        }],
        emptyMessage:"Retrieving list of DataSources...",
        height:"*",
        selectionType:"multiple",
        canMultiSort:true,
        initialSort:[
            {property:"dsName",direction:"ascending"}
        ],
        showFilterEditor:true,
        filterOnKeypress:true,
        fetchDelay:500,
        recordDoubleClick:function(viewer,record){
            this.creator.dataSourceSelected(record);
            return false;
        },
        selectionUpdated:function(record){
            this.creator.pickButton.setDisabled(!record);
        }
    };
isc.A.pickButtonConstructor="Button";
isc.A.pickButtonDefaults={
        title:"Select DataSource",
        width:150,
        layoutAlign:"right",
        height:30,
        margin:5,
        action:function(){
            this.creator.dataSourceSelected(this.creator.dsListing.getSelectedRecords());
        }
    };
isc.B.push(isc.A.setData=function isc_PickDataSourceDialog_setData(data){
        this.dsListing.emptyMessage="No DataSources found.";
        this.dsListingDataSource.setCacheData(data);
        this.dsListing.fetchData(null,function(){
            this.creator.pickButton.setDisabled(true);
        });
    }
,isc.A.dataSourceSelected=function isc_PickDataSourceDialog_dataSourceSelected(record){
        this.hide();
        this.fireCallback(this.callback,"record",[record]);
    }
,isc.A.initWidget=function isc_PickDataSourceDialog_initWidget(){
        this.Super("initWidget",arguments);
        this.dsListingDataSource=this.createAutoChild("dsListingDataSource");
        this.dsListing=this.createAutoChild("dsListing",{
            dataSource:this.dsListingDataSource
        });
        this.pickButton=this.createAutoChild("pickButton");
        this.addItems([
            this.dsListing,
            this.pickButton
        ]);
    }
);
isc.B._maxIndex=isc.C+3;

if(!isc.TScrollbar)isc.defineClass("TScrollbar","Scrollbar");
if(!isc.TScrollthumb)isc.defineClass("TScrollThumb","ScrollThumb");
if(!isc.THScrollthumb)isc.defineClass("THScrollThumb","TScrollThumb");
if(!isc.TVScrollthumb)isc.defineClass("TVScrollThumb","TScrollThumb");
if(!isc.TSnapbar)isc.defineClass("TSnapbar","Snapbar");
if(!isc.TPropertySheet)isc.defineClass("TPropertySheet","PropertySheet");
if(!isc.TSectionStack)isc.defineClass("TSectionStack","SectionStack");
if(!isc.TSectionHeader)isc.defineClass("TSectionHeader","SectionHeader");
if(!isc.TImgSectionHeader)isc.defineClass("TImgSectionHeader","ImgSectionHeader");
if(!isc.TImgSectionHeader2)isc.defineClass("TImgSectionHeader2","TImgSectionHeader");
if(!isc.TButton)isc.defineClass("TButton","StretchImgButton");
if(!isc.TAutoFitButton)isc.defineClass("TAutoFitButton","TButton");
if(!isc.TMenuButton)isc.defineClass("TMenuButton","MenuButton");
if(!isc.TMenu)isc.defineClass("TMenu","Menu");
if(!isc.TTab)isc.defineClass("TTab","ImgTab")
if(!isc.TTabSet)isc.defineClass("TTabSet","TabSet")
if(!isc.TTreePalette)isc.defineClass("TTreePalette","TreePalette");
if(!isc.TEditTree)isc.defineClass("TEditTree","EditTree");
if(!isc.THTMLFlow)isc.defineClass("THTMLFlow","HTMLFlow");
if(!isc.TComponentEditor)isc.defineClass('TComponentEditor','ComponentEditor');
if(!isc.TDynamicForm)isc.defineClass('TDynamicForm','DynamicForm');
if(!isc.TLayout)isc.defineClass('TLayout','Layout');
if(!isc.TWindow)isc.defineClass("TWindow","Window");
if(!isc.TListGrid)isc.defineClass("TListGrid","ListGrid");
if(!isc.TTreeGrid)isc.defineClass("TTreeGrid","TreeGrid");
if(!isc.TListPalette)isc.defineClass('TListPalette','ListPalette');
if(!isc.TSaveFileDialog)isc.defineClass("TSaveFileDialog","SaveFileDialog");
if(!isc.TLoadFileDialog)isc.defineClass("TLoadFileDialog","LoadFileDialog");
isc.FormItem._commonCriteriaEditItemProps={
    init:function(){
        this.Super("init",arguments);
        this.updateState();
        if(!this.dataSource)this.observe(this.form,"itemChanged");
        if(!this.dataSource)this.observe(this.form,"valuesChanged");
        if(!this.dataSource&&this.targetRuleScope){
            this._ruleScopeDataSources=
                isc.Canvas.getAllRuleScopeDataSources(this.targetRuleScope,null,this.excludeAuthFromRuleScope);
        }
        if(!this.iconPrompt)this.iconPrompt="Edit criteria";
    },
    getDataSource:function(){
        var ds=this.dataSource;
        if(this.dataSource)return this.dataSource;
        if(!ds&&this.form){
            var values=this.form.getValues();
            if(values["dataSource"])ds=values["dataSource"];
            else if(values["optionDataSource"])ds=values["optionDataSource"];
        }
        if(ds&&isc.isA.String(ds))ds=isc.DS.get(ds);
        this._lastDS=ds;
        return ds;
    },
    destroy:function(){
        if(this.form){
            if(this.isObserving(this.form,"itemChanged"))this.ignore(this.form,"itemChanged");
            if(this.isObserving(this.form,"valuesChanged"))this.ignore(this.form,"valuesChanged");
        }
        if(this._ruleScopeDataSources){
            for(var i=0;i<this._ruleScopeDataSources.length;i++){
                var ds=this._ruleScopeDataSources[i];
                if(ds._tempScope){
                    ds.destroy();
                }
            }
        }
        this.Super("destroy",arguments);
    },
    itemChanged:function(){
        if(!this.destroyed)this.updateState();
    },
    valuesChanged:function(){
        if(!this.destroyed)this.updateState();
    },
    _editCriteria:function(criteria){
        if(!this.editorWindow)this.createEditorWindow();
        var builder=this.filterBuilder;
        builder.setDataSource(this.getDataSource());
        builder.setCriteria(criteria);
        builder.setTopOperatorAppearance(!criteria||
            isc.DataSource.canFlattenCriteria(criteria)?"radio":"bracket");
        this.editorWindow.show();
        builder.focus();
    },
    filterBuilderConstructor:isc.FilterBuilder,
    filterBuilderDefaults:{
        showModeSwitcher:true
    },
    editorWindowConstructor:isc.Window,
    editorWindowDefaults:{
        width:"80%",maxWidth:800,
        height:"50%",minHeight:300,maxHeight:800,
        canDragResize:true,
        autoCenter:true,isModal:true,showModalMask:true,
        title:"Define Criteria",
        bodyProperties:{layoutMargin:5,membersMargin:5}
    },
    instructionsConstructor:isc.HTMLFlow,
    instructionsDefaults:{
        width:"100%",
        isGroup:true,
        groupTitle:"Instructions",
        padding:5,
        contents:"Define field by field criteria below"
    },
    saveButtonText:"Save",
    clearButtonText:"Clear",
    _getCriteriaDescription:function(criteria,outputSettings){
        var ds=this.getDataSource();
        if(!ds&&this.createRuleCriteria)ds=this._ruleScopeDataSources;
        if(criteria==null||isc.isA.emptyObject(criteria))return;
        var form=this.form,
            localComponent=form.currentComponent?form.currentComponent.liveObject:null;
        if(localComponent&&isc.isA.FormItem(localComponent)){
            localComponent=localComponent.form;
        }
        var description=isc.DS.getAdvancedCriteriaDescription(criteria,ds,localComponent,
                                                                outputSettings);
        return!description||description==""?null:description;
    },
    createEditorWindow:function(){
        var currentComponent=this.creator.currentComponent,
            excludedRuleScope=[]
        ;
        if(isc.isA.FormItem(currentComponent.liveObject)){
            var form=currentComponent.liveObject.form,
                ds=form.dataSource
            ;
            if(isc.isA.String(ds))ds=isc.DataSource.get(ds);
            excludedRuleScope.add((ds?ds.getID()+".":form.ID+".values.")+currentComponent.name);
            currentComponent=form;
        }
        var _this=this,
            instructions=this.createAutoChild("instructions"),
            filterBuilderProperties={
                targetRuleScope:this.targetRuleScope,
                allowRuleScopeValues:this.allowRuleScopeValues,
                createRuleCriteria:this.createRuleCriteria,
                targetComponent:currentComponent,
                _ruleScopeDataSources:this._ruleScopeDataSources,
                excludedRuleScope:excludedRuleScope
            },
            filterBuilder=this.createAutoChild("filterBuilder",filterBuilderProperties),
            saveButton=isc.IButton.create({
                title:this.saveButtonText,
                _item:this,
                click:function(){
                    var criteria=_this.filterBuilder.getCriteria();
                    _this.editCriteriaReply(criteria);
                    this._item.editorWindow.closeClick();
                }
            }),
            clearButton=isc.IButton.create({
                title:this.clearButtonText,
                click:function(){
                    _this.filterBuilder.clearCriteria();
                    var criteria=_this.filterBuilder.getCriteria();
                    _this.editCriteriaReply(criteria);
                }
            }),
            buttonLayout=isc.HLayout.create({
                align:"right",
                layoutMargin:10,
                membersMargin:10,
                members:[clearButton,saveButton]
            })
        ;
        this.editorWindow=this.createAutoChild("editorWindow",{
            items:[instructions,filterBuilder,buttonLayout]
        });
        this.filterBuilder=filterBuilder;
    }
};
isc.defineClass("CriteriaItem","StaticTextItem");
isc.A=isc.CriteriaItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="*";
isc.A.wrap=false;
isc.A.clipValue=true;
isc.A.noDataSourceHoverText="Add a DataSource to enable criteria editing";
isc.A.emptyDisplayValue="[None]";
isc.A.noDataSourceDisplayValue="[N/A]";
isc.A.simplifySingleCriterion=true;
isc.A.icons=[{
        src:"[SKINIMG]actions/edit.png",
        click:"item.editCriteria()"
    }];
isc.B.push(isc.A.formatValue=function isc_CriteriaItem_formatValue(value,record,form,item){
        var formattedValue=this._getCriteriaDescription(value);
        if(formattedValue==null){
            var ds=this.getDataSource();
            if(!ds&&!this.createRuleCriteria)formattedValue=this.noDataSourceDisplayValue;
            else formattedValue=this.emptyDisplayValue;
        }
        return formattedValue;
    }
,isc.A.updateState=function isc_CriteriaItem_updateState(){
        var lastDS=this._lastDS,
            ds=this.getDataSource()
        ;
        if(ds||this.createRuleCriteria){
            this.enable();
        }else{
            this.disable();
        }
        if(lastDS!=null&&ds!=lastDS){
            this.storeValue(null,true);
        }
        this._lastDS=ds;
    }
,isc.A.itemHoverHTML=function isc_CriteriaItem_itemHoverHTML(item,form){
        return!this.getDataSource()&&!this.createRuleCriteria?
            this.noDataSourceHoverText:this.getDisplayValue();
    }
,isc.A.editCriteria=function isc_CriteriaItem_editCriteria(){
        var criteria=this.getValue();
        this._editCriteria(criteria);
    }
,isc.A.editCriteriaReply=function isc_CriteriaItem_editCriteriaReply(criteria){
        if(this.simplifySingleCriterion){
            if(criteria&&criteria.criteria&&criteria.criteria.length==1){
                criteria=criteria.criteria[0];
            }
        }
        if(criteria&&criteria.criteria&&criteria.criteria.isEmpty())criteria=null;
        this.storeValue(criteria,true);
    }
);
isc.B._maxIndex=isc.C+5;
isc.CriteriaItem.addProperties(isc.FormItem._commonCriteriaEditItemProps);

isc.defineClass("ExpressionItem","PopUpTextAreaItem");
isc.A=isc.ExpressionItem;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getActionTitle=function isc_c_ExpressionItem_getActionTitle(value,builder,showTarget){
        var actionTitle;
        if(isc.isAn.Array(value)){
            var displayVals=[];
            for(var i=0;i<value.length;++i){
                var val=value[i];
                if(isc.isA.StringMethod(val)){
                    if(val.value&&val.value.target&&val.value.name){
                        var action=val.value;
                        displayVals.add(builder.getActionTitle(action.target,action.name,showTarget));
                    }else{
                        displayVals.add(val.getDisplayValue());
                    }
                }else if(isc.isAn.Object(val)){
                    displayVals.add(builder.getActionTitle(val.target,val.name,showTarget));
                }
            }
            actionTitle=displayVals.join(", ");
        }else if(isc.isA.StringMethod(value)){
            if(value.value&&value.value.target&&value.value.name){
                var action=value.value;
                actionTitle=builder.getActionTitle(action.target,action.name,showTarget);
            }else{
                actionTitle=value.getDisplayValue();
            }
        }else if(isc.isA.Function(value)){
            if(value.iscAction){
                if(value.iscAction._constructor=="Process"){
                    actionTitle="[workflow]";
                }else{
                    if(isc.isAn.Array(value.iscAction)){
                        actionTitle=value.iscAction.map(function(action){
                            return builder.getActionTitle(action.target,action.name,showTarget);
                        }).join(", ");
                    }else{
                        actionTitle=builder.getActionTitle(value.iscAction.target,value.iscAction.name,showTarget);
                    }
                }
            }else{
                actionTitle=isc.Func.getBody(value);
            }
        }else if(value&&value._constructor=="Process"){
            actionTitle="[workflow]";
        }else if(value&&value.target&&value.name){
            actionTitle=builder.getActionTitle(value.target,value.name,showTarget);
        }
        return actionTitle;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.ExpressionItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.multiple=true;
isc.A.suppressMultipleComparisonWarning=true;
isc.A.textAreaWidth=400;
isc.A.showActionIcon=true;
isc.A.actionIconSrc="[SKIN]/actions/add.png";
isc.A.actionIconWidth=20;
isc.A.actionIconHeight=20;
isc.A.actionIconPosition=1;
isc.B.push(isc.A.mapValueToDisplay=function isc_ExpressionItem_mapValueToDisplay(value){
        var builder=this.creator.builder,
            actionTitle=isc.ExpressionItem.getActionTitle(value,builder)
        ;
        if(actionTitle)return actionTitle;
        else return this.Super("mapValueToDisplay",arguments);
    }
,isc.A.getValue=function isc_ExpressionItem_getValue(){
        var value=this.Super("getValue");
        if(isc.isA.Function(value)){
            return isc.Func.getBody(value);}
        else return value;
    }
,isc.A._setUpIcons=function isc_ExpressionItem__setUpIcons(){
        this.Super("_setUpIcons",arguments);
        if(this.showActionIcon){
            if(this.icons==null)this.icons=[];
            var position=this.actionIconPosition;
            this.icons.addAt({
                name:"action",
                src:this.actionIconSrc,
                showOver:false,
                canHover:true,
                hoverWrap:false,
                prompt:"Add action",
                width:this.actionIconWidth,
                height:this.actionIconHeight,
                click:function(form,item){
                    item.showActionMenu();
                    return false;
                }
            },position);
            this._setUpIcon(this.icons[position]);
        }
    }
,isc.A.updateAppearance=function isc_ExpressionItem_updateAppearance(newValue){
        this.setElementValue(this.mapValueToDisplay(newValue));
    }
,isc.A.showActionMenu=function isc_ExpressionItem_showActionMenu(){
        var currentStringMethods=[],
            value=this.getValue();
        if(isc.isA.Function(value)&&value.iscAction!=null){
            currentStringMethods.add(isc.StringMethod.create({value:value.iscAction}));
        }else if(isc.isA.StringMethod(value)){
            currentStringMethods.add(value);
        }else if(isc.isAn.Array(value)){
            for(var i=0;i<value.length;++i){
                var val=value[i];
                if(isc.isA.Function(val)&&val.iscAction!=null){
                    currentStringMethods.add(isc.StringMethod.create({value:val.iscAction}));
                }else if(isc.isA.StringMethod(val)){
                    currentStringMethods.add(val);
                }else if(isc.isAn.Object(val)){
                    currentStringMethods.add(isc.StringMethod.create({value:val}));
                }
            }
        }else if(isc.isAn.Object(value)){
            currentStringMethods.add(isc.StringMethod.create({value:value}));
        }
        var menu=this.actionMenu;
        if(menu==null){
            var item=this;
            menu=this.actionMenu=this.createAutoChild("actionMenu",{
                builder:this.creator.builder,
                sourceComponent:this.form.currentComponent,
                sourceMethod:this.name,
                components:this.form.allComponents,
                bindingComplete:function(bindings){
                    item._updateValue(bindings);
                }
            },"ActionMenu");
        }
        menu.currentStringMethods=currentStringMethods;
        menu.rawValue=this.Super("getValue");
        menu._showOffscreen();
        var iconRect=this.getIconPageRect(this.icons[1]);
        menu.placeNear(iconRect[0]+iconRect[2],
                       iconRect[1]+iconRect[3]);
        menu.show();
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("ActionMenuItem","StaticTextItem");
isc.A=isc.ActionMenuItem.getPrototype();
isc.A.canFocus=true;
isc.A.wrap=false;
isc.A.width=150;
isc.A.clipValue=true
;

isc.A=isc.ActionMenuItem.getPrototype();
isc.A.multiple=true;
isc.A.showActionIcon=true;
isc.A.actionIconSrc="[SKIN]/actions/add.png";
isc.A.actionIconWidth=20;
isc.A.actionIconHeight=20;
isc.A.mapValueToDisplay=isc.ExpressionItem.getPrototype().mapValueToDisplay;
isc.A.updateAppearance=isc.ExpressionItem.getPrototype().updateAppearance;
isc.A.actionIconPosition=0;
isc.A._setUpIcons=isc.ExpressionItem.getPrototype()._setUpIcons;
isc.A.showActionMenu=isc.ExpressionItem.getPrototype().showActionMenu
;

isc.defineClass("FormulaEditorItem","StaticTextItem");
isc.A=isc.FormulaEditorItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="*";
isc.A.wrap=false;
isc.A.clipValue=true;
isc.A.formulaVarsKey="formulaVars";
isc.A.emptyDisplayValue="[None]";
isc.A.icons=[{
        src:"[SKINIMG]actions/edit.png",
        prompt:"Edit formula fields",
        click:"item.editFormula()"
    }];
isc.A.editorWindowConstructor="Window";
isc.A.editorWindowDefaults={
        title:"Formula Editor",
        height:400,
        width:"80%",maxWidth:750,
        showMinimizeButton:false,
        showMaximizeButton:false,
        autoDraw:true,
        isModal:true,
        showModalMask:true,
        overflow:"visible",
        autoCenter:true,
        canDragResize:true,
        bodyProperties:{
            overflow:"visible"
        },
        headerIconProperties:{padding:1,
            src:"[SKINIMG]ListGrid/formula_menuItem.png"
        },
        closeClick:function(){
            this.items.get(0).completeEditing(true);
        }
    };
isc.A.formulaBuilderConstructor="FormulaBuilder";
isc.A.formulaBuilderDefaults={
        showTitleField:false,
        showAutoHideCheckBox:false,
        helpWindowDefaults:{minWidth:475},
        helpTextIntro:"Building a Formula<P>"+
            "The fields available when writing a formula are drawn from the widgets in your "+
            "Component Tree, such as ListGrids and DynamicForms, and from the set of all "+
            "DataSources linked to databound components in the Component Tree.  By looking "+
            "under the 'source' column for a given field, you can see beforehand what will "+
            "be inserted for you in the formula box if you click that row.<P></b>"+
            "For example, suppose you want population density from the record: "+
            "<b>{population:&nbsp;222000,&nbsp;area:&nbsp;200}</b>.<P>Your chosen formula "+
            "might look like:<ul>"+
            "<li><b>ListGrid0.selectedRecord.population / ListGrid0.selectedRecord.area</b> "+
            "if the record were the selected row of ListGrid0,"+
            "<li><b>DynamicForm0.values.population / DynamicForm0.values.area</b> if the "+
            "record were being edited by DynamicForm0, or"+
            "<li><b>countryDS.population / countryDS.area</b> if the record were "+
            "edited/selected in a databound component with DataSource CountryDS.</ul>"+
            "All of the above formulae generate the same result, <b>1110</b>, when applied "+
            "to the record.<P>"+
            "Note that if databound components are present, the above rules imply there may "+
            "be more than one way to refer to the same record.<P><b>"+
            "For basic arithmetic, type in symbols (+-/%) directly.<P>The following "+
            "functions are also available:",
        showSaveAddAnotherButton:false,
        allowBlankFormula:true,
        useMappingKeys:false,
        fireOnClose:function(){
            this.creator.userEditComplete(!this.cancelled);
        }
    };
isc.A.formulaBuilderProperties={
        formulaFormProperties:{titleOrientation:"top",numCols:1}
    };
isc.B.push(isc.A.destroy=function isc_FormulaEditorItem_destroy(){
        if(this._ruleScopeDataSources){
            for(var i=0;i<this._ruleScopeDataSources.length;i++){
                var ds=this._ruleScopeDataSources[i];
                if(ds._tempScope){
                    ds.destroy();
                }
            }
        }
        this.Super("destroy",arguments);
    }
,isc.A.formatValue=function isc_FormulaEditorItem_formatValue(value,record,form,item){
        if(value==null||value.text==null){
            return this.emptyDisplayValue;
        }
        var expandedFormula=value.text;
        if(!this.targetRuleScope){
            var vars=value[this.formulaVarsKey],
                keys=isc.getKeys(vars).sort()
            ;
            for(var i=0;i<keys.length;i++){
                var key=keys[i];
                expandedFormula=expandedFormula.replace(new RegExp(key,'g'),vars[key]);
            }
        }
        return expandedFormula;
    }
,isc.A.getBuilderProperties=function isc_FormulaEditorItem_getBuilderProperties(){
        var properties={
            dataSource:this.form.creator.dataSource,
            dataSources:this.form.creator.dataSources,
            mathFunctions:isc.MathFunction.getDefaultFunctionNames()
        };
        if(this.targetRuleScope){
            properties.targetRuleScope=this.targetRuleScope;
            properties.localComponent=this.component;
            properties.sourceFieldColumnTitle="Field";
            properties.sourceDSColumnTitle="Source";
        }else{
            properties.component=this.component;
        }
        return properties;
    }
,isc.A.editFormula=function isc_FormulaEditorItem_editFormula(){
        if(this.formulaBuilder==null){
            this.formulaBuilder=this.createAutoChild("formulaBuilder",
                this.getBuilderProperties()
            );
            this.editorWindow=this.createAutoChild("editorWindow",{items:[this.formulaBuilder]});
        }
        if(this.targetRuleScope&&this.getValue()!=null)this.formulaBuilder.setValue(this.getValue().text);
        else this.formulaBuilder.setValue("");
        this.editorWindow.show();
    }
,isc.A.userEditComplete=function isc_FormulaEditorItem_userEditComplete(saveValue){
        if(saveValue){
            var formulaObj=this.formulaBuilder.getBasicValueObject(),
                formula,
                vars;
            if(formulaObj!=null){
                formula=formulaObj.text;
                vars=formulaObj[this.formulaVarsKey];
            }
            if(formula!=null){
                var value={text:formula};
                if(vars!=null)value[this.formulaVarsKey]=vars;
                this.storeValue(value);
            }else{
                this.storeValue(null);
            }
            this.redraw();
        }
        this.editorWindow.clear();
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("SummaryEditorItem","FormulaEditorItem");
isc.A=isc.SummaryEditorItem.getPrototype();
isc.A.formulaVarsKey="summaryVars";
isc.A.formulaBuilderConstructor="SummaryBuilder";
isc.A.formulaBuilderDefaults={
        showTitleField:false,
        showAutoHideCheckBox:false,
        showSaveAddAnotherButton:false,
        builderTypeText:"Formula",
        helpWindowDefaults:{minWidth:475},
        helpTextIntro:"Building a Summary",
        getHoverText:function(){
            var output=isc.SB.create();
            output.append("<b>",this.helpTextIntro,"</b> <P>");
            output.append("<b>A summary combines dynamic values taken from available fields "+
                          "with static text specified by the user.  A dynamic value is "+
                          "specified by wrapping an available field source with #&zwj;{ }, "+
                          "while everything else is copied directly into the output.<P>"+
                          "The available fields are drawn from the widgets in your "+
                          "Component Tree, such as ListGrids and DynamicForms, and from the "+
                          "set of all DataSources linked to databound components in the "+
                          "Component Tree.  By looking under the 'source' column for a given "+
                          "field, you can see beforehand what will be inserted for you in "+
                          "the formula box if you click that row.<P></b>");
            output.append("For example, suppose you want a summary describing the diet of "+
                          "an animal for the record: "+
                          "<b>{commonName:&nbsp;'Alligator',&nbsp;diet:&nbsp;'Carnivore'}"+
                          "</b>.<P>Your chosen summary might look like:<ul>");
            output.append("<li>'<b>The #&zwj;{ListGrid0.selectedRecord.commonName} is a(n) "+
                          "#&zwj;{ListGrid0.selectedRecord.diet}</b>' if the record were the "+
                          "selected row of ListGrid0,"+
                          "<li>'<b>The #&zwj;{DynamicForm0.values.commonName} is a(n) "+
                          "#&zwj;{DynamicForm0.values.diet}</b>' if the record were being "+
                          "edited by DynamicForm0, or"+
                          "<li>'<b>The #&zwj;{animals.commonName} is a(n) "+
                          "#&zwj;{animals.diet}</b>' if the record were edited/selected in "+
                          "a databound component with DataSource animals.</ul>");
            output.append("All of the above summaries generate the same result, '<b>The "+
                          "Alligator is a(n) Carnivore</b>', when applied to the record.<P>"+
                          "Note that if databound components are present, the above rules "+
                          "imply there may be more than one way to refer to the same "+
                          "record.");
            return output.release(false);
        },
        allowBlankFormula:true,
        insertEscapedKeys:true,
        useMappingKeys:false,
        fireOnClose:function(){
            this.creator.userEditComplete(!this.cancelled);
        }
    };
isc.A.formulaBuilderProperties={
        formulaFormProperties:{titleOrientation:"top",numCols:1}
    }
;

isc.defineClass("ExpressionEditorItem","FormulaEditorItem");
isc.A=isc.ExpressionEditorItem.getPrototype();
isc.A.formulaVarsKey="summaryVars";
isc.A.formulaBuilderDefaults={
        showTitleField:false,
        showAutoHideCheckBox:false,
        showSaveAddAnotherButton:false,
        builderTypeText:"Formula",
        allowBlankFormula:true,
        insertEscapedKeys:true,
        useMappingKeys:false,
        fireOnClose:function(){
            this.creator.userEditComplete(!this.cancelled);
        }
    }
;

isc.ExpressionEditorItem.changeDefaults("formulaBuilderDefaults",{
    supportedFieldTypes:["integer","float","date"]
});isc.defineClass("DynamicPropertyEditorItem","TextItem");
isc.A=isc.DynamicPropertyEditorItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="*";
isc.A.wrap=false;
isc.A.clipValue=true;
isc.A.formulaVarsKey="formulaVars";
isc.A.summaryVarsKey="summaryVars";
isc.A.cancelButtonTitle="Cancel";
isc.A.saveButtonTitle="Save";
isc.A.icons=[{
        src:"[SKINIMG]DynamicForm/dynamic.png",
        hspace:0,
        height:18,width:18,
        prompt:"Edit dynamic property",
        click:"item.editProperty()"
    }];
isc.A.editorWindowConstructor="Window";
isc.A.editorWindowDefaults={
        ID:"dynPropEditorWindow",
        title:"Dynamic Property Editor",
        height:400,
        width:"80%",maxWidth:750,
        showMinimizeButton:false,
        showMaximizeButton:false,
        autoDraw:true,
        isModal:true,
        showModalMask:true,
        dismissOnEscape:true,
        overflow:"visible",
        autoCenter:true,
        canDragResize:true,
        isRuleScope:true,
        bodyProperties:{
            overflow:"visible"
        },
        headerIconProperties:{padding:1,
            src:"[SKINIMG]actions/dynamic.png"
        },
        closeClick:function(){
            this.creator.closeWindow(true);
        }
    };
isc.A.typeSelectorFormConstructor="DynamicForm";
isc.A.typeSelectorFormDefaults={
        ID:"dynPropTypeSelector",
        width:"100%",
        numCols:2,
        autoFocus:true
    };
isc.A.typePickerDefaults={
        name:"type",type:"radioGroup",showTitle:false,
        vertical:false,endRow:true,colSpan:2,
        redrawOnChange:true,
        changed:function(form,item,value){
            form.creator.typeChanged(value);
        }
    };
isc.A.dataPathPickerDefaults={
        name:"dataPath",type:"RuleScopeSelectItem",title:"Other field",
        showIf:"form.getValue('type') == 'DataPath'"
    };
isc.A.stringTypePickerValueMap={
        "DataPath":"Value in other field",
        "Text Formula":"Text format based on other fields",
        "Formula":"Math formula using other fields"
    };
isc.A.numericTypePickerValueMap={
        "DataPath":"Value in other field",
        "Formula":"Math formula using other fields"
    };
isc.A.formulaBuilderConstructor="FormulaBuilder";
isc.A.formulaBuilderDefaults={
        showTitleField:false,
        showAutoHideCheckBox:false,
        helpWindowDefaults:{minWidth:475},
        helpTextIntro:"Building a Formula<P>"+
        "The fields available when writing a formula are drawn from the widgets in your "+
        "Component Tree, such as ListGrids and DynamicForms, and from the set of all "+
        "DataSources linked to databound components in the Component Tree.  By looking "+
        "under the 'source' column for a given field, you can see beforehand what will "+
        "be inserted for you in the formula box if you click that row.<P></b>"+
        "For example, suppose you want population density from the record: "+
        "<b>{population:&nbsp;222000,&nbsp;area:&nbsp;200}</b>.<P>Your chosen formula "+
        "might look like:<ul>"+
        "<li><b>ListGrid0.selectedRecord.population / ListGrid0.selectedRecord.area</b> "+
        "if the record were the selected row of ListGrid0,"+
        "<li><b>DynamicForm0.values.population / DynamicForm0.values.area</b> if the "+
        "record were being edited by DynamicForm0, or"+
        "<li><b>countryDS.population / countryDS.area</b> if the record were "+
        "edited/selected in a databound component with DataSource CountryDS.</ul>"+
        "All of the above formulae generate the same result, <b>1110</b>, when applied "+
        "to the record.<P>"+
        "Note that if databound components are present, the above rules imply there may "+
        "be more than one way to refer to the same record.<P><b>"+
        "For basic arithmetic, type in symbols (+-/%) directly.<P>The following "+
        "functions are also available:",
        showButtonLayout:false,
        allowBlankFormula:true,
        useMappingKeys:false,
        visibility:"hidden"
    };
isc.A.formulaBuilderProperties={
        formulaFormProperties:{titleOrientation:"top",numCols:1}
    };
isc.A.summaryVarsKey="summaryVars";
isc.A.summaryBuilderConstructor="SummaryBuilder";
isc.A.summaryBuilderDefaults={
        showTitleField:false,
        showAutoHideCheckBox:false,
        showSaveAddAnotherButton:false,
        builderTypeText:"Formula",
        helpWindowDefaults:{minWidth:475},
        helpTextIntro:"Building a Summary",
        getHoverText:function(){
            var output=isc.SB.create();
            output.append("<b>",this.helpTextIntro,"</b> <P>");
            output.append("<b>A summary combines dynamic values taken from available fields "+
                    "with static text specified by the user.  A dynamic value is "+
                    "specified by wrapping an available field source with #&zwj;{ }, "+
                    "while everything else is copied directly into the output.<P>"+
                    "The available fields are drawn from the widgets in your "+
                    "Component Tree, such as ListGrids and DynamicForms, and from the "+
                    "set of all DataSources linked to databound components in the "+
                    "Component Tree.  By looking under the 'source' column for a given "+
                    "field, you can see beforehand what will be inserted for you in "+
            "the formula box if you click that row.<P></b>");
            output.append("For example, suppose you want a summary describing the diet of "+
                    "an animal for the record: "+
                    "<b>{commonName:&nbsp;'Alligator',&nbsp;diet:&nbsp;'Carnivore'}"+
            "</b>.<P>Your chosen summary might look like:<ul>");
            output.append("<li>'<b>The #&zwj;{ListGrid0.selectedRecord.commonName} is a(n) "+
                    "#&zwj;{ListGrid0.selectedRecord.diet}</b>' if the record were the "+
                    "selected row of ListGrid0,"+
                    "<li>'<b>The #&zwj;{DynamicForm0.values.commonName} is a(n) "+
                    "#&zwj;{DynamicForm0.values.diet}</b>' if the record were being "+
                    "edited by DynamicForm0, or"+
                    "<li>'<b>The #&zwj;{animals.commonName} is a(n) "+
                    "#&zwj;{animals.diet}</b>' if the record were edited/selected in "+
            "a databound component with DataSource animals.</ul>");
            output.append("All of the above summaries generate the same result, '<b>The "+
                    "Alligator is a(n) Carnivore</b>', when applied to the record.<P>"+
                    "Note that if databound components are present, the above rules "+
                    "imply there may be more than one way to refer to the same "+
            "record.");
            return output.release(false);
        },
        showButtonLayout:false,
        allowBlankFormula:true,
        insertEscapedKeys:true,
        useMappingKeys:false,
        visibility:"hidden"
    };
isc.A.summaryBuilderProperties={
        formulaFormProperties:{titleOrientation:"top",numCols:1}
    };
isc.A.buttonLayoutDefaults={_constructor:"HLayout",
        width:"100%",
        height:20,
        layoutMargin:10,
        membersMargin:10,
        align:"right"
    };
isc.A.cancelButtonDefaults={_constructor:"IButton",
        autoParent:"buttonLayout",
        click:function(){
            this.creator.closeWindow(true);
        }
    };
isc.A.saveButtonDefaults={_constructor:"IButton",
        autoParent:"buttonLayout",
        click:function(){
            this.creator.closeWindow();
        }
    };
isc.B.push(isc.A.destroy=function isc_DynamicPropertyEditorItem_destroy(){
        if(this._ruleScopeDataSources){
            for(var i=0;i<this._ruleScopeDataSources.length;i++){
                var ds=this._ruleScopeDataSources[i];
                if(ds._tempScope){
                    ds.destroy();
                }
            }
        }
        this.Super("destroy",arguments);
    }
,isc.A.formatEditorValue=function isc_DynamicPropertyEditorItem_formatEditorValue(value,record,form,item){
        var dynamicProperty;
        if(value&&isc.isA.DynamicProperty(value)){
            dynamicProperty=value.dataPath||value;
        }else if(form&&form.currentComponent&&form.currentComponent.liveObject){
            dynamicProperty=(form.currentComponent.liveObject.getDynamicProperty
                    ?form.currentComponent.liveObject.getDynamicProperty(item.name):null);
        }
        if(dynamicProperty!=null){
            if(isc.isA.String(dynamicProperty)){
                return"[DataPath: \""+dynamicProperty+"\"]";
            }
            if(dynamicProperty.dataPath){
                return"[DataPath: \""+dynamicProperty.dataPath+"\"]";
            }
            var formula=dynamicProperty.formula||dynamicProperty.textFormula,
                expandedFormula=(formula?formula.text:"")
            ;
            if(!this.targetRuleScope){
                var varsKey=(dynamicProperty.formula?this.formulaVarsKey:this.summaryVarsKey),
                    vars=formula[varsKey],
                    keys=isc.getKeys(vars).sort()
                ;
                for(var i=0;i<keys.length;i++){
                    var key=keys[i];
                    expandedFormula=expandedFormula.replace(new RegExp(key,'g'),vars[key]);
                }
            }
            return"["+(dynamicProperty.textFormula?"Text ":"")+"Formula: \""+expandedFormula+"\"]";
        }
        return value;
    }
,isc.A.getBuilderProperties=function isc_DynamicPropertyEditorItem_getBuilderProperties(){
        var properties={
            dataSource:this.form.creator.dataSource,
            dataSources:this.form.creator.dataSources,
            mathFunctions:isc.MathFunction.getDefaultFunctionNames()
        };
        if(this.targetRuleScope){
            properties.targetRuleScope=this.targetRuleScope;
            properties.localComponent=this.component;
            properties.sourceFieldColumnTitle="Field";
            properties.sourceDSColumnTitle="Source";
        }else{
            properties.component=this.component;
        }
        return properties;
    }
,isc.A.editProperty=function isc_DynamicPropertyEditorItem_editProperty(){
        delete this._suppressDynamicProperty;
        if(this.typeSelectorForm==null){
            var fields=[],
                valueMap=this.stringTypePickerValueMap
            ;
            if(this.type&&this.type.toLowerCase().indexOf("string")<0&&
                    this.type.toLowerCase().indexOf("url")<0)
            {
                valueMap=this.numericTypePickerValueMap;
            }
            fields.add(isc.addProperties({},this.typePickerDefaults,this.typePickerProperties,
                {valueMap:valueMap}));
            fields.add(isc.addProperties({},this.dataPathPickerDefaults,this.dataPathPickerProperties,
                    {targetRuleScope:this.targetRuleScope,targetComponent:this.component}));
            this.typeSelectorForm=this.createAutoChild("typeSelectorForm",{fields:fields});
            this.formulaBuilder=this.createAutoChild("formulaBuilder",
                this.getBuilderProperties()
            );
            this.summaryBuilder=this.createAutoChild("summaryBuilder",
                this.getBuilderProperties()
            );
            this.addAutoChild("buttonLayout");
            this.addAutoChild("cancelButton",{title:this.cancelButtonTitle});
            this.addAutoChild("saveButton",{title:this.saveButtonTitle});
            this.editorWindow=this.createAutoChild("editorWindow",{
                items:[this.typeSelectorForm,this.formulaBuilder,this.summaryBuilder,this.buttonLayout]
            });
        }
        this.formulaBuilder.setValue("");
        this.summaryBuilder.setValue("");
        var form=this.form;
        var dynamicProperty=(form&&form.currentComponent&&form.currentComponent.liveObject.getDynamicProperty
                ?form.currentComponent.liveObject.getDynamicProperty(this.name):this.getValue());
        if(!dynamicProperty){
            this.typeSelectorForm.setValues({type:"DataPath",dataPath:""});
        }else{
            if(isc.isA.String(dynamicProperty)){
                this.typeSelectorForm.setValues({type:"DataPath",dataPath:dynamicProperty});
            }else if(dynamicProperty.dataPath){
                this.typeSelectorForm.setValues({type:"DataPath",dataPath:dynamicProperty.dataPath});
            }else if(dynamicProperty.formula){
                this.typeSelectorForm.setValues({type:"Formula"});
                if(this.targetRuleScope){
                    var formulaText=dynamicProperty.formula.text;
                    formulaText=formulaText.replace(/\(([^\)]*)\)\.toString\(\)/,"$1");
                    this.formulaBuilder.setValue(formulaText);
                }
            }else if(dynamicProperty.textFormula){
                this.typeSelectorForm.setValues({type:"Text Formula"});
                if(this.targetRuleScope){
                    var formulaText=dynamicProperty.textFormula.text;
                    this.summaryBuilder.setValue(formulaText);
                }
            }else{
                this.typeSelectorForm.setValues({type:"DataPath",dataPath:""});
            }
        }
        if(this.fixedType){
            this.typeSelectorForm.setValue("type",this.fixedType);
            this.typeSelectorForm.hide();
        }
        this.typeChanged(this.typeSelectorForm.getValue("type"));
        this.editorWindow.show();
    }
,isc.A.closeWindow=function isc_DynamicPropertyEditorItem_closeWindow(cancel){
        if(!cancel){
            var type=this.typeSelectorForm.getValue("type");
            if(type=="DataPath"){
                var dataPath=this.typeSelectorForm.getValue("dataPath"),
                    prop=isc.DynamicProperty.create({name:this.name,dataPath:dataPath})
                ;
                this.storeValue(prop);
            }else if(type=="Formula"){
                var formula=this.getFormula(this.formulaBuilder,this.formulaVarsKey,true);
                var prop=isc.DynamicProperty.create({name:this.name,formula:formula});
                this.storeValue(prop);
            }else if(type=="Text Formula"){
                var formula=this.getFormula(this.summaryBuilder,this.summaryVarsKey),
                    prop=isc.DynamicProperty.create({name:this.name,textFormula:formula})
                ;
                this.storeValue(prop);
            }
            this.redraw();
        }
        this.editorWindow.clear();
    }
,isc.A.typeChanged=function isc_DynamicPropertyEditorItem_typeChanged(type){
        if(type=="Formula")this.formulaBuilder.show()
        else this.formulaBuilder.hide();
        if(type=="Text Formula")this.summaryBuilder.show()
        else this.summaryBuilder.hide();
    }
,isc.A.storeValue=function isc_DynamicPropertyEditorItem_storeValue(newValue,showValue){
        if(isc.isA.String(newValue)){
            var formattedValue=this.formatEditorValue(this.getValue(),null,this.form,this);
            if(newValue==formattedValue)return;
        }
        this.Super("storeValue",arguments);
    }
,isc.A.getFormula=function isc_DynamicPropertyEditorItem_getFormula(builder,varsKey,mathFormula){
        var formulaObj=builder.getBasicValueObject(),
            formula,
            vars
        ;
        if(formulaObj!=null){
            formula=formulaObj.text;
            vars=formulaObj[this.formulaVarsKey];
        }
        if(formula!=null){
            if(mathFormula&&this.type&&this.type.toLowerCase().indexOf("string")>=0){
                formula="("+formula+").toString()";
            }
            var value={text:formula};
            if(vars!=null)value[varsKey]=vars;
            return value;
        }
        return null;
    }
);
isc.B._maxIndex=isc.C+8;

isc.defineClass("RuleScopeSelectItem","SelectItem");
isc.A=isc.RuleScopeSelectItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.textMatchStyle="startsWith";
isc.A.hint="Choose a field";
isc.A.showHintInField=true;
isc.A.valueField="name";
isc.A.pickListProperties={
        showHeader:false,
        reusePickList:function(){return false;},
        formatCellValue:function(value,record,rowNum,colNum){
            return(record.enabled==false||this.multiDSFieldFormat=="qualified"?value:"&nbsp;&nbsp;"+value);
        }
    };
isc.A.multiDSFieldFormat="separated";
isc.B.push(isc.A.init=function isc_RuleScopeSelectItem_init(){
        var canvas=this.targetRuleScope,
            targetRuleScope=(isc.isA.String(canvas)?window[canvas]:this.targetRuleScope),
            targetComponent=this.targetComponent
        ;
        if(!this._ruleScopeDataSources){
            this._ruleScopeDataSources=isc.Canvas.getAllRuleScopeDataSources(targetRuleScope);
            this._destroyRuleScopeDataSources=true;
        }
        var ds=isc.Canvas.getMultiDSFieldDataSource(targetRuleScope,this._ruleScopeDataSources,targetComponent,this.excludedRuleScope,this.multiDSFieldFormat);
        var pathField=(this.multiDSFieldFormat=="separated"?"title":"name");
        this.optionDataSource=ds;
        this.displayField=pathField;
        this.pickListFields=[
            {name:"name",type:"text",hidden:(pathField!="name")},
            {name:"title",type:"text",hidden:(pathField!="title")}
        ];
        this.Super("init",arguments);
        this.ruleScopeDS=ds;
        this._targetRuleScope=targetRuleScope;
    }
,isc.A.destroy=function isc_RuleScopeSelectItem_destroy(){
        if(this.ruleScopeDS){
            this.ruleScopeDS.destroy();
        }
        if(this._ruleScopeDataSources&&this._destroyRuleScopeDataSources){
            for(var i=0;i<this._ruleScopeDataSources.length;i++){
                var ds=this._ruleScopeDataSources[i];
                if(ds._tempScope){
                    ds.destroy();
                }
            }
        }
        this.Super("destroy",arguments);
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("CheckboxDynamicPropertyItem","CheckboxItem");
isc.A=isc.CheckboxDynamicPropertyItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.dynamicValueHoverText="Checked when: ${critDesc} Click the checkbox to remove dynamic value and change to a fixed value";
isc.A.labelAsTitle=true;
isc.A.icons=[{
        src:"[SKINIMG]DynamicForm/dynamic.png",
        height:18,width:18,
        prompt:"Edit dynamic property",
        click:"item.editCriteria()"
    }];
isc.B.push(isc.A.updateState=function isc_CheckboxDynamicPropertyItem_updateState(){
        var lastDS=this._lastDS,
            ds=this.getDataSource()
        ;
        this.showIcons=ds||this.createRuleCriteria;
        if(this._getDynamicValue(this.getValue())&&lastDS!=null&&ds!=lastDS){
            this.storeValue(null,true);
        }
        this._lastDS=ds;
    }
,isc.A._getDynamicValue=function isc_CheckboxDynamicPropertyItem__getDynamicValue(value){
        if(isc.isAn.Instance(value))return value;
        var component=this.form&&this.form.currentComponent;
        if(component&&component.liveObject&&component.liveObject.getDynamicProperty){
            return component.liveObject.getDynamicProperty(this.name);
        }
    }
,isc.A._mapValue=function isc_CheckboxDynamicPropertyItem__mapValue(value,checkedValue,uncheckedValue,partialSelectedValue,unsetValue){
        if(this._getDynamicValue(value))return partialSelectedValue;
        return this.invokeSuper(isc.CheckboxDynamicPropertyItem,"_mapValue",value,
                                checkedValue,uncheckedValue,partialSelectedValue,unsetValue);
    }
,isc.A.itemHoverHTML=function isc_CheckboxDynamicPropertyItem_itemHoverHTML(){
        var dynamicProp=this._getDynamicValue(this.getValue());
        if(!dynamicProp)return;
        var criteria=isc.DS.simplifyAdvancedCriteria(dynamicProp.trueWhen,true);
        if(!criteria)return;
        var critDesc="<ul>"+this._getCriteriaDescription(criteria,{
            prefix:"<li>",suffix:"</li>"
        })+"</ul>";
        return this.dynamicValueHoverText.evalDynamicString(this,{critDesc:critDesc});
    }
,isc.A.editCriteria=function isc_CheckboxDynamicPropertyItem_editCriteria(){
        delete this._suppressDynamicProperty;
        var dynamicProperty=this._getDynamicValue()||this.getValue();
        var criteria=dynamicProperty&&dynamicProperty.trueWhen?
                                          dynamicProperty.trueWhen:dynamicProperty;
        if(!isc.DS.isAdvancedCriteria(criteria))criteria=null;
        this._editCriteria(criteria);
    }
,isc.A.editCriteriaReply=function isc_CheckboxDynamicPropertyItem_editCriteriaReply(criteria){
        if(criteria==null)criteria={};
        if(isc.isAn.Object(criteria)&&!isc.DS.isAdvancedCriteria(criteria)){
            criteria=isc.DS.convertCriteria(criteria);
        }
        var form=this.form,
            prop=isc.DynamicProperty.create({name:this.name,trueWhen:criteria});
        this.storeValue(prop,true);
    }
);
isc.B._maxIndex=isc.C+6;
isc.CheckboxDynamicPropertyItem.addProperties(isc.FormItem._commonCriteriaEditItemProps);

isc.defineClass("ValuesManagerChooserItem","SelectItem");
isc.A=isc.ValuesManagerChooserItem;
isc.A.CREATE_VM="_create_";
isc.A.LEAVE_VM="_leave_"
;

isc.A=isc.ValuesManagerChooserItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.separateSpecialValues=true;
isc.A.valueField="id";
isc.A.displayField="name";
isc.A.sortField="id";
isc.A.editorWindowConstructor="Window";
isc.A.editorWindowDefaults={
        ID:"vmChooserEditorWindow",
        title:"Create Values Manager",
        width:400,
        height:125,
        showMinimizeButton:false,
        showMaximizeButton:false,
        autoDraw:false,
        isModal:true,
        showModalMask:true,
        dismissOnEscape:true,
        autoCenter:true,
        closeClick:function(){
            this.creator.closeWindow(true);
        }
    };
isc.A.mainLayoutDefaults={_constructor:"VLayout",
        width:390,
        layoutMargin:10,
        membersMargin:10
    };
isc.A.nameFormDefaults={_constructor:"DynamicForm",
        autoParent:"mainLayout",
        width:"100%",
        wrapItemTitles:false
    };
isc.A.buttonLayoutDefaults={_constructor:"HLayout",
        autoParent:"mainLayout",
        width:"100%",
        height:30,
        membersMargin:10,
        align:"right"
    };
isc.A.cancelButtonDefaults={_constructor:"IButton",
        autoParent:"buttonLayout",
        title:"Cancel",
        click:function(){
            this.creator.closeWindow(true);
        }
    };
isc.A.saveButtonDefaults={_constructor:"IButton",
        autoParent:"buttonLayout",
        title:"Create",
        click:function(){
            this.creator.closeWindow();
        }
    };
isc.B.push(isc.A.init=function isc_ValuesManagerChooserItem_init(){
        this.specialValues=this.getSpecialValues();
        this._vmData=this.createValuesManagerData(this.getExistingValuesManagerNodes());
        this.Super("init",arguments);
    }
,isc.A.destroy=function isc_ValuesManagerChooserItem_destroy(){
        if(this._vmDataSource)this._vmDataSource.destroy();
        this.Super("destroy",arguments);
    }
,isc.A.change=function isc_ValuesManagerChooserItem_change(form,item,value,oldValue){
        if(value==isc.ValuesManagerChooserItem.CREATE_VM){
            this.createValuesManager();
            return false;
        }else if(value==isc.ValuesManagerChooserItem.LEAVE_VM){
            this.leaveValuesManager();
            return false;
        }
    }
,isc.A.getSpecialValues=function isc_ValuesManagerChooserItem_getSpecialValues(){
        var values={};
        values[isc.ValuesManagerChooserItem.CREATE_VM]="Create...";
        var vm=this.getValue();
        if(vm){
            if(!isc.isA.String(vm))vm=vm.getID();
            values[isc.ValuesManagerChooserItem.LEAVE_VM]="Leave current VM ("+vm+")";
        }
        return values;
    }
,isc.A.getOptionDataSource=function isc_ValuesManagerChooserItem_getOptionDataSource(){
        if(!this._vmDataSource){
            this._vmDataSource=isc.DS.create({
                clientOnly:true,
                fields:[
                    {name:"id",primaryKey:true},
                    {name:"name"}
                ],
                cacheData:this._vmData
            });
        }
        return this._vmDataSource;
    }
,isc.A.mapValueToDisplay=function isc_ValuesManagerChooserItem_mapValueToDisplay(value){
        var origValue=value;
        if(value!=null){
            if(!isc.isA.String(value))value=value.getID();
        }
        return value;
    }
,isc.A.getComponent=function isc_ValuesManagerChooserItem_getComponent(){
        return this.creator.currentComponent;
    }
,isc.A.getEditContext=function isc_ValuesManagerChooserItem_getEditContext(){
        var editor=this.creator,
            editNode=editor.currentComponent,
            currentComponent=editNode.liveObject,
            editContext=currentComponent.editContext
        ;
        return editContext;
    }
,isc.A.getExistingValuesManagerNodes=function isc_ValuesManagerChooserItem_getExistingValuesManagerNodes(){
        var editor=this.creator,
            editNode=editor.currentComponent,
            currentComponent=editNode.liveObject,
            editContext=currentComponent.editContext,
            tree=editContext.getEditNodeTree()
        ;
        var rootNode=editContext.getRootEditNode(),
            children=tree.getChildren(rootNode),
            vmNodes=[]
        ;
        for(var i=0;i<children.length;i++){
            var child=children[i];
            if(isc.isA.ValuesManager(child.liveObject)){
                vmNodes.add(child);
            }
        }
        return vmNodes;
    }
,isc.A.createValuesManagerData=function isc_ValuesManagerChooserItem_createValuesManagerData(editNodes){
        var data=[];
        for(var i=0;i<editNodes.length;i++){
            var node=editNodes[i];
            data.add({id:node.ID,name:node.ID});
        }
        return data;
    }
,isc.A.createNewValuesManagerName=function isc_ValuesManagerChooserItem_createNewValuesManagerName(){
        var component=this.getComponent(),
            baseName=component.ID+"VM",
            name=baseName,
            ds=this.getOptionDataSource(),
            data=ds.getCacheData()
        ;
        var index=1;
        while(window[name]!=null){
            name=baseName+index++;
        }
        return name;
    }
,isc.A.createValuesManager=function isc_ValuesManagerChooserItem_createValuesManager(){
        var defaultName=this.createNewValuesManagerName();
        var editorWindow=this.makeEditor(defaultName);
        editorWindow.show();
    }
,isc.A.leaveValuesManager=function isc_ValuesManagerChooserItem_leaveValuesManager(){
        this.delayCall("_leaveValuesManager",[]);
    }
,isc.A._leaveValuesManager=function isc_ValuesManagerChooserItem__leaveValuesManager(){
        this.storeValue(null);
        this.redraw();
    }
,isc.A.addValuesManagerToChoices=function isc_ValuesManagerChooserItem_addValuesManagerToChoices(name){
        var ds=this.getOptionDataSource(),
            data=ds.getCacheData()
        ;
        ds.updateCaches({
            operationType:"add",
            data:{id:name,name:name}
        })
    }
,isc.A.makeEditor=function isc_ValuesManagerChooserItem_makeEditor(defaultName){
        if(!this.mainLayout){
            this.mainLayout=this.createAutoChild("mainLayout");
            var fields=[
                {name:"name",type:"text",title:"Values Manager ID",required:true}
            ]
            this.addAutoChild("nameForm",{fields:fields});
            this.addAutoChild("buttonLayout");
            this.addAutoChild("cancelButton");
            this.addAutoChild("saveButton");
            this.editorWindow=this.createAutoChild("editorWindow",{
                items:[this.mainLayout]
            });
        }
        this.nameForm.setValues({name:defaultName});
        return this.editorWindow;
    }
,isc.A.closeWindow=function isc_ValuesManagerChooserItem_closeWindow(cancel){
        if(!cancel){
            var name=this.nameForm.getValue("name");
            var editContext=this.getEditContext(),
                rootNode=editContext.getRootEditNode(),
                component=this.getComponent(),
                paletteNode={
                    type:"ValuesManager",
                    defaults:{autoID:name}
                }
            ;
            if(component.liveObject&&component.liveObject.dataSource){
                var ds=component.liveObject.dataSource;
                if(!isc.isA.String(ds))ds=ds.ID;
                paletteNode.defaults.dataSource=ds;
            }
            var editNode=editContext.makeEditNode(paletteNode);
            editContext.addNode(editNode,rootNode);
            this.addValuesManagerToChoices(name);
            this.storeValue(name);
            this.redraw();
        }
        this.editorWindow.clear();
    }
);
isc.B._maxIndex=isc.C+17;

isc.defineClass("ClickStreamViewer","VLayout");
isc.A=isc.ClickStreamViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.defaultWidth=450;
isc.A.defaultHeight=200;
isc.A.eventGridDefaults={
        _constructor:"ListGrid",
        sortField:"eventTime",
        sortDirection:"descending",
        selectionType:"single",
        hoverAutoFitMaxWidth:"80%",
        showClippedValuesOnHover:true,
        defaultFields:[{
            name:"eventType",title:"Event Type",width:100
        },{
            name:"keyName",title:"Key Name(s)",hidden:true,width:100,
            formatCellValue:function(value,record,rowNum,colNum,grid){
                return record.keyNames||record.keyName;
            }
        },{
            name:"count",title:"Count",type:"integer",hidden:true,width:60
        },{
            name:"targetID",title:"Target Canvas",
            formatCellValue:function(value,record,rowNum,colNum,grid){
                return value?"["+record.targetClass+" ID: "+value+"]":"-";
            }
        },{
            name:"locator",title:"SmartClient Locator",hidden:true
        },{
            name:"fileName",title:"File Name",hidden:true
        },{
            name:"fileVersion",title:"File Version",hidden:true,width:160
        },{
            name:"fileType",title:"File Type",hidden:true,width:100
        },{
            name:"URL",hidden:true
        },{
            name:"eventTime",title:"Event Time",hidden:true,width:160,
            formatCellValue:function(value,record,rowNum,colNum,grid){
                return new Date(value).toNormalDate();
            }
        },{
            name:"_timeOffset",title:"Time Offset",width:150,
            formatCellValue:function(value,record,rowNum,colNum,grid){
                return isc.ClickStreamViewer.formatTimeOffset(value);
            }
        },{
            name:"errorTrace",title:"Error Trace",
            showValueIconOnly:true,showHover:true,hidden:true,
            hoverHTML:function(record){
                var errorTrace=record.errorTrace;
                return errorTrace?"<span style='white-space: pre'>"+errorTrace+"</span>":
                                    null;
            }
        }],
        _$errorIcon:"[SKIN]../../../../system/reference/skin/images/DocPrefsDialog/cancel.png",
        contentWindowConstructor:"ContentViewerWindow",
        contentWindowDefaults:{
            title:"Error Trace"
        },
        getValueIcon:function(field,value,record){
            return field.name=="errorTrace"&&value?this._$errorIcon:null;
        },
        canonicalizeStreamData:function(clickStreamData){
            if(clickStreamData==null)return;
            var startTime=clickStreamData.startTime.getTime(),
                lastErrorOffset=clickStreamData.lastErrorOffset,
                timeOffset,events=clickStreamData.events;
            for(var i=0,lastOffset=lastErrorOffset||0;i<events.length;
                 i++,lastOffset=timeOffset)
            {
                timeOffset=events[i].timeOffset;
                events[i].eventTime=timeOffset+startTime;
                events[i]._timeOffset=timeOffset-lastOffset;
            }
        },
        showLoadingDataMessage:function(){
            if(this._emptyMessage)return;
            this._emptyMessage=this.emptyMessage;
            this.emptyMessage=this.loadingDataMessage;
            this.setData([]);
        },
        setDataFromClickStream:function(clickStreamData){
            if(this._emptyMessage){
                this.emptyMessage=this._emptyMessage;
                delete this._emptyMessage;
            }
            this.canonicalizeStreamData(clickStreamData);
            this.setData(clickStreamData?clickStreamData.events.duplicate():[]);
        },
        selectionChanged:function(record){
            var debugTarget=window.debugTarget;
            if(!this.anySelected()||!this.creator.crossWindow||!debugTarget){
                return;
            }
            if(record&&record.targetID){
                debugTarget.call("isc.Log.hiliteCanvas",[record.targetID,true]);
            }
        },
        recordClick:function(viewer,record,recordNum,field){
            if(field.name!="errorTrace")return;
            if(!this.contentWindow)this.addAutoChild("contentWindow");
            this.contentWindow.showContent(record.errorTrace);
        }
    };
isc.A.streamPickerDefaults={
        _constructor:"DynamicForm",
        colWidths:[125,"*",70,5,110],numCols:5,
        updateStreamData:function(dropOrphanedData){
            var debugTarget=window.debugTarget;
            if(!debugTarget){
                this.logInfo("no cross-window DMI; skipping updating stream summaries",
                             "clickStreamViewer");
                return;
            }
            var form=this,
                viewer=form.creator;
            debugTarget.call("isc.ClickStream.getStreamValueMap",[],function(valueMap){
                var startTime=form.getValue("startTime");
                form.setValueMap("startTime",valueMap);
                form.markForRedraw("new stream state");
                if(!startTime&&!dropOrphanedData&&viewer.clickStream!=null){
                    return;
                }
                if(!startTime){
                    var select=form.getItem("startTime");
                    select.setUpPickList();
                    var first=select.pickList.getRecord(0);
                    startTime=first?first.startTime:null;
                    select.setValue(startTime);
                }
                if(!startTime||valueMap[startTime]){
                    viewer.loadClickStream(startTime);
                }
            });
        },
        initWidget:function(){
            this.Super("initWidget",arguments);
            this.updateStreamData();
        },
        items:[{
            name:"startTime",title:"Available ClickStreams",
            editorType:"SelectItem",type:"datetime",
            width:"100%",wrapTitle:false,
            sortField:"startTime",
            valueField:"startTime",
            displayField:"summary",
            addUnknownValues:false,
            pickListProperties:{},
            emptyDisplayValue:
                "<span style='text-align:center'>(no active stream selected)</span>",
            dateFormatter:"toLocaleString",
            pickListFields:[{
                name:"summary",type:"text",align:"left",width:"100%"
            }],
            init:function(){
                this.Super("init",arguments);
                this.makePickList();
            },
            changed:function(form){
                var record=this.getSelectedRecord();
                form.creator.loadClickStream(record.startTime);
            }
        },{
            name:"refresh",showTitle:false,
            icon:"[SKINIMG]/headerIcons/refresh.png",
            editorType:"ButtonItem",
            startRow:false,endRow:false,
            click:function(form,item){
                form.updateStreamData(true);
            }
        },{
            _$captureKey:"clickStream_capture",
            _$getCapture:"isc.ClickStream.getCommonStreamCapture",
            _$setCapture:"isc.ClickStream.setCommonStreamCapture",
            name:"capture",title:"Capture Events",
            editorType:"CheckboxItem",disabled:true,width:110,
            prompt:"Click to toggle capturing by the built-in ClickStream",
            init:function(){
                this.Super("init",arguments);
                var debugTarget=window.debugTarget,
                    capturing=isc.LogViewer.getGlobalLogCookieValue(this._$captureKey);
                if(isc.isA.Boolean(capturing)){
                    if(debugTarget)debugTarget.call(this._$setCapture,[capturing]);
                    this.setValue(capturing);
                    this.setDisabled(false);
                    return;
                }
                if(debugTarget){
                    var item=this;
                    debugTarget.call(this._$getCapture,[],function(capturing){
                        item.setValue(capturing);
                        item.setDisabled(false);
                    });
                }
            },
            changed:function(form,item,value){
                var debugTarget=window.debugTarget;
                if(debugTarget)debugTarget.call(this._$setCapture,[value]);
                isc.LogViewer.setGlobalLogCookieValue(this._$captureKey,value);
            }
        }]
    };
isc.B.push(isc.A.initWidget=function isc_ClickStreamViewer_initWidget(){
        this.Super("initWidget",arguments);
        if(this.showStreamPicker&&!this.crossWindow){
            this.logWarn("stream picker requires cross-window communications",
                         "clickStreamViewer");
            this.showStreamPicker=false;
        }
        if(this.showStreamPicker==null){
            this.showStreamPicker=!this.clickStream&&!!this.crossWindow;
        }
        this.addAutoChild("streamPicker",{
            viewer:this
        });
        this.addAutoChild("eventGrid",{
            viewer:this
        });
        if(this.clickStream)this.setClickStream(this.clickStream);
    }
,isc.A.updateStreamData=function isc_ClickStreamViewer_updateStreamData(){
        if(this.streamPicker)this.streamPicker.updateStreamData();
    }
,isc.A.setClickStream=function isc_ClickStreamViewer_setClickStream(clickStreamData){
        if(this.streamPicker)this.streamPicker.setValue("startTime",null);
        this._setClickStream(clickStreamData);
    }
,isc.A._setClickStream=function isc_ClickStreamViewer__setClickStream(clickStreamData){
        this.clickStream=clickStreamData;
        this.eventGrid.setDataFromClickStream(clickStreamData);
    }
,isc.A.loadClickStream=function isc_ClickStreamViewer_loadClickStream(startTime){
        if(startTime==null)this._setClickStream();
        var debugTarget=window.debugTarget;
        if(!this.crossWindow||!debugTarget){
            this.logWarn("loading clickStreamData by date requires cross-window DMI",
                         "clickStreamViewer");
            return;
        }
        var passedTime=startTime;
        if(!isc.isA.Date(startTime)){
            if(startTime==parseInt(startTime)){
                startTime=new Date(parseInt(startTime));
            }else if(isc.isA.String(startTime)){
                startTime=isc.DateUtil.parseSchemaDate(startTime);
            }
        }
        if(!isc.isA.Date(startTime)||!isFinite(startTime)){
            this.logWarn("can't load clickStreamDate - invalid date '"+passedTime+"'",
                         "clickStreamViewer");
            return;
        }
        this.eventGrid.showLoadingDataMessage();
        var viewer=this;
        debugTarget.call("isc.ClickStream.getClickStreamData",[startTime],function(csData){
            if(this.streamPicker&&this.streamPicker.getValue("startTime")==null){
                this.logInfo("setClickStreamData() called; dropping cross-window data");
                return;
            }
            viewer._setClickStream(csData);
        });
    }
);
isc.B._maxIndex=isc.C+5;

isc.A=isc.ClickStreamViewer;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.formatTimeOffset=function isc_c_ClickStreamViewer_formatTimeOffset(offset){
        if(offset<60000){
            var seconds=Math.floor(offset/1000),
                millis=offset%1000;
            return seconds+(seconds!=1?" seconds, ":" second, ")+
                millis+" millis";
        }
        var minutes=Math.floor(offset/60000),
            seconds=Math.floor((offset%60000)/1000);
        return minutes+"m, "+seconds+"s";
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("ContentViewerWindow","Window");
isc.A=isc.ContentViewerWindow.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="70%";
isc.A.height="60%";
isc.A.autoParent="none";
isc.A.autoCenter=true;
isc.A.isModal=true;
isc.A.contentFormDefaults={
        _constructor:"DynamicForm",
        numCols:1,width:"100%",height:"100%",
        items:[{
            name:"data",editorType:"TextAreaItem",
            width:"100%",height:"100%",
            showTitle:false,canEdit:false
        }]
    };
isc.B.push(isc.A.showContent=function isc_ContentViewerWindow_showContent(content){
        if(!this.contentForm){
            this.contentForm=this.createAutoChild("contentForm");
            this.addItem(this.contentForm);
        }
        this.contentForm.setValue("data",content);
        if(content)this.show();
        else this.hide();
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("DataSourceNavigatorDS","DataSource");
isc.A=isc.DataSourceNavigatorDS.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.clientOnly=true;
isc.A.dataProtocol="clientCustom";
isc.A.fields=[
        {name:"datasourceId",title:"ID",primaryKey:true},
        {name:"status",title:"Status",valueMap:["loaded","registered"],hidden:true},
        {name:"dataFormat",title:"Data Format",hidden:true},
        {name:"serverType",title:"Server Type",hidden:true},
        {name:"usesSCServerProtocol",title:"SC Protocol",type:"boolean",hidden:true},
        {name:"hasRestConstructor",title:"REST",type:"boolean",hidden:true},
        {
            name:"type",title:"Type",
            valueMap:{
                "sql":"SQLDataSource",
                "hibernate":"HibernateDataSource",
                "jpa":"JPA DataSource (2.0)",
                "jpa1":"JPA DataSource (1.0)",
                "json":"JSON DataSource",
                "rest":"REST DataSource",
                "wsdl":"WSDL DataSource",
                "xml":"XML DataSource",
                "dmi":"DMI DataSource",
                "client":"Client Only",
                "generic":"Custom Server DataSource"
            }
        }
    ];
isc.A.localDataCacheStatus=null;
isc.A.remoteDataCacheStatus=null;
isc.B.push(isc.A.inferTypeValue=function isc_DataSourceNavigatorDS_inferTypeValue(record){
        if(record.status==="registered"||!record.usesSCServerProtocol){
            if(record.clientOnly)record.type="client";
            if(record.hasRestConstructor)record.type="rest";
            if(record.serviceNamespace)record.type="wsdl";
            if(record.recordXPath
                &&!record.dataFormat)record.type="xml";
            if(record.type&&record.superClass){
                var valueMap=this.getField("type").valueMap;
                var display=valueMap[record.type]||record.type;
                record.type=record.superClass+" ("+display+")";
            }
            var result=record.type||record.serverType||record.dataFormat||"generic";
            record.type=result;
        }else{
          record.type=record.serverType;
        }
    }
,isc.A.initCacheData=function isc_DataSourceNavigatorDS_initCacheData(callback,fetchRemote){
        var that=this;
        var localDataArrivedCommand={
            execute:function(data,status){
                for(var i=0;i<data.length;i++){
                    var ds=data[i];
                    if(!ds){
                        continue;
                    }
                    var dataFormat=ds.dataFormat;
                    var hasDataUrl=ds.dataURL!=null;
                    var bindings=ds.operationBindings||[];
                    for(var j=0;j<bindings.length;j++){
                        var binding=bindings[j];
                        if(!dataFormat&&binding.dataFormat){
                            dataFormat=binding.dataFormat;
                        }
                        if(binding.dataURL){
                            hasDataUrl=true;
                        }
                    }
                    var superClass=null;
                    if(ds.getSuperClass
                        &&ds.getSuperClass().isA("DataSource")
                        &&ds.getClassName()!="RestDataSource"){
                        superClass=ds.getClassName();
                    }
                    if(ds.ID.startsWith("isc_")||
                         !ds.serverType&&!ds.clientOnly&&!hasDataUrl){
                        continue;
                    }
                    var record={
                        datasourceId:ds.ID,
                        status:"registered",
                        serverType:ds.serverType,
                        dataFormat:dataFormat,
                        usesSCServerProtocol:ds.serverType==="iscServer",
                        hasRestConstructor:isc.isA.RestDataSource(ds),
                        clientOnly:ds.clientOnly,
                        superClass:superClass
                    };
                    that.inferTypeValue(record);
                    var cache=that.getCacheData();
                    if(!cache){
                        cache=[];
                        that.setCacheData(cache);
                    }
                    var existing=cache.find("datasourceId",record.datasourceId);
                    if(existing){
                        cache.remove(existing);
                    }
                    cache.add(record);
                };
                that.localDataCacheStatus=status;
            }
        };
        var remoteDataArrivedCommand={
            execute:function(data,status){
                for(var i=0;i<data.length;i++){
                    var obj=data[i];
                    var record={
                        datasourceId:obj.dsName,
                        status:"loaded",
                        serverType:obj.dsType,
                        dataFormat:obj.dataFormat||"iscServer",
                        usesSCServerProtocol:obj.usesSCServerProtocol,
                        hasRestConstructor:obj.serverConstructor==="RestDataSource",
                        clientOnly:false
                    };
                    that.inferTypeValue(record);
                    var cache=that.getCacheData();
                    if(!cache){
                        cache=[];
                        that.setCacheData(cache);
                    }
                    var existing=cache.find("datasourceId",record.datasourceId);
                    if(!existing){
                        cache.add(record);
                    }
                };
                that.remoteDataCacheStatus=status;
            }
        };
        var observables=[
            {object:localDataArrivedCommand,method:"execute"}
        ];
        if(fetchRemote){
            observables.add(
                {object:remoteDataArrivedCommand,method:"execute"}
            );
        }
        isc.Page.waitForMultiple(observables,function(){
            callback.execute();
        });
        if(!window.debugTarget){
            var retVal=isc.DataSource.getRegisteredDataSourceObjects();
            localDataArrivedCommand.execute(retVal,isc.RPCResponse.STATUS_SUCCESS);
        }else{
            window.debugTarget.call("isc.DataSource.getRegisteredDataSourceObjects",[],
                function(retVal){
                    localDataArrivedCommand.execute(retVal,isc.RPCResponse.STATUS_SUCCESS);
                }
            );
        }
        if(fetchRemote){
            isc.DMI.call({
                appID:"isc_builtin",
                className:"com.isomorphic.tools.BuiltinRPC",
                methodName:"getDefinedDataSources",
                requestParams:{willHandleError:true,showPrompt:true},
                callback:function(rpcResponse,rawData,rpcRequest){
                    var status=rpcResponse.status;
                    if(status===-1){
                        isc.logWarn("Unable to obtain datasource listing from server: "+rawData);
                        remoteDataArrivedCommand.execute([],status);
                    }else{
                        remoteDataArrivedCommand.execute(rawData,status);
                    }
                }
            });
        }
    }
,isc.A.transformRequest=function isc_DataSourceNavigatorDS_transformRequest(dsRequest){
        var that=this;
        var onCacheInit={
            execute:function(){
                that.prepareResponse(dsRequest.unconvertedDSRequest||dsRequest);
            }
        };
        var criteria=dsRequest.data,
            fetchRemote=criteria&&criteria.status&&criteria.status!='registered';
        if(this.getCacheData()&&!this.getCacheData().isEmpty()){
            onCacheInit.execute();
        }else{
            isc.Page.waitFor(onCacheInit,"execute");
            this.initCacheData(onCacheInit,fetchRemote);
        }
    }
,isc.A.prepareResponse=function isc_DataSourceNavigatorDS_prepareResponse(dsRequest){
        var criteria=dsRequest.data,
            response={};
        response.data=this.applyFilter(this.getCacheData(),criteria,dsRequest);
        this.processResponse(dsRequest.requestId,response);
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("DataSourceNavigator","Canvas");
isc.A=isc.DataSourceNavigator.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.mode="devConsole";
isc.A.enumerationDataSourceName="isc_datasources";
isc.A.dashboardDataSourceName="isc_dashboards";
isc.A.dsNavigatorWindowConstructor=isc.Window;
isc.A.dsNavigatorWindowDefaults={
        showMinimizeButton:false,
        visibility:"hidden",
        title:""
    };
isc.A.dsNavigatorStackConstructor="DSNavigatorStack";
isc.A.dsEnumerationSectionTitle="DataSource List";
isc.A.dsEnumerationSectionItems=[
        "autoChild:dsEnumerationFilter",
        "autoChild:dsEnumerationGrid"
    ];
isc.A.dsDashboardSectionTitle="Dashboards";
isc.A.dsDashboardSectionItems=[
        "autoChild:dsDashboard"
    ];
isc.A.dsEnumerationFilterConstructor="DynamicForm";
isc.A.dsEnumerationFilterDefaults={
        colWidths:[100,"*"],
        fields:[
            {
                name:"radioGroup",title:"Show",type:"radioGroup",vertical:false,
                valueMap:{
                    "registered":"DataSources in current application",
                    "":"All DataSources"
                },
                changed:function(form,item,value){
                    var that=form.creator,
                        grid=that.dsEnumerationGrid,
                        ds=isc.DS.get(that.enumerationDataSourceName);
                    if(value!="registered"
                        &&ds.remoteDataCacheStatus!=isc.RPCResponse.STATUS_SUCCESS){
                            that.invalidateCache();
                    }
                    var criteria={
                        status:value
                    };
                    grid.fetchData(criteria);
                }
            }
        ],
        values:{radioGroup:"registered"}
    };
isc.A.dsEnumerationGridConstructor="DSEnumerationGrid";
isc.A.dsDashboardConstructor="DSDashboard";
isc.A.dsDashboardDefaults={
        paletteDataSourceNameField:"datasourceId",
        dashboardsProperties:{
            autoFitData:"vertical",
            autoFitMaxRecords:4
        },
        paletteProperties:{
            sortFieldNum:0,
            paletteNodeProperties:{
                deferCreation:true
            },
            init:function(){
                var dashboard=this.creator,
                    nav=dashboard.creator;
                this.paletteNodeProperties=isc.addProperties({},this.paletteNodeProperties,{
                    loadData:function(paletteNode,callback){
                        var dsName=this.defaults.dataSource;
                        nav.useDataSourceObject(dsName,function(ds){
                            paletteNode.isLoaded=true;
                            callback();
                        });
                    }
                });
                this.Super("init",arguments);
            }
        },
        initWidget:function(){
            this.Super("initWidget",arguments);
            var undef;
            this.palette.setDefaultEditContext(undef);
            this.editPane.setDefaultPalette(undef);
            var stack=this.creator.dsNavigatorStack;
            stack.observe(this.editButton,"click","observer.relocateDashboard()");
            stack.observe(this.viewButton,"click","observer.relocateDashboard()");
        }
    };
isc.A.dsContentSectionTitle="DataSource: ${dsId}";
isc.A.dsContentAuditedSectionTitle="Audit trail for DataSource ${dsId}";
isc.A.dsContentRecordAuditSectionTitle="Audit trail for record ${pkCrit} from DataSource ${dsId}";
isc.A.dsContentListGridConstructor="DSContentGrid";
isc.A.dsContentAuditListGridConstructor="DSContentGrid";
isc.A.dsContentAuditListGridDefaults={
        canEdit:false,
        canRemoveRecords:false,
        sortField:"audit_revision",
        sortDirection:"descending"
    };
isc.A.dsContentToolStripConstructor="DSContentToolStrip";
isc.A.dataSourceNavigatorDSConstructor="DataSourceNavigatorDS";
isc.B.push(isc.A.removeSection=function isc_DataSourceNavigator_removeSection(name){
        this.dsNavigatorStack.removeSection(name);
    }
,isc.A.invalidateCache=function isc_DataSourceNavigator_invalidateCache(){
        var grid=this.dsEnumerationGrid,
            ds=grid.getDataSource();
        var form=this.dsEnumerationFilter,
            item=form.getField('radioGroup');
        var dash=this.dsDashboard;
        var cb={
            execute:function(){
                if(item.getValue()!="registered"
                    &&ds.remoteDataCacheStatus!=isc.RPCResponse.STATUS_SUCCESS){
                        item.setValue("registered");
                        isc.warn(
                            "To work with DataSources other than those currently "+
                            "registered by this page, please enable the getDefinedDataSources "+
                            "RPC DMI BuiltIn as described in the 'Tools Deployment' "+
                            "documentation topic.");
                        return;
                }
                grid.invalidateCache();
                if(dash){
                    dash.palette.initCacheData();
                }
            }
        };
        var status=this.dsEnumerationFilter.values['radioGroup'];
        ds.initCacheData(cb,status!='registered');
    }
,isc.A.fetchAllDataSources=function isc_DataSourceNavigator_fetchAllDataSources(){
        var form=this.dsEnumerationFilter,
            item=form.getItem("radioGroup"),
            grid=this.dsEnumerationGrid,
            ds=grid.getDataSource(),
            dash=this.dsDashboard
        ;
        form.hide();
        item.setValue("");
        ds.initCacheData({
            execute:function(){
                grid.fetchData({status:""});
                if(dash){
                    dash.palette.initCacheData();
                }
            }
        },true);
    }
,isc.A.initWidget=function isc_DataSourceNavigator_initWidget(){
        var eds=isc.DS.get(this.enumerationDataSourceName);
        if(!eds){
            eds=this.createAutoChild("dataSourceNavigatorDS",{
                ID:this.enumerationDataSourceName
            });
        }
        var typeField=eds.getField("type");
        typeField.hidden=this.showDSType==false;
        var dds=isc.DS.get(this.dashboardDataSourceName);
        if(!dds){
            isc.OfflineDataSource.create({
                ID:this.dashboardDataSourceName,
                fields:[
                    {name:'id',type:"sequence",primaryKey:"true"},
                    {name:'description',type:"text"},
                    {name:'layout',type:"text"}
                ]
            });
        }
        this.dsEnumerationGridProperties={
            dataSource:this.enumerationDataSourceName
        };
        if(this.mode=="adminConsole"){
            isc.addProperties(this.dsEnumerationGridProperties,{
                autoFetchData:false
            });
            this.showDsEnumerationFilter=false;
        }
        this.dsDashboardProperties={
            dataSource:this.dashboardDataSourceName,
            paletteDataSource:this.enumerationDataSourceName
        };
        this.Super("initWidget",arguments);
        var window=this.addAutoChild("dsNavigatorWindow");
        var stack=this.addAutoChild("dsNavigatorStack",{
            sections:[{
                title:this.dsEnumerationSectionTitle,
                items:this.dsEnumerationSectionItems.duplicate(),
                expanded:true
            },{
                title:this.dsDashboardSectionTitle,
                items:this.dsDashboardSectionItems.duplicate()
            }]
        });
        if(this.mode=="adminConsole")this.fetchAllDataSources();
    }
,isc.A.useDataSourceObject=function isc_DataSourceNavigator_useDataSourceObject(id,func){
        var loadFirst=function(){
            isc.DataSource.loadWithParents(id,function(){
                func(isc.DataSource.getDataSource(id));
            });
        };
        var ds=isc.DataSource.getDataSource(id);
        if(ds){
            func(ds);
        }else if(!window.debugTarget){
            loadFirst();
        }else{
            window.debugTarget.call("isc.DataSource.getDataSource",[id],
                function(retVal){
                    if(retVal){
                        var cl=isc.DataSource.create(retVal);
                        func(cl);
                    }else{
                        loadFirst();
                    }
                }
            );
        }
    }
,isc.A.getShortDSId=function isc_DataSourceNavigator_getShortDSId(ds){
        return ds?ds.ID:null;
    }
,isc.A.getAuditDSInitialSort=function isc_DataSourceNavigator_getAuditDSInitialSort(auditedDS){
        if(auditedDS==null)return null;
        var bestSortName=auditedDS.getAuditRevisionFieldName(),
            fallbackName=auditedDS.getAuditTimeStampFieldName(),
            prop=bestSortName||fallbackName
        ;
        return prop?{property:prop,direction:"descending"}:null;
    }
);
isc.B._maxIndex=isc.C+7;

isc.defineClass("DSNavigatorStack","SectionStack");
isc.A=isc.DSNavigatorStack.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="100%";
isc.A.height="100%";
isc.A.overflow="auto";
isc.A.visibilityMode="multiple";
isc.A.refreshButtonConstructor=isc.ToolStripButton;
isc.A.refreshButtonDefaults={
        title:"Refresh",
        icon:"[SKINIMG]/actions/refresh.png",
        click:function(){
            var nav=this.creator.creator;
            nav.invalidateCache();
        }
    };
isc.A.closeButtonConstructor=isc.ImgButton;
isc.A.closeButtonDefaults={
        autoDraw:false,src:"[SKIN]actions/close.png",size:16,
        showFocused:false,showRollOver:false,showDown:false
    };
isc.A.auditButtonConstructor=isc.ToolStripButton;
isc.A.auditButtonDefaults={
        title:"Show Audit Trail"
    };
isc.B.push(isc.A._createSectionName=function isc_DSNavigatorStack__createSectionName(dataSource,keysObj,numericId){
        var name="_Section_";
        if(numericId!=null)name+=numericId+"_";
        name+=dataSource.ID;
        if(keysObj)for(var key in keysObj){
            name+="_"+keysObj[key];
        }
        return name;
    }
,isc.A.addDataSourceSection=function isc_DSNavigatorStack_addDataSourceSection(ds,auditedDS,keysObj,timeCrit){
        var name=this._createSectionName(ds,keysObj),
            nav=this.creator,
            audited=ds.audit,
            stack=this
        ;
        var initialCrit=keysObj&&timeCrit?isc.DS.combineCriteria(keysObj,timeCrit):
                          keysObj||timeCrit
        ;
        if(this.getSectionNumber(name)>=0){
            this.expandSection([name]);
            var sectionHeader=this.getSectionHeader(name),
                grid=sectionHeader.items[0];
            grid.invalidateCache();
            grid.setCriteria(initialCrit);
            return grid;
        }
        var shortDSId=nav.getShortDSId(ds),
            auditedId=nav.getShortDSId(auditedDS),
            title
        ;
        if(keysObj){
            var pkCrit=[];
            for(var key in keysObj){
                pkCrit.add(key+": "+keysObj[key]);
            }
            var pkField=auditedDS.getPrimaryKeyFieldName(),
                pkValue=keysObj[pkField]
            ;
            title=nav.dsContentRecordAuditSectionTitle.evalDynamicString(this,{
                dsId:auditedId,pkCrit:pkCrit,pkField:pkField,pkValue:pkValue
            });
        }else if(auditedDS){
            title=nav.dsContentAuditedSectionTitle.
                evalDynamicString(this,{dsId:auditedId});
        }else{
            title=nav.dsContentSectionTitle.evalDynamicString(this,{dsId:shortDSId});
        }
        var fields;
        if(keysObj){
            fields=[];
            for(var key in keysObj){
                fields.add({name:key,hidden:true,canHide:false});
            }
        }
        var gridAutoChildName=auditedDS?"dsContentAuditListGrid":"dsContentListGrid";
        var grid=nav.createAutoChild(gridAutoChildName,{
            dataSource:ds,
            fields:fields,
            initialCriteria:initialCrit,
            showHoverComponents:audited,canHover:audited,
            initialSort:nav.getAuditDSInitialSort(auditedDS)
        });
        if(auditedDS)grid.setHilites([{
            changedFieldsFieldName:auditedDS.getAuditChangedFieldsFieldName(),
            textColor:"red"
        }]);
        var strip=nav.createAutoChild("dsContentToolStrip",{
            dsContentListGrid:grid,
            showAddRecordButton:!auditedDS
        });
        var controls=[];
        if(audited){
            controls.add(this.createAutoChild("auditButton",{
                click:function(){
                    var dsName=ds.getAuditDataSourceID();
                    nav.useDataSourceObject(dsName,function(auditDS){
                        stack.addDataSourceSection(auditDS,ds);
                    },true);
                }
            }));
        }
        controls.add(this.createAutoChild("closeButton",{
            click:function(){
                stack.removeSection(name);
                stack.expandSection(0);
            }
        }));
        this.addSection({
            name:name,
            title:title,
            dataSource:ds,
            expanded:true,
            controls:controls,
            items:[grid,strip]
        },1);
        return grid;
    }
,isc.A.initWidget=function isc_DSNavigatorStack_initWidget(){
        this.Super("initWidget",arguments);
        if(this.creator.showDSListRefreshButton!=false){
            var refreshButton=this.createAutoChild("refreshButton");
            this.sections[0].controls=[refreshButton];
        }
    }
,isc.A.relocateDashboard=function isc_DSNavigatorStack_relocateDashboard(){
        var nav=this.creator,
            dash=nav.dsDashboard,
            stack=nav.dsNavigatorStack,
            window=nav.dsNavigatorWindow;
        var section=stack.sections[1];
        window.addItem(dash);
        window.maximize();
        window.show();
        var undo=function(){
            stack.addItem(section,dash,0);
            window.items=[];
            section.ignore(window,"close");
        };
        section.observe(window,"close",undo);
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("DSEnumerationGrid","ListGrid");
isc.A=isc.DSEnumerationGrid.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.sortField="datasourceId";
isc.A.showFilterEditor=true;
isc.A.autoFetchData=true;
isc.A.initialCriteria={
        status:"registered"
    };
isc.B.push(isc.A._addDataSourceSection=function isc_DSEnumerationGrid__addDataSourceSection(dsName,auditDS){
        var grid=this,
            nav=this.creator,
            stack=nav.dsNavigatorStack
        ;
        nav.useDataSourceObject(dsName,function(ds){
            if(auditDS)return stack.addDataSourceSection(auditDS,ds);
            var auditedName=ds.auditedDataSourceID;
            if(!auditedName)return stack.addDataSourceSection(ds);
            grid._addDataSourceSection(auditedName,ds);
        },true);
    }
,isc.A.recordClick=function isc_DSEnumerationGrid_recordClick(viewer,record,recordNum,field,fieldNum,value,rawValue){
        var dsName=record.datasourceId;
        viewer._addDataSourceSection(dsName);
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("DSContentGrid","ListGrid");
isc.A=isc.DSContentGrid.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.canEdit=true;
isc.A.hoverWidth="100%";
isc.A.autoFetchData=true;
isc.A.showFilterEditor=true;
isc.A.canMultiSort=true;
isc.A.canRemoveRecords=true;
isc.A.canAddFormulaColumns=true;
isc.A.canAddSummaryColumns=true;
isc.A.useAllDataSourceFields=true;
isc.A.auditFieldDefaults={
        name:"_auditField",
        _isAuditField:true,
        type:"icon",width:24,
        title:"Record History",
        cellIcon:"[SKIN]/RichTextEditor/text_align_justified.png",
        showDefaultContextMenu:false,
        selectCellTextOnClick:false,
        canEdit:false,
        canHide:false,
        canSort:false,
        canGroupBy:false,
        canFilter:false,
        showTitle:false,
        canExport:false,
        autoFitWidth:false,
        canDragResize:false,
        canAutoFitWidth:false,
        ignoreKeyboardClicks:true,
        showGridSummary:false,
        showGroupSummary:false,
        summaryValue:"&nbsp;"
    };
isc.A.dsRecordAuditPreviewConstructor="DSRecordAuditPreview";
isc.B.push(isc.A.initWidget=function isc_DSContentGrid_initWidget(){
        if(this.hasAuditedDS())this.setupAuditField();
        this.Super("initWidget",arguments);
    }
,isc.A.destroy=function isc_DSContentGrid_destroy(){
        var preview=this.dsRecordAuditPreview;
        if(preview)preview.destroy();
    }
,isc.A.resized=function isc_DSContentGrid_resized(){
        var preview=this.dsRecordAuditPreview;
        if(preview)preview.destroy();
    }
,isc.A.hasAuditedDS=function isc_DSContentGrid_hasAuditedDS(){
        var dataSource=this.getDataSource();
        return dataSource&&dataSource.audit;
    }
,isc.A.setupAuditField=function isc_DSContentGrid_setupAuditField(){
        var fields=this.fields=[],
            ds=this.getDataSource(),
            fieldNames=ds.getFieldNames(true)
        ;
        for(var i=0;i<fieldNames.length;i++){
            fields.add({name:fieldNames[i]});
        }
        fields.add(isc.addProperties({},this.auditFieldDefaults,
                                     this.auditFieldProperties));
        var nav=this.creator,
            ds=this.dataSource,
            grid=this
        ;
        var auditDSId=ds.getAuditDataSourceID();
        nav.useDataSourceObject(auditDSId,function(auditDS){
            grid.detailDS=auditDS;
        },true);
    }
,isc.A.cellHover=function isc_DSContentGrid_cellHover(record,rowNum,colNum){
        var field=this.getField(colNum);
        return!!field._isAuditField;
    }
,isc.A.getCellHoverComponent=function isc_DSContentGrid_getCellHoverComponent(record,rowNum,colNum){
        if(!this.detailDS){
            this.logInfo("no hover available; audit DS has not yet been loaded");
            return;
        }
        var preview=this.dsRecordAuditPreview,
            criteria=this.dataSource.filterPrimaryKeyFields(record)
        ;
        if(preview&&!preview.destroying&&!preview.destroyed){
            preview.recordAuditGrid.setCriteria(criteria);
            return preview;
        }
        return this.dsRecordAuditPreview=this.createAutoChild("dsRecordAuditPreview",{
            criteria:criteria,
            auditDS:this.detailDS,
            dataSource:this.dataSource,
            hoverAutoDestroy:false
        });
    }
,isc.A.recordClick=function isc_DSContentGrid_recordClick(viewer,record,recordNum,field,fieldNum){
        if(field._isAuditField&&this.detailDS){
            var stack=this.creator.dsNavigatorStack,
                criteria=this.dataSource.filterPrimaryKeyFields(record)
            ;
            stack.addDataSourceSection(this.detailDS,this.dataSource,criteria);
            return false;
        }
    }
,isc.A.applyHilite=function isc_DSContentGrid_applyHilite(hilite,data,fieldName){
        if(!hilite||!hilite.changedFieldsFieldName){
            return this.invokeSuper(isc.DSContentGrid,hilite,data,fieldName);
        }
        hilite=this.getHilite(hilite);
        var changedFieldsFieldName=hilite.changedFieldsFieldName;
        for(var i=0;i<data.length;i++){
            var changedFields=data[i][changedFieldsFieldName];
            if(!changedFields)continue;
            for(var j=0;j<changedFields.length;j++){
                var field=this.getField(changedFields[j]);
                this.hiliteRecord(data[i],field,hilite);
            }
        }
    }
);
isc.B._maxIndex=isc.C+9;

isc.defineClass("DSContentToolStrip","ToolStrip");
isc.A=isc.DSContentToolStrip.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.neverExpandHeight=true;
isc.A.exportButtonConstructor=isc.ToolStripButton;
isc.A.exportButtonDefaults={
        autoDraw:false,
        title:"Export",
        icon:"[SKINIMG]/actions/save.png",
        click:function(){
            var form=this.creator.exportTypeForm;
            var grid=this.creator.dsContentListGrid;
            var exportAs=form.getValue("exportType"),
                identifier=form.getValue("csvPropIdentifier");
            grid.exportClientData({
                exportAs:exportAs,exportPropertyIdentifier:identifier
            });
        }
    };
isc.A.exportTypeFormConstructor="DynamicForm";
isc.A.exportTypeFormDefaults={
        numCols:4,
        fields:[
            {
                name:"exportType",type:"select",width:"*",
                showTitle:false,
                redrawOnChange:true,
                defaultToFirstOption:true,
                valueMap:{
                    "csv":"CSV",
                    "xml":"XML",
                    "xls":"XLS (Excel97)",
                    "ooxml":"OOXML (Excel2007)"
                }
            },{
                name:"csvPropIdentifier",type:"radioGroup",
                vertical:false,wrap:false,showTitle:false,
                showIf:"form.getValue('exportType') == 'csv'",
                valueMap:{
                    title:"Use field titles",
                    name:"Use field names",
                    both:"Reify format (non-standard CSV)"
                },
                defaultValue:"title"
            }
        ]
    };
isc.A.refreshButtonConstructor=isc.ToolStripButton;
isc.A.refreshButtonDefaults={
        autoDraw:false,
        title:"Refresh",
        click:function(){
            var grid=this.creator.dsContentListGrid;
            grid.invalidateCache();
        }
    };
isc.A.refreshIcon="[SKINIMG]/actions/refresh.png";
isc.A.addRecordButtonConstructor=isc.ToolStripButton;
isc.A.addRecordButtonDefaults={
        autoDraw:false,
        title:"Add Record",
        icon:"[SKINIMG]/actions/add.png",
        click:function(){
            var grid=this.creator.dsContentListGrid;
            grid.startEditingNew();
        }
    };
isc.B.push(isc.A.initWidget=function isc_DSContentToolStrip_initWidget(){
        this.Super("initWidget",arguments);
        this.addAutoChild("refreshButton",{
            icon:this.refreshIcon
        });
        if(this.showAddRecordButton!=false){
            this.addMember("separator");
            this.addAutoChild("addRecordButton");
        }
        this.addMember("separator");
        this.addAutoChild("exportButton");
        this.addAutoChild("exportTypeForm");
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("DSRecordAuditPreview","VLayout");
isc.A=isc.DSRecordAuditPreview.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.border=1;
isc.A.overflow="visible";
isc.A.moveOccludingResize=true;
isc.A.recordAuditHeaderTitle="Recent changes for DataSource ${dsId}";
isc.A.recordAuditHeaderConstructor="Label";
isc.A.recordAuditHeaderDefaults={
        backgroundColor:"white",
        padding:5,height:1,overflow:"visible"
    };
isc.A.recordAuditGridConstructor="ListGrid";
isc.A.recordAuditGridDefaults={
        autoFetchData:true,
        autoFitMaxRecords:5,
        autoFitData:"vertical",
        bodyOverflow:"hidden",
        backgroundColor:"white",
        sortField:"audit_revision",
        sortDirection:"descending",
        emptyMessageHeight:44,height:1,
        dataProperties:{context:{showPrompt:false}},
        applyHilite:isc.DSContentGrid.getPrototype().applyHilite
    };
isc.A.recordAuditInfoTitle="Click to add audit information as a new section";
isc.A.recordAuditInfoConstructor="Label";
isc.A.recordAuditInfoDefaults={
        backgroundColor:"white",
        padding:5,height:1,overflow:"visible"
    };
isc.B.push(isc.A.initWidget=function isc_DSRecordAuditPreview_initWidget(){
        this.Super("initWidget",arguments);
        var ds=this.dataSource,
            masterGrid=this.creator,
            nav=masterGrid.creator
        ;
        this.setMembers([
            this.addAutoChild("recordAuditHeader",{
                contents:this.recordAuditHeaderTitle.evalDynamicString(this,{
                    dsId:nav.getShortDSId(ds)
                })
            }),
            this.addAutoChild("recordAuditGrid",{
                dataSource:this.auditDS,
                initialCriteria:this.criteria,
                initialSort:nav.getAuditDSInitialSort(ds),
                hilites:[{
                    changedFieldsFieldName:ds.getAuditChangedFieldsFieldName(),
                    textColor:"red"
                }]
            }),
            this.addAutoChild("recordAuditInfo",{
                contents:this.recordAuditInfoTitle
            })
        ]);
        this.recordAuditGrid.observe(masterGrid,"dataChanged","observer.invalidateCache()");
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.DataSource;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.sessionsDataBase="vbTeam";
isc.B.push(isc.A.loadDeploymentDS=function isc_c_DataSource_loadDeploymentDS(dsIds,deploymentId,callback,loadParents){
        var that=this,
            sandboxedDS=[]
        ;
        that.logInfo("Loading sandboxed version(s) of DataSource(s) "+dsIds+
                     " for deployment "+deploymentId);
        var sandboxContext=this._getSandboxContext(deploymentId);
        isc.DataSource.load(dsIds.duplicate(),function(sandboxedIds){
            that.logInfo("Loaded sandboxed version(s) of DataSource(s) "+dsIds+" as "+
                         sandboxedIds);
            for(var i=0;i<sandboxedIds.length;i++){
                var ds=isc.DataSource.getDataSource(sandboxedIds[i]);
                if(!ds){
                    that.logWarn("Unable to load the sandboxed version of DataSource "+
                                 dsIds[i]);
                    return;
                }
                sandboxedDS.add(ds);
                ds._updateForSandbox(dsIds[i],sandboxContext);
            }
            callback(sandboxedDS);
        },{
            sandboxContext:sandboxContext,
            loadParents:loadParents
        });
    }
,isc.A.getDeploymentDS=function isc_c_DataSource_getDeploymentDS(shortId,deploymentId,callback){
        var sandboxContext=this._getSandboxContext(deploymentId),
            dsId=this._getSandboxedID(shortId,sandboxContext)
        ;
        var ds=this.getDataSource(dsId);
        if(ds){
            if(callback)callback(ds);
            return ds;
        }
        var that=this;
        isc.DS.load(shortId,function(sandboxedIds){
            if(!sandboxedIds||!sandboxedIds.length){
                that.logWarn("Unable to load the sandboxed version of DataSource "+shortId);
                return;
            }
            ds=that.getDataSource(dsId);
            ds._updateForSandbox(shortId,sandboxContext);
            callback(ds);
        },{sandboxContext:sandboxContext});
    }
,isc.A._getSandboxContext=function isc_c_DataSource__getSandboxContext(deploymentId){
        return{
            dbName:this.sessionsDataBase,
            deploymentId:deploymentId
        };
    }
);
isc.B._maxIndex=isc.C+3;

isc.A=isc.DataSource.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getAuditDataSourceID=function isc_DataSource_getAuditDataSourceID(){
        return this.audit?this.auditDataSourceID||"audit_"+this.getShortId():null;
    }
,isc.A.getShortId=function isc_DataSource_getShortId(){
        return this._shortId||this.ID;
    }
,isc.A._updateForSandbox=function isc_DataSource__updateForSandbox(shortId,sandboxContext){
        this._shortId=shortId;
        if(this.inheritsFrom){
            var sandboxedParentId=isc.DS._getSandboxedID(this.inheritsFrom,sandboxContext);
            if(isc.DS.get(sandboxedParentId))this.inheritsFrom=sandboxedParentId;
        }
    }
,isc.A._indexFields=function isc_DataSource__indexFields(){
        var index=0,
            fields=this.getFields();
        for(var fieldName in fields){
            fields[fieldName]._fieldOrderIndex=index++;
        }
        this._fieldsIndexed=true;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("DeploymentManager","VLayout");
isc.A=isc.DeploymentManager.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="100%";
isc.A.height="100%";
isc.A.mainViewConstructor="TabSet";
isc.A.mainViewDefaults={
        width:"100%",
        height:"100%",
        tabSelected:function(tabNum,tabPane,ID,tab,name){
            if(isc.SA_Page.isLoaded())isc.History.addHistoryEntry(this.creator.ID+name);
        }
    };
isc.A.usersTitle="Users & Roles";
isc.A.usersPaneConstructor="DeploymentUsersAndRolesEditor";
isc.A.dataTitle="Data";
isc.A.dataPaneConstructor="DeploymentDSNavigator";
isc.A.dataPaneDefaults={
        showDSListRefreshButton:false,
        showDSType:false
    };
isc.A.usageTitle="Usage";
isc.A.usagePaneConstructor="DeploymentUsageViewer";
isc.A.headerConstructor="ToolStrip";
isc.A.logoConstructor="Img";
isc.A.logoDefaults={
        autoParent:"header",
        autoDraw:false,
        width:24,
        height:24,
        src:"../graphics/ReifyLogo.png",
        layoutAlign:"center"
    };
isc.A.deploymentTitleConstructor="DynamicForm";
isc.A.deploymentTitleDefaults={
        hiliteRequiredFields:false,
        autoParent:"header",
        autoDraw:false,
        height:26,
        minWidth:250,
        numCols:2,
        colWidth:["*","*"],
        canEdit:false,
        readOnlyDisplay:"static",
        showErrorStyle:false,
        selectOnClick:true,
        selectOnFocus:true,
        defaultItems:[
            {name:"fileName",title:"Managing Deployment",
                wrapTitle:false,
                titleStyle:"pageTitle",
                readOnlyTextBoxStyle:"pageTitle",
                width:"*",
                itemHoverHTML:function(item,form){
                    if(!form.canEdit)return"Double-click to rename deployment";
                },
                escapeHTML:false,
                formatValue:function(value,record,form,item){
                    return form.canEdit?value:value+" <i>("+record.fileType+")</i>";
                },
                shouldApplyStaticTypeFormat:function(){
                    return!this.canEdit;
                },
                hoverStyle:"darkHover",
                validateOnChange:true,
                doubleClick:function(){
                    if(!this.form.canEdit){
                        this.form.setCanEdit(true);
                        this.delayCall("selectValue");
                    }
                },
                keyPress:function(item,form,keyName){
                    var shouldSave=(keyName=="Enter"&&form.validate()),
                        shouldCancelEvent=false;
                    if(!shouldSave&&keyName=="Tab"){
                        if(!form.validate)shouldCancelEvent=true;
                        else shouldSave=true;
                    }
                    if(shouldSave&&form.valuesHaveChanged()){
                        form.setCanEdit(false);
                        form.saveData({
                            target:this,
                            methodName:"nameUpdated"
                        },{willHandleError:true});
                    }else if(keyName=="Escape"){
                        form.resetValues();
                        form.setCanEdit(false);
                    }
                    if(shouldCancelEvent)return false;
                },
                nameUpdated:function(response,data,request){
                    if(response.status==0){
                        this.form.creator.deploymentRenamed(data.fileName);
                    }else{
                        this.logWarn("Name updated failed:"+response.status);
                        if(response.status==-4)this.form.setCanEdit(true);
                        else{
                            isc.warn("Rename failed with the following error:<P>"+data);
                            this.form.resetValues();
                        }
                    }
                }
            }
        ],
        setCanEdit:function(canEdit){
            if(canEdit==this.canEdit)return;
            var shouldFixSize=canEdit,
                item=this.getItem(0);
            if(shouldFixSize){
                item.setWidth(this.getVisibleWidth()-item.getVisibleTitleWidth());
            }else{
                item.setWidth("*");
            }
            var _this=this;
            if(canEdit){
                this._outsideClickEvent=isc.Page.setEvent(
                    "click",function(){_this.clickDuringEdit()});
            }else if(this._outsideClickEvent){
                isc.Page.clearEvent("click",this._outsideClickEvent);
                delete this._outsideClickEvent;
            }
            return this.Super("setCanEdit",arguments);
        },
        clickDuringEdit:function(){
            if(isc.EH.getTarget()==this){
                var itemInfo=this._getEventTargetItemInfo(isc.EH.lastEvent);
                if(itemInfo.item==this.getItem(0)&&!itemInfo.overTitle)return;
            }
            if(!this.valuesHaveChanged())this.setCanEdit(false);
            else{
                if(!this.validate()){
                    this.getItem(0).focusInItem();
                }else{
                    this.setCanEdit(false);
                    this.saveData({
                        target:this.getItem(0),
                        methodName:"nameUpdated"
                    },{willHandleError:true});
                }
            }
        }
    };
isc.A.visitButtonConstructor="ToolStripButton";
isc.A.visitButtonDefaults={
        title:null,
        showRollOver:true,
        showRollOverIcon:true,
        getStateName:function(){
            return this.baseStyle;
        },
        autoApplyDownState:false,
        icon:"../graphics/visit.png",
        prompt:"Visit Deployment",
        hoverStyle:"darkHover",
        click:function(){
           this.creator.visitDeployment();
        }
    };
isc.A.removeButtonConstructor="Button";
isc.A.removeButtonTitle="Remove Deployment";
isc.A.removeButtonDefaults={
        dynamicContents:true,
        getTitle:function(){
            return this.creator.removeButtonTitle;
        },
        click:function(){
            this.creator.removeDeployment();
        }
    };
isc.B.push(isc.A.visitDeployment=function isc_DeploymentManager_visitDeployment(){
        var fileType=this.deploymentType,
            fileName=this.deploymentName,
            orgUrlFragment=this.orgUrlFragment;
        if(fileName==null||fileType==null||orgUrlFragment==null){
            isc.warn("Unable to open deployment");
            return;
        }
        var url=(location.origin+"").replace("create",fileType=="production"?"app":fileType)+"/";
        url+=orgUrlFragment+"/"+fileName+"/";
        window.open(url);
        isc.say("Deployment opened in new window");
    }
,isc.A.deploymentRenamed=function isc_DeploymentManager_deploymentRenamed(newName){
        this.deploymentName=newName;
    }
,isc.A.removeDeployment=function isc_DeploymentManager_removeDeployment(){
        var _this=this,
            dds=this.deploymentDataSource;
        if(dds!=null){
            isc.ask("Are you sure you want to remove this deployment?<P>"+
                "This operation is permanent and cannot be undone.",
            function(value){
                if(value){
                    isc.showPrompt("Removing deployment from the server",{showModalMask:true});
                    dds.removeData(
                        {id:_this.deploymentId},
                        {target:_this,methodName:"deploymentRemoved"}
                    );
                }
            },
            {title:"Remove Deployment?",showModalMask:true});
        }
    }
,isc.A.deploymentRemoved=function isc_DeploymentManager_deploymentRemoved(){
        this.countdownClose(5);
    }
,isc.A.countdownClose=function isc_DeploymentManager_countdownClose(remaining){
        if(remaining==0){
            window.close();
        }else{
            isc.showPrompt("Deployment successfully removed.<P>"+
                "This window will close in "+remaining+" seconds.",
                {showModalMask:true});
            this.delayCall("countdownClose",[remaining-1],1000);
        }
    }
,isc.A.initWidget=function isc_DeploymentManager_initWidget(){
        this.logo=this.createAutoChild("logo");
        this.deploymentTitle=this.createAutoChild("deploymentTitle",{
            dataSource:this.deploymentDataSource
        });
        this.deploymentTitle.editRecord({
            id:this.deploymentId,fileName:this.deploymentName,
            fileType:this.deploymentType
        });
        this.visitButton=this.createAutoChild("visitButton");
        this.removeButton=this.createAutoChild("removeButton");
        this.addAutoChild("header",{
            members:[
                this.logo,
                this.deploymentTitle,
                this.visitButton,
                isc.LayoutSpacer.create({width:"*"}),
                this.removeButton
            ]
        });
        this.usersPane=this.createAutoChild("usersPane");
        this.dataPane=this.createAutoChild("dataPane",{deploymentId:this.deploymentId});
        this.usagePane=this.createAutoChild("usagePane",{deploymentId:this.deploymentId});
        this.addAutoChild("mainView",
            {
                tabs:[{
                    title:this.usersTitle,pane:this.usersPane,name:"users"
                },{
                    title:this.dataTitle,pane:this.dataPane,name:"data"
                },{
                    title:this.usageTitle,pane:this.usagePane,name:"usage"
                }]
            }
        );
        this.Super("initWidget",arguments);
        var selectTabByHistoryId=function(){
            var historyId=isc.History.getCurrentHistoryId();
            if(!historyId||!historyId.startsWith(this.ID))return;
            var lastTabName=historyId.substring(this.ID.length);
            if(lastTabName)this.mainView.selectTab(lastTabName);
            else this.mainView.selectTab(0);
        };
        isc.History.registerCallback(selectTabByHistoryId.bind(this));
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("DeploymentUsersAndRolesEditor","VLayout");
isc.A=isc.DeploymentUsersAndRolesEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.usersDSID="hostedUsers";
isc.A.rolesDSID="hostedRoles";
isc.A.membersMargin=5;
isc.A.pendingEditsMessage="Changes have been made. Save before switching user(s)?";
isc.A.selectUsersTitle="Select Users";
isc.A.usersFormConstructor="DynamicForm";
isc.A.usersFormDefaults={
        height:1,overflow:"visible"
    };
isc.A.usersItemConstructor="MultiComboBoxItem";
isc.A.usersItemDefaults={
        name:"users",editorType:"MultiComboBoxItem",
        valueField:"userId",
        width:250,
        getDisplayValue:function(value){
            var displayValue="";
            if(value==null)return displayValue;
            var record=this.comboBox.getPickListRecordForValue(value);
            displayValue=this.form.creator.formatUserName(record);
            return displayValue;
        },
        comboBoxProperties:{
            pickListWidth:400,
            filterFields:[
                "userId","firstName","lastName","title"
            ],
            pickListFields:[
                {name:"userId"},
                {name:"firstName"},
                {name:"lastName"},
                {name:"title"}
            ]
        }
    };
isc.A.rolesGridTitle="Roles";
isc.A.rolesGridConstructor="ListGrid";
isc.A.rolesGridDefaults={
        showRollOver:false,
        selectionType:"none",
        showHeaderMenuButton:false,
        canReorderFields:false,
        canGroupBy:false,
        autoFetchData:true,
        dataFetchMode:"basic",
        useAllDataSourceFields:true,
        autoFitData:"vertical",
        canEdit:true,
        editEvent:"click",
        showNewRecordRow:true,
        canRemoveRecords:true,
        modalEditing:true,
        autoSaveEdits:false,
        listEndEditAction:"next",
        setSelectedUsers:function(users){
            this._selectedUsers=users;
            this._markBodyForRedraw();
            if(this.isDrawn())this.getFieldHeaderButton("userHasRole").markForRedraw();
        },
        initWidget:function(){
            this._pendingUserRoleChanges={};
            return this.Super("initWidget",arguments);
        },
        getSelectedStatusForRole:function(role){
            if(this._selectedUsers==null||this._selectedUsers.length==0){
                return"disabled";
            }
            var anySelected=false,allSelected=true;
            if(this._pendingUserRoleChanges[role]!=null){
                anySelected=allSelected=this._pendingUserRoleChanges[role];
            }else{
                for(var i=0;i<this._selectedUsers.length;i++){
                    if(this._selectedUsers[i].isSuperUser||
                        (this._selectedUsers[i].roles&&this._selectedUsers[i].roles.contains(role))
                    )
                    {
                        anySelected=true;
                    }else{
                        allSelected=false;
                    }
                }
            }
            return(allSelected?"selected":anySelected?"partial":"none");
        },
        getHasRoleFieldTitle:function(){
            var anySelected=false,
            allSelected=true,
            data=this.getData();
            if(data!=null&&this._selectedUsers!=null){
                var total=data.getLength();
                if(isc.ResultSet&&isc.isA.ResultSet(data)&&data.rangeIsLoaded(0,total)){
                    for(var i=0;i<total;i++){
                        var roleRecord=data.get(i),
                            roleSelectedStatus=this.getSelectedStatusForRole(roleRecord.name);
                        if(roleSelectedStatus=="selected"){
                            anySelected=true;
                        }else{
                            if(roleSelectedStatus=="partial"){
                                anySelected=true;
                            }
                            allSelected=false;
                        }
                    }
                }
            }
            var editedMarker=!isc.isAn.emptyObject(this._pendingUserRoleChanges)?"*":"&nbsp;";
            return this._getCheckboxValueIconHTML(
                    anySelected,(anySelected&&!allSelected),
                    true,this.isDisabled()||(this._selectedUsers==null),this
                )+editedMarker;
        },
        headerHoverHTML:function(fieldNum,defaultHTML){
            if(this.getField(fieldNum).name=="userHasRole"){
                if(!isc.isAn.emptyObject(this._pendingUserRoleChanges)){
                    return this.creator.editedUsersHaveRolesHeaderPrompt;
                }else{
                    return this.creator.usersHaveRolesHeaderPrompt;
                }
            }else return defaultHTML;
        },
        canEditCell:function(rowNum,colNum){
            var fieldName=this.getFieldName(colNum);
            if(fieldName=="name"){
                return rowNum>=this.data.getLength();
            }
            return this.Super("canEditCell",arguments);
        },
        allowRoleUpdates:true,
        fields:[
            {name:"userHasRole",prompt:this.roleSelectedPrompt,
                type:"text",
                width:40,
                formatCellValue:function(value,record,rowNum,colNum,grid){
                    var name=record.name,
                        roleStatus=grid.getSelectedStatusForRole(name),
                        disabled=roleStatus=="disabled",
                        allSelected=roleStatus=="selected",
                        someSelected=allSelected||roleStatus=="partial";
                    return grid._getCheckboxValueIconHTML(
                        someSelected,!allSelected,true,disabled||grid.isDisabled(),grid
                    );
                },
                showHover:true,
                hoverHTML:function(record,value,rowNum,colNum,grid){
                    if(record==null)return;
                    var name=record.name,
                        roleStatus=grid.getSelectedStatusForRole(name);
                    switch(roleStatus){
                        case"disabled":
                            return grid.creator.noSelectedUsersPrompt;
                        case"selected":
                            return grid.creator.usersHaveRolePrompt;
                        case"partial":
                            return grid.creator.partialUsersHaveRolePrompt;
                        default:
                            return grid.creator.noUsersHaveRolePrompt;
                    }
                },
                canDragResize:false,canHide:false,canReorder:false,
                canSort:false,canGroupBy:false,canEdit:false,
                recordClick:function(viewer,record,recordNum,field,fieldNum,value,rawValue){
                    if(record==null)record=viewer.getEditedRecord(recordNum);
                    if(viewer.allowRoleUpdates){
                        viewer.toggleUserRole(record);
                    }else{
                        isc.Hover.show(viewer.creator.noSelectedUsersPrompt);
                    }
                    return false;
                },
                getTitle:function(){
                    return this.grid.getHasRoleFieldTitle();
                }
            },
            {
                name:"name",required:true,
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
                    }
                ]
            }
        ],
        headerClick:function(field){
            field=this.getField(field);
            if(this.allowRoleUpdates&&field.name=="userHasRole"){
                this.toggleAllUserRoles();
            }else{
                return this.Super("headerClick",arguments);
            }
        },
        removeRecordClick:function(){
            this.Super("removeRecordClick",arguments);
            this.updateSaveButton();
        },
        toggleUserRole:function(record){
            if(this._selectedUsers==null||this._selectedUsers.length==0)return;
            if(this._pendingUserRoleChanges[record.name]!=null){
                this._pendingUserRoleChanges[record.name]=
                    !this._pendingUserRoleChanges[record.name];
            }else{
                var shouldAddRole=true;
                for(var i=0;i<this._selectedUsers.length;i++){
                    if(this._selectedUsers[i].isSuperUser||
                        (this._selectedUsers[i].roles&&
                         this._selectedUsers[i].roles.contains(record.name))
                    ){
                        shouldAddRole=false;
                        break;
                    }
                }
                this._pendingUserRoleChanges[record.name]=shouldAddRole;
            }
            this._markBodyForRedraw();
            this.getFieldHeaderButton("userHasRole").markForRedraw();
            this.updateSaveButton();
        },
        toggleAllUserRoles:function(){
            if(this._selectedUsers==null||this._selectedUsers.length==0)return;
            var roles=[],
                shouldSelect=true;
            for(var i=0;i<this.data.getLength();i++){
                var record=this.data.get(i);
                roles[i]=record.name;
                if(!shouldSelect)continue;
                if(this._pendingUserRoleChanges[roles[i]]!=null){
                    if(this._pendingUserRoleChanges[roles[i]]){
                        shouldSelect=false;
                    }
                }else{
                    for(var ii=0;ii<this._selectedUsers.length;ii++){
                        var user=this._selectedUsers[ii];
                        if(user.isSuperUser||
                            (user.roles&&user.roles.contains(roles[i])))
                        {
                            shouldSelect=false;
                            break;
                        }
                    }
                }
            }
            var editedVals={};
            for(var i=0;i<roles.length;i++){
                editedVals[roles[i]]=shouldSelect;
            }
            this._pendingUserRoleChanges=editedVals;
            this._markBodyForRedraw();
            this.getFieldHeaderButton("userHasRole").markForRedraw();
            this.updateSaveButton();
        },
        setFields:function(){
            var rv=this.Super("setFields",arguments),
                fields=this.getFields(),
                _this=this;
            for(var i=0;i<fields.length;i++){
                fields[i].changed=function(form,item,value,oldValue){
                    _this.updateSaveButton();
                };
            }
            return rv;
        },
        _clearEditValues:function(){
            var rv=this.Super("_clearEditValues",arguments);
            this.updateSaveButton();
            return rv;
        },
        updateSaveButton:function(){
            var hasChanges=this.hasChanges()||!isc.isAn.emptyObject(this._pendingUserRoleChanges);
            this.creator.discardButton.setDisabled(
                !hasChanges
            );
            this.creator.saveButton.setDisabled(
                !hasChanges
            );
            this.creator.duplicateButton.setDisabled(
                hasChanges||
                !(this.creator.selectedUsers&&this.creator.selectedUsers.length==1)
            );
        },
        discardAllChanges:function(){
            this._pendingUserRoleChanges={};
            this.discardAllEdits();
            this._markBodyForRedraw();
            this.getFieldHeaderButton("userHasRole").markForRedraw();
        },
        saveAllChanges:function(callback){
            this.creator.setSelectedUserRoles(this._pendingUserRoleChanges);
            this._pendingUserRoleChanges={};
            this.saveAllEdits(null,callback);
            this._markBodyForRedraw();
            this.getFieldHeaderButton("userHasRole").markForRedraw();
        }
    };
isc.A.usersHaveRolesHeaderPrompt="Roles for selected user(s)";
isc.A.editedUsersHaveRolesHeaderPrompt="Roles for selected user(s) [<i>Edited</i>]";
isc.A.noSelectedUsersPrompt="No selected user(s)";
isc.A.usersHaveRolePrompt="This role is currently assigned to selected user(s).";
isc.A.partialUsersHaveRolePrompt="This role is currently assigned to some but not all selected user(s).";
isc.A.noUsersHaveRolePrompt="This role is currently not assigned to selected user(s).";
isc.A.duplicateButtonConstructor="Button";
isc.A.duplicateButtonDefaults={
        title:"Apply Assigned Roles to other user[s]",
        canHover:true,
        showHover:true,
        hoverWidth:250,
        getHoverHTML:function(){
            var prompt="Copy roles from selected user to other user[s]";
            if(this.isDisabled()){
                if(this.creator.selectedUsers&&this.creator.selectedUsers.length==1
                    &&(this.creator.rolesGrid.hasChanges()||
                        !isc.isAn.emptyObject(this.creator.rolesGrid._pendingUserRoleChanges))
                ){
                    prompt+="<br>To enable, save edits";
                }else{
                    prompt+="<br>To enable, select a single user";
                }
            }
            return prompt;
        },
        overflow:"visible",
        disabled:true,
        click:function(){
            this.creator.showCopyUserRolesUI();
        }
    };
isc.A.addButtonConstructor="Button";
isc.A.addButtonDefaults={
        title:"Add Role",
        click:function(){
            this.creator.rolesGrid.startEditingNew();
        }
    };
isc.A.discardButtonConstructor="Button";
isc.A.discardButtonDefaults={
        title:"Discard Changes",
        disabled:true,
        click:function(){
            this.creator.rolesGrid.discardAllChanges();
        }
    };
isc.A.saveButtonConstructor="Button";
isc.A.saveButtonDefaults={
        title:"Save",
        disabled:true,
        click:function(){
            this.creator.rolesGrid.saveAllChanges(null,
                {target:this.creator,methodName:"rolesUpdated"});
        }
    };
isc.A.changeID=0;
isc.A.createUserButtonConstructor="Button";
isc.A.createUserButtonDefaults={
        title:"Create User",
        click:function(){
            this.creator.createUser();
        }
    };
isc.A.editUserButtonConstructor="Button";
isc.A.editUserButtonDefaults={
        title:"Edit User",
        disabled:true,
        click:function(){
            this.creator.editSelectedUser();
        }
    };
isc.A.changePasswordButtonTitle="Change Password";
isc.A.changePasswordButtonConstructor="Button";
isc.A.changePasswordButtonDefaults={
        disabled:true,
        click:function(){
            this.creator.showChangePasswordWindow();
        }
    };
isc.A.deleteUsersButtonConstructor="Button";
isc.A.deleteUsersButtonDefaults={
        title:"Delete User(s)",
        disabled:true,
        click:function(){
            this.creator.deleteSelectedUsers();
        }
    };
isc.A.userEditWindowConstructor="Window";
isc.A.userEditWindowDefaults={
        autoSize:true,
        isModal:true,
        showModalMask:true,
        autoCenter:true
    };
isc.A.userEditFormConstructor="DynamicForm";
isc.A.userEditFormDefaults={
        defaultItems:[
            {name:"userId",readOnlyDisplay:"static",validateOnExit:true},
            {name:"email",validateOnExit:true,
             validators:isc.Validator.getStandardEmailValidators()},
            {name:"firstName"},
            {name:"lastName"},
            {name:"title"},
            {name:"phoneNumber"},
            {name:"isSuperUser"},
            {name:"autoGenPwd",shouldSaveValue:false,title:"Auto-generate user password?",
             prompt:"Should the user password be automatically generated by the server "+
                "and emailed to the user?<br>"+
                "Deselect to enter a new password explicitly.",
             editorType:"CheckboxItem",defaultValue:true,
             showTitle:false,colSpan:2,
             changed:function(form,item,value){
                if(value){
                    form.getItem("password").clearValue();
                    form.getItem("password").clearErrors();
                    form.getItem("confirmPassword").clearValue();
                    form.getItem("confirmPassword").clearErrors();
                    form.getItem("password").setDisabled(true);
                    form.getItem("confirmPassword").setDisabled(true);
                }else{
                    form.getItem("password").setDisabled(false);
                    form.getItem("confirmPassword").setDisabled(false);
                }
             }
            },
            {name:"password",editorType:"password",title:"Password",disabled:true,
             validators:[{type:"requiredIf",expression:"!item.form.getValue('autoGenPwd')"}]},
            {name:"confirmPassword",editorType:"password",
                shouldSaveValue:false,title:"Confirm Password",
                requiredIf:"form.getValue('password' != null)",
                validators:[
                    {type:"requiredIf",expression:"!item.form.getValue('autoGenPwd')"},
                    {type:"matchesField",otherField:"password"}
                ],
                disabled:true
            }
        ],
        width:400
    };
isc.A.saveUserButtonTitle="Save";
isc.A.saveUserButtonConstructor="Button";
isc.A.saveUserButtonDefaults={
        layoutAlign:"center",
        click:function(){
            this.creator.userEditForm.saveData({target:this.creator,methodName:"saveUserCallback"});
        }
    };
isc.A.changePasswordTitle="Change User Password";
isc.A.changePasswordWindowConstructor="Window";
isc.A.changePasswordWindowDefaults={
        autoCenter:true,
        autoSize:true,
        isModal:true,
        showModalMask:true
    };
isc.A.changePasswordFormConstructor="DynamicForm";
isc.A.changePasswordFormDefaults={
        hiliteRequiredFields:false,
        wrapItemTitles:false,
        defaultItems:[
            {name:"autoGen",title:"Auto-generate new password?",
             prompt:"Should the new password be automatically generated by the server "+
                "and emailed to the user?<br>"+
                "Deselect to enter a new password explicitly.",
             editorType:"CheckboxItem",defaultValue:true,
             showTitle:false,colSpan:2,
             changed:function(form,item,value){
                if(value){
                    form.getItem("password").clearValue();
                    form.getItem("password").clearErrors();
                    form.getItem("confirmPassword").clearValue();
                    form.getItem("confirmPassword").clearErrors();
                    form.getItem("password").setDisabled(true);
                    form.getItem("confirmPassword").setDisabled(true);
                }else{
                    form.getItem("password").setDisabled(false);
                    form.getItem("confirmPassword").setDisabled(false);
                }
             }
            },
            {name:"password",editorType:"Password",
             title:"Enter Password",
             disabled:true,
             validators:[
                {type:"required",errorMessage:"Please enter a new password"}
             ]
            },
            {name:"confirmPassword",editorType:"Password",
             title:"Confirm Password",
             disabled:true,
             validators:[
                {type:"required",errorMessage:"Please verify the password by re-entering it here"},
                {type:"matchesField",otherField:"password",
                 validateOnChange:true,
                 errorMessage:"Passwords do not match"}
             ]
            }
        ]
    };
isc.A.resetUserPasswordConfirmationMessage="This action will generate a new password on the server and send it to the user via email.<br>"+
                                        "Proceed?";
isc.A.copyUserRolesTitle="Copy Roles";
isc.A.copyUserRolesWindowConstructor="ModalWindow";
isc.A.copyUserRolesWindowDefaults={
        showModalMask:true,isModal:true,
        clear:function(){
            this.creator.copyUserSourceGrid.setData([]);
            this.creator.copyUserTargetForm.clearValues();
            this.creator.copyTargetUserUI.setVisibility("hidden");
            return this.Super("clear",arguments);
        },
        close:function(){
            this.clear();
        }
    };
isc.A.copyUserRolesSourceGridConstructor="ListGrid";
isc.A.copyUserTargetItemTitle="Target user(s)";
isc.A.copyUserApplyButtonConstructor="Button";
isc.A.copyUserApplyButtonDefaults={
        overflow:"visible",
        title:"Apply roles to target user(s)",
        layoutAlign:"center",
        click:function(){
            this.creator.copyUserRoles();
        }
    };
isc.A.copyFromSuperUserWarningTitle="Copy user roles";
isc.A.copyFromSuperUserWarning="<b>Note: Copying user roles from super user will not copy superuser status</b><P>"+
                "This user is a superuser. Copying user roles from a super user will assign all "+
                "currently available roles to target user(s), but will not make them superusers.<br>"+
                "If additional roles are defined for this deployment in the future, "+
                "the target user(s) will not have access to them automatically.<P>"+
                "To make a user a superuser, set the superuser "+
                "flag on that user via 'Edit User' button (above).";
isc.A.targetUsersFetchID=0;
isc.A.copyWillRemoveWarning="Applying these roles would remove roles that users already have.  Proceed?";
isc.A.copyWillRemoveDialogConstructor="Dialog";
isc.A.copyWillRemoveDialogDefaults={
        icon:"[SKIN]ask.png",
        initWidget:function(){
            this.buttons=[
                isc.Button.create({title:"Proceed",isProceedButton:true}),
                isc.Button.create({title:"Cancel",isCancelButton:true}),
                isc.Button.create({title:"Add Roles Only",isAddRolesButton:true,
                    prompt:"Add roles only, don't remove roles"})
            ];
            return this.Super("initWidget",arguments);
        },
        buttonClick:function(button,index){
            this.clear();
            if(button.isCancelButton)return;
            this.creator.applyRolesToUsers(this.sourceRoles,button.isAddRolesButton);
        }
    };
isc.B.push(isc.A.loadSandboxedDataSources=function isc_DeploymentUsersAndRolesEditor_loadSandboxedDataSources(callback){
        var _this=this,
            viewer=this.creator;
        isc.DS.loadDeploymentDS([this.usersDSID,this.rolesDSID],viewer.deploymentId,
            function(dataSources){
                _this._usersDS=isc.DataSource.get(dataSources[0]);
                _this._usersDS.getField("roles").hidden=true;
                _this._rolesDS=isc.DataSource.get(dataSources[1]);
                _this.fireCallback(callback);
            });
    }
,isc.A.getUsersDS=function isc_DeploymentUsersAndRolesEditor_getUsersDS(){
        if(this._usersDS==null&&!this._warnedOnNoUsersDS){
            this._warnedOnNoUsersDS=true;
            this.logWarn("Users datasource load failed - check server logs");
        }
        return this._usersDS;
    }
,isc.A.getRolesDS=function isc_DeploymentUsersAndRolesEditor_getRolesDS(){
        if(this._rolesDS==null&&!this._warnedOnNoRolesDS){
            this._warnedOnNoRolesDS=true;
            this.logWarn("Users datasource load failed - check server logs");
        }
        return this._rolesDS;
    }
,isc.A.formatUserName=function isc_DeploymentUsersAndRolesEditor_formatUserName(record){
        var displayValue="";
        if(record==null)return displayValue;
        if(record.firstName)displayValue+=record.firstName+" ";
        if(record.lastName)displayValue+=record.lastName+" ";
        if(record.title)displayValue+="("+record.title+")";
        return displayValue;
    }
,isc.A.initWidget=function isc_DeploymentUsersAndRolesEditor_initWidget(){
        this.loadSandboxedDataSources({target:this,methodName:"buildUI"});
        return this.Super("initWidget",arguments);
    }
,isc.A.buildUI=function isc_DeploymentUsersAndRolesEditor_buildUI(){
        this.usersForm=this.createAutoChild("usersForm",{
            items:[
                isc.addProperties(
                    {editorType:this.usersItemConstructor},
                    this.usersItemDefaults,
                    {title:this.selectUsersTitle,
                        optionDataSource:this.getUsersDS(),
                        changed:function(form,item,value){
                            this.form.creator.updateSelectedUsers(value);
                        },
                        change:function(form,item,value,oldValue){
                            if(this.form.creator.warnOnPendingEdits(value))return false;
                        }
                    }
                )
            ]
        });
        this.createUserButton=this.createAutoChild("createUserButton");
        this.editUserButton=this.createAutoChild("editUserButton");
        this.changePasswordButton=this.createAutoChild("changePasswordButton",{
            title:this.changePasswordButtonTitle
        });
        this.deleteUsersButton=this.createAutoChild("deleteUsersButton");
        this.rolesGrid=this.createAutoChild("rolesGrid",{
            dataSource:this.getRolesDS()
        });
        this.addButton=this.createAutoChild("addButton");
        this.discardButton=this.createAutoChild("discardButton");
        this.saveButton=this.createAutoChild("saveButton");
        this.duplicateButton=this.createAutoChild("duplicateButton");
        this.setMembers([
            this.usersForm,
            isc.HLayout.create({
                height:1,
                membersMargin:5,
                members:[
                    this.createUserButton,
                    this.editUserButton,
                    this.changePasswordButton,
                    this.deleteUsersButton
                ]
            }),
            isc.Label.create({
                contents:this.rolesGridTitle,
                height:1,
                styleName:"headerItem"
            }),
            this.rolesGrid,
            isc.HLayout.create({
                height:1,
                membersMargin:5,
                members:[
                   this.duplicateButton,
                    isc.LayoutSpacer.create({
                        width:"*"
                    }),
                    this.addButton,
                    this.discardButton,
                    this.saveButton
                ]
            })
        ]);
    }
,isc.A.warnOnPendingEdits=function isc_DeploymentUsersAndRolesEditor_warnOnPendingEdits(newUser){
        if(this.rolesGrid.hasChanges()||!isc.isAn.emptyObject(this.rolesGrid._pendingUserRoleChanges)){
            var _this=this;
            isc.ask(this.pendingEditsMessage,
                function(value){
                    if(!value){
                        _this.rolesGrid.discardAllChanges();
                    }else{
                        _this.rolesGrid.saveAllChanges();
                    }
                    _this.usersForm.setValue("users",newUser);
                    _this.updateSelectedUsers(newUser);
                }
            );
            return true;
        }
    }
,isc.A.rolesUpdated=function isc_DeploymentUsersAndRolesEditor_rolesUpdated(){
        this.updateSaveButton();
    }
,isc.A.updateSelectedUsers=function isc_DeploymentUsersAndRolesEditor_updateSelectedUsers(userIds){
        if(userIds!=null&&!isc.isAn.Array(userIds))userIds=[userIds];
        this.editUserButton.setDisabled(!userIds||userIds.length!=1);
        this.changePasswordButton.setDisabled(!userIds||userIds.length!=1);
        this.deleteUsersButton.setDisabled(!userIds||userIds.length==0);
        this.duplicateButton.setDisabled(!userIds||userIds.length!=1);
        if(userIds==null||userIds.length==0){
            this.selectedUsers=[];
            this.rolesGrid.setSelectedUsers(this.selectedUsers.duplicate());
            return;
        }else{
            var changeID=++this.changeID;
            this.getUsersDS().fetchData(
                {userId:userIds},
                {target:this,methodName:"_fetchUsersByIdReply"},
                {clientContext:{changeID:changeID}}
            );
        }
    }
,isc.A._fetchUsersByIdReply=function isc_DeploymentUsersAndRolesEditor__fetchUsersByIdReply(dsResponse,data,dsRequest){
        if(dsResponse.clientContext.changeID!=this.changeID)return;
        this._updateSelectedUsers(data);
    }
,isc.A._updateSelectedUsers=function isc_DeploymentUsersAndRolesEditor__updateSelectedUsers(data){
        this.selectedUsers=data;
        if(data&&data.length>0){
            this.rolesGrid.setSelectedUsers(this.selectedUsers.duplicate());
        }
    }
,isc.A.getRolesForUser=function isc_DeploymentUsersAndRolesEditor_getRolesForUser(user,callback){
        var roles=user.roles;
        if(roles==null)roles=[];
        else if(isc.isAn.Array(roles))roles=roles.duplicate();
        else roles=[roles];
        if(user.isSuperUser){
            var allRoles=this.rolesGrid.data.getRange(0,this.rolesGrid.getTotalRows());
            for(var ii=0;ii<allRoles.length;ii++){
                var roleId=allRoles[ii].name;
                if(roles.indexOf(roleId)==-1){
                    roles.add(roleId);
                }
            }
        }
        roles.removeEmpty();
        return roles;
    }
,isc.A.setSelectedUserRoles=function isc_DeploymentUsersAndRolesEditor_setSelectedUserRoles(roleMappings){
        var users=this.selectedUsers;
        if(users==null||users.length==0)return;
        var wasQueuing=isc.RPCManager.startQueue();
        for(var i=0;i<users.length;i++){
            var user=users[i],
                updateSuperFlag=false,
                isSuperUser=user.isSuperUser,
                userRoles=this.getRolesForUser(user);
            for(var role in roleMappings){
                var add=roleMappings[role];
                if(add){
                    if(userRoles.indexOf(role)==-1){
                        userRoles.add(role);
                    }
                }else{
                    if(isSuperUser)updateSuperFlag=true;
                    userRoles.remove(role);
                }
            }
            if(isSuperUser){
                if(!updateSuperFlag)continue;
                else user.isSuperUser=false;
            }
            user.roles=userRoles;
            var callback=(i==users.length-1)
                    ?{target:this,methodName:"userRolesUpdated"}:null;
            this.getUsersDS().updateData(user,callback);
        }
        if(!wasQueuing)isc.RPCManager.sendQueue();
    }
,isc.A.userRolesUpdated=function isc_DeploymentUsersAndRolesEditor_userRolesUpdated(responses){
        this.updateSelectedUsers(this.usersForm.getValue("users"));
        this.rolesGrid.updateSaveButton();
    }
,isc.A.saveUserCallback=function isc_DeploymentUsersAndRolesEditor_saveUserCallback(dsResponse,data,dsRequest){
        this.userEditWindow.hide();
    }
,isc.A.createUserEditUI=function isc_DeploymentUsersAndRolesEditor_createUserEditUI(){
        this.userEditForm=this.createAutoChild("userEditForm",{
            dataSource:this.getUsersDS()
        });
        this.saveUserButton=this.createAutoChild("saveUserButton",{
            title:this.saveUserButtonTitle
        });
        this.userEditWindow=this.createAutoChild("userEditWindow",{
            items:[
                this.userEditForm,
                isc.LayoutSpacer.create({height:10}),
                this.saveUserButton
            ]
        });
    }
,isc.A.createUser=function isc_DeploymentUsersAndRolesEditor_createUser(){
        if(this.userEditWindow==null){
            this.createUserEditUI();
        }
        this.userEditForm.showItem("autoGenPwd");
        this.userEditForm.showItem("password");
        this.userEditForm.showItem("confirmPassword");
        this.userEditWindow.setTitle("Create user");
        this.userEditForm.clearErrors();
        this.userEditForm.getItem("userId").setCanEdit(true);
        this.userEditForm.editNewRecord();
        this.userEditWindow.show();
    }
,isc.A.editSelectedUser=function isc_DeploymentUsersAndRolesEditor_editSelectedUser(){
        if(this.userEditWindow==null){
            this.createUserEditUI();
        }
        this.userEditForm.hideItem("autoGenPwd");
        this.userEditForm.hideItem("password");
        this.userEditForm.hideItem("confirmPassword");
        this.userEditWindow.setTitle("Edit user");
        this.userEditForm.getItem("userId").setCanEdit(false);
        this.userEditForm.clearErrors();
        this.userEditForm.editRecord(this.selectedUsers[0]);
        this.userEditWindow.show();
    }
,isc.A.createChangePasswordUI=function isc_DeploymentUsersAndRolesEditor_createChangePasswordUI(){
        this.changePasswordForm=this.createAutoChild("changePasswordForm"),
        this.changePasswordWindow=this.createAutoChild("changePasswordWindow",
        {
            title:"Reset password for selected user",
            items:[
                this.changePasswordForm,
                isc.Button.create({
                    title:"Reset Password",
                    layoutAlign:"center",
                    builder:this,
                    click:function(){
                        var form=this.builder.changePasswordForm;
                        if(form.getValue("autoGen")){
                            this.builder.resetUserPassword();
                        }else{
                            if(!form.validate()){
                                return;
                            }
                            var password=form.getValue("password");
                            form.clearValues();
                            form.setValue("autoGen",true);
                            form.getItem("password").setDisabled(true);
                            form.getItem("confirmPassword").setDisabled(true);
                            this.builder.changeUserPassword(password);
                        }
                    }
                })
            ]
        });
    }
,isc.A.showChangePasswordWindow=function isc_DeploymentUsersAndRolesEditor_showChangePasswordWindow(){
        if(this.selectedUsers.length!=1)return;
        if(this.changePasswordWindow==null){
            this.createChangePasswordUI();
        }
        this.changePasswordWindow.show();
    }
,isc.A.changeUserPassword=function isc_DeploymentUsersAndRolesEditor_changeUserPassword(password){
        var record={
            password:password,
            userId:this.selectedUsers[0].userId
        };
        this.getUsersDS().updateData(
            record,
            {target:this,methodName:"passwordUpdated"},
            {showPrompt:true}
        );
    }
,isc.A.resetUserPassword=function isc_DeploymentUsersAndRolesEditor_resetUserPassword(){
        var _this=this,
            user=this.selectedUsers[0];
        isc.confirm(this.resetUserPasswordConfirmationMessage,
                    function(value){
                        if(!value)return;
                        var URL=isc.Auth.getPasswordResetURL(user);
                        if(URL==null){
                            _this.logWarn("Unable to determine password reset URL. Verify "+
                                "that isc.Authentication.resetPasswordURL has been populated.");
                            _this.changePasswordWindow.clear();
                            isc.warn("Unable to reset user password.");
                        }else{
                            isc.RPCManager.sendRequest(
                                {actionURL:URL,useSimpleHTTP:true,showPrompt:true},
                                {target:_this,methodName:"passwordUpdated"}
                            );
                        }
                    }
        );
    }
,isc.A.passwordUpdated=function isc_DeploymentUsersAndRolesEditor_passwordUpdated(){
        this.changePasswordWindow.clear();
        isc.say("Password updated");
    }
,isc.A.deleteSelectedUsers=function isc_DeploymentUsersAndRolesEditor_deleteSelectedUsers(){
        var confirmString;
        if(this.selectedUsers.length==1){
            var user=this.selectedUsers[0];
            confirmString="Delete user "+this.formatUserName(user);
        }else confirmString="Delete "+this.selectedUsers.length+" selected users?";
        isc.confirm(confirmString,
                {target:this,methodName:"_deleteSelectedUsers"},
                {title:"Confirm Delete"});
    }
,isc.A._deleteSelectedUsers=function isc_DeploymentUsersAndRolesEditor__deleteSelectedUsers(value){
        if(!value)return;
        isc.RPCManager.startQueue();
        for(var i=0;i<this.selectedUsers.length;i++){
            var user=this.selectedUsers[i];
            this.getUsersDS().removeData(user);
        }
        isc.RPCManager.sendQueue();
        this.usersForm.clearValues();
        this.updateSelectedUsers([]);
    }
,isc.A.showCopyUserRolesUI=function isc_DeploymentUsersAndRolesEditor_showCopyUserRolesUI(superUserWarningDisplayed){
        var sourceUser=this.selectedUsers[0];
        if(!superUserWarningDisplayed&&this.copyFromSuperUserWarning&&sourceUser.isSuperUser){
            var _this=this;
            isc.say(this.copyFromSuperUserWarning,
                function(){
                    _this.showCopyUserRolesUI(true);
                },
                {title:this.copyFromSuperUserWarningTitle}
            );
            return;
        }
        if(this.copyUserRolesWindow==null){
            this.copyUserRolesWindow=this.createAutoChild("copyUserRolesWindow",{
                title:this.copyUserRolesTitle
            });
            this.copyUserSourceGrid=this.createAutoChild("copyUserRolesSourceGrid",{
                canEdit:false,
                showRollOver:false,
                selectionType:"none",
                canGroupBy:false,
                dataSource:this.getRolesDS()
            });
            var usersItemConfig=isc.addProperties(
                {editorType:this.usersItemConstructor},
                this.usersItemDefaults,
                {title:this.copyUserTargetItemTitle,
                    optionDataSource:this.getUsersDS(),
                    changed:function(form,item,value){
                        this.form.creator.updateSelectedTargetUsers(value);
                    },
                    change:function(form,item,value,oldValue){
                        var selectedUser=this.comboBox.getSelectedRecord();
                        if(selectedUser.isSuperUser)return false;
                    }
                }
            );
            isc.addProperties(usersItemConfig.comboBoxProperties,
                {
                    getPickListFilterCriteria:function(){
                        var MCBI=this.form.creator,
                            selectedUser=MCBI.form.creator.selectedUsers[0];
                        return{
                            _constructor:"AdvancedCriteria",
                            operator:"notEqual",
                            fieldName:"userId",
                            value:selectedUser.userId
                        };
                    },
                    pickListProperties:{
                        recordIsEnabled:function(record,row,col){
                            if(record.isSuperUser)return false;
                            return this.Super("recordIsEnabled",arguments);
                        },
                        showHoverOnDisabledCells:true,
                        canHover:true,
                        cellHoverHTML:function(record,rowNum,colNum){
                            if(record.isSuperUser){
                                return"This user is a super-user and already has access to all roles.<br>"+
                                    " To remove super-user status, use the 'Edit User' option above";
                            }
                        }
                    }
                }
            );
            this.copyUserTargetForm=this.createAutoChild("usersForm",{
                items:[usersItemConfig]
            });
            this.copyUserTargetGrid=this.createAutoChild("rolesGrid",{
                showHeaderMenuButton:false,
                canEdit:false,
                allowRoleUpdates:false,
                canRemoveRecords:false,
                canEditRoles:false,
                dataSource:this.getRolesDS()
            });
            this.copyUserApplyButton=this.createAutoChild("copyUserApplyButton");
            this.copyTargetUserUI=isc.VLayout.create({
                membersMargin:5,
                visibility:"hidden",
                members:[
                    isc.Label.create({
                        height:1,padding:5,
                        contents:"Current Roles for target user(s).<br>"+
                                "(These will be replaced by roles from the selected user)"
                    }),
                    this.copyUserTargetGrid,
                    this.copyUserApplyButton
                ]
            });
            var _creator=this;
            this.copyUserRolesWindow.items=[
                isc.HLayout.create({
                    members:[
                        isc.VLayout.create({
                            members:[
                                isc.Label.create({
                                    padding:5,
                                    height:1,
                                    getSelectedUserTitle:function(){
                                        var user=_creator.selectedUsers[0];
                                        return user.firstName+" "+user.lastName+
                                            (user.title?" ("+user.title+")":"");
                                    },
                                    dynamicContents:true,
                                    contents:"Selected Roles for user ${this.getSelectedUserTitle()}"
                                }),
                                this.copyUserSourceGrid
                            ],
                            showResizeBar:true
                        }),
                        isc.VLayout.create({
                            members:[
                                this.copyUserTargetForm,
                                this.copyTargetUserUI
                            ]
                        })
                    ]
                })
            ];
        }
        var roleNames=this.getRolesForUser(this.selectedUsers[0]),
            allRoles=this.rolesGrid.data.getRange(0,this.rolesGrid.data.getLength()),
            sourceRoles=allRoles.findAll("name",roleNames);
        this.copyUserSourceGrid.setData(sourceRoles);
        this.copyUserRolesWindow.show();
    }
);
isc.evalBoundary;isc.B.push(isc.A.updateSelectedTargetUsers=function isc_DeploymentUsersAndRolesEditor_updateSelectedTargetUsers(userIds){
        if(userIds&&userIds.length>0){
            var targetUsersFetchID=++this.targetUsersFetchID;
            this.getUsersDS().fetchData(
                {userId:userIds},
                {target:this,methodName:"_fetchTargetUsersByIdReply"},
                {clientContext:{targetUsersFetchID:targetUsersFetchID}}
            );
        }else{
            this.copyUserTargetGrid.setSelectedUsers([]);
            if(this.copyTargetUserUI.isVisible()){
                this.copyTargetUserUI.hide();
            }
        }
    }
,isc.A._fetchTargetUsersByIdReply=function isc_DeploymentUsersAndRolesEditor__fetchTargetUsersByIdReply(dsResponse,data,dsRequest){
        if(dsResponse.clientContext.targetUsersFetchID!=this.targetUsersFetchID)return;
        if(data&&data.length>0){
            this.copyUserTargetGrid.setSelectedUsers(data.duplicate());
            if(!this.copyTargetUserUI.isVisible()){
                this.copyTargetUserUI.show();
            }
        }
    }
,isc.A.copyUserRoles=function isc_DeploymentUsersAndRolesEditor_copyUserRoles(){
        var targetUsers=this.copyUserTargetGrid._selectedUsers;
        if(!targetUsers||targetUsers.length==0){
            this.copyUserRolesWindow.clear();
            return;
        }
        var sourceUser=this.selectedUsers[0],
            sourceRoles=this.getRolesForUser(sourceUser),
            losingRoles=false;
        for(var i=0;i<targetUsers.length;i++){
            var targetUser=targetUsers[i],
                currentRoles=this.getRolesForUser(targetUser);
            if(currentRoles){
                if(sourceRoles.length<currentRoles.length){
                    losingRoles=true;
                }else{
                    for(var ii=0;ii<currentRoles.length;ii++){
                        if(sourceRoles.indexOf(currentRoles[ii])==-1){
                            losingRoles=true;
                            break;
                        }
                    }
                }
            }
            if(losingRoles)break;
        }
        if(losingRoles){
            if(this.copyWillRemoveDialog==null){
                this.copyWillRemoveDialog=this.createAutoChild(
                    "copyWillRemoveDialog",
                    {message:this.copyWillRemoveWarning}
                );
            }
            this.copyWillRemoveDialog.sourceRoles=sourceRoles;
            this.copyWillRemoveDialog.show();
        }else{
            this.applyRolesToUsers(sourceRoles);
        }
    }
,isc.A.applyRolesToUsers=function isc_DeploymentUsersAndRolesEditor_applyRolesToUsers(roles,addToExisting){
        var targetUsers=this.copyUserTargetGrid._selectedUsers;
        if(!targetUsers||targetUsers.length==0||
            (addToExisting&&(roles==null||roles.length==0)))
        {
            this.copyUserRolesComplete();
            return;
        }
        var updatedUserRecords=[];
        for(var i=0;i<targetUsers.length;i++){
            var targetUser=targetUsers[i],
                currentRoles=targetUser.roles,
                rolesForUser=roles==null?roles:roles.duplicate();
            var rolesHaveChanged=false;
            if(addToExisting&&targetUser.roles!=null){
                for(var ii=0;ii<currentRoles.length;ii++){
                    if(!rolesForUser.contains(currentRoles[ii])){
                        rolesForUser.add(currentRoles[ii]);
                    }
                }
            }
            var wasEmpty=currentRoles==null||currentRoles.length==0,
                isEmpty=rolesForUser==null||rolesForUser.length==0;
            if(wasEmpty&&isEmpty)continue;
            if(wasEmpty||isEmpty||(currentRoles.length!=rolesForUser.length)){
                rolesHaveChanged=true;
            }else{
                for(var ii=0;ii<currentRoles.length;ii++){
                    if(!rolesForUser.contains(currentRoles[ii])){
                        rolesHaveChanged=true;
                        break;
                    }
                }
            }
            if(rolesHaveChanged){
                targetUser.roles=rolesForUser;
                updatedUserRecords.add(targetUser);
            }
        }
        if(updatedUserRecords.length>0){
            var wasQueuing=isc.RPCManager.startQueue();
            for(var i=0;i<updatedUserRecords.length;i++){
                var callback=
                    (i==updatedUserRecords.length-1)?
                        {target:this,methodName:"copyUserRolesComplete"}:null;
                this.getUsersDS().updateData(
                    updatedUserRecords[i],callback
                );
            }
            if(!wasQueuing)isc.RPCManager.sendQueue();
        }else{
            this.copyUserRolesComplete();
        }
    }
,isc.A.copyUserRolesComplete=function isc_DeploymentUsersAndRolesEditor_copyUserRolesComplete(){
        this.copyUserRolesWindow.clear();
    }
);
isc.B._maxIndex=isc.C+31;

isc.defineClass("DeploymentDSNavigator","DataSourceNavigator");
isc.A=isc.DeploymentDSNavigator.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.dsEnumerationSectionItems=["autoChild:dsEnumerationGrid"];
isc.A.dsEnumerationGridDefaults={
        initialCriteria:null
    };
isc.A.dsContentToolStripDefaults={
        refreshIcon:"[SKINIMG]/headerIcons/refresh.png"
    };
isc.A.dataSourceNavigatorDSDefaults={
        dataSourcesDS:"hostedDataSources",
        dataProtocol:null,
        transformRequest:function(request){
            return request.data;
        },
        cacheConvertedRecords:function(serverDSRecords){
            var cache=[];
            for(var i=0;i<serverDSRecords.length;i++){
                var serverRecord=serverDSRecords[i];
                var cacheRecord={
                    datasourceId:serverRecord.fileName,
                    serverType:serverRecord.fileType,
                    dataFormat:serverRecord.fileFormat||"iscServer",
                    usesSCServerProtocol:true,
                    status:"loaded",
                    clientOnly:true
                };
                this.inferTypeValue(cacheRecord);
                cache.add(cacheRecord);
            };
            this.setCacheData(cache);
            this.updateCaches({dataSource:this,invalidateCache:true});
        },
        init:function(){
            this.Super("init",arguments);
            var localDS=this,
                nav=localDS.creator,
                deploymentId=nav.deploymentId
            ;
            isc.DS.getDeploymentDS(this.dataSourcesDS,deploymentId,function(dataSourcesDS){
                dataSourcesDS.listFiles(null,function(response,data,request){
                    if(data==null){
                        localDS.logWarn("Unable to get deployed DataSources from DS: "+
                                        localDS.dataSourcesDS);
                    }else{
                        localDS.cacheConvertedRecords(response.data);
                    }
                },{operationId:"allOwners"});
            });
        }
    }
;
isc.B.push(isc.A.invalidateCache=function isc_DeploymentDSNavigator_invalidateCache(){
    }
,isc.A.fetchAllDataSources=function isc_DeploymentDSNavigator_fetchAllDataSources(){
    }
,isc.A.useDataSourceObject=function isc_DeploymentDSNavigator_useDataSourceObject(id,func,sandbox){
        if(!sandbox)return this.Super("useDataSourceObject",arguments);
        isc.DataSource.getDeploymentDS(id,this.deploymentId,func,true);
    }
,isc.A.getShortDSId=function isc_DeploymentDSNavigator_getShortDSId(ds){
        return ds?ds.getShortId():null;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("DeploymentUsageViewer","SectionStack");
isc.A=isc.DeploymentUsageViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.overflow="auto";
isc.A.visibilityMode="multiple";
isc.A.sessionsDataSource="hostedSessions";
isc.A.dataSourcesDataSource="hostedDataSources";
isc.A.dataSourcesDataBase="vbTeam";
isc.A.sessionsOverviewGridTitle="Deployment Sessions";
isc.A.sessionsOverviewGridConstructor="ListGrid";
isc.A.sessionsOverviewGridDefaults={
        width:"100%",
        sortField:"id",
        sortDirection:"descending",
        showFilterEditor:true,
        selectionType:"single",
        initialSessionsCriteria:{
            _constructor:"AdvancedCriteria",
            operator:"and",
            criteria:[{
                fieldName:"startTime",
                operator:"greaterThan",
                value:isc.DateUtil.dateAdd(new Date(),"d",3,-1)
            }]
        },
        rowClick:function(record){
            this.viewer.addSessionAuditSection(record);
        },
        datetimeFormatter:"MM/dd/YYYY HH:mm:ss",
        useAllDataSourceFIelds:true,
        fields:[{
            name:"userId"
        },{
            name:"isActive",title:"Is Active?",width:85,
            type:"boolean",userFormula:{text:"record.endTime == null"}
        },{
            name:"startTime",width:115,align:"left"
        },{
            name:"endTime",width:115,align:"left"
        },{
            name:"lastActivityTime",width:115,align:"left"
        }],
        initWidget:function(){
            this.Super("initWidget",arguments);
            var that=this,
                viewer=this.viewer,
                dsId=viewer.sessionsDataSource,
                deploymentId=viewer.deploymentId
            ;
            isc.DS.getDeploymentDS(dsId,deploymentId,function(sandboxedDS){
                that.setDataSource(sandboxedDS,that.fields);
                that.fetchData(that.initialSessionsCriteria);
            });
        }
    };
isc.A.refreshButtonConstructor=isc.ToolStripButton;
isc.A.refreshButtonDefaults={
        title:"Refresh",
        showDisabledIcon:false,
        icon:"[SKINIMG]/headerIcons/refresh.png",
        click:function(){
            var viewer=this.creator;
            viewer.sessionsOverviewGrid.invalidateCache();
            viewer._asyncRefreshAuditGrids();
        }
    };
isc.A._asyncGridRefreshDelay=100;
isc.A.sessionAuditPickerTitle="Changes by user ${userId} during session: ";
isc.A.sessionAuditPickerLabelConstructor="Label";
isc.A.sessionAuditPickerLabelDefaults={
        wrap:false,baseStyle:"sessionAuditSectionTitle"
    };
isc.A.sessionAuditPickerFormConstructor="DeploymentSessionPickerForm";
isc.A.closeButtonConstructor=isc.ImgButton;
isc.A.closeButtonDefaults={
        autoDraw:false,src:"[SKIN]actions/close.png",size:16,
        showFocused:false,showRollOver:false,showDown:false
    };
isc.A.sessionAuditGridConstructor="DeploymentSessionAuditGrid";
isc.B.push(isc.A._asyncRefreshAuditGrids=function isc_DeploymentUsageViewer__asyncRefreshAuditGrids(){
        var sections=this.sections,
            grids=this._gridsToRefresh=[];
        for(var i=sections.length-1;i>0;i--){
            grids.add(sections[i].items[0]);
        }
        if(!grids.length)return;
        this.refreshButton.setDisabled(true);
        this.delayCall("_refreshNextAuditGrid",[],this._asyncGridRefreshDelay);
    }
,isc.A._refreshNextAuditGrid=function isc_DeploymentUsageViewer__refreshNextAuditGrid(){
        var grids=this._gridsToRefresh;
        var grid=grids.pop();
        if(!grid.destroying&&!grid.destroyed)grid.refreshAuditData();
        if(!grids.length)this.refreshButton.setDisabled(false);
        else{
            this.delayCall("_refreshNextAuditGrid",[],this._asyncGridRefreshDelay);
        }
    }
,isc.A.initWidget=function isc_DeploymentUsageViewer_initWidget(){
        this.Super("initWidget",arguments);
        this.sessionsOverviewGrid=this.createAutoChild("sessionsOverviewGrid",{
            viewer:this
        });
        this.refreshButton=this.createAutoChild("refreshButton");
        this.addSection({
            title:this.sessionsOverviewGridTitle,expanded:true,
            items:[this.sessionsOverviewGrid],
            controls:[this.refreshButton]
        });
        var viewer=this,
            deploymentId=viewer.deploymentId
        ;
        isc.DS.getDeploymentDS(this.dataSourcesDataSource,deploymentId,function(sandboxedDS){
            viewer.loadAuditDataSources(sandboxedDS);
        });
    }
,isc.A.getDSNavigatorStack=function isc_DeploymentUsageViewer_getDSNavigatorStack(){
        var manager=this.creator,
            dataPane=manager.dataPane;
        return dataPane.dsNavigatorStack;
    }
,isc.A.loadAuditDataSources=function isc_DeploymentUsageViewer_loadAuditDataSources(dataSourcesDS){
        var viewer=this;
        dataSourcesDS.listFiles(null,function(response,dataSourceRecords){
            if(dataSourceRecords==null){
                viewer.logWarn("unable to load list of deployed DataSources from "+
                               dataSourcesDS.getShortId());
                return;
            }
            var allDataSourceNames=[];
            for(var i=0;i<dataSourceRecords.length;i++){
                var dataSourceRecord=dataSourceRecords[i];
                allDataSourceNames.add(dataSourceRecord.fileName);
            }
            isc.DS.loadDeploymentDS(allDataSourceNames,viewer.deploymentId,function(allDS){
                var allDSes={};
                for(var i=0;i<allDS.length;i++){
                    var ds=allDS[i];
                    allDSes[ds.getShortId()]=ds;
                }
                var auditDSes=viewer.auditDataSources={};
                for(var i=0;i<allDS.length;i++){
                    var ds=allDS[i];
                    if(!ds.audit)continue;
                    var auditDSId=ds.getAuditDataSourceID();
                    auditDSes[ds.getShortId()]=allDSes[auditDSId];
                }
                if(viewer.logIsInfoEnabled()){
                    viewer.logInfo("loaded "+auditDSes.length+" audit DataSources");
                }
            });
        },{operationId:"allOwners"});
    }
,isc.A.addSessionAuditSection=function isc_DeploymentUsageViewer_addSessionAuditSection(session){
        var sectionId="audit"+session.id;
        if(this.getSection(sectionId)!=null)return;
        var id=session.id,
            userId=session.userId,
            grid=this.sessionsOverviewGrid
        ;
        var pickerTitle=this.sessionAuditPickerTitle.evalDynamicString(this,{
                userId:userId
            }),
            pickerCrit={
                _constructor:"AdvancedCriteria",operator:"and",
                criteria:[{
                    fieldName:"userId",operator:"equals",value:userId
                },{
                    fieldName:"id",operator:"lessOrEqual",value:id
                }]
            }
        ;
        var form=this.createAutoChild("sessionAuditPickerForm",{
            items:[{
                name:"id",width:"100%",
                editorType:"SelectItem",
                multiple:true,showTitle:false,
                pickListProperties:{
                    drawAllMaxCells:20
                },
                defaultToFirstOption:true,
                pickListCriteria:pickerCrit,
                optionDataSource:grid.dataSource,
                optionFilterContext:{sortBy:["-id"]},
                pickListConstructor:"DeploymentSessionPickList",
                formatValue:function(value){
                    var pickList=this.pickList;
                    if(!pickList||value==null)return null;
                    var record=pickList.find({id:value});
                    return pickList.formatCellValue(value,record);
                }
            }]
        });
        var stack=this,
            controls=[
                isc.LayoutSpacer.create({width:21}),
                this.createAutoChild("sessionAuditPickerLabel",{
                    contents:pickerTitle
                }),
                form,
                this.createAutoChild("closeButton",{
                    click:function(){
                        stack.removeSection(sectionId);
                        stack.expandSection(0);
                    }
                })
            ]
        ;
        this.addSection({
            title:null,
            name:sectionId,
            expanded:true,
            controlsLayoutProperties:{
                _constructor:"HLayout",
                height:1,width:"100%",
                draw:function(){
                    this.Super("draw",arguments);
                    this.setEventProxy(this.parentElement);
                }
            },
            controls:controls,
            items:[
                this.createAutoChild("sessionAuditGrid",{
                    viewer:this,form:form,session:session,
                    allAuditId:"_allAudit"+id
                })
            ]
        },1);
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("DeploymentSessionPickList","PickListMenu");
isc.A=isc.DeploymentSessionPickList.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.autoFitData="vertical";
isc.A.autoFitMaxRecords=10;
isc.A.bodyOverflow="hidden";
isc.A.drawAheadRatio=1;
isc.A.dataPageSize=10;
isc.B.push(isc.A.getCellAlign=function isc_DeploymentSessionPickList_getCellAlign(){
        return"left";
    }
,isc.A.formatCellValue=function isc_DeploymentSessionPickList_formatCellValue(value,record){
        return record==null?null:isc.DeploymentUsageViewer.
            formatSessionInterval(record.startTime,record.endTime);
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("DeploymentSessionAuditGrid","ListGrid");
isc.A=isc.DeploymentSessionAuditGrid.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.showFilterEditor=true;
isc.A.autoFetchData=false;
isc.A.showClippedValuesOnHover=true;
isc.A.sortField="changeTime";
isc.A.sortDirection="descending";
isc.A.relatedDataFieldPrompt="Click to see related audit data";
isc.A.relatedDataMenuInfoText="Jump to <b>Data</b> tab and view...";
isc.A.relatedDataMenuRecordText="Changes to this <b>record</b> by <b>any user</b>";
isc.A.relatedDataMenuDataSourceText="Changes to DataSource <b>${dsId}</b> by <b>any user</b>";
isc.A.relatedDataMenuConstructor="Menu";
isc.A.relatedDataMenuDefaults={
        autoDraw:false
    };
isc.A.defaultFields=[{
        name:"dataSourceId",title:"DataSource ID",type:"text",width:100
    },{
        name:"auditRevision",hidden:true,canHide:false,type:"integer"
    },{
        name:"changeTime",title:"Change Time",type:"datetime",width:100
    },{
        name:"operation",title:"Operation",type:"text",width:80
    },{
        name:"changeSummary",title:"Summary of Changes",type:"text"
    },{
        name:"relatedData",showTitle:false,type:"icon",showHover:true,
        cellIcon:"../graphics/actions/relatedData.png",
        recordClick:function(grid,record,recordNum){
            var menu=grid.relatedDataMenu;
            if(!menu){
                menu=grid.relatedDataMenu=grid.createAutoChild("relatedDataMenu");
            }
            menu.setData([{
                title:grid.relatedDataMenuInfoText,enabled:false
            },{
                title:grid.relatedDataMenuRecordText,
                action:function(){
                    grid.addDSSectionToDataPane(record,true);
                }
            },{
                title:grid.relatedDataMenuDataSourceText.evalDynamicString(grid,{
                    dsId:record.dataSourceId
                }),
                action:function(){
                    grid.addDSSectionToDataPane(record);
                }
            }]);
            menu.showContextMenu();
        }
    }];
isc.A.relatedDataTargetLength=200;
isc.A.relatedDataMinLength=10;
isc.A.relatedDataMaxLength=1000;
isc.A.maxRelatedDataFetches=3;
isc.A.maxOffsetRatio=20;
isc.A.defaultDataSourceOffset=86400;
isc.A.defaultSingleRecordOffset=10*86400;
isc.A._summarySeparator=", ";
isc.A.fetchAuditDataTransaction=0;
isc.B.push(isc.A.addDSSectionToDataPane=function isc_DeploymentSessionAuditGrid_addDSSectionToDataPane(record,forRecord){
        var viewer=this.viewer,
            dsId=record.dataSourceId,
            deploymentId=viewer.deploymentId,
            ds=isc.DS.getDeploymentDS(dsId,deploymentId)
        ;
        var sentinel,keysObj,offset;
        if(forRecord){
            sentinel=record;
            offset=this.defaultSingleRecordOffset;
            keysObj=record.keysObj;
        }else{
            sentinel=ds;
            offset=this.defaultDataSourceOffset;
            keysObj=null;
        }
        if(sentinel._relatedDataInProgress){
            if(this.logIsInfoEnabled()){
                this.logInfo("skipping search for related audit data for "+
                             this._getRelatedDataContextMessage(dsId,keysObj)+
                             " as one is already in progress");
            }
            return;
        }
        sentinel._relatedDataInProgress=true;
        var dsMap=viewer.auditDataSources,
            auditDS=dsMap[ds.getShortId()],
            idField=ds.getAuditRevisionFieldName(),
            timeField=ds.getAuditTimeStampFieldName()
        ;
        var context={
            sentinel:sentinel,
            offset:offset*1000,
            record:record,
            keysObj:keysObj,
            auditedDS:ds,
            auditDS:auditDS,
            idField:idField,
            timeField:timeField,
            results:[]
        };
        this._fetchRelatedData(context);
    }
,isc.A._fetchRelatedData=function isc_DeploymentSessionAuditGrid__fetchRelatedData(context){
        var record=context.record,
            offset=context.offset,
            auditedDS=context.auditedDS,
            timeField=context.timeField,
            recordTime=record.changeTime,
            recordMillis=recordTime.getTime()
        ;
        var timeCrit=context.timeCrit={
            _constructor:"AdvancedCriteria",
            operator:"and",
            criteria:[{
                fieldName:timeField,operator:"greaterOrEqual",
                value:new Date(recordMillis-offset)
            },{
                fieldName:timeField,operator:"lessOrEqual",
                value:new Date(recordMillis+offset)
            }]
        };
        var that=this,
            keysObj=context.keysObj,
            auditDS=context.auditDS,
            idField=context.idField
        ;
        auditDS.fetchData(isc.DS.combineCriteria(timeCrit,keysObj),
            function(response,data,request){
                that._handleFetchRelatedDataReply(response,data,request,context);
            },{sortBy:"-"+idField}
        );
    }
,isc.A._handleFetchRelatedDataReply=function isc_DeploymentSessionAuditGrid__handleFetchRelatedDataReply(response,data,request,context){
        var viewer=this.viewer,
            record=context.record,
            keysObj=context.keysObj,
            sentinel=context.sentinel,
            auditedDS=context.auditedDS
        ;
        if(response.status<0){
            this.logWarn("unable to fetch related audit data for "+
                this._getRelatedDataContextMessage(auditedDS.getID(),keysObj)+
                " due to response status "+response.status);
            sentinel._relatedDataInProgress=null;
            return;
        }
        var length=data.length,
            results=context.results,
            idField=context.idField,
            revision=record.auditRevision,
            index=data.findIndex(idField,revision)
        ;
        results.add({
            crit:context.timeCrit,
            length:length,
            index:index
        });
        var bestResult,
            lengthMin=this.relatedDataMinLength,
            lengthMax=this.relatedDataMaxLength
        ;
        if(length>=lengthMin&&length<=lengthMax){
            bestResult=results.last();
        }else if(results.length>=this.maxRelatedDataFetches){
            var bestRatio;
            for(var i=0;i<results.length;i++){
                var resultLength=results[i].length,
                    resultRatio=resultLength>lengthMax?resultLength/lengthMax:
                                                             lengthMin/resultLength;
                if(bestRatio==null||resultRatio<bestRatio){
                    bestRatio=resultRatio;
                    bestResult=results[i];
                }
            }
        }else{
            var correctionFactor=Math.min(this.maxOffsetRatio,
                                            this.relatedDataTargetLength/length);
            context.offset=Math.ceil(context.offset*correctionFactor);
            this._fetchRelatedData(context);
            return;
        }
        sentinel._relatedDataInProgress=null;
        var timeCrit=bestResult.crit,
            dsStack=viewer.getDSNavigatorStack(),
            grid=dsStack.addDataSourceSection(context.auditDS,auditedDS,keysObj,timeCrit)
        ;
        var that=this;
        this.observe(grid,"dataArrived",function(startRow,endRow){
            if(index>=startRow&&index<endRow){
                grid.selectRecord(index);
                that.ignore(grid,"dataArrived");
            }
        });
        grid.scrollToRow(index);
        var manager=viewer.creator;
        manager.selectTab("data");
    }
,isc.A._getRelatedDataContextMessage=function isc_DeploymentSessionAuditGrid__getRelatedDataContextMessage(dsId,keysObj){
        var message=keysObj?"record "+isc.echo(keysObj)+" in ":"";
        return"DataSource "+dsId;
    }
,isc.A.initWidget=function isc_DeploymentSessionAuditGrid_initWidget(){
        this.dataSource=isc.DataSource.create({
            ID:this.allAuditId,fields:this.defaultFields,clientOnly:true
        });
        this.Super("initWidget",arguments);
        this.setFieldProperties("relatedData",{
            cellPrompt:this.relatedDataFieldPrompt
        });
        var idItem=this.form.getItem("id");
        this.observe(idItem,"changed","observer.fetchAuditData()");
        this.observe(idItem,"setValue","observer.fetchAuditData()");
        this.observe(idItem,"handleDataArrived","observer.fetchAuditData()");
    }
,isc.A._flattenSummary=function isc_DeploymentSessionAuditGrid__flattenSummary(summaryObj){
        var separator=this._summarySeparator,
            summary=isc.emptyString,
            first=summaryObj.first,
            main=summaryObj.main,
            last=summaryObj.last
        ;
        if(first)summary=first.join(separator);
        if(main){
            if(summary)summary+=separator;
            summary+=main.join(separator);
        }
        if(last){
            if(summary)summary+=separator;
            summary+=last.join(separator);
        }
        return summary;
    }
,isc.A._getFirstFields=function isc_DeploymentSessionAuditGrid__getFirstFields(ds){
        var first=[ds.getTitleField()];
        if(ds.dataField)first.add(ds.dataField);
        if(ds.infoField)first.add(ds.infoField);
        return first;
    }
,isc.A._buildAllAuditDataSource=function isc_DeploymentSessionAuditGrid__buildAllAuditDataSource(responses){
        var ds,auditData=[],
            threshold=this.longTextEditorThreshold,
            comparator=function(a,b){
                var fields=ds.fields;
                return fields[a]._fieldOrderIndex-fields[b]._fieldOrderIndex;
            }
        ;
        for(var i=0;i<responses.length;i++){
            var response=responses[i],
                context=response.clientContext
            ;
            ds=context.auditedDS;
            if(response.status<0){
                this.logWarn("fetchAuditData(): unable to retrieve audit data for DS "+
                             ds.getID());
                continue;
            }
            var fields=ds.getFields(),
                firstFields=this._getFirstFields(ds)
            ;
            if(!ds._fieldsIndexed)ds._indexFields();
            var typeField=ds.getAuditTypeFieldName(),
                timeStampField=ds.getAuditTimeStampFieldName(),
                changedFieldsField=ds.getAuditChangedFieldsFieldName(),
                auditRevisionField=ds.getAuditRevisionFieldName()
            ;
            var responseData=response.data||[];
            for(var j=0;j<responseData.length;j++){
                var summary=null,
                    record=responseData[j],
                    changeType=record[typeField];
                switch(changeType){
                case"add":
                    summary={};
                    for(var fieldName in fields){
                        if(record[fieldName]==null)continue;
                        this._addFieldToChangeSummary(record,fieldName,ds,firstFields,
                                                      summary);
                    }
                    break;
                case"update":
                    var summary={},
                        changedFields=record[changedFieldsField];
                    if(changedFields){
                        if(changedFields.length>1)changedFields.sort(comparator);
                        for(var k=0;k<changedFields.length;k++){
                            var fieldName=changedFields[k];
                            this._addFieldToChangeSummary(record,fieldName,ds,firstFields,
                                                          summary);
                        }
                    }
                    break;
                case"remove":
                default:
                    break;
                }
                if(summary)summary=this._flattenSummary(summary);
                auditData.add({dataSourceId:ds.getShortId(),
                               changeTime:record[timeStampField],
                               auditRevision:record[auditRevisionField],
                               keysObj:ds.filterPrimaryKeyFields(record),
                               operation:changeType,changeSummary:summary});
            }
        }
        this._setAuditCacheData(auditData);
    }
,isc.A._setAuditCacheData=function isc_DeploymentSessionAuditGrid__setAuditCacheData(newData){
        var oldData=this.dataSource.cacheData;
        if(oldData&&oldData.length||newData&&newData.length){
            this.dataSource.setCacheData(newData);
        }else return;
        if(this.willFetchData())this.fetchData();
        else this.invalidateCache();
    }
,isc.A._addFieldToChangeSummary=function isc_DeploymentSessionAuditGrid__addFieldToChangeSummary(record,fieldName,ds,firstFields,summary){
        var formattedValue=ds.formatFieldValue(fieldName,record[fieldName]),
            bindingSummary=fieldName+" -> "+formattedValue
        ;
        var firstIndex=firstFields.indexOf(fieldName);
        if(firstIndex>=0){
            var first=summary.first;
            if(!first)first=summary.first=[];
            first[firstIndex]=bindingSummary;
            return;
        }
        if(isc.isA.String(formattedValue)&&
            formattedValue.length>this.longTextEditorThreshold)
        {
            var last=summary.last;
            if(!last)last=summary.last=[];
            last.add(bindingSummary);
        }
        var main=summary.main;
        if(!main)main=summary.main=[];
        main.add(bindingSummary);
    }
,isc.A.fetchAuditData=function isc_DeploymentSessionAuditGrid_fetchAuditData(){
        var grid=this,
            viewer=this.viewer,
            dsMap=viewer.auditDataSources,
            picker=this.form.getItem("id"),
            deploymentId=viewer.deploymentId
        ;
        var lastIntervalIds=this._lastIntervalIds;
        this._lastIntervalIds=picker.getValue();
        if(isc.DynamicForm.compareValues(lastIntervalIds,this._lastIntervalIds))return;
        var auditUserField="audit_modifier",
            auditTimeStampField="audit_changeTime",
            criteria=this.form.getAuditCriteria(auditUserField,auditTimeStampField);
        if(!criteria){
            this._setAuditCacheData();
            return;
        }
        var transactionNum=++this.fetchAuditDataTransaction;
        isc.RPCManager.startQueue();
        var origEmptyMessage=this.emptyMessage;
        this.setEmptyMessage(this.loadingDataMessage);
        for(var dsId in dsMap){
            var ds=isc.DataSource.getDeploymentDS(dsId,deploymentId);
            dsMap[dsId].fetchData(criteria,null,{clientContext:{auditedDS:ds}});
        }
        isc.RPCManager.sendQueue(function(responses){
            if(transactionNum==grid.fetchAuditDataTransaction){
                grid.setEmptyMessage(origEmptyMessage);
                grid._buildAllAuditDataSource(responses);
            }
        });
    }
,isc.A.refreshAuditData=function isc_DeploymentSessionAuditGrid_refreshAuditData(){
        var form=this.form;
        if(form.hasActiveSessions()){
            delete this._lastIntervalIds;
            form.invalidatePickListCache();
        }
    }
);
isc.B._maxIndex=isc.C+12;

isc.defineClass("DeploymentSessionPickerForm","DynamicForm");
isc.A=isc.DeploymentSessionPickerForm.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width="100%";
isc.A.numCols=1;
isc.A.overflow="clip-h";
isc.A.wrapItemTitles=false;
isc.B.push(isc.A.getAuditCriteria=function isc_DeploymentSessionPickerForm_getAuditCriteria(userFieldName,timeStampFieldName){
        var idItem=this.getItem("id"),
            sessions=idItem.getValue(),
            pickList=idItem.pickList
        ;
        if(!sessions||!pickList)return null;
        var userId,intervalCrit=[];
        for(var i=0;i<sessions.length;i++){
            var session=pickList.find({id:sessions[i]});
            if(!session)continue;
            if(!userId)userId=session.userId;
            var startTime=session.startTime,
                endTime=session.endTime
            ;
            var crit=endTime?{
                fieldName:timeStampFieldName,
                operator:"iBetweenInclusive",
                start:startTime,end:endTime
            }:{
                fieldName:timeStampFieldName,
                operator:"greaterOrEqual",
                value:startTime
            };
            intervalCrit.add(crit);
        }
        if(!intervalCrit.length)return null;
        return{
            _constructor:"AdvancedCriteria",operator:"and",
            criteria:[{
                fieldName:userFieldName,operator:"equals",value:userId
            },{
                operator:"or",criteria:intervalCrit
            }]
        };
    }
,isc.A.hasActiveSessions=function isc_DeploymentSessionPickerForm_hasActiveSessions(){
        var idItem=this.getItem("id"),
            pickList=idItem.pickList;
        return pickList&&!!pickList.find({endTime:null});
    }
,isc.A.invalidatePickListCache=function isc_DeploymentSessionPickerForm_invalidatePickListCache(){
        var idItem=this.getItem("id"),
            pickList=idItem.pickList;
        if(pickList)pickList.invalidateCache();
    }
);
isc.B._maxIndex=isc.C+3;

isc.A=isc.DeploymentUsageViewer;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.formatSessionInterval=function isc_c_DeploymentUsageViewer_formatSessionInterval(startTime,endTime){
        if(startTime==null)return null;
        var DateUtil=isc.DateUtil;
        if(endTime==null){
            return DateUtil.format(startTime,"dddd MMMM d h:mma")+" - present";
        }
        var startYear=startTime.getFullYear(),
            startMonth=startTime.getMonth(),
            startDate=startTime.getDate()
        ;
        var endYear=endTime.getFullYear(),
            endMonth=endTime.getMonth(),
            endDate=endTime.getDate()
        ;
        if(startYear==endYear&&startMonth==endMonth){
            if(startDate==endDate){
                return DateUtil.format(startTime,"dddd MMMM d h:mma - ")+
                       DateUtil.format(endTime,"h:mma");
            }
            if(endDate-startDate==1){
                return DateUtil.format(startTime,"dddd MMMM d-")+endDate+
                       DateUtil.format(startTime," h:mma - ")+
                       DateUtil.format(endTime,"h:mma");
            }
        }else if(startYear==endYear){
            if(endMonth-startMonth==1&&endDate==1){
                var tempDate=new Date(endTime);
                tempDate.setDate(0);
                if(tempDate.getDate()==startDate){
                    return DateUtil.format(startTime,"dddd MMMM d - ")+
                           DateUtil.format(endTime,"MMMM d ")+
                           DateUtil.format(startTime,"h:mma - ")+
                           DateUtil.format(endTime,"h:mma");
                }
            }
        }else if(endYear-startYear==1&&
                   endMonth==0&&startMonth==11&&
                   endDate==1&&startDate==31)
        {
            return DateUtil.format(startTime,"dddd MMMM d yyyy - ")+
                   DateUtil.format(endTime,"MMMM d yyyy ")+
                   DateUtil.format(startTime,"h:mma - ")+
                   DateUtil.format(endTime,"h:mma");
        }
        if(endYear==startYear){
            return DateUtil.format(startTime,"dddd MMMM d h:mma - ")+
                   DateUtil.format(endTime,"dddd MMMM d h:mma");
        }else{
            return DateUtil.format(startTime,"dddd MMMM d h:mma yyyy - ")+
                   DateUtil.format(endTime,"dddd MMMM d h:mma yyyy");
        }
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("DSDashboard","HLayout");
isc.A=isc.DSDashboard.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.membersMargin=20;
isc.A.selectorDashboardsTabTitle="Dashboards";
isc.A.selectorPaletteTabTitle="Palette";
isc.A.newDashboardDescription="New Dashboard";
isc.A.cloneDashboardDescriptionSuffix="Copy";
isc.A.paletteDataSourceNameField="dsName";
isc.A.dataSource="dashboards";
isc.A.descriptionField="description";
isc.A.layoutField="layout";
isc.A.initialPortalPaletteNode={
        type:"PortalLayout",
        defaults:{
            width:"100%",
            height:"100%",
            canResizePortlets:true
        }
    };
isc.A.dashboardsConstructor=isc.ListGrid;
isc.A.dashboardsDefaults={
        autoParent:"dashboardsLayout",
        autoFetchData:true,
        selectionType:"single",
        canEdit:true,
        canRemoveRecords:true,
        initWidget:function(){
            this.sortField=this.dashboardDescriptionField;
            this.fields=[{name:this.dashboardDescriptionField}];
            this.Super("initWidget",arguments);
        },
        clearCurrentDashboard:function(){
            this.getEditPane().destroyAll();
            this.getEditPane().hide();
            this.getEditToolbar().hide();
        },
        editDashboard:function(){
            var record=this.getSelectedRecord();
            if(record){
                var layout=record[this.dashboardLayoutField];
                this.getEditPane().addPaletteNodesFromXML(layout);
                this.getEditPane().show();
                this.getEditToolbar().show();
                this.showPalette();
            }
            this._currentRecord=record;
        },
        viewDashboard:function(layout){
            var record=this.getSelectedRecord();
            if(record){
                var layout=record[this.dashboardLayoutField];
                this.getEditPane().addPaletteNodesFromXML(layout);
                this.getEditPane().show();
                this.getEditToolbar().hide();
                this.hidePalette();
            }
            this._currentRecord=record;
        },
        newDashboard:function(){
            this.clearCurrentDashboard();
            this._currentRecord=null;
            this.getEditPane().addFromPaletteNode(this.initialPortalPaletteNode);
            this.getEditPane().show();
            this.getEditToolbar().show();
            this.showPalette();
            this.saveDashboard();
        },
        cloneDashboard:function(layout){
            var record=this.getSelectedRecord();
            if(record){
                this.cloneRecord(record);
            }
        },
        showPalette:function(){
            this.getSelector().enableTab(1);
            this.getSelector().selectTab(1);
        },
        hidePalette:function(){
            this.getSelector().disableTab(1);
            this.getSelector().selectTab(0);
        },
        refreshDashboard:function(){
            this.clearCurrentDashboard();
            this.editDashboard();
        },
        saveDashboard:function(){
            var editNodes=this.getEditPane().serializeAllEditNodes({indent:false});
            if(this._currentRecord){
                this._currentRecord[this.dashboardLayoutField]=editNodes;
                this.updateData(this._currentRecord);
            }else{
                var grid=this,
                    record={}
                ;
                record[this.dashboardDescriptionField]=this.newDashboardDescription;
                record[this.dashboardLayoutField]=editNodes;
                this.addData(record,function(response,data,request){
                    if(data&&!isc.isAn.Array(data)){
                        data=[data];
                    }
                    if(data&&data.length>0){
                        grid.selectSingleRecord(data[0]);
                        grid._currentRecord=data[0];
                    }
                });
            }
        },
        cloneRecord:function(record,copyNum){
            if(!copyNum)copyNum=1;
            if(copyNum>100){
                return;
            }
            var grid=this,
                ds=this.getDataSource(),
                cloneDesc=record[this.dashboardDescriptionField]+" "+this.cloneDashboardDescriptionSuffix+" "+copyNum,
                matchRecord={}
            ;
            matchRecord[this.dashboardDescriptionField]=cloneDesc;
            ds.fetchData(matchRecord,function(response,data,request){
                if(data&&data.length>0){
                    this.cloneRecord(record,copyNum);
                    return;
                }
                var newRecord={};
                newRecord[grid.dashboardDescriptionField]=cloneDesc;
                newRecord[grid.dashboardLayoutField]=record[grid.dashboardLayoutField];
                grid.addData(newRecord,function(response,data,request){
                    if(data&&data.length>0){
                        grid.selectSingleRecord(data[0]);
                    }
                });
            });
        },
        getEditPane:function(){
            return this.creator.editPane;
        },
        getEditToolbar:function(){
            return this.creator.editToolbar;
        },
        getSelector:function(){
            return this.creator.selector;
        }
    };
isc.A.viewButtonConstructor=isc.Button;
isc.A.viewButtonDefaults={
        autoParent:"dashboardsToolbar",
        title:"View",
        autoFit:true,
        click:function(){
            this.creator.dashboards.clearCurrentDashboard();
            this.creator.dashboards.viewDashboard();
        }
    };
isc.A.editButtonConstructor=isc.Button;
isc.A.editButtonDefaults={
        autoParent:"dashboardsToolbar",
        title:"Edit",
        autoFit:true,
        click:function(){
            this.creator.dashboards.clearCurrentDashboard();
            this.creator.dashboards.editDashboard();
        }
    };
isc.A.newButtonConstructor=isc.Button;
isc.A.newButtonDefaults={
        autoParent:"dashboardsToolbar",
        title:"New",
        autoFit:true,
        click:function(){
            this.creator.dashboards.newDashboard();
        }
    };
isc.A.cloneButtonConstructor=isc.Button;
isc.A.cloneButtonDefaults={
        autoParent:"dashboardsToolbar",
        title:"Clone",
        autoFit:true,
        click:function(){
            this.creator.dashboards.cloneDashboard();
        }
    };
isc.A.dashboardsToolbarConstructor=isc.HLayout;
isc.A.dashboardsToolbarDefaults={
        autoParent:"dashboardsLayout",
        height:30,
        membersMargin:10,
        defaultLayoutAlign:"center",
        initWidget:function(){
            this.members=[isc.LayoutSpacer.create()];
            this.Super("initWidget",arguments);
        }
    };
isc.A.dashboardsLayoutConstructor=isc.VLayout;
isc.A.dashboardsLayoutDefaults={};
isc.A.paletteConstructor=isc.ListPalette;
isc.A.paletteDefaults={
        paletteNodeDefaults:{
            type:"ListGrid",
            defaults:{
                autoFetchData:true,
                showFilterEditor:true
            }
        },
        fields:[
            {name:"title",title:"Component"}
        ],
        initWidget:function(){
            this.Super("initWidget",arguments);
            this.initCacheData();
        },
        initCacheData:function(){
            if(this.paletteDataSourceList){
                var dataSources=this.paletteDataSourceList;
                if(!isc.isAn.Array(dataSources))dataSources=[dataSources];
                var data=[];
                for(var i=0;i<dataSources.length;i++){
                    var defaults=isc.clone(this.paletteNodeDefaults),
                        dsName=(isc.isAn.Instance(dataSources[i])?dataSources[i].getID():dataSources[i]),
                        record=isc.addProperties({},defaults,this.paletteNodeProperties);
                    ;
                    record.title=dsName;
                    if(!record.defaults)record.defaults={};
                    record.defaults.dataSource=dsName;
                    data.add(record);
                }
                this.setData(data);
            }else if(this.paletteDataSource){
                var _this=this,
                    ds=isc.DS.get(this.paletteDataSource)
                ;
                ds.fetchData(null,function(response){
                    var records=response.data;
                    if(records&&records.length>0){
                        var data=[],
                            dsNameField=_this.paletteDataSourceNameField
                        ;
                        for(var i=0;i<records.length;i++){
                            var defaults=isc.clone(_this.paletteNodeDefaults),
                                dsName=records[i][dsNameField],
                                record=isc.addProperties({},defaults,_this.paletteNodeProperties);
                            ;
                            record.title=dsName;
                            if(!record.defaults)record.defaults={};
                            record.defaults.dataSource=dsName;
                            data.add(record);
                        }
                        _this.setData(data);
                    }else{
                        _this.logWarn("No dataSources found in paletteDataSource "+_this.paletteDataSource);
                    }
                });
            }
        }
    };
isc.A.editPaneConstructor=isc.EditPane;
isc.A.editPaneDefaults={
        autoParent:"editLayout",
        border:"1px solid black",
        visibility:"hidden",
        initWidget:function(){
            this.extraPalettes=isc.HiddenPalette.create({
                data:[
                    {title:"ListGridField",type:"ListGridField"}
                ]
            });
            this.Super("initWidget",arguments);
            this.addFromPaletteNode(this.creator.initialPortalPaletteNode);
        }
    };
isc.A.saveButtonConstructor=isc.Button;
isc.A.saveButtonDefaults={
        autoParent:"editToolbar",
        title:"Save",
        autoFit:true,
        click:function(){
            this.creator.dashboards.saveDashboard();
        }
    };
isc.A.discardButtonConstructor=isc.Button;
isc.A.discardButtonDefaults={
        autoParent:"editToolbar",
        title:"Discard changes",
        autoFit:true,
        click:function(){
            this.creator.dashboards.refreshDashboard();
        }
    };
isc.A.editToolbarConstructor=isc.HLayout;
isc.A.editToolbarDefaults={
        autoParent:"editLayout",
        height:30,
        membersMargin:10,
        defaultLayoutAlign:"center",
        visibility:"hidden",
        initWidget:function(){
            this.members=[isc.LayoutSpacer.create()];
            this.Super("initWidget",arguments);
        }
    };
isc.A.editLayoutConstructor=isc.VLayout;
isc.A.editLayoutDefaults={
        width:"100%",
        height:"100%"
    };
isc.A.selectorConstructor=isc.TabSet;
isc.A.selectorDefaults={
        width:"25%"
    };
isc.B.push(isc.A.initWidget=function isc_DSDashboard_initWidget(){
        this.Super("initWidget",arguments);
        var selectorTabs=[
            {title:this.selectorDashboardsTabTitle,pane:this.addAutoChild("dashboardsLayout")},
            {title:this.selectorPaletteTabTitle,pane:this.addAutoChild("palette",{
                paletteDataSource:this.paletteDataSource,
                paletteDataSourceNameField:this.paletteDataSourceNameField,
                paletteDataSourceList:this.paletteDataSourceList
            })}
        ];
        this.addAutoChild("selector",{tabs:selectorTabs});
        this.addAutoChild("dashboards",{
            initialPortalPaletteNode:this.initialPortalPaletteNode,
            newDashboardDescription:this.newDashboardDescription,
            cloneDashboardDescriptionSuffix:this.cloneDashboardDescriptionSuffix,
            dataSource:this.dataSource,
            dashboardDescriptionField:this.descriptionField,
            dashboardLayoutField:this.layoutField
        });
        this.addAutoChild("dashboardsToolbar");
        this.addAutoChild("viewButton");
        this.addAutoChild("editButton");
        this.addAutoChild("newButton");
        this.addAutoChild("cloneButton");
        this.addAutoChild("editLayout");
        this.addAutoChild("editPane");
        this.addAutoChild("editToolbar");
        this.addAutoChild("saveButton");
        this.addAutoChild("discardButton");
        this.palette.setDefaultEditContext(this.editPane);
        this.editPane.setDefaultPalette(this.palette);
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.Class;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getClassIcon=function isc_c_Class_getClassIcon(className,state){
        if(!className)className=this.getClassName();
        if(className){
            if(!isc.isA.String(className)&&className.getClassName){
                className=className.getClassName();
            }
            var iconName=className;
            if(isc.ImagePicker&&isc.isA.String(iconName)){
                if(state)iconName+=("_"+state);
                return isc.ImagePicker.getStockIcon(iconName,"name","classIcons");
            }
        }
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.Class.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getClassIcon=function isc_Class_getClassIcon(state){
        return isc.Class.getClassIcon(this.getClassName(),state);
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.Class;
isc.A.standardClassIcons=[
        {
            "index":10,
            "name":"Class",
            "scImgURL":"classes/Class.png"
        },
        {
            "index":20,
            "name":"AffineTransform",
            "scImgURL":"classes/AffineTransform.png"
        },
        {
            "index":30,
            "name":"List",
            "scImgURL":"classes/List.png"
        },
        {
            "index":40,
            "name":"SGWTFactory",
            "scImgURL":"classes/SGWTFactory.png"
        },
        {
            "index":50,
            "name":"Tree",
            "scImgURL":"classes/Tree.png"
        },
        {
            "index":60,
            "name":"BaseWidget",
            "scImgURL":"classes/BaseWidget.png"
        },
        {
            "index":70,
            "name":"Canvas",
            "scImgURL":"classes/Canvas.png"
        },
        {
            "index":80,
            "name":"MathFunction",
            "scImgURL":"classes/MathFunction.png"
        },
        {
            "index":90,
            "name":"Layout",
            "scImgURL":"classes/Layout.png"
        },
        {
            "index":100,
            "name":"PortalRow",
            "scImgURL":"classes/PortalRow.png"
        },
        {
            "index":110,
            "name":"PortalColumn",
            "scImgURL":"classes/PortalColumn.png"
        },
        {
            "index":120,
            "name":"VLayout",
            "scImgURL":"classes/VLayout.png",
            "states":["drop"]
        },
        {
            "index":130,
            "name":"ListGrid",
            "scImgURL":"classes/ListGrid.png",
            "states":["drop"]
        },
        {
            "index":140,
            "name":"GridRenderer",
            "scImgURL":"classes/GridRenderer.png"
        },
        {
            "index":150,
            "name":"HLayout",
            "scImgURL":"classes/HLayout.png",
            "states":["drop"]
        },
        {
            "index":160,
            "name":"HiliteRule",
            "scImgURL":"classes/HiliteRule.png"
        },
        {
            "index":170,
            "name":"FormItem",
            "scImgURL":"classes/FormItem.png"
        },
        {
            "index":180,
            "name":"TextItem",
            "scImgURL":"classes/TextItem.png"
        },
        {
            "index":190,
            "name":"ComboBoxItem",
            "scImgURL":"classes/ComboBoxItem.png",
            "states":["drop"]
        },
        {
            "index":200,
            "name":"CanvasItem",
            "scImgURL":"classes/CanvasItem.png"
        },
        {
            "index":210,
            "name":"RelationItem",
            "scImgURL":"classes/RelationItem.png"
        },
        {
            "index":220,
            "name":"Action",
            "scImgURL":"classes/Action.png"
        },
        {
            "index":230,
            "name":"DataSource",
            "scImgURL":"classes/DataSource.png"
        },
        {
            "index":240,
            "name":"StringBuffer",
            "scImgURL":"classes/StringBuffer.png"
        },
        {
            "index":250,
            "name":"StatefulCanvas",
            "scImgURL":"classes/StatefulCanvas.png"
        },
        {
            "index":260,
            "name":"Button",
            "scImgURL":"classes/Button.png"
        },
        {
            "index":270,
            "name":"DrawItem",
            "scImgURL":"classes/DrawItem.png"
        },
        {
            "index":280,
            "name":"URIBuilder",
            "scImgURL":"classes/URIBuilder.png"
        },
        {
            "index":290,
            "name":"StackTrace",
            "scImgURL":"classes/StackTrace.png"
        },
        {
            "index":300,
            "name":"ChromeStackTrace",
            "scImgURL":"classes/ChromeStackTrace.png"
        },
        {
            "index":310,
            "name":"StretchImg",
            "scImgURL":"classes/StretchImg.png"
        },
        {
            "index":320,
            "name":"StretchImgButton",
            "scImgURL":"classes/StretchImgButton.png"
        },
        {
            "index":330,
            "name":"ToolStrip",
            "scImgURL":"classes/ToolStrip.png",
            "states":["drop"]
        },
        {
            "index":340,
            "name":"ToolStripButton",
            "scImgURL":"classes/ToolStripButton.png"
        },
        {
            "index":350,
            "name":"MenuButton",
            "scImgURL":"classes/MenuButton.png"
        },
        {
            "index":360,
            "name":"ToolStripMenuButton",
            "scImgURL":"classes/ToolStripMenuButton.png"
        },
        {
            "index":370,
            "name":"SelectItem",
            "scImgURL":"classes/SelectItem.png",
            "states":["drop"]
        },
        {
            "index":380,
            "name":"ContainerItem",
            "scImgURL":"classes/ContainerItem.png"
        },
        {
            "index":390,
            "name":"DateItem",
            "scImgURL":"classes/DateItem.png"
        },
        {
            "index":400,
            "name":"TimeItem",
            "scImgURL":"classes/TimeItem.png"
        },
        {
            "index":410,
            "name":"StaticTextItem",
            "scImgURL":"classes/StaticTextItem.png"
        },
        {
            "index":420,
            "name":"MiniDateRangeItem",
            "scImgURL":"classes/MiniDateRangeItem.png"
        },
        {
            "index":430,
            "name":"SpinnerItem",
            "scImgURL":"classes/SpinnerItem.png"
        },
        {
            "index":440,
            "name":"ButtonItem",
            "scImgURL":"classes/ButtonItem.png"
        },
        {
            "index":450,
            "name":"SectionItem",
            "scImgURL":"classes/SectionItem.png",
            "states":["drop"]
        },
        {
            "index":460,
            "name":"DetailViewer",
            "scImgURL":"classes/DetailViewer.png",
            "states":["drop"]
        },
        {
            "index":470,
            "name":"Menu",
            "scImgURL":"classes/Menu.png",
            "states":["drop"]
        },
        {
            "index":480,
            "name":"ScrollingMenu",
            "scImgURL":"classes/ScrollingMenu.png"
        },
        {
            "index":490,
            "name":"PickListMenu",
            "scImgURL":"classes/PickListMenu.png"
        },
        {
            "index":500,
            "name":"Calendar",
            "scImgURL":"classes/Calendar.png"
        },
        {
            "index":510,
            "name":"CalendarView",
            "scImgURL":"classes/CalendarView.png"
        },
        {
            "index":520,
            "name":"MonthSchedule",
            "scImgURL":"classes/MonthSchedule.png"
        },
        {
            "index":530,
            "name":"DateChooser",
            "scImgURL":"classes/DateChooser.png"
        },
        {
            "index":540,
            "name":"DateGrid",
            "scImgURL":"classes/DateGrid.png"
        },
        {
            "index":550,
            "name":"TabSet",
            "scImgURL":"classes/TabSet.png",
            "states":["drop"]
        },
        {
            "index":560,
            "name":"Toolbar",
            "scImgURL":"classes/Toolbar.png"
        },
        {
            "index":570,
            "name":"TabBar",
            "scImgURL":"classes/TabBar.png"
        },
        {
            "index":580,
            "name":"SectionStack",
            "scImgURL":"classes/SectionStack.png",
            "states":["drop"]
        },
        {
            "index":590,
            "name":"ToolStripGroup",
            "scImgURL":"classes/ToolStripGroup.png"
        },
        {
            "index":600,
            "name":"Window",
            "scImgURL":"classes/Window.png",
            "states":["drop"]
        },
        {
            "index":610,
            "name":"Dialog",
            "scImgURL":"classes/Dialog.png"
        },
        {
            "index":620,
            "name":"PickTreeItem",
            "scImgURL":"classes/PickTreeItem.png"
        },
        {
            "index":630,
            "name":"RelativeDateItem",
            "scImgURL":"classes/RelativeDateItem.png"
        },
        {
            "index":640,
            "name":"ColorItem",
            "scImgURL":"classes/ColorItem.png"
        },
        {
            "index":650,
            "name":"DrawLabel",
            "scImgURL":"classes/DrawLabel.png"
        },
        {
            "index":660,
            "name":"CycleItem",
            "scImgURL":"classes/CycleItem.png"
        },
        {
            "index":670,
            "name":"CheckboxItem",
            "scImgURL":"classes/CheckboxItem.png"
        },
        {
            "index":680,
            "name":"TreeGrid",
            "scImgURL":"classes/TreeGrid.png",
            "states":["drop"]
        },
        {
            "index":690,
            "name":"CubeGrid",
            "scImgURL":"classes/CubeGrid.png"
        },
        {
            "index":700,
            "name":"NavigationBar",
            "scImgURL":"classes/NavigationBar.png"
        },
        {
            "index":710,
            "name":"NavigationButton",
            "scImgURL":"classes/NavigationButton.png"
        },
        {
            "index":720,
            "name":"ColorPicker",
            "scImgURL":"classes/ColorPicker.png"
        },
        {
            "index":730,
            "name":"Hover",
            "scImgURL":"classes/Hover.png"
        },
        {
            "index":740,
            "name":"PropertySheet",
            "scImgURL":"classes/PropertySheet.png"
        },
        {
            "index":750,
            "name":"RibbonBar",
            "scImgURL":"classes/RibbonBar.png"
        },
        {
            "index":760,
            "name":"Notify",
            "scImgURL":"classes/Notify.png"
        },
        {
            "index":770,
            "name":"Slider",
            "scImgURL":"classes/Slider.png"
        },
        {
            "index":780,
            "name":"SectionHeader",
            "scImgURL":"classes/SectionHeader.png"
        },
        {
            "index":790,
            "name":"Process",
            "scImgURL":"classes/Process.png"
        },
        {
            "index":800,
            "name":"Splitbar",
            "scImgURL":"classes/Splitbar.png"
        },
        {
            "index":810,
            "name":"ResizeBar",
            "scImgURL":"classes/ResizeBar.png"
        },
        {
            "index":820,
            "name":"UploadItem",
            "scImgURL":"classes/UploadItem.png"
        },
        {
            "index":830,
            "name":"HeaderItem",
            "scImgURL":"classes/HeaderItem.png"
        },
        {
            "index":840,
            "name":"LinkItem",
            "scImgURL":"classes/LinkItem.png"
        },
        {
            "index":850,
            "name":"RichTextEditor",
            "scImgURL":"classes/RichTextEditor.png"
        },
        {
            "index":860,
            "name":"FacetChart",
            "scImgURL":"classes/FacetChart.png"
        },
        {
            "index":870,
            "name":"PickList",
            "scImgURL":"classes/PickList.png"
        },
        {
            "index":880,
            "name":"Scrollbar",
            "scImgURL":"classes/Scrollbar.png"
        },
        {
            "index":1000,
            "name":"DynamicForm",
            "scImgURL":"classes/DynamicForm.png",
            "states":["drop"]
        },
        {
            "index":1010,
            "name":"DataView",
            "scImgURL":"classes/DataView.png",
            "states":["drop"]
        },
        {
            "index":1020,
            "name":"Deck",
            "scImgURL":"classes/Deck.png",
            "states":["drop"]
        },
        {
            "index":1030,
            "name":"MenuItem",
            "scImgURL":"classes/MenuItem.png",
            "states":["drop"]
        },
        {
            "index":1040,
            "name":"IconButton",
            "scImgURL":"classes/IconButton.png",
            "states":["drop"]
        },
        {
            "index":1050,
            "name":"PortalLayout",
            "scImgURL":"classes/PortalLayout.png",
            "states":["drop"]
        },
        {
            "index":1060,
            "name":"RadioGroupItem",
            "scImgURL":"classes/RadioGroup.png",
            "states":["drop"]
        },
        {
            "index":1070,
            "name":"SearchForm",
            "scImgURL":"classes/SearchForm.png",
            "states":["drop"]
        },
        {
            "index":1080,
            "name":"SectionStackSection",
            "scImgURL":"classes/SectionStackSection.png",
            "states":["drop"]
        },
        {
            "index":1090,
            "name":"SelectOtherItem",
            "scImgURL":"classes/SelectOtherItem.png",
            "states":["drop"]
        },
        {
            "index":1100,
            "name":"SplitPane",
            "scImgURL":"classes/SplitPane.png",
            "states":["drop"]
        },
        {
            "index":1110,
            "name":"TileGrid",
            "scImgURL":"classes/TileGrid.png",
            "states":["drop"]
        },
        {
            "index":1120,
            "name":"TriplePane",
            "scImgURL":"classes/TriplePane.png",
            "states":["drop"]
        },
        {
            "index":1130,
            "name":"AbsoluteForm",
            "scImgURL":"classes/AbsoluteForm.png",
            "states":["drop"]
        },
        {
            "index":1140,
            "name":"LayoutSpacer",
            "scImgURL":"classes/LayoutSpacer.png"
        },
        {
            "index":1150,
            "name":"Label",
            "scImgURL":"classes/Label.png"
        },
        {
            "index":1160,
            "name":"BlurbItem",
            "scImgURL":"classes/BlurbItem.png"
        },
        {
            "index":1170,
            "name":"FileItem",
            "scImgURL":"classes/FileItem.png"
        },
        {
            "index":1180,
            "name":"HiddenItem",
            "scImgURL":"classes/HiddenItem.png"
        },
        {
            "index":1190,
            "name":"PasswordItem",
            "scImgURL":"classes/PasswordItem.png"
        },
        {
            "index":1200,
            "name":"ResetItem",
            "scImgURL":"classes/ResetItem.png"
        },
        {
            "index":1210,
            "name":"SpacerItem",
            "scImgURL":"classes/SpacerItem.png"
        },
        {
            "index":1220,
            "name":"StaticTextItem",
            "scImgURL":"classes/StaticTextItem.png"
        },
        {
            "index":1230,
            "name":"SubmitItem",
            "scImgURL":"classes/SubmitItem.png"
        },
        {
            "index":1240,
            "name":"TextAreaItem",
            "scImgURL":"classes/TextAreaItem.png"
        },
        {
            "index":1250,
            "name":"TextItem",
            "scImgURL":"classes/TextItem.png"
        },
        {
            "index":1260,
            "name":"TimeItem",
            "scImgURL":"classes/TimeItem.png"
        },
        {
            "index":1270,
            "name":"ToolStripSeparator",
            "scImgURL":"classes/ToolStripSeparator.png"
        },
        {
            "index":1280,
            "name":"SpinnerItem",
            "scImgURL":"classes/SpinnerItem.png"
        },
        {
            "index":1290,
            "name":"FontLoader",
            "scImgURL":"classes/FontLoader.png"
        },
        {
            "index":1300,
            "name":"RibbonGroup",
            "scImgURL":"classes/RibbonGroup.png"
        },
        {
            "index":1310,
            "name":"FormulaBuilder",
            "scImgURL":"classes/FormulaBuilder.png"
        },
        {
            "index":1320,
            "name":"FilterBuilder",
            "scImgURL":"classes/FilterBuilder.png"
        },
        {
            "index":2000,
            "name":"Header",
            "scImgURL":"classes/Header.png"
        },
        {
            "index":2010,
            "name":"Background",
            "scImgURL":"classes/Background.png"
        },
        {
            "index":2020,
            "name":"Text",
            "scImgURL":"classes/Text.png"
        },
        {
            "index":2030,
            "name":"Border",
            "scImgURL":"classes/Border.png"
        },
        {
            "index":2040,
            "name":"GroupLabel",
            "scImgURL":"classes/GroupLabel.png"
        },
        {
            "index":2050,
            "name":"Font",
            "scImgURL":"classes/Font.png"
        }
    ]
;

isc.ImagePicker.addStockIconGroup("classIcons","Class Icons",isc.Class.standardClassIcons,"[TOOLSIMG]");
isc.defineClass("StylingEditor","VLayout");
isc.A=isc.StylingEditor;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.borderStyles=["none","solid","dotted","dashed","double","groove","ridge","inset",
        "outset","hidden"];
isc.B.push(isc.A.showInWindow=function isc_c_StylingEditor_showInWindow(config,callback){
        config=config||{title:"Border / Padding Editor"};
        var editor=isc.StylingEditor.create(config);
        var win=isc.Window.create({
            title:config.title,
            overflow:"visible",
            autoSize:true,
            callback:callback,
            items:[
                editor
            ],
            hide:function(){
                if(this.callback)this.callback();
                this.Super("hide",arguments);
            }
        });
        win.centerInPage();
        win.show();
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.StylingEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.layoutMargin=10;
isc.A.membersMargin=10;
isc.A.showRadiusItem=false;
isc.A.allowAsymmetricBorder=true;
isc.A.allowAsymmetricRadius=true;
isc.A.showSymmetryForm=true;
isc.A.symmetryFormDefaults={
        _constructor:"DynamicForm",
        overflow:"visible",
        height:1,
        numCols:4,
        colWidths:["*","*","*","*"],
        items:[
            {name:"symmetric",editorType:"CheckboxItem",title:"Symmetric Border",width:"*",
                showIf:"return form.creator.allowAsymmetricBorder;",
                changed:function(form,item,value){
                    form.creator.changeSymmetricBorder(value);
                }
            },
            {name:"symmetricRadius",editorType:"CheckboxItem",title:"Symmetric Radius",width:"*",
                showIf:"return form.creator.allowAsymmetricRadius;",
                changed:function(form,item,value){
                    form.creator.changeSymmetricRadius(value);
                }
            }
        ],
        setSymmetric:function(symmetric){
            this.setValue("symmetric",symmetric);
            this.setValue("symmetricRadius",symmetric);
        }
    };
isc.A.showBorderEditor=true;
isc.A.borderEditorDefaults={
        _constructor:"DynamicForm",
        overflow:"visible",
        height:1,
        padding:5,
        autoDraw:false,
        items:[
            {name:"border",editorType:"BorderEditorItem",title:"All",
                showRadiusItem:true,
                showItemTitles:true,
                width:"*",colSpan:"*",
                showIf:"return form.creator.symmetricBorder;"
            },
            {name:"border-top",editorType:"BorderEditorItem",title:"Top",
                showItemTitles:true,
                width:"*",colSpan:"*",
                showIf:"return !form.creator.symmetricBorder;"
            },
            {name:"border-right",editorType:"BorderEditorItem",title:"Right",
                showItemTitles:false,
                width:"*",colSpan:"*",
                showIf:"return !form.creator.symmetricBorder;"
            },
            {name:"border-bottom",editorType:"BorderEditorItem",title:"Bottom",
                showItemTitles:false,
                width:"*",colSpan:"*",
                showIf:"return !form.creator.symmetricBorder;"
            },
            {name:"border-left",editorType:"BorderEditorItem",title:"Left",
                showItemTitles:false,
                width:"*",colSpan:"*",
                showIf:"return !form.creator.symmetricBorder;"
            },
            {name:"border-radius",editorType:"SpinnerItem",title:"Radius",width:"*",
                defaultValue:0,
                showIf:"return form.creator.symmetricRadius;"
            },
            {name:"border-top-left-radius",editorType:"SpinnerItem",title:"TL",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricRadius;"
            },
            {name:"border-top-right-radius",editorType:"SpinnerItem",title:"TR",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricRadius;"
            },
            {name:"border-bottom-right-radius",editorType:"SpinnerItem",title:"BR",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricRadius;"
            },
            {name:"border-bottom-left-radius",editorType:"SpinnerItem",title:"BL",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricRadius;"
            }
        ],
        itemChanged:function(item,newValue){
            this.creator.borderChanged(item,newValue);
        }
    };
isc.A.showPaddingEditor=true;
isc.A.paddingEditorDefaults={
        _constructor:"DynamicForm",
        titleOrientation:"top",
        overflow:"visible",
        height:1,
        padding:5,
        items:[
            {name:"padding",editorType:"SpinnerItem",title:"All",width:"*",
                defaultValue:0,
                showIf:"return form.creator.symmetricPadding;"
            },
            {name:"padding-top",editorType:"SpinnerItem",title:"Top",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricPadding;"
            },
            {name:"padding-right",editorType:"SpinnerItem",title:"Right",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricPadding;"
            },
            {name:"padding-bottom",editorType:"SpinnerItem",title:"Bottom",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricPadding;"
            },
            {name:"padding-left",editorType:"SpinnerItem",title:"Left",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricPadding;"
            }
        ],
        itemChanged:function(item,newValue){
            this.creator.paddingChanged(item,newValue);
        }
    };
isc.A.showRadiusEditor=true;
isc.A.radiusEditorDefaults={
        _constructor:"DynamicForm",
        titleOrientation:"top",
        overflow:"visible",
        height:1,
        padding:5,
        items:[
            {name:"border-radius",editorType:"SpinnerItem",title:"All",width:"*",
                defaultValue:0,
                showIf:"return form.creator.symmetricRadius;"
            },
            {name:"border-top-left-radius",editorType:"SpinnerItem",title:"TL",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricRadius;"
            },
            {name:"border-top-right-radius",editorType:"SpinnerItem",title:"TR",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricRadius;"
            },
            {name:"border-bottom-right-radius",editorType:"SpinnerItem",title:"BR",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricRadius;"
            },
            {name:"border-bottom-left-radius",editorType:"SpinnerItem",title:"BL",width:"*",
                defaultValue:0,
                showIf:"return !form.creator.symmetricRadius;"
            }
        ],
        itemChanged:function(item,newValue){
            this.creator.radiusChanged(item,newValue);
        }
    };
isc.A.previewCanvasDefaults={
        _constructor:"CSSPreviewCanvas"
    };
isc.A.symmetric=true;
isc.B.push(isc.A.changeSymmetric=function isc_StylingEditor_changeSymmetric(symmetric){
        this.symmetric=symmetric;
        this.changeSymmetricBorder(symmetric);
        this.changeSymmetricRadius(symmetric);
        this.changeSymmetricPadding(symmetric);
    }
,isc.A.changeSymmetricBorder=function isc_StylingEditor_changeSymmetricBorder(symmetric){
        this.symmetricBorder=symmetric;
        if(this.showBorderEditor)this.borderEditor.redraw();
    }
,isc.A.changeSymmetricRadius=function isc_StylingEditor_changeSymmetricRadius(symmetric){
        this.symmetricRadius=symmetric;
        if(this.showRadiusEditor)this.radiusEditor.redraw();
    }
,isc.A.changeSymmetricPadding=function isc_StylingEditor_changeSymmetricPadding(symmetric){
        this.symmetricPadding=symmetric;
        if(this.showPaddingEditor)this.paddingEditor.redraw();
    }
,isc.A.getAllSettings=function isc_StylingEditor_getAllSettings(){
        var settings={};
        if(this.showBorderEditor)settings=isc.addProperties(settings,this.getBorderSettings());
        if(this.showRadiusEditor)settings=isc.addProperties(settings,this.getRadiusSettings());
        if(this.showPaddingEditor)settings=isc.addProperties(settings,this.getPaddingSettings());
        return settings;
    }
,isc.A.borderChanged=function isc_StylingEditor_borderChanged(item,value){
        this.updatePreview();
    }
,isc.A.getBorderSettings=function isc_StylingEditor_getBorderSettings(){
        var values=this.borderEditor.getValues();
        if(values&&values.style=="none")return{style:"none"};
        if(this.symmetricBorder){
            values={border:values.border};
        }else{
            if(values["border"]!=null)delete values["border"];
        }
        return values;
    }
,isc.A.paddingChanged=function isc_StylingEditor_paddingChanged(){
        this.updatePreview();
    }
,isc.A.getPaddingSettings=function isc_StylingEditor_getPaddingSettings(){
        var values=this.paddingEditor.getValues();
        if(this.symmetricPadding){
            values={"padding":values["padding"]};
        }else{
            if(values["padding"]!=null)delete values["padding"];
        }
        if(isc.getKeys(values).length==0)return{};
        return values;
    }
,isc.A.radiusChanged=function isc_StylingEditor_radiusChanged(item,value){
        this.updatePreview();
    }
,isc.A.getRadiusSettings=function isc_StylingEditor_getRadiusSettings(){
        var values=this.radiusEditor.getValues();
        if(isc.getKeys(values).length==0)return{};
        if(this.symmetricRadius){
            values={"border-radius":values["border-radius"]};
        }else{
            if(values["border-radius"]!=null)delete values["border-radius"];
        }
        return values;
    }
,isc.A.updatePreview=function isc_StylingEditor_updatePreview(){
        var settings={};
        if(this.showBorderEditor){
            var border=this.getBorderSettings();
            isc.addProperties(settings,border);
        }
        if(this.showRadiusEditor){
            var radius=this.getRadiusSettings();
            if(radius!=""){
                var p=this.previewCanvas;
                var radiusCSS="";
                if(radius["border-radius"]!=null)radiusCSS+=radius["border-radius"]+"px";
                else{
                    if(radius["border-top-left-radius"]!=null)radiusCSS+=radius["border-top-left-radius"]+"px "
                    if(radius["border-top-right-radius"]!=null)radiusCSS+=radius["border-top-right-radius"]+"px "
                    if(radius["border-bottom-right-radius"]!=null)radiusCSS+=radius["border-bottom-right-radius"]+"px "
                    if(radius["border-bottom-left-radius"]!=null)radiusCSS+=radius["border-bottom-left-radius"]+"px "
                }
                settings.radius=radiusCSS;
            }
        }
        if(this.showPaddingEditor){
            var padding=this.getPaddingSettings();
            if(padding!=""){
                var p=this.previewCanvas;
                var paddingCSS="";
                if(padding.padding!=null)paddingCSS+=padding.padding+"px";
                else{
                    if(padding["padding-top"]!=null)paddingCSS+=padding["padding-top"]+"px "
                    if(padding["padding-right"]!=null)paddingCSS+=padding["padding-right"]+"px "
                    if(padding["padding-bottom"]!=null)paddingCSS+=padding["padding-bottom"]+"px "
                    if(padding["padding-left"]!=null)paddingCSS+=padding["padding-left"]+"px"
                }
                settings.padding=paddingCSS;
            }
        }
        var handle=this.previewCanvas.getPreviewHandle();
        if(handle!=null){
            this.applyPreviewCSS(handle,settings);
        }
    }
,isc.A.applyPreviewCSS=function isc_StylingEditor_applyPreviewCSS(handle,settings){
        for(var key in settings){
            handle[key]=settings[key];
            if(key=="radius"||key=="borderRadius"){
                handle["border-radius"]=settings[key];
            }
        }
    }
,isc.A.initWidget=function isc_StylingEditor_initWidget(){
        this.Super("initWidget",arguments);
        if(this.showSymmetryForm!=false){
            this.addAutoChild("symmetryForm",{
            });
            this.symmetryForm.setValue("symmetric",this.symmetric);
            this.addMember(this.symmetryForm);
        }else{
        }
        if(this.showBorderEditor!=false){
            this.addAutoChild("borderEditor",{
                numCols:4,
                colWidths:"*",
                showRadiusItem:this.showRadiusItem,
                groupTitle:"Border",
                isGroup:this.showPaddingEditor
            });
            this.addMember(this.borderEditor);
        }else{
        }
        if(this.showRadiusEditor){
            this.addAutoChild("radiusEditor",{
                numCols:4,
                colWidths:[80,80,80,80],
                groupTitle:"Radius",
                isGroup:this.showRadiusEditor
            });
            this.addMember(this.radiusEditor);
        }
        if(this.showPaddingEditor){
            this.addAutoChild("paddingEditor",{
                numCols:4,
                colWidths:[80,80,80,80],
                groupTitle:"Padding",
                isGroup:this.showBorderEditor
            });
            this.addMember(this.paddingEditor);
        }
        this.addAutoChild("previewCanvas",{ID:this.getID()+"_previewCanvas"});
        this.addMember(this.previewCanvas);
        if(this.showBorderEditor)this.previewCanvas.setBorder(null);
        this.symmetryForm.setSymmetric(true);
        this.changeSymmetric(true);
    }
,isc.A.draw=function isc_StylingEditor_draw(){
        this.Super("draw",arguments);
        this.previewCanvas.setWidth("100%");
        this.previewCanvas.setHeight("100%");
        this.updatePreview();
    }
);
isc.B._maxIndex=isc.C+15;

isc.defineClass("CSSPreviewCanvas","Label");
isc.A=isc.CSSPreviewCanvas.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=1;
isc.A.height=1;
isc.A.border="1px solid #808080";
isc.A.layoutAlign="center";
isc.A.styleName="preview";
isc.A.autoDraw=true;
isc.A.autoSize=true;
isc.A.contents="Preview Settings";
isc.A.wrap=false;
isc.B.push(isc.A.initWidget=function isc_CSSPreviewCanvas_initWidget(){
        this.Super("initWidget",arguments);
    }
,isc.A.getPreviewHandle=function isc_CSSPreviewCanvas_getPreviewHandle(){
        var handle=this.getStyleHandle();
        return handle;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("BorderEditorItem","CanvasItem");
isc.A=isc.BorderEditorItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.shouldSaveValue=true;
isc.A.showItemTitles=true;
isc.A.autoDraw=false;
isc.A.canvasDefaults={
        _constructor:"DynamicForm",
        titleOrientation:"top",
        titleAlign:"center",
        overflow:"visible",
        numCols:3,
        colWidths:[80,60,120],
        height:1,
        padding:0,
        autoDraw:false,
        itemChanged:function(){
            this.creator.fireChanged();
        }
    };
isc.B.push(isc.A.init=function isc_BorderEditorItem_init(){
        this.canvasDefaults.items=[
            {name:"border-style",type:"string",title:"Style",width:"*",
                valueMap:isc.StylingEditor.borderStyles.duplicate(),
                defaultValue:"solid",showTitle:this.showItemTitles,
                changed:function(form,item,value){
                    var disable=(value=="none");
                    form.getItem("border-width").setDisabled(disable);
                    form.getItem("border-color").setDisabled(disable);
                }
            },
            {name:"border-width",title:"Width",editorType:"SpinnerItem",width:"*",
                defaultValue:1,showTitle:this.showItemTitles
            },
            {name:"border-color",title:"Color",editorType:"ColorItem",width:"*",
                defaultValue:"#FF0000",showTitle:this.showItemTitles
            }
        ];
        this.Super("init",arguments);
        this.form=this.canvas;
    }
,isc.A.drawn=function isc_BorderEditorItem_drawn(){
        this.Super("drawn",arguments);
        this.storeValue(this.getValue());
    }
,isc.A.setValue=function isc_BorderEditorItem_setValue(value){
        if(value!=null){
            var border=isc.CSSEditor.parseCSSSetting("border",value);
            var css=border["border-width"]+" "+border["border-style"]+" "+border["border-color"];
            this._initialValue={css:css,obj:border};
        }else{
            this._initialValue=value;
        }
        this.Super("setValue",value);
        this.canvas.setValues(border);
        if(border){
            this.canvas.getField("border-width").setDisabled(border["border-style"]=="none");
            this.canvas.getField("border-color").setDisabled(border["border-style"]=="none");
        }
    }
,isc.A.getValue=function isc_BorderEditorItem_getValue(){
        var values=this.getValues();
        var result;
        if(values.style=="none"){
            return"none";
        }else if(this.returnSingleValue!=false){
            return this.getSingleValue();
        }else{
            return values;
        }
    }
,isc.A.getSingleValue=function isc_BorderEditorItem_getSingleValue(){
        var values=this.canvas.getValues();
        if(values.style=="none")return values.style;
        return values["border-width"]+"px "+values["border-style"]+" "+values["border-color"];
    }
,isc.A.getValues=function isc_BorderEditorItem_getValues(changedOnly){
        if(changedOnly){
        }
        return this.canvas.getValues();
    }
,isc.A.fireChanged=function isc_BorderEditorItem_fireChanged(){
        if(this._inFireChanged)return;
        this._inFireChanged=true;
        this.storeValue(this.getValue());
        this.form.itemChanged(this,this.getValue());
        delete this._inFireChanged;
    }
);
isc.B._maxIndex=isc.C+7;

isc.defineClass("FontEditorItem","CanvasItem");
isc.A=isc.FontEditorItem;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getStyledFontName=function isc_c_FontEditorItem_getStyledFontName(name,title){
        return"<span style='font-family: "+name+";'>"+title+"</span>";
    }
,isc.A.getAvailableFonts=function isc_c_FontEditorItem_getAvailableFonts(){
        var result={
            "calibri":isc.FontEditorItem.getStyledFontName("calibri","Calibri"),
            "corbel":isc.FontEditorItem.getStyledFontName("corbel","Corbel"),
            "corbel-bold":isc.FontEditorItem.getStyledFontName("corbel-bold","Corbel Bold"),
            "RobotoLight":isc.FontEditorItem.getStyledFontName("RobotoLight","RobotoLight")
        };
        return result;
    }
);
isc.B._maxIndex=isc.C+2;

isc.A=isc.FontEditorItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.shouldSaveValue=true;
isc.A.showItemTitles=true;
isc.A.autoDraw=false;
isc.A.canvasDefaults={
        _constructor:"DynamicForm",
        titleOrientation:"top",
        titleAlign:"center",
        overflow:"visible",
        numCols:4,
        colWidths:["*",60,60,80],
        height:1,
        padding:0,
        showItemTitles:true,
        autoDraw:false,
        itemChanged:function(){
            this.creator.fireChanged();
        }
    };
isc.B.push(isc.A.init=function isc_FontEditorItem_init(){
        this.canvasDefaults.items=[
            {name:"font-family",title:"Family",editorType:"SelectItem",width:"*",
                defaultValue:"RobotoLight",showTitle:true,
                valueMap:isc.FontEditorItem.getAvailableFonts()
            },
            {name:"font-size",title:"Size",editorType:"SpinnerItem",width:"*",
                defaultValue:14,showTitle:true
            },
            {name:"line-height",title:"Line H",editorType:"SpinnerItem",width:"*",
                defaultValue:14,showTitle:true
            },
            {name:"font-weight",title:"Weight",editorType:"SpinnerItem",width:"*",
                defaultValue:400,showTitle:true
            },
            {name:"font-variant",title:"Variant",editorType:"SelectItem",width:"*",
                defaultValue:"normal",showTitle:true,
                showIf:"return false;",
                valueMap:[{"normal":"Normal","small-caps":"SmallCaps"}]
            }
        ];
        this.Super("init",arguments);
    }
,isc.A.drawn=function isc_FontEditorItem_drawn(){
        this.Super("drawn",arguments);
        this.storeValue(this.getValue());
    }
,isc.A.setValue=function isc_FontEditorItem_setValue(value){
        if(value!=null){
            var bits=value.split(" ");
            var font={};
            font["font-family"]=bits[bits.length-1];
            bits.removeAt(bits.length-1);
            var sizeBits=bits[bits.length-1].split("/");
            font["font-size"]=sizeBits[0];
            if(sizeBits.length==2)font["line-height"]=sizeBits[1];
            this._initialValue={css:value,obj:font};
        }else{
            this._initialValue=value;
        }
        this.canvas.setValues(font);
    }
,isc.A.getValue=function isc_FontEditorItem_getValue(){
        return this.getSingleValue();
    }
,isc.A.getSingleValue=function isc_FontEditorItem_getSingleValue(){
        var values=this.getValues();
        var result=values["font-family"];
        if(values["font-size"]!=null){
            var sizeCSS=values["font-size"]+"px";
            if(values["line-height"]!=null)sizeCSS+="/"+values["line-height"]+"px";
            result=sizeCSS+" "+result;
        }
        if(values["font-weight"]!=null){
            result=values["font-weight"]+" "+result;
        }
        if(values["font-variant"]!=null){
            result=values["font-variant"]+" "+result;
        }
        return result;
    }
,isc.A.getValues=function isc_FontEditorItem_getValues(changedOnly){
        if(changedOnly){
        }
        return this.canvas.getValues();
    }
,isc.A.fireChanged=function isc_FontEditorItem_fireChanged(){
        if(this._inFireChanged)return;
        this._inFireChanged=true;
        this.storeValue(this.getValue());
        this.form.itemChanged(this,this.getValue());
        delete this._inFireChanged;
    }
);
isc.B._maxIndex=isc.C+7;

isc.defineClass("PaddingEditorItem","FormItem");
isc.A=isc.PaddingEditorItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.showPickerIcon=true;
isc.B.push(isc.A.showPicker=function isc_PaddingEditorItem_showPicker(){
        var _this=this;;
        isc.BorderPaddingEditor.showInWindow({
            title:"Padding Editor",
            showBorderEditor:false,
            showPaddingEditor:true,
            value:this.getValue()
        },function(value){
        });
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("CSSEditor","VLayout");
isc.A=isc.CSSEditor;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._cssGroups=[
        {name:"border",title:"Borders",allowAsymmetry:true,
            settings:["border","border-radius"]
        },
        {name:"padding",title:"Padding",allowAsymmetry:true,
            settings:["padding"]
        },
        {name:"font",title:"Font",
            settings:["font","color"]
        },
        {name:"text",title:"Text Setttings",
            settings:["color","font","font-variant","text-shadow"
            ]
        },
        {name:"box",title:"Box Settings",allowAsymmetry:true,
            settings:["border","border-radius","padding","margin","box-shadow"]
        },
        {name:"background",title:"Background Settings",
            settings:["background",
                "background-color","background-image","background-gradient"
            ]
        },
        {name:"other",title:"Other Settings",allowAsymmetry:true,allowAddSettings:true,
            settings:[]
        },
        {name:"_default",title:"Settings",expanded:true,canCollapse:false,
            allowAsymmetry:false,allowAddSettings:false,customGroup:true,
            settings:[]
        }
    ];
isc.A._cssSettings=[
        {name:"border",editorType:"CSSBorderItem",
            group:"box",
            title:"Border",allowAsymmetry:true,
            asymmetricSettings:["border-top","border-right","border-bottom","border-left"]
        },
        {name:"border-style",editorType:"CSSEditItem",group:"box",title:"Style",
            allowAsymmetry:true,
            defaultEditorType:"SelectItem",
            asymmetricSettings:["border-top-style","border-right-style","border-bottom-style","border-left-style"]
        },
        {name:"border-width",editorType:"CSSSizeItem",group:"box",title:"Width",
            allowAsymmetry:true,
            asymmetricSettings:["border-top-width","border-right-width","border-bottom-width","border-left-width"]
        },
        {name:"border-color",editorType:"CSSEditItem",group:"box",title:"Color",
            allowAsymmetry:true,
            defaultEditorType:"ColorItem",
            asymmetricSettings:["border-top-color","border-right-color","border-bottom-color","border-left-color"]
        },
        {name:"border-left",editorType:"CSSBorderItem",group:"box",title:"Left"},
        {name:"border-top",editorType:"CSSBorderItem",group:"box",title:"Top"},
        {name:"border-right",editorType:"CSSBorderItem",group:"box",title:"Right"},
        {name:"border-bottom",editorType:"CSSBorderItem",group:"box",title:"Bottom"},
        {name:"border-left",editorType:"CSSBorderItem",group:"box",title:"Left"},
        {name:"border-radius",editorType:"CSSSizeItem",group:"box",
            title:"Radius",allowAsymmetry:true,titles:["TL","TR","BR","BL"],
            defaultValue:0,
            asymmetricSettings:["border-top-left-radius","border-top-right-radius",
                "border-bottom-right-radius","border-bottom-left-radius"]
        },
        {name:"border-top-left-radius",editorType:"CSSSizeItem",
            group:"box",title:"TL"},
        {name:"border-top-right-radius",editorType:"CSSSizeItem",
            group:"box",title:"TR"},
        {name:"border-bottom-right-radius",editorType:"CSSSizeItem",
            group:"box",title:"BR"},
        {name:"border-bottom-left-radius",editorType:"CSSSizeItem",
            group:"box",title:"BL"},
        {name:"padding",editorType:"CSSSizeItem",group:"box",
            title:"Padding",allowAsymmetry:true,
            asymmetricSettings:["padding-top","padding-right","padding-bottom","padding-left"]
        },
        {name:"padding-top",editorType:"CSSSizeItem",group:"box",title:"T"},
        {name:"padding-right",editorType:"CSSSizeItem",group:"box",title:"R"},
        {name:"padding-bottom",editorType:"CSSSizeItem",group:"box",title:"B"},
        {name:"padding-left",editorType:"CSSSizeItem",group:"box",title:"L"},
        {name:"margin",editorType:"CSSSizeItem",group:"box",
            title:"Margin",allowAsymmetry:true,
            asymmetricSettings:["margin-top","margin-right","margin-bottom","margin-left"]
        },
        {name:"margin-top",editorType:"CSSSizeItem",group:"box",title:"T"},
        {name:"margin-right",editorType:"CSSSizeItem",group:"box",title:"R"},
        {name:"margin-bottom",editorType:"CSSSizeItem",group:"box",title:"B"},
        {name:"margin-left",editorType:"CSSSizeItem",group:"box",title:"L"},
        {name:"box-shadow",editorType:"CSSShadowItem",group:"box",title:"Shadow"},
        {name:"color",editorType:"CSSEditItem",defaultEditorType:"ColorItem",
            group:"text",title:"Color",
            editorProperties:{colSpan:2,endRow:true}},
        {name:"font",editorType:"CSSEditItem",group:"text",title:"Font",
            defaultEditorType:"FontEditorItem"
        },
        {name:"font-family",editorType:"CSSEditItem",
            defaultEditorType:"SelectItem",group:"text",title:"Family"
        },
        {name:"font-size",editorType:"CSSSizeItem",group:"text",title:"Size"},
        {name:"font-weight",editorType:"CSSSizeItem",valueSuffix:"",
            group:"text",title:"Weight"
        },
        {name:"line-height",editorType:"CSSSizeItem",group:"text",title:"Line-height"},
        {name:"font-variant",editorType:"CSSEditItem",group:"text",title:"Variant"},
        {name:"text-shadow",editorType:"CSSShadowItem",group:"text",title:"Shadow"},
        {name:"background",editorType:"CSSEditItem",group:"background",
            title:"Background"},
        {name:"background-color",editorType:"ColorItem",group:"background",
            title:"Color"},
        {name:"background-image",editorType:"ImagePickerItem",group:"background",title:"Image"},
        {name:"background-gradient",editorType:"CSSGradientItem",group:"background",
            settingName:"background-image",
            title:"Gradient"}
    ];
isc.B.push(isc.A.parseCSSSetting=function isc_c_CSSEditor_parseCSSSetting(setting,value){
        var result={};
        var name=isc.isAn.Object(setting)?setting.name:setting;
        switch(name){
            case"border":
                var str=value;
                if(str=="none"){
                    str="1px none #000000";
                }else{
                var r=/((rgb|rgba|hsl|hsv)\(.*?\))/g;
                var colorFuncs=str.match(r);
                if(colorFuncs){
                    for(var i=0;i<colorFuncs.length;i++){
                        str=str.replace(colorFuncs[i],new isc.tinycolor(colorFuncs[i]).toHexString());
                    }
                }
                colorFuncs=null;
                }
                var bits=str.split(" ");
                for(var i=0;i<bits.length;i++){
                    if(isc.StylingEditor.borderStyles.contains(bits[i])){
                        result["border-style"]=bits[i];
                    }else if(parseInt(bits[i])){
                        result["border-width"]=parseInt(bits[i]);
                    }else{
                        result["border-color"]=bits[i];
        }
                }
                break;
            case"padding":
                var bits=value.split(" ");
                var rBits=[];
                if(bits.length==1){
                    rBits.add(bits[0]);
                }else{
                    rBits.addList(bits);
                    if(rBits.length==2)rBits.add(rBits[0]);
                    if(rBits.length==3)rBits.add(rBits[1]);
                }
                result[name]=rBits.join("px ").trim();
                break;
            default:
                result[name]=value;
        }
        return result;
    }
,isc.A.getCSSSetting=function isc_c_CSSEditor_getCSSSetting(name){
        var obj=isc.isAn.Object(name)?name:{"name":name};
        var result=isc.addProperties({},isc.CSSEditor._cssSettings.find("name",obj.name),obj);
        return result;
    }
,isc.A.getCSSGroup=function isc_c_CSSEditor_getCSSGroup(name){
        var obj=isc.isAn.Object(name)?name:{"name":name};
        var group=isc.CSSEditor._cssGroups.find("name",obj.name);
        if(!group){
            group=isc.CSSEditor._cssGroups.find("name","_default");
        }
        var result=isc.addProperties({},group,obj);
        return result;
    }
,isc.A.editProperties=function isc_c_CSSEditor_editProperties(properties,callback,config){
        if(!isc.isAn.Array(properties))properties=[properties];
        config=config||{};
        if(config.left==null)config.left=0;
        if(config.top==null)config.top=0;
        isc.CSSEditor.editPropertyGroup({name:"settings",settings:properties},null,callback,config);
    }
,isc.A.editPropertyGroup=function isc_c_CSSEditor_editPropertyGroup(group,settings,callback,config){
        config=config||{autoDraw:true};
        var groups=[];
        if(group!=null){
            if(isc.isAn.Array(group))groups.addList(group);
            groups.add(group);
            if(settings){
                groups.map(function(item){item.settings=settings});
            }
            config.groups=groups;
        }
        if(callback)config.editComplete=callback;
        if(config.left==null)config.left=isc.EH.getX();
        if(config.top==null)config.top=isc.EH.getY();
        if(config.width==null)config.width=380;
        if(config.height==null)config.height=1;
        var ed=isc.CSSEditor.create(config);
        if(!ed.isDrawn())ed.draw();
        else ed.redraw();
        ed.show();
        return ed;
    }
,isc.A.showInWindow=function isc_c_CSSEditor_showInWindow(config,callback){
        config=config||{title:"Border / Padding Editor"};
        var editor=isc.CSSEditor.create(config);
        var win=isc.Window.create({
            title:config.title,
            overflow:"visible",
            autoSize:true,
            editComplete:callback,
            editor:editor,
            items:[
                editor
            ],
            hide:function(){
                if(this.editComplete){
                    this.editComplete(this.editor.getCSSProperties(),this.editor.record);
                }
                this.Super("hide",arguments);
            }
        });
        win.centerInPage();
        win.show();
    }
);
isc.B._maxIndex=isc.C+6;

isc.A=isc.CSSEditor.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=380;
isc.A.backgroundColor="white";
isc.A.initialGroups=["border","font"];
isc.A.stackDefaults={
        _constructor:"SectionStack",
        width:"100%",height:1,
        headerHeight:30,
        visibilityMode:"multiple",
        animateSections:false,
        overflow:"visible"
    };
isc.A.sectionHeaderFormDefaults={
        _constructor:"DynamicForm",
        width:1,
        items:[
            {name:"asymmetry",editorType:"CheckboxItem",prompt:"Asymmetric",
                title:"Asymmetric",showTitle:true,width:30,textAlign:"left",
                showIf:"return form.cssGroup.allowAsymmetry;",
                changed:function(form,item,value){
                    var sectionHeader=form.parentElement.parentElement;
                    sectionHeader.items[0].setShowAsymmetry(value);
                }
            },
            {
                name:"addSettings",editorType:"StaticTextItem",showTitle:false,
                icons:[
                    {
                        alwaysEnable:true,
                        src:"[SKINIMG]actions/edit.png",prompt:"Add Settings",
                        click:function(){
                            var section=this.form.parentElement.parentElement.parentElement;
                            section.showAddSettingsDialog();
                        }
                    }
                ],
                showIf:"return form.cssGroup.allowAddSettings;"
            }
        ]
    };
isc.A.sectionFormDefaults={
        _constructor:"CSSEditForm",
        height:1
    };
isc.A.showPreviewControls=true;
isc.A.okButtonDefaults={
        _constructor:"Img",
        width:18,height:18,
        src:"[SKINIMG]actions/accept.png",
        prompt:"Accept changes",
        click:function(){
            this.creator.acceptChanges();
        }
    };
isc.A.cancelButtonDefaults={
        _constructor:"Img",
        width:18,height:18,
        src:"[SKINIMG]actions/cancel.png",
        prompt:"Discard changes",
        click:function(){
            this.creator.discardChanges();
        }
    };
isc.A.previewCanvasDefaults={
        _constructor:"CSSPreviewCanvas"
    };
isc.B.push(isc.A.initWidget=function isc_CSSEditor_initWidget(){
        this.visibleGroups=[];
        this.Super("initWidget",arguments);
        this.addAutoChild("stack");
        this.addMember(this.stack);
        this.setGroups();
    }
,isc.A.setValues=function isc_CSSEditor_setValues(values){
        this.values=values;
        for(var i=0;i<this.visibleGroups.length;i++){
            this.visibleGroups[i].form.setData(this.values);
        }
        this._valuesChanged();
    }
,isc.A.acceptChanges=function isc_CSSEditor_acceptChanges(){
        if(this.editComplete){
            this.editComplete(this.getCSSProperties(),this.record);
        }
    }
,isc.A.discardChanges=function isc_CSSEditor_discardChanges(){
        this.setValues(this.values);
        if(this.editCancelled)this.editCancelled();
    }
,isc.A.setGroups=function isc_CSSEditor_setGroups(groups){
        this._settingGroups=true;
        this.clearGroups();
        groups=groups||this.groups;
        if(groups){
            this.addGroups(groups);
        }
        if(this.showPreview!=false){
            this.previewLayout=isc.VLayout.create({
                width:"100%",
                height:50,
                align:"center",
                defaultLayoutAlign:"center"
            });
            if(!this.previewCanvas){
                this.previewCanvas=this.createAutoChild("previewCanvas",{ID:this.getID()+"_previewCanvas"});
            }
            this.previewLayout.addMembers(this.previewCanvas);
            var controls=null;
            if(this.showPreviewControls){
                this.okButton=this.createAutoChild("okButton");
                this.cancelButton=this.createAutoChild("cancelButton");
                controls=[this.cancelButton,this.okButton]
            }
            this.stack.addSection({name:"preview",title:"Preview",
                height:30,
                destroyOnRemove:true,
                expanded:true,canCollapse:false,
                controls:controls,
                items:[this.previewLayout]
            });
        }
        delete this._settingGroups;
        this.updatePreview();
    }
,isc.A.addGroups=function isc_CSSEditor_addGroups(groups,suppressUpdatePreview){
        if(!groups)return;
        if(!isc.isAn.Array(groups))groups=[groups];
        for(var i=0;i<groups.length;i++){
            var group=this.getCSSGroup(groups[i]);
            var s=this.getSection(group);
            group.section=s;
            group.form=s.items[0];
            this.visibleGroups.add(group);
            if(this.previewLayout)this.stack.addSection(s,this.stack.sections.length-2);
            else this.stack.addSection(s);
        }
        if(!suppressUpdatePreview)this.updatePreview();
    }
,isc.A.clearGroups=function isc_CSSEditor_clearGroups(){
        this.visibleGroups.removeAll(this.visibleGroups);
        this.previewCanvas=null;
        this.previewLayout=null;
        this.stack.removeSection(this.stack.getSectionNames());
    }
,isc.A.getGroup=function isc_CSSEditor_getGroup(name){
        return this.visibleGroups.find("name",name);
    }
,isc.A.getCSSGroup=function isc_CSSEditor_getCSSGroup(name){
        return isc.CSSEditor.getCSSGroup(name);
    }
,isc.A.getSection=function isc_CSSEditor_getSection(name,settings){
        var group=isc.isAn.Object(name)?name:this.getCSSGroup(name);
        if(!group)return;
        if(settings)group.settings=settings;
        var shouldExpand=group.expanded!=null?group.expanded:
                !this.stack.sections||this.stack.sections.length==0;
        var section={
            name:group.name,
            title:group.title,
            expanded:shouldExpand,
            allowAsymmetry:group.allowAsymmetry,
            allowAddSettings:group.allowAddSettings,
            cssGroup:group,
            showHeader:group.showSectionHeader==null?true:group.showSectionHeader,
            controls:[this.createAutoChild("sectionHeaderForm",{cssGroup:group})],
            items:[this.createGroupForm(group)]
        };
        if(group.canCollapse!=null)section.canCollapse=group.canCollapse;
        if(group.headerHeight!=null)section.headerHeight=group.headerHeight;
        if(group.showAsymmetry!=null)section.controls[0].setValues({"asymmetry":group.showAsymmetry});
        section.destroyOnRemove=true;
        group.form=section.items[0];
        return section;
    }
,isc.A.createGroupForm=function isc_CSSEditor_createGroupForm(group,values){
        var props=isc.addProperties({},{
                cssGroup:group,allowAsymmetry:group.allowAsymmetry,fields:[],
                cssEditor:this,values:{}
        });
        for(var i=0;i<group.settings.length;i++){
            var name=group.settings[i];
            var s=isc.CSSEditor.getCSSSetting(group.settings[i]);
            var fValue=values&&values[name];
            var f=isc.addProperties(
                {name:s.name,editorType:s.editorType,title:s.title,width:"*",
                    settingName:s.name,allowAsymmetry:s.allowAsymmetry,cssSetting:s
                },
                group.settings[i].editorProperties
            );
            if(fValue!=null){
                f.value=fValue;
                props.values[s.name]=fValue;
            }
            if(group.showAsymmetry!=null)f.showAsymmetry=group.showAsymmetry;
            if(s.valueSuffix!=null)f.valueSuffix=s.valueSuffix;
            if(s.defaultEditorType!=null)f.defaultEditorType=s.defaultEditorType;
            if(s.returnSingleValue!=null)f.returnSingleValue=s.returnSingleValue;
            props.fields.add(f);
        }
        var form=this.createAutoChild("sectionForm",props);
        form.setData(this.values);
        return form;
    }
,isc.A._itemChanged=function isc_CSSEditor__itemChanged(item,newValue){
        this._valuesChanged();
    }
,isc.A._valuesChanged=function isc_CSSEditor__valuesChanged(){
        this.updatePreview();
        if(this.valuesChanged)this.valuesChanged(this.getCSSProperties());
    }
,isc.A.updatePreview=function isc_CSSEditor_updatePreview(){
        if(this._settingGroups)return;
        var settings=this.getCSSProperties(true);
        var handle=this.previewCanvas.getPreviewHandle();
        if(handle!=null){
            this.applyPreviewCSS(handle,settings);
        }
    }
,isc.A.applyPreviewCSS=function isc_CSSEditor_applyPreviewCSS(handle,settings){
        for(var key in settings){
            if(settings[key]==null)continue;
            handle[key]=settings[key];
            if(key=="radius"||key=="borderRadius"){
                handle["border-radius"]=settings[key];
            }
        }
    }
,isc.A.draw=function isc_CSSEditor_draw(){
        this.Super("draw",arguments);
        this.updatePreview();
    }
,isc.A.getCSSProperties=function isc_CSSEditor_getCSSProperties(forceSingleValues){
        var settings={};
        for(var i=0;i<this.stack.sections.length;i++){
            var section=this.stack.sections[i];
            if(section.items[0].getCSSBlock){
                var block=section.items[0].getCSSBlock(forceSingleValues);
                isc.addProperties(settings,block);
            }
        }
        return settings;
    }
,isc.A.getCSSText=function isc_CSSEditor_getCSSText(){
        var settings=this.getCSSProperties();
        var result=[];
        for(var key in settings){
            result.add(key+":"+settings[key]);
        }
        return result.join("; ");
    }
);
isc.B._maxIndex=isc.C+18;

isc.defineClass("CSSEditForm","DynamicForm");
isc.A=isc.CSSEditForm.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.allowAsymmetry=true;
isc.A.showAsymmetry=false;
isc.A.width="100%";
isc.B.push(isc.A.setShowAsymmetry=function isc_CSSEditForm_setShowAsymmetry(showAsymmetry){
        this.showAsymmetry=showAsymmetry;
        this.items.map(function(item){
            if(item.allowAsymmetry&&item.setShowAsymmetry){
                item.setShowAsymmetry(showAsymmetry);
            }
        });
        this.cssEditor._valuesChanged();
    }
,isc.A.itemChanged=function isc_CSSEditForm_itemChanged(item,newValue){
        this.cssEditor._itemChanged(item,newValue);
    }
,isc.A.getCSSBlock=function isc_CSSEditForm_getCSSBlock(forceSingleValues){
        var result={};
        for(var i=0;i<this.items.length;i++){
            var item=this.items[i];
            if(item.visible){
                var values=item.getCSSProperties(forceSingleValues);
                isc.addProperties(result,values);
            }
        }
        return result;
    }
,isc.A.getCSSText=function isc_CSSEditForm_getCSSText(){
        var result="";
        for(var i=0;i<this.items.length;i++){
            var item=this.items[i];
            if(item.visible){
                result+=item.getCSSText();
            }
        }
        return result;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("CSSEditItem","CanvasItem");
isc.A=isc.CSSEditItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.allowAsymmetry=null;
isc.A.showAsymmetry=false;
isc.A.canvasConstructor="DynamicForm";
isc.A.canvasDefaults={
        titleOrientation:"top",
        titleAlign:"center",
        titleSuffix:"",
        numCols:4,
        colWidths:["*","*","*","*"],
        itemChanged:function(item,newValue){
            this.creator.itemChanged(item,newValue);
        }
    };
isc.A.defaultEditorType="TextItem";
isc.B.push(isc.A.createCanvas=function isc_CSSEditItem_createCanvas(){
        var props={items:this.getItemDefaults(this.name),values:{}};
        props.values[this.name]=this.value;
        this.canvas=this.createAutoChild("canvas",props);
        return this.canvas;
    }
,isc.A.setShowAsymmetry=function isc_CSSEditItem_setShowAsymmetry(showAsymmetry){
        if(this.allowAsymmetry){
            this.showAsymmetry=showAsymmetry;
            if(!showAsymmetry){
                this.canvas.items[0].setValue(this.canvas.items[1].getValue());
            }else{
                for(var i=1;i<5;i++){
                    this.canvas.items[i].setValue(this.canvas.items[0].getValue());
                }
            }
            this.canvas.redraw();
        }
    }
,isc.A.getItemDefaults=function isc_CSSEditItem_getItemDefaults(cssSetting){
        cssSetting=cssSetting||this.cssSetting;
        var s=isc.CSSEditor.getCSSSetting(cssSetting);
        if(!s)return null;
        this.allowAsymmetry=s.allowAsymmetry;
        var items=this.getEditItems(cssSetting,s)
        return items;
    }
,isc.A.getItemProps=function isc_CSSEditItem_getItemProps(name,editorType,showTitle,showItemTitles,asymmetric,editorProperties){
        var setting=isc.CSSEditor.getCSSSetting(name);
        var props=isc.addProperties({
            name:name,editorType:editorType,
            showTitle:showTitle,showItemTitles:showItemTitles,
            colSpan:"*",
            width:"*",
            asymmetric:asymmetric,
            returnSingleValue:this.returnSingleValue,
            showIf:function(){
                return this.asymmetric==this.form.creator.showAsymmetry;
            }
        },setting.editorProperties,editorProperties);
        if(this.value!=null)props.value=this.value;
        return props;
    }
,isc.A.getEditItems=function isc_CSSEditItem_getEditItems(cssSetting,section){
        var items=[
            this.getItemProps(cssSetting,this.defaultEditorType,false,false,false)
        ];
        return items;
    }
,isc.A.getCSSProperties=function isc_CSSEditItem_getCSSProperties(forceSingleValues){
        var result={};
        var singleValues=[];
        for(var i=0;i<this.canvas.items.length;i++){
            var item=this.canvas.items[i];
            if(item.showIf()){
                var value=null;
                if(forceSingleValues&&item.returnSingleValue==false){
                    value=item.getSingleValue();
                }else{
                    value=item.getValue();
                }
                if(value==null)continue;
                if(isc.isAn.Object(value)){
                    for(var key in value){
                        var v=value[key];
                        if(this.valueSuffix)v+=this.valueSuffix;
                        singleValues.add(""+v);
                        result[key]=v;
                    }
                }else{
                    if(this.valueSuffix)value+=this.valueSuffix;
                    result[item.name]=value;
                    singleValues.add(""+value);
                }
            }
        }
        if(this.returnSingleValue){
            result={};
            result[this.name]=singleValues.join(" ");
        }
        return result;
    }
,isc.A.getSingleValue=function isc_CSSEditItem_getSingleValue(){
        return this.getValue();
    }
,isc.A.getCSSText=function isc_CSSEditItem_getCSSText(){
        var result="";
        for(var i=0;i<this.canvas.items.length;i++){
            var item=this.canvas.items[i];
            if(item.visible){
                var value=item.getValue();
                if(value==null)continue;
                if(this.valueSuffix)value+=this.valueSuffix;
                result+=item.name+":"+value+";";
            }
        }
        return result;
    }
,isc.A.itemChanged=function isc_CSSEditItem_itemChanged(item,newValue){
        this.form.itemChanged(item,newValue);
    }
,isc.A.getCSSAttributeName=function isc_CSSEditItem_getCSSAttributeName(){
        var s=isc.CSSEditor.getCSSSetting(this.cssSetting);
        return(s?s.name:null)||this.name;
    }
,isc.A.setValue=function isc_CSSEditItem_setValue(value){
        var cssAttr=this.getCSSAttributeName();
        if(cssAttr=="padding"){
            var cssObj=isc.CSSEditor.parseCSSSetting(cssAttr,value);
            if(cssObj.padding.contains(" ")){
                this.setShowAsymmetry(true);
            }
            value=cssObj.padding;
        }
        this.Super("setValue",arguments);
        this.canvas.setValue(this.name,value);
    }
);
isc.B._maxIndex=isc.C+11;

isc.defineClass("CSSBorderItem","CSSEditItem");
isc.A=isc.CSSBorderItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.allowSymmetry=true;
isc.A.defaultEditorType="BorderEditorItem";
isc.B.push(isc.A.getEditItems=function isc_CSSBorderItem_getEditItems(cssSetting){
        var s=isc.CSSEditor.getCSSSetting(cssSetting);
        var items=[this.getItemProps("border",this.defaultEditorType,false,true,false)];
        if(this.allowAsymmetry&&s.asymmetricSettings){
            items.addList([
                this.getItemProps("border-top",this.defaultEditorType,false,true,true),
                this.getItemProps("border-right",this.defaultEditorType,false,false,true),
                this.getItemProps("border-bottom",this.defaultEditorType,false,false,true),
                this.getItemProps("border-left",this.defaultEditorType,false,false,true)
            ]);
        }
        return items;
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("CSSShadowItem","CSSEditItem");
isc.A=isc.CSSShadowItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.allowSymmetry=false;
isc.A.defaultEditorType="ShadowEditorItem";
isc.A.showIf="return false;";
isc.B.push(isc.A.getEditItems=function isc_CSSShadowItem_getEditItems(cssSetting){
        var s=isc.CSSEditor.getCSSSetting(cssSetting);
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("CSSSizeItem","CSSEditItem");
isc.A=isc.CSSSizeItem.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.allowSymmetry=true;
isc.A.itemTitles=["T","R","B","L"];
isc.A.defaultEditorType="SpinnerItem";
isc.A.defaultValue=0;
isc.A.valueSuffix="px";
isc.B.push(isc.A.getEditItems=function isc_CSSSizeItem_getEditItems(cssSetting){
        var s=isc.CSSEditor.getCSSSetting(cssSetting);
        var names=[cssSetting+"-top",cssSetting+"-right",cssSetting+"-bottom",cssSetting+"-left"];
        var titles=this.itemTitles.duplicate();
        if(cssSetting=="border-radius"){
            var pre="border-",
                suff="-radius";
            names=[pre+"top-left"+suff,pre+"top-right"+suff,pre+"bottom-right"+suff,pre+"bottom-left"+suff];
            titles=s.titles.duplicate();
        }
        var items=[this.getItemProps(cssSetting,this.defaultEditorType,false,false,false,
                {colSpan:1,defaultValue:this.defaultValue})];
        if(this.allowAsymmetry){
            items.addList([
                this.getItemProps(names[0],this.defaultEditorType,true,true,true,
                    {title:titles[0],titleAlign:"center",colSpan:1,
                    defaultValue:this.defaultValue}),
                this.getItemProps(names[1],this.defaultEditorType,true,true,true,
                    {title:titles[1],titleAlign:"center",colSpan:1,
                    defaultValue:this.defaultValue}),
                this.getItemProps(names[2],this.defaultEditorType,true,true,true,
                    {title:titles[2],titleAlign:"center",colSpan:1,
                    defaultValue:this.defaultValue}),
                this.getItemProps(names[3],this.defaultEditorType,true,true,true,
                    {title:titles[3],titleAlign:"center",colSpan:1,
                    defaultValue:this.defaultValue})
            ]);
        }
        return items;
    }
,isc.A.setValue=function isc_CSSSizeItem_setValue(value){
        if(value){
            var values=(""+value).split(" ");
            if(values.length==1){
                this.canvas.items[0].setValue(parseInt(values[0]));
            }else{
                for(var i=0;i<4;i++){
                    this.canvas.items[i+1].setValue(parseInt(values[i]));
                }
            }
        }
    }
);
isc.B._maxIndex=isc.C+2;

(function(){
    var window={};
(function(Math){
var trimLeft=/^\s+/,
    trimRight=/\s+$/,
    tinyCounter=0,
    mathRound=Math.round,
    mathMin=Math.min,
    mathMax=Math.max,
    mathRandom=Math.random;
function tinycolor(color,opts){
    color=(color)?color:'';
    opts=opts||{};
    if(color instanceof tinycolor){
       return color;
    }
    if(!(this instanceof tinycolor)){
        return new tinycolor(color,opts);
    }
    var rgb=inputToRGB(color);
    this._originalInput=color,
    this._r=rgb.r,
    this._g=rgb.g,
    this._b=rgb.b,
    this._a=rgb.a,
    this._roundA=mathRound(100*this._a)/100,
    this._format=opts.format||rgb.format;
    this._gradientType=opts.gradientType;
    if(this._r<1){this._r=mathRound(this._r);}
    if(this._g<1){this._g=mathRound(this._g);}
    if(this._b<1){this._b=mathRound(this._b);}
    this._ok=rgb.ok;
    this._tc_id=tinyCounter++;
}
tinycolor.prototype={
    isDark:function(){
        return this.getBrightness()<128;
    },
    isLight:function(){
        return!this.isDark();
    },
    isValid:function(){
        return this._ok;
    },
    getOriginalInput:function(){
      return this._originalInput;
    },
    getFormat:function(){
        return this._format;
    },
    getAlpha:function(){
        return this._a;
    },
    getBrightness:function(){
        var rgb=this.toRgb();
        return(rgb.r*299+rgb.g*587+rgb.b*114)/1000;
    },
    getLuminance:function(){
        var rgb=this.toRgb();
        var RsRGB,GsRGB,BsRGB,R,G,B;
        RsRGB=rgb.r/255;
        GsRGB=rgb.g/255;
        BsRGB=rgb.b/255;
        if(RsRGB<=0.03928){R=RsRGB/12.92;}else{R=Math.pow(((RsRGB+0.055)/1.055),2.4);}
        if(GsRGB<=0.03928){G=GsRGB/12.92;}else{G=Math.pow(((GsRGB+0.055)/1.055),2.4);}
        if(BsRGB<=0.03928){B=BsRGB/12.92;}else{B=Math.pow(((BsRGB+0.055)/1.055),2.4);}
        return(0.2126*R)+(0.7152*G)+(0.0722*B);
    },
    setAlpha:function(value){
        this._a=boundAlpha(value);
        this._roundA=mathRound(100*this._a)/100;
        return this;
    },
    toHsv:function(){
        var hsv=rgbToHsv(this._r,this._g,this._b);
        return{h:hsv.h*360,s:hsv.s,v:hsv.v,a:this._a};
    },
    toHsvString:function(){
        var hsv=rgbToHsv(this._r,this._g,this._b);
        var h=mathRound(hsv.h*360),s=mathRound(hsv.s*100),v=mathRound(hsv.v*100);
        return(this._a==1)?
          "hsv("+h+", "+s+"%, "+v+"%)":
          "hsva("+h+", "+s+"%, "+v+"%, "+this._roundA+")";
    },
    toHsl:function(){
        var hsl=rgbToHsl(this._r,this._g,this._b);
        return{h:hsl.h*360,s:hsl.s,l:hsl.l,a:this._a};
    },
    toHslString:function(){
        var hsl=rgbToHsl(this._r,this._g,this._b);
        var h=mathRound(hsl.h*360),s=mathRound(hsl.s*100),l=mathRound(hsl.l*100);
        return(this._a==1)?
          "hsl("+h+", "+s+"%, "+l+"%)":
          "hsla("+h+", "+s+"%, "+l+"%, "+this._roundA+")";
    },
    toHex:function(allow3Char){
        return rgbToHex(this._r,this._g,this._b,allow3Char);
    },
    toHexString:function(allow3Char){
        return'#'+this.toHex(allow3Char);
    },
    toHex8:function(allow4Char){
        return rgbaToHex(this._r,this._g,this._b,this._a,allow4Char);
    },
    toHex8String:function(allow4Char){
        return'#'+this.toHex8(allow4Char);
    },
    toRgb:function(){
        return{r:mathRound(this._r),g:mathRound(this._g),b:mathRound(this._b),a:this._a};
    },
    toRgbString:function(){
        return(this._a==1)?
          "rgb("+mathRound(this._r)+", "+mathRound(this._g)+", "+mathRound(this._b)+")":
          "rgba("+mathRound(this._r)+", "+mathRound(this._g)+", "+mathRound(this._b)+", "+this._roundA+")";
    },
    toPercentageRgb:function(){
        return{r:mathRound(bound01(this._r,255)*100)+"%",g:mathRound(bound01(this._g,255)*100)+"%",b:mathRound(bound01(this._b,255)*100)+"%",a:this._a};
    },
    toPercentageRgbString:function(){
        return(this._a==1)?
          "rgb("+mathRound(bound01(this._r,255)*100)+"%, "+mathRound(bound01(this._g,255)*100)+"%, "+mathRound(bound01(this._b,255)*100)+"%)":
          "rgba("+mathRound(bound01(this._r,255)*100)+"%, "+mathRound(bound01(this._g,255)*100)+"%, "+mathRound(bound01(this._b,255)*100)+"%, "+this._roundA+")";
    },
    toName:function(){
        if(this._a===0){
            return"transparent";
        }
        if(this._a<1){
            return false;
        }
        return hexNames[rgbToHex(this._r,this._g,this._b,true)]||false;
    },
    toFilter:function(secondColor){
        var hex8String='#'+rgbaToArgbHex(this._r,this._g,this._b,this._a);
        var secondHex8String=hex8String;
        var gradientType=this._gradientType?"GradientType = 1, ":"";
        if(secondColor){
            var s=tinycolor(secondColor);
            secondHex8String='#'+rgbaToArgbHex(s._r,s._g,s._b,s._a);
        }
        return"progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString:function(format){
        var formatSet=!!format;
        format=format||this._format;
        var formattedString=false;
        var hasAlpha=this._a<1&&this._a>=0;
        var needsAlphaFormat=!formatSet&&hasAlpha&&(format==="hex"||format==="hex6"||format==="hex3"||format==="hex4"||format==="hex8"||format==="name");
        if(needsAlphaFormat){
            if(format==="name"&&this._a===0){
                return this.toName();
            }
            return this.toRgbString();
        }
        if(format==="rgb"){
            formattedString=this.toRgbString();
        }
        if(format==="prgb"){
            formattedString=this.toPercentageRgbString();
        }
        if(format==="hex"||format==="hex6"){
            formattedString=this.toHexString();
        }
        if(format==="hex3"){
            formattedString=this.toHexString(true);
        }
        if(format==="hex4"){
            formattedString=this.toHex8String(true);
        }
        if(format==="hex8"){
            formattedString=this.toHex8String();
        }
        if(format==="name"){
            formattedString=this.toName();
        }
        if(format==="hsl"){
            formattedString=this.toHslString();
        }
        if(format==="hsv"){
            formattedString=this.toHsvString();
        }
        return formattedString||this.toHexString();
    },
    clone:function(){
        return tinycolor(this.toString());
    },
    _applyModification:function(fn,args){
        var color=fn.apply(null,[this].concat([].slice.call(args)));
        this._r=color._r;
        this._g=color._g;
        this._b=color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten:function(){
        return this._applyModification(lighten,arguments);
    },
    brighten:function(){
        return this._applyModification(brighten,arguments);
    },
    darken:function(){
        return this._applyModification(darken,arguments);
    },
    desaturate:function(){
        return this._applyModification(desaturate,arguments);
    },
    saturate:function(){
        return this._applyModification(saturate,arguments);
    },
    greyscale:function(){
        return this._applyModification(greyscale,arguments);
    },
    spin:function(){
        return this._applyModification(spin,arguments);
    },
    _applyCombination:function(fn,args){
        return fn.apply(null,[this].concat([].slice.call(args)));
    },
    analogous:function(){
        return this._applyCombination(analogous,arguments);
    },
    complement:function(){
        return this._applyCombination(complement,arguments);
    },
    monochromatic:function(){
        return this._applyCombination(monochromatic,arguments);
    },
    splitcomplement:function(){
        return this._applyCombination(splitcomplement,arguments);
    },
    triad:function(){
        return this._applyCombination(triad,arguments);
    },
    tetrad:function(){
        return this._applyCombination(tetrad,arguments);
    }
};
tinycolor.fromRatio=function(color,opts){
    if(typeof color=="object"){
        var newColor={};
        for(var i in color){
            if(color.hasOwnProperty(i)){
                if(i==="a"){
                    newColor[i]=color[i];
                }
                else{
                    newColor[i]=convertToPercentage(color[i]);
                }
            }
        }
        color=newColor;
    }
    return tinycolor(color,opts);
};
function inputToRGB(color){
    var rgb={r:0,g:0,b:0};
    var a=1;
    var s=null;
    var v=null;
    var l=null;
    var ok=false;
    var format=false;
    if(typeof color=="string"){
        color=stringInputToObject(color);
    }
    if(typeof color=="object"){
        if(isValidCSSUnit(color.r)&&isValidCSSUnit(color.g)&&isValidCSSUnit(color.b)){
            rgb=rgbToRgb(color.r,color.g,color.b);
            ok=true;
            format=String(color.r).substr(-1)==="%"?"prgb":"rgb";
        }
        else if(isValidCSSUnit(color.h)&&isValidCSSUnit(color.s)&&isValidCSSUnit(color.v)){
            s=convertToPercentage(color.s);
            v=convertToPercentage(color.v);
            rgb=hsvToRgb(color.h,s,v);
            ok=true;
            format="hsv";
        }
        else if(isValidCSSUnit(color.h)&&isValidCSSUnit(color.s)&&isValidCSSUnit(color.l)){
            s=convertToPercentage(color.s);
            l=convertToPercentage(color.l);
            rgb=hslToRgb(color.h,s,l);
            ok=true;
            format="hsl";
        }
        if(color.hasOwnProperty("a")){
            a=color.a;
        }
    }
    a=boundAlpha(a);
    return{
        ok:ok,
        format:color.format||format,
        r:mathMin(255,mathMax(rgb.r,0)),
        g:mathMin(255,mathMax(rgb.g,0)),
        b:mathMin(255,mathMax(rgb.b,0)),
        a:a
    };
}
function rgbToRgb(r,g,b){
    return{
        r:bound01(r,255)*255,
        g:bound01(g,255)*255,
        b:bound01(b,255)*255
    };
}
function rgbToHsl(r,g,b){
    r=bound01(r,255);
    g=bound01(g,255);
    b=bound01(b,255);
    var max=mathMax(r,g,b),min=mathMin(r,g,b);
    var h,s,l=(max+min)/2;
    if(max==min){
        h=s=0;
    }
    else{
        var d=max-min;
        s=l>0.5?d/(2-max-min):d/(max+min);
        switch(max){
            case r:h=(g-b)/d+(g<b?6:0);break;
            case g:h=(b-r)/d+2;break;
            case b:h=(r-g)/d+4;break;
        }
        h/=6;
    }
    return{h:h,s:s,l:l};
}
function hslToRgb(h,s,l){
    var r,g,b;
    h=bound01(h,360);
    s=bound01(s,100);
    l=bound01(l,100);
    function hue2rgb(p,q,t){
        if(t<0)t+=1;
        if(t>1)t-=1;
        if(t<1/6)return p+(q-p)*6*t;
        if(t<1/2)return q;
        if(t<2/3)return p+(q-p)*(2/3-t)*6;
        return p;
    }
    if(s===0){
        r=g=b=l;
    }
    else{
        var q=l<0.5?l*(1+s):l+s-l*s;
        var p=2*l-q;
        r=hue2rgb(p,q,h+1/3);
        g=hue2rgb(p,q,h);
        b=hue2rgb(p,q,h-1/3);
    }
    return{r:r*255,g:g*255,b:b*255};
}
function rgbToHsv(r,g,b){
    r=bound01(r,255);
    g=bound01(g,255);
    b=bound01(b,255);
    var max=mathMax(r,g,b),min=mathMin(r,g,b);
    var h,s,v=max;
    var d=max-min;
    s=max===0?0:d/max;
    if(max==min){
        h=0;
    }
    else{
        switch(max){
            case r:h=(g-b)/d+(g<b?6:0);break;
            case g:h=(b-r)/d+2;break;
            case b:h=(r-g)/d+4;break;
        }
        h/=6;
    }
    return{h:h,s:s,v:v};
}
 function hsvToRgb(h,s,v){
    h=bound01(h,360)*6;
    s=bound01(s,100);
    v=bound01(v,100);
    var i=Math.floor(h),
        f=h-i,
        p=v*(1-s),
        q=v*(1-f*s),
        t=v*(1-(1-f)*s),
        mod=i%6,
        r=[v,q,p,p,t,v][mod],
        g=[t,v,v,q,p,p][mod],
        b=[p,p,t,v,v,q][mod];
    return{r:r*255,g:g*255,b:b*255};
}
function rgbToHex(r,g,b,allow3Char){
    var hex=[
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];
    if(allow3Char&&hex[0].charAt(0)==hex[0].charAt(1)&&hex[1].charAt(0)==hex[1].charAt(1)&&hex[2].charAt(0)==hex[2].charAt(1)){
        return hex[0].charAt(0)+hex[1].charAt(0)+hex[2].charAt(0);
    }
    return hex.join("");
}
function rgbaToHex(r,g,b,a,allow4Char){
    var hex=[
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];
    if(allow4Char&&hex[0].charAt(0)==hex[0].charAt(1)&&hex[1].charAt(0)==hex[1].charAt(1)&&hex[2].charAt(0)==hex[2].charAt(1)&&hex[3].charAt(0)==hex[3].charAt(1)){
        return hex[0].charAt(0)+hex[1].charAt(0)+hex[2].charAt(0)+hex[3].charAt(0);
    }
    return hex.join("");
}
function rgbaToArgbHex(r,g,b,a){
    var hex=[
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];
    return hex.join("");
}
tinycolor.equals=function(color1,color2){
    if(!color1||!color2){return false;}
    return tinycolor(color1).toRgbString()==tinycolor(color2).toRgbString();
};
tinycolor.random=function(){
    return tinycolor.fromRatio({
        r:mathRandom(),
        g:mathRandom(),
        b:mathRandom()
    });
};
function desaturate(color,amount){
    amount=(amount===0)?0:(amount||10);
    var hsl=tinycolor(color).toHsl();
    hsl.s-=amount/100;
    hsl.s=clamp01(hsl.s);
    return tinycolor(hsl);
}
function saturate(color,amount){
    amount=(amount===0)?0:(amount||10);
    var hsl=tinycolor(color).toHsl();
    hsl.s+=amount/100;
    hsl.s=clamp01(hsl.s);
    return tinycolor(hsl);
}
function greyscale(color){
    return tinycolor(color).desaturate(100);
}
function lighten(color,amount){
    amount=(amount===0)?0:(amount||10);
    var hsl=tinycolor(color).toHsl();
    hsl.l+=amount/100;
    hsl.l=clamp01(hsl.l);
    return tinycolor(hsl);
}
function brighten(color,amount){
    amount=(amount===0)?0:(amount||10);
    var rgb=tinycolor(color).toRgb();
    rgb.r=mathMax(0,mathMin(255,rgb.r-mathRound(255*-(amount/100))));
    rgb.g=mathMax(0,mathMin(255,rgb.g-mathRound(255*-(amount/100))));
    rgb.b=mathMax(0,mathMin(255,rgb.b-mathRound(255*-(amount/100))));
    return tinycolor(rgb);
}
function darken(color,amount){
    amount=(amount===0)?0:(amount||10);
    var hsl=tinycolor(color).toHsl();
    hsl.l-=amount/100;
    hsl.l=clamp01(hsl.l);
    return tinycolor(hsl);
}
function spin(color,amount){
    var hsl=tinycolor(color).toHsl();
    var hue=(hsl.h+amount)%360;
    hsl.h=hue<0?360+hue:hue;
    return tinycolor(hsl);
}
function complement(color){
    var hsl=tinycolor(color).toHsl();
    hsl.h=(hsl.h+180)%360;
    return tinycolor(hsl);
}
function triad(color){
    var hsl=tinycolor(color).toHsl();
    var h=hsl.h;
    return[
        tinycolor(color),
        tinycolor({h:(h+120)%360,s:hsl.s,l:hsl.l}),
        tinycolor({h:(h+240)%360,s:hsl.s,l:hsl.l})
    ];
}
function tetrad(color){
    var hsl=tinycolor(color).toHsl();
    var h=hsl.h;
    return[
        tinycolor(color),
        tinycolor({h:(h+90)%360,s:hsl.s,l:hsl.l}),
        tinycolor({h:(h+180)%360,s:hsl.s,l:hsl.l}),
        tinycolor({h:(h+270)%360,s:hsl.s,l:hsl.l})
    ];
}
function splitcomplement(color){
    var hsl=tinycolor(color).toHsl();
    var h=hsl.h;
    return[
        tinycolor(color),
        tinycolor({h:(h+72)%360,s:hsl.s,l:hsl.l}),
        tinycolor({h:(h+216)%360,s:hsl.s,l:hsl.l})
    ];
}
function analogous(color,results,slices){
    results=results||6;
    slices=slices||30;
    var hsl=tinycolor(color).toHsl();
    var part=360/slices;
    var ret=[tinycolor(color)];
    for(hsl.h=((hsl.h-(part*results>>1))+720)%360;--results;){
        hsl.h=(hsl.h+part)%360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}
function monochromatic(color,results){
    results=results||6;
    var hsv=tinycolor(color).toHsv();
    var h=hsv.h,s=hsv.s,v=hsv.v;
    var ret=[];
    var modification=1/results;
    while(results--){
        ret.push(tinycolor({h:h,s:s,v:v}));
        v=(v+modification)%1;
    }
    return ret;
}
tinycolor.mix=function(color1,color2,amount){
    amount=(amount===0)?0:(amount||50);
    var rgb1=tinycolor(color1).toRgb();
    var rgb2=tinycolor(color2).toRgb();
    var p=amount/100;
    var rgba={
        r:((rgb2.r-rgb1.r)*p)+rgb1.r,
        g:((rgb2.g-rgb1.g)*p)+rgb1.g,
        b:((rgb2.b-rgb1.b)*p)+rgb1.b,
        a:((rgb2.a-rgb1.a)*p)+rgb1.a
    };
    return tinycolor(rgba);
};
tinycolor.readability=function(color1,color2){
    var c1=tinycolor(color1);
    var c2=tinycolor(color2);
    return(Math.max(c1.getLuminance(),c2.getLuminance())+0.05)/(Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};
tinycolor.isReadable=function(color1,color2,wcag2){
    var readability=tinycolor.readability(color1,color2);
    var wcag2Parms,out;
    out=false;
    wcag2Parms=validateWCAG2Parms(wcag2);
    switch(wcag2Parms.level+wcag2Parms.size){
        case"AAsmall":
        case"AAAlarge":
            out=readability>=4.5;
            break;
        case"AAlarge":
            out=readability>=3;
            break;
        case"AAAsmall":
            out=readability>=7;
            break;
    }
    return out;
};
tinycolor.mostReadable=function(baseColor,colorList,args){
    var bestColor=null;
    var bestScore=0;
    var readability;
    var includeFallbackColors,level,size;
    args=args||{};
    includeFallbackColors=args.includeFallbackColors;
    level=args.level;
    size=args.size;
    for(var i=0;i<colorList.length;i++){
        readability=tinycolor.readability(baseColor,colorList[i]);
        if(readability>bestScore){
            bestScore=readability;
            bestColor=tinycolor(colorList[i]);
        }
    }
    if(tinycolor.isReadable(baseColor,bestColor,{"level":level,"size":size})||!includeFallbackColors){
        return bestColor;
    }
    else{
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff","#000"],args);
    }
};
var names=tinycolor.names={
    aliceblue:"f0f8ff",
    antiquewhite:"faebd7",
    aqua:"0ff",
    aquamarine:"7fffd4",
    azure:"f0ffff",
    beige:"f5f5dc",
    bisque:"ffe4c4",
    black:"000",
    blanchedalmond:"ffebcd",
    blue:"00f",
    blueviolet:"8a2be2",
    brown:"a52a2a",
    burlywood:"deb887",
    burntsienna:"ea7e5d",
    cadetblue:"5f9ea0",
    chartreuse:"7fff00",
    chocolate:"d2691e",
    coral:"ff7f50",
    cornflowerblue:"6495ed",
    cornsilk:"fff8dc",
    crimson:"dc143c",
    cyan:"0ff",
    darkblue:"00008b",
    darkcyan:"008b8b",
    darkgoldenrod:"b8860b",
    darkgray:"a9a9a9",
    darkgreen:"006400",
    darkgrey:"a9a9a9",
    darkkhaki:"bdb76b",
    darkmagenta:"8b008b",
    darkolivegreen:"556b2f",
    darkorange:"ff8c00",
    darkorchid:"9932cc",
    darkred:"8b0000",
    darksalmon:"e9967a",
    darkseagreen:"8fbc8f",
    darkslateblue:"483d8b",
    darkslategray:"2f4f4f",
    darkslategrey:"2f4f4f",
    darkturquoise:"00ced1",
    darkviolet:"9400d3",
    deeppink:"ff1493",
    deepskyblue:"00bfff",
    dimgray:"696969",
    dimgrey:"696969",
    dodgerblue:"1e90ff",
    firebrick:"b22222",
    floralwhite:"fffaf0",
    forestgreen:"228b22",
    fuchsia:"f0f",
    gainsboro:"dcdcdc",
    ghostwhite:"f8f8ff",
    gold:"ffd700",
    goldenrod:"daa520",
    gray:"808080",
    green:"008000",
    greenyellow:"adff2f",
    grey:"808080",
    honeydew:"f0fff0",
    hotpink:"ff69b4",
    indianred:"cd5c5c",
    indigo:"4b0082",
    ivory:"fffff0",
    khaki:"f0e68c",
    lavender:"e6e6fa",
    lavenderblush:"fff0f5",
    lawngreen:"7cfc00",
    lemonchiffon:"fffacd",
    lightblue:"add8e6",
    lightcoral:"f08080",
    lightcyan:"e0ffff",
    lightgoldenrodyellow:"fafad2",
    lightgray:"d3d3d3",
    lightgreen:"90ee90",
    lightgrey:"d3d3d3",
    lightpink:"ffb6c1",
    lightsalmon:"ffa07a",
    lightseagreen:"20b2aa",
    lightskyblue:"87cefa",
    lightslategray:"789",
    lightslategrey:"789",
    lightsteelblue:"b0c4de",
    lightyellow:"ffffe0",
    lime:"0f0",
    limegreen:"32cd32",
    linen:"faf0e6",
    magenta:"f0f",
    maroon:"800000",
    mediumaquamarine:"66cdaa",
    mediumblue:"0000cd",
    mediumorchid:"ba55d3",
    mediumpurple:"9370db",
    mediumseagreen:"3cb371",
    mediumslateblue:"7b68ee",
    mediumspringgreen:"00fa9a",
    mediumturquoise:"48d1cc",
    mediumvioletred:"c71585",
    midnightblue:"191970",
    mintcream:"f5fffa",
    mistyrose:"ffe4e1",
    moccasin:"ffe4b5",
    navajowhite:"ffdead",
    navy:"000080",
    oldlace:"fdf5e6",
    olive:"808000",
    olivedrab:"6b8e23",
    orange:"ffa500",
    orangered:"ff4500",
    orchid:"da70d6",
    palegoldenrod:"eee8aa",
    palegreen:"98fb98",
    paleturquoise:"afeeee",
    palevioletred:"db7093",
    papayawhip:"ffefd5",
    peachpuff:"ffdab9",
    peru:"cd853f",
    pink:"ffc0cb",
    plum:"dda0dd",
    powderblue:"b0e0e6",
    purple:"800080",
    rebeccapurple:"663399",
    red:"f00",
    rosybrown:"bc8f8f",
    royalblue:"4169e1",
    saddlebrown:"8b4513",
    salmon:"fa8072",
    sandybrown:"f4a460",
    seagreen:"2e8b57",
    seashell:"fff5ee",
    sienna:"a0522d",
    silver:"c0c0c0",
    skyblue:"87ceeb",
    slateblue:"6a5acd",
    slategray:"708090",
    slategrey:"708090",
    snow:"fffafa",
    springgreen:"00ff7f",
    steelblue:"4682b4",
    tan:"d2b48c",
    teal:"008080",
    thistle:"d8bfd8",
    tomato:"ff6347",
    turquoise:"40e0d0",
    violet:"ee82ee",
    wheat:"f5deb3",
    white:"fff",
    whitesmoke:"f5f5f5",
    yellow:"ff0",
    yellowgreen:"9acd32"
};
var hexNames=tinycolor.hexNames=flip(names);
function flip(o){
    var flipped={};
    for(var i in o){
        if(o.hasOwnProperty(i)){
            flipped[o[i]]=i;
        }
    }
    return flipped;
}
function boundAlpha(a){
    a=parseFloat(a);
    if(isNaN(a)||a<0||a>1){
        a=1;
    }
    return a;
}
function bound01(n,max){
    if(isOnePointZero(n)){n="100%";}
    var processPercent=isPercentage(n);
    n=mathMin(max,mathMax(0,parseFloat(n)));
    if(processPercent){
        n=parseInt(n*max,10)/100;
    }
    if((Math.abs(n-max)<0.000001)){
        return 1;
    }
    return(n%max)/parseFloat(max);
}
function clamp01(val){
    return mathMin(1,mathMax(0,val));
}
function parseIntFromHex(val){
    return parseInt(val,16);
}
function isOnePointZero(n){
    return typeof n=="string"&&n.indexOf('.')!=-1&&parseFloat(n)===1;
}
function isPercentage(n){
    return typeof n==="string"&&n.indexOf('%')!=-1;
}
function pad2(c){
    return c.length==1?'0'+c:''+c;
}
function convertToPercentage(n){
    if(n<=1){
        n=(n*100)+"%";
    }
    return n;
}
function convertDecimalToHex(d){
    return Math.round(parseFloat(d)*255).toString(16);
}
function convertHexToDecimal(h){
    return(parseIntFromHex(h)/255);
}
var matchers=(function(){
    var CSS_INTEGER="[-\\+]?\\d+%?";
    var CSS_NUMBER="[-\\+]?\\d*\\.\\d+%?";
    var CSS_UNIT="(?:"+CSS_NUMBER+")|(?:"+CSS_INTEGER+")";
    var PERMISSIVE_MATCH3="[\\s|\\(]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")\\s*\\)?";
    var PERMISSIVE_MATCH4="[\\s|\\(]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")[,|\\s]+("+CSS_UNIT+")\\s*\\)?";
    return{
        CSS_UNIT:new RegExp(CSS_UNIT),
        rgb:new RegExp("rgb"+PERMISSIVE_MATCH3),
        rgba:new RegExp("rgba"+PERMISSIVE_MATCH4),
        hsl:new RegExp("hsl"+PERMISSIVE_MATCH3),
        hsla:new RegExp("hsla"+PERMISSIVE_MATCH4),
        hsv:new RegExp("hsv"+PERMISSIVE_MATCH3),
        hsva:new RegExp("hsva"+PERMISSIVE_MATCH4),
        hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();
function isValidCSSUnit(color){
    return!!matchers.CSS_UNIT.exec(color);
}
function stringInputToObject(color){
    color=color.replace(trimLeft,'').replace(trimRight,'').toLowerCase();
    var named=false;
    if(names[color]){
        color=names[color];
        named=true;
    }
    else if(color=='transparent'){
        return{r:0,g:0,b:0,a:0,format:"name"};
    }
    var match;
    if((match=matchers.rgb.exec(color))){
        return{r:match[1],g:match[2],b:match[3]};
    }
    if((match=matchers.rgba.exec(color))){
        return{r:match[1],g:match[2],b:match[3],a:match[4]};
    }
    if((match=matchers.hsl.exec(color))){
        return{h:match[1],s:match[2],l:match[3]};
    }
    if((match=matchers.hsla.exec(color))){
        return{h:match[1],s:match[2],l:match[3],a:match[4]};
    }
    if((match=matchers.hsv.exec(color))){
        return{h:match[1],s:match[2],v:match[3]};
    }
    if((match=matchers.hsva.exec(color))){
        return{h:match[1],s:match[2],v:match[3],a:match[4]};
    }
    if((match=matchers.hex8.exec(color))){
        return{
            r:parseIntFromHex(match[1]),
            g:parseIntFromHex(match[2]),
            b:parseIntFromHex(match[3]),
            a:convertHexToDecimal(match[4]),
            format:named?"name":"hex8"
        };
    }
    if((match=matchers.hex6.exec(color))){
        return{
            r:parseIntFromHex(match[1]),
            g:parseIntFromHex(match[2]),
            b:parseIntFromHex(match[3]),
            format:named?"name":"hex"
        };
    }
    if((match=matchers.hex4.exec(color))){
        return{
            r:parseIntFromHex(match[1]+''+match[1]),
            g:parseIntFromHex(match[2]+''+match[2]),
            b:parseIntFromHex(match[3]+''+match[3]),
            a:convertHexToDecimal(match[4]+''+match[4]),
            format:named?"name":"hex8"
        };
    }
    if((match=matchers.hex3.exec(color))){
        return{
            r:parseIntFromHex(match[1]+''+match[1]),
            g:parseIntFromHex(match[2]+''+match[2]),
            b:parseIntFromHex(match[3]+''+match[3]),
            format:named?"name":"hex"
        };
    }
    return false;
}
function validateWCAG2Parms(parms){
    var level,size;
    parms=parms||{"level":"AA","size":"small"};
    level=(parms.level||"AA").toUpperCase();
    size=(parms.size||"small").toLowerCase();
    if(level!=="AA"&&level!=="AAA"){
        level="AA";
    }
    if(size!=="small"&&size!=="large"){
        size="small";
    }
    return{"level":level,"size":size};
}
if(typeof module!=="undefined"&&module.exports){
    module.exports=tinycolor;
}
else if(typeof define==='function'&&define.amd){
    define(function(){return tinycolor;});
}
else{
    window.tinycolor=tinycolor;
}
})(Math);
isc.tinycolor=window.tinycolor;
})();
isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('Tools');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._Tools_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('Tools module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'Tools', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'Tools'.");}
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

