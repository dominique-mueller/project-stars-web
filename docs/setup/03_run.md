[navigate back](../SETUP.md)

# Run the app

Finally. It's getting interesting.

<br>

### Step 1: Start MongoDB

First up, we need to get our database running. You can start the MongoDB server by opening up your command line and run (with your parameters):

<pre>
mongod --config "C:\mongodb\mongo.config"
</pre>

> The MongoDB server runs now in this console window, so DO NOT CLOSE it.

<br>

### Step 2: Fill MongoDB with our sample data

Because this application is only a prototype, there is no way (yet) of registering a new user. As a consequence, we provide you with database sample data you can use to try out the application.

We put the MongoDB dump in the `docs\db-dump` folder. To read this dump into the (currently running) MongoDB, open up a **new** command line, navigate to the `docs` folder and run:

<pre>
mongorestore db-dump
</pre>

This restores our sample data into the MongoDB. Next, we need to setup the user our Node.js backend needs to connect with the MongoDB. Run the following commands in order to connect to the MongoDB and create the necessary user:

<pre>
mongo
use dev
db.createUser( { user: "devAdmin", pwd: "stars-web", roles: [ { role: "dbAdmin", db: "dev" } ] } )
exit
</pre>

> If the command finished successfully you can close the console as it is no longer needed.

<br>

### Step 3: Start the Node.js backend

It's simple. It's eay. Open up a **new** command line, navigate to the project root folder and run:

> On Linux you need to run the command with `sudo` because port mapping isn't configured.

<pre>
npm start
</pre>

> The Node.js backend runs now in this console window, so DO NOT CLOSE it.

<br>

### Step 4: Visit the application

Open your favourite browser (not IE please ...) and simply navigate to <a href="https://localhost" target="_blank">https://localhost</a> - that's it.

> Sidenote: During development we're using a *self-signed SSL certificate*. As a consequence, you need to accept our certificate in the browser.

---

**The following user accounts are configured and can be used:**

- *Tim Tester (Standard-Nutzer)*<br>
  E-Mail Addresse: `tim.tester@email.com`<br>
  Passwort: `stars-web-1`

- *Bobby Pinguin (Administrator)*<br>
  E-Mail-Adresse: `bobby.pinguin@email.com`<br>
  Passwort: `stars-web-2`

---

> PS: Try to type in a wrong passwort and enjoy the animation ;)
