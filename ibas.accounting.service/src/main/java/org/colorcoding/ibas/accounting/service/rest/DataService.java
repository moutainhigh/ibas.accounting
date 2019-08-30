package org.colorcoding.ibas.accounting.service.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.accounting.bo.dimension.Dimension;
import org.colorcoding.ibas.accounting.bo.postingperiod.PostingPeriod;
import org.colorcoding.ibas.accounting.bo.project.Project;
import org.colorcoding.ibas.accounting.bo.taxgroup.TaxGroup;
import org.colorcoding.ibas.accounting.repository.BORepositoryAccounting;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.OperationResult;

/**
 * Accounting 数据服务JSON
 */
@Path("data")
public class DataService extends BORepositoryAccounting {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-过账期间
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchPostingPeriod")
	public OperationResult<PostingPeriod> fetchPostingPeriod(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchPostingPeriod(criteria, token);
	}

	/**
	 * 保存-过账期间
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("savePostingPeriod")
	public OperationResult<PostingPeriod> savePostingPeriod(PostingPeriod bo, @QueryParam("token") String token) {
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
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchProject")
	public OperationResult<Project> fetchProject(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchProject(criteria, token);
	}

	/**
	 * 保存-项目
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveProject")
	public OperationResult<Project> saveProject(Project bo, @QueryParam("token") String token) {
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
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchDimension")
	public OperationResult<Dimension> fetchDimension(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchDimension(criteria, token);
	}

	/**
	 * 保存-维度
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveDimension")
	public OperationResult<Dimension> saveDimension(Dimension bo, @QueryParam("token") String token) {
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
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchTaxGroup")
	public OperationResult<TaxGroup> fetchTaxGroup(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchTaxGroup(criteria, token);
	}

	/**
	 * 保存-税收组
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveTaxGroup")
	public OperationResult<TaxGroup> saveTaxGroup(TaxGroup bo, @QueryParam("token") String token) {
		return super.saveTaxGroup(bo, token);
	}
	// --------------------------------------------------------------------------------------------//

}
