<?php

ClassLoader::import("application.controller.backend.abstract.StoreManagementController");
ClassLoader::import("module.footer-links.application.model.FooterLink");
ClassLoader::import("module.footer-links.application.model.FooterLinkGroup");

/**
 * Controller for handling product based actions performed by store administrators
 *
 * @package application.controller.backend
 * @author Integry Systems
 */
class FooterLinkController extends StoreManagementController
{
	public function index()
	{
		$response = new ActionResponse();

		$languages = array();
		foreach($this->application->getLanguageList()->toArray() as $language) $languages[$language['ID']] = $language;
		$response->set('languages', $languages);
		$response->set('footerLinksWithGroups', FooterLink::getLinksMergedWithGroupsArray());

		return $response;
	}

	public function update()
	{
		$footerLink = FooterLink::getInstanceByID((int)$this->request->get('ID'), ActiveRecord::LOAD_DATA);

		return $this->save($footerLink);
	}

	public function create()
	{
		$footerLink = FooterLink::getNewInstance();
		return $this->save($footerLink);
	}

	private function save(FooterLink $footerLink)
	{
		$response = new ActionResponse();
		$response->setHeader("Cache-Control", "no-cache, must-revalidate");
		$response->setHeader("Expires", "Mon, 26 Jul 1997 05:00:00 GMT");

		$validator = $this->buildValidator((int)$this->request->get('ID'));
		if($validator->isValid())
		{
			foreach ($this->application->getLanguageArray(true) as $lang)
	   		{
	   			if ($this->request->isValueSet('title_' . $lang))
					$footerLink->setValueByLang('title', $lang, $this->request->get('title_' . $lang));

	   			if ($this->request->isValueSet('url_' . $lang))
					$footerLink->setValueByLang('url', $lang, $this->request->get('url_' . $lang));
	   		}

	   		$footerLink->isNewWindow->set($this->request->get('isNewWindow') != false);

	   		$footerLink->save();
			$response->set('status', 'success');
			$response->set('footerLink', $footerLink->toArray());
		}
		else
		{
			$response->set('status', 'failure');
			$response->set('errors', $validator->getErrorList());
		}

		return $response;
	}

	public function edit()
	{
		$footerLink = FooterLink::getInstanceByID((int)$this->request->get('id'), ActiveRecord::LOAD_DATA);

		return new JSONResponse($footerLink->toArray());
	}

	public function delete()
	{
		FooterLink::getInstanceByID((int)$this->request->get('id'))->delete();

		return new JSONResponse(false, 'success');
	}

	public function sort()
	{
		$target = $this->request->get('target');
		preg_match('/_(\d+)$/', $target, $match); // Get group.

		foreach($this->request->get($this->request->get('target'), array()) as $position => $key)
		{
			if(empty($key)) continue;

			$file = FooterLink::getInstanceByID((int)$key);
			$file->position->set((int)$position);

			if(isset($match[1])) $file->footerLinkGroup->set(FooterLinkGroup::getInstanceByID((int)$match[1]));
			else $file->footerLinkGroup->setNull();

			$file->save();
		}

		return new JSONResponse(false, 'success');
	}

	/**
	 * @return RequestValidator
	 */
	private function buildValidator($existingFooterLink = true)
	{
		$validator = $this->getValidator("footerLinkValidator", $this->request);

		$validator->addCheck('title_' . $this->application->getDefaultLanguageCode(), new IsNotEmptyCheck($this->translate('_err_link_title_is_empty')));
		$validator->addCheck('url_' . $this->application->getDefaultLanguageCode(), new IsNotEmptyCheck($this->translate('_err_url_is_empty')));

		return $validator;
	}

}
?>