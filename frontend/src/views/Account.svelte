<script lang="ts">
  import { Headline, Subhead, H1, H2, H3, Label } from 'attractions';
import SetBreadcrumbs from '../components/SetBreadcrumbs.svelte';
</script>

<SetBreadcrumbs
  items={[
    {
      href: `/account`,
      text: `My Account`,
    },
  ]} />
<Headline>My Account!</Headline>
