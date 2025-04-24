import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  UserCredential,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
import { toast } from 'react-toastify';
import { TOAST_MESSAGES } from '@/utils/ToastMessages';
import { UserLoginModel } from '@/models/UserLogin';
import { ApiController } from '@/ApiManager/ApiController';
import { handleAPIResponse, setUserToken } from '@/utils/Helper';
import { IndexedDBManager } from '@/IndexedDB/IndexedDBHelper';
import {
  DB_NAME,
  DB_STORES,
  DB_VERSION,
  LOGIN_KEYS,
} from '@/IndexedDB/DBConfigurations';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

export const FirebaseAuth = {
  performAuth: async () => {
    return new Promise(resolve => {
      if (!auth.currentUser) {
        signInWithPopup(auth, googleAuthProvider)
          .then(async (user: UserCredential) => {
            if (
              typeof user?.user?.email === 'string' &&
              typeof user?.user?.displayName === 'string'
            ) {
              const userLoginPayload: UserLoginModel = {
                user_uid: user?.user?.uid,
                user_email: user?.user?.email,
                user_name: user?.user?.displayName,
                user_profile_image: user?.user?.photoURL || undefined,
              };

              const apiResponse = await ApiController.login(userLoginPayload);
              handleAPIResponse({
                apiResponse: apiResponse,
                handleSuccess: async () => {
                  const token: string = apiResponse?.data?.user_token;
                  if (typeof token === 'string') {
                    setUserToken(token);
                    const db = new IndexedDBManager(DB_NAME, DB_VERSION);
                    await db?.putData?.(
                      DB_STORES.login,
                      LOGIN_KEYS.token,
                      token,
                    );
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                },
              });

              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(error => {
            console.log('Error while signing in with Google', error);
            resolve(false);
          });
      } else {
        toast.error(TOAST_MESSAGES.alreadyLoggedIn, {
          toastId: TOAST_MESSAGES.alreadyLoggedIn,
        });
        resolve(false);
      }
    });
  },

  performSignOut: () => {
    auth?.signOut?.();
  },

  getLoginDetails: () => {
    const user = auth?.currentUser;
    const userName = user?.displayName;
    const userEmail = user?.email;
    const userProfileImage = user?.photoURL;
    const userUID = user?.uid;

    return { userName, userEmail, userProfileImage, userUID };
  },
};
