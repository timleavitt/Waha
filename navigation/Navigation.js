//navigation imports
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

//screen imports
import StudySetScreen from '../screens/StudySetScreen';
import LessonListScreen from '../screens/LessonListScreen';
import PlayScreen from '../screens/PlayScreen'
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import OnboardingSlidesScreen from '../screens/OnboardingSlidesScreen';
import SettingsScreen from '../screens/SettingsScreen'
import LanguageInstancesScreen from '../screens/LanguageInstancesScreen';

const DefaultWahaNavigatorOptions = {
    headerStyle: {
        backgroundColor: "white"
    }
}

const WahaNavigator = createStackNavigator(
    {
        StudySet: {
            screen: StudySetScreen 
        },
        LessonList: {
            screen: LessonListScreen
        },
        Play: {
            screen: PlayScreen
        },
        LanguageSelect: {
            screen: LanguageSelectScreen
        },
        OnboardingSlides: {
            screen: OnboardingSlidesScreen
        }, 
        Settings: {
           screen: SettingsScreen
        },
        LanguageInstances: {
           screen: LanguageInstancesScreen
        }
    },
    {
        defaultNavigationOptions: DefaultWahaNavigatorOptions
    }
)

export default createAppContainer(WahaNavigator);