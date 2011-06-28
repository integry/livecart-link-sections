<?php

ClassLoader::import("application.model.product.ProductParametersGroup");

/**
 * Related FooterLinks can be grouped together using FooterLinkGroup
 *
 * @package application.model.product
 * @author Integry Systems <http://integry.com>
 */
class FooterLinkGroup extends ProductParametersGroup
{
	private static $nextPosition = false;

	public static function defineSchema($className = __CLASS__)
	{
		$schema = parent::defineSchema($className);
		$schema->setName("FooterLinkGroup");

		$schema->registerField(new ARField("name", ARArray::instance()));
		$schema->unregisterField('productID');
	}

	/**
	 * Load related products group record set
	 *
	 * @param ARSelectFilter $filter
	 * @param bool $loadReferencedRecords
	 *
	 * @return ARSet
	 */
	public static function getRecordSet(ARSelectFilter $filter, $loadReferencedRecords = false)
	{
		return parent::getRecordSet(__CLASS__, $filter, $loadReferencedRecords);
	}

	/**
	 * Get related products group active record by ID
	 *
	 * @param mixed $recordID
	 * @param bool $loadRecordData
	 * @param bool $loadReferencedRecords
	 *
	 * @return FooterLinkGroup
	 */
	public static function getInstanceByID($recordID, $loadRecordData = false, $loadReferencedRecords = false)
	{
		return parent::getInstanceByID(__CLASS__, $recordID, $loadRecordData, $loadReferencedRecords);
	}

	/**
	 * Creates a new related products group
	 *
	 * @param Product $product
	 *
	 * @return FooterLinkGroup
	 */
	public static function getNewInstance()
	{
		return parent::getNewInstance(__CLASS__);
	}

	public static function mergeGroupsWithFields($groups, $fields)
	{
		return parent::mergeGroupsWithFields(__CLASS__, $groups, $fields);
	}

	private function getFilesFilter()
	{
		$filter = new ARSelectFilter();

		$filter->setCondition(new EqualsCond(new ARFieldHandle('FooterLink', "footerLinkGroupID"), $this->getID()));

		return $filter;
	}

	public static function getAllGroupsArray()
	{
		$f = select();
		$f->setOrder(f(__CLASS__ . '.position'));
		return ActiveRecord::getRecordSetArray(__CLASS__, $f);
	}

	public function setNextPosition()
	{
		return ActiveRecordModel::setLastPosition();
	}
}

?>