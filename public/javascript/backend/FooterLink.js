/**
 *	@author Integry Systems
 */

if(!Backend) Backend = {};
if(!Backend.FooterLink) Backend.FooterLink = {};


/******************************************************************************
 * Product files
 * label:files
 *****************************************************************************/
Backend.FooterLink.Callbacks =
{
	beforeDelete: function(li){
		if(confirm(Backend.FooterLink.Messages.areYouSureYouWantToDelete))
		{
			return Backend.FooterLink.Links.deleteFile + "/" + this.getRecordId(li);
		}
	},
	afterDelete: function(li, response){
		try
		{
			response = eval('(' + response + ')');
		}
		catch(e)
		{
			return false;
		}

		return false;
	},
	beforeSort: function(li, order){
		return Backend.FooterLink.Links.sort + "?target=" + this.ul.id + "&" + order
	},
	afterSort: function(li, response){  },


	beforeEdit: function(li) {
		var container = this.getContainer(li, 'edit');
		if(this.isContainerEmpty(li, 'edit')) {
			var container  = this.getContainer(li, 'edit');
			new Insertion.Bottom(container, $('footerLink_item_blank').innerHTML);
			container.down('.footerLink_form').show();
			return Backend.FooterLink.Links.edit + "/" + this.getRecordId(li);
		}
		else {
			if(container.style.display != 'block')
			{
				this.toggleContainerOn(container);
				setTimeout(function() {
					ActiveForm.prototype.initTinyMceFields(li)
				}, 500);
			}
			else
			{
				this.toggleContainerOff(container);
				ActiveForm.prototype.destroyTinyMceFields(li);
			}
		}
	},

	afterEdit: function(li, response) {
		var model = new Backend.FooterLink.Model(eval("(" + response + ")"), Backend.availableLanguages);
		var controller = new Backend.FooterLink.Controller(li.down('.footerLink_form'), model);

		this.toggleContainer(li, 'edit');

		setTimeout(function() {
			ActiveForm.prototype.initTinyMceFields(li);
		}, 500);
	}
}

Backend.FooterLink.Model = function(data, languages)
{
	this.store(data || {});

	if(!this.get('ID', false)) this.isNew = true;

	this.languages = $H(languages);
},

Backend.FooterLink.Model.methods = {
	save: function(serializedData, onSaveResponse)
	{
		if(true == this.saving) return;
		this.saving = true;
		this.serverError = false;

		var self = this;
		new LiveCart.AjaxRequest(Backend.FooterLink.Links.save,
		{
			method: 'post',
			postBody: serializedData,
			onSuccess: function(response)
			{
				var responseHash = {};
				try
				{
					responseHash = eval("(" + response.responseText + ")");
				}
				catch(e)
				{
					responseHash['status'] = 'serverError';
					responseHash['responseText'] = response.responseText;
				}

				self.afterSave(responseHash, onSaveResponse);
			}
		});
	},

	getDefaultLanguage: function()
	{
		if(this.defaultLanguage === false)
		{
			this.languages.each(function(language)
			{
				if(parseInt(language.value.isDefault))
				{
					this.defaultLanguage = language.value;
				}
			}.bind(this));
		}

		return this.defaultLanguage;
	}
};

Backend.FooterLink.Model.inheritsFrom(MVC.Model);

Backend.FooterLink.Controller = Class.create();
Backend.FooterLink.Controller.prototype = {
	instances: {},

	initialize: function(root, model)
	{
		this.model = model;
		this.view = new Backend.FooterLink.View(root, this.model.get('Product.ID'));

		if(!this.view.nodes.root.id) this.view.nodes.root.id = this.view.prefix + 'list_' + this.model.get('ID') + '_form';

		var self = this;
		this.createUploadIFrame();
		this.setDefaultValues();

		this.setTranslationValues();

		this.bindActions();

		Form.State.backup(this.view.nodes.form);

		Backend.FooterLink.Controller.prototype.instances[this.view.nodes.root.id] = this;
	},

	createUploadIFrame: function()
	{
		var defaultLanguageID = this.model.getDefaultLanguage()['ID'];

		this.view.assign('defaultLanguageID', defaultLanguageID);
		this.view.assign('ID', this.model.get('ID', ''));
		this.view.assign('controller', this);

		this.view.createUploadIFrame();
	},

	getInstance: function(rootNode)
	{
		return Backend.FooterLink.Controller.prototype.instances[$(rootNode).id];
	},

	setDefaultValues: function()
	{
		var defaultLanguageID = this.model.getDefaultLanguage()['ID'];

		this.view.assign('defaultLanguageID', defaultLanguageID);
		this.view.assign('title', this.model.get('title_' + defaultLanguageID));
		this.view.assign('url', this.model.get('url_' + defaultLanguageID));
		this.view.assign('ID', this.model.get('ID', ''));
		this.view.assign('isNew', this.model.isNew);
		this.view.assign('isNewWindow', this.model.get('isNewWindow'));

		this.view.setDefaultLanguageValues();
	},

	setTranslationValues: function()
	{
		var self = this;

		this.view.assign('defaultLanguageID', this.model.getDefaultLanguage()['ID']);
		var url = {};
		var title = {};
		this.model.languages.each(function(lang)
		{
		   url[lang.key] = self.model.get('url_' + lang.key);
		   title[lang.key] = self.model.get('title_' + lang.key);
		});

		this.view.assign('title', title);
		this.view.assign('url', url);
		this.view.assign('languages', this.model.languages);
		this.view.setOtherLanguagesValues(this.model);
	},

	bindActions: function()
	{
		var self = this;
		if(!this.model.isNew)
		{
			Event.observe(this.view.nodes.title, 'keyup', function(e) { self.onTitleChange(); });
		}
		Event.observe(this.view.nodes.form, 'submit', function(e) { ActiveForm.prototype.resetErrorMessages(self.view.nodes.root); });
		Event.observe(this.view.nodes.cancel, 'click', function(e) { Event.stop(e); self.onCancel(); });
		Event.observe(this.view.nodes.newFileCancelLink, 'click', function(e) { Event.stop(e); self.onCancel(); });
		Event.observe(this.view.nodes.save, 'click', function(e) { self.onSave(); });
	},

	onSave: function()
	{
		var url = this.model.isNew ? Backend.FooterLink.Links.create : Backend.FooterLink.Links.update;
		this.view.nodes.form.action = url;
		Element.saveTinyMceFields(this.view.nodes.form);
	},

	onCancel: function()
	{
		Form.State.restore(this.view.nodes.root);

		ActiveForm.prototype.resetErrorMessages(this.view.nodes.root);
		if(this.model.isNew)
		{
			this.hideNewForm();
			ActiveForm.prototype.resetTinyMceFields(this.view.nodes.root);
		}
		else
		{
			var activeList = ActiveList.prototype.getInstance(this.view.prefix + "list_" + this.model.get('FooterLinkGroup.ID', ''));
			activeList.toggleContainer(this.view.nodes.root.up('li'), 'edit');

			this.view.nodes.fileHeader.innerHTML = this.model.get('title');
		}
	},

	onTitleChange: function()
	{
		this.view.nodes.fileHeader.update(this.view.nodes.title.value);
	},

	onSaveResponse: function(status)
	{
		if('success' == status)
		{
			if(this.model.isNew)
			{
				this.view.assign('ID', this.model.get('ID'));
				this.view.createNewFile();
				this.model.store('ID', false);
				this.hideNewForm();
				Form.State.restore(this.view.nodes.form);
			}
			else
			{
				this.view.nodes.fileHeader.update(this.view.nodes.title.value);

				var activeList = ActiveList.prototype.getInstance(this.view.prefix + "list_" + this.model.get('FooterLinkGroup.ID', ''));
				activeList.toggleContainer(this.view.nodes.root.up("li"), 'edit', 'yellow');
			}
			Form.State.restore(this.view.nodes.root);
		}
		else
		{
			ActiveForm.prototype.setErrorMessages(this.view.nodes.root, this.model.errors);
		}
	},

	hideNewForm: function()
	{
		var menu = new ActiveForm.Slide(this.view.prefix + "menu");
		menu.hide(this.view.prefix + "add", this.view.nodes.root);
	},

	showNewForm: function()
	{
		var menu = new ActiveForm.Slide(this.view.prefix + "menu");
		menu.show(this.view.prefix + "add", this.view.nodes.root);
	}
}

Backend.FooterLink.View = function(root, productID)
{
	this.findNodes(root, productID);
	this.clear();
}

Backend.FooterLink.View.methods =
{
	prefix: 'footerLink_',

	findNodes: function(root, productID)
	{
		this.nodes = {};
		this.nodes.root = root;

		this.nodes.form = ('FORM' == this.nodes.root.tagName) ? this.nodes.root : this.nodes.root.down('form');

		// controls
		this.nodes.controls = this.nodes.root.down('.' + this.prefix + 'controls');
		this.nodes.save = this.nodes.controls.down('.' + this.prefix + 'save');
		this.nodes.cancel = this.nodes.controls.down('.' + this.prefix + 'cancel');

		this.nodes.id = this.nodes.root.down('.' + this.prefix + 'ID');
		this.nodes.url = this.nodes.root.down('.' + this.prefix + 'url');
		this.nodes.title = this.nodes.root.down('.' + this.prefix + 'title');
		this.nodes.isNewWindow = this.nodes.root.down('.' + this.prefix + 'isNewWindow');

		if(this.nodes.root.up('li'))
		{
			this.nodes.fileHeader = this.nodes.root.up('li').down('.' + this.prefix + 'item_title');
		}

		this.nodes.newFileCancelLink = $(this.prefix + 'new_cancel');

		['isNewWindow'].each(function(f)
		{
			this.nodes[f].id = this.nodes[f].className + '_' + Math.random();
			this.nodes[f].parentNode.down('label').setAttribute('for', this.nodes[f].id);
		}.bind(this));

		new Backend.LanguageForm(root);
	},

	createUploadIFrame: function()
	{
		var iframe = document.createElement('iframe');
		iframe.hide();
		iframe.name = iframe.id = "footerLinkUploadIFrame_" + Math.random();
		this.nodes.root.appendChild(iframe);
		this.nodes.form.target = iframe.name;

		this.nodes.iframe = iframe;

		var controller = this.get('controller', null);
		this.nodes.iframe.controller = controller;
		this.nodes.iframe.action = function(status) { controller.onSaveResponse(status) };
	},

	setDefaultLanguageValues: function()
	{
		this.nodes.id.value = this.get('ID', '');

		this.nodes.url.name += '_' + this.get('defaultLanguageID');
		this.nodes.url.value = this.get('url', '');

		this.nodes.title.name += '_' + this.get('defaultLanguageID');
		this.nodes.title.value = this.get('title', '');

		this.nodes.isNewWindow.checked = this.get('isNewWindow', 0) == "1";

		this.nodes.form.action += "/" + this.get('ID', '');

		this.clear();
	},

	setOtherLanguagesValues: function()
	{
		var defaultLanguageID = this.get('defaultLanguageID');

		var self = this;
		var languages = this.get('languages', {});
		languages.each(function(language)
		{
			if(language.value.ID == defaultLanguageID) return;

			self.nodes.form.elements.namedItem('url_' + language.key).value = self.get('url.' + language.key , '');
			self.nodes.form.elements.namedItem('title_' + language.key).value = self.get('title.' + language.key , '');
		});

		this.clear();
	},

	createNewFile: function()
	{
		var activeList = ActiveList.prototype.getInstance(this.prefix + 'list_');

		var fileContainer = document.createElement('div');
		fileContainer.update('<span class="' + this.prefix + 'item_title">' + this.nodes.title.value + '</span>');

		var li = activeList.addRecord(this.get('ID'), fileContainer)
		Element.addClassName(li, 'footerLink_item');

		this.clear();
	},

	showForm: function()
	{
		var li = this.nodes.root.up("li");
		var activeList = ActiveList.prototype.getInstance(li.up('ul'));

		ActiveList.prototype.collapseAll();
		this.nodes.title.hide();
		activeList.toggleContainerOn(li.down('.' + this.prefix + 'form'));

		this.clear();
	},

	hideForm: function(highlight)
	{
		var li = this.nodes.root.up("li");
		var activeList = ActiveList.prototype.getInstance(li.up('ul'));

		this.nodes.title.show();
		activeList.toggleContainer(li, 'edit', highlight);

		this.clear();
	}
}

Backend.FooterLink.View.inheritsFrom(MVC.View);

/******************************************************************************
 * Product files group
 * label:group
 *****************************************************************************/
Backend.FooterLink.Group = {};
Backend.FooterLink.Group.Callbacks =
{
	beforeDelete: function(li) {
		if(confirm(Backend.FooterLink.Group.Messages.areYouSureYouWantToDelete))
		{
			return Backend.FooterLink.Group.Links.remove + "/" + this.getRecordId(li);
		}
	},
	afterDelete: function(li, response) {
		try
		{
			response = eval('(' + response + ')');
		}
		catch(e)
		{
			return false;
		}

		return false;
	},
	beforeSort: function(li, order) {
		return Backend.FooterLink.Group.Links.sort + '&' + order;
	},
	afterSort: function(li, response) {

	},

	beforeEdit:	 function(li)
	{
		if(!Backend.FooterLink.Group.Controller.prototype.getInstance(li.down('.footerLinkGroup_form')))
		{
			return Backend.FooterLink.Group.Links.edit + "/" + this.getRecordId(li);
		}
		else
		{
			var object = Backend.FooterLink.Group.Controller.prototype.getInstance(li.down('.footerLinkGroup_form'));

			if(this.getContainer(li, 'edit').style.display != 'block') object.showForm();
			else object.hideForm();
		}
	},
	afterEdit:	  function(li, response)
	{
		response = eval("(" + response + ")");

		var model = new Backend.FooterLink.Group.Model(response, Backend.availableLanguages);
		var group = new Backend.FooterLink.Group.Controller(li.down('.footerLinkGroup_form'), model);
		group.showForm();
	}
}


Backend.FooterLink.Group.Model = function(data, languages)
{
	this.store(data || {});

	if(!this.get('ID', false)) this.isNew = true;

	this.languages = $H(languages);
}

Backend.FooterLink.Group.Model.methods = {
	defaultLanguage: false,

	save: function(form, onSaveResponse)
	{
		if(true == this.saving) return;
		this.saving = true;
		this.serverError = false;

		var self = this;

		form.action = this.isNew ? Backend.FooterLink.Group.Links.create : Backend.FooterLink.Group.Links.update;

		new LiveCart.AjaxRequest(
			form,
			false,
			function(response)
			{
				var responseHash = {};
				try
				{
					responseHash = eval("(" + response.responseText + ")");
				}
				catch(e)
				{
					responseHash['status'] = 'serverError';
					responseHash['responseText'] = response.responseText;
				}

				self.afterSave(responseHash, onSaveResponse, form);
			}
		);
	},

	afterSave: function(response, onSaveResponse, form)
	{
		switch(response.status)
		{
			case 'success':
				this.store('ID', response.ID);
				break;
			case 'failure':
				this.errors = response.errors;
				break;
			case 'serverError':
				this.serverError = response.responseText;
				break;
		}

		onSaveResponse.call(this, response.status);
		this.saving = false;
	},

	getDefaultLanguage: function()
	{
		if(this.defaultLanguage === false)
		{
			this.languages.each(function(language)
			{
				if(parseInt(language.value.isDefault))
				{
					this.defaultLanguage = language.value;
				}
			}.bind(this));
		}

		return this.defaultLanguage;
	}
}

Backend.FooterLink.Group.Model.inheritsFrom(MVC.Model);

Backend.FooterLink.Group.Controller = Class.create();
Backend.FooterLink.Group.Controller.prototype = {
	instances: {},

	initialize: function(root, model)
	{
		this.model = model;
		this.view = new Backend.FooterLink.Group.View(root, this.model.get('Product.ID'));

		if(!this.view.nodes.root.id) this.view.nodes.root.id = this.view.prefix + 'list_' + this.model.get('ID', '') + '_form';

		this.setDefaultValues();
		this.setTranslationValues();

		this.bindActions();

		Form.State.backup(this.view.nodes.root);

		Backend.FooterLink.Group.Controller.prototype.instances[this.view.nodes.root.id] = this;

	},

	getInstance: function(rootNode)
	{
		return Backend.FooterLink.Group.Controller.prototype.instances[$(rootNode).id];
	},

	setDefaultValues: function()
	{
		var defaultLanguageID = this.model.getDefaultLanguage()['ID'];

		this.view.assign('defaultLanguageID', defaultLanguageID);
		this.view.assign('name', this.model.get('name_' + defaultLanguageID));
		this.view.assign('ID', this.model.get('ID', ''));

		this.view.setDefaultLanguageValues();
	},

	setTranslationValues: function()
	{
		var self = this;

		this.view.assign('defaultLanguageID', this.model.getDefaultLanguage()['ID']);
		var name = {};
		this.model.languages.each(function(lang)
		{
		   name[lang.key] = self.model.get('name_' + lang.key)
		});

		this.view.assign('name', name);
		this.view.assign('languages', this.model.languages);
		this.view.setOtherLanguagesValues(this.model);
	},

	bindActions: function()
	{
		var self = this;

		Event.observe(this.view.nodes.save, 'click', function(e) { Event.stop(e); self.onSave(); });
		Event.observe(this.view.nodes.cancel, 'click', function(e) { Event.stop(e); self.onCancel(); });
		Event.observe(this.view.nodes.newGroupCancelLink, 'click', function(e) { Event.stop(e); self.onCancel(); });
		Event.observe(this.view.nodes.name, 'keyup', function(e) { Event.stop(e); self.onNameChange(); });

	},

	onSave: function()
	{
		var self = this;
		ActiveForm.prototype.resetErrorMessages(this.view.nodes.root);
		this.model.save(this.view.nodes.root.down('form'), function(status) {
			self.onSaveResponse(status) ;
		});
	},

	onNameChange: function()
	{
		if(!this.model.isNew) this.view.nodes.title.update(this.view.nodes.name.value);
	},

	onCancel: function()
	{
		Form.State.restore(this.view.nodes.root);
		ActiveForm.prototype.resetErrorMessages(this.view.nodes.root);

		if(this.model.isNew)
		{
			this.hideNewForm();
		}
		else
		{
			this.hideForm();
		}
	},

	onSaveResponse: function(status)
	{
		if('success' == status)
		{
			if(this.model.isNew)
			{
				this.view.assign('ID', this.model.get('ID'));
				this.view.createNewGroup();
				this.model.store('ID', false);

				this.hideNewForm();
				this.view.nodes.root.down('form').reset();
			}
			else
			{
				this.view.nodes.title.update(this.view.nodes.name.value);
				this.hideForm('yellow');
			}

			Form.State.backup(this.view.nodes.root);
		}
		else
		{
			ActiveForm.prototype.setErrorMessages(this.view.nodes.root, this.model.errors);
		}
	},

	hideNewForm: function()
	{
		var menu = new ActiveForm.Slide("footerLink_menu");
		menu.hide(this.view.prefix + "add", this.view.nodes.root);
	},

	showNewForm: function()
	{
		var menu = new ActiveForm.Slide("footerLink_menu");
		menu.show(this.view.prefix + "add", this.view.nodes.root);
	},

	showForm: function()
	{
		this.view.showForm();
	},

	hideForm: function(highlight)
	{
		this.view.nodes.title.update(this.view.nodes.name.value);
		this.view.hideForm(highlight);

	}

}


Backend.FooterLink.Group.View = function(root, productID)
{
	this.findNodes(root, productID);
	this.clear();
}

Backend.FooterLink.Group.View.methods = {
	prefix: 'footerLinkGroup_',

	findNodes: function(root, productID)
	{
		this.nodes = {};
		this.nodes.root = root;
		this.nodes.form = ('FORM' == this.nodes.root.tagName) ? this.nodes.root : this.nodes.root.down('form');

		// controls
		this.nodes.controls = this.nodes.root.down('.' + this.prefix + 'controls');
		this.nodes.save = this.nodes.controls.down('.' + this.prefix + 'save');
		this.nodes.cancel = this.nodes.controls.down('.' + this.prefix + 'cancel');

		this.nodes.id = this.nodes.root.down('.' + this.prefix + 'ID');
		this.nodes.name = this.nodes.root.down('.' + this.prefix + 'name');

		if(this.nodes.root.up('li')) this.nodes.title = this.nodes.root.up('li').down('.' + this.prefix + 'title');

		this.nodes.newGroupCancelLink = $(this.prefix + 'new_cancel');

		this.nodes.languageForm = this.nodes.root.down('.languageForm');

		new Backend.LanguageForm(this.nodes.languageForm);
	},

	setDefaultLanguageValues: function()
	{
		this.nodes.id.value = this.get('ID', '');

		this.nodes.name.name += '_' + this.get('defaultLanguageID');
		this.nodes.name.value = this.get('name', '');

		this.clear();
	},

	setOtherLanguagesValues: function()
	{
		var defaultLanguageID = this.get('defaultLanguageID');

		var self = this;
		var languages = this.get('languages', {});
		languages.each(function(language)
		{
			if(language.value.ID == defaultLanguageID) return;
			self.nodes.form.elements.namedItem('name_' + language.key).value = self.get('name.' + language.key, '');
		});

		this.clear();
	},

	createNewGroup: function()
	{
		var activeList = ActiveList.prototype.getInstance($(this.prefix + "list"), Backend.FooterLink.Group.Callbacks, Backend.FooterLink.Group.Messages);

		var containerDiv = document.createElement('div');
		containerDiv.update(
			'<span class="' + this.prefix + 'title">' + this.nodes.name.value + '</span>'
			+ $('footerLinkGroup_new_form').innerHTML
			+ '<ul id="footerLink_list_' + this.get('ID') + '" class="footerLink_list activeList_add_sort activeList_add_edit activeList_add_delete activeList_accept_footerLink_list">'
			+ '</ul>'
		);

		var li = activeList.addRecord(this.get('ID'), containerDiv);
		Element.addClassName(li, this.prefix  + 'item');

		li.down('.footerLinkGroup_form').hide();
		li.down('.footerLinkGroup_form').id = '';

		var newGroupProductsList = ActiveList.prototype.getInstance(li.down('.footerLink_list'), Backend.FooterLink.Callbacks);
		ActiveList.prototype.recreateVisibleLists();

		activeList.touch(true)

		this.clear();
	},

	showForm: function()
	{
		var li = this.nodes.root.up("li");
		var activeList = ActiveList.prototype.getInstance(li.up('ul'));
		li.down('.' + this.prefix + 'form').style.display = 'block';
		ActiveList.prototype.collapseAll();

		activeList.toggleContainerOn(activeList.getContainer(li, 'edit'));

		this.clear();
	},

	hideForm: function(highlight)
	{
		var li = this.nodes.root.up("li");
		var activeList = ActiveList.prototype.getInstance(li.up('ul'));

		activeList.toggleContainerOff(activeList.getContainer(li, 'edit', highlight));

		this.clear();
	}

}

Backend.FooterLink.Group.View.inheritsFrom(MVC.View);

Backend.RegisterMVC(Backend.FooterLink);
Backend.RegisterMVC(Backend.FooterLink.Group);