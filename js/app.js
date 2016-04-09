/**
 * @licence MIT
 * @licence http://opensource.org/licenses/MIT MIT
 * @copyright 2015 Smart Home Technology GmbH, smart-home-technology.ch
 * @author An adorable space cat
 * @version 1.0.0 2016-04-07
 */

var app = angular.module("app", [
    "rzModule",
    "mgcrea.ngStrap"
]);

app.controller("controller", function ($scope, $sce) {

    $scope.ISM = IntertechnoSwitchMessenger;

    $scope.const = {
        passwordLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    };


    $scope.password = {
        p1: "A",
        p2: "A",
        p3: "A",
        p4: "A",
        p5: "1",
        asString: function(){
            return this.p1 + this.p2 + this.p3 + this.p4 + this.p5;
        }
    };

    $scope.callbacks = {
        enabled: true,
        c1: "",
        c2: "",
        c3: "",
        asArray: function(){
            var a = [];
            if (this.c1.length){
                a.push(this.c1);
            }
            if (this.c2.length){
                a.push(this.c2);
            }
            if (this.c3.length){
                a.push(this.c3);
            }
            return a;
        },
        command: function(){
            if (!this.enabled){
                return IntertechnoSwitchMessenger.Command.callback(false);
            }
            return IntertechnoSwitchMessenger.Command.callback(this.asArray());
        }
    };


    $scope.module = new IntertechnoSwitchMessenger.Module();
    $scope.module.dimLevelSlider = {
        value: 8,
        floor: 0,
        ceil: 15
    };
    $scope.module.on = function(){
        return IntertechnoSwitchMessenger.Command.on(this,$scope.password.asString());
    };
    $scope.module.off = function(){
        return IntertechnoSwitchMessenger.Command.off(this,$scope.password.asString());
    };
    $scope.module.dim = function(){
        if (this.type != IntertechnoSwitchMessenger.CODE_TYPE_LEARN) {
            return null;
        }
        return IntertechnoSwitchMessenger.Command.dim(this, $scope.password.asString(), this.dimLevelSlider.value);
    };

    $scope.sms = function(msg){
        return $sce.trustAsHtml(msg.replace(new RegExp("([+-]{1})","g"),function(match){
            return "&shy;" + match;
        }));
    };

    $scope.timers = {
        max: 15,
        list: [],
        sync: {
            weekday: "0",
            time: new Date(0),
            now: function(){
                var now = new Date();
                now.setSeconds(0,0);
                this.time = now;
                this.weekday = "" + ((now.getDay() + 6) % 7);
            },
            asDate: function(){
                var d = this.time;
                d.setDate(d.getDate() + parseInt(this.weekday) - (d.getDay() +6 )%7);
                return d;
            }
        },
        weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        add: function(){
            var timer = new IntertechnoSwitchMessenger.Timer(new IntertechnoSwitchMessenger.Module());

            timer.onEnabled = false;
            timer.onTimeDate = "";
            timer.offEnabled = false;
            timer.offTimeDate = "";

            timer.weekdayBools = {
                mon: false,
                tue: false,
                wed: false,
                thu: false,
                fri: false,
                sat: false,
                sun: false,
                asArray: function(){
                    return [this.mon, this.tue, this.wed, this.thu, this.fri, this.sat, this.sun];
                }
            };

            this.list.push(timer);
        },
        remove: function(i){
            this.list.splice(i,1);
        },
        changedTimes: function(i) {
            var timer = this.list[i];
            if (timer.onEnabled && typeof timer.onTimeDate == "object") {
                timer.setOn(timer.onTimeDate.getHours(), timer.onTimeDate.getMinutes());
            } else {
                timer.disableOn();
            }
            if (timer.offEnabled && typeof timer.offTimeDate == "object"){
                timer.setOff(timer.offTimeDate.getHours(),timer.offTimeDate.getMinutes());
            } else {
                timer.disableOff();
            }
        },
        changedWeekday: function(i){
            var timer = this.list[i];
            timer.weekdays = timer.weekdayBools.asArray();
        },
        filterLearncodes: function(learnNumber){
            return parseInt(learnNumber) != 16;
        },
        command: function(){
            return IntertechnoSwitchMessenger.Command.timers(this.list,$scope.password.asString(), this.sync.asDate());
        }
    };
    $scope.timers.sync.now();

    // $scope.timers.add();

});
