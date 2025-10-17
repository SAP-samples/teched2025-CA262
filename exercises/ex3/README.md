# Exercise 3 - Analyzing network traffic

In this exercise, we will learn how to analyze the network traffic of your built app.
When analyzing the start-up of a fully optimized built app within the network trace, only the following requests should be seen:

- library-preload.js
- messagebundle.properties
- library.css
- manifest.json
- fonts (.woff2)
- some icons or images
- some personalization requests
- component-preload.js
- OData requests. First a $metadata request, often followed by a head request. After that, $batch request(s) to get the actual data.

The actual number of requests depends on how the application is started, but usually it would be less than ca. 100 requests. Any bigger number might indicate a problem and we should always double-checked it to make sure that it is fully optimized.

Requests for individual or single JavaScript resources should in general be avoided and they should be bundled.  

This is an example of a request for a single resource:

![DevTools Single Request](./images/DevTools-single-request.png)

Compare it with this bundle request:

![DevTools Bundle Request](./images/DevTools-bundle-request.png)

## Exercise 3.1 Check the network traffic

After completing these steps you will have learnt how to confirm that your application is fully optimized or whether it is lacking some performance improvements.

1. Make sure that the server is still running in one of the terminals of Visual Studio Code. If this is not the case, start it again by running the following command:

   ```sh
   npm start
   ```

   Remember to keep it running during all exercises. Other `npm` commands can be executed in a second terminal that can be opened via the `+` button in the terminal view of VS Code.

2. With the built application running in your browser ([http://localhost:4004/incidents/dist/index.html](http://localhost:4004/incidents/dist/index.html)), open Chrome Developer Tools in the same tab by pressing `F12` or right-clicking anywhere on the page and selecting `Inspect`. Go to the `Network` tab.

3. To record all network requests during the first load of the application, you need to disable the cache in DevTools.

   ![DevTools Disable Cache](./images/DevTools-disable-cache.png)

   Then clear any previous recordings by clicking the clear button in the Network tab.

   ![DevTools Clear Network](./images/DevTools-network-clear.png)

4. Now reload the page by pressing `F5` or clicking the reload button in the browser. This will record all network activity for the initial load of the application.

   > [!TIP]
   > Since there are many library-preload requests and it is not too easy to tell them apart, enable the `Big request rows` checkbox in the `Network Settings`.

   ![DevTools Big Rows](./images/DevTools-big-rows.png)

## Exercise 3.2 Identify missing library dependencies

After completing these steps you will have learnt how to identify missing dependencies and how to correct them.

Missing library dependencies can happen when we rely on tools that might have a missing dependency or when we forgot to add it. That's why it is considered good practice to double-check once the application is built.

1. Have a look at the requests that you see in the Network Tab from the previous exercise. Compare them with the list of expected requests from above. Is there something that seems odd? How many requests are in total? Spend some time analyzing the network trace before continuing.

2. Currently, you should see 353 requests (maybe 352 due to the favicon.ico request). Scroll to the top. The request FilterOperatorUtil.js is the first one that doesn't follow the list given above. If we keep scrolling down, we see that there are few similar requests. This usually indicates a missing library dependency.

   ![Filter Operator Util](./images/FilterOperatorUtil.png)

3. In order to find out which library is missing, the best option is to check the UI5 documentation. Open the [UI5 Demo Kit](https://sapui5.hana.ondemand.com/1.139.0/) and navigate to the API Reference.

   ![UI5 Demo Kit API Reference](./images/UI5DemoKit-API-Reference.png)

4. Enter the name of the request in the filter box. In this case, we should enter FilterOperatorUtil. Click on the result. It will open the documentation of this element. The library is visible on the top part. It is sap.ui.mdc.

   ![UI5 Demo Kit MDC Library](./images/UI5DemoKit-MDC-Library.png)

## Exercise 3.3 Add the missing library dependency

1. Go back to Visual Studio Code and open the `manifest.json` file located in folder `app/incidents/webapp`. Navigate to the attribute "sap.ui5"."dependencies"."libs". It should have 4 dependencies, sap.m, sap.ui.core, sap.ushell and sap.fe.templates. Add the sap.ui.mdc library to the list.

   ![Library mdc added](./images/library_mdc_added.png)

2. Let's keep the previous build version so we can compare them later. Rename the folder `app/incidents/dist` into `app/incidents/dist_first_build`.

3. Go back to Visual Studio Code and build the application from the terminal with the following command:

   ```sh
   npm run build:preload
   ```

4. This generates a new built version in folder `app/incidents/dist`. Go back to the browser and reload the page by pressing `F5`.

5. Have a look at the requests. What do you notice now? You should see that there are no more single requests to artifacts that belong to the sap.ui.mdc library. Also the total number of requests is now down to 182.

## Exercise 3.4 Evaluate and refine until your application is fully optimized

1. On the browser, check again the latest result of the network trace. Is the number of requests less than 100? Do you still see some single requests? Spend again few minutes trying to see if everything is ok.

2. Indeed we can still see some single requests. The next one is ControlVariantApplyAPI.js. Again, navigate to the UI5 Demo Kit and this time, search ControlVariantApplyAPI in the search box. This search also works quite well and should return one result, indicating that the library is sap.ui.fl.

   ![FL Library identified](./images/FL_Library_identified.png)

   ![UI5 Demo Kit FL Library](./images/FL_Library_ui5_demo_kit_search.png)

3. Again, let's keep the build version so we can compare them later. Rename the folder `app/incidents/dist` into `app/incidents/dist_build_mdc`.

4. Repeat the build generation step and reload the application in the browser. Check the network trace. Now the number of requests should be 90.

5. Repeat this exercise until you are satisfied. Remember to rename the `app/incidents/dist` folder after every change since we are going to test them all in the next exercise.

6. Based on the single requests, you should probably have two more versions. The first one should include the library sap.f and the second one should include the library sap.uxap.

   ![All Libraries](./images/all_libraries_added.png)

## Exercise 3.5 Run some performance tests

Sometimes it is not clear whether a full library should be added as dependency or not. It could be that only 2 components are required from a particular library and therefore it might be faster to load just those two components instead of one full library. Size also matters. And size matters in two respects. First one is the download time. One might argue that this happens only the first time and later the request is cached in the browser. Granted. But also any js file, regardless of the origin, browser cache or network, must be parsed. This processing time needs to be considered when optimizing an application.

When executing performance tests, it is important to keep in mind that nothing is perfect. Network might be collapsed, the CPU is busy doing something else, etc. In order to avoid this, we will repeat our tests at least 5 times.

Usually performance tests are done:

- in a dedicated environment
- with a high number of iterations
- automatic outlier identification and elimination
- tests over time to identify regressions
- and some more...

Let's keep things simple. We are going to repeat each test at least 5 times (ideally 10 times) and we will simply calculated the average of the numbers. Use the excel `teched2025-CA262-Results.xlsx` located in the root folder.

1. Go back to Visual Studio Code and make sure you have different build folders. You should have at least five with names similar to these ones:

   - `app/incidents/dist_first_build`
   - `app/incidents/dist_build_mdc`
   - `app/incidents/dist_build_mdc_fl`
   - `app/incidents/dist_build_mdc_fl_f`
   - `app/incidents/dist_build_mdc_fl_f_uxap`

   The following exercises will depend on the names of these folders. So we recommend you to use the same names.

2. Go back to the browser and open the URL of the first build: [http://localhost:4004/incidents/dist_first_build/index.html](http://localhost:4004/incidents/dist_first_build/index.html)

3. Make sure you still have the cache disabled in DevTools.

4. Write down the values of:

   - Number of requests
   - Amount of bytes transferred over network
   - Amount of bytes loaded by the page
   - Finish time

5. Repeat this at least 5 times (ideally 10 times), that is, refresh the page with `F5` and write down the values.

6. Repeat this procedure for all the different builds you have:

   - [http://localhost:4004/incidents/dist_build_mdc/index.html](http://localhost:4004/incidents/dist_build_mdc/index.html)
   - [http://localhost:4004/incidents/dist_build_mdc_fl/index.html](http://localhost:4004/incidents/dist_build_mdc_fl/index.html)
   - [http://localhost:4004/incidents/dist_build_mdc_fl_f/index.html](http://localhost:4004/incidents/dist_build_mdc_fl_f/index.html)
   - [http://localhost:4004/incidents/dist_build_mdc_fl_f_uxap/index.html](http://localhost:4004/incidents/dist_build_mdc_fl_f_uxap/index.html)

7. Fill the following table with all the values. It should look like this one:

   ![Results table without cache](./images/results_table_without_cache.png)

8. Now uncheck the disable cache and run the tests again:

   ![Results table with cache](./images/results_table_with_cache.png)

   Please run the tests at least for the first and the final build.

Since we are running these tests locally, we all should have similar results.
Have a look at the results to see if it makes sense to include all the libraries or not.

In this case, the measurements indicate that including as much library dependencies as required will improve the loading time, especially for the initial load.

With enabled cache, the difference is not that big anymore.
In the next exercise, we will have a closer look at the requests that are not cached and have a larger impact on performance when the cache is enabled.

## Summary

You've now learnt how to use the analyze the network traffic of the built app and how to recognize which requests are ok and which ones can be improved. Also, you have now compared the performance of different build configurations and learn about the importance of statistical data.

> [!IMPORTANT]
> **Kudos!** :trophy:  
> You have completed the third exercise successfully.  
> You seem to become an *Expert* in *Analyzing network traffic*.  
> Continue to - [Exercise 4 - Analyzing OData requests](../ex4/README.md)
