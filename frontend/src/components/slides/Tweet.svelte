<script lang="ts">
  import { Button } from 'attractions';
  import { links } from 'svelte-routing';

  export let feedId: string;
  export let itemId: string;
  export let url: string;
</script>

<section class="flex flex-col items-center w-full h-full">
  <iframe
    scrolling="no"
    loading="lazy"
    src={`https://platform.twitter.com/embed/Tweet.html?dnt=true&frame=true&hideCard=false&hideThread=false&theme=light&id=${
      new URL(url).pathname.split('status/')[1]
    }`}
    title="Tweet embed" />

  <div class="flex flex-col flex-wrap items-center" use:links>
    <Button class="mt-4 text-sm mr-auto" href={url} target="_blank" outline>Open Tweet</Button>
    <Button class="mt-4 text-sm" href={`/feed/${feedId}/${itemId}/comments`} outline>Comments</Button>
  </div>
</section>

<style>
  iframe {
    margin: auto;
    width: 100%;
    max-width: 550px;
    max-height: 900px;
    flex: 1;
    pointer-events: none;
  }
</style>
