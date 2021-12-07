<script lang="ts">
  import { Loading } from 'attractions';
  import FeedList from '../components/FeedList.svelte';

  import server from '../api/api';
  import { AlertCircleIcon } from 'svelte-feather-icons';
  import GenericMessage from '../components/GenericMessage.svelte';
  import SetBreadcrumbs from '../components/SetBreadcrumbs.svelte';
  import FeedCollectionList from '../components/FeedCollectionList.svelte';
</script>

{#await Promise.all([server.getFeeds(), server.getFeedCollectionsWithFeedSources()])}
  <div class="m-auto">
    <Loading />
  </div>
{:then [feeds, feedCollections]}
  <SetBreadcrumbs
    items={[
      {
        href: `/feeds/`,
        text: `My Feeds`,
      },
    ]} />
  <FeedCollectionList {feedCollections} />
  <FeedList {feeds} hiddenFeedIds={feedCollections.flatMap((collection) => collection.feedSources.map((source) => source._id))} />
{:catch error}
  <GenericMessage>
    <AlertCircleIcon size="20" class="mr-2" />
    {error.message}
  </GenericMessage>
{/await}
