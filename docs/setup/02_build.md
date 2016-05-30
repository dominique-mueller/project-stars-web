[navigate back](./../SETUP.md)

# Run the build process

The frontend works on top of modern technologies which are not yet supported 100% by all browser. Furthermore, it is written in several languages that need a compilation / transpilation process so that they can be understood by browsers. Therefore, we use Gulp to create automated build processes.

<br>

### Build for development

First up, building the application for development reasons is simple. The build process builds the application from the `public` folder into the `build` folder. The process runs the following tasks:

- Clean the build diretory
- Setup (simply copy) all static assets
- Setup (simply copy) all configuration files
- Setup and autoprefix the inline CSS file
- Compile and autoprefix all SASS files into one CSS file
- Compile all TypeScript files into ES5 JavaScript files while also inlining HTML templates
- Setup the index.html file

> The development process uses SystemJS for dynamic module loading. Therefore the built JavaScript files remain in its directory structure. This is a lot faster than bundling modules, like we will see later on with Webpack in the production build.

To build the frontend for a development environment, open up your command line and run:

<pre>
npm run gulp build:dev
</pre>

> Note: This may take some seconds.

<br>

### Build for production

You can also build the application for a production environment. Similar to the development build, this build process builds the application from the `public` folder into the `build` folder. The process runs the following tasks:

- Clean the build diretory
- Setup (simply copy) all static assets
- Check SASS files against code quality rules (aka linkting)
- Check TypeScript files against code quality rules (aka linting)
- Setup, autoprefix and minify the inline CSS file
- Compile, autoprefix and minify all SASS files into one CSS file
- Compile and optimize all TypeScript files into ES5 JavaScript files while also inlining and minifying HTML templates
- Setup the index.html file
- Clear the temporary build folder

> The production process uses Webpack for bundling JavaScript modules. The output will be split into seperate files: `app.bundle.min.js` for the application, `vendor.bundle.min.js` for external frameworks and libraries as well as `polyfills.bundle.min.js` for polyfills.

To build the frontend for a development environment, open up your command line and run:

<pre>
npm run gulp build:prod
</pre>

> Note: This may take some (more) seconds.

<br>

### Build documentation

To dynamically generate the frontend documentation, open up your command line and run:

<pre>
npm run gulp build:docs
</pre>

> Note: Ignore the errors. It's a TypeDoc bug that (hopefully) will be fixed some day.

<br>

### Start the watcher for development

Gulp can also help us during development. When changing files, it can automatically recognize it and execute the correct build task for us. Then it can reload the page in the browser automatically. We use *BrowserSync* for this feature. Open up your command line and run:

<pre>
npm run gulp watch
</pre>

The application will be available on the URL `localhost:3000`.

> Note: Ignore the errors. It's a TypeDoc bug that (hopefully) will be fixed some day.
