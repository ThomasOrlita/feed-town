<script lang="ts">
  import { link } from 'svelte-routing';
  import { Button, Card, FormField, H2, H3, Label, Loading, TextField } from 'attractions';
  import { FrownIcon, RssIcon, SendIcon, TwitterIcon } from 'svelte-feather-icons';
  import { createEventDispatcher } from 'svelte';
  import server from '../api/api';

  let comment: string = '';
  let loading: boolean = false;

  const dispatch = createEventDispatcher();

  const addComment = async () => {
    loading = true;
    const commentResult = await server.addComment({
      comment,
      itemId: feedItemId,
    });
    loading = false;
    comment = '';

    dispatch('comment', {
      commentId: commentResult._id,
    });
  };

  export let feedItemId: string;
</script>

<H3 class="!mb-4">Add new comment</H3>
<TextField bind:value={comment} placeholder="Comment" class="mb-6" />

{#if loading}
  <Loading />
{:else}
  <Button filled on:click={addComment} disabled={loading} class="ml-auto">
    <SendIcon size="20" class="mr-2" />
    Add Comment
  </Button>
{/if}
