/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _indexConfig = __webpack_require__(1);

	var _indexRun = __webpack_require__(2);

	var _mainMainController = __webpack_require__(3);

	var _componentsCardCardDirective = __webpack_require__(4);

	angular.module('tinderDuGouvernement', ['ngTouch', 'ngSanitize']).config(_indexConfig.config).run(_indexRun.runBlock).directive('card', _componentsCardCardDirective.CardDirective).controller('MainController', _mainMainController.MainController);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	config.$inject = ["$logProvider"];
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.config = config;

	function config($logProvider) {
	    'ngInject';
	    // Enable log
	    $logProvider.debugEnabled(true);
	}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	runBlock.$inject = ["$log"];
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.runBlock = runBlock;

	function runBlock($log) {
	    'ngInject';
	}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var MainController = (function () {
	    MainController.$inject = ["$log", "$scope", "$http", "$timeout"];
	    function MainController($log, $scope, $http, $timeout) {
	        'ngInject';

	        var _this = this;

	        _classCallCheck(this, MainController);

	        this.$timeout = $timeout;
	        this.$scope = $scope;
	        this.$scope.score = 0;
	        this.done = -1;
	        this.$scope.deckSize = 15;

	        this.$scope.itsamatch = null;

	        this.$scope.ending = [];

	        this.congratulations = ['Bravo !', 'Bien joué !', 'En effet !', 'Bien vu !', 'T\'es un-e as !'];

	        $http.get('assets/tsv/all.tsv').then(function (response) {
	            response.data = d3_dsv.tsvParse(response.data, function (d) {
	                return new Object({
	                    ID: +d.ID,
	                    surname: d['Prénom'],
	                    name: d.Nom,
	                    isAWoman: d['H/F'] === 'F',
	                    party: d.Parti.length > 0 ? d.Parti : undefined,
	                    wikipedia: d.Wikipedia,
	                    isPartOf: +d.Gouvernement === 1,
	                    title: d.Poste
	                });
	            });

	            _this.gvt = response.data;
	            _this.deck = [];
	            while (_this.deck.length < _this.$scope.deckSize) {
	                var picked = _.sample(_this.gvt);
	                if (picked.isPartOf || _this.deck.length >= _this.$scope.deckSize / 3) {
	                    _this.deck.push(picked);
	                    _.remove(_this.gvt, picked);
	                }
	            }

	            _this.gvt = response.data;
	            _this.$scope.persons = _this.deck;
	        });

	        this.$scope.isItAMatch = this.isItAMatch.bind(this);
	        this.$scope.isItAOKMatch = this.isItAOKMatch.bind(this);
	        this.$scope.isItAKOMatch = this.isItAKOMatch.bind(this);
	        this.$scope['continue'] = this['continue'].bind(this);
	        this.$scope.getImageSrc = this.getImageSrc.bind(this);
	        this.$scope.getCongratulation = this.getCongratulation.bind(this);
	        this.$scope.formatParty = this.formatParty;
	        this.$scope.ok = this.ok.bind(this);
	        this.$scope.ko = this.ko.bind(this);
	        this.$scope.hasStarted = this.hasStarted.bind(this);
	        this.$scope.hasEnded = this.hasEnded.bind(this);
	        this.$scope.shareOnTwitter = this.shareOnTwitter.bind(this);
	        this.$scope.restart = this.restart;
	    }

	    _createClass(MainController, [{
	        key: 'isItAMatch',
	        value: function isItAMatch() {
	            return this.$scope.itsamatch != null;
	        }
	    }, {
	        key: 'isItAOKMatch',
	        value: function isItAOKMatch() {
	            return this.isItAMatch() && this.$scope.itsamatch.title !== '.';
	        }
	    }, {
	        key: 'isItAKOMatch',
	        value: function isItAKOMatch() {
	            return this.isItAMatch() && !this.isItAOKMatch();
	        }
	    }, {
	        key: 'match',
	        value: function match(_match) {
	            this.$scope.itsamatch = _match;
	        }
	    }, {
	        key: 'continue',
	        value: function _continue() {
	            this.$scope.itsamatch = null;
	        }
	    }, {
	        key: 'getImageSrc',
	        value: function getImageSrc(person) {
	            return person == null ? '' : 'assets/images/' + person.name.toLowerCase().replace(/ /g, '-') + '.jpg';
	        }
	    }, {
	        key: 'getCongratulation',
	        value: function getCongratulation() {
	            return _.sample(this.congratulations);
	        }
	    }, {
	        key: 'formatParty',
	        value: function formatParty(party) {
	            switch (party) {
	                case 'LR':
	                    return 'à Les Républicains';
	                case 'PS':
	                    return 'au Parti socialiste';
	                case 'UDE':
	                    return 'à l\'Union des démocrates et des écologistes';
	                case 'REM':
	                    return 'à La République en marche';
	                case 'PRG':
	                    return 'au Parti radical de gauche';
	                case 'UDI':
	                    return 'à l\'Union des démocrates et indépendants';
	                case 'EELV':
	                    return 'à Europe Écologie Les Verts';
	                case 'MR':
	                    return 'au Mouvement Radical';
	                default:
	                    return 'au ' + party;
	            }
	        }
	    }, {
	        key: 'removeLastPerson',
	        value: function removeLastPerson(ok) {
	            var last = _.last(this.$scope.persons);
	            var label = last.surname + ' ' + last.name;
	            if (last.isPartOf) {
	                label += (last.ok ? ' est bien ' : ' est en fait ') + last.title + '.';
	            } else {
	                label += last.ok ? ' ne fait en effet pas partie du gouvernement.' : ' ne fait pas partie du gouvernement.';
	            }
	            this.$scope.ending.push({
	                ok: last.ok,
	                label: label,
	                wikipedia: last.wikipedia,
	                image: this.getImageSrc(last)
	            });

	            this.$scope.persons = _.dropRight(this.$scope.persons);
	        }
	    }, {
	        key: 'isLastPartOf',
	        value: function isLastPartOf() {
	            return _.last(this.$scope.persons).isPartOf;
	        }
	    }, {
	        key: 'ok',
	        value: function ok() {
	            var _this2 = this;

	            var execute = function execute() {
	                if (_this2.done >= 0) {
	                    if (_this2.isLastPartOf()) {
	                        _this2.match(_.last(_this2.$scope.persons));
	                        ++_this2.$scope.score;
	                    }
	                    _.last(_this2.$scope.persons).ok = _this2.isLastPartOf();
	                    _this2.removeLastPerson();
	                }
	                ++_this2.done;
	            };

	            if (this.done >= 0) {
	                this.$scope.$broadcast('card-ok', _.last(this.$scope.persons).ID);
	                this.$timeout(execute.bind(this), 500);
	            } else {
	                execute();
	            }
	        }
	    }, {
	        key: 'ko',
	        value: function ko() {
	            var _this3 = this;

	            var execute = function execute() {
	                if (_this3.done >= 0) {
	                    if (!_this3.isLastPartOf()) {
	                        _this3.match(_.last(_this3.$scope.persons));
	                        ++_this3.$scope.score;
	                    }
	                    _.last(_this3.$scope.persons).ok = !_this3.isLastPartOf();
	                    _this3.removeLastPerson();
	                }
	                ++_this3.done;
	            };

	            if (this.done >= 0) {
	                this.$scope.$broadcast('card-ko', _.last(this.$scope.persons).ID);
	                this.$timeout(execute.bind(this), 500);
	            } else {
	                execute();
	            }
	        }
	    }, {
	        key: 'hasStarted',
	        value: function hasStarted() {
	            return this.done >= 0;
	        }
	    }, {
	        key: 'hasEnded',
	        value: function hasEnded() {
	            return this.done >= this.$scope.deckSize;
	        }
	    }, {
	        key: 'shareOnTwitter',
	        value: function shareOnTwitter() {
	            var text = 'J\'ai fait ' + this.$scope.score + '/' + this.$scope.deckSize + ' au Tinder du Gouvernement ! Tu pense pouvoir me battre ? ' + window.location.href + ' via @pauljoannon';
	            window.open('https://twitter.com/intent/tweet?original_referer=&text=' + encodeURIComponent(text), '', 'width=575,height=400,menubar=no,toolbar=no');
	        }
	    }, {
	        key: 'restart',
	        value: function restart() {
	            window.location.reload();
	        }
	    }]);

	    return MainController;
	})();

	exports.MainController = MainController;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	exports.CardDirective = CardDirective;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function CardDirective() {
	    'ngInject';

	    var directive = {
	        restrict: 'E',
	        templateUrl: 'app/components/card/card.html',
	        scope: {
	            person: '=person'
	        },
	        controller: CardController,
	        controllerAs: 'CardController',
	        bindToController: true
	    };

	    return directive;
	}

	var CardController = (function () {
	    CardController.$inject = ["$log", "$scope"];
	    function CardController($log, $scope) {
	        'ngInject';

	        var _this = this;

	        _classCallCheck(this, CardController);

	        this.move = 0;

	        this.$scope = $scope;

	        this.$scope.label = this.person.surname + ' ' + this.person.name;

	        this.$scope.getTransform = this.getTransform.bind(this);
	        this.$scope.getPicture = this.getPicture.bind(this);

	        this.$scope.$on('card-ok', function (ev, id) {
	            if (_this.person.ID === id) {
	                _this.move = 1;
	            }
	        });

	        this.$scope.$on('card-ko', function (ev, id) {
	            if (_this.person.ID === id) {
	                _this.move = -1;
	            }
	        });
	    }

	    _createClass(CardController, [{
	        key: 'getTransform',
	        value: function getTransform() {
	            return this.move !== 0 ? {
	                transform: 'translateX(' + 3000 * this.move + 'px)',
	                transition: 'transform 500ms ease'
	            } : {};
	        }
	    }, {
	        key: 'getPicture',
	        value: function getPicture() {
	            return {
	                'background-image': 'url(' + this.$scope.$parent.getImageSrc(this.person) + ')'
	            };
	        }
	    }]);

	    return CardController;
	})();

/***/ })
/******/ ]);
angular.module("tinderDuGouvernement").run(["$templateCache", function($templateCache) {$templateCache.put("app/components/card/card.html","<div ng-style=\"getTransform()\" class=\"card\"><div ng-style=\"getPicture()\" class=\"card__picture\"></div><div class=\"card__name\">{{ label }}</div></div>");}]);