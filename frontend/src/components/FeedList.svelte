<script lang="ts">
  import type { Feed } from '../../../server/api/Api.types';
  import { link, links } from 'svelte-routing';
  import { Button, Card, H2 } from 'attractions';
  import { FrownIcon, RssIcon, TwitterIcon } from 'svelte-feather-icons';
  import GenericMessage from './GenericMessage.svelte';

  export let feeds: Feed.Source.FeedSource[];
  export let hiddenFeedIds: string[];
</script>

{#each feeds as feed}
  {#if !hiddenFeedIds.includes(feed._id)}
    <Card outline class="m-4 !overflow-visible">
      <H2 class="flex items-center">
        {#if feed.input.type === 'TWITTER_USER_TIMELINE'}
          <TwitterIcon size="20" class="mr-2" />
        {:else if feed.input.type === 'RSS'}
          <RssIcon size="20" class="mr-2" />
        {/if}
        <a href={`/feed/${feed._id}`} use:link> {feed.title}</a>
      </H2>
      <div use:links>
        <Button small rectangle href={`/feed/${feed._id}/manage`}>add to collection</Button>
      </div>

      {feed.input.type}<br />
      {feed.lastChecked}<br />
      {feed.dateCreated}<br />
    </Card>
  {/if}
{:else}
  <GenericMessage>
    <FrownIcon size="20" class="mr-2" />
    No feeds found
  </GenericMessage>
{/each}
