import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function App() {
  const triggerNotifHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Yo!!',
        body: 'I notified you'
      },
      trigger: {
        seconds: 3
      }
    })
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
