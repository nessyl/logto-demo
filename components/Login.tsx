import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useLogtoAuth } from '../hooks/useLogtoAuth';

export default function Login() {
  const { signIn } = useLogtoAuth();

  return (
    <View style={styles.container}>
      <Button title="Sign In" onPress={signIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
