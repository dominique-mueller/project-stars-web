[navigate back](./../SETUP.md)

# Install NodeJS on Windows

We use **NodeJS** for different purposes. First, our entire backend is written completely in NodeJS. Second, our dependency management and automated build processes (with Gulp) both depend on NodeJS. Therefore an installation of NodeJS is required, no matter what you're planning to do.

> Tip: You can use **[NVM](https://github.com/coreybutler/nvm-windows)** when working with multiple NodeJS versions.

<br>

### Step 1: Download and install NodeJS

Download the *5th* version of **NodeJS for Windows** from [the official website](https://nodejs.org/en/download/releases/), and then follow the installation instructions. You can make sure the installation finished successfully by opening up your command line and run:

<pre>
node --version
</pre>

> The version of NodeJS is really important! At the time of this writing we used *version 5.11.1*.
> - DO NOT USE *version 6.x* yet as it may affect the build process in a bad way.
> - DO NOT USE any version below *version 5.x* to make shure everything works as expected.

<br>

### Step 2: Update NPM

NodeJS comes (similar to other programing languages) with an integrated package manager called **Node Package Manager**, or short **NPM**. This package manager is able to update itself to its latest version. We highly recommend to do this in order to prevent possible issues. Open up your command line and run:

<pre>
	npm install -g npm
</pre>

> Note: If you are behind a proxy, additional configuration for NodeJS as well as NPM may be required.
