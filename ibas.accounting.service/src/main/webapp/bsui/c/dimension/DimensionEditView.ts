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
            /** 编辑视图-维度 */
            export class DimensionEditView extends ibas.BOEditView implements app.IDimensionEditView {
                /** 测试源事件 */
                testSourceEvent: Function;
                /** 编辑源事件 */
                editSourceEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("accounting_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_code") }),
                            new sap.m.Input("", {
                                editable: false,
                            }).bindProperty("value", {
                                path: "code",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_name") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text,
                            }).bindProperty("value", {
                                path: "name"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_activated") }),
                            new sap.m.Select("", {
                                items: openui5.utils.createComboBoxItems(ibas.emYesNo),
                            }).bindProperty("selectedKey", {
                                path: "activated",
                                type: "sap.ui.model.type.Integer",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_reference1") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text,
                            }).bindProperty("value", {
                                path: "reference1"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_reference2") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text,
                            }).bindProperty("value", {
                                path: "reference2"
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("accounting_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_sourcetype") }),
                            new sap.m.Select("", {
                                items: openui5.utils.createComboBoxItems(bo.emDimensionSource),
                            }).bindProperty("selectedKey", {
                                path: "sourceType",
                                type: "sap.ui.model.type.Integer",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_source") }),
                            new sap.m.TextArea("", {
                                rows: 6,
                            }).bindProperty("value", {
                                path: "source"
                            }),
                            new sap.m.Label("", {}),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_data_edit"),
                                press: function (): void {
                                    that.fireViewEvents(that.editSourceEvent);
                                }
                            }),
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
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("accounting_test_dimension_source"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://value-help",
                                    press: function (): void {
                                        that.fireViewEvents(that.testSourceEvent);
                                    },
                                    visible: ibas.config.get(ibas.CONFIG_ITEM_DEBUG_MODE, false),
                                }),
                            ]
                        }),
                        content: [
                            new sap.ui.layout.VerticalLayout("", {
                                width: "100%",
                                content: [
                                    formTop,
                                ]
                            })
                        ]
                    });
                    return this.page;
                }

                private page: sap.m.Page;

                /** 改变视图状态 */
                private changeViewStatus(data: bo.Dimension): void {
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
                showDimension(data: bo.Dimension): void {
                    this.page.setModel(new sap.ui.model.json.JSONModel(data));
                    this.page.bindObject("/");
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.page, data);
                    // 改变视图状态
                    this.changeViewStatus(data);
                }
            }
        }
    }
}
