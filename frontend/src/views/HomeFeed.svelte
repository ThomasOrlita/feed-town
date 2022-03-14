<script lang="ts">
  import server from '@/api/api';

  import Feed from '@/components/feeds/FeedItems.svelte';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import { Loading } from 'attractions';
  import { AlertCircleIcon } from 'svelte-feather-icons';
</script>

{#await server.getHomeFeed()}
  <div class="m-auto">
    <Loading />
  </div>
{:then items}
  <Feed posts={items} />
{:catch error}
  <GenericMessage>
    <AlertCircleIcon size="20" class="mr-2" />
    {error.message}
  </GenericMessage>
{/await}
