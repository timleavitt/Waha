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
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function SetScreen (props) {
  //+ STUFF FOR TESTING

  // console.log(scaleMultiplier)

  //+ STATE

  // shows the add new set modal
  const [addNewSetLabel, setAddNewSetLabel] = useState('')
  const [setCategory, setSetCategory] = useState('')
  const [downloadedFiles, setDownloadedFiles] = useState([])

  //+ CONSTRUCTOR

  useEffect(() => {
    // console.log(props.route.name)
    if (props.route.name === 'Foundational') {
      setAddNewSetLabel(
        props.translations.sets.add_foundational_story_set_button_label
      )
      setSetCategory('foundational')
    } else if (props.route.name === 'Topical') {
      setAddNewSetLabel(props.translations.sets.add_topical_set_button_label)
      setSetCategory('topical')
    } else {
      setAddNewSetLabel(
        props.translations.sets.add_mobilization_tool_button_label
      )
      setSetCategory('mobilization tools')
    }
  }, [props.activeGroup, props.translations])

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
    // props.groups.forEach(group => console.log(group.language))

    // console.log(
    //   `Languages in DB: ${Object.keys(props.database).filter(
    //     key => key.length === 2
    //   )}`
    // )
    console.log(
      `Language core files to update: ${props.languageCoreFilesToUpdate}\n`
    )
    console.log(
      `Language core files created times: ${JSON.stringify(
        props.languageCoreFilesCreatedTimes
      )}\n`
    )
  }, [props.languageCoreFilesToUpdate])

  function filterForDownloadedQuestionSets (set) {
    var requiredQuestionSets = []

    set.lessons.forEach(lesson => {
      if (!requiredQuestionSets.includes(lesson.fellowshipType)) {
        requiredQuestionSets.push(lesson.fellowshipType)
      }
      if (!requiredQuestionSets.includes(lesson.applicationType)) {
        requiredQuestionSets.push(lesson.applicationType)
      }
    })

    if (
      requiredQuestionSets.every(questionSet =>
        downloadedFiles.includes(
          props.activeGroup.language + '-' + questionSet + '.mp3'
        )
      )
    )
      return true
    else return false
  }

  // get the sets for whatever tab we're on
  function getSetData () {
    // if we're adding core sets, display them in numerical order
    return props.route.name === 'Foundational'
      ? props.activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === setCategory)
          .filter(set =>
            props.activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
          .filter(filterForDownloadedQuestionSets)
      : // if we're displaying topical/mt sets, display them in the order added
        props.activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === setCategory)
          .filter(set =>
            props.activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
          .filter(filterForDownloadedQuestionSets)
          .sort((a, b) => {
            return a.index - b.index
          })
          .sort((a, b) => {
            return (
              props.activeGroup.addedSets.indexOf(
                props.activeGroup.addedSets.filter(
                  addedSet => addedSet.id === a.id
                )[0]
              ) -
              props.activeGroup.addedSets.indexOf(
                props.activeGroup.addedSets.filter(
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
        isSmall={false}
        mode='shown'
        onSetSelect={() =>
          props.navigation.navigate('LessonList', {
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
        extraData={props.activeGroup}
        ListFooterComponent={
          <TouchableOpacity
            style={[
              styles.addNewSetContainer,
              { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
            ]}
            onPress={() =>
              props.navigation.navigate('AddSet', {
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
                marginRight: props.isRTL ? 20 : 0,
                marginLeft: props.isRTL ? 0 : 20
              }}
            >
              <Text
                style={StandardTypography(
                  props,
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeDatabase: state.database[activeGroup.language],
    groups: state.groups,
    database: state.database,
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup,
    languageCoreFilesToUpdate: state.database.languageCoreFilesToUpdate,
    languageCoreFilesCreatedTimes: state.database.languageCoreFilesCreatedTimes
  }
}

export default connect(mapStateToProps)(SetScreen)
