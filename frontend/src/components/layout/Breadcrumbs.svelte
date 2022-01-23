<script lang="ts">
  import { Breadcrumbs, Button } from 'attractions';
  import type { Breadcrumb } from '@/api/store';
  import { ChevronRightIcon } from 'svelte-feather-icons';
  import { links } from 'svelte-routing';

  export let items: Breadcrumb[];
</script>

<div class="flex-shrink-0">
  <Breadcrumbs items={[{ href: '', text: '' }, ...items]}>
    <div slot="item" let:item use:links class:-ml-10={item.href === ''}>
      <Button small href={item.href} class="!px-2.5 !py-1 !text-sm">{item.text}</Button>
    </div>
    <ChevronRightIcon slot="separator" size="16" class="<md:-mx-0.5 text-gray-500" />
  </Breadcrumbs>
</div>
