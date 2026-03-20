import axios from 'axios';

const csrfToken = document.querySelector<HTMLMetaElement>(
  'meta[name=csrf-token]',
)?.content;

const api = axios.create({
  headers: {
    'X-CSRF-TOKEN': csrfToken ?? '',
    Accept: 'application/json',
  },
});

export default api;
