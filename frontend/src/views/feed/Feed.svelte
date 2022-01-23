<script lang="ts">
  import { Card, Loading } from 'attractions';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import { AlertCircleIcon } from 'svelte-feather-icons';
  import { navigate } from 'svelte-routing';

  import server from '@/api/api';
  import Feed from '@/components/feeds/Feed.svelte';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';

  export let feedId: string;

  if (location.hash.slice(1).length === 24) {
    // feed item id is specified in hash
    // todo show in feed
    // navigate(`/feed/${feedId}/${location.hash.slice(1)}/comments`);
  }
</script>

{#await server.getFeed({ feedId })}
  <div class="m-auto">
    <Loading />
  </div>
{:then result}
  <SetBreadcrumbs
    items={[
      {
        href: `/feed/${result.feed._id}`,
        text: result.feed.title,
      },
    ]} />
  {result.feed.title}
  <Feed posts={result.items} />
{:catch error}
  <GenericMessage>
    <AlertCircleIcon size="20" class="mr-2" />
    {error.message}
  </GenericMessage>
{/await}
