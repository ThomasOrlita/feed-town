<script lang="ts">
  import { Card, Loading } from 'attractions';
  import FeedList from '../components/FeedList.svelte';

  import server from '../api/api';
  import { AlertCircleIcon } from 'svelte-feather-icons';
</script>

{#await server.getFeeds()}
  <div class="m-auto">
    <Loading />
  </div>
{:then feeds}
  <FeedList {feeds} />
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
