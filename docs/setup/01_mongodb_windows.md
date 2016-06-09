[navigate back](../SETUP.md)

# Install MongoDB on Windows

We use the document-oriented noSQL database **MongoDB** as our application data storage. An installation of MongoDB is required to run the application.

<br>

### Step 1: Download and install MongoDB

Download the latest version of **MongoDB for Windows** from [the official website](https://www.mongodb.com/download-center?jmp=nav#community), select the community server version for `Windows Server 2008 R2 and later, with SSL support`. Then follow the installation instructions.

> At the time of this writing we used *version 3.2.6*.

<br>

### Step 2: Tell Windows about MongoDB

In contrast to Git and NodeJS, MongoDB doesn't add itself to the Windows environment. To do so, go to:
- Navigate to *PC Settings > System > About*
- Then click on *System Info* at the bottom of the page
- Select *Advanced System Settings* in the left-hand sidebar
- Hit the *Environment Variables ...* button in the upcoming dialog box

Now we need to add MongoDB to both the system and the user variables. Do this for each one of them by:
- Double clicking on the 'PATH' variable
- Clicking the *New* button
- Enter the path to your MongoDB installation on your machine; this looks something like `C:\Program Files\MongoDB\Server\3.2\bin`
- Hit enter to confirm and close the dialog box with *Ok*

After the process you need to restart the command line if opened. You can make sure this configuration process worked out by opening up your command line and run:

<pre>
	mongod
</pre>

<br>

### Step 3: Configure MongoDB

MongoDB needs a folder where it can save its databases. Setup the following folder structure:
- Create a `mongodb` folder, we recommend to place this directly on 'C:\'
- Within the `mongodb` folder create a `data` folder
- Within the `mongodb` folder also create a `mongo.log` file

Additionally, we need to add a configuration file. Name it `mongo.config`, place it in the `mongodb` folder and put the following content in it (update the values if necessary):

<pre>
dbpath=C:\mongodb\data
logpath=C:\mongodb\mongo.log
</pre>

You're now able to start the MongoDB server by openening up your command line and run (update parameters if necessary):

<pre>
	mongod --config "C:\mongodb\mongo.config"
</pre>
