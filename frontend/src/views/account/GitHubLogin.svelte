<script lang="ts">
    import { Button, Card, H2, Loading } from 'attractions';
    import { AlertCircleIcon, GithubIcon } from 'svelte-feather-icons';
    import { link, Link, navigate } from 'svelte-routing';

    import server from '@/api/api';

    import GenericMessage from '@/components/layout/GenericMessage.svelte';
    import SetBreadcrumbs from '@/components/layout/SetBreadcrumbs.svelte';

    export let authCode: string | undefined = undefined;

    const processCallback = async () => {
        const jwtToken = await server.getJwtTokenFromGitHubOAuth(authCode);

        localStorage.setItem('jwt', jwtToken);
        navigate('/account');
    };
</script>

{#if !authCode}
    {#await server.getGitHubAuthUrl()}
        <div class="m-auto">
            <Loading />
        </div>
    {:then authUrl}
        <div class="flex">
            <Button href={authUrl} filled>
                <GithubIcon size="20" class="mr-2" />
                Login via GitHub
            </Button>
        </div>
    {:catch error}
        <GenericMessage>
            <AlertCircleIcon size="20" class="mr-2" />
            {error.message}
        </GenericMessage>
    {/await}
{:else}
    {#await processCallback()}
        <div class="m-auto">
            <Loading />
        </div>
    {:catch error}
        <GenericMessage>
            <AlertCircleIcon size="20" class="mr-2" />
            {error.message}
        </GenericMessage>
    {/await}
{/if}
