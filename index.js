/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handle in the backGround', remoteMessage);
    console.log(remoteMessage.notification.android.clickAction, '///////////')
});

AppRegistry.registerComponent(appName, () => App);
