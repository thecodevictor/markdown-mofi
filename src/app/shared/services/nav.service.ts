import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, debounceTime, fromEvent, takeUntil } from "rxjs";
import { Menu } from "./interface/menu.interface";
import { SecurityUtil } from "src/app/_core/utils/security.util";
import { MENUHOME } from "src/app/routes/home/home.menu";

@Injectable({
  providedIn: "root",
})

export class NavService {
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  private unsubscriber: Subject<void> = new Subject();

  public language: boolean = false;

  public collapseSidebar: boolean = window.innerWidth < 1200 ? true : false;

  constructor(
    private router: Router
  ) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(0), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 1200) {
          this.collapseSidebar = true;
        } else {
          this.collapseSidebar = false;
        }
      });

  }

  MENUITEMS: Menu[] = SecurityUtil.getNav() ?? MENUHOME;
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  ngOnDestroy() {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
