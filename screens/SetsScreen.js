import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import SetItem from '../components/list-items/SetItem'
import { getSetInfo, scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state),
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    // For testing.
    languageCoreFilesToUpdate: state.database.languageCoreFilesToUpdate,
    languageCoreFilesCreatedTimes: state.database.languageCoreFilesCreatedTimes,
    globalGroupCounter: state.database.globalGroupCounter
  }
}

/**
 * Screen that shows the list of currently added story sets in a tab. Used three times for the three different set tabs.
 */
function SetsScreen ({
  // Props passed from navigation.
  navigation: { navigate },
  route: { name: routeName },
  // Props passed from redux.
  activeDatabase,
  isRTL,
  activeGroup,
  translations,
  font,
  languageCoreFilesToUpdate,
  languageCoreFilesCreatedTimes,
  globalGroupCounter
}) {
  /** Keeps track of the text displayed on the add set button. Changes depending on what tab we're on. */
  const [addNewSetLabel, setAddNewSetLabel] = useState('')

  /** Keeps track of the category (or tab) of sets we're displaying. */
  const [setCategory, setSetCategory] = useState('')

  /** Keeps track of all of the files the user has downloaded to the user's device. This is used to verify that all the required question set mp3s are downloaded for the sets that have been added. */
  const [downloadedFiles, setDownloadedFiles] = useState([])

  /** useEffect function that sets the setCategory state and the addNewSetLabel state based off the route name. Updates whenever the activeGroup changes. */
  useEffect(() => {
    if (routeName === 'Foundational') {
      setAddNewSetLabel(
        translations.sets.add_foundational_story_set_button_label
      )
      setSetCategory('foundational')
    } else if (routeName === 'Topical') {
      setAddNewSetLabel(translations.sets.add_topical_set_button_label)
      setSetCategory('topical')
    } else {
      setAddNewSetLabel(translations.sets.add_mobilization_tool_button_label)
      setSetCategory('mobilization tools')
    }
  }, [activeGroup, translations])

  //+ NAV OPTIONS

  useEffect(() => {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        console.log('Files:')
        console.log(contents)
        setDownloadedFiles(contents)
      }
    )
    // console.log(`Groups:`)
    // groups.forEach(group => console.log(group.language))

    // console.log(
    //   `Languages in DB: ${Object.keys(database).filter(
    //     key => key.length === 2
    //   )}`
    // )
    // console.log(`Language core files to update: ${languageCoreFilesToUpdate}\n`)
    // console.log(
    //   `Language core files created times: ${JSON.stringify(
    //     languageCoreFilesCreatedTimes
    //   )}\n`
    // )
  }, [languageCoreFilesToUpdate])

  function filterForDownloadedQuestionSets (set) {
    var requiredQuestionSets = []

    set.lessons.forEach(lesson => {
      if (lesson.fellowshipType) {
        if (!requiredQuestionSets.includes(lesson.fellowshipType)) {
          requiredQuestionSets.push(lesson.fellowshipType)
        }
        if (!requiredQuestionSets.includes(lesson.applicationType)) {
          requiredQuestionSets.push(lesson.applicationType)
        }
      }
    })

    if (
      requiredQuestionSets.every(questionSet =>
        downloadedFiles.includes(
          activeGroup.language + '-' + questionSet + '.mp3'
        )
      )
    )
      return true
    else return false
  }

  // get the sets for whatever tab we're on
  function getSetData () {
    // if we're adding core sets, display them in numerical order
    return routeName === 'Foundational'
      ? activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === setCategory)
          .filter(set =>
            activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
          .filter(filterForDownloadedQuestionSets)
      : // if we're displaying topical/mt sets, display them in the order added
        activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === setCategory)
          .filter(set =>
            activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
          .filter(filterForDownloadedQuestionSets)
          .sort((a, b) => {
            return a.index - b.index
          })
          .sort((a, b) => {
            return (
              activeGroup.addedSets.indexOf(
                activeGroup.addedSets.filter(
                  addedSet => addedSet.id === a.id
                )[0]
              ) -
              activeGroup.addedSets.indexOf(
                activeGroup.addedSets.filter(
                  addedSet => addedSet.id === b.id
                )[0]
              )
            )
          })
  }

  //+ RENDER

  function renderStudySetItem ({ item }) {
    return (
      <SetItem
        thisSet={item}
        mode='shown'
        onSetSelect={() =>
          navigate('Lessons', {
            thisSet: item
          })
        }
      />
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={getSetData()}
        renderItem={renderStudySetItem}
        extraData={activeGroup}
        ListFooterComponent={
          <TouchableOpacity
            style={[
              styles.addNewSetContainer,
              { flexDirection: isRTL ? 'row-reverse' : 'row' }
            ]}
            onPress={() =>
              navigate('AddSet', {
                category: setCategory
              })
            }
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 80 * scaleMultiplier,
                height: 80 * scaleMultiplier
              }}
            >
              <Icon
                name='plus'
                size={60 * scaleMultiplier}
                color={colors.chateau}
                style={styles.addNewSetIcon}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'column',
                marginRight: isRTL ? 20 : 0,
                marginLeft: isRTL ? 0 : 20
              }}
            >
              <Text
                style={StandardTypography(
                  { font, isRTL },
                  'p',
                  'Regular',
                  'left',
                  colors.chateau
                )}
              >
                {addNewSetLabel}
              </Text>
            </View>
          </TouchableOpacity>
        }
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.porcelain
  },
  headerImage: {
    resizeMode: 'contain',
    width: 120,
    height: 40,
    alignSelf: 'center'
  },
  addNewSetContainer: {
    width: '100%',
    height: 80 * scaleMultiplier,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 20
  }
})

export default connect(mapStateToProps)(SetsScreen)
