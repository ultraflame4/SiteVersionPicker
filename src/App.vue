<template>
    <div id="pulse">
        <div class="gradient"></div>
    </div>
    <div id="content">
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
                <option selected disabled>Select Version</option>
                <option v-for="(version,index) in SiteVersions.toReversed()" :value="version.name">
                    {{ version.name }}{{ index == 0 ? " - latest" : "" }}
                </option>
            </select>
        </template>
    </div>


</template>
<script setup lang="ts">
import {latestRelease, SiteVersions} from "./tools.ts";
import {ref, watch} from "vue";

const autoRedirectActive = ref(true)
const counter = ref(3)
const selected_version = ref("Select Version")

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

#content, #pulse {
    position: absolute;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: inherit;
}

#pulse {
    position: absolute;
    inset: 0;
    display: flex;
    place-content: center;
    align-items: center;
    overflow: hidden;
    background-image: radial-gradient(black 1px, transparent 0);
    background-size: 40px 40px;
    background-position: -20px -19px;

}
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes pulsing {
    0%{
        opacity: 0.25;
    }
    100%{
        opacity: 0.75;
    }
}

.gradient {
    --size: 800px;
    width: var(--size);
    height: var(--size);
    filter: blur(calc(var(--size) / 5));

    background-image: linear-gradient(hsl(158, 82, 57, 85%), hsl(252, 82, 57));
    animation: rotate 10s linear infinite, pulsing 5s ease-in-out alternate infinite;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}

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
