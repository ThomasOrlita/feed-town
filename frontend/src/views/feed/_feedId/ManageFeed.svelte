<script lang="ts">
    import server from '@/api/api';
    import { snackBarMessage } from '@/api/store';
    import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
    import type { Feed } from '@server/api/Api.types';
    import { Button, Card, Checkbox, FormField, H2, Label, Loading, TextField } from 'attractions';
    import { onMount } from 'svelte';
    import { CheckIcon, EditIcon, GlobeIcon, LockIcon, TrashIcon } from 'svelte-feather-icons';
    import { Link, navigate, links } from 'svelte-routing';

    let feedSource: Feed.Source.FeedSource;
    onMount(async () => {
        try {
            feedSource = (await server.getFeed({ feedSourceId })).feed;
        } catch (error) {
            snackBarMessage.set(error.message);
        }
    });

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
                <LockIcon size="16" class="mr-2" />
                Private
                <GlobeIcon size="16" class="mr-2" />
                Public
            </span>
            <Label>Last updated</Label> <span class="text-sm -mt-2">{new Date(feedSource.lastChecked).toLocaleString()}</span>
            {#if feedSource.input.type === 'RSS'}
                <Label>Type</Label> <span class="text-sm -mt-2">RSS source</span>
                <Label>URL</Label> <span class="text-sm -mt-2">{feedSource.input.url}</span>
            {:else if feedSource.input.type === 'TWITTER_USER_TIMELINE'}
                <Label>Type</Label> <span class="text-sm -mt-2">Twitter timeline</span>
                <Label>Username</Label> <span class="text-sm -mt-2">@{feedSource.input.username}</span>
            {:else if feedSource.input.type === 'REDDIT_SUBREDDIT'}
                <Label>Type</Label> <span class="text-sm -mt-2">Reddit</span>
                <Label>Subreddit</Label> <span class="text-sm -mt-2">r/{feedSource.input.subreddit}</span>
            {:else if feedSource.input.type === 'WIKIPEDIA_ARTICLE'}
                <Label>Type</Label> <span class="text-sm -mt-2">Wikipedia</span>
            {/if}
        </div>

        {#if localStorage.getItem('id') === feedSource.owner}
            <FormField>
                <TextField label="Feed title" placeholder="New feed title" outline bind:value={feedSource.title} />
            </FormField>
            <div class="flex flex-row flex-wrap-reverse gap-4 justify-end">
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
