<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import Account from '@/views/Account.svelte';

  import HomeFeed from '@/views/HomeFeed.svelte';
  import Header from '@/components/layout/Header.svelte';
  import Feed from '@/views/feed/Feed.svelte';
  import Feeds from '@/views/Feeds.svelte';
  import Comments from '@/views/feed/_feedId/_itemId/Comments.svelte';
  import Footer from '@/components/layout/Footer.svelte';
  import { isConnectionError, snackBarMessage } from '@/api/store';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
  import { FrownIcon, RefreshCcwIcon, WifiOffIcon } from 'svelte-feather-icons';
  import { Button, SnackbarContainer } from 'attractions';
  import Collections from '@/views/feed/_feedId/Collections.svelte';
  import Collection from '@/views/collection/Collection.svelte';
  import ManageCollection from '@/views/collection/_collectionId/ManageCollection.svelte';
  import GitHubLogin from './views/account/GitHubLogin.svelte';
  import ManageFeed from './views/feed/_feedId/ManageFeed.svelte';
  import Favorites from './views/Favorites.svelte';

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
  <main class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-2">
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
      <Route path="account/github/callback">
        <GitHubLogin authCode={new URLSearchParams(window.location.search).get('code')} />
      </Route>
      {#if localStorage.getItem('jwt')}
        <Route path="account" component={Account} />
        <Route path="collection/:feedCollectionId/manage" let:params>
          <ManageCollection feedCollectionId={params.feedCollectionId} />
        </Route>
        <Route path="collection/:feedCollectionId" let:params>
          <Collection feedCollectionId={params.feedCollectionId} />
        </Route>
        <Route path="feed/:feedSourceId/manage" let:params>
          <ManageFeed feedSourceId={params.feedSourceId} />
        </Route>
        <Route path="feed/:feedSourceId/collections" let:params>
          <Collections feedSourceId={params.feedSourceId} />
        </Route>
        <Route path="feed/:feedSourceId/:itemId/comments" let:params>
          <Comments feedSourceId={params.feedSourceId} itemId={params.itemId} />
        </Route>
        <Route path="feed/:feedSourceId" let:params>
          <Feed feedSourceId={params.feedSourceId} />
        </Route>
        <Route path="feeds" component={Feeds} />
        <Route path="favorites" component={Favorites} />
        <Route path="/" component={HomeFeed} />
        <Route>
          <GenericMessage>
            <FrownIcon size="20" class="mr-2" />
            Not found
          </GenericMessage>
        </Route>
      {:else}
        <Route component={Account} />
      {/if}
    {/if}
  </main>
  {#if localStorage.getItem('jwt') || new URLSearchParams(window.location.search).get('code')}
    <Footer />
  {/if}
</Router>
