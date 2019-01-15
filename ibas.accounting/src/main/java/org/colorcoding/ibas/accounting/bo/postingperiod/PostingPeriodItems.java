package org.colorcoding.ibas.accounting.bo.postingperiod;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.accounting.MyConfiguration;

/**
 * 过账期间-项目 集合
 */
@XmlType(name = PostingPeriodItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ PostingPeriodItem.class })
public class PostingPeriodItems extends BusinessObjects<IPostingPeriodItem, IPostingPeriod>
		implements IPostingPeriodItems {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "PostingPeriodItems";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = 2540638409100270392L;

	/**
	 * 构造方法
	 */
	public PostingPeriodItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public PostingPeriodItems(IPostingPeriod parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return PostingPeriodItem.class;
	}

	/**
	 * 创建过账期间-项目
	 * 
	 * @return 过账期间-项目
	 */
	public IPostingPeriodItem create() {
		IPostingPeriodItem item = new PostingPeriodItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(IPostingPeriodItem item) {
		super.afterAddItem(item);
		item.setStatus(this.getParent().getStatus());
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = super.getElementCriteria();
		return criteria;
	}

	@Override
	public void onParentPropertyChanged(PropertyChangeEvent evt) {
		super.onParentPropertyChanged(evt);
	}
}
