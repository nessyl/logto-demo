import config from '@/config/environment';
import { useLogto } from '@logto/rn';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Organization } from '@/types/organization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAsyncStorage } from './useAsyncStorage';

type Nullable<T> = T | null;

interface Identity {
  userId: string;
  details?: Record<string, unknown>;
}

export interface LogtoUser {
  sub: string;
  name?: Nullable<string>;
  email?: Nullable<string>;
  organizations: Partial<Organization>[];
  selectedOrganization?: Partial<Organization>;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  at_hash?: Nullable<string>;
  picture?: Nullable<string>;
  username?: Nullable<string>;
  phone_number?: Nullable<string>;
  identities?: Record<string, Identity>;
  custom_data?: Record<string, unknown>;
}

export const useLogtoAuth = () => {
  const {
    isAuthenticated,
    getAccessToken,
    fetchUserInfo,
    signIn,
    signOut: internalSignOut,
    getOrganizationToken,
  } = useLogto();
  const [user, setUser] = useState<LogtoUser | null>(null);
  const [accessToken, setAccessToken] = useAsyncStorage<string | null>({
    key: 'accessToken',
    defaultValue: null,
  });
  const [orgToken, setOrgToken] = useAsyncStorage<string | null>({
    key: 'orgToken',
    defaultValue: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      setAccessToken(null);
      setOrgToken(null);
      return;
    }

    fetchUserInfo().then(async (userInfo) => {
      const token = await getAccessToken(config.baseApiUrl);
      const newUser: LogtoUser = {
        ...userInfo,
        organizations: [],
        selectedOrganization: undefined,
        custom_data: userInfo.custom_data as
          | Record<string, unknown>
          | undefined,
      };

      setUser(newUser);
      setAccessToken(token);
    });
  }, [isAuthenticated]);

  const fetchOrganizations = useCallback(async () => {
    if (!user || !accessToken) return [];

    const response = await fetch(`${config.internalApiUrl}/internal/organizations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch organizations');
    return response.json();
  }, [user?.sub, accessToken]);

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ['organizations', user?.sub],
    queryFn: fetchOrganizations,
    enabled: !!user && !!accessToken,
  });

  const selectOrganization = async (organization: Partial<Organization>) => {
    const orgToken = await getOrganizationToken(
      organization.publicId?.toString() || ''
    );

    setUser((prevUser) =>
      prevUser ? { ...prevUser, selectedOrganization: organization } : null
    );

    setOrgToken(orgToken);

    return orgToken;
  };

  const signOut = async () => {
    setUser(null);
    setAccessToken(null);
    setOrgToken(null);

    // Clear all Logto-related items from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const logtoKeys = keys.filter(key => key.startsWith('logto.'));
    await AsyncStorage.multiRemove(logtoKeys);

    // Perform the internal signOut
    await internalSignOut();

    // Additional step: clear the entire Logto state
    await AsyncStorage.removeItem('logto.storage');
  };

  const refreshAccessToken = async () => {
    const newAccessToken = await getAccessToken(config.baseApiUrl);
    setAccessToken(newAccessToken);
  };

  const clearAccessToken = () => {
    setAccessToken(null);
  };

  const clearOrgToken = () => {
    setOrgToken(null);
  };

  return {
    isAuthenticated,
    user,
    accessToken,
    orgToken,
    organizations,
    signIn: () => signIn(config.logtoRedirectUri),
    signOut,
    selectOrganization,
    refreshAccessToken,
    clearAccessToken,
    clearOrgToken,
  };
};
