import * as Analytics from 'expo-firebase-analytics'
import { getSetInfo } from '../constants'
export async function logInstallLanguage (languageName, phoneLanguage) {
  await Analytics.logEvent('InstallLanguage', {
    languageName: languageName,
    phoneLanguage: phoneLanguage
  })
}

export async function logCompleteLesson (lesson, set, currentLanguage) {
  await Analytics.logEvent('CompleteLesson', {
    lessonID: lesson.id,
    setID: set.id,
    setCategory: getSetInfo('category', set.id),
    language: currentLanguage
  })
}

export async function logCompleteStorySet (set, currentLanguage) {
  await Analytics.logEvent('CompleteStorySet', {
    setID: set.id,
    setCategory: getSetInfo('category', set.id),
    language: currentLanguage
  })
}
export async function logUnlockMobilizationTools (currentLanguage) {
  await Analytics.logEvent('UnlockMobilizationTools', {
    language: currentLanguage
  })
}
export async function logCreateGroup (currentLanguage) {
  await Analytics.logEvent('CreateGroup', {
    language: currentLanguage
  })
}
export async function logEnableMobilizationToolsForAGroup (currentLanguage) {
  console.log(currentLanguage)
  await Analytics.logEvent('EnableMobilizationToolsForAGroup', {
    currentLanguage: currentLanguage
  })
}
export async function logAddStorySet (set) {
  await Analytics.logEvent('AddStorySet', {
    setID: set.id,
    setCategory: getSetInfo('category', set.id)
  })
}
export async function logShareApp (lesson) {
  await Analytics.logEvent('ShareApp', {
    lessonID: lesson.id
  })
}
export async function logShareText (lesson) {
  await Analytics.logEvent('ShareText', {
    lessonID: lesson.id
  })
}
export async function logShareAudio (lesson) {
  await Analytics.logEvent('ShareAudio', {
    lessonID: lesson.id
  })
}
