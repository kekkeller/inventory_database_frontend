import { type Ref, ref } from "vue";

export type LoggedIn = "Admin" | "User" | "None";

const loggedIn: Ref<LoggedIn> = ref("None");

const checkLoggedIn = () => {
    if (sessionStorage.getItem("isAdmin") === "true") {
        loggedIn.value = "Admin";
    } else if (sessionStorage.getItem("isAdmin") === "false") {
        loggedIn.value = "User";
    } else {
        loggedIn.value = "None";
    }
};

const setLoggedIn = (l: LoggedIn) => {
    console.log(l);
    if (l == "Admin") {
        sessionStorage.setItem("isAdmin", "true");
    } else if (l == "User") {
        sessionStorage.setItem("isAdmin", "false");
    }
    else{
        sessionStorage.removeItem('isAdmin');
    }
    loggedIn.value = l;
};

export const useLoggedIn = () => {
    return {
        loggedIn,
        setLoggedIn,
        checkLoggedIn,
    };
}