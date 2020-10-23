import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
import { addLanguage, setFetchError } from '../redux/actions/databaseActions'
// translations import
import en from '../translations/en.json'
function LoadingScreen (props) {
  const [proTipNum, setProTipNum] = useState(1)

  useEffect(() => {
    if (proTipNum !== 3)
      setTimeout(() => setProTipNum(current => current + 1), 8000)
    else setTimeout(() => setProTipNum(1), 8000)
  }, [proTipNum])

  i18n.translations = {
    en
  }

  function retry () {
    props.setFetchError(false, null)
    props.addLanguage(props.errorLanguage)
  }

  return props.fetchError ? (
    <View style={styles.screen}>
      <Text
        style={[
          Typography(props, 'h2', '', 'center', colors.shark),
          { padding: 10 }
        ]}
      >
        {i18n.t('errorMessage')}
      </Text>
      <TouchableOpacity onPress={retry} style={styles.button}>
        <Text style={Typography(props, 'h2', '', 'center', colors.white)}>
          {i18n.t('retry')}
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={{ flex: 2, justifyContent: 'flex-end' }}>
        <Image
          style={{
            resizeMode: 'center',
            width: 200 * scaleMultiplier,
            height: 200 * scaleMultiplier,
            tintColor: '#e43c44'
          }}
          source={require('../assets/icon_transparent.png')}
        />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <ActivityIndicator
          size='large'
          color={colors.shark}
          style={{ margin: 5 }}
        />
        <Text style={Typography(props, 'h2', '', 'center', colors.shark)}>
          {i18n.t('loadingMessage')}
        </Text>
        <Text style={Typography(props, 'h1', '', 'center', colors.shark)}>
          {props.totalToDownload
            ? props.currentFetchProgress + '/' + props.totalToDownload
            : ''}
        </Text>
      </View>
      {/* <View style={styles.progressBarContainer}>
        <Progress.Bar
          progress={props.progress}
          width={Dimensions.get('window').width - 50}
          color={colors.chateau}
          borderWidth={2}
          borderColor={colors.shark}
        />
      </View> */}
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Text style={Typography(props, 'h3', '', 'center', colors.chateau)}>
          {i18n.t('protip' + proTipNum)}
        </Text>
      </View>
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    borderRadius: 10
  }
})

function mapStateToProps (state) {
  // console.log(state.fetchingStatus)
  return {
    currentFetchProgress: state.database.currentFetchProgress,
    totalToDownload: state.database.totalToDownload,
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
