// libs needed
import React from 'react';
import {ftmToWei} from '../lib/units';
import {GQL_MUTATE_TRANSACTION} from "../schema/queries";

// static content
import spinner from '../images/cogs_spinner.svg';

// Constants used to calculate how many FTMs to send in a single transaction
const FTM_MIN_TO_SEND = 0.20;
const FTM_MAX_TO_SEND = 3.0;
const FTM_STEP_TO_SEND = 0.1;
const WAIT_FOR_TRANSFER = 1100;
const RESERVED_FEE_WEI = 10000000000000000; /* 0.01 FTM */

// prep the transaction sender component
class TxSender extends React.Component {
    // construct the component
    constructor(props) {
        // init parent
        super(props);

        // how much we want to  send?
        const amount = this.getRandomAmount();

        // set the state
        this.state = {
            isSending: false,
            isError: false,
            amount: amount,
            canSend: this.canSend(props.pair.one, amount)
        };
    }

    // update source account's balance information
    updateSourceBalance = (balance) => {
        // use the new balance
        this.props.pair.one.balance = balance;

        // mark as send just started
        this.setState({
            canSend: this.canSend(this.props.pair.one, this.state.amount)
        });
    };

    // get random amount to be used for the next transfer
    getRandomAmount() {
        return FTM_MIN_TO_SEND + (Math.round(Math.random() * ((FTM_MAX_TO_SEND - FTM_MIN_TO_SEND) / FTM_STEP_TO_SEND)) * FTM_STEP_TO_SEND);
    }

    // verify if the transaction is possible
    canSend(account, amount) {
        return 0.0 < (account.balance - ftmToWei(amount) - RESERVED_FEE_WEI);
    }

    // finish the transaction loop
    doneSending = () => {
        // get new amount for the next transaction
        const nextAmount = this.getRandomAmount();

        // mark as send just started
        this.setState({
            isSending: false,
            amount: nextAmount,
            canSend: this.canSend(this.props.pair.one, nextAmount)
        });
    };

    // send new transaction
    doSend = () => {
        if (!this.state.isSending) {
            // mark as send just started
            this.setState({isSending: true});

            // do the sending
            this.props.client.mutate({
                mutation: GQL_MUTATE_TRANSACTION,
                variables: {
                    from: this.props.pair.one.id,
                    to: this.props.pair.two.id,
                    amount: ftmToWei(this.state.amount).toString(10)
                },
                fetchPolicy: "no-cache"
            }).then(({data}) => {
                // process the transaction we just sent
                setTimeout(() => {
                    // mark the transaction as finished
                    this.doneSending();
                }, WAIT_FOR_TRANSFER);

                // propagate the transaction
                this.props.onTransaction(data.transfer);
            }).catch(() => {
                // set error state
                this.setState({isSending: false, isError: true});
            });
        }
    };

    // render the component
    render() {
        return (
            <div id="tr-actions" className={this.state.isSending ? 'fr-button-group fr-actions fr-is-sending' : 'fr-button-group fr-actions'}>
                <button className="fr-button" onClick={this.doSend} disabled={!this.state.canSend}>Send <span className="fr-amount">{this.state.amount.toFixed(2)} FTM</span></button>
                <div className="fr-spinner-container">
                    <img className="fr-spinner" src={spinner} alt="The network is processing your transfer." aria-label="Processing"/>
                </div>
            </div>
        );
    }
}

export default TxSender;
