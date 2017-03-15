/**
 * Created by asus on 2017/1/16.
 */
angular.module('indexModule',['ng','ngRoute','ngAnimate']).controller('startCtrl',function ($scope,$location) {
    $scope.togglePage=function(){
        if($location.path()=='/start'){
            $location.path('/menu')
        }
    };
}).controller('menuLoad',function ($scope,$http) {
    $scope.isLoading=true;
    $scope.noMore=false;
    $http.get('data/menu-load.php').success(function (data) {
        $scope.isLoading=false;
        $scope.menu=data;
        if(data.length<5){
            $scope.noMore=true;
        }
    });
    $scope.loadMore=function () {
        $scope.isLoading=true;
        $http.get('data/menu-load.php?start='+$scope.menu.length).success(function (data) {
            if(data.length<5){
                $scope.noMore=true;
            }
            $scope.isLoading=false;
            $scope.menu=$scope.menu.concat(data);
        })
    };
    $scope.$watch('kw',function () {
        if($scope.kw){
            $http.get('data/menu-search.php?kw='+$scope.kw).success(function (data) {
                $scope.menu=data;
                $scope.noMore=true;
            })
        }
    })
}).controller('detailCtrl',function ($scope,$routeParams,$http) {
    $http.get('data/detail-dish.php?did='+$routeParams.did).success(function (data) {
        $scope.dish=data;
    })
}).controller('orderCtrl',function ($scope,$routeParams,$http,$rootScope) {
    $scope.user={did:$routeParams.did};
    $scope.$watch('user.user_name');
    $scope.$watch('user.sex');
    $scope.$watch('user.phone');
    $scope.$watch('user.addr');
    $scope.orderOk=false;
    $scope.submitOrder=function () {
        var str=jQuery.param($scope.user);
        $http.post('data/submitOrder.php',str).success(function (data) {
            $rootScope.phone=$scope.user.phone;
            $scope.oid=data.oid;
            $scope.orderOk=true;
        })
    };
}).controller('userOrderList',function ($scope,$rootScope,$http) {
    $http.get('data/user-dishes.php?phone='+$rootScope.phone).success(function (data) {
        $scope.orders=data;
        console.log(data)
    })
}).config(function ($routeProvider) {
    $routeProvider.
    when('/start',{templateUrl:'tpl/start.html'}).
    when('/menu',{templateUrl:'tpl/menu.html'}).
    when('/user',{templateUrl:'tpl/user.html'}).
    when('/detail/:did',{templateUrl:'tpl/detail.html'}).
    when('/order/:did',{templateUrl:'tpl/order.html'}).
    otherwise({redirectTo:'/start'})
}).run(function ($http) {
    //这里特别重要，ajax如果用post提交方式，一定记得改头
    $http.defaults.headers.post={'Content-Type':'application/x-www-form-urlencoded'}
});