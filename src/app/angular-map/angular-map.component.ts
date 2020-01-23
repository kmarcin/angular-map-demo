import { Component, ElementRef, OnInit, ViewChild, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import esri = __esri; // Esri TypeScript Types
import { loadModules } from 'esri-loader';


@Component({
  selector: 'app-angular-map',
  templateUrl: './angular-map.component.html',
  styleUrls: ['./angular-map.component.scss']
})
export class AngularMapComponent implements OnInit, OnDestroy {

  private _zoom: number = 12;
  private _center: Array<number> = [0, 0];
  private _view: esri.MapView;
  private  _portalUrl  = '';
  private _itemId  = '';
  private _loaded  = false;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set portalUrl(portalUrl: string) {
    this._portalUrl = portalUrl;
  }

  get portalUrl(): string {
    return this._portalUrl;
  }

  @Input()
  set itemId(itemId: string) {
    this._itemId = itemId;
  }

  get itemId(): string {
    return this._itemId;
  }



  constructor() { }

  @Output() mapLoadedEvent = new EventEmitter<boolean>();
  @ViewChild('mapContainer', { static: true }) private mapContainerEl: ElementRef;


  async initializeMap() {
    try {

      const [Map, WebMap, MapView, FeatureLayer, BasemapGallery, Expand] = await loadModules([
        "esri/Map",
        "esri/WebMap",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/BasemapGallery",
        "esri/widgets/Expand"
      ]);

      const mapProperties = {
        id: this._itemId,
        portal: {
          url: this._portalUrl
        }
      };


      const map: esri.Map = new WebMap({
        portalItem: mapProperties
      });

      const mapViewProperties: esri.MapViewProperties ={
        container: this.mapContainerEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      const featureLayer: esri.FeatureLayer = new FeatureLayer({
        url: "https://msipportal.demo.esri.pl/server/rest/services/epl/SpatialSurvey/FeatureServer"
      });

      map.layers.add(featureLayer);

      this._view = new MapView(mapViewProperties);

      await this._view.when();

      const baseMapGallery: esri.BasemapGallery = new BasemapGallery({
        view: this._view
      });

      const basemapGalleryExpand: esri.Expand = new Expand({
        view: this._view,
        content: baseMapGallery
      });

      this._view.watch("map.basemap.title", (function() {
        basemapGalleryExpand.collapse();
      }).bind(this));

      this._view.ui.add(basemapGalleryExpand, 'bottom-right');

      return this._view;

    } catch (error) {
      console.log('Esri loader:', error);
    }
  }

  ngOnInit() {

    this.initializeMap().then(mapView => {
      console.log("Map view is ready", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    })

  }

  ngOnDestroy(): void {
    if(this._view){
      this._view.container = null;
    }
  }


}
