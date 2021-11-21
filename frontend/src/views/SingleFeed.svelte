<script lang="ts">
  import { Loading } from 'attractions';

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
  <Feed posts={result.items} />
{/await}
