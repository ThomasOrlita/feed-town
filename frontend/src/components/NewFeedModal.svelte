<script lang="ts">
  import { Autocomplete, Button, Dialog, FormField, Modal, TextField } from 'attractions';
  import server from '../api/api';
  import { CheckIcon } from 'svelte-feather-icons';
  import { navigate } from 'svelte-routing';
  import type { Feed } from '../../../server/api/Api.types';

  let modalOpen: boolean = false;
  export const open = () => {
    modalOpen = true;
  };

  let title: string;
  let url: string;
  let input: {
    RSS: Feed.Source.Rss;
    WIKIPEDIA_ARTICLE: Feed.Source.WikipediaArticle;
    TWITTER_USER_TIMELINE: Feed.Source.TwitterUserTimeline;
    REDDIT_SUBREDDIT: Feed.Source.RedditSubreddit;
  } = {
    RSS: {
      type: 'RSS',
      url: '',
    },
    WIKIPEDIA_ARTICLE: {
      type: 'WIKIPEDIA_ARTICLE',
    },
    TWITTER_USER_TIMELINE: {
      type: 'TWITTER_USER_TIMELINE',
      username: '@',
    },
    REDDIT_SUBREDDIT: {
      type: 'REDDIT_SUBREDDIT',
      subreddit: 'r/',
    },
  };
  let error: string;

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
      const newFeedResult = await server.addFeed(title, {
        type: selectedType,
        ...input[selectedType],
      });
      title = '';
      url = '';

      modalOpen = false;
      navigate(`/feed/${newFeedResult.feedId}`);

      console.log(newFeedResult);
    } catch (e) {
      error = e.message;
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

<Modal bind:open={modalOpen} let:closeCallback noClickaway>
  <Dialog title="Add new feed" {closeCallback}>
    <FormField name="Title" optional>
      <TextField bind:value={title} />
    </FormField>
    <FormField name="Feed type">
      <Autocomplete {getOptions} maxOptions={1} bind:selection={selectedTypes} minSearchLength={0} />
    </FormField>
    {#if selectedType === 'RSS'}
      <FormField name="Feed URL" required errors={[url && !(url.startsWith('http://') || url.startsWith('https://')) && 'Invalid URL']}>
        <TextField type="url" bind:value={input.RSS.url} />
      </FormField>
    {:else if selectedType === 'WIKIPEDIA_ARTICLE'}
      not implemented
    {:else if selectedType === 'TWITTER_USER_TIMELINE'}
      <FormField name="Twitter username" required errors={[]}>
        <TextField type="text" bind:value={input.TWITTER_USER_TIMELINE.username} />
      </FormField>
    {:else if selectedType === 'REDDIT_SUBREDDIT'}
      <FormField name="Subreddit" required errors={[]}>
        <TextField type="text" bind:value={input.REDDIT_SUBREDDIT.subreddit} />
      </FormField>
    {/if}
    <FormField errors={[error]}>
      <Button filled on:click={addFeed}>
        <CheckIcon size="20" class="mr-2" />
        Add Feed
      </Button>
    </FormField>
  </Dialog>
</Modal>
