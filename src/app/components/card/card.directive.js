export function CardDirective() {
    'ngInject';

    const directive = {
        restrict : 'E',
        templateUrl : 'app/components/card/card.html',
        scope : {
            person : '=person'
        },
        controller : CardController,
        controllerAs : 'CardController',
        bindToController : true
    };

    return directive;
}

class CardController {
    constructor($log, $scope) {
        'ngInject';

        this.move = 0;

        this.$scope = $scope;

        this.$scope.label = `${this.person.surname} ${this.person.name}`;

        this.$scope.getTransform = this.getTransform.bind(this);
        this.$scope.getPicture = this.getPicture.bind(this);

        this.$scope.$on('card-ok', (ev, id) => {
            if (this.person.ID === id) { this.move = 1; }
        });

        this.$scope.$on('card-ko', (ev, id) => {
            if (this.person.ID === id) { this.move = -1; }
        });
    }

    getTransform() {
        return this.move !== 0 ? {
            transform : `translateX(${3000 * this.move}px)`,
            transition : 'transform 500ms ease'
        } : { };
    }

    getPicture() {
        return {
            'background-image': `url(${this.$scope.$parent.getImageSrc(this.person)})`
        };
    }
}
