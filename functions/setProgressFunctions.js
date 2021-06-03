import { getSetInfo } from '../constants'

/** Checks to see if a set is almost complete and adds the next set if all the conditions are met. The conditions are:
 * 1) The Foundational set after this one exists.
 * 2) This set is 85% or more complete.
 * 3) This set is Foundational.
 * 4) The Foundational set after this one hasn't already been added.
 */
export const checkForAlmostCompleteSet = (
  thisSet,
  addedSet,
  activeGroup,
  activeDatabase,
  addSet,
  setShowNextSetUnlockedModal
) => {
  // Firstly, we need to get the set after this one before we can do anything else.
  var nextSet = activeDatabase.sets.filter(
    dbSet =>
      getSetInfo('category', dbSet.id) === 'Foundational' &&
      getSetInfo('index', dbSet.id) === getSetInfo('index', thisSet.id) + 1
  )[0]

  // If all of the criteria are met, add the next set and show a modal notifying the user.
  if (nextSet) {
    if (
      addedSet.progress.length / thisSet.lessons.length > 0.85 &&
      getSetInfo('category', thisSet.id) === 'Foundational' &&
      !activeGroup.addedSets.some(addedSet => addedSet.id === nextSet.id)
    ) {
      addSet(
        activeGroup.name,
        activeGroup.id,
        activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === 'Foundational')
          .filter(
            set =>
              getSetInfo('index', set.id) ===
              getSetInfo('index', thisSet.id) + 1
          )[0]
      )
      setShowNextSetUnlockedModal(true)
      return true
    }
  }
  return false
}

export const checkForFullyCompleteSet = (
  thisSet,
  addedSet,
  setShowSetCompleteModal
) => {
  if (addedSet.progress.length === thisSet.lessons.length) {
    setShowSetCompleteModal(true)
    return true
  }
  return false
}
