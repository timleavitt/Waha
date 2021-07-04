/**
 * Gives information about a lesson based off its ID.
 * @export
 * @param {string} type - The type of information you want to get. Possible options are:
 * 1. "language": The ID of the language instance that this lesson is a part of.
 * 2. "index": The number of this lesson within a set.
 * 3. "setID": The ID of the set that the lesson is a part of.
 * 4. "subtitle": The ID of the lesson without the language ID in it, which is displayed below the lesson title on the Lessons screen.
 * 5. "category": The tab of the set thats this lesson is a part of.
 * 6. "audioSource": The URL for the lesson's Story chapter mp3 if it has one.
 * 7. "videoSource": The URL for the lesson's Training chapter mp4 if it has one.
 * @param {string} lessonID - The ID of the lesson that you want information for.
 * @return {*} - The information you want about the lesson.
 */
 export const getAssetInfo = (type, lessonID) => {
    // Split the ID up into separate sections.
    var idComponents = lessonID.split('.')
  
    // An example lessonID is "en.1.1.1".
    switch (type) {
      case 'audioSource':
        return `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${
          idComponents[0]
        }%2Fsets%2F${idComponents[1] +
          '.' +
          idComponents[2]}%2F${lessonID}.mp3?alt=media`;
      case 'videoSource':
        return `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${
          idComponents[0]
        }%2Fsets%2F${idComponents[1] + '.' + idComponents[2]}%2F${lessonID +
          'v'}.mp4?alt=media`;
    }
  }