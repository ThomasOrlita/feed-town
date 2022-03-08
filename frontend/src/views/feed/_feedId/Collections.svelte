<script lang="ts">
  import { Button, Card, Checkbox, Divider, H2, Label, Loading, TextField } from 'attractions';
  import { s } from 'attractions/utils';
  import { snackBarMessage } from '@/api/store';
  import { EyeIcon, LockIcon, PackageIcon, PlusIcon, SlidersIcon } from 'svelte-feather-icons';
  import type { Feed } from '@server/api/Api.types';
  import server from '@/api/api';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import { links } from 'svelte-routing';

  export let feedSourceId: string;

  let newCollectionTitle: string;
  let newCollectionLoading: boolean = false;

  let feedCollections: Promise<Feed.Collection.FeedCollection[]>;
  feedCollections = server.getFeedCollections();
</script>

{#await server.getFeed({ feedSourceId })}
  <div class="m-8">
    <Loading />
  </div>
{:then { feed }}
  <SetBreadcrumbs
    items={[
      {
        href: `/feed/${feedSourceId}`,
        text: feed.title,
      },
      {
        href: `/feed/${feedSourceId}/collections`,
        text: 'Manage collections',
      },
    ]} />
  <Card outline class="m-4 !overflow-visible">
    {#await feedCollections then collections}
      <H2 class="flex items-center !mb-4">
        Manage feed {feed.title} in collections
      </H2>
      {#each collections as collection}
        <Checkbox
          class="mb-4"
          disabled={collection.public === true && feed.public === false}
          checked={collection.feedSources.includes(feed._id)}
          on:change={async (event) => {
            if (event.detail.checked) {
              collection.feedSources = [...collection.feedSources, feed._id];
            } else {
              collection.feedSources = collection.feedSources.filter((id) => id !== feed._id);
            }

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
              feedCollections = server.getFeedCollections();
            }
          }}>
          <div class="ml-4 flex flex-col">
            <div class="flex items-center">
              {#if collection.public === true && feed.public === false}
                <LockIcon size="16" class="-ml-1 mr-1.5" />
              {/if}
              {collection.title}
            </div>
            <Label class="w-full" small>{collection.feedSources.length} feed{s(collection.feedSources.length)}</Label>
          </div>
          <div class="flex ml-auto pl-1" use:links>
            <Button small round neutral class="ml-1" href={`/collection/${collection._id}/`}>
              <EyeIcon size="16" />
              <span class="ml-2 <sm:hidden">View</span>
            </Button>
            <Button small round neutral class="ml-1" href={`/collection/${collection._id}/manage`}>
              <SlidersIcon size="16" />
              <span class="ml-2 <sm:hidden">Manage</span>
            </Button>
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

                try {
                  const newCollection = await server.addFeedCollection({
                    title: newCollectionTitle,
                  });
                  await server.addFeedToCollection({
                    collectionId: newCollection._id,
                    feedId: feed._id,
                  });
                } catch (error) {
                  snackBarMessage.set(error.message);
                } finally {
                  feedCollections = server.getFeedCollections();
                  newCollectionTitle = '';
                  newCollectionLoading = false;
                }
              }}>
              <PlusIcon size="20" class="mr-2" />
              Create collection
            </Button>
          </div>
        </div>
      {/if}
    {/await}
  </Card>

  <div class="flex flex-col items-start mx-4 my-2" use:links>
    <Button filled href={`/feed/${feedSourceId}/manage`}>
      <SlidersIcon size="20" class="mr-2" />
      Manage feed options
    </Button>
  </div>
{/await}
