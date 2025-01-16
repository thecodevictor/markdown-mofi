// Components do Sistema
import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
// Utils
import { SecurityUtil } from '../utils/security.util';
import { UtilsService } from "../utils/utils.service";
// Services

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private route: Router,
		private utilsService: UtilsService,
	) { }

	canActivate() {
		// if (!SecurityUtil.getToken()) {
		// 	this.route.navigate(['/auth/login']);
		// 	return false;
		// } else {
		// 	this.utilsService.refreshtoken();
		// }
    return true;
	}
}
