import {ElectronManagedService} from '../services/electron-managed.service';
import {
  Component, OnInit, ChangeDetectorRef,
  EventEmitter, ViewChildren, QueryList, ReflectiveKey
} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'App works !';

  constructor(private el: ElectronManagedService) {
    const p =  new Proxy(ElectronManagedService, {});
    console.log('p answer', el.p());
  }

  ngOnInit() {}
}
