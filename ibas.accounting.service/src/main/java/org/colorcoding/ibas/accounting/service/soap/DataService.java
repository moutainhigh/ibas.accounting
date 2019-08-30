package org.colorcoding.ibas.accounting.service.soap;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

import org.colorcoding.ibas.accounting.bo.dimension.Dimension;
import org.colorcoding.ibas.accounting.bo.postingperiod.PostingPeriod;
import org.colorcoding.ibas.accounting.bo.project.Project;
import org.colorcoding.ibas.accounting.bo.taxgroup.TaxGroup;
import org.colorcoding.ibas.accounting.repository.BORepositoryAccounting;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.cxf.WebServicePath;

/**
 * Accounting 数据服务JSON
 */
@WebService
@WebServicePath("data")
public class DataService extends BORepositoryAccounting {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-过账期间
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<PostingPeriod> fetchPostingPeriod(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
		return super.fetchPostingPeriod(criteria, token);
	}

	/**
	 * 保存-过账期间
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<PostingPeriod> savePostingPeriod(@WebParam(name = "bo") PostingPeriod bo,
			@WebParam(name = "token") String token) {
		return super.savePostingPeriod(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-项目
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<Project> fetchProject(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
		return super.fetchProject(criteria, token);
	}

	/**
	 * 保存-项目
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<Project> saveProject(@WebParam(name = "bo") Project bo,
			@WebParam(name = "token") String token) {
		return super.saveProject(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-维度
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<Dimension> fetchDimension(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
		return super.fetchDimension(criteria, token);
	}

	/**
	 * 保存-维度
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<Dimension> saveDimension(@WebParam(name = "bo") Dimension bo,
			@WebParam(name = "token") String token) {
		return super.saveDimension(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-税收组
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<TaxGroup> fetchTaxGroup(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
		return super.fetchTaxGroup(criteria, token);
	}

	/**
	 * 保存-税收组
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<TaxGroup> saveTaxGroup(@WebParam(name = "bo") TaxGroup bo,
			@WebParam(name = "token") String token) {
		return super.saveTaxGroup(bo, token);
	}
	// --------------------------------------------------------------------------------------------//

}
