import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import {app-component1} from './component/component.component.ts'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';
}
