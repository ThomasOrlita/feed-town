<script lang="ts">
  import { Card, Loading } from 'attractions';
  import FeedList from '../components/FeedList.svelte';

  import server from '../api/api';
  import { AlertCircleIcon } from 'svelte-feather-icons';
  import GenericMessage from '../components/GenericMessage.svelte';
  import SetBreadcrumbs from '../components/SetBreadcrumbs.svelte';
</script>

{#await server.getFeeds()}
  <div class="m-auto">
    <Loading />
  </div>
{:then feeds}
  <SetBreadcrumbs
    items={[
      {
        href: `/feeds/`,
        text: `My Feeds`,
      },
    ]} />
  <FeedList {feeds} />
{:catch error}
  <GenericMessage>
    <AlertCircleIcon size="20" class="mr-2" />
    {error.message}
  </GenericMessage>
{/await}
