[navigate back](../SETUP.md)

# Install Git on Windows

We use **Git** as our software version control solution. The source code of this project is entirely managed via Git in combination with GitLab. You need to install Git not only to download but also to develop on this project.

<br>

### Step 1: Download and install Git

Download the latest version of **Git for Windows** from [the official website](https://git-scm.com/downloads), and then follow the installation instructions. You can make sure the installation finished successfully by opening up your command line and run:

<pre>
git --version
</pre>

> At the time of this writing we used *version 2.8.2*. We highly recommend you to use at least *version 2.5.3* if you're planning on using integrated Git Flow commands.

<br>

### Step 2: Configure Git

After the installation you need to configure Git. All you need to do is tell Git you user information. Please use the data you provided for your GitLab account. Open up your command line and run:

<pre>
	git config --global user.name "[YOUR_USER_NAME]"
	git config --global user.email "[YOUR_USER_EMAIL]"
</pre>

> Note: If you are behind a proxy, additional configuration may be required.
