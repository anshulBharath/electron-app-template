# Electron React Basic App

This application provides all the files, scripts, and dependencies to get you started building basic electron react destop applications.

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Prerequisites](#prerequisites)
* [Setup](#setup)
* [Customize](#customize)

## General info
This project is meant to provide developers with an easy way to get setup with electron react apps. There are a lot of mixed resources out there for developing electron react apps. There are even npm libaries that create this exact template for you (npm create-electron-react). I found that this is is straight forward and leaves out many of the extras.
	
## Technologies
Project is created with:
* Electron
* React.js
* Node.js 

## Prerequisites
Minimum Software:
* node 
* npm
* yarn 
	
## Setup
Before contributing to this project make sure you have node.js, npm, and yarn installed.
Run these commands to check your installed status:

```
$ npm -v
$ node -v
$ yarn -v
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
  - Additional info on buildiing the electron app for production can be found [here](https://www.electron.build/)

