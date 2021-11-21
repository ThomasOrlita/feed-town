<script lang="ts">
  import { Button } from 'attractions';
  import NewFeedModal from './NewFeedModal.svelte';

  let newFeedModal: NewFeedModal;
</script>

<Button
  on:click={() => {
    newFeedModal.open();
  }}>new feed</Button>

<NewFeedModal bind:this={newFeedModal} />
