<script lang="ts">
  import { Headline, Subhead, H1, H2, H3, Label, Button, Loading } from 'attractions';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import { AlertCircleIcon, LogOutIcon } from 'svelte-feather-icons';
  import GitHubLogin from './account/GitHubLogin.svelte';
  import server from '@/api/api';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
</script>

<SetBreadcrumbs
  items={[
    {
      href: `/account`,
      text: `My Account`,
    },
  ]} />
<Headline>My Account!</Headline>

{#if localStorage.getItem('jwt')}
  {localStorage.getItem('jwt')}
  {#await server.getAccountInfo()}
    <div class="m-auto">
      <Loading />
    </div>
  {:then accountInfo}
    {accountInfo.username}
    {accountInfo.userId}
    {accountInfo.avatarUrl}
    {accountInfo.email}
  {:catch error}
    <GenericMessage>
      <AlertCircleIcon size="20" class="mr-2" />
      {error.message}
    </GenericMessage>
  {/await}
  <Button
    on:click={() => {
      localStorage.removeItem('jwt');
      // location.reload();
    }}>
    <LogOutIcon size="20" class="mr-2" />
    Log out
  </Button>
{:else}
  <GitHubLogin />
{/if}
