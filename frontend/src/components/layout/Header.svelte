<script lang="ts">
  import { breadcrumbs } from '@/api/store';
  import type { Breadcrumb } from '@/api/store';

  import { RssIcon } from 'svelte-feather-icons';
  import { Link } from 'svelte-routing';
  import Breadcrumbs from '@/components/layout/Breadcrumbs.svelte';

  let currentBreadcrumbs: Breadcrumb[] = [];
  breadcrumbs.subscribe((value) => {
    currentBreadcrumbs = value;
  });
</script>

<header class="px-4 py-3 bg-white border-b-gray-200 border-b-width-1px overflow-x-auto">
  <section class="flex items-center">
    <Link to="/" class="flex items-center font-medium flex-shrink-0">
      <RssIcon size="20" class="mr-2" /> Feed&thinsp;Town
    </Link>
    <Breadcrumbs items={currentBreadcrumbs} />
  </section>
</header>

<style>
  header {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  header::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
</style>
