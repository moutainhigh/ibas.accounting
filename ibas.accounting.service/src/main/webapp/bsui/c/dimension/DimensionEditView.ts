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
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "code",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_name") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "name",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_activated") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: ibas.emYesNo
                            }).bindProperty("bindingValue", {
                                path: "activated",
                                type: new sap.extension.data.YesNo()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_reference1") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "reference1",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_reference2") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "reference2",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 200
                                })
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("accounting_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_sourcetype") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: bo.emDimensionSource
                            }).bindProperty("bindingValue", {
                                path: "sourceType",
                                type: new sap.extension.data.Enum({
                                    enumType: bo.emDimensionSource
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_dimension_source") }),
                            new sap.extension.m.TextArea("", {
                                rows: 6,
                            }).bindProperty("bindingValue", {
                                path: "source",
                                type: new sap.extension.data.Alphanumeric()
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
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: bo.Dimension.BUSINESS_OBJECT_CODE,
                        },
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
                            formTop,
                        ]
                    });
                }
                private page: sap.extension.m.Page;

                /** 显示数据 */
                showDimension(data: bo.Dimension): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                }
            }
        }
    }
}
