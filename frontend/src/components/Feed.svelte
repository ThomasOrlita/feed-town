<script lang="ts">
  import { Headline, Subhead, H1, H2, H3, Label } from 'attractions';
  import Wikipedia from './../components/slides/Wikipedia.svelte';

  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import { Navigation, Mousewheel } from 'swiper';
  import RssItem from './slides/RssItem.svelte';
  import type { Feed } from '../../../server/api/Api.types';
  import Tweet from './slides/Tweet.svelte';
  export let posts: Feed.Item.FeedItem[];
</script>

<Swiper modules={[Mousewheel, Navigation]} direction={'vertical'} mousewheel={true}>
  {#each posts as post}
    <SwiperSlide>
      {#if post.content.type === 'RSS'}
        <RssItem
          title={post.content.title}
          imageUrl={post.content.imageUrl}
          url={post.content.url}
          description={post.content.description} />
      {:else if post.content.type === 'WIKIPEDIA_ARTICLE'}
        <Wikipedia title={post.content.title} imageUrl={post.content.imageUrl} url={post.content.url} />
      {:else if post.content.type === 'TWITTER_USER_TIMELINE'}
        <Tweet url={post.content.url} />
      {:else if post.content.type === 'REDDIT_SUBREDDIT'}
        <RssItem
          title={post.content.title}
          imageUrl={post.content.imageUrl}
          url={post.content.url}
          description={post.content.description} />
      {/if}
    </SwiperSlide>
  {:else}
    No posts
  {/each}
</Swiper>
