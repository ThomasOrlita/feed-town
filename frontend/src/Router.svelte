<script>
    import { Router, Link, Route } from 'svelte-routing';
    import About from './views/About.svelte';
    import Content from './views/Content.svelte';

    import { Tab } from 'attractions';
    import HomeFeed from './views/HomeFeed.svelte';

    export let url = '';
</script>

<Router {url}>
    <header>header</header>
    <main class="flex flex-col flex-1 overflow-y-auto">
        <Route path="test">hello</Route>
        <Route path="about" component={About} />
        <Route path="feed" component={HomeFeed} />
        <Route path="/"><Content /></Route>
    </main>
    <footer class="flex flex-row">
        <Link to="/">
            <Tab value="home" name="footerNav">Home</Tab>
        </Link>
        <Link to="feed">
            <Tab value="feed" name="footerNav">Feed</Tab>
        </Link>
        <Link to="about">
            <Tab value="about" name="footerNav">About</Tab>
        </Link>
        <Link to="something">
            <Tab value="something" name="footerNav">Something</Tab>
        </Link>
    </footer>
</Router>
