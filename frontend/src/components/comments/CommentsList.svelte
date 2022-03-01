<script lang="ts">
  import type { Feed } from '@server/api/Api.types';
  import { Card, Label } from 'attractions';
  import { FrownIcon } from 'svelte-feather-icons';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';

  export let comments: Feed.Item.CommentWithAuthorPopulated[];
</script>

{#each comments ?? [] as comment}
  <Card outline class="m-4 !overflow-visible">
    <Label class="flex">
      <span class="flex flex-col justify-center mr-1">
        <img src={comment.authorInfo.avatarUrl} class="max-w-5" alt={comment.authorInfo.username} />
      </span>
      {comment.authorInfo.username}
    </Label>
    <Label small>{new Date(comment.dateCreated).toLocaleString()}</Label>
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
