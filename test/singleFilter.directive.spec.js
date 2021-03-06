'use strict';

describe('SingleFilterService', function () {
  var ele, $scope, $compile, recompile;

  beforeEach(module('ui.grid.single.filter'));
  beforeEach(inject(function ($rootScope, _$compile_) {
    $scope = $rootScope;
    $compile = _$compile_;

    $scope.gridOptions = getGridOptions();

    recompile = function() {
      ele = angular.element(
        '<div>' +
        '<input id="single-input" type="text" ui-grid-single-filter-value/>' +
        '<div id="grid" ui-grid-bootstrap-styles ui-grid="gridOptions" class="grid" ui-grid-single-filter></div>' +
        '</div>'
      );
      $compile(ele)($scope);
      $scope.$digest();
    };

    recompile();

  }));


  describe('Comprobamos el uso de la directiva ui-grid', function () {

    it('debería tener 3 filas', function () {
      var rows = $(ele).find('.ui-grid-row');
      expect(rows.length).toEqual(4);
    });

  });

  describe('La directiva ui-grid-single-filter', function () {

      it('filtra los resultados del grid para cualquier valor del input con directiva ui-grid-single-filter-value', function () {
        var input =  $(ele).find('#single-input').val("1");
        input.triggerHandler('keyup');
        $scope.$digest();
        var rows = $(ele).find('.ui-grid-row');
          expect($(ele).find('#single-input').val()).toEqual("1");
          expect(rows.length).toEqual(2);
      });

    it('filtra los resultados del grid para cualquier valor del input con directiva ui-grid-single-filter-value', function () {
      var input =  $(ele).find('#single-input').val("1 3 desc");
      input.triggerHandler('keyup');
      $scope.$digest();
      var rows = $(ele).find('.ui-grid-row');
      expect(rows.length).toEqual(1);
    });

  });

  describe('En el filtrado se tienen en cuenta los campos singleFilter* en columnDef', function () {

    it('No se incluyen en la búsqueda las columnas que tengas singleFilterSearchable = false', function () {
      var input =  $(ele).find('#single-input').val("NOT 3");
      input.triggerHandler('keyup');
      $scope.$digest();
      var rows = $(ele).find('.ui-grid-row');
      expect(rows.length).toEqual(0);
    });

    it('Se añaden a la busqueda los datos de singleFilterAdditionalValue', function () {
      var input =  $(ele).find('#single-input').val("Added 2");
      input.triggerHandler('keyup');
      $scope.$digest();
      var rows = $(ele).find('.ui-grid-row');
      expect(rows.length).toEqual(1);
    });

    it('Se utiliza el valor de singleFilterValue en lugar del valor de la celda', function () {
      var input =  $(ele).find('#single-input').val("OVERPRICED");
      input.triggerHandler('keyup');
      $scope.$digest();
      var rows = $(ele).find('.ui-grid-row');
      expect(rows.length).toEqual(1);
    });

    describe('Se utiliza para filtrar el valor field por defecto salvo cuando singleFilterRenderCellTemplate = true que se filtra el cellTemplate renderizado', function () {

      it('Encontramos resultados si buscamos por algo del cellTemplate', function () {
        var input =  $(ele).find('#single-input').val("SIRender1");
        input.triggerHandler('keyup');
        $scope.$digest();
        var rows = $(ele).find('.ui-grid-row');
        expect(rows.length).toEqual(2);
      });

      it('No encontramos resultados si buscamos el valor del field', function () {
        var input =  $(ele).find('#single-input').val("NORender");
        input.triggerHandler('keyup');
        $scope.$digest();
        var rows = $(ele).find('.ui-grid-row');
        expect(rows.length).toEqual(0);
      });

    });

  });

  describe('En el filtrado de celdas mediante custom cell templates', function () {

    it('El valor se busca en las celdas renderizadas', function () {
      var input =  $(ele).find('#single-input').val("cell template");
      input.triggerHandler('keyup');
      $scope.$digest();
      var rows = $(ele).find('.ui-grid-row');
      expect(rows.length).toEqual(1);
    });

    it('El valor se busca en las celdas renderizadas eliminando los elementos HTML', function () {
      var input =  $(ele).find('#single-input').val("pencil");
      input.triggerHandler('keyup');
      $scope.$digest();
      var rows = $(ele).find('.ui-grid-row');
      expect(rows.length).toEqual(0);
    });

  });

  describe('En el filtrado se utilizan los filtros definidos en las celdas', function () {

    it('Se filtra sobre el resultado el filtro number', function () {
      var input =  $(ele).find('#single-input').val("1.00");
      input.triggerHandler('keyup');
      $scope.$digest();
      var rows = $(ele).find('.ui-grid-row');
      expect(rows.length).toEqual(1);
    });

  });


  //

  function getGridOptions() {
    var gridOptions = {};

    gridOptions = {
      onRegisterApi: function( gridApi ){ $scope.gridApi = gridApi; },
      columnDefs:[
        {field:"code", cellFilter:'number:\'2\''},
        {field:"code", singleFilterValue: "{{row.entity.code > 10 ? 'OVERPRICED' : 'OK'}}"},
        {field:"complex.name"},
        {field:"description", singleFilterAdditionalValue:"Added {{row.entity.code}}"},
        {field:'noRender', singleFilterRenderCellTemplate: true, cellTemplate:'<div class="ui-grid-cell-contents" ><i class="fa fa-pencil"></i> SI{{grid.getCellValue(row, col)}} </div>' },
        {field:'noRender', cellTemplate:'<div class="ui-grid-cell-contents" ><i class="fa fa-pencil"></i> NO{{grid.getCellValue(row, col)}} </div>' },
        {field:"notSearchable", singleFilterSearchable: false},
        {field:'cellTemplateProperty', singleFilterRenderCellTemplate: true, cellTemplate:'<div class="ui-grid-cell-contents" ><i class="fa fa-pencil"></i> cell {{grid.getCellValue(row, col)}} </div>' }
      ],
      data:[
        {code:'1', complex: {name: "name1"}, description:'description 1', noRender:'Render1', notSearchable:"NOT1", cellTemplateProperty:'template'},
        {code:'2', complex: {name: "name2"}, description:'description 2', noRender:'Render2', notSearchable:"NOT2", cellTemplateProperty:''},
        {code:'3', complex: null, description:'description 3', noRender:'Render3', notSearchable:"NOT3", cellTemplateProperty:''},
        {code:'13', description:'description 13', noRender:'Render13', notSearchable:"NOT13", cellTemplateProperty:''}
      ]
    };

    return gridOptions;
  }


});
