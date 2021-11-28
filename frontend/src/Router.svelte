<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';
  import Account from './views/Account.svelte';
  import Content from './views/Content.svelte';

  import HomeFeed from './views/HomeFeed.svelte';
  import Header from './components/Header.svelte';
  import SingleFeed from './views/SingleFeed.svelte';
  import Feeds from './views/Feeds.svelte';
  import FeedItemComments from './views/FeedItemComments.svelte';
  import Footer from './components/Footer.svelte';

  export let url = '';
</script>

<Router {url}>
  <Header />
  <main class="flex flex-col flex-1 overflow-y-auto p-2">
    <Route path="account" component={Account} />
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
  <Footer />
</Router>
