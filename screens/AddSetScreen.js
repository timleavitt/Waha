import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import { FlatList, LogBox, StyleSheet, Text, View } from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import TagGroup from 'react-native-tag-group'
import { connect } from 'react-redux'
import SetItem from '../components/list-items/SetItem'
import BackButton from '../components/standard/BackButton'
import Separator from '../components/standard/Separator'
import { getSetInfo, scaleMultiplier } from '../constants'
import SetInfoModal from '../modals/SetInfoModal'
import { addSet } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

LogBox.ignoreLogs(['Animated: `useNativeDriver`', 'Warning: Cannot update'])

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeDatabase: activeDatabaseSelector(state),
    activeGroup: activeGroupSelector(state),
    primaryColor: activeDatabaseSelector(state).primaryColor
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, setID) => {
      dispatch(addSet(groupName, setID))
    }
  }
}

/**
 * Screen that shows a list of available Story Sets to add in a specific category.
 * @param {string} category - The category of Story Sets to display.
 */
const AddSetScreen = ({
  // Props passed from navigation.
  navigation: { setOptions, goBack },
  route: {
    // Props passed from previous screen.
    params: { category }
  },
  // Props passed from redux.
  font,
  translations,
  isRTL,
  activeDatabase,
  activeGroup,
  primaryColor,
  addSet
}) => {
  /** Whether the snackbar that pops up upon adding a set is visible or not.  */
  const [showSnackbar, setShowSnackbar] = useState(false)

  /** State for header title. Stored as state because it changes depending on which category we're viewing the story sets for. */
  const [headerTitle, setHeaderTitle] = useState('')

  /** Keeps track of the Topical Story Set tags. Tags are retrieved from the database. */
  const [tags, setTags] = useState([])

  /** Keeps track of the currently selected tag. */
  const [selectedTag, setSelectedTag] = useState('')

  /** Keeps track of whether the <SetInfoModal /> is visible. */
  const [showSetInfoModal, setShowSetInfoModal] = useState(false)

  /** Keeps track of the Story Set that the user selects and that populates the <SetInfoModal />. */
  const [setInModal, setSetInModal] = useState({})

  /** Keeps track of all the downloaded question set mp3s. We need this to verify that all the required question set mp3s are installed for the various Story Sets.*/
  const [downloadedFiles, setDownloadedFiles] = useState([])

  /** useEffect function that sets the headerTitle state as well as fetching the tags if we're displaying Topical Story Sets. */
  useEffect(() => {
    switch (category) {
      case 'foundational':
        setHeaderTitle(translations.add_set.header_foundational)
        break
      case 'topical':
        setHeaderTitle(translations.add_set.header_topical)

        // Start off array of tags with the 'All' label since we always display that option.
        var tags = [translations.add_set.all_tag_label]

        // Go through each Topical Story Set and add all the various tags to our tag array.
        activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === 'topical')
          .forEach(topicalSet => {
            topicalSet.tags.forEach(tag => {
              // If we find a tag that hasn't been added yet, add it.
              if (!tags.includes(tag)) tags.push(tag)
            })
          })
        setTags(tags)
        break
      case 'mobilization tools':
        setHeaderTitle(translations.add_set.header_mt)
        break
    }
  }, [])

  /** useEffect function that checks what files are downloaded to local storage. */
  useEffect(() => {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        setDownloadedFiles(contents)
      }
    )
  }, [])

  /** useEffect function that hides the Snackbar if we leave the screen before it auto-dismisses. */
  useEffect(() => {
    return function cleanup () {
      setShowSnackbar(false)
    }
  }, [])

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      title: headerTitle,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => goBack()} />,
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => <View></View>
    })
  }, [headerTitle])

  /**
   * Goes through a set and verifies that all of the necessary question set mp3s have been downloaded for that set. This gets passed through the filter function below.
   * @param {Object} set - The object for the set that we're checking.
   * @return {boolean} - Whether every necessary file has been downloaded for the set.
   */
  function filterForDownloadedQuestionSets (set) {
    // Create an array to store the necessary question set mp3s for this set.
    var requiredQuestionSets = []

    // Go through each set and add all necessary question set mp3s to requiredQuestionSets array.
    set.lessons.forEach(lesson => {
      // Only filter if the lessons have a fellowship/application chapter. For sets like 3.1 which only has video lessons, we don't want to filter.
      if (lesson.fellowshipType) {
        if (!requiredQuestionSets.includes(lesson.fellowshipType)) {
          requiredQuestionSets.push(lesson.fellowshipType)
        }
        if (!requiredQuestionSets.includes(lesson.applicationType)) {
          requiredQuestionSets.push(lesson.applicationType)
        }
      }
    })

    // If every required file is present, return true. Otherwise, return false.
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

  function getSetData () {
    console.log(`${Date.now()} Calling expensive function again.`)
    if (category === 'topical')
      return (
        activeDatabase.sets
          // Filter for Topical Story Sets.
          .filter(set => getSetInfo('category', set.id) === category)
          // Filter for Topical Story Sets that haven't already been added.
          .filter(
            topicalSet =>
              !activeGroup.addedSets.some(
                addedSet => addedSet.id === topicalSet.id
              )
          )
          // Filter for Topical Story Sets that match the currently selected tag (if there is one).
          .filter(topicalAddedSet => {
            // If the selected tag is blank (meaning nothing has been selected) or 'All' is selected, show all the Topical Story Sets. Otherwise, filter by the selected tag.
            return selectedTag === '' ||
              selectedTag === translations.add_set.all_tag_label
              ? true
              : topicalAddedSet.tags.some(tag => selectedTag === tag)
          })
          // Filter for Topical Sets that have all the necessary question set mp3s downloaded.
          .filter(filterForDownloadedQuestionSets)
          // Sort by ID, just in case they aren't added in order in the database.
          .sort((a, b) =>
            parseInt(a.id.match(/[0-9]*$/)[0]) -
              parseInt(b.id.match(/[0-9]*$/)[0]) <
            0
              ? -1
              : 1
          )
      )
    else
      return (
        activeDatabase.sets
          // Filter for Foundational or Mobilization Tools Story Sets.
          .filter(set => getSetInfo('category', set.id) === category)
          // Filter for Foundational or Mobilization Tools Story Sets that haven't already been added.
          .filter(
            set =>
              !activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
          // Filter for Foundational or Mobilization Tools Story Sets that have all the necessary question set mp3s downloaded.
          .filter(filterForDownloadedQuestionSets)
          // Sort by ID, just in case they aren't added in order in the database.
          .sort((a, b) =>
            parseInt(a.id.match(/[0-9]*$/)[0]) -
              parseInt(b.id.match(/[0-9]*$/)[0]) <
            0
              ? -1
              : 1
          )
      )
  }

  // The component for the list of tags. Uses the <TagGroup /> component.
  const tagsComponent = (
    <TagGroup
      source={tags}
      singleChoiceMode
      onSelectedTagChange={selected => setSelectedTag(selected)}
      style={{
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 2
      }}
      tagStyle={{
        borderRadius: 30,
        borderColor: colors.oslo,
        height: 35 * scaleMultiplier,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20 * scaleMultiplier
      }}
      textStyle={{ color: colors.oslo, fontFamily: font + '-Regular' }}
      activeTagStyle={{
        borderRadius: 20,
        backgroundColor: primaryColor,
        borderColor: primaryColor
      }}
      activeTextStyle={{
        color: colors.white,
        fontFamily: font + '-Regular'
      }}
    />
  )

  /** Renders a <SetItem /> for the list of sets available to add. */
  const renderSetItem = setList => (
    <SetItem
      thisSet={setList.item}
      screen='AddSet'
      onSetSelect={() => {
        setSetInModal(setList.item)
        setShowSetInfoModal(true)
      }}
    />
  )

  return (
    <View style={styles.screen}>
      {category === 'topical' ? tagsComponent : null}
      <FlatList
        style={{ flex: 1 }}
        data={getSetData()}
        ItemSeparatorComponent={() => <Separator />}
        ListFooterComponent={() => <Separator />}
        ListHeaderComponent={() => <Separator />}
        renderItem={renderSetItem}
        ListEmptyComponent={
          <View style={{ width: '100%', marginVertical: 20 }}>
            <Text
              style={StandardTypography(
                { font, isRTL },
                'p',
                'Regular',
                'center',
                colors.chateau
              )}
            >
              {translations.add_set.no_more_sets_text}
            </Text>
          </View>
        }
      />
      {/* Modals */}
      <SnackBar
        visible={showSnackbar}
        textMessage={translations.add_set.set_added_message}
        messageStyle={{
          color: colors.white,
          fontSize: 24 * scaleMultiplier,
          fontFamily: font + '-Black',
          textAlign: 'center'
        }}
        backgroundColor={colors.apple}
      />
      <SetInfoModal
        isVisible={showSetInfoModal}
        hideModal={() => setShowSetInfoModal(false)}
        thisSet={setInModal}
        showSnackbar={() => {
          setShowSnackbar(true)
          setTimeout(() => setShowSnackbar(false), 2000)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    flex: 1
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddSetScreen)
