{includeCss file="/module/footer-links/stylesheet/FooterLink.css"}

<div id="footerLinks">
	{foreach item="group" from=$groups}
		<div class="footerLinkGroup">
			{if $group.0.FooterLinkGroup.name_lang}
				<div class="footerLinkGroupTitle">{$group.0.FooterLinkGroup.name_lang}</div>
			{/if}
			<ul>
				{foreach from=$group item=link}
					<li><a href="{$link.url_lang}"{if $link.isNewWindow} target="_blank"{/if}>{$link.title_lang}</a></li>
				{/foreach}
			</ul>
		</div>
	{/foreach}
	<div class="clear"></div>
</div>
