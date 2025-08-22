 

// src/apis/apiEndpoints.js

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const USER_API = {
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  LOGIN: `${BASE_URL}/api/auth/login`,
  GOOGLELOGIN: `${BASE_URL}/api/auth/googlelogin`,
  UPDATE_PROFILE: `${BASE_URL}/api/auth/update-profile`,
  CHECK_AUTH: `${BASE_URL}/api/auth/check`,
};

export const MESSAGE_API = {
  GET_USERS: `${BASE_URL}/api/messages/users`,
  GET_MESSAGES_WITH_USER: (userId) => `${BASE_URL}/api/messages/${userId}`,
  MARK_AS_SEEN: (userId) => `${BASE_URL}/api/messages/mark/${userId}`,
  SEND_MESSAGE: (id) => `${BASE_URL}/api/messages/send/${id}`,
  SEARCH_USER:(query)=> `${BASE_URL}/api/messages/search/${query}`
};

// export const GROUP_API = {
//   CREATE_GROUP: `${BASE_URL}/api/messages/createGroup`,
//   GET_ALL_GROUPS: `${BASE_URL}/api/messages/getAllGroups`,
//   SEND_GROUP_MESSAGE: (groupId) => `${BASE_URL}/api/messages/sendMessageToGroup/${groupId}`,
//   GET_GROUP_MESSAGES: (groupId) => `${BASE_URL}/api/messages/getGroupMessage/${groupId}`,
//   RENAME_GROUP: (groupId) => `${BASE_URL}/api/messages/renameGroup/${groupId}`,
//   ADD_GROUP_MEMBERS: (groupId) => `${BASE_URL}/api/messages/add-members/${groupId}`,
//   REMOVE_GROUP_MEMBER: (groupId) => `${BASE_URL}/api/messages/remove-member/${groupId}`,
// };
