// libs needed
import React from 'react';
import {GQL_QUERY_ACCOUNTS_BALANCE} from '../schema/queries';
import {formatWeiToFtm} from '../lib/units';

// some control constants
const BALANCE_POLL_INTERVAL = 200;

// prep the accounts pair component
class Accounts extends React.Component {
    // construct the component
    constructor(props) {
        // init parent
        super(props);

        // set the state
        this.state = {
            ...props.pair,
        };
    }

    // start the component internals
    componentDidMount() {
        this.startBalancePoll();
    }

    // cleanup the component internals before removing
    componentWillUnmount() {
        this.stopBalancePoll();
    }

    // start poll for the account balance
    startBalancePoll() {
        // do not start the timer again if already running; may not be needed
        if (!this.pollTimer) {
            // poll every N milliseconds from remote server
            this.pollTimer = setInterval(() => {
                this.props.client.query({
                    query: GQL_QUERY_ACCOUNTS_BALANCE,
                    variables: {
                        list: [this.state.one.id, this.state.two.id]
                    },
                    fetchPolicy: "no-cache"
                }).then(({data}) => {
                    // update balances as polled
                    this.updateBalance(data.accounts);
                });
            }, BALANCE_POLL_INTERVAL);
        }
    }

    // stop poll for account balance
    stopBalancePoll() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }

    // update balance on accounts and set the new state
    updateBalance(accounts) {
        // make a new pair instead of mutating the existing one
        const newPair = {
            one: {...this.state.one},
            two: {...this.state.two}
        };

        // propagate new balances to the new pair
        accounts.forEach(acc => {
            Object.keys(newPair).forEach(key => {
                if (acc.id === newPair[key].id) {
                    newPair[key].balance = acc.balance;
                }
            });
        });

        // propagate source balance change if needed
        if (newPair.one.balance !== this.state.one.balance) {
            this.props.onSourceBalanceChanged(newPair.one.balance);
        }

        // do we need to change the state?
        if ((newPair.one.balance !== this.state.one.balance) || (newPair.two.balance !== this.state.two.balance)) {
            this.setState(newPair);
        }
    }

    // render the component
    render() {
        return (
            <div className="fr-accounts">
                <div className="fr-account">
                    <div className="fr-account-name">
                        <h4>{this.state.one.name}</h4>
                        <div className="fr-address">{this.state.one.address}</div>
                    </div>
                    <div className="fr-amount">
                        <span className="fr-val">{formatWeiToFtm(this.state.one.balance)}</span><span className="fr-unit">FTM</span>
                    </div>
                </div>

                <div className="fr-account">
                    <div className="fr-account-name">
                        <h4>{this.state.two.name}</h4>
                        <div className="fr-address">{this.state.two.address}</div>
                    </div>
                    <div className="fr-amount">
                        <span className="fr-val">{formatWeiToFtm(this.state.two.balance)}</span><span className="fr-unit">FTM</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Accounts;
