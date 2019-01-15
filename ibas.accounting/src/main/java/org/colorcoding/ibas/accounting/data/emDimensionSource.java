package org.colorcoding.ibas.accounting.data;

import org.colorcoding.ibas.bobas.mapping.Value;

/**
 * 维度数据来源类型
 * 
 * @author Niuren.Zhu
 *
 */
public enum emDimensionSource {
	/** 自由文本 */
	@Value(value = "T")
	TEXT,
	/** 选择服务 */
	@Value(value = "C")
	CHOOSE_LIST
}
