<?php

ClassLoader::import("module.footer-links.application.model.FooterLinkGroup");

/**
 * Defines a file that is assigned to a particular product. This is mostly needed for
 * tangible (downloadable) products. Multiple files can be assigned to one product and
 * related files can be grouped together using FooterLinkGroup, which is useful if there
 * are many files assigned to the same product.
 *
 * @package application.model.product
 * @author Integry Systems <http://integry.com>
 */
class FooterLink extends MultilingualObject
{
	public static function defineSchema($className = __CLASS__)
	{
		$schema = self::getSchemaInstance($className);
		$schema->setName($className);
		$schema->registerField(new ARPrimaryKeyField("ID", ARInteger::instance()));
		$schema->registerField(new ARForeignKeyField("footerLinkGroupID", "FooterLinkGroup", "ID", "FooterLinkGroup", ARInteger::instance()));
		$schema->registerField(new ARField("isNewWindow", ARBool::instance()));
		$schema->registerField(new ARField("title", ARArray::instance()));
		$schema->registerField(new ARField("url", ARArray::instance()));
		$schema->registerField(new ARField("position", ARInteger::instance()));
	}

	/**
	 * Create new instance of product file
	 *
	 * @param Product $product Product to which the file belongs
	 * @param string $filePath Path to that file (possibly a temporary file)
	 * @param string $fileName File name with extension. (image.jpg)
	 * @return ActiveRecord
	 */
	public static function getNewInstance()
	{
		$footerLinkInstance = parent::getNewInstance(__CLASS__);

		return $footerLinkInstance;
	}

	/**
	 * Gets an existing FooterLink record
	 * @param mixed $recordID
	 * @param bool $loadRecordData
	 * @param bool $loadReferencedRecords
	 * @param array $data	Record data array (may include referenced record data)
	 *
	 * return ActiveRecord
	 */
	public static function getInstanceByID($recordID, $loadRecordData = false, $loadReferencedRecords = false, $data = array())
	{
		return parent::getInstanceByID(__CLASS__, $recordID, $loadRecordData, $loadReferencedRecords, $data);
	}

	/**
	 * Loads a set of FooterLink instances
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

	public static function getAllLinksArray()
	{
		$f = select();
		$f->setOrder(f(__CLASS__ . 'Group.position'));
		$f->setOrder(f(__CLASS__ . '.position'));
		$arr = ActiveRecord::getRecordSetArray(__CLASS__, $f, array('FooterLinkGroup'));
		foreach ($arr as &$entry)
		{
			if (empty($entry['FooterLinkGroup']['ID']))
			{
				unset($entry['FooterLinkGroup']);
			}
		}

		return $arr;
	}

	public static function getLinksMergedWithGroupsArray()
	{
		return FooterLinkGroup::mergeGroupsWithFields(FooterLinkGroup::getAllGroupsArray(), self::getAllLinksArray());
	}
}

?>