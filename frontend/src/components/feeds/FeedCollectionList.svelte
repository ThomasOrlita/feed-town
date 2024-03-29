<script lang="ts">
  import type { Feed } from '@server/api/Api.types';
  import { link, links } from 'svelte-routing';
  import { Button, Card, H2, Label } from 'attractions';
  import { EditIcon, FrownIcon, MinusIcon, PackageIcon, RssIcon, SlidersIcon, TwitterIcon } from 'svelte-feather-icons';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import server from '@/api/api';
  import { createEventDispatcher } from 'svelte';

  export let feedCollections: Feed.Collection.FeedCollectionWithFeedSources[];

  const dispatch = createEventDispatcher();

  const addOrRemoveFeed = async (feed: Feed.Source.FeedSource, feedCollection: Feed.Collection.FeedCollection, type: 'add' | 'remove') => {
    const collection = feedCollections.find((collection) => collection._id === feedCollection._id);
    if (!collection) return;

    if (type === 'add') {
      collection.feedSources.push(feed);
    } else {
      collection.feedSources = collection.feedSources.filter((source) => source._id !== feed._id);

      dispatch('feedCollectionsUpdated', feedCollections);
    }
    feedCollections = feedCollections;
  };
</script>

{#each feedCollections as feedCollection}
  <Card outline class="m-4 !overflow-visible break-all">
    <H2 class="flex items-center">
      <PackageIcon size="20" class="mr-2" />
      <a href={`/collection/${feedCollection._id}`} use:link> {feedCollection.title}</a>
    </H2>

    {#each feedCollection.feedSources as feed}
      <div class="flex items-center pl-1" use:links>
        {#if feed.input.type === 'TWITTER_USER_TIMELINE'}
          <TwitterIcon size="16" class="mr-2" />
        {:else if feed.input.type === 'RSS' || feed.input.type === 'REDDIT_SUBREDDIT'}
          <RssIcon size="16" class="mr-2" />
        {/if}

        <a href={`/feed/${feed._id}`} class="mr-auto"> {feed.title}</a>
        <Button
          small
          round
          neutral
          class="ml-1"
          title="Remove feed from collection"
          on:click={() => {
            server.removeFeedFromCollection({
              feedId: feed._id,
              collectionId: feedCollection._id,
            });
            addOrRemoveFeed(feed, feedCollection, 'remove');
          }}>
          <MinusIcon size="20" />
        </Button>
        <Button small round neutral class="ml-1" href={`/feed/${feed._id}/manage`}>
          <EditIcon size="20" />
        </Button>
      </div>
    {:else}
      <Label small>Collection is empty</Label>
    {/each}
  </Card>
{:else}
  <!-- <GenericMessage>
    <FrownIcon size="20" class="mr-2" />
    No collections found
  </GenericMessage> -->
{/each}
