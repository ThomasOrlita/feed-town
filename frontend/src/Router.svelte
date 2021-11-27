<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';
  import About from './views/About.svelte';
  import Content from './views/Content.svelte';

  import { Tab } from 'attractions';
  import HomeFeed from './views/HomeFeed.svelte';
  import Header from './components/Header.svelte';
  import SingleFeed from './views/SingleFeed.svelte';
  import Feeds from './views/Feeds.svelte';
  import FeedItemComments from './views/FeedItemComments.svelte';

  export let url = '';
</script>

<Router {url}>
  <header>
    <Header />
  </header>
  <main class="flex flex-col flex-1 overflow-y-auto">
    <Route path="about" component={About} />
    <Route path="feed/:feedId/:itemId/comments" let:params>
      <FeedItemComments feedId={params.feedId} itemId={params.itemId} />
    </Route>
    <Route path="feed/:feedId" let:params>
      <SingleFeed feedId={params.feedId} />
    </Route>
    <Route path="feeds" component={Feeds} />
    <Route path="feed" component={HomeFeed} />
    <Route path="/"><Content /></Route>
  </main>
  <footer class="flex flex-row">
    <Link to="/">
      <Tab value="home">Home</Tab>
    </Link>
    <Link to="feed">
      <Tab value="feed">Feed</Tab>
    </Link>
    <Link to="feeds">
      <Tab value="feeds">Feeds</Tab>
    </Link>
    <Link to="about">
      <Tab value="about">About</Tab>
    </Link>
    <Link to="something">
      <Tab value="something">Something</Tab>
    </Link>
  </footer>
</Router>
