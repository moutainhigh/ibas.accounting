/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace accounting {
    export namespace bo {
        /** 业务仓库 */
        export interface IBORepositoryAccounting extends ibas.IBORepositoryApplication {
            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void;
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void;
            /**
             * 查询 期间类型
             * @param fetcher 查询者
             */
            fetchPeriodCategory(fetcher: ibas.IFetchCaller<bo.IPeriodCategory>): void;
            /**
             * 保存 期间类型
             * @param saver 保存者
             */
            savePeriodCategory(saver: ibas.ISaveCaller<bo.IPeriodCategory>): void;
            /**
             * 查询 过账期间
             * @param fetcher 查询者
             */
            fetchPostingPeriod(fetcher: ibas.IFetchCaller<bo.IPostingPeriod>): void;
            /**
             * 保存 过账期间
             * @param saver 保存者
             */
            savePostingPeriod(saver: ibas.ISaveCaller<bo.IPostingPeriod>): void;
            /**
             * 查询 项目
             * @param fetcher 查询者
             */
            fetchProject(fetcher: ibas.IFetchCaller<bo.IProject>): void;
            /**
             * 保存 项目
             * @param saver 保存者
             */
            saveProject(saver: ibas.ISaveCaller<bo.IProject>): void;
            /**
             * 查询 维度
             * @param fetcher 查询者
             */
            fetchDimension(fetcher: ibas.IFetchCaller<bo.IDimension>): void;
            /**
             * 保存 维度
             * @param saver 保存者
             */
            saveDimension(saver: ibas.ISaveCaller<bo.IDimension>): void;
            /**
             * 查询 税收组
             * @param fetcher 查询者
             */
            fetchTaxGroup(fetcher: ibas.IFetchCaller<bo.ITaxGroup>): void;
            /**
             * 保存 税收组
             * @param saver 保存者
             */
            saveTaxGroup(saver: ibas.ISaveCaller<bo.ITaxGroup>): void;

        }
    }
}
