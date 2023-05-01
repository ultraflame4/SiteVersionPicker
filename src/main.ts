import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {_GetVersions} from "./tools.ts";


_GetVersions()
createApp(App).mount('#app')
