import type { Ref } from "vue";
import { ref } from "vue";

// Typdefinition für einzelne Benutzerobjekte
interface User {
  email: string;
  password: string;
  isAdmin: boolean;

}

// Ref-Typ für das Array von User-Objekten
const userArray: Ref<User[]> = ref([
  { email: "admin@admin.com", password: "123", isAdmin: true },
  { email: "user@user.com", password: "123", isAdmin: false },
]);

// Funktion zur Verwaltung der Benutzerkonten
export const userAccounts = () => {
  return {
    accounts: userArray,
  };
};
