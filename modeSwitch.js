// Determines which database the app draws from. 'test' uses the test database and 'prod' uses the production database.
export const dbMode = 'prod'

// Determines what mode redux persistence is in. 'test' means that no redux data is persisted across app restarts and should be used only for testing. 'prod' means that some data is persisted across restarts. The app should always be build in 'prod' mode.
export const reduxMode = 'prod'

// Determines whether analytics are tracked. 'test' means that they aren't and 'prod' means that they are.
export const analyticsMode = 'prod'

// The current version of Waha. This is used to compare versions with the database and is also displayed in the navigation drawer.
export const appVersion = '1.0.6'
