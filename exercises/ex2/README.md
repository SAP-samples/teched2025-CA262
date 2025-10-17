# Exercise 2 - UI5 Builder

In this exercise, we will learn how to prepare your application for production using the UI5 CLI.
Typically JavaScript belongs to the interpreted languages, although relevant modern engines use just-in-time compilation for improved performance.
So why do we need a build? A build takes care of standard tasks like replacing copyright and version information, but also performance-related tasks like reducing the size (minify) and bundling the app (merging the separate JavaScript files into one).

## Exercise 2.1 Minify task

After completing these steps you will have learnt what the minify task is and what impact it has on performance.
Minification is the process of removing all unnecessary characters like whitespace characters, comments and changing the variable names to smaller ones, usually one letter, which improves the transfer time over the network and the parsing time in the browser.
It usually achieves a file size reduction of 40-60%.

As we have a Fiori Elements app which almost no custom code, the reduction is obviously not huge, but still we can see how it works. Two additional files will be generated: a <file_name>-dbg.js file with the original content and a <file_name>.map file that maps both files and will be used by the developer tools to show the source code while debugging.

1. Go to the Visual Studio Code instance where you have opened the folder `teched2025-CA262`. If not already done in exercise 0.2, open a new terminal in addition to the one where the server is running via the `+` button in the terminal view. There, run the following command:

   ```sh
   npm run build:minify
   ```

2. Open the folder `app\incidents\dist` and check the contents of the files: `Component.js`, `Component.js.map` and `Component-dbg.js`. Compare them with the content of the file `Component.js` in folder `app\incidents\webapp\`.

   ![Component-dbg.js](./images/componentDBG.png)

   ![Component.js](./images/componentJS.png)

## Exercise 2.2 Generate Component preload task

After completing these steps you will have learnt what the generate component preload task does and what impact it has on performance.

This task bundles all the application specific files into one file called `Component-preload.js`. This reduces the number of requests that are being sent to the backend. We have added an extension point so the effect is easier to identify.

1. Run the following command in the terminal of Visual Studio Code:

   ```sh
   npm run build:generateComponentPreload
   ```

2. Open the folder `app\incidents\dist` and check the contents of the files: `Component-preload.js`, `Component-preload.js.map` and `Component.js`. Notice how all the application specific files are included and they are also not minimized this time. Note that also the content of the `webapp\ext` folder is included.

   ![Component Preload No Minified.js](./images/componentPreloadNoMinified.png)

## Exercise 2.3 Build a production ready app

1. Run the following command in the terminal of Visual Studio Code:

   ```sh
   npm run build:preload
   ```

   In the console we can see that 7 tasks have been executed:

   ![Build Preload](./images/BuildPreload.png)

2. Notice how this time the file `Component-preload.js` is minimized:

   ![Component Preload Minified.js](./images/componentPreloadMinified.png)

3. See the running built app in the browser. Open [http://localhost:4004/incidents/dist/index.html](http://localhost:4004/incidents/dist/index.html) and make sure `Component-preload.js`  appears in the list of requests in the network tab of the DevTools.

   ![Component Preload Network Trace.js](./images/componentPreloadDistNetworkTrace.png)

## Summary

You've now learnt how to use the UI5 Builder in order to prepare your application for production.

> [!IMPORTANT]
> **Kudos!** :trophy:  
> You have completed the second exercise successfully.  
> You seem to become an *Expert* in *UI5 Builder*.  
> Continue to - [Exercise 3 - Analyzing network traffic](../ex3/README.md)
