import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from 'react';

  import Personalize from '@contentstack/personalize-edge-sdk';

let sdkInstance = null;
let initPromise = null;

export async function getPersonalizeInstance() {
  // If already initialized and cached, return it
  if (sdkInstance) {
    return sdkInstance;
  }

  // Deduplicate concurrent calls — return the same in-flight promise
  if (initPromise) {
    return initPromise;
  }

  // Check if Personalize is already initialized globally
  if (Personalize.getInitializationStatus()) {
    sdkInstance = Personalize;
    return sdkInstance;
  }

  // Initialize for the first time
  const projectUid = process.env.REACT_APP_CONTENTSTACK_PROJECT_UID;
  if (!projectUid) {
    console.error('Missing REACT_APP_CONTENTSTACK_PROJECT_UID environment variable');
    return null;
  }

  initPromise = Personalize.init(projectUid)
    .then(sdk => {
      sdkInstance = sdk;
      initPromise = null;
      console.log('Personalize SDK initialized successfully');
      return sdkInstance;
    })
    .catch(error => {
      initPromise = null;
      console.error('Failed to initialize Personalize SDK:', error);
      return null;
    });

  return initPromise;
}
const PersonalizeContext = createContext(null);
export function PersonalizeProvider({
  children,
}) {
  const [sdk, setSdk] = useState(null);
  useEffect(() => {
    getPersonalizeInstance().then(setSdk);
  }, []);
  return (
    <PersonalizeContext.Provider value={sdk}>
      {children}
    </PersonalizeContext.Provider>
  );
}

export function usePersonalize() {
  return useContext(PersonalizeContext);
}