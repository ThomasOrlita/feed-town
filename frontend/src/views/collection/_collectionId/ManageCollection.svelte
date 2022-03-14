<script lang="ts">
  import server from '@/api/api';
  import { snackBarMessage } from '@/api/store';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import type { Feed } from '@server/api/Api.types';
  import { Button, Card, Checkbox, FormField, H2, Label, Loading, TextField } from 'attractions';
  import { CheckIcon, CopyIcon, EyeIcon, GlobeIcon, LockIcon, SlidersIcon, TrashIcon, UnlockIcon } from 'svelte-feather-icons';
  import { navigate, links } from 'svelte-routing';

  let collection: Feed.Collection.FeedCollectionWithFeedSources;

  $: {
    server
      .getFeedCollection({ feedCollectionId })
      .then((feedCollection) => {
        collection = feedCollection;
      })
      .catch((error) => {
        snackBarMessage.set(error.message);
      });
  }

  const getCollectionFeedSources = async () => {
    let feedSources = [...collection.feedSources];
    if (localStorage.getItem('id') === collection.owner) {
      feedSources.push(...(await server.getFeeds()));
    }
    return feedSources.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
  };

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
        {#if collection.public}
          <GlobeIcon size="16" class="mr-2" />
          Public
        {:else}
          <LockIcon size="16" class="mr-2" />
          Private
        {/if}
      </span>
      {#if localStorage.getItem('id') !== collection.owner}
        {#await server.getPublicAccountInfo(collection.owner) then ownerUser}
          <Label>Owner</Label>
          <span class="flex items-center text-sm -mt-2">
            <img src={ownerUser.avatarUrl} class="max-w-6 max-h-6 mr-2 place-self-center rounded-1" alt={ownerUser.username} />
            {ownerUser.username}
          </span>
        {/await}
        <div class="flex flex-row justify-end mt-2 w-full">
          <Button
            small
            outline
            neutral
            on:click={async () => {
              try {
                const { _id: newFeedCollectionId } = await server.addFeedCollection({
                  title: 'Copy of ' + collection.title,
                });

                let feedSourceAddPromises = [];
                for (const feedSource of collection.feedSources) {
                  feedSourceAddPromises.push(
                    server.addFeedToCollection({
                      collectionId: newFeedCollectionId,
                      feedId: feedSource._id,
                    })
                  );
                }
                await Promise.all(feedSourceAddPromises);

                navigate(`/collection/${newFeedCollectionId}/manage`);
              } catch (error) {
                snackBarMessage.set(error.message);
              }
            }}>
            <CopyIcon size="20" class="mr-2" />
            Duplicate this collection
          </Button>
        </div>
      {/if}
    </div>

    {#if localStorage.getItem('id') === collection.owner}
      <FormField>
        <TextField label="Collection title" placeholder="New collection title" outline bind:value={collection.title} />
      </FormField>
      <div class="flex flex-row flex-wrap-reverse gap-4 justify-end">
        {#if !collection.public}
          <Button
            small
            outline
            neutral
            on:click={async () => {
              try {
                if (
                  !confirm(
                    `Are you sure you want to make the "${collection.title}" collection public? All feeds in this collection will become public as well. This cannot be undone.`
                  )
                )
                  return;
                await server.setFeedCollectionAsPublic({
                  feedCollectionId: collection._id,
                });
                collection.public = true;
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
    {#await getCollectionFeedSources() then feeds}
      <H2 class="flex items-center !mb-4">
        Manage feeds in collection {collection.title}
      </H2>
      {#each feeds as feed}
        <Checkbox
          class="flex mb-4"
          disabled={localStorage.getItem('id') !== collection.owner || (collection.public === true && feed.public === false)}
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
          <div class="ml-4 flex flex-row items-center">
            {#if collection.public === true && feed.public === false}
              <LockIcon size="16" class="-ml-1 mr-1.5" />
            {/if}
            {feed.title}
          </div>

          <div class="flex ml-auto pl-1" use:links>
            <Button small round neutral class="ml-1" href={`/feed/${feed._id}/`}>
              <EyeIcon size="16" />
              <span class="ml-2 <sm:hidden">View</span>
            </Button>
            <Button small round neutral class="ml-1" href={`/feed/${feed._id}/manage`}>
              <SlidersIcon size="16" />
              <span class="ml-2 <sm:hidden">Manage</span>
            </Button>
          </div>
        </Checkbox>
      {/each}
    {/await}
  </Card>
{/if}
