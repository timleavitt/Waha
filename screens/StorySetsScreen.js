// import * as FileSystem from 'expo-file-system'
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
import {
  colors,
  getLanguageFont,
  getSetInfo,
  scaleMultiplier
} from '../constants'
import { StandardTypography } from '../styles/typography'

/**
 * Screen component for the story sets screen. This screen shows the list of currently added story sets in a category. Used three times for the three tabs.
 * @param {Object} props - Props passed to this screen.
 * @param {Object} navigation - Navigation object passed to this screen.
 * @param {Function} navigate - Navigation function used to navigate to another screen.
 * @param {Object} route - Route object passed from navigation to this screen.
 * @param {string} name - Name of the route of the version of this screen. Can be "Foundational", "Topical", or "Mobilization Tools". This screen is used for all 3 tabs and the route name changes which sets are shown.
 * @param {Object} activeDatabase - The database object for the language of the currently active group. Contains translations, sets, etc.
 * @param {boolean} isRTL - Whether the language of the currently selected group is right-to-left aligned or not.
 * @param {Object} activeGroup - The object for the currently active group.
 * @param {Object} translations - The translations for the language of the currently selected group.
 * @param {string} font - The name of the font for the langauge script of the currently selected group. Matches with fonts names in the assets folder.
 */
function StorySetsScreen ({
  navigation: { navigate },
  route: { name: routeName },
  // passed from redux
  activeDatabase,
  isRTL,
  activeGroup,
  translations,
  font
}) {
  //+ STUFF FOR TESTING

  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
  //   console.log(contents)
  // })
  // console.log(scaleMultiplier)

  //+ STATE

  // shows the add new set modal
  const [addNewSetLabel, setAddNewSetLabel] = useState('')
  const [setCategory, setSetCategory] = useState('')

  //+ CONSTRUCTOR

  useEffect(() => {
    // console.log(routeName)
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

  // get the sets for whatever tab we're on
  function getSetData () {
    // if we're adding core sets, display them in numerical order
    return routeName === 'Foundational'
      ? activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === setCategory)
          .filter(set =>
            activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
      : // if we're displaying topical/mt sets, display them in the order added
        activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === setCategory)
          .filter(set =>
            activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(StorySetsScreen)
