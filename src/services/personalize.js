import Personalize from '@contentstack/personalize-edge-sdk';
let projectUid = process.env.REACT_APP_CONTENTSTACK_PROJECT_UID;
// Using async-await:
const personalizeSdk = await Personalize.init(projectUid);

export default personalizeSdk;