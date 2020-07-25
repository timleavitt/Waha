import i18n from 'i18n-js'
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as Progress from 'react-native-progress'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
import { addLanguage, setFetchError } from '../redux/actions/databaseActions'
import ar from '../translations/ar.json'
// translations import
import en from '../translations/en.json'
import fr from '../translations/fr.json'
function LoadingScreen (props) {
  i18n.translations = {
    en,
    ar,
    fr
  }

  function retry () {
    props.setFetchError(false, null)
    props.addLanguage(props.errorLanguage)
  }

  return props.fetchError ? (
    <View style={styles.screen}>
      <Text style={styles.loadingMessageText}>{i18n.t('errorMessage')}</Text>
      <TouchableOpacity onPress={retry} style={styles.button}>
        <Text style={styles.buttonTitle}>{i18n.t('retry')}</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.screen}>
      <Image
        style={{
          resizeMode: 'center',
          width: 300 * scaleMultiplier,
          height: 100 * scaleMultiplier
        }}
        source={require('../assets/logo.png')}
      />
      <Text style={styles.loadingMessageText}>{i18n.t('loadingMessage')}</Text>
      <View style={styles.progressBarContainer}>
        <Progress.Bar
          progress={props.progress}
          width={Dimensions.get('window').width - 50}
          color={colors.shark}
        />
      </View>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingMessageText: {
    color: colors.shark,
    textAlign: 'center',
    fontSize: 30,
    padding: 10
  },
  progressBarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.shark,
    borderRadius: 5
  },
  buttonTitle: {
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier,
    color: colors.white
  }
})

function mapStateToProps (state) {
  console.log(state.fetchingStatus)
  return {
    progress: state.database.currentFetchProgress,
    fetchError: state.fetchingStatus.fetchError,
    errorLanguage: state.fetchingStatus.errorLanguage
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addLanguage: language => {
      dispatch(addLanguage(language))
    },
    setFetchError: (status, language) => {
      dispatch(setFetchError(status, language))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)
