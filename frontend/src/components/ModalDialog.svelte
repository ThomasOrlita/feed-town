<script lang="ts">
    import { Dialog, Modal } from 'attractions';

    export let open: boolean = false;
    export let noClickaway: boolean = false;
    export let danger: boolean = false;
    export let title: string;
</script>

<Modal bind:open let:closeCallback {noClickaway}>
    <div class="<sm:w-full sm:min-w-lg m-8">
        <Dialog {title} {danger} {closeCallback}>
            <slot />
        </Dialog>
    </div>
</Modal>
