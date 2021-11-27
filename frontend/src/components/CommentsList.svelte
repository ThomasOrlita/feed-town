<script lang="ts">
  import type { Feed } from '../../../server/api/Api.types';
  import { link } from 'svelte-routing';
  import { Button, Card, H2, Label } from 'attractions';
  import { FrownIcon, RssIcon, TwitterIcon } from 'svelte-feather-icons';
  import GenericMessage from './GenericMessage.svelte';

  export let comments: Feed.Item.Comment[];
</script>

{#each comments ?? [] as comment}
  <Card outline class="m-4 !overflow-visible">
    <Label>{comment.author}</Label>

    <Label small>{comment.dateCreated}</Label>
    <div class="mt-2">
      {comment.content}
    </div>
  </Card>
{:else}
  <GenericMessage>
    <FrownIcon size="20" class="mr-2" />
    No comments
  </GenericMessage>
{/each}
