import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// const API_BASE_URL = 'http://localhost:3000/'
// android emulator, ios simulator, physical device(computers ip address)
// For physical devices, replace with your computer's IP address
// Example: return 'http://192.168.1.100:3000/api';

const getApiUrl = () => {
  if (Platform.OS === "web") {
    // Web browser can access localhost
    return "http://localhost:3000";
  }

  // For physical devices (Android/iOS)
  return "http://192.168.3.13:3000"; 
};


const API_BASE_URL = getApiUrl();


// helper functions for tokens

export const getToken = () => {

};

export const saveToken = async (token) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem("authToken", token);
      return true;
    }

    await AsyncStorage.setItem("authToken", token);
    return true;
  } catch (error) {
    console.error("Token cannot be saved:", error);
    return false;
  }
};



const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  requiresAuth = false
) => {
  try {
    
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(url);
    const headers = {
      "Content-Type": "application/json",
    };

    // check for jwt token

    const config = {
      method,
      headers,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const authApi = {
  signup: async (name, email, password) => {
    return apiRequest('/api/auth/signup', "POST", {name, email, password})
  },

  login: async (email, password) => {
    return apiRequest('/api/auth/login', "POST", {email, password})
  },
};
