<script lang="ts">
  import { Headline, Subhead, H2, H3, Label, Button, Loading, Card, H1 } from 'attractions';
  import { Link } from 'svelte-routing';
  import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';
  import { AlertCircleIcon, CheckIcon, HeartIcon, LogOutIcon, RssIcon, UserIcon } from 'svelte-feather-icons';
  import GitHubLogin from './account/GitHubLogin.svelte';
  import server from '@/api/api';
  import GenericMessage from '@/components/layout/GenericMessage.svelte';
</script>

{#if localStorage.getItem('jwt')}
  <SetBreadcrumbs
    items={[
      {
        href: `/account`,
        text: `My Account`,
      },
    ]} />
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
      {/await}
    </Card>
  {:catch error}
    <GenericMessage>
      <AlertCircleIcon size="20" class="mr-2" />
      {error.message}
    </GenericMessage>
  {/await}
{:else}
  <section class="m-auto">
    <Card outline class="mb-8">
      <div class="flex flex-col md:items-center md:max-w-64 m-auto">
        <H1 class="flex items-center !text-3xl">
          <RssIcon size="32" class="mr-2" />
          Feed&thinsp;Town
        </H1>
        <Subhead class="md:-mt-1 !md:text-sm mb-2">Your RSS feed aggregator</Subhead>

        <div class="flex flex-col items-start gap-3 mt-4 mx-1.5">
          <div class="flex items-center">
            <CheckIcon size="20" class="mr-2 flex-shrink-0" /> Follow RSS feeds
          </div>
          <div class="flex items-center">
            <CheckIcon size="20" class="mr-2 flex-shrink-0" /> Organize in collections
          </div>
          <div class="flex items-center">
            <CheckIcon size="20" class="mr-2 flex-shrink-0" /> Popular public feeds
          </div>
          <div class="flex items-center">
            <CheckIcon size="20" class="mr-2 flex-shrink-0" /> Star and comment on posts
          </div>
        </div>
      </div>
    </Card>
    <Card outline class="">
      <div class="flex flex-col md:items-center">
        <H2 class="flex items-center !text-md">
          <UserIcon size="24" class="mr-2" />
          My account
        </H2>
        <Subhead class="mt-2 mb-8 !md:text-sm text-center">Create your account or log in via GitHub to create your own feeds!</Subhead>
        <GitHubLogin />
      </div>
    </Card>
  </section>
{/if}
