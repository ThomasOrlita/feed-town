<script lang="ts">
  import { Autocomplete, Button, FormField, Loading, TextField } from 'attractions';
  import server from '@/api/api';
  import { AtSignIcon, CheckIcon } from 'svelte-feather-icons';
  import { navigate } from 'svelte-routing';
  import type { Feed } from '@server/api/Api.types';
  import ModalDialog from '@/components/ModalDialog.svelte';

  let modalOpen: boolean = false;
  export const open = () => {
    modalOpen = true;
  };

  let title: string;

  type Input = {
    RSS: Feed.Source.Rss;
    WIKIPEDIA_ARTICLE: Feed.Source.WikipediaArticle;
    TWITTER_USER_TIMELINE: Feed.Source.TwitterUserTimeline;
    REDDIT_SUBREDDIT: Feed.Source.RedditSubreddit;
  };
  const defaultInput: Input = {
    RSS: {
      type: 'RSS',
      url: '',
    },
    WIKIPEDIA_ARTICLE: {
      type: 'WIKIPEDIA_ARTICLE',
    },
    TWITTER_USER_TIMELINE: {
      type: 'TWITTER_USER_TIMELINE',
      username: '',
    },
    REDDIT_SUBREDDIT: {
      type: 'REDDIT_SUBREDDIT',
      subreddit: '',
    },
  };
  let input: Input = defaultInput;
  let error: string;
  let loading: boolean = false;

  type SelectedFeedType = {
    type: Feed.Type;
    name: string;
    details: string;
  };
  let selectedTypes: [SelectedFeedType?] = [];
  let selectedType: Feed.Type;
  $: selectedType = selectedTypes[0]?.type;

  const addFeed = async () => {
    error = null;

    if (!selectedType) {
      error = 'The feed type is not selected';
      return;
    }

    try {
      loading = true;
      const newFeedResult = await server.addFeedSource(title, {
        type: selectedType,
        ...input[selectedType],
      });
      title = '';
      selectedTypes = [];
      input = defaultInput;

      modalOpen = false;
      navigate(`/feed/${newFeedResult.feedSourceId}`);

      console.log(newFeedResult);
      title = '';
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  };

  const feedTypes: SelectedFeedType[] = [
    {
      type: 'RSS',
      name: 'RSS',
      details: 'Generic RSS feed',
    },
    {
      type: 'TWITTER_USER_TIMELINE',
      name: 'Twitter',
      details: 'Latest tweets by a Twitter account',
    },
    {
      type: 'REDDIT_SUBREDDIT',
      name: 'Reddit',
      details: 'Latest posts in a specific subreddit',
    },
  ];

  async function* getOptions() {
    yield feedTypes;
  }
</script>

<ModalDialog bind:open={modalOpen} noClickaway title="Add new feed">
  <FormField name="Title" optional>
    <TextField bind:value={title} />
  </FormField>
  <FormField name="Feed type">
    <Autocomplete {getOptions} maxOptions={1} bind:selection={selectedTypes} minSearchLength={0} />
  </FormField>
  {#if selectedType === 'RSS'}
    <FormField
      name="Feed URL"
      errors={[input.RSS.url && !(input.RSS.url.startsWith('http://') || input.RSS.url.startsWith('https://')) && 'Invalid URL']}>
      <TextField type="url" bind:value={input.RSS.url} />
    </FormField>
  {:else if selectedType === 'WIKIPEDIA_ARTICLE'}
    not implemented
  {:else if selectedType === 'TWITTER_USER_TIMELINE'}
    <FormField
      name="Twitter username"
      errors={[
        input.TWITTER_USER_TIMELINE.username.replaceAll('@', '') &&
          !input.TWITTER_USER_TIMELINE.username
            .replaceAll('@', '')
            .toLowerCase()
            .match(/^[a-zA-Z0-9_]{1,15}$/) &&
          'Invalid Twitter username',
      ]}>
      <TextField type="text" bind:value={input.TWITTER_USER_TIMELINE.username} withItem>
        <AtSignIcon size="24" class="item" />
      </TextField>
    </FormField>
  {:else if selectedType === 'REDDIT_SUBREDDIT'}
    <FormField
      name="Subreddit"
      errors={[
        input.REDDIT_SUBREDDIT.subreddit.replaceAll('r/', '').replaceAll('/r/', '') &&
          !input.REDDIT_SUBREDDIT.subreddit
            .replaceAll('r/', '')
            .replaceAll('/r/', '')
            .toLowerCase()
            .match(/^[a-zA-Z0-9_]{1,21}$/) &&
          'Invalid subreddit name',
      ]}>
      <TextField type="text" bind:value={input.REDDIT_SUBREDDIT.subreddit} withItem>
        <span class="item ml-3 leading-4">r/</span>
      </TextField>
    </FormField>
  {/if}
  <div class="min-h-24">
    <FormField errors={[error ?? '\n\n']}>
      {#if loading}
        <Loading />
      {:else}
        <Button filled on:click={addFeed} disabled={loading}>
          <CheckIcon size="20" class="mr-2" />
          Add Feed
        </Button>
      {/if}
    </FormField>
  </div>
</ModalDialog>
