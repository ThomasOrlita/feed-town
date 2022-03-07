<script lang="ts">
  import type { Feed } from '@server/api/Api.types';
  import { link, links } from 'svelte-routing';
  import { Button, Card, H2, Label } from 'attractions';
  import { ClockIcon, EditIcon, FrownIcon, RssIcon, SlidersIcon, TwitterIcon } from 'svelte-feather-icons';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';

  export let feeds: Feed.Source.FeedSource[];
  export let hiddenFeedIds: string[];
</script>

{#each feeds as feed}
  {#if !hiddenFeedIds.includes(feed._id)}
    <Card outline class="m-4 !overflow-visible">
      <H2 class="flex items-center">
        {#if feed.input.type === 'TWITTER_USER_TIMELINE'}
          <TwitterIcon size="20" class="mr-2" />
        {:else if feed.input.type === 'RSS' || feed.input.type === 'REDDIT_SUBREDDIT'}
          <RssIcon size="20" class="mr-2" />
        {/if}
        <a href={`/feed/${feed._id}`} use:link> {feed.title}</a>
      </H2>
      <div class="flex justify-end pl-1" use:links>
        <Button small round neutral class="ml-1" title="Add/remove feed from collections" href={`/feed/${feed._id}/collections`}>
          <EditIcon size="20" class="mr-2" />
          <span class="<sm:hidden">Manage in collections</span>
        </Button>
        <Button small round neutral class="ml-1" title="Add/remove feed from collections" href={`/feed/${feed._id}/collections`}>
          <SlidersIcon size="20" class="mr-2" />
          <span class="<sm:hidden">Edit</span>
        </Button>
        <!-- <Button small rectangle href={`/feed/${feed._id}/collections`}>add to collection</Button> -->
      </div>
      <!-- <ClockIcon size="16" class="mr-1.5" />
      <Label small class="!text-inherit">Last updated: {new Date(feed.lastChecked).toLocaleString()}</Label> -->

      <!-- {feed.input.type}<br />
      {feed.lastChecked}<br />
      {feed.dateCreated}<br /> -->
    </Card>
  {/if}
{:else}
  <GenericMessage>
    <FrownIcon size="20" class="mr-2" />
    No feeds found
  </GenericMessage>
{/each}
