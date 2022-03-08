<script lang="ts">
  import server from '@/api/api';
  import { snackBarMessage } from '@/api/store';
  import App from '@/App.svelte';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import Account from '@/views/Account.svelte';
  import type { Feed } from '@server/api/Api.types';
  import { Button, Card, Checkbox, FormField, H2, Label, Loading, TextField } from 'attractions';
  import { onMount } from 'svelte';
  import { CheckIcon, EyeIcon, GlobeIcon, LockIcon, SlidersIcon, TrashIcon } from 'svelte-feather-icons';
  import { navigate, links } from 'svelte-routing';

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
      <Label>Visibility</Label>
      <span class="text-sm -mt-2 flex items-center">
        <LockIcon size="16" class="mr-2" />
        Private
        <GlobeIcon size="16" class="mr-2" />
        Public
      </span>
    </div>

    {#if localStorage.getItem('id') === collection.owner}
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
    {/if}
  </Card>

  <Card outline class="m-4 !overflow-visible">
    {#await localStorage.getItem('id') !== collection.owner ? collection.feedSources : server.getFeeds() then feeds}
      <H2 class="flex items-center !mb-4">
        Manage feeds in collection {collection.title}
      </H2>
      {#each feeds as feed}
        <Checkbox
          class="flex mb-4"
          disabled={localStorage.getItem('id') !== collection.owner}
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
          </div>

          <div class="flex ml-auto pl-1" use:links>
            <Button small round neutral class="ml-1" href={`/feed/${feed._id}/`}>
              <EyeIcon size="16" class="mr-2" />
              <span class="<sm:hidden">View</span>
            </Button>
            <Button small round neutral class="ml-1" href={`/feed/${feed._id}/manage`}>
              <SlidersIcon size="16" class="mr-2" />
              <span class="<sm:hidden">Manage</span>
            </Button>
          </div>
        </Checkbox>
      {/each}
    {/await}
  </Card>
{/if}
