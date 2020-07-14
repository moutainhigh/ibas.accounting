/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../api/index.ts" />
/// <reference path="./bo/PeriodCategory.ts" />
/// <reference path="./bo/PostingPeriod.ts" />
/// <reference path="./bo/Project.ts" />
/// <reference path="./bo/Dimension.ts" />
/// <reference path="./bo/TaxGroup.ts" />
/// <reference path="./DataConverter.ts" />
/// <reference path="./BORepository.ts" />
namespace accounting {
    export namespace bo {
        // 注册业务对象仓库到工厂
        boFactory.register(BO_REPOSITORY_ACCOUNTING, BORepositoryAccounting);
        // 注册业务对象到工厂
        boFactory.register(PeriodCategory.BUSINESS_OBJECT_CODE, PeriodCategory);
        boFactory.register(PostingPeriod.BUSINESS_OBJECT_CODE, PostingPeriod);
        boFactory.register(Project.BUSINESS_OBJECT_CODE, Project);
        boFactory.register(Dimension.BUSINESS_OBJECT_CODE, Dimension);
        boFactory.register(TaxGroup.BUSINESS_OBJECT_CODE, TaxGroup);
    }
}
