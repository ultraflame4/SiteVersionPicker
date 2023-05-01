import {ref, Ref} from "vue";

export interface SimplifiedItem{
    name: string,
    html_url:string,
    type:"file"|"dir"
}
export const SiteVersions: Ref<SimplifiedItem[]> = ref([])
export const latestRelease: Ref<string> = ref("v1")

export async function _GetVersions() {
    console.log("Fetching versions...")
    const data = await fetch("https://api.github.com/repos/ultraflame4/ultraflame4.github.io/contents?ref=builds")
    const jsonData:SimplifiedItem[] = await data.json()

    jsonData.forEach((value) => {
        if (value.name.startsWith("v") && value.type==="dir") {
            SiteVersions.value.push(value)
        }
    })

}
export async function _GetLatestVersion() {
    console.log("Fetching versions...")
    const data = await fetch("https://raw.githubusercontent.com/ultraflame4/ultraflame4.github.io/builds/LATEST_RELEASE")
    latestRelease.value = await data.text()

}
