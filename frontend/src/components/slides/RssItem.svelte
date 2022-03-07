<script lang="ts">
  import server from '@/api/api';
  import type { Feed } from '@server/api/Api.types';

  import { Headline, Subhead, H1, H2, H3, Label, Card, Button } from 'attractions';
  import { HeartIcon } from 'svelte-feather-icons';
  import { links } from 'svelte-routing';

  export let type: Feed.Type;
  export let feedId: string;
  export let itemId: string;
  export let title: string;
  export let imageUrl: string;
  export let description: string;
  export let url: string;
  export let isLiked: boolean = false;
</script>

<article class="flex flex-col w-full">
  <section class="flex flex-col my-10">
    <Card outline class="m-4 <mobile:m-1 !overflow-visible">
      <H2 class="mb-4 font-bold text-3xl <mobile:leading-7">
        {title}
      </H2>
      <Label small class="!text-cool-gray-500 !lowercase mb-1">
        {new URL(url).hostname}
      </Label>
      <div class="flex flex-row pt-2">
        {#if imageUrl}
          <div class="justify-center mr-4" style="max-width: 30%;">
            <img src={imageUrl} alt={title} />
          </div>
        {/if}
        {#if type !== 'REDDIT_SUBREDDIT'}
          <div class="flex-1">
            <div class="description">
              {description}
            </div>
          </div>
        {/if}
      </div>
      <div class="flex flex-row flex-wrap" use:links>
        <Button
          class="mt-4 mr-auto place-self-center"
          round
          on:click={async () => {
            isLiked = !isLiked;
            await server.likeFeedItem({
              itemId,
              liked: isLiked,
            });
          }}>
          <HeartIcon size="20" class={isLiked ? 'fill-$main' : ''} />
        </Button>

        <Button class="mt-4 text-sm mr-4" href={`/feed/${feedId}/${itemId}/comments`} small>Comments</Button>

        <Button
          class="mt-4 text-sm <mobile:w-full <mobile:justify-center"
          href={url.startsWith('https://') ? url : 'about:invalid'}
          filled
          target="_blank">Read more</Button>
      </div>
    </Card>
  </section>
</article>

<style>
  .description {
    display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
