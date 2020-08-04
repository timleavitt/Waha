import { Dimensions } from 'react-native'

export const scaleMultiplier =
  Dimensions.get('window').width > 400
    ? 1
    : Dimensions.get('window').width / 400

export const languageT2S = {
  en: require('./assets/languageT2S/en.mp3'),
  da: require('./assets/languageT2S/te.mp3')
}

export const groupIcons = [
  'default',
  '1st-place-medal',
  'alarm-clock',
  'american-football',
  'artist-palette',
  'atom-symbol',
  'avocado',
  'baby-bottle',
  'baguette-bread',
  'balloon',
  'baseball',
  'basketball',
  'beaming-face-with-smiling-eyes',
  'bell-pepper',
  'bento-box',
  'bird',
  'black-nib',
  'bomb',
  'bouquet',
  'bowl-with-spoon',
  'brain',
  'bread',
  'briefcase',
  'burrito',
  'call-me-hand',
  'camel',
  'camera',
  'cat',
  'cheese-wedge',
  'chess-pawn',
  'chopsticks',
  'circus-tent',
  'clamp',
  'clapping-hands',
  'compass',
  'computer-mouse',
  'cooked-rice',
  'cooking',
  'cowboy-hat-face',
  'crayon',
  'cricket-game',
  'crown',
  'desktop-computer',
  'dna',
  'door',
  'dove',
  'drum',
  'ear-of-corn',
  'electric-plug',
  'face-with-tears-of-joy',
  'firecracker',
  'flashlight',
  'flexed-biceps',
  'folded-hands',
  'gear',
  'glowing-star',
  'goal-net',
  'graduation-cap',
  'guitar',
  'hamburger',
  'hammer-and-pick',
  'handshake',
  'headphone',
  'high-heeled-shoe',
  'ice-skate',
  'joystick',
  'kite',
  'lipstick',
  'love-you-gesture',
  'luggage',
  'magnet',
  'magnifying-glass-tilted-left',
  'man-in-manual-wheelchair',
  'man-lifting-weights',
  'man-rowing-boat',
  'martial-arts-uniform',
  'men-wrestling',
  'microphone',
  'monkey-face',
  'musical-keyboard',
  'ok-hand',
  'oncoming-fist',
  'open-hands',
  'palms-up-together',
  'partying-face',
  'performing-arts',
  'plunger',
  'pool-8-ball',
  'radio',
  'relieved-face',
  'ring',
  'robot',
  'salt',
  'skateboard',
  'snowman-without-snow',
  'soccer-ball',
  'sparkles',
  'star',
  'stethoscope',
  'teacup-without-handle',
  'teapot',
  'tennis',
  'test-tube',
  'trophy',
  'turtle',
  'umbrella-with-rain-drops',
  'video-game'
]

export const groupIconSources = {
  default: require('./assets/groupIcons/default.png'),
  '1st-place-medal': require('./assets/groupIcons/1st-place-medal.png'),
  'alarm-clock': require('./assets/groupIcons/alarm-clock.png'),
  'american-football': require('./assets/groupIcons/american-football.png'),
  'artist-palette': require('./assets/groupIcons/artist-palette.png'),
  'atom-symbol': require('./assets/groupIcons/atom-symbol.png'),
  avocado: require('./assets/groupIcons/avocado.png'),
  'baby-bottle': require('./assets/groupIcons/baby-bottle.png'),
  'baguette-bread': require('./assets/groupIcons/baguette-bread.png'),
  balloon: require('./assets/groupIcons/balloon.png'),
  baseball: require('./assets/groupIcons/baseball.png'),
  basketball: require('./assets/groupIcons/basketball.png'),
  'beaming-face-with-smiling-eyes': require('./assets/groupIcons/beaming-face-with-smiling-eyes.png'),
  'bell-pepper': require('./assets/groupIcons/bell-pepper.png'),
  'bento-box': require('./assets/groupIcons/bento-box.png'),
  bird: require('./assets/groupIcons/bird.png'),
  'black-nib': require('./assets/groupIcons/black-nib.png'),
  bomb: require('./assets/groupIcons/bomb.png'),
  bouquet: require('./assets/groupIcons/bouquet.png'),
  'bowl-with-spoon': require('./assets/groupIcons/bowl-with-spoon.png'),
  brain: require('./assets/groupIcons/brain.png'),
  bread: require('./assets/groupIcons/bread.png'),
  briefcase: require('./assets/groupIcons/briefcase.png'),
  burrito: require('./assets/groupIcons/burrito.png'),
  'call-me-hand': require('./assets/groupIcons/call-me-hand.png'),
  camel: require('./assets/groupIcons/camel.png'),
  camera: require('./assets/groupIcons/camera.png'),
  cat: require('./assets/groupIcons/cat.png'),
  'cheese-wedge': require('./assets/groupIcons/cheese-wedge.png'),
  'chess-pawn': require('./assets/groupIcons/chess-pawn.png'),
  chopsticks: require('./assets/groupIcons/chopsticks.png'),
  'circus-tent': require('./assets/groupIcons/circus-tent.png'),
  clamp: require('./assets/groupIcons/clamp.png'),
  'clapping-hands': require('./assets/groupIcons/clapping-hands.png'),
  compass: require('./assets/groupIcons/compass.png'),
  'computer-mouse': require('./assets/groupIcons/computer-mouse.png'),
  'cooked-rice': require('./assets/groupIcons/cooked-rice.png'),
  cooking: require('./assets/groupIcons/cooking.png'),
  'cowboy-hat-face': require('./assets/groupIcons/cowboy-hat-face.png'),
  crayon: require('./assets/groupIcons/crayon.png'),
  'cricket-game': require('./assets/groupIcons/cricket-game.png'),
  crown: require('./assets/groupIcons/crown.png'),
  'desktop-computer': require('./assets/groupIcons/desktop-computer.png'),
  dna: require('./assets/groupIcons/dna.png'),
  door: require('./assets/groupIcons/door.png'),
  dove: require('./assets/groupIcons/dove.png'),
  drum: require('./assets/groupIcons/drum.png'),
  'ear-of-corn': require('./assets/groupIcons/ear-of-corn.png'),
  'electric-plug': require('./assets/groupIcons/electric-plug.png'),
  'face-with-tears-of-joy': require('./assets/groupIcons/face-with-tears-of-joy.png'),
  firecracker: require('./assets/groupIcons/firecracker.png'),
  flashlight: require('./assets/groupIcons/flashlight.png'),
  'flexed-biceps': require('./assets/groupIcons/flexed-biceps.png'),
  'folded-hands': require('./assets/groupIcons/folded-hands.png'),
  gear: require('./assets/groupIcons/gear.png'),
  'glowing-star': require('./assets/groupIcons/glowing-star.png'),
  'goal-net': require('./assets/groupIcons/goal-net.png'),
  'graduation-cap': require('./assets/groupIcons/graduation-cap.png'),
  guitar: require('./assets/groupIcons/guitar.png'),
  hamburger: require('./assets/groupIcons/hamburger.png'),
  'hammer-and-pick': require('./assets/groupIcons/hammer-and-pick.png'),
  handshake: require('./assets/groupIcons/handshake.png'),
  headphone: require('./assets/groupIcons/headphone.png'),
  'high-heeled-shoe': require('./assets/groupIcons/high-heeled-shoe.png'),
  'ice-skate': require('./assets/groupIcons/ice-skate.png'),
  joystick: require('./assets/groupIcons/joystick.png'),
  kite: require('./assets/groupIcons/kite.png'),
  lipstick: require('./assets/groupIcons/lipstick.png'),
  'love-you-gesture': require('./assets/groupIcons/love-you-gesture.png'),
  luggage: require('./assets/groupIcons/luggage.png'),
  magnet: require('./assets/groupIcons/magnet.png'),
  'magnifying-glass-tilted-left': require('./assets/groupIcons/magnifying-glass-tilted-left.png'),
  'man-in-manual-wheelchair': require('./assets/groupIcons/man-in-manual-wheelchair.png'),
  'man-lifting-weights': require('./assets/groupIcons/man-lifting-weights.png'),
  'man-rowing-boat': require('./assets/groupIcons/man-rowing-boat.png'),
  'martial-arts-uniform': require('./assets/groupIcons/martial-arts-uniform.png'),
  'men-wrestling': require('./assets/groupIcons/men-wrestling.png'),
  microphone: require('./assets/groupIcons/microphone.png'),
  'monkey-face': require('./assets/groupIcons/monkey-face.png'),
  'musical-keyboard': require('./assets/groupIcons/musical-keyboard.png'),
  'ok-hand': require('./assets/groupIcons/ok-hand.png'),
  'oncoming-fist': require('./assets/groupIcons/oncoming-fist.png'),
  'open-hands': require('./assets/groupIcons/open-hands.png'),
  'palms-up-together': require('./assets/groupIcons/palms-up-together.png'),
  'partying-face': require('./assets/groupIcons/partying-face.png'),
  'performing-arts': require('./assets/groupIcons/performing-arts.png'),
  plunger: require('./assets/groupIcons/plunger.png'),
  'pool-8-ball': require('./assets/groupIcons/pool-8-ball.png'),
  radio: require('./assets/groupIcons/radio.png'),
  'relieved-face': require('./assets/groupIcons/relieved-face.png'),
  ring: require('./assets/groupIcons/ring.png'),
  robot: require('./assets/groupIcons/robot.png'),
  salt: require('./assets/groupIcons/salt.png'),
  skateboard: require('./assets/groupIcons/skateboard.png'),
  'snowman-without-snow': require('./assets/groupIcons/snowman-without-snow.png'),
  'soccer-ball': require('./assets/groupIcons/soccer-ball.png'),
  sparkles: require('./assets/groupIcons/sparkles.png'),
  star: require('./assets/groupIcons/star.png'),
  stethoscope: require('./assets/groupIcons/stethoscope.png'),
  'teacup-without-handle': require('./assets/groupIcons/teacup-without-handle.png'),
  teapot: require('./assets/groupIcons/teapot.png'),
  tennis: require('./assets/groupIcons/tennis.png'),
  'test-tube': require('./assets/groupIcons/test-tube.png'),
  trophy: require('./assets/groupIcons/trophy.png'),
  turtle: require('./assets/groupIcons/turtle.png'),
  'umbrella-with-rain-drops': require('./assets/groupIcons/umbrella-with-rain-drops.png'),
  'video-game': require('./assets/groupIcons/video-game.png')
}

export const languages = [
  {
    i18nName: 'english',
    languageCode: 'en',
    data: [
      {
        nativeName: 'English (Global)',
        wahaID: 'en',
        i18nName: 'englishGlobal',
        logoSource:
          'https://res.cloudinary.com/waha/image/upload/v1594243650/English/Discovering_God_eorblz.png'
      }
      // {
      //   nativeName: "English (UK) *don't choose, will break*",
      //   wahaID: 'uk',
      //   i18nName: 'englishUK',
      //   logoSource:
      //     'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
      // },
      // {
      //   nativeName: "English (Australia) *don't choose, will break*",
      //   wahaID: 'as',
      //   i18nName: 'englishAustralia',
      //   logoSource:
      //     'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
      // }
    ]
  },
  {
    i18nName: 'arabic',
    languageCode: 'ar',
    data: [
      {
        nativeName: 'اللهجة المغربية',
        wahaID: 'da',
        i18nName: 'darija',
        logoSource:
          'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
      }
      // {
      //   nativeName: 'ليبي‎',
      //   wahaID: 'la',
      //   i18nName: 'laarbia',
      //   logoSource:
      //     'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
      // }
    ]
  }
  // {
  //   i18nName: 'french',
  //   languageCode: 'fr',
  //   data: [
  //     {
  //       nativeName: "Français *don't choose, will break*",
  //       wahaID: 'fr',
  //       i18nName: 'french',
  //       logoSource:
  //         'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
  //     }
  //   ]
  // }
]

export const keyColors = {
  1: '#ffe119',
  2: '#3cb44b',
  3: '#4363d8',
  4: '#911eb4',
  5: '#aaffc3',
  6: '#f032e6',
  7: '#e6194B',
  8: '#42d4f4',
  9: '#469990',
  10: '#bfef45',
  11: '#dcbeff',
  12: '#9A6324'
}

export const colors = {
  // normal text
  shark: '#1D1E20',

  // secondary text and icons
  tuna: '#3A3C3F',

  // grayed out stuff
  chateau: '#9FA5AD',

  // gray borders
  oslo: '#828282',

  geyser: '#DEE3E9',

  // backgrounds, list items, borders
  porcelain: '#EAEEF0',
  athens: '#EFF2F4',
  aquaHaze: '#f7f9fa',
  white: '#FFFFFF',

  // other colors
  apple: '#60C239',
  red: '#FF0800',
  blue: '#2D9CDB'
}
