import {ref, Ref} from "vue";

export interface SimplifiedItem {
    name: string,
    html_url: string,
    type: "file" | "dir"
}

export const SiteVersions: Ref<SimplifiedItem[]> = ref([])
export const latestRelease: Ref<string> = ref("v1")

interface cachedData<T> {
    data: T,
    expire: number
}

function storeCache<T>(key: string, data: T, duration_s: number) {
    const obj: cachedData<T> = {
        data,
        expire: Date.now() + duration_s
    };
    localStorage.setItem(key, JSON.stringify(obj));
}

function getCache<T>(key: string): T | null {
    const s = localStorage.getItem(key);
    if (s === null) return null;
    try {
        const data: cachedData<T> = JSON.parse(s);
        if (data.expire < Date.now()) {
            return data.data;
        }
    } catch (e) {
        return null;
    }
    return null
}

export async function _GetVersions() {
    console.log("Fetching versions...")
    const cached = getCache<SimplifiedItem[]>("versions");
    let data: SimplifiedItem[];
    if (cached == null) {
        const raw = await fetch("https://api.github.com/repos/ultraflame4/ultraflame4.github.io/contents?ref=builds");
        data = await raw.json()
        console.log("Fetched versions from github", data)
    } else {
        console.log("Retrieved versions from cached", cached)
        data = cached;
    }


    data.forEach((value) => {
        if (value.name.startsWith("v") && value.type === "dir") {
            SiteVersions.value.push(value)
        }
    })

    storeCache("versions", SiteVersions.value, 1000)
}

export async function _GetLatestVersion() {
    console.log("Fetching versions...")
    const data = await fetch("https://raw.githubusercontent.com/ultraflame4/ultraflame4.github.io/builds/LATEST_RELEASE")
    latestRelease.value = await data.text()

}
