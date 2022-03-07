<script lang="ts">
  import server from '@/api/api';
  import { snackBarMessage } from '@/api/store';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import type { Feed } from '@server/api/Api.types';
  import { Button, Card, Checkbox, FormField, H2, Label, Loading, TextField } from 'attractions';
  import { onMount } from 'svelte';
  import { CheckIcon, TrashIcon } from 'svelte-feather-icons';
  import { navigate } from 'svelte-routing';

  let collection: Feed.Collection.FeedCollectionWithFeedSources;
  onMount(async () => {
    try {
      collection = await server.getFeedCollection({ feedCollectionId });
    } catch (error) {
      snackBarMessage.set(error.message);
    }
  });

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
    <H2 class="flex items-center">
      {collection.title}
    </H2>
    <div class="flex flex-col items-start gap-3 mt-4 mx-1.5 mb-2">
      <Label>Created</Label> <span class="text-sm -mt-2">{new Date(collection.dateCreated).toLocaleDateString()}</span>
    </div>

    <FormField>
      <TextField label="Collection title" placeholder="New collection title" outline bind:value={collection.title} />
    </FormField>
    <div class="flex flex-row flex-wrap-reverse gap-4 justify-end">
      <Button
        small
        outline
        danger
        on:click={async () => {
          if (!confirm(`Do you want to delete the "${collection.title}" collection? Existing feeds will not be deleted.`)) return;
          try {
            await server.deleteFeedCollection({ feedCollectionId });
            snackBarMessage.set(`Collection "${collection.title}" deleted`);
            navigate(`/feeds/`);
          } catch (error) {
            snackBarMessage.set(error.message);
          }
        }}>
        <TrashIcon size="20" class="mr-2" />
        Remove collection
      </Button>
      <Button
        filled
        small
        on:click={async () => {
          try {
            await server.renameFeedCollection({
              feedCollectionId,
              title: collection.title,
            });
            snackBarMessage.set('Collection title updated');
          } catch (error) {
            snackBarMessage.set(error.message);
          }
        }}>
        <CheckIcon size="20" class="mr-2" />
        Update title
      </Button>
    </div>
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
