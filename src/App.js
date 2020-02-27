// libs needed
import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GQL_QUERY_ACCOUNT_PAIR} from './schema/queries';
import {weiToFtm} from "./lib/units";

// components used
import Header from './components/header';
import Footer from './components/footer';
// import SocMedia from './components/soc_media';
import Accounts from './components/accounts';
import TxSender from './components/sender';
import TxTable from './components/tx_table';

// static content to be used
import './style/App.css';

// define the application itself
const App = (props) => {
    // get an account pair data from remote server
    const {loading, error, data} = useQuery(GQL_QUERY_ACCOUNT_PAIR);

    // show loading memo
    if (loading) return (<h1>Loading the application ...</h1>);

    // show error message
    if (error) return (<h1>Loading failed, application API not available! :(</h1>);

    // switch accounts if right has more tokens
    if (weiToFtm(data.pair.one.balance) < weiToFtm(data.pair.two.balance)) {
        data.pair = {
            one: {...data.pair.two},
            two: {...data.pair.one}
        };
    }

    // we will need a reference to the TxTable so we can push new transactions to it
    const txTableRef = React.createRef();
    const onTransaction = (tx) => {
        txTableRef.current.addTransaction(tx);
    };

    // we will need a reference to the Accounts so we can inform sender about changed balance
    const senderRef = React.createRef();
    const onBalanceChanged = (balance) => {
        senderRef.current.updateSourceBalance(balance);
    };

    // return the full app render
    return (
        <div className="fr-app">
            <Header/>

            <main className="fr-content">
                <div className="fr-content-pane">
                    {/* Render the loaded pair of accounts */}
                    <Accounts pair={data.pair} client={props.client} onSourceBalanceChanged={onBalanceChanged}/>

                    {/* Now render the Tx Sender */}
                    <TxSender ref={senderRef} pair={data.pair} client={props.client} onTransaction={onTransaction}/>

                    {/* Now render the list of transactions already sent */}
                    <TxTable ref={txTableRef}/>
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default App;
