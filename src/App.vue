<template>

    <h1>Site Version Picker</h1>
    <template v-if="autoRedirectActive">
        <p>
            Auto-Redirect to latest <span class="version_text">{{ latestRelease.trim() }}</span>
            in {{ counter }}s
        </p>
        <button @click="autoRedirectActive=false">
            Select Version
        </button>
    </template>
    <template v-else>
        Auto-Redirect canceled
        <p>
            Select a version to continue
        </p>
        <select v-model="selected_version">
            <option v-for="version in SiteVersions.toReversed()" :value="version.name">
                {{ version.name }}
            </option>
        </select>
    </template>


</template>
<script setup lang="ts">
import {latestRelease, SiteVersions} from "./tools.ts";
import {ref, watch} from "vue";

const autoRedirectActive = ref(true)
const counter = ref(3)
const selected_version = ref("none")

const id = setInterval(() => {
    counter.value--;
    if (counter.value < 1) {
        clearInterval(id)
        auto_redirect()
    }
}, 1000)

function auto_redirect() {
    setTimeout(() => {
        if (autoRedirectActive.value) {
            console.log("Should be redirecting to", latestRelease.value)
            selected_version.value = latestRelease.value
        }
    }, 1200)
}

watch(selected_version, (value) => {
    if (SiteVersions.value.find(x => x.name.trim() === value.trim())) {
        window.location.assign(`https://ultraflame4.github.io/${value.trim()}`)
    }
})

document.addEventListener('keypress', ev => {
    if (ev.shiftKey && ev.key.toLowerCase() == "c") {
        autoRedirectActive.value = false
        clearInterval(id)
    }
})
</script>

<style scoped lang="scss">

.version_text {

    text-transform: lowercase;
    font-family: "Poppins";
    letter-spacing: 1px;
    font-size: 0.9em;
    font-weight: 600;
    background: var(--bg-2);
    padding: 0 0.45rem;
    border-radius: 0.35rem;

}

p {
    letter-spacing: 0.1px;
}


</style>
