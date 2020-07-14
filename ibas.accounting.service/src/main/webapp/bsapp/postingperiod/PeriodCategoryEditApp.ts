/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        /** 编辑应用-期间类型 */
        export class PeriodCategoryEditApp extends ibas.BOEditApplication<IPeriodCategoryEditView, bo.PeriodCategory> {
            /** 应用标识 */
            static APPLICATION_ID: string = "881a6e57-7c0e-4d72-8f90-32ae68393df9";
            /** 应用名称 */
            static APPLICATION_NAME: string = "accounting_app_periodcategory_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.PeriodCategory.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = PeriodCategoryEditApp.APPLICATION_ID;
                this.name = PeriodCategoryEditApp.APPLICATION_NAME;
                this.boCode = PeriodCategoryEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addPostingPeriodEvent = this.addPostingPeriod;
                this.view.addPostingPeriodItemEvent = this.addPostingPeriodItem;
                this.view.removePostingPeriodEvent = this.removePostingPeriod;
                this.view.removePostingPeriodItemEvent = this.removePostingPeriodItem;

            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    let year: string = ibas.dates.toString(ibas.dates.today(), "yyyy");
                    this.editData = new bo.PeriodCategory();
                    this.editData.name = year;
                    this.editData.startDate = ibas.dates.valueOf(ibas.strings.format("{0}-01-01", year));
                    this.editData.endDate = ibas.dates.valueOf(ibas.strings.format("{0}-12-31", year));
                    this.editData.status = bo.emPeriodStatus.OPEN;
                    this.editPostingPeriods = new ibas.ArrayList<bo.PostingPeriod>();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showPeriodCategory(this.editData);
                if (!(this.editPostingPeriods instanceof Array)) {
                    this.editPostingPeriods = new ibas.ArrayList<bo.PostingPeriod>();
                }
                this.view.showPostingPeriods(this.editPostingPeriods.where(c => c.isDeleted === false));
            }
            run(): void;
            run(data: bo.PeriodCategory): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.PeriodCategory)) {
                    let data: bo.PeriodCategory = arguments[0];
                    // 新对象直接编辑
                    if (data.isNew) {
                        that.editData = data;
                        that.show();
                        return;
                    }
                    // 尝试重新查询编辑对象
                    let criteria: ibas.ICriteria = data.criteria();
                    if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                        // 有效的查询对象查询
                        let boRepository: bo.BORepositoryAccounting = new bo.BORepositoryAccounting();
                        boRepository.fetchPeriodCategory({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.PeriodCategory>): void {
                                let data: bo.PeriodCategory;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.PeriodCategory)) {
                                    // 查询到了有效数据
                                    that.editData = data;
                                    criteria = new ibas.Criteria();
                                    let condition: ibas.ICondition = criteria.conditions.create();
                                    condition.alias = bo.PostingPeriod.PROPERTY_CATEGORY_NAME;
                                    condition.value = that.editData.objectKey.toString();
                                    boRepository.fetchPostingPeriod({
                                        criteria: criteria,
                                        onCompleted(opRslt: ibas.IOperationResult<bo.PostingPeriod>): void {
                                            that.editPostingPeriods = ibas.arrays.create(opRslt.resultObjects);
                                            that.show();
                                        }
                                    });
                                } else {
                                    // 数据重新检索无效
                                    that.messages({
                                        type: ibas.emMessageType.WARNING,
                                        message: ibas.i18n.prop("shell_data_deleted_and_created"),
                                        onCompleted(): void {
                                            that.show();
                                        }
                                    });
                                }
                            }
                        });
                        return; // 退出
                    }
                }
                super.run.apply(this, arguments);
            }
            protected editPostingPeriods: ibas.IList<bo.PostingPeriod>;
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryAccounting = new bo.BORepositoryAccounting();
                boRepository.savePeriodCategory({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.PeriodCategory>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                // 删除成功，释放当前对象
                                that.editData = undefined;
                            } else {
                                // 替换编辑对象
                                that.editData = opRslt.resultObjects.firstOrDefault();
                            }
                            ibas.queues.execute(that.editPostingPeriods,
                                (data, next) => {
                                    if (data.isNew && that.editData) {
                                        data.category = that.editData.objectKey;
                                    }
                                    if (data.isDirty) {
                                        boRepository.savePostingPeriod({
                                            beSaved: data,
                                            onCompleted: (opRslt) => {
                                                if (opRslt.resultCode !== 0) {
                                                    next(new Error(opRslt.message));
                                                } else {
                                                    let index: number = that.editPostingPeriods.indexOf(data);
                                                    if (opRslt.resultObjects.length === 0) {
                                                        // 被删除了
                                                        that.editPostingPeriods.removeAt(index);
                                                    } else {
                                                        that.editPostingPeriods[index] = opRslt.resultObjects.firstOrDefault();
                                                    }
                                                    next();
                                                }
                                            }
                                        });
                                    } else {
                                        next();
                                    }
                                }, (error) => {
                                    that.busy(false);
                                    if (error instanceof Error) {
                                        that.messages(error);
                                    } else {
                                        if (ibas.objects.isNull(that.editData)) {
                                            that.messages(ibas.emMessageType.SUCCESS,
                                                ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                                        } else {
                                            that.messages(ibas.emMessageType.SUCCESS,
                                                ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                                        }
                                        // 刷新当前视图
                                        that.viewShowed();
                                    }
                                }
                            );
                        } catch (error) {
                            that.busy(false);
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
            }
            /** 删除数据 */
            protected deleteData(): void {
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_delete_continue"),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action === ibas.emMessageAction.YES) {
                            if (that.editData.status !== bo.emPeriodStatus.OPEN && !that.editData.isNew) {
                                that.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("accounting_data_was_using", that.editData));
                                return;
                            }
                            that.editData.delete();
                            if (that.editPostingPeriods instanceof Array) {
                                for (let pItem of that.editPostingPeriods) {
                                    if (pItem.status !== bo.emPeriodStatus.OPEN && !pItem.isNew) {
                                        that.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("accounting_data_was_using", pItem));
                                        return;
                                    }
                                    for (let sItem of pItem.postingPeriodItems) {
                                        if (sItem.status !== bo.emPeriodStatus.OPEN && !sItem.isNew) {
                                            that.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("accounting_data_was_using", sItem));
                                            return;
                                        }
                                        sItem.delete();
                                    }
                                    pItem.delete();
                                }
                            }
                            that.saveData();
                        }
                    }
                });
            }
            /** 新建数据，参数1：是否克隆 */
            protected createData(clone: boolean): void {
                let that: this = this;
                let createData: Function = function (): void {
                    if (clone) {
                        // 克隆对象
                        that.editData = that.editData.clone();
                        let nDatas: ibas.ArrayList<bo.PostingPeriod> = new ibas.ArrayList<bo.PostingPeriod>();
                        for (let item of that.editPostingPeriods) {
                            if (item.isDeleted) {
                                continue;
                            }
                            nDatas.add(item.clone());
                        }
                        that.editPostingPeriods = nDatas;
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_cloned_new"));
                        that.viewShowed();
                    } else {
                        // 新建对象
                        that.editData = new bo.PeriodCategory();
                        that.editPostingPeriods = new ibas.ArrayList<bo.PostingPeriod>();
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                        that.viewShowed();
                    }
                };
                if (that.editData.isDirty) {
                    this.messages({
                        type: ibas.emMessageType.QUESTION,
                        title: ibas.i18n.prop(this.name),
                        message: ibas.i18n.prop("shell_data_not_saved_continue"),
                        actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                        onCompleted(action: ibas.emMessageAction): void {
                            if (action === ibas.emMessageAction.YES) {
                                createData();
                            }
                        }
                    });
                } else {
                    createData();
                }
            }
            private addPostingPeriod(type: "" | "12months" | "4quarters"): void {
                if (!ibas.dates.isDate(this.editData.startDate) || !ibas.dates.isDate(this.editData.endDate)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("accounting_please_set_data_value",
                        ibas.i18n.prop("bo_periodcategory"),
                        ibas.i18n.prop("bo_periodcategory_startdate") + ", " + ibas.i18n.prop("bo_periodcategory_enddate")
                    ));
                    return;
                }
                if (type === "12months") {
                    if (this.editPostingPeriods.length > 0) {
                        this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("accounting_data_exists"));
                        return;
                    }
                    let startDate: Date = this.editData.startDate;
                    for (let index: number = 0; index < 12; index++) {
                        let period: bo.PostingPeriod = new bo.PostingPeriod();
                        period.startDate = startDate;
                        period.name = ibas.dates.toString(period.startDate, "yyyy-MM");
                        this.editPostingPeriods.add(period);
                        let month: number = startDate.getMonth() + 1;
                        startDate = new Date(startDate.getFullYear(), month, startDate.getDate());
                        period.endDate = ibas.dates.subtract(ibas.dates.emDifferenceType.DAY, startDate, 1);
                    }
                } else if (type === "4quarters") {
                    if (this.editPostingPeriods.length > 0) {
                        this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("accounting_data_exists"));
                        return;
                    }
                    let startDate: Date = this.editData.startDate;
                    for (let index: number = 0; index < 4; index++) {
                        let period: bo.PostingPeriod = new bo.PostingPeriod();
                        period.startDate = startDate;
                        period.name = ibas.dates.toString(period.startDate, "yyyy-MM");
                        this.editPostingPeriods.add(period);
                        let month: number = startDate.getMonth() + 3;
                        startDate = new Date(startDate.getFullYear(), month, startDate.getDate());
                        period.endDate = ibas.dates.subtract(ibas.dates.emDifferenceType.DAY, startDate, 1);
                    }
                } else {
                    let period: bo.PostingPeriod = new bo.PostingPeriod();
                    period.order = 1;
                    for (let item of this.editPostingPeriods) {
                        if (item.order >= period.order) {
                            period.order = item.order + 1;
                        }
                    }
                    this.editPostingPeriods.add(period);
                }
                this.resetPostingPeriodOrder(this.editPostingPeriods);
                this.view.showPostingPeriods(this.editPostingPeriods.where(c => c.isDeleted === false));
            }
            private removePostingPeriod(data: bo.PostingPeriod): void {
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_delete")
                    ));
                    return;
                }
                if (data.isNew) {
                    this.editPostingPeriods.remove(data);
                } else {
                    data.delete();
                }
                this.view.showPostingPeriods(this.editPostingPeriods.where(c => c.isDeleted === false));
            }
            private resetPostingPeriodOrder(datas: bo.PostingPeriod[]): void {
                let order: number = 1;
                for (let item of datas) {
                    if (item.isDeleted === true) {
                        continue;
                    }
                    item.order = order;
                    order++;
                }
            }
            private addPostingPeriodItem(data: bo.PostingPeriod): void {
                ibas.servicesManager.runChooseService<initialfantasy.bo.BOInformation>({
                    boCode: initialfantasy.bo.BOInformation.BUSINESS_OBJECT_CODE,
                    criteria: [
                        new ibas.Condition(initialfantasy.bo.BOInformation.PROPERTY_OBJECTTYPE_NAME, ibas.emConditionOperation.EQUAL, "Document")
                    ],
                    onCompleted: (selecteds) => {
                        for (let selected of selecteds) {
                            let item: bo.PostingPeriodItem = data.postingPeriodItems.create();
                            item.documentType = selected.code;
                        }
                        this.view.showPostingPeriodItems(data);
                    }
                });
            }
            private removePostingPeriodItem(data: bo.PostingPeriodItem | bo.PostingPeriodItem[]): void {
                let period: bo.PostingPeriod = null;
                for (let item of ibas.arrays.create(data)) {
                    for (let pItem of this.editPostingPeriods) {
                        if (pItem.postingPeriodItems.contain(item)) {
                            period = pItem;
                            break;
                        }
                    }
                    if (period != null) {
                        if (item.isNew) {
                            period.postingPeriodItems.remove(item);
                        } else {
                            item.delete();
                        }
                    }
                    this.view.showPostingPeriodItems(period);
                }
            }
        }
        /** 视图-期间类型 */
        export interface IPeriodCategoryEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showPeriodCategory(data: bo.PeriodCategory): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加过账期间事件 */
            addPostingPeriodEvent: Function;
            /** 移除过账期间事件 */
            removePostingPeriodEvent: Function;
            /** 显示过账期间 */
            showPostingPeriods(datas: bo.PostingPeriod[]): void;
            /** 添加过账期间项目事件 */
            addPostingPeriodItemEvent: Function;
            /** 移除过账期间项目事件 */
            removePostingPeriodItemEvent: Function;
            /** 显示过账期间项目 */
            showPostingPeriodItems(data: bo.PostingPeriod): void;
        }
    }
}
