import { config } from './index.config';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { CardDirective } from './components/card/card.directive';

angular.module('tinderDuGouvernement', ['ngTouch', 'ngSanitize'])
    .config(config)
    .run(runBlock)
    .directive('card', CardDirective)
    .controller('MainController', MainController);
