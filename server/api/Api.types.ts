// types of all exposed API functions
// must be top-level keys
// and not use 'typeof' other functions
export type Api = {
    addFeed: (...params: any) => Promise<any>;
    getFeed: () => Promise<any>;
};