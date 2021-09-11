<script lang="ts">
    import { Headline, Subhead, H1, H2, H3, Label } from 'attractions';
    import Wikipedia from './../components/slides/Wikipedia.svelte';

    import { Swiper, SwiperSlide } from 'swiper/svelte';
    import 'swiper/css';
    import 'swiper/css/navigation';
    import 'swiper/css';
    import { Navigation, Mousewheel } from 'swiper';

    export let posts: {
        type: 'wikipedia';
        content: string;
        title: string;
        imageUrl: string;
        url: string;
    }[];
</script>

<Swiper modules={[Mousewheel, Navigation]} direction={'vertical'} mousewheel={true}>
    {#each posts as post}
        <SwiperSlide>
            <Wikipedia content={post.content} title={post.title} imageUrl={post.imageUrl} url={post.url} />
        </SwiperSlide>
    {:else}
        No posts
    {/each}
</Swiper>
