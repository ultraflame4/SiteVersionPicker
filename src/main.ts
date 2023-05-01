import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {_GetLatestVersion, _GetVersions} from "./tools.ts";


_GetVersions()
_GetLatestVersion()
createApp(App).mount('#app')
