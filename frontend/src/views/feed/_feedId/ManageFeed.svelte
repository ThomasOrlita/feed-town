<script lang="ts">
    import server from '@/api/api';
    import { snackBarMessage } from '@/api/store';
    import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
    import type { Feed } from '@server/api/Api.types';
    import { Button, Card, Checkbox, FormField, H2, Label, Loading, TextField } from 'attractions';
    import { CheckIcon, EditIcon, GlobeIcon, LockIcon, TrashIcon, UnlockIcon } from 'svelte-feather-icons';
    import { Link, navigate, links } from 'svelte-routing';

    let feedSource: Feed.Source.FeedSource;
    $: {
        server
            .getFeed({ feedSourceId })
            .then(({ feed }) => {
                feedSource = feed;
            })
            .catch((error) => {
                snackBarMessage.set(error.message);
            });
    }

    export let feedSourceId: string;
</script>

{#if !feedSource}
    <div class="m-8">
        <Loading />
    </div>
{:else}
    <SetBreadcrumbs
        items={[
            {
                href: `/feed/${feedSource._id}`,
                text: feedSource.title,
            },
            {
                href: `/feed/${feedSource._id}/manage`,
                text: 'Manage feed',
            },
        ]} />

    <Card outline class="m-4 !overflow-visible">
        <H2 class="flex items-center">
            {feedSource.title}
        </H2>
        <div class="flex flex-col items-start gap-3 mt-4 mx-1.5 mb-2">
            <Label>Created</Label> <span class="text-sm -mt-2">{new Date(feedSource.dateCreated).toLocaleDateString()}</span>
            <Label>Visibility</Label>
            <span class="text-sm -mt-2 flex items-center">
                {#if feedSource.public}
                    <GlobeIcon size="16" class="mr-2" />
                    Public
                {:else}
                    <LockIcon size="16" class="mr-2" />
                    Private
                {/if}
            </span>
            <Label>Last updated</Label> <span class="text-sm -mt-2">{new Date(feedSource.lastChecked).toLocaleString()}</span>
            {#if feedSource.input.type === 'RSS'}
                <Label>Type</Label> <span class="text-sm -mt-2">RSS source</span>
                <Label>URL</Label> <span class="text-sm -mt-2 break-all">{feedSource.input.url}</span>
            {:else if feedSource.input.type === 'TWITTER_USER_TIMELINE'}
                <Label>Type</Label> <span class="text-sm -mt-2">Twitter timeline</span>
                <Label>Username</Label> <span class="text-sm -mt-2">@{feedSource.input.username}</span>
            {:else if feedSource.input.type === 'REDDIT_SUBREDDIT'}
                <Label>Type</Label> <span class="text-sm -mt-2">Reddit</span>
                <Label>Subreddit</Label> <span class="text-sm -mt-2">r/{feedSource.input.subreddit}</span>
            {:else if feedSource.input.type === 'WIKIPEDIA_ARTICLE'}
                <Label>Type</Label> <span class="text-sm -mt-2">Wikipedia</span>
            {/if}
            {#if localStorage.getItem('id') !== feedSource.owner}
                {#await server.getPublicAccountInfo(feedSource.owner) then ownerUser}
                    <Label>Owner</Label>
                    <span class="flex items-center text-sm -mt-2">
                        <img src={ownerUser.avatarUrl} class="max-w-6 max-h-6 mr-2 place-self-center rounded-1" alt={ownerUser.username} />
                        {ownerUser.username}
                    </span>
                {/await}
            {/if}
        </div>

        {#if localStorage.getItem('id') === feedSource.owner}
            <FormField>
                <TextField label="Feed title" placeholder="New feed title" outline bind:value={feedSource.title} />
            </FormField>
            <div class="flex flex-row flex-wrap-reverse gap-4 justify-end">
                {#if !feedSource.public}
                    <Button
                        small
                        outline
                        neutral
                        on:click={async () => {
                            try {
                                if (!confirm(`Are you sure you want to make the "${feedSource.title}" feed public? This cannot be undone.`))
                                    return;
                                await server.setFeedSourceAsPublic({
                                    feedSourceId,
                                });
                                feedSource.public = true;
                            } catch (error) {
                                snackBarMessage.set(error.message);
                            }
                        }}>
                        <UnlockIcon size="20" class="mr-2" />
                        Make public
                    </Button>
                {/if}
                <Button
                    small
                    outline
                    danger
                    on:click={async () => {
                        if (!confirm(`Do you want to delete the "${feedSource.title}" feed? It will also be deleted from all collections.`))
                            return;
                        try {
                            await server.deleteFeedSource({ feedSourceId: feedSource._id });
                            snackBarMessage.set(`Feed "${feedSource.title}" deleted`);
                            navigate(`/feeds/`);
                        } catch (error) {
                            snackBarMessage.set(error.message);
                        }
                    }}>
                    <TrashIcon size="20" class="mr-2" />
                    Remove feed
                </Button>
                <Button
                    filled
                    small
                    on:click={async () => {
                        try {
                            await server.renameFeedSource({
                                feedSourceId: feedSource._id,
                                title: feedSource.title,
                            });
                            snackBarMessage.set('Feed title updated');
                        } catch (error) {
                            snackBarMessage.set(error.message);
                        }
                    }}>
                    <CheckIcon size="20" class="mr-2" />
                    Update title
                </Button>
            </div>
        {/if}
    </Card>

    <div class="flex flex-col items-start mx-4 my-2" use:links>
        <Button filled href={`/feed/${feedSourceId}/collections`}>
            <EditIcon size="20" class="mr-2" />
            Manage feed {feedSource.title} in collections
        </Button>
    </div>
{/if}
