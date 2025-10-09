import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from 'react';
  
  import Personalize from '@contentstack/personalize-edge-sdk';
  import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk';


let sdkInstance = null;
export async function getPersonalizeInstance() {
  // If already initialized and cached, return it
  if (sdkInstance) {
    return sdkInstance;
  }
  
  // Check if Personalize is already initialized globally
  if (Personalize.getInitializationStatus()) {
    // If initialized, use the Personalize object itself
    sdkInstance = Personalize;
    return sdkInstance;
  }
  
  // Initialize for the first time
  try {
    const projectUid = process.env.REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
    if (!projectUid) {
      console.error('Missing REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID environment variable');
      return null;
    }
    
    sdkInstance = await Personalize.init(projectUid);
    console.log('Personalize SDK initialized successfully');
    return sdkInstance;
  } catch (error) {
    console.error('Failed to initialize Personalize SDK:', error);
    return null;
  }
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