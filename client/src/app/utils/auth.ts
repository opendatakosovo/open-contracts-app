import { Headers } from '@angular/http';
export class Auth {
    static authHeaders: Headers;
    static token: any;

    static loadToken() {
        this.token = localStorage.getItem('id_token');
        this.authHeaders = new Headers();
        this.authHeaders.append('Authorization', this.token);
        this.authHeaders.append('Content-Type', 'application/json');
        return this.authHeaders;
    }
}
