import React, { useEffect, useState } from 'react'
import { FlatList, LogBox, StyleSheet, Text, View } from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import TagGroup from 'react-native-tag-group'
import { connect } from 'react-redux'
import SetItem from '../components/list-items/SetItem'
import BackButton from '../components/standard/BackButton'
import Separator from '../components/standard/Separator'
import {
  colors,
  getLanguageFont,
  getSetInfo,
  scaleMultiplier
} from '../constants'
import SetInfoModal from '../modals/SetInfoModal'
import { addSet } from '../redux/actions/groupsActions'
import { StandardTypography } from '../styles/typography'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state'
])

/**
 * Component for the add set screen, which shows a list of available story sets to add in a specific category.
 * @param {*} props
 */
function AddSetScreen (props) {
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

  useEffect(() => {
    switch (props.route.params.category) {
      case 'foundational':
        setHeaderTitle(props.translations.add_set.header_foundational)
        break
      case 'topical':
        setHeaderTitle(props.translations.add_set.header_topical)
        var tempTags = [props.translations.add_set.all_tag_label]
        props.activeDatabase.sets
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
        setHeaderTitle(props.translations.add_set.header_mt)
        break
    }
  }, [])

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [headerTitle])

  // useEffect(() => {
  //   if (tagSelectRef) {
  //     tagSelectRef.select(0)
  //   }
  // }, [tagSelectRef])

  function getNavOptions () {
    return {
      title: headerTitle,
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => props.navigation.goBack()} />,
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
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
      textStyle={{ color: colors.oslo, fontFamily: props.font + '-Regular' }}
      activeTagStyle={{
        borderRadius: 20,
        // make primary color
        backgroundColor: props.primaryColor,
        borderColor: props.primaryColor
      }}
      activeTextStyle={{
        color: colors.white,
        fontFamily: props.font + '-Regular'
      }}
    />
  )

  //+ RENDER
  function renderStudySetItem (setList) {
    return (
      <SetItem
        thisSet={setList.item}
        isSmall={false}
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
      {props.route.params.category === 'topical' ? tagSelectComponent : null}
      <FlatList
        style={{ flex: 1 }}
        data={
          props.route.params.category === 'topical'
            ? props.activeDatabase.sets
                .filter(
                  set =>
                    getSetInfo('category', set.id) ===
                    props.route.params.category
                )
                .filter(
                  topicalSet =>
                    !props.activeGroup.addedSets.some(
                      addedSet => addedSet.id === topicalSet.id
                    )
                )
                .filter(topicalAddedSet => {
                  return activeTag.length === 0 ||
                    activeTag.includes(props.translations.add_set.all_tag_label)
                    ? true
                    : topicalAddedSet.tags.some(tag => activeTag.includes(tag))
                })
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
            : props.activeDatabase.sets
                .filter(
                  set =>
                    getSetInfo('category', set.id) ===
                    props.route.params.category
                )
                .filter(
                  set =>
                    !props.activeGroup.addedSets.some(
                      addedSet => addedSet.id === set.id
                    )
                )
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
          // NOT USED: for folders
          // // if we're displaying topical sets:
          // // 1. filter by all sets that are topical,
          // // 2. filter by topical sets in the specified folder, and then
          // // 3. filter to only display sets that haven't already been added
          // props.route.params.category === 'topical'
          //   ? props.activeDatabase.sets
          //       .filter(set => set.category === 'topical')
          //       .filter(set => set.folder === props.route.params.folder)
          //       .filter(
          //         set =>
          //           !props.activeGroup.addedSets.some(
          //             addedSet => addedSet.id === set.id
          //           )
          //       )
          //   : // if we're displaying core or folders:
          //     // 1. filter by cateogry (core or folder)
          //     // 2. filter to only display sets that haven't already been added
          //     props.activeDatabase.sets
          //       .filter(set => set.category === props.route.params.category)
          //       .filter(
          //         set =>
          //           !props.activeGroup.addedSets.some(
          //             addedSet => addedSet.id === set.id
          //           )
          //       )
        }
        ItemSeparatorComponent={() => <Separator />}
        ListFooterComponent={() => <Separator />}
        ListHeaderComponent={() => <Separator />}
        renderItem={renderStudySetItem}
        ListEmptyComponent={
          <View style={{ width: '100%', margin: 10 }}>
            <Text
              style={StandardTypography(
                props,
                'p',
                'Regular',
                'center',
                colors.chateau
              )}
            >
              {props.translations.add_set.no_more_sets_text}
            </Text>
          </View>
        }
      />
      <SnackBar
        visible={showSnackbar}
        textMessage={props.translations.add_set.set_added_message}
        messageStyle={{
          color: colors.white,
          fontSize: 24 * scaleMultiplier,
          fontFamily: props.font + '-Black',
          textAlign: 'center'
        }}
        backgroundColor={colors.apple}
      />
      <SetInfoModal
        isVisible={showSetInfoModal}
        hideModal={() => setShowSetInfoModal(false)}
        category={props.route.params.category}
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
