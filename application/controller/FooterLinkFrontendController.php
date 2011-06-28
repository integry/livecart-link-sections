<?php

ClassLoader::import("module.footer-links.application.model.FooterLink");
ClassLoader::import("module.footer-links.application.model.FooterLinkGroup");

/**
 *  Handles CAPTCHA image generation
 *
 *  @author Integry Systems
 *  @package module.captcha.application.controller
 */
class FooterLinkFrontendController extends BaseController
{
	public function linksBlock()
	{
		$groups = array();
		foreach (FooterLink::getLinksMergedWithGroupsArray() as $link)
		{
			$groupID = isset($link['FooterLinkGroup']['ID']) ? $link['FooterLinkGroup']['ID'] : '';
			$groups[$groupID][] = $link;
		}

		return new BlockResponse('groups', $groups);
	}
}

?>