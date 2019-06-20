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
            /** 编辑视图-项目 */
            export class ProjectEditView extends ibas.BOEditView implements app.IProjectEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 选择组织 */
                chooseOrganizationEvent: Function;
                /** 选择项目经理 */
                chooseManagerEvent: Function;

                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("accounting_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_project_code") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "code",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }).bindProperty("editable", {
                                path: "series",
                                formatter(data: any): any {
                                    return data > 0 ? false : true;
                                }
                            }),
                            new sap.extension.m.SeriesSelect("", {
                                objectCode: bo.BO_CODE_PROJECT,
                            }).bindProperty("bindingValue", {
                                path: "series",
                                type: new sap.extension.data.Numeric()
                            }).bindProperty("enabled", {
                                path: "isNew",
                                formatter(data: any): any {
                                    return !!data ? true : false;
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_project_name") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "name",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_project_activated") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: ibas.emYesNo
                            }).bindProperty("bindingValue", {
                                path: "activated",
                                type: new sap.extension.data.YesNo()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_project_manager") }),
                            new sap.extension.m.RepositoryInput("", {
                                showValueHelp: true,
                                type: sap.m.InputType.Number,
                                repository: initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY,
                                dataInfo: {
                                    type: ibas.boFactory.classOf(initialfantasy.bo.BO_CODE_USER),
                                    key: "DocEntry",
                                    text: "Name"
                                },
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseManagerEvent);
                                },
                            }).bindProperty("bindingValue", {
                                path: "manager",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_project_organization") }),
                            new sap.extension.m.RepositoryInput("", {
                                showValueHelp: true,
                                repository: initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY,
                                dataInfo: {
                                    type: ibas.boFactory.classOf(initialfantasy.bo.BO_CODE_ORGANIZATION),
                                    key: "Code",
                                    text: "Name"
                                },
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseOrganizationEvent);
                                },
                            }).bindProperty("bindingValue", {
                                path: "organization",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_project_reference1") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "reference1",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_project_reference2") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "reference2",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 200
                                })
                            }),
                            new sap.ui.core.Title("", {}),
                        ]
                    });
                    let formBottom: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                        ]
                    });
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: bo.Project.BUSINESS_OBJECT_CODE,
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
                            formBottom,
                        ]
                    });
                }

                private page: sap.extension.m.Page;

                /** 显示数据 */
                showProject(data: bo.Project): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                }
            }
        }
    }
}
