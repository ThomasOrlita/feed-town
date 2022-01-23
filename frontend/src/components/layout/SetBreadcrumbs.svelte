<script lang="ts">
  import { breadcrumbs } from '@/api/store';
  import type { Breadcrumb } from '@/api/store';
  export let items: Breadcrumb[];

  breadcrumbs.set(items);
</script>
