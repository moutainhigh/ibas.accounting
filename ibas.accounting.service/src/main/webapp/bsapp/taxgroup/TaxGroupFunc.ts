/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        export class TaxGroupFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "7a9f7e52-2188-4973-a4a3-ce9a86c1f1f8";
            /** 功能名称 */
            static FUNCTION_NAME = "accounting_func_taxgroup";
            /** 构造函数 */
            constructor() {
                super();
                this.id = TaxGroupFunc.FUNCTION_ID;
                this.name = TaxGroupFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: TaxGroupListApp = new TaxGroupListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}
