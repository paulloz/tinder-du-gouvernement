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

        this.congratulations = ['Bravo !', 'Bien joué !', 'En effet !', 'Bien vu !', 'T\'es un-e as !'];

        $http.get('assets/tsv/all.tsv').then(response => {
            response.data = d3_dsv.tsvParse(response.data, d => new Object({
                ID : +d.ID,
                surname : d['Prénom'],
                name : d.Nom,
                isAWoman : d['H/F'] === 'F',
                party : d.Parti.length > 0 ? d.Parti : undefined,
                wikipedia : d.Wikipedia,
                isPartOf : +d.Gouvernement === 1,
                title : d.Poste
            }));

            this.gvt = response.data;
            this.deck = [];
            while (this.deck.length < this.$scope.deckSize)
            {
                let picked = _.sample(this.gvt);
                if (picked.isPartOf || this.deck.length >= this.$scope.deckSize / 3)
                {
                    this.deck.push(picked);
                    _.remove(this.gvt, picked);
                }
            }

            this.gvt = response.data;
            this.$scope.persons = this.deck;
        });

        this.$scope.isItAMatch = this.isItAMatch.bind(this);
        this.$scope.isItAOKMatch = this.isItAOKMatch.bind(this);
        this.$scope.isItAKOMatch = this.isItAKOMatch.bind(this);
        this.$scope.continue = this.continue.bind(this);
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

    isItAMatch() {
        return this.$scope.itsamatch != null;
    }

    isItAOKMatch() {
        return this.isItAMatch() && this.$scope.itsamatch.title !== '.';
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
        return _.sample(this.congratulations);
    }

    formatParty(party) {
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
            case 'PRV':
                return 'au Parti radical';
            case 'UDI':
                return 'à l\'Union des démocrates et indépendants';
            case 'EELV':
                return 'à Europe Écologie Les Verts';
            case 'MR':
                return 'au Mouvement Radical';
            case 'TDP':
                return 'à Territoires de progrès';
            case 'HOR':
                return 'à Horizons';
            default:
                return `au ${party}`;
        }
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
            wikipedia : last.wikipedia,
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
