# Electron React Basic App

This application provides all the files, scripts, and dependencies to get you started building basic electron react destop applications.

## Table of contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Prerequisites](#prerequisites)
* [Setup](#setup)
* [Customize](#customize)
* [Create Executables](#create-executables)

## General info
This project is meant to provide developers with an easy way to get setup with electron react apps. There are a lot of mixed resources out there for developing electron react apps. There are even npm libaries that create this exact template for you (npm create-electron-react). I found that this is is straight forward and leaves out many of the extras. The instruction assumes you have git setup on your machine, follow [these](https://www.educba.com/install-github/) instructions to get setup with git and GitHub Desktop.
	
## Technologies
Project is created with:
* Electron
* React.js
* Node.js 

## Prerequisites
Minimum Software:
* node v16.14.2
* npm 8.5.0
	
## Setup
Before contributing to this project make sure you have node.js and npm installed.
node version required: v17.6.0
Install node and npm [here](https://nodejs.org/en/download/) (Node installation comes with npm).
Run these commands to check your installed status:

```
$ npm -v
$ node -v
```

Follow these [instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository) to mirror this repository.
You can also fork the repository if you wish.

Clone the repository you create by using HTTPS or SSH protocols:

```
$ cd ../toWhereYouWantToCreateLocalRepo
$ git clone *theRepoYouForkedOrMirrored*
```

Navigate to the git repository, install node dependencies, and run the application in dev mode:

```
$ cd ../your-repo-name
$ npm install
$ npm run electron-dev
```

With *npm run electron-dev* you will be able to run your application in development mode.

## Customize

There are many areas you will want to customize to make this application your own.

#### package.json
* name: change to the name of your application (lowercase and seperated with '-')
* productName - the name of you product
* author: self-explanatory
* build
  - appId: name starts with com Ex. com.yourSampleApp
  - modify file paths
  - Additional info on specify buildiing the electron app for production in package.json can be found [here](https://www.electron.build/)

#### icons
* Icons for your application can be added to /src/assets/icons. Images must be at least 256x256.
  - mac: icons should have .icns extension
  - win: icons should have .ico extension

## Create Executables

Creating an executable is pretty straigt forward. The following scripts will create a windows .exe and mac .app in zip folders. 
IMPORTANT - make sure to set process.env to 'production' if you do not want dev tools available in production. There is a comment in electron.js
Before these steps, make sure to have the latest version of node installed. I am using v17.6.0 at the time of this commit.

Build React app. This will create a build folder where a compiled version of the React app will be placed.
```
$ npm run react-build
```

Build Electron App. This will take the built React App from the build folder and create a build for electron.
```
$ npm run electron-pack
```

You will now have your built zip files and unpacked files in the *dist* folder of the root folder.


