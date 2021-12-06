import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true
    };
  }
})

export default function App() {
  const [pushToken, setPushToken] = useState();

  // Getting push token and permissions
  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
    .then(statusObj => {
      if(statusObj.status !== 'granted') {
        return Permissions.askAsync(Permissions.NOTIFICATIONS);
      }
      return statusObj;
    })
    .then(statusObj => {
      if(statusObj.status !== 'granted') {
      throw new Error('Permission not granted [Sad emoji]');
      }
    })
    .then(() => {
      return Notifications.getExpoPushTokenAsync();
    })
    .then(res => {
      const token = res.data;
      setPushToken(token);
    })
    .catch(err => {
      console.log(err);
      return null;
    });
  }, [setPushToken]);

  // On click on notification
  useEffect(() => {
    const bgSubscription = Notifications.addNotificationResponseReceivedListener(
      res => {
        console.log(res);
      }
    );

    const subscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log(notification)
      }
    );

    return () => {
      bgSubscription.remove();
      subscription.remove();
    }
  }, [])

  const triggerNotifHandler = () => {
    // Push Notifications
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: pushToken,
        title: 'Push through app',
        body: 'Yay! Sending successfull'
      })
    });

    // Local Notifications
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: 'Yo!!',
    //     body: 'I notified you'
    //   },
    //   trigger: {
    //     seconds: 3
    //   }
    // });
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Don't Push" onPress={triggerNotifHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
