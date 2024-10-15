import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLogtoAuth } from '../hooks/useLogtoAuth';
import { useRouter } from 'expo-router';
import { Organization } from '../types/organization';

export default function OrganizationSelect() {
  const { selectOrganization, signOut, organizations } = useLogtoAuth();
  const router = useRouter();

  const handleOrganizationSelect = async (org: Organization) => {
    await selectOrganization(org);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Organization</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {organizations.map((org) => (
            <TouchableOpacity
              key={org.id}
              style={[styles.button, { backgroundColor: org.color }]}
              onPress={() => handleOrganizationSelect(org)}
            >
              <Text style={styles.buttonText}>{org.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
});
