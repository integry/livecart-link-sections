{includeJs file="/module/footer-links/javascript/backend/FooterLink.js"}
{includeCss file="/module/footer-links/stylesheet/backend/FooterLink.css"}

{includeJs file="library/ActiveList.js"}
{includeJs file="library/form/ActiveForm.js"}
{includeJs file="library/form/Validator.js"}
{includeJs file="library/form/State.js"}

{includeCss file="library/ActiveList.css"}

{pageTitle}{t _footer_links}{/pageTitle}
{include file="layout/backend/header.tpl"}

<div id="footerLinkMsg" style="display: none;"></div>

{* upper menu *}
<fieldset class="container">
	<ul class="menu" id="footerLink_menu">
		<li class="footerLink_add"><a href="#new_file" id="footerLink_new_show">{t _add_new_file}</a></li>
		<li class="footerLink_addCancel done" style="display: none"><a href="#cancel_group" id="footerLink_new_cancel">{t _cancel_adding_new_file}</a></li>
		<li class="footerLinkGroup_add"><a href="#new_group" id="footerLinkGroup_new_show">{t _add_new_group}</a></li>
		<li class="footerLinkGroup_addCancel done" style="display: none"><a href="#cancel_group" id="footerLinkGroup_new_cancel">{t _cancel_adding_file_group}</a></li>
	</ul>
</fieldset>

{* new form *}
<div id="footerLinkGroup_new_form">{include file="module/footer-links/backend/footerLinkGroup/form.tpl"}</div>
<div class="addForm" id="footerLink_new_form">{include file="module/footer-links/backend/footerLink/form.tpl"}</div>
<div id="footerLink_item_blank">{include file="module/footer-links/backend/footerLink/form.tpl"}</div>

{* Files with no group *}
<ul id="footerLink_list_" class="footerLink_list activeList_add_sort activeList_add_delete activeList_add_edit activeList_accept_footerLink_list">
{foreach item="footerLink" from=$footerLinksWithGroups}
	{if $footerLink.FooterLinkGroup.ID}{php}continue;{/php}{/if}
	<li id="footerLink_list_{$footerLink.FooterLinkGroup.ID}_{$footerLink.ID}">
		<span class="footerLink_item_title">{$footerLink.title_lang}</span>
	</li>
{/foreach}
</ul>

{* Files in groups *}
<ul id="footerLinkGroup_list" class="activeListGroup activeList_add_sort activeList_add_delete activeList_add_edit footerLinkGroup_list">
{foreach item="footerLink" from=$footerLinksWithGroups}
	{if !$footerLink.FooterLinkGroup.ID}{php}continue;{/php}{/if}

	{if $lastFooterLinkGroup != $footerLink.FooterLinkGroup.ID }
		{if $lastFooterLinkGroup > 0}</ul></li>{/if}
		<li id="footerLinkGroup_list_{$footerLink.FooterLinkGroup.ID}" class="footerLinkGroup_item">
			<span class="footerLinkGroup_title">{$footerLink.FooterLinkGroup.name_lang}</span>
			<div id="activeList_editContainer_footerLinkGroup_list_{$footerLink.FooterLinkGroup.ID}" class="activeList_editContainer activeList_container" style="display: none">
				{include file="module/footer-links/backend/footerLinkGroup/form.tpl"}
			</div>
			<ul id="footerLink_list_{$footerLink.FooterLinkGroup.ID}" class="footerLink_list activeList_add_sort activeList_add_delete activeList_add_edit activeList_accept_footerLink_list">
		</li>
	{/if}

	{if $footerLink.ID} {* For empty groups *}
	<li id="footerLink_list_{$footerLink.FooterLinkGroup.ID}_{$footerLink.ID}">
		<span class="footerLink_item_title">{$footerLink.title_lang}</span>
	</li>
	{/if}

	{assign var="lastFooterLinkGroup" value=$footerLink.FooterLinkGroup.ID}
{/foreach}
</ul>


{literal}
<script type="text/javascript">
	Backend.availableLanguages = {/literal}{json array=$languages}{literal};

	with(Backend.FooterLink)
	{
		Links.update	 = '{/literal}{link controller=backend.footerLink action=update}{literal}';
		Links.create	 = '{/literal}{link controller=backend.footerLink action=create}{literal}';
		Links.deleteFile   = '{/literal}{link controller=backend.footerLink action=delete}{literal}';
		Links.sort	 = '{/literal}{link controller=backend.footerLink action=sort}{literal}';
		Links.edit	 = '{/literal}{link controller=backend.footerLink action=edit}{literal}';
		Links.download	 = '{/literal}{link controller=backend.footerLink action=download}{literal}';

		Messages.areYouSureYouWantToDelete = '{/literal}{t _are_you_sure_you_want_to_delete|addslashes}{literal}';

		with(Group)
		{
			Links.update	 = '{/literal}{link controller=backend.footerLinkGroup action=update}{literal}';
			Links.create	 = '{/literal}{link controller=backend.footerLinkGroup action=create}{literal}';
			Links.remove   = '{/literal}{link controller=backend.footerLinkGroup action=delete}{literal}';
			Links.sort	 = '{/literal}{link controller=backend.footerLinkGroup action=sort}?target=footerLinkGroup_list{literal}';
			Links.edit	 = '{/literal}{link controller=backend.footerLinkGroup action=edit}{literal}';

			Messages.areYouSureYouWantToDelete = '{/literal}{t _are_you_sure_you_want_to_delete_group|addslashes}{literal}'
		}
	}
	// create empty form
	var emptyModel = new Backend.FooterLink.Model({}, Backend.availableLanguages);
	var emptyController = new Backend.FooterLink.Controller($("footerLink_new_form").down('.footerLink_form'), emptyModel);
	var emptyGroupModel = new Backend.FooterLink.Group.Model({}, Backend.availableLanguages);
	new Backend.FooterLink.Group.Controller($("footerLinkGroup_new_form").down('.footerLinkGroup_form'), emptyGroupModel);

	Event.observe($("footerLinkGroup_new_show"), "click", function(e)
	{
		var newForm = Backend.FooterLink.Group.Controller.prototype.getInstance($("footerLinkGroup_new_form").down('.footerLinkGroup_form')).showNewForm();
		Event.stop(e);
	});

	Event.observe($("footerLink_new_show"), 'click', function(e) {
		Event.stop(e);
		var newForm = Backend.FooterLink.Controller.prototype.getInstance($("footerLink_new_form").down('.footerLink_form')).showNewForm();
	});

	{/literal}
	var groupList = ActiveList.prototype.getInstance('footerLinkGroup_list', Backend.FooterLink.Group.Callbacks);
	ActiveList.prototype.getInstance("footerLink_list_", Backend.FooterLink.Callbacks);
	{assign var="lastFileGroup" value="-1"}
	{foreach item="file" from=$footerLinksWithGroups}
		{if $file.FooterLinkGroup && $lastFileGroup != $file.FooterLinkGroup.ID}
			 ActiveList.prototype.getInstance('footerLink_list_{$file.FooterLinkGroup.ID}', Backend.FooterLink.Callbacks);
		{/if}
		{assign var="lastFileGroup" value=$file.FooterLinkGroup.ID}
	{/foreach}
	{literal}

	groupList.createSortable(true);

</script>
{/literal}

{include file="layout/backend/footer.tpl"}