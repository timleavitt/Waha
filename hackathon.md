# Hackathon
This document contains a list of things I'd love to do in Waha for the hackathon. There are a lot of things here and I'm not assuming that it will all get done during the hackathon, but I figure it's better to have too much than too little.

## Code Audit
I’d love to have a code audit for Waha. I’m the only one who has ever looked at Waha’s code and I’m a very new developer so it is incredibly valuable to me to have people with a lot more experience than me look over my code. I’d love to be a part of the code audit as much as possible since it will be helpful for me to learn what things are good/bad/need to change!

Here are some things I want to cover in the code audit:

### Code Quality/Standards
I’ve recently gone through and done a lot of refactoring and documentation, but obviously there’s lots more to do! I’m using JSDoc for documentation but the vanilla doesn't exactly fit with React Native all that well, so I’m hoping to get that solidified. Right now, I can’t auto-generate the API documentation as JSDoc is designed to do. I’d also just love a general look-over on code formatting, style, comments, etc. I want to make sure Waha is in line with standard coding conventions as well.

Throughout this, if anything needs to be redone, refactored, renamed, moved, reorganized, etc. that’s great too! My goal is to make Waha’s code base as good, organized, efficient, and clean as possible.

Finally, I’d also love to generally just find more bugs and issues since I know there’s lots I haven’t discovered!

### Performance
Waha’s target audience is people with low to mid quality Android phones. Because of that, performance is a significant factor. Right now, performance on low-end Android phones isn’t great. Obviously, being built with React Native and using Expo comes with some performance costs at the benefit of convenience and being on both platforms, but I’d love to be able to go through the app and do a performance check. I’ve done a little of this myself, but I’m certain there are many more things that can be done to boost performance. A couple areas that I’ve specifically noticed JS frame dips are:
* When downloading an mp3 or mp4 for a lesson (either from the `<LessonsScreen/>` or the `<PlayScreen/>`.
* When switching groups from the `<GroupsScreen/>`.
* When marking a lesson as complete from the `<LessonsScreen/>`.

### Expo
Waha was built with Expo and is still using the managed workflow. Do you recommend ejecting to leave room for platform-specific code? Up to this point it hasn’t been necessary. If so, I’d love help with that!

### Security
Security is a top priority for Waha since it’ll often be used in countries that aren’t accepting of Christianity. I’d love help finding security flaws or potential ways that governments/prying eyes could get access to Waha’s data. That could be in the database itself (I use Firestore) and its security rules, in the fetches to and from the database, or on the data stored locally on the app (mp3s/mp4s stored in local storage). I don’t know a whole lot about security or encryption so anything helps here!

### Database
Waha’s database is maintained via a VSCode file on my computer that I use to write changes to the database. I’m not sure this is a super sustainable, safe, or secure solution. I’m all ears for a better system. Some kind of CMS maybe?

I think my data model/database schema works well for Waha’s needs, but I'd love feedback on that as well.

### Error Handling
Waha doesn’t handle error states well right now. One example is that if, for some reason, a translation gets updated or moved and the correct protocol isn’t taking on my end for writing, the app would hard lock for users and they’d have to delete and reinstall 😬. Obviously, this isn’t great. We have a limited capacity for a variety of error messages since Waha is designed to be used for so many languages and more translations means more time/effort/money for our partners, so that’s a factor as well. 

### Testing
Waha has no setup for testing right now. I’d love to get integration/unit tests working on it so I can make testing before building new versions faster and easier. Right now, I just have a list of tasks that I go through the app and do to make sure all the basic functionality is working, but it certainly doesn’t cover everything and can be time-consuming. I’ve never done testing before in any project so I’d definitely appreciate help in it!

### Maintainability/Scalability
If there are parts of Waha that seem like they will be hard to scale or maintain, I’d love to work on how to more easily do that. The goal is for dozens of languages to be available on Waha within a few years.

## SD Card Feature
In many places in the world that we want Waha to be, there are internet and/or security issues. We’d like to be able to put a full Waha language instance on an SD card for someone to be able to just put into their phone and be able to access all of Waha’s content. Obviously this is an Android-specific feature since iOS devices don’t have micro SD card slots.

### Requirements
* 100% offline
* Runs from an SD card
* As performant as possible due to likely running on low-end devices
* Has all lesson mp3s and mp4s and Firestore data for the language included already
* Potential for having multiple languages installed on one app
* Easy to maintain (ideally I don’t want a separate code base for every language that has its own SD card version)

## Small Features
These are some smaller and less time-confusing features that we'd love to have. 

### New Play Screen
I’ve been working on a new play screen design and have mostly implemented it but need some help with efficiency/performance/glitchiness. The new design has a draggable scroll bar that the user can use to quickly scroll the a lesson’s text content. I’m having to build it mostly from scratch since there’s no React Native component for it and it’s proving to be finicky. 

### Lesson Progress Saving
Right now, exiting a lesson and re-entering into it will start it at the beginning every time. This isn’t ideal for if you want to finish a lesson later or the app crashes in the middle of a lesson. It’d be sweet if the user’s progress through a lesson was saved. This would involve saving the current chapter and current timestamp in that chapter in redux and loading up the right chapter to the right time when they enter back into the `<PlayScreen/>`. The app could also display a lesson as “in-progress” or show how close it is to being completed on the `<LessonsScreen/>` like a podcast player does.

### Zoom Integration
Because some people do lessons with their groups virtually, it’d be ideal if the facilitator of a lesson could create a zoom meeting from within Waha and easily send an invite link to other group members via a messaging app.

### Dark Mode
A feature mostly for fun, we’d love for Waha to have a dark mode option.

## Social Networking/Connectivity
One idea for a feature we had was to give the app some more social-networking-esque features. We’re not hoping to implement this during the hackathon but more just get an idea of how this might work and whether it’s possible with Waha’s other requirements. Here are a few ideas:

### Cloud Groups
A group would be stored in Firestore instead of locally on the user’s device. This would allow multiple people to join one group and have their progress sync across all their devices. User’s could join each other’s groups by looking up the group’s name or the group creator’s username or maybe by scanning a code like in Venmo or Snapchat.

An obvious downside is that syncing a group requires internet connection and Waha is designed to be able to be used offline as much as possible.

### User Account Creation
Obviously, if users are a part of a group stored in Firestore, they need to have an account so we know how to identify them. Ideally we wouldn’t require a name/email address for security reasons. Some people don’t like giving away their contact info and we don’t want there to be any barriers to someone using Waha. 

### Group Chat
There could be a chat feature for a group so that users who are in a group together can communicate from within Waha about when they’re meeting, what they’re applying, or whatever else they want to talk about.

### Lesson Start Notification
Whenever someone in the group starts a lesson, other users would get notifications on their phone that the lesson has started. Tapping on the notification would allow a non-facilitating user to follow along with the lesson via reading along with the lesson text. It could show the progress through the lesson, highlight the current chapter, and show the relevant text. This could just be a altered version of the play screen without the playback controls or scrubber. 

Potentially, if a group was doing a lesson virtually, it could be helpful to also be able to sync up audio and have it play through multiple devices at once, but this is a much more niche situation.