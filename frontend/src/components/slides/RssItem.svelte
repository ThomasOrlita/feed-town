<script lang="ts">
  import { Headline, Subhead, H1, H2, H3, Label, Card, Button } from 'attractions';
  import { links } from 'svelte-routing';

  export let feedId: string;
  export let itemId: string;
  export let title: string;
  export let imageUrl: string;
  export let description: string;
  export let url: string;
</script>

<article class="flex flex-col w-full">
  <section class="flex flex-col my-10">
    <Card outline class="m-4 !overflow-visible">
      <H2 class="mb-4 font-bold text-3xl">
        {title}
      </H2>
      <div class="flex flex-row">
        {#if imageUrl}
          <div class="justify-center" style="max-width: 30%;">
            <img src={imageUrl} alt={title} />
          </div>
        {/if}
        <div class="flex-1 p-4">
          <div
            style="
                            display: -webkit-box;
                            -webkit-line-clamp: 8;
                            -webkit-box-orient: vertical;
                            overflow: hidden;">
            {description}
          </div>
        </div>
      </div>
      <div class="flex flex-row flex-wrap" use:links>
        <Button class="mt-4 text-sm mr-auto" href={url} outline target="_blank">Read more</Button>
        <Button class="mt-4 text-sm" href={`/feed/${feedId}/${itemId}/comments`} outline>Comments</Button>
      </div>
    </Card>
  </section>
</article>
