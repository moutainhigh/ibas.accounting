package org.colorcoding.ibas.accounting.data;

import org.colorcoding.ibas.bobas.mapping.Value;

/**
 * 税收组类型
 * 
 * @author Niuren.Zhu
 *
 */
public enum emTaxGroupCategory {

	/**
	 * 销项税
	 */
	@Value(value = "O")
	OUTPUT,
	/**
	 * 进项税
	 */
	@Value(value = "I")
	INPUT
}
