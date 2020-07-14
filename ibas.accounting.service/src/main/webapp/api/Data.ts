/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    /** 模块-标识 */
    export const CONSOLE_ID: string = "ac70d488-d8fc-478a-af00-c70ef779a50b";
    /** 模块-名称 */
    export const CONSOLE_NAME: string = "Accounting";
    /** 模块-版本 */
    export const CONSOLE_VERSION: string = "0.1.0";

    export namespace config {
        /**
         * 获取此模块配置
         * @param key 配置项
         * @param defalut 默认值
         */
        export function get<T>(key: string, defalut?: T): T {
            return ibas.config.get(ibas.strings.format("{0}|{1}", CONSOLE_ID, key), defalut);
        }
    }
    export namespace bo {
        /** 业务仓库名称 */
        export const BO_REPOSITORY_ACCOUNTING: string = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
        /** 业务对象编码-期间类型 */
        export const BO_CODE_PERIODCATEGORY: string = "${Company}_AC_CATEGORY";
        /** 业务对象编码-过账期间 */
        export const BO_CODE_POSTINGPERIOD: string = "${Company}_AC_PERIOD";
        /** 业务对象编码-项目 */
        export const BO_CODE_PROJECT: string = "${Company}_AC_PROJECT";
        /** 业务对象编码-维度 */
        export const BO_CODE_DIMENSION: string = "${Company}_AC_DIMENSION";
        /** 业务对象编码-税收组 */
        export const BO_CODE_TAXGROUP: string = "${Company}_AC_TAXGROUP";
        /**
         * 期间状态
         */
        export enum emPeriodStatus {
            /** 打开 */
            OPEN,
            /** 关闭 */
            LOCKED,
            /** 结算 */
            CLOSED
        }
        /**
         * 维度源
         */
        export enum emDimensionSource {
            /** 自由文本 */
            TEXT,
            /** 选择服务 */
            CHOOSE_LIST
        }
        /**
         * 税收组类型
         */
        export enum emTaxGroupCategory {
            /** 销项税 */
            OUTPUT,
            /** 进项税 */
            INPUT
        }
    }
    export namespace app {
        /**
         * 维度类型
         */
        export enum emDimensionType {
            DIMENSION_1,
            DIMENSION_2,
            DIMENSION_3,
            DIMENSION_4,
            DIMENSION_5,
        }
        /** 维度服务契约 */
        export interface IDimensionDataServiceContract extends ibas.IServiceContract {
            /** 维度类型 */
            type: emDimensionType | string;
        }
        /** 维度服务代理 */
        export class DimensionDataServiceProxy extends ibas.ServiceProxy<IDimensionDataServiceContract> {
        }
        /** 查询条件 */
        export namespace conditions {
            export namespace taxgroup {
                /** 默认查询条件 */
                export function create(category?: bo.emTaxGroupCategory): ibas.IList<ibas.ICondition> {
                    let today: string = ibas.dates.toString(ibas.dates.today(), "yyyy-MM-dd");
                    let conditions: ibas.IList<ibas.ICondition> = new ibas.ArrayList<ibas.ICondition>();
                    let condition: ibas.ICondition;
                    // 激活的
                    condition = new ibas.Condition();
                    condition.alias = bo.TaxGroup.PROPERTY_ACTIVATED_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = ibas.emYesNo.YES.toString();
                    conditions.add(condition);
                    if (!ibas.objects.isNull(category)) {
                        // 类型
                        condition = new ibas.Condition();
                        condition.alias = bo.TaxGroup.PROPERTY_CATEGORY_NAME;
                        condition.operation = ibas.emConditionOperation.EQUAL;
                        condition.value = category.toString();
                        conditions.add(condition);
                    }
                    // 有效日期
                    condition = new ibas.Condition();
                    condition.bracketOpen = 1;
                    condition.alias = bo.TaxGroup.PROPERTY_VALIDDATE_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    conditions.add(condition);
                    condition = new ibas.Condition();
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketOpen = 1;
                    condition.alias = bo.TaxGroup.PROPERTY_VALIDDATE_NAME;
                    condition.operation = ibas.emConditionOperation.NOT_NULL;
                    conditions.add(condition);
                    condition = new ibas.Condition();
                    condition.bracketClose = 2;
                    condition.alias = bo.TaxGroup.PROPERTY_VALIDDATE_NAME;
                    condition.operation = ibas.emConditionOperation.GRATER_EQUAL;
                    condition.value = today;
                    conditions.add(condition);
                    return conditions;
                }
            }
        }
    }
    export namespace taxrate {
        /**
         * 分配税率
         * @param taxCode 税码
         * @param onCompeleted 完成
         */
        export function assign(taxCode: string, onCompeleted: (rate: number) => void): void {
            if (!(onCompeleted instanceof Function)) {
                return;
            }
            if (ibas.strings.isEmpty(taxCode)) {
                onCompeleted(undefined);
            } else {
                gain(undefined, (results) => {
                    for (let item of results) {
                        if (ibas.strings.equals(item.code, taxCode)) {
                            onCompeleted(item.rate);
                            break;
                        }
                    }
                });
            }
        }
        let TAX_GROUPS: Array<bo.ITaxGroup>;
        /**
         * 获取税组
         * @param category 类型
         * @param onCompeleted 完成
         */
        export function gain(category: bo.emTaxGroupCategory, onCompeleted: (tax: { code: string, name: string, rate: number }[]) => void): void {
            if (TAX_GROUPS === undefined) {
                // 未初始化
                TAX_GROUPS = null;
                try {
                    let boReposiorty: bo.IBORepositoryAccounting = ibas.boFactory.create(bo.BO_REPOSITORY_ACCOUNTING);
                    boReposiorty.fetchTaxGroup({
                        criteria: app.conditions.taxgroup.create(),
                        onCompleted: (opRslt) => {
                            TAX_GROUPS = new Array<bo.ITaxGroup>();
                            for (let item of opRslt.resultObjects) {
                                TAX_GROUPS.push(item);
                            }
                            gain(category, onCompeleted);
                        }
                    });
                } catch (error) {
                    TAX_GROUPS = new Array<bo.ITaxGroup>();
                }
            } else if (TAX_GROUPS === null) {
                // 初始化中，过会调用
                setTimeout(() => {
                    gain(category, onCompeleted);
                }, 100);
            } else {
                // 已初始化，从缓存中获取数据
                let results: Array<{ code: string, name: string, rate: number }> = new Array<{ code: string, name: string, rate: number }>();
                for (let item of TAX_GROUPS) {
                    if (category >= 0 && category !== item.category) {
                        continue;
                    }
                    results.push({
                        code: item.code,
                        name: item.name,
                        rate: item.rate
                    });
                }
                if (onCompeleted instanceof Function) {
                    onCompeleted(results);
                }
            }
        }
    }
}
