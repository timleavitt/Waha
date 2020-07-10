import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Button,
  Image,
  FlatList,
  Dimensions
} from 'react-native'
import i18n from 'i18n-js'
import {
  setFinishedOnboarding,
  addLanguage,
  changeLanguage
} from '../redux/actions/databaseActions'
import { connect } from 'react-redux'
import { createGroup, changeActiveGroup } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'
// translations import
import en from '../translations/en.json'
import fr from '../translations/fr.json'
import ar from '../translations/ar.json'
import { TouchableOpacity } from 'react-native-gesture-handler'

function OnboardingSlidesScreen (props) {
  //// STATE

  // keeps track of current onboarding page number
  const [pageNumber, setPageNumber] = useState(0)

  // reference to change flatlist
  const [flatListRef, setFlatListRef] = useState()

  // translations for language select
  i18n.translations = {
    en,
    fr,
    ar
  }

  // stuff for flatlist
  const onViewRef = useRef(info => {
    console.log(info)
    // if (viewableItems) {
    //   setPageNumber(viewableItems[0].index)
    // }
  })
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 100 })

  //// CONSTRUCTOR

  useEffect(() => {
    var language = props.route.params.selectedLanguage
    props.addLanguage(language)
  }, [])

  //// FUNCTIONS

  // updates scroll when page number updates
  useEffect(() => {
    if (flatListRef) {
      flatListRef.scrollToIndex({ index: pageNumber })
    }
  }, [pageNumber])

  // decrements / increments page number
  function incrementPageNumber (direction) {
    if (direction === 'next') {
      setPageNumber(oldPageNumber => (oldPageNumber += 1))
    } else {
      setPageNumber(oldPageNumber => (oldPageNumber -= 1))
    }
  }

  // tells redux that we're ready to go to loading screen once onboarding is finished
  function finishOnboarding () {
    props.setFinishedOnboarding(true)
    props.navigation.navigate('Loading')
  }

  //// RENDER

  const onboardingData = [
    {
      key: '0',
      imageSource: require('../assets/onboarding/onboarding1.png'),
      title: i18n.t('title0'),
      body: i18n.t('body0')
    },
    {
      key: '1',
      imageSource: require('../assets/onboarding/onboarding2.png'),
      title: i18n.t('title1'),
      body: i18n.t('body1')
    },
    {
      key: '2',
      imageSource: require('../assets/onboarding/onboarding3.png'),
      title: i18n.t('title2'),
      body: i18n.t('body2')
    },
    {
      key: '3',
      imageSource: require('../assets/onboarding/onboarding4.png'),
      title: i18n.t('title3'),
      body: i18n.t('body3')
    }
  ]

  function renderOnboardingSlide (slideList) {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{slideList.item.title}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.body}>{slideList.item.body}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={slideList.item.imageSource} style={styles.image} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.onboardingSequence}>
        <FlatList
          renderItem={renderOnboardingSlide}
          data={onboardingData}
          ref={ref => {
            setFlatListRef(ref)
          }}
          horizontal={true}
          pagingEnabled={true}
          snapToAlignment={'start'}
          snapToInterval={Dimensions.get('window').width - 64}
          decelerationRate={'fast'}
          getItemLayout={(data, index) => ({
            length: Dimensions.get('window').width - 64,
            offset: Dimensions.get('window').width - 64 * index,
            index
          })}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.buttonsContainer}>
          <View>
            {pageNumber > 0 ? (
              <TouchableOpacity onPress={() => incrementPageNumber('prev')}>
                <Text>{i18n.t('prev')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View>
            <TouchableOpacity
              onPress={
                pageNumber !== 3
                  ? () => incrementPageNumber('next')
                  : finishOnboarding
              }
            >
              <Text>
                {pageNumber !== 3 ? i18n.t('next') : i18n.t('finish')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  onboardingSequence: {
    flex: 1,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderColor: '#1D1E20',
    borderWidth: 2,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  pageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: Dimensions.get('window').width - 64
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    resizeMode: 'center',
    width: 321 * scaleMultiplier,
    height: 272 * scaleMultiplier
  },
  titleContainer: {
    width: '100%',
    padding: 20
  },
  title: {
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier,
    flexWrap: 'wrap',
    fontWeight: 'bold'
  },
  bodyContainer: {
    width: '100%',
    padding: 20
  },
  body: {
    textAlign: 'center',
    fontSize: 18 * scaleMultiplier,
    flexWrap: 'wrap'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20
  }
})

////REDUX

function mapStateToProps (state) {
  return {
    isFetching: state.database.isFetching
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language)),
    setFinishedOnboarding: toSet => dispatch(setFinishedOnboarding(toSet)),
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingSlidesScreen)
