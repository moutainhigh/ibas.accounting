/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../index.d.ts" />
/// <reference path="./postingperiod/index.ts" />
/// <reference path="./project/index.ts" />
/// <reference path="./dimension/index.ts" />
namespace accounting {
    export namespace ui {
        /** 视图导航 */
        export class Navigation extends ibas.ViewNavigation {
            /**
             * 创建实例
             * @param id 应用id
             */
            protected newView(id: string): ibas.IView {
                let view: ibas.IView = null;
                switch (id) {
                    case app.PostingPeriodListApp.APPLICATION_ID:
                        view = new c.PostingPeriodListView();
                        break;
                    case app.PostingPeriodChooseApp.APPLICATION_ID:
                        view = new c.PostingPeriodChooseView();
                        break;
                    case app.PostingPeriodEditApp.APPLICATION_ID:
                        view = new c.PostingPeriodEditView();
                        break;
                    case app.ProjectListApp.APPLICATION_ID:
                        view = new c.ProjectListView();
                        break;
                    case app.ProjectChooseApp.APPLICATION_ID:
                        view = new c.ProjectChooseView();
                        break;
                    case app.ProjectEditApp.APPLICATION_ID:
                        view = new c.ProjectEditView();
                        break;
                    case app.DimensionListApp.APPLICATION_ID:
                        view = new c.DimensionListView();
                        break;
                    case app.DimensionChooseApp.APPLICATION_ID:
                        view = new c.DimensionChooseView();
                        break;
                    case app.DimensionEditApp.APPLICATION_ID:
                        view = new c.DimensionEditView();
                        break;
                    case app.DimensionDataService.APPLICATION_ID:
                        view = new c.DimensionDataView();
                        break;
                    default:
                        break;
                }
                return view;
            }
        }
    }
}
