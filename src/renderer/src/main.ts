import './app.css';
import App from './app.svelte';
import '$lib/i18n';
import { mount } from 'svelte';

mount(App, {
  target: document.getElementById('app')!,
});

export default App;
