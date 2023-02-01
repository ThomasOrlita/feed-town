> **Note**
> This repository contains my final-year high school project. I do not intend on maintaining it in the future.


<br>


# ![Feed Town](https://user-images.githubusercontent.com/17808846/216139614-74f861e2-61ba-48d4-837f-77336fea4a63.png)
Feed Town is a web application that allows users to add RSS feeds from any supported source and continue to view, group into collections or share publicly. Individual posts can then be commented on or added to favorites. You can log in to the app via the social network GitHub. The application is designed in a modern and responsive design, using the latest technologies and with client and server side security.

## Technology
The entire application is built on the latest technologies and web frameworks. The main programming language used for the frontend and backend of the application is TypeScript, whose main advantages include static typing. TypeScript type definitions can be exported and used between multiple projects. This allows the use of help and immediate validation of the correctness of the parameters of the called functions directly in the editor when working on the frontend and backend.

The frontend of the application is built on the Svelte web framework, which allows faster and more convenient development thanks to compilation into JavaScript. Instant testing of the application and updating the page during development is achieved by _hot module reload_ technology. The Vite tool is used to create a development server and then the final static output of the application. The Svelte UI (User Interface) library _Attractions_ is used to create elements on the page such as buttons, forms and loading animations. Customization of element styles is achieved by the CSS preprocessor Sass. To style the page content and ensure responsiveness but at the same time code clarity, the CSS framework Windi.css, a faster version of the Tailwind CSS project with more features, was chosen. The application also uses icons from the Feather Icons set to enhance the user experience. All external packages are imported using the NPM service.

The backend of the application is built on the Deno TypeScript runtime, which was chosen as an alternative to Node.js because of its native TypeScript support and closer integration with web platform features. Packages are loaded from the _deno.land_ library and the application is run using _Velociraptor_. All data types are defined via _namespace_ and _interface_. Defined types include data models stored in the database, return objects of some functions, and exposed exported API functions. These types can be accessed by the editor during frontend and backend development. For example, if the input parameters of a particular API function are changed on the backend side, the editor immediately responds to these changes and highlights any mismatched calls to this function on the frontend side, which increases productivity during application development and reduces the time spent debugging API errors.

Environment variables are used to pass values necessary for the server to run, such as API keys or database access data. These values can be defined either in the `.env` file or directly in the environment via the command line. Variables required by the application include:

- **`MONGODB_CONNECTION_STRING`**, specifying all database access data in SRV (Service record) format
- **`RSS_HUB_URL`**, the address of a running RSS Hub instance for converting various web feeds to RSS format,
- **`GITHUB_CLIENT_ID`**, an identifier to authenticate the application when communicating with the GitHub server using the OAuth 2.0 protocol,
- **`GITHUB_CLIENT_SECRET`**, the secret for authorizing the OAuth application,
- **`JWT_SECRET`**, a private key in HS512 format for signing and authenticating JWT tokens.

The MongoDB object database is used to permanently store user data and stored feeds.Unlike classical relational databases, it does not require a strictly defined schema and allows working with nested documents. MongoDB also supports aggregations, more complex database operations performed on the database server, enabling advanced and efficient data handling.

Git, a tool that allows you to incrementally add changes to a project and work with previous versions of the project, is used to manage source code versions. Using Git, these changes can be published to GitHub, a platform for storing and managing software projects.

Deploying a server into a production environment is made easier by Docker, a set of PaaS (Platform as a service) that use virtualization at the operating system level to deliver software in packages called containers, ensuring a smooth installation and running of the server without the need to manually install and configure the necessary tools and programs. The Docker configuration is provided in the **Dockerfile** and **docker-compose.yml** files.

```Dockerfile
FROM denoland/deno:1.16.4

EXPOSE 4000

WORKDIR /app

USER deno

ADD . .

RUN deno cache --unstable server/server.ts

CMD ["run", "--unstable", "--allow-net", "--allow-read", "--allow-write", "--allow-ffi", "--allow-env", "server/server.ts"]
```


## Appearance of the application

### Homepage

When the application is first opened, the user is introduced to the main features of the application:

- subscribe to RSS feeds,
- arrangement into collections
- popular public feeds,
- adding posts to favourites and commenting.

![Home page with property overview and login](https://user-images.githubusercontent.com/17808846/216140424-ec64ea3d-385b-4e01-a73b-fa64f29df68e.png)


### UI layout

The user interface of the application is divided into three horizontal parts:

- header (hierarchy of the currently displayed page)
- content (the content of the page itself)
- footer (navigation menu):
  - main page
  - feed management
  - adding a new feed
  - favorite posts
  - account


![Application UI layout](https://user-images.githubusercontent.com/17808846/216140537-b4ebd1b3-72b8-4b62-9de9-7e14693b2411.png)



## Login and account

To create new feeds and use the main features of the app, you need to sign in via the social network GitHub. Logging in via social networks instead of the traditional registration with an email address and password makes it faster and more convenient for users to log in.

![User authorization via GitHub](https://user-images.githubusercontent.com/17808846/216140664-24f3ca6f-6095-4288-9d53-bd4f0b8e8f97.png)


### OAuth

After logging in using OAuth 2.0, the user is redirected back to the application with an authorization callback code in the URL that is used on the server side to retrieve information about the user.

```ts
const tokens = await oauth2Client.code.getToken(

    oauth2Client.config.redirectUri + "?code=" + authCode

);

const userResponse = await fetch("https://api.github.com/user", {
   headers: {
       Authorization: `Bearer ${tokens.accessToken}`,
   },
});
```

### JWT

The server then generates a unique JSON Web Token (JWT) for the client, which is used to authorize and authenticate the user. This token is stored in the browser's memory and is sent to the server on each request, which uses a private key to validate the token. Thanks to asymmetric cryptography, it is not necessary to store individual tokens in a database. However, the disadvantage is that issued tokens cannot be easily revoked.

```ts
const generateJwtToken = async (userId: string) =>
   await create({ alg: "HS512", typ: "JWT" }, { userId }, jwtKey);
```

### Account Management

The _My Account_ page contains information about the currently logged-in user. There is also a logout option that deletes the saved JWT from the browser, thus logging the user out.

![Logged-in user information](https://user-images.githubusercontent.com/17808846/216140909-f26e4efb-2017-4d90-8191-177f7e6067f7.png)



## Adding feeds

Clicking the (+) button in the bottom menu will display a dialog with options to create a new feed:

- feed name,
- Type:
  - RSS (default),
  - Twitter timeline,
  - Reddit subreddit,
- URL.


![Dialog to add a new RSS feed](https://user-images.githubusercontent.com/17808846/216141668-05c6393e-f710-4303-9823-c32098e2d38e.png)


## Feed management

All feeds are displayed on the _My Feeds_ page where you can view, group or manage them.

![Single feed view](https://user-images.githubusercontent.com/17808846/216141811-fa78934d-9056-4c62-b62f-af4c0506cc6a.png)


### Feed settings
![Feed settings](https://user-images.githubusercontent.com/17808846/216141878-9dc0bdad-c830-45bb-a987-a63c59d18721.png)

On the _Feed Settings_ page, you can edit the feed name or delete it. Once removed, it will be deleted from all collections.


### Feed publication

New feeds have visibility limited to the user who created it. Feeds can be shared publicly, meaning that other users with access to the feed link will be able to view it. When you click on the _Publish_ button, the feed becomes accessible to other users.


### Latest content updates

The application periodically checks if new posts have been added to the feed and then adds them to the database. The _refresh_ button on the feed settings page can be used to instantly refresh the most recent posts.


## Organization of feeds in collections

Multiple feeds can be grouped into one collection for clarity and organization. When you open the collection itself, you will see a list of posts from the feeds that are added in this collection.

![Grouping the feed into collections](https://user-images.githubusercontent.com/17808846/216142073-4f145f6a-8be4-4726-aac4-97433acda99c.png)

To add a specific feed in each collection, use the _Manage feed in collections_ button. On this page you can add feeds to specific collections or create a new collection. One feed can be in multiple collections or not in any collection. You can also add other users' public feeds to collections.

### Managing collections

Collections can be managed in the same way as the feeds themselves, i.e. edit the name, publish or delete.

![Collection Management](https://user-images.githubusercontent.com/17808846/216142174-f11a57f9-2a46-4086-9017-7370c59e5e22.png)


#### Deleting a collection

Clicking the _Delete Collection_ button will delete the collection. The individual feeds that were in the collection will still be accessible.

#### Publication of the collection

The _Publish Collection_ button makes the collection available to other users. All feeds in the collection will be published. A collection or feed cannot be changed back to private, it can only be removed.

Other users will see information about the collection, a list of feeds, and the ability to duplicate the collection, where the user becomes the owner of that copy, allowing more feeds to be removed or added.

![Detail of the public collection](https://user-images.githubusercontent.com/17808846/216142591-8c48acf9-2209-4b05-8f09-d5aa41b4e703.png)


```ts
export const setFeedCollectionAsPublic: Api['setFeedCollectionAsPublic'] = async ({ feedCollectionId }: { feedCollectionId: string; }, jwt?: string) => {
   const userId = await getUserIdFromJwtToken(jwt);

   const feedCollection = await feedCollections.findOne({
       _id: new Bson.ObjectId(feedCollectionId),
       owner: userId
   }, { noCursorTimeout: false });

   if (!feedCollection) throw new Error("Feed collection not found");

   for (const feedSourceId of feedCollection?.feedSources ?? []) {
       await setFeedSourceAsPublic({
           feedSourceId: feedSourceId.toHexString()
       }, jwt);
   }

   await feedCollections.updateOne({
       _id: new Bson.ObjectId(feedCollectionId),
       owner: userId
   }, {
       $set: {
           public: true
       }
   });

   return {};
};
```



### List of collections and feeds

The _My Feeds_ page lists all the collections and feeds the user has created. Here you can view or manage the posts of a collection or feed. Feeds that are part of a collection are displayed directly in the collection, feeds without a collection are displayed separately.

![List of collections and feeds](https://user-images.githubusercontent.com/17808846/216142897-57dcfa98-a3e6-43e6-9c3c-48715209df70.png)


## Posts

There are three ways to view the feed content itself:

- view one specific feeds,
- view posts from all feeds in a particular collection,
- view all posts on the main page.

### Layout

Only one post is displayed on the page at a time. The next post is displayed by swiping across the page, called _swiping_.

The post itself consists of a title, domain, image (if available), a short description and buttons: add to favourites, comment and the main button to open the post in the browser.

![Contribution distribution](https://user-images.githubusercontent.com/17808846/216142986-0121ba44-9abe-4317-ba07-a8cb9e7d8ee7.png)


When a post is loaded on the page, it is marked as displayed in the database, i.e. it will be listed at the end when the feed is opened again, so the user will see unread posts first. Each post has a unique URL, so when the page is refreshed, it can pick up where it left off.

```svelte
<Card outline class="flex flex-col max-h-[calc(100vh-216px)] m-4 <xs:m-1 !overflow-visible">
   <H2 class="mb-4 font-bold text-3xl <xs:leading-7">
       {title}
   </H2>
   <Label small class="!text-cool-gray-500 !lowercase mb-1">
       {new URL(url).hostname}
   </Label>
   ...
   <div class="flex flex-row flex-wrap" use:links>
   <Button ...>
       <HeartIcon size="20" class={isLiked ? 'fill-$main' : ''} />
   </Button>

   <Button ...>
       <MessageSquareIcon size="20" />
       <span class="ml-2 <sm:hidden">Comments</span>
   </Button>

   <Button class="mt-4 text-sm <xs:w-full <xs:justify-center" href={sanitizeUrl(url)} filled target="_blank">
       <ExternalLinkIcon size="20" />
       <span class="ml-2">Read more</span>
   </Button>
   </div>
</Card>
```


### Favorites

Click on the heart icon to add the post to your favourites. On the _Favorite Posts_ page, you will find a list of posts that the user has marked as favorites.

![Popular posts](https://user-images.githubusercontent.com/17808846/216143180-9e36da0e-0d4e-4c16-8165-e56271ffc2b0.png)

```svelte
{#await server.getLikedFeedItems()}
   <div class="m-auto">
       <Loading />
   </div>
{:then likedFeedItems}

   <div class="flex flex-col gap-3 ml-7">
       {#each likedFeedItems as feedItem}
           <div class="flex items-center">
               <div class="flex-1">
                   <Link to={`/feed/${...}/comments`}>
                       <H3 class="!text-sm">

                            {feedItem.content.title}

                        </H3>
                   </Link>
               </div>
           </div>
       {:else}
           <Label small class="!text-inherit">
               You haven't liked any posts yet.
           </Label>
       {/each}
   </div>

{:catch error}
   <GenericMessage>
       <AlertCircleIcon size="20" class="mr-2" />
       {error.message}
   </GenericMessage>
{/await}
```

### Comments

Comments can be added to posts by clicking on the _Comments_ icon. If the feed is published publicly, other users can also add comments to it.

![Post detail with comments](https://user-images.githubusercontent.com/17808846/216143293-694868bf-5c83-4202-8c0d-336ca9d8a3f1.png)

