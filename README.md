<!-- <p align=center>
<img src="assets/icons/waha_icon.png" width=150 style="border-radius:15%">
<h3 align=center><strong>Waha</strong></h3>
<h4 align=center>Discover God's Story</h4>
</p> -->

<h1 align="center">
  <a href="https://waha.app/">
    Waha
  </a>
</h1>

<p align="center">
  <strong>Discover God's Story</strong><br>
  Mobilize the Believer & Make Disciples of the Lost
</p>

<h3 align="center">
  <a href="#download-from-the-app-store">Download</a>
  <span> · </span>
  <a href="https://partner.waha.app">Get your language on Waha</a>
  <span> · </span>
  <a href="https://github.com/kingdomstrategies/Waha/issues">Report a Bug</a>
</h3>
<br>

## About This Project
Waha is a multi-language, audio-based Discovery Bible Study and DMM training app. Small groups gather to listen to curated Discovery Bible Study stories and discuss the questions. Additionally, Waha is a system for pre-existing believers to be envisioned, trained, and mobilized to make disciples that multiply.

Some notable features of Waha are:
- **Secure**: Data is end-to-end encrypted and the app works offline. Waha comes with a "security mode", so that those in more conscious areas can use Waha without worry.
- **Curated Story Sets**: Curated Discovery Bible Study sets lead groups through Creation to Christ, making a decision about Jesus, and becoming healthy disciples, churches, and leaders.
- **Audio First**: Since Waha narrates every question and the story, group members only have to focus on discussion and discovery.
- **Obedience Based**: The DMM training (Mobilization Tools) encourages application over simply information-intake, so that believers can begin practicing disciple making habits from their very first few meetings.
- **Space Efficient**: Many users don't have a lot of space on their phones, so we made Waha use as little storage as possible and for all lessons to be downloadable from the cloud. This means people with all types of phones can use Waha.

### Built With
- React Native
- Expo
  
## Getting Started
### Download From the App Store
Waha is currently available on iOS and Android. You can download it here:
- [App Store (iOS)](https://apps.apple.com/us/app/waha-discover-gods-story/id1530116294)
- [Google Play Store (Android)](https://play.google.com/store/apps/details?id=com.kingdomstrategies.waha)

### Prerequisites
1. Make sure you have `Node.js` and `npm` installed. You can download them [here](https://nodejs.org/en/).
2. If you want to run the app on your mobile device from your local repository, you'll need the "Expo Go" app downloaded on that device. 

### Installation
1. Get the necessary Firebase config files and put them the `/firebase` folder.
2. Clone this repository:
    ```
    git clone https://github.com/kingdomstrategies/Waha
    ```
3. Install `npm` packages in the newly created directory:
    ```
    npm install
    ```
4. Start the Expo development server:
    ```
    npm start
    ```
5. Scan the QR code that appears in the terminal from the Expo app on your mobile device to open the app. If you're using an emulator, you can press "i" to automatically open it on an iOS emulator and "a" to automatically open it on an Android emulator.

## Directory Structure
- `/assets`: Contains all images and sound effects.
- `/components`: Contains all of the React Native components.
- `/firebase`: Contains the file `db.js` which exports the Firestore database object to be used throughout the app. This is where you'll put the extra Firebase configuration files as well.
- `/modals`: Contains all of the modal React Native components.
- `/navigation`: Contains all of the different `react-navigation` navigators. 
- `/redux`: Contains the redux store, combiner, and all of the action and reducer files.
- `/screens`: Contains all of the screen React Native components.
- `/styles`: Contains a few files for global styles, notably typography and colors.
- `/translations`: Contains `.json` objects of translations for all supported languages. Only contains translations that are used pre-firestore-fetch.
- `App.js`: The most top-level navigation component and the start of all rendering for Waha.
- `COPYING.txt`: Waha's license.
- `LogEventFunction.js`: A bunch of functions that log various useful app events to Firebase Analytics, like completing a lesson or creating a new group.
- `app.json`: Expo configuration file.
- `constants.js`: Some miscellaneous constant variables used throughout Waha. 
- `languages.js`: An object of all the languages in Waha.
- `modeSwitch.js`: Controls whether the app is in `prod` or `test` mode. Also used to store the current version number.

<!--
# Glossary
### L
- **Language Instance**: A language in Waha that the user can install. The reason it's not just called a "Language" is because it's possible there will be multiple Language Instances of the same language. For instance, an English for the US and an English for the UK. The term "Language" is generally used in the app code to describe the language that the user's phone is set to.
-->

## License
Distributed under the GNU GENERAL PUBLIC LICENSE. See COPYING.txt for more information.

## Contact
Email developer@kingdomstrategies.co with questions or concerns.
