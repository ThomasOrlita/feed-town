<script lang="ts">
  import { Card } from 'attractions';
</script>

<div class="m-auto">
  <Card outline class="m-4 !overflow-visible">
    <p class="flex items-center">
      <slot />
    </p>
  </Card>
</div>
