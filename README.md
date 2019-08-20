# NCBI Visual DNA Database Representation

## Links
- Link to deployed site: https://sashabausheva.github.io/ncbi-challenge-client
- Link to the front end repository: https://github.com/SashaBausheva/ncbi-challenge-client
- Link to the deployed API: https://vast-hollows-72654.herokuapp.com

## Application Description
This is a single-page application allowing users to access a database of DNA sequences and add new sequences along with their names and descriptions. The back end was built using Express.js and MongoDB. The front end was built using React.js and Axios for http requests.

## Technologies Used
- Express.js
- Node.js
- Mongoose
- MongoDB
- Heroku
- Git & GitHub

## Setup and Installation:
1.  Fork and clone the respository locally
1.  Install dependencies with `npm install`.
1.  Ensure that you have nodemon installed by running `npm install -g nodemon`
1.  Ensure the server can run properly by running `npm run server`
1.  `git add` and `git commit` your changes.

#### Deploying to Heroku

Begin inside the root directory of your application.

1. Run `heroku create` in the command line in the root of the API to
create a new (blank) app on Heroku.
1. Commit to your local master branch
1. Push your latest code to Heroku (`git push heroku master`)
1. Setting up mLab on heroku:
  + Run heroku addons:create with mongolab:sandbox
`$ heroku addons:create mongolab:sandbox`
  + The first time you run the above command you may see a message like this:
  ```
  Creating mongolab:sandbox on ⬢ pacific-cliffs-91276... !
 ▸    Please verify your account to install this add-on plan (please enter a credit card) For more information, see
 ▸    https://devcenter.heroku.com/categories/billing Verify now at https://heroku.com/verify
 ```
 + You'll need to go to that URL, enter in your credit card information and then re-run the command again. This time you should see something like:
```
Creating mongolab:sandbox on ⬢ pacific-cliffs-91276... free
Welcome to mLab.  Your new subscription is being created and will be available
shortly. Please consult the mLab Add-on Admin UI to check on its progress.
Created mongolab-cubed-11237 as MONGODB_URI
Use heroku addons:docs mongolab to view documentation
```
  + Now you can log into your heroku dashboard, go to add-ons and click the mlab link. This will bring you to your mlab database.
  + If you already have an mLab account connected to your heroku account, you may see the second message and skip having to enter your credit card information.
  + Either way, if you see this output, it worked, and you can resume the following deployment steps.
1. in terminal, run: `git push heroku master`  (should build your site)
1. due to the first line of code in the `server.js` file, the default
deployment environment will be `production`
1. in terminal, run: `echo SECRET_KEY=$(openssl rand -base64 66 | tr -d '\n')`
this should generate a secret_key
1. in the terminal run:
`heroku config:set SECRET_KEY=<copy and paste secret_key generated from last command>`.
It should start with “SECRET_KEY= and a span of about 40 randomized characters”
1. you need to set your CLIENT_ORIGIN so that your deployed API will ONLY
accept requests from the correct domain. IF you're client is deployed on Github,
your ORIGIN will be:
      `https://<% github username %>.github.io`
1. Set your client ORIGIN by:
      `heroku config:set CLIENT_ORIGIN="https://<% github username %>.github.io"`
1. You should have three config variables set in heroku
(`heroku>settings>config vars`): MONGODB_URI, SECRET_KEY, CLIENT_ORIGIN
1. Once all three of these are set, run in terminal: `heroku restart`
1. Then in terminal, run: `heroku open`

A full list of Heroku commands can be accessed by running `heroku --help`

## Planning, Process, and Problem-solving Strategy
I approached this project by first creating my back-end schema to ensure I understand the required structure for my http requests. The sequence model includes: sequence name (string, unique), sequence description (string), and the sequence itsel. I also needed to ensure every sequence in the database is unique, which I addressed in my POST routes.<br/><br/>
After my backend skeleton was set up and tested with cURL scripts, I focused on the view-sequences view. I implemented the ReactTable component on the front end to GET (index) and display sequence data. The component allows users to filter and/or sort the data by name, description, and sequence itself. I then included a Model component to display each sequence entry separately by clicking on the truncated sequence in the table.<br/><br/>
After the basic aspects of the table were functioning, I swithed to the add-sequence view. The form in it allows users to manually input sequence information and submit it firing a POST request. If the data is added to the database successfully, the application redirects to the view-sequences view where the new sequence is rendered along with the rest.<br/><br/>
Finally, I added two more features to view-sequences: Users can now upload multiple sequences via a JSON file and download the entire database as a JSON file as well.

## API End Points

| Verb   | URI Pattern              | Controller#Action     |
|--------|--------------------------|-----------------------|
| POST   | `/sequences`             | `sequences#create`    |
| POST   | `/upload`                | `sequences#create`    |
| GET    | `/sequences`             | `sequences#index`     |

## Feature Summary
  - View all DNA sequences
  - Sort sequences by name, description, or sequence itself
  - Filter sequences by name, description, or sequence itself
  - Change number of sequences displayed on one page
  - Manually add sequence by filling out a form
  - Add multiple sequences via a JSON file
  - Download the database as a JSON file
  - Display signle sequence entries in a modal with nucleotide bases rendered in different colors
  - Duplicate sequences or sequence names are not accepted
  - Sequences containing letters other than A, C, T, and G are not accepted
  - Cool gif on homepage

## Unsolved Problems / Future Iterations
Not an unsolved problem, but an interesting discovery: Mongoose will not allow you to set sequences as indexes and make them unique via sequence schema since most sequences are too long. I had to find an alternative solution via Sequence.count(parameters) in sequence routes.<br/><br/>
Also solved, but interesting to note: I had to implement Promises.all in the POST route for JSON file upload. When a user uploads a file, the back-end has to only send the response data that will trigger table refresh after it has added all the sequences from the file to the database. In order to do that, I needed to create promises for each sequence from the file and only send a response back to client after all of the promises have been resolved.<br/><br/>
I would like to style the JSON file input form in a more aesthetically pleasing way in the future.<br/><br/>
I would like to allow users to remove or edit sequences. However, this might result in unwanted data alteration, so I would need to think how to approach this problem (perhaps by implementing authentication). This would depend on the ultimate goal of the application.

#### User Stories
* As a user, I want to be able to view all DNA sequences in the database.
* As a user, I want to be able to sort the sequence by name, description, and sequences themselves.
* As a user, I want to be able to filter the sequence by name, description, and sequences themselves.
* As a user, I want to be able to view single sequence entries in a modal (with nucleotide bases rendered in different colors).
* As a user, I want to be able to manually add a sequence to the database by submitting a form.
* As a user, I want to be able to upload multiple sequences via a JSON file.
* As a user, I want to be able to download the entire database as a JSON file.
