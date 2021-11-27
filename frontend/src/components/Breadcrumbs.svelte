<script lang="ts">
  import { Breadcrumbs, Button, Chip } from 'attractions';
  import { ChevronRightIcon, HomeIcon } from 'svelte-feather-icons';
  import { Link, links } from 'svelte-routing';

  export let items: { href: string; text: string }[];
</script>

<div class="<sm:hidden">
  <Breadcrumbs items={[{ href: '/', text: 'Home' }, ...items]}>
    <div slot="item" let:item use:links>
      {#if item.href === '/'}
        <Button href="/" round small>
          <HomeIcon size="20" />
        </Button>
      {:else}
        <Chip small><Link to={item.href}>{item.text}</Link></Chip>
      {/if}
    </div>
    <ChevronRightIcon slot="separator" size="18" class="mx-1.5 text-gray-600" />
  </Breadcrumbs>
</div>
