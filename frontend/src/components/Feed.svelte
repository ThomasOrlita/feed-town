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
  import { navigate } from 'svelte-routing';
  import GenericMessage from './GenericMessage.svelte';
  import { FrownIcon } from 'svelte-feather-icons';

  export let posts: Feed.Item.FeedItem[];
  export let feedId: string;

  const slideChanged = (slideIndex: number) => {
    const slide = posts[slideIndex];

    navigate(`/feed/${feedId}/#${slide._id}`, { replace: true });
  };
</script>

<Swiper modules={[Mousewheel, Navigation]} direction={'vertical'} mousewheel={true} on:slideChange={(event) => slideChanged(event.detail[0][0].activeIndex)} on:swiper={(e) => console.log(e.detail[0])}>
  {#each posts as post}
    <SwiperSlide>
      {#if post.content.type === 'RSS'}
        <RssItem {feedId} itemId={post._id} title={post.content.title} imageUrl={post.content.imageUrl} url={post.content.url} description={post.content.description} />
      {:else if post.content.type === 'WIKIPEDIA_ARTICLE'}
        <Wikipedia title={post.content.title} imageUrl={post.content.imageUrl} url={post.content.url} />
      {:else if post.content.type === 'TWITTER_USER_TIMELINE'}
        <Tweet {feedId} itemId={post._id} url={post.content.url} />
      {:else if post.content.type === 'REDDIT_SUBREDDIT'}
        <RssItem {feedId} itemId={post._id} title={post.content.title} imageUrl={post.content.imageUrl} url={post.content.url} description={post.content.description} />
      {/if}
    </SwiperSlide>
  {:else}
    <GenericMessage>
      <FrownIcon size="20" class="mr-2" />
      No posts
    </GenericMessage>
  {/each}
</Swiper>
