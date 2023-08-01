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

if(window.isc&&window.isc.module_Core&&!window.isc.module_Workflow){isc.module_Workflow=1;isc._moduleStart=isc._Workflow_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'Workflow load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("ProcessElement");
isc.A=isc.ProcessElement;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getTitle=function isc_c_ProcessElement_getTitle(){
        var title=this.getInstanceProperty("title");
        if(!title){
            title=this.getClassName();
            if(title.endsWith("Task"))title=title.substring(0,title.length-4);
            title=isc.DataSource.getAutoTitle(title);
        }
        return title;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.ProcessElement.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.passThruOutput=true;
isc.A.editorType="ProcessElementEditor";
isc.B.push(isc.A.getElementDescription=function isc_ProcessElement_getElementDescription(){
        return this.description||this.ID;
    }
,isc.A._resolveCriteriaExpressions=function isc_ProcessElement__resolveCriteriaExpressions(criteria,inputData,inputRecord,process){
        criteria=isc.clone(criteria);
        if(isc.DS.isAdvancedCriteria(criteria)){
            this._resolveAdvancedCriteriaExpressions(criteria,inputData,inputRecord,process);
            if(process.ruleScope){
                var ruleScopeComponent=window[process.ruleScope];
                if(!ruleScopeComponent||ruleScopeComponent.destroyed){
                    this.logWarn("Attempt to resolve ruleScope references in taskInputExpression but ruleScope not found: "+process.ruleScope);
                }else{
                    criteria=isc.DS.resolveDynamicCriteria(criteria,ruleScopeComponent.getRuleContext());
                }
            }
        }else{
            criteria=this._resolveObjectDynamicExpressions(criteria,inputData,inputRecord,process);
        }
        return criteria;
    }
,isc.A._resolveAdvancedCriteriaExpressions=function isc_ProcessElement__resolveAdvancedCriteriaExpressions(criteria,inputData,inputRecord,process){
        var operator=criteria.operator;
        if(operator=="and"||operator=="or"||operator=="not"){
            var innerCriteria=criteria.criteria;
            if(!isc.isAn.Array(innerCriteria))innerCriteria=[innerCriteria];
            for(var i=0;i<innerCriteria.length;i++){
                this._resolveAdvancedCriteriaExpressions(innerCriteria[i],inputData,inputRecord,process);
            }
        }if(criteria.value!=null){
            criteria.value=this._resolveDynamicExpression(criteria.value,inputData,inputRecord,process);
        }
    }
,isc.A._resolveObjectDynamicExpressions=function isc_ProcessElement__resolveObjectDynamicExpressions(object,inputData,inputRecord,process){
        var newObject={};
        for(var key in object){
            newObject[key]=this._resolveDynamicExpression(object[key],inputData,inputRecord,process);
        }
        return newObject;
    }
,isc.A._resolveDynamicExpression=function isc_ProcessElement__resolveDynamicExpression(value,inputData,inputRecord,process){
        if(isc.isA.String(value)){
            if(inputRecord&&value.startsWith("$inputRecord")){
                if(inputRecord){
                    var dataPath=value.replace("$inputRecord","state");
                    value=isc.Canvas._getFieldValue(dataPath,null,{state:inputRecord});
                }
            }else if(inputData&&value.startsWith("$input")){
                if(inputData){
                    var dataPath=value.replace("$input","state");
                    value=isc.Canvas._getFieldValue(dataPath,null,{state:inputData});
                }
            }else if(process&&value.startsWith("$last")){
                value=value.substring(5);
                var last;
                if(value.startsWith("[")){
                    var key=value.substring(1,value.indexOf("]"));
                    value=value.substring(value.indexOf("]")+1);
                    last=process.getLastTaskOutput(key);
                }else{
                    last=process.getLastTaskOutput();
                }
                if(value.startsWith(".")){
                    var dataPath="state"+value;
                    value=isc.Canvas._getFieldValue(dataPath,null,{state:last});
                    if(value==null){
                        var testPath=dataPath.substring(0,dataPath.lastIndexOf("."));
                        if(!isc.Canvas._fieldHasValue(testPath,null,{state:last})){
                            this.logWarn(this.getClassName()+" taskInputExpression path "+dataPath+" not found in previous task output");
                        }
                    }
                }else{
                    value=last;
                }
            }else if(value.startsWith("$ruleScope")||value.startsWith("$scope")){
                if(!process.ruleScope){
                    this.logWarn("Attempt to reference ruleScope in taskInputExpression but no ruleScope has been defined");
                    value=null;
                }else{
                    var ruleScopeComponent=window[process.ruleScope];
                    if(!ruleScopeComponent||ruleScopeComponent.destroyed){
                        this.logWarn("Attempt to reference ruleScope in taskInputExpression but ruleScope not found: "+process.ruleScope);
                        value=null;
                    }else{
                        var dataPath=value.replace("$ruleScope","").replace("$scope","");
                        if(dataPath.startsWith("."))dataPath=dataPath.substring(1);
                        value=ruleScopeComponent._getFromRuleContext(dataPath);
                    }
                }
            }
        }else if(isc.isAn.Object(value)&&value.text){
            var ruleScopeComponent=window[process.ruleScope];
            if(!ruleScopeComponent||ruleScopeComponent.destroyed){
                this.logWarn("Attempt to resolve ruleScope references in textFormula "+
                                "but ruleScope not found: "+process.ruleScope);
                value=null;
            }else{
                if(value._summaryFunction==null){
                    value._summaryFunction=isc.SummaryBuilder.generateRuleScopeFunction(
                        value,
                        ruleScopeComponent.getID()
                    );
                }
                if(value._summaryFunction){
                    var formula=value,
                        text=formula.text
                    ;
                    value=null;
                    if(formula.summaryVars){
                        var vars=formula.summaryVars;
                        for(var mappingKey in vars){
                            var replace="#{"+vars[mappingKey]+"}";
                            text=isc.FormulaBuilder.handleKeyExp(text,mappingKey,"escaped",replace);
                            text=isc.FormulaBuilder.handleKeyExp(text,mappingKey,"braced",replace);
                        }
                        formula={text:text};
                    }
                    var ruleContext=ruleScopeComponent.getRuleContext();
                    value=formula._summaryFunction(ruleContext);
                }
            }
        }
        return value;
    }
,isc.A.updateGlobalIDReferences=function isc_ProcessElement_updateGlobalIDReferences(oldId,newId){
        return false;
    }
,isc.A._updateGlobalIDInValueProperty=function isc_ProcessElement__updateGlobalIDInValueProperty(propertyName,oldId,newId){
        var changed=false;
        if(this[propertyName]){
            var key=this[propertyName],
                newKey=key.replace("$ruleScope."+oldId+".","$ruleScope."+newId+".")
                    .replace("$scope."+oldId+".","$scope."+newId+".")
            ;
            if(key!=newKey){
                this[propertyName]=newKey;
                changed=true;
            }
        }
        return changed;
    }
,isc.A._updateGlobalIDInValues=function isc_ProcessElement__updateGlobalIDInValues(values,oldId,newId){
        var changed=false;
        if(values){
            for(var key in values){
                var value=values[key],
                    newValue=value.replace("$ruleScope."+oldId+".","$ruleScope."+newId+".")
                        .replace("$scope."+oldId+".","$scope."+newId+".")
                ;
                if(value!=newValue){
                    values[key]=newValue;
                    changed=true;
                }
            }
        }
        return changed;
    }
,isc.A._updateGlobalIDInCriteria=function isc_ProcessElement__updateGlobalIDInCriteria(criteria,oldId,newId){
        if(!criteria)return false;
        var changes=[{
            pattern:new RegExp("^\\$ruleScope\\."+oldId+"\\."),
            replacement:"$ruleScope."+newId+"."
        },{
            pattern:new RegExp("^\\$scope\\."+oldId+"\\."),
            replacement:"$scope."+newId+"."
        }];
        return this._replaceCriteriaValues(criteria,changes);
    }
,isc.A._replaceCriteriaValues=function isc_ProcessElement__replaceCriteriaValues(criteria,changes){
        var operator=criteria.operator,
            changed=false
        ;
        if(operator=="and"||operator=="or"){
            var innerCriteria=criteria.criteria;
            for(var i=0;i<innerCriteria.length;i++){
                if(this._replaceCriteriaValues(innerCriteria[i],changes)){
                    changed=true;
                }
            }
        }else{
            for(var i=0;i<changes.length;i++){
                var change=changes[i];
                if(criteria.value!=null){
                    var newValue=criteria.value.replace(change.pattern,change.replacement);
                    if(criteria.value!=newValue){
                        criteria.value=newValue;
                        changed=true;
                    }
                }
            }
        }
        return changed;
    }
,isc.A.updateLastElementBindingReferences=function isc_ProcessElement_updateLastElementBindingReferences(taskType){
        return false;
    }
,isc.A._updateLastElementInValueProperty=function isc_ProcessElement__updateLastElementInValueProperty(propertyName,taskType){
        var changed=false;
        if(this[propertyName]){
            var key=this[propertyName],
                newKey=key.replace("$last.","$last["+taskType+"].")
            ;
            if(key!=newKey){
                this[propertyName]=newKey;
                changed=true;
            }
        }
        return changed;
    }
,isc.A._updateLastElementInValues=function isc_ProcessElement__updateLastElementInValues(values,taskType){
        var changed=false;
        if(values){
            for(var key in values){
                var value=values[key],
                    newValue=value.replace("$last.","$last["+taskType+"].")
                ;
                if(value!=newValue){
                    values[key]=newValue;
                    changed=true;
                }
            }
        }
        return changed;
    }
,isc.A._updateLastElementInCriteria=function isc_ProcessElement__updateLastElementInCriteria(criteria,taskType){
        if(!criteria)return false;
        var changes=[{
            pattern:new RegExp("^\\$last\\."),
            replacement:"$last["+taskType+"]."
        }];
        var changed=this._replaceCriteriaFieldName(criteria,changes);
        return this._replaceCriteriaValues(criteria,changes)||changed;
    }
,isc.A._replaceCriteriaFieldName=function isc_ProcessElement__replaceCriteriaFieldName(criteria,changes){
        var operator=criteria.operator,
            changed=false
        ;
        if(operator=="and"||operator=="or"){
            var innerCriteria=criteria.criteria;
            for(var i=0;i<innerCriteria.length;i++){
                if(this._replaceCriteriaValues(innerCriteria[i],changes)){
                    changed=true;
                }
            }
        }else{
            for(var i=0;i<changes.length;i++){
                var change=changes[i];
                if(criteria.value!=null){
                    var newValue=criteria.fieldName.replace(change.pattern,change.replacement);
                    if(criteria.fieldName!=newValue){
                        criteria.fieldName=newValue;
                        changed=true;
                    }
                }
            }
        }
        return changed;
    }
,isc.A.getDynamicValue=function isc_ProcessElement_getDynamicValue(value,process){
        if(value){
            var values=this._resolveObjectDynamicExpressions({value:value},null,null,process);
            value=values.value;
        }
        return value;
    }
,isc.A._getSummaryFunction=function isc_ProcessElement__getSummaryFunction(formulaObject,ruleScope,component){
        if(this._summaryFunction==null){
            this._summaryFunction=isc.SummaryBuilder.generateRuleScopeFunction(
                formulaObject,
                ruleScope,
                component
            );
        }
        return this._summaryFunction;
    }
,isc.A.getTextFormulaValue=function isc_ProcessElement_getTextFormulaValue(textFormula,process){
        var value;
        if(textFormula){
            var formula=textFormula,
                text=formula.text
            ;
            if(formula.summaryVars){
                var vars=formula.summaryVars;
                for(var mappingKey in vars){
                    var replace="#{"+vars[mappingKey]+"}";
                    text=isc.FormulaBuilder.handleKeyExp(text,mappingKey,"escaped",replace);
                    text=isc.FormulaBuilder.handleKeyExp(text,mappingKey,"braced",replace);
                }
                formula={text:text};
            }
            var summaryFunction=this._getSummaryFunction(formula,process.ruleScope);
            if(summaryFunction){
                var ruleScopeComponent=window[process.ruleScope];
                if(!ruleScopeComponent||ruleScopeComponent.destroyed){
                    this.logWarn("Attempt to resolve ruleScope references in textFormula "+
                                 "but ruleScope not found: "+process.ruleScope);
                }else{
                    var ruleContext=ruleScopeComponent.getRuleContext();
                    value=summaryFunction(ruleContext);
                }
            }
        }
        return value;
    }
);
isc.B._maxIndex=isc.C+18;

isc.defineClass("ProcessSequence","ProcessElement");
isc.ProcessSequence.addProperties({
})
isc.defineClass("Task","ProcessElement");
isc.A=isc.Task.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.editorType="TaskEditor";
isc.B.push(isc.A._resolveInputField=function isc_Task__resolveInputField(value,process){
        if(value==null)return null;
        var resolved;
        if(value.startsWith("$"))resolved=this._resolveDynamicExpression(value,null,null,process);
        else resolved=process.getStateVariable(value);
        return resolved;
    }
,isc.A._writeOutputExpression=function isc_Task__writeOutputExpression(data){
        var expression=this.outputExpression;
        if(!expression)return;
        if(expression.startsWith("$")){
            expression=expression.substring(1);
            var id=expression;
            var field;
            var fdi=id.indexOf(".");
            if(fdi>0){
                id=id.substring(0,fdi);
                field=id.substring(fdi+1);
            }
            var canvas=isc.Canvas.getById(id);
            if(canvas){
                if(field){
                    if(!isc.isAn.Array(data)){
                        if(isc.isA.DynamicForm(canvas)){
                            canvas.setFieldValue(field,data);
                        }else if(isc.isA.ListGrid(canvas)&&canvas.canEdit){
                            var editRow=canvas.getEditRow();
                            if(editRow!=null){
                                canvas.setEditValue(editRow,field,data);
                            }else{
                                var selection=canvas.getSelectedRecords();
                                if(selection!=null&&selection.length==1){
                                    var selectedRow=canvas.getRecordIndex(selection[0]);
                                    canvas.setEditValue(selectedRow,field,data);
                                }
                            }
                        }else{
                            this.logWarn("outputExpression target is not a supported DBC or is not editable - ignored: "+expression);
                        }
                    }else{
                        this.logWarn("Task output is not supported by outputExpression target - ignored: "+expression);
                    }
                }else{
                    if(canvas.setValues){
                        var value=(isc.isAn.Array(data)?data[0]:data);
                        if(isc.isAn.Object(value)){
                            canvas.setValues(value);
                        }else{
                            this.logWarn("task output is not an object and cannot be written with outputExpression - ignored: "+expression);
                        }
                    }else if(canvas.setData){
                        if(isc.isAn.Array(data)||isc.isAn.Object(data)){
                            if(!isc.isAn.Array(data))data=[data];
                            canvas.setData(data);
                        }else{
                            this.logWarn("task output is not an object and cannot be written with outputExpression - ignored: "+expression);
                        }
                    }else{
                        this.logWarn("outputExpression target is not a supported DBC - ignored: "+expression);
                    }
                }
            }else{
                this.logWarn("outputExpression DBC not found - ignored: "+expression);
            }
        }else{
            this.logWarn("Invalid outputExpression - ignored: "+expression);
        }
    }
,isc.A.updateLastElementBindingReferences=function isc_Task_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        changed=this._updateLastElementInValueProperty("inputField",taskType)||changed;
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_Task_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        changed=this._updateGlobalIDInValueProperty("inputField",oldId,newId)||changed;
        return changed;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("Process","Task");
isc.A=isc.Process;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._cache={};
isc.A.gatewayPlaceholderSelection="[placeholder]";
isc.B.push(isc.A.loadProcess=function isc_c_Process_loadProcess(processId,callback){
        var ds=isc.DataSource.get("WorkflowLoader");
        ds.fetchData({id:processId},function(response,data,request){
            var process=null;
            var content=data.content;
            if(content!=null){
                if(isc.isAn.Array(content)){
                    process=isc.Class.evaluate(content[0]);
                    process.ID=processId[0];
                    isc.Process._cache[processId[0]]=process;
                    for(var i=1;i<content.length;i++){
                        var p=isc.Class.evaluate(content[i]);
                        p.ID=processId[i];
                        isc.Process._cache[processId[i]]=p;
                    }
                }else{
                    process=isc.Class.evaluate(content);
                    process.ID=processId;
                    isc.Process._cache[processId]=process;
                }
            }else{
                isc.logWarn("File named \""+processId+"\".proc.xml could not "+
                    "be found in the search path specified by \"project.processes\".")
            }
            callback(process);
        });
    }
,isc.A.getProcess=function isc_c_Process_getProcess(processId){
        return isc.Process._cache[processId];
    }
);
isc.B._maxIndex=isc.C+2;

isc.A=isc.Process.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.autoStart=false;
isc.B.push(isc.A.init=function isc_Process_init(){
        var res=this.Super("init",arguments);
        this.instantiateElements();
        this._nextElement=this.startElement;
        if(this.autoStart)this.start();
        return res;
    }
,isc.A.instantiateElements=function isc_Process_instantiateElements(){
        if(this.elements)this.elements=this._instantiateElements(this.elements);
        if(this.sequences)this.sequences=this._instantiateElements(this.sequences);
    }
,isc.A._instantiateElements=function isc_Process__instantiateElements(elements){
        var newElements=[];
        for(var i=0;i<elements.length;i++){
            var element=elements[i];
            newElements[i]=element;
            if(isc.isAn.Object(element)){
                if(element._constructor){
                    newElements[i]=isc.ClassFactory.newInstance(element);
                }
                if(element.elements){
                    newElements[i].elements=this._instantiateElements(element.elements);
                }
            }
        }
        return newElements;
    }
,isc.A.getElement=function isc_Process_getElement(ID){
        return this._searchElement(this,ID);
    }
,isc.A._searchElement=function isc_Process__searchElement(sequence,ID){
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                if(s.ID==ID){
                    return s;
                }else if(s.sequences||s.elements){
                    var res=this._searchElement(s,ID);
                    if(res)return res;
                }
            }
        }
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                if(e.ID==ID){
                    return e;
                }else if(e.sequences||e.elements){
                    var res=this._searchElement(e,ID);
                    if(res)return res;
                }
            }
        }
    }
,isc.A.getAllElements=function isc_Process_getAllElements(sequence,arr){
        if(!sequence)sequence=this;
        if(!arr)arr=[];
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                arr.add(s);
                if(s.sequences||s.elements){
                    this.getAllElements(s,arr);
                }
            }
        }
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                arr.add(e);
                if(e.sequences||e.elements){
                    this.getAllElements(e,arr);
                }
            }
        }
        return arr;
    }
,isc.A.removeElement=function isc_Process_removeElement(element){
        this._removeElement(this,element);
    }
,isc.A._removeElement=function isc_Process__removeElement(sequence,element){
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                if(s==element){
                    sequence.sequences.removeAt(i);
                    return true;
                }
                if(s.sequences||s.elements){
                    if(this._removeElement(s,element))return true;
                }
            }
        }
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                if(e==element){
                    sequence.elements.removeAt(i);
                    return true;
                }
                if(e.sequences||e.elements){
                    if(this._removeElement(e,element))return true;
                }
            }
        }
    }
,isc.A.addElement=function isc_Process_addElement(element,afterElement,beforeElement){
        if(afterElement||beforeElement){
            this._addElement(this,element,afterElement,beforeElement);
        }else{
            if(!this.elements)this.elements=[];
            this.elements.add(element);
        }
    }
,isc.A._addElement=function isc_Process__addElement(sequence,element,afterElement,beforeElement){
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                if(afterElement&&s==afterElement){
                    var position=i+1;
                    sequence.sequences.add(element,position);
                    return true;
                }else if(beforeElement&&s==beforeElement){
                    var position=i;
                    sequence.sequences.add(element,position);
                    return true;
                }
                if(s.sequences||s.elements){
                    if(this._addElement(s,element,afterElement,beforeElement))return true;
                }
            }
        }
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                if(afterElement&&e==afterElement){
                    var position=i+1;
                    sequence.elements.add(element,position);
                    return true;
                }else if(beforeElement&&e==beforeElement){
                    var position=i;
                    sequence.elements.add(element,position);
                    return true;
                }
                if(e.sequences||e.elements){
                    if(this._addElement(e,element,afterElement,beforeElement))return true;
                }
            }
        }
    }
,isc.A.setState=function isc_Process_setState(state){
        this.state=state;
    }
,isc.A.start=function isc_Process_start(){
        if(this.executionStack==null){
            if(this.logIsDebugEnabled("workflow")){
                this.logDebug("Start process: "+this.echo(this),"workflow");
            }
        }
        if(this.executionStack==null){
            this.executionStack=[];
        }
        if(this.state==null)this.state={};
        while(this._next()){
            var currentTask=this._getFirstTask();
            if(currentTask){
                this._started=true;
                if(!currentTask.executeElement(this)){
                    return;
                }
            }
        }
        if(this.finished){
            delete this._nextElement;
            this.finished(this.state);
        }
        if(this.logIsDebugEnabled("workflow")){
            this.logDebug("Process finished: "+this.echo(this),"workflow");
        }
    }
,isc.A.reset=function isc_Process_reset(state){
        this.state=state;
        this.executionStack=null;
        this._nextElement=this.startElement;
        this.setLastTaskClass(null);
        this._lastOutput=null;
    }
,isc.A._next=function isc_Process__next(skipLogEmptyMessage){
        var currEl=this.executionStack.last();
        if(currEl==null){
            if(this._nextElement){
                var nextEl=this._gotoElement(this,this._nextElement);
                if(nextEl==null){
                    isc.logWarn("unable to find task '"+this._nextElement+"' - process will be finished");
                }
                return nextEl;
            }else if(this._started){
                return null;
            }else if(this.sequences&&this.sequences.length>0){
                this.executionStack.add({el:this,sIndex:0});
                return this.sequences[0];
            }else if(this.elements&&this.elements.length>0){
                this.executionStack.add({el:this,eIndex:0});
                return this.elements[0];
            }else if(!skipLogEmptyMessage){
                isc.logWarn("There are neither sequences or elements. Nothing to execute.");
            }
        }else{
            var el=null;
            if(currEl.sIndex!=null){
                el=currEl.el.sequences[currEl.sIndex];
            }else if(currEl.eIndex!=null){
                el=currEl.el.elements[currEl.eIndex];
            }
            this.setLastTaskClass(el.getClassName());
            if(el.nextElement){
                this.executionStack=[];
                var nextEl=this._gotoElement(this,el.nextElement);
                if(nextEl==null){
                    isc.logWarn("unable to find task '"+el.nextElement+"' - process will be finished");
                }
                return nextEl;
            }else{
                return this._findNextElement();
            }
        }
    }
,isc.A._gotoElement=function isc_Process__gotoElement(sequence,ID){
        var elData={el:sequence};
        this.executionStack.add(elData);
        if(sequence.sequences){
            for(var i=0;i<sequence.sequences.length;i++){
                var s=sequence.sequences[i];
                elData.sIndex=i;
                if(s.ID==ID){
                    return s;
                }else if(s.sequences||s.elements){
                    var res=this._gotoElement(s,ID);
                    if(res)return res;
                }
            }
        }
        delete elData.sIndex;
        if(sequence.elements){
            for(var i=0;i<sequence.elements.length;i++){
                var e=sequence.elements[i];
                elData.eIndex=i;
                if(e.ID==ID){
                    return e;
                }else if(e.sequences||e.elements){
                    var res=this._gotoElement(e,ID);
                    if(res)return res;
                }
            }
        }
        this.executionStack.removeAt(this.executionStack.length-1);
    }
,isc.A._findNextElement=function isc_Process__findNextElement(){
        var elData=this.executionStack.last();
        if(elData.eIndex!=null&&elData.el!=this){
            if(elData.eIndex==elData.el.elements.length-1){
                this.executionStack.removeAt(this.executionStack.length-1);
                if(elData.el==this){
                    return;
                }else{
                    return this._findNextElement();
                }
            }else{
                elData.eIndex++;
                return elData.el.elements[elData.eIndex];
            }
        }
    }
,isc.A._getFirstTask=function isc_Process__getFirstTask(inner){
        var lastElData=this.executionStack.last();
        var el=null;
        if(lastElData.sIndex!=null){
            el=lastElData.el.sequences[lastElData.sIndex];
        }else if(lastElData.eIndex!=null){
            el=lastElData.el.elements[lastElData.eIndex];
        }
        if(el.sequences==null&&el.elements==null){
            if(!inner)this.handleTraceElement(el);
            return el;
        }
        var elData={el:el};
        this.executionStack.add(elData);
        if(el.sequences){
            for(var i=0;i<el.sequences.length;i++){
                elData.sIndex=i
                var res=this._getFirstTask(el.sequences[i]);
                if(res){
                    this.handleTraceElement(res);
                    return res;
                }
            }
        }
        if(el.elements){
            for(var i=0;i<el.elements.length;i++){
                elData.eIndex=i
                var res=this._getFirstTask(el.elements[i]);
                if(res){
                    if(elData.eIndex==0)this.handleTraceElement(elData.el);
                    this.handleTraceElement(res);
                    return res;
                }
            }
        }
        this.executionStack.removeAt(this.executionStack.length-1);
    }
,isc.A.setNextElement=function isc_Process_setNextElement(nextElement){
        var lastElData=this.executionStack.last(),
            el=null
        ;
        if(lastElData.sIndex!=null){
            el=lastElData.el.sequences[lastElData.sIndex];
        }else if(lastElData.eIndex!=null){
            el=lastElData.el.elements[lastElData.eIndex];
        }
        this.setLastTaskClass(el.getClassName());
        this.executionStack=[];
        this._nextElement=nextElement;
    }
,isc.A.setStateVariable=function isc_Process_setStateVariable(stateVariablePath,value){
        if(stateVariablePath.indexOf(".")<0||this.state[stateVariablePath]){
            this.state[stateVariablePath]=value;
        }else{
            var segments=stateVariablePath.split(".");
            var obj=this.state;
            for(var i=0;i<segments.length-1;i++){
                var nextObj=obj[segments[i]];
                if(nextObj==null){
                    obj[segments[i]]={}
                    nextObj=obj[segments[i]];
                }
                obj=nextObj;
            }
            obj[segments[i]]=value;
        }
    }
,isc.A.getStateVariable=function isc_Process_getStateVariable(stateVariablePath){
        if(stateVariablePath.indexOf(".")<0||this.state[stateVariablePath]){
            return this.state[stateVariablePath];
        }else{
            var segments=stateVariablePath.split(".");
            var obj=this.state;
            for(var i=0;i<segments.length-1;i++){
                obj=obj[segments[i]];
                if(obj==null){
                    isc.logWarn("Unable to get state variable: "+stateVariablePath+" no such path")
                    return;
                }
            }
            return obj[segments[i]]
        }
    }
,isc.A.setLastTaskClass=function isc_Process_setLastTaskClass(className){
        this._lastTaskClassName=(className?className.toLowerCase():null);
    }
,isc.A.getLastTaskClass=function isc_Process_getLastTaskClass(){
        return this._lastTaskClassName;
    }
,isc.A.setTaskOutput=function isc_Process_setTaskOutput(className,ID,output){
        if(!this._lastOutput)this._lastOutput={};
        this._lastOutput[className.toLowerCase()]=output;
        if(ID!=null)this._lastOutput[ID]=output;
    }
,isc.A.getLastTaskOutput=function isc_Process_getLastTaskOutput(key){
        if(!this._lastOutput)return null;
        var origKey=key;
        if(!key)key=this.getLastTaskClass();
        if(!key)return null;
        key=key.toLowerCase();
        if(origKey)origKey=origKey.toLowerCase();
        var value=this._lastOutput[key];
        if(origKey!=null&&value==null&&!origKey.endsWith("task")&&!origKey.endsWith("gateway")){
            key=origKey+"task";
            value=this._lastOutput[key];
            if(value==null){
                key=origKey+"gateway";
                value=this._lastOutput[key];
            }
        }
        return value;
    }
,isc.A.handleTraceElement=function isc_Process_handleTraceElement(element){
        if(isc.isA.Class(element)&&this.logIsDebugEnabled("workflow")){
            this.logDebug((this.traceElement?"Trace element: ":"Execute element: ")+this.echo(element),"workflow");
        }
        if(this.traceElement)this.traceElement(element,this.traceContext);
    }
);
isc.B._maxIndex=isc.C+25;

isc.Process.registerStringMethods({
    finished:"state",
    traceElement:"element,context"
});
isc.defineClass("ServiceTask","Task");
isc.A=isc.ServiceTask;
isc.A.requiresDataSources=true
;

isc.A=isc.ServiceTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.operationType="fetch";
isc.A.passThruOutput=false;
isc.A.title="DataSource Fetch Data";
isc.A.editorType="ServiceTaskEditor";
isc.B.push(isc.A.executeElement=function isc_ServiceTask_executeElement(process){
        var ds=this.dataSource;
        if(ds.getClassName==null||ds.getClassName()!="DataSource"){
            ds=isc.DataSource.get(ds);
        }
        var requestData=this._createRequestData(process);
        if(this.operationType=="export"){
            var requestProperties={
                exportAs:this.exportFormat,
                operationId:this.operationId
            };
            ds.exportData(requestData,requestProperties);
            return true;
        }
        var params=isc.addProperties({},this.requestProperties,{operationId:this.operationId});
        params.willHandleError=true;
        var task=this;
        ds.performDSOperation(this.operationType,requestData,function(dsResponse,data,request){
            var results=dsResponse.results,
                operation=request.operation;
            if(dsResponse.isStructured&&
                (!results||results.status<0||(results.status==null&&dsResponse.status<0)))
            {
                if(!isc.RPC.runDefaultErrorHandling(dsResponse,request,task.errorFormatter)){
                    task.fail(process);
                    return;
                }
            }
            var output=data;
            if(isc.isAn.Array(data)&&data.length>0){
                if(this.operationType=="fetch"){
                    var primaryKey=ds.getPrimaryKeyFieldName();
                    if(ds.isAdvancedCriteria(requestData)){
                        var criterion=ds.getFieldCriterion(requestData,primaryKey);
                        if(criterion&&criterion.operator=="equals"){
                            output=data[0];
                        }
                    }else if(ds.defaultTextMatchStyle=="equals"&&requestData[primaryKey]!=null){
                        output=data[0];
                    }
                }else if(this.operationType!="custom"){
                    output=data[0];
                }
            }
            process.setTaskOutput(task.getClassName(),task.ID,output);
            if(!isc.isAn.Array(data))data=[data];
            if(data.length>0){
                var fieldsToProcess=[];
                if(task.outputFieldList){
                    fieldsToProcess.addList(task.outputFieldList);
                }
                if(task.outputField)fieldsToProcess.add(task.outputField);
                for(var i=0;i<fieldsToProcess.length;i++){
                    var fieldName=fieldsToProcess[i];
                    if(fieldName.startsWith("$")){
                        var value=data.length==1?data[0]:data;
                        fieldName=fieldName.substring(1);
                        process.setStateVariable(fieldName,value);
                    }else{
                        var key=fieldName;
                        var ldi=key.lastIndexOf(".");
                        if(ldi>0){
                            key=key.substring(ldi+1);
                        }
                        var value=data[0][key];
                        if(typeof value!='undefined'){
                            if(data.length>1){
                                value=[value];
                                for(var i=1;i<data.length;i++){
                                  value.add(data[i][key])
                                }
                            }
                            process.setStateVariable(fieldName,value);
                        }
                    }
                };
                task._writeOutputExpression(data);
            }
            process.start();
        },params);
        return false;
    }
,isc.A._createRequestData=function isc_ServiceTask__createRequestData(process,skipDynamicExpressions){
        var inputData;
        var inputRecord={};
        if(this.inputFieldList){
            for(var i=0;i<this.inputFieldList.length;i++){
                var key=this.inputFieldList[i];
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                inputRecord[key]=process.getStateVariable(this.inputFieldList[i]);
            };
        }
        if(this.inputField){
            var key=this.inputField;
            if(!skipDynamicExpressions&&key.startsWith("$")){
                inputData=this._resolveInputField(key,process);
            }
            var ldi=key.lastIndexOf(".");
            if(ldi>0){
                key=key.substring(ldi+1);
            }
            if(inputData==null)inputData=process.getStateVariable(this.inputField);
            inputRecord[key]=inputData;
        }
        var data=null;
        if(this.operationType=="fetch"||this.operationType=="export"){
            if(this.criteria&&!skipDynamicExpressions){
                data=this._resolveCriteriaExpressions(this.criteria,inputData,inputRecord,process);
            }else if(this.criteria){
                data=this.criteria;
            }
            if(this.fixedCriteria){
                if(data==null&&inputRecord==null){
                    data=this.fixedCriteria
                }else{
                    var crit=isc.clone(this.fixedCriteria);
                    if(inputRecord){
                        crit=isc.DataSource.combineCriteria(inputRecord,crit);
                    }
                    if(data){
                        crit=isc.DataSource.combineCriteria(data,crit);
                    }
                    data=crit;
                }
            }
        }
        if(data==null){
            data=(this.inputFieldList==null&&isc.isAn.Object(inputData)?inputData:inputRecord);
        }
        if(this.operationType!="fetch"&&this.operationType!="export"){
            if(this.values){
                data=this.values;
                if(!skipDynamicExpressions){
                    data=this._resolveObjectDynamicExpressions(this.values,inputData,inputRecord,process);
                }
            }
            if(this.fixedValues){
                for(var key in this.fixedValues){
                    data[key]=this.fixedValues[key];
                }
            }
        }
        return data;
    }
,isc.A.fail=function isc_ServiceTask_fail(process){
        if(!this.failureElement){
            this.logWarn("ServiceTask does not have a failureElement. Process is aborting.");
        }
        process.setNextElement(this.failureElement);
    }
,isc.A.errorFormatter=function isc_ServiceTask_errorFormatter(codeName,response,request){
        if(codeName=="VALIDATION_ERROR"){
            var errors=response.errors,
                message=["Server returned validation errors:<BR><UL>"]
            ;
            if(!isc.isAn.Array(errors))errors=[errors];
            for(var i=0;i<errors.length;i++){
                var error=errors[i];
                for(var field in error){
                    var fieldErrors=error[field];
                    message.add("<LI><B>"+field+":</B> ");
                    if(!isc.isAn.Array(fieldErrors))fieldErrors=[fieldErrors];
                    for(var j=0;j<fieldErrors.length;j++){
                        var fieldError=fieldErrors[j];
                        message.add((j>0?"<BR>":"")+(isc.isAn.Object(fieldError)?fieldError.errorMessage:fieldError));
                    }
                    message.add("</LI>");
                }
            }
            message.add("</UL>");
            return message.join("");
        }
        return null;
    }
,isc.A.getElementDescription=function isc_ServiceTask_getElementDescription(){
        if(!this.dataSource)return"";
        var description=this.dataSource+" "+this.operationType+(this.operationId?" ("+this.operationId+")":""),
            data=this._createRequestData({getStateVariable:function(stateVariablePath){return stateVariablePath;}},true)
        ;
        if(this.operationType=="fetch"||this.operationType=="remove"||this.operationType=="export"){
            if(!isc.DS.isAdvancedCriteria(data)){
                data=isc.DS.convertCriteria(data,(this.operationType=="remove"?"exact":null));
            }
            var dsFields=isc.XORGateway._processFieldsRecursively(data);
            var fieldsDS=isc.DataSource.create({
                addGlobalId:false,
                fields:dsFields
            });
            description+=" where <ul>"+isc.DataSource.getAdvancedCriteriaDescription(data,fieldsDS,null,{prefix:"<li>",suffix:"</li>"})+"</ul>";
            fieldsDS.destroy();
        }
        return description;
    }
,isc.A.getOutputSchema=function isc_ServiceTask_getOutputSchema(){
        var ds=this.dataSource;
        if(ds&&(ds.getClassName==null||ds.getClassName()!="DataSource")){
            ds=isc.DataSource.get(ds);
        }
        return ds;
    }
,isc.A.updateLastElementBindingReferences=function isc_ServiceTask_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        if(this.criteria&&(this.operationType=="fetch"||this.operationType=="export")){
            changed=this._updateLastElementInCriteria(this.criteria,taskType)||changed;
        }
        if(this.values&&this.operationType!="fetch"&&this.operationType!="export"){
            changed=this._updateLastElementInValues(this.values,taskType)||changed;
        }
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_ServiceTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        if(this.criteria&&(this.operationType=="fetch"||this.operationType=="export")){
            changed=this._updateGlobalIDInCriteria(this.criteria,oldId,newId)||changed;
        }
        if(this.values&&this.operationType!="fetch"&&this.operationType!="export"){
            changed=this._updateGlobalIDInValues(this.values,oldId,newId)||changed;
        }
        return changed;
    }
);
isc.B._maxIndex=isc.C+8;

isc.defineClass("DSFetchTask","ServiceTask");
isc.A=isc.DSFetchTask.getPrototype();
isc.A.title="DataSource Fetch";
isc.A.classDescription="Retrieve data from a DataSource which match specified criteria";
isc.A.editorType="ServiceTaskEditor";
isc.A.editorProperties={showOperationTypePicker:false};
isc.A.operationType="fetch"
;

isc.defineClass("DSAddTask","ServiceTask");
isc.A=isc.DSAddTask.getPrototype();
isc.A.title="DataSource Add";
isc.A.classDescription="Add a new record";
isc.A.editorType="ServiceTaskEditor";
isc.A.editorProperties={showOperationTypePicker:false};
isc.A.operationType="add"
;

isc.defineClass("DSUpdateTask","ServiceTask");
isc.A=isc.DSUpdateTask.getPrototype();
isc.A.title="DataSource Update";
isc.A.classDescription="Update an existing record";
isc.A.editorType="ServiceTaskEditor";
isc.A.editorProperties={showOperationTypePicker:false};
isc.A.operationType="update"
;

isc.defineClass("DSRemoveTask","ServiceTask");
isc.A=isc.DSRemoveTask.getPrototype();
isc.A.title="DataSource Remove";
isc.A.classDescription="Remove an existing record";
isc.A.editorType="ServiceTaskEditor";
isc.A.editorProperties={showOperationTypePicker:false};
isc.A.operationType="remove"
;

isc.defineClass("ScriptTask","Task");
isc.A=isc.ScriptTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.passThruOutput=false;
isc.A.isAsync=false;
isc.B.push(isc.A.getProcess=function isc_ScriptTask_getProcess(){
        return this._process;
    }
,isc.A.getInputData=function isc_ScriptTask_getInputData(){
        return this.inputData;
    }
,isc.A.setOutputData=function isc_ScriptTask_setOutputData(taskOutput){
        this._finishTask(this._process,null,taskOutput);
    }
,isc.A.getInputRecord=function isc_ScriptTask_getInputRecord(){
        return this.inputRecord;
    }
,isc.A.setOutputRecord=function isc_ScriptTask_setOutputRecord(outputRecord){
        this._finishTask(this._process,outputRecord);
    }
,isc.A.executeElement=function isc_ScriptTask_executeElement(process){
        var inputData;
        var inputRecord={};
        if(this.inputFieldList){
            for(var i=0;i<this.inputFieldList.length;i++){
                var key=this.inputFieldList[i];
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                inputRecord[key]=isc.clone(process.getStateVariable(this.inputFieldList[i]));
            };
        }
        if(this.inputField){
            var key=this.inputField;
            if(key.startsWith("$")){
                inputData=isc.clone(this._resolveInputField(key,process));
            }
            var ldi=key.lastIndexOf(".");
            if(ldi>0){
                key=key.substring(ldi+1);
            }
            if(inputData==null)inputData=isc.clone(process.getStateVariable(this.inputField));
            inputRecord[key]=inputData;
        }
        this.inputData=inputData;
        this.inputRecord=inputRecord;
        this._process=process;
        try{
            var output=this.execute(inputData,inputRecord);
        }catch(e){
            isc.logWarn("Error while executing ScriptTask: "+e.toString());
        }
        if(this.isAsync){
            return false;
        }
        if(typeof output=='undefined'){
            return true;
        }
        this._processTaskOutput(process,output);
        return true;
    }
,isc.A._processTaskOutput=function isc_ScriptTask__processTaskOutput(process,output){
        process.setTaskOutput(this.getClassName(),this.ID,output);
        if(this.outputFieldList){
            for(var i=0;i<this.outputFieldList.length;i++){
                var key=this.outputFieldList[i];
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                var value=output[key];
                if(typeof value!='undefined'){
                    process.setStateVariable(this.outputFieldList[i],value);
                }
            };
        }
        if(this.outputField){
            if(this.outputFieldList==null){
                if(typeof output!='undefined'){
                    process.setStateVariable(this.outputField,output);
                }
            }else{
                var key=this.outputField;
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                var value=output[key];
                if(typeof value!='undefined'){
                    process.setStateVariable(this.outputField,value);
                }
            }
        }
        this._writeOutputExpression(output);
    }
,isc.A._finishTask=function isc_ScriptTask__finishTask(process,outputRecord,outputData){
        if(outputRecord==null){
            this._processTaskOutput(process,outputData);
        }else{
            if(outputData){
                var key=this.outputField;
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                outputRecord[key]=outputData;
            }
            this._processTaskOutput(process,outputRecord);
        }
        if(this.isAsync){
            process.start();
        }
    }
,isc.A.getCustomDefaults=function isc_ScriptTask_getCustomDefaults(){
        return{execute:isc.Func.getBody(this.execute)};
    }
);
isc.B._maxIndex=isc.C+9;

isc.ScriptTask.registerStringMethods({
    execute:"input,inputRecord"
});
isc.defineClass("XORGateway","ProcessElement");
isc.A=isc.XORGateway;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A._processFieldsRecursivelyValuesOnly=function isc_c_XORGateway__processFieldsRecursivelyValuesOnly(criteria){
        var dsFields=[];
        if(criteria.fieldName){
            if(!dsFields.contains(criteria.fieldName)){
                dsFields.add(criteria.fieldName);
            }
        }else if(criteria.criteria){
            for(var i=0;i<criteria.criteria.length;i++){
                var fs=this._processFieldsRecursivelyValuesOnly(criteria.criteria[i]);
                for(var j=0;j<fs.length;j++){
                    if(!dsFields.contains(fs[j])){
                        dsFields.add(fs[j]);
                    }
                }
            }
        }else{
            for(var key in criteria){
                if(!dsFields.contains(key)){
                    dsFields.add(key);
                }
            }
        }
        return dsFields
    }
,isc.A._processFieldsRecursively=function isc_c_XORGateway__processFieldsRecursively(criteria){
        var res=[];
        var dsFields=isc.XORGateway._processFieldsRecursivelyValuesOnly(criteria);
        for(var i=0;i<dsFields.length;i++){
            var fieldName=dsFields[i],
                splitFieldName=fieldName.split("."),
                title=isc.DS.getAutoTitle(splitFieldName[splitFieldName.length-1])
            ;
            res.add({
                name:fieldName,
                title:title
            });
        }
        return res;
    }
);
isc.B._maxIndex=isc.C+2;

isc.A=isc.XORGateway.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Single Decision";
isc.A.classDescription="Choose the next task based on criteria";
isc.A.editorType="XORGatewayEditor";
isc.B.push(isc.A.executeElement=function isc_XORGateway_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var criteria=this.criteria;
        if(criteria){
            criteria=this._resolveCriteriaExpressions(criteria,process.state,process.state,process);
        }
        var data=[process.state];
        if(process.ruleScope){
            var ruleScopeComponent=window[process.ruleScope];
            if(ruleScopeComponent&&!ruleScopeComponent.destroyed){
                data.add(ruleScopeComponent.getRuleContext());
            }
        }
        if(criteria&&isc.DS.applyFilter(data,criteria).length==1){
            if(this.nextElement)process.setNextElement(this.nextElement);
        }else{
            if(!this.failureElement){
                this.logWarn("XOR Gateway does not have a failureElement. Process is aborting.");
            }
            process.setNextElement(this.failureElement);
        }
        return true;
    }
,isc.A.getElementDescription=function isc_XORGateway_getElementDescription(){
        var description="No criteria - always fail";
        if(this.criteria){
            var dsFields=isc.XORGateway._processFieldsRecursively(this.criteria);
            var fieldsDS=isc.DataSource.create({
                addGlobalId:false,
                fields:dsFields
            });
            description="when <ul>"+isc.DataSource.getAdvancedCriteriaDescription(this.criteria,fieldsDS,null,{prefix:"<li>",suffix:"</li>"})+"</ul>";
            fieldsDS.destroy();
        }
        return description;
    }
,isc.A.getPlaceholders=function isc_XORGateway_getPlaceholders(){
        return(this.failureElement==isc.Process.gatewayPlaceholderSelection?["failureElement"]:null);
    }
,isc.A.setPlaceholderId=function isc_XORGateway_setPlaceholderId(placeholder,id){
        if(placeholder=="failureElement")this.failureElement=id;
    }
,isc.A.updateLastElementBindingReferences=function isc_XORGateway_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        changed=this._updateLastElementInCriteria(this.criteria,taskType)||changed;
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_XORGateway_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        changed=this._updateGlobalIDInCriteria(this.criteria,oldId,newId)||changed;
        return changed;
    }
);
isc.B._maxIndex=isc.C+6;

isc.defineClass("UserConfirmationGateway","ProcessElement");
isc.A=isc.UserConfirmationGateway.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Confirm with user";
isc.A.classDescription="Choose the next task based on user confirmation";
isc.A.editorType="UserConfirmationGatewayEditor";
isc.B.push(isc.A.executeElement=function isc_UserConfirmationGateway_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var message=this.getTextFormulaValue(this.textFormula,process)||
                      this.getDynamicValue(this.message,process);
        var task=this;
        isc.confirm(message,function(value){
            if(value){
                if(task.nextElement)process.setNextElement(task.nextElement);
            }else{
                if(!task.failureElement){
                    task.logWarn("User Confirmation Gateway does not have a failureElement. Process is aborting.");
                }
                process.setNextElement(task.failureElement);
            }
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_UserConfirmationGateway_getElementDescription(){
        var description="Confirm with user";
        return description;
    }
,isc.A.getPlaceholders=function isc_UserConfirmationGateway_getPlaceholders(){
        return(this.failureElement==isc.Process.gatewayPlaceholderSelection?["failureElement"]:null);
    }
,isc.A.setPlaceholderId=function isc_UserConfirmationGateway_setPlaceholderId(placeholder,id){
        if(placeholder=="failureElement")this.failureElement=id;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("DecisionGateway","ProcessElement");
isc.A=isc.DecisionGateway.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._canAddNextElement=false;
isc.A.title="Multi Decision";
isc.A.classDescription="Choose multiple possible next tasks based on criteria";
isc.A.editorType="DecisionGatewayEditor";
isc.B.push(isc.A.executeElement=function isc_DecisionGateway_executeElement(process){
        this._convertCriteriaMap();
        if(!this.decisionList)this.decisionList=[];
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        for(var i=0;i<this.decisionList.length;i++){
            var taskDecision=this.decisionList[i],
                criteria=taskDecision.criteria
            ;
            if(criteria){
                criteria=this._resolveCriteriaExpressions(criteria,process.state,process.state,process);
            }
            var dsFields=isc.XORGateway._processFieldsRecursively(criteria);
            var ds=isc.DataSource.create({
                fields:dsFields
            });
            var data=[process.state];
            if(process.ruleScope){
                var ruleScopeComponent=window[process.ruleScope];
                if(ruleScopeComponent&&!ruleScopeComponent.destroyed){
                    data.add(ruleScopeComponent.getRuleContext());
                }
            }
            if(ds.applyFilter(data,criteria).length==1){
                process.setNextElement(taskDecision.targetTask);
                return true;
            }
        }
        if(this.defaultElement)process.setNextElement(this.defaultElement);
        return true;
    }
,isc.A._convertCriteriaMap=function isc_DecisionGateway__convertCriteriaMap(){
        if(!this.decisionList&&this.criteriaMap){
            var decisionList=[];
            for(var key in this.criteriaMap){
                decisionList.add({
                    criteria:this.criteriaMap[key],
                    targetTask:key
                });
            }
            this.decisionList=decisionList;
        }
    }
,isc.A.getElementDescription=function isc_DecisionGateway_getElementDescription(){
        this._convertCriteriaMap();
        var description="Multi-branch";
        if((!this.decisionList||this.decisionList.length==0)&&this.defaultElement){
            description="Go to "+this.defaultElement;
        }
        return description;
    }
,isc.A.dropElementReferences=function isc_DecisionGateway_dropElementReferences(ID){
        this._convertCriteriaMap();
        if(this.decisionList){
            var decisionsToDrop=[];
            for(var i=0;i<this.decisionList.length;i++){
                var taskDecision=this.decisionList[i];
                if(taskDecision.targetTask==ID)decisionsToDrop.add(taskDecision);
            }
            if(decisionsToDrop.length>0)this.decisionList.removeList(decisionsToDrop);
        }
        if(this.defaultElement==ID)this.defaultElement=null;
    }
,isc.A.updateElementReferences=function isc_DecisionGateway_updateElementReferences(oldID,newID){
        this._convertCriteriaMap();
        if(this.decisionList){
            for(var i=0;i<this.decisionList.length;i++){
                var taskDecision=this.decisionList[i];
                if(taskDecision.targetTask==oldID)taskDecision.targetTask=newID;
            }
        }
        if(this.defaultElement==oldID)this.defaultElement=newID;
    }
,isc.A.getPlaceholders=function isc_DecisionGateway_getPlaceholders(){
        this._convertCriteriaMap();
        var placeholders=[];
        if(this.decisionList){
            for(var i=0;i<this.decisionList.length;i++){
                var taskDecision=this.decisionList[i];
                if(taskDecision.targetTask==isc.Process.gatewayPlaceholderSelection){
                    placeholders.add(""+i);
                }
            }
        }
        if(this.defaultElement==isc.Process.gatewayPlaceholderSelection){
            placeholders.add("defaultElement");
        }
        return placeholders;
    }
,isc.A.setPlaceholderId=function isc_DecisionGateway_setPlaceholderId(placeholder,id){
        if(placeholder=="defaultElement"){
            this.defaultElement=id;
        }else{
            var index=parseInt(placeholder);
            this.decisionList[index].targetTask=id;
        }
    }
,isc.A.updateLastElementBindingReferences=function isc_DecisionGateway_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        if(this.decisionList){
            for(var i=0;i<this.decisionList.length;i++){
                var taskDecision=this.decisionList[i],
                    criteria=taskDecision.criteria
                ;
                changed=this._updateLastElementInCriteria(this.criteria,taskType)||changed;
            }
        }
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_DecisionGateway_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        if(this.decisionList){
            for(var i=0;i<this.decisionList.length;i++){
                var taskDecision=this.decisionList[i],
                    criteria=taskDecision.criteria
                ;
                changed=this._updateGlobalIDInCriteria(criteria,oldId,newId)||changed;
            }
        }
        return changed;
    }
);
isc.B._maxIndex=isc.C+9;

isc.defineClass("UserTask","Task");
isc.A=isc.UserTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.passThruOutput=false;
isc.A.editorType="UserTaskEditor"
;
isc.B.push(isc.A.goToPrevious=function isc_UserTask_goToPrevious(){
        if(this.previousElement==null){
            isc.logWarn("PreviousElement is not set - unable to accomplish goToPrevious method.");
            return;
        }
        this._process.setNextElement(this.previousElement);
        this.completeEditing();
    }
,isc.A.cancelEditing=function isc_UserTask_cancelEditing(){
        if(this._process){
            if(this.wizard||this._process.wizard){
                if(this.targetFormValue){
                    this.targetFormValue.hide();
                }
            }
            var process=this._process
            delete this._process;
            process.setNextElement(this.cancelElement);
            process.start();
        }
    }
,isc.A.completeEditing=function isc_UserTask_completeEditing(){
        if(this._process){
            var process=this._process;
            delete this._process;
            if(this.wizard||process.wizard){
                if(this.targetFormValue){
                    this.targetFormValue.hide();
                }
            }
            var values;
            if(this.targetVMValue){
                values=this.targetVMValue.getValues();
            }else if(this.targetFormValue){
                values=this.targetFormValue.getValues();
            }
            process.setTaskOutput(this.getClassName(),this.ID,values);
            if(this.outputField){
                process.setStateVariable(this.outputField,values);
            }else if(this.outputFieldList){
                for(var i=0;i<this.outputFieldList.length;i++){
                    var key=this.outputFieldList[i];
                    var ldi=key.lastIndexOf(".");
                    if(ldi>0){
                        key=key.substring(ldi+1);
                    }
                    var value=values[key];
                    if(typeof value!='undefined'){
                        process.setStateVariable(this.outputFieldList[i],value);
                    }
                }
            }else{
                process.setStateVariable(this.inputField,values);
            }
            this._writeOutputExpression(values);
            process.start();
        }
    }
,isc.A.executeElement=function isc_UserTask_executeElement(process){
        this._process=process;
        if(this.targetView&&isc.isA.String(this.targetView)){
            if(process.getStateVariable(this.targetView)){
                this.targetViewValue=process.getStateVariable(this.targetView);
            }else{
                this.targetViewValue=window[this.targetView];
                if(this.targetViewValue==null&&process.views){
                    for(var i=0;i<process.views.length;i++){
                        if(process.views[i].ID==this.targetView){
                            this.targetViewValue=isc[process.views[i]._constructor].create(process.views[i]);
                            if(this._process.containerId){
                                window[this._process.containerId].addMember(this.targetViewValue);
                            }
                            break;
                        }
                    }
                }
                if(this.targetViewValue==null){
                    this.targetViewValue=this.addAutoChild(this.targetView);
                }
                if(this.targetViewValue==null){
                    isc.logWarn("TargetView "+this.targetView+" was not found.");
                }
            }
        }else{
            if(this.targetView){
                this.targetViewValue=this.targetView;
            }else if(this.inlineView){
                this.targetViewValue=isc[this.inlineView._constructor].create(this.inlineView);
                if(this._process.containerId){
                    window[this._process.containerId].addMember(this.targetViewValue);
                }
            }
        }
        if(this.targetVM&&isc.isA.String(this.targetVM)){
            if(process.state[this.targetVM]){
                this.targetVMValue=process.getStateVariable(this.targetVM);
            }else{
                this.targetVMValue=window[this.targetVM];
                if(this.targetVMValue==null){
                    isc.logWarn("TargetVM "+this.targetVM+" was not found.");
                }
            }
        }else{
            this.targetVMValue=this.targetVM;
        }
        if(this.targetForm&&isc.isA.String(this.targetForm)){
            if(process.state[this.targetForm]){
                this.targetFormValue=process.getStateVariable(this.targetForm);
            }else{
                this.targetFormValue=window[this.targetForm];
                if(this.targetFormValue==null){
                    isc.logWarn("TargetForm "+this.targetForm+" was not found.");
                }
            }
        }else{
            this.targetFormValue=this.targetForm;
        }
        if(this.targetViewValue==null){
            isc.logWarn("TargetView or inlineView should be set for UserTask");
            return true;
        }
        if(this.targetFormValue==null&&isc.isA.DynamicForm(this.targetViewValue)){
            this.targetFormValue=this.targetViewValue;
        }
        if(this.targetFormValue==null&&this.targetVMValue==null){
            isc.logWarn("Either targetForm or targetVM should be set for UserTask or "+
                "targetView should be a DynamicForm");
            return true;
        }
        this.targetViewValue.showRecursively();
        var values=null;
        if(this.inputField){
            if(this.inputField.startsWith("$")){
                values=isc.clone(this._resolveInputField(this.inputField,process));
            }else{
                values=isc.clone(process.getStateVariable(this.inputField));
            }
        }else if(this.inputFieldList){
            values={};
            for(var i=0;i<this.inputFieldList.length;i++){
                var key=this.inputFieldList[i];
                var ldi=key.lastIndexOf(".");
                if(ldi>0){
                    key=key.substring(ldi+1);
                }
                values[key]=isc.clone(process.getStateVariable(this.inputFieldList[i]));
            }
        }
        if(this.targetVMValue){
            if(values)this.targetVMValue.setValues(values);
            this.targetVMValue.userTask=this;
        }
        if(this.targetFormValue){
            if(values)this.targetFormValue.setValues(values);
            this.targetFormValue.saveToServer=(this.saveToServer==true);
            this.targetFormValue.userTask=this;
        }
        return false;
    }
,isc.A.getElementDescription=function isc_UserTask_getElementDescription(){
        var showTarget={type:"[nothing]"};
        if(this.targetView){
            showTarget={type:"targetView",ID:(isc.isA.String(this.targetView)?this.targetView:null)};
        }else if(this.inlineView){
            showTarget={type:"inlineView"};
        }
        return"Show "+(showTarget.ID?"'"+showTarget.ID+"' ":"")+showTarget.type+" and wait for input";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("StateTask","Task");
isc.A=isc.StateTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.passThruOutput=false;
isc.A.editorType="StateTaskEditor"
;
isc.B.push(isc.A.executeElement=function isc_StateTask_executeElement(process){
        if(this.value==null&&this.inputField==null&&this.inputFieldList==null){
            isc.logWarn("StateTask: value, inputField or inputFieldList should be set.");
            return true;
        }
        if(this.value==null&&this.inputField==null){
            if(this.outputFieldList==null||this.outputFieldList.length!=this.inputFieldList.length){
                isc.logWarn("StateTask: outputFieldList should have same number of parameters as inputFieldList.");
                return;
            }
            if(this.type){
                isc.logWarn("StateTask: type cannot be used with multiple outputFields");
            }
            for(var i=0;i<this.inputFieldList.lenght;i++){
                var value=process.getStateVariable(this.inputFieldList[i]);
                process.setStateVariable(this.outputFieldList[i],value);
            }
            return true;
        }
        var value=this.value||this._resolveInputField(this.inputField,process);
        value=this._executePair(value,this.type,process);
        process.setStateVariable(this.outputField,value);
        process.setTaskOutput(this.getClassName(),this.ID,value);
        return true;
    }
,isc.A._executePair=function isc_StateTask__executePair(value,type,process){
        if(value==null){
            isc.logWarn("StateTask: value is null. Unable to convert to "+type);
            this.fail(process);
            return null;
        }
        if("string"==type){
            return value.toString();
        }else if("boolean"==type){
            if("true"==value)return true;
            if("false"==value)return false;
            if(isc.isA.String(value))return value.length!=0;
            if(isc.isA.Number(value))return value!=0;
            return value!=null;
        }else if("decimal"==type){
            var v=parseFloat(value.toString());
            if(isNaN(v)){
                this.fail(process);
                return null;
            }
            return v;
        }else if("integer"==type){
            var v=parseInt(value.toString());
            if(isNaN(v)){
                this.fail(process);
                return null;
            }
            return v;
        }else if("record"==type){
            if(isc.isAn.Object(value)&&!isc.isAn.Array(value)&&
                    !isc.isAn.RegularExpression(value)&&!isc.isAn.Date(value))
            {
                return value;
            }
            return null;
        }else if("array"==type){
            if(isc.isAn.Array(value))return value;
            return[value];
        }else{
            return value;
        }
    }
,isc.A.fail=function isc_StateTask_fail(process){
        if(this.failureElement==null){
            isc.logWarn("There is no failureElement in stateTask");
        }else{
            process.setNextElement(this.failureElement);
        }
    }
,isc.A.getElementDescription=function isc_StateTask_getElementDescription(){
        var description="no-op";
        if(this.value!=null){
            description="Set "+this.outputField+"="+this.value;
        }else if(this.type!=null){
            description="Set "+this.outputField+"="+this.inputField+" as "+this.type;
        }else if(this.inputField||this.inputFieldList){
            description="Copy "+(this.inputField?this.inputField:this.inputFieldList.join(","))+" to "+(this.outputField?this.outputField:this.outputFieldList.join(","));
        }
        return description;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("StartProcessTask","ScriptTask");
isc.A=isc.StartProcessTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.isAsync=true;
isc.B.push(isc.A.execute=function isc_StartProcessTask_execute(input,inputRecord){
        if(!this.process){
            this.logWarn("StartProcessTask with no process. Skipped");
            return;
        }
        var process=this.process,
            finished=process.finished,
            _this=this
        ;
        process.finished=function(state){
            if(finished)finished(state);
            _this.setOutputRecord(state);
        }
        this.isAsync=true;
        process.setState(inputRecord);
        process.start();
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("EndProcessTask","ProcessElement");
isc.A=isc.EndProcessTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.editorPlaceholder=true;
isc.B.push(isc.A.executeElement=function isc_EndProcessTask_executeElement(process){
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("ShowMessageTask","ProcessElement");
isc.A=isc.ShowMessageTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Show a message in a modal dialog";
isc.A.editorType="ShowMessageTaskEditor";
isc.A.type="normal";
isc.A._typeDescriptionMap={
        "normal":"",
        "warning":"warning",
        "error":"error"
    };
isc.B.push(isc.A.executeElement=function isc_ShowMessageTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var messageType=this.type,
            callback=function(){process.start()}
        ;
        var message=this.getTextFormulaValue(this.textFormula,process)||
                      this.getDynamicValue(this.message,process);
        if(messageType=="normal"){
            isc.say(message,callback);
        }else if(messageType=="warning"){
            isc.warn(message,callback);
        }else if(messageType=="error"){
            isc.Dialog.create({
                message:message,
                icon:isc.Dialog.getInstanceProperty("errorIcon"),
                buttons:[
                    isc.Button.create({title:"OK"})
                ],
                buttonClick:function(button,index){
                    callback();
                }
            });
        }else{
            return true;
        }
        return false;
    }
,isc.A.getElementDescription=function isc_ShowMessageTask_getElementDescription(){
        var message=this.message||"",
            messageParts=message.split(" "),
            shortMessage=messageParts.getRange(0,3).join(" "),
            type=this.type||"message"
        ;
        if(shortMessage.length>25)shortMessage=shortMessage.substring(0,25);
        if(shortMessage!=message)shortMessage+=" ...";
        return"Show "+this._typeDescriptionMap[type]+" message:<br>"+shortMessage;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("AskForValueTask","UserConfirmationGateway");
isc.A=isc.AskForValueTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Ask for Value";
isc.A.classDescription="Ask the user to input a value";
isc.A.editorType="AskForValueTaskEditor";
isc.B.push(isc.A.executeElement=function isc_AskForValueTask_executeElement(process){
        var properties=(this.defaultValue?{defaultValue:this.defaultValue}:null);
        var message=this.getTextFormulaValue(this.textFormula,process)||
                      this.getDynamicValue(this.message,process);
        var task=this;
        isc.askForValue(message,function(value){
            if(value){
                process.setTaskOutput(task.getClassName(),task.ID,value);
                if(task.nextElement)process.setNextElement(task.nextElement);
            }else{
                if(!task.failureElement){
                    task.logWarn("Ask For Value Task does not have a failureElement. Process is aborting.");
                }
                process.setNextElement(task.failureElement);
            }
            process.start();
        },properties);
        return false;
    }
,isc.A.getElementDescription=function isc_AskForValueTask_getElementDescription(){
        var description="Ask user for a value";
        return description;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ShowNotificationTask","ProcessElement");
isc.A=isc.ShowNotificationTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Show a message which fades out automatically";
isc.A.editorType="ShowNotificationTaskEditor";
isc.A.autoDismiss=true;
isc.A.position="T";
isc.A.notifyType="message";
isc.A._notifyTypeDescriptionMap={
        "message":"",
        "warn":"warning",
        "error":"error"
    };
isc.B.push(isc.A.executeElement=function isc_ShowNotificationTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var notifyType=this.notifyType,
            settings={position:this.position};
        if(!this.autoDismiss){
            settings.duration=0;
            settings.canDismiss=true;
        }
        var message=this.getTextFormulaValue(this.textFormula,process)||
                      this.getDynamicValue(this.message,process);
        isc.Notify.addMessage(message,null,notifyType,settings);
        return true;
    }
,isc.A.getElementDescription=function isc_ShowNotificationTask_getElementDescription(){
        var message=this.message||"",
            messageParts=message.split(" "),
            shortMessage=messageParts.getRange(0,3).join(" "),
            notifyType=this.notifyType||"message"
        ;
        if(shortMessage.length>25)shortMessage=shortMessage.substring(0,25);
        if(shortMessage!=message)shortMessage+=" ...";
        return"Show "+this._notifyTypeDescriptionMap[notifyType]+" notification:<br>"+
            shortMessage;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("StartTransactionTask","ProcessElement");
isc.A=isc.StartTransactionTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Starts queuing all DataSource operations so they can be sent "+
        "to the server all together as a transaction";
isc.A.editorType=null;
isc.B.push(isc.A.executeElement=function isc_StartTransactionTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        isc.RPC.startQueue();
        return true;
    }
,isc.A.getElementDescription=function isc_StartTransactionTask_getElementDescription(){
        return"Start queuing";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("SendTransactionTask","ProcessElement");
isc.A=isc.SendTransactionTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Sends any currently queued DataSource operations "+
        "as a single transactional request to the server";
isc.A.editorType=null;
isc.B.push(isc.A.executeElement=function isc_SendTransactionTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        isc.RPC.sendQueue();
        return true;
    }
,isc.A.getElementDescription=function isc_SendTransactionTask_getElementDescription(){
        return"Send queue";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ComponentTask","ProcessElement");
isc.A=isc.ComponentTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.isApplicableComponent=function isc_c_ComponentTask_isApplicableComponent(component){
        var clazz=(component.getClass?component.getClass():null);
        if(!clazz)return false;
        var baseClasses=this.getInstanceProperty("componentBaseClass"),
            requiresDataSource=this.getInstanceProperty("componentRequiresDataSource")||false
        ;
        baseClasses=(isc.isAn.Array(baseClasses)?baseClasses:[baseClasses]);
        for(var i=0;i<baseClasses.length;i++){
            if(clazz.isA(baseClasses[i])&&(!requiresDataSource||component.dataSource)){
                return true;
            }
        }
        return false;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.ComponentTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getComponentBaseClasses=function isc_ComponentTask_getComponentBaseClasses(){
        return(isc.isAn.Array(this.componentBaseClass)?this.componentBaseClass:[this.componentBaseClass]);
    }
,isc.A.getTargetComponent=function isc_ComponentTask_getTargetComponent(process){
        if(!this.componentId){
            this.logWarn("ComponentTask with no componentId. Task skipped");
            return null;
        }
        if(isc.isA.Class(this.componentId))return this.componentId;
        var component=window[this.componentId];
        if(!component){
            if(process&&process.screenComponent){
                component=process.screenComponent.getByLocalId(this.componentId);
            }
            if(!component){
                this.logWarn("Component not found for ID "+this.componentId+" not found. Task skipped");
                return null;
            }
        }
        var baseClasses=this.getComponentBaseClasses();
        for(var i=0;i<baseClasses.length;i++){
            if(component.isA(baseClasses[i]))return component;
        }
        this.logWarn("Component type '"+component.getClassName()+"' is not supported for "+this.getClassName()+". Task skipped");
        return null;
    }
,isc.A.getLocalComponent=function isc_ComponentTask_getLocalComponent(process,componentId){
        if(!componentId)return null;
        if(isc.isA.Class(componentId))return componentId;
        var component=window[componentId];
        if(!component){
            if(process&&process.screenComponent){
                component=process.screenComponent.getByLocalId(componentId);
            }
            if(!component)return null;
        }
        return component;
    }
,isc.A.updateGlobalIDReferences=function isc_ComponentTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        if(this.componentId&&this.componentId==oldId){
            this.componentId=newId;
            changed=true;
        }
        return changed;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("SetLabelTextTask","ComponentTask");
isc.A=isc.SetLabelTextTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="Label";
isc.A.classDescription="Sets the text of a label";
isc.A.editorType="SetLabelTextTaskEditor";
isc.B.push(isc.A.executeElement=function isc_SetLabelTextTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var label=this.getTargetComponent(process);
        if(!label)return true;
        var value=this.getTextFormulaValue(this.textFormula,process)||
                    this.getDynamicValue(this.value,process);
        label.setContents(value);
        return true;
    }
,isc.A.getElementDescription=function isc_SetLabelTextTask_getElementDescription(){
        var description="Set '"+this.componentId+"' text";
        return description;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("SetButtonTitleTask","ComponentTask");
isc.A=isc.SetButtonTitleTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["Button","Window"];
isc.A.classDescription="Sets the title of a button or window";
isc.A.editorType="SetButtonTitleTaskEditor";
isc.B.push(isc.A.executeElement=function isc_SetButtonTitleTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var button=this.getTargetComponent(process);
        if(!button)return true;
        var title=this.getTextFormulaValue(this.textFormula,process)||
                    this.getDynamicValue(this.title,process);
        button.setTitle(title);
        return true;
    }
,isc.A.getElementDescription=function isc_SetButtonTitleTask_getElementDescription(){
        var description="Set '"+this.componentId+"' title";
        return description;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ShowComponentTask","ComponentTask");
isc.A=isc.ShowComponentTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="Canvas";
isc.A.title="Show";
isc.A.classDescription="Show a currently hidden component";
isc.A.editorType="ShowComponentTaskEditor";
isc.B.push(isc.A.executeElement=function isc_ShowComponentTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var canvas=this.getTargetComponent(process);
        if(!canvas)return true;
        canvas.show();
        return true;
    }
,isc.A.getElementDescription=function isc_ShowComponentTask_getElementDescription(){
        return"Show "+this.componentId;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("HideComponentTask","ComponentTask");
isc.A=isc.HideComponentTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="Canvas";
isc.A.title="Hide";
isc.A.classDescription="Hide a component";
isc.A.editorType="HideComponentTaskEditor";
isc.B.push(isc.A.executeElement=function isc_HideComponentTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var canvas=this.getTargetComponent(process);
        if(!canvas)return true;
        canvas.hide();
        return true;
    }
,isc.A.getElementDescription=function isc_HideComponentTask_getElementDescription(){
        return"Hide "+this.componentId;
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormSetValuesTask","ComponentTask");
isc.A=isc.FormSetValuesTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Set form values";
isc.A.editorType="FormSetValuesTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormSetValuesTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        this.process=process;
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var data=null;
        if(this.values){
            data=this._resolveObjectDynamicExpressions(this.values,null,null,process);
        }
        if(this.fixedValues){
            for(var key in this.fixedValues){
                data[key]=this.fixedValues[key];
            }
        }
        form.setValues(data);
        return true;
    }
,isc.A.getElementDescription=function isc_FormSetValuesTask_getElementDescription(){
        return"Set '"+this.componentId+"' values";
    }
,isc.A.getOutputSchema=function isc_FormSetValuesTask_getOutputSchema(){
        var form=this.getTargetComponent(this.process);
        if(!form)return null;
        return form.getDataSource();
    }
,isc.A.updateLastElementBindingReferences=function isc_FormSetValuesTask_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        changed=this._updateLastElementInValues(this.values,taskType)||changed;
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_FormSetValuesTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        changed=this._updateGlobalIDInValues(this.values,oldId,newId)||changed;
        return changed;
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("FormSetFieldValueTask","ComponentTask");
isc.A=isc.FormSetFieldValueTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Put a value into just one field of a form";
isc.A.editorType="FormSetFieldValueTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormSetFieldValueTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var value=this.value;
        if(value){
            var values=this._resolveObjectDynamicExpressions({value:value},null,null,process);
            value=values.value;
        }
        form.setValue(this.targetField,value);
        return true;
    }
,isc.A.getElementDescription=function isc_FormSetFieldValueTask_getElementDescription(){
        return"Set '"+this.componentId+"."+this.targetField+"' value";
    }
,isc.A.updateLastElementBindingReferences=function isc_FormSetFieldValueTask_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        changed=this._updateLastElementInValueProperty("value",taskType)||changed;
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_FormSetFieldValueTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        changed=this._updateGlobalIDInValueProperty("value",oldId,newId)||changed;
        return changed;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("FormClearValuesTask","ComponentTask");
isc.A=isc.FormClearValuesTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Clear form values and errors";
isc.A.editorType="FormClearValuesTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormClearValuesTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var form=this.getTargetComponent(process);
        if(!form)return true;
        form.clearValues();
        return true;
    }
,isc.A.getElementDescription=function isc_FormClearValuesTask_getElementDescription(){
        return"Clear '"+this.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormResetValuesTask","ComponentTask");
isc.A=isc.FormResetValuesTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Reset values in a form to defaults";
isc.A.editorType="FormResetValuesTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormResetValuesTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var form=this.getTargetComponent(process);
        if(!form)return true;
        form.resetValues();
        return true;
    }
,isc.A.getElementDescription=function isc_FormResetValuesTask_getElementDescription(){
        return"Reset '"+this.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormValidateValuesTask","ComponentTask");
isc.A=isc.FormValidateValuesTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Validate a form and show errors to user";
isc.A.editorType="FormValidateValuesTaskEditor";
isc.A.passThruOutput=false;
isc.B.push(isc.A.executeElement=function isc_FormValidateValuesTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var formDS=form.getDataSource(),
            validClientData
        ;
        if(formDS){
            var task=this;
            validClientData=form.validateData(function(response){
                process.setTaskOutput(task.getClassName(),task.ID,task.createOutput(response));
                process.start();
            });
        }else{
            validClientData=form.validate();
        }
        if(validClientData==false||!formDS){
            var response={
                status:(validClientData==false
                         ?isc.RPCResponse.STATUS_VALIDATION_ERROR
                         :isc.RPCResponse.STATUS_SUCCESS),
                errors:form.getErrors()
            };
            process.setTaskOutput(this.getClassName(),this.ID,this.createOutput(response));
        }else{
        }
        return(validClientData==false);
    }
,isc.A.createOutput=function isc_FormValidateValuesTask_createOutput(response){
        var output={valuesValid:true};
        if(response.status==isc.RPCResponse.STATUS_VALIDATION_ERROR){
            output.valuesValid=false;
            output.errors=isc.DS.getSimpleErrors(response);
        }
        return output;
    }
,isc.A.getOutputSchema=function isc_FormValidateValuesTask_getOutputSchema(){
        if(!this._outputSchema){
            var form=this.getTargetComponent(this.process);
            if(form){
                var fields=[
                    {name:"_meta_valuesValid",title:"[meta] valuesValid",type:"boolean",criteriaPath:"valuesValid"}
                ];
                var formDS=form.getDataSource();
                if(formDS){
                    var fieldNames=formDS.getFieldNames();
                    for(var i=0;i<fieldNames.length;i++){
                        var fieldName=fieldNames[i],
                            field={name:fieldName,type:"text",multiple:true}
                        ;
                        fields.add(field);
                    }
                }
                this._outputSchema=isc.DS.create({
                    addGlobalId:false,
                    clientOnly:true,
                    criteriaBasePath:"errors",
                    fields:fields
                });
            }
        }
        return this._outputSchema;
    }
,isc.A.destroy=function isc_FormValidateValuesTask_destroy(){
        if(this._outputSchema)this._outputSchema.destroy();
        this.Super("destroy",arguments);
    }
,isc.A.getElementDescription=function isc_FormValidateValuesTask_getElementDescription(){
        return"Validate '"+this.componentId+"' values";
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("FormSaveDataTask","ComponentTask");
isc.A=isc.FormSaveDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Save changes made in a form (validates first)";
isc.A.editorType="FormSaveDataTaskEditor";
isc.A.passThruOutput=false;
isc.B.push(isc.A.executeElement=function isc_FormSaveDataTask_executeElement(process){
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var params=isc.addProperties({},this.requestProperties,{willHandleError:true});
        var task=this;
        form.saveData(function(dsResponse,data,request){
            dsResponse=dsResponse||{};
            var results=dsResponse.results;
            if(dsResponse.isStructured&&
                (!results||results.status<0||(results.status==null&&dsResponse.status<0)))
            {
                if(!isc.RPC.runDefaultErrorHandling(dsResponse,request,task.errorFormatter)){
                    process.setTaskOutput(task.getClassName(),task.ID,task.createFailureOutput(dsResponse));
                    task.fail(process);
                    return;
                }
            }else{
                process.setTaskOutput(task.getClassName(),task.ID,dsResponse.data);
            }
            process.start();
        },params);
        return false;
    }
,isc.A.fail=function isc_FormSaveDataTask_fail(process){
        if(!this.failureElement){
            this.logWarn("FormSaveDataTask does not have a failureElement. Process is aborting.");
        }
        process.setNextElement(this.failureElement);
    }
,isc.A.errorFormatter=function isc_FormSaveDataTask_errorFormatter(codeName,response,request){
        if(codeName=="VALIDATION_ERROR"){
            var errors=response.errors,
                message=["Server returned validation errors:<BR><UL>"]
            ;
            if(!isc.isAn.Array(errors))errors=[errors];
            for(var i=0;i<errors.length;i++){
                var error=errors[i];
                for(var field in error){
                    var fieldErrors=error[field];
                    message.add("<LI><B>"+field+":</B> ");
                    if(!isc.isAn.Array(fieldErrors))fieldErrors=[fieldErrors];
                    for(var j=0;j<fieldErrors.length;j++){
                        var fieldError=fieldErrors[j];
                        message.add((j>0?"<BR>":"")+(isc.isAn.Object(fieldError)?fieldError.errorMessage:fieldError));
                    }
                    message.add("</LI>");
                }
            }
            message.add("</UL>");
            return message.join("");
        }
        return null;
    }
,isc.A.createFailureOutput=function isc_FormSaveDataTask_createFailureOutput(response){
        var output={valuesValid:true};
        if(response.status==isc.RPCResponse.STATUS_VALIDATION_ERROR){
            output.valuesValid=false;
            var form=this.getTargetComponent(this.process);
            if(form){
                output.errors=isc.DS.getSimpleErrors(response);
            }
        }
        return output;
    }
,isc.A.getOutputSchema=function isc_FormSaveDataTask_getOutputSchema(){
        var form=this.getTargetComponent(this.process);
        if(!form)return null;
        return form.getDataSource();
    }
,isc.A.getFailureSchema=function isc_FormSaveDataTask_getFailureSchema(){
        if(!this._failureSchema){
            var form=this.getTargetComponent(this.process);
            if(form){
                var fields=[
                    {name:"_meta_valuesValid",title:"[meta] valuesValid",type:"boolean",criteriaPath:"valuesValid"}
                ];
                var formDS=form.getDataSource();
                if(formDS){
                    var fieldNames=formDS.getFieldNames();
                    for(var i=0;i<fieldNames.length;i++){
                        var fieldName=fieldNames[i],
                            field={name:fieldName,type:"text",multiple:true}
                        ;
                        fields.add(field);
                    }
                }
                this._failureSchema=isc.DS.create({
                    addGlobalId:false,
                    clientOnly:true,
                    criteriaBasePath:"errors",
                    fields:fields
                });
            }
        }
        return this._failureSchema;
    }
,isc.A.destroy=function isc_FormSaveDataTask_destroy(){
        if(this._failureSchema)this._failureSchema.destroy();
        this.Super("destroy",arguments);
    }
,isc.A.getElementDescription=function isc_FormSaveDataTask_getElementDescription(){
        return"Save '"+this.componentId+"' data";
    }
);
isc.B._maxIndex=isc.C+8;

isc.defineClass("FormEditNewRecordTask","ComponentTask");
isc.A=isc.FormEditNewRecordTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["record"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_FormEditNewRecordTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            if(mapping!=null)properties[this._paramProperties[i]]="^"+mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.FormEditNewRecordTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.classDescription="Start editing a new record";
isc.A.editorType="FormEditNewRecordTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormEditNewRecordTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var values;
        if(this.initialValues){
            values=this._resolveObjectDynamicExpressions(this.initialValues,null,null,process);
        }
        form.editNewRecord(values);
        return true;
    }
,isc.A.getElementDescription=function isc_FormEditNewRecordTask_getElementDescription(){
        return"Edit '"+this.componentId+"' new record";
    }
,isc.A.updateLastElementBindingReferences=function isc_FormEditNewRecordTask_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        changed=this._updateLastElementInValues(this.initialValues,taskType)||changed;
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_FormEditNewRecordTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        changed=this._updateGlobalIDInValues(this.initialValues,oldId,newId)||changed;
        return changed;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("FormEditRecordTask","FormEditNewRecordTask");
isc.A=isc.FormEditRecordTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["recordSourceComponent"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_FormEditRecordTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            if(mapping!=null)properties[this._paramProperties[i]]="^"+mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.FormEditRecordTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.componentRequiresDataSource=true;
isc.A.editorType="FormEditRecordTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormEditRecordTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var recordSourceComponentId=this.recordSourceComponent;
        if(!recordSourceComponentId){
            this.logWarn("recordSourceComponent not specified on task. Task skipped.");
            return true;
        }
        var recordSourceComponent=this.getLocalComponent(process,recordSourceComponentId);
        if(!recordSourceComponent){
            this.logWarn("recordSourceComponent '"+recordSourceComponentId+"' not found. Task skipped.");
            return true;
        }
        var values=this.initialValues;
        if(isc.isA.ListGrid(recordSourceComponent)&&recordSourceComponent.anySelected()){
            values=recordSourceComponent.getSelectedRecord();
        }else if(isc.isA.DynamicForm(recordSourceComponent)){
            values=recordSourceComponent.getValues();
        }else if(isc.isA.ListGrid(recordSourceComponent)){
            values=recordSourceComponent.getRecord(0);
        }else if(isc.isA.DetailViewer(recordSourceComponent)){
            values=recordSourceComponent.data[0];
        }
        form.editRecord(values);
        return true;
    }
,isc.A.getElementDescription=function isc_FormEditRecordTask_getElementDescription(){
        return"Edit '"+this.componentId+"' from other record";
    }
,isc.A.updateGlobalIDReferences=function isc_FormEditRecordTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        if(this.recordSourceComponent&&this.recordSourceComponent==oldId){
            this.recordSourceComponent=newId;
            changed=true;
        }
        return changed;
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("FormEditSelectedTask","ComponentTask");
isc.A=isc.FormEditSelectedTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["selectionComponentId"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_FormEditSelectedTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            if(mapping!=null)properties[this._paramProperties[i]]="^"+mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.FormEditSelectedTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["DynamicForm","ValuesManager"];
isc.A.componentRequiresDataSource=true;
isc.A.title="Edit Selected Record";
isc.A.classDescription="Edit a record currently showing in some other component";
isc.A.editorType="FormEditSelectedTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormEditSelectedTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var selectionComponentId=this.selectionComponentId;
        if(!selectionComponentId){
            this.logWarn("selectionComponentId not specified on task. Task skipped.");
            return true;
        }
        var selectionComponent=this.getLocalComponent(process,selectionComponentId);
        if(!selectionComponent){
            this.logWarn("selectionComponent '"+selectionComponentId+"' not found. Task skipped.");
            return true;
        }
        var values=null;
        if(selectionComponent.getSelectedRecord){
            values=selectionComponent.getSelectedRecord();
        }
        form.editRecord(values);
        return true;
    }
,isc.A.getElementDescription=function isc_FormEditSelectedTask_getElementDescription(){
        return"Edit '"+this.componentId+"' from selected record";
    }
,isc.A.updateGlobalIDReferences=function isc_FormEditSelectedTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        if(this.selectionComponentId&&this.selectionComponentId==oldId){
            this.selectionComponentId=newId;
            changed=true;
        }
        return changed;
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("FormHideFieldTask","ComponentTask");
isc.A=isc.FormHideFieldTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="DynamicForm";
isc.A.title="Show / Hide Field";
isc.A.classDescription="Show or hide a field of a form";
isc.A.editorType="FormHideFieldTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormHideFieldTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var targetField=this.targetField;
        if(!targetField){
            this.logWarn("targetField not specified on task. Task skipped.");
            return true;
        }
        var hide=this.hide;
        if(isc.isA.String(hide))hide=(hide=="true");
        if(hide)form.hideItem(targetField);
        else form.showItem(targetField);
        return true;
    }
,isc.A.getElementDescription=function isc_FormHideFieldTask_getElementDescription(){
        var hide=this.hide;
        if(isc.isA.String(hide))hide=(hide=="true");
        var action=(hide?"Hide":"Show");
        return action+" '"+this.componentId+"."+this.targetField+"'";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("FormDisableFieldTask","ComponentTask");
isc.A=isc.FormDisableFieldTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="DynamicForm";
isc.A.title="Enable / Disable Field";
isc.A.classDescription="Enable or disable a field of a form";
isc.A.editorType="FormDisableFieldTaskEditor";
isc.B.push(isc.A.executeElement=function isc_FormDisableFieldTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var form=this.getTargetComponent(process);
        if(!form)return true;
        var targetField=this.targetField;
        if(!targetField){
            this.logWarn("targetField not specified on task. Task skipped.");
            return true;
        }
        var disable=this.disable;
        if(isc.isA.String(disable))disable=(disable=="true");
        var field=form.getField(targetField);
        if(field){
            field.setDisabled(disable);
        }
        return true;
    }
,isc.A.getElementDescription=function isc_FormDisableFieldTask_getElementDescription(){
        var disable=this.disable;
        if(isc.isA.String(disable))disable=(disable=="true");
        var action=(disable?"Disable":"Enable");
        return action+" '"+this.componentId+"."+this.targetField+"'";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridFetchDataTask","ComponentTask");
isc.A=isc.GridFetchDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid","DetailViewer"];
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Cause a grid to fetch data matching specified criteria";
isc.A.editorType="GridFetchDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridFetchDataTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var task=this,
            criteria=this._resolveCriteriaExpressions(this.criteria,process.state,process.state,process)
        ;
        grid.fetchData(criteria,function(dsResponse){
            var firstRecord=(dsResponse.data&&dsResponse.data.length>0?dsResponse.data[0]:null);
            process.setTaskOutput(task.getClassName(),task.ID,firstRecord);
            process.start();
        },this.requestProperties);
        return false;
    }
,isc.A.getOutputSchema=function isc_GridFetchDataTask_getOutputSchema(){
        var grid=this.getTargetComponent(this.process);
        if(!grid)return null;
        var ds=grid.dataSource;
        if(ds&&(ds.getClassName==null||ds.getClassName()!="DataSource")){
            ds=isc.DataSource.get(ds);
        }
        return ds;
    }
,isc.A.getElementDescription=function isc_GridFetchDataTask_getElementDescription(){
        var criteria=this.criteria,
            description="Fetch "+(!criteria?"all ":"")+"data on '"+this.componentId+"'"
        ;
        if(criteria){
            if(!isc.DS.isAdvancedCriteria(criteria)){
                criteria=isc.DS.convertCriteria(criteria);
            }
            var dsFields=isc.XORGateway._processFieldsRecursively(criteria);
            var fieldsDS=isc.DataSource.create({
                addGlobalId:false,
                fields:dsFields
            });
            description+=" where <ul>"+isc.DataSource.getAdvancedCriteriaDescription(criteria,fieldsDS,null,{prefix:"<li>",suffix:"</li>"})+"</ul>";
            fieldsDS.destroy();
        }
        return description;
    }
,isc.A.updateLastElementBindingReferences=function isc_GridFetchDataTask_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        changed=this._updateLastElementInCriteria(this.criteria,taskType)||changed;
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_GridFetchDataTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        changed=this._updateGlobalIDInCriteria(this.criteria,oldId,newId)||changed;
        return changed;
    }
);
isc.B._maxIndex=isc.C+5;

isc.defineClass("GridFetchRelatedDataTask","ComponentTask");
isc.A=isc.GridFetchRelatedDataTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["record","schema","callback","requestParameters"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_GridFetchRelatedDataTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            if(mapping!=null)properties[this._paramProperties[i]]="^"+mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.GridFetchRelatedDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid","DetailViewer"];
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Cause a grid to fetch data related to a record in another grid";
isc.A.editorType="GridFetchRelatedDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridFetchRelatedDataTask_executeElement(process){
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var recordSourceComponentId=this.recordSourceComponent;
        if(!recordSourceComponentId){
            this.logWarn("recordSourceComponent not specified on task. Task skipped.");
            return true;
        }
        var recordSourceComponent=this.getLocalComponent(process,recordSourceComponentId);
        if(!recordSourceComponent){
            this.logWarn("recordSourceComponent '"+recordSourceComponentId+"' not found. Task skipped.");
            return true;
        }
        var schema=this.dataSource||recordSourceComponent;
        var record=null,
            sourceIsGrid=isc.isA.ListGrid(recordSourceComponent)||isc.isA.TileGrid(recordSourceComponent)
        ;
        if(sourceIsGrid&&recordSourceComponent.anySelected()){
            record=recordSourceComponent.getSelectedRecord();
        }else if(isc.isA.DynamicForm(recordSourceComponent)){
            record=recordSourceComponent.getValues();
        }else if(sourceIsGrid){
            record=recordSourceComponent.getRecord(0);
        }else if(isc.isA.DetailViewer(recordSourceComponent)){
            record=recordSourceComponent.data[0];
        }
        if(!record)return true;
        var task=this;
        var willFetchData=grid.fetchRelatedData(record,schema,function(dsResponse){
            var firstRecord=(dsResponse.data&&dsResponse.data.length>0?dsResponse.data[0]:null);
            process.setTaskOutput(task.getClassName(),task.ID,firstRecord);
            process.start();
        },null,true);
        if(!willFetchData){
            var firstRecord=grid.getRecord(0);
            process.setTaskOutput(task.getClassName(),task.ID,firstRecord);
        }
        return!willFetchData;
    }
,isc.A.getOutputSchema=function isc_GridFetchRelatedDataTask_getOutputSchema(){
        var grid=this.getTargetComponent(this.process);
        if(!grid)return null;
        var ds=grid.dataSource;
        if(ds&&(ds.getClassName==null||ds.getClassName()!="DataSource")){
            ds=isc.DataSource.get(ds);
        }
        return ds;
    }
,isc.A.getElementDescription=function isc_GridFetchRelatedDataTask_getElementDescription(){
        return"Fetch '"+this.componentId+"' data from related record";
    }
,isc.A.updateGlobalIDReferences=function isc_GridFetchRelatedDataTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        if(this.recordSourceComponent&&this.recordSourceComponent==oldId){
            this.recordSourceComponent=newId;
            changed=true;
        }
        return changed;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("GridRemoveSelectedDataTask","ComponentTask");
isc.A=isc.GridRemoveSelectedDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid"];
isc.A.classDescription="Remove data that is selected in a grid";
isc.A.editorType="GridRemoveSelectedDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridRemoveSelectedDataTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var params=isc.addProperties({},this.requestProperties,{willHandleError:true});
        var task=this;
        grid.removeSelectedData(function(dsResponse,data,request){
            if(dsResponse&&dsResponse.status<0){
                task.fail(process);
                return;
            }
            process.start();
        },params);
        return false;
    }
,isc.A.getElementDescription=function isc_GridRemoveSelectedDataTask_getElementDescription(){
        return"Remove '"+this.componentId+"' selected records";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridStartEditingTask","ComponentTask");
isc.A=isc.GridStartEditingTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="ListGrid";
isc.A.classDescription="Start editing a new record";
isc.A.editorType="GridStartEditingTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridStartEditingTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var values;
        if(this.initialValues){
            values=this._resolveObjectDynamicExpressions(this.initialValues,null,null,process);
        }
        grid.startEditingNew(values);
        return true;
    }
,isc.A.getElementDescription=function isc_GridStartEditingTask_getElementDescription(){
        return"Edit '"+this.componentId+"' new record";
    }
,isc.A.updateLastElementBindingReferences=function isc_GridStartEditingTask_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        changed=this._updateLastElementInValues(this.initialValues,taskType)||changed;
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_GridStartEditingTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        changed=this._updateGlobalIDInValues(this.initialValues,oldId,newId)||changed;
        return changed;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("GridSetEditValueTask","ComponentTask");
isc.A=isc.GridSetEditValueTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="ListGrid";
isc.A.componentRequiresDataSource=true;
isc.A.classDescription="Set a value in an editable grid as if the user had made the edit";
isc.A.editorType="GridSetEditValueTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridSetEditValueTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        var colNum=this.targetField;
        if(colNum==null){
            this.logWarn("targetField not specified on task. Task skipped.");
            return true;
        }
        var editRow=grid.getEditRow(),
            rowNum=editRow
        ;
        if(rowNum<0){
            var selectedRecord=grid.getSelectedRecord();
            if(selectedRecord){
                rowNum=grid.getRecordIndex(selectedRecord);
            }
        }
        if(rowNum<0){
            if(grid.getRecord(0)!=null){
                rowNum=0;
            }
        }
        var value=this.value;
        if(value){
            var values=this._resolveObjectDynamicExpressions({value:value},null,null,process);
            value=values.value;
        }
        if(rowNum>=0){
            if(rowNum!=editRow){
                grid.startEditing(rowNum,colNum);
                rowNum=grid.getEditRow();
            }
            if(rowNum>=0){
                grid.setEditValue(rowNum,colNum,value);
            }
        }else{
            var initialValues={};
            initialValues[this.targetField]=value;
            grid.startEditingNew(initialValues);
        }
        return true;
    }
,isc.A.getElementDescription=function isc_GridSetEditValueTask_getElementDescription(){
        return"Set '"+this.componentId+"."+this.targetField+"' edit value";
    }
,isc.A.updateLastElementBindingReferences=function isc_GridSetEditValueTask_updateLastElementBindingReferences(taskType){
        var changed=this.Super("updateLastElementBindingReferences",arguments);
        changed=this._updateLastElementInValueProperty("value",taskType)||changed;
        return changed;
    }
,isc.A.updateGlobalIDReferences=function isc_GridSetEditValueTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        changed=this._updateGlobalIDInValueProperty("value",oldId,newId)||changed;
        return changed;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("GridSaveAllEditsTask","ComponentTask");
isc.A=isc.GridSaveAllEditsTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="ListGrid";
isc.A.classDescription="Save all changes in a grid with auto-saving disabled";
isc.A.editorType="GridSaveAllEditsTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridSaveAllEditsTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        grid.saveAllEdits(null,function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_GridSaveAllEditsTask_getElementDescription(){
        return"Save all '"+this.componentId+"' edits";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridTransferDataTask","ComponentTask");
isc.A=isc.GridTransferDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid"];
isc.A.classDescription="Transfer selected records from one grid to another";
isc.A.editorType="GridTransferDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridTransferDataTask_executeElement(process){
        var targetGrid=this.getTargetComponent(process);
        if(!targetGrid)return true;
        var sourceComponentId=this.sourceComponent;
        if(!sourceComponentId){
            this.logWarn("sourceComponent not specified on task. Task skipped.");
            return true;
        }
        var sourceComponent=this.getLocalComponent(process,sourceComponentId);
        if(!sourceComponent){
            this.logWarn("sourceComponent '"+sourceComponentId+"' not found. Task skipped.");
            return true;
        }
        var task=this;
        targetGrid.transferSelectedData(sourceComponent,null,function(records){
            var firstRecord=(records&&records.length>0?records[0]:null);
            process.setTaskOutput(task.getClassName(),task.ID,firstRecord);
            process.start();
        });
        return false;
    }
,isc.A.getOutputSchema=function isc_GridTransferDataTask_getOutputSchema(){
        var grid=this.getTargetComponent(this.process);
        if(!grid)return null;
        var ds=grid.dataSource;
        if(ds&&(ds.getClassName==null||ds.getClassName()!="DataSource")){
            ds=isc.DataSource.get(ds);
        }
        return ds;
    }
,isc.A.getElementDescription=function isc_GridTransferDataTask_getElementDescription(){
        return"Transfer selected data from '"+this.sourceComponent+"' to '"+this.componentId+"'";
    }
,isc.A.updateGlobalIDReferences=function isc_GridTransferDataTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        if(this.sourceComponent&&this.sourceComponent==oldId){
            this.sourceComponent=newId;
            changed=true;
        }
        return changed;
    }
);
isc.B._maxIndex=isc.C+4;

isc.defineClass("GridExportDataTask","ComponentTask");
isc.A=isc.GridExportDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid","DetailViewer"];
isc.A.componentRequiresDataSource=true;
isc.A.title="Export Data (Server)";
isc.A.classDescription="Export data currently shown in a grid";
isc.A.editorType="GridExportDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridExportDataTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        grid.exportData(this.requestProperties,function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_GridExportDataTask_getElementDescription(){
        return"Export '"+this.componentId+"' data";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("GridExportClientDataTask","ComponentTask");
isc.A=isc.GridExportClientDataTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["ListGrid","TileGrid","DetailViewer"];
isc.A.title="Export Data (Client)";
isc.A.classDescription="Export data currently shown in a grid keeping all grid-specific formatting";
isc.A.editorType="GridExportClientDataTaskEditor";
isc.B.push(isc.A.executeElement=function isc_GridExportClientDataTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var grid=this.getTargetComponent(process);
        if(!grid)return true;
        grid.exportClientData(this.requestProperties,function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_GridExportClientDataTask_getElementDescription(){
        return"Export '"+this.componentId+"' formatted data";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("PrintCanvasTask","ComponentTask");
isc.A=isc.PrintCanvasTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["Canvas"];
isc.A.title="Print";
isc.A.classDescription="Print canvas contents";
isc.A.editorType="PrintCanvasTaskEditor";
isc.B.push(isc.A.executeElement=function isc_PrintCanvasTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var canvas=this.getTargetComponent(process);
        if(!canvas)return true;
        isc.Canvas.showPrintPreview(canvas,this.printProperties,this.printCanvasTask,function(){
            process.start();
        });
        return false;
    }
,isc.A.getElementDescription=function isc_PrintCanvasTask_getElementDescription(){
        return"Print '"+this.componentId+"'";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ShowNextToComponentTask","ComponentTask");
isc.A=isc.ShowNextToComponentTask;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._paramProperties=["nextToComponentId","side","canOcclude","skipAnimation"];
isc.B.push(isc.A.createInitPropertiesFromAction=function isc_c_ShowNextToComponentTask_createInitPropertiesFromAction(action,sourceMethod){
        var properties={},
            mappings=action.mapping||[]
        ;
        for(var i=0;i<mappings.length;i++){
            var mapping=mappings[i];
            if(mapping=="null")mapping=null;
            if(mapping!=null)properties[this._paramProperties[i]]="^"+mapping;
        }
        return properties;
    }
);
isc.B._maxIndex=isc.C+1;

isc.A=isc.ShowNextToComponentTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="Canvas";
isc.A.title="Show Next To";
isc.A.classDescription="Show a component next to some other component";
isc.A.editorType="ShowNextToComponentTaskEditor";
isc.B.push(isc.A.executeElement=function isc_ShowNextToComponentTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var canvas=this.getTargetComponent(process);
        if(!canvas)return true;
        var nextToComponentId=this.nextToComponentId;
        if(!nextToComponentId){
            this.logWarn("nextToComponentId not specified on task. Task skipped.");
            return true;
        }
        var nextToComponent=this.getLocalComponent(process,nextToComponentId);
        if(!nextToComponent){
            this.logWarn("nextToComponentId '"+nextToComponentId+"' not found. Task skipped.");
            return true;
        }
        canvas.showNextTo(nextToComponent,this.side,this.canOcclue,this.skipAnimation);
        return true;
    }
,isc.A.getElementDescription=function isc_ShowNextToComponentTask_getElementDescription(){
        return"Show '"+this.componentId+"' next to '"+this.nextToComponentId+"'";
    }
,isc.A.updateGlobalIDReferences=function isc_ShowNextToComponentTask_updateGlobalIDReferences(oldId,newId){
        var changed=this.Super("updateGlobalIDReferences",arguments);
        if(this.nextToComponentId&&this.nextToComponentId==oldId){
            this.nextToComponentId=newId;
            changed=true;
        }
        return changed;
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("SetSectionTitleTask","ComponentTask");
isc.A=isc.SetSectionTitleTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="SectionStack";
isc.A.classDescription="Sets the title of a section in a SectionStack";
isc.A.editorType="SetSectionTitleTaskEditor";
isc.B.push(isc.A.executeElement=function isc_SetSectionTitleTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var sectionStack=this.getTargetComponent(process);
        if(!sectionStack)return true;
        var sectionName=this.targetSectionName;
        if(!sectionName&&this.targetSectionTitle){
            var sectionNames=sectionStack.getSectionNames();
            for(var i=0;i<sectionNames.length;i++){
                var sectionHeader=sectionStack.getSectionHeader(sectionNames[i]);
                if(sectionHeader&&sectionHeader.title==this.targetSectionTitle){
                    sectionName=sectionNames[i];
                    break;
                }
            }
        }
        if(!sectionName){
            isc.logWarn("Target section not identified by targetSectionName or targetSectionTitle. Task skipped");
            return true;
        }
        var title=this.getTextFormulaValue(this.textFormula,process)||
                    this.getDynamicValue(this.title,process);
        sectionStack.setSectionTitle(sectionName,title);
        return true;
    }
,isc.A.getElementDescription=function isc_SetSectionTitleTask_getElementDescription(){
        return"Set '"+this.componentId+"' section title";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("NavigateListPaneTask","ComponentTask");
isc.A=isc.NavigateListPaneTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass="TriplePane";
isc.A.classDescription="Navigate to the List pane in a TriplePane, using the selection "+
        "in the Navigation pane to refresh the list, if applicable";
isc.A.editorType="NavigateListPaneTaskEditor";
isc.B.push(isc.A.executeElement=function isc_NavigateListPaneTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var triplePane=this.getTargetComponent(process);
        if(!triplePane)return true;
        var title=this.title;
        if(title){
            var values=this._resolveObjectDynamicExpressions({value:title},null,null,process);
            title=values.value;
        }
        triplePane.navigateListPane(title);
        return true;
    }
,isc.A.getElementDescription=function isc_NavigateListPaneTask_getElementDescription(){
        return"Navigate '"+this.componentId+"' list pane";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("NavigateDetailPaneTask","ComponentTask");
isc.A=isc.NavigateDetailPaneTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.componentBaseClass=["SplitPane","TriplePane"];
isc.A.classDescription="Navigate to the Detail pane in a SplitPane or TriplePane, "+
        "using the selection in the Navigation pane (for SplitPane) or List Pane (for TriplePane)";
isc.A.editorType="NavigateDetailPaneTaskEditor";
isc.B.push(isc.A.executeElement=function isc_NavigateDetailPaneTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var splitPane=this.getTargetComponent(process);
        if(!splitPane)return true;
        var title=this.title;
        if(title){
            var values=this._resolveObjectDynamicExpressions({value:title},null,null,process);
            title=values.value;
        }
        splitPane.navigateDetailPane(title);
        return true;
    }
,isc.A.getElementDescription=function isc_NavigateDetailPaneTask_getElementDescription(){
        return"Navigate '"+this.componentId+"' detail pane";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("LogOutTask","ProcessElement");
isc.A=isc.LogOutTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Logs the current user out of the application";
isc.A.editorType=null;
isc.B.push(isc.A.executeElement=function isc_LogOutTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var url=(isc.Auth?isc.Auth.logOutURL:null);
        if(!url){
            isc.logWarn("logOutURL not specified on Auth class. Task skipped");
            return true;
        }
        isc.Auth.logOut();
        return true;
    }
,isc.A.getElementDescription=function isc_LogOutTask_getElementDescription(){
        return"Log out the current user";
    }
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("ResetPasswordTask","ProcessElement");
isc.A=isc.ResetPasswordTask.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.classDescription="Sends the user to a screen to reset their password";
isc.A.editorType=null;
isc.B.push(isc.A.executeElement=function isc_ResetPasswordTask_executeElement(process){
        process.setTaskOutput(this.getClassName(),this.ID,process.getLastTaskOutput());
        var url=(isc.Auth?isc.Auth.resetPasswordURL:null);
        if(!url){
            isc.logWarn("resetPasswordURL not specified on Auth class. Task skipped");
            return true;
        }
        isc.Auth.resetPassword();
        return true;
    }
,isc.A.getElementDescription=function isc_ResetPasswordTask_getElementDescription(){
        return"Reset user password";
    }
);
isc.B._maxIndex=isc.C+2;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('Workflow');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._Workflow_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('Workflow module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'Workflow', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'Workflow'.");}
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

