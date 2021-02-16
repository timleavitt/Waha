# Waha Redux Store
Welcome to the redux documentation for the Waha app! Waha uses the Redux state container to manage data within the app.

Additions to the basic Redux setup include:

- **Redux Persist**: Automatically persists the data store to local storage to save the state across app restarts.
- **Redux Thunk**: Redux middleware to assist in the execution of asynchronous tasks like API calls.

## Directory Structure
This `/redux/` folder has the following structure:

- `actions/`: This folder contains all the redux action creators, separated based on the separation of the reducers.
- `reducers/`: This folder contains all the reducers that transform the state. These are separated based on logical separations of data.
- `combiner.js`: This file takes all of the separate reducers in `reducers/` and combines them into one reducer.
- `store.js`: This file takes the combined reducer created in `combiner.js`, makes it persisted, adds the thunk middleware, and finally creates the store.

## Reducers
Here's a brief overview of what each reducer covers. For more detail, see each individual reducer page.
1. `downloads.js` stores the active downloads, including progress, for Story Chapters or Training Chapter videos.
2. `database.js` stores all the information for all the language instances, including general info and Story Sets. It also stores the user's progress through setting up the app, such as onboarding, installing their first language instance, etc.
3. `groups.js` stores all of the created groups in Waha. Each group has a bunch of information, like its name, emoji, what Story Sets have been added, and the progress through all the Story Sets.
4. `activeGroup.js` stores the name of the currently active group.
5. `network.js` stores information about network connection.
6. `isInstallingLanguageInstance.js` stores whether the app is installing a language instance or not.
7. `areMobilizationToolsUnlocked.js` stores whether the Mobilization Tools are globally unlocked or not.
8. `security.js` stores all information related to Waha's Security Mode.
9. `mtUnlockAttempts.js` stores the number of times the user has tried to unlock the Mobilization Tools unsuccessfully.
10. `storedDownloads.js` stores the download resumables of any downloading core files so they can be cancelled if necessary.

## Accessing Data in Components/Screens

The structure of the data can be seen in `reducers/` in the documentation above the reducer declaration.

In order to access data from the store within a Component or Screen, there are a few things to add to the component.

### `connect` Component Wrapper

Every component that needs to access the redux store must use the connect function to do so. Here's how to implement the connect function:

1. Include the connect function with `import { connect } from 'react-redux';`.
2. Instead of exporting the component in the normal way of:

    `export default MyComponent` 
    
    ...use the connect function to wrap it like:

    `export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)`

### `mapStateToProps` to fetch data from store

The first parameter of the connect function is a function to retrieve state from redux. Every component or screen that needs to access state must have this function as well. It maps redux state to the props for the component/screen so that the state can be accessed in the component/screen.

### `mapDispatchToProps` to execute store actions

If the component or screen needs to dispatch actions, then a `mapDispatchToProps` must be included in the connect function as well. This is similar to the `mapStateToProps` function, but it allows you to access actions via props instead of state.