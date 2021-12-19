<script lang="ts">
  import { Link } from 'svelte-routing';
  import { Button, Tab } from 'attractions';
  import { CompassIcon, HomeIcon, ListIcon, PlusIcon, UserIcon } from 'svelte-feather-icons';

  import NewFeedModal from '../feeds/NewFeedModal.svelte';

  let newFeedModal: NewFeedModal;
</script>

<NewFeedModal bind:this={newFeedModal} />
<footer class="flex flex-row justify-between">
  <Link to="/">
    <Tab>
      <HomeIcon size="20" />
      <span class="ml-2.5 <md:hidden">Home</span>
    </Tab>
  </Link>
  <Link to="feeds">
    <Tab>
      <ListIcon size="20" />
      <span class="ml-2.5 <md:hidden"> My Feeds</span>
    </Tab>
  </Link>
  <div class="relative">
    <Button
      filled
      round
      class="relative -top-3.5 new-button z-10"
      on:click={() => {
        newFeedModal.open();
      }}>
      <PlusIcon size="24" />
    </Button>
  </div>
  <Link to="feed">
    <Tab value="feed">
      <CompassIcon size="20" />
      <span class="ml-2.5 <md:hidden">Explore</span>
    </Tab>
  </Link>
  <Link to="account">
    <Tab>
      <UserIcon size="20" />
      <span class="ml-2.5 <md:hidden">Account</span>
    </Tab>
  </Link>
</footer>

<style>
  footer {
    border-top: 1px solid rgba(56, 142, 60, 0.3);
    background: linear-gradient(180deg, #388e3ceb 0%, #41a445 100%);
  }
  footer :global(a),
  footer :global(a label) {
    display: flex;
    flex: 1;
  }
  footer :global(.content) {
    display: flex;
    flex: 1;
    justify-content: center;
    border-radius: 0 !important;
    color: #fff !important;
    border: none !important;
    /* font-family: inherit !important; */
  }
  footer :global(.content:hover) {
    background: rgb(0 0 0 / 10%) !important;
  }
  footer :global(.new-button:not(:hover)) {
    /* background: #388e3c; */
    box-shadow: none !important;
  }
</style>
