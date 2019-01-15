/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace app {
        export class ProjectFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "6e376dfc-523f-472a-9d44-f0b355b4f755";
            /** 功能名称 */
            static FUNCTION_NAME = "accounting_func_project";
            /** 构造函数 */
            constructor() {
                super();
                this.id = ProjectFunc.FUNCTION_ID;
                this.name = ProjectFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: ProjectListApp = new ProjectListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}
