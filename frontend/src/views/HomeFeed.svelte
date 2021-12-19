<script lang="ts">
  import server from '../api/api';

  import Feed from '../components/feeds/Feed.svelte';

  let date = new Date();

  const fetchItems = async () => {
    const items = await fetch(
      'https://en.wikipedia.org/api/rest_v1/feed/featured/' +
        [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('/')
    );
    return (await items.json()).mostread.articles
      .map((item) => ({
        title: item.titles.normalized,
        imageUrl: item.thumbnail?.source,
        content: item.extract,
        url: item.content_urls.desktop.page,
      }))
      .slice(0, 30);
  };
</script>

{#await fetchItems()}
  loading
{:then items}
  <Feed posts={items} />
{/await}
