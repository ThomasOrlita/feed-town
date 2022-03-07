<script lang="ts">
  import { Button, Card, H2, Label, Loading } from 'attractions';
  import { AlertCircleIcon, HeartIcon } from 'svelte-feather-icons';
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
  export let feedSourceId: string;
  export let itemId: string;

  let isLiked: boolean;

  const getFeedItem = async () => {
    const feedItem = await server.getFeedItem({ itemId });

    isLiked = feedItem.item.likes.includes(localStorage.getItem('id'));

    server.markFeedItemAsViewed({
      itemId,
    });

    return feedItem;
  };
</script>

{#key latestCommentId}
  {#await getFeedItem()}
    <div class="m-auto">
      <Loading />
    </div>
  {:then feedItem}
    <SetBreadcrumbs
      items={[
        {
          href: `/feed/${feedItem.feed._id}`,
          text: feedItem.feed.title,
        },
        {
          href: `/feed/${feedItem.feed._id}/${feedItem.item._id}`,
          text: feedItem.item.content.title.slice(0, 32),
        },
        {
          href: `/feed/${feedItem.feed._id}/${feedItem.item._id}/comments`,
          text: `Comments`,
        },
      ]} />

    <Card outline class="m-4 !overflow-visible">
      <H2>
        <a
          href={feedItem.item.content.url.startsWith('https://') ? feedItem.item.content.url : 'about:invalid'}
          class="hover:underline"
          target="_blank">
          {feedItem.item.content.title}
        </a>
      </H2>
      <Label small class="!text-cool-gray-500 !lowercase">
        {new URL(feedItem.item.content.url).hostname}
      </Label>
      <Button
        class="mt-4 mr-auto place-self-center"
        round
        on:click={async () => {
          isLiked = !isLiked;
          await server.likeFeedItem({
            itemId,
            liked: isLiked,
          });
        }}>
        <HeartIcon size="20" class={(isLiked ? 'fill-$main' : '') + ' mr-2'} />
        {isLiked ? 'Added' : 'Add'} to favorites
      </Button>
    </Card>

    <Card outline class="m-4 !overflow-visible">
      <NewCommentForm feedItemId={itemId} on:comment={newComment} />
    </Card>

    <CommentsList comments={feedItem.commentsPopulated} />
  {:catch error}
    <GenericMessage>
      <AlertCircleIcon size="20" class="mr-2" />
      {error.message}
    </GenericMessage>
  {/await}
{/key}
