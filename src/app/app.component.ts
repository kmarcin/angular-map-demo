import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-map-demo';

    // Set our map properties
    mapCenter = [19.938557, 50.058947];
    mapZoomLevel = 12;
    mapPortalUrl = 'http://msipportal.demo.esri.pl/portal';
    mapItemId = 'b438ebc121bd4aa099959bdb31addbdf';

   // See app.component.html
   mapLoadedEvent(status: boolean) {
     console.log('The map loaded: ' + status);
   }
}
