/*============================================================
    "dark" theme programmatic settings
============================================================*/

isc.loadSkin = function (theWindow) {
    if (theWindow == null) theWindow = window;
    with (theWindow) {
		isc.Page.setSkinDir("[ISOMORPHIC]/skins/dark/");
        var dir = isc.Page.getSkinDir();
		var skinCss = document.getElementById("skin-css");
		if (skinCss != null) {
			skinCss.href = dir + "skin_color.css";
		}
		else {
			document.write("<link id=\"skin-css\" rel=\"stylesheet\" href=\"" + dir + "skin_color.css\">");
		}
        //isc.Page.loadStyleSheet("[SKIN]/skin_styles.css", theWindow);
        // Register skin
        //----------------------------------------
        var currentSkin = isc.setCurrentSkin({
            // name is autoderived to be the containing folder
            backgroundColor: "#2a2f34",
            borderColor: "rgba(140, 140, 140, 0.15)",
            border_default: "1px solid rgba(140, 140, 140, 0.15)",
            color_default: "#c0c0c0",
            name: "autoDetect"
        });

        isc.Class.modifyFrameworkStart();

        isc.Canvas.standardHeaderIconExtension = "gif";

        // Standard Framework icons - changes specific to this skin
        var aIcons = isc.Canvas.standardActionIcons;
        aIcons.find('name', 'Add').states = null;    // default [Disabled]
        aIcons.find('name', 'Back').states = null;    // default [Disabled]
        aIcons.find('name', 'Edit').states = null;    // default [Disabled]
        aIcons.find('name', 'Forward').states = null;    // default [Disabled]
        aIcons.remove(aIcons.find('name', 'Accept'));
        aIcons.remove(aIcons.find('name', 'Color_swatch'));
        aIcons.remove(aIcons.find('name', 'Plus'));
        aIcons.remove(aIcons.find('name', 'Print'));
        aIcons.remove(aIcons.find('name', 'Text_linespacing'));

        var hIcons = isc.Window.standardHeaderIcons;
        hIcons.find('name', 'Arrow_down').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Arrow_left').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Arrow_right').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Arrow_up').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Calculator').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Cart').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Clipboard').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Clock').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Close').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Comment').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Double_arrow_down').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Double_arrow_left').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Double_arrow_right').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Double_arrow_up').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Favourite').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Find').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Help').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Home').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Mail').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Maximize').states = ["Disabled", "Over"];    // default [Down, Over]
        hIcons.find('name', 'Minus').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Person').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Pin_down').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Pin_left').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Plus').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Print').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Refresh').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Refresh_thin').states = ["Disabled", "Over"];    // default [Over]
        hIcons.find('name', 'Save').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Settings').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Transfer').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Trash').states = ["Over", "Disabled"];    // default [Over]
        hIcons.find('name', 'Zoom').states = ["Over", "Disabled"];    // default [Over]
        hIcons.remove(hIcons.find('name', 'Maximize_new'));
        hIcons.remove(hIcons.find('name', 'Maximize_old'));

        isc.Canvas.setProperties({
            // use synthetic scrollbars
            // in mobile
            // for Macs, since from OSX Lion onward, scrollbars are not shown by default
            // in Webkit browsers as css scrollbars are natively shown in some cases when
            // this should not be necessary
             // showCustomScrollbars:(isc.Browser.isMobile || isc.Browser.isMac ||
             //                     !(isc.Browser.isIE || isc.Browser.isFirefox)),
            showCustomScrollbars:true,
            groupBorderCSS:currentSkin.border_default,
            useImageForSVG:true
        });

        if(isc.Browser.isIE && isc.Browser.version >= 7 && !isc.Browser.isIE9) {
            isc.Canvas.setAllowExternalFilters(false);
            isc.Canvas.setNeverUseFilters(true);
            if(isc.Window) {
              isc.Window.addProperties({
                    modalMaskOpacity:null,
                    modalMaskStyle:"normal"
                });
                isc.Window.changeDefaults("modalMaskDefaults", { src : "[SKIN]opacity.png" });
            }
        }

        if(isc.RPCManager) {
            isc.RPCManager.addClassProperties({ promptStyle:"cursor" });
        }
        isc.Button.addProperties({
            height: 24,
            showFocusOutline:false
        });
        isc.ButtonItem.addProperties({
            height: 24,
            titleVAlign:"center",
            showFocusOutline:false
        });

        // define IButton so examples that support the new SmartClient skin image-based
        // button will fall back on the CSS-based Button with this skin
        isc.ClassFactory.defineClass("IButton", "Button").addProperties({
            showFocusOutline:false
        });
        isc.ClassFactory.defineClass("IAutoFitButton", "AutoFitButton");
        if (isc.IButton.markAsFrameworkClass != null) isc.IButton.markAsFrameworkClass();
        if (isc.IAutoFitButton.markAsFrameworkClass != null) isc.IAutoFitButton.markAsFrameworkClass();

        isc.ClassFactory.defineClass("HeaderMenuButton", "IButton").addProperties({
            baseStyle: "headerButton"
        });

        // Have IMenuButton be just a synonym for IMenuButton
        if (isc.MenuButton) {
            isc.ClassFactory.overwriteClass("IMenuButton", "MenuButton");
            if (isc.IMenuButton.markAsFrameworkClass != null) isc.IMenuButton.markAsFrameworkClass();
            isc.MenuButton.addProperties({
                // copy the header (.button) background-color to match when sort arrow is hidden
                baseStyle : "button",
                menuButtonImage:{src:"[SKIN]menu_down.png", width:16, height:16},
                menuButtonImageUp:{src:"[SKIN]menu_up.png", width:16, height:16}
            });
        }

        if (isc.IconButton) {
            isc.IconButton.addProperties({
                showOver: false,
                menuIconSrc: "[SKINIMG]/Menu/menu_down.png"
            });
        }

        if (isc.ImgButton) {
            isc.ImgButton.addProperties({
                showOver: false,
                showRollOver: false,
                showRollOverIcon: false,
                showDown: false,
                showDownIcon: false,
            });
        }

        if (isc.PickTreeItem) {
            isc.overwriteClass("IPickTreeItem", "PickTreeItem");
        }

        isc.Label.addProperties({
            showFocused: false
        });

        //----------------------------------------
        // 1) Scrollbars
        //----------------------------------------
        // NOTE: not used by default in Simplicity

        isc.SimpleScrollThumb.addProperties({
            baseStyle:"scrollThumb",
            showTrackButtons:false,
            showTrackEnds:false,
            hSrc:null,
            vSrc:null
        });

        isc.Scrollbar.addProperties({
            baseStyle:"scrollbar",
            btnSize:1,
            btn:null,
            hSrc:null,
            hThumbClass:isc.HSimpleScrollThumb,
            showRollOver:true,
            thumbInset:0,
            thumbMinSize:10,
            thumbOverlap:0,
            vSrc:null,
            vThumbClass:isc.VSimpleScrollThumb,
            showTrackButtons:false,
            showTrackEnds:false,
            trackStartImg:null,
            trackEndImg:null,
            showCorner:false,
            cornerSrc:null,
            cornerImg:null
        });

        isc.Canvas.addProperties({
            scrollbarSize:6
        });
        //----------------------------------------
        // 3) Resizebars
        //----------------------------------------
        // StretchImgSplitbar class renders as resize bar
        isc.StretchImgSplitbar.addProperties({
            capSize:10,
            showGrip:true,
            showOver : false,
            backgroundColor:null
        });

        isc.Snapbar.addProperties({
            // vSrc:"[SKIN]vsplit.gif",
            // hSrc:"[SKIN]hsplit.gif",
            vSrc:null,
            hSrc:null,
            baseStyle:"splitbar",
            items : [
                {name:"blank", width:"capSize", height:"capSize"},
                {name:"blank", width:"*", height:"*"},
                {name:"blank", width:"capSize", height:"capSize"}
            ],
            showDownGrip:false,
            gripBreadth:5,
            gripLength:35,
            capSize:10,
            showRollOver : false,
            showDown : false,
            showRollOverGrip:false,
            backgroundColor:null,
            showTrackButtons:false,
            showTrackEnds:false,
            trackStartImg:null,
            trackEndImg:null,
            showCorner:false,
            cornerSrc:null,
            cornerImg:null,
            canCollapse:false
        });

        isc.Layout.addProperties({
            resizeBarSize:1,
            // Use the Snapbar as a resizeBar by default - subclass of Splitbar that
            // shows interactive (closed/open) grip images
            // Other options include the Splitbar, StretchImgSplitbar or ImgSplitbar
            resizeBarClass:"Snapbar"
        })
        isc.overwriteClass("LayoutResizeBar", "LayoutResizeSnapbar");

        if (isc.SectionItem) {
            isc.SectionItem.addProperties({
                height:26
            });
        }
        if (isc.SectionStack) {
            isc.SectionStack.addProperties({
                headerHeight:26
            });
        }

        if (isc.SectionHeader) {
            isc.SectionHeader.addProperties({
                iconSize: 16,
                height: 26
            });
        }

        if (isc.SectionStackSection) {
            isc.SectionStackSection.addProperties({
                baseStyle:"SectionStackSection"
            });
        }

        if (isc.MiniNavControl) {
            isc.MiniNavControl.addProperties({
                src: isc.Browser.isIPhone ? "[SKIN]/miniNav.svg" : "[SKIN]/miniNav~2.png",
                showDisabled: true,
                showDown: false,
                upButtonSrc: null,
                downButtonSrc: null
            });
        }
        if (isc.NavigationBar) {
            isc.NavigationBar.addProperties({
                leftButtonIcon: "[SKINIMG]NavigationBar/back_arrow~2.png"
            });
            isc.NavigationBar.changeDefaults("leftButtonDefaults", {
                iconWidth: 14,
                iconHeight: 24,
                iconSpacing: 7,
                showDown: false,
                showRTLIcon: true
            });
            isc.NavigationBar.changeDefaults("titleLabelDefaults", {
                margin: 0
            });

            if (isc.Browser.isIPhone || isc.Browser.isIPad) {
                isc.NavigationBar.addProperties({
                    leftButtonIcon: "[SKINIMG]NavigationBar/back_arrow.svg"
                });
            }
        }
        if (isc.NavigationButton) {
            isc.NavigationButton.addProperties({
                padding: 0
            });
        }

        if (isc.HiliteRule) {
            isc.HiliteRule.changeDefaults("hiliteFormDefaults", {
                colWidths: [60, 60, 60, 60, 60, 43]
            });
        }

        if (isc.Menu) {
            isc.Menu.addProperties({
                styleName:"menuBody",
                checkmarkDisabledImage:{src:"[SKIN]check_Disabled.png", width:16, height:16},
                checkmarkImage:{src:"[SKIN]check.png", width:16, height:16},
                submenuDisabledImage:{src:"[SKIN]menu_left_disabled.png", height:16, width:16},
                submenuImage:{src:"[SKIN]menu_left.png", height:16, width:16},
                shadowDepth:0,
                shadowOffset:0,
                showShadow:false,
                cellHeight:null,
            });
        }

        if (isc.ListGrid) {
            isc.ListGrid.addProperties({
                alternateRecordStyles : true,
                alternateBodyStyleName : null,
                editFailedCSSText:"color:FF6347;",
                errorIconSrc : "[SKINIMG]actions/exclamation.png",
                backgroundColor:null,
                headerBarStyle:"headerBar",
                headerBaseStyle : "headerButton",
                headerHeight:25,
                headerButtonProperties:{iconWidth:16,iconHeight:16,border:null},
                headerBackgroundColor:null,
                showHeaderMenuButton:true,
                headerMenuButtonConstructor:"HeaderMenuButton",
                headerMenuButtonWidth:20,
                headerMenuButtonIconHeight:16,
                headerMenuButtonIconWidth:16,

                bodyBackgroundColor:null,
                bodyStyleName:"gridBody",
                tallBaseStyle: "tallCell",
                cellHeight:22,
                normalCellHeight:22,
                summaryRowHeight: 24, // should be cellHeight + top/bottom borders

                groupLeadingIndent : 1,
                groupIconPadding : 3,
                groupIcon: "[SKINIMG]/ListGrid/group.gif",
                groupIconWidth:16,
                groupIconHeight:16,

                summaryRowStyle:"gridSummaryCell",
                groupSummaryStyle:"groupSummaryCell",

                sortArrowMenuButtonSpaceOffset:9,
                sortNumeralMenuButtonSpaceOffset:9,
                sortAscendingImage:{src:"[SKINIMG]ListGrid/sort_ascending.gif", width:9, height:5},
                sortDescendingImage:{src:"[SKINIMG]ListGrid/sort_descending.gif", width:9, height:5},
                
                expansionFieldTrueImage : "[SKINIMG]/ListGrid/row_expanded.gif",
                expansionFieldFalseImage: "[SKINIMG]/ListGrid/row_collapsed.gif",
                expansionFieldImageWidth : 16,
                expansionFieldImageHeight : 16,

                booleanTrueImage: "sprite:cssClass:checkboxTrue;size:16,16",
                booleanFalseImage: "sprite:cssClass:checkboxFalse;size:16,16",
                booleanPartialImage: "sprite:cssClass:checkboxPartial;size:16,16",
                printBooleanBaseStyle: "printCheckbox",
            	printBooleanTrueImage: "[SKINIMG]/DynamicForm/cb-checked-normal.png",
            	printBooleanFalseImage: "[SKINIMG]/DynamicForm/cb-uncheck-normal.png",
            	printBooleanPartialImage: "[SKINIMG]/DynamicForm/cb-anything-normal.png",
            	checkboxFieldImageHeight:18,
                checkboxFieldImageWidth:18,
                booleanImageWidth:18,
                booleanImageHeight:18,
                
                showValueIconOver: false,
                showValueIconFocused: false
            });
            isc.ListGrid.changeDefaults("summaryRowDefaults", {
                bodyBackgroundColor:null,
                bodyStyleName:"summaryRowBody"
            });

            isc.ListGrid.changeDefaults("sorterDefaults", {
                baseStyle:"sorterButton",
                showRollOver:false
            });
        }

        if (isc.TreeGrid) {
            isc.TreeGrid.addProperties({
                alternateRecordStyles : false,
                tallBaseStyle: "treeTallCell",
                normalBaseStyle: "treeCell",
                applyRowNumberStyle:false,
                openerIconSize: 16,
                sortAscendingImage:{src:"[SKINIMG]ListGrid/sort_ascending.gif", width:9, height:5},
                sortDescendingImage:{src:"[SKINIMG]ListGrid/sort_descending.gif", width:9, height:5},
                backgroundColor:null,
                bodyBackgroundColor:null,
                bodyStyleName:"treeBody",
                
                booleanTrueImage: "sprite:cssClass:checkboxTrue;size:16,16",
                booleanFalseImage: "sprite:cssClass:checkboxFalse;size:16,16",
                booleanPartialImage: "sprite:cssClass:checkboxPartial;size:16,16",
                printBooleanBaseStyle: "printCheckbox",
            	printBooleanTrueImage: "[SKINIMG]/DynamicForm/cb-checked-normal.png",
            	printBooleanFalseImage: "[SKINIMG]/DynamicForm/cb-uncheck-normal.png",
            	printBooleanPartialImage: "[SKINIMG]/DynamicForm/cb-anything-normal.png",
            	checkboxFieldImageHeight:18,
                checkboxFieldImageWidth:18,
                booleanImageWidth:18,
                booleanImageHeight:18
            })
        }

        if (isc.TabSet) {
            isc.TabSet.addProperties({
                useSimpleTabs : true,
                closeTabIcon:"[SKIN]/TabSet/close.gif",
                closeTabIconSize:11,
                scrollerSrc:null,
                pickerButtonSrc:"[SKIN]picker.gif",
                pickerButtonSize:16,
                scrollerButtonSize:0,
                touchPickerButtonSize:16,
                tabBarThickness:26,
                iconOrientation:"right",
                showScrollerRollOver: false,
                tabPickerHMarginSize: 1,
            	tabPickerVMarginSize: 1,
            	getTabPickerSrc: function () {
                	return "sprite:cssClass:tabPicker" + (this.tabPicker ? this.tabPicker.getStateSuffix() : "") + this.tabBarPosition;
            	}
            });
			isc.TabSet.changeDefaults("tabPickerDefaults", {
            	baseStyle: "tabPicker",
            	statelessImage: false,
            	redrawOnStateChange: false
        	});
            // In Netscape Navigator 4.7x, set the backgroundColor directly since the css
            // background colors are not reliable
            if (isc.Browser.isNav) {
                isc.TabSet.addProperties({paneContainerDefaults:{
                  // backgroundColor:"#1C2430"
                }});
            }

            isc.TabBar.addProperties({
                leadingMargin:0,
                membersMargin:0,

                // keep the tabs from reaching the curved edge of the pane (regardless of align)
                layoutStartMargin:0,
                layoutEndMargin:0,

                styleName:"tabBar",
                leftStyleName:"tabBarLeft",
                topStyleName:"tabBarTop",
                rightStyleName:"tabBarRight",
                bottomStyleName:"tabBarBottom",

                baseLineConstructor:"Canvas",
                baseLineProperties : {
                    backgroundColor: null,
                    overflow:"hidden"
                },
                baseLineThickness:1
            });
        }

        if (isc.TabBar) {
            isc.TabBar.changeDefaults("baseLineDefaults", {
                _constructor: "Canvas",
                backgroundColor: null,
                overflow:"hidden",
                styleName: "tabBarBaseLine"
            });
        }

        if (isc.ImgTab) isc.ImgTab.addProperties({capSize:7});

        if (isc.Window) {
            isc.Window.addProperties({
                showHeaderBackground: false,
                showFooter:false,
                membersMargin : 0,
                modalMaskOpacity : 20,
                backgroundColor:null,
                bodyColor: null,
                bodyStyle:"windowBody",
                styleName:"windowBackground"
            });
            isc.Window.changeDefaults("headerDefaults", {
                height:26,
                layoutMargin:2,
                membersMargin:2
            });
            isc.Window.changeDefaults("resizerDefaults", {
                src:"[SKIN]/Window/resizer.gif"
            });
            isc.Window.changeDefaults("headerIconDefaults", {
                width:15,
                height:15,
                src:"[SKIN]/Window/headerIcon.gif"
            });
            isc.Window.changeDefaults("restoreButtonDefaults", {
                src:"[SKIN]/headerIcons/cascade.gif",
                showRollOver:true,
                showDown:false,
                width:15,
                height:15
            });
            isc.Window.changeDefaults("closeButtonDefaults", {
                src:"[SKIN]/headerIcons/close.gif",
                showRollOver:true,
                showDown:false,
                width:15,
                height:15
            });
            isc.Window.changeDefaults("maximizeButtonDefaults", {
                src:"[SKIN]/headerIcons/maximize.gif",
                showRollOver:true,
                showDown:false,
                width:15,
                height:15
            });
            isc.Window.changeDefaults("minimizeButtonDefaults", {
                src:"[SKIN]/headerIcons/minimize.gif",
                showRollOver:true,
                showDown:false,
                width:15,
                height:15
            });
            isc.Window.changeDefaults("toolbarDefaults", {
                buttonConstructor: "IButton"
            }) ;

            if (isc.ColorPicker) {
                isc.ColorPicker.addProperties({
                    layoutMargin:2
                })
            }
        }

        if (isc.Dialog) {
            isc.Dialog.addProperties({
                bodyColor: null
            });
        }
        if (isc.Dialog.Warn) {
            if (isc.Browser.isTouch) isc.Dialog.Warn.showModalMask = true;
        }
        if (isc.Dialog.Prompt) {
            if (isc.Browser.isTouch) isc.Dialog.Prompt.showModalMask = true;
        }

        // Dynamic form skinning
        if (isc.FormItem) {
            isc.FormItem.addProperties({
                defaultIconSrc:"[SKIN]/DynamicForm/default_formItem_icon.gif",
                errorIconSrc : "[SKINIMG]actions/exclamation.png",
                iconHeight:16,
                iconWidth:16,
                iconVAlign:"middle",
                pickerIconWidth:16,
                pickerIconHeight:16,
                valueIconSize:16
            });
        }

        if (isc.CheckboxItem) {
            isc.CheckboxItem.addProperties({
                booleanBaseStyle:"checkbox",
                checkedImage: "[SKIN]/DynamicForm/check.png",
                uncheckedImage: "[SKIN]/blank.gif",
                unsetImage: "[SKIN]/blank.gif",
                partialSelectedImage: "[SKIN]/blank.gif",
                showValueIconOver: false,
                showValueIconFocused: false
            });
        }

        if (isc.TextItem) {
            isc.TextItem.addProperties({
                height:24,
                showFocused: true
            });
        }

        if (isc.TextAreaItem) {
            isc.TextAreaItem.addProperties({
                showCustomScrollbars:true,
                showFocused: true
            });
        }

        if (isc.SelectItem) {
            isc.SelectItem.addProperties({
                textBoxStyle:"selectItemText",
                showFocusedPickerIcon:false,
                pickerIconSrc:"[SKIN]/pickers/menu_down.png",
                height:24,
                pickerIconWidth:16,
                pickerIconHeight:16,
                valueIconSize:16
            });
        }

        if (isc.ComboBoxItem) {
            isc.ComboBoxItem.addProperties({
                controlStyle:"selectItemControl",
                textBoxStyle:"selectItemText",
                pendingTextBoxStyle:"comboBoxItemPendingText",
                showFocusedPickerIcon:false,
                pickerIconSrc:"[SKIN]/pickers/menu_down.png",
                height:24,
                pickerIconWidth:16,
                pickerIconHeight:16,
                pickerIconSize:16
            });
        }

        // used by SelectItem and ComboBoxItem for picklist
        if (isc.ScrollingMenu) {
            isc.ScrollingMenu.addProperties({
                showShadow:false,
                shadowDepth:0
            });
        }

        if (isc.ColorItem) {
            isc.ColorItem.addProperties({
                showEmptyPickerIcon: true
            });
        }
        if (isc.SpinnerItem) {
            isc.SpinnerItem.addProperties({
                controlStyle:"selectItemControl",
                textBoxStyle:"selectItemText",
                height:24
            });
            isc.SpinnerItem.changeDefaults("increaseIconDefaults", {
                baseStyle:"spinnerIncreaseIcon",
                width:16,
                height:11,
                showFocused:true,
                showDown:false,
                imgOnly:true,
                src:"[SKIN]/DynamicForm/spinner_control_increase.png"
            });
            isc.SpinnerItem.changeDefaults("decreaseIconDefaults", {
                baseStyle:"spinnerDecreaseIcon",
                width:16,
                height:11,
                showFocused:true,
                showDown:false,
                imgOnly:true,
                src:"[SKIN]/DynamicForm/spinner_control_decrease.png"
            });
            isc.SpinnerItem.changeDefaults("unstackedIncreaseIconDefaults", {
                src:"[SKIN]/DynamicForm/spinner_control_increase.png",
                baseStyle: "unstackedSpinnerItemIncrease",
                showFocused:true,
                showDown:false,
                height:20
            });
            isc.SpinnerItem.changeDefaults("unstackedDecreaseIconDefaults", {
                src:"[SKIN]/DynamicForm/spinner_control_decrease.png",
                baseStyle: "unstackedSpinnerItemIncrease",
                showFocused:true,
                showDown:false,
                height:20
            });
        }
        if (isc.PopUpTextAreaItem) {
            isc.PopUpTextAreaItem.addProperties({
                popUpIconSrc: "[SKIN]/DynamicForm/text_control.gif",
                popUpIconWidth:16,
                popUpIconHeight:16,
                styleName:"popUpTextArea",
                baseStyle:"popUpTextArea",
                textBoxStyle:"popUpTextArea"
            });
        }

        if (isc.ToolbarItem && isc.IAutoFitButton) {
            isc.ToolbarItem.addProperties({
                buttonConstructor:isc.IAutoFitButton,
                buttonProperties: {
                    autoFitDirection: isc.Canvas.HORIZONTAL
                }
            });
        }
        if (isc.DateItem) {
            isc.DateItem.addProperties({
                height:24,
                pickerIconWidth:16,
                pickerIconHeight:16,
                pickerIconSrc:"[SKIN]/DynamicForm/date_control.png"
            });
        }
        if (isc.DateRangeDialog) {
            isc.DateRangeDialog.changeDefaults("headerIconProperties", {
                src: "[SKIN]/DynamicForm/date_control.png"
            });
        }
        if (isc.MiniDateRangeItem) {
            isc.MiniDateRangeItem.addProperties({"pickerIconSrc": "[SKIN]/DynamicForm/date_control.png"});
        }
        if (isc.RelativeDateItem) {
            isc.RelativeDateItem.changeDefaults("pickerIconDefaults", {
                neverDisable: false,
                src: "[SKIN]/DynamicForm/date_control.png"
            });
        }

        if (isc.DateChooser) {
            isc.DateChooser.addProperties({
                styleName: "menuBody",
                showDoubleYearIcon:false,
                skinImgDir:"images/DateChooser/",
                headerStyle:"dateChooserButton",
                weekendHeaderStyle:"dateChooserWeekendButton",
                baseNavButtonStyle:"dateChooserNavButton",
                baseWeekdayStyle:"dateChooserWeekday",
                baseWeekendStyle:"dateChooserWeekend",
                baseBottomButtonStyle:"dateChooserBottomButton",
                alternateWeekStyles:false,
                todayButtonHeight:20,
                edgeCenterBackgroundColor:null,
                backgroundColor:null,
                nextMonthIconHeight:15,
                nextMonthIconWidth:15,
                nextYearIconHeight:15,
                nextYearIconWidth:15,
                prevMonthIconHeight:15,
                prevMonthIconWidth:15,
                prevYearIconHeight:15,
                prevYearIconWidth:15
            });
        }
        isc.DateChooser.changeDefaults("navigationLayoutDefaults", { height:42, width:"100%" });

        if (isc.ToolStrip) {
            isc.ToolStrip.addProperties({
                height:30,
                defaultLayoutAlign:"center"
            });
            isc.ToolStripResizer.addProperties({
                // backgroundColor:"#1C2430"
            });

            isc.ToolStrip.changeDefaults("formWrapperDefaults",{cellPadding:3});
        }

        if (isc.ToolStripMenuButton) {

            isc.overwriteClass("ToolStripMenuButton", "MenuButton").addProperties({
                showTitle:false,
                showRollOver:true,
                showDown:true,
                labelVPad:0,
                iconWidth:16,
                iconHeight: 16,
                iconSpacing:0,
                menuButtonImage:"[SKIN]menu_down.png",
                menuButtonImageUp:"[SKIN]menu_up.png",
                autoFit:true,
                baseStyle : "toolbarButton",
                height:24
            });
        }

        if (isc.ToolStripButton) {
            isc.overwriteClass("ToolStripButton", "Button").addProperties({
                showTitle:false,
                title:null,
                showRollOver:true,
                showDown:true,
                labelVPad:0,
                //labelHPad:7,
                iconSpacing:2,
                autoFit:true,
                baseStyle : "toolbarButton",
                height:24
            });
        }

        // Default EdgedCanvas skinning (for any canvas where showEdges is set to true)
        if (isc.EdgedCanvas) {
            isc.EdgedCanvas.addProperties({
                edgeSize:6,
                edgeImage: "[SKINIMG]edges/edge.png"
            });
        }

        if (isc.Slider) {
            isc.Slider.addProperties({
                thumbThickWidth:17,
                thumbThinWidth:11,
                showActiveTrack:false,
                trackSrc:null,
                trackWidth:0,
                trackCapSize:0
            });
            isc.Slider.changeDefaults("rangeLabelDefaults", {
                showDisabled: true
            });
            isc.Slider.changeDefaults("valueLabelDefaults", {
                showDisabled: true
            });
            isc.Slider.changeDefaults("trackDefaults", {
                showDisabled: false
            });
        }

        if (isc.TileGrid) {
            isc.TileGrid.addProperties({
                valuesShowRollOver: true,
                styleName:null,
                showEdges:false
            });
        }

        if (isc.Calendar) {
            isc.Calendar.changeDefaults("datePickerButtonDefaults", {
                showDown:false,
                showOver : false,
                src:"[SKIN]/DynamicForm/date_control.png"
            });

            isc.Calendar.changeDefaults("controlsBarDefaults", {
                height:10,
                layoutBottomMargin :10
            });

            isc.Calendar.changeDefaults("eventCanvasCloseButtonDefaults", {
                src:"[SKIN]/headerIcons/close.gif"
            });
        }

        if (isc.Hover) {
            isc.addProperties(isc.Hover.hoverCanvasDefaults, {
                showShadow:false,
                shadowDepth:0
            })
        }

        //indicate type of media used for various icon types
        isc.pickerImgType = "gif";
        isc.transferImgType = "png";
        isc.headerImgType = "gif";

        // -------------------------------------------
        // Printing
        // -------------------------------------------
        if (isc.PrintWindow) {
            isc.PrintWindow.changeDefaults("printButtonDefaults", {
                height: 24
            });
        }

        if (isc.SplitPane) {
            isc.SplitPane.changeDefaults("backButtonDefaults", {
                icon: "[SKINIMG]NavigationBar/back_arrow~2.png",
                iconWidth: 14,
                iconHeight: 24,
                iconSpacing: 7,
                showDown: false,
                showRTLIcon: true
            });

            if (isc.Browser.isIPhone || isc.Browser.isIPad) {
                isc.SplitPane.changeDefaults("backButtonDefaults", {
                    icon: "[SKINIMG]NavigationBar/back_arrow.svg"
                });
            }
        }
    //----------------------------------------
    // Progressbar
    //----------------------------------------
    if (isc.Progressbar) {
        isc.Progressbar.addProperties({
            backgroundColor: null,
            useCssStyles: true,
            titleStyle: "progressbarTitle"
        })
    }
    
        //----------------------------------------
    if (isc.DrawLabel) {
			isc.DrawLabel.addProperties({
            	lineColor: currentSkin.color_default
        })
    }
        // ------------------------------------------
        // 22) FacetChart
        // -------------------------------------------
        if (isc.FacetChart) {
            // 小视图
            isc.FacetChart.changeDefaults("zoomSelectionChartDefaults", {
                backgroundColor: currentSkin.backgroundColor,
                lineColor: currentSkin.borderColor
            });
            isc.FacetChart.changeDefaults("chartRectProperties", {
                fillGradient: {
                    x1: '0%',
                    y1: '100%',
                    x2: '100%',
                    y2: '0%',
                    colorStops: [{
                        color: currentSkin.backgroundColor,
                        offset: 0.0
                    },{
                        color: currentSkin.backgroundColor,
                        offset: 0.5
                    },{
                        color: currentSkin.backgroundColor,
                        offset: 0.9
                    },{
                        color: currentSkin.backgroundColor,
                        offset: 1.0
                    }]
                }
            });
            isc.FacetChart.addProperties({
                // General Chart changes
                padding: 0,
                titleProperties: {
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "bold",
                    lineColor: currentSkin.color_default
                },
                titleBackgroundProperties: {
                    lineWidth: 0,
                    lineOpacity: 0
                },
                dataAxisLabelProperties: {
                    fontSize: 11,
                    fontFamily: "Arial",
                    lineColor: currentSkin.color_default
                },
                dataLabelProperties: {
                    fontFamily:"Arial",
                    fontSize:10,
                    fontWeight:"normal",
                    fontStyle:"normal",
                    lineColor: currentSkin.color_default
                },
                gradationLabelProperties: {
                    fontFamily: "Tahoma",
                    fontSize: 10,
                    fontWeight: "normal",
                    fontStyle: "normal",
                    lineColor: currentSkin.color_default
                },
                doughnutHoleProperties : {
                    lineWidth:0,
                    fillColor: currentSkin.backgroundColor
                },
                // 上下标题
                titleAlign: "left",
                titlePadding: 10,
                drawTitleBackground: true,
                drawTitleBoundary: false,
                titleBoundaryProperties: {
                    lineColor: currentSkin.borderColor,
                    lineWidth: 1
                },
                titleRectHeight: 28,
                legendAlign: "right",
                drawLegendBoundary: false,
                legendBoundaryProperties: {
                    lineColor: currentSkin.borderColor,
                    lineWidth: 1
                },
                legendRectProperties : {
                    lineWidth:1,
                    lineOpacity:0,
                    lineColor: currentSkin.borderColor
                },
                legendLabelProperties: {
                    fontFamily:"Arial",
                    fontSize:10,
                    fontWeight:"normal",
                    fontStyle:"normal",
                    cursor:"pointer",
                    lineColor: currentSkin.color_default
                },
                legendPadding:12,
                // Just replace the border with a white border to give the impression there isn't one
                legendSwatchProperties : {
                    lineWidth:0,
                    lineColor: currentSkin.backgroundColor
                },
                showLegendRect:true,
                // embed the gradation labels spacing properly
                gradationLabelPadding:10,
                chartRectMargin: 15,
                // Change the Background Banding Color
                backgroundBandProperties : {
                    excludeFromQuadTree:true,
                    lineOpacity: 0,
                    fillColor: currentSkin.backgroundColor
                },
                gradationLineProperties: {
                    lineWidth: 0,
                    lineColor: currentSkin.borderColor
                },
                gradationZeroLineProperties: {
                    lineWidth: 1,
                    lineColor: currentSkin.borderColor
                },
                // Don't use color gradients, shadows or borders around the chart elements
                showShadows: false,
                useAutoGradients:false, //
                barProperties: {
                    lineColor: null,
                    lineWidth:1
                },
                // Pad the Y Axis Data Label 3px from the outer container border
                yAxisLabelPadding : 3,
                matchBarChartDataLineColor: true,
                brightenPercent: 50,
                brightenAllOnHover: true
            });
        }

        isc.Class.modifyFrameworkDone();

    }
}


// call the loadSkin routine
isc.loadSkin();
