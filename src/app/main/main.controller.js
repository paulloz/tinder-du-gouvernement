export class MainController {
    constructor ($log, $scope, $http, $timeout) {
        'ngInject';

        this.$timeout = $timeout;
        this.$scope = $scope;
        this.$scope.score = 0;
        this.done = -1;
        this.$scope.deckSize = 15;

        this.$scope.itsamatch = null;

        this.$scope.ending = [];

        $http.get('assets/tsv/all.tsv').then(response => {
            let gvt = [];
            response.data = d3_dsv.tsvParse(response.data, d => new Object({
                ID : +d.ID,
                surname : d['Prénom'],
                name : d.Nom,
                isPartOf : +d.Gouvernement === 1,
                title : d.Poste
            }));

            this.gvt = response.data;
            this.deck = _.shuffle(_.sampleSize(response.data, this.$scope.deckSize));
            this.$scope.persons = this.deck;
        });

        this.$scope.isItAMatch = this.isItAMatch.bind(this);
        this.$scope.isItAOKMatch = this.isItAOKMatch.bind(this);
        this.$scope.isItAKOMatch = this.isItAKOMatch.bind(this);
        this.$scope.continue = this.continue.bind(this);
        this.$scope.getImageSrc = this.getImageSrc.bind(this);
        this.$scope.getCongratulation = this.getCongratulation.bind(this);
        this.$scope.ok = this.ok.bind(this);
        this.$scope.ko = this.ko.bind(this);
        this.$scope.hasStarted = this.hasStarted.bind(this);
        this.$scope.hasEnded = this.hasEnded.bind(this);
        this.$scope.shareOnTwitter = this.shareOnTwitter.bind(this);
        this.$scope.restart = this.restart;
    }

    isItAMatch() {
        return this.$scope.itsamatch != null;
    }

    isItAOKMatch() {
    }

    isItAKOMatch() {
        return this.isItAMatch() && !this.isItAOKMatch();
    }

    match(match) {
        this.$scope.itsamatch = match;
    }

    continue() {
        this.$scope.itsamatch = null;
    }

    getImageSrc(person) {
        return person == null
            ? ''
            : `assets/images/${person.name.toLowerCase().replace(/ /g, '-')}.jpg`;
    }

    getCongratulation() {
        return _.sample(['Bravo !', 'Bien joué !', 'En effet !', 'Bien vu !', 'T\'es un-e as !']);
    }

    removeLastPerson(ok) {
        const last = _.last(this.$scope.persons);
        let label = `${last.surname} ${last.name}`;
        if (last.isPartOf) {
            label += (last.ok ? ' est bien ' : ' est en fait ') + last.title + '.';
        } else {
            label += last.ok ? ' ne fait en effet pas partie du gouvernement.' : ' ne fait pas partie du gouvernement.';
        }
        this.$scope.ending.push({
            ok : last.ok,
            label : label,
            image : this.getImageSrc(last)
        });

        this.$scope.persons = _.dropRight(this.$scope.persons);
    }

    isLastPartOf() {
        return _.last(this.$scope.persons).isPartOf;
    }

    ok() {
        const execute = () => {
            if (this.done >= 0) {
                if (this.isLastPartOf()) {
                    this.match(_.last(this.$scope.persons));
                    ++this.$scope.score;
                }
                _.last(this.$scope.persons).ok = this.isLastPartOf();
                this.removeLastPerson();
            }
            ++this.done;
        }

        if (this.done >= 0) {
            this.$scope.$broadcast('card-ok', _.last(this.$scope.persons).ID);
            this.$timeout(execute.bind(this), 500);
        } else {
            execute();
        }
    }

    ko() {
        const execute = () => {
            if (this.done >= 0) {
                if (!this.isLastPartOf()) {
                    this.match(_.last(this.$scope.persons));
                    ++this.$scope.score;
                }
                _.last(this.$scope.persons).ok = !this.isLastPartOf();
                this.removeLastPerson();
            }
            ++this.done;
        }

        if (this.done >= 0) {
            this.$scope.$broadcast('card-ko', _.last(this.$scope.persons).ID);
            this.$timeout(execute.bind(this), 500);
        } else {
            execute();
        }
    }

    hasStarted() {
        return this.done >= 0;
    }

    hasEnded() {
        return this.done >= this.$scope.deckSize;
    }

    shareOnTwitter() {
        const text = `J'ai fait ${this.$scope.score}/${this.$scope.deckSize} au Tinder du Gouvernement ! Tu pense pouvoir me battre ? ${window.location.href} via @pauljoannon`;
        window.open(
            `https://twitter.com/intent/tweet?original_referer=&text=${encodeURIComponent(text)}`,
            '',
            'width=575,height=400,menubar=no,toolbar=no'
        );
    }

    restart() {
        window.location.reload();
    }
}
