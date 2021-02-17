import * as Analytics from 'expo-firebase-analytics'
import * as StoreReview from 'expo-store-review'
import { getSetInfo } from './constants'
import { analyticsMode } from './modeSwitch'

/**
 * This file contains a bunch of functions that send log events to Firebase analytics. This allows us to keep track of useful information.
 */

/**
 * Logs the installation of a new language instance.
 * @export
 * @param {string} languageName - The ID of the language instance.
 * @param {string} phoneLanguage - The ID of the phone language.
 */
export async function logInstallLanguage (languageName, phoneLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('InstallLanguage', {
      languageName: languageName,
      phoneLanguage: phoneLanguage
    })
}

/**
 * Logs the completion of a lesson.
 * @export
 * @param {Object} lesson - The lesson object of the lesson that was completed.
 * @param {Object} set - The set that the completed lesson is a part of.
 * @param {string} currentLanguage - The ID of the active group's language.
 */
export async function logCompleteLesson (lesson, set, currentLanguage) {
  // If the lesson that is completed is the very first one, then request that the user submit a review on the App Store/Play Store.
  if (lesson.id.includes('1.1.1') && lesson.id.length === 8) {
    StoreReview.requestReview()
  }
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CompleteLesson', {
      lessonID: lesson.id,
      setID: set.id,
      setCategory: getSetInfo('category', set.id),
      language: currentLanguage
    })
}

/**
 * Logs the completion of a Story Set.
 * @export
 * @param {Object} set - The set object for the set that was completed.
 * @param {string} currentLanguage - The ID of the active group's language.
 */
export async function logCompleteStorySet (set, currentLanguage) {
  StoreReview.requestReview()
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CompleteStorySet', {
      setID: set.id,
      setCategory: getSetInfo('category', set.id),
      language: currentLanguage
    })
}

/**
 * Logs the global unlock of the Mobilization Tools.
 * @export
 * @param {string} currentLanguage - The ID of the active group's language.
 */
export async function logUnlockMobilizationTools (currentLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('UnlockMobilizationTools', {
      language: currentLanguage
    })
}

/**
 * Logs the creation of a new group.
 * @export
 * @param {string} currentLanguage - The ID of the active group's language.
 */
export async function logCreateGroup (currentLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CreateGroup', {
      language: currentLanguage
    })
}

/**
 * Logs enabling the Mobilization Tools for a specific group.
 * @export
 * @param {string} currentLanguage - The ID of the active group's language.
 */
export async function logEnableMobilizationToolsForAGroup (currentLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('EnableMobilizationToolsForAGroup', {
      currentLanguage: currentLanguage
    })
}

/**
 * Logs adding a new story set.
 * @export
 * @param {Object} set - The set object for the set that was added.
 */
export async function logAddStorySet (set) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('AddStorySet', {
      setID: set.id,
      setCategory: getSetInfo('category', set.id)
    })
}

/**
 * Logs sharing the app URL.
 * @export
 * @param {Object} lesson - The lesson object for the lesson the user is doing when they share the app.
 */
export async function logShareApp (lesson) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareApp', {
      lessonID: lesson.id
    })
}

/**
 * Logs sharing the scripture text for a lesson.
 * @export
 * @param {Object} lesson - The lesson object for the lesson the user is doing when they share the scripture text.
 */
export async function logShareText (lesson) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareText', {
      lessonID: lesson.id
    })
}

/**
 * Logs sharing the app Story chapter mp3.
 * @export
 * @param {Object} lesson - The lesson object for the lesson the user is doing when they share the Story chapter mp3.
 */
export async function logShareAudio (lesson) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareAudio', {
      lessonID: lesson.id
    })
}
