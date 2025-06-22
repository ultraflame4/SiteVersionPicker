import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'
import {_GetLatestVersion, _GetVersions} from "./tools";


_GetVersions()
_GetLatestVersion()
createApp(App).mount('#app')
