import { Component, Input } from '@angular/core';
import { Housinglocation } from '../app/housinglocation';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-housing-location',
  imports: [CommonModule, RouterModule],
  templateUrl: './housing-location.component.html',
  styleUrl: './housing-location.component.css'
})
export class HousingLocationComponent {
  @Input() housingLocation!: Housinglocation;
}
// '!' because the input is expecting the value to be passed. The exclamation point is called the non-null assertion operator and it tells the Typescript compiler that the value of this property won't be null or undefined. 