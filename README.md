# Star Wars WHOIS

This is a small — but fun — project I built for a job interview. The assignment was to create a one-page application with a list of Star Wars characters and the details about their home planet. The data to build such application should be retrieved using the [Star Wars API (SWAPI)](https://swapi.dev/) and should be able to be sorted by its columns and filtered by searching the character's name.

The assignment mentioned a table with columns, but I could say I'm a bit of a ✨ designer ✨ myself. So I took some liberties to make the application a little less boring, I added pictures and short descriptions from [Wookieepedia](https://starwars.fandom.com/wiki/Main_Page), alongside some ✨ motion ✨.

One other thing worth mentioning is that to make the application faster, all the data and images are collected during build time (the information rarely changes, so this won't be a problem). This way we don't have to deal with API calls and loading screens.

## Usage

After cloning this repository, install it's dependencies with:

```bash
yarn
```

You can start the development server with:

```bash
yarn dev
```

> Be aware that the data scraper will execute the first time you're running the development server, so it can take a little longer than usual. If you don't delete the scraped data, that won't be true for future runs.

You can start the production server with:

```
yarn build
yarn start
```

## Fixes and enhancements

- We should add "WHOIS" to the bottom of the logo, but I think Disney probably wouldn't like it 😔;
- This app would be really fun as a PWA;
- The search input seems to have an erratic behaviour on Android 10. It only executes the search after the return key is pressed. After that, it works fine.
- The SWAPI keeps separate records for Anakin Skywalker and Darth Vader, but Wookieepedia doesn't. Maybe we should merge the two of them during the data scraping;
- The modal's scrollbar is rather ugly on Windows. We should take a look at some custom scrollbar, like [vuebar](https://www.npmjs.com/package/vuebar) (albeit this is rather old now);
- We should definetly add a footer with proper credits. Disney would be mad if it found out about this project. I count on your discretion 😉;
- The data scraper could normalize all the values so we don't need that huge number of util functions;
- We should disable the modal's transitions when prefers-reduced-motion is enabled;
- Sometimes, the data scraper fails to get information. For example, Leia Organa's description is available, as I write this sentence, in the current production build and not in my local development build. And I don't know why. She's such a good character.
