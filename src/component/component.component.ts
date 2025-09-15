import { Component, OnInit } from '@angular/core';
import { Hours } from './hours';
import { Company } from './company';

@Component({
  selector: 'app-component1',
  standalone: true,
  imports: [],
  templateUrl: './component.component.html',
  styleUrl: './component.component.css'
})
export class ComponentComponent implements OnInit{
  schedule:Array<Hours>= new Array <Hours>
  com:Company=new Company("arter","our company do all...",this.schedule)
  ngOnInit(): void {
    this.schedule.push(new Hours(1,8,20))
    this.schedule.push(new Hours(2,8,20))
    this.schedule.push(new Hours(3,8,20))
    this.schedule.push(new Hours(4,8,20))
    this.schedule.push(new Hours(5,8,20))
    this.schedule.push(new Hours(6,8,20))
  }
}