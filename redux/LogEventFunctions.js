import * as Analytics from 'expo-firebase-analytics'
import { getSetInfo } from '../constants'
import { analyticsMode } from '../modeSwitch'
// switch between prod and test
// test doesn't keep track of analytics

export async function logInstallLanguage (languageName, phoneLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('InstallLanguage', {
      languageName: languageName,
      phoneLanguage: phoneLanguage
    })
}

export async function logCompleteLesson (lesson, set, currentLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CompleteLesson', {
      lessonID: lesson.id,
      setID: set.id,
      setCategory: getSetInfo('category', set.id),
      language: currentLanguage
    })
}

export async function logCompleteStorySet (set, currentLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CompleteStorySet', {
      setID: set.id,
      setCategory: getSetInfo('category', set.id),
      language: currentLanguage
    })
}
export async function logUnlockMobilizationTools (currentLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('UnlockMobilizationTools', {
      language: currentLanguage
    })
}
export async function logCreateGroup (currentLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('CreateGroup', {
      language: currentLanguage
    })
}
export async function logEnableMobilizationToolsForAGroup (currentLanguage) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('EnableMobilizationToolsForAGroup', {
      currentLanguage: currentLanguage
    })
}
export async function logAddStorySet (set) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('AddStorySet', {
      setID: set.id,
      setCategory: getSetInfo('category', set.id)
    })
}
export async function logShareApp (lesson) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareApp', {
      lessonID: lesson.id
    })
}
export async function logShareText (lesson) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareText', {
      lessonID: lesson.id
    })
}
export async function logShareAudio (lesson) {
  if (analyticsMode !== 'test')
    await Analytics.logEvent('ShareAudio', {
      lessonID: lesson.id
    })
}
