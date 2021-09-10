<script lang="ts">
    import { Swiper, SwiperSlide } from 'swiper/svelte';

    // Import Swiper styles
    import 'swiper/css';

    import 'swiper/css/pagination';

    import { Navigation, Mousewheel, Scrollbar, A11y } from 'swiper';

    import './style.css';

    let date = new Date();

    const fetchItems = async () => {
        const items = await fetch(
            'https://en.wikipedia.org/api/rest_v1/feed/featured/' +
                [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('/')
        );
        return (await items.json()).mostread.articles.slice(0, 30);
    };

    // add "featured" articles (with stars on wikipedia)
    // add articles from https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles
    // https://en.wikipedia.org/wiki/List_of_common_misconceptions
    // https://en.wikipedia.org/wiki/Wikipedia:List_of_hoaxes_on_Wikipedia

    const getRelatedItems = async (title: string) => {
        const item = await fetch('https://en.wikipedia.org/api/rest_v1/page/related/' + encodeURIComponent(title));
        return (await item.json()).pages;
    };
</script>

{#await fetchItems(date)}
    loading
{:then items}
    <div>
        <button
            on:click={() => {
                date = new Date(date.setDate(date.getDate() - 1));
                console.log(date);
            }}>
            previous day
        </button>
        {date.toDateString()}
        <button
            on:click={() => {
                date = new Date(date.setDate(date.getDate() + 1));
            }}>
            next day
        </button>
    </div>
    <Swiper
        modules={[Navigation, Mousewheel, Scrollbar, A11y]}
        direction={'vertical'}
        class="mySwiper"
        mousewheel={true}
        navigation
        scrollbar={{ draggable: true }}>
        {#each items as item}
            <SwiperSlide>
                <article class="flex flex-col w-full">
                    <section class="flex flex-col my-10">
                        <h2 class="mb-4 font-bold text-3xl">
                            {item.titles.normalized}
                        </h2>
                        <div class="flex flex-row">
                            <div class="justify-center" style="max-width: 30%;">
                                <img src={item.thumbnail?.source} alt="" />
                            </div>
                            <div class="flex-1 p-4">
                                <div
                                    style="
                            display: -webkit-box;
                            -webkit-line-clamp: 8;
                            -webkit-box-orient: vertical;
                            overflow: hidden;">
                                    {item.extract}
                                </div>
                            </div>
                        </div>
                        <a class="underline mt-4 text-sm" href={item.content_urls.desktop.page} target="_blank">Read more</a>
                    </section>
                    <section class="flex flex-row gap-4 overflow-y-auto mt-6 compact:hidden">
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
                    </section>
                </article>
            </SwiperSlide>
        {/each}
    </Swiper>
{/await}
