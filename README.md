# Sky Shepherd Tag UI

A cross-platform UI for Sky Shepherd Tags. Built with React Native, targeting iOS and Android.

## Getting started

To get started, clone this repository, and [install dependencies](https://facebook.github.io/react-native/docs/getting-started.html). [React Native has recently begun to use `yarn`](https://facebook.github.io/react-native/blog/2016/11/08/introducing-button-yarn-and-a-public-roadmap.html), so we will do that too. These instructions are for macOS.

1. Install `nodejs`, `watchman`, `yarn`, and `react-native-cli`. You may install nodejs however you like (e.g. using [asdf version manager](https://github.com/asdf-vm/asdf)). If you already have a version of nodejs installed, you can use that (current version is 8.9.1). Here are instructions for using Homebrew:

       brew install nodejs
       brew install watchman
       brew install yarn --without-node
       npm install -g react-native-cli

2. Get this project

       git clone https://gitlab.com/safe-retrieve/sky-shepherd-tag-ui
       cd sky-shepherd-tag-ui

3. Install project dependencies

       yarn install

       # if needing to run iOS app
       # NOTE: requires Xcode 9 or above
       brew install cocoapods
       cd ios
       pod install --repo-update

       # if needing to run Android app
       echo "sdk.dir = $HOME/Library/Android/sdk" >> android/local.properties

4) Make sure you have Xcode and Android Studio installed to run the app using simulators or devices. Follow [React Native setup instructions](https://facebook.github.io/react-native/docs/getting-started.html) per platform

Now you are ready to run the app. You should be able to run the app using the `react-native` CLI. For iOS simulator:

    react-native run-ios

For Android, connect a device or boot a simulator, then:

    react-native run-android

Sometimes the `react-native` runner can't navigate your setup, and you need to run the project using Xcode or Android Studio. To run using Xcode:

* Open the project file `ios/Tag.xcodeproj` with Xcode. Run on a device or in the simulator as usual.

To run using Android Studio:

* Open the `android` directory with Android Studio. Run on a device or in the simulator as usual.

## Debugging

The [React Native Debugger](https://github.com/jhen0409/react-native-debugger) is really handy.

## Releases

Make sure you have fastlane installed

    bundle install

Building releases is automated with Fastlane. To publish beta releases on both platforms:

    yarn run beta

For individual platforms:

    yarn run beta:android
    yarn run beta:ios

## Style

This project uses [prettier](https://prettier.io/) for code formatting. We use the default prettier rules, with the addition of "--no-semi" for no semicolons. To see any code that needs formatting:

    yarn run prettier

To make the formatting changes:

    yarn run prettier --write

You can set up your editor to run prettier on save, to autoformat your code. For VSCode

* Install the ESLint and Prettier extensions
* In Settings, enable autosave

```javascript
{
  "editor.formatonsave": true,
}
```

To make prettier run in a pre-commit hook:

    cd .git/hooks
    ln -s -f pre-commit ../../.hooks/pre-commit.sh

Now, if you commit code whose style doesn't match, the file will be prettified. You can update your commit with the formatting changes:

    git add pretty-file.js
    git commit --amend
