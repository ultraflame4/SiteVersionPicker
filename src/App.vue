<template>
    <div id="pulse">
        <div class="gradient"></div>
    </div>
    <div id="content" class="gap-4">
        <h1 class="text-4xl font-semibold">Site Version Picker</h1>
        <template v-if="autoRedirectActive">
            <p>
                Auto-Redirect to latest <span class="version_text">{{ latestRelease }}</span>
                in {{ counter }}s
            </p>
            <p class="text-red-600" v-if="!redirecting">
                Press <span class="font-mono font-bold">Shift + C</span> or <span class="font-mono font-bold">Q</span>
                to cancel.
            </p>
            <p class="text-yellow-300" v-else>
                Going to {{ goto_url }}
            </p>
            <Button class="cursor-pointer" @click="autoRedirectActive = false">
                Select Version
            </Button>

            <Button @click="redirect_now()" class="cursor-pointer" variant="link">
                Skip
            </Button>
        </template>
        <template v-else>
            <p class="text-gray-400">Auto-Redirect canceled</p>
            <Select v-model:model-value="goto_url">
                <SelectTrigger>
                    <SelectValue placeholder="Select Version" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem v-for="version in avail_versions" :value="version.url">
                            {{ version.name }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button @click="redirect_now()" class="rounded-lg cursor-pointer text-green-400" variant="link">
                Go latest
            </Button>

        </template>
    </div>


</template>
<script setup lang="ts">
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from "@/components/ui/button"
import { latestRelease, SiteVersions } from "./tools.ts";
import { ref, watch, computed } from "vue";

const autoRedirectActive = ref(true)
const redirecting = ref(false)
const counter = ref(2)
const goto_url = ref<string>()


const avail_versions = computed(() => {
    const latestIndex = SiteVersions.value.findIndex(x => x.name == latestRelease.value);

    return SiteVersions.value.map((x, index) => {
        let suffix = ""
        if (index == latestIndex) {
            suffix = "- latest"
        }
        if (index < latestIndex) {
            suffix = "- preview"
        }
        return {
            id: x.name,
            url: x.html_url,
            name: `${x.name} ${suffix}`
        }

    })
})

const id = setInterval(() => {
    counter.value--;
    if (counter.value < 1) {
        clearInterval(id)
        auto_redirect()
    }
}, 1000)

function redirect_now() {
    goto_url.value = avail_versions.value.find(x => x.id == latestRelease.value)?.url
    console.log("Should be redirecting to", latestRelease.value)
}

function auto_redirect() {
    setTimeout(() => {
        if (autoRedirectActive.value) {
            redirecting.value = true;
            redirect_now();
        }
    }, 100)
}

watch(goto_url, (goto_url) => {
    if (!goto_url) return;
    window.location.assign(goto_url)
})

document.addEventListener('keypress', ev => {
    if (ev.key.toLowerCase() == "c" || ev.key.toLowerCase() == "q") {
        autoRedirectActive.value = false
        clearInterval(id)
    }
})
</script>

<style scoped lang="scss">
#content,
#pulse {
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
    0% {
        opacity: 0.25;
    }

    100% {
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
