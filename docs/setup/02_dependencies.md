[navigate back](./../SETUP.md)

# Install dependencies

The Git repository only contains the project source code. Any dependencies *must* be handled by a suitable package manager. This project currently uses NPM as its one and only package manager solution, for both backend, frontend as well as development dependencies.

<br>

### Install NPM dependencies

NPM dependencies are declared within the `package.json` file which lies in the project root folder. In theory, we could differenciate between development and production environments. In reality, we need to install *both* normal as well as dev dependencies, primarily because we need the dev dependencies to run our build task. So open up your command line and run:

<pre>
npm install
</pre>

This process will install *all* project dependencies locally into the `node_modules` folder. After that, it will take the `typings.json` file in the root folder and installs all TypeScript Type Definitions into the `typings` folder.

> Note: If you are behind a proxy, additional configuration for NodeJS or NPM may be required. The installation of typings currently doesn't work behind a proxy. Read more in the NodeJS installation instructions.

<br>

### Install Gulp globally (optional)

Gulp recommends to be installed globally. This may not be necessary but might fix some unforseen issues. In theory, the build process should work just fine without this global installation. Nonetheless, to install Gulp globally open up your command line and run:

<pre>
npm install -g gulp-cli
</pre>

> Note: If you are behind a proxy, additional configuration for NodeJS or NPM may be required. Read more in the NodeJS installation instructions.
