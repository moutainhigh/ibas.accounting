/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        const dimensions: string[] = ["DIM01", "DIM02", "DIM03", "DIM04", "DIM05"];
        /** 维度数据服务 */
        export class DimensionDataService extends ibas.ServiceWithResultApplication<IDimensionDataView, IDimensionDataServiceContract, String> {
            /** 应用标识 */
            static APPLICATION_ID: string = "7afe5fd5-add4-4673-a4dd-18db83a7f4f1";
            /** 应用名称 */
            static APPLICATION_NAME: string = "accounting_service_dimension_data";
            /** 构造函数 */
            constructor() {
                super();
                this.id = DimensionDataService.APPLICATION_ID;
                this.name = DimensionDataService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
            }
            protected runService(contract: IDimensionDataServiceContract): void {
                let criteria: ibas.Criteria = new ibas.Criteria();
                criteria.result = 1;
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = bo.Dimension.PROPERTY_ACTIVATED_NAME;
                condition.value = ibas.emYesNo.YES.toString();
                condition = criteria.conditions.create();
                condition.alias = bo.Dimension.PROPERTY_CODE_NAME;
                if (typeof contract.type === "number") {
                    condition.value = dimensions[contract.type];
                } else {
                    condition.value = ibas.strings.valueOf(contract.type);
                }
                let that: this = this;
                let boRepository: bo.BORepositoryAccounting = new bo.BORepositoryAccounting();
                boRepository.fetchDimension({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.IDimension>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let dimension: bo.IDimension = opRslt.resultObjects.firstOrDefault();
                            if (ibas.objects.isNull(dimension)) {
                                throw new Error(ibas.i18n.prop("accounting_dimension_invaild", condition.value));
                            }
                            if (ibas.strings.isEmpty(dimension.source)) {
                                throw new Error(ibas.i18n.prop("accounting_dimension_invaild", dimension.name));
                            }
                            if (dimension.sourceType === bo.emDimensionSource.CHOOSE_LIST) {
                                let criteria: ibas.ICriteria;
                                if (ibas.strings.isWith(dimension.source, "{", "}")) {
                                    // json
                                    let tmp: any = JSON.parse(dimension.source);
                                    let converter: bo.DataConverter = new bo.DataConverter();
                                    criteria = converter.parsing(tmp, "");
                                } else {
                                    // string
                                    criteria = new ibas.Criteria();
                                    criteria.businessObject = dimension.source;
                                }
                                let boCode: string = ibas.config.applyVariables(criteria.businessObject);
                                let property: string = null;
                                if (boCode.indexOf(".") > 0) {
                                    property = boCode.split(".")[1];
                                    boCode = boCode.split(".")[0];
                                }
                                ibas.servicesManager.runChooseService<any>({
                                    chooseType: ibas.emChooseType.SINGLE,
                                    boCode: boCode,
                                    criteria: criteria,
                                    onCompleted(selecteds: ibas.IList<any>): void {
                                        let selected: any = selecteds.firstOrDefault();
                                        if (!ibas.strings.isEmpty(property)) {
                                            that.fireCompleted(selected[property]);
                                        } else {
                                            that.fireCompleted(selected.toString());
                                        }
                                    }
                                });
                            } else if (dimension.sourceType === bo.emDimensionSource.TEXT) {
                                that.fireCompleted(dimension.source);
                            }
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
            }
        }
        /** 视图-维度 */
        export interface IDimensionDataView extends ibas.IView {
        }
        /** 物料批次收货服务映射 */
        export class DimensionDataServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = DimensionDataService.APPLICATION_ID;
                this.name = DimensionDataService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = DimensionDataServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new DimensionDataService();
            }
        }
    }
}
