<script lang="ts">
  import { Card, Loading } from 'attractions';
  import { AlertCircleIcon } from 'svelte-feather-icons';

  import server from '../api/api';
  import Feed from './../components/Feed.svelte';

  export let feedId: string;
</script>

{#await server.getFeed({ feedId })}
  <div class="m-auto">
    <Loading />
  </div>
{:then result}
  {result.feed.title}
  <Feed {feedId} posts={result.items} />
{:catch error}
  <div class="m-auto">
    <Card outline class="m-4 !overflow-visible">
      <p class="flex items-center">
        <AlertCircleIcon size="20" class="mr-2" />
        {error.message}
      </p>
    </Card>
  </div>
{/await}
