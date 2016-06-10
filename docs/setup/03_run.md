[navigate back](../SETUP.md)

# Run the app

TODO: Description

<br>

### Step 1: Start MongoDB

First up, we need to start our database. You can run the MongoDB server by opening up your command line and run (update parameters if necessary):

<pre>
	mongod --config "C:\mongodb\mongo.config"
</pre>

> The MongoDB server runs now in this console window, so DO NOT close it.

<br>

### Step 2: Fill MongoDB with sample data

Due to this application only being a prototype, there is no way (yet) of registering a new user. As a consequence, we provide you with database sample data you can use to try out the application. We put the MongoDB dump in the `docs\db-dump` folder.

TODO: First up configure user

To restore this dump in the (currently running) MongoDB, open up a **new** command line, navigate to the `docs\db-dump` folder and run:

<pre>
	mongorestore db-dump
</pre>

> If the command finished successfully you can close the console as it is no longer needed.

<br>

### Step 3: Start the Node.js backend

It's simple. It's eay. Open up a **new** command line, navigate to the project root folder and run:

<pre>
	node app
</pre>

> The Node.js backend runs now in this console window, so DO NOT close it.

<br>

### Step 4: Visit the application

Open your favourite browser (not IE please ...) and simply navigate to `https://localhost` - that's it.

> Sidenote: While developing we're only using a self-signed SSL certificate. As a consequence, you need to accept our certificate in the browser.

**The following user accounts are provided:**

- *Standard-Nutzer 1*<br>
  E-Mail Addresse: `tim.tester@stars-web.de`<br>
  Passwort: `stars-web-1`

- *Administrator*<br>
  E-Mail-Adresse: `TODO`
  Passwort: `TODO`
