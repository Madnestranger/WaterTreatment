export class MapPageController {
  constructor(map, $scope, api) {
    'ngInject';
    this.$scope = $scope;
    this.api = api;
    this.map = map;
    this.def = {
      cityId:'421866',
      lng: '30.6146803128848',
      lat: '50.4020865'
    };
    this.getRegions();
    this.nullStats();
    this.chosenRegion = {};
    this.getData(this.def);
    this.$scope.activeLocation = {};
    $scope.objects = [];
  }

  nullStats() {
    this.plantSum = 0;
    this.reforest = 0;
    this.eventLogging = 0;
  }

  sortObjects() {
    this.nullStats();
    var region = this.regions.find(x => x._id == this.chosenRegion);
    this.map.clearMarkers(this.$scope.objects.length);
    this.$scope.objects = this.$scope.allObjects.filter(x => x.cityId == region._id);
    this.getData(region, true);
    this.calculateStats(this.$scope.objects);
  }

  getData(obj, reset) {
    this.map.getLocations(obj.cityId)
      .then(response => {
        this.$scope.objects = response;
        this.$scope.allObjects = response;
        this.map.getLocationOfUser()
          .then(responseUser => {
            let nearestLocation = this.map.chooseNearestLocation(response, responseUser);
            this.map.init(response, nearestLocation, 'map', this.$scope, 'activeLocation', obj, reset);
          }, () => {
            this.map.init(response, this.$scope.objects[0], 'map', this.$scope, 'activeLocation', obj, reset);
          });
      });
  }

  calculateStats(objs) {
    angular.forEach(objs, item => {
      this.plantSum += item.forestPlanting;
      this.reforest += item.reforestation;
      this.eventLogging += item.eventLogging;
    });
  }

  getRegions() {
    this.api
      .get(`regions`)
      .then(response => {
        this.regions = response.data;
      });
  }

  handleLocationClick(obj) {
    this.map.setCenter(obj);
    this.$scope.activeLocation = obj;
  }
}
