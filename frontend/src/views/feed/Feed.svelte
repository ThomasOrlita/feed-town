<script lang="ts">
  import { Card, Label, Loading } from 'attractions';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import { AlertCircleIcon, ClockIcon, EditIcon } from 'svelte-feather-icons';
  import { Link, navigate, links } from 'svelte-routing';

  import server from '@/api/api';
  import FeedItems from '@/components/feeds/FeedItems.svelte';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';

  export let feedId: string;

  if (location.hash.slice(1).length === 24) {
    // feed item id is specified in hash
    // todo show in feed
    // navigate(`/feed/${feedId}/${location.hash.slice(1)}/comments`);
  }
</script>

{#await server.getFeed({ feedId })}
  <div class="m-auto">
    <Loading />
  </div>
{:then result}
  <SetBreadcrumbs
    items={[
      {
        href: `/feed/${result.feed._id}`,
        text: result.feed.title,
      },
    ]} />

  <nav class="-mt-2 -mx-2 px-4 py-2 bg-light-200 border-b-gray-200 border-b-width-1px">
    <section class="flex flex-row" use:links>
      <div class="flex items-center">
        <ClockIcon size="20" class="mr-1.5" />
        <Label small class="!text-inherit">Last updated:</Label>
      </div>
      <Link to={`/feed/${result.feed._id}/manage`} class="flex items-center ml-auto">
        <EditIcon size="20" class="mr-1.5" />
        <Label small class="<sm:hidden !text-inherit">Manage feed</Label>
      </Link>
    </section>
  </nav>

  <FeedItems posts={result.items} />
{:catch error}
  <GenericMessage>
    <AlertCircleIcon size="20" class="mr-2" />
    {error.message}
  </GenericMessage>
{/await}
