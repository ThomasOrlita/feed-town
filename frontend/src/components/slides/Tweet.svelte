<script lang="ts">
  import { Button } from 'attractions';

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

  <Button outline href={url} target="_blank">Open Tweet</Button>
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
