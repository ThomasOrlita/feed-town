<script lang="ts">
  import { Autocomplete, Button, Dialog, FormField, Loading, Modal, TextField } from 'attractions';
  import { PlusIcon, XIcon } from 'svelte-feather-icons';
  import type { Feed } from '../../../server/api/Api.types';
  import server from '../api/api';

  let modalOpen: boolean = false;
  let feedId: string;
  let feedCollections: Promise<Feed.Collection.FeedCollection[]>;
  const loadFeedCollections = () => (feedCollections = server.getFeedCollections());

  let newCollectionTitle: string;
  let newCollectionLoading: boolean = false;

  export const open = (feedIdToAdd: string) => {
    loadFeedCollections();
    modalOpen = true;
    feedId = feedIdToAdd;
  };
</script>

<Modal bind:open={modalOpen} let:closeCallback noClickaway>
  <div class="<sm:w-full sm:min-w-lg m-8">
    <Dialog title="Add feed to collection" {closeCallback}>
      {#if feedCollections}
        {#await feedCollections}
          <Loading />
        {:then collections}
          {#each collections as collection}
            {collection._id}
            {collection.title}
            {#if collection.feedSources.includes(feedId)}
              <Button disabled on:click={async () => {}}>
                <XIcon size="20" class="mr-2" />
                remove from {collection.title}</Button>
            {:else}
              <Button
                on:click={async () => {
                  await server.addFeedToCollection({
                    collectionId: collection._id,
                    feedId: feedId,
                  });
                  loadFeedCollections();
                }}>
                <PlusIcon size="20" class="mr-2" />
                add to {collection.title}</Button>
            {/if}
            <br />
          {/each}

          {#if newCollectionLoading}
            <Loading />
          {:else}
            <FormField name="Add to new collection">
              <TextField placeholder="New collection title" bind:value={newCollectionTitle} />
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
                  loadFeedCollections();
                  newCollectionTitle = '';
                  newCollectionLoading = false;
                }}>Add</Button>
            </FormField>
          {/if}
        {/await}
      {/if}
    </Dialog>
  </div>
</Modal>
