<script lang="ts">
  import { Loading } from 'attractions';

  import server from '@/api/api';
  import { AlertCircleIcon } from 'svelte-feather-icons';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import Feed from '@/components/feeds/Feed.svelte';
  import { Link } from 'svelte-routing';
  export let feedCollectionId: string;
</script>

{#await Promise.all([server.getFeedCollection({ feedCollectionId }), server.getFeedCollectionFeed({ feedCollectionId })])}
  <div class="m-auto">
    <Loading />
  </div>
{:then [feedCollection, feedCollectionFeeds]}
  <SetBreadcrumbs
    items={[
      {
        href: `/collection/${feedCollectionId}`,
        text: feedCollection.title,
      },
    ]} />

  author: {feedCollection.author} <br />
  dateCreated: {feedCollection.dateCreated} <br />
  feedSources: {feedCollection.feedSources.length} <br />

  <Link to={`/collection/${feedCollectionId}/manage`}>Manage collection</Link>

  <hr />

  <Feed posts={feedCollectionFeeds} />
{:catch error}
  <GenericMessage>
    <AlertCircleIcon size="20" class="mr-2" />
    {error.message}
  </GenericMessage>
{/await}
