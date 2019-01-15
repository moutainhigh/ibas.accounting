/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        /** 编辑应用-过账期间 */
        export class PostingPeriodEditApp extends ibas.BOEditApplication<IPostingPeriodEditView, bo.PostingPeriod> {
            /** 应用标识 */
            static APPLICATION_ID: string = "f10e53c6-f638-43b5-9c4d-49cd276acda5";
            /** 应用名称 */
            static APPLICATION_NAME: string = "accounting_app_postingperiod_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.PostingPeriod.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = PostingPeriodEditApp.APPLICATION_ID;
                this.name = PostingPeriodEditApp.APPLICATION_NAME;
                this.boCode = PostingPeriodEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addPostingPeriodItemEvent = this.addPostingPeriodItem;
                this.view.removePostingPeriodItemEvent = this.removePostingPeriodItem;
                this.view.chooseBusinessObjectEvent = this.chooseBusinessObject;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.PostingPeriod();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showPostingPeriod(this.editData);
                this.view.showPostingPeriodItems(this.editData.postingPeriodItems.filterDeleted());
            }
            run(): void;
            run(data: bo.PostingPeriod): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.PostingPeriod)) {
                    let data: bo.PostingPeriod = arguments[0];
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
                        boRepository.fetchPostingPeriod({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.PostingPeriod>): void {
                                let data: bo.PostingPeriod;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.PostingPeriod)) {
                                    // 查询到了有效数据
                                    that.editData = data;
                                    that.show();
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
            /** 待编辑的数据 */
            protected editData: bo.PostingPeriod;
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryAccounting = new bo.BORepositoryAccounting();
                boRepository.savePostingPeriod({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.PostingPeriod>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                // 删除成功，释放当前对象
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                                that.editData = undefined;
                            } else {
                                // 替换编辑对象
                                that.editData = opRslt.resultObjects.firstOrDefault();
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                            }
                            // 刷新当前视图
                            that.viewShowed();
                        } catch (error) {
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
                            that.editData.delete();
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
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_cloned_new"));
                        that.viewShowed();
                    } else {
                        // 新建对象
                        that.editData = new bo.PostingPeriod();
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
            /** 添加过账期间-项目事件 */
            protected addPostingPeriodItem(): void {
                this.editData.postingPeriodItems.create();
                // 仅显示没有标记删除的
                this.view.showPostingPeriodItems(this.editData.postingPeriodItems.filterDeleted());
            }
            /** 删除过账期间-项目事件 */
            protected removePostingPeriodItem(items: bo.PostingPeriodItem[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.postingPeriodItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.postingPeriodItems.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showPostingPeriodItems(this.editData.postingPeriodItems.filterDeleted());
            }
            /** 选择业务对象标识 */
            private chooseBusinessObject(caller: bo.PostingPeriodItem): void {
                let that: this = this;
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.noChilds = true;
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = "Code";
                condition.value = ".";
                condition.operation = ibas.emConditionOperation.NOT_CONTAIN;
                ibas.servicesManager.runChooseService<initialfantasy.bo.IBOInformation>({
                    boCode: initialfantasy.bo.BO_CODE_BOINFORMATION,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<initialfantasy.bo.IBOInformation>): void {
                        let index: number = that.editData.postingPeriodItems.indexOf(caller);
                        let item: bo.PostingPeriodItem = that.editData.postingPeriodItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.postingPeriodItems.create();
                                created = true;
                            }
                            item.businessObject = selected.code;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showPostingPeriodItems(that.editData.postingPeriodItems.filterDeleted());
                        }
                    }
                });
            }

        }
        /** 视图-过账期间 */
        export interface IPostingPeriodEditView extends ibas.IBOEditView {
            /** 选择业务对象事件 */
            chooseBusinessObjectEvent: Function;
            /** 显示数据 */
            showPostingPeriod(data: bo.PostingPeriod): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加过账期间-项目事件 */
            addPostingPeriodItemEvent: Function;
            /** 删除过账期间-项目事件 */
            removePostingPeriodItemEvent: Function;
            /** 显示数据 */
            showPostingPeriodItems(datas: bo.PostingPeriodItem[]): void;
        }
    }
}
