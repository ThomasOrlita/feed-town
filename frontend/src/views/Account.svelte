<script lang="ts">
  import { Headline, Subhead, H1, H2, H3, Label, Button, Loading, Card, Chip } from 'attractions';
  import { Link, links } from 'svelte-routing';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import { AlertCircleIcon, HeartIcon, LogOutIcon } from 'svelte-feather-icons';
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
        localStorage.removeItem('id');
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
        <img src={accountInfo.avatarUrl} class="max-w-10 mr-2 rounded-1" alt={accountInfo.username} />
        {accountInfo.username}
      </H2>
      <div class="flex flex-col items-start gap-3 mt-4 mx-1.5">
        <Label>Email</Label> <span class="text-sm -mt-2">{accountInfo.email}</span>
        <Label>Connected GitHub User ID</Label> <span class="text-sm -mt-2">{accountInfo.githubUserId}</span>
        <Label>Account created</Label> <span class="text-sm -mt-2">{new Date(accountInfo.dateCreated).toLocaleDateString()}</span>
      </div>
    </Card>

    <Card outline class="m-4 !overflow-visible">
      <H2 class="flex items-center">
        <HeartIcon size="20" class="mr-2" />
        Favorite posts
      </H2>

      {#await server.getLikedFeedItems()}
        <div class="m-auto">
          <Loading />
        </div>
      {:then likedFeedItems}
        <div class="flex flex-col gap-3 ml-7">
          {#each likedFeedItems as feedItem}
            <div class="flex items-center">
              <div class="flex-1">
                <Link to={`/feed/${feedItem.feedId}/${feedItem._id}/comments`}>
                  <H3 class="!text-sm">{feedItem.content.title}</H3>
                </Link>
              </div>
            </div>
          {:else}
            <Label small class="!text-inherit">You haven't liked any posts yet.</Label>
          {/each}
        </div>

        <!-- <Feed posts={feedCollectionFeeds} /> -->
      {/await}
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
