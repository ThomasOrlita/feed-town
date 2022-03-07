<script lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import { Navigation, Mousewheel } from 'swiper';
  import RssItem from '@/components/slides/RssItem.svelte';
  import Tweet from '@/components/slides/Tweet.svelte';
  import Wikipedia from '@/components/slides/Wikipedia.svelte';
  import type { Feed } from '@server/api/Api.types';
  import { navigate } from 'svelte-routing';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import { ApertureIcon, FrownIcon } from 'svelte-feather-icons';
  import server from '@/api/api';

  export let posts: Feed.Item.FeedItem[];

  if (posts.length > 0) {
    server.markFeedItemAsViewed({
      itemId: posts[0]._id,
    });
  }

  const slideChanged = async (slideIndex: number) => {
    const slide = posts[slideIndex];
    console.log(slide);

    await server.markFeedItemAsViewed({
      itemId: slide._id,
    });
    // navigate(`/feed/${slide.feedId}/#${slide._id}`, { replace: true });
  };
</script>

<Swiper
  modules={[Mousewheel, Navigation]}
  direction={'vertical'}
  mousewheel={true}
  on:slideChange={(event) => slideChanged(event.detail[0][0].activeIndex)}
  on:swiper={(e) => console.log(e.detail[0])}>
  {#each posts as post}
    <SwiperSlide>
      {#if post.content.type === 'RSS' || post.content.type === 'REDDIT_SUBREDDIT'}
        <RssItem
          type={post.content.type}
          feedId={post.feedId}
          itemId={post._id}
          title={post.content.title}
          imageUrl={post.content.imageUrl}
          url={post.content.url}
          description={post.content.description}
          isLiked={post.likes.includes(localStorage.getItem('id'))} />
      {:else if post.content.type === 'WIKIPEDIA_ARTICLE'}
        <Wikipedia title={post.content.title} imageUrl={post.content.imageUrl} url={post.content.url} />
      {:else if post.content.type === 'TWITTER_USER_TIMELINE'}
        <Tweet feedId={post.feedId} itemId={post._id} url={post.content.url} />
      {/if}
    </SwiperSlide>
  {:else}
    <GenericMessage>
      <FrownIcon size="20" class="mr-2" />
      No posts
    </GenericMessage>
  {/each}
</Swiper>
