import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLogtoAuth } from '@/hooks/useLogtoAuth';
import { useRouter } from 'expo-router';

export default function Home() {
  const { isAuthenticated, user, signOut } = useLogtoAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated && !user?.selectedOrganization) {
      router.replace('/organization-select');
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    router.replace('/login');
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You're logged in!</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});
