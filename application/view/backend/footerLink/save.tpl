<script type="text/javascript">

{if $status == 'failure'}
	window.frameElement.controller.model.errors = {json array=$errors};
{else}
	window.frameElement.controller.model.store('ID', {$footerLink.ID});
	window.frameElement.controller.model.store('title', '{$footerLink.title|addslashes}');
{/if}

window.frameElement.action.call(window.frameElement.controller, '{$status}');
</script>