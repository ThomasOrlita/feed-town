<script lang="ts">
  import { Headline, Subhead, H1, H2, H3, Label, Button, Loading, Card, Chip } from 'attractions';
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
{#if localStorage.getItem('jwt')}
  <div class="ml-auto">
    <Button
      on:click={() => {
        localStorage.removeItem('jwt');
        location.reload();
      }}>
      <LogOutIcon size="20" class="mr-2" />
      Log out
    </Button>
  </div>

  {#await server.getAccountInfo()}
    <div class="m-auto">
      <Loading />
    </div>
  {:then accountInfo}
    <Card outline class="m-4 !overflow-visible">
      <H2 class="flex items-center">
        <img src={accountInfo.avatarUrl} class="max-w-10 mr-2" alt={accountInfo.username} />
        {accountInfo.username}
      </H2>
      <div class="flex flex-col items-start gap-3 mt-4 mx-1.5">
        <Label>Email</Label> <span class="text-sm -mt-2">{accountInfo.email}</span>
        <Label>User ID</Label> <span class="text-sm -mt-2">{accountInfo.userId}</span>
        <Label>Account created</Label> <span class="text-sm -mt-2">{new Date(accountInfo.dateCreated).toLocaleDateString()}</span>
      </div>
    </Card>
  {:catch error}
    <GenericMessage>
      <AlertCircleIcon size="20" class="mr-2" />
      {error.message}
    </GenericMessage>
  {/await}
{:else}
  <Card outline class="m-auto">
    <div class="flex flex-col items-center">
      <Headline>My account</Headline>
      <Subhead class="mt-2 mb-8 text-center">Create your account or log in via GitHub to create your own feeds!</Subhead>
      <GitHubLogin />
    </div>
  </Card>
{/if}
