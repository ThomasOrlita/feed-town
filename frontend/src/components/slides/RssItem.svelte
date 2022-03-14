<script lang="ts">
  import server from '@/api/api';
  import { sanitizeUrl } from '@/helpers/url';
  import type { Feed } from '@server/api/Api.types';

  import { H2, Label, Card, Button } from 'attractions';
  import { ExternalLinkIcon, HeartIcon, MessageSquareIcon } from 'svelte-feather-icons';
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

<article class="flex flex-col justify-center w-full h-full">
  <section class="flex flex-col my-10">
    <Card outline class="flex flex-col max-h-[calc(100vh-216px)] m-4 <xs:m-1 !overflow-visible">
      <H2 class="mb-4 font-bold text-3xl <xs:leading-7">
        {title}
      </H2>
      <Label small class="!text-cool-gray-500 !lowercase mb-1">
        {new URL(url).hostname}
      </Label>
      <div class="flex pt-2 <xs:flex-col <xs:gap-2 overflow-auto">
        {#if imageUrl}
          <div class="justify-center mr-4 xs:max-w-[30%] flex max-h-[30vh]">
            <img src={imageUrl} alt={title} class="object-cover" />
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

        <Button class="mt-4 text-sm mr-4" href={`/feed/${feedId}/${itemId}/comments`} small>
          <MessageSquareIcon size="20" />
          <span class="ml-2 <sm:hidden">Comments</span>
        </Button>

        <Button class="mt-4 text-sm <xs:w-full <xs:justify-center" href={sanitizeUrl(url)} filled target="_blank">
          <ExternalLinkIcon size="20" />
          <span class="ml-2">Read more</span>
        </Button>
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
