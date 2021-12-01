<script lang="ts">
  import { Button, Checkbox, Divider, Label, Loading, TextField } from 'attractions';
  import { s } from 'attractions/utils';
  import { PackageIcon, PlusIcon, XIcon } from 'svelte-feather-icons';
  import type { Feed } from '../../../server/api/Api.types';
  import server from '../api/api';
  import ModalDialog from './ModalDialog.svelte';

  let modalOpen: boolean = false;
  let feedId: string;

  let newCollectionTitle: string;
  let newCollectionLoading: boolean = false;

  let feedCollections: Promise<Feed.Collection.FeedCollection[]>;
  export const open = (feedIdToAdd: string) => {
    feedCollections = server.getFeedCollections();
    modalOpen = true;
    feedId = feedIdToAdd;
  };
</script>

<ModalDialog bind:open={modalOpen} noClickaway title="Add feed to collection">
  {#if feedCollections}
    {#await feedCollections}
      <div class="m-8">
        <Loading />
      </div>
    {:then collections}
      {#each collections as collection}
        <Checkbox
          class="mb-4"
          checked={collection.feedSources.includes(feedId)}
          on:change={async (event) => {
            if (event.detail.checked) {
              await server.addFeedToCollection({
                collectionId: collection._id,
                feedId: feedId,
              });
            } else {
              await server.removeFeedFromCollection({
                collectionId: collection._id,
                feedId: feedId,
              });
            }
            collections = await server.getFeedCollections();
          }}>
          <div class="ml-4 flex flex-col">
            {collection.title} <small>{collection._id}</small>
            {collection.feedSources.join(',')}
            <Label class="w-full" small>{collection.feedSources.length} feed{s(collection.feedSources.length)}</Label>
          </div>
        </Checkbox>
      {/each}

      {#if collections.length === 0}
        <div class="my-6 flex items-center">
          <PackageIcon size="20" class="mr-4 flex-shrink-0" />
          Collections allow you to organize feeds together and view them in one place.
        </div>
      {:else}
        <Divider class="!mt-6 mb-6" />
      {/if}

      {#if newCollectionLoading}
        <div class="m-4">
          <Loading />
        </div>
      {:else}
        <div class="flex <sm:flex-col">
          <TextField
            class="flex-1"
            outline
            label="Add to new collection"
            placeholder="New collection title"
            bind:value={newCollectionTitle} />
          <div class="flex items-end ml-2 <sm:mt-2 <sm:ml-auto">
            <Button
              on:click={async () => {
                newCollectionLoading = true;
                const newCollection = await server.addFeedCollection({
                  title: newCollectionTitle,
                });
                await server.addFeedToCollection({
                  collectionId: newCollection._id,
                  feedId,
                });
                collections = await server.getFeedCollections();
                newCollectionTitle = '';
                newCollectionLoading = false;
              }}>
              <PlusIcon size="20" class="mr-2" />
              Create collection
            </Button>
          </div>
        </div>
      {/if}
    {/await}
  {/if}
</ModalDialog>
