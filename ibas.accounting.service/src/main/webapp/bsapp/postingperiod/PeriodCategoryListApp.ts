/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        /** 列表应用-期间类型 */
        export class PeriodCategoryListApp extends ibas.BOListApplication<IPeriodCategoryListView, bo.PeriodCategory> {
            /** 应用标识 */
            static APPLICATION_ID: string = "b31ad335-57a0-440d-b94a-1129ecd87424";
            /** 应用名称 */
            static APPLICATION_NAME: string = "accounting_app_periodcategory_list";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.PeriodCategory.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = PeriodCategoryListApp.APPLICATION_ID;
                this.name = PeriodCategoryListApp.APPLICATION_NAME;
                this.boCode = PeriodCategoryListApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.editDataEvent = this.editData;
                this.view.deleteDataEvent = this.deleteData;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
            }
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryAccounting = new bo.BORepositoryAccounting();
                boRepository.fetchPeriodCategory({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.PeriodCategory>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (!that.isViewShowed()) {
                                // 没显示视图，先显示
                                that.show();
                            }
                            if (opRslt.resultObjects.length === 0) {
                                that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_fetched_none"));
                            }
                            that.view.showData(opRslt.resultObjects);
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            /** 新建数据 */
            protected newData(): void {
                let app: PeriodCategoryEditApp = new PeriodCategoryEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run();
            }
            /** 查看数据，参数：目标数据 */
            protected viewData(data: bo.PeriodCategory): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    ));
                    return;
                }
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(data: bo.PeriodCategory): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_edit")
                    ));
                    return;
                }
                let app: PeriodCategoryEditApp = new PeriodCategoryEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(data);
            }
            /** 删除数据，参数：目标数据集合 */
            protected deleteData(data: bo.PeriodCategory | bo.PeriodCategory[]): void {
                let beDeleteds: ibas.IList<bo.PeriodCategory> = ibas.arrays.create(data);
                // 没有选择删除的对象
                if (beDeleteds.length === 0) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_delete")
                    ));
                    return;
                }
                // 标记删除对象
                beDeleteds.forEach((value) => {
                    value.delete();
                });
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_multiple_data_delete_continue", beDeleteds.length),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action !== ibas.emMessageAction.YES) {
                            return;
                        }
                        let boRepository: bo.BORepositoryAccounting = new bo.BORepositoryAccounting;
                        ibas.queues.execute(beDeleteds, (data, next) => {
                            // 处理数据
                            boRepository.savePeriodCategory({
                                beSaved: data,
                                onCompleted(opRslt: ibas.IOperationResult<bo.PeriodCategory>): void {
                                    if (opRslt.resultCode !== 0) {
                                        next(new Error(ibas.i18n.prop("shell_data_delete_error", data, opRslt.message)));
                                    } else {
                                        let criteria: ibas.ICriteria = new ibas.Criteria();
                                        let condition: ibas.ICondition = criteria.conditions.create();
                                        condition.alias = bo.PostingPeriod.PROPERTY_CATEGORY_NAME;
                                        condition.value = data.objectKey.toString();
                                        boRepository.fetchPostingPeriod({
                                            criteria: criteria,
                                            onCompleted: (opRsltPeriod) => {
                                                ibas.queues.execute(opRsltPeriod.resultObjects,
                                                    (pData, pNext) => {
                                                        pData.delete();
                                                        boRepository.savePostingPeriod({
                                                            beSaved: pData,
                                                            onCompleted: () => {
                                                                pNext();
                                                            }
                                                        });
                                                    }, () => {
                                                        next();
                                                    }
                                                );
                                            }
                                        });
                                    }
                                }
                            });
                            that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_deleting", data));
                        }, (error) => {
                            // 处理完成
                            if (error instanceof Error) {
                                that.messages(ibas.emMessageType.ERROR, error.message);
                            } else {
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                            }
                            that.busy(false);
                        });
                        that.busy(true);
                    }
                });
            }
        }
        /** 视图-期间类型 */
        export interface IPeriodCategoryListView extends ibas.IBOListView {
            /** 编辑数据事件，参数：编辑对象 */
            editDataEvent: Function;
            /** 删除数据事件，参数：删除对象集合 */
            deleteDataEvent: Function;
            /** 显示数据 */
            showData(datas: bo.PeriodCategory[]): void;
        }
    }
}
