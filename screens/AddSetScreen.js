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
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state'
])

/**
 * Component for the add set screen, which shows a list of available story sets to add in a specific category.
 * @param {*} props
 */
function AddSetScreen ({
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
  primaryColor
}) {
  /** Whether the snackbar that pops up upon adding a set is visible or not.  */
  const [showSnackbar, setShowSnackbar] = useState(false)

  /** State for header title. Stored in state because it changes depending on which category we're viewing the story sets for. */
  const [headerTitle, setHeaderTitle] = useState('')

  /** Keeps track of the tags we have. Only for adding topical sets. Tags are retrieved from the database. */
  const [tags, setTags] = useState([])

  /** Keeps tra */
  const [activeTag, setActiveTag] = useState([])
  const [tagSelectRef, setTagSelectRef] = useState()
  const [refresh, setRefresh] = useState(false)

  const [showSetInfoModal, setShowSetInfoModal] = useState(false)
  const [setInModal, setSetInModal] = useState({})

  const [downloadedFiles, setDownloadedFiles] = useState([])

  useEffect(() => {
    switch (category) {
      case 'foundational':
        setHeaderTitle(translations.add_set.header_foundational)
        break
      case 'topical':
        setHeaderTitle(translations.add_set.header_topical)
        var tempTags = [translations.add_set.all_tag_label]
        activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === 'topical')
          .forEach(topicalSet => {
            topicalSet.tags.forEach(tag => {
              if (!tempTags.some(tempTag => tempTag === tag)) {
                tempTags = [...tempTags, tag]
              }
            })
          })
        setTags(tempTags)
        break
      case 'mobilization tools':
        setHeaderTitle(translations.add_set.header_mt)
        break
    }
  }, [])

  useEffect(() => {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        setDownloadedFiles(contents)
      }
    )
  }, [])

  useEffect(() => {
    setOptions(getNavOptions())
  }, [headerTitle])

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
          activeGroup.language + '-' + questionSet + '.mp3'
        )
      )
    )
      return true
    else return false
  }

  // useEffect(() => {
  //   if (tagSelectRef) {
  //     tagSelectRef.select(0)
  //   }
  // }, [tagSelectRef])

  function getNavOptions () {
    return {
      title: headerTitle,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => goBack()} />,
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => <View></View>
    }
  }

  // var activeTags = []
  // if (tagSelectRef.itemsSelected !== null) {
  //   con  sole.log(tagSelectRef.itemsSelected)
  // }

  var tagSelectComponent = (
    <TagGroup
      source={tags}
      singleChoiceMode
      onSelectedTagChange={selected => setActiveTag(selected)}
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
        // make primary color
        backgroundColor: primaryColor,
        borderColor: primaryColor
      }}
      activeTextStyle={{
        color: colors.white,
        fontFamily: font + '-Regular'
      }}
    />
  )

  //+ RENDER
  function renderStudySetItem (setList) {
    return (
      <SetItem
        thisSet={setList.item}
        mode='addset_screen'
        onSetSelect={() => {
          setSetInModal(setList.item)
          setShowSetInfoModal(true)
        }}
      />
    )
  }

  return (
    <View style={styles.screen}>
      {category === 'topical' ? tagSelectComponent : null}
      <FlatList
        style={{ flex: 1 }}
        data={
          category === 'topical'
            ? activeDatabase.sets
                .filter(set => getSetInfo('category', set.id) === category)
                .filter(
                  topicalSet =>
                    !activeGroup.addedSets.some(
                      addedSet => addedSet.id === topicalSet.id
                    )
                )
                .filter(topicalAddedSet => {
                  return activeTag.length === 0 ||
                    activeTag.includes(translations.add_set.all_tag_label)
                    ? true
                    : topicalAddedSet.tags.some(tag => activeTag.includes(tag))
                })
                .filter(filterForDownloadedQuestionSets)
                .sort((a, b) => {
                  if (
                    parseInt(a.id.match(/[0-9]*$/)[0]) -
                      parseInt(b.id.match(/[0-9]*$/)[0]) <
                    0
                  ) {
                    return -1
                  } else {
                    return 1
                  }
                })
            : activeDatabase.sets
                .filter(set => getSetInfo('category', set.id) === category)
                .filter(
                  set =>
                    !activeGroup.addedSets.some(
                      addedSet => addedSet.id === set.id
                    )
                )
                .filter(filterForDownloadedQuestionSets)
                .sort((a, b) => {
                  if (
                    parseInt(a.id.match(/[0-9]*$/)[0]) -
                      parseInt(b.id.match(/[0-9]*$/)[0]) <
                    0
                  ) {
                    return -1
                  } else {
                    return 1
                  }
                })
        }
        ItemSeparatorComponent={() => <Separator />}
        ListFooterComponent={() => <Separator />}
        ListHeaderComponent={() => <Separator />}
        renderItem={renderStudySetItem}
        ListEmptyComponent={
          <View style={{ width: '100%', margin: 10 }}>
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
        category={category}
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

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: getLanguageFont(activeGroup.language),
    translations: state.database[activeGroup.language].translations,
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    activeGroup: activeGroup,
    primaryColor: state.database[activeGroup.language].primaryColor
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, setID) => {
      dispatch(addSet(groupName, setID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSetScreen)
