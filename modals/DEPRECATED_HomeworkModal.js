import React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import HomeworkItem from '../components/DEPRECATED_HomeworkItem'
import WahaItemDescription from '../components/DEPRECATED_WahaItemDescription'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

// modal variant that shows some information
const HomeworkModal = props => {
  function renderHomeworkItem (homeworkList) {
    return (
      <HomeworkItem
        title={homeworkList.item.title}
        description={homeworkList.item.description}
      />
    )
  }
  //+ RENDER
  return (
    <Modal
      isVisible={props.isVisible}
      style={{ justifyContent: 'space-between', flex: 1, margin: 0 }}
    >
      <View style={styles.contentContainer}>
        <View
          style={{
            width: '100%',
            flex: 1,
            alignItems: 'center',
            marginTop: 30
          }}
        >
          <Icon name='list' size={60 * scaleMultiplier} color={colors.tuna} />
          <Text
            style={{
              color: colors.shark,
              fontFamily: props.font + '-Black',
              fontSize: 36 * scaleMultiplier,
              textAlign: 'center',
              marginBottom: 10
            }}
          >
            Homework
          </Text>
          <WahaItemDescription text='blah blah blah blah blah blah blah blah blah blah blah blah blah blah ' />
          <FlatList
            data={props.homework}
            style={{ width: '100%', paddingHorizontal: 20 }}
            renderItem={renderHomeworkItem}
            keyExtractor={item => item.title}
            persistentScrollbar={true}
          />
        </View>
        <TouchableOpacity
          style={{
            // marginVertical: 10,
            width: '100%',
            height: 80 * scaleMultiplier,
            justifyContent: 'center'
            // backgroundColor: 'blue'
          }}
          onPress={props.hideModal}
        >
          <Text
            style={{
              fontFamily: props.font + '-Bold',
              fontSize: 24 * scaleMultiplier,
              color: colors.red,
              textAlign: 'center'
            }}
          >
            {props.t.general && t.general.close}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  }
})

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),

    t: activeDatabaseSelector(state).translations,
    activeGroup: activeGroupSelector(state)
  }
}

export default connect(mapStateToProps)(HomeworkModal)
