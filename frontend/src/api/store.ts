import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type Breadcrumb = { href: string; text: string; };
export const breadcrumbs: Writable<Breadcrumb[]> = writable([]);

export const isConnectionError: Writable<boolean> = writable(false);