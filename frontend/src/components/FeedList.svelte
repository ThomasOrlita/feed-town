<script lang="ts">
  import type { Feed } from '../../../server/api/Api.types';
  import { link } from 'svelte-routing';
  import { Button, Card, H2 } from 'attractions';
  import { FrownIcon, RssIcon, TwitterIcon } from 'svelte-feather-icons';

  export let feeds: Feed.Source.FeedSource[];
</script>

{#each feeds as feed}
  <Card outline class="m-4 !overflow-visible">
    <H2 class="flex items-center">
      {#if feed.input.type === 'TWITTER_USER_TIMELINE'}
        <TwitterIcon size="20" class="mr-2" />
      {:else if feed.input.type === 'RSS'}
        <RssIcon size="20" class="mr-2" />
      {/if}
      <a href={`/feed/${feed._id}`} use:link> {feed.title}</a>
    </H2>
    <Button small rectangle selected>button</Button>

    {feed.input.type}<br />
    {feed.lastChecked}<br />
    {feed.dateCreated}<br />
  </Card>
{:else}
  <div class="m-auto">
    <Card outline class="m-4 !overflow-visible">
      <p class="flex items-center">
        <FrownIcon size="20" class="mr-2" />
        No feeds found
      </p>
    </Card>
  </div>
{/each}
