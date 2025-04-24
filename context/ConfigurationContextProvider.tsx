import { ApiController } from '@/ApiManager/ApiController';
import Layout from '@/components/Layout';
import useContentUploader from '@/hooks/useContentUploader';
import { DB_NAME, DB_STORES, DB_VERSION } from '@/IndexedDB/DBConfigurations';
import { IndexedDBManager } from '@/IndexedDB/IndexedDBHelper';
import { ContentUploaderModel } from '@/models/CommonModels';
import {
  UserFileDetails,
  UserFolderContentsResponse,
} from '@/models/UserFiles';
import { UserProfileResponse } from '@/models/UserLogin';
import { auth, FirebaseAuth } from '@/utils/Firebase';
import { handleAPIResponse } from '@/utils/Helper';
import { PATHS } from '@/utils/Paths';
import { useRouter } from 'next/router';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Props = {
  children: ReactNode;
};

interface ConfigurationContextProviderProps {
  userLogin: UserProfileResponse | null | undefined;
  setUserLogin: React.Dispatch<
    React.SetStateAction<UserProfileResponse | null | undefined>
  >;
  getUserProfile(): Promise<void>;
  onAuthLoadPending: boolean;
  handleSignOut(): void;
  contentUploader: ContentUploaderModel;
  folderContentsMapping: {
    [key: string]: UserFolderContentsResponse;
  };
  setFolderContentsMapping: React.Dispatch<
    React.SetStateAction<{
      [key: string]: UserFolderContentsResponse;
    }>
  >;

  fileDetailsMapping: {
    [key: string]: UserFileDetails;
  };

  setFileDetailsMapping: React.Dispatch<
    React.SetStateAction<{
      [key: string]: UserFileDetails;
    }>
  >;
}

const Context = createContext<ConfigurationContextProviderProps | undefined>(
  undefined,
);

function ConfigurationContextProvider({ children }: Props) {
  const router = useRouter();

  const db = new IndexedDBManager(DB_NAME, DB_VERSION);
  const [onAuthLoadPending, setOnAuthLoadPending] = useState(true);
  // undefined when not loaded, null when wrong value
  const [userLogin, setUserLogin] = useState<
    UserProfileResponse | null | undefined
  >();
  const [folderContentsMapping, setFolderContentsMapping] = useState<{
    [key: string]: UserFolderContentsResponse;
  }>({});
  const [fileDetailsMapping, setFileDetailsMapping] = useState<{
    [key: string]: UserFileDetails;
  }>({});

  const contentUploader: ContentUploaderModel = useContentUploader({
    userLogin: userLogin,
    folderContentsMapping: folderContentsMapping,
    setFolderContentsMapping: setFolderContentsMapping,
  });

  async function getUserProfile() {
    const apiResponse = await ApiController.getUserProfile();
    handleAPIResponse({
      apiResponse: apiResponse,
      silentError: true,
      handleSuccess: () => {
        const response: UserProfileResponse = apiResponse?.data?.user_profile;

        if (
          typeof response?.user_name === 'string' &&
          typeof response?.user_email === 'string' &&
          typeof response?.root_folder_id === 'string' &&
          typeof response?.user_uid === 'string'
        ) {
          setUserLogin({
            user_uid: response?.user_uid,
            user_name: response?.user_name,
            user_email: response?.user_email,
            root_folder_id: response?.root_folder_id,
            user_profile_image: response?.user_profile_image,
          });
        }
      },

      handleError: () => {
        setUserLogin(null);
      },
    });
  }

  function handleSignOut() {
    Object.keys(DB_STORES)?.map(store => {
      db.deleteAllData((DB_STORES as any)?.[store]);
    });

    FirebaseAuth.performSignOut();
  }

  useEffect(() => {
    auth.onAuthStateChanged(
      async user => {
        try {
          const userDetails = FirebaseAuth.getLoginDetails();
          if (
            typeof userDetails?.userUID === 'string' &&
            typeof userDetails?.userEmail === 'string'
          ) {
            await getUserProfile();
            setOnAuthLoadPending(false);
          } else {
            setUserLogin(undefined);
            router.push({
              pathname: PATHS.login,
            });
            setOnAuthLoadPending(false);
          }
        } catch (error) {
          setUserLogin(null);
          setOnAuthLoadPending(false);
        }
      },
      error => {
        setOnAuthLoadPending(false);
        setUserLogin(null);
        console.log('AUTH ERROR :: ', error);
      },
    );
  }, []);

  return (
    <Context.Provider
      value={{
        userLogin: userLogin,
        setUserLogin: setUserLogin,
        getUserProfile: getUserProfile,
        onAuthLoadPending: onAuthLoadPending,
        handleSignOut: handleSignOut,
        contentUploader: contentUploader,
        folderContentsMapping: folderContentsMapping,
        setFolderContentsMapping: setFolderContentsMapping,
        fileDetailsMapping: fileDetailsMapping,
        setFileDetailsMapping: setFileDetailsMapping,
      }}>
      <Layout>{children}</Layout>
    </Context.Provider>
  );
}

export function useConfigurationContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      `useConfigurationContext must be used within the ConfigurationContextProvider`,
    );
  }
  return context;
}

export default ConfigurationContextProvider;
