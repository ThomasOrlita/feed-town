<script lang="ts">
  import { Loading } from 'attractions';
  import FeedList from '@/components/feeds/FeedList.svelte';

  import server from '@/api/api';
  import { AlertCircleIcon } from 'svelte-feather-icons';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import FeedCollectionList from '@/components/feeds/FeedCollectionList.svelte';
  import type { Feed } from '@server/api/Api.types';

  let feeds: Feed.Source.FeedSource[] = [];
  let feedCollections: Feed.Collection.FeedCollectionWithFeedSources[] = [];

  const loadData = async () => {
    [feeds, feedCollections] = await Promise.all([server.getFeedSources(), server.getFeedCollectionsWithFeedSources()]);
  };

  const feedCollectionsUpdated = (event: CustomEvent<Feed.Collection.FeedCollectionWithFeedSources[]>) => {
    feedCollections = event.detail;
  };
</script>

{#await loadData()}
  <div class="m-auto">
    <Loading />
  </div>
{:then}
  <SetBreadcrumbs
    items={[
      {
        href: `/feeds/`,
        text: `My Feeds`,
      },
    ]} />
  <FeedCollectionList {feedCollections} on:feedCollectionsUpdated={feedCollectionsUpdated} />
  <FeedList {feeds} hiddenFeedIds={feedCollections.flatMap((collection) => collection.feedSources.map((source) => source._id))} />
{:catch error}
  <GenericMessage>
    <AlertCircleIcon size="20" class="mr-2" />
    {error.message}
  </GenericMessage>
{/await}
