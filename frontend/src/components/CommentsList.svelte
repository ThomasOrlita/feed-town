<script lang="ts">
    import type { Feed } from '../../../server/api/Api.types';
    import { link } from 'svelte-routing';
    import { Button, Card, H2 } from 'attractions';
    import { FrownIcon, RssIcon, TwitterIcon } from 'svelte-feather-icons';

    export let comments: Feed.Item.Comment[];
</script>

{#each comments ?? [] as comment}
    <Card outline class="m-4 !overflow-visible">
        {comment.author}
        {comment.content}
        {comment.dateCreated}
    </Card>
{:else}
    <div class="m-auto">
        <Card outline class="m-4 !overflow-visible">
            <p class="flex items-center">
                <FrownIcon size="20" class="mr-2" />
                No comments
            </p>
        </Card>
    </div>
{/each}
