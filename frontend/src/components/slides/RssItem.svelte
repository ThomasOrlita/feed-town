<script lang="ts">
  import { Headline, Subhead, H1, H2, H3, Label } from 'attractions';

  export let title: string;
  export let imageUrl: string;
  export let description: string;
  export let url: string;
</script>

<article class="flex flex-col w-full">
  <section class="flex flex-col my-10">
    <H2 class="mb-4 font-bold text-3xl">
      {title}
    </H2>
    <div class="flex flex-row">
      <div class="justify-center" style="max-width: 30%;">
        <img src={imageUrl} alt={title} />
      </div>
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
    <a class="underline mt-4 text-sm" href={url} target="_blank">Read more</a>
  </section>
</article>
