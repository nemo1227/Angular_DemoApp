import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { Housinglocation } from '../app/housinglocation';
@Component({
  selector: 'app-home',
  imports: [HousingLocationComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  housingLocation: Housinglocation = {
    id: 9999,
    name: 'Nemo Home',
    city: 'Pune',
    state: 'Maharashtra',
    photo: 'home.jpg',
    availableUnits: 99,
    wifi: true,
    laundary: false,
  };
}
