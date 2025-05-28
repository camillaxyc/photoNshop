# photoNshop

Proof of Concept

1. What has been finished is setting up the backend and client side. I am also using openrouter api to detect the image. What I need to do more is set up authentication, a login for the user, and using AI to search for the closest item to the image to shop for.
   <br>
2. So far I have set up express, mongodb, and vite and fly.io to work with. I am deploying with fly.io since I had issues with using vercel and express.js
   <br>
3. Upload a photo and have AI help you find it on Ebay and maybe Amazon, using their free developer API so you can buy it. You can also use text of description of the item to help you look it up.

4. What my project seeks to solve is to help people who want to buy an item they saw on the street, or a the same laptop their friend has but they are not an expert at online shopping or searching. I had a problem finding my exact laptop charger when my laptop charger broke even when I looked up the model of my laptop. It took me a while to find it online, and I think AI will be helpful in finding the item faster. They could also help ask specific questions for the user. I'm sticking to ebay's developer api and maybe add amazon later.

5. My project will use vercel to host my website (might change depending on my needs), and use hugging face api/ai to compare images to current data models and text. Use Ebay's developer API to search their shop. Might use Mongodb to store user's previous search and authenticate user login.

6. Authenticate user login to look at their search history and saved links. Can also use text to search description of the item to help you look it up. Crud routes will be delete history and add to history. (This might change later on). Maybe index on the description of the product. Will use Hugging face API/AI and Ebay's Developer API. Demonstrate using the front end of the app.

2 Crud routes: <br>

1. SearchHistory (User's past searches) <br>

   POST /search-history → Add a new search entry <br>

   GET /search-history → Get all search entries for a user <br>

   PUT /search-history/:id → Update a specific search entry (maybe to rename or edit the query) <br>

   DELETE /search-history/:id → Delete a specific search entry <br>

2. SavedLinks (Items the user wants to keep) <br>

   POST /saved-links → Save a new link (like from eBay or Amazon) <br>

   GET /saved-links → Get all saved links for a user <br>

   PUT /saved-links/:id → Update a saved link's title or notes <br>

   DELETE /saved-links/:id → Remove a saved link <br>

3. Timeline: <br>
   Week 6: Allow the user to upload an image and a front end page that shows this. Set up project with needed libraries. <br>
   Week 7: Store user information and allow them to delete their history and add search to their history when they make new search <br>
   Week 8: Have the Hugging face API and EBay API working <br>
   Week 9: Continue working with the API and do testing near the end. <br>
   Week 10: Showcase project
