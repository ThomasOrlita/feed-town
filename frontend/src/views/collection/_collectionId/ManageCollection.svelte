<script lang="ts">
  import { Button, Card, Checkbox, Divider, FormField, H2, Label, Loading, TextField } from 'attractions';
  import server from '@/api/api';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import { snackBarMessage } from '@/api/store';
  import { onMount } from 'svelte';
  import type { Feed } from '@server/api/Api.types';
  import { CheckIcon } from 'svelte-feather-icons';

  let collection: Feed.Collection.FeedCollectionWithFeedSources;
  onMount(async () => {
    try {
      collection = await server.getFeedCollection({ feedCollectionId });
    } catch (error) {
      snackBarMessage.set(error.message);
    }
  });

  let collectionTitle: string;
  export let feedCollectionId: string;
</script>

{#if !collection}
  <div class="m-8">
    <Loading />
  </div>
{:else}
  <SetBreadcrumbs
    items={[
      {
        href: `/collection/${collection._id}`,
        text: collection.title,
      },
      {
        href: `/collection/${collection._id}/manage`,
        text: 'Manage collection',
      },
    ]} />
  <Card outline class="m-4 !overflow-visible">
    <FormField name="Collection title">
      <TextField placeholder="New collection title" bind:value={collection.title} />
    </FormField>
    <Button
      filled
      small
      on:click={() => {
        alert('todo update title');
      }}>
      <CheckIcon size="20" class="mr-2" />
      Update title
    </Button>
  </Card>
  <Card outline class="m-4 !overflow-visible">
    {#await server.getFeeds() then feeds}
      <H2 class="flex items-center !mb-4">
        Manage feeds in collection {collection.title}
      </H2>
      {#each feeds as feed}
        <Checkbox
          class="mb-4"
          checked={collection.feedSources.map((feedSource) => feedSource._id).includes(feed._id)}
          on:change={async (event) => {
            try {
              const params = {
                collectionId: collection._id,
                feedId: feed._id,
              };
              if (event.detail.checked) {
                await server.addFeedToCollection(params);
              } else {
                await server.removeFeedFromCollection(params);
              }
            } catch (error) {
              snackBarMessage.set(error.message);
              feeds = await server.getFeeds();
            }
          }}>
          <div class="ml-4 flex flex-col">
            {feed.title}
            <Label class="w-full" small><small>{feed._id}</small></Label>
          </div>
        </Checkbox>
      {/each}
    {/await}
  </Card>
{/if}
