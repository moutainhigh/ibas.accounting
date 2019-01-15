/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        export class DimensionFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "80a6bff4-c368-450b-9b28-bbf5376f10ec";
            /** 功能名称 */
            static FUNCTION_NAME = "accounting_func_dimension";
            /** 构造函数 */
            constructor() {
                super();
                this.id = DimensionFunc.FUNCTION_ID;
                this.name = DimensionFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: DimensionListApp = new DimensionListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}
