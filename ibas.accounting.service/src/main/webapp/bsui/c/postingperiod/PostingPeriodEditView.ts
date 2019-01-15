/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace ui {
        export namespace c {
            /** 编辑视图-过账期间 */
            export class PostingPeriodEditView extends ibas.BOEditView implements app.IPostingPeriodEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 选择业务对象事件 */
                chooseBusinessObjectEvent: Function;
                /** 添加过账期间-项目事件 */
                addPostingPeriodItemEvent: Function;
                /** 删除过账期间-项目事件 */
                removePostingPeriodItemEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.tablePostingPeriodItem = new sap.ui.table.Table("", {
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.ToolbarSpacer("", {}),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_add"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://add",
                                    press: function (): void {
                                        that.fireViewEvents(that.addPostingPeriodItemEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://less",
                                    press: function (): void {
                                        that.fireViewEvents(that.removePostingPeriodItemEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.PostingPeriodItem>(that.tablePostingPeriodItem)
                                        );
                                    }
                                })
                            ]
                        }),
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        visibleRowCount: 5,
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_postingperioditem_businessobject"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    showValueHelp: true,
                                    valueHelpRequest: function (): void {
                                        that.fireViewEvents(that.chooseBusinessObjectEvent,
                                            // 获取当前对象
                                            this.getBindingContext().getObject()
                                        );
                                    }
                                }).bindProperty("value", {
                                    path: "businessObject"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_postingperioditem_status"),
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(bo.emPeriodStatus),
                                }).bindProperty("selectedKey", {
                                    path: "status",
                                    type: "sap.ui.model.type.Integer",
                                })
                            }),
                        ]
                    });
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("accounting_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_objectkey") }),
                            new sap.m.Input("", {
                                editable: false,
                            }).bindProperty("value", {
                                path: "objectKey",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_name") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text,
                            }).bindProperty("value", {
                                path: "name"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_category") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text,
                            }).bindProperty("value", {
                                path: "category"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_status") }),
                            new sap.m.Select("", {
                                items: openui5.utils.createComboBoxItems(bo.emPeriodStatus),
                            }).bindProperty("selectedKey", {
                                path: "status",
                                type: "sap.ui.model.type.Integer",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_postingdatefrom") }),
                            new sap.m.DatePicker("", {
                                valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                            }).bindProperty("dateValue", {
                                path: "postingDateFrom",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_postingdateto") }),
                            new sap.m.DatePicker("", {
                                valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                            }).bindProperty("dateValue", {
                                path: "postingDateTo",
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_postingperioditem") }),
                            this.tablePostingPeriodItem,
                        ]
                    });
                    this.page = new sap.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_save"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://save",
                                    press: function (): void {
                                        that.fireViewEvents(that.saveDataEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.MenuButton("", {
                                    text: ibas.strings.format("{0}/{1}",
                                        ibas.i18n.prop("shell_data_new"), ibas.i18n.prop("shell_data_clone")),
                                    icon: "sap-icon://create",
                                    type: sap.m.ButtonType.Transparent,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_new"),
                                                icon: "sap-icon://create",
                                                press: function (): void {
                                                    // 创建新的对象
                                                    that.fireViewEvents(that.createDataEvent, false);
                                                }
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_clone"),
                                                icon: "sap-icon://copy",
                                                press: function (): void {
                                                    // 复制当前对象
                                                    that.fireViewEvents(that.createDataEvent, true);
                                                }
                                            }),
                                        ],
                                    })
                                }),
                            ]
                        }),
                        content: [
                            formTop,
                        ]
                    });
                    return this.page;
                }

                private page: sap.m.Page;
                private tablePostingPeriodItem: sap.ui.table.Table;

                /** 改变视图状态 */
                private changeViewStatus(data: bo.PostingPeriod): void {
                    if (ibas.objects.isNull(data)) {
                        return;
                    }
                    // 新建时：禁用删除，
                    if (data.isNew) {
                        if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                            openui5.utils.changeToolbarSavable(<sap.m.Toolbar>this.page.getSubHeader(), true);
                            openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                        }
                    }
                }

                /** 显示数据 */
                showPostingPeriod(data: bo.PostingPeriod): void {
                    this.page.setModel(new sap.ui.model.json.JSONModel(data));
                    this.page.bindObject("/");
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.page, data);
                    // 改变视图状态
                    this.changeViewStatus(data);
                }
                /** 显示数据 */
                showPostingPeriodItems(datas: bo.PostingPeriodItem[]): void {
                    this.tablePostingPeriodItem.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.tablePostingPeriodItem, datas);
                }
            }
        }
    }
}
