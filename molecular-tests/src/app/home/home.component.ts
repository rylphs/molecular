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
  rand: string;
  imagesDisplayed: string[] = [];
  currentFolder = '/home/07125220690/Documentos';
  selectedFolder: string;
  notifyme: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {}
}
