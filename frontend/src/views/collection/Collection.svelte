<script lang="ts">
  import { Label, Loading } from 'attractions';

  import server from '@/api/api';
  import { AlertCircleIcon, ListIcon, SlidersIcon } from 'svelte-feather-icons';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import FeedItems from '@/components/feeds/FeedItems.svelte';
  import { Link, links } from 'svelte-routing';
  import { s } from 'attractions/utils';

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

  <nav class="-mt-2 -mx-2 px-4 py-2 bg-light-200 border-b-gray-200 border-b-width-1px">
    <section class="flex flex-row" use:links>
      <Link to={`/collection/${feedCollectionId}/manage`} class="flex items-center">
        <ListIcon size="16" />
        <Label small class="ml-1.5 <sm:hidden !text-inherit">
          {feedCollection.feedSources.length} feed{s(feedCollection.feedSources.length)}
        </Label>
      </Link>
      <Link to={`/collection/${feedCollectionId}/manage`} class="flex items-center ml-auto">
        <SlidersIcon size="16" />
        <Label small class="ml-1.5 <sm:hidden !text-inherit">Manage collection</Label>
      </Link>
    </section>
  </nav>

  <FeedItems posts={feedCollectionFeeds} />
{:catch error}
  <GenericMessage>
    <AlertCircleIcon size="20" class="mr-2" />
    {error.message}
  </GenericMessage>
{/await}
