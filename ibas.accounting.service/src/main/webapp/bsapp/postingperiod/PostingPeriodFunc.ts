/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        export class PostingPeriodFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "ba030686-0c50-4c05-9c11-af0ae75e0fee";
            /** 功能名称 */
            static FUNCTION_NAME = "accounting_func_postingperiod";
            /** 构造函数 */
            constructor() {
                super();
                this.id = PostingPeriodFunc.FUNCTION_ID;
                this.name = PostingPeriodFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: PeriodCategoryListApp = new PeriodCategoryListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}
