<script lang="ts">
    import { Headline, Subhead, H2, H3, Label, Button, Loading, Card, H1 } from 'attractions';
    import { Link } from 'svelte-routing';
    import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
    import { AlertCircleIcon, CheckIcon, HeartIcon, LogOutIcon, RssIcon, UserIcon } from 'svelte-feather-icons';
    import GitHubLogin from './account/GitHubLogin.svelte';
    import server from '@/api/api';
    import GenericMessage from '@/components/layout/GenericMessage.svelte';
</script>

<SetBreadcrumbs
    items={[
        {
            href: `/favorites`,
            text: `Favorites`,
        },
    ]} />
<Card outline class="m-4 !overflow-visible">
    <H2 class="flex items-center">
        <HeartIcon size="20" class="mr-2" />
        Favorite posts
    </H2>

    {#await server.getLikedFeedItems()}
        <div class="m-auto">
            <Loading />
        </div>
    {:then likedFeedItems}
        <div class="flex flex-col gap-3 ml-7">
            {#each likedFeedItems as feedItem}
                <div class="flex items-center">
                    <div class="flex-1">
                        <Link to={`/feed/${feedItem.feedId}/${feedItem._id}/comments`}>
                            <H3 class="!text-sm">{feedItem.content.title}</H3>
                        </Link>
                    </div>
                </div>
            {:else}
                <Label small class="!text-inherit">You haven't liked any posts yet.</Label>
            {/each}
        </div>
    {:catch error}
        <GenericMessage>
            <AlertCircleIcon size="20" class="mr-2" />
            {error.message}
        </GenericMessage>
    {/await}
</Card>
