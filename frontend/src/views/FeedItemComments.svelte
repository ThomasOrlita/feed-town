<script lang="ts">
    import { Card, Loading } from 'attractions';
    import { AlertCircleIcon } from 'svelte-feather-icons';

    import server from '../api/api';
    import CommentsList from '../components/CommentsList.svelte';
    import NewCommentForm from '../components/NewCommentForm.svelte';

    export let feedId: string;
    export let itemId: string;
</script>

{#await server.getFeedItem({ itemId })}
    <div class="m-auto">
        <Loading />
    </div>
{:then feedItem}
    {feedItem.content.title}

    <Card outline class="m-4">
        <NewCommentForm feedItemId={itemId} />
    </Card>

    <CommentsList comments={feedItem.comments} />
{:catch error}
    <div class="m-auto">
        <Card outline class="m-4">
            <p class="flex items-center">
                <AlertCircleIcon size="20" class="mr-2" />
                {error.message}
            </p>
        </Card>
    </div>
{/await}
