// libs needed
import React from 'react';
import Moment from 'moment';
import {formatWeiToFtm} from '../lib/units';

// link to external explorer
const EXPLORER_LINK = "https://fantom.rocks/explorer/tx/";
const TIME_UPDATE_TICK = 1000;
const TIME_RANGE_THRESHOLD_SEC = 2;

// prep the accounts pair component
class TxTable extends React.Component {
    // construct the component
    constructor(props) {
        // init parent
        super(props);

        // set the state
        this.state = {
            list: [],
            now: Moment.now()
        };
    }

    // add new transaction to the list
    addTransaction = (tx) => {
        // parse the timestamp so we don't have to do it on every render
        tx.when = Moment(tx.timeStamp);
        tx.threshold = Moment().add(TIME_RANGE_THRESHOLD_SEC, 's');

        // make a new list and set it to state
        const list = this.state.list.slice();
        list.unshift(tx);

        this.setState({list: list});
    };

    // start the table update ticks
    componentDidMount() {
        this.tickTimer = setInterval(
            () => this.tick(),
            TIME_UPDATE_TICK
        );
    }

    // stop the table update ticks
    componentWillUnmount() {
        clearInterval(this.tickTimer);
    }

    // update tick and ask the table to re-render
    tick() {
        this.setState({
            now: Moment.now()
        });
    }

    // render empty table content
    hasNoTransactions() {
        return (
            <tr>
                <td>&nbsp;</td><td colSpan="5" className="fr-no-tx">You don't have any transactions yet ...</td>
            </tr>
        );
    }

    // render transactions list content
    hasTransactions() {
        const now = Moment();

        // render
        return this.state.list.map((tx, ix) => (
            <tr className={(0 === ix) ? "fr-is-new" : ""}>
                <td className="fr-status">
                    <div className="fr-badge"><a href={EXPLORER_LINK + tx.id} target="_blank" rel="noreferrer noopener"><i className="fas fa-check-circle fa-2x"/></a></div>
                </td>
                <td className="fr-time"><a href={EXPLORER_LINK + tx.id} target="_blank" rel="noreferrer noopener">{(now.isBefore(tx.threshold) ? "now" : tx.when.fromNow())}</a></td>
                <td className="fr-amount">{formatWeiToFtm(tx.amount)}</td>
                <td className="fr-account-name fr-from">{tx.from.name}</td>
                <td className="fr-account-name fr-to">{tx.to.name}</td>
                <td className="fr-tx"><span><a href={EXPLORER_LINK + tx.id} target="_blank" rel="noreferrer noopener">{tx.id.substring(0, 35)}...</a></span></td>
            </tr>
        ));
    }

    // render the component
    render() {
        return (
            <div className="fr-transactions">
                <table>
                    <thead>
                    <tr>
                        <th className="fr-status">&nbsp;</th>
                        <th className="fr-time">Created</th>
                        <th className="fr-amount">Amount</th>
                        <th className="fr-account-name fr-from">From</th>
                        <th className="fr-account-name fr-to">To</th>
                        <th className="fr-tx">TX Hash</th>
                    </tr>
                    </thead>
                    <tbody>
                    {0 < this.state.list.length ? this.hasTransactions() : this.hasNoTransactions()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TxTable;
