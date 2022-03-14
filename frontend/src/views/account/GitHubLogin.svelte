<script lang="ts">
    import { Button, H2, Loading } from 'attractions';
    import { AlertCircleIcon, GithubIcon } from 'svelte-feather-icons';
    import GenericMessage from '@/components/layout/GenericMessage.svelte';
    import { navigate } from 'svelte-routing';

    import server from '@/api/api';

    export let authCode: string | undefined = undefined;

    const processCallback = async () => {
        const jwtToken = await server.getJwtTokenFromGitHubOAuth(authCode);

        localStorage.setItem('jwt', jwtToken.jwt);
        localStorage.setItem('id', jwtToken.userId);
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
                Log in via GitHub
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
