import { Injectable } from '@angular/core';
import { Housinglocation } from './housinglocation';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  protected housingLocationList: Housinglocation[] = [
    {
      id: 1,
      name: 'Nemo Home',
      city: 'Pune',
      state: 'Maharashtra',
      photo: 'home.jpg',
      availableUnits: 99,
      wifi: true,
      laundary: false,
    },
    {
      id: 2,
      name: 'Soham Residency',
      city: 'Pune',
      state: 'Maharashtra',
      photo: 'home1.jpg',
      availableUnits: 4,
      wifi: true,
      laundary: true,
    },
    {
      id: 3,
      name: 'Amy villa',
      city: 'Amritsar',
      state: 'Punjab',
      photo: 'home3.jpg',
      availableUnits: 8,
      wifi: false,
      laundary: false,
    }
  ];

  getAllHousingLocations(): Housinglocation[] //return the entire list of housingLocation
  {
    return this.housingLocationList;
  }
  getHousingLocationById(id: number): Housinglocation | undefined   //return a specififc housingLocation by id
  {
    return this.housingLocationList.find((housingLocation) => housingLocation.id === id);
  } 
}
