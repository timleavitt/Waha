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
import { colors, getSetInfo, scaleMultiplier } from '../constants'

function SetScreen (props) {
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
  }, [])

  //+ NAV OPTIONS

  // get the sets for whatever tab we're on
  function getSetData () {
    // if we're adding core sets, display them in numerical order
    return props.route.name === 'Foundational'
      ? props.activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === setCategory)
          .filter(set =>
            props.activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
      : // if we're displaying topical/mt sets, display them in the order added
        props.activeDatabase.sets
          .filter(set => getSetInfo('category', set.id) === setCategory)
          .filter(set =>
            props.activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
          )
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
                style={Typography(
                  props,
                  'p',
                  'regular',
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
  // console.log(state.database[activeGroup.language])
  return {
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(SetScreen)
