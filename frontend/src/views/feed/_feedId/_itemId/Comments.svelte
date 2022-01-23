<script lang="ts">
  import { Card, H2, Loading } from 'attractions';
  import { AlertCircleIcon } from 'svelte-feather-icons';
  import { Link } from 'svelte-routing';

  import server from '@/api/api';
  import CommentsList from '@/components/comments/CommentsList.svelte';
  import NewCommentForm from '@/components/comments/NewCommentForm.svelte';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';

  let latestCommentId: string;
  const newComment = (event: CustomEvent) => {
    latestCommentId = event.detail.commentId;
  };
  export let feedId: string;
  export let itemId: string;
</script>

{#key latestCommentId}
  {#await server.getFeedItem({ itemId })}
    <div class="m-auto">
      <Loading />
    </div>
  {:then result}
    <SetBreadcrumbs
      items={[
        {
          href: `/feed/${result.feed._id}`,
          text: result.feed.title,
        },
        {
          href: `/feed/${result.feed._id}/${result.item._id}`,
          text: result.item.content.title.slice(0, 32),
        },
        {
          href: `/feed/${result.feed._id}/${result.item._id}/comments`,
          text: `Comments`,
        },
      ]} />

    <Card outline class="m-4 !overflow-visible">
      <H2><Link to={`/feed/${feedId}/${itemId}/comments`} class="hover:underline">{result.item.content.title}</Link></H2>
    </Card>

    <Card outline class="m-4 !overflow-visible">
      <NewCommentForm feedItemId={itemId} on:comment={newComment} />
    </Card>

    <CommentsList comments={result.item.comments} />
  {:catch error}
    <GenericMessage>
      <AlertCircleIcon size="20" class="mr-2" />
      {error.message}
    </GenericMessage>
  {/await}
{/key}
