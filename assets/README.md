# Waha Assets
This folder contains all of the assets that are bundled with the app. Everything here is built with the app and included in the `.aab`/`.ipa` file that gets submitted to the stores.

## Directory Structure
The `assets/` folder has the following structure:
- `fonts/`: This folder contains all of the `.ttf` font files used in Waha. Every font must have 3 weights: regular, bold, and black. Each font family must have its own folder with the 3 weights inside of it. Note: these fonts do not need to necessarily be the regular, bold, and black variants of a font family. They just have to be 3 distint weights. No matter what variety they are, they will be loaded as FontName-Regular (or Bold or Black) in `App.js` so that they can be easily switched depending on the language of the active group. For instance, when displaying the Arabic font, the font used is NotoSansArabic. While the files are actually `NotoSansArabic-SemiCondensed.ttf`, `NotoSansArabic-SemiCondensedSemiBold.ttf`, and `NotoSansArabic-SemiCondensedBlack.ttf`, in `App.js`, they are loaded as `NotoSansArabic-Regular`, `NotoSansArabic-Bold`, and `NotoSansArabic-Black` respectively. Again, this makes it easy to switch between fonts. We can just add "`-Regular`" to the end of the name of the font used for a language and get the correct font weight. See `../styles/typography.js` for more information about how this works. In addition to any necessary `.ttf` font files, this folder contains a few other files:
  - `icon_font_config.js`: This file creates and exports the icon font used in Waha.
  - `waha_icon_font.tff`: This is the icon font `.ttf` file used in Waha. It contains all the icons used throughout the app.
- `gifs/`: This folder contains all of the gifs used throughout Waha.
- `groupIcons/`: This folder contains all of the group icon `.png` files that can be used for a group's avatar. It also contains one other config file:
  - `_groupIcons.js`: A config file that "requires" and exports all of the group icon files and creates a simple way to use them in the app. It has an underscore in the name so that it shows up above all of the group icon `.png` files.
- `icons/`: This folder contains the icons used for iOS and Android as well as the splash screen. Not to be confused with the icon font, these are the icons that show up on the user's home screen and in the app store listing.
- `languageT2S/`: Every language instance in Waha must have an `.mp3` file of their narrator saying the name of their language so that illiterate folks can still find their language instance of choice. These are referred to as "text-to-speech" files, or T2S. This folder contains those audio files, as well as a config file that "requires" them.
  - `_languageT2S.js`: A config file that "requires" and exports all of the language text-to-speech files.
- `pianoNotes/`: This folder contains all of the different piano notes that are played on the `PianoApp` screen which is activated by Waha's Security Mode.
- `securityMode/`: This folder contains any miscellaneous files needed for Waha's Security Mode. It contains these files:
  - `piano.png`: A simple image of a piano range selector that makes the piano app look more realisitic.
  - `unlock_security_mode_sound.mp3`: A simple, satisfying sound that plays whenever the user plays the correct code on the piano and unlocks the app.