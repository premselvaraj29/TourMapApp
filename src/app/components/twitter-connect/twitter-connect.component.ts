import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-twitter-connect',
  providers: [CookieService],
  templateUrl: './twitter-connect.component.html',
  styleUrls: ['./twitter-connect.component.css'],
})
export class TwitterConnectComponent implements OnInit {
  username: string | undefined;

  constructor(private cookieService: CookieService) {
    this.username = undefined;
  }

  getTwitterOauthUrl() {
    const rootUrl = 'https://twitter.com/i/oauth2/authorize';
    const options = {
      redirect_uri: 'http://www.localhost:3000/twitter/oauth',
      client_id: 'VW9MTWFOTVJjbkNjZnRzaU1qUzk6MTpjaQ',
      state: 'state',
      response_type: 'code',
      code_challenge: 'y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8',
      code_challenge_method: 'S256',
      scope: ['users.read', 'tweet.read', 'follows.read', 'follows.write'].join(
        ' '
      ),
    };
    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
  }

  getUsername() {
    if (this.cookieService.check('user_name')) {
      console.log({ cookie: this.cookieService.get('user_name') });
      this.username = this.cookieService.get('user_name');
    }
  }

  ngOnInit(): void {
    this.getUsername();
  }
}
