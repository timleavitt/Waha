import * as Analytics from 'expo-firebase-analytics'
import * as StoreReview from 'expo-store-review'
import { getLessonInfo, getSetInfo } from '../constants'
import { analyticsMode } from '../modeSwitch'

/**
 * This file contains a bunch of functions that send log events to Firebase analytics. This allows us to keep track of useful information.
 */

/**
 * Logs the installation of a new language instance.
 * @export
 * @param {string} languageID - The ID of the language instance.
 * @param {string} phoneLanguageID - The ID of the phone language.
 */
export async function logInstallLanguage (languageID, phoneLanguageID) {
  console.log(
    `InstallLanguage logged with languageID: ${languageID} and phoneLanguageID: ${phoneLanguageID}.`
  )
  if (analyticsMode !== 'test')
    await Analytics.logEvent('InstallLanguage', {
      languageID: languageID,
      phoneLanguageID: phoneLanguageID
    })
}

/**
 * Logs the completion of a lesson.
 * @export
 * @param {Object} lesson - The lesson object of the lesson that was completed.
 * @param {string} groupID - The name of the currently active group.
 */
export async function logCompleteLesson (lesson, groupID) {
  console.log(
    `CompleteLesson logged with lessonID: ${lesson.id} and groupID: ${groupID}.`
  )
  // If the lesson that is completed is the very first one, then request that the user submit a review on the App Store/Play Store.
  if (lesson.id.includes('1.1.1') && lesson.id.length === 8) {
    StoreReview.requestReview()
  }
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CompleteLesson', {
      languageID: getLessonInfo('language', lesson.id),
      groupID: groupID,
      lessonID: lesson.id,
      lessonIndex: getLessonInfo('index', lesson.id),
      setID: getLessonInfo('setID', lesson.id),
      lessonSubtitle: getLessonInfo('subtitle', lesson.id),
      lessonCategory: getLessonInfo('category', lesson.id)
    })
}

/**
 * Logs the completion of a Story Set.
 * @export
 * @param {Object} set - The set object for the set that was completed.
 * @param {string} groupID - The name of the currently active group.
 */
export async function logCompleteStorySet (set, groupID) {
  console.log(
    `CompleteStorySet logged with setID: ${set.id} and groupID: ${groupID}.`
  )
  StoreReview.requestReview()
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CompleteStorySet', {
      languageID: getSetInfo('language', set.id),
      groupID: groupID,
      setID: set.id,
      setIndex: getSetInfo('index', set.id),
      setCategory: getSetInfo('category', set.id)
    })
}

/**
 * Logs the creation of a new group.
 * @export
 * @param {string} languageID - The ID of the active group's language.
 * @param {string} groupID - The name of the currently active group.
 * @param {number} groupNumber - The number of the new group.
 */
export async function logCreateGroup (languageID, groupID, groupNumber) {
  console.log(
    `CreateGroup logged with languageID: ${languageID}, groupID: ${groupID}, and groupNumber: ${groupNumber}.`
  )
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CreateGroup', {
      languageID: languageID,
      groupID: groupID,
      groupID: groupID,
      groupNumber: groupNumber
    })
}

/**
 * Logs enabling the Mobilization Tools for a specific group.
 * @export
 * @param {string} languageID - The ID of the active group's language.
 * @param {string} groupID - The name of the currently active group.
 * @param {number} groupNumber - The number of the new group.
 */
export async function logEnableMobilizationToolsForAGroup (
  languageID,
  groupID,
  groupNumber
) {
  console.log(
    `EnableMobilizationToolsForAGroup logged with languageID: ${languageID}, groupID: ${groupID}, and groupNumber: ${groupNumber}.`
  )
  if (analyticsMode !== 'test')
    await Analytics.logEvent('EnableMobilizationToolsForAGroup', {
      languageID: languageID,
      groupID: groupID,
      groupNumber: groupNumber
    })
}

/**
 * Logs adding a new story set.
 * @export
 * @param {Object} set - The set object for the set that was added.
 * @param {string} groupID - The name of the currently active group.
 */
export async function logAddStorySet (set, groupID) {
  console.log(
    `AddStorySet logged with setID: ${set.id} and groupID: ${groupID}.`
  )
  if (analyticsMode !== 'test')
    await Analytics.logEvent('AddStorySet', {
      languageID: getSetInfo('language', set.id),
      groupID: groupID,
      setID: set.id,
      setIndex: getSetInfo('index', set.id),
      setCategory: getSetInfo('category', set.id)
    })
}

/**
 * Logs sharing the app URL.
 * @export
 * @param {string} groupID - The name of the currently active group.
 */
export async function logShareApp (groupID) {
  console.log(`ShareApp logged with groupID: ${groupID}.`)
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareApp', {
      groupID: groupID
    })
}

/**
 * Logs sharing the scripture text for a lesson.
 * @export
 * @param {Object} lesson - The lesson object for the lesson the user is doing when they share the scripture text.
 * @param {string} groupID - The name of the currently active group.
 */
export async function logShareText (lesson, groupID) {
  console.log(
    `ShareText logged with lessonID: ${lesson.id} and groupID: ${groupID}.`
  )
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareText', {
      lessonID: lesson.id,
      groupID
    })
}

/**
 * Logs sharing the app Story chapter mp3.
 * @export
 * @param {Object} lesson - The lesson object for the lesson the user is doing when they share the Story chapter mp3.
 * @param {string} groupID - The name of the currently active group.
 */
export async function logShareAudio (lesson, groupID) {
  console.log(
    `ShareAudio logged with lessonID: ${lesson.id} and groupID: ${groupID}.`
  )
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareAudio', {
      lessonID: lesson.id,
      groupID
    })
}

/**
 * Logs the first enabling of Security Mode.
 * @exports
 * @param {string} groupID - The name of the currently active group.
 */
export async function logEnableSecurityMode (groupID) {
  console.log(`EnableSecurityMode logged with groupID: ${groupID}.`)
  if (analyticsMode !== 'test')
    await Analytics.logEvent('EnableSecurityMode', {
      groupID: groupID
    })
}
