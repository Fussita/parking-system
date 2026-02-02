import { HttpHeaders } from "@angular/common/http";
import { UserStore } from "./user-store";

export function HeaderBearerGen() {
    const user = UserStore.getInstance()

    return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.User.token
    })
}