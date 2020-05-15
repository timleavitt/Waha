import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native'
import Modal from 'react-native-modal'
import SetItem from '../components/SetItem'
import { scaleMultiplier } from '../constants'
import { connect } from 'react-redux'

function WahaModal (props) {
  const [headerTitle, setHeaderTitle] = useState('')
  const [category, setCategory] = useState('')
  const [setItemMode, setSetItemMode] = useState('')
  useEffect(() => {
    console.log(props.category)
    if (props.category === 'core') {
      setHeaderTitle(props.translations.labels.addNewCoreStorySet)
      setCategory(props.category)
      setSetItemMode('hidden')
    } else if (props.category === 'topical') {
      setHeaderTitle(props.translations.labels.addNewTopicalSet)
      setCategory('folder')
      setSetItemMode('folder')
    }
  }, [])

  //// RENDER
  function renderStudySetItem (setList) {
    return (
      <SetItem
        thisSet={setList.item}
        isSmall={false}
        onSetSelect={() => props.goNested()}
        mode={setItemMode}
      />
    )
  }

  return (
    <Modal
      isVisible={props.isVisible}
      hasBackdrop={true}
      onBackdropPress={props.hideModal}
      onBackButtonPress={props.hideModal}
      // onSwipeComplete={props.hideModal}
      // swipeDirection={'down'}
      backdropOpacity={0.3}
      style={{ justifyContent: 'flex-end', flex: 1, margin: 0 }}
    >
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.modalHeader,
            { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={props.hideModal}
          >
            <Icon name='cancel' size={36 * scaleMultiplier} color='#3A3C3F' />
          </TouchableOpacity>
          <Text
            style={[
              styles.modalHeaderText,
              {
                fontFamily: props.font + '-medium',
                paddingLeft: props.isRTL ? 0 : -40,
                paddingRight: props.isRTL ? -40 : 0
              }
            ]}
          >
            {headerTitle}
          </Text>
          <View style={styles.closeButton} />
        </View>
        <FlatList
          data={props.activeDatabase.sets.filter(
            set => set.category === category
          )}
          renderItem={renderStudySetItem}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flex: 1,
    marginTop: 50
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    margin: 10
  },
  closeButton: {
    alignSelf: 'flex-start',
    width: 40,
    justifyContent: 'center'
  },
  modalHeaderText: {
    color: '#1D1E20',
    fontSize: 24 * scaleMultiplier,
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    translations: state.database[activeGroup.language].translations,
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language]
  }
}

export default connect(mapStateToProps)(WahaModal)
