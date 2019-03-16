import {Component, Input, OnChanges} from '@angular/core';
import {ISession} from '../shared';
import {AuthService} from '../../user/auth.service';
import {VoterService} from './voter.service';

@Component({
    selector: 'session-list',
    templateUrl: './session-list.component.html',
    styleUrls: []
})
export class SessionListComponent implements OnChanges {
    @Input() sessions: ISession[];
    @Input() filterBy: string;
    @Input() sortBy: string;
    visibleSessions: ISession[] = [];

    constructor(private auth: AuthService, private voterService: VoterService) {

    }

    ngOnChanges(): void {
        if (this.sessions) {
            this.filterSessions(this.filterBy);
            this.sortBy === 'name' ?
                this.visibleSessions.sort(this.sortByNameAsc) :
                this.visibleSessions.sort(this.sortByNameDesc);
        }
    }

    toggleVote(session: ISession): void {
        this.userHasVoted(session) ?
            this.voterService.deleteVoter(session, this.auth.currentUser.userName) :
            this.voterService.addVoter(session, this.auth.currentUser.userName);
        if (this.sortBy === 'votes') {
            this.visibleSessions.sort(this.sortByNameDesc);
        }
    }

    userHasVoted(session: ISession): boolean {
        return this.voterService.userHasVoted(session, this.auth.currentUser.userName);
    }

    filterSessions(filter: string): void {
        if (filter === 'all') {
            this.visibleSessions = this.sessions.slice(0);
        } else {
            this.visibleSessions = this.sessions
                .filter((s: ISession) => s.level.toLocaleLowerCase() === filter);
        }
    }

    private sortByNameAsc(s1: ISession, s2: ISession): number {
        if (s1.name > s2.name) {
            return 1;
        } else if (s1.name === s2.name) {
            return 0;
        } else {
            return -1;
        }
    }

    private sortByNameDesc(s1: ISession, s2: ISession): number {
        return s2.voters.length - s1.voters.length;
    }
}
