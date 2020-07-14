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
            /** 编辑视图-期间类型 */
            export class PeriodCategoryEditView extends ibas.BOEditView implements app.IPeriodCategoryEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 添加过账期间事件 */
                addPostingPeriodEvent: Function;
                /** 移除过账期间事件 */
                removePostingPeriodEvent: Function;
                /** 添加过账期间项目事件 */
                addPostingPeriodItemEvent: Function;
                /** 移除过账期间项目事件 */
                removePostingPeriodItemEvent: Function;

                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.leftForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_periodcategory_name") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "/name",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 10
                                }),
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_periodcategory_status") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: bo.emPeriodStatus
                            }).bindProperty("bindingValue", {
                                path: "/status",
                                type: new sap.extension.data.Enum({
                                    enumType: bo.emPeriodStatus
                                }),
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_periodcategory_startdate") }),
                            new sap.extension.m.DatePicker("", {
                            }).bindProperty("bindingValue", {
                                path: "/startDate",
                                type: new sap.extension.data.Date(),
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_periodcategory_enddate") }),
                            new sap.extension.m.DatePicker("", {
                            }).bindProperty("bindingValue", {
                                path: "/endDate",
                                type: new sap.extension.data.Date(),
                            }),
                        ]
                    });
                    this.rightList = new sap.extension.m.List("", {
                        chooseType: ibas.emChooseType.NONE,
                        mode: sap.m.ListMode.None,
                        growing: false,
                    });
                    return new sap.extension.m.Page("", {
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
                            new sap.m.SplitContainer("", {
                                masterPages: [
                                    new sap.m.Page("", {
                                        showHeader: false,
                                        content: [
                                            this.leftForm
                                        ]
                                    }),
                                ],
                                detailPages: [
                                    new sap.m.Page("", {
                                        showHeader: false,
                                        floatingFooter: true,
                                        content: [
                                            new sap.m.Toolbar("", {
                                                content: [
                                                    new sap.m.Button("", {
                                                        type: sap.m.ButtonType.Transparent,
                                                        icon: "sap-icon://navigation-right-arrow",
                                                        press: function (event: sap.ui.base.Event): void {
                                                            let source: any = event.getSource();
                                                            if (source instanceof sap.m.Button) {
                                                                if (source.getIcon() === "sap-icon://navigation-right-arrow") {
                                                                    source.setIcon("sap-icon://navigation-down-arrow");
                                                                    ibas.queues.execute(that.rightList.getItems(),
                                                                        (item, next) => {
                                                                            if (item instanceof sap.m.CustomListItem) {
                                                                                let panel: any = item.getContent()[0];
                                                                                if (panel instanceof sap.m.Panel) {
                                                                                    setTimeout(() => {
                                                                                        panel.setExpanded(true);
                                                                                        next();
                                                                                    }, 70);
                                                                                    return;
                                                                                }
                                                                            }
                                                                            next();
                                                                        },
                                                                    );
                                                                } else {
                                                                    source.setIcon("sap-icon://navigation-right-arrow");
                                                                    ibas.queues.execute(that.rightList.getItems(),
                                                                        (item, next) => {
                                                                            if (item instanceof sap.m.CustomListItem) {
                                                                                let panel: any = item.getContent()[0];
                                                                                if (panel instanceof sap.m.Panel) {
                                                                                    setTimeout(() => {
                                                                                        panel.setExpanded(false);
                                                                                        next();
                                                                                    }, 70);
                                                                                    return;
                                                                                }
                                                                            }
                                                                            next();
                                                                        },
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    }),
                                                    new sap.m.Title("", {
                                                        text: ibas.i18n.prop("bo_postingperiod"),
                                                    }),
                                                    new sap.m.ToolbarSpacer(""),
                                                    new sap.m.MenuButton("", {
                                                        buttonMode: sap.m.MenuButtonMode.Split,
                                                        useDefaultActionOnly: true,
                                                        menuPosition: sap.ui.core.Popup.Dock.EndBottom,
                                                        text: ibas.i18n.prop("shell_data_add"),
                                                        width: "6rem",
                                                        menu: new sap.m.Menu("", {
                                                            items: [
                                                                new sap.m.MenuItem("", {
                                                                    text: ibas.i18n.prop("accounting_postingperiod_12_months"),
                                                                    press: function (): void {
                                                                        that.fireViewEvents(that.addPostingPeriodEvent, "12months");
                                                                    }
                                                                }),
                                                                new sap.m.MenuItem("", {
                                                                    text: ibas.i18n.prop("accounting_postingperiod_4_quarters"),
                                                                    press: function (): void {
                                                                        that.fireViewEvents(that.addPostingPeriodEvent, "4quarters");
                                                                    }
                                                                })
                                                            ],
                                                        }),
                                                        defaultAction: function (): void {
                                                            that.fireViewEvents(that.addPostingPeriodEvent);
                                                        }
                                                    }),
                                                ]
                                            }),
                                            this.rightList,
                                        ],
                                    }),
                                ],
                            })
                        ]
                    });
                }

                private leftForm: sap.ui.layout.form.SimpleForm;
                private rightList: sap.extension.m.List;

                /** 显示数据 */
                showPeriodCategory(data: bo.PeriodCategory): void {
                    this.leftForm.setModel(new sap.extension.model.JSONModel(data));
                }
                /** 显示过账期间 */
                showPostingPeriods(datas: bo.PostingPeriod[]): void {
                    this.rightList.setBusy(true);
                    this.rightList.destroyItems();
                    let that: this = this;
                    for (let data of datas) {
                        let listItem: sap.m.CustomListItem = new sap.m.CustomListItem("", {
                            content: [
                                new sap.m.Panel("", {
                                    expandable: true,
                                    expanded: false,
                                    backgroundDesign: sap.m.BackgroundDesign.Translucent,
                                    accessibleRole: sap.m.PanelAccessibleRole.Form,
                                    headerToolbar: new sap.m.Toolbar("", {
                                        content: [
                                            new sap.extension.m.Input("", {
                                            }).bindProperty("bindingValue", {
                                                path: "/name",
                                                type: new sap.extension.data.Alphanumeric({
                                                    maxLength: 10
                                                })
                                            }),
                                            new sap.m.ToolbarSpacer(""),
                                            new sap.extension.m.EnumSelect("", {
                                                enumType: bo.emPeriodStatus
                                            }).bindProperty("bindingValue", {
                                                path: "/status",
                                                type: new sap.extension.data.Enum({
                                                    enumType: bo.emPeriodStatus
                                                }),
                                            }),
                                            new sap.m.ToolbarSpacer(""),
                                            new sap.m.ToolbarSeparator(""),
                                            new sap.m.Button("", {
                                                type: sap.m.ButtonType.Transparent,
                                                icon: "sap-icon://delete",
                                                press: function (event: sap.ui.base.Event): void {
                                                    let source: any = event.getSource();
                                                    if (source instanceof sap.m.Button) {
                                                        that.fireViewEvents(that.removePostingPeriodEvent, data);
                                                    }
                                                }
                                            }),
                                        ]
                                    }),
                                    content: [
                                        new sap.ui.layout.cssgrid.CSSGrid("", {
                                            gridTemplateRows: "1fr",
                                            gridTemplateColumns: "40% 60%",
                                            gridGap: "1rem",
                                            items: [
                                                new sap.ui.layout.form.SimpleForm("", {
                                                    editable: true,
                                                    content: [
                                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_order") }),
                                                        new sap.extension.m.Input("", {
                                                            editable: false,
                                                        }).bindProperty("bindingValue", {
                                                            path: "/order",
                                                            type: new sap.extension.data.Numeric()
                                                        }),
                                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_startdate") }),
                                                        new sap.extension.m.DatePicker("", {
                                                        }).bindProperty("bindingValue", {
                                                            path: "/startDate",
                                                            type: new sap.extension.data.Date()
                                                        }),
                                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_postingperiod_enddate") }),
                                                        new sap.extension.m.DatePicker("", {
                                                        }).bindProperty("bindingValue", {
                                                            path: "/endDate",
                                                            type: new sap.extension.data.Date()
                                                        }),
                                                    ]
                                                }),
                                                new sap.ui.layout.form.SimpleForm("", {
                                                    editable: true,
                                                    content: [
                                                        new sap.extension.table.DataTable("", {
                                                            toolbar: new sap.m.Toolbar("", {
                                                                content: [
                                                                    new sap.m.ToolbarSpacer(""),
                                                                    new sap.m.Button("", {
                                                                        text: ibas.i18n.prop("shell_data_add"),
                                                                        type: sap.m.ButtonType.Transparent,
                                                                        icon: "sap-icon://add",
                                                                        press: function (): void {
                                                                            let table: any = this.getParent().getParent();
                                                                            if (table instanceof sap.extension.table.DataTable) {
                                                                                that.fireViewEvents(that.addPostingPeriodItemEvent, data);
                                                                            }
                                                                        }
                                                                    }),
                                                                    new sap.m.Button("", {
                                                                        text: ibas.i18n.prop("shell_data_remove"),
                                                                        type: sap.m.ButtonType.Transparent,
                                                                        icon: "sap-icon://less",
                                                                        press: function (): void {
                                                                            let table: any = this.getParent().getParent();
                                                                            if (table instanceof sap.extension.table.DataTable) {
                                                                                that.fireViewEvents(that.removePostingPeriodItemEvent, table.getSelecteds());
                                                                            }
                                                                        }
                                                                    })
                                                                ]
                                                            }),
                                                            visibleRowCount: sap.extension.table.visibleRowCount(4),
                                                            rows: {
                                                                path: "/postingPeriodItems",
                                                                filters: [
                                                                    new sap.ui.model.Filter("isDeleted", sap.ui.model.FilterOperator.NE, true)
                                                                ]
                                                            },
                                                            columns: [
                                                                new sap.extension.table.DataColumn("", {
                                                                    label: ibas.i18n.prop("bo_postingperioditem_documenttype"),
                                                                    template: new sap.extension.m.RepositoryInput("", {
                                                                        repository: initialfantasy.bo.BORepositoryInitialFantasy,
                                                                        dataInfo: {
                                                                            type: initialfantasy.bo.BOInformation,
                                                                            key: initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME,
                                                                            text: initialfantasy.bo.BOInformation.PROPERTY_DESCRIPTION_NAME
                                                                        },
                                                                        editable: false,
                                                                    }).bindProperty("bindingValue", {
                                                                        path: "documentType",
                                                                        type: new sap.extension.data.Alphanumeric({
                                                                            maxLength: 30
                                                                        }),
                                                                    }),
                                                                    width: "20rem",
                                                                }),
                                                                new sap.extension.table.DataColumn("", {
                                                                    label: ibas.i18n.prop("bo_postingperioditem_status"),
                                                                    template: new sap.extension.m.EnumSelect("", {
                                                                        enumType: bo.emPeriodStatus
                                                                    }).bindProperty("bindingValue", {
                                                                        path: "status",
                                                                        type: new sap.extension.data.Enum({
                                                                            enumType: bo.emPeriodStatus
                                                                        }),
                                                                    }),
                                                                }),
                                                            ],
                                                        })
                                                    ]
                                                }),
                                            ]
                                        }),
                                    ],
                                })
                            ],
                            type: sap.m.ListType.Inactive
                        });
                        listItem.setModel(new sap.extension.model.JSONModel(data));
                        this.rightList.addItem(listItem);
                    }
                    this.rightList.setBusy(false);
                }
                /** 显示过账期间项目 */
                showPostingPeriodItems(data: bo.PostingPeriod): void {
                    for (let item of this.rightList.getItems()) {
                        let model: any = item.getModel();
                        if (model instanceof sap.extension.model.JSONModel) {
                            if (model.getData() === data) {
                                model.refresh(true);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
