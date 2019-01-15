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

    export namespace bo {
        /** 业务仓库名称 */
        export const BO_REPOSITORY_ACCOUNTING: string = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
        /** 业务对象编码-过账期间 */
        export const BO_CODE_POSTINGPERIOD: string = "${Company}_AC_PERIOD";
        /** 业务对象编码-项目 */
        export const BO_CODE_PROJECT: string = "${Company}_AC_PROJECT";
        /** 业务对象编码-维度 */
        export const BO_CODE_DIMENSION: string = "${Company}_AC_DIMENSION";
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
    }
}
