/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        /** 编辑应用-维度 */
        export class DimensionEditApp extends ibas.BOEditApplication<IDimensionEditView, bo.Dimension> {
            /** 应用标识 */
            static APPLICATION_ID: string = "162c4049-d65f-4ee0-9f45-31ef8e9ea3f9";
            /** 应用名称 */
            static APPLICATION_NAME: string = "accounting_app_dimension_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.Dimension.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = DimensionEditApp.APPLICATION_ID;
                this.name = DimensionEditApp.APPLICATION_NAME;
                this.boCode = DimensionEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.testSourceEvent = this.testSource;
                this.view.editSourceEvent = this.editSource;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.Dimension();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showDimension(this.editData);
            }
            run(): void;
            run(data: bo.Dimension): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.Dimension)) {
                    let data: bo.Dimension = arguments[0];
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
                        boRepository.fetchDimension({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.Dimension>): void {
                                let data: bo.Dimension;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.Dimension)) {
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
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryAccounting = new bo.BORepositoryAccounting();
                boRepository.saveDimension({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.Dimension>): void {
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
            /** 编辑源 */
            private editSource(): void {
                if (this.editData.sourceType === bo.emDimensionSource.CHOOSE_LIST) {
                    // 选择服务
                    let source: string = this.editData.source;
                    if (ibas.strings.isEmpty(source)) {
                        let that: this = this;
                        let criteria: ibas.ICriteria = new ibas.Criteria();
                        criteria.noChilds = true;
                        let condition: ibas.ICondition = criteria.conditions.create();
                        condition.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                        condition.value = ".";
                        condition.operation = ibas.emConditionOperation.NOT_CONTAIN;
                        ibas.servicesManager.runChooseService<initialfantasy.bo.IBOInformation>({
                            boCode: initialfantasy.bo.BO_CODE_BOINFORMATION,
                            chooseType: ibas.emChooseType.MULTIPLE,
                            criteria: criteria,
                            onCompleted(selecteds: ibas.IList<initialfantasy.bo.IBOInformation>): void {
                                let selected: initialfantasy.bo.IBOInformation = selecteds.firstOrDefault();
                                if (selected.objectType === "Simple") {
                                    that.editData.source = ibas.strings.format("{0}.ObjectKey", selected.code);
                                } else if (selected.objectType === "MasterData") {
                                    that.editData.source = ibas.strings.format("{0}.Code", selected.code);
                                } else if (selected.objectType === "Document") {
                                    that.editData.source = ibas.strings.format("{0}.DocEntry", selected.code);
                                } else {
                                    that.editData.source = selected.code;
                                }
                            }
                        });
                    } else {
                        let criteria: ibas.ICriteria;
                        if (ibas.strings.isWith(source, "{", "}")) {
                            // json
                            let tmp: any = JSON.parse(source);
                            let converter: bo.DataConverter = new bo.DataConverter();
                            criteria = converter.parsing(tmp, "");
                        } else {
                            // string
                            criteria = new ibas.Criteria();
                            criteria.businessObject = source;
                        }
                        let boCode: string = ibas.config.applyVariables(criteria.businessObject);
                        if (boCode.indexOf(".") > 0) {
                            boCode = boCode.split(".")[0];
                        }
                        let that: this = this;
                        ibas.servicesManager.runApplicationService<ibas.ICriteriaEditorServiceContract, ibas.ICriteria>({
                            proxy: new ibas.CriteriaEditorServiceProxy({
                                target: boCode,
                                criteria: criteria.conditions
                            }),
                            onCompleted(result: ibas.ICriteria): void {
                                result.businessObject = criteria.businessObject;
                                let converter: bo.DataConverter = new bo.DataConverter();
                                let tmp: any = converter.convert(result, "");
                                that.editData.source = JSON.stringify(tmp);
                            }
                        });
                    }
                } else {

                }
            }
            /** 测试源 */
            private testSource(): void {
                let that: this = this;
                ibas.servicesManager.runApplicationService<IDimensionDataServiceContract, String>({
                    proxy: new DimensionDataServiceProxy({
                        type: this.editData.code
                    }),
                    onCompleted(result: string): void {
                        that.proceeding("choosed: " + result);
                    }
                });
            }
        }
        /** 视图-维度 */
        export interface IDimensionEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showDimension(data: bo.Dimension): void;
            /** 测试源事件 */
            testSourceEvent: Function;
            /** 编辑源事件 */
            editSourceEvent: Function;
        }
    }
}
