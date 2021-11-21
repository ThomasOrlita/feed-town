<script lang="ts">
    import { Headline, Subhead, H1, H2, H3, Label } from 'attractions';

    export let title: string;
    export let imageUrl: string;
    // export let content: string;
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
                    <!-- {content} --> WIKIPEDIA
                </div>
            </div>
        </div>
        <a class="underline mt-4 text-sm" href={url} target="_blank">Read more</a>
    </section>
    <!-- <section class="flex flex-row gap-4 overflow-y-auto mt-6 compact:hidden">
        {#await getRelatedItems(item.titles.canonical)}
            loading...
        {:then relatedItems}
            {#each relatedItems as relatedItem}
                <div class="flex flex-col flex-shrink-0" style="flex-basis: 8em;">
                    <h3 class="font-semibold">
                        {relatedItem.titles.normalized}
                    </h3>

                    <div class="my-4 flex flex-row justify-center">
                        <img class="max-h-24" src={relatedItem.thumbnail?.source} alt="" />
                    </div>

                    <div
                        class="text-sm"
                        style="
                                    display: -webkit-box;
                                    -webkit-line-clamp: 6;
                                    -webkit-box-orient: vertical;
                                    overflow: hidden;">
                        {relatedItem.extract.slice(0, 240)}
                    </div>
                </div>
            {/each}
        {/await}
    </section> -->
</article>
