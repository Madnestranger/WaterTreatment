export class WaterObjectController {
  constructor($scope, api, $stateParams, $compile, $sce) {
    'ngInject';
    this.api = api;
    $scope.$sce = $sce;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$compile = $compile;
    this.getData();
  }

  getData() {
    this.api
      .get(`waterObjects?id=${this.$stateParams.id}`)
      .then(response => {
        console.log(response.data);
        this.object = response.data;
        this.$scope.bindHTML = this.$scope.$sce.trustAsHtml(this.object.desc);
      })
  }
}