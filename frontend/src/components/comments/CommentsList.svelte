<script lang="ts">
  import type { Feed } from '@server/api/Api.types';
  import { Card, Label } from 'attractions';
  import { FrownIcon } from 'svelte-feather-icons';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';

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
