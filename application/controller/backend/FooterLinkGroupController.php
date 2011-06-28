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
class FooterLinkGroupController extends StoreManagementController
{
	/**
	 * @role update
	 */
	public function create()
	{
		$linkGroup = FooterLinkGroup::getNewInstance();
		return $this->save($linkGroup);
	}

	/**
	 * @role update
	 */
	public function update()
	{
		$linkGroup = FooterLinkGroup::getInstanceByID((int)$this->request->get('ID'));
		return $this->save($linkGroup);
	}

	private function save(FooterLinkGroup $linkGroup)
	{
		$validator = $this->buildValidator();
		if ($validator->isValid())
		{
			foreach ($this->application->getLanguageArray(true) as $lang)
			{
				if ($this->request->isValueSet('name_' . $lang))
				{
					$linkGroup->setValueByLang('name', $lang, $this->request->get('name_' . $lang));
				}
			}

			$linkGroup->save();

			return new JSONResponse(array('status' => "success", 'ID' => $linkGroup->getID()));
		}
		else
		{
			return new JSONResponse(array('status' => "failure", 'errors' => $validator->getErrorList()));
		}
	}

	/**
	 * @role update
	 */
	public function delete()
	{
		FooterLinkGroup::getInstanceByID((int)$this->request->get('id'))->delete();
		return new JSONResponse(false, 'success');
	}

	/**
	 * @role update
	 */
	public function sort()
	{
		foreach($this->request->get($this->request->get('target'), array()) as $position => $key)
		{
			if(empty($key)) continue;
			$linkGroup = FooterLinkGroup::getInstanceByID((int)$key);
			$linkGroup->position->set((int)$position);
			$linkGroup->save();
		}

		return new JSONResponse(false, 'success');
	}

	public function edit()
	{
		$group = FooterLinkGroup::getInstanceByID((int)$this->request->get('id'), true);

		return new JSONResponse($group->toArray());
	}

	private function buildValidator()
	{
		$validator = $this->getValidator("FooterLinkGroupValidator", $this->request);

		$validator->addCheck('name_' . $this->application->getDefaultLanguageCode(), new IsNotEmptyCheck($this->translate('_err_group_name_is_empty')));

		return $validator;
	}

}

?>