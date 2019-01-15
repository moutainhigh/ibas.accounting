package org.colorcoding.ibas.accounting.repository;

import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.repository.BORepositoryServiceApplication;
import org.colorcoding.ibas.accounting.bo.dimension.Dimension;
import org.colorcoding.ibas.accounting.bo.dimension.IDimension;
import org.colorcoding.ibas.accounting.bo.postingperiod.IPostingPeriod;
import org.colorcoding.ibas.accounting.bo.postingperiod.PostingPeriod;
import org.colorcoding.ibas.accounting.bo.project.IProject;
import org.colorcoding.ibas.accounting.bo.project.Project;

/**
 * Accounting仓库
 */
public class BORepositoryAccounting extends BORepositoryServiceApplication
		implements IBORepositoryAccountingSvc, IBORepositoryAccountingApp {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-过账期间
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<PostingPeriod> fetchPostingPeriod(ICriteria criteria, String token) {
		return super.fetch(criteria, token, PostingPeriod.class);
	}

	/**
	 * 查询-过账期间（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IPostingPeriod> fetchPostingPeriod(ICriteria criteria) {
		return new OperationResult<IPostingPeriod>(this.fetchPostingPeriod(criteria, this.getUserToken()));
	}

	/**
	 * 保存-过账期间
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<PostingPeriod> savePostingPeriod(PostingPeriod bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-过账期间（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IPostingPeriod> savePostingPeriod(IPostingPeriod bo) {
		return new OperationResult<IPostingPeriod>(this.savePostingPeriod((PostingPeriod) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-项目
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<Project> fetchProject(ICriteria criteria, String token) {
		return super.fetch(criteria, token, Project.class);
	}

	/**
	 * 查询-项目（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IProject> fetchProject(ICriteria criteria) {
		return new OperationResult<IProject>(this.fetchProject(criteria, this.getUserToken()));
	}

	/**
	 * 保存-项目
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<Project> saveProject(Project bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-项目（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IProject> saveProject(IProject bo) {
		return new OperationResult<IProject>(this.saveProject((Project) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-维度
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<Dimension> fetchDimension(ICriteria criteria, String token) {
		return super.fetch(criteria, token, Dimension.class);
	}

	/**
	 * 查询-维度（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IDimension> fetchDimension(ICriteria criteria) {
		return new OperationResult<IDimension>(this.fetchDimension(criteria, this.getUserToken()));
	}

	/**
	 * 保存-维度
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<Dimension> saveDimension(Dimension bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-维度（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IDimension> saveDimension(IDimension bo) {
		return new OperationResult<IDimension>(this.saveDimension((Dimension) bo, this.getUserToken()));
	}
	// --------------------------------------------------------------------------------------------//

}
