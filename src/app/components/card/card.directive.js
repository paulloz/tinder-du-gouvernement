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

        $scope.label = `${this.person.surname} ${this.person.name}`;

        $scope.getTransform = this.getTransform.bind(this);
        $scope.getPicture = this.getPicture.bind(this);

        $scope.$on('card-ok', (ev, id) => {
            if (this.person.ID === id) { this.move = 1; }
        });

        $scope.$on('card-ko', (ev, id) => {
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
        const slug = this.person.name.toLowerCase().replace(/ /g, '-');

        return {
            'background-image': `url(assets/images/${slug}.jpg)`
        };
    }
}
