<template>

    <h1>Site Version Picker</h1>
    <hr/>
    <template v-if="autoRedirectActive">
        <h2>Auto Redirect to <span style="color:aquamarine">{{latestRelease}}</span> in <span style="background: var(--bg-2);padding: 0 0.25em;border-radius: 0.4em">{{ counter }} second</span>!</h2>
        <h1 style="margin-bottom: 0"  @click="autoRedirectActive=false">[<span style="color:cadetblue;cursor: pointer">Click Me!</span>]</h1>
        <h2 style="margin: 0">or</h2>
        <h1 style="margin: 0">[<span style="color:indianred">Shift + C</span>]</h1>
        <h2 style="margin-top: 0"> to Cancel!</h2>

    </template>
    <template v-else>
        <h1>[ <span style="color:indianred">STOPPED</span> ]</h1>
    </template>
    <hr/>

    <h2>View Specific Version</h2>

    <ul id="version-list">
        <li v-for="item in SiteVersions">
            <a :href="`https://ultraflame4.github.io/${item.name}`">
                &xrArr;{{ item.name }}&xlArr;
            </a>
        </li>
    </ul>


</template>
<script setup lang="ts">
import {latestRelease, SiteVersions} from "./tools.ts";
import {ref} from "vue";

const autoRedirectActive = ref(true)
const counter = ref(2)


const id = setInterval(()=>{
    counter.value--;
    if (counter.value < 1){
        clearInterval(id)
        setTimeout(()=>{
            if (autoRedirectActive.value) {
                window.location.assign(`https://ultraflame4.github.io/${latestRelease.value}`)
            }
        },1200)
    }
},1000)
document.addEventListener('keypress',ev => {
    if (ev.shiftKey && ev.key.toLowerCase() == "c") {
        autoRedirectActive.value=false
        clearInterval(id)
    }
})
</script>

<style scoped lang="scss">

#version-list {
    list-style-type: none;
    padding-left: 0;
    filter: drop-shadow(0 0 3px black);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.3em;
    & > li {

        &:hover {

            & > a {
                color: aquamarine;
            }

            &>a::before{
                content: "[";
            }
            &>a::after{
                content: "]";
            }
        }

        & > a {
            display: flex;
            height: 2.25rem;
            align-items: center;

            font-weight: 800;
            font-size: 1.3em;
            text-decoration: none;
            letter-spacing: 0.2em;
            color: beige;

            transition: color 300ms ease-in-out;
            text-transform: uppercase;
            overflow: clip;
            width: 100%;
            position: relative;

        }


    }

}


</style>
