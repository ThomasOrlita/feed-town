<script lang="ts">
    import type { Feed } from '../../../server/api/Api.types';
    import { link } from 'svelte-routing';
    import { Button, Card, FormField, H2, Loading, TextField } from 'attractions';
    import { FrownIcon, RssIcon, SendIcon, TwitterIcon } from 'svelte-feather-icons';

    let content: string = '';
    let loading: boolean = false;

    const addComment = () => {
        loading = true;
    };

    export let feedItemId: string;
</script>

<FormField name="Add New Comment">
    <TextField bind:value={content} placeholder="Comment" />
</FormField>

{#if loading}
    <Loading />
{:else}
    <Button filled on:click={addComment} disabled={loading} class="ml-auto">
        <SendIcon size="20" class="mr-2" />
        Add Comment
    </Button>
{/if}
