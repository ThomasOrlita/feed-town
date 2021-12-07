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
  import { isConnectionError, snackBarMessage } from './api/store';
  import GenericMessage from './components/GenericMessage.svelte';
  import { RefreshCcwIcon, WifiOffIcon } from 'svelte-feather-icons';
  import { Button, SnackbarContainer } from 'attractions';
  import ManageCollection from './views/ManageCollection.svelte';

  export let url = '';

  let connectionError: boolean = false;
  isConnectionError.subscribe((value) => {
    connectionError = value;
  });

  let snackbar: SnackbarContainer;
  snackBarMessage.subscribe((message) => {
    if (!message) return;
    snackBarMessage.set('');

    if (snackbar) snackbar.showSnackbar({ props: { text: message }, component: undefined, duration: 7500 });
  });
</script>

<SnackbarContainer bind:this={snackbar} />

<Router {url}>
  <Header />
  <main class="flex flex-col flex-1 overflow-y-auto p-2">
    {#if connectionError}
      <GenericMessage>
        <WifiOffIcon size="20" class="mr-2" />
        No connection
        <Button class="ml-4" on:click={() => location.reload()}>
          <RefreshCcwIcon size="20" class="mr-2" />
          Reload
        </Button>
      </GenericMessage>
    {:else}
      <Route path="account" component={Account} />
      <Route path="feed/:feedId/manage" let:params>
        <ManageCollection feedId={params.feedId} />
      </Route>
      <Route path="feed/:feedId/:itemId/comments" let:params>
        <FeedItemComments feedId={params.feedId} itemId={params.itemId} />
      </Route>
      <Route path="feed/:feedId" let:params>
        <SingleFeed feedId={params.feedId} />
      </Route>
      <Route path="feeds" component={Feeds} />
      <Route path="feed" component={HomeFeed} />
      <Route path="/"><Content /></Route>
    {/if}
  </main>
  <Footer />
</Router>
