import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL, API_MODE} from '@env';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getToken();
  }
}

const register = async value => {
  let pt_token = await AsyncStorage.getItem('pt_token');
  let pt_key = await AsyncStorage.getItem('pt_key');
  console.log(pt_token, pt_key, '..........pt_token/////////////////');
  fetch(`${BASE_URL}patient/register/device/${API_MODE}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      pt_token: pt_token,
      pt_key: pt_key,
    },
    body: JSON.stringify({
      device_type: 'android',
      device_token: value,
    }),
  })
    .then(response => response.json())
    .then(data => {
      // handle response data
      console.log(data, '//////////////////...................');
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
};

const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(fcmToken, 'old fcm token');
  register(fcmToken);

  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'the new generated token');
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'error raised in fcm token');
    }
  }
};

export const notificationListener = async () => {
  // var navigation = useNavigation();
  // console.log(navigation)
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
    // if(!!remoteMessage?.data)
    // setTimeout(() => {
    //   console.log(remoteMessage.data.type, '/////////////');
    //   // navigation.navigate(remoteMessage.data.type);
    // }, 1000);
  });
  messaging().onMessage(async remoteMessage => {
    console.log(
      'Notification caused app to open from foregound state:',
      remoteMessage,
    );
  });

  
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
    });
};
