<div class="footerLink_form"  style="display: none;">
	<form action="{link controller=backend.footerLink action=update}" method="post" target="footerLinkUploadIFrame_" enctype="multipart/form-data">
		<fieldset>
			<legend class="add">{t _add_file_title}</legend>
			<legend class="edit">{t _edit_link}</legend>
		<!-- STEP 1 -->

		<input type="hidden" name="ID" class="hidden footerLink_ID" />
		<input type="hidden" name="productID" class="hidden footerLink_productID" />

		<fieldset class="footerLink_main">

			<p>
				<label class="footerLink_title_label required">{t _footerLink_title}</label>
				<fieldset  class="error">
					<input type="text" name="title" class="footerLink_title wide" />
					<span class="errorText hidden"> </span>
				</fieldset >
			</p>

			<p>
				<label class="footerLink_url_label required">{t _footerLink_url}</label>
				<fieldset class="error">
					<input type="text" name="url" class="footerLink_url wide" />
					<span class="errorText hidden"> </span>
				</fieldset>
			</p>

			<p>
				<label></label>
				<input type="checkbox" name="isNewWindow" class="checkbox footerLink_isNewWindow"  />
				<label class="checkbox">{maketext text=_footerLink_embedded params="FLV; SWF"}</label>
			</p>
		</fieldset>

			<!-- STEP 3 -->

			{language}
				<fieldset class="error">
					<label class="footerLink_title_label">{t _footerLink_title}</label>
					<input type="text" name="title_{$lang.ID}" class="footerLink_title"  />
				</fieldset>
				<fieldset class="error">
					<label class="footerLink_url_label">{t _footerLink_url}</label>
					<input type="text" name="url_{$lang.ID}" class="footerLink_url" />
				</fieldset>
			{/language}

		</fieldset>

		<fieldset class="footerLink_controls controls">
			<span class="progressIndicator" style="display: none;"></span>
			<input type="submit" class="footerLink_save button submit" value="{t _save}" />
			{t _or}
			<a href="#cancel" class="footerLink_cancel cancel">{t _cancel}</a>
		</fieldset>
	</form>
</div>