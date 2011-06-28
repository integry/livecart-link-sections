<fieldset class="addForm footerLinkGroup_form"  style="display: none;">
	<legend class="add">{t _add_new_file_group_title}</legend>
	<legend class="edit">{t _edit_group}</legend>
	<form action="{link controller=backend.footerLinkGroup action=save}" method="post">
		<!-- STEP 1 -->

			<input type="hidden" name="ID" class="hidden footerLinkGroup_ID" />
			<input type="hidden" name="productID" class="hidden footerLinkGroup_productID" />

			<fieldset class="footerLinkGroup_main">
				<label class="footerLinkGroup_name_label">{t _product_file_group_title}</label>
				<fieldset class="error">
					<input type="text" name="name" class="footerLinkGroup_name" />
					<span class="errorText hidden"> </span>
				</fieldset>
			</fieldset>

			<!-- STEP 3 -->
			{language}
				<label>{t _product_file_group_title}:</label>
				<input type="text" value="" id="name_{$lang.ID}" name="name_{$lang.ID}"/>
			{/language}

		<fieldset class="footerLinkGroup_controls controls">
			<span class="progressIndicator" style="display: none;"></span>
			<input type="submit" class="footerLinkGroup_save button submit" value="{t _save}" />
			{t _or}
			<a href="#cancel" class="footerLinkGroup_cancel cancel">{t _cancel}</a>
		</fieldset>
	</form>
</fieldset>