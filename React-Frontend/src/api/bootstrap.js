import axios from 'axios';
import { normalizeApiBaseUrl } from '../utils/api.js';

axios.defaults.baseURL = normalizeApiBaseUrl(import.meta.env.VITE_API);