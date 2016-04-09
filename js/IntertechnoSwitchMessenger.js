/**
 * @licence MIT
 * @licence http://opensource.org/licenses/MIT MIT
 * @copyright 2015 Smart Home Technology GmbH, smart-home-technology.ch
 * @author An adorable space cat
 * @version 1.0.0 2016-04-07
 */

var IntertechnoSwitchMessenger = (function () {

    var ISM = {};

    /*************************
     * Constants
     */

    ISM.PASSWORD_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoqprstuvwxyz0123456789*#";
    ISM.PASSWORD_NUMBERS = "1234";
    ISM.WHEEL_LETTERS = "ABCDEFGHIJLKMNOP";
    ISM.WHEEL_NUMBERS = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];
    ISM.LEARN_NUMBERS = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];

    /**
     * Codewheel type
     * @type {string}
     */
    ISM.CODE_TYPE_WHEEL = 'wheel';

    /**
     * Learncode type
     * @type {string}
     */
    ISM.CODE_TYPE_LEARN = 'learn';


    /**
     * Base64 alphabet
     * @private
     * @type {string}
     */
    var BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*#";


    /**************************
     * Helper functions
     */

    function toBase64(i){
        return BASE64[i];
    }

    function twoDigitNumberString(number){
        number = parseInt(number);
        if (number < 10){
            return '0' + number;
        }
        return number;
    }

    /**
     * Create a new Module object
     * @param type
     * @param code
     * @constructor
     */
    ISM.Module = function(type){
        if (typeof type == "undefined"){
            this.type = ISM.CODE_TYPE_WHEEL;
        } else {
            this.type = type;
        }

        this.learnNumber = "1";
        this.wheelLetter = "A";
        this.wheelNumber = "1";
    };


    /**
     * Create a new Timer object
     * @param module
     * @constructor
     */
    ISM.Timer = function(module){
        this.module = module;
        this.onTime = false;
        this.offTime = false;
        this.repeat = false;
        this.randomize = false;

        // time enabled for these weekdays starting with monday (=0)
        this.weekdays = [false,false,false,false,false,false,false];

        this.setModule = function(m){
            this.module = m;
            return this;
        };
        this.disableOn = function(){
            this.onTime = false;
            return this;
        };
        this.setOn = function(hour, min){
            this.onTime = {
                hour: parseInt(hour),
                min: parseInt(min)
            };
            return this;
        };
        this.disableOff = function(){
            this.offTime = false;
            return this;
        };
        this.setOff = function(hour, min){
            this.offTime = {
                hour: parseInt(hour),
                min: parseInt(min)
            };
            return this;
        };
        this.weekday = function(day,enabled){
            if (typeof enabled == 'undefined'){
                return this.weekdays[day];
            }
            this.weekdays[day] = !!enabled;
            return this;
        };


        this.stringify = function(){

            var code, on, off, opt1, opt2;

            // set target code
            switch(module.type){
                case ISM.CODE_TYPE_WHEEL:
                    code = module.wheelLetter + twoDigitNumberString(module.wheelNumber);
                    break;

                case ISM.CODE_TYPE_LEARN:
                    code = twoDigitNumberString(module.learnNumber) + '*';
                    break;

                default:
                    console.error('invalid module type');
                    return null;
            }

            // set on time
            if (this.onTime){
                on = toBase64(this.onTime.hour) + toBase64(this.onTime.min);
            } else {
                on = '**';
            }

            // set off time
            if (this.offTime){
                off = toBase64(this.offTime.hour) + toBase64(this.offTime.min);
            } else {
                off = '**';
            }

            // options...

            opt1 = toBase64(
                        (this.randomize ? 4 : 0) |
                        (this.repeat  ? 2 : 0) |
                        (this.weekdays[0] ? 1 : 0)
            );
            opt2 = toBase64(
                        (this.weekdays[1] ? 32 : 0) |
                        (this.weekdays[2] ? 16 : 0) |
                        (this.weekdays[3] ? 8 : 0) |
                        (this.weekdays[4] ? 4 : 0) |
                        (this.weekdays[5] ? 2 : 0) |
                        (this.weekdays[6] ? 1 : 0)
            );

            return code + on + off + opt1 + opt2;
        };
    }; // Timer


    /**
     *
     * @type {{on: IntertechnoSwitchMessenger.Command.on, off: IntertechnoSwitchMessenger.Command.off, dim: IntertechnoSwitchMessenger.Command.dim, timers: IntertechnoSwitchMessenger.Command.timers, callback: IntertechnoSwitchMessenger.Command.callback}}
     */
    ISM.Command = {
        on: function(module, learncode) {

            if (module.type === ISM.CODE_TYPE_LEARN && typeof learncode == "undefined"){
                console.error("Invalid arguments:",module,learncode);
                return null;
            }
            switch(module.type){
                case ISM.CODE_TYPE_WHEEL:
                    return module.wheelLetter + twoDigitNumberString(module.wheelNumber) + "+ON";
                case ISM.CODE_TYPE_LEARN:
                    return learncode + "+" + twoDigitNumberString(module.learnNumber) + "+ON";
            }
        },
        off: function(module, learncode) {

            if (module.type === ISM.CODE_TYPE_LEARN && typeof learncode == "undefined"){
                console.error("Invalid arguments:",module,learncode);
                return null;
            }
            switch(module.type){
                case ISM.CODE_TYPE_WHEEL:
                    return module.wheelLetter + twoDigitNumberString(module.wheelNumber) + "+OFF";
                case ISM.CODE_TYPE_LEARN:
                    return learncode + "+" + twoDigitNumberString(module.learnNumber) + "+OFF";
            }
        },
        dim: function(module, learncode, dimLevel) {

            // can only dim learncode types
            if (module.type !== ISM.CODE_TYPE_LEARN || typeof learncode == "undefined"){
                console.error("Invalid arguments:",module,learncode);
                return null;
            }
            if (dimLevel < 0 || 15 < dimLevel){
                console.error('dimlevel must be in [10,15]');
                return null;
            }
            return learncode + "+" + twoDigitNumberString(module.learnNumber) + "+" + twoDigitNumberString(dimLevel);
        },
        timers: function (timers, learncode, nowDate) {

            if (timers.length > 15){
                console.error("Can not have more than 15 timers!");
                return null;
            }
            if (typeof learncode == "undefined" || typeof nowDate == "undefined"){

                console.error("Invalid arguments:", learncode, nowDate);
                return null;
            }

            var parts = [];


            for (var t = 0; t < timers.length; t++) {
                parts.push(timers[t].stringify());
            }
            while(parts.length < 15){
                parts.push('*********');
            }

            return "?" + learncode + "+" + toBase64((nowDate.getDay() + 6)%7) + toBase64(nowDate.getHours()) + toBase64(nowDate.getMinutes()) + "+" + parts.join("+", parts);
        },
        callback: function(numbers) {
            var callbacks = [];

            if (numbers === false || typeof numbers == "undefined"){
                // do not copy any numbers
            } else {
                if (numbers.length > 3) {
                    console.error("Too many callbacks!", numbers);
                    return null;
                }

                for(var i = 0; i < numbers.length; i++){
                    var n = "+" + numbers[i].replace(" ","");
                    callbacks.push(n + ("********************".substr(0,20-n.length)));
                }
            }

            while(callbacks.length < 3){
                callbacks.push("-********************");
            }

            return "callback" + callbacks.join("");
        }
    };

    return ISM;
}());

